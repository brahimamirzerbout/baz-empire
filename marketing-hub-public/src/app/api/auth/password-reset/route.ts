import { NextRequest } from "next/server";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { json, err, readJson } from "@/lib/api-helpers";
import { db, now } from "@/lib/db";
import { getUserCount } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Password reset via single-use email token.
 *
 *   POST /api/auth/password-reset { email }
 *     → Always 200 (don't leak which emails exist). Sends a reset link via email.
 *     In dev (no SMTP configured), returns the token in the response so you
 *     can complete the flow manually.
 *
 *   POST /api/auth/password-reset { token, new_password }
 *     → Validates token, sets new password hash, marks token used.
 */
const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function POST(req: NextRequest) {
  if (getUserCount() === 0) return err("No users yet — visit /setup", 400);
  const body = await readJson<Record<string, unknown>>(req);
  if (!body) return err("body required");

  // Step 2 — complete the reset
  if (body.token && body.new_password) {
    if (typeof body.new_password !== "string" || body.new_password.length < 8)
      return err("password must be 8+ characters", 400);
    const row = db
      .prepare(`SELECT user_id, expires_at, used FROM password_reset_tokens WHERE token = ?`)
      .get(body.token) as Record<string, unknown> | undefined;
    if (!row || row.expires_at < now() || row.used) return err("Invalid or expired token", 400);
    const hash = bcrypt.hashSync(body.new_password, 10);
    db.prepare(`UPDATE users SET password_hash = ? WHERE id = ?`).run(hash, row.user_id);
    db.prepare(`UPDATE password_reset_tokens SET used = 1 WHERE token = ?`).run(body.token);
    // Invalidate all sessions for this user
    db.prepare(`DELETE FROM sessions WHERE user_id = ?`).run(row.user_id);
    // Also invalidate 2FA for safety (user must re-enroll)
    db.prepare(
      `UPDATE users SET totp_enabled = 0, totp_secret = NULL, recovery_codes = NULL WHERE id = ?`,
    ).run(row.user_id);
    return json({ ok: true });
  }

  // Step 1 — request a reset
  if (!body.email) return err("email required");
  const user = db.prepare(`SELECT id FROM users WHERE email = ?`).get(body.email) as
    Record<string, unknown> | undefined;
  // Always return ok to avoid leaking which emails exist.
  if (!user) return json({ ok: true });

  const token = crypto.randomBytes(24).toString("base64url");
  const expires = now() + TOKEN_TTL_MS;
  db.prepare(
    `INSERT INTO password_reset_tokens (token, user_id, expires_at, used, created_at) VALUES (?, ?, ?, 0, ?)`,
  ).run(token, user.id, expires, now());

  // Enqueue the email via the existing outbox.
  const resetLink = `${req.nextUrl.origin}/reset?token=${token}`;
  const html = `<p>You requested a password reset. Click below to set a new password. The link expires in 1 hour.</p><p><a href="${resetLink}" style="display:inline-block;background:#888888;color:white;padding:12px 24px;border-radius:8px;text-decoration:none">Reset password</a></p><p>If you didn't request this, ignore this email.</p>`;
  db.prepare(
    `INSERT INTO email_outbox (id, to_email, subject, body_html, status, created_at) VALUES (?, ?, ?, ?, 'queued', ?)`,
  ).run(
    `em_${Math.random().toString(36).slice(2)}_${now().toString(36)}`,
    body.email,
    "Reset your Marketing Hub password",
    html,
    now(),
  );

  // In dev (no SMTP configured), surface the token so the developer can complete the flow.
  const devMode = !process.env.SMTP_HOST && !process.env.RESEND_API_KEY;
  return json({ ok: true, devMode, ...(devMode ? { devToken: token, devLink: resetLink } : {}) });
}
