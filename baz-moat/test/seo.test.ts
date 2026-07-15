import { describe, it, expect } from "vitest";
import { buildAISEO } from "../src/seo/engine.js";
import { scoreCoverage, extractTerms, tokenize, unionTopTerms } from "../src/seo/term-coverage.js";
import { resolveProvider, OfflineSerpProvider, SerpApiProvider } from "../src/seo/serp-client.js";
import type { SerpResult, AISEOInput } from "../src/seo/types.js";

function result(pos: number, title: string, snippet: string, da?: number): SerpResult {
  return { position: pos, title, url: `https://ex${pos}.com`, snippet, domainAuthority: da };
}

const snapshot: SerpResult[] = [
  result(1, "Best CRM for small teams: HubSpot vs Pipedrive vs Zoho", "Compare the best CRM software for small business. Pricing, features, ease of use, free tier.", 55),
  result(2, "Small business CRM comparison 2026", "Top CRM tools for small teams. Affordable, easy-to-use, free plan, integrations, pipeline management.", 48),
  result(3, "How to choose a CRM for startups", "Guide to selecting customer relationship management software. Free tier, data export, customization, automation.", 62),
];

const draft = `Our CRM for small teams is affordable, easy to use, and includes a free tier.
Compare features, pricing, and integrations. Manage your pipeline, automate follow-ups,
and export your data. The best CRM software for small business in 2026.`;

const input = (overrides: Partial<AISEOInput> = {}): AISEOInput => ({
  keyword: "best CRM for small teams",
  draft,
  brand: "Acme CRM",
  serpResults: snapshot,
  topN: 3,
  ...overrides,
});

describe("tokenize + extractTerms", () => {
  it("drops stopwords + short tokens, lowercases", () => {
    const tokens = tokenize("The Best CRM for Small Teams is Here!");
    expect(tokens).toContain("best");
    expect(tokens).toContain("crm");
    expect(tokens).toContain("teams");
    expect(tokens).not.toContain("the");
    expect(tokens).not.toContain("is");
  });

  it("extractTerms ranks by frequency", () => {
    const terms = extractTerms("crm crm crm pipeline pipeline free", 3);
    expect(terms[0]!.term).toBe("crm");
    expect(terms[0]!.count).toBe(3);
  });
});

describe("scoreCoverage", () => {
  it("returns a content score 0-100", () => {
    const c = scoreCoverage(draft, snapshot);
    expect(c.contentScore).toBeGreaterThanOrEqual(0);
    expect(c.contentScore).toBeLessThanOrEqual(100);
  });

  it("identifies missing terms the top results use but the draft doesn't", () => {
    const c = scoreCoverage("Our tool is great and fast.", snapshot);
    expect(c.missingTerms.length).toBeGreaterThan(0);
    // the draft is thin → low score
    expect(c.contentScore).toBeLessThan(50);
    expect(c.band).toBe("below");
  });

  it("a draft that uses the top terms scores higher", () => {
    const thin = scoreCoverage("Our tool is great", snapshot);
    const rich = scoreCoverage(draft, snapshot);
    expect(rich.contentScore).toBeGreaterThan(thin.contentScore);
  });
});

describe("unionTopTerms", () => {
  it("weights terms by how many top results use them", () => {
    const terms = unionTopTerms(snapshot);
    // "crm" appears in all 3 → high weight
    const crm = terms.find((t) => t.term === "crm");
    expect(crm).toBeDefined();
    expect(crm!.weight).toBeGreaterThan(0.5);
  });
});

describe("buildAISEO", () => {
  it("refuses to score with no SERP data (the surgical rule)", () => {
    const out = buildAISEO({ ...input(), serpResults: [] });
    expect(out.coverage.contentScore).toBe(0);
    expect(out.markdown).toContain("refuses to score");
    expect(out.markdown).not.toContain("Content Score 0/100 — **strong**");
  });

  it("produces a content score + band + missing terms for a real snapshot", () => {
    const out = buildAISEO(input());
    expect(out.coverage.contentScore).toBeGreaterThan(0);
    expect(["below", "approaching", "competitive", "strong"]).toContain(out.coverage.band);
    expect(out.coverage.missingTerms.length).toBeGreaterThanOrEqual(0);
  });

  it("authority gap flags high-DR SERPs", () => {
    const out = buildAISEO(input());
    expect(out.authorityGap.topAvgDA).toBeGreaterThan(40);
    expect(out.authorityGap.verdict).toContain("backlinks");
  });

  it("GEO not-checked line when no geoCitations", () => {
    const out = buildAISEO(input());
    expect(out.geoChecked).toBe(false);
    expect(out.markdown).toContain("GEO not checked");
  });

  it("GEO table renders when citations supplied", () => {
    const out = buildAISEO({
      ...input(),
      geoCitations: [
        { engine: "chatgpt", cited: true, citationUrl: "https://acme.com/crm", prompt: "best CRM for small teams", checkedAt: "2026-07-15" },
        { engine: "perplexity", cited: false, citationUrl: null, prompt: "best CRM for small teams", checkedAt: "2026-07-15" },
      ],
    });
    expect(out.geoChecked).toBe(true);
    expect(out.markdown).toContain("chatgpt");
    expect(out.markdown).toContain("✅ cited");
    expect(out.markdown).toContain("❌ not cited");
  });

  it("markdown contains the band line + missing terms + doctrine", () => {
    const out = buildAISEO(input());
    expect(out.markdown).toContain("Content Score");
    expect(out.markdown).toContain("Missing terms");
    expect(out.markdown).toContain("Hopkins");
    expect(out.markdown).toContain("SEO ≠ GEO");
  });
});

describe("serp providers", () => {
  it("resolveProvider returns null when no key + no snapshot", () => {
    expect(resolveProvider()).toBeNull();
  });

  it("resolveProvider returns offline when snapshot given", () => {
    const p = resolveProvider(snapshot);
    expect(p).toBeInstanceOf(OfflineSerpProvider);
  });

  it("resolveProvider returns SerpApi when key given (even with snapshot)", () => {
    const p = resolveProvider(snapshot, "test-key");
    expect(p).toBeInstanceOf(SerpApiProvider);
  });

  it("offline provider returns the snapshot", async () => {
    const p = new OfflineSerpProvider(snapshot);
    const results = await p.fetchTopResults("anything", 10);
    expect(results).toHaveLength(3);
    expect(results[0]!.position).toBe(1);
  });
});