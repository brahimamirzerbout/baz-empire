/**
 * Term-coverage scorer — the on-page optimizer core.
 *
 * Extracts NLP-style terms from content (tokenize → stopword removal →
 * frequency rank), compares the draft's term set against the union of the
 * top results' term sets, and computes a Content Score (0-100).
 *
 * Surfer-style: the score is overlap weight / top-terms weight × 100. A score
 * of 70+ is "competitive" (Surfer's 0.28 correlation to page-1 means 70+ scored
 * pages rank page-1 ~60% of the time). Below 50 = likely won't rank regardless
 * of backlinks.
 *
 * Deterministic, no LLM, no external API — runs on the SERP snapshot content.
 */

import type { SerpResult, Term, TermCoverage } from "./types.js";

/** A minimal English stopword list (sufficient for term coverage; not a full NLP lib). */
const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with",
  "by", "from", "is", "are", "was", "were", "be", "been", "being", "have", "has",
  "had", "do", "does", "did", "will", "would", "could", "should", "may", "might",
  "must", "shall", "can", "need", "this", "that", "these", "those", "it", "its",
  "as", "if", "then", "than", "so", "no", "not", "your", "you", "we", "they", "he",
  "she", "i", "me", "my", "our", "their", "his", "her", "them", "us", "which",
  "who", "whom", "what", "when", "where", "why", "how", "all", "each", "every",
  "both", "few", "more", "most", "other", "some", "such", "only", "own", "same",
  "into", "about", "over", "under", "again", "once", "here", "there", "also",
  "just", "very", "too", "any", "now", "up", "down", "out", "off", "because",
  "while", "during", "before", "after", "above", "below", "between", "through",
  "1", "2", "3", "0", "vs", "re", "ll", "ve", "isn", "don", "doesn", "didn",
]);

const MIN_TERM_LENGTH = 3;

/** Tokenize content into terms: lowercase, strip punctuation, drop stopwords + short tokens. */
export function tokenize(content: string): string[] {
  return content
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= MIN_TERM_LENGTH && !STOPWORDS.has(t));
}

/** Extract the top N terms by frequency from a content string. */
export function extractTerms(content: string, topN = 50): Term[] {
  const tokens = tokenize(content);
  if (tokens.length === 0) return [];
  const counts = new Map<string, number>();
  for (const t of tokens) counts.set(t, (counts.get(t) ?? 0) + 1);
  const total = tokens.length;
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([term, count]) => ({ term, count, weight: count / total }));
}

/** Build the union of the top results' term sets (the "should-have" set). */
export function unionTopTerms(results: SerpResult[], topNPerResult = 30): Term[] {
  const agg = new Map<string, { count: number; sources: number }>();
  let totalSources = 0;
  for (const r of results) {
    const text = `${r.title} ${r.snippet} ${r.content ?? ""}`;
    const terms = extractTerms(text, topNPerResult);
    if (terms.length > 0) totalSources++;
    for (const t of terms) {
      const existing = agg.get(t.term);
      if (existing) { existing.count += t.count; existing.sources += 1; }
      else agg.set(t.term, { count: t.count, sources: 1 });
    }
  }
  // Weight by source frequency (terms appearing in more top results rank higher).
  return [...agg.entries()]
    .map(([term, v]) => ({
      term,
      count: v.count,
      weight: totalSources > 0 ? v.sources / totalSources : v.count,
    }))
    .sort((a, b) => b.weight - a.weight);
}

/** Score the draft's term coverage against the top results' union. */
export function scoreCoverage(draft: string, topResults: SerpResult[]): TermCoverage {
  const draftTerms = extractTerms(draft);
  const topTerms = unionTopTerms(topResults);
  const draftSet = new Set(draftTerms.map((t) => t.term));
  const topSet = new Set(topTerms.map((t) => t.term));

  const matchedTerms = topTerms.filter((t) => draftSet.has(t.term));
  const missingTerms = topTerms.filter((t) => !draftSet.has(t.term));

  // Content score = sum of matched term weights / sum of all top term weights × 100.
  const topWeightSum = topTerms.reduce((s, t) => s + t.weight, 0);
  const matchedWeightSum = matchedTerms.reduce((s, t) => s + t.weight, 0);
  const contentScore = topWeightSum > 0 ? Math.round((matchedWeightSum / topWeightSum) * 100) : 0;

  const band: TermCoverage["band"] =
    contentScore >= 85 ? "strong" : contentScore >= 70 ? "competitive" : contentScore >= 50 ? "approaching" : "below";

  return { draftTerms, topTerms, missingTerms, matchedTerms, contentScore, band };
}