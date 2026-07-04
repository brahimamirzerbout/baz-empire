# Real Data + Book Training — Architecture & Implementation

> Two features:
> 1. **Real-life data pipeline** — connect your projects to real marketing/business data
> 2. **Book Library → RAG system** — train your marketing AI on books from your library

---

## Part 1: Real-Life Data Pipeline

### Problem
Your projects currently run on:
- **baz**: seeded SQLite data (5 sample leads, 3 sample customers)
- **empire/nova-shell**: Firebase + hardcoded mock data
- **marketing-hub**: 52+ tables but all seeded
- **baz-ventures-library**: 8 static book entries

None of this is live data. The scoring, agents, and dashboards operate on fictional inputs.

### Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    DATA SOURCES (real)                        │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  Supabase DB │  Google       │  Resend      │  Manual CSV/   │
│  (leads,     │  Analytics   │  (email       │  JSON import   │
│  customers,  │  (traffic,    │  campaigns,  │  (CRM export,  │
│  projects)   │  events)      │  opens)      │  Stripe export) │
└──────┬───────┴──────┬───────┴──────┬───────┴───────┬────────┘
       │              │              │               │
       ▼              ▼              ▼               ▼
┌──────────────────────────────────────────────────────────────┐
│              BAZ Data Layer (lib/data/)                       │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│  │ supabase.ts │ │ analytics.ts │ │ integrations/         │ │
│  │ (real-time  │ │ (GA4 metrics │ │ ├ resend.ts           │ │
│  │  sync +     │ │  → lead      │ │ ├ google.ts           │ │
│  │  listeners) │ │  scores)     │ │ └ stripe.ts          │ │
│  └─────────────┘ └──────────────┘ └──────────────────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ data-pipeline.ts  (scheduler + merger + validator)      │ │
│  │  - Polls sources every 60s                              │ │
│  │  - Merges into local DB                                 │ │
│  │  - Emits events for scoring + agents                   │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│              BAZ + Empire (consumers)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │ scoring  │  │ agents   │  │ dashboard│  │ nova-shell │  │
│  │ (real    │  │ (real    │  │ (live    │  │ (real-time │  │
│  │  leads) │  │  data)  │  │  KPIs)  │  │  sync)     │  │
│  └──────────┘  └──────────┘  └──────────┘  └───────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### Implementation Steps

#### Step 1: Supabase as the real-time backbone (baz already has this)

You already have `SUPABASE_URL` in `.env.local`. The `lib/db.ts` already supports Supabase. We need to:

1. **Migrate the schema to Supabase** (currently only in SQLite)
2. **Add real-time listeners** so empire/nova-shell gets live updates
3. **Write sync scripts** to import data from external sources

```typescript
// lib/data/supabase-sync.ts
// Pushes leads, customers, projects to Supabase
// Listens for changes and propagates to local SQLite cache
```

#### Step 2: Connect real data sources

| Source | What it provides | Integration |
|--------|-----------------|-------------|
| **Google Analytics 4** | Traffic, events, conversions, attribution | `lib/data/google.ts` — uses GA4 Data API |
| **Resend** | Email campaign stats, opens, clicks | `lib/data/resend.ts` — uses Resend API |
| **Stripe** | Revenue, subscriptions, MRR | `lib/data/stripe.ts` — uses Stripe API |
| **Google Sheets / CSV** | Manual data entry (CRM exports) | `lib/data/import.ts` — CSV/JSON parser |
| **Webhook forms** | Contact form submissions | Already exists in `/api/leads` |

#### Step 3: Wire real data into scoring

Currently `lib/scoring.ts` is deterministic (regex + keywords). With real data:

```typescript
// Enhanced scoring with real engagement data
function scoreLeadEnhanced(input: ScoreInput): ScoreResult {
  // Base score from deterministic engine
  const base = scoreLead(input);
  
  // Layer on real engagement data
  if (input.emailOpens > 3) base.score += 5;
  if (input.pageVisits > 5) base.score += 5;
  if (input.demoCompleted) base.score += 10;  // already exists
  
  // LLM-based intent classification (when AI provider is available)
  // → This is already in /api/agents with the leadgen agent
  
  return base;
}
```

#### Step 4: Wire real data into dashboards

The empire CockpitScreen + marketing-hub dashboards currently show mock data.
With the pipeline, they pull from Supabase real-time:

```typescript
// In nova-shell — subscribe to real data
import { onSnapshot, collection } from 'firebase/firestore';

onSnapshot(collection(db, 'leads'), (snap) => {
  // Update local store with real leads
  // Trigger re-score on every change
});
```

---

## Part 2: Book Library → Marketing AI Training (RAG)

### Problem
You have a library of marketing books (Building a StoryBrand, Psychology of Persuasion, etc.)
and you want your marketing system (BAZ agents, Nova AI, VibeCoder) to be trained on them —
so when a user asks "how would Cialdini approach this lead?", the system can answer from
the actual book content, not generic AI knowledge.

### Architecture: Book RAG Pipeline

```
┌────────────────────────────────────────────────────────────┐
│                BOOK INGESTION PIPELINE                       │
│                                                              │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌────────┐│
│  │ PDF/EPUB │──▶│ Extract  │──▶│ Chunk &  │──▶│ Embed  ││
│  │ Upload   │   │ Text     │   │ Enrich   │   │ & Index││
│  └──────────┘   └──────────┘   └──────────┘   └────┬───┘│
│                                                      │     │
│  Supported formats:                                  │     │
│  - PDF (pdf-parse)                                  │     │
│  - EPUB (epub2)                                     │     │
│  - TXT / MD (native)                               │     │
│  - Web articles (URL fetch)                         │     │
└──────────────────────────────────────────────────────┼─────┘
                                                       │
┌──────────────────────────────────────────────────────┼─────┐
│                VECTOR STORE                                  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Supabase pgvector  (or local SQLite-vec fallback)   │  │
│  │                                                      │  │
│  │  Table: book_chunks                                 │  │
│  │  ┌─────────┬──────────┬─────────┬────────┬────────┐ │  │
│  │  │ id      │ book_id  │ content │ embedding│ meta  │ │  │
│  │  │ uuid    │ text     │ text    │ vector   │ jsonb │ │  │
│  │  └─────────┴──────────┴─────────┴────────┴────────┘ │  │
│  │                                                      │  │
│  │  Table: books                                        │  │
│  │  ┌─────────┬──────────┬────────┬─────────┬────────┐ │  │
│  │  │ id      │ title    │ author │ chunks  │ tags   │ │  │
│  │  │ uuid    │ text     │ text   │ count   │ text[] │ │  │
│  │  └─────────┴──────────┴────────┴─────────┴────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                                                       │
┌──────────────────────────────────────────────────────┼─────┐
│                QUERY PIPELINE                                 │
│                                                              │
│  User question ──▶ Embed question ──▶ Vector search ──▶     │
│  Top-K relevant chunks ──▶ Build context window ──▶        │
│  LLM with book context ──▶ Answer with citations           │
│                                                              │
│  "How would Cialdini handle a cold lead?" ──▶              │
│    → Embed query                                            │
│    → Find chunks from "Psychology of Persuasion"            │
│    → Build prompt: "Using these book excerpts..."          │
│    → LLM generates answer with [Chapter 7, p.142] cites    │
└──────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

1. **Embedding model**: Use Gemini's `text-embedding-004` (free tier: 1500 req/min) or
   OpenAI's `text-embedding-3-small` ($0.02/1M tokens). For local: `nomic-embed-text` via Ollama.

2. **Vector store**: Supabase pgvector (you already have a Supabase project) is the best fit.
   Fallback: in-memory cosine similarity for development.

3. **Chunking strategy**: 500 tokens per chunk, 50-token overlap between chunks.
   Each chunk gets metadata: book title, author, chapter, page, tags.

4. **Which books to start with** (from your resources.ts + likely library):

| Book | Author | Key Marketing Concept |
|------|--------|----------------------|
| Building a StoryBrand | Donald Miller | Brand messaging framework |
| Influence: Psychology of Persuasion | Robert Cialdini | 6 principles of influence |
| Hooked | Nir Eyal | Habit-forming product design |
| The Copywriter's Handbook | Robert Bly | Persuasive writing |
| Positioning | Al Ries & Jack Trout | Market positioning |
| Crossing the Chasm | Geoffrey Moore | Technology adoption lifecycle |
| $100M Offers | Alex Hormozi | Value offer construction |
| DotCom Secrets | Russell Brunson | Sales funnels |
| They Ask, You Answer | Marcus Sheridan | Content marketing strategy |
| Obviously Awesome | April Dunford | Positioning for products |

### Implementation Plan

#### Phase 1: Ingestion (this session)

Create `/home/uzer/baz/lib/data/` with:

```
lib/data/
├── book-ingest.ts      — PDF/EPUB/TXT → chunks → embeddings
├── book-store.ts       — CRUD for books + chunks (Supabase pgvector)
├── book-query.ts       — RAG query: embed question → search → LLM answer
├── embed.ts            — Embedding provider (Gemini/OpenAI/Ollama)
├── pipeline.ts          — Scheduled data sync from external sources
├── google.ts            — GA4 Data API integration
├── resend.ts            — Resend email stats integration
└── import.ts            — CSV/JSON bulk import
```

#### Phase 2: API Routes

```
app/api/
├── books/
│   ├── route.ts         — GET list, POST upload book
│   ├── [id]/route.ts    — GET book detail, DELETE book
│   ├── query/route.ts   — POST RAG query
│   └── ingest/route.ts  — POST trigger ingestion
├── data/
│   ├── sync/route.ts    — POST trigger data pipeline sync
│   └── metrics/route.ts — GET real-time metrics from all sources
```

#### Phase 3: Integration into existing agents

Enhance `lib/agents.ts` to include book context:

```typescript
// Before calling the LLM, inject relevant book chunks
const bookContext = await queryBooks(userPrompt, { topK: 5 });
const systemPrompt = agent.systemPrompt + '\n\nBook context:\n' + 
  bookContext.chunks.map(c => `[${c.book_title}, ${c.chapter}]: ${c.content}`).join('\n');
```

#### Phase 4: Integration into Nova (empire)

```typescript
// In nova-shell, add a "Knowledge" mesh node
const KNOWLEDGE_NODE: MeshNode = {
  id: 'mesh-knowledge',
  label: 'Knowledge',
  capabilities: ['book_query', 'rag_search', 'context_retrieval'],
  status: 'active',
};

// When VibeCoder or any agent needs context:
const context = await fetch('/api/books/query', {
  method: 'POST',
  body: JSON.stringify({ question: vibe.rawText, topK: 5 })
});
```

---

## Quick Start: What to Build First

### Priority 1: Book RAG API (most impactful — your agents get smarter)

```bash
# Install dependencies
cd /home/uzer/baz
npm install pdf-parse epub2 mammoth openai
```

### Priority 2: Data Pipeline (makes dashboards real)

```bash
# Add Supabase client (already have @supabase/supabase-js from existing)
# Add Google Analytics Data API client
npm install @google-analytics/data
```

### Priority 3: Wire it all together (agents use book context + real data)

---

## File-by-File Implementation

See the files we'll create next:
- `baz/lib/data/book-ingest.ts` — Book ingestion pipeline
- `baz/lib/data/book-store.ts` — Supabase pgvector store
- `baz/lib/data/book-query.ts` — RAG query engine
- `baz/lib/data/embed.ts` — Embedding abstraction
- `baz/app/api/books/route.ts` — Books API
- `baz/app/api/books/query/route.ts` — RAG query endpoint