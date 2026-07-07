// Server-only theme loader — reads the active theme from the settings DB.
// Imported only by server components (ThemeProvider, settings page server actions).
import { db } from "./db";
import { ThemeId, DEFAULT_THEME, THEMES } from "./themes";

export type UserMode = "light" | "dark" | "auto";

const THEME_KEYS = ["aether", "hub", "noira-dark", "noira-light", "noira-amoled", "agency-light"] as const;

export async function loadThemeFromSettings(): Promise<{ theme: ThemeId; mode: UserMode }> {
  try {
    const rows = db
      .prepare("SELECT key, value FROM settings WHERE key IN ('theme', 'theme_mode')")
      .all() as Record<string, unknown>[];
    const map: Record<string, string> = {};
    for (const r of rows) map[r.key] = r.value;
    const theme = (THEME_KEYS as readonly string[]).includes(map.theme)
      ? (map.theme as ThemeId)
      : DEFAULT_THEME;
    const _mode: UserMode =
      map.theme_mode === "light" || map.theme_mode === "dark" || map.theme_mode === "auto"
        ? map.theme_mode
        : "auto";
    return { theme, mode };
  } catch {
    return { theme: DEFAULT_THEME, mode: "auto" };
  }
}

export async function loadActiveTheme(): Promise<ThemeId> {
  const { theme } = await loadThemeFromSettings();
  return theme;
}

export async function loadActiveMode(): Promise<UserMode> {
  const { mode } = await loadThemeFromSettings();
  return mode;
}

export function clearThemeCache() {
  // Reserved for future in-memory caching layer.
}
