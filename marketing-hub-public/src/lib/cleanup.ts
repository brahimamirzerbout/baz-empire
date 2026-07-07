/**
 * Process cleanup — ensure SQLite is flushed and closed on shutdown.
 * Prevents WAL corruption if the process is killed unexpectedly.
 */
import { db } from "./db";

let cleaned = false;

function cleanup() {
  if (cleaned) return;
  cleaned = true;
  try {
    db.pragma("wal_checkpoint(TRUNCATE)");
    db.close();
  } catch {
    // already closed or error — ignore
  }
}

// Handle all common termination signals
process.on("SIGTERM", cleanup);
process.on("SIGINT", cleanup);
process.on("beforeExit", cleanup);
process.on("exit", cleanup);
