// Server component. Injects the active theme's CSS variables + brand
// color overrides + ambient background gradient. Called by the root
// layout which already determined the active theme from settings.
import { ThemeId, themeStyleBlock, THEMES } from "@/lib/themes";

export function ThemeStyleProvider({ theme }: { theme: ThemeId }) {
  const style = themeStyleBlock(theme);
  const def = THEMES[theme];
  const ambient = def.ambient || null;
  return (
    <>
      {ambient ? (
        <style dangerouslySetInnerHTML={{ __html: `:root { --theme-ambient: ${ambient}; }` }} />
      ) : null}
      <style dangerouslySetInnerHTML={{ __html: style }} />
    </>
  );
}
