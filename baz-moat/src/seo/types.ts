/**
 * AI-SEO / GEO — types for the search-visibility engine.
 *
 * Two layers, deliberately separate (the 2026 truth the vibecoded tools miss):
 *   1. Term-coverage scoring — on-page optimization vs the live top 10 (the
 *      Surfer/Clearscope job). "Does your draft use the terms the ranking pages use?"
 *   2. GEO citation tracking — does your content surface in ChatGPT / Perplexity /
 *      Gemini / AI Overviews for the keyword? (the Profound/Otterly job). SEO ≠ GEO.
 *
 * Lineage: Schwartz (awareness → entry) + Hopkins (test-measure-refine) + the
 * BAZ moat (the tracking default). Surgical: the engine refuses to score a draft
 * against a stale index — it either calls the live SERP API or uses a supplied
 * snapshot, never a guess.
 */

/** A single top-ranking result from the SERP API. */
export interface SerpResult {
  position: number; // 1-indexed
  title: string;
  url: string;
  snippet: string;
  /** Optional: extracted on-page content (body text) for deeper term analysis. */
  content?: string;
  /** Domain rating / authority if the SERP provider returns it. */
  domainAuthority?: number;
}

/** A term extracted from content with its frequency rank. */
export interface Term {
  term: string;
  /** Frequency in the source content. */
  count: number;
  /** Normalized weight (0-1) — count / total terms in the source. */
  weight: number;
}

/** The coverage score for a draft against the top results. */
export interface TermCoverage {
  /** The draft's top terms. */
  draftTerms: Term[];
  /** The union of the top results' top terms (the "should-have" set). */
  topTerms: Term[];
  /** Terms the top results use that the draft is MISSING (the gap). */
  missingTerms: Term[];
  /** Terms the draft has that the top results also have (the overlap). */
  matchedTerms: Term[];
  /** Content score 0-100 (overlap weight / top-terms weight × 100). Surfer-style. */
  contentScore: number;
  /** Verdict band: below / approaching / competitive / strong. */
  band: "below" | "approaching" | "competitive" | "strong";
}

/** A GEO citation check for one AI engine. */
export interface GeoCitation {
  engine: "chatgpt" | "perplexity" | "gemini" | "ai-overviews" | "copilot";
  /** Does the brand/content surface for this keyword? */
  cited: boolean;
  /** The citation source URL if found, else null. */
  citationUrl: string | null;
  /** The prompt used to check. */
  prompt: string;
  /** When the check was run (ISO). */
  checkedAt: string;
}

export interface AISEOInput {
  keyword: string;
  /** The draft content to score (body text). */
  draft: string;
  /** The client/brand name, for GEO citation tracking. */
  brand?: string;
  /** Live SERP results (from the API) OR a supplied snapshot. */
  serpResults: SerpResult[];
  /** Number of top results to analyze (default 10). */
  topN?: number;
  /** GEO citations (if checked; else empty → engine flags "not checked"). */
  geoCitations?: GeoCitation[];
}

export interface AISEOOutput {
  keyword: string;
  brand: string | null;
  topN: number;
  coverage: TermCoverage;
  /** The authority context — if the top 3 all have DR 50+ and the client is DR 28, flag it (Ahrefs-style). */
  authorityGap: { topAvgDA: number | null; verdict: string };
  geoCitations: GeoCitation[];
  geoChecked: boolean;
  /** Markdown deliverable. */
  markdown: string;
}