/**
 * BAZ client reporting dashboard — home page.
 * Server component (no client JS) → fast LCP. Reads a diagnostic report and renders
 * the revenue-not-vanity view: the leak, the audit table, the guarantee, the next step.
 */
import { theme } from "../lib/theme";
import { getReport, usd } from "../lib/report";
import { MetricCard } from "../components/MetricCard";
import { LeakTable } from "../components/LeakTable";
import { GuaranteeBadge } from "../components/GuaranteeBadge";

export default function Page() {
  const report = getReport();
  const topLeak = report.leaks.find((l) => l.effectiveFraction > 0) ?? report.leaks[0]!;
  const gdpr = report.markets.includes("EU");

  return (
    <main
      style={{
        backgroundColor: theme.color.bg,
        color: theme.color.text,
        fontFamily: theme.font.ui,
        minHeight: "100vh",
        padding: "32px 24px 64px",
      }}
    >
      <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
        {/* Header */}
        <header
          className="fade-in-up"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              {report.clientName} — Revenue Diagnostic
            </h1>
            <span
              style={{
                color: theme.color.textMuted,
                fontFamily: theme.font.mono,
                fontSize: "12px",
              }}
            >
              {report.primaryChannel} · {report.markets.join(" / ")} ·{" "}
              {new Date(report.generatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <GuaranteeBadge
            met={report.guaranteeMet}
            annualLeak={report.totalAnnualLeak}
            fee={report.auditFee}
          />
          {gdpr ? (
            <p
              style={{
                margin: 0,
                color: theme.color.depth,
                fontFamily: theme.font.mono,
                fontSize: "13px",
              }}
            >
              🇪🇺 EU market — consent + consent-mode are non-optional (GDPR).
            </p>
          ) : null}
        </header>

        {/* Metric row */}
        <section
          className="fade-in-up"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <MetricCard
            label="Monthly revenue leak"
            value={usd(report.totalMonthlyLeak)}
            sub="attributed revenue lost to tracking gaps"
            accent="signal"
          />
          <MetricCard
            label="Annual revenue leak"
            value={usd(report.totalAnnualLeak)}
            sub="the number the 10× guarantee is tested against"
            accent="success"
          />
          <MetricCard
            label="Monthly attributed revenue"
            value={usd(report.monthlyAttributedRevenue)}
            sub="baseline the leak is measured against"
            accent="muted"
          />
          <MetricCard
            label="Biggest hole"
            value={topLeak?.label ?? "—"}
            sub={topLeak ? `${usd(topLeak.annualLeak)}/yr` : undefined}
            accent="signal"
          />
        </section>

        {/* Audit table */}
        <section className="fade-in-up" style={{ marginBottom: "32px" }}>
          <h2
            style={{
              fontSize: "13px",
              fontFamily: theme.font.mono,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: theme.color.textMuted,
              margin: "0 0 12px",
              fontWeight: 500,
            }}
          >
            Tracking Default audit
          </h2>
          <LeakTable leaks={report.leaks} />
          <p
            style={{
              color: theme.color.textMuted,
              fontSize: "13px",
              margin: "12px 0 0",
              maxWidth: "70ch",
            }}
          >
            “present” = verified firing, 0 leak. “partial” = present but incomplete, half
            the risk remains. “missing”/“broken” = full estimated leak applied. Leak
            fractions are conservative, industry-report-derived and{" "}
            <span style={{ color: theme.color.depth }}>[composite — replace with BAZ empirical data after 10 diagnostics]</span>.
          </p>
        </section>

        {/* Next step */}
        <section
          className="fade-in-up"
          style={{
            backgroundColor: theme.color.surface,
            border: `1px solid ${theme.color.border}`,
            borderRadius: theme.radius.none,
            padding: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "13px",
              fontFamily: theme.font.mono,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: theme.color.textMuted,
              margin: "0 0 12px",
              fontWeight: 500,
            }}
          >
            Next logical yes
          </h2>
          <p style={{ margin: 0, fontSize: "16px", lineHeight: 1.6, color: theme.color.text }}>
            Close the top 2 holes (typically ssGTM + CAPI for paid-heavy programs) in the
            first 30 days. Exit criterion: estimated monthly leak reduced by ≥50%. Then
            decide — convert to a Core ($6.5–9.5k/mo) or Growth ($18–28k/mo) retainer, or
            hand off. <span style={{ color: theme.color.accent }}>Book the fix kickoff →</span>
          </p>
        </section>

        <footer
          style={{
            marginTop: "48px",
            color: theme.color.textMuted,
            fontFamily: theme.font.mono,
            fontSize: "12px",
            borderTop: `1px solid ${theme.color.border}`,
            paddingTop: "16px",
          }}
        >
          BAZ — the senior-partner marketing agency for teams that want growth as a
          forecast, not a hope.
        </footer>
      </div>
    </main>
  );
}