/**
 * Cold Email — types for the deliverability-gated sequence builder.
 *
 * Surgical, not vibecoded: a sequence is only "ready" when the deliverability
 * gate passes. Sequence generation is gated behind hygiene — SPF/DKIM/DMARC,
 * warmup, per-mailbox caps, list verification, seed testing. No gate, no send.
 *
 * Lineage: Halbert (starving crowd) → Schwartz (awareness → entry strategy) →
 * Kennedy (the offer + sequential follow-up) → Wiebe (VoC + CTA-matches-intent).
 */

/** The deliverability gate items. Each must pass before a sequence can send. */
export interface GateItem {
  id: string;
  label: string;
  /** Why it matters, in operator language. */
  why: string;
  /** Observed state of this item for the campaign. */
  status: "pass" | "fail" | "unknown";
  /** If fail/unknown, the block is hard (cannot send) or soft (warn). */
  severity: "hard" | "soft";
  evidence?: string;
}

export type AwarenessStage =
  | "unaware"
  | "problem-aware"
  | "solution-aware"
  | "product-aware"
  | "most-aware";

export interface SequenceInput {
  /** Campaign name. */
  name: string;
  /** The starving crowd — who and why hungry (Halbert). */
  icp: string;
  /** Primary channel for the sequence. */
  channel: "email" | "linkedin" | "mixed";
  /** The offer / first yes (Kennedy). */
  offer: string;
  /** Buyer awareness stage (Schwartz) — decides entry strategy. */
  awareness: AwarenessStage;
  /** Number of sending mailboxes in rotation. */
  mailboxCount: number;
  /** Days of warmup completed on the sending domains. */
  warmupDays: number;
  /** Observed deliverability gate state (provider-supplied). */
  gate: GateItem[];
}

export type StepChannel = "email" | "linkedin" | "call";

export interface SequenceStep {
  /** Day offset from sequence start (0 = day 1). */
  day: number;
  channel: StepChannel;
  /** The job of this touch (hook / value / proof / bump / breakup). */
  intent: string;
  /** The subject line (email) or connection-note hook (linkedin). */
  hook: string;
  /** Body copy scaffold — VoC-grounded, CTA matches the awareness stage. */
  body: string;
  /** The single ask — small, specific, matches intent. */
  cta: string;
}

export interface SequenceOutput {
  name: string;
  icp: string;
  awareness: AwarenessStage;
  /** Overall gate verdict — "send" only if zero hard fails. */
  gateVerdict: "send" | "block" | "unknown";
  hardFails: GateItem[];
  softFails: GateItem[];
  /** Per-mailbox daily send cap enforced by the builder. */
  perMailboxDailyCap: number;
  /** Estimated daily reach = mailboxes × cap. */
  estimatedDailyReach: number;
  steps: SequenceStep[];
  /** Markdown deliverable. */
  markdown: string;
}