# World-Class Marketing Platform — Upgrade Plan

> **Goal:** Transform `marketing-hub` + `marketing-hub-public` into the best marketing platform ever built — a sovereign, AI-native, real-time, omnichannel command center that replaces HubSpot + Mailchimp + Buffer + Zapier for a single operator running an empire.
>
> **Status:** Implementation-ready. Key decisions resolved.
> **North Star:** "A sovereign operator opens one app, plans a quarter, drafts a campaign with AI, builds a landing page, designs an A/B test, sends emails to a real list, schedules real social posts, captures leads from an embedded form on a real site, watches the funnel populate in real time, and exports a board-ready report — all without leaving the app, all on a single machine, all theirs."

---

## 1. Current State Assessment

### What we have
- **marketing-hub**: Next.js 14 app, ~97 route groups, 244+ API routes, SQLite/libSQL (35+ tables), 250+ seeded records, Capacitor mobile wrapper, 5-theme system, extensive feature set (CRM, campaigns, SEO, ads, analytics, automations, billing, etc.)
- **marketing-hub-public**: Public acquisition site (pricing, enterprise, developers, blog, case-studies, design-system, download, leads, onboarding, trust, status). Lightweight, no auth/DB.
- **design.md**: Massive standalone Aether brand asset system (interactive seed-based color generation, 4584 lines of HTML/CSS).
- **Strategic docs**: BOARD_SAVAGE_MODE.md (6-week hub upgrade plan), BIG_TECH_AUDIT.md (responses to Google/Apple/Meta/Stripe/Linear critiques).

### What's holding it back
| Gap | Impact |
|---|---|
| Single-user, single-tenant | Can't onboard clients, no isolation |
| No real-time | Inbox, automations, social mentions feel dead |
| AI is template-based | Copy generator is offline templates, not LLM |
| No actual publishing | "Schedule" posts are aspirational DB rows |
| No embeddable runtime | Forms stuck inside the app |
| No email send | Email builder produces HTML but never sends |
| No public API | Can't integrate with outside tools |
| Deterministic mock analytics | Charts lie; can't trust data |
| No collaboration | No comments, mentions, multi-editor |
| Public site is minimal | Homepage redirects to /pricing, no hero, no interactive demo |
| Code duplication | marketing-hub and marketing-hub-public share styles but duplicate components |
| No proper migrations | Ad-hoc `CREATE TABLE IF NOT EXISTS` everywhere |
| No E2E tests | No Playwright, no Storybook |

---

## 2. Key Architectural Decisions (Resolved)

### Decision 1: Unify the codebase
**Recommendation:** Merge `marketing-hub-public` into `marketing-hub` as public-facing routes under `/` (home, pricing, enterprise, developers, blog, case-studies, etc.). Use a layout flag (`x-mh-public` header or route group) to toggle between "app chrome" (sidebar + topbar) and "public chrome" (minimal header + footer).

**Rationale:**
- Eliminates duplication of styles, components, brand assets
- Simplifies deployment (one build, one deploy)
- Allows seamless transitions from marketing content to product experience
- Shares the Aether design system natively
- Reduces maintenance burden

### Decision 2: Database strategy
**Recommendation:** Adopt **Postgres** as the production database via Docker Compose. Keep **SQLite/libSQL** as the local-first dev fallback. Use **Drizzle ORM** for type-safe queries with zero-cost TypeScript inference.

**Rationale:**
- Postgres enables row-level security (RLS) for multi-tenancy
- Turso/libSQL gives edge deployment for sovereign operators
- Drizzle provides type safety without runtime overhead
- Existing libsql dependency already bridges both

### Decision 3: Real-time strategy
**Recommendation:** Use **Socket.IO** mounted on a Next.js custom server for real-time features. Fall back to **Server-Sent Events (SSE)** for simpler use cases.

**Rationale:**
- Self-hosted, no vendor lock-in
- Works with Next.js custom server
- Enables inbox, activity feed, notifications, collaborative presence

### Decision 4: AI provider strategy
**Recommendation:** Pluggable adapter pattern supporting OpenAI, Anthropic, local Ollama (sovereign mode), and a deterministic mock provider for tests. Default to **Ollama/local** for sovereignty, opt-in to cloud providers.

**Rationale:**
- Sovereign operators should not depend on cloud AI
- Adapter pattern allows swapping without code changes
- Mock provider enables testing without API keys

### Decision 5: Mobile strategy
**Recommendation:** **PWA-first** with Capacitor wrapper for app store distribution. PWA enables offline drafts, push notifications, and installability without app store overhead.

### Decision 6: Queue/worker strategy
**Recommendation:** **BullMQ** with Redis for scheduled publishing, email sending, webhook dispatch, and AI batch jobs. Redis also serves as cache and rate-limit store.

---

## 3. Unified Architecture

```
[Browser] ◄──► Next.js 14 (App Router + Server Actions + REST)
    │             │
    │             ├─► Postgres (multi-tenant, RLS, production)
    │             ├─► SQLite/libSQL (local-first, dev/sovereign)
    │             ├─► Redis (cache, pub/sub, queue, rate limits)
    │             ├─► BullMQ workers (cron, scheduled posts, email send)
    │             ├─► Socket.IO server (real-time)
    │             ├─► Provider adapters:
    │             │     • Resend / Postmark / SMTP (email)
    │             │     • Twitter/X, LinkedIn, Meta, TikTok APIs
    │             │     • OpenAI / Anthropic / Ollama (AI)
    │             │     • Stripe (billing)
    │             │     • Plausible / PostHog (analytics)
    │             ├─► Embeddable runtime (/embed/[id].js)
    │             ├─► Public REST API + OpenAPI spec + SDKs
    │             ├─► Aether design system (shared tokens, components)
    │             └─► Audit log + feature flags
    │
    └─► [Embed forms/chat running on external sites]
```

### Route Structure
```
src/app/
├── (public)/                    # Public marketing site (no auth required)
│   ├── page.tsx                 # Homepage (hero, interactive demo, social proof)
│   ├── pricing/page.tsx         # Tiered pricing with ROI calculator
│   ├── enterprise/page.tsx      # Enterprise security, compliance, comparison
│   ├── developers/page.tsx      # API docs, SDKs, webhooks, playground
│   ├── case-studies/[slug]/     # Dynamic case studies with real metrics
│   ├── blog/[slug]/             # Content marketing with schema markup
│   ├── demo/page.tsx            # Interactive product tour (no signup)
│   ├── design-system/page.tsx   # Living component library
│   ├── download/page.tsx        # Mobile app download (APK + PWA)
│   ├── leads/page.tsx            # Lead capture with AI qualification
│   ├── onboarding/[step]/       # 5-step wizard
│   ├── trust/page.tsx            # Security, compliance, uptime
│   └── status/page.tsx           # Self-hosted status page
│
├── (app)/                       # Authenticated app routes
│   ├── dashboard/page.tsx       # Unified metrics, module grid
│   ├── campaigns/               # Kanban, CRUD, detail
│   ├── crm/                     # Contacts, companies, deals
│   ├── emails/                  # Block-based email builder
│   ├── landing-pages/           # Visual page builder
│   ├── studio/                  # Social composer
│   ├── seo/                     # Keywords, audits, sitemap
│   ├── ads/                     # Multi-channel ad management
│   ├── analytics/               # Real-time charts, attribution
│   ├── automations/             # Trigger → action rules
│   ├── experiments/             # A/B testing
│   ├── inbox/                   # Unified conversations
│   ├── reports/                 # Auto-generated summaries
│   └── ...                      # ~80+ existing routes
│
├── api/                         # REST API routes
│   ├── auth/                    # Magic link, password, sessions
│   ├── public/v1/               # Token-authenticated public API
│   ├── embed/                   # Form embed runtime
│   └── ...                      # 244+ existing routes
│
└── layout.tsx                   # Root layout with theme + font providers
```

---

## 4. Phased Implementation Plan

### Phase 0 — Foundation (Week 1)
**"Make it real, not a demo"**

Must complete before anything else.

| Task | Details |
|---|---|
| **Checkpoint & branch** | Commit current ~119 uncommitted changes in marketing-hub before destructive ops |
| **Drizzle ORM setup** | Init Drizzle, define schema, generate first migration. Replace ad-hoc `CREATE TABLE IF NOT EXISTS` with proper migrations |
| **Multi-tenant schema** | Add `workspaces` table, every existing table gains `workspace_id`, RLS policies in Postgres, app-level enforcement in SQLite |
| **Auth hardening** | Magic-link + password, HttpOnly cookies, CSRF protection, rate limiting on auth endpoints, login attempt logging |
| **Roles & permissions** | Owner / Admin / Editor / Analyst / Viewer (5 roles). Scope helper on every query |
| **Audit log** | Append-only `audit_log` table, every write logged with actor, action, target, before/after JSON diff |
| **Settings v2** | Real settings (workspace name, logo, timezone, currency, locale, fiscal year start) |
| **Onboarding wizard** | 5-step wizard: workspace → brand → first persona → first campaign → first channel connect |
| **Zod schemas** | Shared client+server schemas for every API endpoint |
| **Error boundaries** | Every page wrapped, friendly recovery UI, dev-only stack traces |
| **Unify public routes** | Move marketing-hub-public routes into marketing-hub under `(public)` route group. Merge shared styles/components |

**Deliverable:** Multi-user Marketing Hub you can give to 3 friends and they each see only their data. Public marketing site lives in the same repo.

**Validation:** 3 browser profiles → 3 isolated workspaces. All public routes return 200.

---

### Phase 1 — Real-time + Events (Week 2)
**"Make it alive"**

| Task | Details |
|---|---|
| **Socket.IO server** | Mount on Next.js custom server (`server.ts`). Room-based per workspace |
| **Realtime hooks** | `useRealtime('inbox')`, `useRealtime('campaigns')`, `useRealtime('notifications')` |
| **Event store** | Append-only `events` table, every domain event lands here |
| **Activity feed** | Every event across the workspace, live |
| **Collaborative presence** | See who's viewing the same page |
| **Comments + mentions** | On every entity (campaign, content, landing page, form) |
| **Notifications** | Bell icon dropdown, mark-read, deep-link |
| **Optimistic UI** | Everywhere with rollback on failure |

**Deliverable:** Two browsers open — type in one, watch it appear in the other.

**Validation:** Real-time inbox updates, presence indicators, optimistic UI on all CRUD.

---

### Phase 2 — AI Native (Week 3)
**"Make it think"**

This is where we lap the SaaS competitors.

| Task | Details |
|---|---|
| **AI provider abstraction** | OpenAI, Anthropic, Ollama, Mock. Pluggable adapter pattern |
| **AI command bar** | `Cmd+K` becomes AI-aware. Natural language → actions |
| **AI in every composer** | Social studio, email builder, landing page, copy generator — all get AI buttons |
| **AI persona generator** | Paste 5 customer interviews → full persona cards |
| **AI segmentation** | "Find contacts similar to my top 10 customers" → cohort |
| **AI competitor briefs** | Paste 3 competitor URLs → SWOT in 30 seconds |
| **AI image generation** | DALL-E 3 / SDXL via Replicate / local Stable Diffusion |
| **AI landing page generator** | Brief → full page in one click |
| **AI weekly digest** | Monday morning, auto-generated PDF + Slack message |
| **Token usage tracking** | Per-workspace per month cost visibility |
| **Streaming responses** | Proper cancellation, progressive rendering |

**Deliverable:** "Generate me a Q4 launch campaign" → brand kit applied, 4 personas targeted, 3 landing pages drafted, 12 social posts scheduled, 5 emails queued, all in 60 seconds.

**Validation:** AI generates complete campaign artifacts. Token costs visible. Local Ollama works offline.

---

### Phase 3 — Publishing + Channels (Week 4)
**"Make it actually send"**

The features become real, not aspirational.

| Task | Details |
|---|---|
| **Email provider abstraction** | Resend / Postmark / SMTP. Bounce handling, open/click webhooks |
| **List management** | Subscribe, unsubscribe, double opt-in, segmentation |
| **Social providers** | Twitter/X (v2), LinkedIn (v2), Meta (Pages + Instagram), TikTok, Pinterest, YouTube |
| **Scheduled publishing engine** | BullMQ + cron, retries, dead-letter queue |
| **Inbox ingest** | Pull DMs/comments from all connected channels into unified inbox |
| **Form submissions** | Real endpoints, email notifications, webhook dispatch |
| **Landing page hosting** | Serve LP at `/{workspace}.hub/{slug}` or custom domain |
| **UTM builder + click tracking** | Every link tracked, clicks attributed |
| **Public analytics** | Real pageviews, real conversions, funnel analysis |

**Deliverable:** Connect Twitter, schedule a tweet for 9am tomorrow — wake up to a real published tweet, with replies flowing into the inbox.

**Validation:** Scheduled social post fires. Email opens tracked. Form submissions flow into CRM.

---

### Phase 4 — Embeddable Runtime (Week 5)
**"Make it go everywhere"**

| Task | Details |
|---|---|
| **Form embed** | `<script src="https://hub.you/embed/form.js?id=xxx"></script>`. Shadow DOM, zero CSS leak, honeypot + Turnstile |
| **Popup embed** | Trigger on scroll %, exit intent, time delay |
| **Chat widget** | Opt-in live chat → routes into unified inbox |
| **Tracking pixel** | 1x1 gif, server-side cookieless tracking |
| **Public REST API v1** | Token-authenticated, OpenAPI spec, SDKs (TypeScript, Python, Ruby) |
| **Webhooks OUT** | Every event type POSTed to your URLs with retry + backoff |
| **Zapier / Make / n8n connectors** | Official integration apps |
| **CLI** | `hub campaigns list`, `hub contacts import` |

**Deliverable:** Drop embed snippet on WordPress — leads flow into Marketing Hub, get scored by AI, get routed by automations, operator sees them in unified inbox.

**Validation:** External site captures leads via embed. Webhooks fire. API key works with curl.

---

### Phase 5 — Intelligence + Polish (Week 6)
**"Make it feel inevitable"**

| Task | Details |
|---|---|
| **Real analytics** | Replace mock data with real ingest. Pageviews, sessions, attributed conversions, cohort retention, multi-touch attribution |
| **Forecasting** | AI predicts next month's pipeline, leads, revenue based on trends |
| **Anomaly alerts** | "Spend is 2x normal on Meta today" → Slack ping |
| **Recommendations engine** | "Your CTA gets 1.2% clicks. Here's what 5% looks like on competitors." |
| **Report builder v2** | Drag-and-drop, save as template, scheduled email delivery |
| **Dashboard widgets** | Customizable, save layouts, share dashboards |
| **PWA + Capacitor** | Installable, push notifications, offline drafts, native Android wrapper |
| **i18n** | English + Spanish + French + Arabic (RTL) |
| **Accessibility audit** | WCAG 2.2 AA, full keyboard nav, screen reader, `prefers-reduced-motion` |
| **E2E test suite** | Playwright covers every critical path |
| **Storybook** | Every component documented with variants |
| **Public docs site** | hub.you/docs — API reference, guides, tutorials |
| **Marketing site v2** | World-class public site (see Phase 5a below) |
| **Changelog / roadmap UI** | In-app + public |
| **Status page** | Self-hosted option |

**Deliverable:** A platform a paying customer would call "best in class."

**Validation:** 100/100 Lighthouse. WCAG 2.2 AA pass. Playwright green on all critical paths.

---

### Phase 5a — Public Marketing Site Redesign (Parallel to Phase 5)
**"Convert like the best"**

The public site must be as world-class as the product.

| Task | Details |
|---|---|
| **Hero + Interactive Demo** | Above-the-fold interactive product tour. No signup required. Show real AI generation, real-time collaboration, embeddable forms in action |
| **Social Proof Engine** | Dynamic case studies with real metrics, logos, testimonials. Schema markup for rich snippets |
| **Pricing Page v2** | ROI calculator, annual vs monthly toggle, feature comparison, money-back guarantee, trust badges |
| **Enterprise Page v2** | Security deep-dive, compliance docs (SOC 2, GDPR), comparison table vs HubSpot/Marketo/Salesforce |
| **Developer Experience** | Interactive API playground, SDK snippets in 6 languages, webhook tester, status indicators |
| **Blog / Content Engine** | SEO-optimized blog with schema markup, author profiles, related posts, newsletter signup |
| **Case Studies** | Video testimonials, before/after metrics, downloadable PDFs |
| **Download Page** | APK direct download, PWA install instructions, Capacitor iOS/Android builds |
| **Trust & Status** | Uptime SLA, security whitepaper, bug bounty program, self-hosted status page |
| **Performance** | 100/100 Lighthouse, image optimization, ISR, edge caching, prefetching |
| **Analytics** | Plausible / PostHog integration, A/B test the marketing site itself |
| **Aether Integration** | Interactive seed slider on the homepage. Visitors can "taste" the brand system before signing up |

**Deliverable:** Public site that converts visitors at 3x current rate. Interactive demo that showcases the product's power without requiring signup.

**Validation:** Lighthouse 100/100. Conversion rate A/B tested. SEO score > 95.

---

## 5. Technical Debt & Refactoring

| Item | Action | Priority |
|---|---|---|
| **Shared component library** | Extract `AetherBackground`, `Anim`, `Badge`, `Stat`, `Toast`, `Skeleton` into `@marketing-hub/ui` package | HIGH |
| **CSS consolidation** | Merge `aether-monochrome.css`, `blackswan-tokens.css`, `midnight-terminal.css` into single token system using CSS custom properties | HIGH |
| **API consistency** | Standardize response shapes: `{ data, error, meta }` on all endpoints. Add OpenAPI spec | HIGH |
| **Type safety** | Zod schemas shared client+server for every endpoint. Eliminate `any` types | HIGH |
| **Testing** | Playwright E2E for critical paths. Vitest for unit tests. Storybook for components | MEDIUM |
| **Documentation** | JSDoc on all lib functions. `docs/` folder with architecture diagrams, ADRs | MEDIUM |
| **Performance** | Route prefetching, ISR where possible, image optimization, bundle analysis | MEDIUM |
| **Accessibility** | WCAG 2.2 AA audit. Focus traps, skip links, screen reader announcements, `prefers-reduced-motion` | MEDIUM |

---

## 6. Migration Path

### From marketing-hub-public → marketing-hub (public routes)
1. Create `src/app/(public)/` route group in marketing-hub
2. Copy public site pages into route group
3. Update layout to use "public chrome" (minimal header/footer, no sidebar)
4. Delete `marketing-hub-public` directory after validation
5. Update DNS / Vercel deployment to point to single app

### From SQLite → Postgres (production)
1. Add `docker-compose.yml` with Postgres + Redis
2. Generate Drizzle migrations from existing schema
3. Add connection logic that prefers Postgres, falls back to SQLite
4. Run migration script to export/import data
5. Update `next.config.js` for server-side DB access

### From mock analytics → real analytics
1. Add analytics ingestion endpoints
2. Replace deterministic mock data in `lib/analytics.ts` with real queries
3. Add cohort analysis, attribution modeling
4. Backfill historical data if available

---

## 7. Success Metrics

### Product Metrics
| Metric | Current | Target |
|---|---|---|
| API routes documented | 244+ | 244+ with OpenAPI spec |
| Time from signup to first campaign | Unknown | < 5 minutes |
| AI generation speed | N/A | < 60 seconds for full campaign |
| Real-time latency | N/A | < 200ms |
| Page load (LCP) | Unknown | < 1.5s |
| Lighthouse score | Unknown | 100/100 |
| WCAG compliance | Partial | 2.2 AA |
| Test coverage | 0% | > 80% critical paths |
| Public API endpoints | 0 | 50+ documented |
| Embed form submissions | 0 | Working in production |

### Business Metrics
| Metric | Target |
|---|---|
| Public site conversion rate | > 3% |
| Developer onboarding time | < 10 minutes |
| Time to first publish | < 1 hour |
| Workspace isolation incidents | 0 |
| Uptime SLA | 99.9% |
| Support tickets / week | < 5 |

---

## 8. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| 6 weeks is ambitious | HIGH | HIGH | Each phase ships independently; cut Phase 5 if needed |
| Multi-tenant data leaks | MEDIUM | CRITICAL | RLS from day 1, scope helper on every query, automated tests |
| AI costs blow up | MEDIUM | HIGH | Token usage tracking + per-workspace caps + local Ollama default |
| Provider APIs change | MEDIUM | MEDIUM | Adapter pattern + integration tests against mocks |
| SQLite → Postgres migration fails | LOW | HIGH | Phase 0 step 1; back-up SQL dumps before migration; keep SQLite fallback |
| Real-time adds complexity | MEDIUM | MEDIUM | Start with simple polling, upgrade to Socket.IO only if needed |
| Embed runtime leaks styles | LOW | MEDIUM | Shadow DOM hard isolation + CSP headers |
| Scope creep | HIGH | HIGH | "Ship each phase before starting the next" |
| Public site doesn't convert | MEDIUM | HIGH | A/B test everything, start with proven SaaS patterns |
| Team burnout | MEDIUM | HIGH | Sustainable pace, celebrate each phase ship |

---

## 9. Dependencies & Prerequisites

| Dependency | Required For | Source |
|---|---|---|
| Postgres + Redis | Phase 0 | Docker Compose |
| OpenAI / Anthropic API keys | Phase 2 (optional) | User-provided |
| Ollama | Phase 2 (sovereign) | Local install |
| Social API credentials | Phase 3 | User-provided |
| Resend / Postmark API key | Phase 3 | User-provided |
| Stripe account | Billing | User-provided |
| Capacitor CLI | Mobile | npm |
| Playwright | E2E tests | npm |

---

## 10. Open Questions (Out of Scope for This Plan)

| Question | Decision |
|---|---|
| Should we support self-hosted deployments via Docker image? | **YES** — sovereign operator principle |
| Should we open-source the platform? | **LATER** — after proving product-market fit |
| Should we add a mobile app store presence? | **YES** — Phase 5, Capacitor wrapper |
| Should we support SSO (SAML/OIDC)? | **YES** — Enterprise requirement, Phase 0 |
| Should we add a no-code workflow editor? | **NO** — use n8n/Make integration instead |

---

## 11. Validation Plan

### Pre-Deployment Checklist (each phase)
- [ ] All existing tests pass
- [ ] New features have unit tests
- [ ] E2E tests cover critical paths
- [ ] Lighthouse score > 90
- [ ] No console errors in production build
- [ ] API responses match OpenAPI spec
- [ ] Database migrations run cleanly on fresh install
- [ ] Accessibility audit passes (keyboard nav, screen reader)
- [ ] Performance budget met (bundle size, LCP, FID)
- [ ] Security scan (npm audit, dependency review)

### User Acceptance Criteria
- [ ] Can create workspace, invite team members, and see isolated data
- [ ] Can generate AI campaign artifacts in < 60 seconds
- [ ] Can schedule social post that actually publishes
- [ ] Can embed form on external site and capture leads
- [ ] Can see real-time inbox updates in another browser
- [ ] Public marketing site converts visitors to signups
- [ ] Developer docs enable external integration in < 10 minutes

---

## 12. Execution Order

```
Phase 0 (Foundation)
    ├── Unify public routes into marketing-hub
    ├── Drizzle + Postgres + multi-tenant
    ├── Auth + roles + audit log
    └── Validation: 3 isolated workspaces

Phase 1 (Real-time)
    ├── Socket.IO + event store
    ├── Collaborative presence
    └── Validation: two browsers, live updates

Phase 2 (AI Native)
    ├── Provider abstraction + command bar
    ├── AI in every composer
    └── Validation: "Generate Q4 launch" → 4 LPs + 12 posts + 5 emails

Phase 3 (Publishing)
    ├── Email + social providers
    ├── Scheduled publishing engine
    └── Validation: scheduled tweet fires, replies in inbox

Phase 4 (Embeddable)
    ├── Form/chat embed runtime
    ├── Public REST API + SDKs
    └── Validation: embed on WP site, leads flow through pipeline

Phase 5 (Intelligence + Polish)
    ├── Real analytics + forecasting
    ├── PWA + Capacitor + i18n
    ├── E2E tests + Storybook
    └── Validation: 100/100 Lighthouse, WCAG 2.2 AA

Phase 5a (Public Marketing Site)
    ├── Hero + interactive demo
    ├── Social proof + case studies
    ├── Developer playground
    └── Validation: 3x conversion rate
```

---

*Prepared by Kilo — sovereign AI operator, planning mode*
*Date: 2026-07-09*
*Target: marketing-hub + marketing-hub-public → world-class unified platform*
