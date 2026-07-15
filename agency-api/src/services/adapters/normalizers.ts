import type { AdMetricInput } from "../../types";

/**
 * Pure normalizers — map each platform's raw reporting response into the
 * canonical AdMetricInput shape that PerformanceService consumes. Exported
 * separately so they're unit-testable with fixture payloads (no network).
 *
 * ROAS is computed downstream from budgetSpent + revenue; the normalizer's
 * only job is a faithful, lossless mapping to those two fields + the
 * engagement counters.
 */

/* ── Google Ads ──
 * googleAds:searchStream returns results[].metrics with costMicros,
 * impressions, clicks, conversions, conversionsValue. costMicros is in
 * millionths of the account currency unit. */
export interface GoogleAdsResult {
  metrics?: {
    costMicros?: string;
    impressions?: string;
    clicks?: string;
    conversions?: string;
    conversionsValue?: string;
  };
}
export interface GoogleAdsResponse {
  results?: GoogleAdsResult[];
}

export function normalizeGoogleAds(resp: GoogleAdsResponse): AdMetricInput {
  const m = (resp.results ?? []).reduce(
    (acc, r) => {
      const rm = r.metrics ?? {};
      acc.budgetSpent += Number(rm.costMicros ?? "0") / 1e6;
      acc.impressions += Number(rm.impressions ?? "0");
      acc.clicks += Number(rm.clicks ?? "0");
      acc.conversions += Number(rm.conversions ?? "0");
      acc.revenue += Number(rm.conversionsValue ?? "0");
      return acc;
    },
    { budgetSpent: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0 }
  );
  return { channel: "Google Ads", ...roundAll(m) };
}

/* ── Meta Marketing API ──
 * /{ad_account_id}/insights returns data[] with spend, impressions, clicks,
 * and an actions[] array of {action_type, value} (purchase conversions) +
 * conversion_values (purchase revenue). */
export interface MetaInsight {
  spend?: string;
  impressions?: string;
  clicks?: string;
  actions?: { action_type: string; value: string }[];
  conversion_values?: { action_type: string; value: string }[];
}
export interface MetaResponse {
  data?: MetaInsight[];
}

const META_PURCHASE = "purchase";
export function normalizeMeta(resp: MetaResponse): AdMetricInput {
  const m = (resp.data ?? []).reduce(
    (acc, d) => {
      acc.budgetSpent += Number(d.spend ?? "0");
      acc.impressions += Number(d.impressions ?? "0");
      acc.clicks += Number(d.clicks ?? "0");
      const purchase = (d.actions ?? []).find((a) => a.action_type === META_PURCHASE);
      acc.conversions += Number(purchase?.value ?? "0");
      const rev = (d.conversion_values ?? []).find((a) => a.action_type === META_PURCHASE);
      acc.revenue += Number(rev?.value ?? "0");
      return acc;
    },
    { budgetSpent: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0 }
  );
  return { channel: "Meta Ads", ...roundAll(m) };
}

/* ── TikTok Business ──
 * report/integrated/get returns data.list[] with spend, impressions, click,
 * conversion, and conversion_value (currency). */
export interface TiktokReportRow {
  spend?: string | number;
  impressions?: string | number;
  click?: string | number;
  conversion?: string | number;
  conversion_value?: string | number;
}
export interface TiktokResponse {
  data?: { list?: TiktokReportRow[] };
}

export function normalizeTiktok(resp: TiktokResponse): AdMetricInput {
  const rows = resp.data?.list ?? [];
  const m = rows.reduce<{ budgetSpent: number; impressions: number; clicks: number; conversions: number; revenue: number }>(
    (acc, r) => {
      acc.budgetSpent += Number(r.spend ?? "0");
      acc.impressions += Number(r.impressions ?? "0");
      acc.clicks += Number(r.click ?? "0");
      acc.conversions += Number(r.conversion ?? "0");
      acc.revenue += Number(r.conversion_value ?? "0");
      return acc;
    },
    { budgetSpent: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0 }
  );
  return { channel: "TikTok Ads", ...roundAll(m) };
}

/* ── helpers ── */
function roundAll(m: {
  budgetSpent: number; impressions: number; clicks: number; conversions: number; revenue: number;
}): Omit<AdMetricInput, "channel"> {
  return {
    budgetSpent: Math.round(m.budgetSpent * 100) / 100,
    impressions: Math.round(m.impressions),
    clicks: Math.round(m.clicks),
    conversions: Math.round(m.conversions),
    revenue: Math.round(m.revenue * 100) / 100,
  };
}