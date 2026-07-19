import { describe, it, expect } from "vitest";
import { buildIntent, INTENT_SIGNALS } from "../src/intent/engine.js";

describe("intent engine", () => {
  it("signal weights sum to 1.0", () => {
    const sum = INTENT_SIGNALS.reduce((a, s) => a + s.weight, 0);
    expect(sum).toBeCloseTo(1.0, 2);
  });

  it("routes ready-to-buy (sales first) when demo-request + pricing hit, real basis", () => {
    const out = buildIntent({ signals: { "demo-request": "hit", "pricing-page": "hit" } });
    expect(out.fitBasis).toBe("real");
    expect(out.intentStage).toBe("ready-to-buy");
    expect(out.intentScore).toBe(38); // 0.20 + 0.18 (absolute evidence)
    expect(out.capturePlan[0]!.channel).toBe("sales");
    expect(out.markdown).toContain("Intent Marketing");
  });

  it("routes comparing when pricing/comparison signals hit", () => {
    const out = buildIntent({ signals: { "pricing-page": "hit", "comparison-page": "hit" } });
    expect(out.intentStage).toBe("comparing");
    expect(out.intentScore).toBe(25); // 0.18 + 0.07
  });

  it("routes researching when only a top-funnel signal hits", () => {
    const out = buildIntent({ signals: { "search-commercial": "hit", "repeat-visit": "miss" } });
    expect(out.intentStage).toBe("researching");
    expect(out.intentScore).toBe(12); // 0.12 only
  });

  it("structural default (comparing, 45) when no signals supplied", () => {
    const out = buildIntent({ icp: "B2B SaaS CMOs", offer: "ÆTHER DS" });
    expect(out.fitBasis).toBe("structural");
    expect(out.intentStage).toBe("comparing");
    expect(out.intentScore).toBe(45);
  });

  it("computes intent lift from real conversion rates", () => {
    const out = buildIntent({ signals: { "demo-request": "hit" }, intentConversionRate: 0.25, coldConversionRate: 0.05 });
    expect(out.economics.intentLift).toContain("5.0×");
  });

  it("warns when the CAC math fails (ltv < intentCac)", () => {
    const out = buildIntent({ signals: { "demo-request": "hit" }, intentCac: 2000, ltv: 800 });
    expect(out.warnings.join(" ")).toContain("FAILS");
  });

  it("absolute score: all signals hit → 100, all miss → 0", () => {
    const all = Object.fromEntries(INTENT_SIGNALS.map((s) => [s.id, "hit"])) as Record<string, "hit">;
    expect(buildIntent({ signals: all }).intentScore).toBe(100);
    const none = Object.fromEntries(INTENT_SIGNALS.map((s) => [s.id, "miss"])) as Record<string, "miss">;
    expect(buildIntent({ signals: none }).intentScore).toBe(0);
  });
});