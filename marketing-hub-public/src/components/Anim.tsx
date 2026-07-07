"use client";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

// ─── Animation primitives ───────────────────────────────────────────────────
//
// Reusable motion wrappers for consistent, premium feel across the app.
// All animations respect `prefers-reduced-motion` via framer-motion defaults.

const EASE = [0.16, 1, 0.3, 1] as const; // "expo out" — smooth and confident
const DUR = { fast: 0.15, base: 0.25, slow: 0.4 } as const;

export function FadeIn({
  children,
  delay = 0,
  y = 8,
  duration = DUR.base,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y }}
      transition={{ duration, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  delay = 0,
  stagger = 0.04,
  className,
}: {
  children: ReactNode;
  delay?: number;
  stagger?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  y = 12,
  className,
}: {
  children: ReactNode;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Card that lifts and brightens on hover. */
export function HoverCard({
  children,
  className,
  onClick,
  ...rest
}: HTMLMotionProps<"div"> & { children: ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{
        y: -2,
        boxShadow: "0 8px 24px -8px var(--theme-brand-glow, rgba(0,0,0,0.1))",
      }}
      whileTap={{ scale: 0.98, y: 0 }}
      transition={{ duration: DUR.fast, ease: EASE }}
      onClick={onClick}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Animated counter that counts up from 0 to `value` when mounted. */
import { useEffect, useRef, useState } from "react";
export function CountUp({
  value,
  duration = 1.0,
  format = (n: number) => Math.round(n).toLocaleString(),
  className,
}: {
  value: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const [n, setN] = useState(0);
  const start = useRef<number>(0);
  const from = useRef<number>(0);
  useEffect(() => {
    from.current = n;
    start.current = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const elapsed = (t - start.current) / 1000;
      const k = Math.min(1, elapsed / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - k, 3);
      setN(from.current + (value - from.current) * eased);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);
  return <span className={className}>{format(n)}</span>;
}

/** Re-export AnimatePresence so consumers don't need to import from framer directly. */
export { AnimatePresence, motion };
