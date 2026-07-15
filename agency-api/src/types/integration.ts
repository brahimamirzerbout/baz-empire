import type { AdMetricInput } from "./index";

/** Date range for metric ingestion. */
export interface IngestRange {
  since: string; // ISO date YYYY-MM-DD
  until: string; // ISO date YYYY-MM-DD
}

/** Options passed to an adapter's fetchMetrics call. */
export interface FetchMetricsOptions {
  range: IngestRange;
  /** External account id (customer_id / ad_account_id / advertiser_id). */
  accountId?: string;
}

/**
 * ChannelAdapter — the canonical contract every ad platform implements.
 * The ingest orchestrator depends on this interface, never on a concrete
 * adapter, so adding a platform = implement this + register it.
 */
export interface ChannelAdapter {
  /** Stable channel label that becomes AdMetric.channel. */
  readonly channel: string;
  /** True when all required credentials are present. */
  isConfigured(): boolean;
  /** Human-readable list of missing env vars (for the /status endpoint). */
  missingCredentials(): string[];
  /** Pull raw metrics from the platform and normalize to AdMetricInput[]. */
  fetchMetrics(opts: FetchMetricsOptions): Promise<AdMetricInput[]>;
}

/** Result of a live HTML fetch for the SEO analyzer. */
export interface FetchedPage {
  html: string;
  finalUrl: string;
  status: number;
  fetchedAt: string;
}

/**
 * SeoFetcher — abstracts how page HTML is obtained.
 * "fetch" = static HTTP (zero-dep, fast). "puppeteer" = JS-rendered
 * (needed for SPAs / client-rendered content). Same contract either way.
 */
export interface SeoFetcher {
  fetchHtml(url: string): Promise<FetchedPage>;
}

/** Raised when an adapter is called but not configured. Maps to HTTP 503. */
export class IntegrationNotConfiguredError extends Error {
  constructor(
    public readonly provider: string,
    public readonly missing: string[]
  ) {
    super(`${provider} is not configured. Missing: ${missing.join(", ")}`);
    this.name = "IntegrationNotConfiguredError";
  }
}

/** Raised when an external API call fails after retries. Maps to HTTP 502. */
export class UpstreamError extends Error {
  constructor(
    public readonly provider: string,
    message: string,
    public readonly status?: number
  ) {
    super(`${provider} upstream error: ${message}`);
    this.name = "UpstreamError";
  }
}