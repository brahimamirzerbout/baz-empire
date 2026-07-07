# Æther — Algorithmic Brand Asset System
> *One seed. Infinite consistency. The cascade is the algorithm.*

## Philosophy
Traditional design systems are museums — static, curated, rigid. **Æther** is an algorithm. Every visual property is **computed** from three seed variables in `tokens/aether.css`:

```css
--seed-hue: 41;     /* Derived from BAZ Gold */
--seed-sat: 72%;    
--seed-lum: 50%;    
```

Change `--seed-hue` and the entire system pivots. No component files touched. No find-and-replace. The cascade recomputes everything.

## What's Included
- **Layout:** Logo system, sticky glass headers, 4-column footers, and viewport heroes.
- **Surfaces:** 5 card variants, long-form Paper surfaces, and formal Document templates.
- **Actions:** 6 button variants × 5 sizes, full form primitive set, and responsive data tables.
- **Feedback:** Alerts, badges, enter/exit animated toasts, and responsive modals.
- **Identity:** 6 avatar sizes, status indicators, and avatar stacks.
- **Navigation:** Breadcrumbs, tabs, tooltips, and calibrated separators.

## Architecture
```
brand-aether/
├── tokens/
│   └── aether.css            ← THE SEED
├── components/
│   ├── logo.css               ← wordmark + mark
│   ├── header.css             ← sticky nav + mobile
│   ├── footer.css             ← 4-column grid
│   ├── card.css               ← 5 variants + grid
│   ├── paper.css              ← long-form article
│   ├── document.css           ← invoice/contract
│   ├── button.css             ← 6 variants × 5 sizes
│   ├── input.css              ← form controls
│   ├── avatar.css             ← identity + stack
│   ├── skeleton.css           ← shimmer loading
│   ├── toast.css              ← notification toasts
│   ├── modal.css              ← dialog overlay
│   ├── table.css              ← data table
│   └── utilities.css          ← badge, alert, nav
├── aether.css                 ← master import + reset
├── showcase.html              ← interactive demo
└── README.md
```

## Zero Runtime
- **0 JavaScript** for styling.
- **0 build step** — just CSS custom properties.
- **0 dependencies** — no npm, no framework.
- **The cascade is the algorithm.**