import { loadFontSettings, fontStack } from "@/lib/fonts";

// Server component — injects CSS variables for font roles.
// Google Fonts <link> is intentionally omitted to avoid blocking SSR
// when there's no internet access. System font fallbacks in globals.css
// (Inter, Cantarell, system-ui) handle rendering gracefully.
export async function FontProvider() {
  try {
    const settings = await loadFontSettings();
    const styleVars = [
      `--font-sans: ${fontStack("sans", settings)};`,
      `--font-body: ${fontStack("body", settings)};`,
      `--font-mono: ${fontStack("mono", settings)};`,
    ].join(" ");
    return (
      <style
        dangerouslySetInnerHTML={{
          __html: `:root { ${styleVars} }`,
        }}
      />
    );
  } catch {
    // Fallback to defaults if settings can't be loaded
    return null;
  }
}