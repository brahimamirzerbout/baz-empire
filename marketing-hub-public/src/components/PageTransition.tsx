"use client";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

/**
 * PageTransition — CSS-based page transition wrapper.
 *
 * Previously used framer-motion's motion.div, which crashed when rendering
 * the not-found page in a Server Component context (framer-motion's
 * createMotionComponent is not available during RSC serialization).
 *
 * CSS animations are:
 *   1. Zero-JS — no client bundle cost for transitions
 *   2. SSR-safe — work in all contexts including not-found, error boundaries
 *   3. Faster — GPU-accelerated, no React reconciliation overhead
 *   4. Respects prefers-reduced-motion automatically (globals.css handles this)
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="animate-fade-in-up" style={{ animationDuration: "0.3s" }}>
      {children}
    </div>
  );
}
