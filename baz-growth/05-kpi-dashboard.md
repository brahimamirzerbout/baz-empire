# 05 — KPI dashboard spec (instrument from day 1)

> What gets measured is what gets proven. This is the dashboard every pilot
> client sees in their portal — revenue metrics only, no vanity. Maps
> directly to the `agency-api` models so the data layer is already built.

## Doctrine

Every metric on the dashboard satisfies **at least one** of:
- ties to revenue (LTV, CAC, payback, pipeline)
- drives a budget decision (ROAS, reallocation delta)
- proves the tracking is honest (server-side coverage %)

If it satisfies none, it's not on the dashboard.

## The dashboard — one screen, four panels

### Panel 1 — Revenue truth (the only panel the buyer's boss cares about)

| Metric | Definition | Source | Target |
|---|---|---|---|
| **Tracked ROAS** (channel) | revenue / ad spend, server-side | `AdMetric.revenue / .budgetSpent` | +20% vs baseline by day 90 |
| **Blended CAC** | spend / new customers (server-side conversions) | `AdMetric.budgetSpent / .conversions` | −10% vs baseline |
| **Payback period** | CAC / monthly gross margin per customer | derived | −15% vs baseline |
| **Pipeline value** (if B2B) | attributed pipeline from the channel | CRM join | upward trend |

### Panel 2 — Budget reallocation (what we did this week)

| Metric | Definition | Source |
|---|---|---|
| **Suggested vs. actual spend** (per channel) | reallocator output vs. deployed | `/api/performance/optimize` |
| **Reallocation delta** | $ moved from low-ROAS → high-ROAS | reallocator `action` field |
| **Reallocation accuracy** | % of spend on channels ROAS ≥ target | derived | ≥80% |

### Panel 3 — Tracking integrity (the moat, made visible)

| Metric | Definition | Source | Target |
|---|---|---|---|
| **Server-side conversion coverage** | server-confirmed conversions / platform-reported | `AdMetric` join vs platform | ≥90% |
| **CAPI match rate** | matched / sent events | platform CAPI diagnostics | ≥80% |
| **GA4 event integrity** | key events firing server-side | GTM server logs | 100% of key events |

> Panel 3 is the differentiator. No other agency shows the client that their
> numbers are honest. This panel is why BAZ wins the renewal.

### Panel 4 — Creative test results (what we learned)

| Metric | Definition | Source |
|---|---|---|
| **Variant ROAS** (per creative) | revenue / spend per variant | `AdMetric` by variant |
| **Winning variant** | highest ROAS variant this cycle | derived |
| **Cost per acquisition** (per variant) | spend / conversions per variant | derived |

## Data model mapping (already built)

| Dashboard metric | agency-api model | Endpoint |
|---|---|---|
| ROAS, CAC, spend, conversions | `AdMetric` | `/api/campaigns/:id/metrics` |
| Reallocation | computed by `PerformanceService` | `/api/performance/optimize` |
| Ingest (real data) | adapters → `AdMetric` rows | `/api/performance/ingest` (WIP, integration prep) |
| SEO (for expansion demo) | `SeoAudit` | `/api/seo/analyze` |
| Influencer (for expansion demo) | `Influencer` | `/api/influencers/match` |

> The data layer is shipped. The dashboard is a view on `AdMetric` + the
> reallocator output. No new models needed for Core; Growth adds the SEO +
| influencer panels.

## What's NOT on the dashboard (and why)

| Excluded vanity metric | Why it's off |
|---|---|
| Impressions | no revenue tie |
| Reach | no revenue tie |
| "Engagement rate" (platform) | no revenue tie, platform-inflated |
| Follower growth | no revenue tie |
| Click-through rate (alone) | useful for creative diagnosis, not a board metric — lives in Panel 4 context, never standalone |

## Instrumentation checklist (day 1–14 of every pilot)

- [ ] Server-side GTM container deployed
- [ ] GA4 key events defined (purchase/lead) + firing server-side
- [ ] {channel} CAPI live + match rate baseline captured
- [ ] `AdMetric` ingestion adapter authorized (Google/Meta/TikTok OAuth)
- [ ] Baseline ROAS / CAC / payback captured (week 2, post-tracking)
- [ ] Client portal access provisioned (portal-token auth — Phase 2)
- [ ] CSV export verified (client owns the data)

## Cadence

| Report | To whom | Frequency | Content |
|---|---|---|---|
| Weekly demo | buyer | weekly | one screen (all 4 panels), one decision |
| Monthly revenue report | buyer + finance | monthly | Panel 1 + reallocation summary + next-month plan |
| Day-90 review | buyer + their boss | once | exit-criterion verdict + renew/graduate/expansion |

## Flags

- Baselines are `[replace with real]` until week 2 of pilot 1 (tracking must
  be live to measure them). Do not put a fabricated baseline in the dashboard.
- B2B pipeline value requires a CRM join — out of Core scope, in Growth scope.
  Show Panel 1's three Core metrics; add pipeline when Growth.