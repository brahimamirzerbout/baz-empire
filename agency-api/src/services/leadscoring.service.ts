import type { LeadSignal, LeadScoreResult } from "../types";

/**
 * Inbound — lead scoring (fit × engagement × intent), 100-point model.
 *
 * Extracted from the dominator methodology of ORRJO (30,000+ prospects scored on
 * a 100-point model across 15+ buying signals) and the inbound leaders (HubSpot
 * partners, Ironpaper, RevenueZen). The model weights ICP fit (50), engagement
 * (30), and intent timing (20) — the same shape ORRJO uses to decide who gets
 * called first.
 *
 * Tier A (≥75) → sales-ready now. Tier B (50–74) → nurture. Tier C (<50) →
 * disqualify or long-term pool.
 *
 * Pure function — no I/O, deterministic. Unit-tested.
 */
export class LeadScoringService {
  static score(signal: LeadSignal): LeadScoreResult {
    if (signal.fitScore < 0 || signal.fitScore > 50)
      throw new Error("fitScore must be 0–50");
    if (signal.engagementScore < 0 || signal.engagementScore > 30)
      throw new Error("engagementScore must be 0–30");
    if (signal.intentScore < 0 || signal.intentScore > 20)
      throw new Error("intentScore must be 0–20");

    const totalScore = Math.round(signal.fitScore + signal.engagementScore + signal.intentScore);

    let tier: LeadScoreResult["tier"];
    let readyForSales: boolean;
    let recommendedAction: string;

    if (totalScore >= 75) {
      tier = "A";
      readyForSales = true;
      recommendedAction = "Route to SDR immediately — high fit + intent. Book within 48h.";
    } else if (totalScore >= 50) {
      tier = "B";
      readyForSales = false;
      recommendedAction = "Nurture with mid-funnel content; re-score when intent signal fires.";
    } else {
      tier = "C";
      readyForSales = false;
      recommendedAction = "Disqualify or move to long-term top-of-funnel pool. Do not spend SDR time.";
    }

    return { totalScore, tier, readyForSales, recommendedAction };
  }

  /**
   * Score a batch and return sorted, sales-ready leads only (Tier A).
   * Mirrors the ORRJO "shortlist of accounts where conditions for buying are
   * already in motion" output.
   */
  static scoreBatch(signals: LeadSignal[]): LeadScoreResult[] {
    return signals
      .map((s) => this.score(s))
      .filter((r) => r.readyForSales)
      .sort((a, b) => b.totalScore - a.totalScore);
  }
}