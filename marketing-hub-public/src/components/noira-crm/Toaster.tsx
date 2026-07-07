import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { Close, Check, RotateCcw } from "./svgs";
import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "error" | "default";

export interface ToastAction {
  /** Short label for the action button. */
  label: string;
  /** Click handler. Toast is dismissed after invocation. */
  onClick: () => void;
}

type Toast = {
  id: number;
  message: string;
  variant: ToastVariant;
  /** Optional action (e.g. "Undo") rendered inside the toast. */
  action?: ToastAction;
  /** Lifetime in ms; longer for action-bearing toasts so user can react. */
  durationMs?: number;
};

type ToastContextType = {
  toasts: Toast[];
  showToast: (message: string, variant?: ToastVariant) => void;
  /**
   * Show a toast with an inline action (typically an Undo button).
   * Returns a dismiss function so callers can also remove it manually.
   */
  showActionToast: (message: string, action: ToastAction, variant?: ToastVariant) => () => void;
  removeToast: (id: number) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "default") => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => removeToast(id), 4000);
    },
    [removeToast],
  );

  const showActionToast = useCallback(
    (message: string, action: ToastAction, variant: ToastVariant = "default") => {
      const id = Date.now() + Math.random();
      const toast: Toast = {
        id,
        message,
        variant,
        action,
        durationMs: 6000,
      };
      setToasts((prev) => [...prev, toast]);
      const timer = setTimeout(() => removeToast(id), toast.durationMs ?? 6000);
      return () => {
        clearTimeout(timer);
        removeToast(id);
      };
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, showActionToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[1000] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const colors =
    toast.variant === "success"
      ? "border-green-600/40 bg-dark-2"
      : toast.variant === "error"
        ? "border-red-600/40 bg-dark-2"
        : "border-dark-4 bg-dark-2";

  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-xl min-w-[280px] max-w-md animate-in fade-in slide-in-from-top-5",
        colors,
      )}
    >
      <div
        className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center",
          toast.variant === "success" && "bg-green-600/20 text-green-500",
          toast.variant === "error" && "bg-red-600/20 text-red-500",
          toast.variant === "default" && "bg-dark-4 text-light-1",
        )}
      >
        {toast.variant === "success" ? <Check className="h-4 w-4" /> : <span>!</span>}
      </div>
      <p className="text-sm text-light-1 flex-1">{toast.message}</p>
      {toast.action && (
        <button
          type="button"
          onClick={() => {
            toast.action!.onClick();
            onClose();
          }}
          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-accent text-white hover:opacity-90"
        >
          <RotateCcw className="h-3 w-3" />
          {toast.action.label}
        </button>
      )}
      <button onClick={onClose} className="text-light-3 hover:text-light-1" aria-label="Dismiss">
        <Close className="h-4 w-4" />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Fallback to console outside provider (e.g., during tests)
    return {
      toasts: [] as Toast[],
      showToast: (msg: string, _variant?: ToastVariant) =>
        // eslint-disable-next-line no-console -- debug toast
        console.debug("[toast]", msg),
      showActionToast: (msg: string, action: ToastAction, _variant?: ToastVariant) => {
        console.debug("[toast action]", msg);
        action.onClick();
        return () => {};
      },
      removeToast: () => {},
    };
  }
  return ctx;
}
