import { describe, it, expect } from "vitest";
import { buildSocial, ALL_PLATFORMS } from "../src/social-platforms/engine.js";
import { PLATFORMS } from "../src/social-platforms/platforms.js";
import { TRENDS, TRENDS_BY_PLATFORM, buildTrendHistory } from "../src/social-platforms/trends.js";
import {
  buildTrendCurve,
  segmentFromAdoption,
  chasmRiskFromAdoption,
  winAtStage,
  trendsetterPlaybook,
} from "../src/social-platforms/trend-curve.js";
import type { SocialInput } from "../src/social-platforms/types.js";

describe("platform models", () => {
  it("models all 7 platforms", () => {
    expect(PLATFORMS).toHaveLength(7);
    expect(ALL_PLATFORMS).toHaveLength(7);
  });

  it("algorithm weights sum to 1.0 per platform", () => {
    for (const p of PLATFORMS) {
      const sum = p.algorithm.reduce((a, s) => a + s.weight, 0);
      expect(sum).toBeCloseTo(1.0, 2);
    }
  });

  it("every platform has variables, nativeFormat, cadence, reachKiller, provenance", () => {
    for (const p of PLATFORMS) {
      expect(p.variables.length).toBeGreaterThanOrEqual(5);
      expect(p.nativeFormat.aspect).toBeTruthy();
      expect(p.cadence).toBeTruthy();
      expect(p.reachKiller).toBeTruthy();
      expect(p.provenance.length).toBeGreaterThan(0);
    }
  });
});

describe("trend registry", () => {
  it("has 32 trends total, >=3 per platform", () => {
    expect(TRENDS).toHaveLength(32);
    for (const id of ALL_PLATFORMS) {
      expect(TRENDS_BY_PLATFORM[id].length).toBeGreaterThanOrEqual(3);
    }
  });

  it("every trend has origin/peak/abandoned/successor/status + a provenance tag", () => {
    for (const t of TRENDS) {
      expect(t.origin.when).toBeTruthy();
      expect(t.peak).toBeTruthy();
      expect(t.abandoned.when).toBeTruthy();
      expect(t.successor).toBeTruthy();
      expect(t.provenance).toMatch(/\[(fact|assumption|composite)\]/);
    }
  });
});

describe("buildSocial", () => {
  const base: SocialInput = {
    goal: "Launch the ÆTHER design system to BAZ's ICP",
    icp: "Series A-B B2B SaaS CMOs burned by junior-pod agencies",
    awareness: "solution-aware",
    topic: "seed-algorithmic design systems",
  };

  it("returns a native brief per platform (all 7 by default) with a trend-lifecycle read", () => {
    const out = buildSocial(base);
    expect(out.perPlatform).toHaveLength(7);
    for (const p of out.perPlatform) {
      expect(p.algorithmFit).toBeGreaterThanOrEqual(0);
      expect(p.algorithmFit).toBeLessThanOrEqual(100);
      expect(p.nativeBrief.hook).toBeTruthy();
      expect(p.trendLifecycle).toBeDefined();
    }
    expect(out.markdown).toContain("algorithm-fit");
  });

  it("respects a platform subset", () => {
    const out = buildSocial({ ...base, platforms: ["tiktok", "linkedin"] });
    expect(out.perPlatform).toHaveLength(2);
  });

  it("scores 'real' when observed signals supplied", () => {
    const out = buildSocial({
      ...base,
      platforms: ["tiktok"],
      signals: { tiktok: { "watch-time": "hit", completion: "hit", shares: "miss" } },
    });
    expect(out.perPlatform[0]!.fitBasis).toBe("real");
  });

  it("scores 'structural' when no signals supplied", () => {
    const out = buildSocial({ ...base, platforms: ["tiktok"] });
    expect(out.perPlatform[0]!.fitBasis).toBe("structural");
  });
});

describe("buildTrendHistory", () => {
  it("renders all 7 platforms by default", () => {
    const out = buildTrendHistory();
    expect(out.perPlatform).toHaveLength(7);
    expect(out.markdown).toContain("origin → adopters");
  });

  it("respects a platform subset", () => {
    const out = buildTrendHistory(["pinterest"]);
    expect(out.perPlatform).toHaveLength(1);
  });
});

describe("trend curve + chasm", () => {
  it("segments map correctly", () => {
    expect(segmentFromAdoption(1)).toBe("innovators");
    expect(segmentFromAdoption(10)).toBe("early-adopters");
    expect(segmentFromAdoption(30)).toBe("early-majority");
    expect(segmentFromAdoption(60)).toBe("late-majority");
    expect(segmentFromAdoption(90)).toBe("laggards");
  });

  it("chasm risk maps correctly", () => {
    expect(chasmRiskFromAdoption(5)).toBe("pre-chasm");
    expect(chasmRiskFromAdoption(16)).toBe("in-chasm");
    expect(chasmRiskFromAdoption(40)).toBe("post-chasm");
  });

  it("builds a real curve with graph + win-at-stage + 7-step trendsetter", () => {
    const out = buildTrendCurve({ platform: "tiktok", trend: "AI VO shorts", adoptionPct: 15, velocity: 5 });
    expect(out.segment).toBe("early-adopters");
    expect(out.chasmRisk).toBe("in-chasm");
    expect(out.fitBasis).toBe("real");
    expect(out.chasmGraph).toContain("CHASM");
    expect(out.winAtStage.length).toBeGreaterThan(0);
    expect(out.trendsetterPlaybook).toHaveLength(7);
    expect(out.timeToPeakWeeks).toBe(Math.round((50 - 15) / 5)); // 7 weeks
    expect(out.markdown).toContain("How to win at this stage");
  });

  it("derives a structural stage from a registry id", () => {
    const out = buildTrendCurve({ platform: "tiktok", fromRegistryId: "tt-dance" });
    expect(out.trend).toBe("Dance challenges");
    expect(out.fitBasis).toBe("structural");
    expect(out.segment).toBe("laggards"); // adoption 90 (abandoned)
  });

  it("win-at-stage returns the chasm/beachhead playbook when in-chasm", () => {
    const w = winAtStage("early-adopters", "in-chasm", "tiktok");
    expect(w.join(" ")).toContain("beachhead");
  });

  it("trendsetter playbook names the category + the canonical example", () => {
    const s = trendsetterPlaybook("linkedin").join(" ");
    expect(s).toContain("NAME");
    expect(s).toContain("CANONICAL");
  });
});