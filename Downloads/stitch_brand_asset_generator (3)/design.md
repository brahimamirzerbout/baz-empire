
**Brand personality:** premium, Dark, editorial,
confident. Square corners, uppercase display type, a single warm-orange accent, and
slow, tasteful motion throughout. Think "architectural monograph" not "tradesman flyer".

**Stack:** static HTML + Tailwind (Play CDN) + one custom `style.css` + vanilla `app.js`.
Fonts from Google Fonts, icons from Lucide (CDN).

---

## 1. Colour

The whole site is **dark-first**. Backgrounds step through three near-blacks; text is a
warm off-white; one orange accent does all the highlighting work.

| Token    | Hex       | Role |
|----------|-----------|------|
| `brand`  | `#F2572B` | Primary accent — orange. Buttons, links-on-hover, eyebrows, icons, active states. (Logo mark uses `#F0562A`, a hair different — treat as the same orange.) |
| `brand2` | `#E4B8BF` | Soft pink — secondary/hero accent. Very sparingly used. |
| `ink`    | `#111111` | Base page background (darkest). |
| `panel`  | `#1A1A1A` | Section background — alternates with `ink` band to band. |
| `panel2` | `#2C2C2C` | Raised surfaces: form fields, cards. |
| `sand`   | `#E8E4E0` | Warm off-white — default body text on dark. |
| `stone`  | `#B0AAA5` | Warm grey — secondary/muted text, paragraphs. |
| `wa`     | `#25D366` | WhatsApp green — only for WhatsApp CTAs (currently disabled/commented). |

**Usage rules**
- **Section rhythm:** alternate `bg-ink` and `bg-panel` down the page so bands separate cleanly.
- **Accent discipline:** orange is the *only* saturated colour. Use it for one thing per view — the primary action, the hovered state, the eyebrow label. Never fill large areas with it (except the sticky CTA bar and primary buttons).
- **Hairlines:** dividers and borders are white at very low alpha — `rgba(255,255,255,.06–.18)` (Tailwind `border-white/10` is the workhorse). On dark, borders are light-transparent, never solid grey.
- **Text hierarchy:** white (`#fff`) for headings → `sand` for lead text → `stone` for body/muted → `stone/70` for finest print.
- **Overlays on imagery:** dark scrims (`rgba(17,17,17,…)`) with gradients top-and-bottom for legibility over photos.

---

## 2. Typography

Two families, loaded from Google Fonts:

```
Plus Jakarta Sans  — display / headings   (weights 400,500,600,700)
Poppins            — body / UI            (weights 300,400,500,600)
```

- **`font-display` (Plus Jakarta Sans):** all `h1`–`h6`, big numerals, buttons, captions. Set at **weight 400** even at large sizes (the size does the work, not the weight). Almost always `UPPERCASE` with tight tracking (`tracking-tight`).
- **`font-sans` (Poppins):** all paragraph and UI text.

### Type patterns
| Element | Spec |
|---------|------|
| Hero H1 | `font-display` uppercase, `clamp(1.9rem, 9vw, 5.5rem)`, `leading-[1.05]`, white |
| Section H2 | `font-display` uppercase, `clamp(1.35rem, 5.3vw, 3.5rem)`, `tracking-tight`, white (often `whitespace-nowrap`) |
| Eyebrow / kicker | `text-sm font-semibold tracking-[0.3em] uppercase text-brand` — sits above every H2 |
| Card / step H3 | `font-display uppercase text-xl` white |
| Body / lead | Poppins, `leading-relaxed`, `text-stone` |
| Micro-labels | `text-[10–11px] tracking-[0.2em–0.3em] uppercase` — nav, footer headers, badges |
| Buttons | uppercase, `tracking-[0.12em–0.2em]`, weight 600, small (`text-xs`/`.78rem`) |

**Signature moves**
- **Wide letter-spacing on small uppercase text** (eyebrows, nav, labels): `0.2em`–`0.35em`. This is the strongest recurring type cue — use it everywhere small caps appear.
- **Accent word in headings:** headings often end with one word wrapped in `text-brand`, e.g. "Everything Under **One Roof.**"
- Headline tracking is *tight*; label tracking is *loose*. Never the reverse.

---

## 3. Shape, Spacing & Layout

- **Square corners — everywhere.** This is a hard rule. Tailwind's border-radius scale is overridden to `0` for every `rounded-*` utility, and `*, *::before, *::after { border-radius: 0 }` enforces it globally. The *only* exceptions are intentionally-round elements: the circular "play" button and the pill-shaped hero buttons (`rounded-full`, which still resolves via inline exceptions / are deliberately round). Default posture: sharp rectangles.
- **Container:** `max-w-[86rem] mx-auto px-6 lg:px-8` — the standard page gutter wrapper. Reuse verbatim.
- **Section padding:** `py-24 sm:py-32` vertical rhythm on every major section.
- **Section header block:** centered, `max-w-3xl mx-auto mb-14 sm:mb-16`, structured as: eyebrow → H2 → supporting paragraph.
- **Grid:** 12-col mental model. Footer uses `md:grid-cols-12` with 5/3/4 splits. Content grids are 2-up (`lg:grid-cols-2`) or 4-up (`lg:grid-cols-4`).
- **Scroll offset:** `section[id] { scroll-margin-top: 5rem }` to clear the fixed 5rem (`h-20`) header.

---

## 4. Components

### Header / Nav
- Fixed, full-width, `h-20`, `z-50`. **Transparent over the hero**, with a dark top-down gradient scrim for legibility.
- On scroll it gains `.is-solid`: `rgba(17,17,17,.72)` + `backdrop-filter: blur(18px) saturate(140%)` + subtle shadow — a "dark gloss" glass bar. Scrim fades out.
- **Nav links:** white at 82% opacity, uppercase `text-xs tracking-[0.15em]`. Hover → orange, with a 2px orange underline that grows from left (`width 0 → 100%`).
- Animated "Ap" logo mark (see §6) + wordmark at `text-[11px] tracking-[0.3em] uppercase`.

### Mobile nav
- Hamburger (3 bars) morphs into an **X** when open (`nav-open` state on body).
- Slide-in drawer **from the right**, `max-width: 340px`, `rgba(17,17,17,.92)` + `blur(20px)`, left hairline border. Scrim behind. Links stack, uppercase, hover nudges `padding-left`.

### Buttons
| Variant | Look |
|---------|------|
| **Primary (hero/form)** | Solid `brand` fill, white text, uppercase. Hover: `brightness(1.08)` + lift `translateY(-2px)`. |
| **Ghost / outline** | `1.5px` white border at ~50% alpha, transparent fill. Hover: faint white wash / border → orange, lift. |
| **Send (panel)** | Solid orange, uppercase `tracking-[0.2em]`, arrow icon that slides right on hover (`translateX(4px)`). |
| **Sticky CTA bar** | See below. |
| Hero buttons | Pill (`rounded-full`) — the deliberate exception to square corners. |

All buttons: uppercase, wide tracking, weight 600, transition ~`.25–.3s var(--ease)`.

### Cards & surfaces
- **Service "brick wall":** trades laid as inline bricks in a running-bond (flex-wrap, `gap-2`, centered). Each brick: faint white surface (`rgba(255,255,255,.04)`), Lucide icon in orange, weight-500 label. Hover → **fills orange**, white text, lifts 3px, orange glow shadow. On mobile (`≤640px`) the wall collapses into a clean full-width stacked list.
- **Form fields:** two styles — (a) `.field`: transparent bg, `1px` white/18 border, orange border on focus (used in the slide-in panel); (b) `.enq-field`: `panel2` fill, focus lightens bg to `#333` + orange border. Custom SVG chevron for `<select>`. Placeholder text is muted `stone`.

### Portfolio — Bento swiper
- A horizontal swiper of slides; each slide is a **bento grid** (3 cols × 2 rows, one big tile + two small). Alternate slides mirror the layout (`--rev`: big tile on the right).
- Cells: cover images, hover **zooms image `scale(1.06)`** + fades in a bottom gradient + slides up a caption (orange category label + white title). Click opens a **lightbox** (fullscreen, dark 93% bg, prev/next/close, orange hover on controls).
- Nav: square glass arrows (orange on hover) + dot indicators (active dot is an orange **28px pill**).
- Mobile: grid collapses to single-column full-width stacked images with captions always visible.

### Process steps
- 4-column row with left hairline dividers between steps.
- Each step: small orange Lucide icon (self-draws on scroll) → **ghosted giant step number** (`3.5rem`, white at 7% alpha) → uppercase H3 → muted paragraph.

### Contact panel (slide-in)
- Slides in **from the right**, `max-width: 460px`, glass (`rgba(17,17,17,.9)` + `blur(20px)`), scrim behind, opened by any `[data-open-contact]` trigger. Body scroll locks.
- Contains the enquiry form; on success swaps to an on-brand **success state** (orange check icon that draws itself, "Thank you", "send another"). **Never a native `alert()`** — this success panel is the house reference for all form confirmations.

### Side dock
- Fixed vertical tab strip on the **right edge**, mid-height. Square 48px glass tabs. Includes a vertical "CONTACT" tab (text rotated bottom-to-top, `tracking-[0.28em]`), mail, Instagram. Hidden on mobile.

### Sticky CTA banner
- Orange bar fixed to the viewport bottom; fades/slides in after scroll, then **docks seamlessly into a reserved strip at the top of the footer**. Holds a headline + a dark "Get in Touch" button.

### Footer
- `bg-ink`, top border `border-brand/15`. 12-col grid: brand column (logo + blurb + social icons) / "Explore" links / "Get in touch". Bottom bar: copyright + "Back to top ↑". A separate near-black **"Powered by Massive Webteam"** strip sits below.

---

## 5. Iconography
- **Lucide** icons (CDN), stroke style, `stroke-width: 1.5`. Rendered orange as accents, `stroke` inherits `currentColor` elsewhere.
- Instagram / WhatsApp use their own inline brand SVGs.
- Icons sit at ~18px in bricks, ~40px in process steps, ~20–22px in dock/social.

---

## 6. Motion & Interaction

Motion is **slow, smooth and premium** — nothing snappy or bouncy except deliberate pops.

- **Standard easing:** `--ease: cubic-bezier(.4, 0, .2, 1)`. Use for nearly all transitions. Typical durations `.25s`–`.5s`.
- **Page loader:** dark radial curtain with the self-drawing logo; slides up (`translateY(-100%)`) on ready via a dramatic `cubic-bezier(.83,0,.17,1)`.
- **Self-drawing "Ap" logo:** the signature brand animation. The mark is an SVG stroke-drawn along a mask (`stroke-dashoffset` 1→0 over `.85s`), then a white dot "pops" in with an overshoot ease. Fires on load and on hover, in header/footer/loader. Faint versions used as **watermarks** behind hero/contact/reels headings (opacity `.06–.10`).
- **Hero:** 5-image crossfading slideshow on a 45s loop (9s each), each slide with a gentle Ken-Burns zoom drift. Dark gradient + radial overlay for text legibility.
- **Scroll reveal:** content blocks (`.reveal`) fade-up (`opacity 0→1`, `translateY(20px)→0`) as they enter view, gated by a `.js-reveal` class set before paint (so no flash / no content hidden without JS).
- **Hover vocabulary:** lift (`translateY(-1px to -3px)`), brighten (`filter: brightness(1.08)`), grow-underline, image zoom, orange fill/colour shift.
- **Accessibility:** every animation is wrapped in `@media (prefers-reduced-motion: reduce)` — loops stop, reveals show instantly, the hero holds its first slide. Honour this in any new work.

---

## 7. Quick-start tokens (for a build step)

```js
// tailwind.config — theme.extend
colors: {
  brand:  '#F2572B',  brand2: '#E4B8BF',
  ink:    '#111111',  panel:  '#1A1A1A',  panel2: '#2C2C2C',
  sand:   '#E8E4E0',  stone:  '#B0AAA5',
},
fontFamily: {
  sans:    ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  display: ['Plus Jakarta Sans', 'ui-sans-serif', 'sans-serif'],
},
borderRadius: { /* every step → '0' — square corners */ },
```

```css
:root {
  --brand:  #f2572b;
  --brand2: #E4B8BF;
  --wa:     #25D366;
  --ink:    #111111;
  --ease:   cubic-bezier(.4, 0, .2, 1);
}
```

---

## 8. Do / Don't

**Do**
- Keep corners square by default.
- Alternate `ink` / `panel` section backgrounds.
- Lead every section with an orange uppercase eyebrow.
- Use wide tracking on small caps, tight tracking on big headings.
- Keep motion slow and eased; always add a reduced-motion fallback.
- Confine saturation to the single orange accent.

**Don't**
- Don't use rounded corners (except the two intentional pills/circle).
- Don't introduce a second bright colour.
- Don't use native `alert()` for form feedback — use the in-page success state.
- Don't bold the display font to add emphasis — scale it instead.
- Don't crowd bright orange over large areas.

---

*Prepared as a design handoff for Anderson Projects (Massive Webteam). Source of truth:
`index.html`, `style.css`, `app.js` in this folder.*
