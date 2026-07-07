// Theme system for the Marketing Hub — v3.0 production-grade.
//
// Five themes:
//   - "hub"         — default brand-purple light theme
//   - "noira-dark"  — Noira dark (orange brand, true dark)
//   - "noira-light" — Noira light variant
//   - "noira-amoled"— pure-black AMOLED variant
//   - "agency-light"— Marketing Agency (navy blue, Roboto)
//
// Each theme defines a COMPLETE set of CSS variables — every token the
// design system uses. This eliminates the problem where dark themes got
// a mix of theme-specific values and generic .dark fallbacks.

export type ThemeId = "aether" | "hub" | "noira-dark" | "noira-light" | "noira-amoled" | "agency-light";

export interface ThemeDef {
  id: ThemeId;
  label: string;
  description: string;
  mode: "light" | "dark";
  brand: string;
  /** Secondary brand for gradients — auto-derived if not set. */
  brandSecondary?: string;
  ambient?: string;
  /** Complete CSS variable set — injected via ThemeStyleProvider. */
  vars: Record<string, string>;
}

// Helper: derive a full variable set from core tokens.
// This ensures every theme has ALL the tokens the design system needs.
function buildVars(core: {
  bg: string;
  surface: string;
  surface2: string;
  surface3: string;
  border: string;
  borderStrong: string;
  text: string;
  textSecondary: string;
  muted: string;
  hover: string;
  hoverStrong: string;
  selected: string;
  glassBg: string;
  glassBorder: string;
  shadowColor: string;
  shadowOpacity: { sm: number; md: number; lg: number; xl: number };
  gridColor?: string;
  gridFade?: string;
}): Record<string, string> {
  const v: Record<string, string> = {
    "--bg": core.bg,
    "--surface": core.surface,
    "--surface-2": core.surface2,
    "--surface-3": core.surface3,
    "--border": core.border,
    "--border-strong": core.borderStrong,
    "--text": core.text,
    "--text-secondary": core.textSecondary,
    "--muted": core.muted,
    "--hover": core.hover,
    "--hover-strong": core.hoverStrong,
    "--selected": core.selected,
    "--glass-bg": core.glassBg,
    "--glass-border": core.glassBorder,
    "--glass-blur": "8px",
    // Shadows use the theme's shadow color with increasing opacity
    "--shadow-sm": `0 1px 2px 0 rgba(${core.shadowColor}, ${core.shadowOpacity.sm})`,
    "--shadow-md": `0 4px 12px -2px rgba(${core.shadowColor}, ${core.shadowOpacity.md}), 0 2px 4px -1px rgba(${core.shadowColor}, ${core.shadowOpacity.sm})`,
    "--shadow-lg": `0 12px 32px -8px rgba(${core.shadowColor}, ${core.shadowOpacity.lg}), 0 4px 12px -4px rgba(${core.shadowColor}, ${core.shadowOpacity.md})`,
    "--shadow-xl": `0 24px 56px -12px rgba(${core.shadowColor}, ${core.shadowOpacity.xl}), 0 8px 24px -8px rgba(${core.shadowColor}, ${core.shadowOpacity.lg})`,
  };
  if (core.gridColor) v["--grid-color"] = core.gridColor;
  if (core.gridFade) v["--grid-fade"] = core.gridFade;
  return v;
}

// ═══ ÆTHER Theme — Pure monochrome, no accent ═══════════════════════════
// The foundation. No color injected. Structure speaks for itself.
// Values derived from Fibonacci × Da Vinci darkness layers (hue 260°).
const AETHER: ThemeDef = {
  id: "aether",
  label: "ÆTHER Monochrome",
  description: "Dark · pure monochrome · no accent — structure only",
  mode: "dark",
  brand: "var(--color-primary)",
  brandSecondary: "var(--color-primary-50)",
  vars: buildVars({
    bg: "9 9 11",              /* L0 The Void    hsl(260,14%,3.9%)  */
    surface: "32 30 37",       /* L3 The Surface hsl(260,11%,13%)  */
    surface2: "22 20 26",      /* L2 The Shadow  hsl(260,12%,9%)   */
    surface3: "44 41 50",      /* L4 The Raised  hsl(260,10%,18%)  */
    border: "74 69 84",        /* Fibonacci hairline @ 0.089 opacity */
    borderStrong: "74 69 84", /* Fibonacci hairline @ 0.233 opacity */
    text: "250 249 250",       /* text-primary  hsl(260,8%,98%)  */
    textSecondary: "164 160 171", /* text-secondary hsl(260,6%,65%) */
    muted: "112 108 122",      /* text-tertiary hsl(260,6%,45%)  */
    hover: "59 54 69",         /* L5 The Hover  hsl(262,12%,24%)  */
    hoverStrong: "79 69 94",  /* L6 The Focus  hsl(264,15%,32%)  */
    selected: "59 54 69",      /* L5 */
    glassBg: "hsla(260, 12%, 20%, 0.55)", /* translucent — NOT 0.92 */
    glassBorder: "hsla(260, 10%, 30%, 0.089)",
    shadowColor: "0 0 0",
    shadowOpacity: { sm: 0.377, md: 0.377, lg: 0.377, xl: 0.377 },
    gridColor: "74 69 84",
    gridFade: "0.5",
  }),
};

// ─── Theme: Hub Default (ÆTHER dark + purple accent) ───────────────────
// Fibonacci darkness layers + purple brand accent (golden-angle 270°).
const HUB: ThemeDef = {
  id: "hub",
  label: "Hub Default",
  description: "Dark · ÆTHER Fibonacci base · purple accent · Inter",
  mode: "dark",
  brand: "var(--accent)",
  brandSecondary: "var(--accent-secondary)",
  vars: buildVars({
    bg: "9 9 11",              /* L0 The Void    hsl(260,14%,3.9%)  */
    surface: "32 30 37",       /* L3 The Surface hsl(260,11%,13%)  */
    surface2: "22 20 26",      /* L2 The Shadow  hsl(260,12%,9%)   */
    surface3: "44 41 50",      /* L4 The Raised  hsl(260,10%,18%)  */
    border: "74 69 84",        /* Fibonacci hairline */
    borderStrong: "74 69 84",
    text: "250 249 250",       /* text-primary  */
    textSecondary: "164 160 171", /* text-secondary */
    muted: "112 108 122",      /* text-tertiary */
    hover: "59 54 69",         /* L5 The Hover  */
    hoverStrong: "79 69 94",  /* L6 The Focus  */
    selected: "59 54 69",      /* L5 */
    glassBg: "hsla(260, 12%, 20%, 0.55)", /* translucent */
    glassBorder: "hsla(260, 10%, 30%, 0.089)",
    shadowColor: "0 0 0",
    shadowOpacity: { sm: 0.377, md: 0.377, lg: 0.377, xl: 0.377 },
  }),
};

// ─── Theme: Violet Dark (ÆTHER dark + orange accent) ──────────────────────
const NOIRA_DARK: ThemeDef = {
  id: "noira-dark",
  label: "Violet Dark",
  description: "Dark · ÆTHER base · orange accent · Inter",
  mode: "dark",
  brand: "var(--accent)",
  brandSecondary: "#a78bfa",
  vars: buildVars({
    bg: "9 9 11",
    surface: "32 30 37",
    surface2: "22 20 26",
    surface3: "44 41 50",
    border: "74 69 84",
    borderStrong: "74 69 84",
    text: "250 249 250",
    textSecondary: "164 160 171",
    muted: "112 108 122",
    hover: "59 54 69",
    hoverStrong: "79 69 94",
    selected: "59 54 69",
    glassBg: "hsla(260, 12%, 20%, 0.55)",
    glassBorder: "hsla(260, 10%, 30%, 0.089)",
    shadowColor: "0 0 0",
    shadowOpacity: { sm: 0.377, md: 0.377, lg: 0.377, xl: 0.377 },
    gridColor: "74 69 84",
    gridFade: "0.5",
  }),
};

// ─── Theme: Violet Light (ÆTHER light + orange accent) ─────────────────────
const NOIRA_LIGHT: ThemeDef = {
  id: "noira-light",
  label: "Violet Dark",
  description: "Light · ÆTHER base · orange accent · Inter",
  mode: "light",
  brand: "var(--accent)",
  brandSecondary: "#a78bfa",
  vars: buildVars({
    bg: "248 248 248",
    surface: "252 252 252",
    surface2: "240 240 240",
    surface3: "230 230 230",
    border: "226 226 226",
    borderStrong: "204 204 204",
    text: "10 10 10",
    textSecondary: "68 68 68",
    muted: "102 102 102",
    hover: "238 238 238",
    hoverStrong: "224 224 224",
    selected: "238 238 238",
    glassBg: "rgba(255, 255, 255, 0.92)",
    glassBorder: "rgba(0, 0, 0, 0.06)",
    shadowColor: "0 0 0",
    shadowOpacity: { sm: 0.06, md: 0.08, lg: 0.1, xl: 0.12 },
    gridColor: "226 226 226",
    gridFade: "0.7",
  }),
};

// ─── Theme: Violet AMOLED (ÆTHER pure black + orange accent) ───────────────
const NOIRA_AMOLED: ThemeDef = {
  id: "noira-amoled",
  label: "Violet AMOLED",
  description: "Dark · pure black · ÆTHER base · orange accent",
  mode: "dark",
  brand: "var(--accent)",
  brandSecondary: "#a78bfa",
  vars: buildVars({
    bg: "0 0 0",
    surface: "22 20 26",
    surface2: "16 14 19",
    surface3: "32 30 37",
    border: "74 69 84",
    borderStrong: "74 69 84",
    text: "250 249 250",
    textSecondary: "164 160 171",
    muted: "112 108 122",
    hover: "22 20 26",
    hoverStrong: "44 41 50",
    selected: "22 20 26",
    glassBg: "hsla(260, 12%, 15%, 0.55)",
    glassBorder: "hsla(260, 10%, 25%, 0.089)",
    shadowColor: "0 0 0",
    shadowOpacity: { sm: 0.377, md: 0.377, lg: 0.377, xl: 0.377 },
    gridColor: "74 69 84",
    gridFade: "0.4",
  }),
};

// ─── Theme: Marketing Agency (ÆTHER light + navy accent) ──────────────────
const AGENCY_LIGHT: ThemeDef = {
  id: "agency-light",
  label: "Marketing Agency Dark",
  description: "Light · ÆTHER base · navy accent",
  mode: "light",
  brand: "#1A2C6A",
  brandSecondary: "#F9A11E",
  vars: buildVars({
    bg: "248 248 248",
    surface: "252 252 252",
    surface2: "240 240 240",
    surface3: "230 230 230",
    border: "226 226 226",
    borderStrong: "204 204 204",
    text: "10 10 10",
    textSecondary: "68 68 68",
    muted: "102 102 102",
    hover: "238 238 238",
    hoverStrong: "224 224 224",
    selected: "238 238 238",
    glassBg: "rgba(255, 255, 255, 0.92)",
    glassBorder: "rgba(0, 0, 0, 0.06)",
    shadowColor: "0 0 0",
    shadowOpacity: { sm: 0.06, md: 0.08, lg: 0.1, xl: 0.12 },
  }),
};

export const THEMES: Record<ThemeId, ThemeDef> = {
  aether: AETHER,
  hub: HUB,
  "noira-dark": NOIRA_DARK,
  "noira-light": NOIRA_LIGHT,
  "noira-amoled": NOIRA_AMOLED,
  "agency-light": AGENCY_LIGHT,
};

export const THEME_LIST = Object.values(THEMES);

export const DEFAULT_THEME: ThemeId = "hub";

export function themeClass(theme: ThemeId): string {
  const def = THEMES[theme];
  return def.mode === "dark" ? "dark" : "";
}

export function modeClass(themeId: ThemeId, userMode: "light" | "dark" | "auto"): string {
  const def = THEMES[themeId];
  if (userMode === "auto") return def.mode === "dark" ? "dark" : "";
  return userMode === "dark" ? "dark" : "";
}

// Build the CSS style block for a theme.
// Variables are injected on BOTH :root and .dark (or :root only for light themes)
// so there's never a conflict between theme values and the generic .dark fallback.
export function themeStyleBlock(themeId: ThemeId): string {
  const def = THEMES[themeId];
  const cssVars = Object.entries(def.vars)
    .map(([k, v]) => `${k}: ${v};`)
    .join(" ");

  const brand = def.brand;
  const brandSec = def.brandSecondary || "#ec4899";
  const brandRgb = hexToRgbTriplet(brand);
  const brandSecRgb = hexToRgbTriplet(brandSec);

  const seedHue = "var(--seed-hue)";
  const seedSat = "var(--seed-sat)";
  const seedLum = "var(--seed-lum)";

  const brandLine = [
    `--accent: hsl(${seedHue}, ${seedSat}, ${seedLum});`,
    `--accent-soft: hsla(${seedHue}, ${seedSat}, ${seedLum}, 0.08);`,
    `--accent-glow: hsla(${seedHue}, ${seedSat}, ${seedLum}, 0.25);`,
    `--accent-text: var(--seed-accent-text, #ffffff);`,
    `--theme-brand: hsl(${seedHue}, ${seedSat}, ${seedLum});`,
    `--theme-brand-glow: hsla(${seedHue}, ${seedSat}, ${seedLum}, 0.18);`,
    `--theme-brand-soft: hsla(${seedHue}, ${seedSat}, ${seedLum}, 0.08);`,
    `--theme-brand-rgb: var(--seed-rgb-triplet, ${brandRgb});`,
    `--theme-brand-secondary: hsl(calc(${seedHue} + 30), ${seedSat}, 55%);`,
    `--theme-brand-secondary-rgb: var(--seed-rgb-triplet-secondary, ${brandSecRgb});`,
  ].join(" ");

  const gradientMesh = `--gradient-mesh: radial-gradient(circle at 20% 10%, hsla(${seedHue}, ${seedSat}, ${seedLum}, 0.04), transparent 40%), radial-gradient(circle at 80% 80%, hsla(calc(${seedHue} + 30), ${seedSat}, 55%, 0.03), transparent 40%), radial-gradient(circle at 50% 50%, hsla(${seedHue}, ${seedSat}, ${seedLum}, 0.02), transparent 60%);`;

  const tagLine = [
    `--theme-tag-bg: hsla(${seedHue}, ${seedSat}, ${seedLum}, 0.1);`,
    `--theme-tag-text: hsl(${seedHue}, ${seedSat}, ${seedLum});`,
    `--theme-selection: hsla(${seedHue}, ${seedSat}, ${seedLum}, 0.25);`,
  ].join(" ");

  const bRgb = "var(--theme-brand-rgb)";
  const accent = "var(--accent)";

  const brandOverride = `
    .btn-primary { background: ${accent}; color: white; }
    .btn-primary:hover { filter: brightness(1.08); }
    .bg-brand-50 { background-color: rgba(${bRgb}, 0.08); }
    .bg-brand-100 { background-color: rgba(${bRgb}, 0.14); }
    .bg-brand-500 { background-color: var(--theme-brand); }
    .bg-brand-600 { background-color: var(--theme-brand); filter: brightness(0.92); }
    .bg-brand-700 { background-color: var(--theme-brand); filter: brightness(0.82); }
    .text-brand-500 { color: ${accent}; }
    .text-brand-600 { color: ${accent}; }
    .text-brand-700 { color: ${accent}; filter: brightness(0.85); }
    .border-brand-300 { border-color: rgba(${bRgb}, 0.35); }
    .border-brand-500 { border-color: ${accent}; }
    .ring-brand-100 { --tw-ring-color: rgba(${bRgb}, 0.2); }
    .ring-brand-200\\/50 { --tw-ring-color: rgba(${bRgb}, 0.18); }
    .shadow-brand-500\\/25 { box-shadow: 0 10px 30px -10px rgba(${bRgb}, 0.45); }
    .shadow-brand-500\\/20 { box-shadow: 0 8px 24px -8px rgba(${bRgb}, 0.35); }
    .shadow-brand-500\\/30 { box-shadow: 0 12px 36px -10px rgba(${bRgb}, 0.5); }
    .from-brand-500 { --tw-gradient-from: var(--theme-brand); }
    .to-brand-700 { --tw-gradient-to: var(--theme-brand); }
    .from-violet-500 { --tw-gradient-from: var(--theme-brand); }
    .to-rose-500 { --tw-gradient-to: var(--theme-brand-secondary); }
    .to-purple-600 { --tw-gradient-to: var(--theme-brand); filter: brightness(0.85); }
    .to-purple-700 { --tw-gradient-to: var(--theme-brand); filter: brightness(0.75); }
    .from-emerald-500 { --tw-gradient-from: #16a34a; }
    .to-green-600 { --tw-gradient-to: #16a34a; filter: brightness(0.9); }
    .from-orange-500 { --tw-gradient-from: var(--theme-brand); }
    .to-rose-400 { --tw-gradient-to: var(--theme-brand-secondary); filter: brightness(1.1); }
    .from-violet-400 { --tw-gradient-from: var(--theme-brand); filter: brightness(1.15); }
    .hover\\:from-violet-400:hover { --tw-gradient-from: var(--theme-brand); filter: brightness(1.15); }
    .hover\\:to-rose-400:hover { --tw-gradient-to: var(--theme-brand-secondary); filter: brightness(1.1); }
    .shadow-orange-500\\/20 { box-shadow: 0 8px 24px -8px rgba(${bRgb}, 0.3); }
    .shadow-violet-500\\/20 { box-shadow: 0 8px 24px -8px rgba(${bRgb}, 0.3); }
    .from-violet-500\\/15 { --tw-gradient-from: rgba(${bRgb}, 0.15); }
    .to-rose-500\\/15 { --tw-gradient-to: rgba(var(--theme-brand-secondary-rgb), 0.15); }
    .shadow-violet-500\\/25 { box-shadow: 0 10px 30px -10px rgba(${bRgb}, 0.35); }
    .shadow-violet-500\\/30 { box-shadow: 0 12px 36px -10px rgba(${bRgb}, 0.4); }
    .text-violet-700 { color: ${accent}; }
    .text-violet-300 { color: rgba(${bRgb}, 0.8); }
    .border-violet-200 { border-color: rgba(${bRgb}, 0.25); }
    .bg-violet-100 { background-color: rgba(${bRgb}, 0.12); }
    .text-violet-600 { color: ${accent}; }
    .bg-violet-50 { background-color: rgba(${bRgb}, 0.06); }
    .ring-violet-200\\/50 { --tw-ring-color: rgba(${bRgb}, 0.18); }
  `;

  // For dark themes, inject on .dark selector (which is on <html>)
  // For light themes, inject on :root
  // For both, also inject on :root so the variables are always available
  // (the .dark class has higher specificity so dark values win when present)
  const selector = def.mode === "dark" ? "html.dark, :root" : ":root";

  return `${selector} { ${cssVars} ${brandLine} ${gradientMesh} ${tagLine} }\n${brandOverride}`;
}

export function hexToRgbTriplet(hex: string): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

export function hexToRgba(hex: string, alpha: number): string {
  if (hex === "transparent") return "transparent";
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function isDark(hex: string): boolean {
  if (hex === "transparent") return true;
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}
