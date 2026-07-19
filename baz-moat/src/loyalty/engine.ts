/**
 * Loyalty marketing engine — deterministic cohort diagnosis + lever ranking.
 *
 * Surgical, not vibecoded. Deterministic + always-works (no LLM dependency).
 * Lineage: Deiss (CVJ) + Reichheld (NPS/loyalty effect) + Kennedy (back-end) +
 * Godin (tribe) + Hormozi (retention economics) + Hopkins (measure).
 */

import type {
  LoyaltyInput, LoyaltyOutput, LoyaltyStage, NpsBand, RankedLever, LoyaltyLever,
} from "./types.js";

/* ------------------------- canonical lever set --------------------------- */
const LEVER_DEFS: LoyaltyLever[] = [
  {
    id: "onboarding",
    label: "Onboarding / Excite",
    lineage: "Deiss (Excite) + Hopkins (deliver the first result fast, reason-why)",
    theMove: "Engineer the first 7–30 days post-purchase so the customer feels the promised result FAST. First-use guidance, the single 'aha' moment, a check-in at day 3/7/14. Most churn is early — this is the biggest leak plug.",
    appliesWhen: "churn is high and no structured post-purchase onboarding exists",
    expectedImpact: "[composite] cuts 30-day churn materially; the single highest-ROI lever for high early-churn cohorts.",
  },
  {
    id: "ascension",
    label: "Ascension ladder (back-end)",
    lineage: "Deiss (Ascend) + Kennedy (the fortune is in the follow-up / back-end) + Hormozi (value ladder)",
    theMove: "Build the upsell/cross-sell/subscription path: repeat → higher AOV → continuity. Most businesses optimize the first sale and leave the back-end empty — that's where the margin lives.",
    appliesWhen: "repeat rate is OK but LTV:CAC is weak and no ascension offers exist",
    expectedImpact: "[composite] LTV lift of 1.5–3x when a real ascension path replaces one-off sales.",
  },
  {
    id: "retention",
    label: "Retention / Continuity",
    lineage: "Kennedy (continuity/recurring) + Hormozi (retention is the cheapest growth lever)",
    theMove: "Make STAYING the default: subscription, habit-formation, milestone rewards, annual prepay. Retention compounds — a held customer is worth more than two acquired ones.",
    appliesWhen: "churn is high and there is no continuity/recurring mechanism",
    expectedImpact: "[composite] +5% retention ≈ +25–95% profit (Reichheld, [fact] widely cited).",
  },
  {
    id: "referral",
    label: "Referral system",
    lineage: "Deiss (Promote/Refer) + Reichheld (promoter economics) + Kennedy (response device)",
    theMove: "Turn promoters into recruiters: double-sided reward, frictionless share, ask at the peak satisfaction moment. A referred customer costs less and churns less than a paid one.",
    appliesWhen: "NPS is promoter-tier or advocates exist but there is no referral mechanism",
    expectedImpact: "[composite] referred CAC < paid CAC and referred LTV higher — the cheapest growth channel for promoter cohorts.",
  },
  {
    id: "community",
    label: "Community / Identity",
    lineage: "Godin (tribe, permission, 'people like us do things like this')",
    theMove: "Build the belonging layer: membership, identity, members-only space, rituals. Champions recruit for you when the brand becomes identity, not utility. The deepest moat.",
    appliesWhen: "advocates/champions exist but no community/identity layer to weaponize them",
    expectedImpact: "[composite] the only lever that compounds without spend; champions recruit at zero CAC.",
  },
  {
    id: "winback",
    label: "Win-back (dormant recovery)",
    lineage: "dormant recovery + Kennedy (re-activation offer)",
    theMove: "Recover churned/dormant with a reactivation flow: 'we miss you' + a reason-to-return offer + a survey on why they left. Recovered revenue is cheaper than acquired.",
    appliesWhen: "churn is high and there is no dormant/win-back flow",
    expectedImpact: "[composite] reactivates a slice of the lapsed base at a fraction of new-CAC.",
  },
];

/* ----------------------------- helpers ----------------------------------- */
function npsBand(nps: number | undefined): NpsBand {
  if (nps === undefined) return "passive";
  if (nps < 0) return "detractor";
  if (nps < 50) return "passive";
  return "promoter";
}

/** Derive the cohort's dominant ladder stage from the metrics (defaults to mid when absent). */
function ladderStage(input: LoyaltyInput): LoyaltyStage {
  const retention = input.retentionRate ?? 0.5;
  const churn = input.churnRate ?? (1 - retention);
  const repeat = input.repeatPurchaseRate ?? 0;
  const band = npsBand(input.nps);
  if (churn > retention && retention < 0.5) return "churned";
  if (retention < 0.3) return "dormant";
  if (band === "promoter" && input.referralSystem && input.communityActive) return "champion";
  if (band === "promoter" && input.referralSystem) return "advocate";
  if (retention >= 0.7 && repeat >= 0.5) return "loyal";
  if (repeat >= 0.25) return "repeat";
  return "new";
}

/** 0–100 loyalty health score (blend: retention × 40 + NPS × 30 + LTV:CAC × 20 + lever coverage × 10). */
function healthScore(input: LoyaltyInput, leverCoverage: number): number {
  const ret = (input.retentionRate ?? 0.5) * 100; // 0–100
  const nps = input.nps === undefined ? 30 : Math.max(0, Math.min(100, ((input.nps + 100) / 200) * 100)); // −100..100 → 0..100
  const ratio = input.ltv && input.cac && input.cac > 0 ? Math.min(100, (input.ltv / input.cac) * 20) : 40; // 5:1 → 100
  const cov = leverCoverage * 10; // 0..6 → 0..60, scaled into 100 via weight
  const score = ret * 0.4 + nps * 0.3 + Math.min(100, ratio) * 0.2 + Math.min(100, cov) * 0.1;
  return Math.round(Math.max(0, Math.min(100, score)));
}

/** Rank the 6 levers by gap-urgency for THIS cohort (deterministic). */
function rankLevers(input: LoyaltyInput): RankedLever[] {
  const churn = input.churnRate ?? (input.retentionRate !== undefined ? 1 - input.retentionRate : 0.2);
  const repeat = input.repeatPurchaseRate ?? 0.3;
  const band = npsBand(input.nps);
  const ratio = input.ltv && input.cac && input.cac > 0 ? input.ltv / input.cac : null;
  const stage = ladderStage(input);

  const urgency: Record<string, number> = {
    onboarding: (churn > 0.25 ? 40 : churn > 0.15 ? 20 : 5) + (input.onboardingActive ? 0 : 30) + (repeat < 0.25 ? 15 : 0),
    ascension: (ratio !== null && ratio < 3 ? 30 : 0) + (input.ascensionOffers ? 0 : 30) + (repeat >= 0.4 && (input.ltv ?? 0) < (input.cac ?? 0) * 3 ? 20 : 0),
    referral: (band === "promoter" ? 30 : 0) + (input.referralSystem ? 0 : 30) + ((input.cac ?? 0) > 0 ? 15 : 0),
    retention: (churn > 0.2 ? 25 : 10) + (input.continuityActive ? 0 : 20) + (churn > 0.3 ? 15 : 0),
    community: (band === "promoter" && !input.communityActive ? 25 : 0) + ((stage === "advocate" || stage === "champion") && !input.communityActive ? 20 : 0),
    winback: (churn > 0.2 && !input.winbackActive ? 35 : 0) + (stage === "dormant" || stage === "churned" ? 20 : 0),
  };

  return LEVER_DEFS
    .map((l) => ({ ...l, urgency: urgency[l.id] ?? 0 }))
    .sort((a, b) => b.urgency - a.urgency)
    .map((l, i) => ({ ...l, rank: i + 1 }));
}

function verdict(score: number): LoyaltyOutput["verdict"] {
  if (score >= 75) return "strong";
  if (score >= 55) return "adequate";
  if (score >= 35) return "leaking";
  return "broken";
}

/* ------------------------------- render ---------------------------------- */
function render(out: Omit<LoyaltyOutput, "markdown">, input: LoyaltyInput): string {
  const leverRows = out.levers
    .map((l) => `| ${l.rank} | **${l.label}** | ${l.lineage} | ${l.theMove} | ${l.expectedImpact} |`)
    .join("\n");
  const econ = out.economics;
  const econLine = econ.ltvCacRatio === null
    ? "— (supply ltv + cac for the ratio)"
    : `${econ.ltvCacRatio.toFixed(1)}:1 (ltv ${econ.ltv} / cac ${econ.cac}) · payback ${econ.paybackWeeks === null ? "—" : econ.paybackWeeks + "w"}`;
  return `# Loyalty Marketing Diagnosis

**Ladder stage:** ${out.ladderStage}
**NPS band:** ${out.npsBand}${input.nps !== undefined ? ` (${input.nps})` : ""}
**Health score:** ${out.healthScore}/100 — **${out.verdict}**

## The leaky bucket (acquisition − churn)

| Metric | Value |
|---|---|
| Churn rate | ${(out.leak.churnRate * 100).toFixed(0)}% |
| Leak rate (churned/period ÷ base) | ${(out.leak.leakRate * 100).toFixed(1)}% |
| Net growth | ${out.leak.netGrowthPct >= 0 ? "+" : ""}${out.leak.netGrowthPct.toFixed(1)}% |
| Verdict | ${out.leak.verdict} |

> Most businesses pour acquisition into a leaking bucket and call it growth.
> If churn ≥ acquisition, you are shrinking while your spend goes up. Fix the leak first.

## Retention economics

| Metric | Value |
|---|---|
| LTV:CAC | ${econLine} |
| Retention multiplier | ${econ.retentionMultiplier} |

## Levers, ranked by gap-urgency (fix #1 first)

| # | Lever | Lineage | The move | Expected impact |
|---|---|---|---|---|
${leverRows}

## Doctrine
- **Retention is the cheapest growth lever** (Hormozi). A held customer > two acquired.
- **The fortune is in the follow-up / back-end** (Kennedy). The first sale opens the door; the ascension ladder is where the margin lives.
- **+5% retention ≈ +25–95% profit** (Reichheld, [fact] widely cited). Retention compounds; acquisition linear.
- **Promoters are a wasted asset without a referral mechanism** (Deiss/Reichheld). Turn them into recruiters.
- **Identity is the only lever that compounds without spend** (Godin). Champions recruit at zero CAC.

## Lineage held
- **Deiss** — customer value journey: Excite → Ascend → Advocate → Promote → Refer.
- **Reichheld** — NPS bands; the loyalty effect (retention profit multiplier).
- **Kennedy** — the back-end; continuity; the follow-up fortune.
- **Godin** — permission, tribe, identity, smallest viable market.
- **Hormozi** — retention economics, LTV/CAC, the value ladder, ascension offers.
- **Hopkins** — loyalty must move a number: retention, repeat rate, NPS, LTV.

> ${out.fitBasis === "structural" ? "[composite] structural diagnosis — supply real retention/churn/nps/ltv/cac for a real score." : "Real diagnosis — scored from observed cohort metrics."} The ladder is the architecture; the numbers must be yours.
`;
}

/* ------------------------------- entry ----------------------------------- */
export function buildLoyalty(input: LoyaltyInput): LoyaltyOutput {
  const hasIntel = input.retentionRate !== undefined || input.churnRate !== undefined ||
    input.nps !== undefined || input.ltv !== undefined;
  const fitBasis: "real" | "structural" = hasIntel ? "real" : "structural";

  const retention = input.retentionRate ?? 0.5;
  const churn = input.churnRate ?? (1 - retention);
  const base = input.activeCustomers ?? 100;
  const newCust = input.newCustomersPerPeriod ?? 0;
  const leakRate = base > 0 ? (churn * base) / base : churn;
  const netGrowthPct = base > 0 ? ((newCust - churn * base) / base) * 100 : 0;
  const leakVerdict = churn >= 0.4 ? "critical — the bucket is draining faster than you fill it"
    : churn >= 0.2 ? "leaking — acquisition is partly cancelling churn"
    : "contained — retention is doing its job";

  const leverCoverage = [
    input.onboardingActive, input.ascensionOffers, input.continuityActive,
    input.referralSystem, input.communityActive, input.winbackActive,
  ].filter(Boolean).length;
  const score = healthScore(input, leverCoverage);

  const ltv = input.ltv ?? null;
  const cac = input.cac ?? null;
  const ltvCacRatio = ltv !== null && cac !== null && cac > 0 ? ltv / cac : null;
  const freq = input.purchaseFrequency ?? 0;
  const paybackWeeks = ltv !== null && cac !== null && cac > 0 && freq > 0
    ? Math.round((cac / (input.avgOrderValue ?? ltv) / freq) * 52) : null;
  const retentionMultiplier = "[composite] +5% retention ≈ +25–95% profit (Reichheld). Apply to your cohort for the real lift.";

  const levers = rankLevers(input).slice(0, 4);

  const partial = {
    ladderStage: ladderStage(input),
    npsBand: npsBand(input.nps),
    healthScore: score,
    verdict: verdict(score),
    leak: { churnRate: churn, netGrowthPct, leakRate, verdict: leakVerdict },
    economics: { ltv, cac, ltvCacRatio, paybackWeeks, retentionMultiplier },
    levers,
    fitBasis,
  };
  const markdown = render(partial, input);
  return { ...partial, markdown };
}