import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const brand = {
  accent: '#888888',
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
  company: {
    name: 'BAZ Marketing Agency',
    shortName: 'BAZ',
    tagline: 'The growth partner for ambitious businesses.',
  },
};

const R = (v) => Math.round(v);

function baz(x, y, s, fill, variant) {
  const o = variant === 'mono' ? '0.9' : '1';
  return `
    <rect x="${R(x)}" y="${R(y)}" width="${R(8*s)}" height="${R(272*s)}" rx="${R(4*s)}" fill="${fill}" opacity="${o}"/>
    <rect x="${R(x)}" y="${R(y)}" width="${R(89*s)}" height="${R(8*s)}" rx="${R(4*s)}" fill="${fill}"/>
    <rect x="${R(x)}" y="${R(y+89*s)}" width="${R(89*s)}" height="${R(8*s)}" rx="${R(4*s)}" fill="${fill}"/>
    <rect x="${R(x+81*s)}" y="${R(y)}" width="${R(8*s)}" height="${R(97*s)}" rx="${R(4*s)}" fill="${fill}"/>
    <path d="M ${R(x+89*s)} ${R(y)} Q ${R(x+144*s)} ${R(y)} ${R(x+144*s)} ${R(y+48.5*s)} Q ${R(x+144*s)} ${R(y+97*s)} ${R(x+89*s)} ${R(y+97*s)}" fill="${fill}"/>
    <rect x="${R(x+81*s)}" y="${R(y+185*s)}" width="${R(8*s)}" height="${R(8*s)}" rx="${R(4*s)}" fill="${fill}"/>
    <path d="M ${R(x+89*s)} ${R(y+97*s)} Q ${R(x+155*s)} ${R(y+97*s)} ${R(x+155*s)} ${R(y+169*s)} Q ${R(x+155*s)} ${R(y+272*s)} ${R(x+89*s)} ${R(y+272*s)}" fill="${fill}" opacity="0.9"/>
    <g transform="translate(${R(x+175*s)}, ${R(y)})">
      <path d="M 0 ${R(272*s)} L ${R(72*s)} 0 L ${R(144*s)} ${R(272*s)} H ${R(120*s)} L ${R(105*s)} ${R(210*s)} H ${R(39*s)} L ${R(24*s)} ${R(272*s)} Z M ${R(48*s)} ${R(144*s)} L ${R(72*s)} ${R(72*s)} L ${R(96*s)} ${R(144*s)} Z" fill="${fill}"/>
    </g>
    <g transform="translate(${R(x+340*s)}, ${R(y)})">
      <rect x="0" y="0" width="${R(117*s)}" height="${R(8*s)}" rx="${R(4*s)}" fill="${fill}"/>
      <rect x="0" y="${R(264*s)}" width="${R(117*s)}" height="${R(8*s)}" rx="${R(4*s)}" fill="${fill}"/>
      <rect x="${R(109*s)}" y="0" width="${R(8*s)}" height="${R(272*s)}" rx="${R(4*s)}" fill="${fill}" opacity="0.6"/>
      <line x1="0" y1="${R(8*s)}" x2="${R(109*s)}" y2="${R(264*s)}" stroke="${fill}" stroke-width="${R(8*s)}" stroke-linecap="round"/>
    </g>`;
}

function iconMark(x, y, s, fg, bg, radius) {
  return `
    <rect x="${R(x)}" y="${R(y)}" width="${R(128*s)}" height="${R(128*s)}" rx="${R(radius)}" fill="${bg}"/>
    <rect x="${R(x+24*s)}" y="${R(y+28*s)}" width="${R(8*s)}" height="${R(72*s)}" rx="${R(4*s)}" fill="${fg}"/>
    <rect x="${R(x+24*s)}" y="${R(y+28*s)}" width="${R(52*s)}" height="${R(8*s)}" rx="${R(4*s)}" fill="${fg}"/>
    <rect x="${R(x+68*s)}" y="${R(y+28*s)}" width="${R(8*s)}" height="${R(32*s)}" rx="${R(4*s)}" fill="${fg}"/>
    <path d="M ${R(x+76*s)} ${R(y+28*s)} Q ${R(x+96*s)} ${R(y+28*s)} ${R(x+96*s)} ${R(y+44*s)} Q ${R(x+96*s)} ${R(y+60*s)} ${R(x+76*s)} ${R(y+60*s)}" fill="${fg}"/>
    <rect x="${R(x+24*s)}" y="${R(y+60*s)}" width="${R(52*s)}" height="${R(8*s)}" rx="${R(4*s)}" fill="${fg}"/>
    <rect x="${R(x+68*s)}" y="${R(y+60*s)}" width="${R(8*s)}" height="${R(40*s)}" rx="${R(4*s)}" fill="${fg}"/>
    <path d="M ${R(x+76*s)} ${R(y+60*s)} Q ${R(x+100*s)} ${R(y+60*s)} ${R(x+100*s)} ${R(y+80*s)} Q ${R(x+100*s)} ${R(y+100*s)} ${R(x+76*s)} ${R(y+100*s)}" fill="${fg}"/>`;
}

const VARIANTS = [
  { id: 'dark', fg: '#b87adb', bg: '#0a0a0d' },
  { id: 'light', fg: '#0a0a0d', bg: '#ffffff' },
  { id: 'mono', fg: '#faf9fa', bg: '#0a0a0d' },
  { id: 'accent', fg: '#ffffff', bg: '#b87adb' },
];

const outDir = 'public/brand';
let total = 0;

function w(filepath, content) {
  writeFileSync(filepath, content.trim() + '\n');
  total++;
}

function svgWrap(size, body) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" fill="none">\n${body}\n</svg>`;
}

function svgWrapRect(w, h, body) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" fill="none">\n${body}\n</svg>`;
}

// ─── LOGOS ───

mkdirSync(`${outDir}/logos`, { recursive: true });

// Full Mark logos (4 sizes × 4 variants)
const logoSizes = [
  { label: '256', size: 256 },
  { label: '512', size: 512 },
  { label: '1024', size: 1024 },
  { label: '2048', size: 2048 },
];

for (const v of VARIANTS) {
  for (const ls of logoSizes) {
    const sz = ls.size;
    const s = sz / 512;
    const r = R(89 * s);
    const bar = R(3 * s);
    const letters = baz(R(55*s), R(120*s), s, v.fg, v.id);
    const accentBar = v.id === 'dark' ? '0.377' : v.id === 'accent' ? '0.377' : v.id === 'light' ? '0.144' : '0.233';
    const accentFill = v.id === 'light' ? '#0a0a0d' : v.id === 'accent' ? '#ffffff' : v.fg;
    const content = `  <rect width="${sz}" height="${sz}" rx="${r}" fill="${v.bg}"/>
  <rect x="${R(55*s)}" y="${R(55*s)}" width="${R(402*s)}" height="${bar}" rx="${R(1.5*s)}" fill="${accentFill}" opacity="${accentBar}"/>
  ${letters}
  <rect x="${R(55*s)}" y="${R(454*s)}" width="${R(402*s)}" height="${bar}" rx="${R(1.5*s)}" fill="${accentFill}" opacity="${accentBar}"/>`;
    w(`${outDir}/logos/logo-full-${v.id}-${ls.label}.svg`, svgWrap(sz, content));
  }
}

// Icon Mark logos (4 sizes × 4 variants)
const iconSizes = [
  { label: '32', size: 32 },
  { label: '128', size: 128 },
  { label: '512', size: 512 },
  { label: '1024', size: 1024 },
];

for (const v of VARIANTS) {
  for (const isz of iconSizes) {
    const sz = isz.size;
    const s = sz / 128;
    const r = R(34 * s);
    const content = iconMark(0, 0, s, v.fg, v.bg, r);
    w(`${outDir}/logos/logo-icon-${v.id}-${isz.label}.svg`, svgWrap(sz, content));
  }
}

// Horizontal lockup (dark only for now, most common usage)
{
  const HW = 512; const HH = 128;
  const s = 0.4;
  const iconContent = iconMark(8, 8, s, brand.accent, brand.void, R(34*s));
  const letterContent = baz(R(68*s) + 20, R(16), s*0.75, brand.accent, 'dark');
  const content = `  <rect width="${HW}" height="${HH}" rx="21" fill="${brand.void}"/>
  ${iconContent}
  ${letterContent}`;
  w(`${outDir}/logos/logo-horizontal-dark.svg`, svgWrapRect(HW, HH, content));
}

// ─── SOCIAL MEDIA ───

mkdirSync(`${outDir}/social`, { recursive: true });

// OG Image (1200×630)
for (const v of VARIANTS) {
  const W = 1200; const H = 630;
  const letterH = 240; const s = letterH / 272;
  const letterY = R((H - letterH) / 2) - 20;
  const letterX = R((W - 480 * s) / 2);
  const accentFill = v.id === 'light' ? '#0a0a0d' : v.id === 'accent' ? '#ffffff' : v.fg;
  const content = `  <defs>
    <radialGradient id="og-glow" cx="50%" cy="45%" r="45%"><stop offset="0%" stop-color="${accentFill}" stop-opacity="0.15"/><stop offset="60%" stop-color="${accentFill}" stop-opacity="0.04"/><stop offset="100%" stop-color="${v.bg}" stop-opacity="0"/></radialGradient>
    <pattern id="og-grid" width="34" height="34" patternUnits="userSpaceOnUse"><rect width="34" height="34" fill="none"/><circle cx="0" cy="0" r="0.5" fill="${accentFill}" opacity="0.08"/></pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="${v.bg}"/>
  <rect width="${W}" height="${H}" fill="url(#og-grid)"/>
  <rect width="${W}" height="${H}" fill="url(#og-glow)"/>
  <rect x="55" y="0" width="1090" height="2" fill="${accentFill}" opacity="0.377"/>
  ${baz(letterX, letterY, s, v.fg, v.id)}
  <rect x="55" y="628" width="1090" height="2" fill="${accentFill}" opacity="0.377"/>
  <text x="${W/2}" y="${letterY + letterH + 55}" text-anchor="middle" font-family="Inter, -apple-system, sans-serif" font-size="21" fill="${v.fg}" opacity="0.55">${brand.company.tagline}</text>`;
  w(`${outDir}/social/og-image-${v.id}.svg`, svgWrapRect(W, H, content));
}

// Twitter/X Banner (1500×500)
for (const v of VARIANTS) {
  const W = 1500; const H = 500;
  const letterH = 180; const s = letterH / 272;
  const letterY = R((H - letterH) / 2) - 15;
  const letterX = R((W - 480 * s) / 2);
  const accentFill = v.id === 'light' ? '#0a0a0d' : v.id === 'accent' ? '#ffffff' : v.fg;
  const content = `  <defs><linearGradient id="tw-grad" x1="0" y1="0" x2="${W}" y2="${H}" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="${accentFill}" stop-opacity="0.06"/><stop offset="61.8%" stop-color="${v.bg}" stop-opacity="0"/><stop offset="100%" stop-color="${accentFill}" stop-opacity="0.03"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="${v.bg}"/>
  <rect width="${W}" height="${H}" fill="url(#tw-grad)"/>
  <rect x="55" y="0" width="${W-110}" height="2" fill="${accentFill}" opacity="0.377"/>
  ${baz(letterX, letterY, s, v.fg, v.id)}
  <rect x="55" y="${H-2}" width="${W-110}" height="2" fill="${accentFill}" opacity="0.377"/>
  <text x="${W/2}" y="${letterY + letterH + 45}" text-anchor="middle" font-family="Inter, -apple-system, sans-serif" font-size="21" fill="${v.fg}" opacity="0.55">${brand.company.tagline}</text>`;
  w(`${outDir}/social/twitter-banner-${v.id}.svg`, svgWrapRect(W, H, content));
}

// LinkedIn Banner (1584×396)
for (const v of VARIANTS) {
  const W = 1584; const H = 396;
  const letterH = 160; const s = letterH / 272;
  const letterY = R((H - letterH) / 2) - 10;
  const letterX = R((W - 480 * s) / 2);
  const accentFill = v.id === 'light' ? '#0a0a0d' : v.id === 'accent' ? '#ffffff' : v.fg;
  const content = `  <rect width="${W}" height="${H}" fill="${v.bg}"/>
  <rect x="55" y="0" width="${W-110}" height="2" fill="${accentFill}" opacity="0.377"/>
  ${baz(letterX, letterY, s, v.fg, v.id)}
  <rect x="55" y="${H-2}" width="${W-110}" height="2" fill="${accentFill}" opacity="0.377"/>
  <text x="${W/2}" y="${letterY + letterH + 40}" text-anchor="middle" font-family="Inter, -apple-system, sans-serif" font-size="18" fill="${v.fg}" opacity="0.55">${brand.company.tagline}</text>`;
  w(`${outDir}/social/linkedin-banner-${v.id}.svg`, svgWrapRect(W, H, content));
}

// Facebook Cover (820×312)
for (const v of VARIANTS) {
  const W = 820; const H = 312;
  const letterH = 130; const s = letterH / 272;
  const letterY = R((H - letterH) / 2) - 8;
  const letterX = R((W - 480 * s) / 2);
  const accentFill = v.id === 'light' ? '#0a0a0d' : v.id === 'accent' ? '#ffffff' : v.fg;
  const content = `  <rect width="${W}" height="${H}" fill="${v.bg}"/>
  <rect x="34" y="0" width="${W-68}" height="2" fill="${accentFill}" opacity="0.377"/>
  ${baz(letterX, letterY, s, v.fg, v.id)}
  <rect x="34" y="${H-2}" width="${W-68}" height="2" fill="${accentFill}" opacity="0.377"/>
  <text x="${W/2}" y="${letterY + letterH + 34}" text-anchor="middle" font-family="Inter, -apple-system, sans-serif" font-size="16" fill="${v.fg}" opacity="0.55">${brand.company.tagline}</text>`;
  w(`${outDir}/social/facebook-cover-${v.id}.svg`, svgWrapRect(W, H, content));
}

// YouTube Banner (2560×1440 safe area 1546×423)
for (const v of VARIANTS) {
  const W = 2560; const H = 1440;
  const SH = 423; const SY = 423;
  const letterH = 180; const s = letterH / 272;
  const letterY = R(SY + (SH - letterH) / 2) - 10;
  const letterX = R((W - 480 * s) / 2);
  const accentFill = v.id === 'light' ? '#0a0a0d' : v.id === 'accent' ? '#ffffff' : v.fg;
  const content = `  <rect width="${W}" height="${H}" fill="${v.bg}"/>
  <rect x="55" y="${SY}" width="${W-110}" height="2" fill="${accentFill}" opacity="0.377"/>
  ${baz(letterX, letterY, s, v.fg, v.id)}
  <rect x="55" y="${SY+SH-2}" width="${W-110}" height="2" fill="${accentFill}" opacity="0.377"/>
  <text x="${W/2}" y="${letterY + letterH + 40}" text-anchor="middle" font-family="Inter, -apple-system, sans-serif" font-size="21" fill="${v.fg}" opacity="0.55">${brand.company.tagline}</text>`;
  w(`${outDir}/social/youtube-banner-${v.id}.svg`, svgWrapRect(W, H, content));
}

// ─── APP ICONS ───

mkdirSync(`${outDir}/app-icons`, { recursive: true });

// iOS sizes
const iosSizes = [
  { label: '120', size: 120 },
  { label: '180', size: 180 },
  { label: '1024', size: 1024 },
];

for (const v of VARIANTS) {
  for (const isz of iosSizes) {
    const sz = isz.size;
    const s = sz / 128;
    const r = R(28 * s);
    const content = iconMark(0, 0, s, v.fg, v.bg, r);
    w(`${outDir}/app-icons/ios-${v.id}-${isz.label}.svg`, svgWrap(sz, content));
  }
}

// Android sizes
const androidSizes = [
  { label: 'mdpi-48', size: 48 },
  { label: 'hdpi-72', size: 72 },
  { label: 'xhdpi-96', size: 96 },
  { label: 'xxhdpi-144', size: 144 },
  { label: 'xxxhdpi-192', size: 192 },
  { label: 'play-512', size: 512 },
];

for (const v of VARIANTS) {
  for (const asz of androidSizes) {
    const sz = asz.size;
    const s = sz / 128;
    const r = R(28 * s);
    const content = iconMark(0, 0, s, v.fg, v.bg, r);
    w(`${outDir}/app-icons/android-${v.id}-${asz.label}.svg`, svgWrap(sz, content));
  }
}

// Favicon (32×32, simplified)
for (const v of VARIANTS) {
  const sz = 32;
  const s = sz / 128;
  const r = R(28 * s);
  // Simplified icon at tiny size — just the B shape
  const content = `  <rect width="${sz}" height="${sz}" rx="${r}" fill="${v.bg}"/>
  <rect x="${R(8*s)}" y="${R(7*s)}" width="${R(3*s)}" height="${R(18*s)}" rx="${R(1.5*s)}" fill="${v.fg}"/>
  <rect x="${R(8*s)}" y="${R(7*s)}" width="${R(13*s)}" height="${R(3*s)}" rx="${R(1.5*s)}" fill="${v.fg}"/>
  <rect x="${R(18*s)}" y="${R(7*s)}" width="${R(3*s)}" height="${R(8*s)}" rx="${R(1.5*s)}" fill="${v.fg}"/>
  <rect x="${R(8*s)}" y="${R(15*s)}" width="${R(13*s)}" height="${R(3*s)}" rx="${R(1.5*s)}" fill="${v.fg}"/>
  <rect x="${R(18*s)}" y="${R(15*s)}" width="${R(3*s)}" height="${R(10*s)}" rx="${R(1.5*s)}" fill="${v.fg}"/>`;
  w(`${outDir}/app-icons/favicon-${v.id}-32.svg`, svgWrap(sz, content));
}

// ─── TEXTURES ───

mkdirSync(`${outDir}/textures`, { recursive: true });

// Dot Grid (Fibonacci spacing)
for (const v of VARIANTS) {
  const sz = 200;
  const dots = [13, 21, 34, 55, 89].flatMap(y => [13, 21, 34, 55, 89].map(x =>
    `    <circle cx="${R(x*2)}" cy="${R(y*2)}" r="1" fill="${v.fg}" opacity="0.06"/>`
  )).join('\n');
  const content = `  <rect width="${sz}" height="${sz}" fill="${v.bg}"/>\n${dots}`;
  w(`${outDir}/textures/dot-grid-${v.id}.svg`, svgWrap(sz, content));
}

// Shimmer Texture
for (const v of VARIANTS) {
  const content = `  <defs>
    <linearGradient id="shimmer" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${v.fg}" stop-opacity="0"/>
      <stop offset="38.2%" stop-color="${v.fg}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${v.fg}" stop-opacity="0.06"/>
      <stop offset="61.8%" stop-color="${v.fg}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${v.fg}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" fill="${v.bg}"/>
  <rect width="200" height="200" fill="url(#shimmer)"/>`;
  w(`${outDir}/textures/shimmer-${v.id}.svg`, svgWrap(200, content));
}

// Noise Grain
for (const v of VARIANTS) {
  const content = `  <defs>
    <filter id="noise" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise"/>
      <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise"/>
      <feComponentTransfer in="grayNoise" result="subtleNoise">
        <feFuncA type="linear" slope="0.03"/>
      </feComponentTransfer>
    </filter>
  </defs>
  <rect width="200" height="200" fill="${v.bg}"/>
  <rect width="200" height="200" filter="url(#noise)"/>`;
  w(`${outDir}/textures/noise-${v.id}.svg`, svgWrap(200, content));
}

// Watermark Pattern
for (const v of VARIANTS) {
  const sz = 200;
  const s = 1;
  const dots = [13, 21, 34, 55, 89].flatMap(y => [13, 21, 34, 55, 89].map(x =>
    `    <circle cx="${R(x*s)}" cy="${R(y*s)}" r="0.5" fill="${v.fg}" opacity="0.08"/>`
  )).join('\n');
  const content = `  <rect width="${sz}" height="${sz}" fill="${v.bg}"/>
  <rect x="${R(20*s)}" y="${R(30*s)}" width="${R(2*s)}" height="${R(40*s)}" rx="${R(1*s)}" fill="${v.fg}" opacity="0.03"/>
  <rect x="${R(20*s)}" y="${R(30*s)}" width="${R(18*s)}" height="${R(2*s)}" rx="${R(1*s)}" fill="${v.fg}" opacity="0.03"/>
  <rect x="${R(36*s)}" y="${R(30*s)}" width="${R(2*s)}" height="${R(15*s)}" rx="${R(1*s)}" fill="${v.fg}" opacity="0.03"/>
  <rect x="${R(20*s)}" y="${R(45*s)}" width="${R(18*s)}" height="${R(2*s)}" rx="${R(1*s)}" fill="${v.fg}" opacity="0.03"/>
  <rect x="${R(36*s)}" y="${R(45*s)}" width="${R(2*s)}" height="${R(25*s)}" rx="${R(1*s)}" fill="${v.fg}" opacity="0.03"/>
${dots}`;
  w(`${outDir}/textures/watermark-${v.id}.svg`, svgWrap(sz, content));
}

// Gradient Mesh (violet gradient)
{
  const content = `  <defs>
    <radialGradient id="mesh1" cx="38.2%" cy="38.2%" r="61.8%"><stop offset="0%" stop-color="#b87adb" stop-opacity="0.25"/><stop offset="61.8%" stop-color="#b87adb" stop-opacity="0.04"/><stop offset="100%" stop-color="#0a0a0d" stop-opacity="0"/></radialGradient>
    <radialGradient id="mesh2" cx="61.8%" cy="61.8%" r="38.2%"><stop offset="0%" stop-color="#b87adb" stop-opacity="0.12"/><stop offset="50%" stop-color="#b87adb" stop-opacity="0.02"/><stop offset="100%" stop-color="#0a0a0d" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="512" height="512" fill="#0a0a0d"/>
  <rect width="512" height="512" fill="url(#mesh1)"/>
  <rect width="512" height="512" fill="url(#mesh2)"/>`;
  w(`${outDir}/textures/gradient-mesh.svg`, svgWrap(512, content));
}

// ─── PATTERNS ───

mkdirSync(`${outDir}/patterns`, { recursive: true });

// Fibonacci Spiral
{
  const content = `  <defs>
    <clipPath id="spiral-clip"><rect width="512" height="512" rx="89"/></clipPath>
  </defs>
  <rect width="512" height="512" rx="89" fill="#0a0a0d"/>
  <g clip-path="url(#spiral-clip)" opacity="0.08">
    <path d="M 256 256 Q 256 148 318 148 Q 382 148 382 212 Q 382 276 318 276 Q 218 276 218 194 Q 218 108 318 108 Q 404 108 404 194 Q 404 306 296 306 Q 170 306 170 194 Q 170 68 296 68" fill="none" stroke="#b87adb" stroke-width="1.5"/>
    <path d="M 256 256 Q 364 256 364 318 Q 364 382 300 382 Q 236 382 236 318 Q 236 218 318 218 Q 404 218 404 294" fill="none" stroke="#b87adb" stroke-width="1" opacity="0.5"/>
  </g>`;
  w(`${outDir}/patterns/fibonacci-spiral.svg`, svgWrap(512, content));
}

// Golden Ratio Grid
{
  const phi = 1.618033988749895;
  const lines = [];
  let x = 0;
  const cuts = [0.618, 0.382, 0.236, 0.146, 0.090];
  let remaining = 512;
  for (const c of cuts) {
    remaining *= c;
    const pos = 512 - remaining;
    lines.push(`    <line x1="${R(pos)}" y1="0" x2="${R(pos)}" y2="512" stroke="#b87adb" stroke-width="0.5" opacity="0.06"/>`);
    lines.push(`    <line x1="0" y1="${R(pos)}" x2="512" y2="${R(pos)}" stroke="#b87adb" stroke-width="0.5" opacity="0.06"/>`);
  }
  const content = `  <rect width="512" height="512" fill="#0a0a0d"/>\n${lines.join('\n')}`;
  w(`${outDir}/patterns/golden-ratio-grid.svg`, svgWrap(512, content));
}

// Hexagonal Pattern
{
  const hexLines = [];
  const sz = 34;
  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 15; col++) {
      const cx = col * sz * 1.75 + (row % 2) * sz * 0.875;
      const cy = row * sz * 1.5;
      if (cx > -sz && cx < 512 + sz && cy > -sz && cy < 512 + sz) {
        hexLines.push(`    <circle cx="${R(cx)}" cy="${R(cy)}" r="1" fill="#b87adb" opacity="0.04"/>`);
      }
    }
  }
  const content = `  <rect width="512" height="512" fill="#0a0a0d"/>\n${hexLines.join('\n')}`;
  w(`${outDir}/patterns/hexagonal-dots.svg`, svgWrap(512, content));
}

// ─── EMAIL ───

mkdirSync(`${outDir}/email`, { recursive: true });

// Email Header (600×200)
for (const v of VARIANTS) {
  const W = 600; const H = 200;
  const letterH = 80; const s = letterH / 272;
  const letterY = R((H - letterH) / 2) - 8;
  const letterX = R((W - 480 * s) / 2);
  const accentFill = v.id === 'light' ? '#0a0a0d' : v.id === 'accent' ? '#ffffff' : v.fg;
  const content = `  <rect width="${W}" height="${H}" fill="${v.bg}"/>
  <rect x="21" y="0" width="${W-42}" height="2" fill="${accentFill}" opacity="0.377"/>
  ${baz(letterX, letterY, s, v.fg, v.id)}
  <rect x="21" y="${H-2}" width="${W-42}" height="2" fill="${accentFill}" opacity="0.377"/>`;
  w(`${outDir}/email/header-${v.id}.svg`, svgWrapRect(W, H, content));
}

// Email Signature (600×120)
for (const v of VARIANTS) {
  const W = 600; const H = 120;
  const s = 0.25;
  const accentFill = v.id === 'light' ? '#0a0a0d' : v.id === 'accent' ? '#ffffff' : v.fg;
  const content = `  <rect width="${W}" height="${H}" fill="${v.bg}"/>
  <rect x="21" y="0" width="${W-42}" height="2" fill="${accentFill}" opacity="0.377"/>
  ${baz(21, 13, s, v.fg, v.id)}
  <text x="${R(21 + 480*s + 21)}" y="${R(13 + 272*s/2)}" font-family="Inter, -apple-system, sans-serif" font-size="13" fill="${v.fg}" opacity="0.55">${brand.company.name}</text>
  <text x="${R(21 + 480*s + 21)}" y="${R(13 + 272*s/2 + 18)}" font-family="Inter, -apple-system, sans-serif" font-size="11" fill="${v.fg}" opacity="0.4">${brand.company.tagline}</text>
  <rect x="21" y="${H-2}" width="${W-42}" height="2" fill="${accentFill}" opacity="0.377"/>`;
  w(`${outDir}/email/signature-${v.id}.svg`, svgWrapRect(W, H, content));
}

// ─── PRESENTATION ───

mkdirSync(`${outDir}/presentation`, { recursive: true });

// Title Slide (1920×1080)
for (const v of VARIANTS) {
  const W = 1920; const H = 1080;
  const letterH = 340; const s = letterH / 272;
  const letterY = R((H - letterH) / 2) - 40;
  const letterX = R((W - 480 * s) / 2);
  const accentFill = v.id === 'light' ? '#0a0a0d' : v.id === 'accent' ? '#ffffff' : v.fg;
  const content = `  <defs>
    <radialGradient id="pres-glow" cx="50%" cy="40%" r="45%"><stop offset="0%" stop-color="${accentFill}" stop-opacity="0.08"/><stop offset="61.8%" stop-color="${accentFill}" stop-opacity="0.02"/><stop offset="100%" stop-color="${v.bg}" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${v.bg}"/>
  <rect width="${W}" height="${H}" fill="url(#pres-glow)"/>
  <rect x="55" y="55" width="${W-110}" height="2" fill="${accentFill}" opacity="0.377"/>
  ${baz(letterX, letterY, s, v.fg, v.id)}
  <rect x="55" y="${H-55}" width="${W-110}" height="2" fill="${accentFill}" opacity="0.377"/>
  <text x="${W/2}" y="${letterY + letterH + 60}" text-anchor="middle" font-family="Inter, -apple-system, sans-serif" font-size="28" fill="${v.fg}" opacity="0.55">${brand.company.tagline}</text>`;
  w(`${outDir}/presentation/title-slide-${v.id}.svg`, svgWrapRect(W, H, content));
}

// Content Slide (1920×1080)
for (const v of VARIANTS) {
  const W = 1920; const H = 1080;
  const accentFill = v.id === 'light' ? '#0a0a0d' : v.id === 'accent' ? '#ffffff' : v.fg;
  const s = 0.2;
  const content = `  <rect width="${W}" height="${H}" fill="${v.bg}"/>
  <rect x="55" y="55" width="${W-110}" height="2" fill="${accentFill}" opacity="0.377"/>
  ${baz(55, 55, s, v.fg, v.id)}
  <rect x="55" y="${H-55}" width="${W-110}" height="2" fill="${accentFill}" opacity="0.377"/>`;
  w(`${outDir}/presentation/content-slide-${v.id}.svg`, svgWrapRect(W, H, content));
}

// ─── BUSINESS CARD ───

mkdirSync(`${outDir}/print`, { recursive: true });

// Business Card (3.5×2 inches = 1050×600 at 300dpi)
for (const v of VARIANTS) {
  const W = 1050; const H = 600;
  const s = 0.35;
  const accentFill = v.id === 'light' ? '#0a0a0d' : v.id === 'accent' ? '#ffffff' : v.fg;
  const content = `  <rect width="${W}" height="${H}" rx="8" fill="${v.bg}"/>
  <rect x="55" y="55" width="${W-110}" height="2" fill="${accentFill}" opacity="0.377"/>
  ${baz(55, 160, s, v.fg, v.id)}
  <text x="${W-55}" y="${H-120}" text-anchor="end" font-family="Inter, -apple-system, sans-serif" font-size="18" fill="${v.fg}" opacity="0.55">${brand.company.name}</text>
  <text x="${W-55}" y="${H-95}" text-anchor="end" font-family="Inter, -apple-system, sans-serif" font-size="14" fill="${v.fg}" opacity="0.4">${brand.company.tagline}</text>
  <rect x="55" y="${H-55}" width="${W-110}" height="2" fill="${accentFill}" opacity="0.377"/>`;
  w(`${outDir}/print/business-card-${v.id}.svg`, svgWrapRect(W, H, content));
}

// Letterhead (8.5×11 = 2550×3300 at 300dpi)
for (const v of VARIANTS) {
  const W = 2550; const H = 3300;
  const s = 0.25;
  const accentFill = v.id === 'light' ? '#0a0a0d' : v.id === 'accent' ? '#ffffff' : v.fg;
  const content = `  <rect width="${W}" height="${H}" fill="${v.bg}"/>
  <rect x="89" y="89" width="${W-178}" height="2" fill="${accentFill}" opacity="0.377"/>
  ${baz(89, 144, s, v.fg, v.id)}
  <rect x="89" y="${H-89}" width="${W-178}" height="2" fill="${accentFill}" opacity="0.377"/>`;
  w(`${outDir}/print/letterhead-${v.id}.svg`, svgWrapRect(W, H, content));
}

// ─── MANIFEST ───

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
  variants: VARIANTS.map(v => ({ id: v.id, label: v.id.charAt(0).toUpperCase() + v.id.slice(1), fg: v.fg, bg: v.bg })),
  categories: [
    { id: 'logos', label: 'Logos', assets: ['logo-full-{variant}-{size}', 'logo-icon-{variant}-{size}', 'logo-horizontal-dark'] },
    { id: 'social', label: 'Social Media', assets: ['og-image-{variant}', 'twitter-banner-{variant}', 'linkedin-banner-{variant}', 'facebook-cover-{variant}', 'youtube-banner-{variant}'] },
    { id: 'app-icons', label: 'App Icons', assets: ['ios-{variant}-{size}', 'android-{variant}-{size}', 'favicon-{variant}-32'] },
    { id: 'textures', label: 'Textures', assets: ['dot-grid-{variant}', 'shimmer-{variant}', 'noise-{variant}', 'watermark-{variant}', 'gradient-mesh'] },
    { id: 'patterns', label: 'Patterns', assets: ['fibonacci-spiral', 'golden-ratio-grid', 'hexagonal-dots'] },
    { id: 'email', label: 'Email', assets: ['header-{variant}', 'signature-{variant}'] },
    { id: 'presentation', label: 'Presentation', assets: ['title-slide-{variant}', 'content-slide-{variant}'] },
    { id: 'print', label: 'Print', assets: ['business-card-{variant}', 'letterhead-{variant}'] },
  ],
  designSystem: 'Æther Fibonacci × Da Vinci × Material 3',
  version: '1.0.0',
  generatedAt: new Date().toISOString(),
};

writeFileSync(`${outDir}/manifest.json`, JSON.stringify(manifest, null, 2));

console.log(`\n✓ Generated ${total} brand assets`);
console.log(`  Categories: logos, social, app-icons, textures, patterns, email, presentation, print`);
console.log(`  Variants: dark, light, mono, accent`);
console.log(`  Manifest: ${outDir}/manifest.json`);
