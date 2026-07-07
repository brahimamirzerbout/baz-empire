import Link from "next/link";
import { CASES } from "./_data";
import { ArrowRight, Crown, Star, TrendingUp } from "lucide-react";

export default function CaseStudiesIndex() {
  return (
    <div className="min-h-screen" style={{ background: "rgb(var(--bg))" }}>
      <header className="border-b" style={{ borderColor: "rgb(var(--border))" }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/site" className="flex items-center gap-1.5 font-bold text-sm">
            <Crown className="w-4 h-4 text-amber-500" /> BAZ Empire
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/pricing"
              className="text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:text-white"
            >
              Pricing
            </Link>
            <Link
              href="/lexicon"
              className="text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:text-white"
            >
              Lexicon
            </Link>
            <Link
              href="/onboarding"
              className="btn bg-amber-500 hover:bg-amber-400 text-slate-900 dark:text-white font-bold px-4 py-2 rounded-lg"
            >
              Start free
            </Link>
          </div>
        </div>
      </header>

      <section className="py-16 text-center max-w-4xl mx-auto px-6">
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-amber-50 border border-amber-200">
          <Star className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
            Customer stories · Real numbers
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight">
          Operators who{" "}
          <span className="bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
            ship daily
          </span>
          .
        </h1>
        <p className="text-slate-600 dark:text-zinc-300 mt-3 text-lg max-w-2xl mx-auto">
          Three companies. Three industries. One thing in common: they used BAZ Empire as their
          daily marketing command center.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-4">
        {CASES.filter((c) => c.featured).map((c) => (
          <Link
            key={c.slug}
            href={`/case-studies/${c.slug}`}
            className="group card p-6 hover:shadow-xl hover:border-amber-300 transition-all"
          >
            <div className="chip bg-violet-100 text-violet-700 mb-2">{c.industry}</div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-snug mt-1 group-hover:text-amber-700">
              {c.headline}
            </h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {c.results.slice(0, 4).map((r) => (
                <div key={r.label} className="bg-slate-50 dark:bg-zinc-800/50 rounded p-2">
                  <div className="text-[10px] uppercase text-slate-500 dark:text-zinc-400">
                    {r.label}
                  </div>
                  <div className="font-bold text-amber-600 text-lg">{r.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-amber-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              Read the story <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
