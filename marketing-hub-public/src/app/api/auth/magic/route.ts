import { NextRequest } from "next/server";
import crypto from "node:crypto";
import { json, err, readJson } from "@/lib/api-helpers";
import { db, now } from "@/lib/db";
import { createSession, setSessionCookie, getUserCount } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Passwordless magic-link auth.
 *
 *   POST /api/auth/magic { email }
 *     → Always 200 (don't leak which emails exist). Enqueues a sign-in link
 *       to the email outbox. In dev (no SMTP/RESEND), returns the link so the
 *       flow can be completed manually.
 *
 *   POST /api/auth/magic { token }
 *     → Validates the token, creates a session, sets the cookie. Used by the
 *       login page when it receives ?token=... from the emailed link.
 */
const MAGIC_TTL_MS = 15 * 60 * 1000; // 15 minutes

// In-memory rate limiting for magic-link requests (per IP+email).
const MAX_REQ = 5;
const WINDOW_MS = 15 * 60 * 1000;
const reqs = new Map<string, { n: number; first: number }>();

function checkRate(key: string): boolean {
  const t = now();
  const r = reqs.get(key);
  if (!r || t - r.first > WINDOW_MS) {
    reqs.set(key, { n: 1, first: t });
    return true;
  }
  r.n++;
  return r.n <= MAX_REQ;
}

function ip(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  if (getUserCount() === 0) return err("No admin user yet — visit /setup", 400);
  const body = await readJson<Record<string, unknown>>(req);
  if (!body) return err("body required");

  // Step 2 — verify a magic-link token (clicked from the email)
  if (body.token) {
    const row = db
      .prepare(`SELECT user_id, expires_at, used FROM magic_link_tokens WHERE token = ?`)
      .get(body.token) as Record<string, unknown> | undefined;
    if (!row || Number(row.expires_at) < now() || row.used) return err("Invalid or expired magic link", 400);
    db.prepare(`UPDATE magic_link_tokens SET used = 1 WHERE token = ?`).run(body.token);
    const user = db
      .prepare(`SELECT id, email, name FROM users WHERE id = ?`)
      .get(row.user_id as string) as Record<string, unknown> | undefined;
    if (!user) return err("User not found", 400);
    const token = createSession(user.id as string);
    setSessionCookie(token);
    try {
      db.prepare(`UPDATE users SET last_login_at = ? WHERE id = ?`).run(now(), user.id);
    } catch {}
    return json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
  }

  // Step 1 — request a magic link
  if (!body.email) return err("email required");
  const email = String(body.email).trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return err("Invalid email", 400);

  const key = `${ip(req)}:${email}`;
  if (!checkRate(key)) return json({ error: "Too many requests. Try again in a few minutes." }, 429);

  const user = db
    .prepare(`SELECT id, email, name FROM users WHERE email = ?`)
    .get(email) as Record<string, unknown> | undefined;
  // Always return ok to avoid leaking which emails exist.
  if (!user) return json({ ok: true, sent: true });

  const token = crypto.randomBytes(24).toString("base64url");
  const expires = now() + MAGIC_TTL_MS;
  db.prepare(
    `INSERT INTO magic_link_tokens (token, user_id, expires_at, used, created_at) VALUES (?, ?, ?, 0, ?)`,
  ).run(token, user.id, expires, now());

  const link = `${req.nextUrl.origin}/login?token=${token}`;
  const html = `<p>Sign in to Marketing Hub. Click the link below — it expires in 15 minutes.</p><p><a href="${link}" style="display:inline-block;background:#888888;color:white;padding:12px 24px;border-radius:8px;text-decoration:none">Sign in</a></p><p>If you didn't request this, ignore this email.</p>`;
  db.prepare(
    `INSERT INTO email_outbox (id, to_email, subject, body_html, status, created_at) VALUES (?, ?, ?, ?, 'queued', ?)`,
  ).run(
    `em_${Math.random().toString(36).slice(2)}_${now().toString(36)}`,
    email,
    "Your Marketing Hub sign-in link",
    html,
    now(),
  );

  const devMode = !process.env.SMTP_HOST && !process.env.RESEND_API_KEY;
  return json({ ok: true, sent: true, devMode, ...(devMode ? { devToken: token, devLink: link } : {}) });
}