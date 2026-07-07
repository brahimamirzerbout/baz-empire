/**
 * Background scheduler.
 * Two responsibilities:
 *   1. Email delivery — pick outbox rows where status='queued' AND
 *      (scheduled_for IS NULL OR scheduled_for <= now()) and try to deliver.
 *   2. Campaign "send now" — pick campaigns where status='scheduled' AND
 *      end_date <= now() and trigger the email sequence.
 *
 * Self-throttling: in-process setInterval. Safe to call start() multiple times
 * (it dedupes by global flag).
 */
import { db, now } from "@/lib/db";
import { tryDeliver } from "@/lib/email";
import { runTriangleTick, recordTickResult } from "@/lib/triangle";
import { ingestMarketingDive } from "@/lib/marketingDive";

declare global {
  // eslint-disable-next-line no-var
  var __mh_scheduler_started: boolean | undefined;
  // eslint-disable-next-line no-var
  var __mh_dive_last_ingest: number | undefined;
}

const TICK_MS = 60_000;
const DIVE_INGEST_MS = 60 * 60 * 1000; // at most once an hour

export function startScheduler() {
  if (global.__mh_scheduler_started) return;
  global.__mh_scheduler_started = true;
  // Fire one tick immediately, then on interval
  tick().catch(() => {});
  setInterval(() => {
    tick().catch(() => {});
  }, TICK_MS);
}

async function tick() {
  await runOutboxTick();
  await runCampaignTick();
  await runAutomationTick();
  // Triangle = Marketing ↔ Sales ↔ Nova autonomous loop.
  // Runs after outbox so the emails it triggers can actually deliver.
  try {
    const r = await runTriangleTick();
    recordTickResult(r);
  } catch (e) {
    // never let the triangle crash the scheduler
    console.error("[triangle] tick failed", e);
  }
  // Marketing Dive feed: hourly. Throttled by global flag so a restart doesn't spam.
  const last = global.__mh_dive_last_ingest ?? 0;
  if (now() - last > DIVE_INGEST_MS) {
    global.__mh_dive_last_ingest = now();
    try {
      const r = await ingestMarketingDive({ maxPagesPerTopic: 1 });
      if (process.env.NODE_ENV !== "production")
        console.log(
          `[dive] ingest: ${r.inserted} new, ${r.updated} updated, ${r.errors.length} errors`,
        );
    } catch (e) {
      console.error("[dive] ingest failed", e);
    }
  }
}

async function runOutboxTick() {
  const nowMs = now();
  // Pull a small batch
  const rows = db
    .prepare(
      `
    SELECT id FROM email_outbox
    WHERE status = 'queued'
      AND (scheduled_for IS NULL OR scheduled_for <= ?)
    ORDER BY created_at ASC
    LIMIT 50
  `,
    )
    .all(nowMs) as Record<string, unknown>[];

  for (const row of rows) {
    try {
      await tryDeliver(row.id);
    } catch {
      /* keep queued */
    }
  }

  // Retry failed rows older than 5 min, max 3 attempts
  const retryable = db
    .prepare(
      `
    SELECT id FROM email_outbox
    WHERE status = 'failed'
      AND attempts < 3
      AND created_at < ?
    ORDER BY created_at ASC
    LIMIT 25
  `,
    )
    .all(nowMs - 5 * 60_000) as Record<string, unknown>[];
  for (const row of retryable) {
    try {
      await tryDeliver(row.id);
    } catch {
      /* still failed */
    }
  }
}

async function runCampaignTick() {
  const nowMs = now();
  // Move scheduled campaigns whose end_date has passed into 'live'
  db.prepare(
    `
    UPDATE campaigns
    SET status = 'live', updated_at = ?
    WHERE status = 'scheduled' AND end_date IS NOT NULL AND end_date <= ?
  `,
  ).run(nowMs, nowMs);
}

async function runAutomationTick() {
  // Hook left for automations module — we'll wire this when we touch automations.
  // Placeholder so future automation runs have an entry point.
  // (The triangle tick above IS the live automation runner.)
}

// Allow being invoked manually for tests / scripts
export async function runOnce() {
  await tick();
}

export async function runAdSyncOnce(): Promise<void> { /* stub */ }
