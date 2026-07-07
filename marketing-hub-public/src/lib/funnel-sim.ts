/**
 * Funnel simulator — given impressions/CTR/CVR at each step, project
 * revenue and find the leakiest step. Helps a marketer stop guessing
 * where the funnel breaks.
 */
import { db } from "@/lib/db";

export interface FunnelStep {
  name: string;
  impressions: number;
  ctr: number; // 0..1 — rate at which step advances
  value: number; // dollars per conversion at this step
}

export interface FunnelResult {
  steps: Array<{
    name: string;
    impressions: number;
    conversions: number;
    dropoff: number; // absolute number lost
    dropoffRate: number; // 0..1 — % lost at this step
    revenue: number;
    leakScore: number; // 0..100 — higher = leakier
  }>;
  totalRevenue: number;
  totalConversions: number;
  overallCVR: number;
  leakiestStep: string | null;
}

export function simulateFunnel(steps: FunnelStep[]): FunnelResult {
  const out: FunnelResult["steps"] = [];
  let lastImpressions = 0;
  let totalRevenue = 0;
  let totalConversions = 0;

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    const impressions = i === 0 ? s.impressions : lastImpressions;
    const conversions = Math.round(impressions * s.ctr);
    const dropoff = impressions - conversions;
    const dropoffRate = impressions > 0 ? dropoff / impressions : 0;
    const revenue = conversions * s.value;

    out.push({
      name: s.name,
      impressions,
      conversions,
      dropoff,
      dropoffRate,
      revenue,
      // Leak score: penalize high drop-off + low CTR relative to step expectations
      leakScore: Math.round(dropoffRate * 100 * (1 - s.ctr) * 2),
    });

    lastImpressions = conversions;
    totalRevenue += revenue;
    totalConversions = conversions;
  }

  const overallCVR = steps[0]?.impressions ? totalConversions / steps[0].impressions : 0;
  const leakiest = [...out].sort((a, b) => b.leakScore - a.leakScore)[0];

  return {
    steps: out,
    totalRevenue: Math.round(totalRevenue),
    totalConversions,
    overallCVR,
    leakiestStep: leakiest && leakiest.leakScore > 30 ? leakiest.name : null,
  };
}

/** Load a saved funnel's steps from the DB and simulate it. */
export function simulateSavedFunnel(funnelId: string): FunnelResult | null {
  const row = db.prepare(`SELECT * FROM funnels WHERE id = ?`).get(funnelId) as Record<string, unknown> | undefined;
  if (!row) return null;
  let steps: FunnelStep[] = [];
  try {
    steps = JSON.parse(row.steps || "[]");
  } catch {
    return null;
  }
  if (!Array.isArray(steps) || !steps.length) return null;
  return simulateFunnel(steps);
}

/**
 * Default funnel pattern — a Kotler-style customer journey template
 * a marketer can clone and edit.
 */
export const DEFAULT_FUNNEL: FunnelStep[] = [
  { name: "Awareness", impressions: 100000, ctr: 0.05, value: 0 },
  { name: "Landing", impressions: 0, ctr: 0.35, value: 0 },
  { name: "Lead form", impressions: 0, ctr: 0.45, value: 0 },
  { name: "Email open", impressions: 0, ctr: 0.4, value: 0 },
  { name: "Sales call", impressions: 0, ctr: 0.25, value: 0 },
  { name: "Won", impressions: 0, ctr: 0.3, value: 1200 },
];
