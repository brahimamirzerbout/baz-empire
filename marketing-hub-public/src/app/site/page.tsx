"use client";
import Link from "next/link";
import {
  Rocket,
  ArrowRight,
  Crown,
  Target,
  BookOpen,
  Users,
  Brain,
  ShieldCheck,
  Sparkles,
  BarChart3,
  Star,
  Check,
  Quote,
  Play,
  BadgeCheck,
  Flame,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

export default function SitePage() {
  return (
    <div className="min-h-screen" style={{ background: "rgb(var(--bg))" }}>
      {/* NAV */}
      <header
        className="sticky top-0 z-30 backdrop-blur-md border-b"
        style={{ borderColor: "rgb(var(--border))", background: "rgba(15,23,42,0.85)" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/site" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg grid place-items-center"
              style={{ background: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)" }}
            >
              <Crown className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-lg text-white">BAZ Empire</span>
            <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider ml-1 hidden sm:inline">
              Marketing Hub
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/site/features" className="text-slate-300 hover:text-white">
              Features
            </Link>
            <Link href="/case-studies" className="text-slate-300 hover:text-white">
              Case studies
            </Link>
            <Link href="/lexicon" className="text-slate-300 hover:text-white">
              Lexicon
            </Link>
            <Link href="/pricing" className="text-slate-300 hover:text-white">
              Pricing
            </Link>
            <Link href="/site/demo" className="text-slate-300 hover:text-white">
              Demo
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm text-slate-300 hover:text-white px-3">
              Login
            </Link>
            <Link
              href="/onboarding"
              className="btn bg-amber-500 hover:bg-amber-400 text-slate-900 dark:text-white font-bold text-sm px-4 py-2 rounded-lg flex items-center gap-1"
            >
              Start free <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
                  "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, color-mix(in srgb, var(--accent), black 40%) 80%, #7c2d12 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 20%, rgba(245,158,11,0.4) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full"
            style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)" }}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-200">
              Built on the work of Godin, Hormozi, PBD, Kotler, Schwartz
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tight"
          >
            Your marketing,
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 bg-clip-text text-transparent">
              sovereign.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-300 mt-6 max-w-3xl mx-auto"
          >
            The first <strong className="text-white">single-machine marketing hub</strong>. 40
            codified formulas. 11 Nova agents. A 12-marketer marketplace. Campaigns, content,
            intelligence — all in your terminal. Own your data. Ship every day.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 items-center justify-center mt-8"
          >
            <Link
              href="/onboarding"
              className="btn bg-amber-500 hover:bg-amber-400 text-slate-900 dark:text-white font-bold px-7 py-3.5 rounded-lg flex items-center gap-2 text-base"
            >
              <Rocket className="w-4 h-4" /> Start free — no credit card
            </Link>
            <Link
              href="/site/demo"
              className="btn bg-white dark:bg-zinc-900/10 hover:bg-white dark:bg-zinc-900/20 text-white font-semibold px-7 py-3.5 rounded-lg flex items-center gap-2 text-base border border-white/20"
            >
              <Play className="w-4 h-4" /> Watch 90-second demo
            </Link>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xs text-slate-400 dark:text-zinc-500 mt-4"
          >
            <ShieldCheck className="w-3 h-3 inline mr-1" />
            <strong>30-day money-back guarantee.</strong> No questions asked. You ship, or you don't
            pay.
          </motion.p>

          {/* DEMO VIDEO ABOVE THE FOLD — animated CSS loop behind the DemoFrame */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-14 mx-auto max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-amber-400/30 relative"
            style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" }}
          >
            {/* Looping animated background (acts as the "video") */}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 20% 30%, rgba(245,158,11,0.18) 0%, transparent 45%), radial-gradient(circle at 80% 70%, rgba(var(--theme-brand-rgb), 0.18) 0%, transparent 45%), radial-gradient(circle at 50% 50%, rgba(16,185,129,0.10) 0%, transparent 60%)",
                backgroundSize: "200% 200%",
                animation: "demoLoop 18s ease-in-out infinite",
              }}
            />
            <DemoFrame />
          </motion.div>
        </div>
      </section>

      {/* SOCIAL PROOF BAR */}
      <section
        className="border-y"
        style={{ background: "rgb(var(--surface))", borderColor: "rgb(var(--border))" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <Stat label="Formulas codified" value="40+" sub="26 modern + 14 legacy" />
          <Stat
            label="Nova agents"
            value="11"
            sub="Strategist, Storyteller, Copywriter, Analyst, PR, Researcher…"
          />
          <Stat
            label="Marketers in marketplace"
            value="12+"
            sub="Seth, Gary, PBD, Kotler, Ogilvy, Schwartz…"
          />
          <Stat label="APIs & tools" value="140+" sub="every workflow covered" />
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-black text-center text-slate-900 dark:text-white">
          Marketing tools are <span className="line-through opacity-50">scattered</span>.
        </h2>
        <p className="text-center text-lg text-slate-600 dark:text-zinc-300 mt-3 max-w-3xl mx-auto">
          You've got HubSpot for emails. Hootsuite for social. Buffer for scheduling. Notion for
          docs. Mixpanel for analytics. Google Sheets for campaigns. Slack for chat. 12 logins. 12
          invoices. Your strategy is in none of them.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-10">
          {[
            "HubSpot $800/mo",
            "Hootsuite $200/mo",
            "Buffer $120/mo",
            "Mixpanel $800/mo",
            "Notion $96/mo",
            "Slack $96/mo",
          ].map((t, i) => (
            <div key={i} className="card p-4 text-center text-slate-500 dark:text-zinc-400 line-through">
              {t}
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <span className="text-2xl font-bold text-rose-500">
            ~$2,200/mo. And still nothing ships.
          </span>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section
        className="py-20"
        style={{
          background: "linear-gradient(180deg, rgb(var(--surface)) 0%, rgb(var(--bg)) 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-black text-center text-slate-900 dark:text-white">
            One hub.{" "}
            <span className="bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
              Twelve tools. One bill.
            </span>
          </h2>
          <p className="text-center text-slate-600 dark:text-zinc-300 mt-3 max-w-2xl mx-auto">
            The work of a marketing team, on one machine you own. No per-seat. No data lock-in.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
            <FeatureCard
              icon={Rocket}
              color="bg-amber-500"
              title="Cockpit"
              desc="Morning ritual. Patrick Number. Today's wins. One screen, dark amber, ready in 30 seconds."
            />
            <FeatureCard
              icon={Target}
              color="bg-rose-500"
              title="Orchestrator"
              desc="Campaigns, milestones, tasks, agent assignments. The command surface for shipping."
            />
            <FeatureCard
              icon={Brain}
              color="bg-violet-500"
              title="Intelligence"
              desc="11 Nova formulas: lead priority, churn risk, retention curves, attribution, predictive."
            />
            <FeatureCard
              icon={BookOpen}
              color="bg-emerald-500"
              title="Library + Lexicon"
              desc="40 codified formulas + 29-term Investopedia of marketing. Every framework named."
            />
            <FeatureCard
              icon={Users}
              color="bg-sky-500"
              title="Marketplace"
              desc="Hire Seth, Gary, PBD, Kotler, Ogilvy, Schwartz — plus 6 operators. Everyone eats."
            />
            <FeatureCard
              icon={BarChart3}
              color="bg-fuchsia-500"
              title="Attribution + Predictive"
              desc="6 attribution models, $178K weighted pipeline forecast, AB testing."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-black text-center text-slate-900 dark:text-white">
          How it works.
        </h2>
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            {
              step: "01",
              title: "30-second onboarding",
              desc: "Pick your industry. We seed 12 campaigns, 50 contacts, 14 articles, 3 case studies. Real data.",
            },
            {
              step: "02",
              title: "Open the Cockpit",
              desc: "Your morning ritual: Patrick Number, today's tasks, retention curves, agent suggestions.",
            },
            {
              step: "03",
              title: "Ship. Daily.",
              desc: "Orchestrator breaks your strategy into tasks. Agents draft. You edit. You ship. Daily.",
            },
          ].map((s) => (
            <div key={s.step} className="card p-6">
              <div className="text-5xl font-black text-amber-500">{s.step}</div>
              <h3 className="text-xl font-bold mt-2 text-slate-900 dark:text-white">{s.title}</h3>
              <p className="text-sm text-slate-600 dark:text-zinc-300 mt-2">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROOF — TESTIMONIALS */}
      <section className="py-20" style={{ background: "rgb(var(--surface))" }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-black text-center text-slate-900 dark:text-white">
            Trusted by operators who <span className="italic">ship</span>.
          </h2>
          <div className="grid md:grid-cols-3 gap-4 mt-12">
            <Testimonial
              quote="Replaced 6 tools, saved $1,400/mo. Nova's daily intelligence is worth the price alone."
              name="Aïcha M."
              role="Marketing Lead, fintech"
              rating={5}
            />
            <Testimonial
              quote="The Lexicon + Library alone is worth more than my marketing MBA. Operationally, it's a cheat code."
              name="Diego S."
              role="Founder, B2B SaaS"
              rating={5}
            />
            <Testimonial
              quote="The Patrick Number morning ritual changed how my agency starts every day. 85/100 verdict, locked in."
              name="Eugenia A."
              role="Agency Owner"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* OFFER / PRICING TEASER */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <div
          className="card p-8 md:p-12 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1e1b4b 0%, color-mix(in srgb, var(--accent), black 40%) 100%)" }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative">
            <Crown className="w-10 h-10 text-amber-300 mx-auto" />
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3">
              $99/mo. Or your money back.
            </h2>
            <p className="text-amber-100 mt-3 max-w-2xl mx-auto">
              One workspace. Unlimited campaigns. All 11 Nova agents. The Lexicon. The Marketplace.
              Stripe or Revolut. Cancel anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mt-6">
              <Link
                href="/onboarding"
                className="btn bg-amber-400 hover:bg-amber-300 text-slate-900 dark:text-white font-bold px-8 py-4 rounded-lg text-lg flex items-center gap-2"
              >
                <Rocket className="w-5 h-5" /> Start free for 7 days
              </Link>
              <Link
                href="/pricing"
                className="btn bg-white dark:bg-zinc-900/10 hover:bg-white dark:bg-zinc-900/20 text-white font-semibold px-8 py-4 rounded-lg border border-white/20"
              >
                Compare plans
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 justify-center mt-6 text-xs text-amber-200">
              <span>
                <ShieldCheck className="w-3 h-3 inline mr-1" /> 30-day money-back
              </span>
              <span>
                <BadgeCheck className="w-3 h-3 inline mr-1" /> No card to start
              </span>
              <span>
                <Zap className="w-3 h-3 inline mr-1" /> Live in 60 seconds
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-black text-center text-slate-900 dark:text-white">FAQ.</h2>
        <div className="mt-8 space-y-3">
          {[
            [
              "What if I hate it?",
              "30-day money-back. No questions. We refund the entire month and you keep nothing.",
            ],
            [
              "Do I need a credit card?",
              "No. Start free, get 7 days. We'll remind you. Then $99/mo.",
            ],
            [
              "Can I bring my team?",
              "Yes. Add members, roles, audit logs, per-resource RBAC. Workspace level.",
            ],
            [
              "Where does my data live?",
              "Your machine. SQLite. You can back it up, export it, leave with it. Sovereign.",
            ],
            [
              "Is it really all in one?",
              "Yes. 11 Nova agents, 40 formulas, 140+ APIs. Campaigns, content, intelligence, billing.",
            ],
          ].map(([q, a]) => (
            <details key={q} className="card p-4 group">
              <summary className="cursor-pointer font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                {q}{" "}
                <span className="text-amber-500 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-sm text-slate-600 dark:text-zinc-300 mt-2">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        className="py-20 text-center"
        style={{ background: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)" }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
            Ship today.
          </h2>
          <p className="text-slate-800 mt-3">Free for 7 days. Then $99/mo. Money-back guarantee.</p>
          <Link
            href="/onboarding"
            className="btn bg-slate-900 dark:bg-black dark:bg-black hover:bg-slate-800 dark:bg-zinc-900 dark:bg-zinc-900 text-white font-bold px-8 py-4 rounded-lg text-lg mt-6 inline-flex items-center gap-2"
          >
            <Rocket className="w-5 h-5" /> Open your workspace
          </Link>
        </div>
      </section>

      <footer className="border-t" style={{ borderColor: "rgb(var(--border))" }}>
        <div className="max-w-6xl mx-auto px-6 py-8 grid md:grid-cols-4 gap-6 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-4 h-4 text-amber-500" />
              <span className="font-bold">BAZ Empire Marketing Hub</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              The sovereign marketing hub. One machine. One bill. Ship daily.
            </p>
          </div>
          <FooterCol
            title="Product"
            items={[
              ["/site/features", "Features"],
              ["/pricing", "Pricing"],
              ["/lexicon", "Lexicon"],
              ["/marketplace", "Marketplace"],
            ]}
          />
          <FooterCol
            title="Resources"
            items={[
              ["/case-studies", "Case studies"],
              ["/library", "Library"],
              ["/wire", "The Wire"],
              ["/site/demo", "Demo"],
            ]}
          />
          <FooterCol
            title="Company"
            items={[
              ["/empire", "Empire"],
              ["/agency", "Agency"],
              ["/team", "Team"],
              ["/audit", "Audit"],
            ]}
          />
        </div>
        <div
          className="border-t text-center text-xs text-slate-500 dark:text-zinc-400 py-4"
          style={{ borderColor: "rgb(var(--border))" }}
        >
          © {new Date().getFullYear()} BAZ Empire. Built on the work of Godin, Hormozi, Bet-David,
          Kotler, Schwartz, Ogilvy.
        </div>
      </footer>
    </div>
  );
}

function DemoFrame() {
  return (
    <div className="absolute inset-0 flex flex-col">
      <div
        className="px-4 py-2 flex items-center gap-2 border-b"
        style={{ background: "rgba(0,0,0,0.4)", borderColor: "rgba(255,255,255,0.1)" }}
      >
        <div className="w-2 h-2 rounded-full bg-red-400" />
        <div className="w-2 h-2 rounded-full bg-amber-400" />
        <div className="w-2 h-2 rounded-full bg-emerald-400" />
        <div className="ml-4 text-xs text-slate-400 dark:text-zinc-500">baz-empire.com · Cockpit</div>
        <div className="ml-auto flex items-center gap-1 text-xs text-amber-300">
          <Flame className="w-3 h-3" /> LIVE
        </div>
      </div>
      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 p-4">
        <div
          className="rounded-lg p-3 text-white"
          style={{ background: "linear-gradient(135deg, #b45309, #92400e)" }}
        >
          <div className="text-xs uppercase tracking-wider opacity-80">Patrick Number</div>
          <div className="text-4xl font-black mt-1">85</div>
          <div className="text-xs opacity-80 mt-1">$72K MRR · LTV/CAC 9.15x</div>
          <div className="text-[10px] mt-2 opacity-70">↑ Healthy, scale</div>
        </div>
        <div className="rounded-lg p-3 bg-emerald-900/60 text-emerald-100">
          <div className="text-xs uppercase tracking-wider opacity-80">Retention 30d</div>
          <div className="text-4xl font-black mt-1">94%</div>
          <div className="text-xs opacity-80 mt-1">↑ 4pp vs last month</div>
        </div>
        <div className="rounded-lg p-3 bg-violet-900/60 text-violet-100">
          <div className="text-xs uppercase tracking-wider opacity-80">Pipeline weighted</div>
          <div className="text-4xl font-black mt-1">$178K</div>
          <div className="text-xs opacity-80 mt-1">23 deals in motion</div>
        </div>
        <div className="col-span-3 rounded-lg p-3 bg-slate-800 dark:bg-zinc-900 dark:bg-zinc-900/60 text-slate-100">
          <div className="text-xs uppercase tracking-wider mb-2 opacity-80">
            Today's tasks (Nova-assigned)
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <Check className="w-3 h-3 text-emerald-400" /> Review copy brief for ABM campaign ·{" "}
              <span className="text-amber-300">Schwartz agent</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3 h-3 text-emerald-400" /> Approve positioning for Tier-1 accounts
              · <span className="text-amber-300">Kotler agent</span>
            </div>
            <div className="flex items-center gap-2 opacity-50">
              <Check className="w-3 h-3" /> Schedule The Wire article ·{" "}
              <span className="text-amber-300">Storyteller</span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <Link
          href="/onboarding"
          className="btn bg-amber-500 hover:bg-amber-400 text-slate-900 dark:text-white font-bold px-8 py-4 rounded-lg flex items-center gap-2 pointer-events-auto shadow-2xl"
        >
          <Play className="w-5 h-5" /> Open yours
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: Record<string, unknown>) {
  return (
    <div>
      <div className="text-4xl font-black text-amber-500">{value}</div>
      <div className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{label}</div>
      <div className="text-xs text-slate-500 dark:text-zinc-400">{sub}</div>
    </div>
  );
}

function FeatureCard({ icon: Icon, color, title, desc }: Record<string, unknown>) {
  return (
    <div className="card p-5 hover:shadow-lg transition-all">
      <div className={`w-10 h-10 ${color} rounded-lg grid place-items-center mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="font-bold text-lg text-slate-900 dark:text-white">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-zinc-300 mt-1">{desc}</p>
    </div>
  );
}

function Testimonial({ quote, name, role, rating }: Record<string, unknown>) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-0.5 mb-2">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <Quote className="w-5 h-5 text-amber-300 mb-1" />
      <p className="text-sm text-slate-700 dark:text-zinc-300">"{quote}"</p>
      <div className="mt-3 text-xs">
        <strong className="text-slate-900 dark:text-white">{name}</strong>
        <span className="text-slate-500 dark:text-zinc-400"> · {role}</span>
      </div>
    </div>
  );
}

function FooterCol({ title, items }: Record<string, unknown>) {
  return (
    <div>
      <div className="font-bold text-slate-900 dark:text-white mb-2">{title}</div>
      <ul className="space-y-1">
        {items.map(([href, label]: [string, string]) => (
          <li key={href}>
            <Link
              href={href}
              className="text-xs text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:text-white"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
