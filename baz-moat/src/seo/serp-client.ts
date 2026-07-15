/**
 * SERP client — pluggable provider interface.
 *
 * Offline-first: the engine works with a supplied snapshot (no API key, no
 * network) so it's testable and runnable. Live mode uses serpapi.com when a
 * key is present (SERPAPI_KEY env var). Never guesses — no snapshot + no key
 * = the engine refuses to score (surgical, not vibecoded).
 *
 * To add DataForSEO / SerpWow / a custom scraper: implement the SerpProvider
 * interface and pass it to the engine.
 */

import type { SerpResult } from "./types.js";

export interface SerpProvider {
  /** Fetch the top N organic results for a keyword. */
  fetchTopResults(keyword: string, count: number): Promise<SerpResult[]>;
}

/** Offline provider — returns a supplied snapshot. For tests + no-key runs. */
export class OfflineSerpProvider implements SerpProvider {
  constructor(private snapshot: SerpResult[]) {}
  async fetchTopResults(_keyword: string, count: number): Promise<SerpResult[]> {
    return this.snapshot.slice(0, count);
  }
}

/**
 * Live serpapi.com provider. Requires SERPAPI_KEY. Fetches organic results.
 * Network call only — no key = throws (the engine catches and falls back).
 */
export class SerpApiProvider implements SerpProvider {
  constructor(private apiKey: string) {}
  async fetchTopResults(keyword: string, count: number): Promise<SerpResult[]> {
    // serpapi.com organic_results: https://serpapi.com/search-engine
    const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(keyword)}&num=${count}&api_key=${this.apiKey}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`SERP API error ${res.status}: ${await res.text()}`);
    const data = (await res.json()) as {
      organic_results?: Array<{ position?: number; title?: string; link: string; snippet?: string }>;
    };
    const results: SerpResult[] = (data.organic_results ?? []).map((r, i) => ({
      position: r.position ?? i + 1,
      title: r.title ?? "",
      url: r.link,
      snippet: r.snippet ?? "",
    }));
    return results.slice(0, count);
  }
}

/** Build the best-available provider: live if key present, else offline if snapshot given, else null. */
export function resolveProvider(
  snapshot?: SerpResult[],
  apiKey?: string,
): SerpProvider | null {
  if (apiKey) return new SerpApiProvider(apiKey);
  if (snapshot && snapshot.length > 0) return new OfflineSerpProvider(snapshot);
  return null;
}