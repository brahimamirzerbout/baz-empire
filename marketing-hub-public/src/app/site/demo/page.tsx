"use client";
import { useState } from "react";
import Link from "next/link";
import { Play, ArrowRight, Rocket, Crown, Pause, Sparkles, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SCENES = [
  {
    id: "cockpit",
    title: "Morning ritual",
    duration: 8,
    lines: [
      "Open the Cockpit.",
      "Patrick Number: 85. Healthy. Scale.",
      "$72K MRR. $37.8K cash. LTV/CAC 9.15x.",
      "Your today's wins: 7 tasks. 3 with Nova-assigned agents.",
    ],
    accent: "amber",
  },
  {
    id: "library",
    title: "The Lexicon",
    duration: 6,
    lines: [
      "29 terms. 40 formulas. All codified.",
      "Need to write a landing page? PAS. AIDA. BAB. Schwartz 5 levels of awareness.",
      "Need a pricing tier? The Grand Slam Offer. Three-tier pricing. Decoy effect.",
      "Everything in your team playbook, searchable.",
    ],
    accent: "emerald",
  },
  {
    id: "wire",
    title: "The Wire",
    duration: 6,
    lines: [
      "Daily intelligence.",
      "14 articles today. Each one relevance-scored to your workspace.",
      "Save as idea. Send to Nova. Graduate to campaign.",
      "The marketing newsfeed that actually knows your industry.",
    ],
    accent: "rose",
  },
  {
    id: "studio",
    title: "Studio Pro",
    duration: 7,
    lines: [
      "The visual canvas.",
      "Drop blocks. Write copy. Nova assists with Schwartz and Hormozi frameworks.",
      "12 block types. 6 templates. Canva × Obsidian.",
      "Export to a campaign in one click.",
    ],
    accent: "violet",
  },
  {
    id: "orchestrator",
    title: "Orchestrator",
    duration: 8,
    lines: [
      "The campaign command surface.",
      "Break a campaign into milestones and tasks.",
      "Assign tasks to AI agents — Strategist, Copywriter, Storyteller, PR Brain.",
      "Run them. Watch the output. Ship.",
    ],
    accent: "sky",
  },
  {
    id: "marketplace",
    title: "Marketplace",
    duration: 5,
    lines: [
      "Hire a marketer.",
      "12 in the marketplace. Seth Godin. Gary Vaynerchuk. Patrick Bet-David.",
      "Philip Kotler. David Ogilvy. Eugene Schwartz.",
      "Hire for a sprint. Everyone eats.",
    ],
    accent: "fuchsia",
  },
  {
    id: "ship",
    title: "Ship daily",
    duration: 5,
    lines: [
      "Daily. Not monthly. Daily.",
      "Cockpit morning. Library for the framework. Wire for the news.",
      "Orchestrator for the plan. Studio Pro for the deliverable.",
      "Ship. Repeat tomorrow. Cash flows. Tribe grows.",
    ],
    accent: "amber",
  },
];

const ACCENTS: Record<string, string> = {
  amber: "from-amber-400 to-orange-600",
  emerald: "from-emerald-400 to-teal-600",
  rose: "from-rose-400 to-pink-600",
  violet: "from-violet-400 to-purple-600",
  sky: "from-sky-400 to-blue-600",
  fuchsia: "from-fuchsia-400 to-pink-600",
};

export default function DemoPage() {
  const [playing, setPlaying] = useState(false);
  const [idx, setIdx] = useState(0);
  const scene = SCENES[idx];

  function start() {
    setPlaying(true);
    setIdx(0);
    tick();
  }

  function tick() {
    if (idx >= SCENES.length - 1) return;
    setTimeout(() => {
      setIdx((i) => {
        if (i >= SCENES.length - 1) {
          setPlaying(false);
          return i;
        }
        tick();
        return i + 1;
      });
    }, scene.duration * 1000);
  }

  const totalSec = SCENES.reduce((a, s) => a + s.duration, 0);

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, color-mix(in srgb, var(--accent), black 60%) 100%)" }}
    >
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Link href="/site" className="inline-flex items-center gap-2 text-amber-200 text-sm mb-4">
          <Crown className="w-4 h-4" /> BAZ Empire
        </Link>
        <h1 className="text-4xl md:text-5xl font-black text-white">90 seconds. The whole hub.</h1>
        <p className="text-amber-100 mt-2">
          From morning ritual to marketplace hire. What a working day in the Hub looks like.
        </p>

        {/* VIDEO FRAME */}
        <div
          className="relative aspect-video mt-8 rounded-2xl overflow-hidden shadow-2xl border border-amber-400/30"
          style={{ background: "#0f172a" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={scene.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className={`absolute inset-0 bg-gradient-to-br ${ACCENTS[scene.accent]}`}
            >
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center px-8">
                  <div className="text-xs uppercase tracking-[0.3em] text-white/70">
                    Scene {idx + 1} of {SCENES.length}
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black text-white mt-3 leading-tight">
                    {scene.title}
                  </h2>
                  <div className="mt-6 space-y-1.5 max-w-2xl mx-auto">
                    {scene.lines.map((l, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.4 }}
                        className="text-white/90 text-lg"
                      >
                        {l}
                      </motion.p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {!playing && (
            <button
              onClick={start}
              className="absolute inset-0 grid place-items-center bg-black/30 hover:bg-black/20 transition-colors"
            >
              <div className="bg-white dark:bg-zinc-900/10 backdrop-blur-md border border-white/20 rounded-full p-8 hover:scale-110 transition-transform">
                <Play className="w-12 h-12 text-white fill-white" />
              </div>
            </button>
          )}

          {playing && (
            <button
              onClick={() => setPlaying(false)}
              className="absolute top-4 right-4 bg-black/40 backdrop-blur p-2 rounded-full text-white"
            >
              <Pause className="w-4 h-4" />
            </button>
          )}

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
            <div
              className="h-full bg-amber-400 transition-all"
              style={{ width: `${(idx / SCENES.length) * 100}%` }}
            />
          </div>
        </div>

        {/* TIMELINE */}
        <div className="grid grid-cols-7 gap-2 mt-4">
          {SCENES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                setIdx(i);
                if (!playing) setPlaying(true);
              }}
              className={`text-center p-2 rounded-lg transition-colors ${i === idx ? "bg-amber-500/20 border border-amber-400" : "bg-white dark:bg-zinc-900/5 hover:bg-white dark:bg-zinc-900/10"}`}
            >
              <div className="text-[10px] text-white/60 uppercase">{i + 1}</div>
              <div className="text-xs text-white font-semibold truncate">{s.title}</div>
            </button>
          ))}
        </div>

        <p className="text-xs text-amber-200/60 mt-3 text-center">
          {totalSec} seconds total · {SCENES.length} scenes · loop the replay
        </p>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href="/onboarding"
            className="btn bg-amber-500 hover:bg-amber-400 text-slate-900 dark:text-white font-bold px-8 py-4 rounded-lg text-lg inline-flex items-center gap-2"
          >
            <Rocket className="w-5 h-5" /> Open yours — free 7 days
          </Link>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-amber-200">
            <span>
              <Check className="w-3 h-3 inline" /> 30-day money-back
            </span>
            <span>
              <Check className="w-3 h-3 inline" /> No card
            </span>
            <span>
              <Check className="w-3 h-3 inline" /> Live in 60 seconds
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
