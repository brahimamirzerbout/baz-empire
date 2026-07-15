import { googleAdsConfig } from "../../lib/integrationConfig";
import { fetchJson } from "../../lib/http";
import type {
  ChannelAdapter,
  FetchMetricsOptions,
  IntegrationNotConfiguredError,
} from "../../types/integration";
import type { AdMetricInput } from "../../types";
import {
  normalizeGoogleAds,
  type GoogleAdsResponse,
} from "./normalizers";

/**
 * Google Ads adapter — GAQL reporting via the googleAds:searchStream endpoint.
 * Implements the ChannelAdapter contract. Until credentials are present,
 * isConfigured() === false and fetchMetrics throws IntegrationNotConfiguredError
 * (no network attempt). To enable: fill the GOOGLE_ADS_* env vars.
 */
export class GoogleAdsAdapter implements ChannelAdapter {
  readonly channel = "Google Ads";

  private required = () => [
    "GOOGLE_ADS_DEVELOPER_TOKEN",
    "GOOGLE_ADS_CLIENT_ID",
    "GOOGLE_ADS_CLIENT_SECRET",
    "GOOGLE_ADS_REFRESH_TOKEN",
    "GOOGLE_ADS_CUSTOMER_ID",
  ];

  isConfigured(): boolean {
    return this.missingCredentials().length === 0;
  }

  missingCredentials(): string[] {
    return this.required().filter((k) => !process.env[k]);
  }

  async fetchMetrics(opts: FetchMetricsOptions): Promise<AdMetricInput[]> {
    if (!this.isConfigured()) {
      const { IntegrationNotConfiguredError: E } = await import("../../types/integration");
      throw new E("google_ads", this.missingCredentials());
    }

    const customerId = opts.accountId || googleAdsConfig.customerId!;
    const url = `https://googleads.googleapis.com/${googleAdsConfig.apiVersion}/customers/${customerId}/googleAds:searchStream`;

    // GAQL — basic campaign-level performance for the date range.
    const query = `
      SELECT campaign.name, metrics.cost_micros, metrics.impressions, metrics.clicks,
             metrics.conversions, metrics.conversions_value
      FROM campaign
      WHERE segments.date BETWEEN '${opts.range.since}' AND '${opts.range.until}'
    `.trim();

    const resp = await fetchJson<GoogleAdsResponse>(url, {
      method: "POST",
      provider: "google_ads",
      headers: {
        Authorization: `Bearer ${googleAdsConfig.refreshToken!}`, // replaced by live OAuth token in production
        "developer-token": googleAdsConfig.developerToken!,
        "login-customer-id": customerId,
        "Content-Type": "application/json",
      },
      body: { query },
    });

    return [normalizeGoogleAds(resp)];
  }
}

// Re-export the error type for callers that import from this module.
export type { IntegrationNotConfiguredError };