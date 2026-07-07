import { NextRequest } from "next/server";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import crypto from "node:crypto";
import { json, err, readJson } from "@/lib/api-helpers";
import { currentUser } from "@/lib/auth";
import { db, now } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * TOTP / 2FA endpoints:
 *   GET  /api/auth/2fa                          → { enabled, hasSecret }
 *   POST /api/auth/2fa { action: "setup" }     → { secret, otpauth, qrDataUrl, recoveryCodes }
 *   POST /api/auth/2fa { action: "enable", code }
 *   POST /api/auth/2fa { action: "disable", code }
 *   POST /api/auth/2fa { action: "verify", code }   → used by login flow
 *   POST /api/auth/2fa { action: "recovery", code }
 *
 * Uses `speakeasy` for TOTP (battle-tested, simpler than otplib v13).
 */

function recoveryCodes(): string[] {
  const out: string[] = [];
  for (let i = 0; i < 8; i++) {
    out.push(
      crypto
        .randomBytes(6)
        .toString("base64")
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 10)
        .toUpperCase(),
    );
  }
  return out;
}

function hashCode(code: string): string {
  return crypto.createHash("sha256").update(code.toUpperCase()).digest("hex");
}

function verifyCode(secret: string, code: string): boolean {
  if (!/^\d{6}$/.test(code || "")) return false;
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token: code,
    window: 1,
  });
}

export async function GET() {
  const u = currentUser();
  if (!u) return json({ error: "Not authenticated" }, 401);
  const row = db.prepare(`SELECT totp_enabled, totp_secret FROM users WHERE id = ?`).get(u.id) as
    Record<string, unknown> | undefined;
  return json({ enabled: !!row?.totp_enabled, hasSecret: !!row?.totp_secret });
}

export async function POST(req: NextRequest) {
  const u = currentUser();
  if (!u) return json({ error: "Not authenticated" }, 401);
  const body = await readJson<Record<string, unknown>>(req);
  if (!body?.action) return err("action required");

  const row = db
    .prepare(`SELECT totp_enabled, totp_secret, recovery_codes FROM users WHERE id = ?`)
    .get(u.id) as Record<string, unknown> | undefined;

  if (body.action === "setup") {
    if (row?.totp_enabled) return err("2FA is already enabled. Disable first to re-setup.");
    const secret = speakeasy.generateSecret({ name: u.email, issuer: "Marketing Hub", length: 20 });
    const otpauth = secret.otpauth_url || "";
    const qrDataUrl = await QRCode.toDataURL(otpauth, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 256,
    });
    const codes = recoveryCodes();
    const hashedCodes = codes.map(hashCode);
    db.prepare(`UPDATE users SET totp_secret = ?, recovery_codes = ? WHERE id = ?`).run(
      secret.base32,
      JSON.stringify(hashedCodes),
      u.id,
    );
    return json({ secret: secret.base32, otpauth, qrDataUrl, recoveryCodes: codes });
  }

  if (body.action === "enable") {
    if (!row?.totp_secret) return err("Run setup first");
    if (!verifyCode(row.totp_secret, body.code || "")) return err("Invalid code", 400);
    db.prepare(`UPDATE users SET totp_enabled = 1, last_login_at = ? WHERE id = ?`).run(
      now(),
      u.id,
    );
    return json({ ok: true });
  }

  if (body.action === "disable") {
    if (!row?.totp_enabled) return err("2FA is not enabled");
    if (!verifyCode(row.totp_secret, body.code || "")) return err("Invalid code", 400);
    db.prepare(
      `UPDATE users SET totp_secret = NULL, totp_enabled = 0, recovery_codes = NULL WHERE id = ?`,
    ).run(u.id);
    return json({ ok: true });
  }

  if (body.action === "verify") {
    if (!row?.totp_enabled) return err("2FA is not enabled");
    if (!verifyCode(row.totp_secret, body.code || "")) return err("Invalid code", 400);
    db.prepare(`UPDATE users SET last_login_at = ? WHERE id = ?`).run(now(), u.id);
    return json({ ok: true });
  }

  if (body.action === "recovery") {
    if (!row?.recovery_codes) return err("No recovery codes available");
    let codes: string[] = [];
    try {
      codes = JSON.parse(row.recovery_codes);
    } catch {}
    const hashed = hashCode(body.code || "");
    const idx = codes.indexOf(hashed);
    if (idx === -1) return err("Invalid recovery code", 400);
    codes.splice(idx, 1);
    db.prepare(`UPDATE users SET recovery_codes = ? WHERE id = ?`).run(JSON.stringify(codes), u.id);
    if (codes.length === 0) {
      db.prepare(`UPDATE users SET totp_enabled = 0, totp_secret = NULL WHERE id = ?`).run(u.id);
    }
    db.prepare(`UPDATE users SET last_login_at = ? WHERE id = ?`).run(now(), u.id);
    return json({ ok: true, remainingCodes: codes.length });
  }

  return err("Unknown action");
}
