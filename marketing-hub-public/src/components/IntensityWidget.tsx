"use client";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ArrowRight, AlertTriangle, Info, CheckCircle2, X } from "lucide-react";
import clsx from "clsx";
import { useFetch } from "@/components/useFetch";
import { Skeleton } from "@/components/Skeleton";

const GRADE_COLORS: Record<string, { bg: string; text: string; ring: string; glow: string }> = {
  A: {
    bg: "rgba(22,163,74,0.10)",
    text: "#16a34a",
    ring: "rgba(22,163,74,0.30)",
    glow: "rgba(22,163,74,0.20)",
  },
  B: {
    bg: "rgba(34,197,94,0.08)",
    text: "#22c55e",
    ring: "rgba(34,197,94,0.25)",
    glow: "rgba(34,197,94,0.15)",
  },
  C: {
    bg: "rgba(245,158,11,0.10)",
    text: "#f59e0b",
    ring: "rgba(245,158,11,0.30)",
    glow: "rgba(245,158,11,0.20)",
  },
  D: {
    bg: "rgba(249,115,22,0.10)",
    text: "#f97316",
    ring: "rgba(249,115,22,0.30)",
    glow: "rgba(249,115,22,0.15)",
  },
  F: {
    bg: "rgba(244,63,94,0.10)",
    text: "#f43f5e",
    ring: "rgba(244,63,94,0.30)",
    glow: "rgba(244,63,94,0.20)",
  },
};

const WARNING_STYLES = {
  critical: { icon: AlertTriangle, color: "#f43f5e", bg: "rgba(244,63,94,0.08)" },
  warning: { icon: AlertTriangle, color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  info: { icon: CheckCircle2, color: "#16a34a", bg: "rgba(22,163,74,0.06)" },
};

export function IntensityWidget() {
  const { data, loading } = useFetch<Record<string, unknown>>("/api/intensity");
  const [expanded, setExpanded] = useState(false);

  if (loading) {
    return (
      <div className="card card-pad-sm relative overflow-hidden" style={{ borderRadius: "14px" }}>
        <Skeleton className="h-20 rounded-lg" />
      </div>
    );
  }

  const score = data?.score ?? 0;
  const grade = data?.grade ?? "—";
  const verdict = data?.verdict ?? "—";
  const breakdown = data?.breakdown ?? [];
  const warnings = data?.warnings ?? [];
  const stats = data?.stats ?? {};

  const colors = GRADE_COLORS[grade] || GRADE_COLORS.F;

  return (
    <div
      className="relative overflow-hidden rounded-2xl border transition-all duration-300 group"
      style={{
        borderColor: colors.ring,
        background: `linear-gradient(135deg, ${colors.bg}, rgb(var(--surface)) 60%, ${colors.bg})`,
        boxShadow: `var(--shadow-md), 0 0 40px -12px ${colors.glow}`,
      }}
    >
      {/* Mesh gradient overlay */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 90% 10%, ${colors.glow}, transparent 50%)`,
        }}
      />

      <Link href="/intensity" className="relative block p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Left: label + score */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <motion.div
                initial={{ rotate: -8, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-7 h-7 rounded-lg grid place-items-center flex-shrink-0"
                style={{ background: colors.text, boxShadow: `0 4px 12px -2px ${colors.glow}` }}
              >
                <Zap className="w-3.5 h-3.5 text-white" fill="currentColor" />
              </motion.div>
              <span
                className="text-[10px] font-bold uppercase tracking-[0.15em]"
                style={{ color: "rgb(var(--muted))" }}
              >
                Intensity Score
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span
                className="text-4xl font-black tabular-nums leading-none"
                style={{ color: colors.text }}
              >
                {score}
              </span>
              <span className="text-lg font-bold" style={{ color: "rgb(var(--muted))" }}>
                /100
              </span>
              <span
                className="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
                style={{ background: colors.bg, color: colors.text }}
              >
                {grade} · {verdict}
              </span>
            </div>

            <p className="text-xs mt-2" style={{ color: "rgb(var(--text-secondary))" }}>
              One channel mastered beats five channels touched.
            </p>
          </div>

          {/* Right: circular score gauge */}
          <div className="flex-shrink-0 relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="26"
                fill="none"
                stroke="rgb(var(--border))"
                strokeWidth="4"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="26"
                fill="none"
                stroke={colors.text}
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ strokeDashoffset: 163.36 }}
                animate={{ strokeDashoffset: 163.36 - (163.36 * score) / 100 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                pathLength={163.36}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <span className="text-lg font-black tabular-nums" style={{ color: colors.text }}>
                {grade}
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown bars */}
        {breakdown.length > 0 && (
          <div className="mt-4 space-y-1.5">
            {breakdown.map((b: Record<string, unknown>, i: number) => (
              <div key={b.label} className="flex items-center gap-2.5">
                <span
                  className="text-[10px] font-semibold w-28 truncate"
                  style={{ color: "rgb(var(--muted))" }}
                >
                  {b.label}
                </span>
                <div
                  className="flex-1 h-1.5 rounded-full overflow-hidden"
                  style={{ background: "rgb(var(--surface-3))" }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${b.score}%` }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full"
                    style={{
                      background: b.score >= 70 ? "#16a34a" : b.score >= 40 ? "#f59e0b" : "#f43f5e",
                    }}
                  />
                </div>
                <span
                  className="text-[10px] font-bold tabular-nums w-7 text-right"
                  style={{ color: "rgb(var(--text-secondary))" }}
                >
                  {b.score}
                </span>
              </div>
            ))}
          </div>
        )}
      </Link>

      {/* Warnings — expandable */}
      {warnings.length > 0 && (
        <div className="border-t" style={{ borderColor: "rgb(var(--border))" }}>
          <button
            onClick={(e) => {
              e.preventDefault();
              setExpanded(!expanded);
            }}
            className="w-full flex items-center justify-between px-5 py-2.5 text-xs hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
          >
            <span
              className="font-semibold flex items-center gap-1.5"
              style={{ color: "rgb(var(--text-secondary))" }}
            >
              {warnings.length} alert{warnings.length === 1 ? "" : "s"}
            </span>
            <motion.span animate={{ rotate: expanded ? 180 : 0 }} className="text-slate-400 dark:text-zinc-500">
              <ArrowRight className="w-3.5 h-3.5 rotate-90" />
            </motion.span>
          </button>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-3 space-y-1.5">
                  {warnings.map((w: Record<string, unknown>, i: number) => {
                    const style =
                      WARNING_STYLES[w.level as keyof typeof WARNING_STYLES] || WARNING_STYLES.info;
                    const Icon = style.icon;
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-2 p-2 rounded-lg text-xs"
                        style={{ background: style.bg, color: "rgb(var(--text-secondary))" }}
                      >
                        <Icon
                          className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                          style={{ color: style.color }}
                        />
                        <span className="leading-relaxed">{w.message}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Footer link */}
      <div className="border-t px-5 py-2.5" style={{ borderColor: "rgb(var(--border))" }}>
        <Link
          href="/intensity"
          className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all hover:gap-2"
          style={{ color: colors.text }}
        >
          View full intensity report <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
