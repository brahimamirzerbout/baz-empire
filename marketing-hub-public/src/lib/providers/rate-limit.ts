/**
 * Per-provider rate limiter for ad sync operations.
 *
 * Why this exists:
 *  - Google Ads API: 15,000 operations/day per developer token, ~10/sec burst
 *  - Meta Marketing API: tier-based (dev: 60 calls/hour, standard: varies)
 *  - TikTok Ads API: 10 requests/second
 *  - LinkedIn Ads API: 100 requests/day per app (very tight by default)
 *
 * Without a limiter, a user mashing "Sync all" can hit the platform's
 * limit and get the whole org blocked for hours.
 *
 * The implementation is a per-minute token bucket persisted in the
 * ad_rate_limits table. If the bucket is over the limit we reject with
 * a 429-style error so the UI can show "Try again in N seconds".
 */

import { db } from "@/lib/db";

export type RateLimitConfig = {
  perMinute: number;
};

const DEFAULT_LIMITS: Record<string, RateLimitConfig> = {
  google_ads: { perMinute: 10 }, // ~600/hour sustained, well below the 15k/day
  meta_ads: { perMinute: 5 }, // conservative — Meta tiers vary
  tiktok_ads: { perMinute: 10 }, // TikTok allows ~10/sec but we stay safe
  linkedin_ads: { perMinute: 2 }, // LinkedIn is very tight; respect it
};

export function getLimit(provider: string): RateLimitConfig {
  return DEFAULT_LIMITS[provider] || { perMinute: 5 };
}

export function bucketMinute(ts: number = Date.now()): number {
  return Math.floor(ts / 60_000);
}

export type RateLimitResult =
  { ok: true; remaining: number } | { ok: false; retryAfterSec: number; limit: number };

export function checkAndConsume(provider: string, now: number = Date.now()): RateLimitResult {
  const cfg = getLimit(provider);
  const bucket = bucketMinute(now);

  // Clean expired buckets opportunistically (older than 5 minutes)
  db.prepare(`DELETE FROM ad_rate_limits WHERE bucket_minute < ?`).run(bucket - 5);

  const row = db
    .prepare(`SELECT count FROM ad_rate_limits WHERE provider = ? AND bucket_minute = ?`)
    .get(provider, bucket) as Record<string, unknown> | undefined;

  const current = row?.count || 0;
  if (current >= cfg.perMinute) {
    const retryAfterSec = Math.max(1, 60 - Math.floor((now % 60_000) / 1000));
    db.prepare(
      `UPDATE ad_rate_limits SET last_rejected_at = ? WHERE provider = ? AND bucket_minute = ?`,
    ).run(now, provider, bucket);
    return { ok: false, retryAfterSec, limit: cfg.perMinute };
  }

  // Upsert +1
  db.prepare(
    `INSERT INTO ad_rate_limits (provider, bucket_minute, count) VALUES (?, ?, 1)
     ON CONFLICT(provider, bucket_minute) DO UPDATE SET count = count + 1`,
  ).run(provider, bucket);

  return { ok: true, remaining: cfg.perMinute - current - 1 };
}

/**
 * If the provider is in mock mode, the limiter is bypassed entirely —
 * mock calls don't hit real APIs so rate limits don't apply.
 */
export function checkAndConsumeLiveOnly(
  provider: string,
  isLive: boolean,
  now?: number,
): RateLimitResult {
  if (!isLive) return { ok: true, remaining: 999 };
  return checkAndConsume(provider, now);
}
