/**
 * Per-platform creative spec validation.
 *
 * Each ad platform rejects ads that don't meet their format requirements.
 * We validate here so the marketer gets feedback BEFORE pushing to the
 * platform (where it would silently fail or get auto-rejected).
 */

export type SpecCheck = {
  ok: boolean;
  warnings: string[];
  errors: string[];
};

export type CreativeInput = {
  kind: "text" | "image" | "video" | "carousel";
  headline?: string;
  body?: string;
  cta?: string;
  asset_url?: string;
  metadata?: Record<string, any>;
};

const SPECS = {
  google_ads: {
    headline: { max: 30 },
    description1: { max: 90 },
    description2: { max: 90 },
    cta: {
      allowed: [
        "learn_more",
        "sign_up",
        "shop_now",
        "book_now",
        "get_quote",
        "contact_us",
        "subscribe",
        "download",
      ],
    },
  },
  meta_ads: {
    primary_text: { max: 125, recommended: 80 },
    headline: { max: 40 },
    description: { max: 30 },
    cta: {
      allowed: [
        "learn_more",
        "shop_now",
        "sign_up",
        "book_now",
        "get_offer",
        "get_quote",
        "contact_us",
        "subscribe",
        "download",
        "install_app",
        "watch_more",
      ],
    },
  },
  tiktok_ads: {
    text: { max: 100, recommended: 60 },
    cta: { allowed: ["learn_more", "shop_now", "sign_up", "download", "install_app", "watch_now"] },
  },
  linkedin_ads: {
    headline: { max: 70 },
    intro_text: { max: 150 },
    cta: { allowed: ["learn_more", "sign_up", "subscribe", "apply", "download", "view_now"] },
  },
};

export function validateCreative(provider: string, c: CreativeInput): SpecCheck {
  const result: SpecCheck = { ok: true, warnings: [], errors: [] };
  const spec = (SPECS as Record<string, unknown>)[provider];
  if (!spec) return result;

  // Headline length
  if (c.headline) {
    const max = spec.headline?.max || 100;
    if (c.headline.length > max)
      result.errors.push(`Headline is ${c.headline.length} chars (max ${max} for ${provider})`);
    else if (spec.headline?.recommended && c.headline.length > spec.headline.recommended)
      result.warnings.push(
        `Headline is ${c.headline.length} chars (recommended ≤ ${spec.headline.recommended} for ${provider})`,
      );
  }

  // Body length
  if (c.body) {
    const max = spec.primary_text?.max || spec.text?.max || spec.intro_text?.max || 500;
    if (c.body.length > max)
      result.errors.push(`Body is ${c.body.length} chars (max ${max} for ${provider})`);
    const rec = spec.primary_text?.recommended || spec.text?.recommended;
    if (rec && c.body.length > rec)
      result.warnings.push(`Body is ${c.body.length} chars (recommended ≤ ${rec})`);
  }

  // CTA validity
  if (c.cta) {
    const allowed = spec.cta?.allowed as string[] | undefined;
    if (allowed && !allowed.includes(c.cta.toLowerCase())) {
      result.warnings.push(
        `CTA "${c.cta}" isn't a standard value for ${provider}. Use one of: ${allowed.join(", ")}`,
      );
    }
  }

  // Image / video basic checks
  if (c.kind === "image") {
    if (!c.asset_url) {
      result.errors.push("Image creative needs asset_url");
    } else if (!/^https?:\/\//.test(c.asset_url) && !c.asset_url.startsWith("data:")) {
      result.errors.push("Image asset_url must be http(s) URL or data URL");
    }
  }

  result.ok = result.errors.length === 0;
  return result;
}

export function specForProvider(provider: string) {
  return (SPECS as Record<string, unknown>)[provider] || {};
}
