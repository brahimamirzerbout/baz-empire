# Marketing Hub — All-in-One Marketing Command Center

> ⚡ **Core Doctrine: Intensity Beats Extensity — Every Time.**
> One channel mastered beats five channels touched. One offer sharpened beats ten offers scattered. One persona deeply understood beats five personas guessed. Read the full principle in [`docs/INTENSITY_PRINCIPLE.md`](docs/INTENSITY_PRINCIPLE.md).

A complete marketing platform built with **Next.js 14, TypeScript, Tailwind, and SQLite**. **30 interconnected sections** covering the entire marketing workflow — all running locally, no external API keys required.

## Quick start

```bash
cd ~/marketing-hub
npm install
npm run seed               # populate with 200+ sample records
npm run dev                # http://localhost:3000
```

For production:
```bash
npm run build
npm start
```

## What's inside (30 sections)

### 🧭 Plan
| Section | What it does |
|---|---|
| **Dashboard** | Unified metrics, module grid, traffic/conversion charts, active campaigns, upcoming content |
| **Brand kit** | Logos (primary/dark/icon), color palette, typography, voice & tone, usage guidelines |
| **Personas** | Audience profiles with goals, pain points, channels, messaging. Primary / secondary / anti-persona tiers |
| **Segments** | Rule-based audience segments (e.g. `score > 70 AND tag = newsletter`) |
| **Competitors** | Track competitors: positioning, pricing, SWOT analysis, strengths & weaknesses |
| **Campaigns** | Kanban (draft → scheduled → live → paused → completed), full CRUD, detail page, budget tracking |
| **Funnels** | Visual customer-journey builder — map awareness → landing → form → email → sale. Tracks conversion per step |
| **Budget planner** | Monthly budget by category, planned vs actual, variance tracking, category breakdown chart |
| **Playbooks** | Repeatable SOPs with steps, owners, durations, KPIs. Acquisition / activation / retention / revenue / branding |

### ✏️ Create
| Section | What it does |
|---|---|
| **Content calendar** | Monthly grid view with per-channel color coding, click-to-create |
| **Social studio** | Composer with per-channel character limits (Twitter 280, LinkedIn 3000, etc.), preview, scheduling |
| **Email builder** | Block-based editor (hero, features, CTA, testimonials, pricing, FAQ), live preview, HTML/text export |
| **Landing pages** | Same block editor for marketing pages, live preview, SEO meta, static HTML export |
| **Forms** | Drag-style form builder — text/email/phone/textarea/select/checkbox/number/URL fields, submit tracking |
| **Lead magnets** | Library of eBooks, templates, checklists, webinars, coupons, videos — track downloads |
| **Copy generator** | Offline template-based: headlines, hooks, CTAs, ad copy, social posts, email sequences, blog outlines |
| **Asset library** | File upload, image/video/document previews, search, tags |

### 📈 Grow
| Section | What it does |
|---|---|
| **SEO toolkit** | Keyword tracker (volume/difficulty/opportunity), HTML auditor, sitemap.xml, robots.txt |
| **Ads manager** | Multi-channel (Meta/Google/TikTok/LinkedIn), spend/impressions/clicks/CTR/CPA, pause/resume |
| **Events & webinars** | Webinars, conferences, meetups, workshops, launches — registration tracking, capacity fill rate |
| **CRM & deals** | Contacts with scoring, companies, deals kanban (drag between stages), activity tracking |
| **Automations** | Trigger→action rule builder (8 triggers × 8 actions), run tracking, pause/resume |
| **A/B testing** | Experiments with two variants, traffic & conversions, auto-computed lift & confidence, winner flag |
| **Testimonials** | Social proof library with ratings, sources (G2/Trustpilot/Twitter/email/manual), featured toggle, avatars |
| **Conversations inbox** | Unified inbox — DMs, comments, replies, emails. Channel filters, sentiment badges, star, search, reply |
| **Surveys (NPS, CSAT)** | NPS (0-10), CSAT (1-5), CES (1-7), custom — track responses & aggregate score |
| **Analytics** | Multi-range charts (traffic/conversions/revenue), funnel viz, channel mix, per-channel performance |

### ⚙️ Manage
| Section | What it does |
|---|---|
| **Tasks** | To-do tracker with priority, due date, project tagging |
| **Integrations** | 24 service connectors (Mailchimp, SendGrid, HubSpot, Meta, Google, Slack, etc.) with connect/disconnect flow |
| **Reports** | Auto-generated performance summaries, CSV export, jsPDF PDF export |
| **Settings** | Workspace, brand color, email defaults, API key vault (encrypted at rest) |

## Architecture

- **Next.js 14 App Router** with server components + client islands
- **SQLite** (`better-sqlite3`) for everything — single-file database at `data/hub.sqlite`
- **Tailwind CSS** + custom design system (no UI library), dynamic color safelist
- **Recharts** for all charts
- **lucide-react** for icons
- **framer-motion** for premium animations
- **jsPDF** for PDF reports
- **TypeScript** strict mode throughout
- RESTful API routes under `/api/*`
- Full CRUD on every resource
- Auto-migrations on first run (creates 35 tables)

## Database schema (35 tables)

`users, workspaces, settings, contacts, companies, deals, activities, campaigns, content, emails, landing_pages, seo_keywords, seo_audits, ads, assets, automations, integrations, api_keys, copy_templates, notes, tasks, brand_assets, personas, segments, forms, form_submissions, lead_magnets, funnels, experiments, testimonials, events, event_registrations, competitors, conversations, budget_items, playbooks, surveys, survey_responses`

## File map

```
src/
├── app/                              # 35 page routes
│   ├── page.tsx                      # Dashboard with module grid
│   ├── brand/                        # Brand kit (logos, colors, type, voice)
│   ├── personas/                     # Audience personas
│   ├── segments/                     # Rule-based segments
│   ├── forms/                        # Form builder
│   ├── lead-magnets/                 # eBooks, templates, etc.
│   ├── funnels/                      # Visual customer journeys
│   ├── experiments/                  # A/B testing
│   ├── testimonials/                 # Social proof
│   ├── events/                       # Webinars & conferences
│   ├── competitors/                  # Competitive intelligence + SWOT
│   ├── inbox/                        # Unified conversations
│   ├── budget/                       # Spend planner
│   ├── playbooks/                    # SOPs
│   ├── surveys/                      # NPS, CSAT, CES
│   ├── campaigns/[id]/page.tsx       # Campaign detail
│   ├── emails/[id]/page.tsx          # Email builder
│   ├── landing-pages/[id]/page.tsx   # Landing page builder
│   ├── preview/[id]/page.tsx         # Iframe preview
│   └── api/                          # 71+ API routes (full CRUD on every resource)
├── components/
│   ├── Sidebar.tsx                   # 30 modules in 4 groups
│   ├── Topbar.tsx, Modal.tsx, Stat.tsx, Badge.tsx
│   ├── BlockEditor.tsx               # Block-based content editor
│   ├── CommandPalette.tsx            # ⌘K with all 30 sections
│   ├── useFetch.ts, Anim.tsx, Skeleton.tsx, Toast.tsx, ThemeProvider.tsx
└── lib/
    ├── db/index.ts                   # SQLite + 35-table schema + auto-migrations
    ├── api-helpers.ts                # listRows, insertRow, updateRow, deleteRow
    ├── constants.ts                  # Channels, deal stages, integrations, formatters
    ├── blocks.ts                     # Block model + HTML renderers
    ├── copy.ts                       # Copy generation (headlines, hooks, CTAs, etc.)
    ├── seo.ts                        # SEO audit, sitemap, robots
    └── analytics.ts                  # Deterministic mock data for charts

scripts/seed.ts                       # Seeds 250+ records across all 30 sections
data/hub.sqlite                       # SQLite database (auto-created)
```

## Verified working

All 35 pages and 71+ APIs return 200. Tested:
- Dashboard, brand kit, personas, segments, forms, lead magnets, funnels, experiments, testimonials, events, competitors, inbox, budget, playbooks, surveys
- All existing: campaigns, calendar, studio, emails, landing pages, copy, SEO, ads, CRM, analytics, automations, assets, integrations, reports, settings, tasks
- Detail pages (campaigns/[id], emails/[id], landing-pages/[id], preview/[id])
- Create / Read / Update / Delete on every new resource
- Form submissions increment leads_count
- Survey responses auto-recompute aggregate score
- A/B test lift + confidence auto-computed
- ⌘K palette shows all 30 sections + searches across all records
- Module grid on dashboard with live counts from each section

## Coverage matrix

| Marketing area | Hub coverage |
|---|---|
| Strategy & planning | Brand kit, Personas, Competitors, Playbooks, Funnels |
| Audience & segmentation | Personas, Segments, CRM |
| Content creation | Calendar, Studio, Email builder, Landing pages, Forms, Copy generator |
| Distribution & channels | Social, Email, Landing pages, Forms, Events, Inbox |
| Lead capture | Forms, Lead magnets, Landing pages |
| Conversion & sales | Funnels, Experiments, A/B tests |
| Paid acquisition | Ads manager, Budget |
| Earned & owned | SEO, Content, Email, Events |
| Customer feedback | Surveys, Testimonials, Inbox |
| Operations & measurement | Analytics, Reports, Budget, Tasks, Integrations |

→ **30 sections, 35 DB tables, 71 API routes, 250+ seeded records.**