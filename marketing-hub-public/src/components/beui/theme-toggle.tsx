"use client";

import { Moon, Sun } from "lucide-react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useEffect, useState, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/beui/utils";

/**
 * ThemeToggle — beUI-inspired theme toggle with View Transition API.
 *
 * Adapted to Marketing Hub's existing theme system:
 *   - Reads mode from <html class="dark"> (set by our RootLayout)
 *   - Toggles between dark/light by toggling the class on <html>
 *   - Persists via POST /api/settings/theme (same backend our settings use)
 *   - Uses View Transition API when available (Chrome / Edge),
 *     falls back to a plain class swap (Firefox / Safari)
 *
 * If you change the variant or start, the reveal animation adapts.
 * Three variants:
 *   - "rectangle"  : a clean clip-path reveal from a corner or edge
 *   - "circle"     : a circle expanding from the button
 *   - "circle-blur": same, with a blur for extra smoothness
 */

export type ThemeVariant = "rectangle" | "circle" | "circle-blur";

export type RectStart =
  "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center" | "bottom-up";

export interface ThemeToggleProps extends Omit<
  ComponentPropsWithoutRef<"button">,
  "children" | "onClick"
> {
  variant?: ThemeVariant;
  start?: RectStart;
  iconClassName?: string;
}

const VT_STYLE_ID = "mh-theme-vt";

const VT_CSS = `
html[data-mh-vt="rect"]::view-transition-old(root) {
  animation: none;
  mix-blend-mode: normal;
}
html[data-mh-vt="rect"]::view-transition-new(root) {
  mix-blend-mode: normal;
  animation: mh-rect-reveal 380ms ease-out;
}
html[data-mh-vt="circle"]::view-transition-old(root),
html[data-mh-vt="circle-blur"]::view-transition-old(root) {
  animation: none;
  mix-blend-mode: normal;
}
html[data-mh-vt="circle"]::view-transition-new(root) {
  mix-blend-mode: normal;
  animation: mh-circle-reveal 650ms cubic-bezier(0.4, 0, 0.2, 1);
}
html[data-mh-vt="circle-blur"]::view-transition-new(root) {
  mix-blend-mode: normal;
  animation: mh-circle-blur-reveal 650ms cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes mh-rect-reveal {
  from { clip-path: var(--mh-vt-from, inset(100% 0 0 0)); }
  to   { clip-path: inset(0 0 0 0); }
}
@keyframes mh-circle-reveal {
  from { clip-path: circle(0% at var(--mh-vt-origin, 50% 100%)); }
  to   { clip-path: circle(150% at var(--mh-vt-origin, 50% 100%)); }
}
@keyframes mh-circle-blur-reveal {
  from { clip-path: circle(0% at var(--mh-vt-origin, 50% 100%)); filter: blur(8px); }
  to   { clip-path: circle(150% at var(--mh-vt-origin, 50% 100%)); filter: blur(0px); }
}
@media (prefers-reduced-motion: reduce) {
  html[data-mh-vt]::view-transition-new(root) { animation: none; }
}
`;

const RECT_FROM: Record<RectStart, string> = {
  "top-left": "inset(0 100% 100% 0)",
  "top-right": "inset(0 0 100% 100%)",
  "bottom-left": "inset(100% 100% 0 0)",
  "bottom-right": "inset(100% 0 0 100%)",
  center: "inset(50% 50% 50% 50%)",
  "bottom-up": "inset(100% 0 0 0)",
};

const CIRCLE_ORIGIN: Record<RectStart, string> = {
  "top-left": "0% 0%",
  "top-right": "100% 0%",
  "bottom-left": "0% 100%",
  "bottom-right": "100% 100%",
  center: "50% 50%",
  "bottom-up": "50% 100%",
};

function isDarkNow(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

function setModeClass(mode: "light" | "dark") {
  const root = document.documentElement;
  if (mode === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function useThemeToggle(opts: { variant?: ThemeVariant; start?: RectStart } = {}) {
  const { variant = "circle-blur", start = "bottom-up" } = opts;
  const reduce = useReducedMotion() ?? false;
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(isDarkNow());
  }, []);

  // Inject the CSS once
  useEffect(() => {
    if (document.getElementById(VT_STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = VT_STYLE_ID;
    el.textContent = VT_CSS;
    document.head.appendChild(el);
  }, []);

  async function toggle() {
    const next: "light" | "dark" = dark ? "light" : "dark";

    const apply = () => {
      setModeClass(next);
      setDark(next === "dark");
      // Persist to backend (best-effort — don't block UI if it fails)
      fetch("/api/settings/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current: { mode: next } }),
      }).catch(() => {});
    };

    if (reduce || typeof document === "undefined" || !("startViewTransition" in document)) {
      apply();
      return;
    }

    const root = document.documentElement;
    if (variant === "rectangle") {
      root.style.setProperty("--mh-vt-from", RECT_FROM[start]);
      root.dataset.mhVt = "rect";
    } else {
      root.style.setProperty("--mh-vt-origin", CIRCLE_ORIGIN[start]);
      root.dataset.mhVt = variant;
    }

    const vt = (document as Document & { startViewTransition?: (cb: () => void) => void }).startViewTransition(apply);
    try {
      await vt.finished;
    } finally {
      delete root.dataset.mhVt;
    }
  }

  return { isDark: dark, mounted, toggle };
}

export function ThemeToggle({
  variant = "circle-blur",
  start = "bottom-up",
  className,
  iconClassName,
  ...rest
}: ThemeToggleProps) {
  const { isDark, mounted, toggle } = useThemeToggle({ variant, start });

  return (
    <button
      type="button"
      aria-label={mounted && isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={mounted && isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      className={cn(
        "relative inline-flex items-center justify-center p-2 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 dark:bg-zinc-800 dark:hover:bg-white/5 dark:hover:bg-slate-800 dark:bg-zinc-900 transition-colors",
        className,
      )}
      {...rest}
    >
      <AnimatePresence mode="wait" initial={false}>
        {mounted && isDark ? (
          <motion.span
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.25 }}
            className="inline-flex"
          >
            <Sun className={cn("w-4 h-4", iconClassName)} />
          </motion.span>
        ) : mounted ? (
          <motion.span
            key="moon"
            initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.25 }}
            className="inline-flex"
          >
            <Moon className={cn("w-4 h-4", iconClassName)} />
          </motion.span>
        ) : (
          <span className={cn("w-4 h-4 inline-block", iconClassName)} aria-hidden="true" />
        )}
      </AnimatePresence>
    </button>
  );
}
