# 07 — Onboarding checklist (first 14 days of a signed Core retainer)

> What happens between signature and "tracking live." This is the delivery
> seed — the repeatable sequence every Core pilot runs. Named owner, exit
> criterion per step. No ambiguity, no junior handoff.

## Doctrine

- The clock starts when tracking goes live, not at signature. Everything
  before tracking is on BAZ, not billable against the 90 days.
- One senior partner owns onboarding end-to-end. No "implementation team."
- The client's dev contact is named in week 1 — tracking needs one technical
  hand. If the client has no dev, BAZ deploys the container (that's the
  senior-partner execution lever).

## Week 1 — foundation (days 1–5)

| Day | Step | Owner | Exit criterion |
|---|---|---|---|
| 1 | Kickoff call (30 min): confirm channel, access handoff plan, name client dev contact | BAZ partner + buyer | dev contact named, access checklist sent |
| 1 | Send access checklist (ad account, GTM container, GA4 property, site tag access) | BAZ partner | checklist delivered |
| 2–3 | Grant ad-account access (Google/Meta/TikTok) + OAuth authorize the ingestion adapter | client dev + BAZ partner | `/api/performance/ingest` returns data for the channel |
| 3–4 | Stand up server-side GTM container + GA4 key events (purchase/lead) | BAZ partner | events fire server-side in preview |
| 5 | Provision client portal (portal-token auth, Phase 2) — or interim shared dashboard | BAZ partner | buyer sees their first real numbers |

## Week 2 — measure (days 6–12)

| Day | Step | Owner | Exit criterion |
|---|---|---|---|
| 6–7 | {channel} CAPI live; capture match-rate baseline | BAZ partner | CAPI match rate ≥ baseline (log it) |
| 8–9 | Baseline capture: ROAS, CAC, payback from first 7 days of clean tracking | BAZ partner | baseline row in dashboard `[replace with real]` |
| 10 | First reallocation run against real ROAS | BAZ partner | reallocator chart shipped to portal |
| 11 | First weekly demo (live numbers, one decision) | BAZ partner + buyer | buyer signs off on baseline + first reallocation |
| 12 | 2 creative variants briefed (for iteration cycle 1) | BAZ partner + client | variants in production queue |

## Day 14 — "tracking live" gate

| Gate | Criterion |
|---|---|
| Tracking integrity panel green | server-side coverage ≥90%, CAPI match ≥80%, GA4 key events 100% |
| Baseline locked | ROAS / CAC / payback captured, shared with buyer |
| Day-90 targets set | against the locked baseline (per `04` exit criterion) |
| Portal access live | buyer can view the dashboard without BAZ on the call |

> Day 14 = the 90-day clock starts. Everything before this was onboarding,
> on BAZ. Communicate this clearly at signature (`04` proposal states it).

## What the client receives by day 14

- [ ] Live dashboard (4 panels per `05`)
- [ ] Baseline ROAS / CAC / payback (real numbers)
- [ ] First reallocation chart
- [ ] Portal access (token-authed)
- [ ] CSV export verified
- [ ] The 90-day plan with day-90 targets locked to the baseline

## Failure modes + recovery

| Failure | Recovery |
|---|---|
| Client has no dev to grant access | BAZ deploys the container; bill as a one-time project add-on, not Core scope |
| CAPI match rate < 60% | debugging sprint in week 2; do NOT start the 90-day clock until ≥80% or documented exception |
| Baseline shows ROAS < 1 across all channels | pause — the channel may not be viable; have the honest conversation before burning 90 days |
| Client wants a second channel mid-onboarding | quote Growth tier; do not expand Core scope |

## Flags

- Onboarding assumes the integration adapters (`agency-api` integration prep)
  are complete and OAuth-ready. If not, run week-2 ingest manually (export →
  `AdMetric` seed) and ship the adapter in parallel.
- Portal-token auth is Phase 2 of the 90-day plan. If it's not shipped by the
  first pilot, use an interim shared dashboard (Looker Studio / Metabase) and
  migrate to the portal when ready. Do not block onboarding on the portal.