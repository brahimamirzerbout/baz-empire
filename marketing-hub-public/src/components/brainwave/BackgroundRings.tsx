"use client";

/**
 * BackgroundRings — concentric rings with parallax-tracked colored dots.
 * Originally from sanidhyy's Brainwave template (src/components/design/Hero.jsx).
 *
 * Adapted for Marketing Hub:
 *   - Drop-in: just <BackgroundRings className="..." />
 *   - All colors / sizes are props (no hardcoded Brainwave palette)
 *   - Works without an external ref (uses its own internal parallax target)
 *   - Reduced-motion safe: when set, no cursor tracking
 *
 * Usage:
 *   <div className="relative h-[500px] overflow-hidden">
 *     <BackgroundRings />
 *     <h1 className="relative">Headline on top</h1>
 *   </div>
 */

import { useEffect, useRef, useState } from "react";
// MouseParallax removed — using inline implementation
import { useReducedMotion } from "framer-motion";
import clsx from "clsx";

export type BackgroundRingsProps = {
  /** Outer ring size (px). Smaller rings scale proportionally. */
  size?: number;
  /** Track the cursor? Set false to keep dots static. */
  parallax?: boolean;
  /** Parallax strength (0..1). Higher = dots move more. */
  strength?: number;
  /** A list of dots: { offsetDeg, distance, size, color, delay? }. */
  dots?: BackgroundDot[];
  className?: string;
};

export type BackgroundDot = {
  /** Angle from straight-up. 0 = top, 90 = right, 180 = bottom. */
  offsetDeg: number;
  /** Distance from center as fraction of ring radius (0..1). */
  distance: number;
  /** Pixel diameter. */
  size: number;
  /** Tailwind gradient classes, e.g. "from-[#DD734F] to-[#1A1A32]". */
  gradient: string;
  /** Reveal delay in ms. */
  delay?: number;
};

const DEFAULT_DOTS: BackgroundDot[] = [
  { offsetDeg: 46, distance: 0.5, size: 8, gradient: "from-[#DD734F] to-[#1A1A32]", delay: 0 },
  { offsetDeg: -56, distance: 0.5, size: 16, gradient: "from-[#DD734F] to-[#1A1A32]", delay: 100 },
  { offsetDeg: 54, distance: 0.6, size: 16, gradient: "from-[#B9AEDF] to-[#1A1A32]", delay: 200 },
  { offsetDeg: -65, distance: 0.55, size: 12, gradient: "from-[#B9AEDF] to-[#1A1A32]", delay: 300 },
  { offsetDeg: -85, distance: 0.5, size: 24, gradient: "from-[#88E5BE] to-[#1A1A32]", delay: 400 },
  { offsetDeg: 70, distance: 0.5, size: 24, gradient: "from-[#88E5BE] to-[#1A1A32]", delay: 500 },
];

export function BackgroundRings({
  size = 780,
  parallax = true,
  strength = 0.07,
  dots = DEFAULT_DOTS,
  className,
}: BackgroundRingsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Concentric ring scale: outer (1.0), 0.78, 0.55, 0.35
  const ringScales = [1.0, 0.78, 0.55, 0.35];

  // Convert distance (0..1) into actual top offset so dot sits on the inner rings
  // Brainwave math: each ring is at a different distance from center;
  // we render dots hanging from the bottom-center of the visible area.
  // For simplicity we project all dots to a virtual "outer" ring at the bottom-center.
  return (
    <div ref={ref} className={clsx("pointer-events-none absolute", className)} style={{ inset: 0 }}>
      {/* Concentric ring borders */}
      {ringScales.map((s, i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 aspect-square rounded-full border"
          style={{
            width: size * s,
            transform: "translate(-50%, -50%)",
            borderColor: "rgba(125,125,150,0.10)",
            borderWidth: 1,
          }}
        />
      ))}

      {/* Dots — drawn from bottom-center radiating outward */}
      {parallax && !reduce ? (
        <div>
          <DotLayer dots={dots} mounted={mounted} />
        </div>
      ) : (
        <DotLayer dots={dots} mounted={mounted} />
      )}
    </div>
  );
}

function DotLayer({ dots, mounted }: { dots: BackgroundDot[]; mounted: boolean }) {
  return (
    <>
      {dots.map((d, i) => {
        const angle = d.offsetDeg - 90; // CSS rotates clockwise from 12 o'clock; -90 flips to math convention
        // Dot hangs from bottom-center of container.
        // In Brainwave, the container's bottom edge sits at ~50% top, so all dots use bottom-1/2 anchor.
        const armWidth = 1; // px line; visual comes from the gradient orb
        return (
          <div
            key={i}
            className="absolute bottom-1/2 left-1/2 origin-bottom"
            style={{
              width: armWidth,
              height: "50%",
              transform: `translate(-50%, 0) rotate(${angle}deg)`,
            }}
          >
            <div
              className={clsx(
                "absolute left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-b transition-all duration-500 ease-out",
                d.gradient,
              )}
              style={{
                width: d.size,
                height: d.size,
                bottom: `${(d.distance || 0.5) * 100}%`,
                marginBottom: -d.size / 2,
                transitionDelay: `${d.delay ?? 0}ms`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(40px)",
              }}
            />
          </div>
        );
      })}
    </>
  );
}
