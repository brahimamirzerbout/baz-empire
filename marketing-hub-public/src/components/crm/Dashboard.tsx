"use client";

import { useMemo } from "react";
import {
  Users, Kanban, Building2, TrendingUp, TrendingDown, DollarSign,
  Target, BarChart3, Sparkles, ChevronRight, ArrowUpRight,
} from "lucide-react";
import { useFetch } from "@/components/useFetch";
import { DEAL_STAGES, formatCurrency, formatNumber } from "@/lib/constants";
import clsx from "clsx";
import type { Tab } from "./CrmTabs";

export default function CrmDashboard({ setTab }: { setTab: (t: Tab) => void }) {
  const { data: contacts } = useFetch<any[]>("/api/contacts");
  const { data: deals } = useFetch<any[]>("/api/deals");

  const totalPipeline = useMemo(
    () => (deals || []).filter((d: any) => !["won", "lost"].includes(d.stage)).reduce((s: number, d: any) => s + (d.value || 0), 0),
    [deals],
  );
  const wonValue = useMemo(
    () => (deals || []).filter((d: any) => d.stage === "won").reduce((s: number, d: any) => s + (d.value || 0), 0),
    [deals],
  );
  const winRate = useMemo(() => {
    if (!deals || !deals.length) return 0;
    return Math.round(((deals as any[]).filter((d: any) => d.stage === "won").length / deals.length) * 100);
  }, [deals]);
  const avgScore = useMemo(() => {
    if (!contacts || !contacts.length) return 0;
    return Math.round((contacts as any[]).reduce((s: number, c: any) => s + (c.score || 0), 0) / contacts.length);
  }, [contacts]);

  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of DEAL_STAGES) { counts[s.id] = 0; }
    for (const deal of deals ?? []) {
      const stage = (deal as Record<string, unknown>)?.stage as string | undefined;
      if (stage) { counts[stage] = (counts[stage] ?? 0) + 1; }
    }
    return counts;
  }, [deals]);

  const recentDeals = useMemo(
    () => [...(deals || [])].sort((a: any, b: any) => (b.created_at || 0) - (a.created_at || 0)).slice(0, 5),
    [deals],
  );

  const recentContacts = useMemo(
    () => [...(contacts || [])].sort((a: any, b: any) => (b.created_at || 0) - (a.created_at || 0)).slice(0, 5),
    [contacts],
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={<DollarSign className="w-5 h-5" />} label="Pipeline Value" value={formatCurrency(totalPipeline)} trend={totalPipeline > 0 ? "up" : "flat"} color="violet" />
        <KPICard icon={<Target className="w-5 h-5" />} label="Won Revenue" value={formatCurrency(wonValue)} trend={wonValue > 0 ? "up" : "flat"} color="emerald" />
        <KPICard icon={<Users className="w-5 h-5" />} label="Contacts" value={formatNumber(contacts?.length || 0)} sub={`Avg score: ${avgScore}`} trend="flat" color="sky" />
        <KPICard icon={<BarChart3 className="w-5 h-5" />} label="Win Rate" value={`${winRate}%`} trend={winRate > 30 ? "up" : "down"} color="amber" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card card-pad">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2"><Kanban className="w-4 h-4 text-[var(--accent)]" /> Pipeline Stages</h3>
            <button className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1" onClick={() => setTab("pipeline")}>View pipeline <ChevronRight className="w-3 h-3" /></button>
          </div>
          <div className="space-y-3">
            {DEAL_STAGES.map((stage) => {
              const count = stageCounts[stage.id] || 0;
              const maxCount = Math.max(...Object.values(stageCounts), 1);
              const pct = Math.max((count / maxCount) * 100, 2);
              return (
                <div key={stage.id} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: stage.color }} />
                  <span className="text-sm w-24 truncate">{stage.label}</span>
                  <div className="flex-1 h-6 rounded-md overflow-hidden" style={{ background: `${stage.color}11` }}>
                    <div className="h-full rounded-md flex items-center px-2 text-xs font-bold transition-all" style={{ width: `${pct}%`, background: `${stage.color}33`, color: stage.color, minWidth: count > 0 ? "2rem" : "0" }}>{count}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card card-pad">
          <h3 className="font-semibold flex items-center gap-2 mb-4"><Sparkles className="w-4 h-4 text-[var(--accent)]" /> Recent Activity</h3>
          <div className="space-y-3">
            <div className="text-xs uppercase font-bold muted tracking-wider mb-2">Latest Deals</div>
            {recentDeals.length === 0 ? (
              <div className="text-center muted py-6 text-sm">No deals yet</div>
            ) : recentDeals.map((d: any) => (
              <div key={d.id} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgb(var(--border))" }}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: DEAL_STAGES.find(s => s.id === d.stage)?.color }} />
                  <span className="font-medium text-sm">{d.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[color-mix(in srgb,var(--accent),black 20%)]">{formatCurrency(d.value)}</span>
                  <span className="text-xs muted">{d.probability}%</span>
                </div>
              </div>
            ))}
            <div className="text-xs uppercase font-bold muted tracking-wider mt-4 mb-2">Latest Contacts</div>
            {(recentContacts || []).slice(0, 3).map((c: any) => (
              <div key={c.id} className="flex items-center gap-3 py-2" style={{ borderBottom: "1px solid rgb(var(--border))" }}>
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[color-mix(in srgb,var(--accent),white 5%)] to-[color-mix(in srgb,var(--accent),black 20%)] text-white text-xs flex items-center justify-center font-semibold">{c.first_name?.[0]}{c.last_name?.[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{c.first_name} {c.last_name}</div>
                  <div className="text-xs muted truncate">{c.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Add Contact", icon: Users, tab: "contacts" as Tab, desc: "Create a new contact record" },
          { label: "New Deal", icon: Kanban, tab: "pipeline" as Tab, desc: "Add deal to pipeline" },
          { label: "Add Company", icon: Building2, tab: "companies" as Tab, desc: "Register a new client" },
        ].map((action) => (
          <button key={action.label} onClick={() => setTab(action.tab)} className="card card-pad text-left hover:scale-[1.01] transition-transform group">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-lg bg-[rgba(var(--theme-brand-rgb),0.1)] text-[var(--accent)]"><action.icon className="w-4 h-4" /></div>
              <span className="font-semibold text-sm group-hover:text-[var(--accent)] transition-colors">{action.label}</span>
              <ArrowUpRight className="w-3.5 h-3.5 muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-xs muted">{action.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function KPICard({ icon, label, value, sub, trend, color }: {
  icon: React.ReactNode; label: string; value: string; sub?: string; trend: "up" | "down" | "flat"; color: string;
}) {
  const colorMap: Record<string, string> = {
    violet: "bg-[var(--accent)]/10 text-[var(--accent)]",
    emerald: "bg-emerald-500/10 text-emerald-400",
    sky: "bg-sky-500/10 text-sky-400",
    amber: "bg-amber-500/10 text-amber-400",
  };
  return (
    <div className="card card-pad relative overflow-hidden group hover:scale-[1.02] transition-transform">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs muted uppercase font-semibold tracking-wider mb-1">{label}</div>
          <div className="text-2xl font-bold">{value}</div>
          {sub && <div className="text-xs muted mt-0.5">{sub}</div>}
        </div>
        <div className={clsx("p-2.5 rounded-xl", colorMap[color])}>{icon}</div>
      </div>
      {trend !== "flat" && (
        <div className={clsx("flex items-center gap-1 mt-2 text-xs font-medium", trend === "up" ? "text-emerald-400" : "text-rose-400")}>
          {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend === "up" ? "Trending up" : "Needs attention"}
        </div>
      )}
    </div>
  );
}