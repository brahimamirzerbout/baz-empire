"use client";
import clsx from "clsx";

export function Badge({
  children,
  color = "slate",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return <span className={clsx("chip", `bg-${color}-100 text-${color}-700`)}>{children}</span>;
}

const COLORS: Record<string, string> = {
  draft: "slate",
  scheduled: "sky",
  live: "emerald",
  paused: "amber",
  completed: "violet",
  lead: "slate",
  prospect: "sky",
  customer: "emerald",
  evangelist: "violet",
  churned: "rose",
  qualified: "sky",
  proposal: "violet",
  negotiation: "amber",
  won: "emerald",
  lost: "rose",
  awareness: "sky",
  consideration: "violet",
  conversion: "emerald",
  retention: "amber",
  launch: "rose",
  connected: "emerald",
  disconnected: "slate",
  error: "rose",
};

export function StatusBadge({ status }: { status: string }) {
  const c = COLORS[status] || "slate";
  return <Badge color={c}>{status}</Badge>;
}
