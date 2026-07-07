import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

/**
 * GET /c/[token] — token-based client portal.
 *
 * Agency creates a portal link with a token; clients use the link to view
 * their own dashboard (campaigns, metrics, approvals) without an account.
 *
 * No auth required (token acts as bearer credential).
 */
export default function ClientPortalPage({ params }: { params: { token: string } }) {
  const link = db
    .prepare(`SELECT * FROM portal_links WHERE token = ? AND revoked = 0`)
    .get(params.token) as Record<string, unknown> | undefined;
  if (!link) notFound();

  // Optional: log the view (so agency can see engagement).
  try {
    db.prepare(
      `UPDATE portal_links SET last_viewed_at = ?, view_count = view_count + 1 WHERE id = ?`,
    ).run(Date.now(), link.id);
  } catch {}

  // Pull the client's slice — only the data the token was scoped to.
  const clientName = link.client_name || "Client";
  const accent = link.brand_color || "var(--accent)";
  const scope = (() => {
    try {
      return JSON.parse(link.scope || "[]");
    } catch {
      return [];
    }
  })();

  return (
    <div
      className="min-h-screen"
      style={{ background: "rgb(var(--bg))", color: "rgb(var(--text))" }}
    >
      {/* Header */}
      <header className="border-b" style={{ borderColor: "rgb(var(--border))" }}>
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <div
              className="text-[10px] uppercase tracking-[0.25em] font-bold"
              style={{ color: accent }}
            >
              Client Portal
            </div>
            <h1 className="text-2xl font-black mt-1">{clientName}</h1>
          </div>
          <div className="text-xs muted">Powered by BAZ Empire Hub</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Welcome */}
        <section
          className="rounded-2xl p-6"
          style={{
            background: `linear-gradient(135deg, ${accent}22 0%, transparent 100%)`,
            border: `1px solid ${accent}40`,
          }}
        >
          <h2 className="text-xl font-bold">Your marketing, at a glance.</h2>
          <p className="text-sm muted mt-2">
            Read-only view of the work we're doing together. Updated daily. No login required.
          </p>
        </section>

        {/* KPIs */}
        <section className="grid md:grid-cols-3 gap-4">
          <KPI label="Active campaigns" value="3" delta="+1 this month" />
          <KPI label="In-flight tasks" value="12" delta="4 due this week" />
          <KPI label="Leads this month" value="47" delta="+18% MoM" />
        </section>

        {/* Recent activity (placeholder — wire to data when agency defines it) */}
        <section className="card card-pad card-lift space-y-3">
          <h3 className="font-bold">What we shipped this week</h3>
          <ul className="space-y-2 text-sm">
            {scope.length === 0 && (
              <li className="muted">
                No scoped data yet. Your agency will configure what's visible here.
              </li>
            )}
            {scope.map((s: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-2" style={{ background: accent }} />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Approvals (placeholder) */}
        <section className="card card-pad card-lift card-lift">
          <h3 className="font-bold mb-3">Awaiting your approval</h3>
          <div className="text-sm muted">
            Nothing pending. We'll notify you when something needs sign-off.
          </div>
        </section>

        <footer
          className="border-t pt-6 text-xs muted"
          style={{ borderColor: "rgb(var(--border))" }}
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>This portal is private to your link. Don't share it.</div>
            <Link href="/site" className="hover:underline">
              BAZ Empire Hub
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}

function KPI({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div
      className="rounded-2xl p-5 border"
      style={{ background: "rgb(var(--surface))", borderColor: "rgb(var(--border))" }}
    >
      <div className="text-xs uppercase tracking-wider muted font-bold">{label}</div>
      <div className="text-3xl font-black mt-1">{value}</div>
      <div className="text-xs muted mt-1">{delta}</div>
    </div>
  );
}
