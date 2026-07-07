import { NextRequest } from "next/server";
import { json } from "@/lib/api-helpers";
import { db, now } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, company, source } = body || {};
    if (!email) return json({ error: "email required" }, 400);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "invalid email" }, 400);

    // Try to assign to first workspace if user is authenticated, else leave null
    const ws = db.prepare(`SELECT id FROM workspaces ORDER BY created_at ASC LIMIT 1`).get() as
      Record<string, unknown> | undefined;
    const wid = ws?.id || "leads-pool";

    const id = "lead_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    db.prepare(
      `INSERT INTO marketing_leads (id, workspace_id, email, name, company, source) VALUES (?, ?, ?, ?, ?, ?)`,
    ).run(id, wid, email, name || null, company || null, source || "direct");
    return json({ ok: true, id });
  } catch (e: unknown) {
    return json({ error: e.message }, 500);
  }
}

export async function GET() {
  try {
    const rows = db
      .prepare(`SELECT * FROM marketing_leads ORDER BY created_at DESC LIMIT 100`)
      .all();
    return json({ rows });
  } catch {
    return json({ rows: [] });
  }
}
