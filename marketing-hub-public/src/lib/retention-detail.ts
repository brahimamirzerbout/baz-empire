/**
 * Drill-down helpers for retention — given a cohort key (YYYY-MM), list the
 * contacts in that cohort and flag those who churned.
 */
import { db } from "@/lib/db";

export interface CohortContact {
  id: string;
  name: string;
  email: string;
  company?: string;
  source?: string;
  score: number;
  sentiment: number;
  last_touch_at?: number;
  is_active: boolean; // has activity in last 30d
  total_activities: number;
  weeks_active: number; // distinct weeks with activity
}

export function cohortDetail(cohortKey: string): {
  cohort: string;
  total: number;
  active: number;
  churned: number;
  contacts: CohortContact[];
} {
  // cohortKey: "YYYY-MM"
  const start = Date.parse(`${cohortKey}-01T00:00:00Z`);
  const end = Date.UTC(new Date(start).getUTCFullYear(), new Date(start).getUTCMonth() + 1, 1);

  const rows = db
    .prepare(
      `
    SELECT id, first_name, last_name, email, company, source, score, sentiment, last_touch_at
    FROM contacts
    WHERE created_at >= ? AND created_at < ?
    ORDER BY score DESC
  `,
    )
    .all(start, end) as Record<string, unknown>[];

  const since = Date.now() - 30 * 86400000;
  const out: CohortContact[] = [];
  for (const r of rows) {
    const acts = db
      .prepare(`SELECT created_at FROM activities WHERE contact_id = ?`)
      .all(r.id) as Record<string, unknown>[];
    const weeks = new Set(acts.map((a: Record<string, unknown>) => Math.floor((a.created_at - start) / (7 * 86400000))))
      .size;
    const lastTouch =
      r.last_touch_at ||
      (acts.length ? acts.sort((a: Record<string, unknown>, b: Record<string, unknown>) => b.created_at - a.created_at)[0].created_at : 0);
    out.push({
      id: r.id,
      name: [r.first_name, r.last_name].filter(Boolean).join(" ").trim() || r.email,
      email: r.email,
      company: r.company,
      source: r.source,
      score: r.score || 0,
      sentiment: r.sentiment || 0,
      last_touch_at: lastTouch,
      is_active: lastTouch >= since,
      total_activities: acts.length,
      weeks_active: weeks,
    });
  }

  const active = out.filter((c) => c.is_active).length;
  return {
    cohort: cohortKey,
    total: out.length,
    active,
    churned: out.length - active,
    contacts: out,
  };
}
