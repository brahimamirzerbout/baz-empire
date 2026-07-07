import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import bgAsset from "@/assets/aether-bg.jpg.asset.json";

export const Route = createFileRoute("/marketing-hub")({
  head: () => ({
    meta: [
      { title: "Marketing Hub — The operating system for marketing, sales & finance" },
      {
        name: "description",
        content:
          "The Hub scores, routes, sequences and closes every 60 seconds. Lead loops, sales cadences, attribution and reasoning — running in a closed loop, without a human in the chain.",
      },
      { property: "og:title", content: "Marketing Hub — Closed-loop growth OS" },
      {
        property: "og:description",
        content:
          "Lead scoring, sales cadences, attribution and a triangle loop that ticks every 60 seconds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MarketingHub,
});

const stats = [
  { value: "60s", label: "Loop tick — score → route → step → close" },
  { value: "127", label: "Industry articles ingested from Marketing Dive" },
  { value: "$507K", label: "Pipeline value under management" },
  { value: "4.0×", label: "Pipeline coverage ratio (target ≥ 3×)" },
];

const systems = [
  {
    n: "01",
    title: "Autonomous lead loop",
    body: "Every contact is scored from touchpoints, routed into the right cadence, stepped through, and re-scored — every 60 seconds. No 'did the SDR see this?' Slack messages.",
    href: "#triangle",
  },
  {
    n: "02",
    title: "Marketing Dive, ingested daily",
    body: "Daily journalism from the marketing industry, cached into the Hub, tagged by topic and format, ready for the Triangle to cite when it scores.",
    href: "#dive",
  },
  {
    n: "03",
    title: "Multi-touch attribution",
    body: "Every touchpoint — paid, organic, email, sales, referral — recorded with weights so the cockpit can show which channel actually closed the deal.",
    href: "#attribution",
  },
  {
    n: "04",
    title: "Sales sequences that learn",
    body: "Multi-step cadences with reply and booking probabilities tuned per segment. Pause on reply, escalate on open, stop on conversion.",
    href: "#sequences",
  },
  {
    n: "05",
    title: "Nova reasoning layer",
    body: "A deterministic reasoning engine that classifies questions, pulls the right tables, and answers with sources, confidence, and next actions.",
    href: "#nova",
  },
  {
    n: "06",
    title: "The Cockpit",
    body: "Pipeline velocity, weekly wins, forecast confidence, momentum score — one screen a CMO can open on Monday morning.",
    href: "#cockpit",
  },
];

const loopSteps = [
  { n: "1", title: "Score", body: "Touchpoint weight + recency + channel mix + email engagement → 0–100 lead score." },
  { n: "2", title: "Route", body: "Score ≥ 50 → enroll into the least-loaded active sequence. Balances the queue." },
  { n: "3", title: "Step", body: "Each enrollment advances daily. Reply pauses. Booking promotes the deal to qualified." },
  { n: "4", title: "Close", body: "Negotiation deals with prob ≥ 80 auto-close as won. Stale deals auto-lost at 45d." },
  { n: "5", title: "Learn", body: "Wins feed back into Nova. Tomorrow's scoring is smarter than today's." },
  { n: "6", title: "Report", body: "Pipeline value, velocity, wins/day, loop health — one cockpit, no spreadsheets." },
];

const screens = [
  { title: "Cockpit", desc: "One screen, exec-level", path: "/cockpit" },
  { title: "Triangle Loop", desc: "Live autonomous state", path: "/triangle" },
  { title: "Marketing Dive", desc: "Industry intelligence", path: "/dive" },
  { title: "Sequences", desc: "Cadences + replies", path: "/sequences" },
];

function MarketingHub() {
  return (
    <div className="aether-shell relative min-h-screen text-foreground">
      {/* Atmospheric background asset — pinned, non-scroll */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-70"
        style={{
          backgroundImage: `url(${bgAsset.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          maskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 90%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 90%)",
        }}
      />

      <div className="relative z-10">
        <Header />
        <main id="main">
          <Hero />
          <StatBar />
          <Systems />
          <Triangle />
          <Screens />
          <CTA />
        </main>
        <Footer />
      </div>
    </div>
  );
}

function Diamond({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path
        d="M16 2 L30 16 L16 30 L2 16 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M16 8 L24 16 L16 24 L8 16 Z" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 backdrop-blur-xl bg-background/50">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <Diamond className="h-6 w-6 text-ink-1000" />
          <span className="font-mono text-sm tracking-[0.28em] text-ink-900">BAZ / HUB</span>
          <span className="mono-label ml-1 hidden sm:inline">v3.0</span>
        </div>

        <nav className="hidden items-center gap-1 rounded-full border border-border bg-ink-100/60 p-1 md:flex">
          {["Systems", "Triangle", "Screens", "Pricing"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="rounded-full px-4 py-1.5 text-sm text-ink-700 transition-colors hover:bg-ink-200 hover:text-ink-1000"
            >
              {l}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="chip hidden lg:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-ink-1000 animate-pulse" />
            Live
          </span>
          <a
            href="#demo"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-px"
          >
            Book demo <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}

function SectionShell({
  id,
  wm,
  eyebrow,
  children,
}: {
  id?: string;
  wm: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative border-b border-border">
      <span className="watermark">{wm}</span>
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
        <div className="mono-label mb-4">{eyebrow}</div>
        {children}
      </div>
    </section>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <span className="watermark">00</span>
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 pt-24 pb-20 lg:px-10 lg:pt-32 lg:pb-28">
        <div className="chip mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-ink-1000" />
          Product · The Hub
        </div>

        <h1 className="display-xl text-[clamp(3rem,10vw,10.5rem)]">
          <span className="block text-ink-1000">Marketing, sales</span>
          <span className="block text-ink-1000">& finance —</span>
          <span className="block bg-gradient-to-b from-ink-1000 via-ink-800 to-ink-500 bg-clip-text text-transparent">
            one closed loop.
          </span>
        </h1>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <p className="max-w-2xl text-lg leading-relaxed text-ink-700 lg:text-xl">
            The Hub is the operating system under everything we ship for clients. Lead scoring, sales
            cadences, attribution, the daily industry brief, and a triangle loop that scores, routes,
            sequences, and closes — every 60 seconds, without a human in the chain.
          </p>
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <a
              href="#screens"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-px"
            >
              Open the Hub <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-transparent px-6 py-3 text-sm font-medium text-ink-900 transition-colors hover:bg-ink-100"
            >
              Book a 30-min demo
            </a>
          </div>
        </div>

        {/* Aether-style live console card */}
        <div className="glass mt-16 overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full border border-border" />
              <span className="h-2.5 w-2.5 rounded-full border border-border" />
              <span className="h-2.5 w-2.5 rounded-full border border-border" />
              <span className="mono-label ml-3">hub.local / loop-tick</span>
            </div>
            <span className="mono-label">t = 60s</span>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-6 text-ink-800">
{`> tick 0001 · scoring 412 contacts     ................. ok  38ms
> tick 0001 · routing 87 qualified      ................. ok  12ms
> tick 0001 · sequencing 214 active     ................. ok  44ms
> tick 0001 · nova reasoning 6 threads  ................. ok  91ms
> tick 0001 · closing 3 · won 2 · lost 1 ................ ok   7ms
─────────────────────────────────────────────────────────────────
  pipeline: $507,140  ·  coverage: 4.0×  ·  wins/day: 2.4  ·  ok`}
          </pre>
        </div>
      </div>
    </section>
  );
}

function StatBar() {
  return (
    <section className="relative border-b border-border">
      <div className="relative z-10 mx-auto grid max-w-[1400px] grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.value}
            className={`relative px-6 py-10 lg:px-10 lg:py-14 ${
              i > 0 ? "border-l border-border" : ""
            } ${i < 2 ? "border-b border-border lg:border-b-0" : ""}`}
          >
            <div className="mono-label mb-4">0{i + 1} / metric</div>
            <div className="display-xl text-4xl text-ink-1000 lg:text-6xl">{s.value}</div>
            <div className="mt-4 max-w-[24ch] text-sm text-ink-700">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Systems() {
  return (
    <SectionShell id="systems" wm="01" eyebrow="01 — What's inside">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <h2 className="display-xl max-w-3xl text-4xl text-ink-1000 lg:text-7xl">
          Built for operators, not for show.
        </h2>
        <p className="max-w-md text-ink-700">
          Six systems, one triangle. Each ships a real outcome — pipeline, deals, intelligence — and
          they feed each other so the next run is smarter than the last.
        </p>
      </div>

      <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {systems.map((s) => (
          <a
            key={s.n}
            href={s.href}
            className="group relative flex min-h-[280px] flex-col justify-between gap-8 bg-ink-50 p-8 transition-colors hover:bg-ink-100"
          >
            <div className="absolute right-6 top-6 font-mono text-xs text-ink-500">{s.n}</div>
            <div>
              <div className="mono-label mb-6">System</div>
              <h3 className="text-2xl font-semibold tracking-tight text-ink-1000">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-700">{s.body}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-ink-800 transition-transform group-hover:translate-x-1">
              See it in the Hub <ArrowUpRight className="h-4 w-4" />
            </div>
          </a>
        ))}
      </div>
    </SectionShell>
  );
}

function Triangle() {
  return (
    <SectionShell id="triangle" wm="02" eyebrow="02 — The triangle">
      <h2 className="display-xl text-4xl text-ink-1000 lg:text-7xl">
        Marketing <span className="text-ink-500">↔</span> Sales{" "}
        <span className="text-ink-500">↔</span> Nova
      </h2>
      <p className="mt-6 max-w-2xl text-ink-700">
        Three systems, one loop. Marketing scores leads. Sales sequences them. Nova reasons about
        both — and the whole triangle ticks on its own.
      </p>

      {/* Triangle diagram — glass */}
      <div className="glass mt-12 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-6 py-3">
          <span className="mono-label">Loop diagram</span>
          <span className="mono-label">auto · tick 60s</span>
        </div>

        <div className="grid gap-8 p-8 md:grid-cols-3 lg:p-14">
          {[
            { name: "Marketing", verb: "score → route" },
            { name: "Sales", verb: "step → close" },
            { name: "Nova", verb: "reason → learn" },
          ].map((node, i) => (
            <div key={node.name} className="relative flex flex-col items-center text-center">
              <div className="mono-label mb-3">Node · 0{i + 1}</div>
              <div className="grid h-28 w-28 place-items-center rounded-full border border-border bg-ink-100">
                <span className="display-xl text-3xl text-ink-1000">{node.name[0]}</span>
              </div>
              <div className="mt-4 text-lg font-medium text-ink-1000">{node.name}</div>
              <div className="mono-label mt-1">{node.verb}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {loopSteps.map((s) => (
          <div key={s.n} className="relative bg-ink-50 p-8">
            <div className="mb-5 flex items-baseline gap-3">
              <span className="font-mono text-xs text-ink-600">0{s.n}</span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <h4 className="text-lg font-semibold tracking-tight text-ink-1000">{s.title}</h4>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">{s.body}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function Screens() {
  return (
    <SectionShell id="screens" wm="03" eyebrow="03 — Live, in your browser">
      <h2 className="display-xl text-4xl text-ink-1000 lg:text-7xl">Open any screen directly.</h2>
      <p className="mt-6 max-w-2xl text-ink-700">
        The Hub is a real product running on real data. Click any of these to open the live page.
      </p>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {screens.map((s, i) => (
          <a
            key={s.title}
            href={s.path}
            className="group glass relative flex h-[240px] flex-col justify-between overflow-hidden p-6 transition-transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="mono-label">Screen · 0{i + 1}</span>
              <ArrowUpRight className="h-4 w-4 text-ink-600 transition-colors group-hover:text-ink-1000" />
            </div>
            <div>
              <div className="text-xl font-semibold text-ink-1000">{s.title}</div>
              <div className="mt-1 text-sm text-ink-700">{s.desc}</div>
              <div className="mono-label mt-4 truncate">hub.local{s.path}</div>
            </div>
          </a>
        ))}
      </div>
    </SectionShell>
  );
}

function CTA() {
  return (
    <SectionShell id="demo" wm="04" eyebrow="04 — Second opinion">
      <div className="glass grid gap-10 p-8 lg:grid-cols-[1.3fr_1fr] lg:p-14">
        <div>
          <div className="chip mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-ink-1000 animate-pulse" />
            Booking Q3 · 2 senior partner slots open
          </div>
          <h2 className="display-xl text-4xl text-ink-1000 lg:text-6xl">
            Want a second opinion on your growth plan?
          </h2>
          <p className="mt-6 max-w-xl text-ink-700">
            30 minutes with a senior partner. We'll review your funnel, channels, and unit
            economics — and tell you honestly whether BAZventures is the right fit.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="mailto:hello@bazventures.co"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
            >
              Book a growth call <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#proposal"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-ink-900 hover:bg-ink-100"
            >
              Get a Marketing Hub proposal
            </a>
          </div>
        </div>
        <ul className="flex flex-col gap-4 lg:border-l lg:border-border lg:pl-10">
          {[
            "Reply within 24 hours",
            "Free initial consult, no obligation",
            "Confidential — NDA on request",
            "Mon–Fri · 9–18 GMT",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-ink-800">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-border">
                <Check className="h-3 w-3 text-ink-1000" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-border">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-6 py-10 text-sm text-ink-600 md:flex-row md:items-center md:justify-between lg:px-10">
        <div className="flex items-center gap-3">
          <Diamond className="h-5 w-5 text-ink-900" />
          <span className="font-mono tracking-[0.28em] text-ink-800">BAZ / HUB · v3.0</span>
        </div>
        <div className="flex gap-6">
          <Link to="/" className="hover:text-ink-1000">Home</Link>
          <a href="#systems" className="hover:text-ink-1000">Systems</a>
          <a href="#triangle" className="hover:text-ink-1000">Triangle</a>
          <a href="#demo" className="hover:text-ink-1000">Book a call</a>
        </div>
        <div className="mono-label">© {new Date().getFullYear()} · Monochrome by design</div>
      </div>
    </footer>
  );
}
