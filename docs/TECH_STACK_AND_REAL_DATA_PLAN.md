# BAZ Empire — Tech Stack & Real Data Setup Plan

---

## 1. Tech Stack Overview

### baz (Production Marketing Site)

| Layer | Tech | Version | Notes |
|-------|------|---------|-------|
| **Framework** | Next.js | 14.2.5 | App Router, `output: 'standalone'` for Docker |
| **Language** | TypeScript | 5.5.3 | Strict mode |
| **React** | React | 18.3.1 | Server + client components |
| **Styling** | Tailwind CSS | 3.4.6 | Custom `ink/paper/accent` token system, `data-theme` dark mode |
| **Animation** | Framer Motion | 12.42.2 | Scroll reveals, cursor, page transitions |
| **Database** | better-sqlite3 | 11.10.0 | Local SQLite, WAL mode. Also has `@supabase/server` + `pg` |
| **Auth** | bcryptjs + jsonwebtoken | — | Custom JWT auth, cookie-based sessions |
| **Forms** | react-hook-form + zod | 7.80 / 4.4.3 | Validated forms |
| **AI/LLM** | Custom adapter (`lib/llm.ts`) | — | OpenAI, Anthropic, Ollama — provider-agnostic |
| **Agents** | Custom catalog (`lib/agents.ts`) | — | 7 agents: leadgen, content, analytics, summarization, pricing, proposal, reply, **knowledge (new)** |
| **Scoring** | Custom deterministic engine | — | `lib/scoring.ts` — regex + keyword + engagement signals |
| **Icons** | lucide-react | 1.22.0 | — |
| **Smooth Scroll** | Lenis | 1.3.25 | — |
| **Testing** | Playwright | 1.61.0 | E2E only |
| **Deploy** | Docker + Vercel | — | `Dockerfile`, `docker-compose.yml`, `.vercel/` |
| **Fonts** | Local WOFF2 (Inter, Fraunces, JetBrains Mono) | — | No Google Fonts CDN |

**DB schema**: 12 tables — `users`, `orgs`, `leads`, `customers`, `subscriptions`, `invoices`, `projects`, `feedback`, `feedback_requests`, `ai_jobs`, `sessions`, `audit` + **3 new tables** (`books`, `book_chunks`, `metrics`)

**Current data**: 166 leads (seeded + imported), 132 users, 3 customers, 0 AI jobs

---

### baz-redesign (New Design System)

| Layer | Tech | Version | Notes |
|-------|------|---------|-------|
| **Framework** | Next.js | 15.1.0 | App Router |
| **Language** | TypeScript | 5.7+ | — |
| **React** | React | 19.0.0 | — |
| **Styling** | Tailwind CSS | 4.3.2 | **v4** — new CSS-first config, `@theme inline` |
| **Animation** | tw-animate-css | 1.2.0 | CSS-based animations (no Framer Motion yet) |
| **Components** | shadcn/ui (radix-ui) | 1.1.3 | `components.json` configured |
| **Theming** | next-themes | 0.4.4 | Dark default, monochrome palette |
| **Font** | Outfit | — | Google Fonts, `next/font/google` |
| **Utilities** | class-variance-authority + tailwind-merge | — | Variant-driven components |

**Pages built**: `/` (home), `/methodology`, `loading`, `error`, `not-found`
**No backend yet**: No API routes, no database, no auth — purely static pages

---

### empire/nova-shell (The Operating System)

| Layer | Tech | Version | Notes |
|-------|------|---------|-------|
| **Framework** | Vite + React | 6.2 / 19.0.0 | SPA (not Next.js) |
| **Routing** | TanStack Router | 1.95.0 | Type-safe routing |
| **State** | Zustand | 5.0.2 | + custom `useVoidStore` (Firebase-backed) |
| **Language** | TypeScript | 5.8.2 | — |
| **Styling** | Tailwind CSS | 4.1.14 | v4 |
| **Backend** | Firebase | 12.11.0 | Auth + Firestore + Storage |
| **AI** | Google GenAI (`@google/genai`) | 1.29.0 | Gemini 2.5 Flash/Pro |
| **Data Viz** | Recharts | 3.8.1 | Charts + dashboards |
| **Graph** | ReactFlow | 11.11.4 | Node-based visual canvas |
| **Network** | D3.js | 7.9.0 | Force-directed graphs |
| **Animation** | Motion (framer-motion v12) | 12.23.24 | — |
| **Server** | Express | 4.21.2 | Custom backend |
| **Markdown** | react-markdown + remark-gfm | — | Rendering |

**Screens**: 30+ screens including CockpitScreen (54K), AetherTerminal, AgentSwarm, AssetLab, SovereignBanking, CampaignLab, NovaBoard, IntelligencePanel, DossierScreen, etc.

**Data store**: Firebase Firestore (real-time sync) + local Zustand state

---

### marketing-hub (The SaaS Product)

| Layer | Tech | Version | Notes |
|-------|------|---------|-------|
| **Framework** | Next.js | 14.2.15 | — |
| **Database** | better-sqlite3 + Supabase + pg | — | Triple-layer: SQLite local, Supabase remote, PG direct |
| **AI** | OpenAI | 6.45.0 | Direct API |
| **Components** | shadcn/ui + radix-ui | — | — |
| **Drag & Drop** | @hello-pangea/dnd | 17.0.0 | — |
| **PDF** | jsPDF | 2.5.2 | Report generation |
| **2FA** | speakeasy | 2.0.0 | — |
| **Auth** | bcryptjs | — | Same pattern as baz |

---

## 2. What's Connected and What's Not

```
┌─────────────────────────────────────────────────────────────────┐
│                    CURRENT STATE                                 │
│                                                                 │
│  baz (site)          baz-redesign      empire/nova-shell         │
│  ├─ SQLite ✓         ├─ No DB ✗         ├─ Firebase ✓           │
│  ├─ 166 leads        ├─ No API ✗        ├─ 30 screens ✓         │
│  ├─ LLM adapter ✓    ├─ No Auth ✗       ├─ Gemini AI ✓          │
│  ├─ 7 agents ✓       └─ Static only     ├─ Zustand state ✓      │
│  ├─ Scoring ✓                            ├─ VibeCoder ✓           │
│  ├─ Supabase (key)                       ├─ Orchestrator ✓        │
│  └─ Resend key ✓                         └─ 483 repos to port   │
│                                                                 │
│  NOT CONNECTED:                                                  │
│  ✗ baz ↔ empire (no shared API)                                │
│  ✗ baz ↔ marketing-hub (separate codebases, no sync)            │
│  ✗ Real data pipeline (GA4, Stripe, Resend — not wired)         │
│  ✗ Book RAG (just created, no books ingested yet)               │
│  ✗ baz-redesign has no backend at all                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. The Plan: Real Data + Book Training

### Phase 1: Ingest Your First Book (Today)

**Goal**: Upload a marketing book, query it from the BAZ agents.

```bash
cd /home/uzer/baz

# Install new dependencies
npm install pdf-parse @types/pdf-parse epub2

# Set your Gemini API key (you already have one in empire)
# Add to .env.local:
# GEMINI_API_KEY=your-key-here
```

**Test with a text file first** (no PDF needed):

```bash
# Create a test book from your existing resources.ts content
node -e "
const { ingestBookDryRun } = require('./lib/data/book-ingest');
const result = ingestBookDryRun(\`
--- Introduction ---

Marketing is the art and science of creating value for customers and capturing value in return. The best marketing strategies are grounded in deep customer understanding, clear positioning, and relentless measurement.

--- Chapter 1: Positioning ---

Positioning is the act of designing the company's offering and image to occupy a distinctive place in the mind of the target market. The goal is to locate your brand in the minds of consumers in a way that creates a unique and valuable perception.

Key principles:
1. You can't be all things to all people. Choose a niche and own it.
2. Consistency beats creativity. Repeat your positioning until it's boring, then repeat it more.
3. The best positioning answers three questions: Who is it for? What problem does it solve? Why is it different?

--- Chapter 2: The Marketing Triangle ---

The Marketing Triangle has three vertices: Marketing, Sales, and Intelligence. Each feeds the other in a continuous loop:
- Marketing scores leads and feeds them to Sales
- Sales sequences leads and feeds outcomes to Intelligence
- Intelligence reasons about both and optimizes the entire system

This loop runs every 60 seconds. No human is in the chain for routine decisions.

--- Chapter 3: Lead Scoring ---

Lead scoring is the process of assigning a numerical value to each prospect based on their likelihood to buy. The BAZ scoring formula:

score = clamp(
  30 * recency_decay
  + 5  * unique_channels
  + 2  * total_touches
  + 10 * sales_touches
  + engagement_pts
, 0, 100)

Where:
- recency_decay: 0-30 points, decays over 30 days since last interaction
- unique_channels: 0-20 points, number of distinct channels (paid, organic, email, sales, referral)
- total_touches: 0-20 points, total interaction count
- sales_touches: 0-20 points, interactions with the sales team
- engagement_pts: 0-10 points, opens + clicks + replies

A score of 75+ triggers a book_call action. 50-74 sends a proposal. 25-49 nurtures for 7 days. Below 25 nurtures for 30 days.
\`, {
  title: 'BAZ Marketing Manual',
  author: 'BAZ Agency',
  tags: ['marketing', 'positioning', 'lead-scoring', 'strategy'],
  source: 'manual',
  format: 'txt',
});
console.log('Chunks:', result.chunks.length, 'Tokens:', result.totalTokens);
"
```

**Then upload a real PDF** via the API:

```bash
# Upload a PDF book
curl -X POST http://localhost:3000/api/books \
  -F "file=@/path/to/your/book.pdf" \
  -F "title=Building a StoryBrand" \
  -F "author=Donald Miller" \
  -F 'tags=["branding","copywriting","strategy"]'

# Or upload from raw text
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "text": "... entire book text ...",
    "title": "Influence",
    "author": "Robert Cialdini",
    "tags": ["psychology", "persuasion", "sales"]
  }'

# Query the knowledge base
curl -X POST http://localhost:3000/api/books/query \
  -H "Content-Type: application/json" \
  -d '{
    "question": "How should I handle a cold lead that has low engagement?",
    "topK": 5
  }'
```

---

### Phase 2: Wire Real Data Sources (This Week)

#### Step 2.1: Google Analytics 4

```bash
# Add to .env.local:
# GOOGLE_ANALYTICS_PROPERTY_ID=your-property-id
# GOOGLE_APPLICATION_CREDENTIALS=path-to-service-account.json

npm install @google-analytics/data
```

**What you get**: Sessions, pageviews, conversions, bounce rate, traffic sources → fed into `metrics` table → used by dashboards and lead scoring.

**Sync**: The `/api/data/sync` endpoint fetches from GA4 every 60s (or on-demand).

#### Step 2.2: Resend Email Stats

You already have `RESEND_API_KEY` in `.env.local`. The pipeline fetches:

- Email campaigns sent
- Opens per campaign
- Clicks per campaign
- Bounce/complaint rates

```bash
# Already configured! Just trigger sync:
curl -X POST http://localhost:3000/api/data/sync \
  -H "Content-Type: application/json" \
  -d '{"sources": ["resend"]}'
```

#### Step 2.3: Stripe Revenue

```bash
# Add to .env.local:
# STRIPE_SECRET_KEY=sk_live_...

# Already handled by pipeline.ts. Just add the key and sync:
curl -X POST http://localhost:3000/api/data/sync \
  -H "Content-Type: application/json" \
  -d '{"sources": ["stripe"]}'
```

#### Step 2.4: Import Real Leads via CSV

```bash
# Upload a CSV with columns: name, email, company, message, source, score
curl -X POST http://localhost:3000/api/data/import \
  -F "file=@/path/to/leads-export.csv"
```

---

### Phase 3: Connect BAZ Agents to Book Knowledge (This Week)

The `knowledge` agent is already added to `lib/agents.ts`. Now wire it into the `/api/agents` route:

```typescript
// In /api/agents/route.ts — when kind === "knowledge":
// 1. Embed the user question
// 2. Search book chunks for relevant context
// 3. Inject context into the agent's system prompt
// 4. Call the LLM with the enriched prompt
```

**Also enhance existing agents** — any agent can optionally pull book context:

```typescript
// Example: the "content" agent gets book-grounded advice
const { enhancedPrompt } = await enhanceAgentWithBooks(userPrompt, { topK: 3 });
const result = await complete({ prompt: enhancedPrompt, system: agent.systemPrompt });
```

---

### Phase 4: Sync BAZ ↔ Empire (Next Week)

**Problem**: BAZ and Empire don't share data. They run on different backends (SQLite vs Firebase).

**Solution**: Add a shared API layer.

```
baz (SQLite)  ←→  /api/data/sync  ←→  empire (Firebase)
                          |
                    Supabase PG
                    (source of truth)
```

**Steps**:

1. **Migrate SQLite → Supabase** (you already have `@supabase/server` installed)
   - Run the schema migration in Supabase dashboard
   - Enable pgvector extension: `CREATE EXTENSION IF NOT EXISTS vector;`
   - Add book_chunks table with `embedding vector(768)` column

2. **Add Firebase → Supabase sync** in empire:
   ```typescript
   // nova-shell/src/lib/supabaseSync.ts
   // Listens to Firestore changes and mirrors to Supabase
   ```

3. **Add Supabase → Firebase sync** in baz:
   ```typescript
   // baz/lib/data/supabaseSync.ts
   // Polls Supabase and pushes to Firestore
   ```

---

### Phase 5: Port Book RAG to Empire (Next Week)

The `book-query.ts` and `book-store.ts` modules are framework-agnostic. Port them to empire:

```typescript
// nova-shell/src/lib/bookKnowledge.ts
// Same logic, but:
// - Uses Gemini embeddings (already configured)
// - Stores in Firebase Firestore (or Supabase pgvector)
// - Queried from any Nova screen
```

**Add a Knowledge screen** to nova-shell:

```typescript
// nova-shell/src/components/screens/KnowledgeScreen.tsx
// - Search bar for natural language queries
// - Results show book excerpts with citations
// - "Ask Nova" button that combines book context + Gemini
```

---

## 4. Files Created (This Session)

```
baz/lib/data/
├── embed.ts              — Embedding provider (Gemini/OpenAI/Ollama)
├── book-ingest.ts        — Book ingestion pipeline (PDF/EPUB/TXT/URL → chunks → embeddings)
├── book-store.ts         — Book + chunk storage (SQLite + in-memory vector search)
├── book-query.ts         — RAG query engine (embed question → search → LLM answer)
└── pipeline.ts            — Data pipeline (GA4/Resend/Stripe/CSV → metrics table)

baz/app/api/books/
├── route.ts              — GET list books, POST upload book
├── [id]/route.ts          — GET book detail, DELETE book
└── query/route.ts         — POST RAG query, GET knowledge summary

baz/app/api/data/
├── sync/route.ts          — POST trigger sync, GET source status
├── metrics/route.ts       — GET aggregated metrics
└── import/route.ts        — POST CSV import

baz/lib/agents.ts          — Added "knowledge" agent
docs/REAL_DATA_AND_BOOK_TRAINING.md — Architecture doc
```

---

## 5. What You Need to Do (Checklist)

### Right Now
- [ ] `cd /home/uzer/baz && npm install pdf-parse @types/pdf-parse epub2`
- [ ] Add `GEMINI_API_KEY` to `baz/.env.local` (copy from empire's firebase config)
- [ ] Upload first book: `curl -X POST localhost:3000/api/books -F "file=@book.pdf" -F "title=..." -F "author=..."`
- [ ] Test query: `curl -X POST localhost:3000/api/books/query -d '{"question":"How to handle cold leads?"}'`

### This Week
- [ ] Set up Google Analytics service account → add `GOOGLE_ANALYTICS_PROPERTY_ID` + `GOOGLE_APPLICATION_CREDENTIALS` to `.env.local`
- [ ] `npm install @google-analytics/data` in baz
- [ ] Test Resend sync: `curl -X POST localhost:3000/api/data/sync -d '{"sources":["resend"]}'`
- [ ] Add Stripe key → test revenue sync
- [ ] Import your real leads via CSV
- [ ] Add `SUPABASE_DB_URL` → enable PostgreSQL production mode
- [ ] Enable pgvector in Supabase → migrate book_chunks to proper vector storage

### Next Week
- [ ] Port book RAG to empire/nova-shell (same logic, Gemini embeddings)
- [ ] Add KnowledgeScreen to nova-shell
- [ ] Wire Firebase ↔ Supabase sync
- [ ] Add book context enhancement to all BAZ agents (not just "knowledge")
- [ ] Start baz-redesign backend: API routes, auth, book knowledge, data pipeline

---

## 6. How the Data Flows After Setup

```
USER QUESTION
     │
     ▼
┌─────────────────────────────┐
│  /api/books/query           │
│  or /api/agents (kind=knowledge) │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────┐
│  Embed question      │ ← Gemini text-embedding-004
│  (768 dimensions)    │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Vector search       │ ← SQLite in-memory (dev)
│  top 5 chunks        │ ← Supabase pgvector (prod)
│  score > 0.3         │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Build context       │ ← "Excerpt 1 [Book, Author, Ch1]: ..."
│  window (5 chunks)   │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  LLM call            │ ← OpenAI / Anthropic / Ollama
│  system: RAG prompt  │   (uses your existing lib/llm.ts)
│  + book context      │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Answer + citations  │ ← "[Influence, Cialdini, Ch.3]"
│  returned to client   │
└─────────────────────┘
```

And for real data:

```
GA4 ──────────┐
Resend ───────┤
Stripe ───────┼──▶ /api/data/sync ──▶ metrics table ──▶ Dashboard
CSV import ───┤                      ──▶ leads table ──▶ Scoring ──▶ Agents
Manual input ─┘
```