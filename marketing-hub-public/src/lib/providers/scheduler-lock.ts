/**
 * Cross-process scheduler lock using SQLite.
 *
 * Why: when Next.js runs multiple Node processes (e.g. behind a load
 * balancer, or in dev with multiple workers), every process would otherwise
 * run its own setInterval. That means N concurrent ad syncs, all writing
 * to ad_metrics_applied at once — race condition.
 *
 * This lock is process-local for fast checks, with a SQLite-bumped
 * heartbeat for cross-process visibility. A process must hold the lock
 * to run its tick. Locks auto-expire after LOCK_TTL_MS so a crashed
 * process doesn't deadlock the scheduler.
 */
import { db } from "@/lib/db";

const LOCK_KEY = "scheduler:ad-sync";
const LOCK_TTL_MS = 5 * 60 * 1000; // 5 min

declare global {
  // eslint-disable-next-line no-var
  var __mh_ad_sync_lock_held: boolean | undefined;
}

export function tryAcquireAdSyncLock(): boolean {
  // Fast-path: this process already holds the lock
  if (global.__mh_ad_sync_lock_held) return true;

  const now = Date.now();
  const row = db.prepare(`SELECT value FROM settings WHERE key = ?`).get(LOCK_KEY) as Record<string, unknown> | undefined;
  if (row) {
    const ts = parseInt(row.value, 10);
    if (Number.isFinite(ts) && now - ts < LOCK_TTL_MS) {
      // Held by another live process
      return false;
    }
    // Expired — steal it
  }
  // Acquire (upsert). Use INSERT ... ON CONFLICT to win the race.
  db.prepare(
    `INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
  ).run(LOCK_KEY, String(now));
  // Verify we actually won
  const after = db.prepare(`SELECT value FROM settings WHERE key = ?`).get(LOCK_KEY) as Record<string, unknown> | undefined;
  if (after?.value !== String(now)) return false;
  global.__mh_ad_sync_lock_held = true;
  return true;
}

export function releaseAdSyncLock() {
  if (!global.__mh_ad_sync_lock_held) return;
  db.prepare(`DELETE FROM settings WHERE key = ?`).run(LOCK_KEY);
  global.__mh_ad_sync_lock_held = false;
}

/**
 * Run an async function only if this process holds the ad-sync lock.
 * Returns true if it ran, false if another process owns the lock.
 */
export async function runIfLeader<T>(fn: () => Promise<T>): Promise<T | null> {
  if (!tryAcquireAdSyncLock()) return null;
  try {
    return await fn();
  } finally {
    releaseAdSyncLock();
  }
}
