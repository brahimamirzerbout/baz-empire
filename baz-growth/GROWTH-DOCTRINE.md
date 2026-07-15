# BAZ Growth Doctrine — building the agency on the platform

> Senior-partner operator doctrine. Every line ties a technical asset we
> shipped to a revenue motion. If a guideline doesn't improve one of
> {positioning, offer, lead flow, close rate, delivery, retention,
> scalability}, it gets cut.

## Diagnosis (≤3 sentences)
BAZ has a shipped technical substrate (marketing-hub content surfaces + working
modules, agency-api with performance/SEO/influencer engines, 24-type taxonomy,
client-portal + billing WIP) but zero paying clients on it. The risk is not
capability — it's that capability stays invisible and the first pilot never
closes. The fix is a single-wedge pilot that turns the platform into the demo
and the delivery at the same time.

## The move
**One vertical, one pilot, one proof.** Lead with performance marketing
(BAZ's strongest founder-signal capability: AI + CRM + tracking), sell a
Core retainer to one brand client, run the 90-day pilot through the hub, and
let the agency-api engines run on the client's real data in the closing demo.
The platform is the offer — demo it, don't deck it.

## The 10 guidelines (doctrine)

| # | Guideline | What it improves | Platform hook |
|---|---|---|---|
| 1 | **The platform IS the offer.** Demo the live hub + engines, never a storyboard. | close rate, positioning | `agency-api` performance/SEO/influencer endpoints run on prospect's data in demo |
| 2 | **One wedge, then depth.** Performance marketing first; do not sell 24 capabilities at once. | positioning, delivery quality | pilot module = `performance-marketing-agency` (90-day plan Phase 1) |
| 3 | **Content surfaces = the inbound moat.** Every `/agencies/[slug]` page is one qualified search intent. Ship all 24, then depth. | lead flow, scalability | `(public)/agencies` SSG pages + `agencyPlain.ts` (AEO-citable) |
| 4 | **Retainer compounds, project proves.** Core retainer is the revenue engine; fixed-scope project is the entry/proof door. | retention, revenue quality | `Core $6.5–9.5k` / `Growth $18–28k` / `Project $12–80k` (see `09` grid) |
| 5 | **Tracking is the moat — ship it day 1.** No proof without server-side GTM + GA4 + CAPI. Every pilot is instrumented before first ad dollar. | delivery quality, proof | `geo.ts` doctrine + `AdMetric` ingestion adapters (Google/Meta/TikTok) |
| 6 | **The engines prove capability in the close.** Run the reallocator / SEO analyzer / influencer matcher on the prospect's numbers live. | close rate | `/api/performance/optimize`, `/api/seo/analyze`, `/api/influencers/match` |
| 7 | **Senior-partner delivery on a productized substrate.** Partner time goes to strategy; the hub handles dashboards, exports, reports. | scalability, delivery quality | client portal (`agency_clients.theme`) + CSV export + KPI surfaces |
| 8 | **Calibrate for geography, ship one message.** MENA (Algiers, AR/FR), EU (GDPR, EN), US (EN, case-hungry). | lead flow, close rate | `agencyPlain.ts` + site localization; Algiers as the base in `site.html` |
| 9 | **Revenue not vanity.** No proposal contains a vanity metric. Every number ties to LTV/CAC/payback/pipeline. | positioning, close rate | KPI dashboard spec (`05`) keys on revenue, not impressions |
| 10 | **90-day exit criteria, every retainer.** Named owner, budget, exit criterion at day 90. Renew or graduate. | retention, scalability | pilot proposal (`04`) bakes the exit criterion into the SOW |

## Platform → revenue-motion map

| Asset (shipped) | Role in the motion | Revenue lever |
|---|---|---|
| `site.html` (baz-empire, `site-ship` branch) | Front door, credibility, lead capture | lead flow |
| `(public)/agencies` 24 SSG pages + JSON-LD | Inbound demand engine (SEO/AEO) | lead flow (organic) |
| `agency-directory.html` SPA | Sales-enablement visual (the 24-type grid, in the room) | close rate |
| `agency-api` CRUD + engines | Proof-of-capability in the demo; delivery substrate after close | close rate, delivery |
| `agency-api` integration adapters (Google/Meta/TikTok) | Real-data ingest → engines run on client truth | proof, delivery |
| Hub client portal + billing (WIP) | Retention: client sees the work, pays the invoice in one place | retention, revenue quality |
| `marketing-engine/` (8 files, 4 routes, undocumented) | Depth backlog — productize after Wave 1 | scalability |

## Risks, assumptions, tradeoffs

- **Assumption**: BAZ sells marketing retainers to **brands** (not the hub to
  other agencies). The portal + billing WIP implies a brand-client delivery
  model. If the model is "embed the hub for agencies," the GTM matrix in `01`
  inverts — confirm before executing.
- **Risk**: The content surfaces are a **long-cycle** demand engine (SEO takes
  90–180 days to compound). Do not rely on them for the first pilot — outreach
  (`02`) is the day-0 lead source; content is the day-90+ compounding source.
- **Risk**: Demoing the engines on prospect data requires read access to their
  ad accounts. Build the OAuth handoff (integration prep) before the first
  demo or use sanitized sample data and say so.
- **Tradeoff**: One wedge (performance marketing) sacrifices breadth for speed.
  Correct — depth proves the model; breadth dilutes the first 90 days.
- **Assumption**: All metrics in seed templates are **composite** until the
  first pilot ships. Flagged `[replace with real]` everywhere. Never ship a
  proposal with a composite number unflagged.

## Now / Next / Later

| Window | Move | Exit criterion |
|---|---|---|
| **Now (days 0–14)** | Ship outreach (`02`) to 40 ICP prospects; finalize `04` pilot proposal; finish integration prep so engines run on real data. | 3 discovery calls booked |
| **Next (days 14–60)** | Run demos with live engines on prospect data; close 1 Core retainer; instrument pilot day 1. | 1 signed Core retainer ($6.5–9.5k/mo, 90-day min) |
| **Later (days 60–180)** | Deliver pilot through the hub; ship all 24 content pages for inbound compounding; document `marketing-engine`; pursue pilot 2. | pilot 1 hits 90-day exit criterion; 2nd pilot signed |

## Closing directive
Diagnose first, architect the offer, ship the system, hold the line on what
moves revenue. The platform is built. The job now is to make one client pay
to see it run.