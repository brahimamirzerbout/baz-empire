/**
 * Loyalty marketing — the post-purchase ladder.
 *
 * Lineage: Deiss (customer value journey — Excite → Ascend → Advocate →
 * Promote → Refer) + Reichheld (NPS bands: detractor/passive/promoter; the
 * loyalty effect: +5% retention ≈ +25–95% profit, [fact] widely cited) +
 * Kennedy (the fortune is in the follow-up / the back-end) + Godin (permission
 * marketing, tribe/identity, smallest viable market) + Hormozi (retention is the
 * cheapest growth lever; LTV/CAC; the ascension/value ladder; the value equation
 * applied to existing customers) + Hopkins (loyalty must move a number —
 * retention rate, repeat rate, NPS, LTV).
 *
 * Acquisition minus churn = the leaky bucket. Most businesses pour acquisition
 * into a leaking bucket and call it growth. This engine scores the cohort's
 * ladder position + the leak + the retention economics, then ranks the 6
 * controllable levers by gap-urgency so the operator fixes the biggest leak first.
 */

/** Where a customer sits on the post-purchase ladder (Deiss + Reichheld). */
export type LoyaltyStage =
  | "new" // first purchase, not yet repeated (Deiss: Convert → Excite)
  | "repeat" // second+ purchase (Deiss: Adopt/Ascend)
  | "loyal" // habitual, predictable repeat (Deiss: Ascend)
  | "advocate" // refers unprompted, NPS promoter (Deiss: Advocate/Promote)
  | "champion" // recruits actively, identity-level (Deiss: Refer; Godin tribe)
  | "dormant" // lapsed, at risk of churn
  | "churned"; // lost

/** Reichheld NPS band. */
export type NpsBand = "detractor" | "passive" | "promoter";

/** One controllable loyalty lever (canonical set of 6). */
export interface LoyaltyLever {
  id: string;
  label: string;
  lineage: string;
  /** The concrete move to ship. */
  theMove: string;
  /** When this lever is the highest-leverage fix. */
  appliesWhen: string;
  /** Expected impact — [composite] until replaced with the client's real data. */
  expectedImpact: string;
}

export interface LoyaltyInput {
  /** % who repurchase / stay over the period (0–1). */
  retentionRate?: number;
  /** Observed churn (0–1); defaults to 1 − retention. */
  churnRate?: number;
  /** % who buy a 2nd time (0–1) — the new→repeat conversion. */
  repeatPurchaseRate?: number;
  /** Net Promoter Score (−100..100). */
  nps?: number;
  /** Lifetime value (currency). */
  ltv?: number;
  /** Customer acquisition cost (currency). */
  cac?: number;
  /** Average order value. */
  avgOrderValue?: number;
  /** Purchases per customer per year. */
  purchaseFrequency?: number;
  /** System state — which levers are already in place. */
  onboardingActive?: boolean;
  ascensionOffers?: boolean;
  continuityActive?: boolean;
  referralSystem?: boolean;
  communityActive?: boolean;
  winbackActive?: boolean;
  /** New customers acquired per period (for the leaky-bucket net growth calc). */
  newCustomersPerPeriod?: number;
  /** Active customer base size. */
  activeCustomers?: number;
}

export interface RankedLever extends LoyaltyLever {
  /** Gap-urgency score — higher = fix first. */
  urgency: number;
  rank: number;
}

export interface LoyaltyOutput {
  ladderStage: LoyaltyStage;
  npsBand: NpsBand;
  healthScore: number; // 0–100
  verdict: "strong" | "adequate" | "leaking" | "broken";
  leak: {
    churnRate: number;
    netGrowthPct: number; // acquisition − churn, as % of base
    leakRate: number; // churned per period / base
    verdict: string;
  };
  economics: {
    ltv: number | null;
    cac: number | null;
    ltvCacRatio: number | null;
    paybackWeeks: number | null;
    /** [composite] Hormozi/Reichheld: the profit lift from a +5% retention gain. */
    retentionMultiplier: string;
  };
  levers: RankedLever[];
  fitBasis: "real" | "structural";
  markdown: string;
}