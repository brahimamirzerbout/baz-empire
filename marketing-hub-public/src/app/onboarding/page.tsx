"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Rocket,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Target,
  Crown,
  Briefcase,
  Heart,
  GraduationCap,
  Wrench,
  Film,
} from "lucide-react";
import clsx from "clsx";

const INDUSTRIES = [
  { id: "b2b_saas", label: "B2B SaaS", icon: Wrench, blurb: "Free trial, freemium, PLG" },
  { id: "ecommerce", label: "E-commerce", icon: Heart, blurb: "DTC, Shopify, retention" },
  { id: "agency", label: "Agency", icon: Briefcase, blurb: "Services for clients" },
  {
    id: "education",
    label: "Education / Creator",
    icon: GraduationCap,
    blurb: "Courses, cohorts, content",
  },
  { id: "media", label: "Media / Publishing", icon: Film, blurb: "Subscribers, ads, content" },
  { id: "consumer", label: "Consumer brand", icon: Crown, blurb: "Awareness, community" },
];

const GOALS = [
  { id: "ship_faster", label: "Ship faster — less planning, more doing", icon: Rocket },
  { id: "attribution", label: "Know which channel drives revenue", icon: Target },
  { id: "lead_magnet", label: "Build a lead magnet that converts", icon: Sparkles },
  { id: "marketplace", label: "Hire a marketer for a sprint", icon: Crown },
];

export default function OnboardingPage() {
  const router = useRouter();
  const params = useSearchParams();
  const welcome = params.get("welcome") === "1";

  const [step, setStep] = useState(welcome ? 2 : 1);
  const [industry, setIndustry] = useState("b2b_saas");
  const [goal, setGoal] = useState("ship_faster");
  const [name, setName] = useState("");
  const [workspace, setWorkspace] = useState("");
  const [busy, setBusy] = useState(false);

  async function finish() {
    setBusy(true);
    try {
      await fetch("/api/onboard", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name || "Founder",
          workspace: workspace || `${name || "My"} Workspace`,
          industry,
          goal,
        }),
      });
    } catch {}
    setBusy(false);
    router.push("/cockpit?welcome=1");
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)" }}
    >
      <div className="w-full max-w-2xl">
        {/* progress */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={clsx(
                "w-12 h-1.5 rounded-full",
                s <= step ? "bg-amber-400" : "bg-slate-700",
              )}
            />
          ))}
        </div>

        <div className="card p-8 md:p-10">
          {step === 1 && (
            <>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                What are you building?
              </h1>
              <p className="text-sm text-slate-600 dark:text-zinc-300 mt-1">
                Pick your industry. We'll seed 12 campaigns, 50 contacts, and a 14-article Wire just
                for you.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                {INDUSTRIES.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => setIndustry(i.id)}
                    className={clsx(
                      "p-4 rounded-lg border-2 text-left transition-all",
                      industry === i.id
                        ? "border-amber-500 bg-amber-50"
                        : "border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:border-zinc-700 dark:border-zinc-700",
                    )}
                  >
                    <i.icon
                      className={clsx(
                        "w-5 h-5 mb-2",
                        industry === i.id ? "text-amber-600" : "text-slate-500 dark:text-zinc-400",
                      )}
                    />
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      {i.label}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{i.blurb}</div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="btn bg-amber-500 hover:bg-amber-400 text-slate-900 dark:text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                What's the goal?
              </h1>
              <p className="text-sm text-slate-600 dark:text-zinc-300 mt-1">
                One goal. We'll bias the entire Cockpit toward it.
              </p>
              <div className="space-y-2 mt-6">
                {GOALS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={clsx(
                      "w-full p-4 rounded-lg border-2 text-left flex items-center gap-3 transition-all",
                      goal === g.id
                        ? "border-amber-500 bg-amber-50"
                        : "border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:border-zinc-700 dark:border-zinc-700",
                    )}
                  >
                    <g.icon
                      className={clsx(
                        "w-5 h-5 flex-shrink-0",
                        goal === g.id ? "text-amber-600" : "text-slate-500 dark:text-zinc-400",
                      )}
                    />
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">
                      {g.label}
                    </span>
                    {goal === g.id && <Check className="w-4 h-4 text-amber-600 ml-auto" />}
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="btn text-slate-600 dark:text-zinc-300 px-4 py-3 flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="btn bg-amber-500 hover:bg-amber-400 text-slate-900 dark:text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                One last thing.
              </h1>
              <p className="text-sm text-slate-600 dark:text-zinc-300 mt-1">
                Your name + workspace name. (You can change both later.)
              </p>
              <div className="space-y-3 mt-6">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-zinc-300 uppercase tracking-wider">
                    Your name
                  </label>
                  <input
                    className="input mt-1"
                    placeholder="Brahim"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-zinc-300 uppercase tracking-wider">
                    Workspace
                  </label>
                  <input
                    className="input mt-1"
                    placeholder="BAZ Empire"
                    value={workspace}
                    onChange={(e) => setWorkspace(e.target.value)}
                  />
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg text-xs text-emerald-800 flex items-start gap-2">
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>No credit card.</strong> 7-day free trial. Then $99/mo with 30-day
                    money-back guarantee.
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="btn text-slate-600 dark:text-zinc-300 px-4 py-3 flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={finish}
                  disabled={busy}
                  className="btn bg-amber-500 hover:bg-amber-400 text-slate-900 dark:text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {busy ? (
                    "Opening…"
                  ) : (
                    <>
                      <Rocket className="w-4 h-4" /> Open Cockpit
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          <div className="mt-6 pt-4 border-t text-center text-xs text-slate-500 dark:text-zinc-400">
            Already have a workspace?{" "}
            <Link href="/login" className="text-amber-600 font-semibold">
              Log in →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
