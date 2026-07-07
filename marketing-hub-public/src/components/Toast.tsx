"use client";
import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react";
import clsx from "clsx";

type ToastVariant = "success" | "error" | "info" | "warning";
type Toast = {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
};

type ToastContextType = {
  toast: (t: Omit<Toast, "id">) => string;
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
  warning: (title: string, description?: string) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const VARIANT_STYLES: Record<
  ToastVariant,
  { icon: React.ComponentType<{ className?: string }>; color: string; bg: string; ring: string; glow: string }
> = {
  success: {
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    ring: "ring-emerald-200/60 dark:ring-emerald-500/30",
    glow: "rgba(16,185,129,0.15)",
  },
  error: {
    icon: AlertCircle,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-500/10",
    ring: "ring-rose-200/60 dark:ring-rose-500/30",
    glow: "rgba(244,63,94,0.15)",
  },
  info: {
    icon: Info,
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-500/10",
    ring: "ring-sky-200/60 dark:ring-sky-500/30",
    glow: "rgba(14,165,233,0.15)",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    ring: "ring-amber-200/60 dark:ring-amber-500/30",
    glow: "rgba(245,158,11,0.15)",
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((curr) => curr.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      const full: Toast = { duration: 4000, ...t, id };
      setToasts((curr) => [...curr, full]);
      if (full.duration && full.duration > 0) {
        setTimeout(() => dismiss(id), full.duration);
      }
      return id;
    },
    [dismiss],
  );

  const helpers: ToastContextType = {
    toast,
    success: (title, description) => toast({ variant: "success", title, description }),
    error: (title, description) => toast({ variant: "error", title, description, duration: 6000 }),
    info: (title, description) => toast({ variant: "info", title, description }),
    warning: (title, description) => toast({ variant: "warning", title, description }),
    dismiss,
  };

  return (
    <ToastContext.Provider value={helpers}>
      {children}
      <ToastViewport toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastViewport({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex flex-col gap-2.5 pointer-events-none">
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const style = VARIANT_STYLES[t.variant];
          const Icon = style.icon;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={clsx(
                "pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-lg ring-1",
                style.ring,
              )}
              style={{
                minWidth: 320,
                maxWidth: 420,
                background: "var(--glass-bg)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                boxShadow: `var(--shadow-lg), 0 0 24px -4px ${style.glow}`,
              }}
            >
              <div
                className={clsx(
                  "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                  style.bg,
                )}
              >
                <Icon className={style.color} size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm" style={{ color: "rgb(var(--text))" }}>
                  {t.title}
                </div>
                {t.description && (
                  <div className="text-xs mt-0.5" style={{ color: "rgb(var(--text-secondary))" }}>
                    {t.description}
                  </div>
                )}
                {t.action && (
                  <button
                    onClick={() => {
                      t.action!.onClick();
                      dismiss(t.id);
                    }}
                    className="text-xs font-bold text-[color-mix(in srgb,var(--accent),black 20%)] hover:text-[color-mix(in srgb,var(--accent),black 50%)] mt-1.5 transition-colors"
                  >
                    {t.action.label}
                  </button>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 dark:bg-zinc-800 dark:hover:bg-white/5/80 dark:hover:bg-white dark:bg-zinc-900/5 rounded text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:text-zinc-300 dark:hover:text-zinc-300 flex-shrink-0 transition-colors"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
