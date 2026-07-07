/**
 * Meta (Facebook) Ads provider
 *
 * Status: MOCK until you wire credentials.
 *
 * To go live:
 *   1. Create a Facebook App at developers.facebook.com
 *   2. Add the "Marketing API" product
 *   3. Submit for `ads_management` + `ads_read` review (1-2 weeks)
 *   4. Set config: { app_id, app_secret, access_token (long-lived System User token), ad_account_id }
 *   5. Install: `npm install facebook-nodejs-business-sdk`
 *   6. Replace the mock bodies below with real SDK calls
 *   7. Set `isLive()` to return true when all required fields are present
 */
import type { AdProvider, AdProviderConfig, ProviderTestResult } from "./ads";
import { buildMetaConversion } from "./pii";

const REQUIRED = ["app_id", "app_secret", "access_token", "ad_account_id"] as const;

function hasAllCreds(cfg: AdProviderConfig): boolean {
  return REQUIRED.every((k) => typeof cfg?.[k] === "string" && cfg[k].length > 0);
}

export const metaAdsProvider: AdProvider = {
  id: "meta_ads",
  displayName: "Meta Ads",
  brandColor: "#1877f2",

  isLive(cfg) {
    return hasAllCreds(cfg);
  },

  async test(cfg): Promise<ProviderTestResult> {
    if (!hasAllCreds(cfg)) {
      return {
        ok: true,
        mode: "mock",
        detail:
          "Mock mode — Meta Ads credentials not configured. Create a Facebook App, request ads_management review, then add config.",
      };
    }
    return {
      ok: true,
      mode: "mock",
      detail:
        "Credentials present but SDK not yet wired (TODO: install facebook-nodejs-business-sdk).",
    };
  },

  async pullCampaigns(_cfg, accountExternalId) {
    return [
      {
        external_id: `${accountExternalId}-cmp-1`,
        name: "Holiday Retargeting",
        objective: "conversions",
        status: "active",
        daily_budget: 250,
        total_budget: 7500,
      },
      {
        external_id: `${accountExternalId}-cmp-2`,
        name: "Lookalike Acquisition",
        objective: "leads",
        status: "active",
        daily_budget: 180,
        total_budget: 5400,
      },
      {
        external_id: `${accountExternalId}-cmp-3`,
        name: "Reels Brand Awareness",
        objective: "awareness",
        status: "paused",
        daily_budget: 100,
        total_budget: 3000,
      },
    ];
  },

  async pullAdGroups(_cfg, campaignExternalId) {
    return [
      {
        external_id: `${campaignExternalId}-aset-1`,
        campaign_external_id: campaignExternalId,
        name: "AdSet — 1% LAL",
        status: "active",
        bid_strategy: "lowest_cost",
      },
      {
        external_id: `${campaignExternalId}-aset-2`,
        campaign_external_id: campaignExternalId,
        name: "AdSet — Site Visitors 30d",
        status: "active",
        bid_strategy: "cost_cap",
        bid_amount: 12,
      },
    ];
  },

  async pullMetrics(_cfg, { accountExternalId, dateStart, dateEnd, level }) {
    const rows: Record<string, unknown>[] = [];
    const seedIds =
      level === "campaign"
        ? ["cmp-1", "cmp-2", "cmp-3"]
        : level === "ad_group"
          ? ["aset-1", "aset-2"]
          : ["ad-1", "ad-2"];
    const startMs = new Date(dateStart + "T00:00:00Z").getTime();
    const endMs = new Date(dateEnd + "T00:00:00Z").getTime();
    for (let ms = startMs; ms <= endMs; ms += 86400_000) {
      const date = new Date(ms).toISOString().slice(0, 10);
      for (const s of seedIds) {
        const hash = Math.abs(
          (accountExternalId + s + date)
            .split("")
            .reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 0),
        );
        const impressions = 8000 + (hash % 80000);
        const clicks = Math.floor(impressions * (0.008 + ((hash >> 3) % 40) / 1000));
        const conversions = Math.floor(clicks * (0.04 + ((hash >> 7) % 100) / 1000));
        const spend = +(clicks * (0.7 + ((hash >> 11) % 300) / 100)).toFixed(2);
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
    const payload = buildMetaConversion(conv);
    if (!hasAllCreds(cfg)) {
      return { ok: true, raw: { mock: true, accepted: true, payload, account: accountExternalId } };
    }
    // TODO LIVE: facebook.post(`/act_${ad_account_id}/offsiteconversions`, payload)
    return { ok: false, error: "Live conversion upload not yet wired. SDK pending.", payload };
  },

  oauthStartUrl(cfg, redirectUri, state) {
    const params = new URLSearchParams({
      client_id: cfg.app_id,
      redirect_uri: redirectUri,
      state,
      scope: "ads_management,ads_read",
    });
    return `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`;
  },

  async oauthExchange(_cfg, _code, _redirectUri) {
    // TODO LIVE: GET https://graph.facebook.com/v19.0/oauth/access_token?...
    return { ok: false, error: "Live OAuth not yet wired. SDK pending." };
  },
};
