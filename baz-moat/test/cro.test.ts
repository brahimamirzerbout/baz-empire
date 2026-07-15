import { describe, it, expect } from "vitest";
import { buildCRO, STAT_POWER_THRESHOLD } from "../src/cro/engine.js";
import type { CROInput, FrictionSignal } from "../src/cro/types.js";

function signal(
  id: string,
  type: FrictionSignal["type"],
  location: FrictionSignal["location"],
  observation: string,
  funnelStep = 1,
  monthlySessions?: number,
  currentRate?: number,
): FrictionSignal {
  return { id, type, location, observation, funnelStep, monthlySessions, currentRate };
}

const baseInput = (signals: FrictionSignal[], hasReplay = true): CROInput => ({
  clientName: "Acme SaaS",
  monthlySessions: 50_000,
  baselineRate: 0.03,
  avgValue: 1200,
  signals,
  hasReplay,
});

describe("buildCRO", () => {
  it("ranks fixes by lift-per-effort-hour (highest first)", () => {
    const input = baseInput([
      signal("a", "form-abandonment", "form", "12-field checkout form", 4, 8000, 0.01),
      signal("b", "dead-click", "nav", "logo not clickable", 1, 50000, 0.03),
      signal("c", "drop-off", "pricing", "70% drop at pricing step", 3, 12000, 0.05),
    ]);
    const out = buildCRO(input);
    // form-abandonment: 15/6 = 2.5 ; drop-off: 12/4 = 3.0 ; dead-click: 5/3 = 1.67
    // rank order: drop-off (3.0), form-abandonment (2.5), dead-click (1.67)
    expect(out.fixes[0]!.signalId).toBe("c");
    expect(out.fixes[1]!.signalId).toBe("a");
    expect(out.fixes[2]!.signalId).toBe("b");
  });

  it("the #1 fix is the biggest hole", () => {
    const out = buildCRO(baseInput([
      signal("a", "drop-off", "pricing", "70% drop at pricing step", 3, 12000, 0.05),
      signal("b", "dead-click", "nav", "logo", 1, 50000, 0.03),
    ]));
    expect(out.biggestHole).toContain("pricing");
  });

  it("expectedMonthlyConversions computed when sessions + rate known", () => {
    const out = buildCRO(baseInput([
      signal("a", "drop-off", "pricing", "70% drop", 3, 12000, 0.05),
    ]));
    // 12000 * 0.05 = 600 baseline conv; +12% lift = 72 additional
    expect(out.fixes[0]!.expectedMonthlyConversions).toBe(72);
  });

  it("flags testRequired=true when step conversions >= stat-power threshold", () => {
    const out = buildCRO(baseInput([
      signal("a", "drop-off", "pricing", "drop", 3, 100000, 0.02), // 2000 conv → test
    ]));
    expect(out.fixes[0]!.testRequired).toBe(true);
  });

  it("flags testRequired=false (ship direct) when below stat-power threshold", () => {
    const out = buildCRO(baseInput([
      signal("a", "dead-click", "nav", "logo", 1, 500, 0.03), // 15 conv → ship direct
    ]));
    expect(out.fixes[0]!.testRequired).toBe(false);
    expect(out.fixes[0]!.rationale).toContain("ship direct");
  });

  it("warns when replay is NOT instrumented", () => {
    const out = buildCRO(baseInput([signal("a", "rage-click", "cta", "button", 1)], false));
    expect(out.markdown).toContain("No replay instrumented");
    expect(out.markdown).toContain("Microsoft Clarity");
  });

  it("confirms replay when instrumented", () => {
    const out = buildCRO(baseInput([signal("a", "rage-click", "cta", "button", 1)], true));
    expect(out.markdown).toContain("Replay instrumented");
  });

  it("total lift is conservative non-additive (top 3 full, rest 50%)", () => {
    const out = buildCRO(baseInput([
      signal("a", "drop-off", "pricing", "d1", 3, 10000, 0.04), // 12%
      signal("b", "form-abandonment", "form", "d2", 4, 8000, 0.01), // 15%
      signal("c", "unclear-cta", "cta", "d3", 2, 20000, 0.02), // 10%
      signal("d", "dead-click", "nav", "d4", 1, 50000, 0.03), // 5%
    ]));
    // top 3 full: 12 + 15 + 10 = 37; 4th at 50%: 2.5; total = 39.5
    expect(out.totalExpectedLiftPct).toBe(39.5);
  });

  it("markdown contains the ranked table + doctrine + biggest hole", () => {
    const out = buildCRO(baseInput([
      signal("a", "drop-off", "pricing", "70% drop", 3, 12000, 0.05),
      signal("b", "rage-click", "cta", "buy button", 2, 20000, 0.02),
    ]));
    expect(out.markdown).toContain("Prioritized fixes");
    expect(out.markdown).toContain("biggest hole");
    expect(out.markdown).toContain("Hopkins");
    expect(out.markdown).toContain("Statistical power gate");
    expect(out.markdown).toContain("+12%");
  });

  it("prescribes reducing friction (Hopkins), not adding persuasion", () => {
    const out = buildCRO(baseInput([signal("a", "form-abandonment", "form", "12 fields", 4, 8000, 0.01)]));
    expect(out.fixes[0]!.fix.toLowerCase()).toContain("reduce");
  });

  it("stat power threshold is ~1000", () => {
    expect(STAT_POWER_THRESHOLD).toBe(1000);
  });

  it("empty signals → biggestHole says instrument Clarity first", () => {
    const out = buildCRO(baseInput([], false));
    expect(out.biggestHole).toContain("instrument Clarity");
  });
});