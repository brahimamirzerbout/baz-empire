"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Gift, Sparkles, Check, ArrowRight, Crown, Zap } from "lucide-react";

export default function LeadMagnetPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, name, company, source: "7-day-marketing-sprint" }),
      });
    } catch {}
    setBusy(false);
    setDone(true);
    setTimeout(() => router.push("/onboarding?welcome=1"), 1500);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white px-4 py-8 relative overflow-hidden">
      {/* Ambient mesh */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(circle at 20% 10%, rgba(var(--theme-brand-rgb), 0.12), transparent 50%), radial-gradient(circle at 80% 80%, rgba(236,72,153,0.08), transparent 50%)",
      }} />
      
      <div className="relative max-w-5xl mx-auto py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-amber-300 text-sm mb-6 hover:text-amber-200 transition-colors">
          <Crown className="w-4 h-4" /> ROI Marketing
        </Link>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* LEFT: pitch */}
          <div>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full" style={{
              background: "rgba(245,158,11,0.12)",
              border: "1px solid rgba(245,158,11,0.2)",
            }}>
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">Free · 7 days · No card</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
              Ship a 7-day marketing sprint{" "}
              <span style={{
                background: "linear-gradient(135deg, #d4af37, var(--theme-brand-secondary))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>in your inbox.</span>
            </h1>
            
            <p className="text-slate-300 mt-4 text-lg leading-relaxed">
              One email a day for 7 days. Each one ships a tactic from the playbook: STP, lead magnet,
              pricing tiers, attribution, retention loop, content machine, marketplace hire.
            </p>
            
            <div className="mt-6 space-y-2">
              {["STP — Segment, Target, Position", "Lead magnet + tripwire", "Pricing tiers (Good-Better-Best)", "Attribution + ROAS", "Retention loop + NPS", "Content engine (GaryVee)", "Marketplace — hire marketers"].map((t, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /> {t}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: glass form */}
          <div className="rounded-2xl p-8" style={{
            background: "rgba(18, 18, 26, 0.72)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(60, 60, 72, 0.4)",
            boxShadow: "0 24px 56px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}>
            {done ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 grid place-items-center" style={{
                  background: "linear-gradient(135deg, #16a34a, #059669)",
                }}>
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">You're in.</h2>
                <p className="text-sm text-slate-400">Day 1 lands in your inbox in 60 seconds.</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3" style={{
                    background: "linear-gradient(135deg, var(--accent), var(--theme-brand-secondary))",
                  }}>
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Start your sprint</h2>
                  <p className="text-sm text-slate-400 mt-1">7 days. 7 tactics. Zero cost.</p>
                </div>

                <form onSubmit={submit} className="space-y-3">
                  <input
                    className="w-full h-11 px-4 rounded-lg text-sm text-white placeholder:text-slate-500"
                    style={{ background: "rgba(26, 26, 36, 0.8)", border: "1px solid rgba(60, 60, 72, 0.6)" }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                  <input
                    className="w-full h-11 px-4 rounded-lg text-sm text-white placeholder:text-slate-500"
                    style={{ background: "rgba(26, 26, 36, 0.8)", border: "1px solid rgba(60, 60, 72, 0.6)" }}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                  />
                  <input
                    className="w-full h-11 px-4 rounded-lg text-sm text-white placeholder:text-slate-500"
                    style={{ background: "rgba(26, 26, 36, 0.8)", border: "1px solid rgba(60, 60, 72, 0.6)" }}
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company (optional)"
                  />
                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full h-12 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2"
                    style={{
                    background: "linear-gradient(135deg, var(--accent), var(--theme-brand-secondary))",
                      boxShadow: "0 8px 24px -4px rgba(var(--theme-brand-rgb), 0.4)",
                      opacity: busy ? 0.5 : 1,
                    }}
                  >
                    {busy ? "Sending…" : "Start Day 1"} <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
                <p className="text-xs text-center text-slate-500 mt-4">
                  No spam. Unsubscribe anytime. Your data stays on your machine.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
