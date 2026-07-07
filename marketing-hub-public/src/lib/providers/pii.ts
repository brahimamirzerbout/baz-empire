/**
 * PII hashing for offline conversions.
 *
 * Real ad platforms require SHA-256 of normalized email/phone BEFORE upload:
 *  - Google Ads: SHA-256 of the lowercased email; phones normalized to E.164 then SHA-256'd
 *  - Meta Ads:   SHA-256 of the lowercased email; phones normalized then SHA-256'd
 *  - TikTok:     SHA-256 of lowercased email; phone is optional and SHA-256'd
 *  - LinkedIn:   SHA-256 of lowercased email (Conversions API spec)
 *
 * The hub stores BOTH the raw PII (for hub UI / matching) and the hashed
 * version (for upload). Hashing is done server-side at flush time so the
 * raw value never leaves the DB.
 *
 * Each function is intentionally simple — no regex wizards, no library deps.
 */
import { createHash } from "node:crypto";

export function sha256(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

/** Lowercase + trim. Email spec: no whitespace, single @. */
export function normalizeEmail(email: string): string {
  return String(email || "")
    .trim()
    .toLowerCase();
}

/**
 * Normalize phone to digits-only with country code prefix.
 * If the number doesn't start with +, we assume US (+1) as a fallback
 * because most ad platforms default to that. Real production should
 * accept the country code from the contact record.
 */
export function normalizePhone(phone: string, defaultCountryCode = "1"): string {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  // Strip leading zeros (international format)
  const trimmed = digits.replace(/^0+/, "");
  // If it already has a country code (10+ digits and the first 1-3 are a known country code), keep it.
  // Otherwise, prepend the default country code.
  if (trimmed.length >= 11) return trimmed;
  return defaultCountryCode + trimmed;
}

export function hashedEmail(email: string): string {
  const norm = normalizeEmail(email);
  if (!norm || !norm.includes("@")) return "";
  return sha256(norm);
}

export function hashedPhone(phone: string, defaultCountryCode?: string): string {
  const norm = normalizePhone(phone, defaultCountryCode);
  if (!norm) return "";
  return sha256(norm);
}

/**
 * Build the per-provider offline-conversion payload with hashed PII.
 * Returns the EXACT field names each platform expects.
 */
export function buildGoogleConversion(input: {
  gclid?: string;
  email?: string;
  phone?: string;
  value: number;
  currency: string;
  event_name: string;
  conversion_time: string; // ISO
}) {
  return {
    gclid: input.gclid,
    conversionDateTime: input.conversion_time,
    conversionValue: input.value,
    currencyCode: input.currency,
    hashedEmail: hashedEmail(input.email || ""),
    hashedPhoneNumber: hashedPhone(input.phone || ""),
  };
}

export function buildMetaConversion(input: {
  fbclid?: string;
  email?: string;
  phone?: string;
  value: number;
  currency: string;
  event_name: string;
  conversion_time: string;
}) {
  return {
    event_name: input.event_name,
    event_time: Math.floor(new Date(input.conversion_time).getTime() / 1000),
    action_source: "website",
    user_data: {
      em: [hashedEmail(input.email || "")].filter(Boolean),
      ph: [hashedPhone(input.phone || "")].filter(Boolean),
      client_ip_address: undefined, // optional; Meta also accepts server-side IP if available
      user_agent: undefined,
    },
    custom_data: {
      value: input.value,
      currency: input.currency,
    },
  };
}

export function buildTikTokConversion(input: {
  ttclid?: string;
  email?: string;
  phone?: string;
  value: number;
  currency: string;
  event_name: string;
  conversion_time: string;
}) {
  return {
    event_id: input.ttclid || undefined,
    event: input.event_name,
    event_time: Math.floor(new Date(input.conversion_time).getTime() / 1000),
    user: {
      email: hashedEmail(input.email || ""),
      phone: hashedPhone(input.phone || ""),
    },
    properties: {
      value: input.value,
      currency: input.currency,
    },
  };
}

export function buildLinkedInConversion(input: {
  li_fat_id?: string;
  email?: string;
  value: number;
  currency: string;
  event_name: string;
  conversion_time: string;
}) {
  return {
    conversion: input.li_fat_id ? `urn:li:fat:${input.li_fat_id}` : undefined,
    user: {
      userIds: [hashedEmail(input.email || "")].filter(Boolean),
    },
    conversionHappenedAt: Math.floor(new Date(input.conversion_time).getTime()),
    value: input.value,
    currencyCode: input.currency,
  };
}
