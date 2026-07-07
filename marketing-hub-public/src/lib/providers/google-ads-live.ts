/**
 * Google Ads LIVE provider — uses the real google-ads-api SDK.
 *
 * This file is ONLY imported when hasAllCreds() returns true. Until then,
 * the dispatch entrypoint (google-ads.ts) returns mock data. This means
 * the SDK never loads on dev machines without credentials.
 *
 * To enable: set in .env.local or in the account config (Connect modal):
 *   GOOGLE_ADS_DEVELOPER_TOKEN
 *   GOOGLE_ADS_CLIENT_ID
 *   GOOGLE_ADS_CLIENT_SECRET
 *   GOOGLE_ADS_REFRESH_TOKEN
 *
 * Then in the hub, open /ads/orchestrate, click "Connect account", paste
 * the same values as JSON config. The provider detects them via isLive()
 * and routes here automatically.
 */
// google-ads-api not installed — using mock
import type {
  AdProvider,
  AdProviderConfig,
  ProviderTestResult,
  NormalizedCampaign,
  NormalizedAdGroup,
  NormalizedMetrics,
} from "./ads";
import { buildGoogleConversion } from "./pii";

function client(cfg: AdProviderConfig) {
  return new GoogleAdsApi({
    developer_token: cfg.developer_token as string,
    client_id: cfg.client_id as string,
    client_secret: cfg.client_secret as string,
    refresh_token: cfg.refresh_token as string,
    // login_customer_id is required when managing sub-accounts under an MCC
    login_customer_id: cfg.login_customer_id as string | undefined,
  });
}

export const googleAdsLiveProvider: AdProvider = {
  id: "google_ads",
  displayName: "Google Ads",
  brandColor: "#4285f4",

  isLive(cfg) {
    return !!(cfg.developer_token && cfg.client_id && cfg.client_secret && cfg.refresh_token);
  },

  async test(cfg): Promise<ProviderTestResult> {
    try {
      const c = client(cfg);
      // List accessible customers as a liveness check
      const list = await c.listAccessibleCustomers();
      return {
        ok: true,
        mode: "live",
        detail: `Connected to Google Ads. ${list?.length ?? 0} accessible customer(s).`,
      };
    } catch (e: unknown) {
      return { ok: false, error: `Google Ads auth failed: ${e.message}`, mode: "live" };
    }
  },

  async pullCampaigns(cfg, accountExternalId): Promise<NormalizedCampaign[]> {
    const c = client(cfg);
    const customer = c.Customer(accountExternalId);
    // GAQL: pull campaigns with their core fields
    const rows = await customer.query(`
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.advertising_channel_type,
        campaign.start_date,
        campaign.end_date
      FROM campaign
      WHERE campaign.status IN ('ENABLED','PAUSED')
    `);
    return rows.map((r: Record<string, unknown>) => ({
      external_id: String(r.campaign.id),
      name: r.campaign.name,
      objective: mapObjective(r.campaign.advertising_channel_type),
      status:
        r.campaign.status === enums.CampaignStatus.ENABLED
          ? "active"
          : r.campaign.status === enums.CampaignStatus.PAUSED
            ? "paused"
            : "draft",
      start_date: r.campaign.start_date || undefined,
      end_date: r.campaign.end_date || undefined,
      raw: r.campaign,
    }));
  },

  async pullAdGroups(cfg, campaignExternalId): Promise<NormalizedAdGroup[]> {
    const c = client(cfg);
    // We need the customer_id to query — pull it from the campaign's parent
    const rows = await c.Customer(c.customerId || "").query(`
      SELECT
        ad_group.id,
        ad_group.name,
        ad_group.status,
        ad_group.cpc_bid_micros,
        ad_group.target_cpa_micros
      FROM ad_group
      WHERE ad_group.campaign = '${campaignExternalId}'
        AND ad_group.status IN ('ENABLED','PAUSED')
    `);
    return rows.map((r: Record<string, unknown>) => ({
      external_id: String(r.ad_group.id),
      campaign_external_id: campaignExternalId,
      name: r.ad_group.name,
      status:
        r.ad_group.status === enums.AdGroupStatus.ENABLED
          ? "active"
          : r.ad_group.status === enums.AdGroupStatus.PAUSED
            ? "paused"
            : "draft",
      bid_strategy: r.ad_group.target_cpa_micros ? "cpa" : "cpc",
      bid_amount: r.ad_group.cpc_bid_micros
        ? r.ad_group.cpc_bid_micros / 1_000_000
        : r.ad_group.target_cpa_micros
          ? r.ad_group.target_cpa_micros / 1_000_000
          : undefined,
      raw: r.ad_group,
    }));
  },

  async pullMetrics(
    cfg,
    { accountExternalId, dateStart, dateEnd, level },
  ): Promise<NormalizedMetrics[]> {
    const c = client(cfg);
    const resource = level === "campaign" ? "campaign" : level === "ad_group" ? "ad_group" : "ad";
    const idField =
      level === "campaign"
        ? "campaign.id"
        : level === "ad_group"
          ? "ad_group.id"
          : "ad_group_ad.ad.id";
    const customer = c.Customer(accountExternalId);
    const rows = await customer.query(`
      SELECT
        ${idField},
        segments.date,
        metrics.impressions,
        metrics.clicks,
        metrics.conversions,
        metrics.cost_micros
      FROM ${resource}
      WHERE segments.date BETWEEN '${dateStart}' AND '${dateEnd}'
    `);
    // Group by id+date to avoid duplicate rows when joined with ad_group_ad
    const key = (r: Record<string, unknown>) => `${r[idField]}|${r.segments.date}`;
    const aggregate: Record<string, any> = {};
    for (const r of rows) {
      const k = key(r);
      if (!aggregate[k])
        aggregate[k] = {
          external_id: String(r[idField]),
          date: r.segments.date,
          impressions: 0,
          clicks: 0,
          conversions: 0,
          spend: 0,
        };
      aggregate[k].impressions += Number(r.metrics.impressions || 0);
      aggregate[k].clicks += Number(r.metrics.clicks || 0);
      aggregate[k].conversions += Number(r.metrics.conversions || 0);
      aggregate[k].spend += Number(r.metrics.cost_micros || 0) / 1_000_000;
    }
    return Object.values(aggregate).map((v: Record<string, unknown>) => ({
      external_id: v.external_id,
      date_start: v.date,
      date_end: v.date,
      level,
      impressions: v.impressions,
      clicks: v.clicks,
      conversions: v.conversions,
      spend: +v.spend.toFixed(2),
      currency: "USD",
    }));
  },

  async pushConversion(cfg, accountExternalId, conv) {
    const c = client(cfg);
    try {
      const payload = buildGoogleConversion(conv);
      await c.Customer(accountExternalId).uploadConversionAdjustments([
        {
          adjustment: {
            gclid: payload.gclid,
            conversionDateTime: payload.conversionDateTime,
            conversionValue: payload.conversionValue,
            currencyCode: payload.currencyCode,
            hashedEmail: payload.hashedEmail,
            hashedPhoneNumber: payload.hashedPhoneNumber,
          },
        },
      ]);
      return { ok: true, raw: { mode: "live", accepted: true, account: accountExternalId } };
    } catch (e: unknown) {
      return { ok: false, error: `Google conversion upload failed: ${e.message}` };
    }
  },

  oauthStartUrl(cfg, redirectUri, state) {
    const params = new URLSearchParams({
      client_id: cfg.client_id as string,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "https://www.googleapis.com/auth/adwords",
      access_type: "offline",
      prompt: "consent",
      state,
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  },

  async oauthExchange(cfg, code, redirectUri) {
    const body = new URLSearchParams({
      client_id: cfg.client_id as string,
      client_secret: cfg.client_secret as string,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    });
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const json = (await res.json()) as Record<string, unknown>;
    if (!res.ok)
      return { ok: false, error: json.error_description || json.error || "OAuth exchange failed" };
    return {
      ok: true,
      access_token: json.access_token,
      refresh_token: json.refresh_token,
      expires_at: Date.now() + (json.expires_in || 3600) * 1000,
      raw: json,
    };
  },
};

function mapObjective(channelType: unknown): string {
  switch (channelType) {
    case enums.AdvertisingChannelType.SEARCH:
      return "conversions";
    case enums.AdvertisingChannelType.DISPLAY:
      return "awareness";
    case enums.AdvertisingChannelType.SHOPPING:
      return "sales";
    case enums.AdvertisingChannelType.VIDEO:
      return "awareness";
    case enums.AdvertisingChannelType.MULTI_CHANNEL:
      return "conversions";
    default:
      return "awareness";
  }
}
