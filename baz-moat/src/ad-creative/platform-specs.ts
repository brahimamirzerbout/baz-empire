/**
 * Platform ad specs — the canonical dimensions + character limits per platform.
 *
 * Surgical: a variant that ships to the wrong spec gets disapproved or renders
 * broken. The engine generates copy *within the platform's constraints* —
 * headline length, body length, CTA length, aspect ratio. No spec = guess.
 *
 * Sources: Meta Ads 2026 specs, Google Display, TikTok For Business, LinkedIn
 * Campaign Manager, X Ads. Verified against each platform's docs.
 */

import type { AdSpec, Platform } from "./types.js";

export const PLATFORM_SPECS: Record<Platform, AdSpec> = {
  "meta-feed": {
    platform: "meta-feed", label: "Meta Feed (single image)",
    width: 1080, height: 1080, ratio: "1:1",
    headlineMax: 40, bodyMax: 125, ctaMax: 20,
  },
  "meta-reel": {
    platform: "meta-reel", label: "Meta Reel",
    width: 1080, height: 1920, ratio: "9:16",
    headlineMax: 40, bodyMax: 65, ctaMax: 20,
  },
  "meta-story": {
    platform: "meta-story", label: "Meta Story",
    width: 1080, height: 1920, ratio: "9:16",
    headlineMax: 40, bodyMax: 50, ctaMax: 15,
  },
  "google-display": {
    platform: "google-display", label: "Google Display (responsive)",
    width: 1200, height: 628, ratio: "1.91:1",
    headlineMax: 30, bodyMax: 90, ctaMax: 15,
  },
  "tiktok-feed": {
    platform: "tiktok-feed", label: "TikTok Feed (in-feed)",
    width: 1080, height: 1920, ratio: "9:16",
    headlineMax: 100, bodyMax: 150, ctaMax: 20,
  },
  "linkedin-single": {
    platform: "linkedin-single", label: "LinkedIn Single Image",
    width: 1200, height: 627, ratio: "1.91:1",
    headlineMax: 70, bodyMax: 150, ctaMax: 20,
  },
  "x-single": {
    platform: "x-single", label: "X (Twitter) Single Image",
    width: 1600, height: 900, ratio: "16:9",
    headlineMax: 280, bodyMax: 280, ctaMax: 25,
  },
};

export function getSpec(platform: Platform): AdSpec {
  return PLATFORM_SPECS[platform];
}

/** Truncate a string to fit a platform limit, appending an ellipsis if cut. */
export function fitToLimit(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + "…";
}