import type { InfluencerInput, InfluencerMatch } from "../types";

/**
 * Influencer Marketing — multi-factor campaign matcher.
 *
 * Scores influencers (0–100) on: category alignment (up to +30), engagement
 * rate (+20 / +10 / −15), and cost-per-follower efficiency (+10). Filters by
 * max budget per post. Returns ranked matches with estimated reach and
 * expected cost-per-engagement.
 *
 * Pure function — no I/O, deterministic. Unit-tested.
 */
export class InfluencerService {
  static calculateMatches(
    influencers: InfluencerInput[],
    targetCategories: string[],
    maxBudgetPerPost: number
  ): InfluencerMatch[] {
    if (maxBudgetPerPost < 0) throw new Error("maxBudgetPerPost must be >= 0");
    const targetLower = targetCategories.map((c) => c.toLowerCase());

    return influencers
      .filter((inf) => inf.costPerPost <= maxBudgetPerPost)
      .map((inf) => {
        let matchScore = 50; // base

        // 1. Category alignment (max +30)
        const matching = inf.categories.filter((c) => targetLower.includes(c.toLowerCase()));
        const ratio = targetCategories.length > 0 ? matching.length / targetCategories.length : 0;
        matchScore += ratio * 30;

        // 2. Engagement band
        if (inf.engagementRate >= 0.05) matchScore += 20;
        else if (inf.engagementRate >= 0.02) matchScore += 10;
        else matchScore -= 15;

        // 3. Cost-per-follower efficiency (benchmark $0.01/follower)
        const costPerFollower = inf.followers > 0 ? inf.costPerPost / inf.followers : Infinity;
        if (costPerFollower < 0.01) matchScore += 10;

        // Estimated outputs
        const estimatedReach = Math.round(inf.followers * inf.engagementRate);
        const expectedCostPerEngagement =
          estimatedReach > 0 ? Math.round((inf.costPerPost / estimatedReach) * 100) / 100 : inf.costPerPost;

        return {
          influencer: inf,
          matchScore: Math.round(Math.min(matchScore, 100)),
          estimatedReach,
          expectedCostPerEngagement,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }
}