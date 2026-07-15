/**
 * Ad Creative — types for the brand-kit-aware generation + predictive-score engine.
 *
 * Surgical, not vibecoded: the value isn't the image — it's the brief-to-spec
 * pipeline. Most "ad creative tools" generate a pretty picture. This engine:
 *   1. Enforces the brand kit (colors, fonts, logo, voice) on every variant.
 *   2. Outputs platform-correct specs (Meta feed vs Reel vs TikTok vs LinkedIn).
 *   3. Gates shipping behind a predictive score (Persado's 96% correlation is
 *      the ceiling; this is a transparent heuristic, not a black box).
 *
 * Lineage: Ogilvy (the big idea + headline) + Hopkins (the reason-why) +
 * Schwartz (awareness → entry) + Wiebe (CTA matches intent) + Cialdini
 * (the persuasive principles that already exist).
 */

export interface BrandKit {
  name: string;
  colors: { primary: string; secondary: string; accent: string; bg: string; text: string };
  fonts: { heading: string; body: string };
  logoUrl?: string;
  /** Brand voice — one line. */
  voice: string;
}

export type Platform = "meta-feed" | "meta-reel" | "meta-story" | "google-display" | "tiktok-feed" | "linkedin-single" | "x-single";

export interface AdSpec {
  platform: Platform;
  label: string;
  /** Pixel dimensions (w × h). */
  width: number;
  height: number;
  /** Aspect ratio string, e.g. "1:1", "9:16", "16:9". */
  ratio: string;
  /** Max headline character count. */
  headlineMax: number;
  /** Max body/primary-text character count. */
  bodyMax: number;
  /** Max CTA character count. */
  ctaMax: number;
}

export type AdVariantStatus = "ship" | "hold" | "kill";

export interface AdVariant {
  platform: Platform;
  /** The big idea (Ogilvy) — one sentence. */
  bigIdea: string;
  headline: string;
  subhead: string;
  body: string;
  cta: string;
  /** Visual direction — what the image/video should show. */
  visualDirection: string;
  /** Brand colors applied to this variant. */
  appliedColors: BrandKit["colors"];
  /** Predictive score 0-100. */
  predictiveScore: number;
  /** Score band. */
  band: "strong" | "competitive" | "weak";
  /** Ship / hold / kill verdict. */
  status: AdVariantStatus;
  /** Why the score landed where it did (transparent, not a black box). */
  scoreBreakdown: ScoreFactor[];
}

export interface ScoreFactor {
  factor: string;
  points: number;
  max: number;
  note: string;
}

export interface AdCreativeInput {
  brief: string;
  /** The offer (Kennedy — the first yes). */
  offer: string;
  /** Buyer awareness stage (Schwartz — entry strategy). */
  awareness: "unaware" | "problem-aware" | "solution-aware" | "product-aware" | "most-aware";
  brand: BrandKit;
  /** Platforms to generate for. */
  platforms: Platform[];
  /** Proof available (case study metric, testimonial). */
  proof?: string;
}

export interface AdCreativeOutput {
  brief: string;
  offer: string;
  awareness: AdCreativeInput["awareness"];
  brandName: string;
  variants: AdVariant[];
  /** Average predictive score across variants. */
  avgScore: number;
  /** Count by status. */
  shipCount: number;
  holdCount: number;
  killCount: number;
  markdown: string;
}