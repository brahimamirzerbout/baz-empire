import { NextRequest } from "next/server";
import { json, err, readJson } from "@/lib/api-helpers";
import { verifyCredentials, createSession, setSessionCookie, getUserCount, ensureAdminFromEnv } from "@/lib/auth";
import { db, now } from "@/lib/db";

export const dynamic = "force-dynamic";

// Simple in-memory rate limiting for login attempts.
// Tracks attempts per IP+email. After MAX_ATTEMPTS in WINDOW_MS, blocks further attempts.
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_MS = 15 * 60 * 1000; // block for 15 minutes after threshold

interface AttemptRecord {
  attempts: number;
  firstAttemptAt: number;
  blockedUntil: number;
}

const loginAttempts = new Map<string, AttemptRecord>();

// Clean up old entries periodically to prevent memory leak
let lastCleanup = 0;
function cleanupOldEntries() {
  const t = now();
  if (t - lastCleanup < 5 * 60 * 1000) return; // at most every 5 min
  lastCleanup = t;
  for (const [key, rec] of loginAttempts) {
    if (t - rec.firstAttemptAt > WINDOW_MS && t > rec.blockedUntil) {
      loginAttempts.delete(key);
    }
  }
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  const body = await readJson<Record<string, unknown>>(req);
  if (!body || !body.email || !body.password) return err("email and password required", 400);

  // Seed admin from env on every cold start (Vercel serverless /tmp is ephemeral)
  ensureAdminFromEnv();
  // Defensive: if no users exist, redirect to setup
  if (getUserCount() === 0) return err("No admin user yet — visit /setup", 400);

  // Rate limiting check
  cleanupOldEntries();
  const ip = getClientIp(req);
  const rateKey = `${ip}:${body.email.toLowerCase().trim()}`;
  const record = loginAttempts.get(rateKey);

  if (record && now() < record.blockedUntil) {
    const waitSec = Math.ceil((record.blockedUntil - now()) / 1000);
    return json({ error: `Too many login attempts. Try again in ${waitSec}s.` }, 429);
  }

  const user = verifyCredentials(body.email, body.password);
  if (!user) {
    // Record failed attempt
    const t = now();
    let rec = loginAttempts.get(rateKey);
    if (!rec) {
      rec = { attempts: 0, firstAttemptAt: t, blockedUntil: 0 };
      loginAttempts.set(rateKey, rec);
    }
    rec.attempts++;
    if (rec.attempts >= MAX_ATTEMPTS) {
      rec.blockedUntil = t + BLOCK_MS;
      // Log to DB for audit
      try {
        db.prepare(
          `INSERT INTO login_attempts (id, email, ip, ok, created_at) VALUES (?, ?, ?, 0, ?)`,
        ).run(
          `la_${Math.random().toString(36).slice(2, 10)}`,
          body.email.toLowerCase().trim(),
          ip,
          t,
        );
      } catch {}
      return json({ error: `Too many failed attempts. Blocked for 15 minutes.` }, 429);
    }
    // Log failed attempt to DB
    try {
      db.prepare(
        `INSERT INTO login_attempts (id, email, ip, ok, created_at) VALUES (?, ?, ?, 0, ?)`,
      ).run(
        `la_${Math.random().toString(36).slice(2, 10)}`,
        body.email.toLowerCase().trim(),
        ip,
        t,
      );
    } catch {}
    const remaining = MAX_ATTEMPTS - rec.attempts;
    return err(
      `Invalid email or password${remaining <= 3 ? ` — ${remaining} attempts remaining` : ""}`,
      401,
    );
  }

  // Success — clear rate limit for this key
  loginAttempts.delete(rateKey);

  // Log successful login to DB
  try {
    db.prepare(
      `INSERT INTO login_attempts (id, email, ip, ok, created_at) VALUES (?, ?, ?, 1, ?)`,
    ).run(
      `la_${Math.random().toString(36).slice(2, 10)}`,
      body.email.toLowerCase().trim(),
      ip,
      now(),
    );
  } catch {}

  // Update last_login_at
  try {
    db.prepare(`UPDATE users SET last_login_at = ? WHERE id = ?`).run(now(), user.id);
  } catch {}

  const token = createSession(user.id);
  setSessionCookie(token);
  return json({ ok: true, user });
}
