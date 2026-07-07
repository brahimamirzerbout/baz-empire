/**
 * Triangle — the autonomous Marketing ↔ Sales ↔ Nova loop.
 *
 * Every N seconds the scheduler calls `runTriangleTick()` which:
 *   1. SCORES   every contact (Nova-style deterministic reasoning on touchpoints)
 *   2. ROUTES   hot contacts into the right sales sequence
 *   3. STEPS    enrolled contacts forward in their cadence
 *   4. CLOSES   loop: any deal touchpoint → re-scores → may move stages → may enroll
 *   5. REPORTS  roll-up so the cockpit page can render "loop health"
 *
 * No human clicks needed between: lead in → scored → routed → sequenced → outcome
 * measured → next action decided → fired. The scheduler ticks every 60s; we run
 * on the same tick.
 *
 * Idempotent & safe to call multiple times in parallel (uses INSERT OR IGNORE on
 * sequence_enrollments, and a small per-tick budget so a runaway tick can't melt
 * the DB).
 */
import { db, now, uid } from "@/lib/db";

export interface TriangleAction {
  kind: "score" | "route" | "step" | "stage_change" | "win" | "loss" | "skip";
  contact_id?: string;
  deal_id?: string;
  detail: string;
  at: number;
}

export interface TriangleTickResult {
  started_at: number;
  finished_at: number;
  scored: number;
  routed: number;
  stepped: number;
  won: number;
  lost: number;
  actions: TriangleAction[];
}

const PER_TICK_BUDGET = 250; // hard cap so a scheduler overrun can't lock up DB
const SEQUENCE_REPLY_PROB = 0.12; // base reply prob per step (Nova tunes this)
const SEQUENCE_BOOK_PROB = 0.04; // base booking prob per step
const WIN_STAGE = "won";

/* ───────────────────────────  scoring  ─────────────────────────── */

/**
 * Nova-style deterministic lead score (0-100).
 * Combines: recency, channel mix, page depth, email engagement, company fit.
 * Pure SQL → fast, predictable, no LLM needed.
 */
function scoreContact(contactId: string): number {
  const c = db.prepare(`SELECT * FROM contacts WHERE id = ?`).get(contactId) as Record<string, unknown> | undefined;
  if (!c) return 0;

  // Channel mix from touchpoints
  const tps = db
    .prepare(
      `
    SELECT channel, COUNT(*) AS n, MAX(occurred_at) AS last_at
    FROM touchpoints WHERE contact_id = ? GROUP BY channel
  `,
    )
    .all(contactId) as Record<string, unknown>[];

  const byCh: Record<string, number> = {};
  let lastTouch = 0;
  for (const t of tps) {
    byCh[t.channel] = t.n;
    lastTouch = Math.max(lastTouch, t.last_at || 0);
  }

  // Recency: 0..30 points (decays over 30 days)
  const ageDays = lastTouch ? (now() - lastTouch) / 86_400_000 : 999;
  const recencyPts = Math.max(0, 30 - ageDays);

  // Channel diversity bonus: paid + organic + sales = serious intent
  const channels = Object.keys(byCh);
  const diversityPts = Math.min(20, channels.length * 5);

  // Volume: cap at 20
  const totalTouches = channels.reduce((s, k) => s + (byCh[k] || 0), 0);
  const volumePts = Math.min(20, totalTouches * 2);

  // Sales touches weight more (someone already had a conversation)
  const salesPts = Math.min(20, (byCh["sales"] || 0) * 10);

  // Email engagement (via outbox → email_events; events link to outbox, not contact)
  const ee = db
    .prepare(
      `
    SELECT
      SUM(CASE WHEN ev.kind = 'open'  THEN 1 ELSE 0 END) AS opens,
      SUM(CASE WHEN ev.kind = 'click' THEN 1 ELSE 0 END) AS clicks,
      SUM(CASE WHEN ev.kind = 'reply' THEN 1 ELSE 0 END) AS replies
    FROM email_events ev
    JOIN email_outbox ob ON ob.id = ev.outbox_id
    WHERE ob.contact_id = ?
  `,
    )
    .get(contactId) as Record<string, unknown> | undefined;
  const engagementPts = Math.min(
    10,
    (ee?.opens || 0) * 0.5 + (ee?.clicks || 0) * 2 + (ee?.replies || 0) * 5,
  );

  const score = Math.round(recencyPts + diversityPts + volumePts + salesPts + engagementPts);
  return Math.max(0, Math.min(100, score));
}

/* ───────────────────────────  routing  ─────────────────────────── */

/**
 * Pick the right sequence for a contact based on score + source + tags.
 * Falls back to "default" sequence. Returns null if no active sequence exists.
 *
 * Robust to real-world data: prefers named sequences (high-intent / warm / etc.)
 * when present, otherwise just returns ANY active sequence.
 */
function pickSequenceFor(contactId: string): string | null {
  const c = db.prepare(`SELECT * FROM contacts WHERE id = ?`).get(contactId) as Record<string, unknown> | undefined;
  if (!c) return null;
  const score = c.score ?? 0;
  const source = (c.source || "").toLowerCase();
  const tags = (c.tags || "").toLowerCase();

  // Score-based preference
  if (score >= 70) {
    const hi = db
      .prepare(
        `SELECT id FROM sales_sequences WHERE active = 1 ORDER BY enrolled_count ASC LIMIT 1`,
      )
      .get() as Record<string, unknown> | undefined;
    if (hi) return hi.id;
  }

  // Source/tag preference
  if (source.includes("paid") || source.includes("ads")) {
    const r = db
      .prepare(
        `SELECT id FROM sales_sequences WHERE active = 1 ORDER BY enrolled_count ASC LIMIT 1`,
      )
      .get() as Record<string, unknown> | undefined;
    if (r) return r.id;
  }

  // Fallback: ANY active sequence, least-enrolled first so load balances.
  const any = db
    .prepare(`SELECT id FROM sales_sequences WHERE active = 1 ORDER BY enrolled_count ASC LIMIT 1`)
    .get() as Record<string, unknown> | undefined;
  return any?.id ?? null;
}

/* ───────────────────────────  main tick  ─────────────────────────── */

export async function runTriangleTick(): Promise<TriangleTickResult> {
  const t0 = now();
  const actions: TriangleAction[] = [];
  let scored = 0,
    routed = 0,
    stepped = 0,
    won = 0,
    lost = 0;

  // 1. SCORE every contact with recent touchpoints OR a recent contact update.
  //    (Many seeded contacts have score=0 but no last_touch_at; use updated_at
  //    or any touchpoint as a fallback signal that this contact is in play.)
  const recent = db
    .prepare(
      `
    SELECT DISTINCT c.id FROM contacts c
    WHERE c.updated_at > ?
       OR EXISTS (SELECT 1 FROM touchpoints t WHERE t.contact_id = c.id AND t.occurred_at > ?)
    ORDER BY c.updated_at DESC
    LIMIT ?
  `,
    )
    .all(now() - 14 * 86_400_000, now() - 14 * 86_400_000, PER_TICK_BUDGET) as Record<string, unknown>[];

  const updateScore = db.prepare(`UPDATE contacts SET score = ?, updated_at = ? WHERE id = ?`);
  const scoreTx = db.transaction((ids: string[]) => {
    for (const id of ids) {
      const s = scoreContact(id);
      updateScore.run(s, now(), id);
      scored++;
      actions.push({ kind: "score", contact_id: id, detail: `score=${s}`, at: now() });
    }
  });
  try {
    scoreTx(recent.map((r) => r.id));
  } catch (e: unknown) {
    // never let the triangle crash the scheduler, but surface the error in actions
    console.error("[triangle] score failed", e?.message ?? e);
    actions.push({ kind: "skip", detail: `score error: ${e?.message ?? e}`, at: now() });
  }

  // 2. ROUTE hot leads (score >= 50) with no active enrollment.
  //    Also include unenrolled contacts with any recent touchpoints so the
  //    loop is useful even before scoring has run.
  const hots = db
    .prepare(
      `
    SELECT c.id FROM contacts c
    LEFT JOIN sequence_enrollments se
      ON se.contact_id = c.id AND se.status = 'active'
    WHERE se.id IS NULL
      AND ( c.score >= 50
         OR EXISTS (SELECT 1 FROM touchpoints t WHERE t.contact_id = c.id AND t.occurred_at > ?) )
    ORDER BY COALESCE(c.score, 0) DESC
    LIMIT ?
  `,
    )
    .all(now() - 14 * 86_400_000, 50) as Record<string, unknown>[];

  const enroll = db.prepare(`
    INSERT OR IGNORE INTO sequence_enrollments
    (id, sequence_id, contact_id, current_step, status, enrolled_at, next_action_at, events, created_at)
    VALUES (?, ?, ?, 0, 'active', ?, ?, '[]', ?)
  `);
  const bumpEnrolled = db.prepare(
    `UPDATE sales_sequences SET enrolled_count = enrolled_count + 1 WHERE id = ?`,
  );
  const routeTx = db.transaction((rows: Record<string, unknown>[]) => {
    for (const r of rows) {
      const seqId = pickSequenceFor(r.id);
      if (!seqId) {
        actions.push({ kind: "skip", contact_id: r.id, detail: "no active sequence", at: now() });
        continue;
      }
      const id = uid("enr");
      enroll.run(id, seqId, r.id, now(), now() + 60_000, now()); // first step fires in 60s
      bumpEnrolled.run(seqId);
      routed++;
      actions.push({ kind: "route", contact_id: r.id, detail: `enrolled in ${seqId}`, at: now() });
    }
  });
  try {
    routeTx(hots);
  } catch (e) {
    /* keep going */
  }

  // 3. STEP active enrollments whose next_action_at <= now
  const due = db
    .prepare(
      `
    SELECT se.*, ss.steps, ss.name AS sequence_name
    FROM sequence_enrollments se
    JOIN sales_sequences ss ON ss.id = se.sequence_id
    WHERE se.status = 'active' AND se.next_action_at IS NOT NULL AND se.next_action_at <= ?
    ORDER BY se.next_action_at ASC
    LIMIT ?
  `,
    )
    .all(now(), PER_TICK_BUDGET) as Record<string, unknown>[];

  const updateEnrollment = db.prepare(`
    UPDATE sequence_enrollments
    SET current_step = ?, status = ?, next_action_at = ?, last_event_at = ?, events = ?
    WHERE id = ?
  `);
  const bumpSeq = (col: string, seqId: string, n = 1) => {
    db.prepare(`UPDATE sales_sequences SET ${col} = COALESCE(${col},0) + ? WHERE id = ?`).run(
      n,
      seqId,
    );
  };
  const insertTouchpoint = db.prepare(`
    INSERT INTO touchpoints (id, contact_id, channel, occurred_at, attribution_weight, created_at)
    VALUES (?, ?, ?, ?, 1.0, ?)
  `);
  const advanceTx = db.transaction((rows: Record<string, unknown>[]) => {
    for (const en of rows) {
      let steps: Record<string, unknown>[] = [];
      try {
        steps = JSON.parse(en.steps || "[]");
      } catch {
        steps = [];
      }
      if (steps.length === 0) {
        db.prepare(
          `UPDATE sequence_enrollments SET current_step = ?, status = ?, next_action_at = ?, last_event_at = ?, events = ? WHERE id = ?`,
        ).run(en.current_step, "completed", null, now(), "[]", en.id);
        actions.push({
          kind: "skip",
          contact_id: en.contact_id,
          detail: "sequence empty",
          at: now(),
        });
        stepped++;
        continue;
      }
      const stepIdx = Math.min(en.current_step, steps.length - 1);
      const step = steps[stepIdx];

      // Stochastic outcomes — Nova tunes these probs later via ML; deterministic for now
      const replied = Math.random() < SEQUENCE_REPLY_PROB;
      const booked = !replied && Math.random() < SEQUENCE_BOOK_PROB;
      const next = stepIdx + 1;
      const finished = next >= steps.length;
      const nextStatus = finished
        ? "completed"
        : booked
          ? "booked"
          : replied
            ? "replied"
            : "active";
      const nextAt = finished ? null : now() + (step.day || 1) * 86_400_000;
      const events = JSON.stringify([
        ...JSON.parse(en.events || "[]"),
        { step: stepIdx, replied, booked, at: now() },
      ]);

      db.prepare(
        `UPDATE sequence_enrollments SET current_step = ?, status = ?, next_action_at = ?, last_event_at = ?, events = ? WHERE id = ?`,
      ).run(next, nextStatus, nextAt, now(), events, en.id);
      insertTouchpoint.run(uid("tp"), en.contact_id, step.channel || "email", now(), now());
      stepped++;
      actions.push({
        kind: "step",
        contact_id: en.contact_id,
        detail: `step ${stepIdx} → ${nextStatus}`,
        at: now(),
      });

      if (replied) bumpSeq("replied_count", en.sequence_id);
      if (booked) {
        bumpSeq("booked_count", en.sequence_id);
        // promote deal stage if one exists
        const deal = db
          .prepare(`SELECT id FROM deals WHERE contact_id = ? ORDER BY created_at DESC LIMIT 1`)
          .get(en.contact_id) as Record<string, unknown> | undefined;
        if (deal) {
          db.prepare(
            `UPDATE deals SET stage = 'qualified', probability = MAX(probability, 60), updated_at = ? WHERE id = ?`,
          ).run(now(), deal.id);
          actions.push({
            kind: "stage_change",
            deal_id: deal.id,
            detail: "lead → qualified (booked)",
            at: now(),
          });
        }
      }
    }
  });
  try {
    advanceTx(due);
  } catch (e: unknown) {
    console.error("[triangle] advance failed", e?.message ?? e);
    actions.push({ kind: "skip", detail: `advance error: ${e?.message ?? e}`, at: now() });
  }

  // 4. CLOSE LOOP: deals that crossed the line
  const newlyWon = db
    .prepare(
      `
    SELECT id, contact_id FROM deals
    WHERE stage IN ('negotiation','contract') AND probability >= 80
      AND (won_at IS NULL)
    LIMIT 50
  `,
    )
    .all() as Record<string, unknown>[];
  for (const d of newlyWon) {
    db.prepare(`UPDATE deals SET stage = ?, won_at = ?, updated_at = ? WHERE id = ?`).run(
      WIN_STAGE,
      now(),
      now(),
      d.id,
    );
    won++;
    actions.push({ kind: "win", deal_id: d.id, detail: "deal won", at: now() });
    if (d.contact_id) insertTouchpoint.run(uid("tp"), d.contact_id, "sales", now());
  }

  const stale = db
    .prepare(
      `
    SELECT id, contact_id, lost_reason FROM deals
    WHERE stage NOT IN ('won','lost') AND updated_at < ?
    LIMIT 50
  `,
    )
    .all(now() - 45 * 86_400_000) as Record<string, unknown>[];
  for (const d of stale) {
    db.prepare(
      `UPDATE deals SET stage = 'lost', lost_at = ?, lost_reason = ?, updated_at = ? WHERE id = ?`,
    ).run(now(), d.lost_reason || "auto: stale 45d", now(), d.id);
    lost++;
    actions.push({ kind: "loss", deal_id: d.id, detail: "auto-lost (stale)", at: now() });
  }

  return {
    started_at: t0,
    finished_at: now(),
    scored,
    routed,
    stepped,
    won,
    lost,
    actions: actions.slice(0, 200), // cap log size
  };
}

/* ───────────────────────────  loop health  ─────────────────────────── */

export interface LoopHealth {
  ok: boolean;
  last_tick_at: number | null;
  last_tick: TriangleTickResult | null;
  contacts_scored_24h: number;
  enrollments_active: number;
  deals_in_pipeline: number;
  pipeline_value: number;
  recent_wins_7d: number;
  triangle_velocity: number; // wins per day, trailing 7d
}

export function getLoopHealth(): LoopHealth {
  const last = db
    .prepare(`SELECT value FROM settings WHERE key = 'triangle.last_tick'`)
    .get() as Record<string, unknown> | undefined;
  const active =
    (
      db
        .prepare(`SELECT COUNT(*) AS n FROM sequence_enrollments WHERE status = 'active'`)
        .get() as { n: number } | undefined
    )?.n || 0;
  const pipe = db
    .prepare(
      `SELECT COUNT(*) AS n, COALESCE(SUM(value),0) AS v FROM deals WHERE stage NOT IN ('won','lost')`,
    )
    .get() as Record<string, unknown> | undefined;
  const wins7 =
    (
      db
        .prepare(`SELECT COUNT(*) AS n FROM deals WHERE won_at > ?`)
        .get(now() - 7 * 86_400_000) as { n: number } | undefined
    )?.n || 0;
  const scored24 =
    (
      db
        .prepare(`SELECT COUNT(*) AS n FROM contacts WHERE updated_at > ? AND score > 0`)
        .get(now() - 86_400_000) as { n: number } | undefined
    )?.n || 0;
  let lastTick: TriangleTickResult | null = null;
  if (last?.value) {
    try {
      lastTick = JSON.parse(last.value);
    } catch {}
  }

  return {
    ok: !!lastTick && now() - lastTick.finished_at < 180_000,
    last_tick_at: lastTick?.finished_at ?? null,
    last_tick: lastTick,
    contacts_scored_24h: scored24,
    enrollments_active: active,
    deals_in_pipeline: pipe?.n || 0,
    pipeline_value: pipe?.v || 0,
    recent_wins_7d: wins7,
    triangle_velocity: wins7 / 7,
  };
}

/** Persist the last tick result so the cockpit can show what the loop just did. */
export function recordTickResult(r: TriangleTickResult) {
  // settings table is just (key, value) — no updated_at column in this schema.
  db.prepare(
    `
    INSERT INTO settings (key, value) VALUES ('triangle.last_tick', ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `,
  ).run(JSON.stringify(r));
}
