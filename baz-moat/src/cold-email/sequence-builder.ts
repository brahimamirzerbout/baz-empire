/**
 * Sequence builder — generates a multi-touch cold sequence, gated behind
 * deliverability.
 *
 * Lens sequence applied (BAZ synthesis):
 *   Halbert (starving crowd) → the ICP must already be hungry.
 *   Schwartz (awareness)     → entry strategy matches the buyer's stage.
 *   Kennedy (the offer)      → the first yes is small, specific, risk-reversed.
 *   Wiebe (words)            → VoC register, CTA matches intent (not "let's chat").
 *
 * Deterministic + always-works (no LLM dependency). The sequence is the
 * *architecture*; copy is a scaffold the operator refines with real VoC.
 */

import type {
  SequenceInput,
  SequenceOutput,
  SequenceStep,
  AwarenessStage,
} from "./types.js";
import {
  gateVerdict,
  PER_MAILBOX_DAILY_CAP,
  MIN_WARMUP_DAYS,
  buildGate,
} from "./deliverability-gate.js";

/** Entry strategy by awareness stage (Schwartz). */
function entryHook(stage: AwarenessStage, icp: string): string {
  switch (stage) {
    case "unaware":
      return `Pattern-interrupt for ${icp}: open with the cost of the status quo they haven't named yet. No product, no solution.`;
    case "problem-aware":
      return `Lead with the problem for ${icp}, articulated so precisely they feel understood. Only then hint a solution exists.`;
    case "solution-aware":
      return `Lead with the unique mechanism for ${icp} — the how. They know solutions exist; show why yours is different.`;
    case "product-aware":
      return `Lead with proof + differentiation for ${icp}. They know you; answer "why this one, not the alternative."`;
    case "most-aware":
      return `Lead with the offer for ${icp} — price, bonus, deadline. Remove friction to action.`;
  }
}

/** CTA must match the awareness stage (Wiebe: CTA-matches-intent). */
function ctaFor(stage: AwarenessStage): string {
  switch (stage) {
    case "unaware":
      return `Worth 2 minutes to see the number? (send the teardown)`;
    case "problem-aware":
      return `Want the teardown of where the leak is? (one link, no call)`;
    case "solution-aware":
      return `Open to a 15-minute diagnostic — only if I find a leak worth ≥10× the fee?`;
    case "product-aware":
      return `Book the 20-minute strategy call — bring your current numbers.`;
    case "most-aware":
      return `Send the audit + 90-day plan. If no leak ≥10× the fee, you don't pay.`;
  }
}

/** Build the multi-touch sequence. 5 touches: hook → value → proof → bump → breakup. */
function buildSteps(input: SequenceInput): SequenceStep[] {
  const hook = entryHook(input.awareness, input.icp);
  const cta = ctaFor(input.awareness);
  const ch = input.channel;

  return [
    {
      day: 0,
      channel: ch === "mixed" ? "email" : ch,
      intent: "hook",
      hook,
      body: `Open with the starving-crowd trigger: ${input.icp} already burned by a junior-pod agency. Name the leak in dollars. One sentence. No pitch.`,
      cta,
    },
    {
      day: 3,
      channel: ch === "mixed" ? "linkedin" : ch,
      intent: "value",
      hook: `Saw your ${input.icp} is scaling paid — one observation`,
      body: `Bring one specific, observable signal (a job post, a pricing-page change, a recent funding round). Add one quantified result for a comparable account. No ask yet.`,
      cta: `No ask — just flagging it. Reply if useful.`,
    },
    {
      day: 7,
      channel: ch === "mixed" ? "email" : ch,
      intent: "proof",
      hook: `The number for a ${input.icp} like yours`,
      body: `One case study, one metric, one before/after. Name the comparable. The proof must be segment-matched (a B2B SaaS prospect needs a B2B SaaS case, not a DTC one).`,
      cta,
    },
    {
      day: 12,
      channel: ch === "mixed" ? "email" : ch,
      intent: "bump",
      hook: `Quick bump — should I close the loop?`,
      body: `Loss-aversion nudge (Kennedy/Halbert lineage). One line. "Closing the loop on this — say the word and I stop." Don't re-pitch.`,
      cta: `Reply "yes" to keep open, or nothing and I close it.`,
    },
    {
      day: 17,
      channel: ch === "mixed" ? "email" : ch,
      intent: "breakup",
      hook: `Closing your file — last note`,
      body: `The breakup email (highest reply rate in any sequence). Name what they lose by not acting: the leak keeps running at $X/mo. Then actually stop.`,
      cta: `If priorities shifted, reply and I reopen. Otherwise this is the last you'll hear from me.`,
    },
  ];
}

/** Render the full deliverable as markdown. */
function render(input: SequenceInput, out: Omit<SequenceOutput, "markdown">): string {
  const gateRows = input.gate
    .map((g) => {
      const glyph = g.status === "pass" ? "✅" : g.status === "fail" ? (g.severity === "hard" ? "❌" : "⚠️") : "❓";
      return `| ${glyph} | ${g.label} | ${g.status} | ${g.severity} | ${g.why} |`;
    })
    .join("\n");

  const stepRows = out.steps
    .map(
      (s) =>
        `### Day ${s.day + 1} — ${s.intent} (${s.channel})\n**Hook:** ${s.hook}\n\n**Body:** ${s.body}\n\n**CTA:** ${s.cta}\n`,
    )
    .join("\n");

  const verdictLine =
    out.gateVerdict === "send"
      ? `> ✅ **Gate PASSED — cleared to send.** Estimated reach: ${out.estimatedDailyReach}/day across ${input.mailboxCount} mailboxes.`
      : out.gateVerdict === "block"
        ? `> ❌ **Gate BLOCKED — ${out.hardFails.length} hard fail(s). Do not send.** Fix the hard items first.`
        : `> ❓ **Gate UNKNOWN — ${input.gate.filter((i) => i.status === "unknown").length} item(s) unverified.** Verify before sending.`;

  return `# Cold Email Sequence — ${input.name}

**ICP (starving crowd):** ${input.icp}
**Awareness stage:** ${input.awareness}
**Channel:** ${input.channel}
**Offer (the first yes):** ${input.offer}

## Deliverability gate

${verdictLine}

| | Item | Status | Severity | Why |
|---|---|---|---|---|
${gateRows}

**Per-mailbox daily cap:** ${out.perMailboxDailyCap} (hard ceiling)
**Mailboxes in rotation:** ${input.mailboxCount}
**Estimated daily reach:** ${out.estimatedDailyReach}
**Warmup completed:** ${input.warmupDays} days (minimum ${MIN_WARMUP_DAYS})

## Sequence (5 touches — hook → value → proof → bump → breakup)

${stepRows}

## Doctrine held
- Halbert: the crowd must already be starving — don't sell to the unburned.
- Schwartz: entry strategy matches the awareness stage. Wrong stage = dead sequence.
- Kennedy: the offer is the first yes — small, specific, risk-reversed.
- Wiebe: CTA matches intent. A problem-aware buyer gets "want the teardown," not "book a call."
- Breakup email carries the highest reply rate in the sequence — never skip it.

> This sequence is a *scaffold*. Refine copy with real VoC from sales calls and prospect
> replies before sending. The architecture is the moat; the words must be the prospect's.
`;
}

/** Build the full sequence output from an input. Enforces the gate. */
export function buildSequence(input: SequenceInput): SequenceOutput {
  const { verdict, hardFails, softFails } = gateVerdict(input.gate);
  const cap = PER_MAILBOX_DAILY_CAP;
  const steps = buildSteps(input);
  const partial = {
    name: input.name,
    icp: input.icp,
    awareness: input.awareness,
    gateVerdict: verdict,
    hardFails,
    softFails,
    perMailboxDailyCap: cap,
    estimatedDailyReach: input.mailboxCount * cap,
    steps,
  };
  const markdown = render(input, partial);
  return { ...partial, markdown };
}

export { buildGate, MIN_WARMUP_DAYS, PER_MAILBOX_DAILY_CAP };