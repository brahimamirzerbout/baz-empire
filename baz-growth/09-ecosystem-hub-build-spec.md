# 09 — Ecosystem Hub build spec (consolidated from 6 prompt editions)

> Consolidates the 6 master-prompt editions you generated (Base → Competitive
> Benchmark → Cannes Industry Leaders → CMO Legends → YouTube Practitioners →
> GitHub Looting). De-bloated to what actually changes code, mapped onto what
> we've already shipped, with a realistic build strategy that doesn't fall
> into the "no-TODO, fully-working-in-one-response" trap.

## Assessment of the 6 editions

| Edition | What it adds | Load-bearing? |
|---|---|---|
| Base Modular | The 24-module definitions + app codenames | **YES — the spine** |
| Competitive Benchmark | Per-type real-agency benchmark + KPI focus | **YES — KPI + design-language column** |
| Cannes Industry Leaders | Swaps benchmarks to 2026 award winners | marginal — vanity signal, same code shape |
| CMO Legends | Pritchard/Bozoma/Rajamannar/Machado/Treseder frameworks | **NO — prompt bloat.** "Quantum multisensory" and "constructive disruption" don't compile to features without hand-waving. |
| YouTube Practitioners | Ahrefs/Ben Heath/MeasureSchool/McDowell/Martell | partial — useful for 3-4 modules (SEO, paid social, tracking, web), noise for the rest |
| GitHub Looting | shadcn/dub/cal.com/medusa/activepieces/tldraw/novu patterns | **YES — the most engineer-actionable edition.** Tells you which OSS architecture to replicate per module. |

**Verdict:** 2 editions do the structural work (Base + GitHub Looting). 1 adds
the KPI/design column (Competitive Benchmark). 3 are prompt weight that won't
change the deliverable. The consolidated spec below keeps the three
load-bearing columns and cuts the rest.

## The trap to name explicitly

Every edition ends with: *"No placeholders, no `// TODO`, fully working, every
button programmed."* That instruction, sent to any AI coder for 24 modules,
**produces fake-complete code** — mock CRUD that pretends to be a backend,
hardcoded "calculators," state that resets on reload. It looks done and isn't.

You already know this (your own read: "perfectly curated prompts and free AI
coder responses"). So the build strategy below inverts the instruction:

- **Schema-first, not UI-first.** Prisma model per module before a single
  React component. The schema is the contract; the UI is a view on it.
- **Mock data is labeled mock.** No mock pretending to be a live API. The
  agency-api already has real engines for 3 modules — wire to those, don't
  fake them.
- **One module deep before 24 shallow.** The pilot module
  (`OptimizedA/B` = performance marketing) ships fully — schema, API, UI,
  real engine hook, tests. Then breadth.
- **TODOs are honest.** A documented `TODO(real-data): wire GA4 ingest` is
  senior-grade. A fake-complete function that silently returns hardcoded
  numbers is junior-pod work. We allow the former, never ship the latter.

## Canonical 24-module build map

> Columns: codename (from editions) · GitHub pattern to replicate · benchmark
> agency (design language + KPI) · KPI focus · **existing surface to extend**
> · build priority. Priority aligns to the growth wedge (`01`) + content
> sequence (`06`).

| # | Type | Codename | Loot (OSS pattern) | Benchmark | KPI focus | Existing surface | Priority |
|---|---|---|---|---|---|---|---|
| 18 | Performance Marketing | OptimizedA/B | dub (analytics/attribution) | PMG | CPA, ROAS, CVR | **`agency-api` `/performance/optimize` engine (LIVE)** + hub `/agency/performance-marketing-agency` | **P0 — pilot** |
| 21 | SEO / SEA | RankAudit | dub (link analytics) + Ahrefs patterns | Ahrefs/Sam Oh | rank, CTR, backlink profile, topical authority | **`agency-api` `/seo/analyze` engine (LIVE)** + `/agencies/seo-agency` page | **P0 — pilot** |
| 10 | Influencer | CreatorCRM | dub (geo/device tracking) | Viral Nation | engagement, alignment score, CPE | **`agency-api` `/influencers/match` engine (LIVE)** + `/agency/influencer-marketing-agency` | P1 |
| 8 | Full-Service | IntegratedClientPortal | shadcn/ui | Publicis | cross-workflow aggregation | hub client portal (WIP, Phase 2) | P1 |
| 4 | Digital | DigitalCentral | dub + MeasureSchool | Razorfish | web/social/shop aggregation, attribution | hub dashboard + `AdMetric` model | P1 |
| 11 | Internet & Web | WebLaunch | vercel/commerce + Wes McDowell | Huge | LCP, CLS, device parity, CVR | BAZ founder strength (Next.js+Supabase) | P1 |
| 17 | Online Marketing | SocialAdMock | shadcn/ui + Ben Heath | Tinuiti | CPC, CTR, creative variant ROAS | `AdMetric` by variant | P2 |
| 20 | Social Media | GeoTargetAd | dub | VaynerMedia | geo CTR, posting cadence, engagement | hub `/agency/social-media-agency` | P2 |
| 15 | Media | MediaPlanner | tremor | GroupM/Wavemaker | CPM, reach, waste %, ROI | new — `MediaBuy` model needed | P2 |
| 1 | Branding | StyleGuide Studio | shadcn/ui | Landor/Wolff Olins | brand consistency, asset usage | new — `BrandAsset` model | P2 |
| 13 | Creative | CampaignCraft | tldraw (canvas) | Droga5/Machado | ad recall, emotional engagement, delivery time | new — `Campaign`+`Storyboard` | P2 |
| 2 | Content Marketing | EditorialEngine | activepieces | NP Digital | content throughput, SEO rank lift | `marketing-engine/` (8 files, undocumented) | P2 |
| 9 | Inbound Marketing | NurtureFlow | activepieces (workflow) | HubSpot | lead→MQL rate, email CTR | new — `Lead`+`EmailFlow` | P3 |
| 5 | Dialog Marketing | JourneyMapper | activepieces (flow builder) | Wunderman Thompson | journey completion, stage conversion | new — `CustomerJourney` | P3 |
| 22 | Strategy | RoadmapBuilder | activepieces | McKinsey | positioning matrix, milestone hit rate | `frameworks.ts` (180 entries, partially shipped) | P3 |
| 23 | Management Consulting | ProfitAudit | tremor | BCG | EBITDA lift, overhead reduction, ROI | new — `FinancialAudit` | P3 |
| 14 | Marketing | BrandEquity | tremor | Interbrand | share-of-voice, brand valuation | new — `BrandMetric` | P3 |
| 19 | PR | PressDesk | novu (dispatch) | Edelman | EMV, sentiment, crisis response time | new — `PressContact`+`Release` | P3 |
| 12 | Communication | VoiceGuard | novu | Ketchum | guideline adherence, approval cycle | new — `CommsGuideline` | P3 |
| 7 | Event | RunOfShow | cal.com (scheduling) | VML | RSVP rate, attendance, activation scan | new — `Event`+`RSVP` | P3 |
| 24 | Video / Film | CallSheetPro | cal.com + Mother London | RSA Films | shoot-day adherence, asset delivery | new — `CallSheet`+`Gear` | P4 |
| 3 | Design | VisualVibe | tldraw (canvas) | Pentagram | moodboard iterations, crop parity | new — `Moodboard` | P4 |
| 16 | Mobile App | AppWireframe | shadcn/ui | AKQA | prototype fidelity, gesture coverage | new — `Wireframe` | P4 |
| 6 | E-commerce | ShopSync | medusa (headless commerce) | DEPT | cart abandon, inventory sync, AOV | new — `Product`+`Order` | P4 |

## What's already built (don't duplicate — extend)

| Module | Status | Where |
|---|---|---|
| Performance (OptimizedA/B) | **engine live** — ROAS reallocator, ad-metric model, 11 unit tests, HTTP smoke green | `agency-api` `/api/performance/*` |
| SEO (RankAudit) | **engine live** — on-page analyzer, phrase-match fix, SeoAudit model | `agency-api` `/api/seo/*` |
| Influencer (CreatorCRM) | **engine live** — multi-factor matcher, Influencer model, 6 seeded | `agency-api` `/api/influencers/*` |
| Strategy (RoadmapBuilder) | **partial** — `/strategy/frameworks` page + 180-entry `frameworks.ts`; execution tools unverified | hub `src/lib/frameworks.ts` |
| Content (EditorialEngine) | **code exists, undocumented** — `marketing-engine/` 8 files + 4 API routes, no plan | hub `src/lib/marketing-engine/` |
| Full-Service portal | **WIP** — portal-token auth + `agency_clients.theme` (Phase 2 of 90-day plan) | hub |
| 24 public content surfaces | **live** — SSG `/agencies/[slug]` + `agencyPlain.ts` + JSON-LD | hub `(public)/agencies` |

> **The 3 P0/P1 modules already have real backends.** The build work is the
> UI layer + wiring to the live engines, not greenfield. This is the leverage.

## Build strategy (the anti-trap protocol)

For every module, in this order, no skipping:

1. **Schema** — Prisma model in `agency-api/prisma/schema.prisma`. Review
   against the OSS "loot" pattern (e.g. ShopSync models medusa's variant
   relations). This is the contract.
2. **API** — controllers + routes in `agency-api`, Zod validation, wired
   through the existing error handler + helmet + rate-limit. Reuse the
   singleton `prisma.ts`. No `new PrismaClient()` per route.
3. **Engine** (if algorithmic) — pure service in `src/services/`, decoupled
   from Prisma, unit-tested with `tests/`. (See how Performance/SEO/Influencer
   were built.)
4. **UI** — hub module page under `/agency/[slug]`, server-shell + client
   island, Tailwind, shadcn/ui patterns. Reads from the API, never fakes data.
5. **Mock data** — labeled `mock` in a `seed-*.ts`; never inline in the UI as
   if it were live.
6. **Integration hook** — where a real external API fits (Google/Meta/TikTok
   for performance, Ahrefs for SEO), stub the adapter behind the integration
   interface (`src/types/integration.ts`) with `isConfigured()` gating.
7. **TODOs are documented, not hidden.** `TODO(real-data): wire GA4 ingest`
   in a comment is fine. Fake-complete is not.

## Build sequence (aligned to revenue, not alpha)

| Wave | Modules | Why this order | Exit criterion |
|---|---|---|---|
| **P0 (now)** | OptimizedA/B (18) + RankAudit (21) | engines already live; this is the pilot demo + the inbound moat in one wave | both modules full-stack: schema→API→engine→UI→tests, wired to live engines |
| **P1** | CreatorCRM (10), IntegratedClientPortal (8), DigitalCentral (4), WebLaunch (11) | pilot delivery stack — influencer engine live; portal is Phase 2; digital/web are founder strength | pilot client can run their retainer through the hub |
| **P2** | SocialAdMock (17), GeoTargetAd (20), MediaPlanner (15), StyleGuide Studio (1), CampaignCraft (13), EditorialEngine (2) | breadth for Growth-tier positioning; content engine documents the orphaned `marketing-engine/` | 12 modules live; Growth-tier demo possible |
| **P3** | NurtureFlow (9), JourneyMapper (5), RoadmapBuilder (22), ProfitAudit (23), BrandEquity (14), PressDesk (19), VoiceGuard (12), RunOfShow (7) | ascension rungs + breadth | 20 modules live |
| **P4** | CallSheetPro (24), VisualVibe (3), AppWireframe (16), ShopSync (6) | long-tail depth; lower revenue tie | 24/24 live |

> **P0 is two modules, both with live engines.** That's the entire close-demo
> for the first Core retainer (`04`). Everything else is scalable breadth
> after pilot 1 proves the model. Do not start P2 before P0 ships.

## Reconciliation checks before building

1. **Slug reconciliation** — the editions' 24 labels must map to the hub's
   `AGENCY_TYPES` slugs in `src/lib/agencyTypes.ts` (verified 24-type
   taxonomy). Verify exact slug strings; the codenames above are display
   names, not slugs.
2. **Module-vs-page separation** — `/agencies/[slug]` (public, SSG, SEO/AEO)
   is distinct from `/agency/[slug]` (gated working module). The build map
   targets the **gated working modules**. Don't conflate.
3. **agency-api is the shared backend** for all 24 — not 24 separate Vite
   SPAs. One Prisma schema, one Express app, one auth/rate-limit/error stack.
   The editions suggest standalone apps; we consolidate into one hub + one API.

## Flags

- The CMO/Cannes/legends editions are cut from this spec. If you want a
  specific CMO framework reflected in a module's KPI set, name the module +
  the framework and I'll wire it into that module's dashboard — not into the
  prompt for all 24.
- "No placeholders / fully working" is replaced by "schema-first, honest
  TODOs, real engine hooks, labeled mock data." This produces senior-grade
  code; the original instruction produces junior-pod illusions.
- All KPI targets in any module dashboard are `[replace with real]` until the
  first pilot ships data. No fabricated baselines in a shipped module.

## One prioritized next action

**Ship P0: the Performance (OptimizedA/B) module UI wired to the live
`/performance/optimize` engine.** The backend is done (schema, API, engine,
tests). The work is the hub module page — server shell, ROAS dashboard,
reallocation chart, variant table, CSV export — reading from the API. That
module, demoed on a prospect's real data, is the close in `04`. Say "build
P0" and I start with the Prisma-side verification (already done) → the hub
module page → wired → smoke-tested.

## Two clarifying questions

1. **Build or spec?** Do you want me to start building P0 now (the Performance
   module UI on the live engine), or were you consolidating the prompt set
   into a canonical spec to feed a different AI coder / a later build session?
2. **One hub or 24 apps?** The editions imply 24 standalone apps. My strong
   recommendation is **one hub + one shared agency-api** (what we've built).
   Confirm before P0 — the architecture diverges hard otherwise.