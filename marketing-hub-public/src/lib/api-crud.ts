/**
 * Generic CRUD route factory. Reduces ~50 lines per route to a single call.
 *
 * Usage:
 *   import { makeCrud } from "@/lib/api-crud";
 *   export const { GET, POST } = makeCrud({
 *     table: "ideas",
 *     required: ["title", "description", "category"],
 *     jsonFields: [],  // fields that should be stored/returned as JSON
 *   });
 */
import { NextRequest } from "next/server";
import { json, err, readJson, listRows, getRow } from "@/lib/api-helpers";
import { db, uid, now } from "@/lib/db";
import { requireUser } from "@/lib/admin";

type RouteContext = { params?: Record<string, string | undefined> };

type Opts = {
  table: string;
  required: string[];
  /** fields stored as JSON.stringify in DB and JSON.parsed on read */
  jsonFields?: string[];
  /** fields auto-managed (don't accept from body) */
  skipFields?: string[];
};

function safeJsonParse(v: unknown): unknown {
  if (typeof v !== "string") return v;
  if (v.startsWith("[") || v.startsWith("{")) {
    try {
      return JSON.parse(v);
    } catch {
      // not valid JSON — leave as string
    }
  }
  return v;
}

export function makeCrud(opts: Opts) {
  const { table, required, jsonFields = [], skipFields = [] } = opts;
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table)) throw new Error(`Invalid table: ${table}`);
  const allSkip = new Set([...skipFields, "id", "created_at", "updated_at"]);

  async function GET(_req: NextRequest, _ctx?: RouteContext) {
    const guard = requireUser();
    if (guard instanceof Response) return guard;
    const id = _ctx?.params?.id;
    if (id) {
      const row = getRow(table, id);
      if (!row) return err("Not found", 404);
      return json(row);
    }
    return json(listRows(table));
  }

  async function POST(req: NextRequest, _ctx?: RouteContext) {
    const guard = requireUser();
    if (guard instanceof Response) return guard;
    const body = await readJson<Record<string, unknown>>(req);
    if (!body) return err("Body required");
    for (const k of required) {
      if (!body[k]) return err(`${k} required`);
    }
    const id = uid(table.slice(0, 3) + "_");
    const t = now();
    const data: Record<string, unknown> = { id, created_at: t, updated_at: t };
    for (const [k, v] of Object.entries(body)) {
      if (allSkip.has(k)) continue;
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(k)) continue;
      data[k] = jsonFields.includes(k) ? JSON.stringify(v) : v;
    }
    const fields = Object.keys(data);
    const placeholders = fields.map(() => "?").join(",");
    db.prepare(`INSERT INTO ${table} (${fields.join(",")}) VALUES (${placeholders})`).run(
      ...fields.map((f) => data[f] as string | number | null),
    );
    return json(getRow(table, id), 201);
  }

  async function PATCH(req: NextRequest, ctx: RouteContext) {
    const guard = requireUser();
    if (guard instanceof Response) return guard;
    const id = ctx.params?.id;
    if (!id) return err("id required");
    const body = await readJson<Record<string, unknown>>(req);
    if (!body) return err("Body required");
    const fields: string[] = [];
    const values: (string | number | null)[] = [];
    for (const [k, v] of Object.entries(body)) {
      if (allSkip.has(k)) continue;
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(k)) continue;
      fields.push(`${k} = ?`);
      values.push(jsonFields.includes(k) ? JSON.stringify(v) : (v as string | number | null));
    }
    if (fields.length === 0) return err("No fields to update");
    fields.push("updated_at = ?");
    values.push(now());
    values.push(id);
    db.prepare(`UPDATE ${table} SET ${fields.join(", ")} WHERE id = ?`).run(...values);
    return json(getRow(table, id));
  }

  async function DELETE(_req: NextRequest, ctx: RouteContext) {
    const guard = requireUser();
    if (guard instanceof Response) return guard;
    const id = ctx.params?.id;
    if (!id) return err("id required");
    db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
    return json({ ok: true });
  }

  return { GET, POST, PATCH, DELETE };
}
