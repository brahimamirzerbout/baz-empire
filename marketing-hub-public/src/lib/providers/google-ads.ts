/**
 * Google Ads provider
 *
 * Status: MOCK until you wire credentials.
 *
 * To go live:
 *   1. Apply for a Google Ads Manager Account (MCC) at ads.google.com
 *   2. Apply for a Developer Token at developers.google.com/google-ads/api
 *   3. Create OAuth Client in Google Cloud Console
 *   4. Set the following config:
 *        {
 *          developer_token: "...",
 *          client_id: "...",
 *          client_secret: "...",
 *          refresh_token: "...",   // obtained from OAuth flow
 *          mcc_customer_id: "...", // optional, for sub-accounts
 *          login_customer_id: "..." // optional MCC header
 *        }
 *   5. Install the SDK: `npm install google-ads-api`
 *   6. Replace the mock bodies below with real `new GoogleAdsApi({...})` calls.
 *   7. Set `isLive()` to return true when all required fields are present.
 *
 * The hub will detect `isLive()` and surface a "Live sync" indicator in the UI.
 */
import type { AdProvider, AdProviderConfig, ProviderTestResult } from "./ads";
import { buildGoogleConversion } from "./pii";

const REQUIRED = ["developer_token", "client_id", "client_secret", "refresh_token"] as const;

function hasAllCreds(cfg: AdProviderConfig): boolean {
  return REQUIRED.every((k) => typeof cfg?.[k] === "string" && cfg[k].length > 0);
}

export const googleAdsProvider: AdProvider = {
  id: "google_ads",
  displayName: "Google Ads",
  brandColor: "#4285f4",

  isLive(cfg) {
    return hasAllCreds(cfg);
  },

  async test(cfg): Promise<ProviderTestResult> {
    if (!hasAllCreds(cfg)) {
      return {
        ok: true,
        mode: "mock",
        detail:
          "Mock mode — Google Ads credentials not configured. Apply for MCC + Developer Token, then add config to go live.",
      };
    }
    // TODO LIVE: new GoogleAdsApi({...}).getRefreshableAccessToken(...) — should not throw
    // For now, if creds are present we still mark mock until SDK is installed.
    return {
      ok: true,
      mode: "mock",
      detail:
        "Credentials present but SDK not yet wired (TODO: install google-ads-api and replace mocks).",
    };
  },

  async pullCampaigns(_cfg, accountExternalId) {
    // Deterministic mock so the UI works without real credentials.
    // Replace with: `customer.query(SELECT campaign.* FROM campaign WHERE ...)`
    // Field name `external_id` MUST match what the route reads — see bug fix
    // notes: mock previously used `id`, which made dedup fail and created
    // duplicate campaigns on every sync.
    const base: unknown[] = [
      {
        external_id: `${accountExternalId}-c1`,
        name: "Brand Search — Always-On",
        objective: "conversions",
        status: "active",
        daily_budget: 150,
        total_budget: 4500,
      },
      {
        external_id: `${accountExternalId}-c2`,
        name: "Non-brand Search — Q4 push",
        objective: "conversions",
        status: "active",
        daily_budget: 320,
        total_budget: 9600,
      },
      {
        external_id: `${accountExternalId}-c3`,
        name: "YouTube Awareness — Lookalike",
        objective: "awareness",
        status: "paused",
        daily_budget: 200,
        total_budget: 4000,
      },
      {
        external_id: `${accountExternalId}-c4`,
        name: "Performance Max — Best Sellers",
        objective: "sales",
        status: "draft",
        daily_budget: 0,
        total_budget: 0,
      },
    ];
    return base;
  },

  async pullAdGroups(_cfg, campaignExternalId) {
    return [
      {
        external_id: `${campaignExternalId}-ag1`,
        campaign_external_id: campaignExternalId,
        name: "Ad Group A — Exact",
        status: "active",
        bid_strategy: "cpc",
        bid_amount: 1.25,
      },
      {
        external_id: `${campaignExternalId}-ag2`,
        campaign_external_id: campaignExternalId,
        name: "Ad Group B — Phrase",
        status: "active",
        bid_strategy: "cpc",
        bid_amount: 1.1,
      },
      {
        external_id: `${campaignExternalId}-ag3`,
        campaign_external_id: campaignExternalId,
        name: "Ad Group C — Broad",
        status: "paused",
        bid_strategy: "cpc",
        bid_amount: 0.85,
      },
    ];
  },

  async pullMetrics(_cfg, { accountExternalId, dateStart, dateEnd, level }) {
    // Deterministic mock. Real call: GAQL query against customer.metrics.
    // Returns ONE row per (external_id, date) so the hub's idempotency
    // table can dedupe on (account, level, external_id, date).
    const rows: Record<string, unknown>[] = [];
    const seedIds =
      level === "campaign"
        ? ["c1", "c2", "c3", "c4"]
        : level === "ad_group"
          ? ["c1-ag1", "c2-ag1", "c3-ag1"]
          : ["cr1", "cr2"];
    const startMs = new Date(dateStart + "T00:00:00Z").getTime();
    const endMs = new Date(dateEnd + "T00:00:00Z").getTime();
    const day = 86400_000;
    for (let ms = startMs; ms <= endMs; ms += day) {
      const date = new Date(ms).toISOString().slice(0, 10);
      for (const s of seedIds) {
        const hash = Math.abs(
          (accountExternalId + s + date)
            .split("")
            .reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 0),
        );
        const impressions = 5000 + (hash % 50000);
        const clicks = Math.floor(impressions * (0.01 + ((hash >> 3) % 50) / 1000));
        const conversions = Math.floor(clicks * (0.02 + ((hash >> 7) % 80) / 1000));
        const spend = +(clicks * (0.5 + ((hash >> 11) % 250) / 100)).toFixed(2);
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
    const payload = buildGoogleConversion(conv);
    if (!hasAllCreds(cfg)) {
      // In mock mode, accept and pretend success so the UI flow works.
      return { ok: true, raw: { mock: true, accepted: true, payload, account: accountExternalId } };
    }
    // TODO LIVE: customer.uploadConversionAdjustments([{ adjustment: { ...payload } }])
    return { ok: false, error: "Live conversion upload not yet wired. SDK pending.", payload };
  },

  oauthStartUrl(cfg, redirectUri, state) {
    const params = new URLSearchParams({
      client_id: cfg.client_id,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "https://www.googleapis.com/auth/adwords",
      access_type: "offline",
      prompt: "consent",
      state,
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  },

  async oauthExchange(_cfg, _code, _redirectUri) {
    // TODO LIVE: POST https://oauth2.googleapis.com/token with grant_type=authorization_code
    return { ok: false, error: "Live OAuth not yet wired. SDK pending." };
  },
};
