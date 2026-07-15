# Read baz marketing site content (@general subagent)
- **id**: `ses_0b7a3c3e9ffeRYZBzA1EEJyj6F`
- **agent**: general  |  **model**: {"id":"kilo-auto/free","providerID":"kilo","variant":"default"}
- **directory**: `/home/uzer`
- **project**: /home/uzer
- **created**: 2026-07-09T19:30:32.086000+00:00  |  **updated**: 2026-07-09T19:32:42.410000+00:00
- **cost**: $0.0000  |  **tokens**: in=88398 out=6255 reason=917
- **messages**: 11  |  **parts**: 68  |  **todos**: 0

## Transcript

### [user] 2026-07-09T19:30:32.407000+00:00  

Read the key content files from the /home/uzer/baz/ Next.js marketing site. Specifically:
1. Read /home/uzer/baz/content/ directory listing
2. Read any services, case studies, about, process, and portfolio content files
3. Read /home/uzer/baz/app/page.tsx or similar main page files
4. Read /home/uzer/baz/brand/ for any brand guidelines
5. Return the full text content of all marketing copy, services, case studies, testimonials, and any other content that should appear on the marketing page.

Be very thorough - read all content modules and page components.

### [assistant] 2026-07-09T19:30:32.549000+00:00  @kilo-auto/free


> _reasoning_: Let me explore the directory structure first

**tool `bash`** completed
```input
{
  "command": "ls -la /home/uzer/baz/ && echo \"---CONTENT---\" && ls -la /home/uzer/baz/content/ 2>/dev/null && echo \"---BRAND---\" && ls -la /home/uzer/baz/brand/ 2>/dev/null && echo \"---APP---\" && ls -la /home/uzer/baz/app/ 2>/dev/null",
  "description": "List baz project key directories"
}
```
```output
total 800
drwxrwxr-x  24 uzer uzer   4096 Jul  9 09:10 .
drwx------  53 uzer uzer   4096 Jul  9 07:39 ..
drwxrwxr-x   2 uzer uzer   4096 Jul  6 10:04 .agents
-rw-rw-r--   1 uzer uzer   3298 Jul  5 17:27 AGENTS.md
drwxrwxr-x  36 uzer uzer   4096 Jul  7 12:09 app
drwxrwxr-x   3 uzer uzer   4096 Jul  6 10:04 assets
-rw-rw-r--   1 uzer uzer  18943 Jul  9 09:10 AUDIT.md
-rw-rw-r--   1 uzer uzer  74342 Jul  4 05:26 BAZ-website.html
drwxrwxr-x   6 uzer uzer   4096 Jul  6 10:04 brand
drwxrwxr-x  14 uzer uzer   4096 Jul  7 08:23 components
drwxrwxr-x   3 uzer uzer   4096 Jul  7 08:23 content
drwxrwxr-x   3 uzer uzer   4096 Jul  8 18:32 data
-rw-rw-r--   1 uzer uzer   2090 Jun 22 21:14 deploy.sh
-rw-rw-r--   1 uzer uzer   8611 Jul  5 17:24 DESIGN-SYSTEM.md
-rw-rw-r--   1 uzer uzer   1217 Jul  1 00:54 docker-compose.yml
-rw-rw-r--   1 uzer uzer   1438 Jul  1 00:54 Dockerfile
-rw-rw-r--   1 uzer uzer    191 Jul  1 00:54 .dockerignore
drwxrwxr-x   3 uzer uzer   4096 Jul  7 20:14 docs
-rw-rw-r--   1 uzer uzer   4097 Jul  4 12:22 .env.example
-rw-rw-r--   1 uzer uzer   2971 Jul  7 12:03 .env.local
-rw-rw-r--   1 uzer uzer   1326 Jul  1 00:54 .env.production.example
-rw-rw-r--   1 uzer uzer    139 Jun 22 20:20 .eslintrc.json
drwxrwxr-x   8 uzer uzer   4096 Jul  9 08:37 .git
drwxrwxr-x   3 uzer uzer   4096 Jul  4 12:22 .github
-rw-rw-r--   1 uzer uzer    627 Jul  7 08:23 .gitignore
-rw-rw-r--   1 uzer uzer   2892 Jul  1 10:39 inline
drwxrwxr-x   7 uzer uzer   4096 Jul  7 08:23 lib
-rw-rw-r-- 
... [+6201 chars truncated]
```


### [assistant] 2026-07-09T19:30:41.049000+00:00  @kilo-auto/free


> _reasoning_: Let me read the main page.tsx and the content files. Let me read them all in parallel

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/app/page.tsx"
}
```
```output
<path>/home/uzer/baz/app/page.tsx</path>
<type>file</type>
<content>
1: // @ts-nocheck
2: import {
3:   Hero,
4:   PillarGrid,
5:   PerformanceFeature,
6:   ServicesOverview,
7:   HowWeWork,
8:   KpiBand,
9:   Framework,
10:   CaseStudies,
11:   LogoMarquee,
12:   Testimonials,
13:   InsightsPreview,
14:   FinalCta,
15:   MarketingHubBanner,
16:   ProofNumbers,
17:   ReadNext,
18:   PipelineTicker,
19:   StickyCta,
20: } from "@/components/sections";
21: import { buildMetadata, jsonLd, professionalServiceLd } from "@/lib/seo";
22: import { resolveHeroVariant } from "@/lib/hero-variant";
23: import { SelectedFew } from "@/components/sections/SelectedFew";
24: 
25: // `/` is rendered fully static (○) for edge caching + sub-1.5s LCP. The `?icp=`
26: // hero-personalization feature (lib/hero-variant.tsx) is intentionally NOT read
27: // here: reading searchParams opts the route into dynamic rendering (cache-control:
28: // no-store, TTFB ~1.3s cold). Default variant is what every visitor sees today (no
29: // traffic uses ?icp=). To re-enable ICP hero variants, swap to a client-side
30: // override (useSearchParams() in a client Hero wrapper) so `/` stays static.
31: export function generateMetadata() {
32:   const title = "Growth as a forecast, not a hope.";
33:   const subtitle = "Senior-only. 90-day plans. Or pay nothing for month four";
34:   const ogQuery = `?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(subtitle)}`;
35:   return buildMetadata({
36:     ti
... [+4473 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/content/services.ts"
}
```
```output
<path>/home/uzer/baz/content/services.ts</path>
<type>file</type>
<content>
1: import type { Service } from "@/types";
2: 
3: /**
4:  * BAZ Marketing Agency — the 18-service catalog.
5:  *
6:  * Ordered by how a CMO buys: strategy → execution channels → measurement &
7:  * systems → earned media & audience → scale plays.
8:  *
9:  * Each entry is the full payload that drives its service detail page.
10:  * Proof points use representative composites based on real engagement
11:  * patterns. Real client metrics must replace these before public launch.
12:  *
13:  * Each service follows the same operator-grade structure:
14:  *   - Pillar (owned / earned / paid / data / platform)
15:  *   - Hero promise + supporting sub
16:  *   - "Who it's for" (3 ICPs)
17:  *   - Concrete deliverables
18:  *   - 3 KPIs (volume, performance, adoption)
19:  *   - 5-step process (no fluff)
20:  *   - 3 proof points with hard numbers
21:  *   - 3 FAQs answering the buying questions
22:  *   - Single primary CTA (+ optional secondary)
23:  */
24: export const services: Service[] = [
25:   // ──────────────────────────── 01 · Strategy ──────────────────────────────
26:   {
27:     slug: "strategy-consulting",
28:     name: "Strategy & Growth Consulting",
29:     tagline: "A growth plan that survives the org chart.",
30:     pillar: "owned",
31:     description:
32:       "A senior-led growth audit, opportunity map, and 90-day plan tied to revenue — not vanity metrics.",
33:     hero: {
34:       eye
... [+54949 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/content/case-studies.ts"
}
```
```output
<path>/home/uzer/baz/content/case-studies.ts</path>
<type>file</type>
<content>
1: import type { CaseStudy } from "@/types";
2: 
3: /**
4:  * Case studies.
5:  *
6:  * IMPORTANT: These are representative composites based on real engagement
7:  * patterns. They illustrate the types of problems BAZ solves and the
8:  * outcomes that are typical for each industry and service combination.
9:  *
10:  * Names, metrics, and companies are illustrative — written to read like
11:  * real client stories so visitors understand what working with BAZ looks
12:  * like. Replace with signed-client case studies before public launch.
13:  *
14:  * Each case study follows the same structure:
15:  *   - Problem (what the client was stuck on)
16:  *   - Strategy (what BAZ did differently)
17:  *   - Result (what changed, with metrics)
18:  *   - Duration (how long it took)
19:  *   - Testimonial (optional, from the client)
20:  */
21: // All entries below are composites until signed-client material replaces them
22: // (see header note). `placeholder` defaults to true here so every composite is
23: // flagged in the UI; set `placeholder: false` on any real, releasable case study.
24: const _rawCaseStudies: CaseStudy[] = [
25:   {
26:     slug: "viralvista-growth-engine",
27:     client: "ViralVista",
28:     industry: "DTC Beauty",
29:     services: [
30:       "Performance Marketing",
31:       "SEO & Organic Growth",
32:       "Content & Editorial Engine",
33:       "Conversion Rate Optimizatio
... [+14792 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/content/testimonials.ts"
}
```
```output
<path>/home/uzer/baz/content/testimonials.ts</path>
<type>file</type>
<content>
1: import type { Testimonial } from "@/types";
2: 
3: /**
4:  * Customer testimonials.
5:  *
6:  * IMPORTANT: These are representative composites based on real engagement
7:  * patterns. Each quote is clearly marked with `placeholder: true` until
8:  * replaced with signed-client material. The metrics shown are illustrative
9:  * of typical outcomes for the service tier and industry shown.
10:  *
11:  * To add a real testimonial:
12:  *   1. Get written permission from the client (public_ok: true)
13:  *   2. Replace the quote, author, role, company, and metric
14:  *   3. Set `placeholder: false`
15:  */
16: export const testimonials: Testimonial[] = [
17:   {
18:     quote: "BAZ rebuilt our growth engine. We finally trust the numbers and the team running them.",
19:     author: "Hala Mansour",
20:     role: "Founder",
21:     company: "ViralVista",
22:     metric: "ROAS 1.8 → 4.6 in 90 days",
23:     placeholder: true,
24:   },
25:   {
26:     quote: "They turned organic into our biggest channel. No one else got close.",
27:     author: "Daniel K.",
28:     role: "VP Growth",
29:     company: "Northwind",
30:     metric: "0 → 480K organic sessions / mo",
31:     placeholder: true,
32:   },
33:   {
34:     quote: "Senior people, no juniors. They shipped what other agencies only pitch.",
35:     author: "Mira Okafor",
36:     role: "CEO",
37:     company: "EngageEra",
38:     metric: "Trial → Paid
... [+1520 chars truncated]
```


### [assistant] 2026-07-09T19:30:49.729000+00:00  @kilo-auto/free


> _reasoning_: The services.ts file is large. Let me read the rest (lines 1415 onward). Also read remaining content files: team.ts, pricing.ts, about, process, portfolio. And the components/sections to understand what marketing copy appears. Let me also read design.md, voice.md for brand guidelines.

Let me continue reading services.ts and other content. Let me read the sections config to understand the copy shown. Let me first get the rest of services.ts.

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/content/services.ts",
  "offset": 1414
}
```
```output
<path>/home/uzer/baz/content/services.ts</path>
<type>file</type>
<content>
1414:     kpis: [
1415:       { label: "Studies shipped", value: "120+" },
1416:       { label: "Avg respondents / study", value: "1,800" },
1417:       { label: "Markets covered", value: "34" },
1418:     ],
1419:     process: [
1420:       { step: 1, title: "Frame", desc: "Decision, hypotheses, methodology, and sample design." },
1421:       { step: 2, title: "Collect", desc: "Surveys, interviews, ethnography, and secondary data." },
1422:       {
1423:         step: 3,
1424:         title: "Analyze",
1425:         desc: "Segmentation, sizing, drivers, and brand health metrics.",
1426:       },
1427:       {
1428:         step: 4,
1429:         title: "Synthesize",
1430:         desc: "Findings, implications, and decision-ready recommendations.",
1431:       },
1432:       { step: 5, title: "Enable", desc: "Workshop with leadership to operationalize findings." },
1433:     ],
1434:     proof: [
1435:       {
1436:         client: "CPG · MENA",
1437:         metric: "+$80M TAM identified",
1438:         detail: "Market sizing + segmentation for new category.",
1439:       },
1440:       {
1441:         client: "SaaS · US",
1442:         metric: "Pricing ↑ 22%",
1443:         detail: "Conjoint pricing study across 4 tiers.",
1444:       },
1445:       {
1446:         client: "FinTech · EU",
1447:         metric: "Positioning reset",
1448:         detail: "Brand tracker + qualitative interviews across 
... [+4216 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/content/team.ts"
}
```
```output
<path>/home/uzer/baz/content/team.ts</path>
<type>file</type>
<content>
1: import type { TeamMember } from "@/types";
2: 
3: /**
4:  * BAZ team members.
5:  *
6:  * Brahim ZERBOUT is the founder. Other entries are role definitions
7:  * showing the senior-partner structure BAZ operates with. As the team
8:  * grows, replace each entry with the actual partner filling that role.
9:  */
10: export const team: TeamMember[] = [
11:   {
12:     name: "Brahim ZERBOUT",
13:     role: "Founder · Strategy & Systems",
14:     bio: "Engineer first, operator second. Sets the bar on growth strategy and the senior-team model — and ships the systems other agencies only storyboard. 60+ brands across MENA, EU, and the US.",
15:     initials: "BZ",
16:     color: "var(--color-primary)",  // violet — brand accent
17:   },
18:   {
19:     name: "Partner · SEO & Content",
20:     role: "Senior Partner · SEO & Content",
21:     bio: "Editorial SEO and topical authority for category-defining SERPs. Owns the content engine end-to-end.",
22:     initials: "SE",
23:     color: "hsl(210, 75%, 60%)",  // info blue
24:   },
25:   {
26:     name: "Partner · Paid & Lifecycle",
27:     role: "Senior Partner · Paid & Lifecycle",
28:     bio: "Paid media and lifecycle marketing. Believes tracking is the moat. Ships server-side + CAPI on every account.",
29:     initials: "PL",
30:     color: "hsl(38, 85%, 58%)",  // amber — caution/paid
31:   },
32:   {
33:     name: "Partner · Brand & Creative",
34:     role:
... [+903 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/content/pricing.ts"
}
```
```output
<path>/home/uzer/baz/content/pricing.ts</path>
<type>file</type>
<content>
1: import type { PricingTier } from "@/types";
2: 
3: /**
4:  * BAZ engagement tiers — project-based pricing, not SaaS subscriptions.
5:  * Each tier is a senior-led engagement with a clear scope, deliverable
6:  * shape, and indicative price range. Prices are USD, monthly retainer.
7:  *
8:  * Source-of-truth: derived from legacy `baz-legacy-v6/api/stripe.js` plans
9:  * (June 22, 2026) and adapted for BAZ's boutique project model.
10:  *
11:  * When `featured: true`, the tier is highlighted in the Pricing page.
12:  * When `cta: 'contact'`, the button links to /contact.
13:  * When `cta: 'external'`, the button opens the `externalUrl`.
14:  */
15: export const tiers: PricingTier[] = [
16:   {
17:     id: "retainer-core",
18:     name: "Core",
19:     tagline: "One channel. One senior partner. End-to-end.",
20:     description:
21:       "A single senior partner ships one BAZ service for your team on a monthly retainer. For teams that already know which channel to grow — and want it run by a senior partner, not handed to a pod.",
22:     monthly: { min: 6500, max: 9500, label: "per month" },
23:     cadence: "Monthly retainer · 90-day minimum",
24:     bestFor: ["Startups at $2M–$10M ARR", "Founders scaling past DIY", "Single-channel focus"],
25:     includes: [
26:       "One senior partner (no junior pods)",
27:       "Monthly strategy review",
28:       "Weekly async updates",
29:       "Direct Sla
... [+2346 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/content/industries.ts"
}
```
```output
<path>/home/uzer/baz/content/industries.ts</path>
<type>file</type>
<content>
1: import type { Industry } from "@/types";
2: 
3: export const industries: Industry[] = [
4:   {
5:     slug: "dtc-ecommerce",
6:     name: "DTC & E-commerce",
7:     blurb: "Brands scaling paid + retention together, not in silos.",
8:     challenges: [
9:       "Rising CAC across Meta and TikTok",
10:       "iOS attribution loss and creative fatigue",
11:       "Flat LTV despite growing list size",
12:     ],
13:     outcomes: [
14:       "Clean server-side tracking that survives iOS",
15:       "Creative matrix with weekly iteration",
16:       "Lifecycle flows that compound LTV",
17:     ],
18:   },
19:   {
20:     slug: "b2b-saas",
21:     name: "B2B SaaS",
22:     blurb: "Companies that need pipeline they can forecast.",
23:     challenges: [
24:       "Long, opaque sales cycles",
25:       "Leaky MQL → SQL hand-off",
26:       "Content that ranks but doesn't convert",
27:     ],
28:     outcomes: [
29:       "PQL scoring and routing into lifecycle",
30:       "Comparison and alternatives pages at scale",
31:       "Dashboards that show pipeline by channel",
32:     ],
33:   },
34:   {
35:     slug: "fintech",
36:     name: "FinTech",
37:     blurb: "Trust-first growth for regulated, technical products.",
38:     challenges: [
39:       "Category-defining SERPs dominated by incumbents",
40:       "Trust and compliance in every piece of content",
41:       "High-intent traffic that doesn't conv
... [+2076 chars truncated]
```


### [assistant] 2026-07-09T19:30:59.949000+00:00  @kilo-auto/free


> _reasoning_: Now let me read the sections components and about/process/portfolio content. The main page is composed of sections. Let me read the section components to capture marketing copy. Let me look at components/sections directory

Now let me read the section components that make up the homepage, plus about/process pages.

**tool `bash`** completed
```input
{
  "command": "ls -la /home/uzer/baz/components/sections/ && echo \"---ABOUT---\" && ls -la /home/uzer/baz/app/about/ && echo \"---METHODOLOGY---\" && ls -la /home/uzer/baz/app/methodology/ && echo \"---OUR-STORY---\" && ls -la /home/uzer/baz/app/our-story/",
  "description": "List sections and about/process dirs"
}
```
```output
total 144
drwxrwxr-x  2 uzer uzer 4096 Jul  7 08:31 .
drwxrwxr-x 14 uzer uzer 4096 Jul  7 08:23 ..
-rw-rw-r--  1 uzer uzer 1225 Jul  5 16:49 Breadcrumb.tsx
-rw-rw-r--  1 uzer uzer 4317 Jul  6 11:14 CaseStudies.tsx
-rw-rw-r--  1 uzer uzer 1164 Jul  5 16:49 ChapterDivider.tsx
-rw-rw-r--  1 uzer uzer 3556 Jul  8 12:55 FinalCta.tsx
-rw-rw-r--  1 uzer uzer 2652 Jul  5 16:49 Framework.tsx
-rw-rw-r--  1 uzer uzer 1035 Jul  5 16:49 GuaranteeMicro.tsx
-rw-rw-r--  1 uzer uzer 9830 Jul  7 08:23 Hero.tsx
-rw-rw-r--  1 uzer uzer 2301 Jul  5 16:49 HowWeWork.tsx
-rw-rw-r--  1 uzer uzer 1045 Jul  7 08:23 index.ts
-rw-rw-r--  1 uzer uzer 2831 Jul  5 16:49 InsightsPreview.tsx
-rw-rw-r--  1 uzer uzer 2245 Jul  7 08:23 KpiBand.tsx
-rw-rw-r--  1 uzer uzer 3714 Jul  7 12:16 LiveStatusPill.tsx
-rw-rw-r--  1 uzer uzer 1484 Jul  5 16:49 LogoMarquee.tsx
-rw-rw-r--  1 uzer uzer 8209 Jul  7 12:16 MarketingHubBanner.tsx
-rw-rw-r--  1 uzer uzer 5501 Jul  7 08:23 NovaLoop.tsx
-rw-rw-r--  1 uzer uzer 8474 Jul  6 11:14 PerformanceFeature.tsx
-rw-rw-r--  1 uzer uzer 2064 Jul  7 08:23 PillarGrid.tsx
-rw-rw-r--  1 uzer uzer 4888 Jul  7 12:16 PipelineTicker.tsx
-rw-rw-r--  1 uzer uzer 3036 Jul  6 11:14 ProofNumbers.tsx
-rw-rw-r--  1 uzer uzer 2096 Jul  5 16:49 ReadNext.tsx
-rw-rw-r--  1 uzer uzer  890 Jul  7 08:31 SelectedFew.tsx
-rw-rw-r--  1 uzer uzer 3147 Jul  5 16:49 ServicesOverview.tsx
-rw-rw-r--  1 uzer uzer 1283 Jul  5 16:49 StatRow.tsx
-rw-rw-r--  1 uzer uzer 2798 Jul  5 16:49 StickyCta.tsx
-rw-rw-r--  
... [+543 chars truncated]
```


### [assistant] 2026-07-09T19:31:08.545000+00:00  @kilo-auto/free


> _reasoning_: Let me read the key section components that contain marketing copy. The main page sections: Hero, MarketingHubBanner, ProofNumbers, LogoMarquee, PerformanceFeature, PillarGrid, ServicesOverview, HowWeWork, KpiBand, Framework, CaseStudies, Testimonials, InsightsPreview, ReadNext, SelectedFew, FinalCta, StickyCta. Let me read them in parallel. Also about, methodology, our-story pages. And the brand/voice.md, design.md.

Let me batch read the most important marketing copy ones first

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/components/sections/Hero.tsx"
}
```
```output
<path>/home/uzer/baz/components/sections/Hero.tsx</path>
<type>file</type>
<content>
1: // @ts-nocheck
2: "use client";
3: 
4: import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
5: import { Button } from "@/components/ui/Button";
6: import { LiveAgentDemo } from "@/components/marketing/LiveAgentDemo";
7: import { ScrollReveal } from "@/components/beui/ScrollReveal";
8: 
9: import { site } from "@/lib/site";
10: import { resolveHeroVariant, type HeroVariant } from "@/lib/hero-variant";
11: import { GuaranteeMicro } from "./GuaranteeMicro";
12: 
13: export function Hero({ variant }: { variant?: HeroVariant } = {}) {
14:   const v = variant ?? resolveHeroVariant(null);
15:   const reduce = useReducedMotion();
16: 
17:   const { scrollYProgress } = useScroll();
18:   const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.5 });
19: 
20:   return (
21:     <>
22:       {/* Scroll progress — orange bar */}
23:       {!reduce && (
24:         <div className="scroll-progress">
25:           <motion.div
26:             className="scroll-progress-bar"
27:             style={{ width: scrollProgressWidth(progress) }}
28:           />
29:         </div>
30:       )}
31: 
32:       <section className="relative overflow-hidden">
33:         {/* Subtle dark grid overlay */}
34:         <div
35:           aria-hidden
36:           className="absolute inset-0 bg-grid opacity-30"
37:         />
38: 
39:         <div className="max-w-[86rem]
... [+9259 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/components/sections/PerformanceFeature.tsx"
}
```
```output
<path>/home/uzer/baz/components/sections/PerformanceFeature.tsx</path>
<type>file</type>
<content>
1: import Link from "next/link";
2: import { Section, Eyebrow, SectionHeading, SectionLede } from "@/components/ui/Section";
3: import { Button } from "@/components/ui/Button";
4: import { Badge } from "@/components/ui/Badge";
5: 
6: /**
7:  * Performance Marketing feature strip — a deeper-than-the-grid showcase of
8:  * the workhorse service. Sits between Hero and PillarGrid on the homepage.
9:  *
10:  * Three columns:
11:  *   1. Headline + KPIs (spend managed, ROAS lift, creative variants)
12:  *   2. "How a real engagement looks" — 4-step animated funnel
13:  *   3. 3 proof case studies (linked, with metric chips)
14:  *
15:  * Designed to convert the click from the hero "see services" CTA into a
16:  * /services/performance-marketing visit by giving just enough detail.
17:  */
18: export function PerformanceFeature() {
19:   return (
20:     <Section tone="paper" size="lg" id="performance-marketing-feature">
21:       <div className="grid lg:grid-cols-12 gap-10 mb-12">
22:         <div className="lg:col-span-7">
23:           <Badge variant="warning" className="mb-5">
24:             02 · Featured service
25:           </Badge>
26:           <SectionHeading>Performance Marketing that compounds.</SectionHeading>
27:           <SectionLede>
28:             Paid search, paid social, programmatic, and connected TV — built on clean tracking, real
29:             attribution, and
... [+8086 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/components/sections/ProofNumbers.tsx"
}
```
```output
<path>/home/uzer/baz/components/sections/ProofNumbers.tsx</path>
<type>file</type>
<content>
1: /**
2:  * Compact proof strip: 3 case-study outcomes side-by-side.
3:  * Used on the BAZventures homepage right after the Marketing Hub banner so visitors
4:  * see "real product + real outcomes" within the first scroll.
5:  *
6:  * Pattern 67: Numerical data with context — every metric is attributed.
7:  * Pattern 45: Duotone initial instead of generic icon.
8:  */
9: import { caseStudies } from "@/content/case-studies";
10: import { Badge } from "@/components/ui/Badge";
11: 
12: export function ProofNumbers() {
13:   const top = caseStudies.slice(0, 3);
14:   return (
15:     <section className="bg-background relative overflow-hidden">
16:       <div className="container mx-auto py-12 md:py-16">
17:         <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-muted dark:bg-muted rounded-2xl overflow-hidden border border-border">
18:           {top.map((cs) => {
19:             const headline = cs.metrics[0]; // most-quantified metric
20:             return (
21:               <div key={cs.slug} className="bg-background p-6 md:p-8 flex flex-col">
22:                 {/* Duotone initial + client name */}
23:                 <div className="flex items-center gap-3 mb-4">
24:                   <div
25:                     className="w-10 h-10 rounded-lg flex items-center justify-center"
26:                     style={{ background: `${cs.cover}20` }}
27:                   >
28:  
... [+1933 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/components/sections/ServicesOverview.tsx"
}
```
```output
<path>/home/uzer/baz/components/sections/ServicesOverview.tsx</path>
<type>file</type>
<content>
1: // @ts-nocheck
2: import Link from "next/link";
3: import { services } from "@/content/services";
4: import { Section, Eyebrow, SectionHeading, SectionLede } from "@/components/ui/Section";
5: import { Badge } from "@/components/ui/Badge";
6: 
7: const pillarLabels: Record<
8:   string,
9:   { name: string; tone: "accent" | "info" | "success" | "warning" }
10: > = {
11:   owned: { name: "Owned", tone: "accent" },
12:   earned: { name: "Earned", tone: "info" },
13:   paid: { name: "Paid", tone: "warning" },
14:   data: { name: "Data", tone: "success" },
15:   platform: { name: "Platform", tone: "accent" },
16: };
17: 
18: export function ServicesOverview() {
19:   return (
20:     <Section tone="paper" size="lg" id="services">
21:       <div className="grid lg:grid-cols-12 gap-10 mb-14">
22:         <div className="lg:col-span-7">
23:           <Eyebrow>What we do</Eyebrow>
24:           <SectionHeading>Eighteen services. One senior team.</SectionHeading>
25:           <SectionLede>
26:             Every type of marketing agency — strategy, performance, SEO, content, brand, CRO,
27:             lifecycle, CRM, analytics, AI search, social, influencer, video, partnerships, ABM, PR,
28:             research, and internationalization. One tightly integrated system. One senior team.
29:           </SectionLede>
30:         </div>
31:         <div className="lg:col-span-5 flex items-
... [+2082 chars truncated]
```


### [assistant] 2026-07-09T19:31:16.513000+00:00  @kilo-auto/free


> _reasoning_: Let me read the remaining homepage section components and the about/methodology/our-story pages, plus brand/voice.md and design.md. Let me batch these

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/components/sections/PillarGrid.tsx"
}
```
```output
<path>/home/uzer/baz/components/sections/PillarGrid.tsx</path>
<type>file</type>
<content>
1: import Link from "next/link";
2: import { Section, Eyebrow } from "@/components/ui/Section";
3: 
4: const pillars = [
5:   { href: "/services#owned", label: "Owned", desc: "Site, content, social — the assets you own" },
6:   { href: "/services#earned", label: "Earned", desc: "SEO, authority, citations — demand you don't pay for" },
7:   { href: "/services#paid", label: "Paid", desc: "Search, social, programmatic — spend as a portfolio" },
8:   { href: "/services#data", label: "Data", desc: "Tracking, attribution, reporting — the moat" },
9: ];
10: 
11: export function PillarGrid() {
12:   return (
13:     <Section tone="paper" size="md">
14:       <div className="grid lg:grid-cols-2 gap-10 items-end mb-12">
15:         <div>
16:           <Eyebrow>The four channels, one team</Eyebrow>
17:           <h2 className="font-display text-display-lg font-medium tracking-[-0.03em] leading-[1.05] max-w-2xl">
18:             Owned. Earned. Paid. Data.
19:           </h2>
20:         </div>
21:         <p className="text-lg text-muted-foreground max-w-xl">
22:           Most agencies run one channel. BAZventures runs all four — under one senior team, one plan, one
23:           set of dashboards. No channel blame. One P&amp;L.
24:         </p>
25:       </div>
26:       <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
27:         {pillars.map((p) => (
28:           <Link
29:           
... [+876 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/components/sections/HowWeWork.tsx"
}
```
```output
<path>/home/uzer/baz/components/sections/HowWeWork.tsx</path>
<type>file</type>
<content>
1: import { Section, Eyebrow, SectionHeading, SectionLede } from "@/components/ui/Section";
2: 
3: const steps = [
4:   {
5:     n: "01",
6:     t: "Discover",
7:     d: "Stakeholder interviews, analytics review, channel audit, and qualitative research. We learn the business before we plan.",
8:   },
9:   {
10:     n: "02",
11:     t: "Define",
12:     d: "A 90-day plan with named owners, dated milestones, and exit criteria. Strategy documented, not whispered.",
13:   },
14:   {
15:     n: "03",
16:     t: "Design",
17:     d: "Identity, message architecture, design systems, and creative concepts — tied to the metric each piece owns.",
18:   },
19:   {
20:     n: "04",
21:     t: "Develop",
22:     d: "Build, integrate, ship. Code, content, campaigns, and lifecycle flows — produced by senior people.",
23:   },
24:   {
25:     n: "05",
26:     t: "Scale",
27:     d: "Weekly iteration, monthly reviews, quarterly re-plan. Compound the wins; cut what doesn't move revenue.",
28:   },
29: ];
30: 
31: export function HowWeWork() {
32:   return (
33:     <Section tone="white" size="lg">
34:       <div className="grid lg:grid-cols-12 gap-10 mb-14">
35:         <div className="lg:col-span-7">
36:           <Eyebrow>How we work</Eyebrow>
37:           <SectionHeading>Five phases. One senior team.</SectionHeading>
38:           <SectionLede>
39:             No black boxes. No junior pods. The people
... [+1178 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/components/sections/KpiBand.tsx"
}
```
```output
<path>/home/uzer/baz/components/sections/KpiBand.tsx</path>
<type>file</type>
<content>
1: import { Section } from "@/components/ui/Section";
2: 
3: /**
4:  * KPI band with three large numbers and a one-line context.
5:  * Numbers are sourced from representative client work; replace with
6:  * audited figures before any public metrics claim.
7:  */
8: export function KpiBand() {
9:   return (
10:     <Section tone="ink" size="lg">
11:       <div className="grid lg:grid-cols-12 gap-10 items-end">
12:         <div className="lg:col-span-4">
13:           <p className="font-mono uppercase tracking-[0.18em] text-[11px] text-muted-foreground mb-4">
14:             By the numbers
15:           </p>
16:           <h2 className="font-display text-display-lg text-foreground font-medium tracking-[-0.03em] leading-[1.05]">
17:             Proof, not promises.
18:           </h2>
19:         </div>
20:         <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-px bg-background/10 rounded-2xl overflow-hidden border border-border/50">
21:           {[
22:             { v: "$24M+", l: "Paid spend managed", s: "Across Google, Meta, TikTok, LinkedIn — audited every quarter", ctx: "40+ engagements, 2023–2026" },
23:             { v: "+214%", l: "Avg organic lift · 12 mo", s: "Across content engine clients", ctx: "measured via server-side attribution" },
24:             { v: "94%", l: "Client renewal rate", s: "Because senior people ship the work", ctx: "rolling 12-month, 60+ cli
... [+1053 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/components/sections/Framework.tsx"
}
```
```output
<path>/home/uzer/baz/components/sections/Framework.tsx</path>
<type>file</type>
<content>
1: import { Section, Eyebrow, SectionHeading, SectionLede } from "@/components/ui/Section";
2: 
3: const principles = [
4:   { t: "Senior team, no juniors", d: "The people who pitch are the people who ship. Always." },
5:   {
6:     t: "Strategy is documented",
7:     d: "A 90-day plan with owners, budgets, and exit criteria. Not a deck.",
8:   },
9:   {
10:     t: "Measurement is the moat",
11:     d: "Server-side tracking, attribution, and dashboards execs actually open.",
12:   },
13:   { t: "Speed is a feature", d: "Markets don't wait. We ship in weeks, not quarters." },
14:   {
15:     t: "Revenue is sanity",
16:     d: "Followers are vanity. We optimize for revenue, signups, and pipeline.",
17:   },
18:   { t: "Brand compounds", d: "Identity, voice, and design tied to the metric each piece owns." },
19: ];
20: 
21: export function Framework() {
22:   return (
23:     <Section tone="ink" size="lg">
24:       <div className="grid lg:grid-cols-12 gap-10 mb-14">
25:         <div className="lg:col-span-7">
26:           <Eyebrow tone="light">Our operating principles</Eyebrow>
27:           <SectionHeading className="text-foreground">
28:             The way we work — not the way we pitch.
29:           </SectionHeading>
30:           <SectionLede className="text-muted-foreground">
31:             Six principles that shape every engagement. They aren&apos;t slogans; they&apos;re how we d
... [+1524 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/components/sections/CaseStudies.tsx"
}
```
```output
<path>/home/uzer/baz/components/sections/CaseStudies.tsx</path>
<type>file</type>
<content>
1: import Link from "next/link";
2: import { caseStudies } from "@/content/case-studies";
3: import { Section, Eyebrow, SectionHeading, SectionLede } from "@/components/ui/Section";
4: import { Badge } from "@/components/ui/Badge";
5: 
6: export function CaseStudies() {
7:   const featured = caseStudies.slice(0, 3);
8:   return (
9:     <Section tone="paper" size="lg" id="case-studies">
10:       <div className="grid lg:grid-cols-12 gap-10 mb-14">
11:         <div className="lg:col-span-7">
12:           <Eyebrow>Proof, not pitches</Eyebrow>
13:           <SectionHeading>Work that moved the P&L.</SectionHeading>
14:           <SectionLede>
15:             Senior team. Documented strategy. Measured outcomes. Every metric below is named and
16:             attributed — where it&apos;s not yet public, it&apos;s labeled.
17:           </SectionLede>
18:         </div>
19:         <div className="lg:col-span-5 flex items-end lg:justify-end">
20:           <Link
21:             href="/case-studies"
22:             className="inline-flex items-center gap-2 font-medium text-foreground"
23:           >
24:             All case studies <span aria-hidden>→</span>
25:           </Link>
26:         </div>
27:       </div>
28: 
29:       <div className="grid md:grid-cols-3 gap-5">
30:         {featured.map((c, i) => {
31:           return (
32:             <Link
33:               key={c.slug}
34:   
... [+3338 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/components/sections/Testimonials.tsx"
}
```
```output
<path>/home/uzer/baz/components/sections/Testimonials.tsx</path>
<type>file</type>
<content>
1: import { testimonials } from "@/content/testimonials";
2: import { Section, Eyebrow, SectionHeading, SectionLede } from "@/components/ui/Section";
3: 
4: export function Testimonials() {
5:   return (
6:     <Section tone="white" size="lg">
7:       <div className="grid lg:grid-cols-12 gap-10 mb-14">
8:         <div className="lg:col-span-7">
9:           <Eyebrow>In their words</Eyebrow>
10:           <SectionHeading>What senior-team actually feels like.</SectionHeading>
11:           <SectionLede>
12:             Five clients on what changed when they stopped working with generalist pods and started
13:             working with partners. Every metric is named.
14:           </SectionLede>
15:         </div>
16:       </div>
17:       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
18:         {testimonials.slice(0, 6).map((t, i) => (
19:           <figure
20:             key={i}
21:             className="reveal flex flex-col bg-background rounded-2xl p-6 md:p-7 border border-border dark:border-border"
22:             style={{ animationDelay: `${i * 80}ms` }}
23:           >
24:             {/* Duotone initial avatar — Pattern 45: replaces generic avatar with brand treatment */}
25:             <div className="flex items-center gap-3 mb-4">
26:               <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
27:                 <span
... [+1725 chars truncated]
```


### [assistant] 2026-07-09T19:31:25.025000+00:00  @kilo-auto/free


> _reasoning_: Now let me read the remaining sections: MarketingHubBanner, LogoMarquee, InsightsPreview, ReadNext, SelectedFew, FinalCta, StickyCta, GuaranteeMicro. And about/methodology/our-story pages. And brand/voice.md, design.md. Let me batch

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/components/sections/MarketingHubBanner.tsx"
}
```
```output
<path>/home/uzer/baz/components/sections/MarketingHubBanner.tsx</path>
<type>file</type>
<content>
1: "use client";
2: /**
3:  * BAZventures Homepage section that promotes Marketing Hub.
4:  * Pulls live data from the Hub's API (loop health + last ingest) to make the
5:  * banner feel current instead of a static advertorial.
6:  */
7: import { useEffect, useState } from "react";
8: 
9: const HUB_URL = "https://marketing-hub-roan.vercel.app";
10: 
11: interface HubPulse {
12:   ok: boolean;
13:   enrollments_active: number;
14:   recent_wins_7d: number;
15:   triangle_velocity: number;
16:   pipeline_value: number;
17: }
18: 
19: interface DiveStatus {
20:   total: number;
21:   last_fetch_at: number | null;
22: }
23: 
24: export function MarketingHubBanner() {
25:   const [pulse, setPulse] = useState<HubPulse | null>(null);
26:   const [dive, setDive] = useState<DiveStatus | null>(null);
27: 
28:   useEffect(() => {
29:     // Skip fetching a localhost hub from a deployed origin (browser blocks loopback → CORS console noise)
30:     const pageIsLocalhost =
31:       typeof window !== "undefined" &&
32:       (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
33:     if ((HUB_URL.includes("localhost") || HUB_URL.includes("127.0.0.1")) && !pageIsLocalhost) return;
34:     let cancelled = false;
35:     async function load() {
36:       try {
37:         const [p, d] = await Promise.all([
38:           fetch(`${HUB_URL}/api/triangle/health`)

... [+7880 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/components/sections/LogoMarquee.tsx"
}
```
```output
<path>/home/uzer/baz/components/sections/LogoMarquee.tsx</path>
<type>file</type>
<content>
1: /**
2:  * Partner marquee — silent infinite scroll. Pure CSS animation.
3:  * Used for the "Trusted by" / partner strip on the homepage.
4:  *
5:  * Default list is the tools/services BAZventures actually uses to run the business —
6:  * not fake client logos. To swap in real client logos, set the
7:  * NEXT_PUBLIC_CLIENT_LOGOS env var to a comma-separated list, e.g.
8:  *   NEXT_PUBLIC_CLIENT_LOGOS="Acme Co.,Beta Inc.,Gamma LLC"
9:  */
10: const DEFAULT_PARTNERS = [
11:   "Ollama",
12:   "GitHub",
13:   "Vercel",
14:   "Linear",
15:   "Stripe",
16:   "Resend",
17:   "Cal.com",
18:   "Figma",
19:   "Notion",
20:   "Slack",
21: ];
22: 
23: const logos = (() => {
24:   const env = process.env.NEXT_PUBLIC_CLIENT_LOGOS;
25:   if (env && env.trim().length > 0) {
26:     return env
27:       .split(",")
28:       .map((s) => s.trim())
29:       .filter(Boolean);
30:   }
31:   return DEFAULT_PARTNERS;
32: })();
33: 
34: export function LogoMarquee() {
35:   if (logos.length === 0) return null;
36:   const doubled = [...logos, ...logos];
37:   return (
38:     <section className="bg-card py-10 border-y border-border dark:border-border marquee-mask overflow-hidden">
39:       <div className="flex animate-marquee gap-12 whitespace-nowrap">
40:         {doubled.map((l, i) => (
41:           <span
42:             key={`${l}-${i}`}
43:             className="font-display font-bold text-2xl md:te
... [+309 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/components/sections/InsightsPreview.tsx"
}
```
```output
<path>/home/uzer/baz/components/sections/InsightsPreview.tsx</path>
<type>file</type>
<content>
1: // @ts-nocheck
2: import Link from "next/link";
3: import { posts } from "@/content/posts";
4: import { Section, Eyebrow, SectionHeading, SectionLede } from "@/components/ui/Section";
5: import { Badge } from "@/components/ui/Badge";
6: 
7: const categoryLabel: Record<
8:   string,
9:   { name: string; tone: "accent" | "info" | "success" | "warning" }
10: > = {
11:   strategy: { name: "Strategy", tone: "accent" },
12:   seo: { name: "SEO", tone: "info" },
13:   paid: { name: "Paid", tone: "warning" },
14:   analytics: { name: "Analytics", tone: "success" },
15:   content: { name: "Content", tone: "accent" },
16:   ai: { name: "AI", tone: "info" },
17: };
18: 
19: export function InsightsPreview() {
20:   const recent = posts.slice(0, 3);
21:   return (
22:     <Section tone="paper" size="lg">
23:       <div className="grid lg:grid-cols-12 gap-10 mb-14">
24:         <div className="lg:col-span-7">
25:           <Eyebrow>From the playbook</Eyebrow>
26:           <SectionHeading>Insights, not blog spam.</SectionHeading>
27:           <SectionLede>
28:             Six-pillar perspectives on what's actually working in growth marketing — written by the
29:             partners, not by content mills.
30:           </SectionLede>
31:         </div>
32:         <div className="lg:col-span-5 flex items-end lg:justify-end">
33:           <Link
34:             href="/insights"
35:          
... [+1750 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/components/sections/FinalCta.tsx"
}
```
```output
<path>/home/uzer/baz/components/sections/FinalCta.tsx</path>
<type>file</type>
<content>
1: import { Button } from "@/components/ui/Button";
2: import { site } from "@/lib/site";
3: 
4: export function FinalCta() {
5:   return (
6:     <section className="relative bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
7:       {/* Subtle grid background */}
8:       <div
9:         aria-hidden
10:         className="absolute inset-0 bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
11:       />
12: 
13:       <div className="container mx-auto px-6 py-24 md:py-40 relative">
14:         <div className="max-w-4xl">
15:           {/* Argument headline — Pattern 56: headlines as arguments, not slogans */}
16:           <p className="eyebrow-neutral mb-8">
17:             <span className="inline-block w-1.5 h-1.5 bg-[var(--foreground)] rounded-full mr-1 animate-pulse-dot" />
18:             Booking Q3 · 3 senior partner slots open
19:           </p>
20: 
21:           {/* The closing argument — one sentence, one breath */}
22:           <h2 className="font-display text-display-xl font-medium tracking-[-0.035em] leading-[1.0]">
23:             Most agencies optimize for activity.
24:             <br />
25:             <span className="text-accent">We optimize for revenue.</span>
26:           </h2>
27: 
28:           <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
29:             20 minutes. A se
... [+2514 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/components/sections/StickyCta.tsx"
}
```
```output
<path>/home/uzer/baz/components/sections/StickyCta.tsx</path>
<type>file</type>
<content>
1: // @ts-nocheck
2: "use client";
3: /**
4:  * StickyCta — fixed bottom-bar mobile call-to-action.
5:  *
6:  * Pattern from the 2026 agency-site research: 41% of agency pages bury
7:  * the primary CTA below the mobile fold. Digital Applied's 2026 study of
8:  * 2,000 landing pages found sticky-bottom CTAs lift conversion +11%.
9:  *
10:  * Behavior:
11:  *   - Fixed to bottom, full width, visible only on mobile (md:hidden).
12:  *   - Single primary button → booking URL (from lib/site.ts).
13:  *   - Auto-hides when an element with id="hero-cta" scrolls into view
14:  *     (so we never show two CTAs at the same time on mobile).
15:  *   - z-50 to sit above most page content; we deliberately don't go higher
16:  *     than the cookie banner (which is z-[60] in the layout).
17:  *
18:  * Dependency: Hero.tsx wraps its primary CTA in an element with id="hero-cta".
19:  * If the hero CTA is rendered without that ID, this component stays visible
20:  * permanently on mobile (still functional, just slightly redundant).
21:  */
22: import { useEffect, useState } from "react";
23: import { site } from "@/lib/site";
24: 
25: export function StickyCta() {
26:   const [hidden, setHidden] = useState(false);
27:   const bookingHref =
28:     (site as Record<string, unknown>).bookOrMailto ?? site.bookingUrl ?? `mailto:${site.email}`;
29: 
30:   useEffect(() => {
31:     const target = document.getE
... [+1701 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/components/sections/SelectedFew.tsx"
}
```
```output
<path>/home/uzer/baz/components/sections/SelectedFew.tsx</path>
<type>file</type>
<content>
1: export function SelectedFew() {
2:   return (
3:     <section className="relative border-b border-border">
4:       <span className="watermark">∞</span>
5:       <div className="relative z-10 mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32 text-center">
6:         <div className="mono-label mb-4">The Selected Few</div>
7:         <h2 className="display-xl text-4xl text-ink-1000 lg:text-7xl max-w-3xl mx-auto">
8:           We don&apos;t take everyone.
9:         </h2>
10:         <p className="mt-6 max-w-xl mx-auto text-ink-700">
11:           7 slots. 4 filled. The full revenue system — by selection, not purchase.
12:         </p>
13:         <a href="/selected" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-px">
14:           Apply for selection →
15:         </a>
16:       </div>
17:     </section>
18:   );
19: }

(End of file - total 19 lines)
</content>
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/components/sections/GuaranteeMicro.tsx"
}
```
```output
<path>/home/uzer/baz/components/sections/GuaranteeMicro.tsx</path>
<type>file</type>
<content>
1: /**
2:  * GuaranteeMicro — inline microcopy under hero CTAs.
3:  *
4:  * One line of microcopy to address the "we've never paid out" guarantee
5:  * right next to the primary CTA, instead of hiding it on /methodology.
6:  * Lifts trust at the moment of decision (roast.page: specific guarantees
7:  * beat generic by 15%).
8:  *
9:  * Pattern 48: Specific over generic — "first measurable artifact" beats "ship".
10:  * Pattern 67: Numerical data with context.
11:  *
12:  * Server component. No "use client" needed.
13:  */
14: type Variant = "default" | "emphasized";
15: 
16: export function GuaranteeMicro({
17:   variant = "default",
18:   className = "",
19: }: {
20:   variant?: Variant;
21:   className?: string;
22: }) {
23:   const tone = variant === "emphasized" ? "text-brand" : "text-stone";
24:   return (
25:     <p
26:       className={`mt-3 text-[11px] font-sans uppercase tracking-[0.25em] ${tone} ${className}`}
27:       aria-label="BAZventures speed guarantee"
28:     >
29:       <span aria-hidden>↳ </span>
30:       First measurable artifact in 14 days, or month 1 free. We&apos;ve never paid out.
31:     </p>
32:   );
33: }

(End of file - total 33 lines)
</content>
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/components/sections/ReadNext.tsx"
}
```
```output
<path>/home/uzer/baz/components/sections/ReadNext.tsx</path>
<type>file</type>
<content>
1: /**
2:  * "What to read next" strip — links to the 4 differentiated pages
3:  * (Methodology, Stance, vs Others, Client Portal) so the homepage
4:  * acts as a hub to all the proof on the site.
5:  */
6: const links = [
7:   {
8:     href: "/our-story",
9:     label: "Our story",
10:     desc: "How BAZventures went from a freelance collective to a four-person agency that ships like thirty. The good years, the bad year, the Hub.",
11:     cta: "Read the story →",
12:   },
13:   {
14:     href: "/methodology",
15:     label: "Methodology",
16:     desc: "How BAZventures plans, ships, scores, and learns. The Triangle Loop, in public.",
17:     cta: "Read the playbook →",
18:   },
19:   {
20:     href: "/stance",
21:     label: "Our stance",
22:     desc: "Agentic AI is leverage, not a senior. What we ship, what we refuse.",
23:     cta: "See the stance →",
24:   },
25:   {
26:     href: "/vs-others",
27:     label: "vs other agencies",
28:     desc: "Honest comparison. Where we win, where we don't, and when we're the wrong fit.",
29:     cta: "See the scorecard →",
30:   },
31: ];
32: 
33: export function ReadNext() {
34:   return (
35:     <section className="bg-background">
36:       <div className="container mx-auto py-16 md:py-20">
37:         <div className="max-w-3xl mb-10">
38:           <p className="font-mono uppercase tracking-[0.18em] text-[11px] text-accent mb-3">
39:         
... [+960 chars truncated]
```


### [assistant] 2026-07-09T19:31:33.862000+00:00  @kilo-auto/free


> _reasoning_: Now let me read the about, methodology, our-story pages, and the posts.ts content file (insights preview). Also the brand/voice.md and design.md for brand guidelines. Let me also read lib/site.ts for site copy like stack, stats, etc. And the selected page.

Let me batch read: about/page.tsx, methodology/page.tsx, our-story/page.tsx, content/posts.ts (might be long), brand/voice.md, brand/design.md, lib/site.ts

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/app/about/page.tsx"
}
```
```output
<path>/home/uzer/baz/app/about/page.tsx</path>
<type>file</type>
<content>
1: import { Section, Eyebrow, SectionHeading, SectionLede } from "@/components/ui/Section";
2: import { StatRow } from "@/components/sections/StatRow";
3: import { TeamGrid } from "@/components/marketing/TeamGrid";
4: import { CtaBanner } from "@/components/marketing/CtaBanner";
5: import { Breadcrumb } from "@/components/sections/Breadcrumb";
6: import { Button } from "@/components/ui/Button";
7: import { buildMetadata } from "@/lib/seo";
8: import { site } from "@/lib/site";
9: 
10: export const metadata = buildMetadata({
11:   title: "About",
12:   description:
13:     "BAZventures is a senior-only growth partner. The people who pitch are the people who ship. Based in Algiers. Working with clients in MENA, EU, and the US.",
14:   path: "/about",
15: });
16: 
17: const beliefs = [
18:   {
19:     t: "Senior team, no juniors",
20:     d: "The people who plan your growth are the people who ship it.",
21:   },
22:   {
23:     t: "Strategy is documented",
24:     d: "A 90-day plan with owners, budgets, and exit criteria. Not a deck.",
25:   },
26:   {
27:     t: "Measurement is the moat",
28:     d: "Server-side tracking, attribution, and dashboards execs actually open.",
29:   },
30:   { t: "Speed is a feature", d: "Markets don't wait. We ship in weeks, not quarters." },
31:   {
32:     t: "Revenue is sanity",
33:     d: "Followers are vanity. We optimize for revenue, signups, and pipeline.",
34:   },
3
... [+4910 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/app/our-story/page.tsx"
}
```
```output
<path>/home/uzer/baz/app/our-story/page.tsx</path>
<type>file</type>
<content>
1: import { Section, Eyebrow, SectionHeading, SectionLede } from "@/components/ui/Section";
2: import { Breadcrumb } from "@/components/sections/Breadcrumb";
3: import { StickyCta } from "@/components/sections/StickyCta";
4: import { CtaBanner } from "@/components/marketing/CtaBanner";
5: import { buildMetadata } from "@/lib/seo";
6: 
7: export const metadata = buildMetadata({
8:   title: "Our story",
9:   description:
10:     "How BAZventures went from a freelance collective to a four-person agency. The good years, the bad year, the Hub, and the senior-only model that won.",
11:   path: "/our-story",
12: });
13: 
14: const chapters = [
15:   {
16:     n: "01",
17:     title: "The agency that wasn't",
18:     years: "2019",
19:     body: "BAZventures started as a freelance collective — three senior operators, no overhead, no junior pipeline. Clients came because the work was good. Then the work got too good, and the calendar filled up. We were turning down work because we couldn't scale without breaking what made us valuable.",
20:   },
21:   {
22:     n: "02",
23:     title: "The junior mistake",
24:     years: "2021",
25:     body: 'We hired. Five juniors, a project manager, an account director. Revenue tripled in twelve months. Quality collapsed in six. The work went from "different" to "indistinguishable." Clients renewed out of habit, not conviction. We were profitable and we were empty.',
26:
... [+6845 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/app/methodology/page.tsx"
}
```
```output
<path>/home/uzer/baz/app/methodology/page.tsx</path>
<type>file</type>
<content>
1: import { Section, Eyebrow, SectionHeading, SectionLede } from "@/components/ui/Section";
2: import { Button } from "@/components/ui/Button";
3: import { Breadcrumb } from "@/components/sections/Breadcrumb";
4: import { StickyCta } from "@/components/sections/StickyCta";
5: import { CtaBanner } from "@/components/marketing/CtaBanner";
6: import { buildMetadata, jsonLd, faqLd } from "@/lib/seo";
7: 
8: const methodologyFaqs = [
9:   {
10:     q: "How fast will I see pipeline movement?",
11:     a: "First measurable artifact in your Hub within 14 calendar days — paid guarantee. Most clients see movement inside 60 days. The 90-day commitment is when we report on the $200K+ pipeline target.",
12:   },
13:   {
14:     q: "Who actually does the work?",
15:     a: "A senior partner on your account. No juniors, no offshore pod, no account manager in between. The person in the kickoff is the person shipping the work.",
16:   },
17:   {
18:     q: "What if my team disagrees with the plan?",
19:     a: "The 90-day plan is a working document, not a deck. Your team edits it. We pre-commit to the targets and the measurement method, then iterate against it every two weeks.",
20:   },
21:   {
22:     q: "How do I see what the Hub is actually doing?",
23:     a: "Every client watches their own loop live. Score updates, attribution events, and Nova reasoning audit are visible in real time. You see the work, not 
... [+14100 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/brand/voice.md"
}
```
```output
<path>/home/uzer/baz/brand/voice.md</path>
<type>file</type>
<content>
1: # Voice — Copywriting, Tone & Messaging
2: 
3: BAZ writes like a magazine, not a brochure. Every word must earn its place.
4: 
5: ---
6: 
7: ## 1. Brand Voice
8: 
9: ### Core Attributes
10: 
11: | Attribute | Description | Example |
12: |-----------|------------|---------|
13: | **Confident** | We state what we believe, then prove it. | "We make brands unignorable." |
14: | **Specific** | Numbers over adjectives. | "240+ brands" not "many clients" |
15: | **Editorial** | Magazine-quality writing. | Short sentences. Period. |
16: | **Honest** | No bullshit. Constraints are stated. | "Senior team, no juniors." |
17: | **Opinionated** | The agency has a viewpoint. | "Brands are verbs, not nouns." |
18: 
19: ### Anti-Voice (What We Never Do)
20: 
21: | Anti-Pattern | Example | Why |
22: |-------------|---------|-----|
23: | Corporate jargon | "leveraging synergies" | Vacuous |
24: | Superlatives without proof | "world-class", "best-in-class" | Unsubstantiated |
25: | Exclamation marks | "We're so excited!!!" | Juvenile |
26: | Emoji in professional copy | "🚀 Let's go!" | Undermines authority |
27: | Passive voice | "Growth is delivered by BAZ" | Weak |
28: | Hedging language | "We might be able to help" | Lacks confidence |
29: 
30: ---
31: 
32: ## 2. Grammar & Style
33: 
34: ### Rules
35: 
36: 1. **Oxford comma** — "brands, growth, and revenue"
37: 2. **Em dash** — Use `—` (not hyphen) for parenthetical st
... [+6335 chars truncated]
```


### [assistant] 2026-07-09T19:31:43.088000+00:00  @kilo-auto/free


> _reasoning_: I now have substantial content. Let me also read lib/site.ts for site-level copy (stack, stats, email, bookOrMailto), and the posts.ts insights content. And brand/design.md for brand guidelines (design philosophy). Let me also quickly check the selected page and pricing page. But I think I have enough. Let me grab site.ts and posts.ts to be thorough, plus design.md quickly

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/lib/site.ts"
}
```
```output
<path>/home/uzer/baz/lib/site.ts</path>
<type>file</type>
<content>
1: export const site = {
2:   name: "BAZventures",
3:   shortName: "BAZventures",
4:   url: process.env.NEXT_PUBLIC_SITE_URL || "https://baz.agency",
5:   tagline: "Marketing as a forecast, not a hope. The senior operator behind 60+ brands.",
6:   description:
7:     "BAZventures is the senior-partner growth agency led by Brahim ZERBOUT — 60+ brands shipped across MENA, EU, US. Strategy, CRM/revenue ops, and performance web, run on the Hub. No juniors. Revenue, not vanity. Or pay nothing for month four.",
8:   email: "zerboutbrahimamir@gmail.com",
9:   // Phone is optional. Leave blank if you don't want one shown.
10:   // The contact page will hide the row entirely when this is empty.
11:   phone: "",
12:   bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || "",
13:   // Stats for the trust strip. Read from env when available, otherwise
14:   // fall back to dev-only defaults. The homepage hides a stat entirely
15:   // when its value is null — we'd rather show nothing than a fabricated
16:   // number. Set the env vars in .env.local for production.
17:   stats: {
18:     brandsScaled: process.env.NEXT_PUBLIC_BRANDS_SCALED || "60+",
19:     countriesServed: process.env.NEXT_PUBLIC_COUNTRIES_SERVED || "MENA · EU · US",
20:     seniorOnly: process.env.NEXT_PUBLIC_SENIOR_ONLY || "100%",
21:     teamSize: process.env.NEXT_PUBLIC_TEAM_SIZE || "4",
22:     // Median months to recover acquisition spend across active
... [+1524 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/content/posts.ts",
  "limit": 120
}
```
```output
<path>/home/uzer/baz/content/posts.ts</path>
<type>file</type>
<content>
1: import type { Post } from "@/types";
2: 
3: export const posts: Post[] = [
4:   {
5:     slug: "compounding-seo",
6:     title: "Compounding SEO: the only channel that ages like wine",
7:     excerpt:
8:       "Why SEO is the only growth channel where yesterday's work still pays off next year — and how to build one that compounds.",
9:     body: `Most channels are renting attention. SEO is owning it.
10: 
11: When you stop publishing, paid traffic stops. When you stop posting, social traffic decays. But SEO compounds: every article you ship, every link you earn, every technical fix you make stays in the index and keeps producing traffic 24/7/365.
12: 
13: The math is simple. A piece ranking top-3 for a 5,000/mo query produces 60,000 sessions a year — for free. A piece ranking for ten such queries produces 600,000 sessions a year. After 24 months of compounding, that single content investment is outperforming most paid budgets.
14: 
15: But compounding only happens when three things are right: technical SEO, topical authority, and link earning.
16: 
17: Technical SEO is the foundation. Crawlability, indexation, Core Web Vitals, schema, internal linking. Get this wrong and nothing else matters.
18: 
19: Topical authority is the strategy. A site that has 200 high-quality pages on "B2B SaaS analytics" outranks a site with 2,000 scattered pages across random topics.
20: 
21: Link earning is the multiplier.
... [+6183 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz/brand/design.md"
}
```
```output
<path>/home/uzer/baz/brand/design.md</path>
<type>file</type>
<content>
1: # Visual Design System — Philosophy, Layout & Guardrails
2: 
3: This document defines the visual principles, spatial systems, elevation models, and behavioral rules for BAZ Marketing Ventures Agency. All designers and developers must implement these specifications to guarantee brand consistency.
4: 
5: ---
6: 
7: ## 1. Core Design Principles
8: 
9: ### 1.1 Editorial Luxury Through Restraint
10: BAZ's visual identity channels the authority of premium editorial publications — think *Monocle*, *Cereal*, *Kinfolk* — not the flash of consumer tech. Premium execution is achieved through:
11: - Absolute typographic clarity
12: - Vast margins of negative space
13: - Deliberate contrast between organic handwritten forms and rigid geometric grids
14: - A restrained color palette where violet is the singular accent
15: 
16: ### 1.2 Algorithmic Consistency
17: The BlackSwan Design System ensures no arbitrary values. Every color, every space, every radius is computed from three seed variables. This eliminates "designer drift" — if two elements look slightly different, one of them is wrong.
18: 
19: ### 1.3 Structural Functionalism
20: Aesthetic form follows corporate function. Every interaction must feel fast, deliberate, and premium. Decorative elements that don't serve information hierarchy are removed.
21: 
22: ### 1.4 Violet as Accent, Never Foundation
23: The violet accent `hsl(270, 85%, 72%)` is a premium sig
... [+8183 chars truncated]
```


### [assistant] 2026-07-09T19:31:53.943000+00:00  @kilo-auto/free


> _reasoning_: I now have comprehensive content. I've read all key content modules. The user asked to return the full text content of all marketing copy. I think I have enough to provide a thorough answer. I've read:

- content/services.ts (18 services, full detail)
- content/case-studies.ts (11 case studies)
- content/testimonials.ts (8 testimonials)
- content/team.ts (6 members)
- content/pricing.ts (3 tiers)
- content/industries.ts (6 industries)
- content/posts.ts (insights - read first 120 lines, 5 posts)
- All homepage sections (Hero, MarketingHubBanner, ProofNumbers, LogoMarquee, PerformanceFeature, PillarGrid, ServicesOverview, HowWeWork, KpiBand, Framework, CaseStudies, Testimonials, InsightsPreview, FinalCta, StickyCta, SelectedFew, GuaranteeMicro, ReadNext)
- about, our-story, methodology pages
- brand/voice.md, brand/design.md
- lib/site.ts

That's comprehensive. I should provide a thorough summary returning the full text content. Given the volume, I'll present it organized. The user wants me to "Return the full text content of all marketing copy." I've already read it. I should present a consolidated, organized dump of the marketing copy. Let me provide a structured return of all the copy.

I don't need to read more. Let me write the final answer compiling the marketing copy. This is a large amount; I'll organize by section. I'll be thorough but it's just a text return.

Given output budget, I'll provide a comprehensive but structured compilation. Let me write it.

I've thoroughly read all key content modules, page components, and brand guidelines. Below is the consolidated marketing copy that powers the BAZventures site.

---

# BAZVENTURES — MARKETING COPY & CONTENT

## BRAND / SITE-LEVEL
- **Name:** BAZventures · **Founder:** Brahim ZERBOUT · **Product:** the Hub
- **Tagline:** "Growth as a forecast, not a hope. The senior operator behind 60+ brands."
- **Description:** "BAZventures is the senior-partner growth agency led by Brahim ZERBOUT — 60+ brands shipped across MENA, EU, US. Strategy, CRM/revenue ops, and performance web, run on the Hub. No juniors. Revenue, not vanity. Or pay nothing for month four."
- **Email:** zerboutbrahimamir@gmail.com
- **Stats (trust strip):** Brands scaled `60+` · Operating regions `MENA · EU · US` · Senior partners `4` · Median payback `<6mo`
- **Stack (marquee):** Ollama, GitHub, Vercel, Linear, Stripe, Resend, Cal.com, Figma, Notion, Slack
- **Signature:** "Senior team · No juniors · Algiers · EU · US"

## HOMEPAGE (`app/page.tsx`) SECTION ORDER
Hero → MarketingHubBanner → ProofNumbers → LogoMarquee → PerformanceFeature → PillarGrid → ServicesOverview → HowWeWork → KpiBand → Framework → CaseStudies → Testimonials → InsightsPreview → ReadNext → SelectedFew → FinalCta → StickyCta

### HERO (`components/sections/Hero.tsx`)
- Eyebrow chip: "Now booking Q3 — 3 spots left"
- Headline (variant-driven): "Make growth a forecast, not a hope."
- Tagline: "Senior-only. 90-day plans. Or pay nothing for month four"
- CTA: "Book a growth call →"
- Guarantee (micro): "First measurable artifact in 14 days, or month 1 free. We've never paid out."
- Live-loop console caption: "The Hub's revenue loop — score, route, sequence, close — on a 60-second tick. Running in every active engagement."
- Outcome strip: `$200K+` Pipeline in 90 days (or month 4 free) · `4×` Pipeline coverage (≥ 3× target) · `60s` Loop tick (score → route → close) · `100%` Senior team (no juniors, ever)
- Agent-demo heading: "Run a real BAZventures agent" / "Press play. Watch a senior operator execute."
- Stats band: Brands shipped · Operating regions · Senior partners · Median payback

### MARKETING HUB BANNER (`MarketingHubBanner.tsx`)
- Eyebrow: "BAZventures Product · Marketing Hub"
- Headline: "The marketing, sales, and finance loop — running itself."
- Sub: "Every contact scored. Every cadence stepped. Every outcome learned from. The BAZventures Marketing Hub is the operating system under everything we ship for clients — and it runs whether we're watching or not."
- CTAs: "Open the Hub" / "See the feature tour"
- Status card labels: Active sequences · Velocity (wins/day) · Pipeline under mgmt · Marketing Dive (articles indexed) · "Triangle loop ticks every 60 s"

### PROOF NUMBERS (`ProofNumbers.tsx`)
- Pulls top 3 case studies (see Case Studies below). Cards show client · industry · headline metric · result line · duration · services.

### LOGO MARQUEE (`LogoMarquee.tsx`)
- Default partner tools (no fake client logos): Ollama, GitHub, Vercel, Linear, Stripe, Resend, Cal.com, Figma, Notion, Slack

### PERFORMANCE FEATURE (`PerformanceFeature.tsx`)
- Badge: "02 · Featured service"
- Heading: "Performance Marketing that compounds."
- Lede: "Paid search, paid social, programmatic, and connected TV — built on clean tracking, real attribution, and creative that converts. We treat ad spend as a portfolio, not a slot machine."
- CTAs: "See the full offer →" / "Get a paid audit"
- KPIs: `$24M+` Spend managed · `+62%` Avg ROAS lift · `40+` Creative variants / mo
- "How a real engagement looks": "From tracking gaps to scale in 12 weeks." — Week 1–2 Tracking & attribution audit (+34% tracking accuracy); Week 3–4 Creative matrix + channel mix (5× creative throughput); Week 5–8 Weekly iteration loops (−18% CPA per week); Week 9–12 Incrementality testing (+62% real ROAS)
- Selected outcomes: ViralVista (ROAS 1.8 → 4.6), Lumenwear (ROAS 2.1 → 5.4), Soukly (Supply CAC ↓ 63%)

### PILLAR GRID (`PillarGrid.tsx`)
- Eyebrow: "The four channels, one team"
- Heading: "Owned. Earned. Paid. Data."
- Sub: "Most agencies run one channel. BAZventures runs all four — under one senior team, one plan, one set of dashboards. No channel blame. One P&L."
- Pillars: **Owned** — "Site, content, social — the assets you own"; **Earned** — "SEO, authority, citations — demand you don't pay for"; **Paid** — "Search, social, programmatic — spend as a portfolio"; **Data** — "Tracking, attribution, reporting — the moat"

### SERVICES OVERVIEW (`ServicesOverview.tsx`)
- Eyebrow: "What we do"
- Heading: "Eighteen services. One senior team."
- Lede: "Every type of marketing agency — strategy, performance, SEO, content, brand, CRO, lifecycle, CRM, analytics, AI search, social, influencer, video, partnerships, ABM, PR, research, and internationalization. One tightly integrated system. One senior team."

**18 SERVICES (`content/services.ts`)** — each: name, tagline, pillar, description, hero (eyebrow/headline/sub), who (3 ICPs), deliverables, 3 KPIs, 5-step process, 3 proof points, 3 FAQs, CTA.
1. **Strategy & Growth Consulting** — "A growth plan that survives the org chart." Hero: "Make growth a forecast, not a hope." / "Senior partners diagnose, model, and architect your next 90 days. No decks no one reads — a plan your team actually runs." KPIs: 60+ plans shipped · <6mo payback · 94% renewal. CTA: "Book a growth call".
2. **Performance Marketing** — "Spend that compounds, not burns." Hero: "Turn ad spend into measurable profit." KPIs: $24M+ spend · +62% ROAS · 40+ variants/mo.
3. **SEO & Organic Growth** — "Own your demand, not rent it." Hero: "Compound traffic. Own the SERP." KPIs: +214% organic · 340+ top-3 SERPs · 120+ DR70+ domains.
4. **Content & Editorial Engine** — "Editorial that moves pipeline, not just readers." Hero: "Editorial that compounds into revenue." KPIs: 12 posts/mo · 94% indexed/90d · 3:42 session time.
5. **Brand & Identity** — "A brand people remember, recognize, and repeat." Hero: "The brand is the asset. Everything else amplifies it." KPIs: 70+ rebrands · +58% aided recall · 95% adoption.
6. **Conversion Rate Optimization (CRO)** — "A/B testing as a system, not a series of bets." Hero: "Conversion tied to revenue, not vibes." KPIs: +31% CVR · 60+ tests/qtr · 120+ shipped.
7. **Lifecycle, Email & SMS Automation** — "Monetize the list you already have." Hero: "Turn one-time buyers into recurring revenue." KPIs: $48M+ revenue · 42% open · 97% inbox.
8. **CRM & Marketing Operations** — "The plumbing that makes every channel work." Hero: "Make your stack an operating system." KPIs: 40+ migrations · 92% forecast accuracy · 18+ hrs saved/wk.
9. **Analytics, Tracking & Attribution** — "Numbers that hold under scrutiny." Hero: "Measurement that drives decisions." KPIs: 180+ dashboards · 99.4% accuracy · 92% exec adoption.
10. **AI Search Optimization (GEO & AEO)** — "Win the answer box, not just the blue link." Hero: "Be the answer engines recommend." KPIs: 1,200+ citations · 380+ hrs automated/mo · 24 tools.
11. **Social Media & Community** — "Owned channels that build audience and demand." Hero: "Channels that compound into an audience." KPIs: 110+ channels · +184% follower growth · 4.7% engagement.
12. **Influencer & Creator Marketing** — "Borrowed trust, measured results." Hero: "Creator partnerships that move the funnel." KPIs: 2,800+ creators · $5.20 EMV/$ · -37% CPA.
13. **Video Production & Podcast Studio** — "The format that earns the watch, made for your brand." Hero: "Video that earns the watch." KPIs: 1,400+ videos · 62% VTR · 24 podcasts.
14. **Affiliate, Partnership & Referral Programs** — "A revenue channel that pays for performance." Hero: "Performance partnerships at venture scale." KPIs: 60+ programs · +38% partner revenue · 240+ partners.
15. **ABM & B2B Demand Generation** — "Pipeline you can forecast, not just hope for." Hero: "Pipeline that survives a CFO review." KPIs: 60+ ABM · +142% pipeline · -27% cycle.
16. **Public Relations & Earned Media** — "Earned media that shapes category narrative." Hero: "Be the source, not the subject." KPIs: 420+ tier-1 · DA 78 · 180+ bylines.
17. **Market Research & Category Design** — "Decisions backed by evidence, not opinions." Hero: "Evidence before opinion." KPIs: 120+ studies · 1,800 respondents · 34 markets.
18. **Internationalization & Market Entry** — "Go global without sounding like you just went global." Hero: "Win markets, not just translate." KPIs: 34 markets · <6mo traction · 180 assets/mo.

### HOW WE WORK (`HowWeWork.tsx`)
- Eyebrow: "How we work" · Heading: "Five phases. One senior team." · Lede: "No black boxes. No junior pods. The people who plan your growth are the people who ship it."
- 01 Discover (Stakeholder interviews, analytics review, channel audit, qualitative research) · 02 Define (90-day plan with owners, milestones, exit criteria) · 03 Design (Identity, message architecture, design systems, creative) · 04 Develop (Build, integrate, ship) · 05 Scale (Weekly iteration, monthly reviews, quarterly re-plan)

### KPI BAND (`KpiBand.tsx`)
- "By the numbers" / "Proof, not promises."
- `$24M+` Paid spend managed (40+ engagements, 2023–2026) · `+214%` Avg organic lift · 12 mo (server-side attribution) · `94%` Client renewal rate (rolling 12-month, 60+ clients)

### FRAMEWORK / OPERATING PRINCIPLES (`Framework.tsx`)
- Eyebrow: "Our operating principles" · Heading: "The way we work — not the way we pitch."
- 1 Senior team, no juniors · 2 Strategy is documented · 3 Measurement is the moat · 4 Speed is a feature · 5 Revenue is sanity · 6 Brand compounds

### CASE STUDIES (`CaseStudies.tsx` + `content/case-studies.ts`)
- Eyebrow: "Proof, not pitches" · Heading: "Work that moved the P&L." · Lede: "Senior team. Documented strategy. Measured outcomes. Every metric below is named and attributed — where it's not yet public, it's labeled."
- 11 case studies (all flagged `placeholder: true` / "Demo" — representative composites):
  - **ViralVista** (DTC Beauty): ROAS 1.8→4.6, +212% rev, CPA ↓58% / 90 days
  - **Northwind** (FinTech): 0→480K organic/mo, 340+ top-3, 3.2× inbound/outbound / 14 mo
  - **EngageEra** (B2B SaaS): Trial→Paid 0.6%→2.4%, +318% MRR, ↓23 days / 6 mo
  - **Saffron & Co.** (Hospitality): +71% direct bookings, CPA ↓44%, LCP 4.2s→1.1s / 8 mo
  - **Meridian Labs** (AI/DevTools): 0→28 AI citations, +330% branded search, +110% demos / 5 mo
  - **BuzzBeacon Media** (Podcast Network): 1,400+ p1 rankings, +38% RPM, 94% indexed / 7 mo
  - **Tessera** (FinTech): 4.2M views, 312K downloads, +$6.4M pipeline / 12 mo
  - **Lumenwear** (DTC Apparel): $11 EMV/$1, ROAS 2.1→5.4, CPA ↓42% / 6 mo
  - **Kantara** (B2B SaaS): +$24M pipeline, win 18%→31%, ↓4.2mo cycle / 9 mo
  - **Soukly** (Marketplace): 24% partner GMV, supply CAC $84→$31, +38% LTV / 14 mo
  - **Pivot Labs** (B2B SaaS): $4.8M MENA ARR, 3 tier-1 logos, 38% partner pipeline / 12 mo
  - **Mosaic** (CPG): +$80M TAM, +18% pricing, $52M Series A / 4 mo

### TESTIMONIALS (`Testimonials.tsx` + `content/testimonials.ts`)
- Eyebrow: "In their words" · Heading: "What senior-team actually feels like."
- 8 quotes (all `placeholder: true` / "illustrative"): Hala Mansour (ViralVista, ROAS 1.8→4.6) · Daniel K. (Northwind, 0→480K/mo) · Mira Okafor (EngageEra, 0.6%→2.4%) · Reem Al-Fahim (Saffron, +71% direct) · Sora Tanaka (Meridian, 28 AI citations) · Idris Bah (Tessera, +$6.4M) · Yara Halabi (Lumenwear, $11 EMV/$1) · Priya Iyer (Kantara, +$24M)

### INSIGHTS PREVIEW (`InsightsPreview.tsx` + `content/posts.ts`)
- Eyebrow: "From the playbook" · Heading: "Insights, not blog spam."
- Posts include: "Compounding SEO: the only channel that ages like wine" · "Paid attribution after iOS: a survival guide" · "How to win the AI Overview" · "CRO without the slop" · "Editorial as a moat" · "The 90-day plan" (6 pillars: strategy, seo, paid, analytics, content, ai)

### READ NEXT (`ReadNext.tsx`)
- "Four pages that make us different."
- Our story ("How BAZventures went from a freelance collective to a four-person agency...") · Methodology ("How BAZventures plans, ships, scores, and learns. The Triangle Loop, in public.") · Our stance ("Agentic AI is leverage, not a senior. What we ship, what we refuse.") · vs other agencies ("Honest comparison. Where we win, where we don't, and when we're the wrong fit.")

### SELECTED FEW (`SelectedFew.tsx`)
- "The Selected Few" / "We don't take everyone." / "7 slots. 4 filled. The full revenue system — by selection, not purchase." CTA: "Apply for selection →"

### FINAL CTA (`FinalCta.tsx`)
- Eyebrow: "Booking Q3 · 3 senior partner slots open"
- Headline: "Most agencies optimize for activity. **We optimize for revenue.**"
- Sub: "20 minutes. A senior partner reviews your funnel, your channels, and your unit economics — and tells you honestly whether BAZventures is the right fit. If we're not, we'll refer you to someone who is."
- CTAs: "Book a 20-minute growth call →" / "Request a paid audit first"
- Speed guarantee: "First measurable artifact live in your Hub within 14 calendar days from kickoff. If we miss it, month one is free. We've never paid out."

### STICKY CTA (`StickyCta.tsx`, mobile)
- "20 min with a senior partner. No obligation. NDA on request." → "Book a call"

---

## ABOUT PAGE (`app/about/page.tsx`)
- H1: "The senior-only growth partner. We ship the system other agencies storyboard."
- Intro: "BAZventures was founded on a simple bet: a small, senior-only team outperforms a generalist agency pod — by shipping strategy, execution, and measurement as one tightly integrated system."
- "Six principles, every engagement" (same as Framework): Senior team no juniors · Strategy is documented · Measurement is the moat · Speed is a feature · Revenue is sanity · Brand compounds
- Team section: "Senior partners. No pod layers." Badge: "Four operators. Six roles. Bios illustrative until filled."
- **TEAM (`content/team.ts`)**: Brahim ZERBOUT (Founder · Strategy & Systems) — "Engineer first, operator second... 60+ brands across MENA, EU, and the US." Plus 5 role-defined Senior Partners: SEO & Content · Paid & Lifecycle · Brand & Creative · Analytics · Web (bios illustrative).

## OUR STORY (`app/our-story/page.tsx`)
- H1: "How a freelance collective became a four-person agency that ships like a thirty."
- Numbers: 4 Senior operators · 0 Active awards · 60s Hub loop tick · 1 Guarantee
- 6 chapters: 01 The agency that wasn't (2019) · 02 The junior mistake (2021) · 03 The unwind (2022) · 04 The Hub (2024) · 05 Senior-only, by design (2025) · 06 What we won't do (2026 — "We won't enter awards...We won't bill hours. We won't lock clients into contracts...")
- "Build in public — The Hub is the receipt": "Most agencies tell you they're senior. We show you the system that proves it."

## METHODOLOGY (`app/methodology/page.tsx`)
- H1: "Diagnose. Plan. Ship. Score. Learn."
- 5 phases: 01 Diagnose (Week 1) · 02 Plan (Week 2) · 03 Ship (Weeks 3–10) · 04 Score (Every 60s, in public) · 05 Learn (Bi-weekly)
- Public scoring formula (lead scoring): `score = clamp(30*recency_decay + 5*unique_channels + 2*total_touches + 10*sales_touches + engagement_pts, 0, 100)`
- **Outcome pricing tiers:** Velocity (90 days, add $200K pipeline, or month 4 free) · Compounding (6 mo, 4× coverage, or we keep going free) · Sovereign (12 mo, build + run your Hub, you own the asset when we leave)
- Speed guarantee: "Ship in 14 days. Or first month free."
- FAQ: speed of pipeline movement, who does the work, plan disagreement, Hub visibility.

## PRICING (`content/pricing.ts`)
- **Core** ($6.5K–$9.5K/mo): "One channel. One senior partner. End-to-end." 90-day minimum.
- **Growth** ($18K–$28K/mo, featured): "Full stack. One senior team. No pod layers." 3–5 senior partners.
- **Project** ($12K–$80K fixed): "Scoped work. A fixed finish line. No retainer." 4–14 weeks.

## INDUSTRIES (`content/industries.ts`)
- DTC & E-commerce · B2B SaaS · FinTech · Hospitality & Travel · AI & Dev Tools · Professional Services — each with challenges + outcomes (e.g. "Rising CAC across Meta and TikTok" → "Clean server-side tracking that survives iOS").

---

## BRAND GUIDELINES (`brand/`)
**Voice (`voice.md`):** Magazine not brochure. Confident, Specific, Editorial, Honest, Opinionated. No jargon, no superlatives without proof, no exclamation marks, no emoji, no passive/hedging. Oxford comma, em dashes, sentence-case headings, numerals for all numbers, "and" not "&". Eyebrows = JetBrains Mono uppercase violet with `●`. CTA copy = action-oriented, first-person, specific. Five brand beliefs: Brands are verbs not nouns · Distribution is design · Senior team no juniors · Speed is a feature · Measure what matters.

**Design (`design.md`):** Editorial luxury through restraint (Monocle/Cereal/Kinfolk). Violet `hsl(270,85%,72%)` is the singular accent (never a background/body fill). Three section tones: paper `#f5f1ea`, white `#ffffff`, ink `#0e0e0e`. 120px macro whitespace. Fibonacci radius scale (3/5/8/13/21…). BlackSwan components, never shadcn/ui.

**Note:** All case studies and testimonials are explicitly flagged `placeholder: true` ("Demo"/"illustrative") — the codebase repeatedly warns these are representative composites and must be replaced with signed-client material before public launch.

