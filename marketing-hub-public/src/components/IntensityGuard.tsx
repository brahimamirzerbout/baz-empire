"use client";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Zap, CheckCircle2, Info } from "lucide-react";
import clsx from "clsx";

/**
 * IntensityGuard — Real-time enforcement of the "Intensity Beats Extensity" principle.
 *
 * Drop into any form or flow where channels, budgets, or campaigns are being selected.
 * Pass it the current state and it renders inline warnings or encouragement.
 */

type GuardProps = {
  /** Number of channels selected */
  channelCount: number;
  /** Number of active live campaigns (optional context) */
  liveCampaignCount?: number;
  /** Budget in USD */
  budget?: number;
  /** Whether a goal is set */
  hasGoal?: boolean;
  /** Compact mode — for inline use in modals */
  compact?: boolean;
};

type CheckResult = {
  level: "perfect" | "good" | "warning" | "critical";
  icon: typeof Zap;
  title: string;
  message: string;
};

function evaluateChannels(count: number): CheckResult {
  if (count === 0)
    return {
      level: "info",
      icon: Info,
      title: "Select a channel",
      message: "Choose ONE channel to dominate.",
    };
  if (count === 1)
    return {
      level: "perfect",
      icon: CheckCircle2,
      title: "Perfect — single channel",
      message: "All force concentrated. This is how you win.",
    };
  if (count === 2)
    return {
      level: "good",
      icon: Zap,
      title: "Good — dual channel",
      message: "Two channels is acceptable. Make sure one is primary.",
    };
  if (count === 3)
    return {
      level: "warning",
      icon: AlertTriangle,
      title: "Warning — three channels",
      message: "Three channels dilutes focus. Consider cutting to two.",
    };
  return {
    level: "critical",
    icon: AlertTriangle,
    title: `Critical — ${count} channels`,
    message: "This is extensity, not intensity. Cut to 1-2 channels.",
  };
}

function evaluateBudget(budget: number): CheckResult | null {
  if (budget === 0) return null;
  if (budget < 500)
    return {
      level: "critical",
      icon: AlertTriangle,
      title: "Budget too thin",
      message: `$${budget}/campaign won't generate real signal. Concentrate or raise the budget.`,
    };
  if (budget < 1000)
    return {
      level: "warning",
      icon: AlertTriangle,
      title: "Budget is light",
      message: `$${budget} may not be enough for statistical significance. Consider concentrating.`,
    };
  if (budget < 5000)
    return {
      level: "good",
      icon: Zap,
      title: "Solid budget",
      message: `$${budget} is enough to generate real data.`,
    };
  return {
    level: "perfect",
    icon: CheckCircle2,
    title: "Strong budget",
    message: `$${budget} provides serious firepower. Use it intensely.`,
  };
}

function evaluateLive(count: number | undefined): CheckResult | null {
  if (count === undefined) return null;
  if (count <= 1)
    return {
      level: "perfect",
      icon: CheckCircle2,
      title: "Focused operation",
      message: `${count} live campaign — maximum intensity.`,
    };
  if (count === 2)
    return {
      level: "good",
      icon: Zap,
      title: "Reasonable spread",
      message: `${count} live campaigns. Manageable focus.`,
    };
  if (count === 3)
    return {
      level: "warning",
      icon: AlertTriangle,
      title: "Spreading thin",
      message: `${count} live campaigns. Each additional one dilutes the others.`,
    };
  return {
    level: "critical",
    icon: AlertTriangle,
    title: "Too many live",
    message: `${count} live campaigns — you're in extensity territory. Pause the weakest.`,
  };
}

const LEVEL_STYLES = {
  perfect: { bg: "rgba(22,163,74,0.08)", border: "rgba(22,163,74,0.25)", color: "#16a34a" },
  good: {
    bg: "rgba(100,100,100,0.06)",
    border: "rgba(100,100,100,0.20)",
    color: "var(--theme-brand, #888)",
  },
  warning: { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.25)", color: "#f59e0b" },
  critical: { bg: "rgba(244,63,94,0.08)", border: "rgba(244,63,94,0.25)", color: "#f43f5e" },
  info: { bg: "rgba(14,165,233,0.06)", border: "rgba(14,165,233,0.20)", color: "#0ea5e9" },
};

export function IntensityGuard({
  channelCount,
  liveCampaignCount,
  budget,
  hasGoal,
  compact,
}: GuardProps) {
  const checks: CheckResult[] = [];
  checks.push(evaluateChannels(channelCount));

  const budgetCheck = budget !== undefined ? evaluateBudget(budget) : null;
  if (budgetCheck) checks.push(budgetCheck);

  const liveCheck = evaluateLive(liveCampaignCount);
  if (liveCheck) checks.push(liveCheck);

  if (hasGoal === false) {
    checks.push({
      level: "warning",
      icon: AlertTriangle,
      title: "No goal set",
      message: "Every campaign needs one clear, singular goal.",
    });
  }

  // Overall verdict
  const hasCritical = checks.some((c) => c.level === "critical");
  const hasWarning = checks.some((c) => c.level === "warning");
  const allPerfect = checks.every((c) => c.level === "perfect" || c.level === "good");
  const verdictLevel = hasCritical
    ? "critical"
    : hasWarning
      ? "warning"
      : allPerfect
        ? "perfect"
        : "good";
  const verdictStyle = LEVEL_STYLES[verdictLevel as keyof typeof LEVEL_STYLES];

  if (compact) {
    // Compact: single inline bar
    const worst = checks.reduce(
      (worst, c) => {
        const order = ["perfect", "good", "warning", "critical"];
        return order.indexOf(c.level) > order.indexOf(worst.level) ? c : worst;
      },
      checks[0] || { level: "info", icon: Info, title: "", message: "" },
    );
    const style = LEVEL_STYLES[worst.level as keyof typeof LEVEL_STYLES];

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="flex items-start gap-2 p-2.5 rounded-lg text-xs"
          style={{ background: style.bg, border: `1px solid ${style.border}` }}
        >
          <worst.icon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: style.color }} />
          <div className="flex-1 min-w-0">
            <span className="font-bold" style={{ color: style.color }}>
              {worst.title}
            </span>
            {" — "}
            <span style={{ color: "rgb(var(--text-secondary))" }}>{worst.message}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-lg p-4 space-y-2.5"
      style={{
        background: `linear-gradient(135deg, ${verdictStyle.bg}, rgb(var(--surface)) 70%)`,
        border: `1px solid ${verdictStyle.border}`,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 pb-1">
        <div
          className="w-6 h-6 rounded-md grid place-items-center flex-shrink-0"
          style={{
            background: verdictStyle.color,
            boxShadow: `0 2px 8px -2px ${verdictStyle.color}40`,
          }}
        >
          <Zap className="w-3 h-3 text-white" fill="currentColor" />
        </div>
        <span
          className="text-[10px] font-bold uppercase tracking-[0.15em]"
          style={{ color: "rgb(var(--muted))" }}
        >
          Intensity Check
        </span>
      </div>

      {/* Individual checks */}
      {checks.map((check, i) => {
        const style = LEVEL_STYLES[check.level as keyof typeof LEVEL_STYLES];
        const Icon = check.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.2 }}
            className="flex items-start gap-2.5 p-2 rounded-lg"
            style={{ background: style.bg }}
          >
            <Icon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: style.color }} />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold block" style={{ color: style.color }}>
                {check.title}
              </span>
              <span
                className="text-xs block mt-0.5"
                style={{ color: "rgb(var(--text-secondary))" }}
              >
                {check.message}
              </span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
