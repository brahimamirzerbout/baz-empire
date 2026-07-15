import { metaAdsConfig } from "../../lib/integrationConfig";
import { fetchJson } from "../../lib/http";
import type { ChannelAdapter, FetchMetricsOptions } from "../../types/integration";
import type { AdMetricInput } from "../../types";
import { normalizeMeta, type MetaResponse } from "./normalizers";

/**
 * Meta Marketing API adapter — /{ad_account_id}/insights.
 * Uses a long-lived access token (META_ACCESS_TOKEN). To enable: fill the
 * META_* env vars. isConfigured() gates the network call.
 */
export class MetaAdsAdapter implements ChannelAdapter {
  readonly channel = "Meta Ads";

  private required = () => [
    "META_ACCESS_TOKEN",
    "META_AD_ACCOUNT_ID",
  ];

  isConfigured(): boolean {
    return this.missingCredentials().length === 0;
  }

  missingCredentials(): string[] {
    return this.required().filter((k) => !process.env[k]);
  }

  async fetchMetrics(opts: FetchMetricsOptions): Promise<AdMetricInput[]> {
    if (!this.isConfigured()) {
      const { IntegrationNotConfiguredError } = await import("../../types/integration");
      throw new IntegrationNotConfiguredError("meta_ads", this.missingCredentials());
    }

    const accountId = opts.accountId || metaAdsConfig.adAccountId!;
    const fields = "spend,impressions,clicks,actions,conversion_values";
    const timeRange = JSON.stringify({ since: opts.range.since, until: opts.range.until });
    const url =
      `https://graph.facebook.com/${metaAdsConfig.apiVersion}/${accountId}/insights` +
      `?fields=${fields}&time_range=${encodeURIComponent(timeRange)}&access_token=${metaAdsConfig.accessToken!}`;

    const resp = await fetchJson<MetaResponse>(url, { provider: "meta_ads" });
    return [normalizeMeta(resp)];
  }
}