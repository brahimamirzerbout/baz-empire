"use client";
import { useFetch } from "@/components/useFetch";
import { Server, Mail, CreditCard, Brain, Globe, Smartphone, BarChart3, CheckCircle2, XCircle, AlertCircle, Zap } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

const CATEGORY_ICONS: Record<string, any> = {
  core: Server, ai: Brain, billing: CreditCard, email: Mail,
  domains: Globe, analytics: BarChart3, mobile: Smartphone,
};

export default function StatusPage() {
  const { data, loading } = useFetch<Record<string, unknown>>("/api/status");

  if (loading || !data) {
    return (
      <div className="min-h-screen grid place-items-center" style={{ background: "rgb(var(--bg))" }}>
        <div className="animate-pulse text-lg muted">Checking system status…</div>
      </div>
    );
  }

  const checks = data.checks;
  const categories = Object.entries(checks).map(([key, val]: [string, any]) => ({ key, val }));

  return (
    <div className="min-h-screen" style={{ background: "rgb(var(--bg))", color: "rgb(var(--text))" }}>
      {/* HERO */}
      <section className="relative overflow-hidden border-b" style={{ borderColor: "rgb(var(--border))" }}>
        <div className="absolute inset-0 opacity-20" style={{ background: "var(--gradient-mesh)" }} />
        <div className="relative max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 text-xs font-bold uppercase tracking-wider"
            style={{ background: "rgba(34, 197, 94, 0.1)", color: "#22c55e" }}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            All systems operational
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">System Status</h1>
          <p className="text-lg muted mt-4 max-w-xl mx-auto">
            {data.wired_pct}% of integrations wired · v{data.version}
          </p>
          {/* Wired percentage bar */}
          <div className="max-w-xs mx-auto mt-6">
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgb(var(--surface-3))" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${data.wired_pct}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #22c55e, #10b981)" }}
              />
            </div>
            <div className="text-xs muted mt-2">{data.wired_count}/{data.total_categories} categories wired</div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
        {/* CATEGORY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map(({ key, val }, i) => {
            const Icon = CATEGORY_ICONS[key] || Server;
            const isWired = key === "core" || (val as unknown).mode !== "placeholder" && (val as unknown).mode !== "mock" && (val as unknown).mode !== "local" || (
              key === "analytics" && ((val as unknown).plausible?.configured || (val as unknown).posthog?.configured)
            ) || (
              key === "mobile" && ((val as unknown).fcm?.configured || (val as unknown).apns?.configured)
            );

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="card card-pad card-lift card-lift"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={clsx(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    isWired ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-slate-100 dark:bg-zinc-800"
                  )}>
                    <Icon className={clsx("w-5 h-5", isWired ? "text-emerald-500" : "text-slate-400 dark:text-zinc-500")} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold capitalize text-sm">{key}</div>
                    <div className="text-xs muted">{(val as unknown).mode || "live"}</div>
                  </div>
                  {isWired ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    key !== "core" && <AlertCircle className="w-5 h-5 text-amber-500" />
                  )}
                </div>

                {/* Sub-checks */}
                <div className="space-y-1.5">
                  {Object.entries(val as unknown).map(([subKey, subVal]: [string, any]) => {
                    if (typeof subVal === "string" && subKey === "mode") return null;
                    if (typeof subVal === "boolean") {
                      return (
                        <div key={subKey} className="flex items-center gap-2 text-xs">
                          {subVal ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-slate-300 dark:text-zinc-600 flex-shrink-0" />
                          )}
                          <span className="muted">{subKey}</span>
                          {typeof subVal === "boolean" && subVal && (
                            <span className="text-emerald-500 font-semibold ml-auto">configured</span>
                          )}
                        </div>
                      );
                    }
                    if (typeof subVal === "object" && subVal !== null) {
                      return (
                        <div key={subKey} className="flex items-center gap-2 text-xs">
                          {subVal.configured ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-slate-300 dark:text-zinc-600 flex-shrink-0" />
                          )}
                          <span className="muted">{subKey}</span>
                          {subVal.configured && (
                            <span className="text-emerald-500 font-semibold ml-auto">✓</span>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* RECOMMENDATIONS */}
        {data.recommendations && data.recommendations.length > 0 && (
          <div className="card card-pad card-lift card-lift">
            <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Recommendations
            </h2>
            <div className="space-y-2">
              {data.recommendations.map((rec: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-zinc-400">
                  <span className="text-amber-500 mt-0.5">→</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MERGED SITE CHECKS */}
        {data.merged_site && (
          <div className="card card-pad card-lift card-lift">
            <h2 className="font-bold text-sm mb-3">Public site endpoints</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {data.merged_site.checks?.map((c: Record<string, unknown>, i: number) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  {c.ok ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  )}
                  <span className="muted">{c.label}</span>
                  <span className={clsx("text-xs ml-auto", c.ok ? "text-emerald-500" : "text-rose-500")}>
                    {c.ok ? "live" : "down"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="text-center text-xs muted pt-4">
          Last checked: {new Date(data.timestamp).toLocaleString()} · v{data.version}
        </div>
      </div>
    </div>
  );
}