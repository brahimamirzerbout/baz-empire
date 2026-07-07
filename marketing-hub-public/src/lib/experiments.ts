/**
 * Experiment decision engine — given an A/B test result, recommend
 * ship / iterate / kill based on lift, sample size, and confidence.
 *
 * Uses a frequentist two-proportion z-test for statistical significance
 * and Bayesian reasoning for sample-size adequacy.
 */
import { db } from "@/lib/db";

export interface ExperimentData {
  variant_a_users: number;
  variant_a_conversions: number;
  variant_b_users: number;
  variant_b_conversions: number;
}

export type Verdict = "ship" | "iterate" | "keep_running" | "kill";

export interface Decision {
  verdict: Verdict;
  reason: string;
  metrics: {
    a_cvr: number;
    b_cvr: number;
    lift_pct: number;
    p_value: number;
    confidence_pct: number;
    min_sample_needed: number;
    sample_adequacy: number; // 0..1
  };
  recommendation: string;
}

function erf(x: number): number {
  // Abramowitz & Stegun approximation
  const a1 = 0.254829592,
    a2 = -0.284496736,
    a3 = 1.421413741,
    a4 = -1.453152027,
    a5 = 1.061405429,
    p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + p * ax);
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax);
  return sign * y;
}

function normalCdf(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

export function decideExperiment(
  data: ExperimentData,
  baseline: { min_lift_pct?: number; min_confidence?: number } = {},
): Decision {
  const minLift = baseline.min_lift_pct ?? 5; // need at least 5% relative lift to ship
  const minConf = baseline.min_confidence ?? 90;

  const aCvr = data.variant_a_users > 0 ? data.variant_a_conversions / data.variant_a_users : 0;
  const bCvr = data.variant_b_users > 0 ? data.variant_b_conversions / data.variant_b_users : 0;
  const liftPct = aCvr > 0 ? ((bCvr - aCvr) / aCvr) * 100 : 0;

  // Two-proportion z-test
  const pPool =
    (data.variant_a_conversions + data.variant_b_conversions) /
    Math.max(1, data.variant_a_users + data.variant_b_users);
  const seDenom = Math.sqrt(
    pPool *
      (1 - pPool) *
      (1 / Math.max(1, data.variant_a_users) + 1 / Math.max(1, data.variant_b_users)),
  );
  const z = seDenom > 0 ? (bCvr - aCvr) / seDenom : 0;
  const pValue = 2 * (1 - normalCdf(Math.abs(z))); // two-tailed
  const confidencePct = (1 - pValue) * 100;

  // Sample size: to detect a 5% lift at 80% power & 95% confidence, need ~31000 per variant
  // We'll use a simpler heuristic: 1000 conversions per variant = good signal
  const minSampleNeeded = Math.max(1000, Math.ceil(31000 * (minLift / 5)));
  const sampleAdequacy = Math.min(
    1,
    Math.min(data.variant_a_users, data.variant_b_users) / minSampleNeeded,
  );

  let verdict: Verdict;
  let reason: string;
  let recommendation: string;

  if (liftPct < 0 && confidencePct >= minConf) {
    verdict = "kill";
    reason = `Variant B is ${Math.abs(liftPct).toFixed(1)}% worse with ${confidencePct.toFixed(1)}% confidence. Stick with A.`;
    recommendation = "Document the failed hypothesis, archive the test, move on.";
  } else if (liftPct < minLift && sampleAdequacy >= 0.9) {
    verdict = "kill";
    reason = `No meaningful lift (${liftPct.toFixed(1)}%) after adequate sample.`;
    recommendation =
      "Either the hypothesis was wrong or the variant is too subtle. Try a bolder change.";
  } else if (liftPct >= minLift && confidencePct >= minConf) {
    verdict = "ship";
    reason = `${liftPct.toFixed(1)}% lift with ${confidencePct.toFixed(1)}% confidence.`;
    recommendation = "Ship variant B as default. Plan a follow-up test to push the lift further.";
  } else if (sampleAdequacy < 0.5) {
    verdict = "keep_running";
    reason = `Not enough data yet (${(sampleAdequacy * 100).toFixed(0)}% of recommended sample).`;
    recommendation = `Run for ~${Math.ceil((minSampleNeeded - Math.min(data.variant_a_users, data.variant_b_users)) / Math.max(1, (data.variant_a_users + data.variant_b_users) / 7))} more days. Don't peek.`;
  } else {
    verdict = "iterate";
    reason = `Trend positive (${liftPct.toFixed(1)}%) but confidence below ${minConf}% (currently ${confidencePct.toFixed(1)}%).`;
    recommendation = "Either let it run longer, or push the variant bolder to widen the gap.";
  }

  return {
    verdict,
    reason,
    metrics: {
      a_cvr: Math.round(aCvr * 1000) / 10, // as percent with 1 decimal
      b_cvr: Math.round(bCvr * 1000) / 10,
      lift_pct: Math.round(liftPct * 10) / 10,
      p_value: Math.round(pValue * 10000) / 10000,
      confidence_pct: Math.round(confidencePct * 10) / 10,
      min_sample_needed: minSampleNeeded,
      sample_adequacy: Math.round(sampleAdequacy * 100) / 100,
    },
    recommendation,
  };
}

/** Wire it up to an experiment in the DB. */
export function decideForExperiment(experimentId: string): Decision | null {
  const e = db.prepare(`SELECT * FROM experiments WHERE id = ?`).get(experimentId) as Record<string, unknown> | undefined;
  if (!e) return null;
  // Experiments table may store results in metrics JSON
  let metrics: Record<string, unknown> = {};
  try {
    metrics = JSON.parse(e.metrics || "{}");
  } catch {}
  return decideExperiment({
    variant_a_users: Number(metrics.a_users || metrics.variant_a_users || 0),
    variant_a_conversions: Number(metrics.a_conversions || metrics.variant_a_conversions || 0),
    variant_b_users: Number(metrics.b_users || metrics.variant_b_users || 0),
    variant_b_conversions: Number(metrics.b_conversions || metrics.variant_b_conversions || 0),
  });
}
