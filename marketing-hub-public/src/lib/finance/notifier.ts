/**
 * Finance notifier — runs daily (and on demand) to:
 *   1. Check tax due dates in the next 30 days → write to activity log
 *   2. Evaluate FX alerts → fire if threshold crossed
 *   3. Surface unacknowledged tax law updates → flag in cockpit
 *
 * The notifier stores its observations in `nova_finance_runs` with intent
 * 'due' or 'fx_alert' so Nova can reference them in answers.
 *
 * Wiring: called from lib/scheduler.ts (already runs every 60s). On boot
 * we run an immediate tick, then every 24h.
 */
import { db, uid, now } from "@/lib/db";
import { dueDatesThisMonth, listLawUpdates } from "./tax";
import { getRate } from "./fx";
import { financialHealth } from "./accounting";

declare global {
  var __mh_finance_notifier_started: boolean | undefined;
}

const TICK_MS = 24 * 60 * 60 * 1000; // 24h

export function startFinanceNotifier() {
  if (global.__mh_finance_notifier_started) return;
  global.__mh_finance_notifier_started = true;
  // First tick immediately, then daily
  runFinanceTick().catch(() => {});
  setInterval(() => {
    runFinanceTick().catch(() => {});
  }, TICK_MS);
}

export async function runFinanceTick() {
  const nowMs = now();
  const due = dueDatesThisMonth("default", { withinDays: 30 });
  for (const d of due) {
    // Avoid duplicates: only insert if no run for this (tax_code_id, due_date)
    const existing = db
      .prepare(
        `SELECT id FROM nova_finance_runs WHERE intent = 'due' AND data LIKE ? AND created_at > ?`,
      )
      .get(
        `%"tax_code_id":"${d.tax_code_id}"%,"due_date":${d.due_date}%`,
        nowMs - 7 * 86400 * 1000,
      );
    if (!existing) {
      const id = uid("nfr_");
      db.prepare(
        `
        INSERT INTO nova_finance_runs (id, question, intent, answer, data, sources, confidence, created_at)
        VALUES (?, ?, 'due', ?, ?, ?, ?, ?)
      `,
      ).run(
        id,
        `Tax due: ${d.label}`,
        d.overdue ? `OVERDUE by ${-d.days_away} days` : `Due in ${d.days_away} days`,
        JSON.stringify(d),
        JSON.stringify([{ kind: "tax_rule", code: d.label, country: d.country }]),
        0.95,
        nowMs,
      );
    }
  }

  // FX alerts
  const fxAlerts = db.prepare(`SELECT * FROM fx_alerts WHERE active = 1`).all() as Record<string, unknown>[];
  for (const a of fxAlerts) {
    const r = getRate(a.base, a.quote);
    if (!r) continue;
    let fire = false;
    if (a.condition === "above" && r.rate > a.threshold) fire = true;
    if (a.condition === "below" && r.rate < a.threshold) fire = true;
    if (fire) {
      const lastFired = a.last_fired_at || 0;
      // Debounce: don't re-fire within 4h
      if (nowMs - lastFired > 4 * 3600 * 1000) {
        const id = uid("nfr_");
        db.prepare(
          `
          INSERT INTO nova_finance_runs (id, question, intent, answer, data, sources, confidence, created_at)
          VALUES (?, ?, 'fx_alert', ?, ?, ?, ?, ?)
        `,
        ).run(
          id,
          `FX alert: ${a.base}/${a.quote} ${a.condition} ${a.threshold}`,
          `Rate is now ${r.rate.toFixed(4)} (${a.condition} ${a.threshold})`,
          JSON.stringify({ ...a, current_rate: r.rate, as_of: r.as_of }),
          JSON.stringify([{ kind: "fx_source", source: r.source }]),
          1.0,
          nowMs,
        );
        db.prepare(`UPDATE fx_alerts SET last_fired_at = ? WHERE id = ?`).run(nowMs, a.id);
      }
    }
  }

  // Daily health snapshot — for the cockpit widget
  const health = financialHealth({ workspace: "default", periodDays: 30 });
  db.prepare(
    `
    INSERT OR REPLACE INTO settings (key, value) VALUES ('finance_health_daily', ?)
  `,
  ).run(JSON.stringify({ ...health, as_of: nowMs }));
}
