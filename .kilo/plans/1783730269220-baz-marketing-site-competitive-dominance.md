# BAZ Marketing Site — Competitive Dominance Plan

**Target:** `baz-marketing-site` (repo: `baz-marketing-site`, remote: `origin`)  
**North Star:** Own every high-intent "marketing agency [city/vertical]" query in MENA, EU, and US; convert at >4% with a site that loads faster and proves more trust than every top-10 competitor.  
**Scope:** Implementation-ready execution plan. Code changes are marked for an implementation-capable agent.

---

## Current State (from codebase audit)

- **Stack:** Next.js 14 App Router, TypeScript, Tailwind, Supabase, Vercel.
- **Strengths:** Dynamic sitemap, JSON-LD (Organization/WebSite/ProfessionalService/FAQ/Article), sharp B&W design system, `vs-others` comparison page, 18-service catalog, case-study and insights routings.
- **Gaps blocking domination:**
  - Security/auth gaps (middleware bypass, missing guards on `/dashboard`, `/admin/monitors`, etc.) — credibility risk.
  - In-memory rate limiter ineffective on Vercel; dual lead stores (SQLite vs JSONL) cause data divergence.
  - Dead weight: `motion` in `package.json` unused; stale inspector lists non-existent routes.
  - Trust content is partly composite: case studies have `placeholder` flags; testimonials are placeholders.
  - Hardcoded hex colors in components violate the B&W token rule.
  - No local SEO pages (`/industries/[slug]` exists but lacks city/regional schema), no FAQ-only landing pages, no rich-result breadcrumbs everywhere.
  - Performance: no `next/font` preload strategy review, no `fetchpriority` on hero images, no explicit `Cache-Control` on public JSON content.

---

## Phase 1: Foundation (Week 1)

*Win condition: Site passes a fresh security/quality audit; Core Web Vitals hit "Good" on mobile.*

1. **Security hardening (Critical/High)**  
   - `middleware.ts`: validate `baz_session` via `readSessionFromCookies()` + `user.role` before `NextResponse.next()`.  
   - Add server-side auth guards to `/admin/monitors`, `/admin/analytics`, `/admin/integrations`, `/admin/canva`, `/dashboard`, `/console`.  
   - Fix Supabase RLS: replace `USING (true)` with role-scoped policies or remove Supabase anonymous access from protected tables.  
   - `/api/auth/me`: return real role from local `users` table, not hardcoded `"member"`.

2. **Data layer cleanup (High)**  
   - Remove `data/leads.jsonl` dependency; migrate `/dashboard` to the SQLite/Supabase canonical `getDb()` path.  
   - Ensure `/api/leads` is the single source of truth for all lead storage.

3. **Rate limiting (High)**  
   - Replace in-memory `Map` in `lib/rate-limit.ts` with **Vercel KV** (or Upstash Redis).  
   - Key buckets on `user.id` for authenticated routes; fall back to trusted `x-forwarded-for` or Vercel `request.ip` for anonymous routes.

4. **Dead code & inspector accuracy (Medium)**  
   - Remove `motion` from `package.json`.  
   - Update `scripts/quality-inspect.mjs` route lists to match the actual app tree.  
   - Add GET handler to `/api/score` or document as POST-only.

5. **Design system compliance (Medium)**  
   - Replace hardcoded hex colors in `AnalyticsTools.tsx`, `app/api/auth/register/route.ts`, etc., with semantic Tailwind tokens (`text-brand`, `bg-background`, `bg-accent`).  
   - Fix `layout.tsx` CSS import order so `color-layer.css` is literally last, per DESIGN-SYSTEM.md.

---

## Phase 2: Trust & Authority (Week 2–3)

*Win condition: Every major page contains named, metric-backed proof; no live placeholder remains.*

1. **Case studies — replace composites with signed-client material**  
   - Keep structure (Problem / Strategy / Result / Duration / Testimonial) but swap names, metrics, and cover images for real signed-off cases.  
   - Add `schema.org/Review` JSON-LD to each case-study page (`app/case-studies/[slug]/page.tsx`).  
   - Add internal links from each case study back to the specific service category and to `/vs-others`.

2. **Testimonials — evict placeholders**  
   - `content/testimonials.ts`: replace 9 `placeholder: true` entries with real client quotes, names, roles, and headshots (or initials avatars).  
   - Render a `Review` schema block on the `/testimonials` aggregator (or homepage section).

3. **Proof numbers — tighten and link**  
   - Homepage `ProofNumbers` section: link each stat to the exact case study or service page that proves it.  
   - Add a `/proof` landing page collecting every metric in one place with explicit date ranges (`Q1 2025`) to reduce skepticism.

4. **Social proof widgets**  
   - Add a live client counter backed by the canonical `clients` table to the homepage and `/about`.  
   - Add a "Featured in / trusted by" logo marquee (`/brandbook` assets already exist; wire them into `LogoMarquee`).

---

## Phase 3: SEO Offensive (Week 3–4)

*Win condition: Top-3 rankings for 20+ high-intent service + industry keywords; organic traffic up 40% in 90 days.*

1. **Service page depth**  
   - Each `/services/[slug]` page already has pillar/process/FAQ/proof blocks. Add:  
     - `FAQPage` schema (using existing `faqLd()` helper).  
     - Schema `Service` type blocks (with `areaServed`, `offers`).  
     - Breadcrumb schema (`breadcrumbLd()`).  
     - "Start a project" contact form tailored to the service.

2. **Industry pages (`/industries/[slug]`)**  
   - Expand from generic landing pages to location + vertical stacks (e.g., `industries/fintech`, `industries/fintech/seo`, `industries/dubai`).  
   - Add `LocalBusiness` / `ProfessionalService` schema with `areaServed` city/region.  
   - Target long-tail queries: "SEO agency for fintech in Dubai", "CRO agency for SaaS in London".

3. **Insights expansion**  
   - Increase `posts.ts` from 5 to 20 articles in 90 days. Target:  
     - 3 comparison pieces (`vs` competitors) linked from `/vs-others`.  
     - 5 "how-we-do-it" methodology posts linked from `/methodology`.  
     - 3 local-perspective posts targeting MENA, EU, US.  
   - Add `Article` schema (standardize `author` with `Person` + `sameAs`).  
   - Add RSS feed (`/feed.xml` exists; verify it emits full content and includes new posts).

4. **Internal linking & crawl budget**  
   - Add related-article and related-service modules on every detail page.  
   - Ensure `/vs-others` is linked from the homepage and every service page footer.  
   - Fix `color-layer.css` order comment in `layout.tsx` to avoid confusion.

5. **Images & OG**  
   - Add `alt` text to every `<Image>` (currently missing/weak).  
   - Generate service-specific OG images (`/og/services/[slug]`) or update `/og` to accept service title/subtitle so social shares don't all show the same generic image.  
   - Add `og:image:alt` and `og:locale`.

---

## Phase 4: Speed & UX (Week 4–5)

*Win condition: LCP < 1.5s (mobile), CLS < 0.1, INP < 200ms.*

1. **Core Web Vitals**  
   - `HomePage` is static (good). Audit every dynamic `[slug]` page for `loading.tsx` + `suspense` boundaries to prevent layout shift.  
   - Add `fetchpriority="high"` to the hero `<Image>` in `Hero.tsx`.  
   - Preload critical fonts (`Inter`, `Outfit`, `Poppins`, `JetBrains Mono`) in `layout.tsx` with `<link rel="preload">` for the hero section.

2. **Caching strategy**  
   - Add explicit `Cache-Control` headers in `vercel.json` for `/services`, `/case-studies`, `/insights`, `/industries` (`public, s-maxage=600, stale-while-revalidate=3600`).  
   - Ensure `/api/services` and `/api/health` remain no-store (already present).

3. **Accessibility**  
   - Fix `Modal` role/aria-modal/focus trap (per AUDIT §8.1).  
   - Add `alt` text to all decorative SVGs or mark `aria-hidden="true"`.  
   - Verify focus-visible outlines on interactive elements (buttons, links) match the B&W system.

---

## Phase 5: Conversion Architecture (Week 5–6)

*Win condition: Contact/booking conversion rate > 4%; bounce rate < 45%.*

1. **CTA placement and copy**  
   - Audit every section for a single primary CTA (not multiple competing buttons).  
   - A/B test two CTAs in the hero: "Get your 90-day forecast" vs "Book a growth call".  
   - Add context-aware CTAs: service pages → "Start a [service] engagement"; case-study pages → "Get similar results"; insights → "Discuss this for your brand".

2. **Booking integration**  
   - Replace the `mailto:` fallback in `site.ts` with a real booking URL (Cal.com or equivalent).  
   - Add `rel="noopener noreferrer"` and prefetch hints (`<link rel="prefetch">`) for the booking domain.  
   - Add a 3-step mini-form on the `/contact` page (name, email, goal) that submits to `/api/leads` with `source: "contact_form"`.

3. **Lead magnets**  
   - Gate a PDF resource (e.g., "The 90-Day Growth Forecast Template") behind email capture.  
   - Deliver via a server action that writes to `leads` and triggers a Resend welcome sequence.

---

## Phase 6: Competitive Intelligence & Positioning (Ongoing)

*Win condition: `vs-others` becomes the highest-converting page on the site; it outranks the #1 organic competitor comparison.*

1. **Scale `/vs-others`**  
   - Move from static 10-row table to **selectable competitor + industry** combos (e.g., "BAZ vs HubSpot for B2B SaaS", "BAZ vs Meta agencies in MENA").  
   - Add per-competitor PDF battle cards gated by email.  
   - Add schema `FAQPage` for every "BAZ vs X" query.

2. **Competitive SEO monitoring**  
   - Track rankings for branded vs unbranded competitor keywords.  
   - Publish public "Stance" updates when a major competitor pivots (e.g., changes pricing model, ships a new product).

3. **Backlink & PR engine**  
   - 1 "data study" per quarter from anonymized `clients` data (e.g., "CAC benchmarks by channel, H1 2026, 60 brands").  
   - Pitch 1 guest post per month to relevant trade pubs (e.g., Digiday, MarketingProfs) with original data.  
   - Turn case studies into LinkedIn carousels and short-form video scripts.

---

## Success Metrics & Validation

| Metric | Baseline | Target (90 days) | Measurement |
|--------|----------|------------------|-------------|
| Security/Quality audit score | 2 issues | 0 Critical/High | Fresh `AUDIT.md` run |
| Organic traffic | *measure now* | +40% | Vercel Analytics / GA4 |
| Top-3 rankings | *measure now* | +20 | Ahrefs / Screaming Frog |
| Core Web Vitals | *measure now* | All "Good" | PageSpeed Insights |
| Contact conversion rate | *measure now* | >4% | `/api/leads` volume vs sessions |
| Bounce rate | *measure now* | <45% | Vercel Analytics |
| Backlinks | *measure now* | +50 referring domains | Ahrefs |

**Validation steps:**
1. After Phase 1, re-run full audit (`npm run inspect` or equivalent) and `npm run build` from a clean clone.
2. After Phase 3, run `next build` + Lighthouse CI on staging for 5 representative pages (home, service, case study, industry, insights).
3. Weekly: rank tracker snapshot and organic KW delta.
4. Bi-weekly: `git diff --stat` review to ensure no design-system regressions.

---

## Dependencies & Risks

- **Env secrets:** `SUPABASE_SECRET_KEY`, `VERCEL_KV_REST_API_URL`, `VERCEL_KV_REST_API_TOKEN` must exist before KV rate limiting lands.
- **Signed case studies:** Phase 2 stalls without client approval. If unavailable, publish with explicit "illustrative composite" labels and deprioritize CaseStudy schema until signed.
- **Booking provider:** Cal.com / TidyCal / custom form decision needed before Phase 5.
- **Competitor data:** Building dynamic `vs-others` combos requires a maintained competitor dataset (names, pricing, differentiators).

---

## Files to Watch (examples)

- `middleware.ts` — auth bypass risk
- `lib/rate-limit.ts` — production safety
- `content/case-studies.ts` — trust authority
- `content/testimonials.ts` — trust authority
- `app/page.tsx` — LCP & conversion
- `app/vs-others/page.tsx` — competitive positioning
- `lib/seo.ts` — global metadata utilities
- `app/layout.tsx` — CSS import order, fonts, theme
- `vercel.json` — caching headers
- `next.config.mjs` — image formats, headers
