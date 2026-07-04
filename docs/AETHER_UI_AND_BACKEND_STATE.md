# ÆTHER UNIFIED UI + BACKEND STATE
## The definitive audit of what's running, what's empty, and what's next

---

## ÆTHER DESIGN SYSTEM — The Single UI Truth

Your Æther system (in `baz/app/globals.css`) is the unified design system. Here's what it specifies:

```
COLOR SYSTEM
─────────────────────────────────────────────────
Hue:        260° (violet-dark, monochrome)
Accent:     270° (violet, golden angle from 260°)
Success:    145° (emerald)
Warning:    38° (amber)
Danger:     8° (red)
Info:       210° (blue)

LAYERS (dark → light, all hue-260°):
  L0 The Void      hsl(260, 14%, 3.9%)   = --background / --bg
  L2 The Shadow     hsl(260, 12%, 9%)     = --popover / --sidebar
  L3 The Surface   hsl(260, 11%, 13%)     = --card / --paper
  L4 The Raised    hsl(260, 10%, 18%)     = --secondary / --muted / --input
  L5 The Hover     hsl(260, 12%, 24%)     = hover states
  L6 The Focus     hsl(260, 15%, 32%)     = --ring
  Text Primary    hsl(260, 8%, 98%)       = --foreground / --ink
  Text Secondary  hsl(260, 6%, 65%)       = --muted-foreground
  Border          hsla(260, 10%, 60%, 0.144) = Fibonacci cloud-opacity

TYPOGRAPHY (all Fibonacci px)
  8 · 10 · 13 · 16 · 21 · 34 · 55 · 89 · 144
  Line-height: size × φ (1.618)
  Display: Fraunces (serif)
  Sans: Inter
  Mono: JetBrains Mono

RADIUS (Fibonacci px)
  3 · 5 · 8 · 13 · 21 · 34 · 55 · 89

SHADOWS (glass system)
  .shadow-glass     = 8px blur, α=0.089
  .shadow-glass-lg  = 13px blur, α=0.089
  .shadow-glass-xl  = 21px blur, α=0.144

GLASS
  .glass / .card-glass = α=0.55 + blur(13px) + saturate(1.618)
  .glass-opaque        = α=0.92 + blur(13px)

DURATION (Fibonacci ms)
  89 · 144 · 233 · 377 · 610 · 987

EASING (golden-ratio beziers)
  --ease-natural  = cubic-bezier(0.618, 0, 0.618, 1)
  --ease-glide    = cubic-bezier(0.236, 0.618, 0.236, 1)
  --ease-snap     = cubic-bezier(0.382, 0, 0.236, 1)
  --ease-float    = cubic-bezier(0.618, 0, 0.382, 1)
```

This is the system. Everything below should use these tokens.

---

## BACKEND STATE — What's Real Right Now

### baz (Marketing Site + API)

```
┌────────────────────────────────────────────────────────────────┐
│ DATABASE: data/baz.db (280KB, SQLite, WAL mode)              │
├────────────────────────────────────────────────────────────────┤
│ Table              │ Rows  │ Status                            │
├────────────────────┼───────┼───────────────────────────────────┤
│ users              │ 132   │ 131 are test/e2e users           │
│ leads              │ 166   │ Last 5 are test leads            │
│ customers          │   3   │ Seeded sample data               │
│ projects           │   3   │ Seeded sample data               │
│ subscriptions      │   0   │ Empty                            │
│ invoices           │   0   │ Empty                            │
│ feedback           │   0   │ Empty                            │
│ feedback_requests  │   0   │ Empty                            │
│ ai_jobs            │   0   │ Never used                       │
│ audit              │ 572   │ 571 are bootstrap/test entries     │
│ sessions           │  98   │ Expired test sessions             │
│ orgs               │   0   │ Empty                            │
│ metrics            │   —   │ TABLE DOES NOT EXIST YET         │
│ books              │   —   │ TABLE DOES NOT EXIST YET         │
│ book_chunks        │   —   │ TABLE DOES NOT EXIST YET         │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ ENVIRONMENT VARIABLES (non-sensitive)                          │
├────────────────────────────────────────────────────────────────┤
│ NEXT_PUBLIC_SITE_URL     = http://localhost:3000              │
│ NEXT_PUBLIC_BOOKING_URL  = (empty — no Cal.com linked)        │
│ NEXT_PUBLIC_BRANDS_SCALED= 60+                                 │
│ NEXT_PUBLIC_TEAM_SIZE     = 6                                  │
│ SUPABASE_URL             = https://uyqgm...supabase.co       │
│ SUPABASE_JWKS_URL        = https://uyqgm.../jwks.json        │
│ SUPABASE_DB_URL          = (empty — not connected)            │
│ LEAD_SCORING             = on                                  │
│ OWNER_EMAIL              = owner@baz.agency                   │
│ NOTIFY_FROM               = BAZ Site <noreply@baz.agency>     │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ API KEYS — WHAT'S ACTUALLY CONFIGURED                          │
├────────────────────────────────────────────────────────────────┤
│ OPENAI_API_KEY            = ❌ NOT SET                         │
│ ANTHROPIC_API_KEY         = ❌ NOT SET                         │
│ OLLAMA_HOST               = ❌ NOT SET (not running)          │
│ GEMINI_API_KEY            = ❌ NOT SET IN BAZ                 │
│ RESEND_API_KEY             = ⚠️ EMPTY (key exists but empty)  │
│ STRIPE_SECRET_KEY         = ❌ NOT SET                         │
│ GOOGLE_ANALYTICS_PROP_ID  = ❌ NOT SET                         │
│                                                             │
│ ⟹ NO AI PROVIDER IS ACTIVE. ALL AGENTS RETURN STUBS.        │
│ ⟹ NO EMAIL SENDING. NO REVENUE DATA. NO ANALYTICS.          │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ SERVER STATUS                                                  │
├────────────────────────────────────────────────────────────────┤
│ Running?       NO — nothing on port 3000                      │
│ PM2?           Only marketing-hub registered (not running)    │
│ Process?       Only code-server on :8080                       │
│ Ollama?        NOT running                                     │
│ Build errors?  18 TS errors (ignoreBuildErrors: true)          │
└────────────────────────────────────────────────────────────────┘
```

### empire/nova-shell (The OS)

```
┌────────────────────────────────────────────────────────────────┐
│ DATABASE: Firebase (gen-lang-client-0813610481)               │
├────────────────────────────────────────────────────────────────┤
│ Status         = Firebase project exists, config present      │
│ Auth           = Google sign-in configured                     │
│ Firestore      = Real-time sync (useVoidStore)                │
│ Storage        = Firebase Storage (file uploads)              │
│ Local DB       = NONE (all data in Firebase)                  │
│                                                             │
│ ⟹ Firebase is the ONLY data store. No local fallback.        │
│ ⟹ No SQLite. No Supabase. Pure Firebase.                    │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ AI STATUS                                                      │
├────────────────────────────────────────────────────────────────┤
│ Provider       = Google Gemini only                            │
│ Key location   = .env.local (NOT in baz)                      │
│ Model          = gemini-2.5-flash (default)                    │
│ Fallback       = openrouter (NOT configured)                   │
│ Local          = ollama (NOT configured)                        │
│                                                             │
│ ⟹ Gemini is the ONLY AI path. Key exists in nova-with-bank   │
│   .env.local but NOT in baz or empire nova-shell.            │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ SERVER STATUS                                                  │
├────────────────────────────────────────────────────────────────┤
│ Running?       NO — no Vite dev server                        │
│ Build errors?  18+ TS errors (unused vars, unknown types)    │
│ Screens        = 30+ (all AI-batched, same timestamp)        │
└────────────────────────────────────────────────────────────────┘
```

### marketing-hub (The SaaS)

```
┌────────────────────────────────────────────────────────────────┐
│ DATABASE: data/hub.sqlite (SQLite, WAL)                       │
├────────────────────────────────────────────────────────────────┤
│ 117 TABLES. This is your real data store.                      │
│                                                             │
│ USERS & AUTH                                                  │
│   users                  = 1 row (admin@roi.marketing)         │
│   sessions               = 3                                  │
│   login_attempts         = 1                                  │
│   password_reset_tokens  = 2                                  │
│                                                             │
│ CRM & CONTACTS                                               │
│   contacts               = 76                                 │
│   companies              = 8                                  │
│   deals                  = 30                                 │
│   marketing_leads        = 12                                 │
│   touchpoints            = 661  ← REAL engagement data       │
│   sequence_enrollments   = 141                                │
│   conversations          = 24                                  │
│                                                             │
│ CONTENT & MARKETING                                           │
│   campaigns              = 9                                  │
│   content                = 11                                 │
│   emails                 = 5                                  │
│   dive_articles          = 136  ← The Wire content            │
│   dive_library           = 10                                 │
│   lead_magnets           = 12                                 │
│   landing_pages          = 2                                  │
│   forms                  = 7                                  │
│   form_submissions       = 1                                  │
│   copy_templates         = 0                                  │
│                                                             │
│ FINANCE                                                       │
│   chart_of_accounts      = 40  ← Real chart                  │
│   journal_entries         = 9                                  │
│   journal_lines          = 18                                 │
│   revenue_events         = 37  ← Real revenue                 │
│   fx_rates               = 30                                 │
│   expenses              = 0                                  │
│   payroll_runs           = 0                                  │
│   tax_codes              = 40                                 │
│                                                             │
│ ADS & ATTRIBUTION                                             │
│   ad_accounts            = 4                                  │
│   ad_campaigns           = 19                                 │
│   ad_groups              = 33                                 │
│   ad_audit_log           = 8898  ← REAL ad audit data        │
│   ad_sync_jobs           = 191                                │
│                                                             │
│ INTELLIGENCE & NOVA                                           │
│   nova_history           = 3                                  │
│   nova_finance_runs      = 11                                 │
│   orchestrator_agent_runs = 3                                 │
│   orchestrator_tasks     = 15                                │
│   orchestrator_campaigns = 1                                  │
│   orchestrator_milestones= 5                                 │
│   agent_runs              = 0                                 │
│   agents                 = 0                                  │
│                                                             │
│ WORKSPACE                                                     │
│   workspaces             = 1                                  │
│   workspace_members      = 10                                 │
│   workspace_invites     = 5                                  │
│   workspace_domains      = 1                                  │
│   workspace_audit        = 2                                  │
│   settings               = 7                                  │
│                                                             │
│ OTHER                                                         │
│   testimonials            = 20                                 │
│   personas               = 10                                 │
│   surveys                = 8                                  │
│   funnels                = 6                                  │
│   experiments            = 8                                  │
│   budget_items           = 32                                 │
│   automations            = 7                                  │
│   brand_assets           = 26                                 │
│   integrations           = 10                                 │
│   webhook_deliveries    = 17444  ← Real webhook data         │
│   market_quotes          = 19                                 │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ DEPLOYMENT                                                     │
├────────────────────────────────────────────────────────────────┤
│ Production URL = https://marketing-hub-roan.vercel.app        │
│ Host           = roi.marketing                                │
│ Supabase       = https://fgjxkexgopllieggucws.supabase.co    │
│ OpenAI         = (key exists but status unknown)              │
│ PM2            = Registered but NOT running                    │
│                                                             │
│ ⟹ This is your most data-rich project.                       │
│ ⟹ 661 touchpoints, 8898 ad audit records, 17444 webhooks.   │
│ ⟹ It has REAL financial data: journal entries, revenue, FX.   │
└────────────────────────────────────────────────────────────────┘
```

### baz-redesign (New Design)

```
┌────────────────────────────────────────────────────────────────┐
│ DATABASE: NONE                                                │
│ AUTH: NONE                                                    │
│ API: NONE                                                     │
│ ENV: NONE (no .env.local)                                     │
│                                                             │
│ ⟹ Pure static Next.js 15 site. 2 pages. No backend.          │
└────────────────────────────────────────────────────────────────┘
```

---

## THE GAP — What's Missing to Go Live

```
┌──────────────────────────────────────────────────────────────────┐
│                    WHAT'S MISSING                                 │
├───────────────────┬──────────────────────────────────────────────┤
│ Piece              │ Status                                     │
├───────────────────┼──────────────────────────────────────────────┤
│ AI keys in baz     │ ❌ NO KEYS. Agents return stubs.          │
│ Email sending      │ ⚠️  RESEND key empty. No outbound email.  │
│ Stripe payments    │ ❌ NO STRIPE KEY. No billing.             │
│ Google Analytics   │ ❌ NO GA4. No traffic data.                │
│ Supabase wired     │ ⚠️  URL exists but DB_URL empty.          │
│ Metrics table      │ ❌ DOESN'T EXIST in baz.db               │
│ Books table        │ ❌ DOESN'T EXIST in baz.db                │
│ Ollama running     │ ❌ NOT STARTED                             │
│ Any server running │ ❌ NOTHING RUNNING ON ANY PORT             │
│ Real leads         │ ⚠️  166 rows, but last 5 are test data    │
│ Real customers      │ ⚠️  3 rows, all seeded samples           │
│ Marketing-hub→baz  │ ❌ NO SYNC. Two separate DBs.             │
│ baz↔empire sync    │ ❌ NO SYNC. SQLite vs Firebase.            │
│ baz-redesign backend│ ❌ NONE AT ALL.                          │
└───────────────────┴──────────────────────────────────────────────┘
```

---

## IMMEDIATE ACTION PLAN

### Step 0: Start Something (2 minutes)

```bash
# Start baz dev server
cd /home/uzer/baz && npm run dev &
# Start marketing-hub dev server
cd /home/uzer/marketing-hub && npm run dev &
```

### Step 1: Set API Keys (5 minutes)

You need AT LEAST ONE AI key. Gemini is free-tier (1500 req/min).

```bash
# Copy Gemini key from nova-with-bank to baz
# (The key is in /home/uzer/nova-with-bank/.env.local)

# Add to baz/.env.local:
echo 'GEMINI_API_KEY=YOUR_KEY_HERE' >> /home/uzer/baz/.env.local
echo 'AI_PROVIDER=gemini' >> /home/uzer/baz/.env.local

# Also set the Resend key for email:
# echo 'RESEND_API_KEY=re_xxxxx' >> /home/uzer/baz/.env.local
```

### Step 2: Initialize the New Tables (1 minute)

```bash
cd /home/uzer/baz
node -e "
const Database = require('better-sqlite3');
const db = new Database('data/baz.db');

// Books table
db.exec(\`
  CREATE TABLE IF NOT EXISTS books (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    author      TEXT NOT NULL,
    tags        TEXT NOT NULL DEFAULT '[]',
    format      TEXT NOT NULL DEFAULT 'txt',
    source      TEXT NOT NULL DEFAULT 'upload',
    chunk_count INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0,
    status      TEXT NOT NULL DEFAULT 'processing',
    created_at  INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000)
  );
  CREATE TABLE IF NOT EXISTS book_chunks (
    id              TEXT PRIMARY KEY,
    book_id         TEXT NOT NULL,
    content         TEXT NOT NULL,
    chapter         TEXT NOT NULL DEFAULT 'Introduction',
    chapter_index   INTEGER NOT NULL DEFAULT 0,
    chunk_index     INTEGER NOT NULL DEFAULT 0,
    token_count     INTEGER NOT NULL DEFAULT 0,
    start_offset    INTEGER NOT NULL DEFAULT 0,
    end_offset      INTEGER NOT NULL DEFAULT 0,
    embedding       TEXT NOT NULL DEFAULT '[]',
    created_at      INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000),
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS idx_book_chunks_book ON book_chunks(book_id);
  CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);

  CREATE TABLE IF NOT EXISTS metrics (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    date        TEXT NOT NULL,
    metric      TEXT NOT NULL,
    value       REAL NOT NULL,
    source      TEXT NOT NULL,
    meta        TEXT,
    created_at  INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000)
  );
  CREATE INDEX IF NOT EXISTS idx_metrics_date ON metrics(date);
  CREATE INDEX IF NOT EXISTS idx_metrics_metric ON metrics(metric);
  CREATE INDEX IF NOT EXISTS idx_metrics_source ON metrics(source);
\`);

console.log('✅ Books, book_chunks, and metrics tables created');

// Verify
const tables = db.prepare(\"SELECT name FROM sqlite_master WHERE type='table' ORDER BY name\").all();
tables.forEach(t => {
  const count = db.prepare('SELECT COUNT(*) as n FROM ' + t.name).get();
  console.log('  ' + t.name + ': ' + count.n + ' rows');
});

db.close();
"
```

### Step 3: Migrate Æther to Tailwind v4 (for baz-redesign + empire)

The Æther system is currently in Tailwind v3 syntax. Here's what it needs to become for Tailwind v4:

```css
/* Æther for TW v4 — @theme inline instead of tailwind.config.ts */
@import "tailwindcss";

@theme inline {
  /* Æther Color System — hue-260 monochrome */
  --color-background: hsl(260, 14%, 3.9%);
  --color-foreground: hsl(260, 8%, 98%);
  --color-card: hsl(260, 11%, 13%);
  --color-card-foreground: hsl(260, 8%, 98%);
  /* ... (all Æther tokens ported to TW v4 syntax) */
  
  /* Æther Typography — Fibonacci px */
  --font-display: 'Fraunces', ui-serif, Georgia, serif;
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  
  /* Æther Radius — Fibonacci */
  --radius: 8px;
  --radius-sm: 5px;
  --radius-lg: 13px;
  --radius-xl: 21px;
}
```

This is the full migration path: keep every Æther value, just change the syntax from `tailwind.config.ts` + CSS vars → `@theme inline` + CSS vars.

---

## SUMMARY

| Metric | baz | marketing-hub | empire | baz-redesign |
|--------|-----|--------------|--------|-------------|
| **Real data rows** | 166 leads, 132 users | 661 touchpoints, 8898 ad records, 17444 webhooks | Firebase (unknown) | 0 |
| **AI working?** | ❌ No keys | Unknown | ✅ Gemini (with key) | ❌ No backend |
| **Email working?** | ⚠️ Key empty | Unknown | N/A | ❌ No backend |
| **Server running?** | ❌ No | ❌ No | ❌ No | ❌ No |
| **Database** | SQLite (280KB) | SQLite (117 tables!) | Firebase | None |
| **Tables created** | 12 + 3 new | 117 | Cloud | 0 |
| **Design system** | Æther (TW v3) | Brand + shadcn | MD3 Galaxy | Monochrome + shadcn |

**The single most impactful thing you can do right now**: Set `GEMINI_API_KEY` and `AI_PROVIDER=gemini` in `baz/.env.local`, then start the dev server. Everything else (books, metrics, data pipeline) flows from that.