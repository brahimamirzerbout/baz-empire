import type { AdMetricInput, BudgetReallocation } from "../types";

/**
 * Performance Marketing — ROAS-weighted budget reallocation.
 *
 * Aggregates per-channel spend/revenue, computes ROAS, weights each channel
 * by performance (penalising zero-conversion channels), and redistributes a
 * total available budget proportionally. Returns an actionable INCREASE /
 * DECREASE / HOLD verdict per channel with a reason.
 *
 * Pure function — no I/O, deterministic. Unit-tested.
 */
export class PerformanceService {
  static calculateOptimalBudgets(
    metrics: AdMetricInput[],
    totalAvailableBudget: number
  ): BudgetReallocation[] {
    if (metrics.length === 0) return [];
    if (totalAvailableBudget < 0) throw new Error("totalAvailableBudget must be >= 0");

    // 1. Aggregate per-channel stats
    const stats: Record<string, AdMetricInput & { spend: number; revenue: number; conversions: number; clicks: number }> = {};
    for (const m of metrics) {
      if (!stats[m.channel]) {
        stats[m.channel] = { ...m, spend: 0, revenue: 0, conversions: 0, clicks: 0 };
      }
      stats[m.channel].spend += m.budgetSpent;
      stats[m.channel].revenue += m.revenue;
      stats[m.channel].conversions += m.conversions;
      stats[m.channel].clicks += m.clicks;
    }

    const channels = Object.keys(stats);

    // 2. ROAS + performance weight (zero-conversion channels penalised)
    let totalWeight = 0;
    const perf = channels.map((channel) => {
      const s = stats[channel];
      const roas = s.spend > 0 ? s.revenue / s.spend : 0;
      const weight = s.conversions > 0 ? Math.max(roas, 0.1) : 0.01;
      totalWeight += weight;
      return { channel, currentBudget: s.spend, roas, weight };
    });

    // 3. Redistribute proportionally to weight
    return perf.map((item) => {
      const suggestedBudget =
        totalWeight > 0
          ? Math.round((item.weight / totalWeight) * totalAvailableBudget * 100) / 100
          : Math.round((totalAvailableBudget / channels.length) * 100) / 100;

      let action: BudgetReallocation["action"] = "HOLD";
      let reason = "Channel performance is stable.";

      if (suggestedBudget > item.currentBudget * 1.1) {
        action = "INCREASE";
        reason = `High ROAS of ${item.roas.toFixed(2)} indicates strong scalability. Allocate more budget.`;
      } else if (suggestedBudget < item.currentBudget * 0.9) {
        action = "DECREASE";
        reason = `Low ROAS of ${item.roas.toFixed(2)} underperforms against other channels. Minimise exposure.`;
      }

      return {
        channel: item.channel,
        currentBudget: item.currentBudget,
        suggestedBudget,
        roas: item.roas,
        action,
        reason,
      };
    });
  }
}