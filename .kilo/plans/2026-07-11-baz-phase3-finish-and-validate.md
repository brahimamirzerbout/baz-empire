# BAZ — Finish & Validate Phase 3 SEO (Next Move Plan)

**Date:** 2026-07-11 · **Repo:** `baz` (`baz-marketing-site`, `origin/main`)
**Context:** The Phase 3 plan in `1783732088378-baz-seo-offensive-phase3.md` was written as if nothing existed. A prior session has *already shipped most of it*. This plan documents what's actually done, the **real remaining gaps**, and the validation + launch sequence. Do NOT re-build what exists.

## Reality check — already DONE (verified in code)
- **T1 Service schema + form:** `serviceLd()` exists in `lib/seo.ts:129`; `app/services/[slug]/page.tsx:236` emits `serviceLd + faqLd + breadcrumbLd`; `ServiceLeadForm` wired at line 226 (`source: service_${slug}`). ✅
- **T2 Industry schema + matrix data:** `localBusinessLd()` in `lib/seo.ts:157`; `content/locations.ts` and `lib/matrix.ts` both exist; quality gate (`publishable` + curated launch subset) implemented in `lib/matrix.ts`. ✅
- **T3 Matrix routes:** `app/industries/[industry]/[service]`, `app/locations/[city]`, `app/locations/[city]/[industry]`, `app/locations/[city]/[industry]/[service]` all exist; each filters `publishable` + `notFound()` on non-publishable. ✅
- **T4 Insights + full RSS:** `content/posts.ts` already has **20** posts (target met). `articleLd()` includes `author` `Person` + `sameAs` (linkedin). `app/feed.xml/route.ts` emits `<content:encoded>` CDATA with full `body`. ✅
- **T5 Internal linking:** `CtaBanner`, `Footer`, and `ReadNext` link `/vs-others`; service pages render related `ServiceCard`s. `color-layer.css` is already imported **last** in `app/layout.tsx:23` (the T5 cosmetic item is satisfied). ✅
- **T6 OG dynamic image:** `app/og/services/[slug]/route.tsx` exists. ✅

## Real remaining gaps (the actual work)
1. **Sitemap must include matrix routes** (plan validation #5 — currently MISSING).
   `app/sitemap.ts` lists only static + services + cases + posts + industries. It does **not** include `/locations/[city]`, `/locations/[city]/[industry]`, `/locations/[city]/[industry]/[service]`, or `/industries/[industry]/[service]`. Build these from `buildMatrix()` (publishable only) + `cities` so Search Console can crawl the new surface.
2. **`og:image:alt` + `og:locale` in `buildMetadata`** (`lib/seo.ts:32` — `openGraph.images` currently has no `alt`; no `og:locale` on detail pages; root layout sets `locale: en_US` but it's not propagated per-page). Add `alt` to the image object and `locale: "en_US"` to `openGraph`.
3. **Alt-text audit on marketing-page `<Image>`s** (plan T6 item 1). Grep `app/**` for `<Image` and ensure every non-decorative image has descriptive `alt` (decorative SVGs get `aria-hidden`). Track as a checklist; fix per-page.

## Validation sequence (before ship)
1. `npm run typecheck` and `npm run lint` — clean from current tree (catches regressions from matrix/OG additions).
2. `npm run build` — confirm generated route count ≈ launch subset (top cities × industries × services ≈ 108) + 20 posts, no build errors.
3. `npm run sitemap` (or rely on `app/sitemap.ts` at runtime) — confirm matrix URLs present; submit to Search Console.
4. Google Rich Results test on one of each: service, industry, city overview, leaf, insights — `Service`/`LocalBusiness`/`FAQPage`/`Breadcrumb`/`Article` present, 0 errors.
5. RSS validator on `/feed.xml` — full `<content:encoded>` parseable.
6. Lighthouse / PageSpeed on home, service, industry, location-leaf, insights — no regression vs Phase 1 baseline.

## Rollout guardrails (from original plan — still binding)
- **Doorway/thin-content risk:** already mitigated by `publishable` gate + `noindex` on failing combos + gated launch subset. Monitor Search Console Coverage + indexed-page count **weekly**; pause expansion if impressions/indexed drop.
- **Truthfulness:** matrix copy must not invent local client metrics. Keep generic-but-specific local market context.
- Expand the launch subset to the full publishable matrix only after week-1 indexing looks healthy.

## Win condition (unchanged)
Top-3 for 20+ high-intent service+industry+location queries; organic +40% in 90 days; 0 thin/doorway manual actions.

## What comes AFTER Phase 3 (the next-next move — not this sprint)
Phase 3 only makes the pages *findable*. The leverage then shifts to:
- **Phase 4 (Speed/UX)** and **Phase 5 (Conversion)** — the matrix pages must convert, not just rank.
- **Link earning** (original-data studies) to actually move the clusters — content exists, authority doesn't yet.
- Decide the bigger BAZ/empire strategic move separately (out of scope here).

## Recommended immediate action
Close gaps **1–3** (sitemap matrix, og alt/locale, alt audit), run validation 1–6, then ship to production and start the weekly Search Console watch.
