/**
 * Deliverability gate — the canonical cold-email hygiene checklist.
 *
 * This is the surgical differentiator: most cold-email tools generate sequences
 * and let you send into spam. This gate MUST pass before a sequence is "ready."
 * 80% of deliverability is domain setup, 20% is platform (industry consensus).
 *
 * Sources: Smartlead/Instantly/Apollo benchmarks (2026), Google/Yahoo 2024
 * bulk-sender rules, Validity 2025 deliverability benchmark (84% industry avg).
 */

import type { GateItem } from "./types.js";

/** The canonical gate. Status is filled per-campaign; defaults to "unknown". */
export const DELIVERABILITY_GATE: readonly Omit<GateItem, "status">[] = [
  {
    id: "spf",
    label: "SPF published",
    why: "Tells receiving servers which IPs may send for your domain. Missing = instant spam flag in 2026.",
    severity: "hard",
  },
  {
    id: "dkim",
    label: "DKIM signed",
    why: "Cryptographic signature that the email wasn't altered. Google + Yahoo now require both SPF + DKIM for bulk senders.",
    severity: "hard",
  },
  {
    id: "dmarc",
    label: "DMARC policy (p=quarantine minimum)",
    why: "Tells receivers what to do when SPF/DKIM fail. Without DMARC you have no deliverability floor.",
    severity: "hard",
  },
  {
    id: "warmup",
    label: "Domain warmup ≥ 14 days",
    why: "A new sending domain needs 14-21 days of warmup before commercial sends. Sending cold from a cold domain = reputation death.",
    severity: "hard",
  },
  {
    id: "per-mailbox-cap",
    label: "Per-mailbox daily cap ≤ 50",
    why: "Cold outreach should stay 30-50 emails/mailbox/day. Higher triggers spam filters regardless of platform.",
    severity: "hard",
  },
  {
    id: "list-verified",
    label: "List verified (bounce < 2%)",
    why: "5-15% of any list is dead. Sending to dead addresses tanks reputation. Verify via NeverBounce/ZeroBounce before send.",
    severity: "hard",
  },
  {
    id: "unsubscribe",
    label: "One-click unsubscribe present",
    why: "Required by Google/Yahoo 2024 bulk-sender rules. Missing = filtered.",
    severity: "hard",
  },
  {
    id: "seed-test",
    label: "Seed test run (inbox placement known)",
    why: "Vendor 'delivered' ≠ inbox. Seed tests (GlockApps) show real placement. Soft because you can send without it, but you're flying blind.",
    severity: "soft",
  },
  {
    id: "complaint-rate",
    label: "Spam complaint rate < 0.1%",
    why: "Above 0.1% (1 per 1000) gets a domain flagged regardless of platform. Above 0.3% is catastrophic.",
    severity: "soft",
  },
] as const;

/** Per-mailbox daily send cap enforced by the builder. Hard ceiling. */
export const PER_MAILBOX_DAILY_CAP = 50;

/** Minimum warmup days before a sequence can send. */
export const MIN_WARMUP_DAYS = 14;

export function gateVerdict(items: GateItem[]): {
  verdict: "send" | "block" | "unknown";
  hardFails: GateItem[];
  softFails: GateItem[];
} {
  const hardFails = items.filter((i) => i.severity === "hard" && i.status === "fail");
  const softFails = items.filter((i) => i.severity === "soft" && i.status === "fail");
  const unknowns = items.filter((i) => i.status === "unknown");
  const verdict: "send" | "block" | "unknown" =
    hardFails.length > 0 ? "block" : unknowns.length > 0 ? "unknown" : "send";
  return { verdict, hardFails, softFails };
}

/** Build the per-campaign gate by overlaying observed statuses onto the canonical checklist. */
export function buildGate(observed: Partial<Record<string, GateItem["status"]>>): GateItem[] {
  return DELIVERABILITY_GATE.map((g) => ({
    ...g,
    status: observed[g.id] ?? "unknown",
  }));
}