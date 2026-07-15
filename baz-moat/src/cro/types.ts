/**
 * CRO — types for the conversion-rate-optimization engine.
 *
 * Surgical, not vibecoded: a heatmap is diagnostic, not analytical. A CRO tool
 * that tells you "where people click" but not "which fix moves the metric" is
 * a library. This engine takes observed friction signals + the client's
 * attribution baseline and outputs a *prioritized fix list* — ranked by
 * expected lift, not by what's easy to ship.
 *
 * Lineage: Hopkins (test-measure-refine) + Ogilvy (the one big idea) + Wiebe
 * (the "so what?" test). The BAZ attribution diagnostic feeds this — you
 * point experiments at the leak the data already found.
 */

/** A friction signal observed on the page. */
export interface FrictionSignal {
  id: string;
  /** Where on the funnel the friction lives. */
  location: "landing" | "form" | "checkout" | "pricing" | "nav" | "cta" | "above-fold" | "mobile";
  /** The signal type — what the diagnostic tool surfaced. */
  type: "rage-click" | "dead-click" | "drop-off" | "form-abandonment" | "slow-lcp" | "unclear-cta" | "no-proof" | "friction-copy";
  /** One-line description of what was observed. */
  observation: string;
  /** The funnel step this affects (1-indexed; 0 = whole page). */
  funnelStep: number;
  /** Traffic volume at this point (monthly sessions) — used for lift math. */
  monthlySessions?: number;
  /** Current conversion rate at this step (0-1), if known. */
  currentRate?: number;
}

/** A prioritized fix. */
export interface CROFix {
  rank: number;
  signalId: string;
  location: FrictionSignal["location"];
  /** The fix — one sentence, operator-grade. */
  fix: string;
  /** Expected lift band (conservative). */
  expectedLiftPct: number;
  /** Expected additional conversions/month, if the session + rate data is known. */
  expectedMonthlyConversions?: number;
  /** Effort to ship (hours). */
  effortHours: number;
  /** Whether this needs an A/B test to validate (stat power required) or can ship direct. */
  testRequired: boolean;
  /** The "so what?" — why this fix, not another. */
  rationale: string;
}

export interface CROInput {
  clientName: string;
  /** Monthly sessions to the page/funnel. */
  monthlySessions: number;
  /** Overall conversion rate of the funnel (0-1). */
  baselineRate: number;
  /** Average order value / conversion value (USD), for $ lift framing. */
  avgValue?: number;
  /** Observed friction signals. */
  signals: FrictionSignal[];
  /** Is Microsoft Clarity (or equivalent) instrumented? */
  hasReplay: boolean;
}

export interface CROOutput {
  clientName: string;
  monthlySessions: number;
  baselineRate: number;
  hasReplay: boolean;
  /** The single biggest hole, ranked #1. */
  biggestHole: string;
  fixes: CROFix[];
  /** Total expected monthly lift if all fixes ship (conservative sum, not additive). */
  totalExpectedLiftPct: number;
  /** Markdown deliverable. */
  markdown: string;
}