// Server-side font system. Re-exports the client-safe API from
// fonts-shared.ts and adds the DB-backed loader for server components.
export * from "./fonts-shared";
export type { FontRole, FontSettings } from "./fonts-shared";

import { DEFAULT_FONT_SETTINGS, FontSettings } from "./fonts-shared";

let cached: { settings: FontSettings; loadedAt: number } | null = null;
const CACHE_MS = 30_000;

export async function loadFontSettings(): Promise<FontSettings> {
  if (cached && Date.now() - cached.loadedAt < CACHE_MS) return cached.settings;
  try {
    // Dynamic import keeps the DB out of client bundles.
    const { db } = await import("./db");
    const rows = db
      .prepare("SELECT key, value FROM settings WHERE key LIKE 'font_%'")
      .all() as Record<string, unknown>[];
    if (!rows.length) {
      cached = { settings: DEFAULT_FONT_SETTINGS, loadedAt: Date.now() };
      return DEFAULT_FONT_SETTINGS;
    }
    const out: Record<string, unknown> = { ...DEFAULT_FONT_SETTINGS };
    for (const r of rows) {
      const key = r.key.replace(/^font_/, "");
      if (key === "web") {
        try {
          out.web = JSON.parse(r.value);
        } catch {
          /* ignore */
        }
      } else {
        out[key] = r.value;
      }
    }
    cached = { settings: out as FontSettings, loadedAt: Date.now() };
    return cached.settings;
  } catch {
    return DEFAULT_FONT_SETTINGS;
  }
}

export function clearFontCache() {
  cached = null;
}
