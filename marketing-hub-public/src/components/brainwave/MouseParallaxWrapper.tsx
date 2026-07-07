"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

/**
 * MouseParallaxWrapper — simple mouse parallax using framer-motion.
 * Replaces the react-just-parallax dependency with an inline implementation.
 */
export type MouseParallaxWrapperProps = {
  children: React.ReactNode;
  containerRef?: React.RefObject<HTMLElement>;
  strength?: number;
  className?: string;
};

export function MouseParallaxWrapper({
  children,
  containerRef,
  strength = 0.08,
  className,
}: MouseParallaxWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduceMotion) return;
    const el = containerRef?.current || ref.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      setOffset({ x: dx, y: dy });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [strength, containerRef, reduceMotion]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: "transform 0.2s ease-out",
      }}
    >
      {children}
    </div>
  );
}

export function useParallaxLayer() { return { ref: null, style: {} }; }
