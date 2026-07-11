# BAZ Marketing Site — Phase 3: SEO Offensive (Implementation Plan)

**Target repo:** `baz` (`baz-marketing-site`, `origin/main`) · Next.js 14 App Router + TS + Tailwind + Supabase + Vercel
**Phase owner:** implementation-capable agent (this doc is plan-only)
**Prerequisite:** Phase 1 shipped in `0ba9e44`. Phase 2 (Trust & Authority) is **deferred by user** — not in scope here.

## Current state (verified against code, Jul 11 2026)

Already done — do **not** re-do:
- `app/services/[slug]/page.tsx` already emits `faqLd()` + `breadcrumbLd()` (Phase 3.1 items 2 & 4 complete).
- `app/insights/[slug]/page.tsx` already emits `articleLd()` + `breadcrumbLd()` (Phase 3.3 item 3 complete).
- `app/feed.xml/route.ts` exists (emits **excerpt only**, not full content).

Gaps this phase closes:
- No `Service` schema (areaServed / offers) on service pages.
- `app/industries/[slug]` is single-level, has **no** JSON-LD at all, and **no** `LocalBusiness`/`ProfessionalService` schema.
- No location / industry×service matrix pages exist.
- `content/posts.ts` has **11** posts (plan assumed 5). Target = **20** → add **9**.
- RSS emits excerpt, not `<content:encoded>`.
- Some `<Image>` lack alt; no per-service OG route (`/og` dynamic route absent — only `public/og/*` static); `og:image:alt`/`og:locale` missing.
- `/vs-others` not linked from homepage or service footers.

## Win condition
Top-3 rankings for 20+ high-intent service + industry + location queries; organic traffic +40% in 90 days; **0 thin/doorway manual actions** in Search Console.

## Resolved decisions
1. **Phase 3.2 scope = programmatic matrix** (user choice), with the guardrails in Risks below.
2. **City set** (curated, editable in `content/locations.ts`): MENA `[Dubai, Riyadh, Abu Dhabi, Cairo, Casablanca]`, EU `[London, Paris, Berlin, Amsterdam]`, NA `[New York, Austin, Toronto]` → 13 cities. Matrix = 6 industries × 18 services × 13 cities.
3. **Service `offers`**: generic "Contact for quote" `Offer` (`priceCurrency: "USD"`, no fixed price) — no new per-service price data required.
4. **Insights +9 articles**: drafted using the `marketing-docs/` references + existing editorial voice; each must ship a real `body` (needed for RSS full content and to avoid thin pages).

## Tasks (ordered)

### T1 — Service schema + tailored form (Phase 3.1)
- `lib/seo.ts`: add `serviceLd(service)` → `@type: Service` with `name`, `description`, `provider` (Organization), `serviceType`, `areaServed` (from `site.areasServed`), `url`, `offers` (contact-for-quote). Add `site.areasServed = ["MENA","EU","US"]` to `lib/site.ts`; reuse it in `professionalServiceLd()`.
- `app/services/[slug]/page.tsx`: append `serviceLd(service)` to the existing JSON-LD array.
- Add a tailored inline mini-form ("Start a {service.name} project": name / email / goal) posting to `/api/leads` with `source: "service_${slug}"` and `service` field (reuse existing lead schema; do **not** invent a new endpoint).
- Validate with Google Rich Results test (Service + FAQPage + Breadcrumb, no errors).

### T2 — Industry schema + matrix data (Phase 3.2 base)
- `app/industries/[slug]/page.tsx`: add `LocalBusiness`/`ProfessionalService` JSON-LD with `areaServed` (global regions) + `breadcrumbLd` (visual `Breadcrumb` already renders; JSON-LD is missing).
- `content/locations.ts` (new) + `City` type in `@/types`: `{ slug, name, country, region, locale, marketBlurb, localProof: string[] }` for the 13 cities above.
- `lib/matrix.ts` (new): `buildMatrix()` returns all `(industry, service, city)` combos, each with **uniquely composed** copy (H1, intro, challenges/outcomes adapted from industry + service process/deliverables + city `marketBlurb`/`localProof`) and a `publishable` boolean from a **quality gate**: ≥2 unique local data points AND body ≥ ~400 non-boilerplate words. Combos failing the gate are excluded from `generateStaticParams` and forced `noindex`.

### T3 — Matrix routes (Phase 3.2)
Add route segments (reuse existing components: `ServiceHero`-lite, challenges/outcomes lists, `ServiceCard`, `CaseStudyCard`, `CtaBanner`, `Breadcrumb`):
- `app/industries/[industry]/[service]/page.tsx` — industry × service.
- `app/locations/[city]/page.tsx` — city overview; `LocalBusiness` schema `areaServed: city`.
- `app/locations/[city]/[industry]/page.tsx` — city × industry.
- `app/locations/[city]/[industry]/[service]/page.tsx` — full leaf; `ProfessionalService` schema `areaServed: [city, region]`, `offers` contact-for-quote.
- Each: `generateStaticParams` from `publishable` combos only; `export const revalidate = 86400`; `export const dynamicParams = true`; `buildMetadata` with canonical + city/industry in title; JSON-LD block.
- **Launch subset**: gate the first build to a curated launch set (e.g. top 3 cities × 6 industries × top 6 services ≈ 108 pages), then expand as copy quality is confirmed. Keep the rest `noindex` until reviewed.

### T4 — Insights expansion + full RSS (Phase 3.3)
- `content/posts.ts`: add 9 articles → 20. Mix: 3 comparison pieces ("BAZ vs {Competitor}") linked from `/vs-others`; 5 "how-we-do-it" methodology posts linked from `/methodology`; 3 local-perspective (MENA/EU/US) posts; fill remainder to 9. Every new post needs a real `body`.
- `app/insights/[slug]/page.tsx`: already has `articleLd` + `breadcrumbLd`; add `author` `Person` + `sameAs` to satisfy E-E-A-T.
- `app/feed.xml/route.ts`: add `xmlns:content="http://purl.org/rss/1.0/modules/content/"` and a `<content:encoded>` CDATA containing the full `body` (Phase 3.3 item 4). Keep `cache-control` header.

### T5 — Internal linking & crawl budget (Phase 3.4)
- Add `RelatedArticles` + `RelatedServices` modules on service / industry / insights detail pages (pull from `posts`/`services` by category).
- Link `/vs-others` from the homepage hero/footer **and** every service page footer (`CtaBanner` variant or a footer link).
- Tidy the `color-layer.css` import-order comment in `app/layout.tsx` (cosmetic; ensures `color-layer.css` is last per `DESIGN-SYSTEM.md`).

### T6 — Images & OG (Phase 3.5)
- Audit every `<Image>` on marketing pages for alt; add descriptive `alt` (or `aria-hidden` for decorative SVGs).
- Add dynamic OG: `app/og/services/[slug]/route.tsx` using `next/og` `ImageResponse` (service name + tagline + brand wordmark). Wire `buildMetadata` `image` to `/og/services/${slug}` for service pages; extend similarly for industries/locations if time permits.
- Add `og:image:alt` and `og:locale` to `buildMetadata` (OG/Twitter blocks).

## Affected boundaries
- New files: `content/locations.ts`, `lib/matrix.ts`, `app/og/services/[slug]/route.tsx`, 4 matrix route files, `RelatedArticles`/`RelatedServices` components.
- Modified: `lib/seo.ts`, `lib/site.ts`, `app/services/[slug]/page.tsx`, `app/industries/[slug]/page.tsx`, `app/insights/[slug]/page.tsx`, `content/posts.ts`, `app/feed.xml/route.ts`, `@/types`, `app/layout.tsx`.
- **Design-system rule:** no hardcoded hex; use semantic tokens (`text-brand`, `bg-background`, `bg-accent`). Square corners; `rounded-full` only for pills.

## Data flow (matrix page)
`content/industries.ts` + `content/services.ts` + `content/locations.ts` → `lib/matrix.buildMatrix()` composes unique copy + `publishable` flag → route `generateStaticParams` filters `publishable` → page renders components + JSON-LD (`ProfessionalService`/`LocalBusiness` + `Breadcrumb`). Thin combos → excluded + `noindex`.

## Failure modes & rollout
- **Doorway / thin-content penalty (highest risk):** mitigate via quality gate, `noindex` on failing combos, genuinely unique local copy (no fabricated stats — tie to Phase 2 "no placeholders" principle), strong internal linking, and a **gated launch** (subset first). Monitor Search Console Coverage + indexed-page count weekly; pause expansion if impressions/indexed drop.
- **Build size/time:** ~1.4k potential pages → bound with `revalidate` (ISR) + `dynamicParams = true`; launch subset keeps initial build small.
- **Truthfulness:** matrix copy must not invent local client metrics. Use generic-but-specific local market context; mark any illustrative figure explicitly.
- **RSS breakage:** validate feed after adding `<content:encoded>` (well-formed XML, CDATA-escaped).

## Validation plan
1. Google Rich Results / schema validator on service, industry, city, and leaf pages — `Service`/`LocalBusiness`/`FAQPage`/`Breadcrumb`/`Article` present, 0 errors.
2. `npm run build` clean from a clean clone; confirm generated route count matches the launch subset.
3. Lighthouse / PageSpeed Insights on 5 reps (home, service, industry, location leaf, insights) — no regression vs Phase 1.
4. RSS validator on `/feed.xml` — full `<content:encoded>` present and parseable.
5. Submit updated `sitemap.xml` (must include new matrix routes) to Search Console; monitor indexing + manual actions.
6. Rank tracker snapshot at launch; weekly organic KW delta + indexed-page count.

## Out of scope
- Phase 2 (Trust & Authority), Phase 4 (Speed/UX), Phase 5 (Conversion), Phase 6 (Competitive Intel).
- Signed case studies / real testimonials (Phase 2 dependency).

## Open questions (proposed defaults — confirm or override)
- Final city list (proposed 13 above) — editable in `content/locations.ts`.
- Launch subset size (proposed top-3 cities × 6 industries × top-6 services ≈ 108) vs. full matrix on day one.
- `offers` representation (proposed contact-for-quote; switch to real prices later if `content/pricing.ts` gains per-service prices).
