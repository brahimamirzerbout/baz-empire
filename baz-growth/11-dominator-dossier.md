# BAZ Dominator Dossier — Loot the Category Kings

> **Mission:** For each of the 24 agency types, identify the agencies that *dominate* that
> category, extract the methodology/moat that makes them dominant, and map it to a concrete
> BAZ code upgrade. BAZ is the dominator-in-waiting; this is the blueprint to embody
> best-of-each-category in one senior-partner platform.
>
> Researched July 2026 via live web search of market leaders, rankings, and methodology pages.
> Dominators named are the category kings per independent rankings (COMvergence, O'Dwyer's,
> PRovoke, Everest PEAK Matrix, Gartner MQ, Clutch, WARC, Ad Age, Adweek, Cannes).

---

## How to read this

Each entry: **Dominator(s)** → **Their moat** (the thing that wins) → **BAZ loot** (what we
extract) → **Code upgrade** (the file/layer it lands in). Build verdict tags each type:

- **DEPTH** = has a genuine pure algorithm worth a bespoke engine (agency-api + hub module).
- **BREADTH** = workflow discipline; the generic schema-driven shell is the right tool; enrich
  the schema with dominator-grade KPIs/fields.
- **CONTENT** = the public content surface (`/agencies/[slug]`) is the lever — fold the
  dominator methodology into an indexable page.

---

## 1. performance-marketing-agency — DEPTH ✅ (engine live)

- **Dominator(s):** Tinuiti ($4B+ media, "Bliss Point" saturation-curve OS), Wpromote
  (integrated growth), KlientBoost (PPC+CRO loop), Disruptive Advertising (PPC+CRO),
  Directive (B2B SaaS pipeline "Customer Generation"), NP Digital (Global Agency of Year).
- **Moat:** Tie spend to *pipeline/revenue*, not clicks. Bliss Point models the reach-
  saturation curve per channel so the question is "spend at the optimum point," not "more
  or less." PPC paired with CRO under one roof closes the good-clicks/bad-convert loop.
- **Loot:** Saturation-aware reallocation; CRO as a first-class workstream; pipeline (SQL)
  as the headline metric, not ROAS alone.
- **Code upgrade:** ✅ SHIPPED — `PerformanceModule` (ROAS reallocator + A/B variant scoring
  + CSV). **Next:** add saturation-curve projection + pipeline-attribution column.

## 2. seo-sea-agency — DEPTH ✅ (engine live)

- **Dominator(s):** Ignite Visibility (#1 US SEO, Clutch; RADIUS visibility network, RevIntel
  CRM-tied revenue), WebFX (transparent pricing, $3B client revenue, MarketingCloudFX),
  Intero Digital (InteroBOT crawler-sim), OuterBox (ecommerce SEO), Coalition Technologies.
- **Moat:** Revenue-tied SEO, not rankings. AI-search/AEO visibility (458% AI-citation lift
  case). Technical crawl/index engineering as a proprietary tool. Local + franchise at scale
  (15,000+ locations).
- **Loot:** AEO/AI-citation as a measured KPI; crawl-health scoring; revenue attribution from
  organic, not just sessions.
- **Code upgrade:** ✅ SHIPPED — `seo.service` (on-page audit). **Next:** add AEO-citation
  score + crawl-health signals to the SEO engine + KPI.

## 3. media-agency — DEPTH (engine to build)

- **Dominator(s):** WPP Media/GroupM ($63.9B, 13% share), Publicis Media ($62.4B, +12.8%),
  Omnicom Media ($48.5B) — COMvergence 2025. Networks: OMD (#1, $26.9B), EssenceMediacom,
  Mindshare (WARC #1). Horizon Media ($7.4B, largest independent).
- **Moat:** Saturation/reach-frequency modeling at $4B+ scale; principal media + platform
  pricing leverage; full-funnel orchestration (CTV/programmatic/retail-media).
- **Loot:** CPM-minimizing channel mix given budget + reach target; effective-frequency
  modeling; blended-CPM as the optimizing metric.
- **Code upgrade:** **BUILD** `MediaService` — pure channel-mix optimizer (budget → per-channel
  CPM/audience → min-cost reach target). Port to agency-api + hub module.

## 4. e-commerce-agency — DEPTH (engine to build)

- **Dominator(s):** Fuel Made (Shopify+Klaviyo, CVR/AOV/LTV), BVA/Accenture Song ($1B GMV),
  IWD Agency (B2B+headless), We Make Websites (Shopify Markets intl), Avex (headless, 300%
  CVR), Coalition Technologies.
- **Moat:** Break-even ROAS + contribution-margin pricing; headless sub-second PDPs; Klaviyo
  email/SMS lifecycle as a revenue engine; AOV/CVR uplift as the close metric.
- **Loot:** Break-even ROAS calculator (ad_spend / (margin% × revenue)); AOV/CVR revenue
  forecast model; CRO-baked build.
- **Code upgrade:** **BUILD** `CommerceService` — break-even ROAS + contribution-margin +
  AOV×CVR×traffic revenue forecast. Map to e-commerce schema KPIs.

## 5. internet-web-agency — DEPTH (engine to build, BAZ doctrine core)

- **Dominator(s):** Increasio (Vercel partner, 120+ Next.js, LCP<1.5s by contract), Tridence
  (Lighthouse 98, SEO 3.0/GEO entity engineering), Lucky Media (headless CMS+Next.js),
  Digital Heroes (CWV contract, refund-if-miss), Neogen Media (CWV in CI).
- **Moat:** **Core Web Vitals by contract** — LCP<2.5s/INP<200ms/CLS<0.1, refunded if missed.
  Server Components + PPR. AI-Overview/GEO entity engineering baked in. "Buy auth/CMS/billing,
  build your moat."
- **Loot:** LCP budget allocator (per-route budget → asset/JS/image allocation); CWV-pass-rate
  KPI; GEO/AEO entity-engineering as a deliverable.
- **Code upgrade:** **BUILD** `WebPerfService` — LCP budget allocator (BAZ doctrine: sub-1.5s
  LCP floor). This is *our* founder-signal category (Next.js+Supabase).

## 6. influencer-marketing-agency — DEPTH ✅ (engine live)

- **Dominator(s):** CreatorIQ (OS for creator-led growth, "Share Of" metrics suite — SOV/SOX/
  SOE/SOI; Category Authority Index), IZEA (full-service creator strategy→commerce).
- **Moat:** Standardized measurement (Share-of-Voice/Exposure/Engagement/Influence) across the
  funnel; brand-suitability > follower count; 94% of brands say creator content beats ads.
- **Loot:** Multi-factor matching (already shipped) + Share-Of benchmarking as KPI; brand-fit
  scoring over raw followers.
- **Code upgrade:** ✅ SHIPPED — `influencer.service`. **Next:** add EMV/Share-of-Influence KPI.

## 7. branding-agency — BREADTH (schema)

- **Dominator(s):** Landor (#1, design-led identity+governance), Siegel+Gale (Message House),
  Interbrand (brand *valuation* methodology → Best Global Brands), Lippincott (brand→experience),
  Pentagram (independent design studio), Prophet (brand+growth "Uncommon Growth").
- **Moat:** Brand as a *valued financial asset* (Interbrand valuation); Message House makes the
  promise operational; governance/rollout toolkits so strategy survives contact with execution.
- **Loot:** Brand-strength score + archetype fit as schema KPIs; "on-time delivery" + "margin"
  already in our schema — add *brand-equity index* field.
- **Code upgrade:** Enrich `branding-agency` schema with `brand_equity_score`, `archetype_fit`,
  `governance_artifacts` fields.

## 8. creative-agency — BREADTH (schema) + CONTENT

- **Dominator(s):** Wieden+Kennedy (Ad Age/Adweek Global Agency of Year; Nike/Heinz/Netflix),
  DDB (Cannes Network of Year 2025), Ogilvy (Cannes Network of Year 2026), FCB (One Show #1),
  Mother (Film Grand Prix 2026), Rethink (Independent Network of Year).
- **Moat:** "Big idea" + cultural-timing + craft. W+K reinvents per-platform (Kai Cenat Twitch
  takeover). DDB: emotionally-led creativity tied to business results. Winning mentality as a
  category (Nike "Winning Isn't For Everyone").
- **Loot:** Concept-scoring isn't algorithmic (subjective) — the lever is the *process*
  (Idea→Draft→Review→Approved→Published) + revision-count as a quality KPI.
- **Code upgrade:** Schema already tracks `revisions` (target 2, down). Add `concept_tested`
  boolean + `award_submitted` field. CONTENT: fold the 4-phase creative pipeline into the
  public creative-agency page.

## 9. pr-agency — BREADTH (schema)

- **Dominator(s):** Edelman (#1 globally, $950M; Trust Barometer IP), Burson (BCW+H+K merger,
  $956M), Weber Shandwick Collective ($849M), FleishmanHillard ($743M), Real Chemistry (#1 US,
  healthcare $560M), FGS Global, Brunswick (financial comms).
- **Moat:** Trust as measurable institutional asset (Edelman Trust Barometer). Crisis
  infrastructure (response in hours, not days). GEO/Generative Engine Optimization now core
  (Coyne: "show up in the answers machines generate").
- **Loot:** Trust/sentiment + AVE as KPIs (already in schema); add `crisis_drill_date` +
  `geo_citation_count` fields.
- **Code upgrade:** Enrich `pr-agency` schema with `trust_score`, `geo_citations`,
  `crisis_response_time_hrs`.

## 10. content-marketing-agency — BREADTH + CONTENT (AEO native)

- **Dominator(s):** Animalz (premium editorial, SME-interview methodology, AEO/AI Visibility
  Pyramid), Foundation/Ross Simmonds (distribution-first, "Create Once Distribute Forever",
  RCDO; Reddit/LLM-citation research), Siege Media (citability engineering, DataFlywheel,
  BlueprintIQ), Omniscient Digital (content→ARR), Column Five (visual/data storytelling),
  Brafton (GEO at scale), Draft.dev (engineer-written dev content).
- **Moat:** Distribution > drafting (Foundation). Citability engineering (Siege: definitions
  up top, data in tables, extractable frameworks — the page shape LLMs cite). Content tied to
  pipeline/ARR, not pageviews (Omniscient).
- **Loot:** AEO/GEO-native content as the moat; "Create Once Distribute Forever" as a workflow;
  content→pipeline attribution.
- **Code upgrade:** Enrich `content-marketing-agency` schema with `aeo_citation_count`,
  `distribution_channels`, `pipeline_attributed`. CONTENT: all 24 public pages should ship
  AEO-native structure (definitions up top, tables, JSON-LD) — Siege's citability pattern.

## 11. social-media-agency — BREADTH (schema)

- **Dominator(s):** (Social-first) The Social Shepherd, Nebula, LYFE Marketing, inBeat,
  SociallyIn. Plus the platform-natives (Moburst for paid social). CreatorIQ data: Meta
  ecosystem dominates; TikTok best ROI for agencies; 5 platforms avg per program.
- **Moat:** Engagement-rate benchmarking; best-time-to-post; community management at scale;
  creator-content repurposing across the funnel (98% of brands repurpose creator content).
- **Loot:** Engagement-rate target (already 3% in schema); add `best_post_time`, `creator_repurpose_rate`.
- **Code upgrade:** Enrich `social-media-agency` schema.

## 12. strategy-agency — BREADTH + CONTENT

- **Dominator(s):** Prophet ("Uncommon Growth," brand+business strategy; "where to play → how
  to win"), Prophet/Siegel+Gale, McKinsey/BCG/Bain (brand growth + operating model), Accenture
  Song ($20B, upstream of advertising).
- **Moat:** Strategy tied to *operating model + measurable growth*, not decks. "Where to play
  → how to win → faster than competition." Brand+demand united.
- **Loot:** 90-day plans with named owners/budgets/exit criteria (BAZ doctrine already);
  engagement-margin + roadmap-as-deliverable.
- **Code upgrade:** Schema already has `margin` (target 60) + `fee`. Add `roadmap_delivered`
  boolean + ` adoption_rate` %. CONTENT: strategy-agency public page.

## 13. management-consulting — BREADTH

- **Dominator(s):** McKinsey, BCG (Bain brand strategy), Deloitte Digital (Gartner DX Leader,
  highest in all 5 use cases), Accenture (Reinvention Services), PwC Strategy&, Capgemini
  (Invent/frog).
- **Moat:** Partner utilization + mandate margin; operating-model design; agentic-AI
  consulting now the growth wedge (Publicis Sapient).
- **Loot:** Utilization (target 70%) + margin (65%) — already in schema. Add
  `operating_model_delivered` field.
- **Code upgrade:** Enrich `management-consulting` schema.

## 14. digital-agency — BREADTH (overlaps full-service)

- **Dominator(s):** Everest PEAK Matrix Leaders: Accenture Song, Capgemini, Cognizant,
  Deloitte Digital, IBM, Infosys, Merkle, TCS, VML. Gartner DX Leaders: Accenture, Capgemini,
  Deloitte, Dentsu, Publicis Sapient.
- **Moat:** End-to-end MarTech + gen-AI content engines (SynOps, Content.AI, Monks.Flow);
  global delivery + platform partnerships (Adobe/Salesforce/Google); one-stop vendor
  consolidation.
- **Loot:** Blended ROAS + retainer MRR + NPS — already in schema. This is the *full-service*
  tier in disguise.
- **Code upgrade:** Schema aligned. Position as Core/Growth tier mapping.

## 15. full-service-agency — DEPTH (meta-engine, ARR/retention)

- **Dominator(s):** Accenture Song ($20B, "upstream of advertising"), VML (WPP merger),
  Deloitte Digital, Publicis Sapient (#1 new business 2025, $10B wins), WPP (Creative Company
  of Year), Omnicom.
- **Moat:** Net retention > 110% (Publicis retained 50% of reviewed business vs WPP 16%);
  ARR rollup; discipline breadth across the 23 specialist types. The "Power of One" model.
- **Loot:** Net-retention + ARR + discipline-breadth as the meta-KPIs — already in schema.
- **Code upgrade:** Schema strong. Build the ARR/retention rollup engine (the full-service
  dashboard = the BAZ firm P&L view).

## 16. advertising-agency — BREADTH + CONTENT

- **Dominator(s):** Wieden+Kennedy, DDB, Ogilvy, FCB, BBDO, TBWA, VML, McCann. Cannes 2026:
  Ogilvy Network of Year; LePub Agency of Year; Heineken Creative Brand of Year.
- **Moat:** Creative brand recall (ad-recall lift survey); media-mix across TV/OOH/digital;
  culturally-timed campaigns.
- **Loot:** Ad-recall (target 10%, in schema) + billings. Add `cultural_moment` tag.
- **Code upgrade:** Enrich `advertising-agency` schema. CONTENT: fold 7-area full-service
  depth into the public page.

## 17. app-agency — DEPTH (LTV:CAC)

- **Dominator(s):** Moburst (#1 mobile growth; ASO+UA+creative; Samsung +1400%, Reddit +90%
  organic), Prepractic, AppTweak (tool), Yodel Mobile, Gummicube.
- **Moat:** ASO as the cheapest organic lever; CPI reduction via creative testing; D30
  retention as the quality gate; localization across 10+ languages.
- **Loot:** LTV:CAC ratio + D30 retention + CPI — D30 & CAC already in schema. Add
  `aso_keyword_rank` + `ltv_cac_ratio`.
- **Code upgrade:** Enrich `app-agency` schema; build LTV:CAC engine into the app module.

## 18. dialog-marketing-agency (outbound/sales) — DEPTH (reply-rate model)

- **Dominator(s):** ORRJO (research→brand→demand→SDR; 90% meeting attendance; £3M pipeline
  in 6mo), GrowthSpree (integrated outbound+ABM one signal table, $3K flat), Belkins,
  SalesRoads, ColdIQ (deliverability), Konsyg, MarketStar (enterprise SDR), Oppify.
- **Moat:** **Demand-gen BEFORE outbound** warms the market → 30-40% higher reply rates → 90%
  show-rate (vs 70-80% industry). Signal-based (32% win rate) beats list-based (13%). One
  signal table feeds outbound + paid ABM. Deliverability is infrastructure (SPF/DKIM/DMARC,
  warmup, rotation). Reply rates fell 8.5%→3.4%; signal outreach runs 8-25%.
- **Loot:** This is BAZ's *own* GTM motion (02-outreach-sequence). The engine: reply-rate
  prediction from sequence design + warm-market multiplier + deliverability score.
- **Code upgrade:** **BUILD** `OutreachService` — reply-rate model (sequence steps × warm-
  market factor × deliverability score). Maps directly to BAZ's own outreach playbook.

## 19. inbound-marketing-agency — DEPTH (lead scoring)

- **Dominator(s):** HubSpot partners, Lyfe Marketing, WebFX (inbound), Ironpaper (demand-gen+
  ABM), RevenueZen (SaaS demand gen), Kalungi (fractional CMO).
- **Moat:** Lead scoring (fit × engagement); visitor→MQL conversion as the gate; lifecycle
  nurture automation; CAC as the efficiency metric.
- **Loot:** Lead-scoring algorithm (demographic fit × behavioral engagement × intent timing).
- **Code upgrade:** **BUILD** `LeadScoringService` — 100-point fit×engagement×intent model
  (mirrors ORRJO's 30,000-prospect/15-signal scoring).

## 20. event-agency — BREADTH (schema)

- **Dominator(s):** George P. Johnson (GPJ, 111 yrs, #1 experiential; Strategic Experience
  Mapping® patented; Experience Impact Score), Freeman, Sparks, Impact XM, GES.
- **Moat:** Experience-Impact-Score framework (engagement→conversion→business outcome);
  vertically-integrated strategy+creative+fabrication; sustainability (ISO 20121).
- **Loot:** Attendance-rate + cost-per-attendee — already in schema. Add
  `experience_impact_score` + `pipeline_attributed` (GPJ's framework).
- **Code upgrade:** Enrich `event-agency` schema with `experience_impact_score`,
  `pipeline_from_event`.

## 21. communication-agency — BREADTH (schema)

- **Dominator(s):** Edelman, Weber Shandwick, FleishmanHillard, Brunswick, FGS Global,
  APCO (public affairs/ESG), MSL.
- **Moat:** Sentiment + reach + stakeholder alignment; crisis comms as infrastructure; GEO
  for executive visibility.
- **Loot:** Sentiment (target 80%, in schema) + reach. Add `stakeholder_alignment_score`.
- **Code upgrade:** Enrich `communication-agency` schema.

## 22. video-film-agency — BREADTH (schema)

- **Dominator(s):** (Production) Ritual Content, Casual Films, Vidico, Lemonlight, Wieden
  (in-house), Revolution Productions. Plus the holdco creative shops.
- **Moat:** Cost-per-minute discipline; pre/prod/post pipeline; brand-film craft.
- **Loot:** Cost/min (in schema, direction down) + delivered count.
- **Code upgrade:** Schema aligned. CONTENT: fold pre/prod/post depth into public page.

## 23. design-agency — BREADTH (schema)

- **Dominator(s):** Pentagram (largest independent design consultancy), Frog (Capgemini
  Invent), IDEO, R/GA, Method, MetaLab, ustwo.
- **Moat:** Design-system + cycle-time discipline; UI/UX research→prototype→handoff.
- **Loot:** Cycle time (target 7 days, in schema) + screens delivered.
- **Code upgrade:** Schema aligned.

## 24. online-marketing-agency — BREADTH (overlaps digital)

- **Dominator(s):** WebFX, Ignite Visibility, NP Digital, SmartSites, Thrive, Straight North.
- **Moat:** CTR/CPL/conversions as the coordinated funnel; multi-channel attribution.
- **Loot:** CTR (target 2%) + CPL (down) + conversions — all in schema.
- **Code upgrade:** Schema aligned.

---

## Build priority (revenue-ordered, not alphabetical)

| Wave | Type | Verdict | Why first |
|---|---|---|---|
| ✅ Done | Performance | DEPTH | ROAS reallocator = the close-demo |
| ✅ Done | SEO | DEPTH | AEO = the inbound moat |
| ✅ Done | Influencer | DEPTH | Matching = the deliverable |
| **Now** | Web (LCP) | DEPTH | BAZ founder-signal; doctrine core |
| **Now** | Media (CPM mix) | DEPTH | Highest pure-algorithm value left |
| Next | Commerce (BE-ROAS) | DEPTH | Direct revenue tie |
| Next | Dialog (reply-rate) | DEPTH | Powers BAZ's *own* GTM |
| Next | Inbound (lead score) | DEPTH | Pilot acquisition engine |
| Next | App (LTV:CAC) | DEPTH | Mobile wedge |
| Parallel | All 24 schemas | BREADTH | Enrich KPIs with dominator-grade fields |
| Parallel | 24 public pages | CONTENT | AEO-native citability (Siege pattern) |

---

## The loot distilled — 5 cross-category dominator patterns

1. **Measurement is the moat.** Every dominator built a proprietary score/OS: Tinuiti Bliss
   Point, Ignite RevIntel, CreatorIQ Share-Of, GPJ Experience Impact Score, Interbrand brand
   valuation. **BAZ build:** a unified "BAZ Score" per client tying every engine to revenue.
2. **Demand before outbound.** ORRJO's 90% show-rate comes from warming the market first.
   **BAZ apply:** our own outreach (02) + the dialog engine.
3. **Citability engineering.** Siege's page shape (definitions up top, data in tables,
   extractable frameworks) is what LLMs cite. **BAZ apply:** all 24 public pages.
4. **Performance by contract.** Web dominators refund if CWV missed. **BAZ apply:** sub-1.5s
   LCP is already our doctrine — make it a contracted SLA on every build.
5. **Signal beats list.** Signal-based outbound wins 32% vs 13% list-based. **BAZ apply:**
   the outreach engine scores on intent timing, not volume.

---

**Next action (72h):** Ship the `WebPerfService` LCP-budget allocator (doctrine core, founder
signal) + `MediaService` CPM-mix optimizer — both pure algorithms, both dominator-aligned,
both map to live hub modules. Then enrich all 24 schemas with the dominator-grade KPI fields
above in one atomic commit.

*Diagnose first, architect the offer, ship the system, and hold the line on what moves revenue.*