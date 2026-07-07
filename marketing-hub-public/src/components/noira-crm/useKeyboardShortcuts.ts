import { useEffect } from "react";

export type ShortcutMap = Record<string, (e: KeyboardEvent) => void>;

/**
 * useKeyboardShortcuts - global keyboard shortcut handler.
 * Pass a map like { "mod+k": () => openSearch() }
 * - `mod` resolves to ⌘ on macOS, Ctrl elsewhere
 * - Sequence strings like "g h" are supported (for go-home, etc.)
 */
export function useKeyboardShortcuts(shortcuts: ShortcutMap, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

    const handler = (e: KeyboardEvent) => {
      // Don't trigger while typing in inputs (unless modifier is held)
      const target = e.target as HTMLElement | null;
      const isTextInput =
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);

      const parts: string[] = [];
      if (e.metaKey || e.ctrlKey) parts.push("mod");
      if (e.shiftKey) parts.push("shift");
      if (e.altKey) parts.push("alt");

      const key = e.key.toLowerCase();
      if (!["control", "meta", "shift", "alt"].includes(key)) {
        parts.push(key);
      }
      const combo = parts.join("+");

      const fn = shortcuts[combo];
      if (fn) {
        if (!isTextInput || e.metaKey || e.ctrlKey) {
          e.preventDefault();
          fn(e);
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shortcuts, enabled]);
}

/** Utility for displaying shortcut hints */
export const shortcutLabel = (combo: string): string => {
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
  return combo
    .replace("mod", isMac ? "⌘" : "Ctrl")
    .replace("shift", "⇧")
    .replace("alt", "⌥")
    .split("+")
    .map((s) => (s.length === 1 ? s.toUpperCase() : s))
    .join("+");
};
