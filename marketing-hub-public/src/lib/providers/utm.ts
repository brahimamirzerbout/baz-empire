/**
 * UTM auto-injection for ad creative destination URLs.
 *
 * Every platform has different conventions:
 *   - Google Ads:   {lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={campaignname}
 *   - Meta Ads:     {{site_link_name}}?utm_source=meta&utm_medium=paid_social&utm_campaign={{campaign.name}}
 *   - TikTok:       {{landing_page_url}}?utm_source=tiktok&utm_medium=paid_social
 *   - LinkedIn:     ?utm_source=linkedin&utm_medium=paid_social
 *
 * Each platform's VALUE TRACKING TEMPLATE is stored on the ad_creative so
 * the platform swaps in the right macro at render time. We just produce the
 * base URL with the macros embedded.
 */

export type UtmBuildInput = {
  provider: string; // 'google_ads' | 'meta_ads' | 'tiktok_ads' | 'linkedin_ads'
  destination_url: string; // The marketer-supplied landing page URL
  campaign_name?: string; // Used in some macros
  ad_group_name?: string;
  source?: string;
  medium?: string;
};

export function buildDestinationUrl(input: UtmBuildInput): string {
  const base = (input.destination_url || "").trim();
  if (!base) return "";

  const source = input.source || defaultSourceFor(input.provider);
  const medium = input.medium || defaultMediumFor(input.provider);

  // Build the utm_* query params
  const params = new URLSearchParams();
  params.set("utm_source", source);
  params.set("utm_medium", medium);
  if (input.campaign_name) params.set("utm_campaign", slugify(input.campaign_name));
  if (input.ad_group_name) params.set("utm_content", slugify(input.ad_group_name));

  switch (input.provider) {
    case "google_ads": {
      // Google ValueTrack parameter pattern
      const sep = base.includes("?") ? "&" : "?";
      return `${base}${sep}${params.toString()}&utm_term={keyword}&utm_id={creative}`;
    }
    case "meta_ads": {
      // Meta URL tags macros
      const sep = base.includes("?") ? "&" : "?";
      return `${base}${sep}${params.toString()}&utm_term={{ad.name}}`;
    }
    case "tiktok_ads": {
      // TikTok macros
      const sep = base.includes("?") ? "&" : "?";
      return `${base}${sep}${params.toString()}&utm_term=__CID__`;
    }
    case "linkedin_ads": {
      const sep = base.includes("?") ? "&" : "?";
      return `${base}${sep}${params.toString()}`;
    }
    default:
      return appendQuery(base, params.toString());
  }
}

function defaultSourceFor(provider: string): string {
  switch (provider) {
    case "google_ads":
      return "google";
    case "meta_ads":
      return "meta";
    case "tiktok_ads":
      return "tiktok";
    case "linkedin_ads":
      return "linkedin";
    default:
      return "unknown";
  }
}

function defaultMediumFor(provider: string): string {
  switch (provider) {
    case "google_ads":
      return "cpc";
    case "meta_ads":
      return "paid_social";
    case "tiktok_ads":
      return "paid_social";
    case "linkedin_ads":
      return "paid_social";
    default:
      return "paid";
  }
}

function slugify(s: string): string {
  return (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

function appendQuery(url: string, qs: string): string {
  if (!qs) return url;
  return url.includes("?") ? `${url}&${qs}` : `${url}?${qs}`;
}
