/** The 10x guarantee badge — the risk-reversal signal, rendered as a pill. */
import { theme } from "../lib/theme";
import { usd } from "../lib/report";

export function GuaranteeBadge({
  met,
  annualLeak,
  fee,
}: {
  met: boolean;
  annualLeak: number;
  fee: number;
}) {
  const bg = met ? theme.color.success : theme.color.warn;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 14px",
        backgroundColor: `${bg}1A`, // 10% alpha
        border: `1px solid ${bg}`,
        borderRadius: theme.radius.pill,
        color: bg,
        fontFamily: theme.font.mono,
        fontSize: "13px",
        fontWeight: 600,
      }}
    >
      {met ? "✓ 10× guarantee met" : "⚠ 10× guarantee not met — fee waived"}
      <span style={{ color: theme.color.textMuted, fontWeight: 400 }}>
        {usd(annualLeak)}/yr vs {usd(fee * 10)} threshold
      </span>
    </span>
  );
}