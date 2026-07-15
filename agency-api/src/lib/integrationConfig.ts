import dotenv from "dotenv";
dotenv.config();

/**
 * Typed credential surface for the external ad-platform integrations.
 * Every value is optional — adapters self-report `isConfigured()` and the
 * ingest endpoint refuses to call an unconfigured provider (no network
 * attempts with empty creds). Never log these values.
 *
 * OAuth tokens obtained at runtime are persisted in the IntegrationAccount
 * table; the values here are the app-level credentials used to bootstrap /
 * refresh those tokens.
 */
function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() !== "" ? v.trim() : undefined;
}

export const googleAdsConfig = {
  clientId: env("GOOGLE_ADS_CLIENT_ID"),
  clientSecret: env("GOOGLE_ADS_CLIENT_SECRET"),
  developerToken: env("GOOGLE_ADS_DEVELOPER_TOKEN"),
  customerId: env("GOOGLE_ADS_CUSTOMER_ID"), // login customer id
  refreshToken: env("GOOGLE_ADS_REFRESH_TOKEN"),
  apiVersion: env("GOOGLE_ADS_API_VERSION") || "v17",
};

export const metaAdsConfig = {
  appId: env("META_APP_ID"),
  appSecret: env("META_APP_SECRET"),
  accessToken: env("META_ACCESS_TOKEN"),
  adAccountId: env("META_AD_ACCOUNT_ID"), // e.g. "act_1234567890"
  apiVersion: env("META_API_VERSION") || "v19.0",
};

export const tiktokAdsConfig = {
  appId: env("TIKTOK_APP_ID"),
  appSecret: env("TIKTOK_APP_SECRET"),
  accessToken: env("TIKTOK_ACCESS_TOKEN"),
  advertiserId: env("TIKTOK_ADVERTISER_ID"),
  apiVersion: env("TIKTOK_API_VERSION") || "v1.3",
};

/** SEO fetcher mode: "fetch" (static, zero-dep) or "puppeteer" (JS-rendered). */
export const seoFetcherConfig = {
  mode: (env("SEO_FETCHER") || "fetch") as "fetch" | "puppeteer",
  timeoutMs: parseInt(env("SEO_FETCHER_TIMEOUT") || "15000", 10),
  puppeteerHeadless: env("PUPPETEER_HEADLESS") !== "false",
};

/** Ingest resilience defaults. */
export const ingestConfig = {
  maxRetries: parseInt(env("INGEST_MAX_RETRIES") || "3", 10),
  retryBaseMs: parseInt(env("INGEST_RETRY_BASE_MS") || "400", 10),
  timeoutMs: parseInt(env("INGEST_TIMEOUT_MS") || "20000", 10),
};