/**
 * The BAZ Tracking Default — the canonical checklist deployed on every paid engagement.
 *
 * This is the moat product: reusable across clients (bespoke = service; reusable = moat).
 * Leak fractions are conservative, derived from 2025 industry reports
 * (Promethean: AI compression; Starr Conspiracy: attribution gaps; Foxwell: creative/ops).
 * Replace with BAZ's own empirical data after the first 10 diagnostics (proof plan).
 */

import type { TrackingComponent } from "./types.js";

export const TRACKING_DEFAULT: readonly TrackingComponent[] = [
  {
    id: "ssgtm",
    label: "Server-side GTM (ssGTM)",
    purpose:
      "Server-side event collection that survives browser-level tracking protection and ad-blockers. The data layer BAZ owns.",
    leakFraction: 0.08, // ~8% of events lost to ad-blockers + ITP without ssGTM
  },
  {
    id: "ga4",
    label: "GA4 (proper config)",
    purpose:
      "GA4 with custom events, conversions, and key events scoped to revenue — not default page_view-only setup.",
    leakFraction: 0.05,
  },
  {
    id: "capi-meta",
    label: "Meta Conversions API (CAPI)",
    purpose:
      "Server-side conversion events to Meta for optimization signal + deduplication with the pixel.",
    leakFraction: 0.12, // CAPI lifts attributed conversion signal materially
  },
  {
    id: "capi-google",
    label: "Google Enhanced Conversions",
    purpose: "Server-side hashed first-party conversion data to Google Ads.",
    leakFraction: 0.06,
  },
  {
    id: "consent",
    label: "Consent management (GDPR/TCPA)",
    purpose:
      "Consent banner + consent-mode signals so EU/CA tracking is lawful and consent-denied users still contribute modeled conversions.",
    leakFraction: 0.04,
    gdprRelevant: true,
  },
  {
    id: "attribution-model",
    label: "Attribution model (data-driven, not last-click)",
    purpose:
      "Data-driven or MMM-informed attribution instead of default last-click, which starves upper-funnel channels.",
    leakFraction: 0.1,
  },
  {
    id: "mmm-lite",
    label: "MMM-lite (media mix modeling, lightweight)",
    purpose:
      "A lightweight media-mix model to triangulate platform-reported vs modeled vs incrementality — the moat against platform attribution inflation.",
    leakFraction: 0.07,
  },
  {
    id: "lifecycle-events",
    label: "Lifecycle/revenue events (LTV, refund, churn)",
    purpose:
      "Post-purchase events (LTV, refund, churn) fed back to ad platforms so optimization targets true value, not first purchase.",
    leakFraction: 0.09,
  },
] as const;

/** Map id -> component for fast lookup. */
export const BY_ID: ReadonlyMap<string, TrackingComponent> = new Map(
  TRACKING_DEFAULT.map((c) => [c.id, c]),
);

export function getComponent(id: string): TrackingComponent | undefined {
  return BY_ID.get(id);
}