/**
 * Intent marketing — capturing the starving crowd that's already hungry.
 *
 * Lineage: Halbert (the starving crowd — intent buyers ARE the already-hungry,
 * at its most literal) + Schwartz (product-aware/most-aware — the copy is
 * mechanism/proof/offer, NOT education) + Kennedy (the irresistible offer + a
 * low-friction response device; intent buyers convert on the offer, not the
 * pitch) + Hopkins/Ogilvy (intent is the most measurable demand — keyword-level
 * conversion, testable) + Hormozi (intent traffic is expensive but converts Nx;
 * the value equation + CAC math must hold) + Deiss (bottom of the customer
 * value journey — the Convert acceleration) + Godin (tighter match, narrower
 * funnel, but the conversion is far higher).
 *
 * Intent = observed in-market behavior. The engine scores a 0–100 in-market
 * score from 9 weighted signals, stages the buyer (researching → comparing →
 * ready-to-buy), routes the capture plan per channel, and checks the intent-vs-
 * cold economics so you never pay intent prices for cold conversion.
 */

/** Where the buyer sits — Schwartz awareness mapped to intent stages. */
export type IntentStage = "researching" | "comparing" | "ready-to-buy";

/** Channel for the capture plan. */
export type IntentChannel = "search-sem" | "seo" | "retargeting" | "email" | "sales" | "third-party-intent";

/** One observed in-market signal. */
export interface IntentSignal {
  id: string;
  group: "search" | "site" | "email" | "third-party" | "social" | "funnel";
  label: string;
  /** Relative predictive power of in-market intent (weights sum to 1.0). */
  weight: number;
  why: string;
  provenance: string;
}

export interface IntentInput {
  /** Observed signal state: id → hit | miss | unknown. */
  signals?: Record<string, "hit" | "miss" | "unknown">;
  /** The ICP / starving crowd. */
  icp?: string;
  /** Buyer awareness (typically product-aware / most-aware for intent). */
  awareness?: "problem-aware" | "solution-aware" | "product-aware" | "most-aware";
  /** The offer / what they'd buy. */
  offer?: string;
  /** Channels available for capture (default: all). */
  channels?: IntentChannel[];
  /** Observed conversion rate on intent-matched traffic (0–1). */
  intentConversionRate?: number;
  /** Observed conversion rate on cold traffic (0–1) — for the lift calc. */
  coldConversionRate?: number;
  /** Intent traffic CAC (currency). */
  intentCac?: number;
  /** Customer LTV (currency) — for the CAC math. */
  ltv?: number;
}

export interface CaptureMove {
  channel: IntentChannel;
  move: string;
  appliesToStage: IntentStage;
}

export interface IntentOutput {
  intentScore: number; // 0–100
  intentStage: IntentStage;
  fitBasis: "real" | "structural";
  capturePlan: CaptureMove[];
  economics: {
    intentLift: string; // intent conv / cold conv
    cacMath: string;
    valueEquationCheck: string;
  };
  nextYes: string; // Kennedy response device — the lowest-friction next step
  warnings: string[];
  markdown: string;
}