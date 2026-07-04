# The Real Stack — What's Actually Running, What's Yours, What's Not

---

## What You Built By Hand vs What AI Touched

Looking at timestamps, comment style, and code quality:

| Pattern | Your Code | AI-Generated |
|---------|-----------|--------------|
| **File headers** (`/** BAZ — Auth layer */`) | ✅ All `lib/` files | ❌ Never has them |
| **DB schema design** | ✅ 12 tables, hand-tuned | — |
| **Scoring engine** (`lib/scoring.ts`) | ✅ Deterministic, opinionated | — |
| **Agent system prompts** | ✅ Written in your voice | — |
| **Component variants** (Button, Badge, Section) | ✅ Hand-rolled, no CVA | — |
| **Æther Design System** (globals.css) | ✅ Fibonacci + Da Vinci math | — |
| **`app/` pages (the big batch from Jun 29)** | ❌ All same timestamp, no headers | ✅ Likely AI-batched |
| **`baz-redesign/` (all files from Jun 30)** | ❌ All same timestamp | ✅ AI-generated |
| **`empire/nova-shell/` (all files from Jun 30)** | ❌ All same timestamp 07:58 | ✅ AI-batched |
| **`marketing-hub/src/`** | ✅ Mixed — libs are yours, pages mixed | Mixed |

**Key insight**: The batch timestamps (Jun 29-30, all at the same minute) mean those were AI-generated in bulk sessions. Your real code is in `lib/` files, the DB schema, the scoring engine, the design system, and the components with handwritten variants.

---

## The Three Stacks (What's Real)

### baz (The Production Site)

| What | Tech | Status |
|------|------|--------|
| Framework | **Next.js 14.2.5** App Router | ✅ Running, `output: 'standalone'` |
| Language | **TypeScript 5.5.3** (strict-ish, `ignoreBuildErrors: true`) | ⚠️ 18 TS errors |
| React | **18.3.1** | ✅ |
| Styling | **Tailwind 3.4.6** + custom Æther design system | ✅ Your hand-written token system |
| Dark mode | `data-theme="dark"` on `<html>`, CSS var swap | ✅ Custom |
| Fonts | Local WOFF2: Inter, Fraunces, JetBrains Mono | ✅ No CDN |
| Animation | **Framer Motion 12.42.2** + **motion 12.42.0** + **Lenis** | ✅ |
| DB | **better-sqlite3** (local) + **@supabase/server** + **pg** (prod, not wired) | ⚠️ SQLite works, Supabase unused |
| Auth | **bcryptjs + jsonwebtoken**, cookie sessions | ✅ Your code |
| Forms | **react-hook-form + zod** | ✅ |
| AI/LLM | Custom adapter: OpenAI / Anthropic / Ollama | ✅ Your code |
| Agents | 8 agents (leadgen, content, analytics, etc.) | ✅ Your prompts |
| Icons | **lucide-react** | ✅ |
| Pages | **34 pages** (most AI-batched Jun 29) | ✅ |
| API routes | **16 routes** across 12 groups | ✅ |
| Components | Hand-rolled variants (Button 5 variants, Badge 4, Section) | ✅ No shadcn |
| Deploy | Docker + Vercel | ✅ |

**Data**: 166 leads, 132 users, 3 customers, 0 AI jobs, 0 metrics

### baz-redesign (The New Design)

| What | Tech | Status |
|------|------|--------|
| Framework | **Next.js 15.1.0** | ✅ |
| Language | **TypeScript 5.7+** | ✅ Clean, no errors |
| React | **19.0.0** | ⚠️ Different from baz (18) |
| Styling | **Tailwind 4.3.2** (v4 — CSS-first config) | ⚠️ Different from baz (v3) |
| Dark mode | `.dark` class via **next-themes** | ⚠️ Different from baz (`data-theme`) |
| Fonts | **Google Fonts: Outfit** via `next/font/google` | ⚠️ Different from baz (local WOFF2) |
| Animation | **tw-animate-css** (CSS only, no Framer Motion) | ⚠️ Different from baz |
| Components | **shadcn/ui + radix-ui + CVA** | ⚠️ Different from baz (hand-rolled) |
| DB | **None** | ❌ |
| Auth | **None** | ❌ |
| API | **None** | ❌ |
| Pages | **2 only** (home, methodology) | ❌ |
| Build | ✅ Compiles clean | ✅ |

**Key problem**: baz-redesign is a **different tech stack** from baz. Not just redesigned — different React version, different Tailwind major, different component system, different dark mode, different fonts. It's a fresh project that happens to share the BAZ name.

### empire/nova-shell (The Operating System)

| What | Tech | Status |
|------|------|--------|
| Framework | **Vite 6.2 + React 19** (SPA, not SSR) | ✅ |
| Routing | **TanStack Router 1.95** | ✅ |
| State | **Zustand 5** + custom `useVoidStore` (Firebase-backed) | ✅ |
| Styling | **Tailwind 4.1.14** (v4) | ✅ |
| Theme | MD3 + Galaxy palette (cyan/indigo/emerald on #050505) | ✅ Your spec |
| Backend | **Firebase 12.11** (Auth + Firestore + Storage) | ✅ |
| AI | **@google/genai 1.29** (Gemini 2.5 Flash/Pro) | ✅ |
| Data viz | **Recharts 3.8 + D3 7.9 + ReactFlow 11** | ✅ |
| Animation | **motion 12.23.24** (Framer Motion v12) | ✅ |
| Markdown | **react-markdown + remark-gfm** | ✅ |
| Server | **Express 4.21** | ✅ |
| Build | ⚠️ Compiles with 18+ TS errors (unused vars, `unknown` types) | ⚠️ |
| Screens | **30+ screens** (all same timestamp = AI-batched) | ⚠️ |
| Real data | Firebase only, no local DB | ✅ |

### marketing-hub (The SaaS)

| What | Tech | Status |
|------|------|--------|
| Framework | **Next.js 14.2.15** | ✅ |
| DB | **better-sqlite3 + Supabase + pg** | ✅ Triple layer |
| AI | **OpenAI 6.45** direct | ✅ |
| Components | **shadcn/ui + radix-ui + CVA** | ✅ |
| DnD | **@hello-pangea/dnd** | ✅ |
| PDF | **jsPDF** | ✅ |
| 2FA | **speakeasy** | ✅ |
| Pages | **124 pages** | ✅ Massive |
| API routes | **251 routes** | ✅ Massive |
| Components | **50 components** | ✅ |

---

## The Inconsistencies (What's Broken Between Projects)

```
╔══════════════════╦══════════════╦═════════════════╦════════════════╗
║ DIMENSION        ║ baz           ║ baz-redesign    ║ empire/nova    ║
╠══════════════════╬══════════════╬═════════════════╬════════════════╣
║ React            ║ 18.3.1        ║ 19.0.0          ║ 19.0.0         ║
║ Tailwind         ║ 3.4.6         ║ 4.3.2           ║ 4.1.14         ║
║ Dark mode         ║ data-theme    ║ .dark class     ║ hardcoded dark ║
║ Font system       ║ local WOFF2   ║ Google CDN      ║ system default ║
║ Component system  ║ hand-rolled   ║ shadcn/ui+CVA   ║ hand-rolled    ║
║ Color system      ║ oklch+CSS vars║ flat hex vars   ║ Tailwind bg[]  ║
║ DB                ║ SQLite        ║ None             ║ Firebase        ║
║ Auth              ║ JWT+cookies   ║ None             ║ Firebase Auth  ║
║ AI provider        ║ multi (OAI/  ║ None             ║ Gemini only    ║
║                   ║ Anthropic/    ║                  ║                ║
║                   ║ Ollama)       ║                  ║                ║
║ State management  ║ Server comps  ║ None             ║ Zustand+Firebase║
║ Build system      ║ Next.js       ║ Next.js          ║ Vite           ║
║ Deploy target      ║ Docker/Vercel║ TBD              ║ Desktop/Electron║
╚══════════════════╩══════════════╩═════════════════╩════════════════╝
```

---

## The Unification Plan

### Principle: baz is the source of truth for backend, baz-redesign is the UI target, empire is the app.

### Step 1: Decide the Target Stack

**Recommended unified stack:**

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 15** (App Router) | Both redesign and future; baz can upgrade |
| React | **19** | Current in redesign + empire |
| Tailwind | **4.x** (CSS-first) | Current in redesign + empire |
| Components | **shadcn/ui + CVA** | From redesign; portable, typed, theme-able |
| Dark mode | **CSS `.dark` class + next-themes** | From redesign; standard approach |
| Fonts | **Local WOFF2** (from baz) | No CDN dependency |
| DB | **SQLite local + Supabase prod** | From baz; proven |
| Auth | **JWT+cookies** (from baz) | Works everywhere |
| AI | **Multi-provider adapter** (from baz) | Most flexible |
| State | **Zustand** (from empire) | For client state; server components for the rest |

### Step 2: Upgrade baz to the Target Stack

This is the hardest part — baz is on React 18 + Tailwind 3 + hand-rolled components.

**Order of operations:**

1. **Upgrade Tailwind 3 → 4** in baz
   - Convert `tailwind.config.ts` to `@theme inline` in CSS
   - Convert `postcss.config.js` to use `@tailwindcss/postcss`
   - Migrate oklch tokens → CSS custom properties
   - Add `tw-animate-css`

2. **Upgrade React 18 → 19** in baz
   - `npm install react@19 react-dom@19`
   - Update Next.js to 15.x
   - Fix breaking changes (ref forwarding, etc.)

3. **Migrate hand-rolled components → shadcn/ui**
   - Install shadcn: `npx shadcn@latest init`
   - Replace Button, Badge, Card, Input, Separator with shadcn versions
   - Keep your Æther design system tokens, wire them into shadcn's CSS vars

4. **Add Zustand** for client state that's currently scattered

### Step 3: Merge baz-redesign INTO baz

Don't maintain two projects. The redesign pages become the new pages in baz:

```bash
# Copy redesign pages into baz
cp -r baz-redesign/app/page.tsx baz/app/page-v2.tsx    # Temporary new homepage
cp -r baz-redesign/app/methodology/ baz/app/methodology-v2/
# ... then gradually replace old pages
```

### Step 4: Wire empire to baz backend

Empire currently talks to Firebase. It should talk to baz's API:

```
empire/nova-shell → baz API (/api/leads, /api/agents, /api/books/query)
                   → Supabase (for real-time data)
                   → Firebase (only for auth, if you want)
```

Or: empire keeps Firebase for real-time sync, but baz is the source of truth for leads, scoring, agents, and book knowledge.

### Step 5: marketing-hub is its own thing

Marketing-hub is 124 pages + 251 API routes. It's the SaaS product. It should:
- Share the same component library (shadcn/ui)
- Share the same design tokens (Æther → CSS vars)
- Connect to the same Supabase instance as baz
- Have its own `/api/books/query` endpoint (same book RAG code)

---

## What to Do First (Priority Order)

1. **Get real data into baz** — Upload your first book, connect Resend, import real leads (the code I wrote earlier)
2. **Decide**: Do you want to upgrade baz in-place, or merge baz-redesign into baz?
3. **Unify the design tokens** — Take the Æther system from baz and port it to Tailwind v4 CSS-first syntax, then use it everywhere
4. **Add `GEMINI_API_KEY`** to baz `.env.local` — This unlocks book embeddings immediately
5. **Port book RAG to empire** — Same code, Gemini embeddings, KnowledgeScreen

The book RAG code I wrote is ready. The data pipeline code is ready. The agents have the `knowledge` agent added. What's left is: set the keys, upload books, and start querying.