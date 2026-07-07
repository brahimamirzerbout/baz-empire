/**
 * TikTok Ads provider — mock.
 * To go live: create TikTok for Business app, install tiktok-business-api-sdk, set credentials.
 */
import type { AdProvider, AdProviderConfig, ProviderTestResult } from "./ads";
import { buildTikTokConversion } from "./pii";

const REQUIRED = ["app_id", "secret", "access_token", "advertiser_id"] as const;
function hasAllCreds(cfg: AdProviderConfig) {
  return REQUIRED.every((k) => typeof cfg?.[k] === "string" && (cfg[k] as string).length > 0);
}

export const tiktokAdsProvider: AdProvider = {
  id: "tiktok_ads",
  displayName: "TikTok Ads",
  brandColor: "#fe2c55",
  isLive: hasAllCreds,
  async test(cfg) {
    if (!hasAllCreds(cfg))
      return {
        ok: true,
        mode: "mock",
        detail: "Mock mode — TikTok Ads credentials not configured.",
      };
    return { ok: true, mode: "mock", detail: "Credentials present but SDK not yet wired." };
  },
  async pullCampaigns(_c, acct) {
    return [
      {
        external_id: `${acct}-tt-1`,
        name: "Spark Ads — Top Performers",
        objective: "conversions",
        status: "active",
        daily_budget: 200,
        total_budget: 6000,
      },
      {
        external_id: `${acct}-tt-2`,
        name: "In-Feed Lead Gen",
        objective: "leads",
        status: "paused",
        daily_budget: 150,
        total_budget: 4500,
      },
    ];
  },
  async pullAdGroups(_c, cmp) {
    return [
      {
        external_id: `${cmp}-tad-1`,
        campaign_external_id: cmp,
        name: "AdGroup 25-34 Female",
        status: "active",
        bid_strategy: "lowest_cost",
      },
    ];
  },
  async pullMetrics(_c, { accountExternalId, dateStart, dateEnd, level }) {
    const seedIds = level === "campaign" ? ["tt-1", "tt-2"] : ["tad-1"];
    const startMs = new Date(dateStart + "T00:00:00Z").getTime();
    const endMs = new Date(dateEnd + "T00:00:00Z").getTime();
    const rows: Record<string, unknown>[] = [];
    for (let ms = startMs; ms <= endMs; ms += 86400_000) {
      const date = new Date(ms).toISOString().slice(0, 10);
      for (const s of seedIds) {
        const hash = Math.abs(
          (accountExternalId + s + date)
            .split("")
            .reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 0),
        );
        const impressions = 12000 + (hash % 100000);
        const clicks = Math.floor(impressions * 0.012);
        const conversions = Math.floor(clicks * 0.025);
        const spend = +(clicks * 0.8).toFixed(2);
        rows.push({
          external_id: `${accountExternalId}-${s}`,
          date_start: date,
          date_end: date,
          level,
          impressions,
          clicks,
          conversions,
          spend,
          currency: "USD",
        });
      }
    }
    return rows;
  },
  async pushConversion(cfg, accountExternalId, conv) {
    const payload = buildTikTokConversion(conv);
    if (!hasAllCreds(cfg))
      return { ok: true, raw: { mock: true, accepted: true, payload, account: accountExternalId } };
    return { ok: false, error: "Live conversion upload not yet wired.", payload };
  },
  oauthStartUrl(cfg, redirectUri, state) {
    const params = new URLSearchParams({
      app_id: cfg.app_id,
      redirect_uri: redirectUri,
      state,
      scope: "user.info.basic,ads.read,ads.management",
    });
    return `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;
  },
  async oauthExchange() {
    return { ok: false, error: "Live OAuth not yet wired." };
  },
};
