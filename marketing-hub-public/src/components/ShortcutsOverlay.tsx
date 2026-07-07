"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, X } from "lucide-react";
import clsx from "clsx";

const SHORTCUTS: Array<{ keys: string; label: string; group: string }> = [
  { keys: "N", label: "Quick add (contact, deal, idea, task…)", group: "Actions" },
  { keys: "/", label: "Focus global search", group: "Actions" },
  { keys: "⌘ K", label: "Open command palette", group: "Actions" },
  { keys: "G then D", label: "Go to Dashboard", group: "Navigation" },
  { keys: "G then I", label: "Go to Intelligence", group: "Navigation" },
  { keys: "G then P", label: "Go to Patrick Number", group: "Navigation" },
  { keys: "G then W", label: "Go to The Wire", group: "Navigation" },
  { keys: "G then L", label: "Go to Library", group: "Navigation" },
  { keys: "G then S", label: "Go to Studio Pro", group: "Navigation" },
  { keys: "G then T", label: "Go to Trends", group: "Navigation" },
  { keys: "?", label: "Show keyboard shortcuts", group: "Help" },
  { keys: "Esc", label: "Close any modal / overlay", group: "Help" },
];

export function ShortcutsOverlay() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let pendingG = false;
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable)
        return;

      if (e.key === "?") {
        setOpen((o) => !o);
        return;
      }
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }

      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        const btn = document.querySelector('button[title^="Quick add"]') as HTMLButtonElement;
        if (btn) btn.click();
        return;
      }

      if (e.key === "g" || e.key === "G") {
        pendingG = true;
        setTimeout(() => {
          pendingG = false;
        }, 800);
        return;
      }
      if (pendingG) {
        pendingG = false;
        const map: Record<string, string> = {
          d: "/",
          i: "/intelligence",
          p: "/patrick",
          w: "/wire",
          l: "/library",
          s: "/studio-pro",
          t: "/trends",
          a: "/attribution",
          c: "/crm",
          b: "/library",
          o: "/old-school",
        };
        const dest = map[e.key.toLowerCase()];
        if (dest) window.location.href = dest;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const grouped = SHORTCUTS.reduce(
    (acc, s) => {
      (acc[s.group] = acc[s.group] || []).push(s);
      return acc;
    },
    {} as Record<string, typeof SHORTCUTS>,
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(15, 23, 42, 0.5)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl w-full overflow-hidden"
            style={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid var(--glass-border)",
              borderRadius: "18px",
              boxShadow: "var(--shadow-xl)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="p-5 border-b flex items-center gap-3"
              style={{ borderColor: "rgb(var(--border))" }}
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 grid place-items-center shadow-lg shadow-violet-500/20">
                <Keyboard className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-lg tracking-tight">Keyboard shortcuts</h3>
              <button
                onClick={() => setOpen(false)}
                className="ml-auto p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 dark:bg-zinc-800/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 max-h-[60vh] overflow-y-auto scrollbar-thin space-y-5">
              {Object.entries(grouped).map(([group, list]) => (
                <div key={group}>
                  <div
                    className="text-[10px] uppercase tracking-wider font-bold mb-2.5"
                    style={{ color: "rgb(var(--muted))" }}
                  >
                    {group}
                  </div>
                  <div className="space-y-1">
                    {list.map((s) => (
                      <div
                        key={s.keys + s.label}
                        className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 dark:bg-zinc-800/60 transition-colors"
                      >
                        <kbd
                          className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold whitespace-nowrap min-w-[70px] text-center"
                          style={{
                            background: "rgb(var(--surface-3))",
                            color: "rgb(var(--text))",
                            border: "1px solid rgb(var(--border))",
                          }}
                        >
                          {s.keys}
                        </kbd>
                        <span className="text-sm" style={{ color: "rgb(var(--text-secondary))" }}>
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div
              className="px-5 py-3 border-t text-xs text-center"
              style={{
                borderColor: "rgb(var(--border))",
                color: "rgb(var(--muted))",
              }}
            >
              Press <kbd className="px-1.5 py-0.5 rounded kbd">?</kbd> again to close ·{" "}
              <kbd className="px-1.5 py-0.5 rounded kbd">Esc</kbd> works too
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
