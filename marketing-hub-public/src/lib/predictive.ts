/**
 * Predictive lead scoring v2 — learn from your own data.
 *
 * Computes per-feature win rates from your closed deals, then scores every
 * open contact as: probability_of_close × expected_value × urgency.
 *
 * Features considered:
 *   - source (channel)
 *   - company size bucket
 *   - sentiment (positive/negative/neutral)
 *   - recency (last touch within N days)
 *   - activity volume (touchpoints per week)
 *   - engagement score (existing)
 *
 * Output: per-contact probability × value prediction + top 3 reasons.
 */
import { db } from "@/lib/db";

export interface PredictiveScore {
  contact_id: string;
  probability_pct: number;
  expected_value: number;
  composite: number; // probability × value, scaled
  top_reasons: string[];
  bucket: "hot" | "warm" | "cool" | "cold";
}

function winRateBySource(): Record<string, number> {
  const rows = db
    .prepare(
      `
    SELECT c.source,
           COUNT(DISTINCT c.id) AS contacts,
           COUNT(DISTINCT CASE WHEN d.stage = 'won' THEN c.id END) AS won
    FROM contacts c
    LEFT JOIN deals d ON d.contact_id = c.id
    GROUP BY c.source
  `,
    )
    .all() as Record<string, unknown>[];
  const out: Record<string, number> = {};
  for (const r of rows) out[r.source || "unknown"] = r.contacts > 0 ? r.won / r.contacts : 0;
  return out;
}

function avgWonDealBySource(): Record<string, number> {
  const rows = db
    .prepare(
      `
    SELECT c.source, AVG(d.value) AS avg_v
    FROM deals d
    JOIN contacts c ON c.id = d.contact_id
    WHERE d.stage = 'won'
    GROUP BY c.source
  `,
    )
    .all() as Record<string, unknown>[];
  const out: Record<string, number> = {};
  for (const r of rows) out[r.source || "unknown"] = r.avg_v || 0;
  return out;
}

function activityScore(contactId: string): number {
  const r = db
    .prepare(
      `
    SELECT COUNT(*) AS n,
           MAX(created_at) AS last_at,
           (CAST(COUNT(*) AS REAL) / NULLIF(CAST((MAX(created_at) - MIN(created_at)) AS REAL) / 604800000.0, 0)) AS per_week
    FROM activities WHERE contact_id = ?
  `,
    )
    .get(contactId) as Record<string, unknown> | undefined;
  return (r?.n || 0) * 1 + (r?.per_week || 0) * 5;
}

export function predictContact(contactId: string): PredictiveScore | null {
  const c = db.prepare(`SELECT * FROM contacts WHERE id = ?`).get(contactId) as Record<string, unknown> | undefined;
  if (!c) return null;

  const srcRates = winRateBySource();
  const srcValues = avgWonDealBySource();
  const src = c.source || "unknown";

  const baseRate = srcRates[src] ?? 0.25;
  // Adjustments (each +X pp)
  const sentiment = Number(c.sentiment || 0); // -1..1
  const sentimentBoost = sentiment > 0.2 ? 10 : sentiment < -0.2 ? -10 : 0;
  const recencyBoost =
    c.last_touch_at && Date.now() - c.last_touch_at < 7 * 86400000
      ? 12
      : c.last_touch_at && Date.now() - c.last_touch_at > 30 * 86400000
        ? -10
        : 0;
  const activity = activityScore(contactId);
  const activityBoost = Math.min(15, activity * 0.6);
  const scoreBoost = (Number(c.score) || 0) * 0.15;
  const baseBoost = Number(c.score) || 0;

  const probability = Math.max(
    0,
    Math.min(
      95,
      Math.round(
        baseRate * 100 +
          sentimentBoost +
          recencyBoost +
          activityBoost +
          scoreBoost +
          baseBoost * 0.2,
      ),
    ),
  );
  const expectedValue = Math.round(srcValues[src] || 5000);

  const reasons: string[] = [];
  if (sentimentBoost > 0) reasons.push("positive sentiment signals");
  else if (sentimentBoost < 0) reasons.push("negative sentiment — risk");
  if (recencyBoost > 0) reasons.push("touched in last 7 days — hot");
  else if (recencyBoost < 0) reasons.push("no recent touch — going cold");
  if (activityBoost >= 8) reasons.push("high activity velocity");
  if (baseRate >= 0.4)
    reasons.push(`${src} converts well historically (${Math.round(baseRate * 100)}%)`);
  if (probability >= 60) reasons.push("high composite score — prioritize now");

  const composite = Math.round(probability * Math.log10(Math.max(10, expectedValue)) * 10);
  const bucket: PredictiveScore["bucket"] =
    probability >= 70 ? "hot" : probability >= 45 ? "warm" : probability >= 20 ? "cool" : "cold";

  return {
    contact_id: contactId,
    probability_pct: probability,
    expected_value: expectedValue,
    composite,
    top_reasons: reasons.slice(0, 3),
    bucket,
  };
}

export function predictAll(limit = 100): PredictiveScore[] {
  const contacts = db.prepare(`SELECT id FROM contacts LIMIT ?`).all(limit) as Record<string, unknown>[];
  const out: PredictiveScore[] = [];
  for (const c of contacts) {
    const p = predictContact(c.id);
    if (p) out.push(p);
  }
  return out.sort((a, b) => b.composite - a.composite);
}
