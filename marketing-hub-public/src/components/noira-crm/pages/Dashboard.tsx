import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDashboard, useContacts, useDeals, useTasks } from "@/lib/crm/queries";
import { crmFormat, PIPELINE_STAGES, STAGE_BY_ID } from "@/lib/crm/store";
import PageShell from "../PageShell";
import { Monogram } from "@/components/crm/Monogram";
import NovaScoresPanel from "../components/NovaScoresPanel";
import Button from "@/components/shared/Button";
import { useToast } from "@/components/shared/Toaster";
import { Onboarding, isOnboardingDone } from "./Onboarding";
import {
  Dashboard as DashboardIcon,
  TrendUp,
  TrendDown,
  Deal as DealIcon,
  Contact as ContactIcon,
  Tasks as TasksIcon,
  Chart as ChartIcon,
  Sparkle,
  ChevronRight,
  Calendar,
  Phone,
  Mail,
  Note,
  Clock,
  Briefcase,
  Tag,
} from "@/components/shared/svgs";
import { cn } from "@/lib/utils";
import { priorityStyle, stageStyle, taskTypeStyle } from "../constants";
import type { TaskType } from "@/lib/crm/types";

const taskTypeIcon: Record<TaskType, typeof Calendar> = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  todo: TasksIcon,
  note: Note,
  follow_up: Clock,
};

const Dashboard = () => {
  const { data: kpis, isLoading } = useDashboard();
  const { data: contacts } = useContacts();
  const { data: deals } = useDeals();
  const { data: tasks } = useTasks();
  const { showToast } = useToast();
  const [sparklineRange] = useState<"7d" | "30d">("7d");
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Show onboarding when the user has fewer than 3 contacts and hasn't
  // completed it yet. The seed has 16 contacts so this gates true first-run.
  useEffect(() => {
    if (!contacts) return;
    const done = isOnboardingDone();
    const fewContacts = contacts.length < 3;
    setShowOnboarding(!done && fewContacts);
  }, [contacts]);

  const openDeals = useMemo(
    () => (deals || []).filter((d) => d.stage !== "won" && d.stage !== "lost"),
    [deals],
  );
  const upcomingTasks = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return (tasks || [])
      .filter((t) => t.status === "open")
      .sort((a, b) => {
        const aDue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const bDue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return aDue - bDue;
      })
      .slice(0, 6);
  }, [tasks]);
  const recentContacts = useMemo(
    () =>
      (contacts || [])
        .slice()
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 5),
    [contacts],
  );

  if (isLoading || !kpis) {
    return (
      <PageShell title="Loading dashboard…">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl border border-surface-border bg-surface-card animate-pulse"
            />
          ))}
        </div>
      </PageShell>
    );
  }

  const maxActivity = Math.max(1, ...kpis.activityByDay.map((d) => d.value));
  const maxStageValue = Math.max(1, ...kpis.pipelineByStage.map((s) => s.value));

  return (
    <>
      <PageShell
        title={
          <span className="flex items-center gap-3">
            <DashboardIcon className="h-7 w-7 text-primary-500" />
            Sales Dashboard
          </span>
        }
        description="Real-time pulse of your pipeline, customers, and team activity."
        actions={
          <>
            <Link to="/crm/pipeline">
              <Button variant="ghost">View pipeline</Button>
            </Link>
            <Link to="/crm/contacts?new=1">
              <Button>
                <ContactIcon className="h-4 w-4" />
                New contact
              </Button>
            </Link>
          </>
        }
      >
        {/* === KPI row ============================================================ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <KpiCard
            label="Pipeline value"
            value={crmFormat.money(kpis.pipelineValue)}
            delta={kpis.openDeals}
            deltaLabel="open deals"
            trend="up"
            accent="primary"
            hint="Sum of all open deals"
          />
          <KpiCard
            label="Weighted forecast"
            value={crmFormat.money(kpis.weightedPipeline)}
            delta={Math.round((kpis.weightedPipeline / Math.max(1, kpis.pipelineValue)) * 100)}
            deltaLabel="probability-weighted"
            trend="up"
            accent="sky"
            hint="Amount × probability"
          />
          <KpiCard
            label="Closed-won (this month)"
            value={crmFormat.money(kpis.wonValueThisMonth)}
            delta={kpis.wonThisMonth}
            deltaLabel={`vs ${kpis.lostThisMonth} lost`}
            trend={kpis.wonThisMonth >= kpis.lostThisMonth ? "up" : "down"}
            accent="emerald"
            hint={`Win rate ${crmFormat.percent(kpis.winRate)} · last 90d`}
          />
          <KpiCard
            label="Open tasks"
            value={String(kpis.openTasks)}
            delta={kpis.overdueTasks}
            deltaLabel="overdue"
            trend={kpis.overdueTasks > 0 ? "down" : "up"}
            accent={kpis.overdueTasks > 0 ? "rose" : "violet"}
            hint={`${kpis.tasksCompletedThisWeek} done this week`}
          />
        </div>

        {/* === Nova S-tier scoring panel ============================================ */}
        <NovaScoresPanel />

        {/* === Pipeline funnel + activity ========================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <section className="rounded-2xl border border-surface-border bg-surface-card p-5 lg:col-span-2">
            <header className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-light-1">Pipeline by stage</h2>
                <p className="text-xs text-light-3 mt-0.5">Where the money is sitting</p>
              </div>
              <Link
                to="/crm/pipeline"
                className="text-xs text-primary-500 hover:text-primary-400 flex items-center gap-1"
              >
                Open board <ChevronRight className="h-3 w-3" />
              </Link>
            </header>

            <div className="flex flex-col gap-3">
              {PIPELINE_STAGES.filter((s) => s.id !== "lost").map((stage) => {
                const s = kpis.pipelineByStage.find((x) => x.stage === stage.id);
                const value = s?.value ?? 0;
                const count = s?.count ?? 0;
                const width = maxStageValue === 0 ? 0 : (value / maxStageValue) * 100;
                const sStyle = stageStyle(stage.color);
                return (
                  <div key={stage.id} className="flex items-center gap-3">
                    <div className="w-24 flex-shrink-0 flex items-center gap-2">
                      <span className={cn("h-2.5 w-2.5 rounded-full flex-shrink-0", sStyle.dot)} />
                      <span className="text-sm text-light-1 truncate">{stage.label}</span>
                    </div>
                    <div className="flex-1 h-7 rounded-md bg-surface-muted overflow-hidden relative">
                      <div
                        className={cn("h-full rounded-md transition-all", sStyle.bg)}
                        style={{ width: `${Math.max(value > 0 ? 6 : 0, width)}%` }}
                      />
                      <div className="absolute inset-0 px-3 flex items-center justify-between text-xs">
                        <span className="text-light-1 font-medium">
                          {count} deal{count === 1 ? "" : "s"}
                        </span>
                        <span className="text-light-2 font-mono">{crmFormat.money(value)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
            <header className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-light-1">Activity</h2>
                <p className="text-xs text-light-3 mt-0.5">Completed tasks & won deals</p>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-light-3">
                Last {sparklineRange === "7d" ? "7 days" : "30 days"}
              </span>
            </header>

            <div className="flex items-end justify-between gap-2 h-32 mb-3">
              {kpis.activityByDay.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex-1 flex items-end">
                    <div
                      className="w-full rounded-md bg-gradient-to-t from-primary-600 to-primary-400 transition-all"
                      style={{
                        height: `${(d.value / maxActivity) * 100}%`,
                        minHeight: d.value > 0 ? "6px" : "2px",
                        opacity: d.value === 0 ? 0.3 : 1,
                      }}
                      title={`${d.day}: ${d.value}`}
                    />
                  </div>
                  <span className="text-[10px] text-light-3">{d.day}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-surface-border pt-3 mt-3 space-y-2">
              <p className="text-[10px] uppercase tracking-wider text-light-3">Top performers</p>
              {kpis.topOwners.slice(0, 3).map((o) => (
                <div key={o.ownerId} className="flex items-center gap-2 text-xs">
                  <Monogram name={o.ownerName} color="indigo" size="sm" />
                  <span className="text-light-1 flex-1 truncate">{o.ownerName}</span>
                  <span className="text-light-2 font-mono">{crmFormat.money(o.value)}</span>
                </div>
              ))}
              {kpis.topOwners.length === 0 ? (
                <p className="text-xs text-light-3">No closed deals yet.</p>
              ) : null}
            </div>
          </section>
        </div>

        {/* === Upcoming tasks + Recent contacts + Top deals ======================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
            <header className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-light-1 flex items-center gap-2">
                  <TasksIcon className="h-4 w-4 text-primary-500" />
                  Upcoming tasks
                </h2>
                <p className="text-xs text-light-3 mt-0.5">What you should do next</p>
              </div>
              <Link
                to="/crm/tasks"
                className="text-xs text-primary-500 hover:text-primary-400 flex items-center gap-1"
              >
                All tasks <ChevronRight className="h-3 w-3" />
              </Link>
            </header>

            <ul className="space-y-2">
              {upcomingTasks.length === 0 ? (
                <p className="text-xs text-light-3">No open tasks — you're all caught up! 🎉</p>
              ) : (
                upcomingTasks.map((t) => {
                  const TypeIcon = taskTypeIcon[t.type] || TasksIcon;
                  const ts = taskTypeStyle(t.type);
                  const ps = priorityStyle(t.priority);
                  const overdue =
                    t.dueDate && new Date(t.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));
                  const dueLabel = t.dueDate
                    ? overdue
                      ? `${Math.abs(daysUntil(t.dueDate))}d overdue`
                      : daysUntil(t.dueDate) === 0
                        ? "Today"
                        : daysUntil(t.dueDate) === 1
                          ? "Tomorrow"
                          : crmFormat.date(t.dueDate)
                    : "No date";
                  return (
                    <li
                      key={t.id}
                      className="flex items-center gap-3 rounded-lg p-2 hover:bg-surface-muted transition cursor-pointer"
                      onClick={() => showToast("Open the Tasks page to manage", "default")}
                    >
                      <div
                        className={cn(
                          "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          ts.bg,
                          ts.text,
                        )}
                      >
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-light-1 truncate">{t.title}</p>
                        <div className="flex items-center gap-2 text-[11px] text-light-3">
                          <span className={cn(ps.text)}>{t.priority}</span>
                          <span>·</span>
                          <span className={cn(overdue && "text-rose-300 font-medium")}>
                            {dueLabel}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </section>

          <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
            <header className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-light-1 flex items-center gap-2">
                  <ContactIcon className="h-4 w-4 text-primary-500" />
                  Recent contacts
                </h2>
                <p className="text-xs text-light-3 mt-0.5">Newest people in your book</p>
              </div>
              <Link
                to="/crm/contacts"
                className="text-xs text-primary-500 hover:text-primary-400 flex items-center gap-1"
              >
                All <ChevronRight className="h-3 w-3" />
              </Link>
            </header>
            <ul className="space-y-2">
              {recentContacts.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/crm/contacts/${c.id}`}
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-surface-muted transition"
                  >
                    <Monogram name={c.fullName} color={c.avatarColor} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-light-1 truncate">{c.fullName}</p>
                      <p className="text-[11px] text-light-3 truncate">
                        {c.title ? `${c.title}` : c.email}
                      </p>
                    </div>
                    <span className="text-[10px] text-light-3">
                      {crmFormat.relative(c.createdAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
            <header className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-light-1 flex items-center gap-2">
                  <DealIcon className="h-4 w-4 text-primary-500" />
                  Top open deals
                </h2>
                <p className="text-xs text-light-3 mt-0.5">Sorted by value</p>
              </div>
              <Link
                to="/crm/pipeline"
                className="text-xs text-primary-500 hover:text-primary-400 flex items-center gap-1"
              >
                Pipeline <ChevronRight className="h-3 w-3" />
              </Link>
            </header>
            <ul className="space-y-2">
              {openDeals.length === 0 ? (
                <p className="text-xs text-light-3">No open deals — add one from the pipeline.</p>
              ) : (
                openDeals
                  .slice()
                  .sort((a, b) => b.amount - a.amount)
                  .slice(0, 5)
                  .map((d) => {
                    const stage = STAGE_BY_ID[d.stage];
                    const s = stageStyle(stage.color);
                    const contact = (contacts || []).find((c) => c.id === d.contactId);
                    return (
                      <li key={d.id}>
                        <Link
                          to={`/crm/pipeline?deal=${d.id}`}
                          className="block rounded-lg p-2 hover:bg-surface-muted transition"
                        >
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-light-1 truncate flex-1">{d.name}</p>
                            <span className="text-xs font-mono text-light-1">
                              {crmFormat.money(d.amount, d.currency)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] mt-1">
                            <span
                              className={cn(
                                "px-1.5 py-0.5 rounded-md text-[10px] font-medium",
                                s.bg,
                                s.text,
                              )}
                            >
                              {stage.label}
                            </span>
                            <span className="text-light-3 truncate">
                              {contact?.fullName ?? "—"}
                            </span>
                          </div>
                        </Link>
                      </li>
                    );
                  })
              )}
            </ul>
          </section>
        </div>

        {/* === Footer insight strip =============================================== */}
        <section className="rounded-2xl border border-primary-500/20 bg-gradient-to-br from-primary-500/10 via-violet-500/5 to-sky-500/10 p-5">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkle className="h-5 w-5 text-primary-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-light-1">Insight</p>
              <p className="text-sm text-light-2">
                You have{" "}
                <span className="text-light-1 font-semibold">
                  {kpis.overdueTasks} overdue task{kpis.overdueTasks === 1 ? "" : "s"}
                </span>{" "}
                and{" "}
                <span className="text-light-1 font-semibold">
                  {kpis.openDeals} open deal{kpis.openDeals === 1 ? "" : "s"}
                </span>{" "}
                in negotiation. Average deal size is{" "}
                <span className="text-light-1 font-semibold">
                  {crmFormat.money(kpis.averageDealSize)}
                </span>
                .
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-light-2">
              <span className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                {kpis.totalDeals} total deals
              </span>
              <span className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                {kpis.totalContacts} contacts
              </span>
              <span className="flex items-center gap-1">
                <ChartIcon className="h-4 w-4" />
                {crmFormat.percent(kpis.winRate)} win rate
              </span>
            </div>
          </div>
        </section>
      </PageShell>
      {showOnboarding && <Onboarding onDone={() => setShowOnboarding(false)} />}
    </>
  );
};

function daysUntil(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - now.getTime()) / (24 * 3600 * 1000));
}

interface KpiCardProps {
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  trend: "up" | "down";
  accent: "primary" | "sky" | "emerald" | "rose" | "violet" | "amber";
  hint?: string;
}

const ACCENTS: Record<KpiCardProps["accent"], { bg: string; text: string }> = {
  primary: { bg: "bg-primary-500/15", text: "text-primary-400" },
  sky: { bg: "bg-sky-500/15", text: "text-sky-400" },
  emerald: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  rose: { bg: "bg-rose-500/15", text: "text-rose-400" },
  violet: { bg: "bg-violet-500/15", text: "text-violet-400" },
  amber: { bg: "bg-amber-500/15", text: "text-amber-400" },
};

function KpiCard({ label, value, delta, deltaLabel, trend, accent, hint }: KpiCardProps) {
  const a = ACCENTS[accent];
  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card p-4 md:p-5 flex flex-col gap-2 hover:border-surface-muted transition">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-light-3">{label}</p>
        <span className={cn("h-2 w-2 rounded-full", a.text.replace("text-", "bg-"))} />
      </div>
      <p className="text-2xl md:text-3xl font-bold text-light-1 tracking-tight">{value}</p>
      <div className="flex items-center gap-2 text-xs">
        {delta !== undefined ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium",
              a.bg,
              a.text,
            )}
          >
            {trend === "up" ? <TrendUp className="h-3 w-3" /> : <TrendDown className="h-3 w-3" />}
            {delta}
          </span>
        ) : null}
        {deltaLabel ? <span className="text-light-3">{deltaLabel}</span> : null}
      </div>
      {hint ? <p className="text-[10px] text-light-4 mt-0.5">{hint}</p> : null}
    </div>
  );
}

export default Dashboard;
