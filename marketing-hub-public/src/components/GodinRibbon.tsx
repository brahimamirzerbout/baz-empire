"use client";
import { useEffect, useState } from "react";
import { Quote, X, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { WISDOM_QUOTES } from "@/lib/wisdom";
import { BOOKS } from "@/lib/books";

export function GodinRibbon() {
  const [hidden, setHidden] = useState(false);
  const [idx, setIdx] = useState(0);
  const [showBook, setShowBook] = useState(false);
  const q = WISDOM_QUOTES[idx]!;
  const book = BOOKS[idx % BOOKS.length]!;

  useEffect(() => {
    try {
      setHidden(localStorage.getItem("godin_ribbon_hidden") === "1");
    } catch {}
    // Pick a random quote from all the masters
    setIdx(Math.floor(Math.random() * WISDOM_QUOTES.length));
  }, []);

  // Rotate quotes every 30 seconds, alternating between master quotes and book insights
  useEffect(() => {
    if (hidden) return;
    const interval = setInterval(() => {
      setIdx((prev) => (prev + 1) % WISDOM_QUOTES.length);
      setShowBook((prev) => !prev);
    }, 30000);
    return () => clearInterval(interval);
  }, [hidden]);

  function dismiss() {
    setHidden(true);
    try {
      localStorage.setItem("godin_ribbon_hidden", "1");
    } catch {}
  }

  if (hidden) return null;

  // Color by category
  const catColors: Record<string, string> = {
    empathy: "from-violet-50/40 to-rose-50/30",
    attention: "from-amber-50/40 to-orange-50/30",
    desire: "from-rose-50/40 to-fuchsia-50/30",
    trust: "from-emerald-50/40 to-sky-50/30",
    action: "from-sky-50/40 to-violet-50/30",
    craft: "from-slate-50/40 to-stone-50/30",
    soul: "from-violet-50/40 to-amber-50/30",
  };

  return (
    <div
      className={clsx(
        "flex items-center gap-3 px-5 py-2 text-xs border-b relative overflow-hidden transition-all",
        "bg-gradient-to-r",
        catColors[q.category] || catColors.soul,
      )}
      style={{ borderColor: "rgb(var(--border))" }}
    >
      {showBook ? (
        <>
          <Link href="/vault" className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-purple-600 grid place-items-center flex-shrink-0 shadow-sm hover:scale-110 transition-transform">
            <BookOpen className="w-3 h-3 text-white" />
          </Link>
          <span className="italic truncate" style={{ color: "rgb(var(--text-secondary))" }}>
            <span className="font-bold not-italic" style={{ color: "var(--theme-brand, #888)" }}>{book.author}</span>{": "}{book.insights.tldr}
          </span>
          <Link href="/vault" className="text-[10px] font-bold whitespace-nowrap flex items-center gap-0.5 hover:underline" style={{ color: "var(--theme-brand, #888)" }}>
            Book Vault <ArrowRight className="w-2.5 h-2.5" />
          </Link>
        </>
      ) : (
        <>
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-rose-500 grid place-items-center flex-shrink-0 shadow-sm">
            <Quote className="w-3 h-3 text-white" />
          </div>
          <span className="italic truncate" style={{ color: "rgb(var(--text-secondary))" }}>
            “{q.text}”
          </span>
          <span
            className="font-bold whitespace-nowrap text-[11px]"
            style={{ color: "var(--theme-brand, #888)" }}
          >
            — {q.author}
          </span>
        </>
      )}
      <button
        onClick={dismiss}
        className="ml-auto p-1 hover:bg-slate-200 dark:hover:bg-zinc-700 dark:bg-zinc-700/60 rounded text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:text-zinc-300 flex-shrink-0 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
