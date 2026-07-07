/**
 * LinkedIn Ads provider — mock.
 * To go live: create LinkedIn developer app, request `r_ads` + `rw_ads` + `r_ads_reporting`, install SDK.
 */
import type { AdProvider, AdProviderConfig, ProviderTestResult } from "./ads";
import { buildLinkedInConversion } from "./pii";

const REQUIRED = ["client_id", "client_secret", "access_token", "ad_account_id"] as const;
function hasAllCreds(cfg: AdProviderConfig) {
  return REQUIRED.every((k) => typeof cfg?.[k] === "string" && (cfg[k] as string).length > 0);
}

export const linkedinAdsProvider: AdProvider = {
  id: "linkedin_ads",
  displayName: "LinkedIn Ads",
  brandColor: "#0a66c2",
  isLive: hasAllCreds,
  async test(cfg) {
    if (!hasAllCreds(cfg))
      return {
        ok: true,
        mode: "mock",
        detail: "Mock mode — LinkedIn Ads credentials not configured.",
      };
    return { ok: true, mode: "mock", detail: "Credentials present but SDK not yet wired." };
  },
  async pullCampaigns(_c, acct) {
    return [
      {
        external_id: `${acct}-li-1`,
        name: "Sponsored Content — Decision Makers",
        objective: "leads",
        status: "active",
        daily_budget: 175,
        total_budget: 5250,
      },
      {
        external_id: `${acct}-li-2`,
        name: "Conversation Ads — Q4 push",
        objective: "conversions",
        status: "paused",
        daily_budget: 90,
        total_budget: 2700,
      },
    ];
  },
  async pullAdGroups(_c, cmp) {
    return [
      {
        external_id: `${cmp}-li-grp-1`,
        campaign_external_id: cmp,
        name: "Targeting: VP Marketing, US",
        status: "active",
        bid_strategy: "enhanced",
      },
    ];
  },
  async pullMetrics(_c, { accountExternalId, dateStart, dateEnd, level }) {
    const seedIds = level === "campaign" ? ["li-1", "li-2"] : ["li-grp-1"];
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
        const impressions = 2000 + (hash % 20000);
        const clicks = Math.floor(impressions * 0.006);
        const conversions = Math.floor(clicks * 0.06);
        const spend = +(clicks * 6.5).toFixed(2);
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
    const payload = buildLinkedInConversion(conv);
    if (!hasAllCreds(cfg))
      return { ok: true, raw: { mock: true, accepted: true, payload, account: accountExternalId } };
    return { ok: false, error: "Live conversion upload not yet wired.", payload };
  },
  oauthStartUrl(cfg, redirectUri, state) {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: cfg.client_id,
      redirect_uri: redirectUri,
      scope: "r_ads rw_ads r_ads_reporting r_organization_social",
      state,
    });
    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  },
  async oauthExchange() {
    return { ok: false, error: "Live OAuth not yet wired." };
  },
};
