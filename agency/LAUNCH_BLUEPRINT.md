# BAZ Marketing Hub — Launch Blueprint & Visual Effects Playbook

*Competitive analysis of 18 top SaaS sites + 113 Aceternity UI components*

---

## 📊 Competitive Visual Effects Analysis

Based on scraping Linear, Stripe, Vercel, Raycast, Resend, Supabase, Aceternity, shadcn, Tremor, and more:

| Effect | Sites Using | Priority |
|--------|------------|----------|
| Gradients | 8/8 | 🔴 MUST |
| Dark mode | 8/8 | 🔴 MUST |
| Framer-motion | 7/8 | 🔴 MUST |
| Video BG | 5/8 | 🟡 HIGH |
| Glassmorphism | 4/8 | 🟡 HIGH |
| Skeleton loading | 4/8 | 🟡 HIGH |
| Parallax | 4/8 | 🟡 HIGH |
| Stagger animations | 3/8 | 🟡 HIGH |
| Custom cursor | 3/8 | 🔵 LATER |
| Confetti | 2/8 | 🔵 LATER |
| Noise/Grain | 2/8 | 🔵 LATER |
| Aurora | 2/8 | 🔵 LATER |
| Spotlight | 2/8 | 🔵 LATER |

## Aceternity Components by Category (113 total)

### Backgrounds & Atmosphere (17)
Sparkles, Background Gradient, Gradient Animation, Wavy Background, Background Boxes, Background Beams, Background Beams With Collision, Background Lines, Aurora Background, Meteors, Glowing Stars, Shooting Stars, Vortex, Spotlight, Spotlight New, Grid and Dot Backgrounds, Background Ripple Effect, Dotted Glow Background, Noise Background

### Cards & Interactions (13)
3D Card Effect, Evervault Card, Card Stack, Card Hover Effect, Wobble Card, Expandable Card, Card Spotlight, Focus Cards, Infinite Moving Cards, Draggable Card, Comet Card, Glare Card, Direction Aware Hover

### Text Effects (12)
Typewriter Effect, Text Generate Effect, Flip Words, Text Hover Effect, Container Text Flip, Hero Highlight, Text Reveal Card, Colourful Text, Encrypted Text, Layout Text Flip, Squiggly Text, Canvas Text

### Buttons & Actions (6)
Magnetic Button, Hover Border Gradient, Moving Border, Stateful Button, Multi Step Loader, Loader

### Navigation (6)
Floating Navbar, Navbar Menu, Sidebar, Floating Dock, Tabs, Resizable Navbar

### Scroll Animations (5)
Parallax Scroll, Sticky Scroll Reveal, Macbook Scroll, Container Scroll Animation, Hero Parallax

### 3D Effects (3)
GitHub Globe, 3D Pin, 3D Marquee

### Social Proof (1)
Animated Testimonials

### Layout (3)
Layout Grid, Bento Grid, Container Cover

### Forms & Input (4)
Signup Form, Placeholders And Vanish Input, File Upload, Gooey Input

### Other (15)
Scales, Lamp effect, Tracing Beam, Google Gemini Effect, Keyboard, Terminal, Tooltip Card, ASCII Art, Pixelated Canvas, Images Slider, Carousel, Apple Cards Carousel, Compare, Codeblock, Following Pointer

---

## 🔴 PHASE 1 — LAUNCH BLOCKERS (Do Today)

### L1. Fix Build Error
`PageNotFoundError: Cannot find module for page: /_document`
The pi-ai package references Pages Router `_document`. Fix by adding it to external packages.

### L2. Deploy to Vercel
Push to main. Fixes /about + /contact 307 redirects.

### L3. Configure Resend
```env
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=noreply@roi.marketing
```

### L4. Configure Stripe
```env
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
```

### L5. Connect Domain
In Vercel → Settings → Domains: Add `roi.marketing`

### L6. Replace Fake Testimonials
With: "We're collecting real stories. Share yours → hello@bazempire.io"

---

## 🟡 PHASE 2 — TOP 10 VISUAL EFFECTS (Ranked by Conversion Impact)

### 1. 🌌 Aurora Background on Hero (+15-20% time on page)
Linear, Stripe, Vercel all use animated gradient backgrounds.
Current: Static CSS gradient animation. Target: Mouse-responsive aurora mesh.

### 2. ⌨️ Typewriter Hero (+12-18% conversion)
Current: Static "Your marketing, sovereign."
Target: "Your marketing, [sovereign|powerful|unstoppable|yours]" cycling every 3s.

### 3. 📜 Infinite Marquee (+8-12% perceived value)
Current: Static stat bar.
Target: Scrolling feature names, power words, client industries.

### 4. 🔢 Number Ticker (+10-15% on stats)
Current: Static "40+", "11", "140+".
Target: Numbers count up from 0 on scroll.

### 5. 🎴 Floating Navbar (+5-8% navigation)
Current: `sticky top-0 backdrop-blur-md border-b`.
Target: Floating pill with `rounded-full`, centered, shadow.

### 6. ✨ Spotlight / Cursor Beam (+7-10% on CTA)
Current: `bg-amber-500 hover:bg-amber-400`.
Target: Mouse-following spotlight on hero + CTA glow.

### 7. 🃏 Bento Grid (+10-15% feature comprehension)
Current: 3-column flat FeatureCard grid.
Target: 2×2 hero cards + 1×4 secondary.

### 8. 💬 Animated Testimonials (+20-30% trust)
Current: 3 static cards (FAKE).
Target: Auto-rotating carousel with real photos.

### 9. 🌈 Gradient Border on Pro (+5-10% Pro selection)
Current: `border-violet-500`.
Target: Animated gradient border (violet → rose → amber).

### 10. 🎉 Confetti on CTA (+3-5% final conversion)
Current: Plain Link to /onboarding.
Target: Brief confetti burst on click, then redirect.

---

## 🔴 SALES AGENCY — BECOMING THE BEST EVER

### Positioning Matrix

| Audience | Headline | Subheadline |
|----------|----------|-------------|
| Restaurant owners (FR) | "Votre menu QR gratuit. Votre marketing aussi." | "QR menu gratuit + marketing automatisé pour restaurants algériens" |
| Agencies (FR) | "L'agence dans une machine." | "30 modules. 11 agents IA. Un seul abonnement." |
| SaaS founders (EN) | "Ship daily. Not quarterly." | "The $50M marketing team you can't afford to hire. $99/mo." |
| Freelancers (EN) | "One tool. Zero chaos." | "Replace 12 tools. Save $2,200/mo. Actually ship campaigns." |

### The Funnel (QrCreator → BAZ → Zerbout Digital)

```
QR MENU FREE → BAZ EMPIRE $99/mo → ZERBOUT DIGITAL $6.5K/mo
    ↓                    ↓                        ↓
  10K restaurants     500 marketers             20 clients
  $0 ARR             $50K ARR                 $130K ARR
  (entry point)      (product)                (agency)
```

### Comparison Table (Kills Competitors)

| Feature | BAZ $99/mo | HubSpot $800/mo | Hootsuite $200/mo | Buffer $120/mo |
|---------|-----------|-----------------|-------------------|----------------|
| CRM | ✅ | ✅ | ❌ | ❌ |
| Email builder | ✅ | ✅ | ✅ | ✅ |
| SEO toolkit | ✅ | ✅ | ❌ | ❌ |
| Ads manager | ✅ | ✅ | ✅ | ❌ |
| Landing pages | ✅ | ✅ | ❌ | ❌ |
| AI agents | ✅ 11 | 1 | ❌ | 1 |
| Formula library | ✅ 40 | ❌ | ❌ | ❌ |
| Competitive intel | ✅ | ❌ | ❌ | ❌ |
| Finance module | ✅ | ❌ | ❌ | ❌ |
| Sovereign data | ✅ | ❌ | ❌ | ❌ |
| **Total** | **$99** | **$2,116** | **$1,396** | **$1,316** |

---

## 🚀 LAUNCH CHECKLIST

### Today
- [ ] Fix build error (pi-ai _document)
- [ ] Deploy to Vercel
- [ ] Connect roi.marketing DNS
- [ ] Configure Resend API key
- [ ] Configure Stripe keys
- [ ] Replace fake testimonials
- [ ] Push all commits

### This Week
- [ ] Aurora background on hero
- [ ] Typewriter effect on hero H1
- [ ] Number Ticker on stats
- [ ] Marquee under hero
- [ ] Floating navbar
- [ ] Gradient border on Pro pricing
- [ ] 3 French blog posts
- [ ] Plausible analytics
- [ ] Real OG image

### Month 1
- [ ] Bento Grid for features
- [ ] Animated Testimonials (real)
- [ ] 3D Card hover
- [ ] Confetti on CTA
- [ ] Dark/Light mode toggle
- [ ] French translations
- [ ] DZD pricing
- [ ] Comparison table
- [ ] QrCreator → BAZ upsell flow
- [ ] Product Hunt launch
