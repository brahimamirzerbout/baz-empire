/**
 * AI-SEO / GEO engine — orchestrates SERP fetch → term-coverage → authority gap
 * → GEO citations → markdown report.
 *
 * Surgical rules:
 *   1. No SERP data (no live key + no snapshot) → engine REFUSES to score.
 *      Never guess. Never score against a stale index.
 *   2. Authority gap: if the top 3 all have DR 50+ and the client is DR 28,
 *      flag it (Ahrefs-style: "don't chase this keyword yet").
 *   3. GEO ≠ SEO: a high content score with zero GEO citations is a flag —
 *      you're invisible in the AI answers.
 */

import type { AISEOInput, AISEOOutput, SerpResult, TermCoverage } from "./types.js";
import { scoreCoverage } from "./term-coverage.js";

function assessAuthorityGap(results: SerpResult[]): { topAvgDA: number | null; verdict: string } {
  const das = results.slice(0, 3).map((r) => r.domainAuthority).filter((d): d is number => d != null);
  if (das.length === 0) return { topAvgDA: null, verdict: "No domain-authority data from the SERP provider — can't assess the authority gap. Supply DA for a complete read." };
  const avg = Math.round(das.reduce((s, d) => s + d, 0) / das.length);
  const verdict = avg >= 50
    ? `Top 3 average DR ${avg}. Competing here requires either strong backlinks or a defensible content angle. Don't out-volume them — out-niche them.`
    : avg >= 30
      ? `Top 3 average DR ${avg}. Mid-authority — winnable with a sharp content angle + internal linking, not just term coverage.`
      : `Top 3 average DR ${avg}. Low-authority SERP — term coverage + basic on-page will rank here.`;
  return { topAvgDA: avg, verdict };
}

function render(input: AISEOInput, coverage: TermCoverage, authorityGap: AISEOOutput["authorityGap"], geoChecked: boolean): string {
  const missingRows = coverage.missingTerms
    .slice(0, 20)
    .map((t) => `| ${t.term} | ${(t.weight * 100).toFixed(1)}% |`)
    .join("\n");

  const geoLine = !geoChecked
    ? `> ❓ **GEO not checked.** Add the --geo flag to test citation in ChatGPT/Perplexity/Gemini/AI Overviews. A high content score with zero AI-visibility = invisible in the answers layer.`
    : input.geoCitations && input.geoCitations.length > 0
      ? input.geoCitations.map((c) => `| ${c.engine} | ${c.cited ? "✅ cited" : "❌ not cited"} | ${c.citationUrl ?? "—"} |`).join("\n")
      : `> No GEO citations found for "${input.keyword}".`;

  const bandLine =
    coverage.band === "strong"
      ? `> ✅ Content Score ${coverage.contentScore} — **strong**. Ship it (after a human read — the score measures term coverage, not quality).`
      : coverage.band === "competitive"
        ? `> 🟡 Content Score ${coverage.contentScore} — **competitive**. Add the missing terms below, re-score, target 85+.`
        : coverage.band === "approaching"
          ? `> 🟠 Content Score ${coverage.contentScore} — **approaching**. Significant term gaps remain. Fill them before publishing.`
          : `> ❌ Content Score ${coverage.contentScore} — **below**. This draft won't rank regardless of backlinks. Rebuild the brief.`;

  return `# AI-SEO / GEO Report — "${input.keyword}"

**Brand:** ${input.brand ?? "(not specified)"}
**Top results analyzed:** ${input.topN}
**SERP source:** ${input.serpResults.length > 0 ? "live/snapshot" : "NONE — engine refused to guess"}

## Term-coverage score

${bandLine}

| Metric | Value |
|---|---|
| Content Score | **${coverage.contentScore}/100** |
| Band | ${coverage.band} |
| Matched terms | ${coverage.matchedTerms.length} |
| Missing terms | ${coverage.missingTerms.length} |

## Missing terms (the gap — add these to the draft)

| Term | SERP weight |
|---|---|
${missingRows || "| _(no gap — all top terms covered)_ | — |"}

## Authority context

${authorityGap.verdict}

## GEO / AI-visibility

${geoLine}

## Doctrine held
- Hopkins: test-measure-refine. Score the draft, fix the gap, re-score. Don't publish a sub-50 draft.
- Schwartz: term coverage is the mechanism in a saturated SERP — claims don't rank, the term distribution does.
- SEO ≠ GEO: a page-1 ranking that isn't cited in ChatGPT/Perplexity is invisible to the growing share of zero-click AI searches. Track both.

> This is a *scoring engine*, not a content generator. The score tells you what to add; the
> words must be the prospect's (Wiebe), not a keyword-stuffed inversion of the SERP.
`;
}

/** Build the full AI-SEO/GEO output. */
export function buildAISEO(input: AISEOInput): AISEOOutput {
  const topN = input.topN ?? 10;
  const serpResults = input.serpResults.slice(0, topN);

  // Rule 1: no SERP data → refuse.
  if (serpResults.length === 0) {
    return {
      keyword: input.keyword,
      brand: input.brand ?? null,
      topN,
      coverage: {
        draftTerms: [], topTerms: [], missingTerms: [], matchedTerms: [],
        contentScore: 0, band: "below",
      },
      authorityGap: { topAvgDA: null, verdict: "No SERP data — supply a snapshot or a SERPAPI_KEY. The engine refuses to score against a guess." },
      geoCitations: [],
      geoChecked: false,
      markdown: `# AI-SEO / GEO Report — "${input.keyword}"\n\n> ❌ **No SERP data.** The engine refuses to score against a guess. Supply --serp-key (live) or --serp-snapshot (offline).\n`,
    };
  }

  const coverage = scoreCoverage(input.draft, serpResults);
  const authorityGap = assessAuthorityGap(serpResults);
  const geoChecked = (input.geoCitations?.length ?? 0) > 0 || (input.geoCitations !== undefined);

  const markdown = render(input, coverage, authorityGap, geoChecked);

  return {
    keyword: input.keyword,
    brand: input.brand ?? null,
    topN,
    coverage,
    authorityGap,
    geoCitations: input.geoCitations ?? [],
    geoChecked,
    markdown,
  };
}