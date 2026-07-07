"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Sparkles, ArrowRight, Quote, ChevronRight } from "lucide-react";
import { BOOKS } from "@/lib/books";
import { WISDOM_QUOTES } from "@/lib/wisdom";
import { FadeIn } from "@/components/Anim";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * WISDOM STRIP — Daily book insight + master quote
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Embodying the principles:
 * - Ogilvy: "Big ideas come from big research" → links to Book Vault
 * - Godin: "The best marketing is invisible" → subtle, not interruptive
 * - Schwartz: "Channel existing desire" → shows what the user already wants (knowledge)
 * - Miller: "Customer is the hero" → you're learning, we're the guide
 * - Hopkins: "Test everything" → refreshes daily, measurable engagement
 */

const WISDOM_CATEGORIES = [
  { id: "empathy", label: "Empathy", color: "from-violet-500/20 to-purple-500/10", accent: "var(--accent)" },
  { id: "attention", label: "Attention", color: "from-amber-500/20 to-orange-500/10", accent: "#f59e0b" },
  { id: "desire", label: "Desire", color: "from-rose-500/20 to-fuchsia-500/10", accent: "#f43f5e" },
  { id: "trust", label: "Trust", color: "from-emerald-500/20 to-teal-500/10", accent: "#10b981" },
  { id: "action", label: "Action", color: "from-sky-500/20 to-blue-500/10", accent: "#0ea5e9" },
  { id: "craft", label: "Craft", color: "from-slate-500/20 to-zinc-500/10", accent: "#64748b" },
  { id: "soul", label: "Soul", color: "from-violet-500/20 to-amber-500/10", accent: "#a78bfa" },
  { id: "growth", label: "Growth", color: "from-green-500/20 to-emerald-500/10", accent: "#22c55e" },
];

export function WisdomStrip() {
  const [bookIdx, setBookIdx] = useState(0);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [showQuote, setShowQuote] = useState(false);

  // Pick based on day of year for consistency within a session
  useEffect(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    setBookIdx(dayOfYear % BOOKS.length);
    setQuoteIdx(dayOfYear % WISDOM_QUOTES.length);
  }, []);

  const book = BOOKS[bookIdx]!;
  const quote = WISDOM_QUOTES[quoteIdx]!;
  const catMeta = WISDOM_CATEGORIES.find((c) => c.id === quote.category)!;

  return (
    <FadeIn delay={0.03}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ─── Book Insight ─── */}
        <Link
          href="/vault"
          className="group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg"
          style={{
            borderColor: "rgb(var(--border))",
            background: "rgb(var(--surface))",
          }}
        >
          {/* Gradient mesh */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 90% 10%, ${catMeta.accent}15, transparent 50%)`,
            }}
          />

          <div className="relative p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-8 h-8 rounded-lg grid place-items-center flex-shrink-0 shadow-sm"
                style={{ background: catMeta.accent, boxShadow: `0 4px 12px -2px ${catMeta.accent}40` }}
              >
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: "rgb(var(--muted))" }}>
                  Today's Insight
                </div>
                <div className="text-sm font-semibold truncate" style={{ color: "rgb(var(--text))" }}>
                  {book.title}
                </div>
              </div>
              <span
                className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex-shrink-0"
                style={{
                  color: catMeta.accent,
                  borderColor: `${catMeta.accent}30`,
                  background: `${catMeta.accent}10`,
                }}
              >
                {book.difficulty}
              </span>
            </div>

            {/* Big Idea */}
            <div
              className="rounded-lg p-3 mb-3 border"
              style={{
                background: `${catMeta.accent}08`,
                borderColor: `${catMeta.accent}20`,
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3 h-3" style={{ color: catMeta.accent }} />
                <span
                  className="text-[9px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: catMeta.accent }}
                >
                  Big Idea
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "rgb(var(--text-secondary))" }}>
                {book.bigIdea}
              </p>
            </div>

            {/* Author + categories */}
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "rgb(var(--muted))" }}>
                {book.author} · {book.year < 0 ? `${Math.abs(book.year)} BC` : book.year}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: catMeta.accent }}>
                Open Book Vault <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </Link>

        {/* ─── Master Quote ─── */}
        <button
          onClick={() => setShowQuote(!showQuote)}
          className="group relative overflow-hidden rounded-2xl border transition-all duration-300 text-left hover:shadow-lg"
          style={{
            borderColor: "rgb(var(--border))",
            background: "rgb(var(--surface))",
          }}
        >
          {/* Gradient mesh */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 10% 80%, ${catMeta.accent}15, transparent 50%)`,
            }}
          />

          <div className="relative p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-8 h-8 rounded-lg grid place-items-center flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${catMeta.accent}30, ${catMeta.accent}15)` }}
              >
                <Quote className="w-4 h-4" style={{ color: catMeta.accent }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: "rgb(var(--muted))" }}>
                  Master Wisdom
                </div>
                <div className="text-sm font-semibold truncate" style={{ color: "rgb(var(--text))" }}>
                  {quote.author}
                </div>
              </div>
              <span
                className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                style={{
                  color: catMeta.accent,
                  borderColor: `${catMeta.accent}30`,
                  background: `${catMeta.accent}10`,
                }}
              >
                {catMeta.label}
              </span>
            </div>

            {/* Quote */}
            <blockquote className="text-base font-medium leading-relaxed mb-2" style={{ color: "rgb(var(--text))" }}>
              &ldquo;{quote.text}&rdquo;
            </blockquote>

            {quote.context && (
              <p className="text-xs" style={{ color: "rgb(var(--muted))" }}>
                — {quote.context}
              </p>
            )}

            {/* Expanded book connection */}
            {showQuote && (
              <div className="mt-3 pt-3 border-t" style={{ borderColor: "rgb(var(--border))" }}>
                <p className="text-xs" style={{ color: "rgb(var(--text-secondary))" }}>
                  This principle is embodied in{" "}
                  <Link
                    href="/vault"
                    className="font-semibold hover:underline"
                    style={{ color: catMeta.accent }}
                  >
                    {book.insights.relatedMasters.length} Master frameworks
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/vault"
                    className="font-semibold hover:underline"
                    style={{ color: catMeta.accent }}
                  >
                    {book.insights.relatedModules.length} Hub modules
                  </Link>
                  .
                </p>
              </div>
            )}

            <div className="flex items-center justify-between mt-3">
              <span className="text-[10px]" style={{ color: "rgb(var(--muted))" }}>
                Click to see connections
              </span>
              <ChevronRight
                className="w-4 h-4 transition-transform"
                style={{
                  color: "rgb(var(--muted))",
                  transform: showQuote ? "rotate(90deg)" : "rotate(0deg)",
                }}
              />
            </div>
          </div>
        </button>
      </div>
    </FadeIn>
  );
}