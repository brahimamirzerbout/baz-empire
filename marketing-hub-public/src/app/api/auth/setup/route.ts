import { NextRequest } from "next/server";
import { json, err, readJson } from "@/lib/api-helpers";
import { createUser, createSession, setSessionCookie, getUserCount } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * First-run setup. Only allowed when no users exist yet (or when an
 * unauthenticated visitor is creating the first one). After the first user
 * is created, this endpoint refuses further calls — additional users must
 * be invited by an admin via /api/admin/users (future).
 */
export async function POST(req: NextRequest) {
  const body = await readJson<Record<string, unknown>>(req);
  if (!body || !body.email || !body.password || !body.name) {
    return err("name, email, password required", 400);
  }
  if (getUserCount() > 0) return err("Setup already completed", 403);
  try {
    const user = createUser(body.email, body.name, body.password);
    const token = createSession(user.id);
    setSessionCookie(token);
    return json({ ok: true, user }, 201);
  } catch (e: unknown) {
    return err(e.message || "Setup failed", 400);
  }
}
