/**
 * Ad provider abstraction — every ad platform implements the same shape.
 *
 * Why this exists:
 *  - The hub needs ONE API surface to read campaigns, write offline
 *    conversions, and (eventually) create ads — regardless of platform.
 *  - Each provider encapsulates its own OAuth, SDK, rate-limit, and
 *    schema quirks so the rest of the app doesn't have to know.
 *  - A provider can run in "mock" mode when credentials aren't set yet,
 *    so the UI and sync engine work end-to-end before the MCC + dev token
 *    arrive.
 */

export type AdProviderId = "google_ads" | "meta_ads" | "tiktok_ads" | "linkedin_ads";

export type AdProviderConfig = {
  /** Platform-specific config — see individual provider for fields. */
  [key: string]: unknown;
};

export type NormalizedCampaign = {
  external_id: string;
  name: string;
  objective?: string;
  status: "draft" | "active" | "paused" | "ended" | "unknown";
  daily_budget?: number;
  total_budget?: number;
  start_date?: string;
  end_date?: string;
  raw?: unknown;
};

export type NormalizedAdGroup = {
  external_id: string;
  campaign_external_id: string;
  name: string;
  status: "draft" | "active" | "paused" | "ended" | "unknown";
  bid_strategy?: string;
  bid_amount?: number;
  targeting?: Record<string, unknown>;
  raw?: unknown;
};

export type NormalizedMetrics = {
  // Aggregate over a date window
  date_start: string; // YYYY-MM-DD
  date_end: string; // YYYY-MM-DD
  level: "campaign" | "ad_group" | "creative";
  external_id: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  currency: string;
};

export type OfflineConversionInput = {
  // Click identifiers — provider-specific ones will be ignored if absent
  gclid?: string;
  fbclid?: string;
  ttclid?: string;
  li_fat_id?: string;
  email?: string; // we hash client-side per provider spec
  phone?: string;
  value: number; // conversion value (currency)
  currency: string;
  event_name: string;
  conversion_time: string; // ISO timestamp
};

export type ProviderTestResult =
  | { ok: true; detail: string; raw?: unknown; mode: "live" | "mock" }
  | { ok: false; error: string; raw?: unknown; mode: "live" | "mock" };

export type AdProvider = {
  id: AdProviderId;
  displayName: string;
  brandColor: string;
  /**
   * Validate config and (cheaply) confirm the credentials work.
   * In mock mode, validates the shape of the config only.
   */
  test(cfg: AdProviderConfig): Promise<ProviderTestResult>;
  /**
   * Pull all campaigns under an account. Returns normalized shape.
   */
  pullCampaigns(cfg: AdProviderConfig, accountExternalId: string): Promise<NormalizedCampaign[]>;
  /**
   * Pull all ad groups under a campaign. Returns normalized shape.
   */
  pullAdGroups(cfg: AdProviderConfig, campaignExternalId: string): Promise<NormalizedAdGroup[]>;
  /**
   * Pull metrics for the given date window. Returns normalized shape.
   * One row per requested level (campaign / ad_group / creative).
   */
  pullMetrics(
    cfg: AdProviderConfig,
    args: {
      accountExternalId: string;
      dateStart: string;
      dateEnd: string;
      level: "campaign" | "ad_group" | "creative";
    },
  ): Promise<NormalizedMetrics[]>;
  /**
   * Push a closed-deal conversion back to the platform for smart bidding.
   * Returns the platform's response so we can store it for debugging.
   */
  pushConversion(
    cfg: AdProviderConfig,
    accountExternalId: string,
    conv: OfflineConversionInput,
  ): Promise<{ ok: boolean; raw?: unknown; error?: string }>;
  /**
   * Whether the provider is fully wired with a real SDK + OAuth.
   * When false, all the above run in mock mode (deterministic fakes).
   */
  isLive(cfg: AdProviderConfig): boolean;
  /**
   * OAuth start URL — kicks off user consent flow.
   * Returns a URL the user should be redirected to.
   */
  oauthStartUrl?(cfg: AdProviderConfig, redirectUri: string, state: string): string;
  /**
   * Exchange OAuth callback code for an access/refresh token pair.
   */
  oauthExchange?(
    cfg: AdProviderConfig,
    code: string,
    redirectUri: string,
  ): Promise<{
    ok: boolean;
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
    raw?: unknown;
    error?: string;
  }>;
};
