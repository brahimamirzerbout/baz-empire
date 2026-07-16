/**
 * Authenticity scorer — the gate that prevents partnering with fake-followers.
 *
 * Surgical: most influencer tools show follower count and engagement rate but
 * don't GATE on authenticity. This engine refuses to include a creator in the
 * workflow if their fake-follower % is too high, regardless of follower count.
 *
 * 3 factors, weighted:
 *   Fake-follower %    (40) — lower is better. >15% = fail. 8-15% = warn. <8% = pass.
 *   Engagement rate    (30) — 2%+ is healthy. <1% is suspicious (bought followers).
 *   Audience match      (30) — how well the creator's audience matches the brand ICP.
 *
 * Verdict: 70+ = pass. 40-69 = warn (proceed with caution, verify audience). <40 = fail.
 */

import type { Creator } from "./types.js";

export function scoreAuthenticity(creator: Creator): { score: number; verdict: "pass" | "warn" | "fail" } {
  // Fake-follower %: 0% = 40 points, 15%+ = 0 points. Linear.
  const fakePts = Math.max(0, 40 - (creator.fakeFollowerPct * 40) / 0.15);

  // Engagement rate: 0% = 0, 5%+ = 30. Linear, capped.
  const engPts = Math.min(30, (creator.engagementRate / 0.05) * 30);

  // Audience match: 0 = 0, 1.0 = 30.
  const matchPts = creator.audienceMatch * 30;

  const score = Math.round(fakePts + engPts + matchPts);
  const verdict: "pass" | "warn" | "fail" =
    score >= 70 ? "pass" : score >= 40 ? "warn" : "fail";

  return { score, verdict };
}

/** The canonical campaign stages + the agent action for each (the operational layer). */
export const STAGE_AGENTS: ReadonlyArray<{ stage: CampaignStage; agentAction: string; humanAction?: string }> = [
  {
    stage: "discovery",
    agentAction: "Agent scans the creator database against the ICP, scores authenticity, and ranks by audience-match × engagement × (1 - fake-follower%).",
  },
  {
    stage: "outreach",
    agentAction: "Agent sends the first-touch DM/email with a personalized hook (the creator's recent content), the offer, and a single ask (a 15-minute intro call).",
    humanAction: "Review the agent's outreach copy for brand voice before it sends.",
  },
  {
    stage: "contracting",
    agentAction: "Agent generates the contract from the template (scope, deliverables, timeline, usage rights, payment terms) and sends for e-signature.",
    humanAction: "Approve the contract terms before the agent sends.",
  },
  {
    stage: "content-approval",
    agentAction: "Agent receives the submitted content, checks it against the brief (format, brand guidelines, required talking points), and flags for human review.",
    humanAction: "Approve or request revisions.",
  },
  {
    stage: "publishing",
    agentAction: "Agent confirms the creator published on schedule, captures the live URL, and logs the post metrics (reach, engagement, clicks).",
  },
  {
    stage: "tracking",
    agentAction: "Agent tracks post-performance daily for 14 days, logs UTM-clicks, engagement, and sentiment, and flags underperforming content for boost consideration.",
  },
  {
    stage: "payment",
    agentAction: "Agent triggers payment on milestone completion (post live + 7-day tracking), reconciles against the contract, and logs the spend.",
    humanAction: "Approve payment release.",
  },
  {
    stage: "attribution",
    agentAction: "Agent attributes UTM-clicked conversions to the creator, computes CPA and ROAS per creator, and compiles the campaign report.",
  },
] as const;

import type { CampaignStage, StageStatus, CreatorWorkflow } from "./types.js";

/** Build the stage status list — all start as "pending" except discovery (in-progress). */
export function initStages(): StageStatus[] {
  return STAGE_AGENTS.map((s, i) => ({
    stage: s.stage,
    status: i === 0 ? "in-progress" : "pending",
    agentAction: s.agentAction,
    humanAction: s.humanAction,
  }));
}

/** Compute overall progress from stage statuses. */
export function computeProgress(stages: StageStatus[]): number {
  const complete = stages.filter((s) => s.status === "complete").length;
  const inProgress = stages.filter((s) => s.status === "in-progress").length;
  return Math.round(((complete + inProgress * 0.5) / stages.length) * 100);
}

/** Find the next agent action (the highest incomplete stage). */
export function nextAction(stages: StageStatus[]): string {
  const next = stages.find((s) => s.status === "pending" || s.status === "in-progress" || s.status === "blocked");
  return next?.agentAction ?? "All stages complete — campaign closed.";
}

/** Does the workflow need human intervention? */
export function needsHuman(stages: StageStatus[]): boolean {
  return stages.some((s) => s.humanAction && s.status !== "complete");
}