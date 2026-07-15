# Front-End Bug Fixes & Refinements — Implementation Spec

> **Purpose:** One canonical, deduplicated brief for the AI coder. Derived from the expert's red-marked screenshot review (Gemini passes 1 & 2 + code blocks). Execute every section. Do not skip the reconciliation note in §0 — it changes what "the site" means.

---

## 0. Reconciliation — READ FIRST

The expert remarks reference UI that is **not present in the current `/home/uzer/site.html`**. Before writing code, confirm which of these is the target:

| Referenced in remarks | Exists in current `site.html`? |
|---|---|
| "Built on Four Pillars" section | ❌ No |
| Tech-stack marquee (VERCEL, LINEAR, STRIPE, RESEND, CAL.COM, FIGMA, NOTION, SLACK, OLLAMA, GITHUB) | ❌ No |
| Stat cards: `$24M+` / `340+ TOP-3 RANKINGS` / `+214%` / `94%` | ❌ No (current file has different vanity metrics) |
| Contact form with **First Name / Last Name** split + **Company** field + **Work Email** | ❌ No (current form = service select / name / email / message) |
| Contact info: `zerboutbrahimamir@gmail.com`, `+1 (216) 555-1234`, `1209 Mountain Road Pl N, Garrettsville, OH 44231` | ❌ No (current = `owner@baz.agency`, "United Kingdom") |
| Slide-out "INQUIRY" drawer | ✅ Yes (called `.contact-panel`) |
| Header nav center alignment | ✅ Yes (`.site-header`) |
| Textarea resize handle | ✅ Yes (currently `resize: vertical`) |

**Decision required from operator (pick one):**
- **(A) Apply to existing `site.html` only** → skip §1 marquee, §3 contact-grid rebuild, §6 fake-metrics removal (those elements don't exist); apply §2 header, §4 input split (if adding First/Last), §5 textarea, §7–§8 drawer fixes.
- **(B) Build the full richer site described in the remarks** → implement every section below, including new marquee, pillars/metrics, and the two-column contact layout.

**Default if unspecified: (B)** — build the complete site the expert reviewed, then apply all fixes. The rest of this document assumes (B).

### Global style anchors (use everywhere)
- Accent color: **`#f2572b`** (standardize — some Gemini snippets used `#ff5a36`; treat both as the same token `--brand:#f2572b`).
- Dark surfaces: bg `#0a0a0a` / `#0d0d0d`, panel `#121212`, border `#222` / `rgba(255,255,255,.10)`.
- Muted label color: `#888`.
- **Global box-model reset:** every container and input must use `box-sizing:border-box`.
- **Global textarea rule:** `textarea { resize:none; }` (see §5).
- Fonts: keep existing `Plus Jakarta Sans` (display) + `Poppins` (body) unless told otherwise.

---

## 1. Header Navigation — Vertical Centering
**Visual ref:** `image (11).webp`
**Symptom:** Logo and nav links not aligned on the vertical cross-axis.

### Fix (CSS)
```css
header,
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;      /* vertically centers logo + nav */
  height: 80px;
  padding: 0 40px;          /* horizontal only — no top/bottom padding */
  box-sizing: border-box;
}

header nav,
.header-nav {
  display: flex;
  align-items: center;
  gap: 24px;
}

header nav a,
.header-nav a {
  display: inline-block;
  margin: 0;
  padding: 8px 12px;
  vertical-align: middle;
}
```

---

## 2. Infinite Seamless Logo Marquee
**Visual ref:** `image (1).png`
**Symptom:** Marquee stops, jumps, or shows a blank trailing gap instead of looping forever.
**Root cause:** track content is not duplicated, so the `-50%` translate has nothing to wrap into.

### Fix (HTML) — duplicate the group exactly twice
```html
<div class="marquee-container">
  <div class="marquee-track">
    <div class="marquee-items">
      <span>HUB</span><span>VERCEL</span><span>LINEAR</span><span>STRIPE</span>
      <span>RESEND</span><span>CAL.COM</span><span>FIGMA</span><span>NOTION</span>
      <span>SLACK</span><span>OLLAMA</span><span>GITHUB</span>
    </div>
    <div class="marquee-items" aria-hidden="true">
      <span>HUB</span><span>VERCEL</span><span>LINEAR</span><span>STRIPE</span>
      <span>RESEND</span><span>CAL.COM</span><span>FIGMA</span><span>NOTION</span>
      <span>SLACK</span><span>OLLAMA</span><span>GITHUB</span>
    </div>
  </div>
</div>
```

### Fix (CSS)
```css
.marquee-container {
  overflow: hidden;
  width: 100%;
  background-color: #0d0d0d;
  border-top: 1px solid #1a1a1a;
  border-bottom: 1px solid #1a1a1a;
  padding: 15px 0;
  display: flex;
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: scroll-infinite 25s linear infinite;
}

.marquee-items {
  display: flex;
  align-items: center;
  gap: 48px;
  padding-right: 48px;          /* MUST equal gap to prevent visible jump */
}

.marquee-items span {
  font-family: monospace;
  font-size: 11px;
  color: #666;
  letter-spacing: 2px;
}

/* Translate exactly -50% → loops seamlessly because content is doubled */
@keyframes scroll-infinite {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* Optional: pause on hover. Remove if continuous scroll is desired. */
.marquee-container:hover .marquee-track { animation-play-state: paused; }

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .marquee-track { animation: none; }
}
```

---

## 3. Contact Section — Remove Right-Side Void & Fix Grid
**Visual refs:** `image (10).webp`, `image (9).webp`, `image (8).webp`
**Symptom:** Large empty black void to the right of the contact form; expert marks "remove all" on the empty space and "resize:" on the outer block.
**Fix:** Remove any empty placeholder/spacer columns. Use a clean 2-column grid (info left, form right), centered, responsive collapse.

### Fix (HTML)
```html
<section class="contact-section">
  <div class="contact-container">

    <div class="contact-info">
      <span class="sub-tag">▪ START A CONVERSATION</span>
      <h1>LET US BUILD YOUR NEXT CHAPTER.</h1>
      <p>Tell us what you are working on. We reply within 24 hours with a tailored proposal — or a clear "not right now." No ghosting.</p>

      <div class="contact-details">
        <div class="detail-item">
          <label>Email</label>
          <a href="mailto:zerboutbrahimamir@gmail.com">zerboutbrahimamir@gmail.com</a>
        </div>
        <div class="detail-item">
          <label>Phone</label>
          <span>+1 (216) 555-1234</span>
        </div>
        <div class="detail-item">
          <label>Address</label>
          <span>1209 Mountain Road Pl N<br>Garrettsville, OH 44231</span>
        </div>
      </div>
    </div>

    <div class="contact-form-wrapper">
      <form class="contact-form">
        <div class="form-row">
          <div class="form-group">
            <label for="first-name">FIRST NAME</label>
            <input type="text" id="first-name" name="first_name" placeholder="John" required>
          </div>
          <div class="form-group">
            <label for="last-name">LAST NAME</label>
            <input type="text" id="last-name" name="last_name" placeholder="Doe" required>
          </div>
        </div>

        <div class="form-group">
          <label for="work-email">WORK EMAIL</label>
          <input type="email" id="work-email" name="email" placeholder="john@company.com" required>
        </div>

        <div class="form-group">
          <label for="company">COMPANY</label>
          <input type="text" id="company" name="company" placeholder="Acme Inc.">
        </div>

        <div class="form-group">
          <label for="message">MESSAGE</label>
          <textarea id="message" name="message" placeholder="Tell us about your goals..." rows="6" required></textarea>
        </div>

        <button type="submit" class="btn-submit">
          SEND MESSAGE <span class="arrow">→</span>
        </button>
      </form>
    </div>

  </div>
</section>
```

### Fix (CSS)
```css
.contact-section {
  background-color: #0a0a0a;
  color: #ffffff;
  padding: 80px 40px;
  display: flex;
  justify-content: center;
}

.contact-container {
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1.2fr;   /* info | form — no empty column */
  gap: 80px;
}

@media (max-width: 991px) {
  .contact-container { grid-template-columns: 1fr; gap: 40px; }
}
```

---

## 4. First Name / Last Name Input Alignment ("WTF" Glitch)
**Visual refs:** `image (5).webp`, `image (4).webp`
**Symptom:** Overlapping borders / irregular vertical separator between the two name fields.
**Fix:** Symmetrical 2-column grid row with explicit gap; zero margins on children to kill border overlap.

### Fix (CSS)
```css
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  width: 100%;
}

.form-group label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.5px;
  color: #888;
  margin-bottom: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;   /* symmetrical 50/50 */
  gap: 20px;                        /* clean spacing, no border overlap */
  width: 100%;
  margin-bottom: 24px;
}

.form-row .form-group { margin: 0; }   /* reset to prevent collapse/overlap */
```

---

## 5. Textarea — Disable Manual Resizing
**Visual ref:** `image (5).webp`
**Symptom:** User can drag the textarea handle, breaking the form grid and overflowing neighbors.
**Fix:** Global rule.

### Fix (CSS)
```css
textarea {
  resize: none;   /* disables drag-to-resize completely */
}
```

---

## 6. Inputs / Textarea — Shared Field Styling
Consistent field treatment so widths never blow out the drawer/grid.

### Fix (CSS)
```css
.form-group input,
.form-group textarea {
  background-color: #121212;
  border: 1px solid #222;
  padding: 16px;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
  width: 100%;
  box-sizing: border-box;   /* critical: padding stays inside width */
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #f2572b;    /* accent */
}
```

---

## 7. Slide-Out Inquiry Drawer — Horizontal Overflow
**Visual ref:** `image.png`
**Symptom:** Horizontal scrollbar at the bottom of the "INQUIRY" sliding panel.
**Fix:** Clip X-axis, bound the width, force box-sizing on the drawer and all child inputs.

### Fix (CSS)
```css
.inquiry-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 460px;
  height: 100vh;
  background-color: #0d0d0d;
  box-shadow: -10px 0 30px rgba(0,0,0,0.5);
  z-index: 1000;

  box-sizing: border-box;
  overflow-x: hidden;   /* kill horizontal scrollbar */
  overflow-y: auto;     /* keep clean vertical scroll */

  padding: 40px;
  display: flex;
  flex-direction: column;
}

.inquiry-drawer input,
.inquiry-drawer textarea,
.inquiry-drawer select {
  width: 100%;
  box-sizing: border-box;
}
```

> **Map to existing `site.html`:** the current drawer is `.contact-panel`. Apply the same `overflow-x:hidden`, `box-sizing:border-box`, and child `width:100%` rules to `.contact-panel` and its `.field` / `.enq-field` inputs.

---

## 8. Slide-Out Inquiry Drawer — Bottom Spacing
**Visual ref:** `image (6).webp`
**Symptom:** Space below "SEND INQUIRY" button is cramped; no breathing room.
**Fix:** Add clean bottom padding to the scroll container / footer.

### Fix (CSS)
```css
.inquiry-drawer-content {
  padding-bottom: 60px;   /* elegant whitespace at the bottom of the scroll area */
}

.inquiry-drawer-footer {
  margin-top: auto;
  padding-top: 30px;
  padding-bottom: 50px;   /* space under the submit action */
}

.btn-submit {
  width: 100%;
  background-color: #f2572b;
  color: #fff;
  border: none;
  padding: 18px;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1.5px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.2s ease;
}

.btn-submit:hover { background-color: #e04825; }
```

---

## 9. Remove "Fake" / Placeholder Metric Blocks
**Visual ref:** `image (7).webp`
**Symptom:** Stat row below the metrics card has a duplicate/placeholder block marked "FAKE" (near `340+ TOP-3 RANKINGS` or empty cells).
**Fix:** Delete every mock/dummy/spacer card. Redistribute genuine metrics into a clean, even, responsive grid.

### Fix (HTML) — only real metrics, evenly distributed
```html
<div class="metrics-grid">
  <div class="metric-card">
    <h3>$24M+</h3>
    <p>AD SPEND MANAGED<br>GLOBAL FOOTPRINT</p>
  </div>
  <div class="metric-card">
    <h3>+214%</h3>
    <p>AVG ORGANIC LIFT<br>YEAR-OVER-YEAR</p>
  </div>
  <div class="metric-card">
    <h3>94%</h3>
    <p>CLIENT RENEWAL<br>RETENTION-DRIVEN MODEL</p>
  </div>
</div>
```

### Fix (CSS)
```css
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);   /* 3 balanced equal columns */
  gap: 30px;
  width: 100%;
  margin-top: 50px;
}

@media (max-width: 768px) {
  .metrics-grid { grid-template-columns: 1fr; }   /* stack on mobile */
}
```

> If the `340+ TOP-3 RANKINGS` card is genuine (not a placeholder), include it as a 4th card and switch the grid to `repeat(4,1fr)` with a `repeat(2,1fr)` tablet breakpoint. Do not mix a 4-card row into a 3-column grid — that recreates the void.

---

## 10. Acceptance Checklist (coder must verify all)

- [ ] `box-sizing:border-box` applied globally (`*,*::before,*::after`).
- [ ] `textarea { resize:none }` — no drag handle on any textarea.
- [ ] First/Last name row: `grid-template-columns:1fr 1fr`, `gap:20px`, child margins `0` — no border overlap, no "WTF" seam.
- [ ] Marquee: content duplicated 2×; `@keyframes` translates exactly `-50%`; `linear infinite`; no jump/blank; reduced-motion stops it.
- [ ] Header: logo + nav vertically centered (`align-items:center`), explicit height, horizontal padding only.
- [ ] Contact section: no empty right column; `1fr 1.2fr` grid; collapses to 1 column ≤991px.
- [ ] Inquiry drawer: no horizontal scrollbar (`overflow-x:hidden`); all child inputs `width:100%` + `box-sizing:border-box`.
- [ ] Inquiry drawer: ≥50px breathing room below the submit button.
- [ ] Metrics: zero placeholder/dummy cards; columns distribute evenly; stacks on mobile.
- [ ] All accent colors standardized to `#f2572b` (no stray `#ff5a36`).
- [ ] All form inputs have `name` attributes and associated `<label>`s (a11y).
- [ ] No layout overflow at 360px, 768px, 1024px, 1440px viewport widths.

---

## 11. Open questions for the operator (resolve before build)

1. **Target:** option (A) patch existing `site.html`, or (B) build the full richer site the expert reviewed? Default assumed: **(B)**.
2. **Contact details:** the remarks use `zerboutbrahimamir@gmail.com` + a US (Ohio) address + `+1 (216)` phone. The current site uses `owner@baz.agency` + "United Kingdom". Which is canonical for the final build?
3. **The `340+ TOP-3 RANKINGS` card:** real metric or placeholder to delete? (Affects 3- vs 4-column metrics grid.)
4. **Marquee brand list:** confirm the final 11-item list (HUB, VERCEL, LINEAR, STRIPE, RESEND, CAL.COM, FIGMA, NOTION, SLACK, OLLAMA, GITHUB) — and whether these are real stack partners or aspirational.

---

*End of spec. Hand this file to the AI coder as the single source of truth.*