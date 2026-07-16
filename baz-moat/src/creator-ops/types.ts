/**
 * Creator Ops — types for the unified influencer/creator/UGC/ambassador engine.
 *
 * Surgical, not vibecoded: the hub has seed_influencer, seed_creator, seed_ugc,
 * seed_ambassadors as 4 separate surfaces. This engine unifies them into one
 * creator-ops workflow with the agent-run operational layer — the gap no market
 * leader fills (CreatorIQ/Grin/Aspire/Upfluence all leave outreach, follow-ups,
 * deliverable tracking, and reporting running on your team's time).
 *
 * Lineage: Halbert (starving crowd → the right creator for the right audience) +
 * Cialdini (authority + liking → creator authority signals) + Deiss (the
 * customer value journey → the creator lifecycle) + the BAZ moat (the agent
 * runs the operational layer).
 */

export type CreatorType = "influencer" | "creator" | "ugc" | "ambassador";

export interface Creator {
  id: string;
  handle: string;
  platform: "instagram" | "tiktok" | "youtube" | "x" | "linkedin";
  type: CreatorType;
  /** Follower count. */
  followers: number;
  /** Engagement rate (0-1). */
  engagementRate: number;
  /** Estimated fake-follower percentage (0-1). The authenticity gate. */
  fakeFollowerPct: number;
  /** Audience match score (0-1) — how well the creator's audience matches the brand ICP. */
  audienceMatch: number;
  niche: string;
  /** Average cost per post (USD). */
  costPerPost: number;
}

export type CampaignStage =
  | "discovery"
  | "outreach"
  | "contracting"
  | "content-approval"
  | "publishing"
  | "tracking"
  | "payment"
  | "attribution";

export interface StageStatus {
  stage: CampaignStage;
  status: "pending" | "in-progress" | "complete" | "blocked";
  /** The agent action that runs this stage automatically (the operational layer). */
  agentAction: string;
  /** Human action required, if any. */
  humanAction?: string;
  completedAt?: string;
}

export interface CreatorWorkflow {
  creator: Creator;
  /** Authenticity verdict — the gate. */
  authenticityVerdict: "pass" | "warn" | "fail";
  authenticityScore: number;
  stages: StageStatus[];
  /** Overall progress 0-100. */
  progress: number;
  /** The next action the agent takes (the highest incomplete stage's agent action). */
  nextAgentAction: string;
  /** Whether this workflow needs human intervention. */
  needsHuman: boolean;
}

export interface CreatorOpsInput {
  campaignName: string;
  brand: string;
  /** The ICP the creators' audiences must match. */
  audienceIcp: string;
  creators: Creator[];
  /** Budget for the campaign (USD). */
  budget: number;
}

export interface CreatorOpsOutput {
  campaignName: string;
  brand: string;
  workflows: CreatorWorkflow[];
  /** Creators that passed the authenticity gate. */
  passedGate: CreatorWorkflow[];
  /** Creators flagged or rejected. */
  flaggedGate: CreatorWorkflow[];
  /** Total estimated spend. */
  estimatedSpend: number;
  /** Whether the budget covers the passed creators. */
  budgetOk: boolean;
  markdown: string;
}