/**
 * Creator Ops engine — unifies influencer/creator/UGC/ambassador into one
 * workflow with the agent-run operational layer.
 *
 * Surgical: the benchmark showed every market leader (CreatorIQ $30k-500k/yr,
 * Grin $399-1799/mo, Aspire ~$2k/mo, Upfluence custom) leaves the operational
 * layer running on your team's time. This engine encodes that layer as agent
 * actions — each stage has a deterministic action the agent runs automatically.
 *
 * The authenticity gate is the surgical differentiator: don't partner with
 * fake-followers. Most tools show follower count; this engine REFUSES to
 * include a creator with >15% fake followers, regardless of reach.
 */

import type { CreatorOpsInput, CreatorOpsOutput, CreatorWorkflow, Creator } from "./types.js";
import { scoreAuthenticity, initStages, computeProgress, nextAction, needsHuman } from "./authenticity-scorer.js";

function buildWorkflow(creator: Creator): CreatorWorkflow {
  const { score, verdict } = scoreAuthenticity(creator);
  // If the creator fails the gate, the workflow stages are all blocked — don't proceed.
  const stages = verdict === "fail"
    ? initStages().map((s, i) => i === 0 ? { ...s, status: "blocked" as const, agentAction: "BLOCKED — creator failed the authenticity gate. Do not partner." } : { ...s, status: "blocked" as const })
    : initStages();

  return {
    creator,
    authenticityVerdict: verdict,
    authenticityScore: score,
    stages,
    progress: verdict === "fail" ? 0 : computeProgress(stages),
    nextAgentAction: verdict === "fail" ? "Creator failed the authenticity gate — reject and find a replacement." : nextAction(stages),
    needsHuman: verdict !== "fail" && needsHuman(stages),
  };
}

function render(input: CreatorOpsInput, out: Omit<CreatorOpsOutput, "markdown">): string {
  const gateLine = out.budgetOk
    ? `> ✅ **Budget covers all passed creators.** Estimated spend: $${out.estimatedSpend.toLocaleString()} / $${input.budget.toLocaleString()} budget.`
    : `> ⚠️ **Budget short.** Estimated spend $${out.estimatedSpend.toLocaleString()} exceeds $${input.budget.toLocaleString()} budget. Drop the lowest-audience-match creator or raise the budget.`;

  const passedRows = out.passedGate
    .map((w) => `| ${w.creator.handle} | ${w.creator.platform} | ${w.creator.followers.toLocaleString()} | ${(w.creator.engagementRate * 100).toFixed(1)}% | ${(w.creator.fakeFollowerPct * 100).toFixed(1)}% | ${w.authenticityScore} | ${w.nextAgentAction.slice(0, 60)}… |`)
    .join("\n");

  const flaggedRows = out.flaggedGate
    .map((w) => `| ${w.creator.handle} | ${w.authenticityVerdict.toUpperCase()} | ${w.authenticityScore} | ${(w.creator.fakeFollowerPct * 100).toFixed(1)}% fake | ${w.nextAgentAction.slice(0, 60)}… |`)
    .join("\n");

  return `# Creator Ops — ${input.campaignName}

**Brand:** ${input.brand}
**Audience ICP:** ${input.audienceIcp}
**Budget:** $${input.budget.toLocaleString()}
**Creators evaluated:** ${out.workflows.length}

${gateLine}

## Authenticity gate (the surgical differentiator)

| Passed | Warned | Rejected |
|---|---|---|
| ${out.passedGate.filter((w) => w.authenticityVerdict === "pass").length} | ${out.passedGate.filter((w) => w.authenticityVerdict === "warn").length} | ${out.flaggedGate.length} |

> Creators with >15% fake followers are REJECTED regardless of reach. The gate
> prevents paying for bots. Most tools show follower count; this engine refuses
> to proceed.

## Passed the gate — in workflow

| Handle | Platform | Followers | Engagement | Fake % | Score | Next agent action |
|---|---|---|---|---|---|---|
${passedRows || "| _(none passed)_ | — | — | — | — | — | — |"}

## Flagged / rejected

| Handle | Verdict | Score | Issue | Next agent action |
|---|---|---|---|---|
${flaggedRows || "| _(none flagged)_ | — | — | — | — |"}

## The operational layer (the gap no market leader fills)

Every stage below runs as an **agent action** — not on your team's time:

| Stage | Agent action | Human action |
|---|---|---|
${out.passedGate[0]?.stages.map((s) => `| ${s.stage} | ${s.agentAction.slice(0, 70)}… | ${s.humanAction ?? "—"} |`).join("\n") ?? "| _(no passed creators)_ | — | — |"}

## Doctrine held
- Halbert: the right creator for the right audience — not the biggest creator for the biggest audience.
- Cialdini: authority + liking — the creator's authenticity IS the persuasion lever. Fake followers break both.
- Deiss: the creator lifecycle IS the customer value journey — discovery → outreach → contract → approval → publish → track → pay → attribute.
- The BAZ moat: the agent runs the operational layer. The benchmark showed this is the gap every leader leaves on your team's time.

> This engine unifies influencer + creator + UGC + ambassador into ONE workflow.
> The 4 separate hub surfaces (seed_influencer, seed_creator, seed_ugc, seed_ambassadors)
> become stages in this one engine, not silos.
`;
}

export function buildCreatorOps(input: CreatorOpsInput): CreatorOpsOutput {
  const workflows = input.creators.map(buildWorkflow);
  const passedGate = workflows.filter((w) => w.authenticityVerdict !== "fail");
  const flaggedGate = workflows.filter((w) => w.authenticityVerdict === "fail");
  const estimatedSpend = passedGate.reduce((s, w) => s + w.creator.costPerPost, 0);
  const budgetOk = estimatedSpend <= input.budget;

  const partial = {
    campaignName: input.campaignName,
    brand: input.brand,
    workflows,
    passedGate,
    flaggedGate,
    estimatedSpend,
    budgetOk,
  };
  const markdown = render(input, partial);

  return { ...partial, markdown };
}