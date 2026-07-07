/**
 * Executive report — text/Markdown summary of the last week's marketing state.
 * Designed for quick copy-paste into Slack/email or to feed a PDF generator.
 */
import { db } from "@/lib/db";
import { fullIntelligence } from "@/lib/intelligence";

export interface ExecReport {
  period: string;
  generatedAt: string;
  headline: string;
  momentum: { score: number; tasks: number; deals: number; emails: number; runs: number };
  velocity: { wonDeals: number; avgDealSize: number; velocityPerDay: number };
  forecast: { score: number; verified: number; active: number; stale: number };
  highlights: string[];
  concerns: string[];
  nextWeekPlays: string[];
  pipeline: Array<{ stage: string; count: number; value: number }>;
  topCampaigns: Array<{ name: string; status: string; budget: number; spent: number }>;
  channelMix: Array<{ channel: string; touches: number }>;
}

export function execReport(periodDays = 7): ExecReport {
  const since = Date.now() - periodDays * 86400000;
  const intel = fullIntelligence();

  // Pipeline by stage
  const stageRows = db
    .prepare(`SELECT stage, COUNT(*) AS n, COALESCE(SUM(value),0) AS v FROM deals GROUP BY stage`)
    .all() as Record<string, unknown>[];
  const pipeline = stageRows.map((s) => ({ stage: s.stage, count: s.n, value: Math.round(s.v) }));

  // Top campaigns by spent
  const campaigns = db
    .prepare(`SELECT name, status, budget, spent FROM campaigns ORDER BY spent DESC LIMIT 5`)
    .all() as Record<string, unknown>[];
  const topCampaigns = campaigns.map((c) => ({
    name: c.name,
    status: c.status,
    budget: c.budget || 0,
    spent: c.spent || 0,
  }));

  // Channel mix: count activities per channel (campaign.channels intersection)
  const campaignChannels = db.prepare(`SELECT channels FROM campaigns`).all() as Record<string, unknown>[];
  const channelCounts: Record<string, number> = {};
  for (const c of campaignChannels) {
    try {
      const arr = JSON.parse(c.channels || "[]");
      for (const ch of arr) channelCounts[ch] = (channelCounts[ch] || 0) + 1;
    } catch {}
  }
  const channelMix = Object.entries(channelCounts)
    .map(([channel, touches]) => ({ channel, touches }))
    .sort((a, b) => b.touches - a.touches);

  const highlights: string[] = [];
  const concerns: string[] = [];

  if (intel.velocity.wonDeals >= 1)
    highlights.push(
      `Closed ${intel.velocity.wonDeals} won deals averaging $${intel.velocity.avgDealSize.toLocaleString()} — pipeline is moving.`,
    );
  if (intel.momentum.dealsProgressed >= 10)
    highlights.push(
      `${intel.momentum.dealsProgressed} deals moved in the last 7 days — strong execution cadence.`,
    );
  if (intel.forecast.active >= 5)
    highlights.push(`${intel.forecast.active} active deals in flight — healthy depth.`);
  if (intel.momentum.insightsGenerated === 0)
    concerns.push("Zero AI agent runs this week. Re-engage the Strategy agents for fresh angles.");

  if (intel.forecast.stale > 0)
    concerns.push(
      `${intel.forecast.stale} deals have gone stale (>30 days untouched). Run a save-list pass.`,
    );
  if (intel.momentum.followupsSent === 0 && intel.velocity.wonDeals > 0)
    concerns.push(
      "No outbound emails logged. Nurture sequences may be stalled — verify automations are firing.",
    );

  // Heuristic next-week plays (Godin: ship something remarkable; Kotler: target the weakest cell)
  const nextWeekPlays: string[] = [];
  if (intel.forecast.stale > 0)
    nextWeekPlays.push(
      `Run a "win-back" blitz on the ${intel.forecast.stale} stale deals — a personal Loom > a templated email.`,
    );
  if (intel.momentum.insightsGenerated < 3)
    nextWeekPlays.push(
      `Spin up Strategy Agents for 3 new campaign briefs (awareness + conversion + retention).`,
    );
  if (channelMix.length && !channelMix.find((c) => c.channel === "email"))
    nextWeekPlays.push(`Email is missing from channel mix. Even a weekly digest compounds.`);
  if (intel.momentum.tasksCompleted < 5)
    nextWeekPlays.push(`Operations cadence is low. Schedule a 30-min weekly marketing standup.`);
  nextWeekPlays.push(
    `Run an A/B test on the top-of-funnel CTA — a 1pt CTR gain often beats a week of new content.`,
  );

  const headline = (() => {
    if (intel.momentum.score >= 80 && intel.velocity.wonDeals >= 2)
      return `Strong week: ${intel.velocity.wonDeals} wins, pipeline velocity $${intel.velocity.velocityPerDay.toLocaleString()}/day.`;
    if (intel.forecast.stale > 0)
      return `Mixed week: ${intel.forecast.stale} stale deals need attention.`;
    return `Steady: momentum ${intel.momentum.score}/100, ${intel.velocity.wonDeals} wins.`;
  })();

  return {
    period: `Last ${periodDays} days`,
    generatedAt: new Date().toISOString(),
    headline,
    momentum: {
      score: intel.momentum.score,
      tasks: intel.momentum.tasksCompleted,
      deals: intel.momentum.dealsProgressed,
      emails: intel.momentum.followupsSent,
      runs: intel.momentum.insightsGenerated,
    },
    velocity: intel.velocity,
    forecast: intel.forecast,
    highlights,
    concerns,
    nextWeekPlays,
    pipeline,
    topCampaigns,
    channelMix,
  };
}

/** Render the report as Markdown — copy-paste friendly. */
export function execReportMarkdown(report: ExecReport): string {
  const lines: string[] = [];
  lines.push(`# ${report.headline}`);
  lines.push(`_${report.period} · Generated ${new Date(report.generatedAt).toLocaleString()}_`);
  lines.push("");
  lines.push(`## KPIs`);
  lines.push(
    `- **Momentum:** ${report.momentum.score}/100 (${report.momentum.tasks} tasks · ${report.momentum.deals} deals · ${report.momentum.emails} emails · ${report.momentum.runs} agent runs)`,
  );
  lines.push(
    `- **Pipeline velocity:** $${report.velocity.velocityPerDay.toLocaleString()}/day (${report.velocity.wonDeals} wins · avg $${report.velocity.avgDealSize.toLocaleString()})`,
  );
  lines.push(
    `- **Forecast confidence:** ${report.forecast.score}% (${report.forecast.verified} verified · ${report.forecast.active} active · ${report.forecast.stale} stale)`,
  );
  lines.push("");
  if (report.highlights.length) {
    lines.push(`## ✅ Highlights`);
    report.highlights.forEach((h) => lines.push(`- ${h}`));
    lines.push("");
  }
  if (report.concerns.length) {
    lines.push(`## ⚠ Concerns`);
    report.concerns.forEach((c) => lines.push(`- ${c}`));
    lines.push("");
  }
  if (report.nextWeekPlays.length) {
    lines.push(`## 🎯 Next-week plays`);
    report.nextWeekPlays.forEach((p) => lines.push(`- ${p}`));
    lines.push("");
  }
  if (report.pipeline.length) {
    lines.push(`## Pipeline by stage`);
    lines.push(`| Stage | Deals | Value |`);
    lines.push(`|---|---:|---:|`);
    report.pipeline.forEach((p) =>
      lines.push(`| ${p.stage} | ${p.count} | $${p.value.toLocaleString()} |`),
    );
    lines.push("");
  }
  if (report.topCampaigns.length) {
    lines.push(`## Top campaigns (by spend)`);
    lines.push(`| Campaign | Status | Budget | Spent |`);
    lines.push(`|---|---|---:|---:|`);
    report.topCampaigns.forEach((c) =>
      lines.push(
        `| ${c.name} | ${c.status} | $${c.budget.toLocaleString()} | $${c.spent.toLocaleString()} |`,
      ),
    );
    lines.push("");
  }
  if (report.channelMix.length) {
    lines.push(`## Channel mix`);
    report.channelMix.forEach((c) =>
      lines.push(`- ${c.channel}: ${c.touches} campaign${c.touches === 1 ? "" : "s"}`),
    );
  }
  return lines.join("\n");
}
