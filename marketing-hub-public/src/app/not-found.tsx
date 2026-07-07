import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";

/**
 * 404 Not Found page — Server Component safe (no framer-motion).
 *
 * IMPORTANT: This file MUST NOT import framer-motion or any client-only
 * library. Next.js renders not-found.tsx in a special RSC context where
 * client component libraries like framer-motion crash with:
 *   "createMotionComponent is not a function"
 *
 * All animations are CSS-based via globals.css @keyframes.
 */

export default function NotFound() {
  return (
    <div
      className="min-h-screen grid place-items-center px-4 relative overflow-hidden"
      style={{ background: "rgb(var(--bg))", color: "rgb(var(--text))" }}
    >
      {/* Ambient gradient — theme-aware */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "var(--theme-ambient, var(--gradient-mesh))",
        }}
      />

      {/* 404 Card — CSS animated, no framer-motion */}
      <div
        className="max-w-md w-full text-center relative z-10 p-8 animate-fade-in-up"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid var(--glass-border)",
          borderRadius: "20px",
          boxShadow: "var(--shadow-xl)",
          animationDuration: "0.4s",
        }}
      >
        {/* Icon */}
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
          style={{
            background:
              "linear-gradient(135deg, var(--theme-brand, var(--accent)), var(--theme-brand-secondary, #888))",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <Compass className="w-8 h-8 text-white" />
        </div>

        {/* Big 404 */}
        <div
          className="text-7xl font-black tracking-tighter mb-2"
          style={{ color: "var(--theme-brand, var(--accent))" }}
        >
          404
        </div>

        {/* Message */}
        <h1 className="text-xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">
          Page not found
        </h1>
        <p className="text-sm muted mb-6 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Back to dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/cockpit" className="btn btn-secondary">
            The Cockpit
          </Link>
        </div>
      </div>
    </div>
  );
}
