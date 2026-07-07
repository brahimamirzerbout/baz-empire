/**
 * Auth — single admin user, session cookie based.
 *
 * Rules:
 *   - If no users exist in the DB → first-run /setup screen creates the admin.
 *   - If ADMIN_PASSWORD env var is set at boot, a matching admin user is
 *     seeded silently (so deployments can ship with a known password).
 *   - Sessions are opaque tokens stored in the `sessions` table. The cookie
 *     carries the token only; the lookup happens server-side.
 */
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { db, uid, now } from "@/lib/db";

export const SESSION_COOKIE = "mh_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

declare global {
  // eslint-disable-next-line no-var
  var __mh_admin_seeded: boolean | undefined;
}

/**
 * Idempotent: ensure an admin user exists so passwordless magic-link auth has
 * a target. If ADMIN_PASSWORD is set, the admin is seeded with that password
 * (keeps the password backdoor). If not, a random unusable password is used —
 * passwordless-only, no secret required to deploy.
 */
export function ensureAdminFromEnv() {
  if (global.__mh_admin_seeded) return;
  global.__mh_admin_seeded = true;
  const existing = db.prepare(`SELECT id FROM users LIMIT 1`).get();
  if (existing) return;
  const id = uid("u_");
  const email = (process.env.ADMIN_EMAIL || "admin@marketing-hub.local").toLowerCase();
  const name = process.env.ADMIN_NAME || "Admin";
  const pw = process.env.ADMIN_PASSWORD || crypto.randomBytes(24).toString("base64url");
  const hash = bcrypt.hashSync(pw, 10);
  db.prepare(
    `INSERT OR IGNORE INTO users (id, email, name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)`,
  ).run(id, email, name, hash, now());
}

export function getUserCount(): number {
  return (db.prepare(`SELECT COUNT(*) AS n FROM users`).get() as { n: number } | undefined)?.n || 0;
}

export function createUser(email: string, name: string, password: string) {
  const e = email.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) throw new Error("Invalid email");
  if (password.length < 8) throw new Error("Password must be at least 8 characters");
  const existing = db.prepare(`SELECT id FROM users WHERE email = ?`).get(e);
  if (existing) throw new Error("A user with that email already exists");
  const id = uid("u_");
  const hash = bcrypt.hashSync(password, 10);
  db.prepare(
    `INSERT OR IGNORE INTO users (id, email, name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)`,
  ).run(id, e, name.trim() || "Admin", hash, now());
  // Auto-add to the default workspace as owner (legacy single-user flow)
  try {
    db.prepare(
      `INSERT OR IGNORE INTO workspace_members (id, workspace_id, user_id, role, created_at) VALUES (?, 'default', ?, 'owner', ?)`,
    ).run(uid("wsm_"), id, now());
  } catch {}
  return { id, email: e, name };
}

export function verifyCredentials(
  email: string,
  password: string,
): { id: string; email: string; name: string } | null {
  const row = db
    .prepare(`SELECT id, email, name, password_hash FROM users WHERE email = ?`)
    .get(email.trim().toLowerCase()) as Record<string, unknown> | undefined;
  if (!row) return null;
  if (!bcrypt.compareSync(password, row.password_hash)) return null;
  return { id: row.id, email: row.email, name: row.name };
}

export function createSession(userId: string): string {
  const token = uid("s_") + uid(""); // ~16 chars of randomness
  const expires = now() + SESSION_TTL_MS;
  db.prepare(
    `INSERT INTO sessions (token, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)`,
  ).run(token, userId, expires, now());
  return token;
}

export function destroySession(token: string) {
  db.prepare(`DELETE FROM sessions WHERE token = ?`).run(token);
}

export function getUserFromToken(
  token: string | undefined | null,
): { id: string; email: string; name: string } | null {
  if (!token) return null;
  const row = db
    .prepare(
      `
    SELECT u.id, u.email, u.name, s.expires_at
    FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.token = ?
  `,
    )
    .get(token) as Record<string, unknown> | undefined;
  if (!row) return null;
  if (row.expires_at < now()) {
    destroySession(token);
    return null;
  }
  return { id: row.id, email: row.email, name: row.name };
}

/** Server-component / server-action helper to read the current user. */
export function currentUser(): { id: string; email: string; name: string } | null {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return getUserFromToken(token);
}

export function setSessionCookie(token: string) {
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export function clearSessionCookie() {
  cookies().set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
}
