# BAZ Marketing Website — Session Notes

## Active File
`/home/uzer/baz/public/index-standalone.html` — standalone HTML with Tailwind CDN

## Design System (design.md — Anderson Projects)
- **Accent:** Gold `#C8A55A` (gradient: `#8D6B2E → #C8A55A → #E5C97A`)
- **Darks:** Charcoal `#1F2933`, Navy `#24364A`
- **Lights:** White `#FFFFFF`, Sand `#E8E4E0`, Stone `#B0AAA5`
- **Fonts:** Outfit (display/headings), Poppins (body)
- **Border-radius:** 4px everywhere (hard rule, no rounded corners)
- **Borders:** `1px solid rgba(200,165,90,.35)` default, `2px solid #C8A55A` premium
- **No hover effects on buttons** (user explicitly removed them)
- **No custom cursor effects**
- **Logo watermark:** Only in prescribed locations — hero and contact (per §6 of design.md). NOT on every section heading.
- **Accent discipline:** Gold is the only saturated colour. One thing per view.
- **Editorial minimalism:** "architectural monograph, not tradesman flyer"
- **Section rhythm:** Alternate bg-white and bg-[#F5F5F5] / dark-gradient-bg
- **Hairlines:** Dividers/borders at white low alpha (`border-white/10`, `border-[#D9D9D9]/50`)
- **Text hierarchy:** White for headings → sand for lead → stone for muted → stone/70 for finest print
- **Self-drawing logo:** Watermarks at `.06–.10` opacity behind hero/contact headings only

## External CDN Dependencies
- Tailwind CSS CDN
- Google Fonts (Outfit + Poppins)
- Swiper.js v11 (reviews slider)
- AOS v2.3.4 (scroll animations)
- Lenis v1.1.18 (smooth scroll)

## Key Tokens
| Token | Value |
|-------|-------|
| Gold | `#C8A55A` |
| Gold-dark | `#8D6B2E` |
| Gold-light | `#E5C97A` |
| Charcoal | `#1F2933` |
| Navy | `#24364A` |
| Sand | `#E8E4E0` |
| Stone | `#B0AAA5` |
| Border-gray | `#D9D9D9` |
| Gold gradient | `linear-gradient(90deg, #8D6B2E 0%, #C8A55A 45%, #E5C97A 100%)` |
| Dark gradient | `linear-gradient(180deg, #24364A, #1F2933)` |
| max-w-site | 1280px |

## Sections (top to bottom)
1. Nav (fixed, transparent → solid on scroll, blur+backdrop)
2. Hero (dark gradient bg + hero-bg.jpg at 15% + logo watermark 6-8% + centered headline)
3. Stats Band (white bg, different stats from hero)
4. Services — 4 pillars (light gray bg `#F5F5F5`)
5. How We Work — 4 steps (white bg, gold number badges)
6. Case Studies — 3 cards (dark gradient bg)
7. Reviews Slider — 5 testimonials, Swiper.js (light gray bg `#F5F5F5`)
8. Insights — 3 article cards (white bg)
9. Contact — details left + form right (white bg + logo watermark)
10. Footer (charcoal bg, gold/15 top border)

## Perfection Audit Results (2026-07-03)
- ✅ Fonts: Outfit for h1-h3, Poppins for body
- ✅ Border-radius: 4px everywhere (0 violations)
- ✅ Button shadows: none on primary/secondary
- ✅ Container width: 1280px (10 containers, all consistent)
- ✅ Logo watermarks: hero (1) + contact (1) only, no stray section marks
- ✅ AOS: 36 elements, all animate on scroll
- ✅ Lenis: loaded, smooth scroll + anchor offset -72px
- ✅ Copyright year: dynamic (2026)
- ✅ Scroll behavior: auto (Lenis handles it)
- ✅ Reduced motion: CSS media query present
- ✅ Scroll margin-top: 5rem on section[id]
- ✅ Broken images: 0
- ✅ Mobile: responsive at 375px
- ✅ Gold accent discipline: no non-gold saturated colours

## Design Decisions Log

### Hero Logo Watermark (Anderson Projects §6 pattern)
- `.hero-logo-mark`: absolute, centered, 120%→140% width responsive
- `opacity: 0.06 → 0.08` (mobile → desktop)
- `filter: brightness(2) saturate(0) contrast(0.8)` — ghostly silhouette
- `z-index: 1`, content at `z-index: 2`
- `pointer-events: none`

### Contact Logo Watermark (Anderson Projects §6 pattern)
- `.contact-logo-mark`: absolute, `top: 15%`, centered, `max-width: 700px → 800px`
- `opacity: 0.04 → 0.05` (mobile → desktop)
- `filter: brightness(0) saturate(0) opacity(0.06)` — dark ghost on light bg
- `z-index: 0`, content at `z-index: 2`

### Lenis Smooth Scroll
- `duration: 1.2`, easing `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- Anchor links → `lenis.scrollTo()` with `-72px` offset
- Scroll progress bar + navbar solid state use `lenis.on('scroll')`

### AOS (Animate On Scroll)
- `duration: 600`, `easing: 'ease-out-cubic'`, `once: true`, `offset: 80`
- `fade-up` for blocks/cards, `fade-in` for text elements
- 16 elements staggered with `data-aos-delay` (80ms–400ms)
- Single easing override: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- Reduced motion fallback: instant show, no transforms

### Hero Background Image
- `/hero-bg.jpg` — dark abstract gradient from Unsplash (free license)
- `opacity: 0.15` behind gradient overlay
- Overlay: `linear-gradient(180deg, rgba(31,41,51,0.92), rgba(36,54,74,0.88), rgba(31,41,51,0.95))`

### Button Styling
- No glow/shadow on any button
- `.btn-primary`: gold gradient, white text, 4px radius
- `.btn-secondary`: transparent bg, gold border, gold text, 4px radius

## What Was Reverted/Removed
- ❌ Logo watermarks on all 6 section headings — removed (design system prescribes hero + contact only)
- ❌ Methodology photo — removed (not in design system)
- ❌ Case Studies background photo — removed (not in design system)
- ❌ `.section-logo-mark` CSS class — removed, replaced with `.contact-logo-mark`
- ❌ All hover effects on buttons — removed per user
- ❌ Custom cursor effects — removed
- ❌ `.reveal` / `.visible` IntersectionObserver — replaced with AOS
- ❌ Inline style on contact watermark — moved to proper CSS class

## Hard Rules (DO NOT VIOLATE)
1. **Square corners** — 4px border-radius everywhere
2. **Gold accent only** — no other saturated colours
3. **No button glow/shadow**
4. **No hover effects on buttons**
5. **Logo watermark** — only hero + contact, not every section
6. **Design system is sacred** — do not add decorative elements that aren't prescribed
7. **Content is lean/direct** — reduce wordiness
8. **Outfit + Poppins** — no other fonts
9. **max-w-site (1280px)** — all sections share same container width
10. **Section rhythm** — alternate backgrounds (white → gray → dark → gray → white)
11. **Hairlines at low alpha** — `border-white/10` on dark, `border-[#D9D9D9]/50` on light
12. **Reduced motion** — always add `prefers-reduced-motion` fallback
