/** Single revenue-not-vanity metric card. Server component, no client JS. */
import { type ReactNode } from "react";
import { theme } from "../lib/theme";

interface MetricCardProps {
  label: string;
  value: ReactNode;
  sub?: string;
  accent?: "signal" | "success" | "muted";
}

const accentColor: Record<NonNullable<MetricCardProps["accent"]>, string> = {
  signal: theme.color.accent,
  success: theme.color.success,
  muted: theme.color.textMuted,
};

export function MetricCard({ label, value, sub, accent = "signal" }: MetricCardProps) {
  return (
    <div
      style={{
        backgroundColor: theme.color.surface,
        border: `1px solid ${theme.color.border}`,
        borderRadius: theme.radius.none,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <span
        style={{
          color: theme.color.textMuted,
          fontSize: "12px",
          fontFamily: theme.font.mono,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: accentColor[accent],
          fontSize: "32px",
          fontWeight: 600,
          lineHeight: 1.1,
          fontFamily: theme.font.mono,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </span>
      {sub ? (
        <span style={{ color: theme.color.textMuted, fontSize: "13px" }}>{sub}</span>
      ) : null}
    </div>
  );
}