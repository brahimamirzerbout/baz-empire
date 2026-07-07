// Client-safe font system: types, presets, default stacks.
// No DB imports here — safe to import from "use client" components.

export const FONT_ROLES = ["sans", "body", "mono"] as const;
export type FontRole = (typeof FONT_ROLES)[number];

export const FONT_PRESETS: Record<
  string,
  {
    label: string;
    sans: string;
    body: string;
    mono: string;
    web?: { family: string; weights?: number[] };
  }
> = {
  gnome: {
    label: "GNOME default (Inter / Cantarell / Hack)",
    sans: "Inter",
    body: "Cantarell",
    mono: "Hack",
    web: { family: "Inter:wght@400;500;600;700", weights: [400, 500, 600, 700] },
  },
  modern: {
    label: "Modern (Inter / Inter / JetBrains Mono)",
    sans: "Inter",
    body: "Inter",
    mono: "JetBrains Mono",
    web: {
      family: "Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500",
      weights: [400, 500],
    },
  },
  system: {
    label: "System (no web fonts)",
    sans: "system-ui",
    body: "system-ui",
    mono: "ui-monospace",
  },
  editorial: {
    label: "Editorial (Inter / Lora / Source Code Pro)",
    sans: "Inter",
    body: "Lora",
    mono: "Source Code Pro",
    web: {
      family:
        "Inter:wght@400;500;600;700&family=Lora:wght@400;500;600&family=Source+Code+Pro:wght@400;500",
      weights: [400, 500, 600, 700],
    },
  },
  minimal: {
    label: "Minimal (IBM Plex Sans / IBM Plex Sans / IBM Plex Mono)",
    sans: "IBM Plex Sans",
    body: "IBM Plex Sans",
    mono: "IBM Plex Mono",
    web: {
      family: "IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500",
      weights: [400, 500, 600, 700],
    },
  },
};

export type FontSettings = {
  preset: string;
  sans: string;
  body: string;
  mono: string;
  web?: { family: string; weights?: number[] };
};

export const DEFAULT_FONT_SETTINGS: FontSettings = {
  preset: "gnome",
  ...FONT_PRESETS.gnome,
} as FontSettings;

export function fontStack(role: FontRole, settings: FontSettings = DEFAULT_FONT_SETTINGS): string {
  const font = settings[role] || DEFAULT_FONT_SETTINGS[role];
  switch (role) {
    case "sans":
      return `${font}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ui-sans-serif, system-ui, sans-serif`;
    case "body":
      return `${font}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ui-sans-serif, system-ui, sans-serif`;
    case "mono":
      return `${font}, ui-monospace, SFMono-Regular, "JetBrains Mono", "Cascadia Code", Consolas, monospace`;
  }
}

export function googleFontsUrl(settings: FontSettings = DEFAULT_FONT_SETTINGS): string {
  // If the settings object has a stored web bundle (from the preset), use it.
  // Otherwise fall back to the preset's web bundle.
  const fromStored = (settings as Record<string, unknown>).web as { family?: string } | undefined;
  if (fromStored?.family) {
    return `https://fonts.googleapis.com/css2?family=${fromStored.family}&display=swap`;
  }
  const preset = FONT_PRESETS[settings.preset];
  if (!preset?.web) return "";
  return `https://fonts.googleapis.com/css2?family=${preset.web.family}&display=swap`;
}

export function exportStyleBlock(settings: FontSettings = DEFAULT_FONT_SETTINGS): string {
  const url = googleFontsUrl(settings);
  const importLine = url ? `@import url('${url}');` : "";
  return `<style>
${importLine}
:root {
  --font-sans: ${fontStack("sans", settings)};
  --font-body: ${fontStack("body", settings)};
  --font-mono: ${fontStack("mono", settings)};
}
body { font-family: var(--font-body); }
h1, h2, h3, h4, h5, h6, .font-sans { font-family: var(--font-sans); }
code, pre, .font-mono { font-family: var(--font-mono); }
</style>`;
}
