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

## What's Included

### Layout Components
| Asset | File | Purpose |
|------|------|---------|
| **Logo** | `components/logo.css` | Wordmark + mark, compact, icon, on-dark variants |
| **Header** | `components/header.css` | Sticky glassmorphism nav, mobile responsive, scroll shadow |
| **Footer** | `components/footer.css` | 4-column grid, social links, bottom bar |
| **Hero** | `aether.css` | Full-viewport hero with radial gradient background |

### Surface Components
| Asset | File | Purpose |
|------|------|---------|
| **Card** | `components/card.css` | 5 variants (default, flat, bordered, ghost, highlight) + responsive grid |
| **Paper** | `components/paper.css` | Long-form article/documentation surface, 3 variants |
| **Document** | `components/document.css` | Invoice/contract/letter template with tables, addresses, seal |

### Action Components
| Asset | File | Purpose |
|------|------|---------|
| **Button** | `components/button.css` | 6 variants × 5 sizes + icon, block, connected group |
| **Input** | `components/input.css` | Text, textarea, select, checkbox, radio, toggle |
| **Table** | `components/table.css` | Data table with striped variant, responsive wrapper |

### Feedback Components
| Asset | File | Purpose |
|------|------|---------|
| **Alert** | `components/utilities.css` | 4 severity levels with icon support |
| **Badge** | `components/utilities.css` | 6 colors, 3 sizes, dot indicator |
| **Toast** | `components/toast.css` | Notification toasts with enter/exit animation |
| **Modal** | `components/modal.css` | Dialog overlay with 4 sizes, responsive bottom sheet |

### Identity Components
| Asset | File | Purpose |
|------|------|---------|
| **Avatar** | `components/avatar.css` | 6 sizes, status dots, stack with counter |
| **Skeleton** | `components/skeleton.css` | Shimmer loading placeholders |

### Navigation Components
| Asset | File | Purpose |
|------|------|---------|
| **Breadcrumb** | `components/utilities.css` | Navigation trail |
| **Tabs** | `components/utilities.css` | Tab navigation |
| **Tooltip** | `components/utilities.css` | Hover hints, top + bottom |
| **Separator** | `components/utilities.css` | 5 divider styles |

## Architecture

```
brand-aether/
├── tokens/
│   └── aether.css            ← THE SEED (3 values → entire brand)
├── components/
│   ├── logo.css               ← wordmark + mark + variants
│   ├── header.css             ← sticky nav + mobile + scroll state
│   ├── footer.css             ← 4-column grid + social
│   ├── card.css               ← 5 variants + grid
│   ├── paper.css              ← long-form article surface
│   ├── document.css           ← invoice/contract/formal
│   ├── button.css             ← 6 variants × 5 sizes
│   ├── input.css              ← form controls
│   ├── avatar.css             ← identity + status + stack
│   ├── skeleton.css           ← shimmer loading
│   ├── toast.css              ← notification toasts
│   ├── modal.css              ← dialog overlay
│   ├── table.css              ← data table
│   └── utilities.css          ← badge, alert, separator, breadcrumb, tabs, tooltip
├── aether.css                 ← master import + reset + layout + hero
├── showcase.html              ← living demo with interactive seed slider
└── README.md
```

## Quick Start

1. Open `showcase.html` in a browser
2. Drag the **Hue** slider — watch every component recompute in real time
3. Drag the **Saturation** slider — see vibrancy shift globally
4. Edit `--seed-hue` in `tokens/aether.css` to make it permanent

## Accessibility

Every component includes:

- **Focus rings** — `:focus-visible` outlines using `--ring-color` and `--ring-width`
- **Reduced motion** — `@media (prefers-reduced-motion: reduce)` zeroes all durations and linearizes easing
- **High contrast** — `@media (prefers-contrast: more)` strengthens borders and widens rings
- **Skip link** — built-in `.skip-link` class
- **Screen reader** — `.sr-only` utility class
- **ARIA** — landmark roles, labels, and `aria-current` in the showcase
- **Semantic HTML** — `<header>`, `<main>`, `<nav>`, `<footer>`, `<article>`
- **Color contrast** — WCAG AA minimum on all text/background combinations

## Dark Mode

Automatic. The system uses `prefers-color-scheme: dark` to:

- Invert the entire neutral palette
- Adjust primary/accent lightness for dark backgrounds
- Strengthen shadows for perceptual consistency
- Flip semantic aliases (`--fg`, `--bg`, `--border`)

## Print

`.paper` and `.document` include `@media print` styles that strip decorative chrome for clean output. The global print rule adds:

- White background, black text
- `.no-print` elements hidden
- Scrollbar hidden
- Underlined links

## Typography System

| Token | Size | Line Height | Use |
|-------|------|-------------|-----|
| `--text-2xs` | 0.512rem | — | Micro labels |
| `--text-xs` | 0.64rem | — | Captions, badges |
| `--text-sm` | 0.8rem | 1.55 | Body small |
| `--text-base` | 1rem | 1.55 | Body default |
| `--text-md` | 1.25rem | 1.3 | Subheadings |
| `--text-lg` | 1.563rem | 1.3 | H3 |
| `--text-xl` | 1.953rem | 1.15 | H2 |
| `--text-2xl` | 2.441rem | 1.15 | H1 |
| `--text-3xl` | 3.052rem | 1.1 | Hero title |
| `--text-4xl` | 3.815rem | 1.1 | Display |

All computed from `--ratio: 1.25` (Major Third). Change one number, the entire type scale shifts.

## Rebranding Guide

| Want to… | Change this |
|-----------|-------------|
| Change brand color | `--seed-hue` (0–360) |
| Adjust vividness | `--seed-sat` (0–100%) |
| Adjust lightness | `--seed-lum` (0–100%) |
| Shift accent color | Modify the `+ 30` in `--color-accent` |
| Change fonts | `--font-sans`, `--font-mono`, `--font-serif` |
| Change type scale | `--ratio` (try 1.125, 1.25, 1.333, 1.5) |
| Change border roundness | All `--radius-*` tokens |
| Change spacing density | All `--space-*` tokens |
| Change shadow depth | All `--shadow-*` tokens |

## Zero Runtime

- **0 JavaScript** for styling (the showcase has 3 optional JS enhancements)
- **0 build step** — just CSS custom properties
- **0 dependencies** — no npm, no framework, no preprocessor
- **The cascade is the algorithm**

## License

Use freely. The aether has no owner.
