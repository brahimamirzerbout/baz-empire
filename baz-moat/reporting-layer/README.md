# baz-reporting-layer

> BAZ white-label client reporting dashboard. Midnight Terminal dark theme.
> **Sub-1.5s LCP target** — server-rendered, no client JS, no images, font-display swap.
> Revenue-not-vanity metrics. The higher-switching-cost moat (70% of agencies say
> reporting drives retention).

## What it renders

Reads a `DiagnosticReport` JSON (emitted by `baz-moat diagnostic --json`) and shows:
- the **10× guarantee badge** (risk-reversal signal)
- the monthly + annual **revenue leak** as headline metrics
- the **Tracking Default audit table** (component × status × effective leak × annual $)
- the **next logical yes** (Deiss lifecycle → Core/Growth retainer)

## Stack

- Next.js 15 (App Router) + React 19, **server components only** (zero client JS on the report view)
- `next/font` Inter + JetBrains Mono (self-hosted, `display: swap`, no layout shift)
- Plain CSS globals (no Tailwind, no CSS-in-JS runtime) — minimal critical CSS
- Midnight Terminal tokens in `lib/theme.ts` (the canonical brand spec)

## Dev

```bash
cd ~/baz-moat/reporting-layer
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (proves it compiles + prerenders)
```

## Feeding it data

The dashboard loads `data/sample-report.json`. To regenerate from a real client audit:

```bash
cd ~/baz-moat
npx tsx src/index.ts diagnostic \
  --client "Acme SaaS" --revenue 250000 --channel meta --markets EU,US \
  --finding ssgtm=partial --finding ga4=present --finding capi-meta=missing \
  --json > reporting-layer/data/sample-report.json
```

In production, swap `lib/report.ts → getReport()` for a Supabase fetch keyed by
`client_id`. The `DiagnosticReport` shape is the contract.

## Brand compliance (enforced in `lib/theme.ts`)

- Dark mode only: bg `#020617`, surface `#0B1120`, border `rgba(255,255,255,.10)`
- Accent/signal `#22D3EE` (CTAs, key metrics), depth `#818CF8`, success `#10B981` sparingly
- Square corners (`radius.none` default; `radius.pill` only for the guarantee badge)
- Inter (ui) + JetBrains Mono (metrics/tags), tabular-nums on numbers
- Motion ≤200ms, fade-in-up only, `prefers-reduced-motion` aware (globals.css)