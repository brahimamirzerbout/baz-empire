# Æther — Algorithmic Brand Asset System

> *One seed. Infinite consistency. The cascade is the algorithm.*

## Philosophy

Traditional design systems are museums — static, curated, rigid. **Æther** is an algorithm. Every visual property is **computed** from three seed variables in `tokens/aether.css`:

```css
--seed-hue: 240;    /* 0–360 → changes the entire brand color */
--seed-sat: 72%;    /* 0–100% → adjusts saturation globally */
--seed-lum: 50%;    /* 0–100% → adjusts lightness globally */
```

Change `--seed-hue` from `240` to `15`, and the entire system pivots from indigo authority to amber warmth. No component files touched. No find-and-replace. The cascade recomputes everything.

## Architecture

```
brand-aether/
├── tokens/
│   └── aether.css              ← THE SEED (3 values → 254+ derived tokens)
├── components/
│   ├── logo.css                ← wordmark + mark + variants
│   ├── header.css              ← sticky nav + mobile + scroll state
│   ├── footer.css              ← 4-column grid + social
│   ├── card.css                ← 5 variants + grid
│   ├── paper.css               ← long-form article surface
│   ├── document.css            ← invoice/contract/formal
│   ├── button.css              ← 6 variants × 5 sizes
│   ├── input.css               ← form controls (text, select, checkbox, radio, toggle)
│   ├── avatar.css              ← identity + status + stack
│   ├── skeleton.css            ← shimmer loading
│   ├── toast.css               ← notification toasts
│   ├── modal.css               ← dialog overlay
│   ├── table.css               ← data table
│   └── utilities.css           ← badge, alert, separator, breadcrumb, tabs, tooltip
├── aether.css                  ← master import + reset + layout + hero + print
├── index.html                  ← marketing landing page with live seed demo
├── showcase.html               ← living component demo with interactive seed
├── login.html                  ← sign-in with Supabase email/password
├── signup.html                 ← account creation
├── dashboard.html              ← authenticated dashboard with palette preview
├── js/
│   ├── supabase.js             ← browser-side Supabase client (auth helpers)
│   └── config.example.js       ← copy to config.js with your credentials
├── api/
│   ├── projects.js             ← CRUD for projects
│   ├── tokens.js               ← CRUD for design tokens
│   └── assets.js               ← CRUD for brand assets + storage
├── src/lib/
│   └── supabase.js             ← server-side Supabase client (API functions)
├── supabase/
│   ├── config.toml             ← local Supabase configuration
│   └── migrations/
│       ├── 20260704000001_initial_schema.sql  ← profiles table + RLS
│       └── 20260704000002_tokens_and_assets.sql ← projects, tokens, assets
├── scripts/
│   └── inject-env.mjs          ← generates config.js from env vars at deploy
├── vercel.json                 ← static deploy + API function config
├── package.json                ← dependencies for API functions
└── README.md
```

## Quick Start

### Static preview (no backend needed)
```bash
npx serve . -p 8080 -s
# Open http://localhost:8080
# Browse showcase.html, index.html
```

### Full stack (with Supabase)
```bash
# 1. Start local Supabase
supabase start

# 2. Create config file
cp js/config.example.js js/config.js

# 3. Serve
npx serve . -p 8080 -s
```

## Pages

| Page | Purpose | Auth Required |
|------|---------|---------------|
| `index.html` | Marketing landing: seed demo, feature grid, token palettes, code window | No |
| `showcase.html` | Living component demo: all 18 components with interactive seed slider | No |
| `login.html` | Sign in with email/password | No |
| `signup.html` | Create account | No |
| `dashboard.html` | User dashboard: session info, palette preview, seed display | Yes |

## Supabase Auth

Auth uses Supabase with email/password. Session is managed via `js/supabase.js`:

```js
import { signIn, signUp, signOut, getSession } from './js/supabase.js'
```

### Auth flow
```
index.html → login.html → (sign in) → dashboard.html
           → signup.html → (sign up) → dashboard.html
           → showcase.html (public)
```

Set environment variables for production:
- `VITE_SUPABASE_URL` — your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — your Supabase anon key

### Database tables (auto-created by migrations)
- `profiles` — extends auth.users (seed_hue, full_name, avatar_url)
- `projects` — brand projects with seed values
- `design_tokens` — token overrides per project
- `brand_assets` — uploaded brand files linked to storage

## Zero Runtime (CSS)

- **0 JavaScript** for styling (sliders are demo-only enhancements)
- **0 build step** — CSS custom properties in the browser
- **0 dependencies** for the frontend — no npm, no framework

API functions use `@supabase/supabase-js` and `@vercel/node`.

## Accessibility

Every component includes:

- **Focus rings** — `:focus-visible` outlines using `--ring-color` and `--ring-width`
- **Reduced motion** — `@media (prefers-reduced-motion: reduce)` zeroes all durations
- **High contrast** — `@media (prefers-contrast: more)` strengthens borders and widens rings
- **Skip link** — `.skip-link` on every page
- **Screen reader** — `.sr-only` utility
- **ARIA** — landmark roles, labels, `aria-current`
- **Semantic HTML** — `<header>`, `<main>`, `<nav>`, `<footer>`, `<article>`
- **WCAG AA** — color contrast on all text/background combinations

## Dark Mode

Automatic via `prefers-color-scheme: dark`:
- Inverts the neutral palette
- Adjusts primary/accent for dark backgrounds
- Strengthens shadows
- Flips all semantic aliases (`--fg`, `--bg`, `--border`)

## Print

Every component includes `@media print` styles. Global print rules:
- White background, black text
- `.no-print` elements hidden
- Scrollbar hidden
- Underlined links

## Typography

| Token | Size | Use |
|-------|------|-----|
| `--text-2xs` | 0.512rem | Micro labels |
| `--text-xs` | 0.64rem | Captions |
| `--text-sm` | 0.8rem | Body small |
| `--text-base` | 1rem | Body default |
| `--text-md` | 1.25rem | Subheadings |
| `--text-lg` | 1.563rem | H3 |
| `--text-xl` | 1.953rem | H2 |
| `--text-2xl` | 2.441rem | H1 |
| `--text-3xl` | 3.052rem | Hero title |
| `--text-4xl` | 3.815rem | Display |

Computed from `--ratio: 1.25` (Major Third).

## Rebranding Guide

| Want to… | Change this |
|----------|-------------|
| Change brand color | `--seed-hue` (0–360) |
| Adjust vividness | `--seed-sat` (0–100%) |
| Adjust lightness | `--seed-lum` (0–100%) |
| Shift accent color | Modify the `+ 30` in `--color-accent` |
| Change fonts | `--font-sans`, `--font-mono`, `--font-serif` |
| Change type scale | `--ratio` (try 1.125, 1.25, 1.333, 1.5) |
| Border roundness | All `--radius-*` tokens |
| Spacing density | All `--space-*` tokens |
| Shadow depth | All `--shadow-*` tokens |

## Deployment (Vercel)

1. Push to GitHub
2. Import at https://vercel.com/new
3. Set env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
4. Deploy — `buildCommand: "node scripts/inject-env.mjs"` generates `js/config.js` at build time
5. The `vercel.json` maps `/api/*` to serverless functions

## License

Use freely. The aether has no owner.
