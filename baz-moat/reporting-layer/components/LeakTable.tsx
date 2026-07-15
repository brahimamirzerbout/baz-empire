/** The tracking-default audit table. Server component. */
import { theme } from "../lib/theme";
import { usd, pct, type LeakResult } from "../lib/report";

const statusGlyph: Record<LeakResult["status"], string> = {
  present: "✅",
  partial: "🟡",
  missing: "❌",
  broken: "⚠️",
};

export function LeakTable({ leaks }: { leaks: LeakResult[] }) {
  return (
    <div
      style={{
        backgroundColor: theme.color.surface,
        border: `1px solid ${theme.color.border}`,
        borderRadius: theme.radius.none,
        overflow: "hidden",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: theme.font.ui,
          fontSize: "14px",
        }}
      >
        <thead>
          <tr style={{ borderBottom: `1px solid ${theme.color.border}` }}>
            {["", "Component", "Status", "Effective leak", "Annual $"].map((h) => (
              <th
                key={h}
                style={{
                  textAlign: "left",
                  padding: "14px 16px",
                  color: theme.color.textMuted,
                  fontSize: "11px",
                  fontFamily: theme.font.mono,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leaks.map((l) => {
            const leak = l.effectiveFraction > 0 ? usd(l.annualLeak) : "—";
            return (
              <tr
                key={l.componentId}
                style={{ borderBottom: `1px solid ${theme.color.border}` }}
              >
                <td style={{ padding: "12px 16px", width: "28px" }}>
                  {statusGlyph[l.status]}
                </td>
                <td style={{ padding: "12px 16px", color: theme.color.text }}>
                  {l.label}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    color: theme.color.textMuted,
                    fontFamily: theme.font.mono,
                    fontSize: "13px",
                  }}
                >
                  {l.status}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    color: l.effectiveFraction > 0 ? theme.color.warn : theme.color.textMuted,
                    fontFamily: theme.font.mono,
                    fontSize: "13px",
                  }}
                >
                  {pct(l.effectiveFraction)}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    color: l.annualLeak > 0 ? theme.color.accent : theme.color.textMuted,
                    fontFamily: theme.font.mono,
                    fontWeight: 600,
                    fontVariantNumeric: "tabular-nums",
                    textAlign: "right",
                  }}
                >
                  {leak}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}