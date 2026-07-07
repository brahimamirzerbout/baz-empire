import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db, now, uid } from "./db";

export function ok<T>(data: T, init?: number | ResponseInit) {
  if (typeof init === "number") return NextResponse.json(data, { status: init });
  return NextResponse.json(data, init);
}

export function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function parseBody<T>(
  req: NextRequest,
  schema: z.ZodType<T>,
): Promise<T | NextResponse> {
  try {
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success)
      return bad("Validation error: " + parsed.error.issues.map((i) => i.message).join("; "));
    return parsed.data;
  } catch {
    return bad("Invalid JSON body");
  }
}

export function listAll(table: string, orderBy = "created_at", dir = "DESC") {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table)) throw new Error(`Invalid table: ${table}`);
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(orderBy)) throw new Error(`Invalid orderBy: ${orderBy}`);
  if (dir !== "ASC" && dir !== "DESC") throw new Error("Invalid sort direction");
  return db.prepare(`SELECT * FROM ${table} ORDER BY ${orderBy} ${dir}`).all();
}

export function getOne(table: string, id: string) {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table)) throw new Error(`Invalid table: ${table}`);
  return db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
}

export function deleteOne(table: string, id: string) {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table)) throw new Error(`Invalid table: ${table}`);
  return db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
}

export function timestamps() {
  return { created_at: now(), updated_at: now() };
}

export function makeId(prefix: string) {
  return uid(prefix);
}
