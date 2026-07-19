import { describe, it, expect } from "vitest";
import { buildLoyalty } from "../src/loyalty/engine.js";

describe("loyalty engine", () => {
  it("diagnoses a leaking cohort and ranks onboarding #1 when churn is high + no onboarding", () => {
    const out = buildLoyalty({
      retentionRate: 0.6, churnRate: 0.4, repeatPurchaseRate: 0.3, nps: 20, ltv: 1200, cac: 400,
    });
    expect(out.healthScore).toBeGreaterThanOrEqual(0);
    expect(out.healthScore).toBeLessThanOrEqual(100);
    expect(out.fitBasis).toBe("real");
    expect(out.levers[0]!.id).toBe("onboarding"); // high churn + no onboarding → urgency 70
    expect(out.leak.churnRate).toBeCloseTo(0.4);
    expect(out.economics.ltvCacRatio).toBeCloseTo(3);
    expect(out.markdown).toContain("leaky bucket");
  });

  it("flags a critical leak when churn >= 0.4", () => {
    const out = buildLoyalty({ retentionRate: 0.5, churnRate: 0.45, activeCustomers: 100, newCustomersPerPeriod: 3 });
    expect(out.leak.verdict).toContain("critical");
    expect(out.leak.netGrowthPct).toBeLessThan(0);
  });

  it("structural diagnosis when no metrics supplied (defaults to a 'new' cohort)", () => {
    const out = buildLoyalty({});
    expect(out.fitBasis).toBe("structural");
    expect(out.ladderStage).toBe("new");
  });

  it("NPS bands map correctly", () => {
    expect(buildLoyalty({ nps: 60 }).npsBand).toBe("promoter");
    expect(buildLoyalty({ nps: -10 }).npsBand).toBe("detractor");
    expect(buildLoyalty({ nps: 20 }).npsBand).toBe("passive");
  });

  it("ranks referral #1 when promoters exist but no referral system", () => {
    const out = buildLoyalty({ retentionRate: 0.8, churnRate: 0.1, repeatPurchaseRate: 0.6, nps: 65, ltv: 1500, cac: 300 });
    expect(out.levers[0]!.id).toBe("referral");
    expect(out.ladderStage).toBe("loyal"); // promoter but no referral system → loyal, not advocate
  });

  it("reaches advocate/champion when referral + community are active with promoters", () => {
    const a = buildLoyalty({ retentionRate: 0.8, nps: 65, referralSystem: true });
    expect(a.ladderStage).toBe("advocate");
    const c = buildLoyalty({ retentionRate: 0.8, nps: 65, referralSystem: true, communityActive: true });
    expect(c.ladderStage).toBe("champion");
  });

  it("returns exactly 4 ranked levers", () => {
    const out = buildLoyalty({ retentionRate: 0.5 });
    expect(out.levers).toHaveLength(4);
    expect(out.levers[0]!.rank).toBe(1);
  });
});