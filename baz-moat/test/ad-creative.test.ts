import { describe, it, expect } from "vitest";
import { buildAdCreative } from "../src/ad-creative/engine.js";
import { PLATFORM_SPECS, fitToLimit } from "../src/ad-creative/platform-specs.js";
import { scoreVariant, bandFor, statusFor } from "../src/ad-creative/predictive-score.js";
import type { AdCreativeInput, BrandKit, Platform } from "../src/ad-creative/types.js";

const brand: BrandKit = {
  name: "BAZ",
  colors: { primary: "#22D3EE", secondary: "#818CF8", accent: "#22D3EE", bg: "#020617", text: "#F8FAFC" },
  fonts: { heading: "Inter", body: "Inter" },
  voice: "senior, precise, confident",
};

const input = (overrides: Partial<AdCreativeInput> = {}): AdCreativeInput => ({
  brief: "Revenue Attribution Diagnostic",
  offer: "5-day audit, 10x guarantee — if we don't find a leak worth 10x the fee, you don't pay",
  awareness: "solution-aware",
  brand,
  platforms: ["meta-feed", "tiktok-feed", "linkedin-single"],
  proof: "Found $1.56M/yr leaked revenue for a $250k/mo SaaS in 5 days",
  ...overrides,
});

describe("platform specs", () => {
  it("all 7 platforms have correct dimensions + limits", () => {
    const platforms: Platform[] = ["meta-feed", "meta-reel", "meta-story", "google-display", "tiktok-feed", "linkedin-single", "x-single"];
    for (const p of platforms) {
      const s = PLATFORM_SPECS[p];
      expect(s.width).toBeGreaterThan(0);
      expect(s.height).toBeGreaterThan(0);
      expect(s.headlineMax).toBeGreaterThan(0);
      expect(s.bodyMax).toBeGreaterThan(0);
    }
  });

  it("fitToLimit truncates with ellipsis", () => {
    expect(fitToLimit("a very long headline that exceeds the limit", 10)).toBe("a very lo…");
    expect(fitToLimit("short", 10)).toBe("short");
  });
});

describe("predictive score", () => {
  it("a strong variant scores 75+", () => {
    const { score } = scoreVariant(
      { headline: "How to find $1.5M in leaked revenue in 5 days?", cta: "See how it works", appliedColors: brand.colors },
      input(),
    );
    expect(score).toBeGreaterThanOrEqual(75);
  });

  it("a weak variant (no proof, mismatched CTA) scores below 55", () => {
    const { score } = scoreVariant(
      { headline: "Our product is great", cta: "Buy now", appliedColors: brand.colors },
      { ...input(), awareness: "unaware", proof: undefined },
    );
    expect(score).toBeLessThan(55);
  });

  it("band + status thresholds", () => {
    expect(bandFor(80)).toBe("strong");
    expect(bandFor(60)).toBe("competitive");
    expect(bandFor(40)).toBe("weak");
    expect(statusFor(80)).toBe("ship");
    expect(statusFor(60)).toBe("hold");
    expect(statusFor(40)).toBe("kill");
  });

  it("CTA-intent match: problem-aware gets 'teardown', not 'buy now'", () => {
    const matched = scoreVariant(
      { headline: "The leak you can't see", cta: "Get the teardown", appliedColors: brand.colors },
      { ...input(), awareness: "problem-aware" },
    );
    const ctaFactor = matched.breakdown.find((f) => f.factor === "CTA-intent match")!;
    expect(ctaFactor.points).toBe(15);
  });

  it("CTA-intent mismatch: most-aware gets 'see the number' = mismatch", () => {
    const mismatched = scoreVariant(
      { headline: "Claim it now", cta: "See the number", appliedColors: brand.colors },
      { ...input(), awareness: "most-aware" },
    );
    const ctaFactor = mismatched.breakdown.find((f) => f.factor === "CTA-intent match")!;
    expect(ctaFactor.points).toBe(5);
  });
});

describe("buildAdCreative", () => {
  it("generates one variant per platform", () => {
    const out = buildAdCreative(input());
    expect(out.variants).toHaveLength(3);
    expect(out.variants.map((v) => v.platform).sort()).toEqual(["linkedin-single", "meta-feed", "tiktok-feed"]);
  });

  it("every headline fits its platform's limit", () => {
    const out = buildAdCreative(input({ platforms: ["meta-story", "tiktok-feed", "x-single"] }));
    for (const v of out.variants) {
      const spec = PLATFORM_SPECS[v.platform];
      expect(v.headline.length).toBeLessThanOrEqual(spec.headlineMax);
      expect(v.body.length).toBeLessThanOrEqual(spec.bodyMax);
      expect(v.cta.length).toBeLessThanOrEqual(spec.ctaMax);
    }
  });

  it("brand colors are applied to every variant", () => {
    const out = buildAdCreative(input());
    for (const v of out.variants) {
      expect(v.appliedColors.primary).toBe(brand.colors.primary);
      expect(v.appliedColors.accent).toBe(brand.colors.accent);
    }
  });

  it("a strong brief with proof + risk reversal produces ship-eligible variants", () => {
    const out = buildAdCreative(input());
    expect(out.shipCount).toBeGreaterThan(0);
    expect(out.avgScore).toBeGreaterThanOrEqual(55);
  });

  it("no proof + no risk reversal produces kill-eligible variants", () => {
    const out = buildAdCreative(input({ proof: undefined, offer: "our service", awareness: "unaware" }));
    expect(out.killCount).toBeGreaterThan(0);
  });

  it("markdown contains specs, scores, breakdowns, and doctrine", () => {
    const out = buildAdCreative(input());
    expect(out.markdown).toContain("Meta Feed");
    expect(out.markdown).toContain("TikTok Feed");
    expect(out.markdown).toContain("predictive score");
    expect(out.markdown).toContain("Ogilvy");
    expect(out.markdown).toContain("Score breakdown");
  });

  it("summary counts are consistent", () => {
    const out = buildAdCreative(input({ platforms: ["meta-feed", "meta-reel", "google-display", "linkedin-single"] }));
    expect(out.shipCount + out.holdCount + out.killCount).toBe(4);
  });
});