/**
 * BAZ Brand Asset Generator
 * 
 * Generates the complete brand asset kit from Æther design system tokens.
 * Uses Fibonacci spacing, golden-ratio easing, and mathematical precision.
 * 
 * Run: npx tsx scripts/generate-brand-assets.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// ─── Æther Design System Tokens ───
const PHI = 1.618033988749895;
const FIB = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987];

const brand = {
  accent: '#888888',
  accentRGB: '184, 122, 219',
  void: '#0a0a0d',
  shadow: '#16141c',
  surface: '#211e28',
  card: '#2d2a35',
  raised: '#3a3644',
  hover: '#4b4559',
  focus: '#524d64',
  muted: '#6e6879',
  ink: '#faf9fa',
  ink2: '#a4a0ab',
  success: '#4ade80',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#60a5fa',
  fontDisplay: "'Fraunces', Georgia, serif",
  fontBody: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  fontMono: "'JetBrains Mono', monospace",
  radius: { sm: 3, base: 5, md: 8, lg: 13, xl: 21, '2xl': 34, full: 55, pill: 89 },
  company: {
    name: 'BAZ Marketing Agency',
    shortName: 'BAZ',
    tagline: 'The growth partner for ambitious businesses.',
    email: 'zerboutbrahimamir@gmail.com',
    website: 'baz.agency',
  },
};

// ─── SVG Generators ───

function generateBAZLetterforms(x: number, y: number, scale: number, color: string, variant: string): string {
  const s = scale;
  const fill = color;
  const opacity = variant === 'mono' ? '0.9' : '1';
  return `
    <!-- B -->
    <rect x="${x}" y="${y}" width="${8*s}" height="${272*s}" rx="${4*s}" fill="${fill}" opacity="${opacity}"/>
    <rect x="${x}" y="${y}" width="${89*s}" height="${8*s}" rx="${4*s}" fill="${fill}"/>
    <rect x="${x}" y="${y + 89*s}" width="${89*s}" height="${8*s}" rx="${4*s}" fill="${fill}"/>
    <rect x="${x + 81*s}" y="${y}" width="${8*s}" height="${97*s}" rx="${4*s}" fill="${fill}"/>
    <path d="M ${x + 89*s} ${y} Q ${x + 144*s} ${y} ${x + 144*s} ${y + 48.5*s} Q ${x + 144*s} ${y + 97*s} ${x + 89*s} ${y + 97*s}" fill="${fill}"/>
    <rect x="${x + 81*s}" y="${y + 185*s}" width="${8*s}" height="${8*s}" rx="${4*s}" fill="${fill}"/>
    <path d="M ${x + 89*s} ${y + 97*s} Q ${x + 155*s} ${y + 97*s} ${x + 155*s} ${y + 169*s} Q ${x + 155*s} ${y + 272*s} ${x + 89*s} ${y + 272*s}" fill="${fill}" opacity="0.9"/>
    <!-- A -->
    <g transform="translate(${x + 175*s}, ${y})">
      <path d="M 0 ${272*s} L ${72*s} 0 L ${144*s} ${272*s} H ${120*s} L ${105*s} ${210*s} H ${39*s} L ${24*s} ${272*s} Z M ${48*s} ${144*s} L ${72*s} ${72*s} L ${96*s} ${144*s} Z" fill="${fill}"/>
    </g>
    <!-- Z -->
    <g transform="translate(${x + 340*s}, ${y})">
      <rect x="0" y="0" width="${117*s}" height="${8*s}" rx="${4*s}" fill="${fill}"/>
      <rect x="0" y="${264*s}" width="${117*s}" height="${8*s}" rx="${4*s}" fill="${fill}"/>
      <rect x="${109*s}" y="0" width="${8*s}" height="${272*s}" rx="${4*s}" fill="${fill}" opacity="0.6"/>
      <line x1="0" y1="${8*s}" x2="${109*s}" y2="${264*s}" stroke="${fill}" stroke-width="${8*s}" stroke-linecap="round"/>
    </g>`;
}

function generateIconMark(x: number, y: number, scale: number, color: string, bg: string, radius: number): string {
  return `
    <rect x="${x}" y="${y}" width="${128*scale}" height="${128*scale}" rx="${radius}" fill="${bg}"/>
    <rect x="${x + 24*scale}" y="${y + 28*scale}" width="${8*scale}" height="${72*scale}" rx="${4*scale}" fill="${color}"/>
    <rect x="${x + 24*scale}" y="${y + 28*scale}" width="${52*scale}" height="${8*scale}" rx="${4*scale}" fill="${color}"/>
    <rect x="${x + 68*scale}" y="${y + 28*scale}" width="${8*scale}" height="${32*scale}" rx="${4*scale}" fill="${color}"/>
    <path d="M ${x + 76*scale} ${y + 28*scale} Q ${x + 96*scale} ${y + 28*scale} ${x + 96*scale} ${y + 44*scale} Q ${x + 96*scale} ${y + 60*scale} ${x + 76*scale} ${y + 60*scale}" fill="${color}"/>
    <rect x="${x + 24*scale}" y="${y + 60*scale}" width="${52*scale}" height="${8*scale}" rx="${4*scale}" fill="${color}"/>
    <rect x="${x + 68*scale}" y="${y + 60*scale}" width="${8*scale}" height="${40*scale}" rx="${4*scale}" fill="${color}"/>
    <path d="M ${x + 76*scale} ${y + 60*scale} Q ${x + 100*scale} ${y + 60*scale} ${x + 100*scale} ${y + 80*scale} Q ${x + 100*scale} ${y + 100*scale} ${x + 76*scale} ${y + 100*scale}" fill="${color}"/>`;
}

// ─── Asset Definitions ───

interface AssetDef {
  id: string;
  label: string;
  category: string;
  sizes: { label: string; width: number; height: number }[];
  generate: (opts: { accent: string; bg: string; variant: string; size: number }) => string;
}

const ASSETS: AssetDef[] = [
  // ─── LOGOS ───
  {
    id: 'logo-full-dark',
    label: 'Full Mark (Dark)',
    category: 'logos',
    sizes: [
      { label: 'SM 256×256', width: 256, height: 256 },
      { label: 'MD 512×512', width: 512, height: 512 },
      { label: 'LG 1024×1024', width: 1024, height: 1024 },
      { label: 'XL 2048×2048', width: 2048, height: 2048 },
    ],
    generate: (o) => {
      const s = o.size / 512;
      const r = Math.round(89 * s);
      const bar = Math.round(3 * s);
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${o.size} ${o.size}" fill="none">
  <rect width="${o.size}" height="${o.size}" rx="${r}" fill="${o.bg}"/>
  <rect x="${Math.round(55*s)}" y="${Math.round(55*s)}" width="${Math.round(402*s)}" height="${bar}" rx="${Math.round(1.5*s)}" fill="${o.accent}" opacity="0.377"/>
  ${generateBAZLetterforms(Math.round(55*s), Math.round(120*s), s, o.accent, o.variant)}
  <rect x="${Math.round(55*s)}" y="${Math.round(454*s)}" width="${Math.round(402*s)}" height="${bar}" rx="${Math.round(1.5*s)}" fill="${o.accent}" opacity="0.377"/>
</svg>`;
    },
  },
  {
    id: 'logo-full-light',
    label: 'Full Mark (Light)',
    category: 'logos',
    sizes: [
      { label: 'SM 256×256', width: 256, height: 256 },
      { label: 'MD 512×512', width: 512, height: 512 },
      { label: 'LG 1024×1024', width: 1024, height: 1024 },
      { label: 'XL 2048×2048', width: 2048, height: 2048 },
    ],
    generate: (o) => {
      const s = o.size / 512;
      const r = Math.round(89 * s);
      const bar = Math.round(3 * s);
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${o.size} ${o.size}" fill="none">
  <rect width="${o.size}" height="${o.size}" rx="${r}" fill="#ffffff"/>
  <rect x="${Math.round(55*s)}" y="${Math.round(55*s)}" width="${Math.round(402*s)}" height="${bar}" rx="${Math.round(1.5*s)}" fill="#0a0a0d" opacity="0.144"/>
  ${generateBAZLetterforms(Math.round(55*s), Math.round(120*s), s, '#0a0a0d', 'light')}
  <rect x="${Math.round(55*s)}" y="${Math.round(454*s)}" width="${Math.round(402*s)}" height="${bar}" rx="${Math.round(1.5*s)}" fill="#0a0a0d" opacity="0.144"/>
</svg>`;
    },
  },
  {
    id: 'logo-full-mono',
    label: 'Full Mark (Monochrome)',
    category: 'logos',
    sizes: [
      { label: 'SM 256×256', width: 256, height: 256 },
      { label: 'MD 512×512', width: 512, height: 512 },
      { label: 'LG 1024×1024', width: 1024, height: 1024 },
    ],
    generate: (o) => {
      const s = o.size / 512;
      const r = Math.round(89 * s);
      const bar = Math.round(3 * s);
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${o.size} ${o.size}" fill="none">
  <rect width="${o.size}" height="${o.size}" rx="${r}" fill="${o.bg}"/>
  <rect x="${Math.round(55*s)}" y="${Math.round(55*s)}" width="${Math.round(402*s)}" height="${bar}" rx="${Math.round(1.5*s)}" fill="${o.accent}" opacity="0.233"/>
  ${generateBAZLetterforms(Math.round(55*s), Math.round(120*s), s, '#faf9fa', 'mono')}
  <rect x="${Math.round(55*s)}" y="${Math.round(454*s)}" width="${Math.round(402*s)}" height="${bar}" rx="${Math.round(1.5*s)}" fill="${o.accent}" opacity="0.233"/>
</svg>`;
    },
  },
  {
    id: 'logo-full-accent',
    label: 'Full Mark (White on Violet)',
    category: 'logos',
    sizes: [
      { label: 'SM 256×256', width: 256, height: 256 },
      { label: 'MD 512×512', width: 512, height: 512 },
      { label: 'LG 1024×1024', width: 1024, height: 1024 },
    ],
    generate: (o) => {
      const s = o.size / 512;
      const r = Math.round(89 * s);
      const bar = Math.round(3 * s);
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${o.size} ${o.size}" fill="none">
  <rect width="${o.size}" height="${o.size}" rx="${r}" fill="${o.accent}"/>
  <rect x="${Math.round(55*s)}" y="${Math.round(55*s)}" width="${Math.round(402*s)}" height="${bar}" rx="${Math.round(1.5*s)}" fill="#ffffff" opacity="0.377"/>
  ${generateBAZLetterforms(Math.round(55*s), Math.round(120*s), s, '#ffffff', 'accent')}
  <rect x="${Math.round(55*s)}" y="${Math.round(454*s)}" width="${Math.round(402*s)}" height="${bar}" rx="${Math.round(1.5*s)}" fill="#ffffff" opacity="0.377"/>
</svg>`;
    },
  },
  {
    id: 'logo-icon-dark',
    label: 'Icon Mark (Dark)',
    category: 'logos',
    sizes: [
      { label: 'Favicon 32×32', width: 32, height: 32 },
      { label: 'SM 128×128', width: 128, height: 128 },
      { label: 'MD 512×512', width: 512, height: 512 },
      { label: 'App 1024×1024', width: 1024, height: 1024 },
    ],
    generate: (o) => {
      const s = o.size / 128;
      const r = Math.round(34 * s);
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${o.size} ${o.size}" fill="none">
  ${generateIconMark(0, 0, s, o.accent, o.bg, r)}
</svg>`;
    },
  },
  {
    id: 'logo-icon-light',
    label: 'Icon Mark (Light)',
    category: 'logos',
    sizes: [
      { label: 'SM 128×128', width: 128, height: 128 },
      { label: 'MD 512×512', width: 512, height: 512 },
    ],
    generate: (o) => {
      const s = o.size / 128;
      const r = Math.round(34 * s);
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${o.size} ${o.size}" fill="none">
  ${generateIconMark(0, 0, s, '#0a0a0d', '#ffffff', r)}
</svg>`;
    },
  },
  {
    id: 'logo-icon-mono',
    label: 'Icon Mark (Monochrome)',
    category: 'logos',
    sizes: [
      { label: 'SM 128×128', width: 128, height: 128 },
      { label: 'MD 512×512', width: 512, height: 512 },
    ],
    generate: (o) => {
      const s = o.size / 128;
      const r = Math.round(34 * s);
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${o.size} ${o.size}" fill="none">
  ${generateIconMark(0, 0, s, '#faf9fa', o.bg, r)}
</svg>`;
    },
  },
  {
    id: 'logo-icon-accent',
    label: 'Icon Mark (White on Violet)',
    category: 'logos',
    sizes: [
      { label: 'SM 128×128', width: 128, height: 128 },
      { label: 'MD 512×512', width: 512, height: 512 },
    ],
    generate: (o) => {
      const s = o.size / 128;
      const r = Math.round(34 * s);
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${o.size} ${o.size}" fill="none">
  ${generateIconMark(0, 0, s, '#ffffff', o.accent, r)}
</svg>`;
    },
  },
  // ─── SOCIAL MEDIA ───
  {
    id: 'social-og',
    label: 'OG Image',
    category: 'social',
    sizes: [{ label: 'OG 1200×630', width: 1200, height: 630 }],
    generate: (o) => {
      const fg = o.accent; const bg = o.bg; const w = 1200; const h = 630;
      const letterH = 240; const s = letterH / 272;
      const letterY = Math.round((h - letterH) / 2) - 20;
      const letterX = Math.round((w - 480 * s) / 2);
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" fill="none">
  <defs>
    <radialGradient id="og-glow" cx="50%" cy="45%" r="45%" fx="50%" fy="45%"><stop offset="0%" stop-color="${fg}" stop-opacity="0.15"/><stop offset="60%" stop-color="${fg}" stop-opacity="0.04"/><stop offset="100%" stop-color="${bg}" stop-opacity="0"/></radialGradient>
    <pattern id="og-grid" width="34" height="34" patternUnits="userSpaceOnUse"><rect width="34" height="34" fill="none"/><circle cx="0" cy="0" r="0.5" fill="${fg}" opacity="0.08"/></pattern>
  </defs>
  <rect width="1200" height="630" fill="${bg}"/>
  <rect width="1200" height="630" fill="url(#og-grid)"/>
  <rect width="1200" height="630" fill="url(#og-glow)"/>
  <rect x="55" y="0" width="1090" height="2" fill="${fg}" opacity="0.377"/>
  ${generateBAZLetterforms(letterX, letterY, s, fg, o.variant)}
  <rect x="55" y="628" width="1090" height="2" fill="${fg}" opacity="0.377"/>
  <text x="${w/2}" y="${letterY + letterH + 55}" text-anchor="middle" font-family="Inter, -apple-system, sans-serif" font-size="21" fill="${fg}" opacity="0.55">${brand.company.tagline}</text>
</svg>`;
    },
  },
  {
    id: 'social-twitter',
    label: 'X/Twitter Banner',
    category: 'social',
    sizes: [{ label: 'Twitter 1500×500', width: 1500, height: 500 }],
    generate: (o) => {
      const fg = o.accent; const bg = o.bg; const w = 1500; const h = 500;
      const letterH = 180; const s = letterH / 272;
      const letterY = Math.round((h - letterH) / 2) - 15;
      const letterX = Math.round((w - 480 * s) / 2);
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1500 500" fill="none">
  <defs><linearGradient id="tw-grad" x1="0" y1="0" x2="1500" y2="500" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="${fg}" stop-opacity="0.06"/><stop offset="61.8%" stop-color="${bg}" stop-opacity="0"/><stop offset="100%" stop-color="${fg}" stop-opacity="0.03"/></linearGradient></defs>
  <rect width="1500" height="500" fill="${bg}"/>
  <rect width="1500" height="500" fill="url(#tw-grad)"/>
  <rect x="55" y="0" width="1390" height="2" fill="${fg}" opacity="0.377"/>
  ${generateBAZLetterforms(letterX, letterY, s, fg, o.variant)}
  <rect x="55" y="498" width="1390" height="2" fill="${fg}" opacity="0.377"/>
  <text x="${w/2}" y="${letterY + letterH + 45}" text-anchor="middle" font-family="Inter, -apple-system, sans-serif" font-size="21" fill="${fg}" opacity="0.55">${brand.company.tagline}</text>
</svg>`;
    },
  },
  {
    id: 'social-linkedin',
    label: 'LinkedIn Banner',
    category: 'social',
    sizes: [{ label: 'LinkedIn 1584×396', width: 1584, height: 396 }],
    generate: (o) => {
      const fg = o.accent; const bg = o.bg; const w = 1584; const h = 396;
      const letterH = 160; const s = letterH / 272;
      const letterY = Math.round((h - letterH) / 2) - 10;
      const letterX = Math.round((w - 480 * s) / 2);
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1584 396" fill="none">
  <rect width="1584" height="396" fill="${bg}"/>
  <rect x="55" y="0" width="1474" height="2" fill="${fg}" opacity="0.377"/>
  ${generateBAZLetterforms(letterX, letterY, s, fg, o.variant)}
  <rect x="55" y="394" width="1474" height="2" fill="${fg}" opacity="0.377"/>
  <text x="${w/2}" y="${letterY + letterH + 40}" text-anchor="middle" font-family="Inter, -apple-system, sans-serif" font-size="18" fill="${fg}" opacity="0.55">${brand.company.tagline}</text>
</svg>`;
    },
  },
  // ─── APP ICONS ───
  {
    id: 'app-icon-ios-dark',
    label: 'iOS App Icon (Dark)',
    category: 'app-icons',
    sizes: [
      { label: '120×120 @2x', width: 120, height: 120 },
      { label: '180×180 @3x', width: 180, height: 180 },
      { label: '1024×1024 App Store', width: 1024, height: 1024 },
    ],
    generate: (o) => {
      const s = o.size / 128; const r = Math.round(28 * s);
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${o.size} ${o.size}" fill="none">
  ${generateIconMark(0, 0, s, o.accent, o.bg, r)}
</svg>`;
    },
  },
  {
    id: 'app-icon-ios-light',
    label: 'iOS App Icon (Light)',
    category: 'app-icons',
    sizes: [
      { label: '120×120 @2x', width: 120, height: 120 },
      { label: '180×180 @3x', width: 180, height: 180 },
      { label: '1024×1024 App Store', width: 1024, height: 1024 },
    ],
    generate: (o) => {
      const s = o.size / 128; const r = Math.round(28 * s);
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${o.size} ${o.size}" fill="none">
  ${generateIconMark(0, 0, s, '#0a0a0d', '#ffffff', r)}
</svg>`;
    },
  },
  {
    id: 'app-icon-ios-accent',
    label: 'iOS App Icon (White on Violet)',
    category: 'app-icons',
    sizes: [
      { label: '120×120 @2x', width: 120, height: 120 },
      { label: '180×180 @3x', width: 180, height: 180 },
      { label: '1024×1024 App Store', width: 1024, height: 1024 },
    ],
    generate: (o) => {
      const s = o.size / 128; const r = Math.round(28 * s);
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${o.size} ${o.size}" fill="none">
  ${generateIconMark(0, 0, s, '#ffffff', o.accent, r)}
</svg>`;
    },
  },
  {
    id: 'app-icon-android',
    label: 'Android Adaptive Icon',
    category: 'app-icons',
    sizes: [
      { label: '108×108 mdpi', width: 108, height: 108 },
      { label: '432×432 xxxhdpi', width: 432, height: 432 },
    ],
    generate: (o) => {
      const fg = o.variant === 'light' ? '#0a0a0d' : (o.variant === 'accent' ? '#ffffff' : o.accent);
      const bg = o.variant === 'light' ? '#ffffff' : (o.variant === 'accent' ? o.accent : o.bg);
      const s = o.size / 128;
      const cx = o.size / 2;
      const iconS = o.size * 0.5 / 128;
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${o.size} ${o.size}" fill="none">
  <rect width="${o.size}" height="${o.size}" fill="${bg}"/>
  ${generateIconMark(cx - 64*iconS, cx - 64*iconS, iconS, fg, 'none', 34*iconS)}
</svg>`;
    },
  },
  // ─── TEXTURES ───
  {
    id: 'texture-watermark',
    label: 'Watermark Pattern',
    category: 'textures',
    sizes: [{ label: 'Tile 200×200', width: 200, height: 200 }],
    generate: (o) => {
      const fg = o.accent; const bg = o.bg; const s = o.size / 200;
      const dots = [13, 21, 34, 55, 89];
      const gridDots = dots.flatMap(y => dots.map(x =>
        `<circle cx="${x*s}" cy="${y*s}" r="${0.5*s}" fill="${fg}" opacity="0.06"/>`
      )).join('\n    ');
      // B letterform (simplified)
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${o.size} ${o.size}" fill="none">
  <rect width="${o.size}" height="${o.size}" fill="${bg}"/>
  <rect x="${20*s}" y="${30*s}" width="${2*s}" height="${40*s}" rx="${1*s}" fill="${fg}" opacity="0.03"/>
  <rect x="${20*s}" y="${30*s}" width="${18*s}" height="${2*s}" rx="${1*s}" fill="${fg}" opacity="0.03"/>
  <rect x="${36*s}" y="${30*s}" width="${2*s}" height="${15*s}" rx="${1*s}" fill="${fg}" opacity="0.03"/>
  <rect x="${20*s}" y="${45*s}" width="${18*s}" height="${2*s}" rx="${1*s}" fill="${fg}" opacity="0.03"/>
  <rect x="${36*s}" y="${45*s}" width="${2*s}" height="${25*s}" rx="${1*s}" fill="${fg}" opacity="0.03"/>
  ${gridDots}
</svg>`;
    },
  },
  {
    id: 'texture-dot-grid',
    label: 'Dot Grid',
    category: 'textures',
    sizes: [{ label: 'Tile 100×100', width: 100, height: 100 }],
    generate: (o) => {
      const fg = o.accent; const bg = o.bg; const s = o.size / 100;
      const dots = [13, 21, 34, 55, 89];
      const gridDots = dots.flatMap(y => dots.map(x =>
        `<circle cx="${x*s}" cy="${y*s}" r="${0.5*s}" fill="${fg}" opacity="0.06"/>`
      )).join('\n    ');
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${o.size} ${o.size}" fill="none">
  <rect width="${o.size}" height="${o.size}" fill="${bg}"/>
  ${gridDots}
</svg>`;
    },
  },
  {
    id: 'texture-shimmer',
    label: 'Shimmer Texture',
    category: 'textures',
    sizes: [{ label: 'Shimmer 200×200', width: 200, height: 200 }],
    generate: (o) => {
      const fg = o.accent; const bg = o.bg;
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="shimmer" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${fg}" stop-opacity="0"/>
      <stop offset="38.2%" stop-color="${fg}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${fg}" stop-opacity="0.06"/>
      <stop offset="61.8%" stop-color="${fg}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${fg}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" fill="${bg}"/>
  <rect width="200" height="200" fill="url(#shimmer)"/>
</svg>`;
    },
  },
  {
    id: 'texture-noise',
    label: 'Noise Grain',
    category: 'textures',
    sizes: [{ label: 'Tile 200×200', width: 200, height: 200 }],
    generate: (o) => {
      const bg = o.bg;
      // SVG filter-based noise (deterministic, no random)
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <filter id="noise" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise"/>
      <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise"/>
      <feComponentTransfer in="grayNoise" result="subtleNoise">
        <feFuncA type="linear" slope="0.03"/>
      </feComponentTransfer>
    </filter>
  </defs>
  <rect width="200" height="200" fill="${bg}"/>
  <rect width="200" height="200" filter="url(#noise)"/>
</svg>`;
    },
  },
];

// ─── Variants ───

const VARIANTS = [
  { id: 'dark', label: 'Dark (Void)', fg: '#b87adb', bg: '#0a0a0d' },
  { id: 'light', label: 'Light', fg: '#0a0a0d', bg: '#ffffff' },
  { id: 'mono', label: 'Monochrome', fg: '#faf9fa', bg: '#0a0a0d' },
  { id: 'accent', label: 'White on Violet', fg: '#ffffff', bg: '#b87adb' },
];

// ─── Generate All Assets ───

const outDir = path.join(process.cwd(), 'public', 'brand');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function generateAll() {
  const categories = ['logos', 'social', 'app-icons', 'textures', 'patterns'];
  let total = 0;

  for (const cat of categories) {
    const catDir = path.join(outDir, cat);
    ensureDir(catDir);
  }

  for (const asset of ASSETS) {
    const catDir = path.join(outDir, asset.category);
    ensureDir(catDir);

    for (const variant of VARIANTS) {
      for (const size of asset.sizes) {
        const svg = asset.generate({
          accent: variant.fg,
          bg: variant.bg,
          variant: variant.id,
          size: size.width,
        });

        const filename = `${asset.id}-${variant.id}-${size.width}x${size.height}.svg`;
        const filepath = path.join(catDir, filename);
        fs.writeFileSync(filepath, svg);
        total++;
      }
    }
  }

  console.log(`✓ Generated ${total} brand assets in ${outDir}`);
  console.log(`  Categories: ${categories.join(', ')}`);
  console.log(`  Variants: ${VARIANTS.map(v => v.label).join(', ')}`);
}

// ─── Generate Brand Manifest ───

function generateManifest() {
  const manifest = {
    name: brand.company.name,
    shortName: brand.company.shortName,
    tagline: brand.company.tagline,
    colors: {
      accent: brand.accent,
      void: brand.void,
      shadow: brand.shadow,
      surface: brand.surface,
      card: brand.card,
      raised: brand.raised,
      hover: brand.hover,
      focus: brand.focus,
      muted: brand.muted,
      ink: brand.ink,
      inkSecondary: brand.ink2,
      success: brand.success,
      warning: brand.warning,
      danger: brand.danger,
      info: brand.info,
    },
    typography: {
      display: { family: 'Fraunces', weights: ['100..900'] },
      body: { family: 'Inter', weights: ['100..900'] },
      mono: { family: 'JetBrains Mono', weights: ['100..800'] },
    },
    spacing: { xs: 3, sm: 5, md: 8, lg: 13, xl: 21, xxl: 34, xxxl: 55 },
    radius: { sm: 3, base: 5, md: 8, lg: 13, xl: 21, '2xl': 34, full: 55, pill: 89 },
    duration: { instant: 89, swift: 144, fast: 233, normal: 377, smooth: 610, slowest: 987 },
    easing: {
      natural: [0.618, 0, 0.618, 1],
      spring: { type: 'spring', stiffness: 233, damping: 34, mass: 1 },
      glide: [0.236, 0.618, 0.236, 1],
      snap: [0.382, 0, 0.236, 1],
      float: [0.618, 0, 0.382, 1],
    },
    assets: ASSETS.reduce((acc: Record<string, unknown>, asset: AssetDef) => {
      acc[asset.id] = {
        label: asset.label,
        category: asset.category,
        variants: VARIANTS.map(v => v.id),
        sizes: asset.sizes.map(s => ({ label: s.label, width: s.width, height: s.height })),
      };
      return acc;
    }, {}),
    generatedAt: new Date().toISOString(),
    designSystem: 'Æther Fibonacci × Da Vinci × Material 3',
    version: '1.0.0',
  };

  const manifestPath = path.join(outDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`✓ Brand manifest written to ${manifestPath}`);
}

// ─── Run ───

generateAll();
generateManifest();
console.log('\nDone. All Æther brand assets generated.');
