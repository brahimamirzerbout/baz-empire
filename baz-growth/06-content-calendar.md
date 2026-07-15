# 06 — Content calendar (24-type demand engine)

> The inbound moat. Every `/agencies/[slug]` page is one qualified search
> intent. Ship all 24, then depth. This calendar sequences them by revenue
> relevance, not alphabetically — the wedge types go first.

## Doctrine

- Each page = one search intent, one AEO-citable answer block.
- Server-rendered (`force-static` + `generateStaticParams`) → AI-crawler-readable.
- Two registers per page: operator copy (converts the buyer) + plain
  answer-first passage (feeds AEO/GEO citations). Already built in
  `agencyPlain.ts`.
- Calendar is paced: **3 pages/week** = 24 in 8 weeks. Do not batch-ship all
  24 on day 1 — staged shipping gives crawl signal + lets you depth-enrich.

## Sequencing (by revenue relevance, not alpha)

### Wave 1 — the wedge (weeks 1–3, 9 pages)
These map to BAZ's right-to-win verticals (`01-gtm-matrix`). Ship first so
inbound compounds toward the pilot ICP.

| Week | Pages (slug) | Why first |
|---|---|---|
| 1 | `performance-marketing-agency`, `seo-agency`, `advertising-agency` | the wedge + the two highest-inbound agency types |
| 2 | `digital-agency`, `web-design-agency`, `social-media-agency` | DTC/brand search volume |
| 3 | `data-analytics-agency`, `content-marketing-agency`, `branding-agency` | ascension rungs + high search intent |

### Wave 2 — the breadth (weeks 4–6, 9 pages)
The rest of the taxonomy, sequenced by inbound intent (best guess, `[replace with real]` from Search Console once live).

| Week | Pages (slug) |
|---|---|
| 4 | `pr-agency`, `event-agency`, `influencer-marketing-agency` |
| 5 | `market-research-agency`, `media-buying-agency`, `growth-agency` |
| 6 | `guerilla-marketing-agency`, `experiential-agency`, `direct-marketing-agency` |

### Wave 3 — the depth + long tail (weeks 7–8, 6 pages)
Remaining types. Lower individual volume, but each is a qualified intent and
fills the topical cluster.

| Week | Pages (slug) |
|---|---|
| 7 | `luxury-marketing-agency`, `fashion-marketing-agency`, `beauty-marketing-agency` |
| 8 | `b2b-marketing-agency`, `nonprofit-marketing-agency`, `film-production-agency` |

> Sequence is a best guess until Search Console data exists. Re-sequence
> after 30 days of live impression data — let the market vote.

## Per-page build spec (the depth pass)

Each `/agencies/[slug]` page gets, beyond the current one-paragraph
`agencyPlain.ts` entry:

| Section | Purpose | AEO value |
|---|---|---|
| **Answer block** (first 40 words) | the one-sentence "what is a {type} agency" answer | high — AI crawlers cite the first answer-first passage |
| **Core goal** | what they do, operator voice | medium |
| **Key tasks** (3–5 bullets) | how they work | high — list structures get cited |
| **Workflow phases** (where relevant) | the pipeline (e.g. Creative: Analysis → Concept → Creation → Execution) | high — `HowTo` JSON-LD candidate |
| **Model relevance** | why it matters to the buyer's model | medium |
| **JSON-LD** | `Service` + `BreadcrumbList` + (phased) `HowTo` | structured-data citation bait |

## The enrichment material you already have

The structured summaries you dropped (Creative Agency workflow phases,
SEO/SEA OnPage-OffPage split, Video & Film pre/prod/post, Full-Service 7
service areas) are exactly the depth-pass content for 4 of the 24:

| Dropped content | Target page | What to fold in |
|---|---|---|
| Creative Agency (4-phase pipeline) | `/agencies/creative-agency` | workflow phases + `HowTo` JSON-LD |
| SEO / SEA Agency (SEM framework, keyword valuation) | `/agencies/seo-agency` | SEO vs SEA split + long-tail/local keyword doctrine |
| Video & Film Agency (pre/prod/post) | `/agencies/film-production-agency` | 3-phase `HowTo` + call-sheet relevance |
| Full-Service Advertising Agency (7 service areas) | `/agencies/advertising-agency` | 7-area service breakdown |

> The other 20 pages need equivalent depth material. Do NOT fabricate it —
> either generate from the cmmodels.com source (as you did for the 4) or
> leave at the current one-paragraph register and flag `[depth pending]`.

## JSON-LD enrichment (add to `[slug]/page.tsx`)

For pages with a clear workflow (Creative, Film, SEO), add a `HowTo` schema
alongside the existing `Service` + `BreadcrumbList`:

```json
{
  "@type": "HowTo",
  "name": "How a creative agency works",
  "step": [
    { "@type": "HowToStep", "name": "Analysis & trend research", "text": "..." },
    { "@type": "HowToStep", "name": "Concept & avatars", "text": "..." },
    { "@type": "HowToStep", "name": "Creation & asset design", "text": "..." },
    { "@type": "HowToStep", "name": "Cross-channel execution & PR", "text": "..." }
  ]
}
```

`HowTo` is high-value for AEO — answer engines cite step lists heavily.

## KPIs (the moat, measured)

| Metric | Target (90 days) | Source |
|---|---|---|
| Indexed `/agencies/*` pages | 24 | Search Console |
| Organic impressions (agency-type queries) | upward trend | Search Console |
| AEO citations (brand mentions in AI answers) | ≥3 by day 90 | manual + brand-monitoring |
| Organic leads attributed to `/agencies/*` | ≥2 by day 120 | portal lead capture |

> Content is a **day-90+** compounding source. It does not produce pilot 1.
> Outreach (`02`) produces pilot 1. Ship content in parallel; don't wait on it.

## Flags

- All search-volume claims here are directional `[replace with real]` once
  Search Console is live for 30 days.
- The 24 slugs above must be reconciled against the actual `AGENCY_TYPES`
  array in `src/lib/agencyTypes.ts` — verify the exact slug strings before
  building. (The taxonomy is verified at 24; the slug names are the check.)