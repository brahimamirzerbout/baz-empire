// ============================================================================
// FinanceCenter — sovereign CFO screen for Noira CRM
// ============================================================================
// Reads finance.ts engine, renders cash position, runway, receivables,
// payables, burn, FX, taxes, and the Nova-β briefing.
//
// Bilingual: switches labels between EN/FR/AR via the user's stored
// preference. Defaults to EN.
// ============================================================================

import { useMemo } from "react";
import { financeSeed, snapshot, formatMoney, type FinanceSnapshot } from "@/lib/finance";
import {
  Sparkle,
  TrendUp,
  TrendDown,
  Briefcase,
  Clock,
  Note,
  Pin,
  Star,
  Check,
  ChevronRight,
  Tag,
  Edit,
} from "@/components/shared/svgs";
import PageShell from "../PageShell";
import { cn } from "@/lib/utils";

type Lang = "ar" | "fr" | "en";

const LABELS = {
  en: {
    title: "Finance Center",
    subtitle: "Sovereign CFO · α memory + β reasoning + γ execution",
    cash: "Cash",
    accounts: "Accounts",
    runway: "Runway",
    burn: "Monthly burn",
    confidence: "Confidence",
    inflow: "Inflow",
    outflow: "Outflow",
    net: "Net",
    receivables: "Receivables",
    payables: "Payables",
    overdue: "Overdue",
    daysLeft: "days",
    burnVsPlan: "Burn vs Plan",
    overBudget: "Over",
    onBudget: "On Track",
    underBudget: "Under",
    taxes: "Tax Obligations",
    dueIn30d: "Due in 30d",
    fxExposure: "FX Exposure",
    ltvCac: "LTV/CAC",
    briefing: "Nova-β Briefing",
    insights: "Insights",
    actions: "Actions",
  },
  fr: {
    title: "Centre Financier",
    subtitle: "CFO souverain · α mémoire + β raisonnement + γ exécution",
    cash: "Trésorerie",
    accounts: "Comptes",
    runway: "Runway",
    burn: "Burn mensuel",
    confidence: "Confiance",
    inflow: "Entrée",
    outflow: "Sortie",
    net: "Net",
    receivables: "Créances",
    payables: "Fournisseurs",
    overdue: "En retard",
    daysLeft: "jours",
    burnVsPlan: "Burn vs Plan",
    overBudget: "Dépassé",
    onBudget: "Conforme",
    underBudget: "Sous",
    taxes: "Obligations fiscales",
    dueIn30d: "Dû sous 30j",
    fxExposure: "Exposition FX",
    ltvCac: "LTV/CAC",
    briefing: "Briefing Nova-β",
    insights: "Insights",
    actions: "Actions",
  },
  ar: {
    title: "المركز المالي",
    subtitle: "المدير المالي السيادي · α ذاكرة + β تفكير + γ تنفيذ",
    cash: "السيولة",
    accounts: "الحسابات",
    runway: "المدرج",
    burn: "الحرق الشهري",
    confidence: "الثقة",
    inflow: "الداخل",
    outflow: "الخارج",
    net: "الصافي",
    receivables: "الذمم المدينة",
    payables: "الذمم الدائنة",
    overdue: "متأخر",
    daysLeft: "يوم",
    burnVsPlan: "الحرق مقابل الخطة",
    overBudget: "تجاوز",
    onBudget: "مطابق",
    underBudget: "أقل",
    taxes: "الالتزامات الضريبية",
    dueIn30d: "مستحق خلال 30 يوم",
    fxExposure: "تعرّض العملات",
    ltvCac: "LTV/CAC",
    briefing: "موجز Nova-β",
    insights: "رؤى",
    actions: "إجراءات",
  },
} as const;

const SEVERITY_CLASSES = {
  info: "bg-sky-500/15 text-sky-300",
  warn: "bg-amber-500/15 text-amber-300",
  critical: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/40",
} as const;

const fmtUsd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

interface FinanceCenterProps {
  language?: Lang;
}

const FinanceCenter = ({ language = "en" }: FinanceCenterProps) => {
  const seed = useMemo(() => financeSeed(), []);
  const snap: FinanceSnapshot = useMemo(() => snapshot(seed, language), [seed, language]);
  const L = LABELS[language];

  return (
    <PageShell
      title={
        <span className="flex items-center gap-3">
          <Briefcase className="h-7 w-7 text-primary-500" />
          {L.title}
        </span>
      }
      description={L.subtitle}
      actions={
        <div className="flex items-center gap-2 text-xs">
          <Sparkle className="h-3.5 w-3.5 text-primary-400" />
          <span className="text-light-3">Nova triangle · α + β + γ</span>
        </div>
      }
    >
      {/* === Briefing banner (the answer the triangle gives) ============ */}
      <section className="rounded-2xl border border-primary-500/30 bg-gradient-to-br from-primary-500/10 via-violet-500/5 to-sky-500/10 p-5">
        <header className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkle className="h-4 w-4 text-primary-400" />
            <h2 className="text-base font-semibold text-light-1">{L.briefing}</h2>
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-primary-500/15 text-primary-300">
              {snap.briefing.producedBy}
            </span>
          </div>
          <span className="text-[10px] text-light-3">
            {new Date(snap.briefing.generatedAt).toLocaleTimeString()}
          </span>
        </header>
        <p className="text-xl font-bold text-light-1 mb-3">{snap.briefing.headline}</p>
        {snap.briefing.insights.length > 0 && (
          <div className="mb-3">
            <p className="text-[10px] uppercase tracking-wider text-light-3 mb-2">{L.insights}</p>
            <div className="space-y-1.5">
              {snap.briefing.insights.map((i, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs",
                    SEVERITY_CLASSES[i.severity],
                  )}
                >
                  {i.severity === "critical" ? (
                    <Star className="h-3.5 w-3.5 flex-shrink-0" />
                  ) : i.severity === "warn" ? (
                    <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                  ) : (
                    <Check className="h-3.5 w-3.5 flex-shrink-0" />
                  )}
                  <span className="text-light-1">{i.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {snap.briefing.actions.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-light-3 mb-2">{L.actions}</p>
            <div className="space-y-1.5">
              {snap.briefing.actions.map((a, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-md bg-primary-500/5 border border-primary-500/20 px-2.5 py-1.5 text-xs text-light-1"
                >
                  <ChevronRight className="h-3 w-3 text-primary-400 flex-shrink-0" />
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* === KPI row ===================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <KpiCard
          icon={<Tag className="h-4 w-4" />}
          label={L.cash}
          value={fmtUsd(snap.position.totalUsd)}
          delta={snap.position.accounts.length}
          deltaLabel={`${snap.position.currencyCount} currencies`}
          trend="up"
          accent="emerald"
        />
        <KpiCard
          icon={<Clock className="h-4 w-4" />}
          label={L.runway}
          value={snap.runway.monthlyBurnUsd === 0 ? "∞" : `${snap.runway.months.toFixed(1)} mo`}
          delta={snap.runway.confidence}
          deltaLabel={L.confidence}
          trend={
            snap.runway.months >= 12 || snap.runway.monthlyBurnUsd === 0
              ? "up"
              : snap.runway.months < 6
                ? "down"
                : "up"
          }
          accent={
            snap.runway.monthlyBurnUsd === 0
              ? "emerald"
              : snap.runway.months < 6
                ? "rose"
                : snap.runway.months < 12
                  ? "amber"
                  : "primary"
          }
        />
        <KpiCard
          icon={<Note className="h-4 w-4" />}
          label={L.burn}
          value={
            snap.runway.monthlyBurnUsd === 0
              ? language === "fr"
                ? "Rentable"
                : language === "ar"
                  ? "ربحي"
                  : "Profitable"
              : fmtUsd(snap.runway.monthlyBurnUsd)
          }
          delta={
            snap.runway.monthlyBurnUsd === 0
              ? 0
              : snap.flow30d.inflowsUsd - snap.flow30d.outflowsUsd
          }
          deltaLabel={snap.runway.monthlyBurnUsd === 0 ? L.inflow : `${L.net} (30d)`}
          trend={snap.runway.monthlyBurnUsd === 0 ? "up" : "down"}
          accent="sky"
        />
        <KpiCard
          icon={<Pin className="h-4 w-4" />}
          label={L.ltvCac}
          value={snap.unit.ltvCacRatio.toFixed(2)}
          delta={
            snap.unit.ltvCacRatio >= 3
              ? "Healthy"
              : snap.unit.ltvCacRatio >= 1
                ? "Watch"
                : "Critical"
          }
          deltaLabel={`CAC ${fmtUsd(snap.unit.cac)}`}
          trend={snap.unit.ltvCacRatio >= 3 ? "up" : "down"}
          accent={snap.unit.ltvCacRatio >= 3 ? "emerald" : "rose"}
        />
      </div>

      {/* === Cash flow + Receivables + Payables ======================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
          <header className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-light-1">Cash Flow · 30d</h2>
              <p className="text-xs text-light-3 mt-0.5">
                {L.inflow} − {L.outflow}
              </p>
            </div>
          </header>
          <div className="space-y-3">
            <Row
              label={L.inflow}
              value={fmtUsd(snap.flow30d.inflowsUsd)}
              icon={<TrendUp className="h-3.5 w-3.5 text-emerald-400" />}
            />
            <Row
              label={L.outflow}
              value={fmtUsd(snap.flow30d.outflowsUsd)}
              icon={<TrendDown className="h-3.5 w-3.5 text-rose-400" />}
            />
            <div className="border-t border-surface-border pt-3">
              <Row
                label={L.net}
                value={fmtUsd(snap.flow30d.netUsd)}
                icon={<Sparkle className="h-3.5 w-3.5 text-primary-400" />}
                bold
              />
            </div>
            {snap.flow30d.byCategory.slice(0, 4).map((c) => (
              <div key={String(c.category)} className="flex items-center gap-2 text-xs">
                <span className="text-light-2 flex-1 capitalize">
                  {String(c.category).replace(/_/g, " ")}
                </span>
                <div className="w-24 h-2 rounded-full bg-surface-muted overflow-hidden">
                  <div
                    className={cn("h-full", c.amountUsd > 0 ? "bg-emerald-500" : "bg-rose-500")}
                    style={{ width: `${Math.min(100, c.pct * 100)}%` }}
                  />
                </div>
                <span className="text-light-1 font-mono w-20 text-right">
                  {fmtUsd(Math.abs(c.amountUsd))}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
          <header className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-light-1">{L.receivables}</h2>
              <p className="text-xs text-light-3 mt-0.5">
                {fmtUsd(snap.receivables.totalOutstandingUsd)} outstanding
              </p>
            </div>
          </header>
          <div className="space-y-2">
            {(["0-30", "31-60", "61-90", "90+"] as const).map((bucket) => {
              const amount = snap.receivables.buckets[bucket];
              const pct =
                snap.receivables.totalOutstandingUsd > 0
                  ? (amount / snap.receivables.totalOutstandingUsd) * 100
                  : 0;
              const tone =
                bucket === "90+"
                  ? "bg-rose-500"
                  : bucket === "61-90"
                    ? "bg-amber-500"
                    : bucket === "31-60"
                      ? "bg-sky-500"
                      : "bg-emerald-500";
              return (
                <div key={bucket}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-light-2">
                      {bucket} {L.daysLeft}
                    </span>
                    <span className="text-light-1 font-mono">
                      {fmtUsd(amount)} ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-muted overflow-hidden">
                    <div className={cn("h-full", tone)} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            <div className="border-t border-surface-border pt-3 mt-3 flex items-center justify-between text-xs">
              <span className="text-light-3">Avg DPD</span>
              <span className="text-light-1 font-mono">
                {snap.receivables.weightedDpd.toFixed(0)} {L.daysLeft}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-light-3">Collection rate</span>
              <span className="text-light-1 font-mono">
                {(snap.receivables.collectionRate * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
          <header className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-light-1">{L.payables}</h2>
              <p className="text-xs text-light-3 mt-0.5">
                {fmtUsd(snap.payables.totalOpenUsd)} open
              </p>
            </div>
          </header>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-light-2">Due 7d</span>
              <span className="text-light-1 font-mono">{fmtUsd(snap.payables.dueIn7dUsd)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-light-2">Due 30d</span>
              <span className="text-light-1 font-mono">{fmtUsd(snap.payables.dueIn30dUsd)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-rose-300">{L.overdue}</span>
              <span className="text-rose-300 font-mono font-semibold">
                {fmtUsd(snap.payables.totalOverdueUsd)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-light-2">Recurring / mo</span>
              <span className="text-light-1 font-mono">
                {fmtUsd(snap.payables.recurringMonthlyUsd)}
              </span>
            </div>
            <div className="border-t border-surface-border pt-3 mt-3">
              <p className="text-[10px] uppercase tracking-wider text-light-3 mb-2">By category</p>
              {snap.payables.byCategory.slice(0, 4).map((c) => (
                <div key={c.category} className="flex items-center justify-between text-xs py-1">
                  <span className="text-light-2 capitalize">{c.category.replace(/_/g, " ")}</span>
                  <span className="text-light-1 font-mono">{fmtUsd(c.amountUsd)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* === Accounts + Burn vs Plan + Taxes =========================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
          <header className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-light-1">{L.accounts}</h2>
              <p className="text-xs text-light-3 mt-0.5">
                {snap.position.concentrationPct.toFixed(0)}% concentration
              </p>
            </div>
          </header>
          <div className="space-y-1.5">
            {snap.position.accounts.map((a) => {
              const usd =
                a.balance.amount *
                ({
                  USD: 1.0,
                  EUR: 1.08,
                  DZD: 0.0075,
                  GBP: 1.27,
                  USDT: 1.0,
                  VOID: 1.0,
                }[a.balance.currency] ?? 1);
              const pctOfTotal =
                snap.position.totalUsd > 0 ? (usd / snap.position.totalUsd) * 100 : 0;
              return (
                <div key={a.id} className="flex items-center gap-2 text-xs">
                  <div className="flex-1 min-w-0">
                    <p className="text-light-1 truncate">{a.label}</p>
                    <p className="text-[10px] text-light-3">{a.institution ?? a.type}</p>
                  </div>
                  <span className="text-light-2 font-mono text-[10px] w-12 text-right">
                    {pctOfTotal.toFixed(0)}%
                  </span>
                  <span className="text-light-1 font-mono w-20 text-right">
                    {formatMoney(a.balance)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
          <header className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-light-1">{L.burnVsPlan}</h2>
              <p className="text-xs text-light-3 mt-0.5">Last 30 days</p>
            </div>
          </header>
          <div className="space-y-2">
            {snap.burn.map((b) => {
              const tone =
                b.status === "over"
                  ? "text-rose-300"
                  : b.status === "under"
                    ? "text-emerald-300"
                    : "text-light-1";
              const sign = b.varianceUsd >= 0 ? "+" : "";
              return (
                <div key={b.category} className="text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-light-2 capitalize">{b.category.replace(/_/g, " ")}</span>
                    <span className={cn("font-mono font-semibold", tone)}>
                      {sign}
                      {fmtUsd(b.varianceUsd)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-light-3 mt-0.5">
                    <span>
                      {fmtUsd(b.actualUsd)} / {fmtUsd(b.plannedUsd)}
                    </span>
                    <span>
                      {b.status === "over"
                        ? L.overBudget
                        : b.status === "under"
                          ? L.underBudget
                          : L.onBudget}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
          <header className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-light-1">{L.taxes}</h2>
              <p className="text-xs text-light-3 mt-0.5">
                {fmtUsd(snap.tax.totalDue30dUsd)} {L.dueIn30d}
              </p>
            </div>
          </header>
          <div className="space-y-2">
            {snap.tax.byKind.map((t) => {
              const kindLabel: Record<string, string> = {
                tva: "TVA (Algeria VAT)",
                ibs: "IBS (Corporate Tax)",
                irg: "IRG (Income Tax)",
                tap: "TAP (Activity Tax)",
                vat_eu: "VAT (EU)",
                sales_tax_us: "Sales Tax (US)",
                income_tax: "Income Tax",
                payroll_tax: "Payroll Tax",
                other: "Other",
              };
              return (
                <div key={t.kind} className="flex items-center gap-2 text-xs">
                  <span className="text-light-2 flex-1">{kindLabel[t.kind] ?? t.kind}</span>
                  <span className="text-light-1 font-mono">{fmtUsd(t.amountUsd)}</span>
                  <span className="text-light-3 text-[10px] w-10 text-right">
                    {(t.pct * 100).toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* === FX Exposure ================================================ */}
      <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
        <header className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-light-1">{L.fxExposure}</h2>
            <p className="text-xs text-light-3 mt-0.5">
              {snap.fx.concentratedCurrencies} currencies above 5% exposure
            </p>
          </div>
          <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-violet-500/15 text-violet-300">
            {snap.fx.largestCurrency.currency}
          </span>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {snap.fx.byCurrency.map((c) => (
            <div
              key={c.currency}
              className="rounded-xl border border-surface-border bg-surface-muted/50 p-3"
            >
              <p className="text-xs text-light-3">{c.currency}</p>
              <p className="text-lg font-bold text-light-1 mt-0.5">{fmtUsd(c.usdEquiv)}</p>
              <div className="mt-2 h-1.5 rounded-full bg-surface-muted overflow-hidden">
                <div
                  className="h-full bg-violet-500"
                  style={{ width: `${Math.min(100, c.pct * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-light-3 mt-1">{(c.pct * 100).toFixed(1)}% of total</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
};

// ---------- Sub-components --------------------------------------------------

interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta?: string | number;
  deltaLabel?: string;
  trend: "up" | "down";
  accent: "primary" | "sky" | "emerald" | "rose" | "violet" | "amber";
}

const ACCENTS: Record<KpiCardProps["accent"], { bg: string; text: string }> = {
  primary: { bg: "bg-primary-500/15", text: "text-primary-400" },
  sky: { bg: "bg-sky-500/15", text: "text-sky-400" },
  emerald: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  rose: { bg: "bg-rose-500/15", text: "text-rose-400" },
  violet: { bg: "bg-violet-500/15", text: "text-violet-400" },
  amber: { bg: "bg-amber-500/15", text: "text-amber-400" },
};

function KpiCard({ icon, label, value, delta, deltaLabel, trend, accent }: KpiCardProps) {
  const a = ACCENTS[accent];
  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card p-4 md:p-5 flex flex-col gap-2 hover:border-surface-muted transition">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-light-3 flex items-center gap-1.5">
          {icon}
          {label}
        </p>
        <span className={cn("h-2 w-2 rounded-full", a.text.replace("text-", "bg-"))} />
      </div>
      <p className="text-2xl md:text-3xl font-bold text-light-1 tracking-tight">{value}</p>
      <div className="flex items-center gap-2 text-xs">
        {delta !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium",
              a.bg,
              a.text,
            )}
          >
            {trend === "up" ? <TrendUp className="h-3 w-3" /> : <TrendDown className="h-3 w-3" />}
            {typeof delta === "number" ? delta : delta}
          </span>
        )}
        {deltaLabel && <span className="text-light-3">{deltaLabel}</span>}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  icon,
  bold,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  bold?: boolean;
}) {
  return (
    <div className={cn("flex items-center justify-between", bold && "font-semibold")}>
      <span
        className={cn("text-sm flex items-center gap-1.5", bold ? "text-light-1" : "text-light-2")}
      >
        {icon}
        {label}
      </span>
      <span className={cn("font-mono", bold ? "text-light-1 text-base" : "text-light-1")}>
        {value}
      </span>
    </div>
  );
}

export default FinanceCenter;
