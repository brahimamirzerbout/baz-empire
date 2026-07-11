# SEO (Search Engine Optimization)

Google-first reference, based on Google Search Central documentation plus current
2026 guidance (AEO/GEO for AI search).

## What SEO is

The practice of improving your website's content, structure, and authority so it
ranks higher in **unpaid (organic) search results**. One of the highest-ROI
channels because traffic is "free" once rankings are achieved, and it compounds.

## How Google Search works (crawl → index → serve)

- **Googlebot** discovers URLs by crawling links, sitemaps, and redirects.
- Pages are **indexed** (added to the index) if reachable and not blocked.
- Google **serves** relevant results to queries.

Key implication: if Googlebot can't find or understand a page, it can't rank.

## Essentials (Google Search Essentials)

- Create **helpful, reliable, people-first content**.
- Use words people actually search for, and place them naturally on the page.
- Make every page crawlable and indexable.
- Avoid deceptive or manipulative practices (cloaking, hidden text, link schemes).

## Beginner checklist (SEO Starter Guide)

1. **Descriptive page titles & meta descriptions** — unique per page; help users
   see relevance in results and can lift click-through.
2. **Use words people search for** in headings and body copy.
3. **Clear, logical site structure** — link important URLs together with
   descriptive anchor text.
4. **Images**: use descriptive filenames and `alt` text.
5. **Links**: build genuine, relevant links; use `rel="nofollow"` for paid/
   untrusted/required-login links.
6. **Duplicate content**: consolidate with canonical tags; pick one canonical URL.
7. **Mobile-friendly & fast**: Google uses a mobile crawler by default. Core Web
   Vitals matter.
8. **Secure (HTTPS)**: preferred and a ranking/trust signal.
9. **Videos**: provide text context; Googlebot can't read text inside video.

## Developer / technical SEO

- Ensure all pages are reachable by an **anchor link** from another findable page.
- Submit an XML **sitemap** to encourage/smaritize crawling of key pages.
- For JS apps with one HTML page, give **each screen/content piece its own URL**.
- Keep key info in **text, not graphics**; use **semantic HTML**.
- Make content available in the **DOM** (CSS `content` property is not indexed).
- **robots.txt** blocks crawling; `noindex` blocks indexing but allows crawling.
- Use **canonical** tags to manage duplicate URLs.
- Use **301** redirects for permanent moves, **302** for temporary.
- Add **structured data** (schema) to enable rich results.
- Use URL Inspection / Rich Results Test to see how Google views your site.
- Manage crawl budget for very large sites via sitemaps + robots.txt.

## 2026 evolution: AEO & GEO

- **AEO (Answer Engine Optimization)** — get cited by ChatGPT, Perplexity,
  Gemini. Tactics: structured data, topic authority, `llms.txt` directives.
- **GEO (Generative Engine Optimization)** — shape content for AI synthesis:
  clear topic sentences, entity-rich phrasing, strong source-quality signals.
- ~45% of B2B buyers now use AI for initial research. Treat AI engines as a
  distribution channel, not a trend.

## Local SEO

- **Google Business Profile** wins the map pack; critical for service-area
  businesses.
- Build citations + reviews; keep NAP (name/address/phone) consistent.

## Timelines

- Traditional SEO: meaningful results in 3–6 months, compounding gains 6–18 months.
- Google Business Profile map-pack movement: ~3–8 weeks.
- AEO/structured-data citation: ~4–10 weeks.

## Measurement

- Google Search Console (indexing, queries, clicks, Core Web Vitals).
- Google Analytics 4 (engagement, conversions).
- Track rankings, impressions, CTR, organic conversions, and now AI visibility.

## Sources

- SEO Starter Guide — Google Search Central: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google Search Essentials (guidelines): https://developers.google.com/search/docs/essentials
- SEO documentation hub: https://developers.google.com/search/docs
- SEO Guide for Web Developers: https://developers.google.com/search/docs/fundamentals/get-started-developers
- Technical SEO techniques: https://developers.google.com/search/docs/fundamentals/get-started
- SEO Starter Guide makeover (what changed): https://developers.google.com/search/blog/2024/02/ssg-gets-a-makeover
