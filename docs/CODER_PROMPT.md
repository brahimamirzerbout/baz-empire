# Coder Prompt — BAZ Empire Session Handoff

Copy everything below the line into your coding agent. It has everything needed to pick up where we left off.

---

## Context

You are working on the BAZ Empire — a marketing agency ecosystem with three active codebases and one massive SaaS product. The previous session completed significant work: adding Gemini AI support, a Book RAG system, a data pipeline, fixing 218 TS errors, and creating Pi skills/context files. This prompt gives you the full picture of what exists, what's working, and what needs to happen next.

### Projects

| Project | Path | What it is |
|---------|------|-----------|
| **baz** | `/home/uzer/baz` | Production marketing site. Next.js 14 + React 18 + Tailwind 3 + better-sqlite3. Æther design system. |
| **baz-redesign** | `/home/uzer/baz-redesign` | Design exploration. Next.js 15 + React 19 + Tailwind 4 + shadcn. 2 pages only, no backend. |
| **empire/nova-shell** | `/home/uzer/empire/nova-shell` | The OS/app. Vite + React 19 + Firebase + Gemini. 30+ screens. |
| **marketing-hub** | `/home/uzer/marketing-hub` | The SaaS product. Next.js 14 + SQLite (117 tables!) + Supabase + OpenAI. |

### Design System: Æther (THE unified truth)

- **Source**: `baz/app/globals.css` (414 lines), `baz/app/aether-theme.css`, `baz/app/aether-monochrome.css`
- **Accent**: Violet `hsl(270, 85%, 72%)` — NOT gold, NOT obsidian
- **Typography**: Fraunces (display), Inter (body), JetBrains Mono (code)
- **Radius**: Fibonacci (3, 5, 8, 13, 21, 34, 55, 89)
- **Spacing**: Fibonacci px scale
- **Components**: Hand-rolled Æther components — NOT shadcn/ui

### Backend State

| Component | Status | Details |
|-----------|--------|---------|
| SQLite DB | ✅ Working | 15 tables, 166 leads, 1 book (2 chunks) |
| Gemini AI | ✅ Working | Chat (gemini-2.5-flash) + Embeddings (gemini-embedding-001, 3072-dim) |
| Book RAG | ✅ Working | /api/books (ingest), /api/books/query (RAG), /api/books/[id] (detail) |
| Data Pipeline | ✅ Built | /api/data/sync, /api/data/metrics, /api/data/import |
| Knowledge Agent | ✅ Added | lib/agents.ts — id: "knowledge" |
| Build | ✅ Clean | 0 non-test TS errors, 96 pages generated |
| Dev Server | ✅ Running | localhost:3000 |

### What's New This Session

1. **lib/llm.ts** — Added Gemini provider (callGemini function)
2. **lib/data/*.ts** — Book RAG system (5 files: embed, book-ingest, book-store, book-query, pipeline)
3. **app/api/books/** — 3 API routes (list, query, detail)
4. **app/api/data/** — 3 API routes (sync, metrics, import)
5. **lib/agents.ts** — Added "knowledge" agent for book queries
6. **DB** — Created books, book_chunks, metrics tables
7. **TS errors** — Fixed 218 → 0 (non-test, non-vendor)
8. **Missing modules** — Created styles/aether-design-system.ts, components/panels/index.ts, components/editor/index.ts
9. **Pi skills** — 4 skills + 1 extension + AGENTS.md

### Critical Notes

1. **Gemini key** `AQ.Ab8RN6KC821...` is an OAuth2 access token, NOT a standard API key. It works now but may expire. For production, get a proper `AIzaSy...` key from https://aistudio.google.com/apikey
2. **Embedding model** is `gemini-embedding-001` (3072 dimensions), NOT `text-embedding-004`
3. **Book ingest uses single embedContent calls** (not batch) because batch doesn't work with OAuth2 tokens
4. **Æther** is the design system — violet, Fraunces, Fibonacci. NOT gold, NOT Playfair Display, NOT shadcn

### Priority Tasks

| Priority | Task | Details |
|----------|------|---------|
| P0 | Get a proper Gemini API key | Replace `AQ.Ab8RN6KC821...` with `AIzaSy...` key |
| P1 | Upload real books | The Book RAG works — upload marketing/business PDFs |
| P2 | Port Æther to baz-redesign | Convert globals.css to Tailwind v4 @theme syntax |
| P3 | Wire empire to baz API | empire should call baz's /api/books/query and /api/agents |
| P4 | Connect marketing-hub data | Bridge the 117 tables of real data to baz |
| P5 | Set missing env vars | RESEND_API_KEY, STRIPE_SECRET_KEY, GOOGLE_ANALYTICS_PROPERTY_ID |
