# ÆTHER Frontend Audit — vs. Marketing Hub Design Algorithm

**Date:** July 2026  
**Auditor:** Frontend Agent  
**Source Algorithm:** `~/marketing-hub/src/styles/aether-design-system.ts` + `aether-monochrome.css` + `baz-brand.css`

---

## EXECUTIVE SUMMARY

The current `index.html` is a **solid B+ landing page**. But ÆTHER's signature is **performative, effective, luxurious** — and the marketing hub's design system encodes **mathematical perfection** through Fibonacci spacing, golden-ratio typography, 8-layer darkness, 6-layer silk backgrounds, glass materials, and golden-ratio easing curves.

Our current page uses **arbitrary values**. The algorithm demands **Fibonacci values**.

**Current Score: 6/10**  
**Target Score: 10/10**

---

## PAGE-BY-PAGE INSPECTION

### 1. Hero Section

| Element | Current | Algorithm Demands | Gap |
|---------|---------|-------------------|-----|
| Background | Static `radial-gradient` with SVG pattern | 6-layer silk background (silkFlow1/2/3 + conicGradient + sheen + SVG turbulence weave) | ❌ Missing all 6 layers |
| Background motion | None | 4 animated layers (28s, 36s, 22s, 80s cycles) + sheen (18s) + turbulence (30s animated) | ❌ Zero animation |
| Custom cursor | Default browser | Dot (6px) + ring (36px) with `mix-blend-mode: difference`, trailing effect at 0.15 lerp | ❌ Missing |
| Scroll progress | None | 2px progress bar at top, `var(--a-fg)` color | ❌ Missing |
| Noise/grain | None | Body `::before` with fractal noise at 0.025 opacity, `mix-blend-mode: overlay` | ❌ Missing |
| Typography scale | Arbitrary px values (3.5rem, 1.2rem, 0.875rem) | Fibonacci scale: micro(8), tiny(10), xs(13), sm(16), base(21), lg(34), xl(55), xxl(89), display(144) | ❌ Not Fibonacci |
| Line height | 1.6 arbitrary | `F(n) × φ` — e.g., base(21) × 1.618 = 33.9 → 34 | ❌ Not golden ratio |
| Easing | `cubic-bezier(0.4, 0, 0.2, 1)` (Material default) | `cubic-bezier(0.618, 0, 0.618, 1)` (natural) or `cubic-bezier(0.236, 0.618, 0.236, 1)` (glide) | ❌ Wrong curves |
| Animation duration | 0.3s, 0.6s arbitrary | Fibonacci ms: instant(89ms), swift(144ms), fast(233ms), normal(377ms), smooth(610ms), deliberate(987ms) | ❌ Not Fibonacci |
| Hero text | `font-weight: 800` | `font-weight: 900` + `display-xl` class (clamp(3.5rem, 10vw, 9rem)) | ⚠️ Close, not mathematical |
| Section padding | `6rem 0` arbitrary | Fibonacci-responsive: 3rem→4rem→5rem→5.5rem→6rem→7rem→8rem→10rem across 7 breakpoints | ❌ Not responsive Fibonacci |
| Scroll animation | `fadeInUp 0.6s ease` | `fadeUp 0.9s cubic-bezier(.16,1,.3,1)` + `.reveal.in` class-based | ⚠️ Close |
| Shimmer text effect | None | `.shimmer-text` with 6s linear infinite gradient sweep | ❌ Missing |

### 2. Navigation

| Element | Current | Algorithm Demands | Gap |
|---------|---------|-------------------|-----|
| Background | `rgba(15, 10, 30, 0.85) + backdrop-filter: blur(20px)` | `glass-opaque` material (α=0.92, blur=24px, saturate=1.4, highlight inset) | ⚠️ Close, not glass material |
| Logo font | Inter weight 800 | Space Grotesk weight 800 for `Æ`, Inter for body | ⚠️ Has Space Grotesk in CSS but uses Inter |
| Border | `1px solid rgba(108,63,224,0.1)` | `1px solid var(--a-border)` (rgb(28,28,28) = #1c1c1c) | ❌ Wrong color |
| Hover underline | `background: var(--gradient)` | `link-underline::after` with 1px line + cubic-bezier(.16,1,.3,1) width transition | ⚠️ Similar approach |
| CTA button | Gradient background with animation | `btn-primary` — monochrome #f5f5f5 on #070707, brightness(0.94) on hover | ❌ Wrong — should be monochrome, not gradient |
| Badge | `us-badge` with blue background | Monochrome text with `.section-label` (JetBrains Mono, 11px, 0.15em tracking) | ❌ Wrong system |

### 3. Stats Bar

| Element | Current | Algorithm Demands | Gap |
|---------|---------|-------------------|-----|
| Counter animation | `data-count` JS count-up | `shimmer-text` while loading, then `fadeUp` with stagger | ⚠️ Has JS count-up, not shimmer |
| Number size | 2.5rem arbitrary | `display-lg` (clamp(2.5rem, 6vw, 5rem)) + `font-weight: 900` + `letter-spacing: -0.05em` | ⚠️ Close |
| Label | 0.875rem Inter | `.section-label` (JetBrains Mono, 11px, 0.15em tracking, uppercase) | ❌ Wrong typeface/tracking |
| Bar reveal | None | `.bar-reveal` animation (scaleY from 0 to 1, origin bottom, 1s cubic-bezier(.16,1,.3,1)) | ❌ Missing |

### 4. Cards (Service/Pricing/Advantage)

| Element | Current | Algorithm Demands | Gap |
|---------|---------|-------------------|-----|
| Background | `var(--dark2)` = #1A1333 | `.card-base` → `var(--a-card)` = `rgb(var(--surface-2))` = #101010 | ❌ Too light, wrong color |
| Border | `1px solid rgba(108,63,224,0.1)` | `1px solid var(--a-border)` = #1c1c1c | ❌ Wrong |
| Hover | `translateY(-4px) + box-shadow glow` | `.hover-lift` — translateY(-3px), border-color: var(--a-line), shadow-2, cubic-bezier(.16,1,.3,1) | ⚠️ Close |
| Glass effect | None | `.glass` or `.glass-opaque` (blur(24px) saturate(1.4), α=0.92) | ❌ Missing |
| Noise texture | None | `.noise-card::after` with fractal noise at 0.02 opacity | ❌ Missing |
| Card shadow | `var(--shadow)` = arbitrary | `var(--a-shadow-1)` = `0 1px 2px rgba(0,0,0,0.4)` (Fibonacci) | ❌ Wrong |
| Popular badge | Gradient background | Monochrome with `var(--a-fg)` text on `var(--a-bg)` background | ❌ Should be monochrome luxury, not colorful |

### 5. Pricing Section

| Element | Current | Algorithm Demands | Gap |
|---------|------------|-----|
| Price display | Gradient text `var(--gradient)` | `.shimmer-text` effect or monochrome `var(--a-fg)` display-xl | ❌ Should be monochrome or shimmer |
| Popular card | Gradient border + glow | `.glass-smoked` material (α=0.94, blur=32px, heavier frost) | ❌ Wrong material system |
| Grid spacing | `1.5rem` gap | Fibonacci spacing: `var(--aether-space-13)` = 13px or `var(--aether-space-21)` = 21px | ❌ Not Fibonacci |

### 6. Comparison Table

| Element | Current | Algorithm Demands | Gap |
|---------|------------|-----|
| Row hover | `background: rgba(108,63,224,0.03)` | `background: rgb(var(--hover))` = rgb(34,34,34) | ❌ Wrong color |
| Check/cross | CSS classes | Should use `✓`/`✗` with proper monochrome styling | ⚠️ OK |
| Zebra striping | None | `.stripe` pattern or subtle `var(--a-card)` bg on alternating rows | ❌ Missing |

### 7. Process Section

| Element | Current | Algorithm Demands | Gap |
|---------|------------|-----|
| Step number | Gradient circle | Monochrome circle: `var(--a-fg)` text on `var(--a-bg)` bg, `var(--a-border)` ring | ❌ Should be monochrome |
| Layout | `grid-template-columns: repeat(4, 1fr)` | Fibonacci-responsive grid | ⚠️ OK |

### 8. FAQ Section

| Element | Current | Algorithm Demands | Gap |
|---------|------------|-----|
| Toggle | Custom JS `toggleFaq` | `.accordion-body` with `max-height` transition + `.accordion-icon` 45° rotation | ⚠️ Similar |
| Animation | `max-height: 500px` | `max-height: 500px` with `cubic-bezier(.16,1,.3,1)` (correct) | ✅ Matches |
| Item border | `1px solid rgba(108,63,224,0.1)` | `1px solid var(--a-border)` = #1c1c1c | ❌ Wrong |

### 9. CTA Section

| Element | Current | Algorithm Demands | Gap |
|---------|------------|-----|
| Background | Gradient subtle | `.glass-opaque` or `.glass-smoked` material | ❌ Should be glass |
| Button | Gradient `var(--gradient)` | `btn-primary` — monochrome #f5f5f5 on #070707 | ❌ Should be monochrome |

### 10. Footer

| Element | Current | Algorithm Demands | Gap |
|---------|------------|-----|
| Border top | `1px solid rgba(108,63,224,0.1)` | `.divider-gradient` or `1px solid var(--a-border)` | ❌ Wrong |
| Links | `color: var(--primary-light)` | `color: var(--a-muted)` hover → `var(--a-fg)` with `link-underline` effect | ❌ Wrong |
| Section spacing | `padding: 4rem 0` | `.section-footer` responsive Fibonacci padding | ❌ Not responsive Fibonacci |

---

## ANIMATION AUDIT

| Animation | Current | Algorithm (MOTION) | Status |
|-----------|---------|---------------------|--------|
| `fadeInUp` | 0.6s, `ease` | `fadeUp` 0.9s, `cubic-bezier(.16,1,.3,1)` | ❌ Wrong timing/easing |
| `pulse` | 2s, `ease` infinite | `pulseDot` 2s, `ease-out` infinite, scale(1)→(1.8)→(1) | ⚠️ Different scale |
| `float` | `translateY(-10px)`, 6s | `float` `translateY(-8px)`, 6s | ⚠️ Close |
| `gradientShift` | 3s, `ease` infinite | Silk layers: 22s-80s cycles | ❌ Different purpose |
| `scanLine` | 2s linear | `scanLine` — exists | ⚠️ Has it |
| Marquee | 30s linear | `marquee` 30s linear | ✅ Matches |
| Button hover | translateY(-2px) + shadow | `hover-lift`: translateY(-3px) + border-color + shadow, `cubic-bezier(.16,1,.3,1)` | ⚠️ Close |
| Button press | None | `btn-press`: `scale(.97)` at 80ms | ❌ Missing |
| Number count | JS countUp | `shimmer-text` → `fadeUp` with `bar-reveal` | ❌ Different approach |
| Card hover | translateY(-4px) | `hover-lift`: translateY(-3px) + border change | ⚠️ Close |
| Scroll reveal | `IntersectionObserver` → add `.animate-in` | `.reveal` → `.reveal.in` class toggle with `fadeUp` | ⚠️ Similar |
| Silk background | None | 6 layers with 5 keyframe animations | ❌ MISSING — the signature effect |
| Custom cursor | None | Dot + ring + trailing ring with 0.15 lerp | ❌ MISSING |
| Noise grain | None | Body `::before` with SVG turbulence at 0.025 opacity | ❌ MISSING |
| Glass materials | None | 6 glass variants (frosted, smoked, milk, tinted, mirror, etched) | ❌ MISSING |

---

## COLOR AUDIT

| Token | Current | Algorithm (DARK_LAYERS) | Status |
|-------|---------|------------------------|--------|
| Background | `#0F0A1E` (purple-black) | L0: `hsl(260,14%,3.9%)` = `#0a0a0f` (near-black violet) | ❌ Too purple, should be near-black |
| Surface/Card | `#1A1333` | L3: `hsl(260,11%,13%)` = `#1e1e2a` | ⚠️ Close but wrong |
| Text primary | `#FFFFFF` | `hsl(260,8%,98%)` = near-white | ✅ Close enough |
| Text secondary | `#6B7280` (gray-500) | `hsl(260,6%,65%)` = L7+ text | ❌ Wrong hue |
| Border | `rgba(108,63,224,0.1)` (purple-tinted) | `rgb(28,28,28)` = `#1c1c1c` (neutral) | ❌ Purple-tinted, should be neutral |
| Accent/Brand | `#6C3FE0` (violet) + `#FF6B35` (ember) | Monochrome: `#f5f5f5` (near-white on dark) OR gold `#C29B5B` (royal mode) | ❌ Should be monochrome or gold |
| Gradient | `linear-gradient(135deg, #6C3FE0, #FF6B35)` | Monochrome gradient OR `--baz-gold-gradient` | ❌ Should be monochrome |
| Shadow | Arbitrary 3 shadow tokens | Fibonacci shadows with `hsla(260,50%,0%,0.377)` | ❌ Wrong |

---

## TYPOGRAPHY AUDIT

| Element | Current | Algorithm (FONT_SIZE) | Status |
|---------|---------|----------------------|--------|
| Hero H1 | 3.5rem | `display-xl`: `clamp(3.5rem, 10vw, 9rem)` | ⚠️ Responsive missing |
| Section H2 | 2.5rem | `display-lg`: `clamp(2.5rem, 6vw, 5rem)` | ⚠️ Responsive missing |
| Card H3 | 1.25rem | `display-md`: `clamp(2rem, 4vw, 3rem)` | ❌ Too small |
| Body | 1rem (16px) | `base`: 21px (F(8)) | ❌ Not Fibonacci |
| Small/Caption | 0.875rem (14px) | `xs`: 13px (F(7)) | ❌ Not Fibonacci |
| Letter spacing | `-0.03em` headings | `-0.06em` display, `-0.05em` display-lg, `-0.04em` display-md | ❌ Not tight enough |
| Monospace labels | None | `section-label`: JetBrains Mono, 11px, 0.15em tracking, uppercase | ❌ Missing |
| Font stack | Inter + Noto Sans Arabic | Inter (body) + Space Grotesk (display) + JetBrains Mono (code/labels) + Noto Sans Arabic (AR) | ⚠️ Missing JetBrains Mono & Space Grotesk |

---

## FUNCTION AUDIT

| Function | Current | Algorithm | Status |
|----------|---------|-----------|--------|
| Language toggle | `toggleLang()` swapping `data-fr`/`data-ar` | Same approach | ✅ Works |
| FAQ toggle | Custom `toggleFaq()` | `.accordion-body` with CSS transition | ⚠️ Similar |
| Mobile menu | `toggleMenu()` showing/hiding nav | Needs `.glass-opaque` nav material | ⚠️ Works, needs upgrade |
| Number count-up | JS `data-count` animation | `shimmer-text` → `fadeUp` reveal | ❌ Wrong approach |
| Scroll observer | `IntersectionObserver` adding `.animate-in` | `.reveal` → `.reveal.in` | ⚠️ Similar |
| Nav scroll | Background opacity change | `glass-opaque` nav with scroll-aware opacity | ⚠️ Works, needs glass |
| Smooth scroll | `scroll-behavior: smooth` | Same | ✅ Works |
| WhatsApp float | `pulse` animation | `pulse-ring::after` with scale(1.8) | ⚠️ Similar |

---

## CRITICAL GAPS (Must Fix)

1. **SILK BACKGROUND** — The signature visual. 6 layers of flowing gradients + turbulence weave + sheen. This IS the ÆTHER look.
2. **MONOCHROME COLOR SYSTEM** — Replace all purple/violet/ember with monochrome + optional gold accent. The `#0F0A1E` → `#0a0a0f` (L0).
3. **GLASS MATERIALS** — At minimum `.glass-opaque` and `.glass-smoked` for cards and nav.
4. **CUSTOM CURSOR** — Dot + trailing ring with `mix-blend-mode: difference`.
5. **NOISE/GRAIN** — Body `::before` fractal noise overlay.
6. **FIBONACCI SPACING** — All spacing values should map to F(n): 1, 2, 3, 5, 8, 13, 21, 34, 55, 89.
7. **FIBONACCI TYPOGRAPHY** — Font sizes should be: 8, 10, 13, 16, 21, 34, 55, 89, 144.
8. **GOLDEN-RATIO EASING** — Replace all `cubic-bezier(0.4, 0, 0.2, 1)` with `cubic-bezier(0.618, 0, 0.618, 1)` (natural) or `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo).
9. **FIBONACCI DURATIONS** — Replace 0.3s → 233ms (fast), 0.4s → 377ms (normal), 0.6s → 610ms (smooth), 1s → 987ms (deliberate).
10. **SCROLL PROGRESS BAR** — 2px bar at top, `var(--a-fg)` color.
11. **SHIMMER TEXT** — Gradient sweep on stats, prices, hero text.
12. **RESPONSIVE SECTION SPACING** — Fibonacci padding scale across 7 breakpoints.

---

## RECOMMENDATION

Rebuild `index.html` incorporating:
- Full silk background (6 layers)
- Monochrome color system (L0-L7)
- Glass materials (frosted, smoked, milk)
- Custom cursor
- Noise grain overlay
- Fibonacci spacing + typography
- Golden-ratio easing
- Fibonacci animation durations
- Scroll progress bar
- Shimmer text effects
- Monochrome + gold accent (royal mode toggle)

This transforms the page from "good landing page" to **ÆTHER signature** — performative, effective, luxurious.