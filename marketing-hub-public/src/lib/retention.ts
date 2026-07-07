/**
 * Cohort Retention — groups contacts by signup cohort (month), then measures
 * what % come back at week N. The single most important growth diagnostic.
 *
 * Definition used here:
 *   - Cohort = month a contact was created (`contacts.created_at`).
 *   - Retention at week N = % of the cohort with ≥1 activity in week N
 *     (where week 1 starts on their cohort month, day 1).
 *
 * Returns a matrix: rows = cohorts, cols = weeks, value = % retained.
 */
import { db } from "@/lib/db";

const MS_DAY = 86400000;
const MS_WEEK = 7 * MS_DAY;

export interface CohortRow {
  cohort: string; // "2026-04"
  size: number; // contacts in cohort
  weeks: number[]; // week 0..N retention %
  totalRevenue: number;
  ageWeeks: number; // how many weeks old this cohort is (capped)
}

export interface RetentionReport {
  generatedAt: string;
  cohorts: CohortRow[];
  avgRetentionByWeek: number[]; // avg retention at each week across all cohorts
  bestCohort: { cohort: string; retention: number } | null;
  worstCohort: { cohort: string; retention: number } | null;
  overallAvgRetention: number;
  totalContactsAnalyzed: number;
  weeks: number; // max weeks shown
}

const WEEKS = 12;

function ymKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function cohortRetention(weeks = WEEKS): RetentionReport {
  // All contacts with their cohort month
  const contacts = db.prepare(`SELECT id, created_at FROM contacts`).all() as Record<string, unknown>[];
  if (!contacts.length) {
    return {
      generatedAt: new Date().toISOString(),
      cohorts: [],
      avgRetentionByWeek: new Array(weeks).fill(0),
      bestCohort: null,
      worstCohort: null,
      overallAvgRetention: 0,
      totalContactsAnalyzed: 0,
      weeks,
    };
  }

  // Bucket contacts into cohorts
  const cohortMap = new Map<string, number[]>();
  for (const c of contacts) {
    const k = ymKey(c.created_at);
    if (!cohortMap.has(k)) cohortMap.set(k, []);
    cohortMap.get(k)!.push(c.created_at);
  }

  // For each cohort, compute retention week-by-week
  const allIds = contacts.map((c: Record<string, unknown>) => c.id);
  // Pull all activity timestamps in one query for speed
  const placeholders = allIds.map(() => "?").join(",");
  const activities = db
    .prepare(
      `
    SELECT contact_id, created_at FROM activities
    WHERE contact_id IN (${placeholders})
  `,
    )
    .all(...allIds) as Record<string, unknown>[];

  // Group activity timestamps by contact_id
  const actsByContact = new Map<string, number[]>();
  for (const a of activities) {
    if (!actsByContact.has(a.contact_id)) actsByContact.set(a.contact_id, []);
    actsByContact.get(a.contact_id)!.push(a.created_at);
  }

  const sortedCohorts = Array.from(cohortMap.keys()).sort();
  const now = Date.now();

  const rows: CohortRow[] = [];
  for (const cohort of sortedCohorts) {
    const cohortTimes = cohortMap.get(cohort)!;
    const size = cohortTimes.length;
    const cohortStart = new Date(cohort + "-01T00:00:00Z").getTime();
    const ageWeeks = Math.min(weeks, Math.floor((now - cohortStart) / MS_WEEK) + 1);

    // For each week index 0..weeks-1, find contacts that had activity in that window
    const weekRet: number[] = new Array(weeks).fill(0);
    for (let w = 0; w < ageWeeks; w++) {
      const wStart = cohortStart + w * MS_WEEK;
      const wEnd = wStart + MS_WEEK;
      let active = 0;
      for (const ct of cohortTimes) {
        const id = contacts.find((c: Record<string, unknown>) => c.created_at === ct)!.id;
        const acts = actsByContact.get(id) || [];
        for (const ts of acts) {
          if (ts >= wStart && ts < wEnd) {
            active++;
            break;
          }
        }
      }
      weekRet[w] = size > 0 ? Math.round((active / size) * 100) : 0;
    }

    rows.push({
      cohort,
      size,
      weeks: weekRet,
      totalRevenue: 0, // computed separately below if needed
      ageWeeks,
    });
  }

  // Avg retention by week index (across all cohorts that have data for that week)
  const avgRetentionByWeek: number[] = new Array(weeks).fill(0);
  for (let w = 0; w < weeks; w++) {
    let sum = 0,
      n = 0;
    for (const r of rows)
      if (w < r.ageWeeks) {
        sum += r.weeks[w];
        n++;
      }
    avgRetentionByWeek[w] = n > 0 ? Math.round(sum / n) : 0;
  }

  // Best / worst cohort by week-4 retention (or whichever is most populated)
  const ranked = rows
    .filter((r) => r.ageWeeks >= 4)
    .map((r) => ({ cohort: r.cohort, retention: r.weeks[3] }))
    .sort((a, b) => b.retention - a.retention);
  const bestCohort = ranked[0] || null;
  const worstCohort = ranked[ranked.length - 1] || null;

  // Overall avg retention at week 4 (industry-standard signal)
  const overallAvgRetention = Math.round(
    ranked.reduce((s, r) => s + r.retention, 0) / Math.max(1, ranked.length),
  );

  return {
    generatedAt: new Date().toISOString(),
    cohorts: rows,
    avgRetentionByWeek,
    bestCohort,
    worstCohort,
    overallAvgRetention,
    totalContactsAnalyzed: contacts.length,
    weeks,
  };
}

/**
 * Single-formula retention score for the Nova intelligence layer.
 * Average 8-week retention across cohorts that have reached week 8.
 * 0..100.
 */
export function retentionScore(): {
  score: number;
  week8Retention: number;
  cohortsAtMaturity: number;
} {
  const report = cohortRetention(12);
  const mature = report.cohorts.filter((c) => c.ageWeeks >= 8);
  if (!mature.length) return { score: 0, week8Retention: 0, cohortsAtMaturity: 0 };
  const avg = Math.round(mature.reduce((s, c) => s + c.weeks[7], 0) / mature.length);
  return {
    score: avg,
    week8Retention: avg,
    cohortsAtMaturity: mature.length,
  };
}

/** Compact text/Markdown for reports */
export function retentionMarkdown(report: RetentionReport): string {
  const lines: string[] = [];
  lines.push(`## Cohort retention (week ${report.weeks})`);
  lines.push(
    `_${report.totalContactsAnalyzed} contacts analyzed · overall week-4 retention ${report.overallAvgRetention}%_`,
  );
  lines.push("");
  lines.push(`| Cohort | Size | W1 | W2 | W4 | W8 |`);
  lines.push(`|---|---:|---:|---:|---:|---:|`);
  for (const r of report.cohorts.slice(-6)) {
    lines.push(
      `| ${r.cohort} | ${r.size} | ${r.weeks[0]}% | ${r.weeks[1]}% | ${r.weeks[3]}% | ${r.weeks[7]}% |`,
    );
  }
  lines.push("");
  if (report.bestCohort)
    lines.push(
      `- ✅ Best cohort: **${report.bestCohort.cohort}** — ${report.bestCohort.retention}% retained at W4`,
    );
  if (report.worstCohort)
    lines.push(
      `- ⚠ Worst cohort: **${report.worstCohort.cohort}** — ${report.worstCohort.retention}% retained at W4`,
    );
  return lines.join("\n");
}
