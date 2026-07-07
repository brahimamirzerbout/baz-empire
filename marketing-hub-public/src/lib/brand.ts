/**
 * BAZ Brand Identity System
 *
 * Canonical Æther Design System values for document generation.
 * All values derived from Fibonacci sequence and golden-ratio angles.
 */

export const brand = {
  accent:       'var(--accent)',
  accentSoft:   'var(--accent-soft)',
  accentGlow:   'var(--accent-glow)',
  accentText:   '#ffffff',
  void:         '#0a0a0d',
  shadow:       '#16141c',
  surface:      '#211e28',
  card:         '#2d2a35',
  raised:       '#3a3644',
  hover:        '#4b4559',
  focus:        '#524d64',
  muted:        '#6e6879',
  ink:          '#faf9fa',
  inkSecondary: '#a4a0ab',
  border:       '#4b455925',
  success:      '#4ade80',
  warning:      '#f59e0b',
  danger:       '#ef4444',
  info:         '#60a5fa',
  fontDisplay:  'Fraunces',
  fontBody:     'Inter',
  fontMono:     'JetBrains Mono',
  space:  { xs: 3, sm: 5, md: 8, lg: 13, xl: 21, xxl: 34, xxxl: 55 },
  radius: { xs: 3, sm: 5, md: 8, lg: 13, xl: 21, xxl: 34, full: 89 },
  duration: { fast: 89, base: 144, slow: 233, slower: 377, slowest: 610 },
  easing: {
    default: [0.618, 0, 0.618, 1],
    in: [0.618, 0, 1, 0.618],
    out: [0, 0.618, 0.382, 1],
    bounce: [0.618, -0.618, 0.382, 1.618],
  },
  company: {
    name: 'BAZ Marketing Agency',
    shortName: 'BAZ',
    tagline: 'The growth partner for ambitious businesses.',
    email: 'zerboutbrahimamir@gmail.com',
    website: 'baz.agency',
    linkedin: 'linkedin.com/company/baz-agency',
    twitter: 'twitter.com/bazagency',
    github: 'github.com/baz-agency',
    founder: 'Brahim ZERBOUT',
    address: 'Remote-first · MENA · EU · US',
  },
  paper: {
    a4: { width: 210, height: 297 },
    letter: { width: 215.9, height: 279.4 },
    businessCard: { width: 85.6, height: 53.98 },
    margins: { standard: 21, narrow: 13, wide: 34 },
  },
  assets: {
    logos: {
      full: '/brand/logos/baz-logo-full.svg',
      fullLight: '/brand/logos/baz-logo-full-light.svg',
      fullWhite: '/brand/logos/baz-logo-full-white.svg',
      icon: '/brand/logos/baz-logo-icon.svg',
      iconWhite: '/brand/logos/baz-logo-icon-white.svg',
      iconLight: '/brand/logos/baz-logo-icon-light.svg',
      horizontal: '/brand/logos/baz-logo-horizontal.svg',
      horizontalLight: '/brand/logos/baz-logo-horizontal-light.svg',
      horizontalWhite: '/brand/logos/baz-logo-horizontal-white.svg',
      favicon: '/brand/logos/baz-favicon.svg',
      appleTouch: '/brand/logos/baz-apple-touch-icon.svg',
    },
    social: {
      ogImage: '/brand/social/baz-og-image.svg',
      twitterBanner: '/brand/social/baz-twitter-banner.svg',
      linkedinBanner: '/brand/social/baz-linkedin-banner.svg',
    },
    textures: {
      watermark: '/brand/textures/baz-watermark-pattern.svg',
      dotGrid: '/brand/textures/baz-dot-grid.svg',
      shimmer: '/brand/textures/baz-shimmer.svg',
    },
  },
} as const;

export type Brand = typeof brand;

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount);
}

export function formatDocDate(ts: number, format: 'full' | 'short' | 'iso' = 'full'): string {
  const d = new Date(ts);
  switch (format) {
    case 'full': return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    case 'short': return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    case 'iso': return d.toISOString().split('T')[0];
  }
}

let invoiceCounter = 0;
export function generateInvoiceNumber(prefix = 'INV'): string {
  const now = new Date();
  invoiceCounter++;
  return `${prefix}-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${String(invoiceCounter).padStart(4, '0')}`;
}

export function brandCSS(): string {
  return `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Inter:wght@100..900&family=JetBrains+Mono:wght@100..800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',sans-serif;color:#0a0a0d;background:#fff;line-height:1.618;-webkit-font-smoothing:antialiased}
h1,h2,h3{font-family:'Fraunces',Georgia,serif}
code,.mono{font-family:'JetBrains Mono',monospace}
.accent{color:var(--accent)}.accent-bg{background:var(--accent);color:#fff}.accent-soft{background:var(--accent-soft);color:var(--accent)}
.brand-border{border-color:var(--accent)}.brand-line{border-color:var(--accent-glow)}
.radius-sm{border-radius:5px}.radius-md{border-radius:8px}.radius-lg{border-radius:13px}.radius-xl{border-radius:21px}
.space-xs{margin-bottom:3px}.space-sm{margin-bottom:5px}.space-md{margin-bottom:8px}.space-lg{margin-bottom:13px}.space-xl{margin-bottom:21px}
.font-display{font-family:'Fraunces',Georgia,serif}.font-body{font-family:'Inter',sans-serif}.font-mono{font-family:'JetBrains Mono',monospace}
.tabular-nums{font-variant-numeric:tabular-nums}.hanging-punct{hanging-punctuation:first last}
@page{margin:21mm;size:A4}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}.no-print{display:none!important}}
`;
}