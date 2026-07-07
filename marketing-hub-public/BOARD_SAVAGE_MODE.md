# Marketing Hub — Savage Mode Proposal

> ⚡ **Governing Principle: Intensity Beats Extensity — Every Time.** Every phase, every feature, every campaign must concentrate force rather than spread it. See [`docs/INTENSITY_PRINCIPLE.md`](docs/INTENSITY_PRINCIPLE.md).

**Author:** MiniMax-M3 (via pi / Nova shell)
**Date:** 2026-06-24
**Status:** Awaiting Board approval
**Target tree:** `~/empire/prototype/marketing-hub/` (per Empire Rules v2)

---

## TL;DR

Turn Marketing Hub from a solid v2.0 (30 sections, 35 pages, 71 APIs, 38 tables, single-user SQLite) into **the best marketing hub ever built** — a multi-tenant, AI-native, real-time, embeddable, automated platform that can replace HubSpot + Mailchimp + Buffer + Hootsuite + ConvertKit + Intercom + Zapier for a single operator running an empire.

I'm proposing **6 phases over 6 weeks**, each shippable independently. Every phase ends in something you can demo to a client.

---

## Honest assessment of v2.0

**What's great**
- 30 sections covering the entire marketing funnel — nothing else does this as one app
- Beautiful, opinionated design system (no UI library dependency, fast)
- All local, no external API keys required to start
- SQLite = instant, single-file, deterministic
- Recharts + framer-motion = premium feel for zero infra

**What's holding it back from "best ever"**

| # | Gap | Impact |
|---|---|---|
| 1 | **Single-user, single-tenant** | Can't onboard clients, no isolation |
| 2 | **No auth** | Can't even protect the app from a public URL |
| 3 | **No real-time** | Inbox, automations, social mentions — all feel dead |
| 4 | **No AI** | Copy generator is template-based, content composer doesn't draft |
| 5 | **No actual publishing** | "Schedule" posts are aspirational DB rows |
| 6 | **No embeddable forms** | Forms are stuck inside the app, no way to capture leads on your real site |
| 7 | **No email send** | Email builder produces HTML, but never sends |
| 8 | **No event stream** | Can't do "user did X, then Y" automations |
| 9 | **No billing** | Can't charge per workspace |
| 10 | **No public API** | Can't integrate with anything outside |
| 11 | **Deterministic mock data** | Charts lie; you can't trust the analytics view |
| 12 | **No collaboration** | Comments, mentions, multi-editor — none of it |

---

## The North Star

> **"A sovereign operator opens one app, plans a quarter, creates a brand, drafts a campaign with AI, builds a landing page, designs an A/B test, sends emails to a real list, schedules real social posts, captures leads from an embedded form on a real site, watches the funnel populate in real time, and exports a board-ready report — all without leaving the app, all on a single machine, all theirs."**

If we're going to make this **the best marketing hub ever**, it has to do **all** of that, and do it better than the SaaS alternatives.

---

## Architecture transformation

### Current
```
[Browser] ─► Next.js App Router (35 pages)
              └► SQLite (single file, single user)
```

### Savage mode target
```
[Browser] ◄──► Next.js (UI + SSR + REST + Server Actions)
   │             │
   │             ├─► Postgres (multi-tenant, row-level security)
   │             ├─► Redis (pub/sub, queue, cache, rate limits)
   │             ├─► BullMQ workers (cron, scheduled posts, email send)
   │             ├─► S3-compatible blob store (assets, exports)
   │             ├─► Socket.IO server (real-time)
   │             ├─► Provider adapters:
   │             │     • Resend / SMTP (email)
   │             │     • Twitter/X, LinkedIn, Meta, TikTok APIs
   │             │     • OpenAI / Anthropic / local Ollama
   │             │     • Stripe (billing)
   │             │     • Plausible / PostHog (analytics ingest)
   │             │     • Slack, Discord (notifications)
   │             ├─► Embeddable form runtime (form.js served from /embed/[id].js)
   │             ├─► Public REST API + webhook dispatcher
   │             └─► Audit log + feature flags
   │
   └─► [Embed forms running on your real website]
```

But because we honor the **sovereign operator** principle: **all of this must run on a single machine**, with **one `docker compose up`**, with **no required external services** for the local-first experience. External providers are *opt-in* power-ups.

---

## 6 Phases

### Phase 0 — Foundation (week 1)
**"Make it real, not a demo"**

Must do before anything else.

- [ ] **Auth**: magic-link + password, sessions, CSRF, httpOnly cookies
- [ ] **Workspaces**: multi-tenant, every table gains `workspace_id`, RLS in Postgres or app-level enforcement in SQLite
- [ ] **Roles**: owner / admin / editor / analyst / viewer (5 roles)
- [ ] **Audit log**: every write logged with actor, action, target, before/after JSON diff
- [ ] **Settings v2**: real settings (workspace name, logo, timezone, currency, locale, fiscal year start)
- [ ] **Onboarding**: 5-step wizard (workspace → brand → first persona → first campaign → first channel connect)
- [ ] **Replace SQLite with Postgres** via `docker compose`, keep SQLite as a dev fallback
- [ ] **Migrations**: replace ad-hoc `CREATE TABLE IF NOT EXISTS` with proper `node-pg-migrate` / `drizzle-kit` migrations
- [ ] **Type-safe DB**: swap raw SQL → **Drizzle ORM** (zero-cost TypeScript inference)
- [ ] **Zod schemas shared client+server** for every API endpoint
- [ ] **Rate limiting**: Redis token bucket per IP + per user
- [ ] **Error boundaries**: every page wrapped, friendly recovery

**Deliverable:** A multi-user Marketing Hub you can give to 3 friends and they each see only their data.

---

### Phase 1 — Real-time + Events (week 2)
**"Make it alive"**

- [ ] **Socket.IO server** mounted on Next.js custom server (`server.ts`)
- [ ] **Realtime hooks** in client: `useRealtime('inbox')`, `useRealtime('campaigns')`, etc.
- [ ] **Activity feed** page: every event across the workspace, live
- [ ] **Inbox updates in real time** (this was the obvious use case)
- [ ] **Collaborative presence**: see who's viewing the same page
- [ ] **Event store**: append-only `events` table, every domain event lands here
- [ ] **Event bus** (Redis pub/sub internally, can swap to NATS later)
- [ ] **Comments + mentions** on every entity (campaign, content, landing page, form)
- [ ] **Notifications** system with bell icon dropdown, mark-read, deep-link
- [ ] **Optimistic UI** everywhere with rollback

**Deliverable:** Two browsers open — type in one, watch it appear in the other.

---

### Phase 2 — AI Native (week 3)
**"Make it think"**

This is where we lap the SaaS competitors.

- [ ] **AI providers**: pluggable adapter pattern, supports:
  - OpenAI (GPT-4o, GPT-4o-mini)
  - Anthropic (Claude Sonnet 4.5)
  - Local Ollama (any model — sovereign mode)
  - Mock provider (deterministic for tests)
- [ ] **AI command bar** (`Cmd+K` becomes AI-aware)
  - "Write 5 LinkedIn posts promoting my new ebook targeting marketing managers"
  - "Summarize last week's campaign performance"
  - "What personas haven't we contacted in 30 days?"
- [ ] **AI in every composer**:
  - Social studio: generate variants, shorten, lengthen, change tone
  - Email builder: subject line A/B suggestions, body rewrite
  - Landing page: hero copy, CTA ideas, section suggestions
  - Copy generator: full LLM-backed generation (replace templates)
- [ ] **AI personas**: paste 5 customer interviews → generates full persona cards
- [ ] **AI segmentation**: "find contacts similar to my top 10 customers" → cohort
- [ ] **AI competitor briefs**: paste 3 competitor URLs → SWOT in 30 seconds
- [ ] **AI image generation** (DALL-E 3 / SDXL via Replicate / local Stable Diffusion)
  - In social composer: generate image for post
  - In landing page builder: generate hero image
  - In email builder: generate header graphic
- [ ] **AI landing page generator**: brief → full page in one click
- [ ] **AI weekly digest**: Monday morning, auto-generated PDF + Slack message
- [ ] **Token usage tracking**: see AI cost per workspace per month
- [ ] **Streaming responses** with proper cancellation

**Deliverable:** "Generate me a Q4 launch campaign" → brand kit applied, 4 personas targeted, 3 landing pages drafted, 12 social posts scheduled, 5 emails queued, all in 60 seconds.

---

### Phase 3 — Publishing + Channels (week 4)
**"Make it actually send"**

The features become real, not aspirational.

- [ ] **Email sending**: Resend / Postmark / SMTP provider, with bounce handling
  - Real list management (subscribe, unsubscribe, double opt-in)
  - Send-time optimization (per-contact by historical open patterns)
  - Open / click / bounce webhooks
- [ ] **Social publishing**: real OAuth + post creation for
  - Twitter / X (v2 API)
  - LinkedIn (v2 API)
  - Meta (Facebook Pages + Instagram Business)
  - TikTok (Business API)
  - Pinterest
  - YouTube (community posts)
- [ ] **Scheduled publishing engine**: cron + queue, retries, dead-letter
- [ ] **Inbox ingest**: pull DMs/comments from all connected channels into the unified inbox
- [ ] **Form submissions**: real form endpoints, email notifications, webhook dispatch
- [ ] **Landing page hosting**: serve LP at `/{workspace}.hub/{slug}` or custom domain
- [ ] **CDN for assets**: signed URLs, image transformations (resize, crop, webp)
- [ ] **RSS-to-email**: weekly newsletter auto-generated from RSS feeds
- [ ] **UTM builder + click tracking**: every link gets tracked, clicks attributed
- [ ] **Public landing page analytics**: real pageviews, real conversions

**Deliverable:** Sign up for the app, connect your Twitter, schedule a tweet for 9am tomorrow — wake up to a real published tweet, with replies flowing into the inbox.

---

### Phase 4 — Embeddable Runtime (week 5)
**"Make it go everywhere"**

- [ ] **Form embed**: `<script src="https://hub.you/embed/form.js?id=xxx"></script>`
  - Shadow DOM, zero CSS leak
  - Spam protection (honeypot + Turnstile)
  - Webhooks fire on submit
- [ ] **Popup embed**: trigger on scroll %, exit intent, time delay
- [ ] **Chat widget**: opt-in live chat → routes into unified inbox
- [ ] **Tracking pixel**: 1x1 gif, server-side equivalent for cookieless tracking
- [ ] **Public analytics endpoint**: `/p.js` that captures pageviews, attribution, custom events
- [ ] **Webhooks OUT**: every event type can be POSTed to your URLs
- [ ] **Zapier / Make / n8n connectors**: official integration apps
- [ ] **Public REST API v1**: token-authenticated, OpenAPI spec, SDKs (TS, Python, Ruby)
- [ ] **Public GraphQL** (optional, for power users)
- [ ] **CLI** for ops: `hub campaigns list`, `hub contacts import`

**Deliverable:** Drop our embed snippet on a WordPress site — leads flow into Marketing Hub, get scored by AI, get routed by automations, and the operator sees them in the unified inbox.

---

### Phase 5 — Intelligence + Polish (week 6)
**"Make it feel inevitable"**

- [ ] **Real analytics**: replace mock data with real ingest from your own pages
  - Pageviews, sessions, attributed conversions
  - Funnel analysis from real events
  - Cohort retention
  - Attribution modeling (first-touch, last-touch, multi-touch)
- [ ] **Forecasting**: AI predicts next month's pipeline, leads, revenue based on trends
- [ ] **Anomaly alerts**: "Spend is 2x normal on Meta today" → Slack ping
- [ ] **Recommendations engine**: "Your CTA gets 1.2% clicks. Here's what 5% looks like on competitors."
- [ ] **Report builder v2**: drag-and-drop, save as template, scheduled email delivery
- [ ] **Dashboard widgets**: customizable, save layouts, share dashboards
- [ ] **Mobile responsive PWA**: installable, push notifications, offline drafts
- [ ] **Native iOS / Android shell** (Capacitor wrapper around the PWA)
- [ ] **Theming**: deep design tokens, white-label for agencies
- [ ] **i18n**: full English + Spanish + French + Arabic (RTL)
- [ ] **Accessibility audit**: WCAG 2.2 AA, full keyboard nav, screen reader
- [ ] **Performance**: route prefetching, ISR, edge caching, image optimization
- [ ] **E2E test suite**: Playwright covers every critical path
- [ ] **Storybook** for every component
- [ ] **Public docs site** (Docusaurus): hub.you/docs
- [ ] **Marketing site** for Marketing Hub itself (dogfooding required)
- [ ] **Changelog / roadmap UI** in-app
- [ ] **Status page** with self-hosted option

**Deliverable:** A platform a paying customer would call "best in class."

---

## Phase prioritization

| Phase | Effort | Impact | Do first? |
|---|---|---|---|
| 0 — Foundation | 5 days | HIGH (unlocks everything else) | **YES** |
| 1 — Realtime | 3 days | HIGH (perceived quality) | **YES** |
| 2 — AI | 4 days | HUGE (competitive moat) | **YES** |
| 3 — Publishing | 5 days | HUGE (turns it from tool into channel) | **YES** |
| 4 — Embed | 4 days | HIGH (network effect, lock-in) | yes |
| 5 — Polish | 4 days | MEDIUM (nps booster) | later |

**Total: ~25 working days, 5 weeks of focused work.**

---

## What "best ever" means — measurable

If we ship phases 0–4, here's how we beat the incumbents:

| Capability | HubSpot | Mailchimp | Buffer | Hub | Hub (savage) |
|---|:-:|:-:|:-:|:-:|:-:|
| Single-app everything | ✗ | ✗ | ✗ | ✓ | ✓ |
| Multi-tenant | ✓ | ✓ | ✓ | – | ✓ |
| Self-hostable | ✗ | ✗ | ✗ | ✓ | ✓ |
| Real-time collaboration | partial | ✗ | ✗ | ✗ | ✓ |
| AI in every workflow | $90/seat | add-on | ✗ | ✗ | ✓ |
| Local LLM support | ✗ | ✗ | ✗ | ✗ | ✓ |
| Real publishing | ✓ | ✓ | ✓ | – | ✓ |
| Embedded forms / chat | ✓ | ✓ | ✗ | – | ✓ |
| Sovereign data | ✗ | ✗ | ✗ | ✓ | ✓ |
| Public REST + GraphQL | ✓ | ✓ | partial | – | ✓ |
| Webhooks out | ✓ | ✓ | ✓ | – | ✓ |
| Operator pricing | $800+/mo | $300+/mo | $100+/mo | **$0** | **$0** |

The last row is the killer. **Sovereign operators get it for the cost of a server.**

---

## Concrete deliverables I'd build, in order

If the Board approves, here is the exact sequence I'll execute in `~/empire/prototype/marketing-hub/`:

### Week 1 — Phase 0
1. Init Drizzle, define schema, generate first migration
2. Add workspaces + roles + sessions tables
3. Build auth: magic-link + password, sessions, middleware
4. Wire every existing table to have `workspace_id` and a scope helper
5. Add audit log table + helper
6. Add settings v2 + onboarding wizard (5 steps)
7. Add Postgres docker-compose, document migration from SQLite
8. Add Zod schemas for every existing API endpoint
9. Add rate limiting middleware
10. Verify: 3 browser profiles, see 3 isolated workspaces

### Week 2 — Phase 1
1. Add Socket.IO custom server
2. Build `useRealtime` hook + provider
3. Wire inbox, activity feed, notifications to realtime
4. Add comments + mentions on all entities
5. Add events table + write helper
6. Add optimistic UI to all mutations
7. Verify: two browsers, real-time updates flowing

### Week 3 — Phase 2
1. Build AI provider abstraction (OpenAI, Anthropic, Ollama, Mock)
2. Build AI command bar in Cmd+K palette
3. Add AI button to every composer (social, email, landing, copy)
4. Build AI persona generator
5. Build AI segmentation
6. Build AI image generation (DALL-E + Replicate)
7. Build AI weekly digest (PDF + Slack)
8. Token usage tracking
9. Verify: "Generate Q4 launch" → 4 LPs + 12 posts + 5 emails in 60s

### Week 4 — Phase 3
1. Build email provider abstraction (Resend, Postmark, SMTP)
2. Build list management (subscribe, unsubscribe, double opt-in)
3. Build social providers (Twitter, LinkedIn, Meta, TikTok)
4. Build scheduled publishing engine (BullMQ)
5. Build inbox ingest from social channels
6. Build landing page hosting at `/{workspace}.hub/{slug}`
7. Build UTM builder + click tracking
8. Verify: scheduled tweet fires at 9am, replies appear in inbox

### Week 5 — Phase 4
1. Build form embed runtime (shadow DOM, honeypot, Turnstile)
2. Build popup embed
3. Build chat widget → inbox
4. Build tracking pixel + server-side equivalent
5. Build public REST API + OpenAPI spec + SDKs
6. Build CLI tool
7. Verify: embed on WP site, leads flow through entire pipeline

### Week 6 — Phase 5
1. Replace mock analytics with real ingest
2. Build forecasting + anomaly alerts
3. Rebuild report builder
4. Build customizable dashboards
5. Make it a PWA + Capacitor wrapper
6. i18n + accessibility audit
7. E2E test suite + Storybook
8. Public docs site
9. Marketing site for Hub itself
10. Final benchmark report

---

## Risks and tradeoffs

| Risk | Mitigation |
|---|---|
| 5 weeks is ambitious | Each phase ships independently; cut phase 5 if needed |
| Multi-tenant data leaks | RLS from day 1, scope helper on every query, automated tests |
| AI costs blow up | Token usage tracking + per-workspace caps + local Ollama default |
| Provider APIs change | Adapter pattern + integration tests against mocks |
| SQLite → Postgres is risky | Phase 0 step 1; back-up SQL dumps before migration |
| Real-time adds complexity | Start with simple polling, upgrade to Socket.IO only if needed |
| Embed runtime can leak styles | Shadow DOM hard isolation + CSP headers |
| Scope creep | "Ship each phase before starting the next" |

---

## What I'm NOT doing (deliberately)

- ❌ Building a no-code workflow editor from scratch — too expensive, use n8n/Make integration instead
- ❌ Building a CRM that competes with Salesforce — Hub stays marketing-focused, deep-links to CRM if needed
- ❌ Mobile native apps from scratch — Capacitor wraps the PWA, ship in days not months
- ❌ Marketing automation as a separate product — it's just event triggers + actions, fits in the existing Automations page
- ❌ Sales pipeline as core — there's noira-crm for that, we deep-link

---

## Decision needed

**Question for the Board (you):**

1. ✅ Approve the plan as-is, start in `~/empire/prototype/marketing-hub/` with Phase 0?
2. 🔧 Approve with adjustments (which phase to cut, which to prioritize)?
3. ❌ Hold for more detail on specific phases?

Once approved, I'll snapshot v2.0 into the prototype, install Postgres + Redis, and start Phase 0 on Monday.

---

*Prepared by MiniMax-M3 — sovereign AI operator, o-company division*
