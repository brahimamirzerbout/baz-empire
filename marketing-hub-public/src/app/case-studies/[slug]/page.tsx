import Link from "next/link";
import { notFound } from "next/navigation";
import { CASES } from "../_data";
import { ArrowLeft, Crown, Star, Check, Briefcase, Calendar, Sparkles } from "lucide-react";

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const c = CASES.find((x) => x.slug === params.slug);
  if (!c) return notFound();
  return (
    <div className="min-h-screen" style={{ background: "rgb(var(--bg))" }}>
      <header className="border-b" style={{ borderColor: "rgb(var(--border))" }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:text-white"
          >
            <ArrowLeft className="w-4 h-4" /> All case studies
          </Link>
          <Link href="/site" className="flex items-center gap-1.5 font-bold text-sm">
            <Crown className="w-4 h-4 text-amber-500" /> BAZ Empire
          </Link>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-6 py-12">
        <div className="chip bg-violet-100 text-violet-700 mb-3">{c.industry}</div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
          {c.headline}
        </h1>
        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-500 dark:text-zinc-400">
          <span className="flex items-center gap-1">
            <Briefcase className="w-4 h-4" /> {c.customer}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" /> {c.duration_months} months
          </span>
        </div>

        {/* RESULTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          {c.results.map((r) => (
            <div key={r.label} className="card p-4">
              <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                {r.label}
              </div>
              <div className="text-3xl font-black text-amber-600 mt-1">{r.value}</div>
            </div>
          ))}
        </div>

        {/* CHALLENGE */}
        <section className="mt-12">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">The challenge</h2>
          <p className="text-slate-700 dark:text-zinc-300 mt-2 leading-relaxed">{c.challenge}</p>
        </section>

        {/* SOLUTION */}
        <section className="mt-10">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">The solution</h2>
          <p className="text-slate-700 dark:text-zinc-300 mt-2 leading-relaxed">{c.solution}</p>
          <div className="mt-4">
            <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
              Tools used
            </div>
            <div className="flex flex-wrap gap-2">
              {c.tools.map((t) => (
                <span
                  key={t}
                  className="chip bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* QUOTE */}
        <section className="mt-12 card p-8 bg-gradient-to-br from-amber-50 to-rose-50 border-amber-200">
          <Sparkles className="w-6 h-6 text-amber-500" />
          <blockquote className="text-2xl text-slate-900 dark:text-white italic font-medium leading-snug mt-2">
            "{c.quote.text}"
          </blockquote>
          <div className="mt-3 text-sm font-semibold text-slate-700 dark:text-zinc-300">
            — {c.quote.author}
          </div>
        </section>

        {/* CTA */}
        <section
          className="mt-12 text-center card p-10"
          style={{ background: "linear-gradient(135deg, #1e1b4b 0%, color-mix(in srgb, var(--accent), black 60%) 100%)" }}
        >
          <h3 className="text-3xl font-black text-white">Be the next case study.</h3>
          <p className="text-amber-100 mt-2">7-day free trial. No card. Money-back guarantee.</p>
          <Link
            href="/onboarding"
            className="btn bg-amber-500 hover:bg-amber-400 text-slate-900 dark:text-white font-bold px-6 py-3 rounded-lg mt-6 inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Start your 7-day sprint
          </Link>
        </section>
      </article>
    </div>
  );
}
