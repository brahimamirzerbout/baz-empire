{
  "buildCommand": null,
  "outputDirectory": ".",
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)\\.css",
      "headers": [
        { "key": "Content-Type", "value": "text/css" },
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/(.*)\\.html",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Æther — Brand Asset System</title>
  <meta name="description" content="Algorithmically extracted digital brand assets from the shared UI aether. One seed. Infinite consistency.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Merriweather:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="aether.css">
</head>
<body>

  <!-- ── Skip Link ── -->
  <a href="#main" class="skip-link">Skip to content</a>

  <!-- ═══════════════════════════════════════════════════════════
       H E A D E R
       ═══════════════════════════════════════════════════════════ -->
  <header class="header" id="header">
    <div class="header__brand">
      <a href="#" class="logo logo--compact">
        <span class="logo__mark">Æ</span>
        <span class="logo__wordmark">Aether</span>
      </a>
    </div>
    <nav class="header__nav" aria-label="Primary">
      <a href="#seed" class="header__link header__link--active">Seed</a>
      <a href="#cards" class="header__link">Cards</a>
      <a href="#paper" class="header__link">Paper</a>
      <a href="#document" class="header__link">Documents</a>
      <a href="#components" class="header__link">Components</a>
    </nav>
    <div class="header__actions no-print">
      <a href="#" class="btn btn--ghost btn--sm">Sign In</a>
      <a href="#" class="btn btn--primary btn--sm">Get Started</a>
    </div>
    <button class="header__toggle" onclick="document.getElementById('header').classList.toggle('header--open')" aria-label="Toggle navigation">☰</button>
  </header>

  <main id="main">

    <!-- ═══════════════════════════════════════════════════════════
         H E R O
         ═══════════════════════════════════════════════════════════ -->
    <section class="hero" id="hero">
      <span class="section__label">Open-Source Design System</span>
      <h1 class="hero__title">Brand assets,<br><em>algorithmically derived</em></h1>
      <p class="hero__desc">One seed. Infinite consistency. Every color, shadow, and spacing value is computed from three variables. Change the seed — rebrand the world.</p>
      <div class="hero__actions">
        <a href="#seed" class="btn btn--primary btn--lg">Explore the Seed</a>
        <a href="#document" class="btn btn--secondary btn--lg">View Document</a>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════
         S E E D   D E M O
         ═══════════════════════════════════════════════════════════ -->
    <section class="section" id="seed">
      <span class="section__label">The Aether</span>
      <h2 class="section__heading">Change the seed. Watch everything recompute.</h2>
      <p class="section__subheading">Every visual property is derived from these three values. Drag the hue slider and see the entire system transform in real time.</p>

      <div style="background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-xl);padding:var(--space-8);box-shadow:var(--shadow-md);">
        <!-- Hue Slider -->
        <div class="input-group" style="margin-bottom:var(--space-6);">
          <label class="input-group__label" for="hue-slider">Seed Hue — <code id="hue-value" style="font-family:var(--font-mono);font-size:var(--text-sm);color:var(--color-primary);">240</code></label>
          <input type="range" id="hue-slider" min="0" max="360" value="240" style="width:100%;accent-color:var(--color-primary);cursor:pointer;height:8px;">
          <p class="input-group__hint">0 = red · 60 = yellow · 120 = green · 240 = blue · 300 = magenta</p>
        </div>

        <!-- Saturation Slider -->
        <div class="input-group" style="margin-bottom:var(--space-8);">
          <label class="input-group__label" for="sat-slider">Saturation — <code id="sat-value" style="font-family:var(--font-mono);font-size:var(--text-sm);color:var(--color-primary);">72%</code></label>
          <input type="range" id="sat-slider" min="0" max="100" value="72" style="width:100%;accent-color:var(--color-primary);cursor:pointer;height:8px;">
        </div>

        <!-- Palette Preview -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(4rem,1fr));gap:var(--space-2);margin-bottom:var(--space-6);" id="palette-preview">
        </div>

        <p style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--fg-subtle);text-align:center;">
          CSS Custom Properties recomputing via <code>--seed-hue</code> and <code>--seed-sat</code>
        </p>
      </div>
    </section>

    <hr class="separator separator--faded">

    <!-- ═══════════════════════════════════════════════════════════
         C A R D S
         ═══════════════════════════════════════════════════════════ -->
    <section class="section" id="cards">
      <span class="section__label">Components</span>
      <h2 class="section__heading">Cards</h2>
      <p class="section__subheading">Content containers that inherit their soul from the aether. Four variants, one truth.</p>

      <div class="card-grid" style="margin-bottom:var(--space-12);">
        <!-- Standard -->
        <article class="card">
          <div style="background:linear-gradient(135deg,var(--color-primary-bg-hover),var(--color-primary-bg));aspect-ratio:16/9;display:grid;place-items:center;">
            <span style="font-size:3rem;" aria-hidden="true">🏗️</span>
          </div>
          <div class="card__body">
            <span class="card__tag">Architecture</span>
            <h3 class="card__title"><a href="#">Token-Driven Design</a></h3>
            <p class="card__desc">Every color, spacing value, and shadow is computed from a single hue seed. Change the seed, rebrand the world.</p>
          </div>
          <div class="card__footer">
            <span>5 min read</span>
            <a href="#" class="btn btn--ghost btn--sm">Read →</a>
          </div>
        </article>

        <!-- Highlighted -->
        <article class="card card--highlight">
          <div style="background:linear-gradient(135deg,var(--color-accent),var(--color-primary));aspect-ratio:16/9;display:grid;place-items:center;">
            <span style="font-size:3rem;color:var(--fg-on-primary);" aria-hidden="true">⚡</span>
          </div>
          <div class="card__body">
            <span class="card__tag" style="background:var(--color-accent-10);color:var(--color-accent);">Performance</span>
            <h3 class="card__title"><a href="#">Zero Runtime Cost</a></h3>
            <p class="card__desc">Pure CSS variables. No JavaScript. No build step. The algorithm is the cascade itself.</p>
          </div>
          <div class="card__footer">
            <span>3 min read</span>
            <a href="#" class="btn btn--ghost btn--sm">Read →</a>
          </div>
        </article>

        <!-- Ghost -->
        <article class="card card--ghost">
          <div class="card__body" style="min-height:14rem;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;">
            <span style="font-size:2.5rem;margin-bottom:var(--space-3);" aria-hidden="true">✦</span>
            <h3 class="card__title">Add Your Own</h3>
            <p class="card__desc">The aether extends infinitely. Every new component inherits the tokens automatically.</p>
            <a href="#" class="btn btn--secondary btn--sm" style="margin-top:var(--space-4);">Create</a>
          </div>
        </article>
      </div>

      <!-- Card + Avatar row -->
      <h3 style="font-size:var(--text-md);font-weight:var(--weight-bold);color:var(--fg);margin-bottom:var(--space-4);">Cards with Avatars</h3>
      <div class="card-grid card-grid--2">
        <article class="card card--flat">
          <div class="card__body">
            <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3);">
              <div class="avatar avatar--md" style="background:var(--color-primary-bg-hover);color:var(--color-primary-fg-muted);">Æ</div>
              <div>
                <div style="font-weight:var(--weight-semi);font-size:var(--text-sm);">Aether Team</div>
                <div style="font-size:var(--text-xs);color:var(--fg-subtle);">2 hours ago</div>
              </div>
              <span class="badge badge--success badge--sm" style="margin-left:auto;"><span class="badge__dot"></span> Live</span>
            </div>
            <h3 class="card__title">Real-Time Token Sync</h3>
            <p class="card__desc">Change a single CSS variable and watch every component update instantly. No rebuild required.</p>
          </div>
        </article>
        <article class="card card--flat">
          <div class="card__body">
            <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3);">
              <div class="avatar avatar--md" style="background:var(--color-accent-10);color:var(--color-accent);">⚡</div>
              <div>
                <div style="font-weight:var(--weight-semi);font-size:var(--text-sm);">Performance</div>
                <div style="font-size:var(--text-xs);color:var(--fg-subtle);">yesterday</div>
              </div>
              <span class="badge badge--primary badge--sm" style="margin-left:auto;">v2.0</span>
            </div>
            <h3 class="card__title">Sub-Millisecond Recomputation</h3>
            <p class="card__desc">The browser's CSS engine is the runtime. Zero JavaScript. Zero layout thrash. Pure cascade.</p>
          </div>
        </article>
      </div>
    </section>

    <hr class="separator separator--faded">

    <!-- ═══════════════════════════════════════════════════════════
         P A P E R
         ═══════════════════════════════════════════════════════════ -->
    <section class="section" id="paper">
      <span class="section__label">Surface</span>
      <h2 class="section__heading">Paper</h2>
      <p class="section__subheading">Long-form content surfaces for articles, guides, and documentation.</p>

      <div class="paper" style="max-width:var(--container-lg);margin-inline:auto;">
        <div class="paper__header">
          <h1 class="paper__title">The Algorithm Is the Design</h1>
          <p class="paper__subtitle">How aether tokens create consistency without constraint</p>
          <div class="paper__meta">
            <span class="paper__meta-item">📅 June 2026</span>
            <span class="paper__meta-item">
              <span class="avatar avatar--xs" style="background:var(--color-primary-bg-hover);color:var(--color-primary-fg-muted);display:inline-flex;font-size:var(--text-2xs);">Æ</span>
              Aether Team
            </span>
            <span class="paper__meta-item">⏱ 8 min read</span>
            <span class="paper__meta-item"><span class="badge badge--primary badge--sm"><span class="badge__dot"></span> Design Systems</span></span>
          </div>
        </div>

        <div class="paper__body">
          <p>Traditional design systems are museums. You walk through, admire the exhibits, and try your best not to touch anything. The aether is different. It's a <strong>living algorithm</strong> — a mathematical relationship between values that guarantees harmony without dictating form.</p>

          <h2>The Seed</h2>
          <p>Everything begins with three variables: a hue, a saturation, and a luminance. From these, the entire palette is computed using perceptually uniform color math. No guessing. No squinting at hex values. The HSL color model ensures that every derived shade is in harmony with the seed.</p>

          <blockquote>
            "The constraint is not a prison — it is a compass. The algorithm points the way; the designer walks the path."
          </blockquote>

          <h2>The Cascade</h2>
          <p>CSS custom properties are the runtime. When you change <code>--seed-hue: 240</code> to <code>--seed-hue: 15</code>, every component, every shadow, every border color recomputes. The brand shifts from <em>indigo authority</em> to <em>amber warmth</em> — without touching a single component file.</p>

          <h3>Derived Values</h3>
          <ul>
            <li><strong>Colors</strong> — 11 primary stops + full neutral palette computed via HSL offsets</li>
            <li><strong>Typography</strong> — a modular scale (1.25×) with per-size line-height tuning</li>
            <li><strong>Spacing</strong> — base-4 rhythm grid that creates visual silence</li>
            <li><strong>Shadows</strong> — layered, calibrated opacity stops that feel natural</li>
            <li><strong>Transitions</strong> — five easing curves + four duration levels, reduced-motion aware</li>
          </ul>

          <p>And every one of these — every token — feeds into semantic aliases. <code>--fg</code>, <code>--bg</code>, <code>--border</code>, <code>--ring</code>. These aliases flip automatically in dark mode. Components never reference raw palette values directly. They speak in semantic terms. This is the aether.</p>
        </div>

        <div class="paper__footer">
          <span class="badge badge--success"><span class="badge__dot"></span> Published</span>
          <div class="btn-group">
            <button class="btn btn--ghost btn--sm">Share</button>
            <button class="btn btn--secondary btn--sm">Bookmark</button>
          </div>
        </div>
      </div>
    </section>

    <hr class="separator separator--faded">

    <!-- ═══════════════════════════════════════════════════════════
         D O C U M E N T
         ═══════════════════════════════════════════════════════════ -->
    <section class="section" id="document">
      <span class="section__label">Formal</span>
      <h2 class="section__heading">Documents</h2>
      <p class="section__subheading">Invoices, contracts, letters, and reports. Every surface inherits the brand.</p>

      <div class="document">
        <div class="document__header">
          <div class="document__header-info">
            <a href="#" class="logo logo--compact" style="margin-bottom:var(--space-3);">
              <span class="logo__mark">Æ</span>
              <span class="logo__wordmark">Aether</span>
            </a>
            <h1>Invoice #AE-2026-0042</h1>
            <p>Brand Asset Delivery</p>
          </div>
          <div class="document__header-meta">
            Date: July 2, 2026<br>
            Due: August 2, 2026<br>
            Status: <span class="badge badge--success badge--sm"><span class="badge__dot"></span> Paid</span>
          </div>
        </div>

        <div class="document__body">
          <div class="document__addresses">
            <div>
              <div class="document__address-label">From</div>
              <div class="document__address-body">
                <strong>Aether Design Systems Inc.</strong><br>
                42 Algorithmic Way<br>
                Cascade City, CS 00000
              </div>
            </div>
            <div>
              <div class="document__address-label">To</div>
              <div class="document__address-body">
                <strong>The Endeavour</strong><br>
                Your Address Here<br>
                Your City, ST 00000
              </div>
            </div>
          </div>

          <table class="document__table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th class="amount">Rate</th>
                <th class="amount">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="description">Brand Token System — Full Palette</td>
                <td>1</td>
                <td class="amount">$4,200</td>
                <td class="amount">$4,200</td>
              </tr>
              <tr>
                <td class="description">Header Component — Responsive Navigation</td>
                <td>1</td>
                <td class="amount">$1,800</td>
                <td class="amount">$1,800</td>
              </tr>
              <tr>
                <td class="description">Footer Component — 4-Column Grid</td>
                <td>1</td>
                <td class="amount">$1,200</td>
                <td class="amount">$1,200</td>
              </tr>
              <tr>
                <td class="description">Card System — 4 Variants + Grid</td>
                <td>1</td>
                <td class="amount">$2,400</td>
                <td class="amount">$2,400</td>
              </tr>
              <tr>
                <td class="description">Paper + Document Templates</td>
                <td>1</td>
                <td class="amount">$3,000</td>
                <td class="amount">$3,000</td>
              </tr>
            </tbody>
          </table>

          <div class="document__totals">
            <div class="document__totals-inner">
              <div class="document__totals-row">
                <span>Subtotal</span>
                <span>$12,600</span>
              </div>
              <div class="document__totals-row">
                <span>Tax</span>
                <span>$1,008</span>
              </div>
              <div class="document__totals-row document__totals-row--grand">
                <span>Total</span>
                <span>$13,608</span>
              </div>
            </div>
          </div>

          <div class="document__seal">
            ✓ AUTHENTICATED — Aether Brand Asset Delivery Confirmed
          </div>
        </div>

        <div class="document__footer">
          Aether Design Systems Inc. · 42 Algorithmic Way, Cascade City · hello@aether.design<br>
          Thank you for your business. All assets are algorithmically guaranteed.
        </div>
      </div>
    </section>

    <hr class="separator separator--faded">

    <!-- ═══════════════════════════════════════════════════════════
         C O M P O N E N T S
         ═══════════════════════════════════════════════════════════ -->
    <section class="section" id="components">
      <span class="section__label">Primitives</span>
      <h2 class="section__heading">Every Component</h2>
      <p class="section__subheading">Buttons, badges, alerts, inputs, avatars, skeletons, tables, tooltips, tabs — all derived from the seed.</p>

      <!-- Breadcrumb -->
      <div style="margin-bottom:var(--space-10);">
        <h3 style="font-size:var(--text-md);font-weight:var(--weight-bold);color:var(--fg);margin-bottom:var(--space-4);">Breadcrumb</h3>
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <div class="breadcrumb__item"><a href="#">Home</a></div>
          <span class="breadcrumb__sep" aria-hidden="true">›</span>
          <div class="breadcrumb__item"><a href="#">Components</a></div>
          <span class="breadcrumb__sep" aria-hidden="true">›</span>
          <div class="breadcrumb__item breadcrumb__item--current" aria-current="page">Breadcrumb</div>
        </nav>
      </div>

      <!-- Tabs -->
      <div style="margin-bottom:var(--space-10);">
        <h3 style="font-size:var(--text-md);font-weight:var(--weight-bold);color:var(--fg);margin-bottom:var(--space-4);">Tabs</h3>
        <div class="tabs">
          <button class="tabs__tab tabs__tab--active">Overview</button>
          <button class="tabs__tab">Analytics</button>
          <button class="tabs__tab">Settings</button>
          <button class="tabs__tab">Members</button>
        </div>
      </div>

      <!-- Buttons -->
      <div style="margin-bottom:var(--space-10);">
        <h3 style="font-size:var(--text-md);font-weight:var(--weight-bold);color:var(--fg);margin-bottom:var(--space-4);">Buttons</h3>
        <div style="display:flex;flex-direction:column;gap:var(--space-4);">
          <div class="btn-group">
            <button class="btn btn--primary">Primary</button>
            <button class="btn btn--secondary">Secondary</button>
            <button class="btn btn--outline">Outline</button>
            <button class="btn btn--ghost">Ghost</button>
            <button class="btn btn--danger">Danger</button>
          </div>
          <div class="btn-group">
            <button class="btn btn--primary btn--xs">Extra Small</button>
            <button class="btn btn--primary btn--sm">Small</button>
            <button class="btn btn--primary">Default</button>
            <button class="btn btn--primary btn--lg">Large</button>
            <button class="btn btn--primary btn--xl">Extra Large</button>
          </div>
          <div class="btn-group">
            <button class="btn btn--primary" disabled>Disabled</button>
            <button class="btn btn--primary btn--block" style="max-width:16rem;">Block</button>
          </div>
        </div>
      </div>

      <!-- Badges -->
      <div style="margin-bottom:var(--space-10);">
        <h3 style="font-size:var(--text-md);font-weight:var(--weight-bold);color:var(--fg);margin-bottom:var(--space-4);">Badges</h3>
        <div class="btn-group">
          <span class="badge badge--primary"><span class="badge__dot"></span> Primary</span>
          <span class="badge badge--success"><span class="badge__dot"></span> Success</span>
          <span class="badge badge--warning"><span class="badge__dot"></span> Warning</span>
          <span class="badge badge--danger"><span class="badge__dot"></span> Danger</span>
          <span class="badge badge--neutral">Neutral</span>
          <span class="badge badge--accent">Accent</span>
          <span class="badge badge--success badge--sm"><span class="badge__dot"></span> Small</span>
          <span class="badge badge--primary badge--lg"><span class="badge__dot"></span> Large</span>
        </div>
      </div>

      <!-- Avatars -->
      <div style="margin-bottom:var(--space-10);">
        <h3 style="font-size:var(--text-md);font-weight:var(--weight-bold);color:var(--fg);margin-bottom:var(--space-4);">Avatars</h3>
        <div style="display:flex;align-items:center;gap:var(--space-3);flex-wrap:wrap;">
          <div class="avatar avatar--xs" style="background:var(--color-primary-bg-hover);color:var(--color-primary-fg-muted);">Æ</div>
          <div class="avatar avatar--sm" style="background:var(--color-primary-bg-hover);color:var(--color-primary-fg-muted);">Æ</div>
          <div class="avatar avatar--md" style="background:var(--color-primary-bg-hover);color:var(--color-primary-fg-muted);">Æ</div>
          <div class="avatar avatar--lg" style="background:var(--color-primary-bg-hover);color:var(--color-primary-fg-muted);">Æ</div>
          <div class="avatar avatar--xl" style="background:var(--color-primary-bg-hover);color:var(--color-primary-fg-muted);">Æ</div>
          <div class="avatar avatar--2xl" style="background:linear-gradient(135deg,var(--color-primary),var(--color-accent));color:var(--fg-on-primary);">Æ</div>
          <span style="width:var(--space-4);"></span>
          <div class="avatar avatar--lg" style="background:var(--color-success-10);color:var(--color-success);">✓</div>
          <div class="avatar avatar--lg" style="background:var(--color-warning-10);color:var(--color-warning);">⚠</div>
          <div class="avatar avatar--lg" style="background:var(--color-danger-10);color:var(--color-danger);">✕</div>
        </div>
        <div style="margin-top:var(--space-4);display:flex;align-items:center;gap:var(--space-4);">
          <div class="avatar-stack" style="position:relative; z-index:5;">
            <div class="avatar avatar--md" style="background:var(--color-primary-bg-hover);color:var(--color-primary-fg-muted);position:relative;z-index:5;">A</div>
            <div class="avatar avatar--md" style="background:var(--color-accent-10);color:var(--color-accent);position:relative;z-index:4;">B</div>
            <div class="avatar avatar--md" style="background:var(--color-success-10);color:var(--color-success);position:relative;z-index:3;">C</div>
            <div class="avatar-stack__more">+5</div>
          </div>
        </div>
      </div>

      <!-- Alerts -->
      <div style="margin-bottom:var(--space-10);">
        <h3 style="font-size:var(--text-md);font-weight:var(--weight-bold);color:var(--fg);margin-bottom:var(--space-4);">Alerts</h3>
        <div style="display:flex;flex-direction:column;gap:var(--space-3);max-width:42rem;">
          <div class="alert alert--info">
            <span class="alert__icon">ℹ️</span>
            <div class="alert__content">
              <div class="alert__title">Information</div>
              <div class="alert__text">The aether seed has been updated. All components will recompute automatically.</div>
            </div>
          </div>
          <div class="alert alert--success">
            <span class="alert__icon">✅</span>
            <div class="alert__content">
              <div class="alert__title">Success</div>
              <div class="alert__text">Brand assets deployed to production.</div>
            </div>
          </div>
          <div class="alert alert--warning">
            <span class="alert__icon">⚠️</span>
            <div class="alert__content">
              <div class="alert__title">Warning</div>
              <div class="alert__text">Token drift detected. Consider re-synchronizing your seed values.</div>
            </div>
          </div>
          <div class="alert alert--danger">
            <span class="alert__icon">🚫</span>
            <div class="alert__content">
              <div class="alert__title">Error</div>
              <div class="alert__text">Invalid hue value. Must be between 0–360.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Inputs -->
      <div style="margin-bottom:var(--space-10);">
        <h3 style="font-size:var(--text-md);font-weight:var(--weight-bold);color:var(--fg);margin-bottom:var(--space-4);">Form Inputs</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(14rem,1fr));gap:var(--space-4);max-width:42rem;">
          <div class="input-group">
            <label class="input-group__label" for="demo-name">Full Name</label>
            <input type="text" id="demo-name" class="input" placeholder="Ada Lovelace">
          </div>
          <div class="input-group">
            <label class="input-group__label" for="demo-email">Email</label>
            <input type="email" id="demo-email" class="input" placeholder="ada@aether.design">
          </div>
          <div class="input-group">
            <label class="input-group__label" for="demo-select">Role</label>
            <select id="demo-select" class="select">
              <option>Designer</option>
              <option>Developer</option>
              <option>Both</option>
            </select>
          </div>
          <div class="input-group">
            <label class="input-group__label" for="demo-error">API Key</label>
            <input type="text" id="demo-error" class="input input--error" value="invalid-key">
            <span class="input-group__error">Invalid API key format</span>
          </div>
        </div>
        <div style="display:flex;gap:var(--space-4);margin-top:var(--space-4);flex-wrap:wrap;align-items:center;">
          <label class="check">
            <input type="checkbox" class="check__box" checked>
            Accept terms
          </label>
          <label class="check">
            <input type="checkbox" class="check__box">
            Subscribe to updates
          </label>
          <label class="toggle">
            <input type="checkbox" class="toggle__input">
            <div class="toggle__track"></div>
            Dark mode
          </label>
        </div>
      </div>

      <!-- Table -->
      <div style="margin-bottom:var(--space-10);">
        <h3 style="font-size:var(--text-md);font-weight:var(--weight-bold);color:var(--fg);margin-bottom:var(--space-4);">Data Table</h3>
        <div class="table-wrapper" style="max-width:42rem;">
          <table class="table table--striped">
            <thead>
              <tr>
                <th>Token</th>
                <th>Value</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code style="font-family:var(--font-mono);font-size:var(--text-xs);background:var(--bg-subtle);padding:0.1em 0.4em;border-radius:var(--radius-sm);">--seed-hue</code></td><td>240</td><td><span class="badge badge--primary badge--sm">Seed</span></td></tr>
              <tr><td><code style="font-family:var(--font-mono);font-size:var(--text-xs);background:var(--bg-subtle);padding:0.1em 0.4em;border-radius:var(--radius-sm);">--seed-sat</code></td><td>72%</td><td><span class="badge badge--primary badge--sm">Seed</span></td></tr>
              <tr><td><code style="font-family:var(--font-mono);font-size:var(--text-xs);background:var(--bg-subtle);padding:0.1em 0.4em;border-radius:var(--radius-sm);">--ratio</code></td><td>1.25</td><td><span class="badge badge--accent badge--sm">Typography</span></td></tr>
              <tr><td><code style="font-family:var(--font-mono);font-size:var(--text-xs);background:var(--bg-subtle);padding:0.1em 0.4em;border-radius:var(--radius-sm);">--radius-xl</code></td><td>1rem</td><td><span class="badge badge--neutral badge--sm">Radii</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Skeleton -->
      <div style="margin-bottom:var(--space-10);">
        <h3 style="font-size:var(--text-md);font-weight:var(--weight-bold);color:var(--fg);margin-bottom:var(--space-4);">Skeleton Loading</h3>
        <div class="card-grid" style="max-width:40rem;">
          <div class="skeleton-card">
            <div class="skeleton-card__image skeleton skeleton--image"></div>
            <div class="skeleton-card__body">
              <div class="skeleton skeleton--heading" style="width:60%;"></div>
              <div class="skeleton skeleton--text" style="width:100%;"></div>
              <div class="skeleton skeleton--text skeleton--w75"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Separators -->
      <div style="margin-bottom:var(--space-10);">
        <h3 style="font-size:var(--text-md);font-weight:var(--weight-bold);color:var(--fg);margin-bottom:var(--space-4);">Separators</h3>
        <div style="display:flex;flex-direction:column;gap:var(--space-3);max-width:24rem;">
          <hr class="separator separator--line">
          <hr class="separator separator--dashed">
          <hr class="separator separator--thick">
          <hr class="separator separator--faded">
        </div>
      </div>

      <!-- Tooltips -->
      <div style="margin-bottom:var(--space-10);">
        <h3 style="font-size:var(--text-md);font-weight:var(--weight-bold);color:var(--fg);margin-bottom:var(--space-4);">Tooltips</h3>
        <div class="btn-group">
          <span class="tooltip" data-tooltip="Copy to clipboard"><button class="btn btn--outline btn--sm">📋 Copy</button></span>
          <span class="tooltip" data-tooltip="Download assets"><button class="btn btn--outline btn--sm">⬇ Download</button></span>
          <span class="tooltip" data-tooltip="Share this page"><button class="btn btn--outline btn--sm">↗ Share</button></span>
        </div>
      </div>

    </section>

  </main>

  <!-- ═══════════════════════════════════════════════════════════
       F O O T E R
       ═══════════════════════════════════════════════════════════ -->
  <footer class="footer">
    <div class="footer__grid">
      <div class="footer__brand">
        <a href="#" class="logo">
          <span class="logo__mark">Æ</span>
          <span class="logo__wordmark">Aether</span>
        </a>
        <p class="footer__tagline">Algorithmically extracted brand assets from the shared UI aether. One seed, infinite consistency.</p>
        <div class="footer__social">
          <a href="#" class="footer__social-link" title="GitHub" aria-label="GitHub">⌥</a>
          <a href="#" class="footer__social-link" title="Twitter" aria-label="Twitter">✦</a>
          <a href="#" class="footer__social-link" title="Dribbble" aria-label="Dribbble">◉</a>
        </div>
      </div>
      <div class="footer__column">
        <h4>Components</h4>
        <ul>
          <li><a href="#">Headers</a></li>
          <li><a href="#">Footers</a></li>
          <li><a href="#">Cards</a></li>
          <li><a href="#">Papers</a></li>
          <li><a href="#">Documents</a></li>
        </ul>
      </div>
      <div class="footer__column">
        <h4>Primitives</h4>
        <ul>
          <li><a href="#">Buttons</a></li>
          <li><a href="#">Badges</a></li>
          <li><a href="#">Alerts</a></li>
          <li><a href="#">Inputs</a></li>
          <li><a href="#">Tables</a></li>
        </ul>
      </div>
      <div class="footer__column">
        <h4>Resources</h4>
        <ul>
          <li><a href="#">Token Reference</a></li>
          <li><a href="#">Design Guide</a></li>
          <li><a href="#">Changelog</a></li>
          <li><a href="#">License</a></li>
        </ul>
      </div>
    </div>
    <div class="footer__bottom">
      <span>© 2026 Æther Design Systems. All tokens derived.</span>
      <span>Zero runtime. Pure cascade. CSS Custom Properties.</span>
    </div>
  </footer>

  <!-- ═══════════════════════════════════════════════════════════
       J A V A S C R I P T
       Minimal, progressive enhancement only.
       ═══════════════════════════════════════════════════════════ -->
  <script>
    // ── Sticky header shadow ──
    const header = document.getElementById('header');
    const onScroll = () => header.classList.toggle('header--scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ── Interactive seed demo ──
    const root = document.documentElement;
    const hueSlider = document.getElementById('hue-slider');
    const satSlider = document.getElementById('sat-slider');
    const hueValue = document.getElementById('hue-value');
    const satValue = document.getElementById('sat-value');
    const paletteEl = document.getElementById('palette-preview');

    function updateSeed() {
      const hue = hueSlider.value;
      const sat = satSlider.value;
      root.style.setProperty('--seed-hue', hue);
      root.style.setProperty('--seed-sat', sat + '%');
      hueValue.textContent = hue;
      satValue.textContent = sat + '%';
      renderPalette(hue, sat);
    }

    function renderPalette(hue, sat) {
      const stops = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90];
      paletteEl.innerHTML = stops.map(l =>
        `<div style="
          background: hsl(${hue}, ${sat}%, ${l}%);
          border-radius: var(--radius-md);
          height: 2.5rem;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 4px;
          font-family: var(--font-mono);
          font-size: var(--text-2xs);
          color: ${l > 55 ? 'var(--fg-on-primary)' : 'var(--fg)'};
          text-shadow: ${l > 55 ? '0 1px 2px rgba(0,0,0,.3)' : 'none'};
        ">${l}%</div>`
      ).join('');
    }

    hueSlider.addEventListener('input', updateSeed);
    satSlider.addEventListener('input', updateSeed);
    updateSeed();

    // ── Active nav link on scroll ──
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__link');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle('header__link--active',
              link.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    sections.forEach(s => observer.observe(s));

    // ── Smooth scroll for anchor links ──
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Close mobile nav
          header.classList.remove('header--open');
        }
      });
    });
  </script>

</body>
</html><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Æther — Algorithmic Brand System</title>
  <meta name="description" content="One seed. Infinite consistency. Every color, shadow, and spacing value computed from three CSS variables. Zero runtime.">
  <meta property="og:title" content="Æther — Algorithmic Brand System">
  <meta property="og:description" content="Change three CSS variables. Rebrand everything.">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Merriweather:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="aether.css">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>Æ</text></svg>">
  <style>
    /* ━━━ Marketing Hub — Extended Styles ━━━ */
    .hero-anim {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      z-index: 0;
    }
    .hero-anim__orb {
      position: absolute;
      border-radius: var(--radius-full);
      filter: blur(80px);
      opacity: 0.3;
      animation: orb-float 20s ease-in-out infinite alternate;
    }
    .hero-anim__orb--1 {
      width: 40rem; height: 40rem;
      background: var(--color-primary);
      top: -15rem; right: -10rem;
      animation-delay: 0s;
    }
    .hero-anim__orb--2 {
      width: 30rem; height: 30rem;
      background: var(--color-accent);
      bottom: -10rem; left: -8rem;
      animation-delay: -7s;
    }
    .hero-anim__orb--3 {
      width: 20rem; height: 20rem;
      background: var(--color-primary);
      top: 50%; left: 50%;
      animation-delay: -14s;
    }
    @keyframes orb-float {
      0%   { transform: translate(0, 0) scale(1); }
      33%  { transform: translate(3rem, -2rem) scale(1.05); }
      66%  { transform: translate(-2rem, 3rem) scale(0.95); }
      100% { transform: translate(1rem, -1rem) scale(1.02); }
    }
    @media (prefers-reduced-motion: reduce) {
      .hero-anim__orb { animation: none; }
    }

    /* ── Live code preview ── */
    .code-window {
      background: var(--color-neutral-90);
      color: var(--color-neutral-10);
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-2xl);
      border: 1px solid var(--color-neutral-80);
    }
    .code-window__bar {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-4);
      background: var(--color-neutral-80);
      border-bottom: 1px solid var(--color-neutral-70);
    }
    .code-window__dot {
      width: 0.75rem; height: 0.75rem;
      border-radius: var(--radius-full);
    }
    .code-window__dot--red { background: hsl(0, 78%, 56%); }
    .code-window__dot--yellow { background: hsl(38, 92%, 50%); }
    .code-window__dot--green { background: hsl(152, 68%, 42%); }
    .code-window__title {
      flex: 1;
      text-align: center;
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      color: var(--color-neutral-40);
    }
    .code-window__body {
      padding: var(--space-5) var(--space-6);
      font-family: var(--font-mono);
      font-size: var(--text-sm);
      line-height: var(--leading-relaxed);
      overflow-x: auto;
    }
    .code-window__body .tok-keyword { color: hsl(280, 68%, 70%); }
    .code-window__body .tok-prop { color: hsl(200, 70%, 70%); }
    .code-window__body .tok-value { color: hsl(152, 60%, 65%); }
    .code-window__body .tok-comment { color: var(--color-neutral-50); font-style: italic; }
    .code-window__body .tok-string { color: hsl(38, 80%, 70%); }
    .code-window__body .tok-punct { color: var(--color-neutral-50); }

    /* ── Feature grid ── */
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
      gap: var(--space-6);
    }
    .feature {
      padding: var(--space-6);
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      transition:
        box-shadow var(--duration-normal) var(--ease-default),
        border-color var(--duration-normal) var(--ease-default);
    }
    .feature:hover {
      box-shadow: var(--shadow-lg);
      border-color: var(--color-primary-border);
    }
    .feature__icon {
      width: 3rem;
      height: 3rem;
      display: grid;
      place-items: center;
      border-radius: var(--radius-lg);
      background: var(--color-primary-bg);
      color: var(--color-primary-fg);
      font-size: var(--text-md);
      margin-bottom: var(--space-4);
    }
    .feature__title {
      font-family: var(--font-sans);
      font-size: var(--text-md);
      font-weight: var(--weight-bold);
      color: var(--fg);
      margin-bottom: var(--space-2);
    }
    .feature__desc {
      font-family: var(--font-sans);
      font-size: var(--text-sm);
      color: var(--fg-muted);
      line-height: var(--leading-relaxed);
    }

    /* ── Stat row ── */
    .stat-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
      gap: var(--space-6);
    }
    .stat {
      text-align: center;
      padding: var(--space-6);
    }
    .stat__number {
      font-family: var(--font-sans);
      font-size: var(--text-3xl);
      font-weight: var(--weight-black);
      color: var(--color-primary-fg);
      line-height: var(--leading-none);
    }
    .stat__label {
      font-family: var(--font-sans);
      font-size: var(--text-sm);
      color: var(--fg-muted);
      margin-top: var(--space-2);
    }

    /* ── CTA ── */
    .cta {
      text-align: center;
      padding: var(--space-24) var(--space-6);
      background: linear-gradient(
        135deg,
        var(--color-primary-bg) 0%,
        var(--color-primary-bg-subtle) 50%,
        transparent 100%
      );
      border-radius: var(--radius-2xl);
      border: 1px solid var(--color-primary-bg-hover);
    }
    .cta__title {
      font-family: var(--font-sans);
      font-size: var(--text-2xl);
      font-weight: var(--weight-extra);
      color: var(--fg);
      margin-bottom: var(--space-3);
    }
    .cta__desc {
      font-family: var(--font-sans);
      font-size: var(--text-md);
      color: var(--fg-muted);
      max-width: 40ch;
      margin: 0 auto var(--space-6);
      line-height: var(--leading-relaxed);
    }

    /* ── Token showcase ── */
    .token-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
      gap: var(--space-3);
    }
    .token-swatch {
      border-radius: var(--radius-lg);
      overflow: hidden;
      border: 1px solid var(--border);
      transition: transform var(--duration-fast) var(--ease-bounce);
    }
    .token-swatch:hover {
      transform: scale(1.05);
    }
    .token-swatch__color {
      height: 3rem;
    }
    .token-swatch__info {
      padding: var(--space-2) var(--space-3);
      background: var(--bg);
      font-family: var(--font-mono);
      font-size: var(--text-2xs);
    }
    .token-swatch__name {
      color: var(--fg);
      font-weight: var(--weight-semi);
    }
    .token-swatch__value {
      color: var(--fg-subtle);
      margin-top: 2px;
    }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      .stat-row { grid-template-columns: repeat(2, 1fr); }
      .feature-grid { grid-template-columns: 1fr; }
      .token-grid { grid-template-columns: repeat(3, 1fr); }
    }

    /* ── Print ── */
    @media print {
      .hero-anim, .code-window, .no-print { display: none; }
      .hero { min-height: auto; padding: var(--space-8) var(--space-4); }
    }
  </style>
</head>
<body>

  <a href="#main" class="skip-link">Skip to content</a>

  <!-- ═══════ HEADER ═══════ -->
  <header class="header" id="header">
    <div class="header__brand">
      <a href="#" class="logo logo--compact">
        <span class="logo__mark">Æ</span>
        <span class="logo__wordmark">Aether</span>
      </a>
    </div>
    <nav class="header__nav" aria-label="Primary">
      <a href="#features" class="header__link">Features</a>
      <a href="#components" class="header__link">Components</a>
      <a href="#tokens" class="header__link">Tokens</a>
      <a href="#code" class="header__link">Code</a>
      <a href="showcase.html" class="header__link">Showcase</a>
    </nav>
    <div class="header__actions no-print">
      <a href="showcase.html" class="btn btn--primary btn--sm">Get Started</a>
    </div>
    <button class="header__toggle" onclick="document.getElementById('header').classList.toggle('header--open')" aria-label="Toggle navigation">☰</button>
  </header>

  <main id="main">

    <!-- ═══════ HERO ═══════ -->
    <section class="hero" id="hero">
      <div class="hero-anim" aria-hidden="true">
        <div class="hero-anim__orb hero-anim__orb--1"></div>
        <div class="hero-anim__orb hero-anim__orb--2"></div>
        <div class="hero-anim__orb hero-anim__orb--3"></div>
      </div>
      <span class="section__label">Open-Source Design System</span>
      <h1 class="hero__title">Brand assets,<br><em>algorithmically derived</em></h1>
      <p class="hero__desc">Three CSS variables define an entire brand system. Change the seed — watch 254 tokens, 18 components, and every shadow recompose. Zero JavaScript. Zero build step. The cascade is the algorithm.</p>
      <div class="hero__actions no-print">
        <a href="showcase.html" class="btn btn--primary btn--lg">Explore Showcase</a>
        <a href="#code" class="btn btn--outline btn--lg">See the Code</a>
      </div>
    </section>

    <!-- ═══════ STATS ═══════ -->
    <section class="section">
      <div class="stat-row">
        <div class="stat">
          <div class="stat__number" id="stat-seed">3</div>
          <div class="stat__label">Seed variables</div>
        </div>
        <div class="stat">
          <div class="stat__number" id="stat-tokens">254</div>
          <div class="stat__label">Derived tokens</div>
        </div>
        <div class="stat">
          <div class="stat__number" id="stat-components">18</div>
          <div class="stat__label">Components</div>
        </div>
        <div class="stat">
          <div class="stat__number">0</div>
          <div class="stat__label">Dependencies</div>
        </div>
        <div class="stat">
          <div class="stat__number">0</div>
          <div class="stat__label">JavaScript required</div>
        </div>
      </div>
    </section>

    <hr class="separator separator--faded separator--sparse">

    <!-- ═══════ FEATURES ═══════ -->
    <section class="section" id="features">
      <span class="section__label">Why Æther</span>
      <h2 class="section__heading">Every value derived. Nothing hardcoded.</h2>
      <p class="section__subheading">Change a single hue and watch the entire system transform. Dark mode, reduced motion, high contrast — all automatic.</p>

      <div class="feature-grid">
        <div class="feature">
          <div class="feature__icon">🌱</div>
          <div class="feature__title">One Seed</div>
          <div class="feature__desc">Three CSS custom properties define every color, shadow, and spacing value. Change the seed, rebrand the world.</div>
        </div>
        <div class="feature">
          <div class="feature__icon">🌙</div>
          <div class="feature__title">Dark Mode</div>
          <div class="feature__desc">Automatic via <code style="font-family:var(--font-mono);font-size:0.9em;padding:0.1em 0.4em;background:var(--bg-subtle);border-radius:var(--radius-sm);">prefers-color-scheme</code>. 30+ tokens flip including semantic aliases. Zero config.</div>
        </div>
        <div class="feature">
          <div class="feature__icon">♿</div>
          <div class="feature__title">Accessible</div>
          <div class="feature__desc">Focus rings on every interactive element. Reduced motion respected. High contrast supported. WCAG AA contrast ratios.</div>
        </div>
        <div class="feature">
          <div class="feature__icon">⚡</div>
          <div class="feature__title">Zero Runtime</div>
          <div class="feature__desc">Pure CSS custom properties. No JavaScript. No build step. No npm install. The cascade is the algorithm.</div>
        </div>
        <div class="feature">
          <div class="feature__icon">🖨️</div>
          <div class="feature__title">Print Ready</div>
          <div class="feature__desc">Every surface includes <code style="font-family:var(--font-mono);font-size:0.9em;padding:0.1em 0.4em;background:var(--bg-subtle);border-radius:var(--radius-sm);">@media print</code> styles that strip decorative chrome for clean output.</div>
        </div>
        <div class="feature">
          <div class="feature__icon">📐</div>
          <div class="feature__title">Mathematical Scale</div>
          <div class="feature__desc">Typography on a 1.25× Major Third scale. Spacing on a base-4 rhythm. Radii, shadows, durations — all systematic.</div>
        </div>
      </div>
    </section>

    <hr class="separator separator--faded separator--sparse">

    <!-- ═══════ LIVE SEED DEMO ═══════ -->
    <section class="section" id="seed-demo">
      <span class="section__label">Live Demo</span>
      <h2 class="section__heading">Drag the hue. Watch everything recompute.</h2>
      <p class="section__subheading">This page is styled by Æther. The slider below changes one CSS variable. Every token, every component, every color follows.</p>

      <div style="background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-xl);padding:var(--space-8);box-shadow:var(--shadow-lg);margin-bottom:var(--space-8);">
        <div class="input-group" style="margin-bottom:var(--space-6);">
          <label class="input-group__label" for="hue-slider">Seed Hue — <code id="hue-value" style="font-family:var(--font-mono);font-size:var(--text-sm);color:var(--color-primary-fg);">240</code></label>
          <input type="range" id="hue-slider" min="0" max="360" value="240" style="width:100%;accent-color:var(--color-primary);cursor:pointer;height:8px;">
          <p class="input-group__hint">0 = red · 60 = yellow · 120 = green · 180 = cyan · 240 = blue · 300 = magenta</p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(10rem,1fr));gap:var(--space-4);">
          <div class="input-group">
            <label class="input-group__label" for="sat-slider">Saturation</label>
            <input type="range" id="sat-slider" min="0" max="100" value="72" style="width:100%;accent-color:var(--color-primary);cursor:pointer;height:8px;">
            <p class="input-group__hint" id="sat-value">72%</p>
          </div>
          <div class="input-group">
            <label class="input-group__label">Primary</label>
            <div style="height:2.5rem;border-radius:var(--radius-md);background:var(--color-primary);"></div>
          </div>
          <div class="input-group">
            <label class="input-group__label">Accent</label>
            <div style="height:2.5rem;border-radius:var(--radius-md);background:var(--color-accent);"></div>
          </div>
        </div>
      </div>

      <!-- Palette preview -->
      <h3 style="font-size:var(--text-md);font-weight:var(--weight-bold);color:var(--fg);margin-bottom:var(--space-4);">Derived Palette</h3>
      <div id="palette-preview" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(5rem,1fr));gap:var(--space-2);margin-bottom:var(--space-10);"></div>

      <!-- Component preview -->
      <h3 style="font-size:var(--text-md);font-weight:var(--weight-bold);color:var(--fg);margin-bottom:var(--space-4);">Component Preview</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(16rem,1fr));gap:var(--space-4);">
        <div>
          <div class="btn-group" style="flex-direction:column;align-items:stretch;">
            <button class="btn btn--primary">Primary Button</button>
            <button class="btn btn--secondary">Secondary Button</button>
            <button class="btn btn--outline">Outline Button</button>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:var(--space-3);">
          <div class="badge badge--primary"><span class="badge__dot"></span> Primary</div>
          <div class="badge badge--success"><span class="badge__dot"></span> Success</div>
          <div class="badge badge--warning"><span class="badge__dot"></span> Warning</div>
          <div class="badge badge--danger"><span class="badge__dot"></span> Danger</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:var(--space-3);">
          <div class="alert alert--info"><span class="alert__icon">ℹ️</span><div class="alert__content"><div class="alert__title">Info</div><div class="alert__text">Every color is derived.</div></div></div>
          <div class="alert alert--success"><span class="alert__icon">✅</span><div class="alert__content"><div class="alert__title">Success</div><div class="alert__text">Brand assets deployed.</div></div></div>
        </div>
      </div>
    </section>

    <hr class="separator separator--faded separator--sparse">

    <!-- ═══════ COMPONENTS ═══════ -->
    <section class="section" id="components">
      <span class="section__label">Components</span>
      <h2 class="section__heading">18 components, one truth</h2>
      <p class="section__subheading">Every component inherits from the seed. Headers, footers, cards, documents, inputs, avatars — all algorithmically consistent.</p>

      <div class="feature-grid" style="grid-template-columns:repeat(auto-fill,minmax(14rem,1fr));">
        <div class="feature" style="text-align:center;">
          <div class="feature__icon" style="margin-inline:auto;">🏷️</div>
          <div class="feature__title">Logo</div>
          <div class="feature__desc">Wordmark + mark, compact, icon, on-dark</div>
        </div>
        <div class="feature" style="text-align:center;">
          <div class="feature__icon" style="margin-inline:auto;">🧭</div>
          <div class="feature__title">Header</div>
          <div class="feature__desc">Sticky glassmorphism nav, scroll shadow, mobile</div>
        </div>
        <div class="feature" style="text-align:center;">
          <div class="feature__icon" style="margin-inline:auto;">🦶</div>
          <div class="feature__title">Footer</div>
          <div class="feature__desc">4-column grid, social links, responsive</div>
        </div>
        <div class="feature" style="text-align:center;">
          <div class="feature__icon" style="margin-inline:auto;">🃏</div>
          <div class="feature__title">Card</div>
          <div class="feature__desc">5 variants, stretch links, responsive grid</div>
        </div>
        <div class="feature" style="text-align:center;">
          <div class="feature__icon" style="margin-inline:auto;">📄</div>
          <div class="feature__title">Paper</div>
          <div class="feature__desc">Long-form article surface, typography, code</div>
        </div>
        <div class="feature" style="text-align:center;">
          <div class="feature__icon" style="margin-inline:auto;">📋</div>
          <div class="feature__title">Document</div>
          <div class="feature__desc">Invoice, contract, letter, report template</div>
        </div>
        <div class="feature" style="text-align:center;">
          <div class="feature__icon" style="margin-inline:auto;">🔘</div>
          <div class="feature__title">Button</div>
          <div class="feature__desc">6 variants × 5 sizes, icon, block, group</div>
        </div>
        <div class="feature" style="text-align:center;">
          <div class="feature__icon" style="margin-inline:auto;">📝</div>
          <div class="feature__title">Input</div>
          <div class="feature__desc">Text, select, checkbox, radio, toggle</div>
        </div>
        <div class="feature" style="text-align:center;">
          <div class="feature__icon" style="margin-inline:auto;">👤</div>
          <div class="feature__title">Avatar</div>
          <div class="feature__desc">6 sizes, status dots, stack with counter</div>
        </div>
        <div class="feature" style="text-align:center;">
          <div class="feature__icon" style="margin-inline:auto;">💀</div>
          <div class="feature__title">Skeleton</div>
          <div class="feature__desc">Shimmer loading, reduced-motion safe</div>
        </div>
        <div class="feature" style="text-align:center;">
          <div class="feature__icon" style="margin-inline:auto;">🔔</div>
          <div class="feature__title">Toast</div>
          <div class="feature__desc">Notification toasts, enter/exit animation</div>
        </div>
        <div class="feature" style="text-align:center;">
          <div class="feature__icon" style="margin-inline:auto;">🪟</div>
          <div class="feature__title">Modal</div>
          <div class="feature__desc">Dialog overlay, 4 sizes, responsive</div>
        </div>
        <div class="feature" style="text-align:center;">
          <div class="feature__icon" style="margin-inline:auto;">📊</div>
          <div class="feature__title">Table</div>
          <div class="feature__desc">Striped, compact, responsive, printable</div>
        </div>
        <div class="feature" style="text-align:center;">
          <div class="feature__icon" style="margin-inline:auto;">🏷</div>
          <div class="feature__title">Badge</div>
          <div class="feature__desc">6 colors, 3 sizes, dot indicator</div>
        </div>
        <div class="feature" style="text-align:center;">
          <div class="feature__icon" style="margin-inline:auto;">⚠️</div>
          <div class="feature__title">Alert</div>
          <div class="feature__desc">4 severities, dark-mode safe</div>
        </div>
        <div class="feature" style="text-align:center;">
          <div class="feature__icon" style="margin-inline:auto;">🍞</div>
          <div class="feature__title">Breadcrumb</div>
          <div class="feature__desc">Navigation trail, focus rings</div>
        </div>
        <div class="feature" style="text-align:center;">
          <div class="feature__icon" style="margin-inline:auto;">📑</div>
          <div class="feature__title">Tabs</div>
          <div class="feature__desc">Active indicator, focus, overflow</div>
        </div>
        <div class="feature" style="text-align:center;">
          <div class="feature__icon" style="margin-inline:auto;">💬</div>
          <div class="feature__title">Tooltip</div>
          <div class="feature__desc">Top/bottom, reduced-motion safe</div>
        </div>
      </div>
    </section>

    <hr class="separator separator--faded separator--sparse">

    <!-- ═══════ TOKENS ═══════ -->
    <section class="section" id="tokens">
      <span class="section__label">Tokens</span>
      <h2 class="section__heading">254 tokens from 3 seeds</h2>
      <p class="section__subheading">Every value is computed. Change <code style="font-family:var(--font-mono);font-size:0.9em;padding:0.1em 0.4em;background:var(--bg-subtle);border-radius:var(--radius-sm);">--seed-hue</code> and the entire palette recomputes.</p>

      <h3 style="font-size:var(--text-md);font-weight:var(--weight-bold);color:var(--fg);margin-bottom:var(--space-4);">Primary Palette</h3>
      <div id="primary-palette" class="token-grid" style="margin-bottom:var(--space-8);"></div>

      <h3 style="font-size:var(--text-md);font-weight:var(--weight-bold);color:var(--fg);margin-bottom:var(--space-4);">Neutral Palette</h3>
      <div id="neutral-palette" class="token-grid" style="margin-bottom:var(--space-8);"></div>

      <h3 style="font-size:var(--text-md);font-weight:var(--weight-bold);color:var(--fg);margin-bottom:var(--space-4);">Status Colors</h3>
      <div class="token-grid" style="margin-bottom:var(--space-8);">
        <div class="token-swatch"><div class="token-swatch__color" style="background:var(--color-success);"></div><div class="token-swatch__info"><div class="token-swatch__name">Success</div><div class="token-swatch__value">hsl(152, 68%, 38%)</div></div></div>
        <div class="token-swatch"><div class="token-swatch__color" style="background:var(--color-warning);"></div><div class="token-swatch__info"><div class="token-swatch__name">Warning</div><div class="token-swatch__value">hsl(38, 92%, 45%)</div></div></div>
        <div class="token-swatch"><div class="token-swatch__color" style="background:var(--color-danger);"></div><div class="token-swatch__info"><div class="token-swatch__name">Danger</div><div class="token-swatch__value">hsl(0, 78%, 50%)</div></div></div>
      </div>

      <h3 style="font-size:var(--text-md);font-weight:var(--weight-bold);color:var(--fg);margin-bottom:var(--space-4);">Typography Scale</h3>
      <div style="display:flex;flex-direction:column;gap:var(--space-2);margin-bottom:var(--space-8);">
        <div style="display:flex;align-items:baseline;gap:var(--space-4);font-family:var(--font-sans);"><code style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--fg-subtle);min-width:6rem;">--text-4xl</code><span style="font-size:var(--text-4xl);font-weight:var(--weight-black);line-height:var(--leading-tight);">Display</span></div>
        <div style="display:flex;align-items:baseline;gap:var(--space-4);font-family:var(--font-sans);"><code style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--fg-subtle);min-width:6rem;">--text-2xl</code><span style="font-size:var(--text-2xl);font-weight:var(--weight-extra);line-height:var(--leading-tight);">Heading</span></div>
        <div style="display:flex;align-items:baseline;gap:var(--space-4);font-family:var(--font-sans);"><code style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--fg-subtle);min-width:6rem;">--text-md</code><span style="font-size:var(--text-md);font-weight:var(--weight-bold);line-height:var(--leading-snug);">Subheading</span></div>
        <div style="display:flex;align-items:baseline;gap:var(--space-4);font-family:var(--font-sans);"><code style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--fg-subtle);min-width:6rem;">--text-base</code><span style="font-size:var(--text-base);line-height:var(--leading-relaxed);">Body text at default size, designed for comfortable reading.</span></div>
        <div style="display:flex;align-items:baseline;gap:var(--space-4);font-family:var(--font-sans);"><code style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--fg-subtle);min-width:6rem;">--text-sm</code><span style="font-size:var(--text-sm);color:var(--fg-muted);">Secondary text and captions</span></div>
        <div style="display:flex;align-items:baseline;gap:var(--space-4);font-family:var(--font-sans);"><code style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--fg-subtle);min-width:6rem;">--text-xs</code><span style="font-size:var(--text-xs);color:var(--fg-subtle);">Micro labels and badges</span></div>
      </div>
    </section>

    <hr class="separator separator--faded separator--sparse">

    <!-- ═══════ CODE ═══════ -->
    <section class="section" id="code">
      <span class="section__label">The Code</span>
      <h2 class="section__heading">Three seeds. The cascade does the rest.</h2>
      <p class="section__subheading">This is the entire configuration. Everything else is derived.</p>

      <div class="code-window" style="max-width:var(--container-md);margin:0 auto;">
        <div class="code-window__bar">
          <span class="code-window__dot code-window__dot--red"></span>
          <span class="code-window__dot code-window__dot--yellow"></span>
          <span class="code-window__dot code-window__dot--green"></span>
          <span class="code-window__title">tokens/aether.css</span>
        </div>
        <div class="code-window__body">
<span class="tok-comment">/* Change these 3 values to rebrand everything */</span>
<span class="tok-keyword">:root</span> <span class="tok-punct">{</span>
  <span class="tok-prop">--seed-hue</span><span class="tok-punct">:</span> <span class="tok-value">240</span><span class="tok-punct">;</span>         <span class="tok-comment">/* 0–360 → brand color */</span>
  <span class="tok-prop">--seed-sat</span><span class="tok-punct">:</span> <span class="tok-value">72%</span><span class="tok-punct">;</span>         <span class="tok-comment">/* 0–100% → vividness */</span>
  <span class="tok-prop">--seed-lum</span><span class="tok-punct">:</span> <span class="tok-value">50%</span><span class="tok-punct">;</span>         <span class="tok-comment">/* 0–100% → lightness */</span>

  <span class="tok-comment">/* 254 tokens derived automatically ↓ */</span>
  <span class="tok-prop">--color-primary</span><span class="tok-punct">:</span>      <span class="tok-value">hsl(var(--seed-hue), var(--seed-sat), var(--seed-lum))</span><span class="tok-punct">;</span>
  <span class="tok-prop">--color-primary-10</span><span class="tok-punct">:</span>   <span class="tok-value">hsl(var(--seed-hue), var(--seed-sat), 93%)</span><span class="tok-punct">;</span>
  <span class="tok-prop">--color-accent</span><span class="tok-punct">:</span>       <span class="tok-value">hsl(calc(var(--seed-hue) + 30), 85%, 55%)</span><span class="tok-punct">;</span>
  <span class="tok-prop">--fg</span><span class="tok-punct">:</span>              <span class="tok-value">var(--color-neutral-70)</span><span class="tok-punct">;</span>
  <span class="tok-prop">--bg</span><span class="tok-punct">:</span>              <span class="tok-value">var(--color-neutral-0)</span><span class="tok-punct">;</span>
  <span class="tok-prop">--border</span><span class="tok-punct">:</span>           <span class="tok-value">var(--color-neutral-10)</span><span class="tok-punct">;</span>
  <span class="tok-prop">--ring-color</span><span class="tok-punct">:</span>      <span class="tok-value">var(--color-primary-40)</span><span class="tok-punct">;</span>
  <span class="tok-prop">--shadow-md</span><span class="tok-punct">:</span>      <span class="tok-value">0 4px 6px -1px rgba(0,0,0,.07), ...</span><span class="tok-punct">;</span>
  <span class="tok-comment">/* ...and 247 more */</span>
<span class="tok-punct">}</span>

<span class="tok-comment">/* Dark mode flips 30+ tokens automatically */</span>
<span class="tok-keyword">@media</span> (<span class="tok-prop">prefers-color-scheme: dark</span>) <span class="tok-punct">{</span>
  <span class="tok-keyword">:root</span> <span class="tok-punct">{</span>
    <span class="tok-prop">--fg</span><span class="tok-punct">:</span>  <span class="tok-value">var(--color-neutral-80)</span><span class="tok-punct">;</span>
    <span class="tok-prop">--bg</span><span class="tok-punct">:</span>  <span class="tok-value">var(--color-neutral-0)</span><span class="tok-punct">;</span>  <span class="tok-comment">/* already flipped */</span>
    <span class="tok-punct">...</span>
  <span class="tok-punct">}</span>
<span class="tok-punct">}</span>
        </div>
      </div>
    </section>

    <hr class="separator separator--faded separator--sparse">

    <!-- ═══════ ACCESSIBILITY ═══════ -->
    <section class="section" id="accessibility">
      <span class="section__label">Accessibility</span>
      <h2 class="section__heading">Built in, not bolted on</h2>
      <p class="section__subheading">Every component includes focus rings, reduced-motion support, and high-contrast mode. No opt-in required.</p>

      <div class="feature-grid" style="grid-template-columns:repeat(auto-fit,minmax(18rem,1fr));">
        <div class="feature">
          <div class="feature__icon">🎯</div>
          <div class="feature__title">Focus Rings</div>
          <div class="feature__desc">19 <code style="font-family:var(--font-mono);font-size:0.9em;padding:0.1em 0.4em;background:var(--bg-subtle);border-radius:var(--radius-sm);">:focus-visible</code> rules across all interactive elements. Keyboard users always know where they are.</div>
        </div>
        <div class="feature">
          <div class="feature__icon">🛑</div>
          <div class="feature__title">Reduced Motion</div>
          <div class="feature__desc">All durations zeroed to 0ms and all easing curves linearized. Animations stop, not break, for users who prefer reduced motion.</div>
        </div>
        <div class="feature">
          <div class="feature__icon">🔲</div>
          <div class="feature__title">High Contrast</div>
          <div class="feature__desc">Borders strengthen and focus rings widen when <code style="font-family:var(--font-mono);font-size:0.9em;padding:0.1em 0.4em;background:var(--bg-subtle);border-radius:var(--radius-sm);">prefers-contrast: more</code> is active.</div>
        </div>
      </div>
    </section>

    <!-- ═══════ CTA ═══════ -->
    <section class="section" id="cta">
      <div class="cta">
        <h2 class="cta__title">Start building with Æther</h2>
        <p class="cta__desc">Copy the CSS. Import one file. Change three variables. That's it. No npm, no build step, no JavaScript.</p>
        <div class="btn-group" style="justify-content:center;">
          <a href="showcase.html" class="btn btn--primary btn--lg">Explore Showcase</a>
          <a href="#code" class="btn btn--outline btn--lg">View Source</a>
        </div>
      </div>
    </section>
  </main>

  <!-- ═══════ FOOTER ═══════ -->
  <footer class="footer">
    <div class="footer__grid">
      <div class="footer__brand">
        <a href="#" class="logo">
          <span class="logo__mark">Æ</span>
          <span class="logo__wordmark">Aether</span>
        </a>
        <p class="footer__tagline">Algorithmically extracted brand assets from the shared UI aether. One seed, infinite consistency.</p>
        <div class="footer__social">
          <a href="#" class="footer__social-link" title="GitHub" aria-label="GitHub">⌥</a>
          <a href="#" class="footer__social-link" title="Twitter" aria-label="Twitter">✦</a>
          <a href="#" class="footer__social-link" title="Dribbble" aria-label="Dribbble">◉</a>
        </div>
      </div>
      <div class="footer__column">
        <h4>System</h4>
        <ul>
          <li><a href="#features">Features</a></li>
          <li><a href="#components">Components</a></li>
          <li><a href="#tokens">Tokens</a></li>
          <li><a href="#accessibility">Accessibility</a></li>
        </ul>
      </div>
      <div class="footer__column">
        <h4>Explore</h4>
        <ul>
          <li><a href="showcase.html">Showcase</a></li>
          <li><a href="#code">Source Code</a></li>
          <li><a href="#">Changelog</a></li>
          <li><a href="#">License</a></li>
        </ul>
      </div>
      <div class="footer__column">
        <h4>Principles</h4>
        <ul>
          <li><a href="#">Zero Runtime</a></li>
          <li><a href="#">Algorithmic Design</a></li>
          <li><a href="#">Accessible First</a></li>
          <li><a href="#">Print Ready</a></li>
        </ul>
      </div>
    </div>
    <div class="footer__bottom">
      <span>© 2026 Æther Design Systems. All tokens derived.</span>
      <span>Zero runtime. Pure cascade. CSS Custom Properties.</span>
    </div>
  </footer>

  <script>
    // ── Sticky header ──
    const header = document.getElementById('header');
    const onScroll = () => header.classList.toggle('header--scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ── Interactive seed ──
    const root = document.documentElement;
    const hueSlider = document.getElementById('hue-slider');
    const satSlider = document.getElementById('sat-slider');
    const hueValue = document.getElementById('hue-value');
    const satValue = document.getElementById('sat-value');

    function updateSeed() {
      const hue = hueSlider.value;
      const sat = satSlider.value;
      root.style.setProperty('--seed-hue', hue);
      root.style.setProperty('--seed-sat', sat + '%');
      hueValue.textContent = hue;
      satValue.textContent = sat + '%';
      renderPalettes(hue, sat);
    }

    function renderPalettes(hue, sat) {
      // Primary palette
      const primaryEl = document.getElementById('primary-palette');
      const primaryStops = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90];
      primaryEl.innerHTML = primaryStops.map(l =>
        `<div class="token-swatch">
          <div class="token-swatch__color" style="background:hsl(${hue},${sat}%,${l}%);"></div>
          <div class="token-swatch__info">
            <div class="token-swatch__name">primary-${l}</div>
            <div class="token-swatch__value">${l}%</div>
          </div>
        </div>`
      ).join('');

      // Neutral palette
      const neutralEl = document.getElementById('neutral-palette');
      const neutralStops = [0, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      neutralEl.innerHTML = neutralStops.map(l => {
        const satN = l > 50 ? 0.3 : l < 20 ? 8 : 4;
        const textColor = l > 55 ? '#fff' : 'var(--fg)';
        return `<div class="token-swatch">
          <div class="token-swatch__color" style="background:hsl(${hue},${satN}%,${l}%);"></div>
          <div class="token-swatch__info">
            <div class="token-swatch__name">neutral-${l}</div>
            <div class="token-swatch__value">${l}%</div>
          </div>
        </div>`;
      }).join('');
    }

    hueSlider.addEventListener('input', updateSeed);
    satSlider.addEventListener('input', updateSeed);
    updateSeed();

    // ── Active nav on scroll ──
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__link');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle('header__link--active',
              link.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    sections.forEach(s => observer.observe(s));

    // ── Smooth scroll ──
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          header.classList.remove('header--open');
        }
      });
    });
  </script>
</body>
</html>/* ═══════════════════════════════════════════════════════════════════════
   Æ T H E R  —  Master Assembly
   Import this single file to get everything.
   One seed. Infinite consistency. The cascade is the algorithm.
   ═══════════════════════════════════════════════════════════════════════ */

@import url('./tokens/aether.css');

/* Primitives */
@import url('./components/logo.css');
@import url('./components/header.css');
@import url('./components/footer.css');
@import url('./components/card.css');
@import url('./components/paper.css');
@import url('./components/document.css');
@import url('./components/button.css');
@import url('./components/input.css');
@import url('./components/avatar.css');
@import url('./components/skeleton.css');
@import url('./components/toast.css');
@import url('./components/modal.css');
@import url('./components/table.css');
@import url('./components/utilities.css');

/* ═══════════════════════════════════════════════════════════════════════
   G L O B A L   R E S E T
   ═══════════════════════════════════════════════════════════════════════ */

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
}

html {
  -webkit-text-size-adjust: 100%;
  -moz-text-size-adjust: 100%;
  text-size-adjust: 100%;
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}

body {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  color: var(--fg);
  background: var(--bg-muted);
  line-height: var(--leading-normal);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

img, video, svg {
  max-width: 100%;
  display: block;
}

a {
  color: var(--color-primary);
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}

a:hover {
  color: var(--color-primary-hover);
}

a:focus-visible {
  outline: var(--ring-width) solid var(--ring-color);
  outline-offset: 2px;
  border-radius: var(--radius-xs);
}

/* ── Focus ring on any interactive element ── */
:focus-visible {
  outline: var(--ring-width) solid var(--ring-color);
  outline-offset: var(--ring-offset);
}

:focus:not(:focus-visible) {
  outline: none;
}

::selection {
  background: var(--color-primary-bg-hover);
  color: var(--color-primary-fg);
}

/* ── Scrollbar ── */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-muted);
}

::-webkit-scrollbar-thumb {
  background: var(--border-strong);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--fg-subtle);
}

/* ═══════════════════════════════════════════════════════════════════════
   L A Y O U T   P R I M I T I V E S
   ═══════════════════════════════════════════════════════════════════════ */

.section {
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: var(--space-16) var(--space-6);
}

.section__heading {
  font-size: var(--text-2xl);
  font-weight: var(--weight-extra);
  color: var(--fg);
  letter-spacing: var(--tracking-tight);
  line-height: var(--leading-tight);
  margin-bottom: var(--space-2);
}

.section__subheading {
  font-size: var(--text-md);
  color: var(--fg-muted);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-10);
  max-width: 52ch;
}

.section__label {
  display: inline-flex;
  padding: var(--space-0-5) var(--space-3);
  font-size: var(--text-2xs);
  font-weight: var(--weight-semi);
  text-transform: uppercase;
  letter-spacing: var(--tracking-widest);
  color: var(--color-primary-fg-muted);
  background: var(--color-primary-bg);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-3);
}

/* ── Hero ── */
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-32) var(--space-6) var(--space-24);
  min-height: 80vh;
  background:
    radial-gradient(ellipse 80% 50% at 50% 0%, var(--color-primary-10) 0%, transparent 70%),
    var(--bg);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: "";
  position: absolute;
  width: 40rem;
  height: 40rem;
  border-radius: var(--radius-full);
  background: radial-gradient(circle, var(--color-primary-bg-subtle), transparent 70%);
  top: -10rem;
  right: -10rem;
  pointer-events: none;
}

.hero::after {
  content: "";
  position: absolute;
  width: 30rem;
  height: 30rem;
  border-radius: var(--radius-full);
  background: radial-gradient(circle, var(--color-accent-10), transparent 60%);
  bottom: -5rem;
  left: -5rem;
  pointer-events: none;
}

.hero__title {
  font-family: var(--font-sans);
  font-size: var(--text-4xl);
  font-weight: var(--weight-black);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tighter);
  color: var(--fg);
  max-width: 18ch;
  position: relative;
  z-index: var(--z-above);
}

.hero__title em {
  font-style: normal;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero__desc {
  font-size: var(--text-md);
  color: var(--fg-muted);
  max-width: 48ch;
  margin-top: var(--space-5);
  line-height: var(--leading-relaxed);
  position: relative;
  z-index: var(--z-above);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-8);
  position: relative;
  z-index: var(--z-above);
}

@media (max-width: 640px) {
  .hero {
    min-height: 70vh;
    padding: var(--space-20) var(--space-4) var(--space-16);
  }
  .hero__title {
    font-size: var(--text-2xl);
  }
  .hero__desc {
    font-size: var(--text-sm);
  }
}

/* ═══════════════════════════════════════════════════════════════════════
   U T I L I T Y   C L A S S E S
   ═══════════════════════════════════════════════════════════════════════ */

/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Skip link */
.skip-link {
  position: absolute;
  top: -100%;
  left: var(--space-4);
  padding: var(--space-2) var(--space-4);
  background: var(--color-primary);
  color: var(--fg-on-primary);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--weight-semi);
  border-radius: var(--radius-md);
  z-index: var(--z-toast);
  text-decoration: none;
}

.skip-link:focus {
  top: var(--space-4);
}

/* ═══════════════════════════════════════════════════════════════════════
   P R I N T
   ═══════════════════════════════════════════════════════════════════════ */
@media print {
  body {
    background: var(--fg-inverse);
    color: var(--fg);
    font-size: 12pt;
  }
  .no-print { display: none !important; }
  a { color: currentColor; text-decoration: underline; }
  ::-webkit-scrollbar { display: none; }
}# Æther — Algorithmic Brand Asset System

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

Use freely. The aether has no owner./* ═══════════════════════════════════════════════════════════════════════
   Æ T H E R  —  Algorithmic Brand Token System
   ═══════════════════════════════════════════════════════════════════════

   Three seeds rebrand everything. The cascade is the algorithm.
   Change the hue — watch the world recompose.

   ═══════════════════════════════════════════════════════════════════════ */

:root {
  /* ━━━ Seed ━━━ Change these three values to rebrand the entire system ━━━ */
  --seed-hue: 41;
  --seed-sat: 72%;
  --seed-lum: 50%;

  /* ━━━ Derived Palette ━━━ HSL math from the seed ━━━ */
  --color-primary:      hsl(var(--seed-hue), var(--seed-sat), var(--seed-lum));
  --color-primary-5:    hsl(var(--seed-hue), var(--seed-sat), 97%);
  --color-primary-10:   hsl(var(--seed-hue), var(--seed-sat), 93%);
  --color-primary-20:   hsl(var(--seed-hue), var(--seed-sat), 82%);
  --color-primary-30:   hsl(var(--seed-hue), var(--seed-sat), 72%);
  --color-primary-40:   hsl(var(--seed-hue), var(--seed-sat), 62%);
  --color-primary-50:   hsl(var(--seed-hue), var(--seed-sat), 52%);
  --color-primary-60:   hsl(var(--seed-hue), var(--seed-sat), 42%);
  --color-primary-70:   hsl(var(--seed-hue), var(--seed-sat), 32%);
  --color-primary-80:   hsl(var(--seed-hue), var(--seed-sat), 22%);
  --color-primary-90:   hsl(var(--seed-hue), var(--seed-sat), 12%);
  --color-accent:       hsl(calc(var(--seed-hue) + 30), 85%, 55%);
  --color-accent-10:    hsl(calc(var(--seed-hue) + 30), 85%, 93%);
  --color-accent-20:    hsl(calc(var(--seed-hue) + 30), 85%, 82%);

  /* ── Semantic Colors (fixed hue for accessibility) ── */
  --color-success:      hsl(152, 68%, 38%);
  --color-success-10:   hsl(152, 68%, 93%);
  --color-success-20:   hsl(152, 68%, 82%);
  --color-warning:      hsl(38, 92%, 45%);
  --color-warning-10:   hsl(38, 92%, 93%);
  --color-warning-20:   hsl(38, 92%, 82%);
  --color-danger:       hsl(0, 78%, 50%);
  --color-danger-10:    hsl(0, 78%, 93%);
  --color-danger-20:    hsl(0, 78%, 82%);

  /* ── Neutral Palette (seed-tinted grays) ── */
  --color-neutral-0:    hsl(var(--seed-hue), 8%, 99%);
  --color-neutral-5:   hsl(var(--seed-hue), 6%, 96%);
  --color-neutral-10:  hsl(var(--seed-hue), 5%, 90%);
  --color-neutral-20:  hsl(var(--seed-hue), 4%, 74%);
  --color-neutral-30:  hsl(var(--seed-hue), 3%, 58%);
  --color-neutral-40:  hsl(var(--seed-hue), 2%, 44%);
  --color-neutral-50:  hsl(var(--seed-hue), 1.5%, 32%);
  --color-neutral-60:  hsl(var(--seed-hue), 1%, 22%);
  --color-neutral-70:  hsl(var(--seed-hue), 0.8%, 16%);
  --color-neutral-80:  hsl(var(--seed-hue), 0.5%, 11%);
  --color-neutral-90:  hsl(var(--seed-hue), 0.3%, 7%);
  --color-neutral-100:  hsl(var(--seed-hue), 0.2%, 4%);

  /* ━━━ Semantic Aliases ━━━ These make components readable & dark-mode safe ━━━ */
  /* Foreground */
  --fg:              var(--color-neutral-70);
  --fg-muted:        var(--color-neutral-40);
  --fg-subtle:       var(--color-neutral-30);
  --fg-on-primary:   hsl(0, 0%, 100%);
  --fg-inverse:      var(--color-neutral-0);

  /* Primary semantic (these flip for dark mode) */
  --color-primary-fg:         var(--color-primary-70);
  --color-primary-fg-muted:   var(--color-primary-60);
  --color-primary-fg-subtle:  var(--color-primary-40);
  --color-primary-hover:       var(--color-primary-60);
  --color-primary-active:      var(--color-primary-70);
  --color-primary-border:      var(--color-primary-40);
  --color-primary-bg:         var(--color-primary-10);
  --color-primary-bg-hover:   var(--color-primary-20);
  --color-primary-bg-subtle:  var(--color-primary-5);

  /* Semantic status (these flip for dark mode) */
  --color-success-fg:        hsl(152, 68%, 30%);
  --color-success-bg:        var(--color-success-10);
  --color-success-border:     var(--color-success);
  --color-warning-fg:        hsl(38, 80%, 28%);
  --color-warning-bg:        var(--color-warning-10);
  --color-warning-border:     var(--color-warning);
  --color-danger-fg:         hsl(0, 70%, 32%);
  --color-danger-bg:         var(--color-danger-10);
  --color-danger-border:      var(--color-danger);
  --color-danger-hover:      hsl(0, 78%, 45%);

  /* Background */
  --bg:          var(--color-neutral-0);
  --bg-muted:    var(--color-neutral-5);
  --bg-subtle:   var(--color-neutral-10);
  --bg-emphasis: var(--color-neutral-60);

  /* Border */
  --border:       var(--color-neutral-10);
  --border-strong: var(--color-neutral-20);

  /* Focus ring */
  --ring-width:  2px;
  --ring-offset: 2px;
  --ring-color:  var(--color-primary-40);
  --ring-offset-color: var(--color-neutral-0);

  /* ━━━ Typography ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ */

  /* Font Stacks */
  --font-sans:   "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono:   "JetBrains Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace;
  --font-serif:  "Merriweather", "Iowan Old Style", "Noto Serif", Georgia, serif;

  /* Modular Scale — 1.25 Major Third */
  --ratio: 1.25;
  --text-2xs:  calc(1rem / var(--ratio) / var(--ratio) / var(--ratio));
  --text-xs:   calc(1rem / var(--ratio) / var(--ratio));
  --text-sm:   calc(1rem / var(--ratio));
  --text-base: 1rem;
  --text-md:   calc(1rem * var(--ratio));
  --text-lg:   calc(1rem * var(--ratio) * var(--ratio));
  --text-xl:   calc(1rem * var(--ratio) * var(--ratio) * var(--ratio));
  --text-2xl:  calc(1rem * var(--ratio) * var(--ratio) * var(--ratio) * var(--ratio));
  --text-3xl:  calc(1rem * var(--ratio) * var(--ratio) * var(--ratio) * var(--ratio) * var(--ratio));
  --text-4xl:  calc(1rem * var(--ratio) * var(--ratio) * var(--ratio) * var(--ratio) * var(--ratio) * var(--ratio));

  /* Per-size Line Heights */
  --leading-none:    1;
  --leading-tight:   1.15;
  --leading-snug:    1.3;
  --leading-normal:  1.55;
  --leading-relaxed: 1.7;

  /* Letter Spacing */
  --tracking-tighter: -0.04em;
  --tracking-tight:   -0.02em;
  --tracking-normal:  0;
  --tracking-wide:    0.03em;
  --tracking-wider:    0.06em;
  --tracking-widest:   0.1em;

  /* Font Weights */
  --weight-normal:  400;
  --weight-medium: 500;
  --weight-semi:    600;
  --weight-bold:    700;
  --weight-extra:   800;
  --weight-black:   900;

  /* ━━━ Spacing ━━━ Base-4 rhythm ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ */
  --space-0:   0;
  --space-px:  0.0625rem;
  --space-0-5: 0.125rem;
  --space-1:   0.25rem;
  --space-1-5: 0.375rem;
  --space-2:   0.5rem;
  --space-2-5: 0.625rem;
  --space-3:   0.75rem;
  --space-3-5: 0.875rem;
  --space-4:   1rem;
  --space-5:   1.25rem;
  --space-6:   1.5rem;
  --space-7:   1.75rem;
  --space-8:   2rem;
  --space-9:   2.25rem;
  --space-10:  2.5rem;
  --space-11:  2.75rem;
  --space-12:  3rem;
  --space-14:  3.5rem;
  --space-16:  4rem;
  --space-20:  5rem;
  --space-24:  6rem;
  --space-28:  7rem;
  --space-32:  8rem;
  --space-36:  9rem;
  --space-40:  10rem;
  --space-48:  12rem;
  --space-56:  14rem;
  --space-64:  16rem;

  /* ━━━ Radii ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ */
  --radius-none: 0;
  --radius-xs:   0.125rem;
  --radius-sm:   0.25rem;
  --radius-md:   0.5rem;
  --radius-lg:   0.75rem;
  --radius-xl:   1rem;
  --radius-2xl:  1.5rem;
  --radius-3xl:  2rem;
  --radius-full: 9999px;

  /* ━━━ Shadows ━━━ Layered, calibrated ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ */
  --shadow-xs:  0 1px 2px 0 rgba(0,0,0,.03);
  --shadow-sm:  0 1px 3px 0 rgba(0,0,0,.06), 0 1px 2px -1px rgba(0,0,0,.06);
  --shadow-md:  0 4px 6px -1px rgba(0,0,0,.07), 0 2px 4px -2px rgba(0,0,0,.05);
  --shadow-lg:  0 10px 15px -3px rgba(0,0,0,.08), 0 4px 6px -4px rgba(0,0,0,.04);
  --shadow-xl:  0 20px 25px -5px rgba(0,0,0,.10), 0 8px 10px -6px rgba(0,0,0,.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0,0,0,.16);
  --shadow-inner: inset 0 2px 4px 0 rgba(0,0,0,.04);

  /* ━━━ Transitions ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ */
  --ease-default:    cubic-bezier(0.2, 0, 0, 1);
  --ease-in:         cubic-bezier(0.4, 0, 1, 1);
  --ease-out:        cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out:     cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce:     cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-elastic:    cubic-bezier(0.68, -0.55, 0.27, 1.55);
  --duration-instant: 75ms;
  --duration-fast:    150ms;
  --duration-normal:  250ms;
  --duration-slow:    400ms;
  --duration-glacial: 600ms;

  /* ━━━ Z-Layers ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ */
  --z-below:     -1;
  --z-base:       0;
  --z-above:      1;
  --z-dropdown:  100;
  --z-sticky:    200;
  --z-overlay:   300;
  --z-modal:     400;
  --z-popover:   500;
  --z-toast:     600;

  /* ━━━ Layout ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ ━━━ */
  --container-sm:  36rem;
  --container-md:  48rem;
  --container-lg:  60rem;
  --container-xl:  72rem;
  --container-2xl: 84rem;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   D A R K   M O D E
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
@media (prefers-color-scheme: dark) {
  :root {
    /* ── Neutrals invert ── */
    --color-neutral-0:    hsl(var(--seed-hue), 8%, 6%);
    --color-neutral-5:   hsl(var(--seed-hue), 6%, 9%);
    --color-neutral-10:  hsl(var(--seed-hue), 5%, 14%);
    --color-neutral-20:  hsl(var(--seed-hue), 4%, 22%);
    --color-neutral-30:  hsl(var(--seed-hue), 3%, 34%);
    --color-neutral-40:  hsl(var(--seed-hue), 2%, 46%);
    --color-neutral-50:  hsl(var(--seed-hue), 1.5%, 56%);
    --color-neutral-60:  hsl(var(--seed-hue), 1%, 68%);
    --color-neutral-70:  hsl(var(--seed-hue), 0.8%, 82%);
    --color-neutral-80:  hsl(var(--seed-hue), 0.5%, 90%);
    --color-neutral-90:  hsl(var(--seed-hue), 0.3%, 95%);
    --color-neutral-100:  hsl(var(--seed-hue), 0.2%, 98%);

    /* ── Primary tints (dark bg versions) ── */
    --color-primary-5:   hsl(var(--seed-hue), var(--seed-sat), 8%);
    --color-primary-10:  hsl(var(--seed-hue), var(--seed-sat), 14%);
    --color-primary-20:  hsl(var(--seed-hue), var(--seed-sat), 22%);
    --color-primary-30:  hsl(var(--seed-hue), var(--seed-sat), 32%);
    --color-primary-40:  hsl(var(--seed-hue), var(--seed-sat), 44%);

    /* ── Accent tints ── */
    --color-accent-10:   hsl(calc(var(--seed-hue) + 30), 85%, 14%);
    --color-accent-20:   hsl(calc(var(--seed-hue) + 30), 85%, 22%);

    /* ── Status colors adjust for dark bg ── */
    --color-success:     hsl(152, 60%, 52%);
    --color-success-10:  hsl(152, 30%, 14%);
    --color-success-20:  hsl(152, 40%, 22%);
    --color-warning:     hsl(38, 80%, 58%);
    --color-warning-10:  hsl(38, 40%, 14%);
    --color-warning-20:  hsl(38, 50%, 22%);
    --color-danger:      hsl(0, 70%, 58%);
    --color-danger-10:   hsl(0, 35%, 14%);
    --color-danger-20:  hsl(0, 45%, 22%);

    /* ── Semantic aliases flip ── */
    --fg:              var(--color-neutral-80);
    --fg-muted:        var(--color-neutral-50);
    --fg-subtle:       var(--color-neutral-40);
    --fg-on-primary:   hsl(var(--seed-hue), var(--seed-sat), 98%);
    --fg-inverse:      var(--color-neutral-90);
    --bg:              var(--color-neutral-0);
    --bg-muted:        var(--color-neutral-5);
    --bg-subtle:       var(--color-neutral-10);
    --bg-emphasis:     var(--color-neutral-50);
    --border:          hsl(var(--seed-hue), 4%, 18%);
    --border-strong:   hsl(var(--seed-hue), 4%, 26%);

    /* ── Primary semantic flips for dark mode ── */
    --color-primary-fg:         hsl(var(--seed-hue), var(--seed-sat), 68%);
    --color-primary-fg-muted:   hsl(var(--seed-hue), var(--seed-sat), 58%);
    --color-primary-fg-subtle:  hsl(var(--seed-hue), var(--seed-sat), 48%);
    --color-primary-hover:      hsl(var(--seed-hue), var(--seed-sat), 56%);
    --color-primary-active:     hsl(var(--seed-hue), var(--seed-sat), 48%);
    --color-primary-border:     hsl(var(--seed-hue), var(--seed-sat), 44%);
    --color-primary-bg:         hsl(var(--seed-hue), var(--seed-sat), 14%);
    --color-primary-bg-hover:   hsl(var(--seed-hue), var(--seed-sat), 22%);
    --color-primary-bg-subtle:  hsl(var(--seed-hue), var(--seed-sat), 8%);

    /* ── Status semantic flips ── */
    --color-success-fg:        hsl(152, 60%, 60%);
    --color-success-bg:        hsl(152, 30%, 14%);
    --color-success-border:     var(--color-success);
    --color-warning-fg:        hsl(38, 80%, 62%);
    --color-warning-bg:        hsl(38, 40%, 14%);
    --color-warning-border:     var(--color-warning);
    --color-danger-fg:         hsl(0, 70%, 62%);
    --color-danger-bg:         hsl(0, 35%, 14%);
    --color-danger-border:      var(--color-danger);
    --color-danger-hover:       hsl(0, 70%, 52%);

    /* ── Ring adjusts for contrast ── */
    --ring-color:       hsl(var(--seed-hue), var(--seed-sat), 60%);
    --ring-offset-color: var(--color-neutral-0);

    /* ── Shadows heavier ── */
    --shadow-xs:  0 1px 2px 0 rgba(0,0,0,.2);
    --shadow-sm:  0 1px 3px 0 rgba(0,0,0,.3), 0 1px 2px -1px rgba(0,0,0,.2);
    --shadow-md:  0 4px 6px -1px rgba(0,0,0,.4), 0 2px 4px -2px rgba(0,0,0,.2);
    --shadow-lg:  0 10px 15px -3px rgba(0,0,0,.4), 0 4px 6px -4px rgba(0,0,0,.15);
    --shadow-xl:  0 20px 25px -5px rgba(0,0,0,.5), 0 8px 10px -6px rgba(0,0,0,.2);
    --shadow-2xl: 0 25px 50px -12px rgba(0,0,0,.6);
    --shadow-inner: inset 0 2px 4px 0 rgba(0,0,0,.2);
  }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   R E D U C E D   M O T I O N
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-instant: 0ms;
    --duration-fast:    0ms;
    --duration-normal:  0ms;
    --duration-slow:    0ms;
    --duration-glacial: 0ms;
    --ease-default:     linear;
    --ease-in:          linear;
    --ease-out:         linear;
    --ease-in-out:      linear;
    --ease-bounce:      linear;
    --ease-elastic:     linear;
  }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   H I G H   C O N T R A S T
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
@media (prefers-contrast: more) {
  :root {
    --border:       var(--color-neutral-40);
    --border-strong: var(--color-neutral-60);
    --ring-width:    3px;
  }
}/* ═══════════════════════════════════════════════════════════════════════
   B A D G E  —  Algorithmic Status Labels
   ═══════════════════════════════════════════════════════════════════════ */

.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: calc(var(--space-0-5) + 1px) var(--space-2-5);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  font-weight: var(--weight-semi);
  line-height: var(--leading-none);
  border-radius: var(--radius-full);
  white-space: nowrap;
  letter-spacing: var(--tracking-normal);
}

.badge--primary  { background: var(--color-primary-bg);         color: var(--color-primary-fg-muted); }
.badge--success  { background: var(--color-success-bg);          color: var(--color-success-fg); }
.badge--warning  { background: var(--color-warning-bg);          color: var(--color-warning-fg); }
.badge--danger   { background: var(--color-danger-bg);           color: var(--color-danger-fg); }
.badge--neutral  { background: var(--bg-subtle);                 color: var(--fg-muted); }
.badge--accent   { background: var(--color-accent-10);           color: var(--color-accent); }

/* ── Dot indicator ── */
.badge__dot {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: var(--radius-full);
  background: currentColor;
  flex-shrink: 0;
}

/* ── Size variants ── */
.badge--sm { padding: 2px var(--space-2); font-size: var(--text-2xs); }
.badge--lg { padding: var(--space-1) var(--space-3); font-size: var(--text-sm); }

/* ═══════════════════════════════════════════════════════════════════════
   A L E R T  —  Algorithmic Notification Banner
   ═══════════════════════════════════════════════════════════════════════ */

.alert {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-lg);
  border-left: 4px solid;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}

.alert--info {
  background: var(--color-primary-bg);
  border-color: var(--color-primary);
  color: var(--color-primary-fg);
}

.alert--success {
  background: var(--color-success-bg);
  border-color: var(--color-success-border);
  color: var(--color-success-fg);
}

.alert--warning {
  background: var(--color-warning-bg);
  border-color: var(--color-warning-border);
  color: var(--color-warning-fg);
}

.alert--danger {
  background: var(--color-danger-bg);
  border-color: var(--color-danger-border);
  color: var(--color-danger-fg);
}

.alert__icon {
  flex-shrink: 0;
  font-size: var(--text-md);
  line-height: var(--leading-none);
  margin-top: 0.15em;
}

.alert__content { flex: 1; }

.alert__title {
  font-weight: var(--weight-bold);
  margin-bottom: var(--space-1);
}

.alert__text { opacity: 0.88; }

.alert__close {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: grid;
  place-items: center;
  background: none;
  border: none;
  color: inherit;
  opacity: 0.5;
  cursor: pointer;
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  transition: opacity var(--duration-fast) var(--ease-default);
}
.alert__close:hover { opacity: 1; }
.alert__close:focus-visible {
  outline: var(--ring-width) solid var(--ring-color);
  outline-offset: 1px;
}

/* ═══════════════════════════════════════════════════════════════════════
   S E P A R A T O R  —  Algorithmic Dividers
   ═══════════════════════════════════════════════════════════════════════ */

.separator { border: none; margin: var(--space-6) 0; }

.separator--line    { border-top: 1px solid var(--border); }
.separator--dashed  { border-top: 2px dashed var(--border); }
.separator--thick   { border-top: 3px solid var(--color-primary-bg-hover); }
.separator--faded   { border: 0; height: 1px; background: linear-gradient(to right, transparent, var(--border-strong), transparent); }
.separator--sparse  { margin: var(--space-12) 0; }

/* ═══════════════════════════════════════════════════════════════════════
   B R E A D C R U M B  —  Algorithmic Navigation Trail
   ═══════════════════════════════════════════════════════════════════════ */

.breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-1);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--fg-subtle);
}

.breadcrumb__item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
}

.breadcrumb__item a {
  color: var(--fg-muted);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-default);
}

.breadcrumb__item a:hover { color: var(--color-primary-fg); }

.breadcrumb__item a:focus-visible {
  outline: var(--ring-width) solid var(--ring-color);
  outline-offset: 2px;
  border-radius: var(--radius-xs);
}

.breadcrumb__item--current {
  color: var(--fg);
  font-weight: var(--weight-medium);
}

.breadcrumb__sep {
  color: var(--fg-subtle);
  margin: 0 var(--space-0-5);
  user-select: none;
}

/* ═══════════════════════════════════════════════════════════════════════
   T A B S  —  Algorithmic Tab Navigation
   ═══════════════════════════════════════════════════════════════════════ */

.tabs {
  display: flex;
  gap: var(--space-1);
  border-bottom: 2px solid var(--border);
  overflow-x: auto;
}

.tabs__tab {
  padding: var(--space-2-5) var(--space-4);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--fg-muted);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  cursor: pointer;
  white-space: nowrap;
  transition:
    color var(--duration-fast) var(--ease-default),
    border-color var(--duration-fast) var(--ease-default);
}

.tabs__tab:hover { color: var(--fg); }

.tabs__tab--active {
  color: var(--color-primary-fg);
  border-bottom-color: var(--color-primary);
  font-weight: var(--weight-semi);
}

.tabs__tab:focus-visible {
  outline: var(--ring-width) solid var(--ring-color);
  outline-offset: 2px;
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
}

/* ═══════════════════════════════════════════════════════════════════════
   T O O L T I P  —  Algorithmic Hover Hint
   ═══════════════════════════════════════════════════════════════════════ */

.tooltip {
  position: relative;
  display: inline-flex;
}

.tooltip::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + var(--space-2));
  left: 50%;
  transform: translateX(-50%) translateY(var(--space-1));
  padding: var(--space-1-5) var(--space-3);
  background: var(--color-neutral-90);
  color: var(--color-neutral-5);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  line-height: var(--leading-snug);
  white-space: nowrap;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  opacity: 0;
  pointer-events: none;
  transition:
    opacity var(--duration-fast) var(--ease-default),
    transform var(--duration-fast) var(--ease-bounce);
  z-index: var(--z-popover);
}

.tooltip:hover::after,
.tooltip:focus-within::after {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .tooltip::after { transition: opacity var(--duration-fast) var(--ease-default); }
}

/* ── Bottom tooltip ── */
.tooltip--bottom::after {
  bottom: auto;
  top: calc(100% + var(--space-2));
  transform: translateX(-50%) translateY(calc(var(--space-1) * -1));
}

.tooltip--bottom:hover::after,
.tooltip--bottom:focus-within::after {
  transform: translateX(-50%) translateY(0);
}/* ═══════════════════════════════════════════════════════════════════════
   T O A S T  —  Algorithmic Notification Toast
   ═══════════════════════════════════════════════════════════════════════ */

.toast-container {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column-reverse;
  gap: var(--space-3);
  max-width: 24rem;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-lg);
  background: var(--bg);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-xl);
  pointer-events: auto;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--fg);
  line-height: var(--leading-relaxed);
  animation: toast-enter var(--duration-normal) var(--ease-bounce);
}

.toast--exiting {
  animation: toast-exit var(--duration-fast) var(--ease-in) forwards;
}

@keyframes toast-enter {
  from {
    opacity: 0;
    transform: translateY(var(--space-4)) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes toast-exit {
  to {
    opacity: 0;
    transform: translateY(var(--space-2)) scale(0.95);
  }
}

@media (prefers-reduced-motion: reduce) {
  .toast { animation: none; }
  .toast--exiting { animation: none; opacity: 0; }
}

.toast__icon {
  flex-shrink: 0;
  font-size: var(--text-md);
  line-height: var(--leading-none);
  margin-top: 0.1em;
}

.toast__content {
  flex: 1;
  min-width: 0;
}

.toast__title {
  font-weight: var(--weight-semi);
  margin-bottom: var(--space-0-5);
}

.toast__text {
  color: var(--fg-muted);
}

.toast__close {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: grid;
  place-items: center;
  background: none;
  border: none;
  color: var(--fg-subtle);
  cursor: pointer;
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  transition:
    color var(--duration-fast) var(--ease-default),
    background var(--duration-fast) var(--ease-default);
}

.toast__close:hover {
  color: var(--fg);
  background: var(--bg-subtle);
}

.toast__close:focus-visible {
  outline: var(--ring-width) solid var(--ring-color);
  outline-offset: 1px;
}

/* ━━━ Variants ━━━ */
.toast--info    { border-left: 4px solid var(--color-primary); }
.toast--success { border-left: 4px solid var(--color-success); }
.toast--warning { border-left: 4px solid var(--color-warning); }
.toast--danger  { border-left: 4px solid var(--color-danger); }

@media (max-width: 480px) {
  .toast-container {
    left: var(--space-4);
    right: var(--space-4);
    bottom: var(--space-4);
    max-width: none;
  }
}

/* ━━━ Print ━━━ */
@media print {
  .toast-container {
    display: none;
  }
}/* ═══════════════════════════════════════════════════════════════════════
   T A B L E  —  Algorithmic Data Table
   ═══════════════════════════════════════════════════════════════════════ */

.table-wrapper {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xs);
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--fg);
}

.table thead {
  background: var(--bg-muted);
}

.table th {
  text-align: left;
  padding: var(--space-3) var(--space-4);
  font-weight: var(--weight-semi);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--fg-muted);
  border-bottom: 2px solid var(--border);
  white-space: nowrap;
}

.table td {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.table tbody tr {
  transition: background var(--duration-fast) var(--ease-default);
}

.table tbody tr:hover {
  background: var(--color-primary-bg-subtle);
}

/* ━━━ Variants ━━━ */
.table--compact th,
.table--compact td {
  padding: var(--space-2) var(--space-3);
}

.table--striped tbody tr:nth-child(even) {
  background: var(--bg-muted);
}

.table--striped tbody tr:hover {
  background: var(--color-primary-bg-subtle);
}

/* ━━━ Print ━━━ */
@media print {
  .table-wrapper {
    border: none;
    box-shadow: none;
    border-radius: 0;
  }
  .table th {
    border-bottom: 2px solid currentColor;
  }
  .table td {
    border-bottom: 1px solid var(--border);
  }
}/* ═══════════════════════════════════════════════════════════════════════
   S K E L E T O N  —  Algorithmic Loading Placeholder
   ═══════════════════════════════════════════════════════════════════════ */

.skeleton {
  background: var(--bg-subtle);
  border-radius: var(--radius-md);
  position: relative;
  overflow: hidden;
}

/* Shimmer animation */
.skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    color-mix(in srgb, var(--bg) 60%, transparent) 40%,
    color-mix(in srgb, var(--bg) 60%, transparent) 60%,
    transparent 100%
  );
  animation: skeleton-shimmer 2s ease-in-out infinite;
}

@keyframes skeleton-shimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton::after {
    animation: none;
    /* FIX: show a static highlight stripe so the skeleton is still visible */
    background: linear-gradient(
      90deg,
      transparent 0%,
      color-mix(in srgb, var(--bg) 80%, transparent) 50%,
      transparent 100%
    );
  }
}

/* ━━━ Shapes ━━━ */
.skeleton--text {
  height: 1em;
  border-radius: var(--radius-sm);
}

.skeleton--heading {
  height: 1.5em;
  width: 60%;
  border-radius: var(--radius-sm);
}

.skeleton--circle {
  border-radius: var(--radius-full);
}

.skeleton--image {
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-lg);
}

/* ── Widths ── */
.skeleton--w25 { width: 25%; }
.skeleton--w50 { width: 50%; }
.skeleton--w75 { width: 75%; }

/* ━━━ Composed Skeleton Card ━━━ */
.skeleton-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  padding: 0;
}

.skeleton-card__image {
  aspect-ratio: 16 / 9;
  background: var(--bg-subtle);
}

.skeleton-card__body {
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

/* ━━━ Print ━━━ */
@media print {
  .skeleton::after {
    display: none;
  }
  .skeleton {
    background: var(--bg-subtle);
  }
}/* ═══════════════════════════════════════════════════════════════════════
   P A P E R  —  Algorithmic Long-Form Surface
   ═══════════════════════════════════════════════════════════════════════ */

.paper {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

/* ── Header ── */
.paper__header {
  padding: var(--space-8) var(--space-8) var(--space-6);
  border-bottom: 1px solid var(--border);
}

.paper__title {
  font-family: var(--font-sans);
  font-size: var(--text-2xl);
  font-weight: var(--weight-extra);
  color: var(--fg);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  margin: 0 0 var(--space-2);
}

.paper__subtitle {
  font-family: var(--font-sans);
  font-size: var(--text-md);
  font-weight: var(--weight-normal);
  color: var(--fg-muted);
  margin: 0;
}

.paper__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-top: var(--space-4);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  color: var(--fg-subtle);
}

.paper__meta-item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1-5);
}

/* ── Body ── */
.paper__body {
  padding: var(--space-8);
  font-family: var(--font-serif);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--fg);
}

.paper__body p {
  margin: 0 0 var(--space-5);
}

.paper__body p:last-child {
  margin-bottom: 0;
}

.paper__body h2 {
  font-family: var(--font-sans);
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--fg);
  line-height: var(--leading-snug);
  letter-spacing: var(--tracking-tight);
  margin: var(--space-12) 0 var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border);
}

/* FIX: Remove top border and extra margin on the very first h2 */
.paper__body > h2:first-child,
.paper__body > *:first-child + h2 {
  margin-top: 0;
  border-top: none;
  padding-top: 0;
}

.paper__body h3 {
  font-family: var(--font-sans);
  font-size: var(--text-md);
  font-weight: var(--weight-semi);
  color: var(--fg);
  line-height: var(--leading-snug);
  margin: var(--space-8) 0 var(--space-2);
}

.paper__body ul,
.paper__body ol {
  margin: 0 0 var(--space-5);
  padding-left: var(--space-6);
}

.paper__body li {
  margin-bottom: var(--space-2);
}

.paper__body strong {
  font-weight: var(--weight-semi);
}

.paper__body em {
  font-style: italic;
}

.paper__body a {
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
  text-decoration-thickness: 1px;
  transition: color var(--duration-fast) var(--ease-default);
}

.paper__body a:hover {
  color: var(--color-primary-fg-muted);
}

.paper__body a:focus-visible {
  outline: var(--ring-width) solid var(--ring-color);
  outline-offset: 2px;
  border-radius: var(--radius-xs);
}

.paper__body blockquote {
  margin: var(--space-8) 0;
  padding: var(--space-5) var(--space-6);
  background: var(--color-primary-bg-subtle);
  border-left: 4px solid var(--color-primary);
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
  font-style: italic;
  color: var(--fg);
}

.paper__body blockquote p:last-child {
  margin-bottom: 0;
}

.paper__body code {
  font-family: var(--font-mono);
  font-size: 0.875em;
  padding: 0.15em 0.4em;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}

.paper__body pre {
  background: var(--color-neutral-90);
  color: var(--color-neutral-10);
  padding: var(--space-5);
  border-radius: var(--radius-lg);
  overflow-x: auto;
  margin: var(--space-6) 0;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  border: 1px solid var(--border);
}

.paper__body pre code {
  background: none;
  padding: 0;
  border: none;
  color: inherit;
  font-size: inherit;
}

.paper__body hr {
  border: none;
  height: 1px;
  background: var(--border);
  margin: var(--space-8) 0;
}

.paper__body img {
  border-radius: var(--radius-lg);
  margin: var(--space-6) 0;
}

/* ── Footer ── */
.paper__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-6) var(--space-8);
  border-top: 1px solid var(--border);
  background: var(--bg-muted);
}

/* ━━━ Paper Variants ━━━ */
.paper--flat {
  box-shadow: none;
  border-color: transparent;
}

.paper--elevated {
  box-shadow: var(--shadow-xl);
}

.paper--narrow {
  max-width: var(--container-md);
  margin-inline: auto;
}

/* ━━━ Print ━━━ */
@media print {
  .paper {
    box-shadow: none;
    border: none;
    border-radius: 0;
  }
  .paper__header {
    border-bottom: 2px solid currentColor;
    padding: 0 0 var(--space-4) 0;
  }
  .paper__body {
    padding: var(--space-4) 0;
  }
  .paper__footer {
    border-top: 1px solid currentColor;
    background: none;
  }
}/* ═══════════════════════════════════════════════════════════════════════
   M O D A L  —  Algorithmic Dialog Overlay
   ═══════════════════════════════════════════════════════════════════════ */

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  background: color-mix(in srgb, var(--color-neutral-100) 50%, transparent);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
  animation: modal-backdrop-in var(--duration-normal) var(--ease-default);
}

@keyframes modal-backdrop-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.modal {
  position: relative;
  width: 100%;
  max-width: var(--container-sm);
  max-height: calc(100vh - var(--space-12));
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-2xl);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: modal-in var(--duration-normal) var(--ease-bounce);
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(var(--space-4));
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .modal-backdrop, .modal { animation: none; }
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-6) var(--space-6) var(--space-4);
}

.modal__title {
  font-family: var(--font-sans);
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--fg);
  line-height: var(--leading-snug);
}

.modal__close {
  width: 2rem;
  height: 2rem;
  display: grid;
  place-items: center;
  background: none;
  border: none;
  color: var(--fg-muted);
  cursor: pointer;
  border-radius: var(--radius-md);
  font-size: var(--text-md);
  transition:
    color var(--duration-fast) var(--ease-default),
    background var(--duration-fast) var(--ease-default);
}

.modal__close:hover {
  color: var(--fg);
  background: var(--bg-subtle);
}

.modal__close:focus-visible {
  outline: var(--ring-width) solid var(--ring-color);
  outline-offset: 1px;
}

.modal__body {
  padding: 0 var(--space-6) var(--space-6);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--fg-muted);
  line-height: var(--leading-relaxed);
  overflow-y: auto;
}

.modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--border);
  background: var(--bg-muted);
}

/* ━━━ Size Variants ━━━ */
.modal--sm { max-width: 24rem; }
.modal--lg { max-width: var(--container-md); }
.modal--xl { max-width: var(--container-lg); }

/* ━━━ Responsive ━━━ */
@media (max-width: 480px) {
  .modal {
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    max-height: 90vh;
  }
  .modal-backdrop {
    align-items: flex-end;
    padding: 0;
  }
}

/* ━━━ Print ━━━ */
@media print {
  .modal-backdrop {
    position: static;
    background: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    padding: 0;
  }
  .modal {
    box-shadow: none;
    border: 1px solid var(--border);
    border-radius: 0;
    max-height: none;
    max-width: none;
  }
  .modal__footer {
    background: none;
    border-top: 1px solid var(--border);
  }
}/* ═══════════════════════════════════════════════════════════════════════
   L O G O  —  Algorithmic Wordmark & Mark
   ═══════════════════════════════════════════════════════════════════════ */

.logo {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
  color: var(--fg);
  isolation: isolate;
}

/* ── Mark (the glyph box) ── */
.logo__mark {
  width: 2.5rem;
  height: 2.5rem;
  display: grid;
  place-items: center;
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-accent) 100%
  );
  border-radius: var(--radius-lg);
  color: var(--fg-on-primary);
  font-weight: var(--weight-extra);
  font-size: var(--text-lg);
  font-family: var(--font-sans);
  line-height: var(--leading-none);
  box-shadow: var(--shadow-md);
  transition:
    transform var(--duration-normal) var(--ease-bounce),
    box-shadow var(--duration-normal) var(--ease-default);
  position: relative;
}

.logo__mark::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, color-mix(in srgb, var(--fg-on-primary) 20%, transparent) 0%, transparent 60%);
  pointer-events: none;
}

.logo:hover .logo__mark {
  transform: scale(1.08) rotate(-3deg);
  box-shadow: var(--shadow-lg);
}

.logo:active .logo__mark {
  transform: scale(1.02) rotate(-1deg);
}

/* ── Wordmark ── */
.logo__wordmark {
  font-family: var(--font-sans);
  font-size: var(--text-xl);
  font-weight: var(--weight-extra);
  letter-spacing: var(--tracking-tight);
  background: linear-gradient(
    135deg,
    var(--color-primary-fg),
    var(--color-primary)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: opacity var(--duration-fast) var(--ease-default);
}

/* ── Focus ── */
.logo:focus-visible {
  outline: var(--ring-width) solid var(--ring-color);
  outline-offset: var(--ring-offset);
  border-radius: var(--radius-md);
}

:focus:not(:focus-visible) {
  outline: none;
}

/* ━━━ Variants ━━━ */

.logo--compact .logo__mark {
  width: 2rem;
  height: 2rem;
  font-size: var(--text-sm);
  border-radius: var(--radius-md);
}

.logo--compact .logo__wordmark {
  font-size: var(--text-md);
}

.logo--icon .logo__wordmark {
  display: none;
}

.logo--icon .logo__mark {
  width: 2.25rem;
  height: 2.25rem;
}

/* ── On dark backgrounds ── */
.logo--on-dark .logo__wordmark {
  background: linear-gradient(135deg, var(--fg-on-primary), var(--color-primary-30));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo--on-dark .logo__mark {
  box-shadow: var(--shadow-lg), 0 0 20px color-mix(in srgb, var(--fg-on-primary) 15%, transparent);
}

/* ━━━ Print ━━━ */
@media print {
  .logo__mark {
    box-shadow: none;
    background: var(--fg);
    color: var(--fg-on-primary);
  }
  .logo__wordmark {
    -webkit-text-fill-color: var(--fg);
    background: none;
  }
}/* ═══════════════════════════════════════════════════════════════════════
   I N P U T  —  Algorithmic Form Primitives
   ═══════════════════════════════════════════════════════════════════════ */

.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-1-5);
}

.input-group__label {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--fg);
}

.input-group__hint {
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  color: var(--fg-subtle);
}

.input-group__error {
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  color: var(--color-danger-fg);
}

/* ━━━ Shared Input Base ━━━ */
.input,
.textarea,
.select {
  width: 100%;
  padding: var(--space-2-5) var(--space-3-5);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  color: var(--fg);
  background: var(--bg);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-md);
  transition:
    border-color var(--duration-fast) var(--ease-default),
    box-shadow var(--duration-fast) var(--ease-default);
}

.input:hover, .textarea:hover, .select:hover {
  border-color: var(--fg-subtle);
}

.input:focus, .textarea:focus, .select:focus {
  outline: none;
  border-color: var(--color-primary-border);
  box-shadow: 0 0 0 var(--ring-offset) var(--bg), 0 0 0 calc(var(--ring-width) + var(--ring-offset)) var(--ring-color);
}

.input::placeholder, .textarea::placeholder {
  color: var(--fg-subtle);
}

.input:disabled, .textarea:disabled, .select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--bg-muted);
}

/* ━━━ Text Input ━━━ */
.input--sm {
  padding: var(--space-1-5) var(--space-3);
  font-size: var(--text-xs);
  border-radius: var(--radius-sm);
}

.input--lg {
  padding: var(--space-3-5) var(--space-5);
  font-size: var(--text-md);
  border-radius: var(--radius-lg);
}

/* ━━━ Error State ━━━ */
.input--error, .textarea--error, .select--error {
  border-color: var(--color-danger);
}

.input--error:focus, .textarea--error:focus, .select--error:focus {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 var(--ring-offset) var(--bg), 0 0 0 calc(var(--ring-width) + var(--ring-offset)) var(--color-danger);
}

/* ━━━ Textarea ━━━ */
.textarea {
  min-height: 6rem;
  resize: vertical;
}

/* ━━━ Select ━━━ */
.select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23788596' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--space-3) center;
  padding-right: var(--space-8);
}

/* ━━━ Checkbox / Radio ━━━ */
.check {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--fg);
  cursor: pointer;
}

.check__box {
  width: 1.125rem;
  height: 1.125rem;
  appearance: none;
  border: 1.5px solid var(--border-strong);
  border-radius: var(--radius-sm);
  background: var(--bg);
  cursor: pointer;
  transition:
    background var(--duration-fast) var(--ease-default),
    border-color var(--duration-fast) var(--ease-default);
  position: relative;
  flex-shrink: 0;
}

.check__box--radio { border-radius: var(--radius-full); }

.check__box:checked {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.check__box:checked::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0.375rem;
  height: 0.625rem;
  border: solid var(--fg-on-primary);
  border-width: 0 2px 2px 0;
  transform: translate(-50%, -60%) rotate(45deg);
}

.check__box--radio:checked::after {
  width: 0.375rem;
  height: 0.375rem;
  border: none;
  border-radius: var(--radius-full);
  background: var(--fg-on-primary);
  transform: translate(-50%, -50%);
}

.check__box:focus-visible {
  outline: var(--ring-width) solid var(--ring-color);
  outline-offset: 2px;
}

/* ━━━ Toggle ━━━ */
.toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--fg);
}

.toggle__track {
  position: relative;
  width: 2.75rem;
  height: 1.5rem;
  background: var(--border-strong);
  border-radius: var(--radius-full);
  transition: background var(--duration-fast) var(--ease-default);
  flex-shrink: 0;
}

.toggle__track::after {
  content: "";
  position: absolute;
  top: 0.25rem;
  left: 0.25rem;
  width: 1rem;
  height: 1rem;
  background: var(--fg-on-primary);
  border-radius: var(--radius-full);
  transition: transform var(--duration-fast) var(--ease-bounce);
  box-shadow: var(--shadow-sm);
}

.toggle__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle__input:checked + .toggle__track {
  background: var(--color-primary);
}

.toggle__input:checked + .toggle__track::after {
  transform: translateX(1.25rem);
}

.toggle__input:focus-visible + .toggle__track {
  outline: var(--ring-width) solid var(--ring-color);
  outline-offset: 2px;
}

/* ━━━ Fieldset ━━━ */
.fieldset {
  border: none;
  padding: 0;
  margin: 0;
}

.fieldset__legend {
  font-family: var(--font-sans);
  font-size: var(--text-md);
  font-weight: var(--weight-bold);
  color: var(--fg);
  margin-bottom: var(--space-4);
  padding: 0;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: var(--space-4);
}/* ═══════════════════════════════════════════════════════════════════════
   H E A D E R  —  Algorithmic Navigation Header
   ═══════════════════════════════════════════════════════════════════════ */

.header {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  background: color-mix(in srgb, var(--bg) 80%, transparent);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-bottom: 1px solid color-mix(in srgb, var(--border) 60%, transparent);
  transition:
    box-shadow var(--duration-normal) var(--ease-default),
    background var(--duration-normal) var(--ease-default);
}

/* ── Scroll state (toggled via JS or :has) ── */
.header--scrolled {
  box-shadow: var(--shadow-md);
  background: color-mix(in srgb, var(--bg) 92%, transparent);
  border-bottom-color: var(--border);
}

/* ── Brand slot ── */
.header__brand {
  flex-shrink: 0;
}

/* ── Navigation ── */
.header__nav {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.header__link {
  position: relative;
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--fg-muted);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition:
    color var(--duration-fast) var(--ease-default),
    background var(--duration-fast) var(--ease-default);
}

.header__link:hover {
  color: var(--fg);
  background: var(--bg-subtle);
}

.header__link--active {
  color: var(--color-primary-fg);
  background: var(--color-primary-bg);
  font-weight: var(--weight-semi);
}

.header__link:focus-visible {
  outline: var(--ring-width) solid var(--ring-color);
  outline-offset: var(--ring-offset);
}

/* active indicator bar */
.header__link--active::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: var(--space-4);
  right: var(--space-4);
  height: 2px;
  background: var(--color-primary);
  border-radius: var(--radius-full);
}

/* ── Actions slot ── */
.header__actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;
}

/* ── Mobile hamburger ── */
.header__toggle {
  display: none;
  width: 2.5rem;
  height: 2.5rem;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--fg-muted);
  transition:
    color var(--duration-fast) var(--ease-default),
    background var(--duration-fast) var(--ease-default);
}

.header__toggle:hover {
  color: var(--fg);
  background: var(--bg-subtle);
}

.header__toggle:focus-visible {
  outline: var(--ring-width) solid var(--ring-color);
  outline-offset: var(--ring-offset);
}

/* ━━━ Responsive ━━━ */
@media (max-width: 768px) {
  .header__nav { display: none; }
  .header__toggle { display: grid; }

  .header--open .header__nav {
    display: flex;
    position: absolute;
    inset: 100% 0 auto 0;
    flex-direction: column;
    padding: var(--space-4) var(--space-6);
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    box-shadow: var(--shadow-xl);
  }

  .header--open .header__link--active::after {
    display: none;
  }

  .header--open .header__link {
    padding: var(--space-3) var(--space-4);
  }
}

/* ━━━ Print ━━━ */
@media print {
  .header {
    position: static;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    background: var(--bg);
    box-shadow: none;
    border-bottom: 2px solid currentColor;
  }
  .header__actions,
  .header__toggle { display: none; }
}/* ═══════════════════════════════════════════════════════════════════════
   F O O T E R  —  Algorithmic Site Footer
   ═══════════════════════════════════════════════════════════════════════ */

.footer {
  padding: var(--space-16) var(--space-6) var(--space-8);
  background: var(--bg-muted);
  border-top: 1px solid var(--border);
}

.footer__grid {
  display: grid;
  grid-template-columns: 2fr repeat(3, minmax(0, 1fr));
  gap: var(--space-10);
  max-width: var(--container-xl);
  margin: 0 auto;
}

/* ── Brand Column ── */
.footer__brand {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.footer__tagline {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--fg-muted);
  max-width: 28ch;
  line-height: var(--leading-relaxed);
}

.footer__social {
  display: flex;
  gap: var(--space-2);
}

.footer__social-link {
  width: 2.25rem;
  height: 2.25rem;
  display: grid;
  place-items: center;
  border-radius: var(--radius-md);
  color: var(--fg-muted);
  background: var(--bg-subtle);
  text-decoration: none;
  font-size: var(--text-sm);
  transition:
    color var(--duration-fast) var(--ease-default),
    background var(--duration-fast) var(--ease-default),
    transform var(--duration-fast) var(--ease-bounce);
}

.footer__social-link:hover {
  color: var(--fg-on-primary);
  background: var(--color-primary);
  transform: translateY(-2px);
}

.footer__social-link:focus-visible {
  outline: var(--ring-width) solid var(--ring-color);
  outline-offset: var(--ring-offset);
}

/* ── Link Columns ── */
.footer__column h4 {
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  color: var(--fg);
  margin-bottom: var(--space-4);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
}

.footer__column ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2-5);
}

.footer__column a {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--fg-muted);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-default);
}

.footer__column a:hover {
  color: var(--color-primary);
}

.footer__column a:focus-visible {
  outline: var(--ring-width) solid var(--ring-color);
  outline-offset: 1px;
  border-radius: var(--radius-xs);
}

/* ── Bottom Bar ── */
.footer__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: var(--container-xl);
  margin: var(--space-10) auto 0;
  padding-top: var(--space-6);
  border-top: 1px solid var(--border);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  color: var(--fg-subtle);
}

/* ━━━ Responsive ━━━ */
@media (max-width: 768px) {
  .footer__grid {
    grid-template-columns: 1fr 1fr;
  }
  .footer__brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 480px) {
  .footer__grid {
    grid-template-columns: 1fr;
  }
  .footer__bottom {
    flex-direction: column;
    gap: var(--space-2);
    text-align: center;
  }
}

/* ━━━ Print ━━━ */
@media print {
  .footer {
    padding: var(--space-4) 0;
    background: none;
    border-top: 1px solid currentColor;
  }
  .footer__social { display: none; }
}/* ═══════════════════════════════════════════════════════════════════════
   D O C U M E N T  —  Algorithmic Formal Document
   Invoices · Contracts · Letters · Reports
   ═══════════════════════════════════════════════════════════════════════ */

.document {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  max-width: var(--container-md);
  margin: var(--space-8) auto;
  overflow: hidden;
}

/* ── Document Header ── */
.document__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-6);
  padding: var(--space-8) var(--space-8) var(--space-6);
  background: linear-gradient(135deg, var(--color-primary-bg) 0%, var(--color-primary-bg-subtle) 50%, transparent 100%);
  border-bottom: 2px solid var(--color-primary-bg-hover);
}

.document__header-info h1 {
  font-family: var(--font-sans);
  font-size: var(--text-xl);
  font-weight: var(--weight-extra);
  color: var(--color-primary-fg);
  margin: var(--space-3) 0 0;
  line-height: var(--leading-tight);
}

.document__header-info p {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--fg-muted);
  margin: var(--space-1) 0 0;
}

.document__header-meta {
  text-align: right;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--fg-muted);
  line-height: var(--leading-relaxed);
  flex-shrink: 0;
}

/* ── Document Body ── */
.document__body {
  padding: var(--space-8);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--fg);
  line-height: var(--leading-relaxed);
}

/* ── Addresses ── */
.document__addresses {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
  margin-bottom: var(--space-6);
}

.document__address-label {
  font-size: var(--text-2xs);
  font-weight: var(--weight-semi);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--fg-subtle);
  margin-bottom: var(--space-1);
}

.document__address-body {
  font-size: var(--text-sm);
  color: var(--fg);
  line-height: var(--leading-relaxed);
}

/* ── Document Table ── */
.document__table {
  width: 100%;
  border-collapse: collapse;
  margin: var(--space-5) 0;
  font-size: var(--text-sm);
}

.document__table th {
  text-align: left;
  padding: var(--space-3) var(--space-4);
  background: var(--color-primary-bg);
  color: var(--color-primary-fg);
  font-weight: var(--weight-semi);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  border-bottom: 2px solid var(--color-primary-bg-hover);
}

.document__table td {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}

.document__table tbody tr:hover {
  background: var(--bg-muted);
}

.document__table tbody tr:last-child td {
  border-bottom: none;
}

.document__table .amount {
  text-align: right;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

.document__table .description {
  font-weight: var(--weight-medium);
}

/* ── Totals ── */
.document__totals {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--space-4);
}

.document__totals-inner { width: 20rem; }

.document__totals-row {
  display: flex;
  justify-content: space-between;
  padding: var(--space-2) 0;
  font-size: var(--text-sm);
  color: var(--fg-muted);
}

.document__totals-row--grand {
  border-top: 2px solid var(--fg);
  margin-top: var(--space-2);
  padding-top: var(--space-3);
  font-weight: var(--weight-extra);
  font-size: var(--text-md);
  color: var(--fg);
}

/* ── Seal ── */
.document__seal {
  margin-top: var(--space-10);
  padding: var(--space-5);
  border: 2px solid var(--color-primary-border);
  border-radius: var(--radius-xl);
  text-align: center;
  font-weight: var(--weight-semi);
  color: var(--color-primary-fg);
  position: relative;
  overflow: hidden;
}

.document__seal::before {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 8px,
    var(--color-primary-bg) 8px,
    var(--color-primary-bg) 16px
  );
  opacity: 0.5;
  pointer-events: none;
}

/* ── Document Footer ── */
.document__footer {
  padding: var(--space-5) var(--space-8);
  background: var(--bg-muted);
  border-top: 1px solid var(--border);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  color: var(--fg-subtle);
  text-align: center;
  line-height: var(--leading-relaxed);
}

/* ━━━ Responsive ━━━ */
@media (max-width: 640px) {
  .document__header { flex-direction: column; }
  .document__header-meta { text-align: left; }
  .document__addresses { grid-template-columns: 1fr; }
}

/* ━━━ Print ━━━ */
@media print {
  .document {
    box-shadow: none;
    border: none;
    border-radius: 0;
    margin: 0;
    max-width: none;
  }
  .document__header {
    background: none;
    border-bottom: 2px solid currentColor;
  }
  .document__seal::before { display: none; }
}/* ═══════════════════════════════════════════════════════════════════════
   C A R D  —  Algorithmic Card Primitives
   ═══════════════════════════════════════════════════════════════════════ */

.card {
  position: relative;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition:
    box-shadow var(--duration-normal) var(--ease-default),
    transform var(--duration-normal) var(--ease-bounce),
    border-color var(--duration-normal) var(--ease-default);
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
  border-color: var(--border-strong);
}

.card:focus-within {
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary-border);
}

/* ── Card Regions ── */
.card__image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
  background: var(--bg-subtle);
}

.card__body {
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.card__tag {
  display: inline-flex;
  align-self: flex-start;
  padding: calc(var(--space-0-5) + 1px) var(--space-2-5);
  font-family: var(--font-sans);
  font-size: var(--text-2xs);
  font-weight: var(--weight-semi);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--color-primary-fg-muted);
  background: var(--color-primary-bg);
  border-radius: var(--radius-full);
  line-height: var(--leading-none);
}

.card__title {
  font-family: var(--font-sans);
  font-size: var(--text-md);
  font-weight: var(--weight-bold);
  color: var(--fg);
  line-height: var(--leading-snug);
  margin: 0;
}

.card__title a {
  color: inherit;
  text-decoration: none;
  position: relative;
}

/* Stretch link overlay */
.card__title a::after {
  content: "";
  position: absolute;
  inset: 0;
}

.card__title a:focus-visible {
  outline: var(--ring-width) solid var(--ring-color);
  outline-offset: var(--ring-offset);
  border-radius: var(--radius-xl);
}

.card__desc {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--fg-muted);
  line-height: var(--leading-relaxed);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--border);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  color: var(--fg-subtle);
}

/* ━━━ Card Variants ━━━ */

.card--flat {
  border-color: transparent;
  box-shadow: var(--shadow-sm);
}
.card--flat:hover { box-shadow: var(--shadow-md); }

.card--bordered {
  border: 2px solid var(--border);
}
.card--bordered:hover {
  border-color: var(--color-primary-bg-hover);
}

.card--ghost {
  background: transparent;
  border: 2px dashed var(--border-strong);
}
.card--ghost:hover {
  background: var(--color-primary-bg-subtle);
  border-color: var(--color-primary-fg-subtle);
  border-style: solid;
}

.card--highlight {
  border-color: var(--color-primary-border);
  border-width: 2px;
}
.card--highlight:hover {
  border-color: var(--color-primary);
}

.card--interactive { cursor: pointer; }

/* ━━━ Card Grid ━━━ */
.card-grid {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
}

.card-grid--2 {
  grid-template-columns: repeat(auto-fill, minmax(24rem, 1fr));
}

.card-grid--4 {
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
}

/* ━━━ Print ━━━ */
@media print {
  .card {
    box-shadow: none;
    border: 1px solid var(--border);
    break-inside: avoid;
  }
}/* ═══════════════════════════════════════════════════════════════════════
   B U T T O N  —  Algorithmic Action Primitive
   ═══════════════════════════════════════════════════════════════════════ */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2-5) var(--space-5);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--weight-semi);
  line-height: var(--leading-none);
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  user-select: none;
  position: relative;
  overflow: hidden;
  transition:
    background var(--duration-fast) var(--ease-default),
    color var(--duration-fast) var(--ease-default),
    border-color var(--duration-fast) var(--ease-default),
    box-shadow var(--duration-fast) var(--ease-default),
    transform var(--duration-fast) var(--ease-bounce);
}

/* ── States ── */
.btn:hover { text-decoration: none; }
.btn:active { transform: scale(0.97); }
.btn:disabled, .btn--disabled { opacity: 0.45; cursor: not-allowed; pointer-events: none; }

.btn:focus-visible {
  outline: var(--ring-width) solid var(--ring-color);
  outline-offset: var(--ring-offset);
}

/* ━━━ Variants ━━━ */

.btn--primary {
  background: var(--color-primary);
  color: var(--fg-on-primary);
}
.btn--primary:hover {
  background: var(--color-primary-hover);
  box-shadow: var(--shadow-md);
}
.btn--primary:active {
  background: var(--color-primary-active);
}

.btn--secondary {
  background: var(--color-primary-bg);
  color: var(--color-primary-fg-muted);
  border-color: var(--color-primary-bg-hover);
}
.btn--secondary:hover {
  background: var(--color-primary-bg-hover);
  border-color: var(--color-primary-fg-subtle);
}
.btn--secondary:active {
  background: var(--color-primary-bg);
}

.btn--ghost {
  background: transparent;
  color: var(--fg-muted);
}
.btn--ghost:hover {
  background: var(--bg-subtle);
  color: var(--fg);
}

.btn--outline {
  background: transparent;
  color: var(--fg);
  border-color: var(--border-strong);
}
.btn--outline:hover {
  border-color: var(--color-primary-border);
  color: var(--color-primary-fg);
  background: var(--color-primary-bg-subtle);
}

.btn--danger {
  background: var(--color-danger);
  color: var(--fg-on-primary);
}
.btn--danger:hover {
  background: var(--color-danger-hover);
  box-shadow: var(--shadow-md);
}
.btn--danger:active {
  filter: brightness(0.95);
}

.btn--soft-danger {
  background: var(--color-danger-bg);
  color: var(--color-danger-fg);
}
.btn--soft-danger:hover {
  background: var(--color-danger-20);
}

/* ━━━ Sizes ━━━ */

.btn--xs {
  padding: var(--space-1) var(--space-2-5);
  font-size: var(--text-xs);
  border-radius: var(--radius-sm);
}

.btn--sm {
  padding: var(--space-1-5) var(--space-3);
  font-size: var(--text-xs);
  border-radius: var(--radius-sm);
}

.btn--lg {
  padding: var(--space-3-5) var(--space-8);
  font-size: var(--text-md);
  border-radius: var(--radius-lg);
}

.btn--xl {
  padding: var(--space-4) var(--space-10);
  font-size: var(--text-lg);
  border-radius: var(--radius-xl);
}

.btn--block { width: 100%; }

/* ── Icon button (square) ── */
.btn--icon {
  padding: var(--space-2);
  aspect-ratio: 1;
}
.btn--icon.btn--sm { padding: var(--space-1-5); }
.btn--icon.btn--lg { padding: var(--space-3); }

/* ━━━ Button Group ━━━ */
.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  align-items: center;
}
.btn-group--compact { gap: var(--space-2); }

.btn-group--connected .btn { border-radius: 0; }
.btn-group--connected .btn:first-child { border-radius: var(--radius-md) 0 0 var(--radius-md); }
.btn-group--connected .btn:last-child { border-radius: 0 var(--radius-md) var(--radius-md) 0; }
.btn-group--connected .btn + .btn { margin-left: -2px; }/* ═══════════════════════════════════════════════════════════════════════
   A V A T A R  —  Algorithmic User Identity
   ═══════════════════════════════════════════════════════════════════════ */

.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  overflow: hidden;
  background: var(--color-primary-bg);
  color: var(--color-primary-fg-muted);
  font-family: var(--font-sans);
  font-weight: var(--weight-semi);
  line-height: var(--leading-none);
  flex-shrink: 0;
  border: 2px solid var(--bg);
  box-shadow: var(--shadow-xs);
  position: relative;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ━━━ Sizes ━━━ */
.avatar--xs  { width: 1.5rem;  height: 1.5rem;  font-size: var(--text-2xs); }
.avatar--sm  { width: 2rem;    height: 2rem;    font-size: var(--text-xs); }
.avatar--md  { width: 2.5rem;  height: 2.5rem;  font-size: var(--text-sm); }
.avatar--lg  { width: 3rem;    height: 3rem;    font-size: var(--text-md); }
.avatar--xl  { width: 4rem;    height: 4rem;    font-size: var(--text-lg); }
.avatar--2xl { width: 5rem;    height: 5rem;    font-size: var(--text-xl); }

/* ── Status indicator ── */
.avatar--online::after,
.avatar--offline::after,
.avatar--busy::after {
  content: "";
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0.6em;
  height: 0.6em;
  border-radius: var(--radius-full);
  border: 2px solid var(--bg);
}

.avatar--online::after { background: var(--color-success); }
.avatar--offline::after { background: var(--fg-subtle); }
.avatar--busy::after { background: var(--color-danger); }

/* ── Square variant ── */
.avatar--square { border-radius: var(--radius-md); }

/* ━━━ Avatar Stack ━━━ */
.avatar-stack {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
}

.avatar-stack .avatar {
  margin-left: -0.5rem;
  border: 2px solid var(--bg);
  transition: transform var(--duration-fast) var(--ease-bounce);
}

.avatar-stack .avatar:hover {
  transform: translateY(-4px);
  z-index: var(--z-above);
}

/* ── Group counter ── */
.avatar-stack__more {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-full);
  background: var(--bg-subtle);
  color: var(--fg-muted);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  font-weight: var(--weight-semi);
  margin-left: -0.5rem;
  border: 2px solid var(--bg);
}
