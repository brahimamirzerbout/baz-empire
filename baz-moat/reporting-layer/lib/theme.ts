/**
 * Midnight Terminal — BAZ brand tokens.
 * Canonical spec. Dark mode only. Square corners (rounded-full only for pills/badges).
 * Fonts: Inter (ui/body), JetBrains Mono (metrics/tags/code).
 * Motion <= 200ms, fade-in-up only, reduced-motion aware.
 */

export const theme = {
  color: {
    bg: "#020617", // deep midnight
    surface: "#0B1120",
    border: "rgba(255,255,255,0.10)",
    accent: "#22D3EE", // signal — CTAs, key metrics
    depth: "#818CF8", // secondary
    text: "#F8FAFC",
    textMuted: "#94A3B8",
    success: "#10B981", // metrics only, sparingly
    danger: "#F43F5E",
    warn: "#F59E0B",
  },
  font: {
    ui: "var(--font-inter)",
    mono: "var(--font-jetbrains)",
  },
  radius: {
    none: "0px", // square corners — default
    pill: "9999px", // badges/pills only
  },
  motion: {
    fast: "150ms",
    base: "200ms", // <=200ms ceiling
  },
} as const;

/** Inline style objects (server-component safe — no CSS-in-JS runtime). */
export const styles = {
  root: {
    backgroundColor: theme.color.bg,
    color: theme.color.text,
    fontFamily: theme.font.ui,
    minHeight: "100vh",
  } as const,
  surface: {
    backgroundColor: theme.color.surface,
    border: `1px solid ${theme.color.border}`,
  } as const,
} as const;