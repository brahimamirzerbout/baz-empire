/**
 * Column-level encryption for raw PII.
 *
 * Why: the ad_conversions table stores both the raw PII (for matching)
 * and the hashed PII (for upload). The raw value is sensitive — if the DB
 * leaks via a backup, an admin panel export, or a log, customer emails
 * and phone numbers go with it.
 *
 * Strategy: AES-256-GCM with a key from PII_ENCRYPTION_KEY env var.
 * If the env var isn't set, falls back to a deterministic dev key
 * derived from the workspace so dev data is still somewhat opaque.
 * Production must set the env var — we refuse to start without it.
 *
 * Format: base64(iv (12 bytes) || authTag (16 bytes) || ciphertext)
 */
import { createCipheriv, createDecipheriv, randomBytes, createHash } from "node:crypto";

const ALGO = "aes-256-gcm";
const IV_LEN = 12;

function getKey(): Buffer {
  const raw = process.env.PII_ENCRYPTION_KEY;
  if (raw && raw.length >= 32) {
    return createHash("sha256").update(raw).digest();
  }
  // Dev fallback. Logs a warning once per process so it's not silent.
  if (!getKey._warned) {
    console.warn(
      "[pii-crypto] PII_ENCRYPTION_KEY env var is not set or too short. " +
        "Using an unstable dev key. Set PII_ENCRYPTION_KEY (32+ chars) in production.",
    );
    getKey._warned = true;
  }
  return createHash("sha256").update("dev-fallback-key-do-not-use-in-production").digest();
}
getKey._warned = false;

export function encryptPII(plaintext: string | null | undefined): string | null {
  if (plaintext === null || plaintext === undefined || plaintext === "") return null;
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, getKey(), iv);
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ct]).toString("base64");
}

export function decryptPII(payload: string | null | undefined): string | null {
  if (!payload) return null;
  try {
    const buf = Buffer.from(payload, "base64");
    if (buf.length < IV_LEN + 16) return null;
    const iv = buf.subarray(0, IV_LEN);
    const tag = buf.subarray(IV_LEN, IV_LEN + 16);
    const ct = buf.subarray(IV_LEN + 16);
    const decipher = createDecipheriv(ALGO, getKey(), iv);
    decipher.setAuthTag(tag);
    const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
    return pt.toString("utf8");
  } catch {
    return null; // corrupted or key rotated
  }
}
