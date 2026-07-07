"use client";
import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("[error-boundary]", error);
    }
  }, [error]);

  return (
    <div
      className="min-h-screen grid place-items-center px-4 relative overflow-hidden"
      style={{ background: "rgb(var(--bg))", color: "rgb(var(--text))" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 30% 30%, rgba(244,63,94,0.08), transparent 50%)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full text-center relative z-10 p-8"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid var(--glass-border)",
          borderRadius: "20px",
          boxShadow: "var(--shadow-xl)",
        }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-br from-rose-500 to-red-600 shadow-lg shadow-rose-500/20">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Something went wrong</h1>
        <p className="text-sm muted mb-1 max-w-sm mx-auto">
          An unexpected error occurred. Your data is safe — try refreshing the page.
        </p>
        {process.env.NODE_ENV !== "production" && (
          <details className="mt-4 text-left">
            <summary className="text-xs muted cursor-pointer hover:text-slate-600 dark:text-zinc-300">
              Error details (dev only)
            </summary>
            <pre
              className="mt-2 p-3 rounded-lg overflow-auto text-xs font-mono"
              style={{
                background: "rgb(var(--surface-2))",
                border: "1px solid rgb(var(--border))",
                color: "rgb(var(--text-secondary))",
              }}
            >
              {error.message}
              {error.digest && `\n\ndigest: ${error.digest}`}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button onClick={reset} className="btn btn-primary">
            <RefreshCw className="w-4 h-4" /> Try again
          </button>
          <Link href="/" className="btn btn-secondary">
            <Home className="w-4 h-4" /> Go home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
