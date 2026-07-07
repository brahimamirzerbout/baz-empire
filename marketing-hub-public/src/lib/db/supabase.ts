/**
 * Supabase / PostgreSQL sync adapter using Worker Threads.
 *
 * Uses a worker thread + Atomics.wait to execute async pg queries
 * synchronously in the main thread. This is the same pattern
 * better-sqlite3 uses internally (native thread for sync I/O).
 *
 * Interface matches better-sqlite3:
 *   db.prepare(sql).get(...params)  → row | undefined
 *   db.prepare(sql).all(...params)  → row[]
 *   db.prepare(sql).run(...params)  → { changes, lastInsertRowid }
 *   db.exec(sql)                    → void
 */

import { Worker } from "worker_threads";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SUPABASE_URL = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL || "";
const IS_BUILDING = process.env.NEXT_PHASE === "phase-production-build";

let worker: Worker | null = null;
let msgId = 0;

function getWorker(): Worker {
  if (IS_BUILDING) throw new Error("[supabase] skip during build");
  if (!worker && SUPABASE_URL) {
    const workerPath = path.join(process.cwd(), "src", "lib", "db", "pg-worker.js");
    worker = new Worker(workerPath, {
      workerData: { connectionString: SUPABASE_URL },
    });
    worker.on("error", () => { worker = null; });
  }
  if (!worker) throw new Error("No database worker configured");
  return worker;
}

// Shared buffer for sync communication: 4 bytes for signal, rest for data
const BUF_SIZE = 16 * 1024 * 1024; // 16MB max result size

function querySync(sql: string, params?: unknown[]): { rows: Record<string, unknown>[]; rowCount: number } {
  if (IS_BUILDING) return { rows: [], rowCount: 0 };

  const id = ++msgId;
  const sharedBuffer = new SharedArrayBuffer(BUF_SIZE);
  const signal = new Int32Array(sharedBuffer, 0, 1);
  signal[0] = 0; // 0 = pending, 1 = done, 2 = error

  const w = getWorker();
  w.postMessage({ id, sql, params, sharedBuffer }, [sharedBuffer]);

  // Block main thread until worker signals completion
  // timeout after 30 seconds
  const start = Date.now();
  while (signal[0] === 0) {
    const elapsed = Date.now() - start;
    if (elapsed > 30000) throw new Error("Database query timeout (30s)");
    Atomics.wait(signal, 0, 0, 1000); // wait up to 1s, then check timeout
  }

  // Read result from buffer
  const dataView = new Uint8Array(sharedBuffer, 4);
  const jsonStr = Buffer.from(dataView).toString("utf8", 0, 
    new Int32Array(sharedBuffer, 0, 2)[1] // length stored at offset 4
  );

  if (signal[0] === 2) {
    throw new Error(jsonStr);
  }

  return JSON.parse(jsonStr);
}

// Convert SQLite ? placeholders to PostgreSQL $1, $2, etc.
function toPgPlaceholders(sql: string): string {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

interface PrepResult {
  changes: number;
  lastInsertRowid: string | number;
}

class PreparedStatement {
  constructor(private sql: string) {}

  get(...params: unknown[]): Record<string, unknown> | undefined {
    const res = querySync(toPgPlaceholders(this.sql), params);
    return res.rows[0];
  }

  all(...params: unknown[]): Record<string, unknown>[] {
    const res = querySync(toPgPlaceholders(this.sql), params);
    return res.rows;
  }

  run(...params: unknown[]): PrepResult {
    const res = querySync(toPgPlaceholders(this.sql), params);
    return {
      changes: res.rowCount,
      lastInsertRowid: res.rows[0]?.id ?? 0,
    };
  }
}

class SupabaseDB {
  prepare(sql: string): PreparedStatement {
    return new PreparedStatement(sql);
  }

  exec(sql: string): void {
    if (IS_BUILDING) return;
    const statements = sql
      .split(/;(?=(?:[^']*'[^']*')*[^']*$)/)
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);

    for (const stmt of statements) {
      try {
        querySync(stmt);
      } catch (e: unknown) {
        const msg = (e as Error).message || "";
        if (!msg.includes("already exists") && !msg.includes("duplicate")) {
          console.error("[supabase] exec error:", msg.slice(0, 200));
        }
      }
    }
  }

  pragma(): void {}
  close(): void { worker?.terminate().catch(() => {}); }
}

export function isSupabaseEnabled(): boolean {
  return !!SUPABASE_URL && !IS_BUILDING;
}

export function createSupabaseDB(): SupabaseDB {
  return new SupabaseDB();
}

export { SupabaseDB };