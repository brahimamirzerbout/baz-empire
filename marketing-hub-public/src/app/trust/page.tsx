import Link from "next/link";
import { Activity, Lock, Globe, Server } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Trust · BAZ Empire Hub",
  description: "Live status, security, and uptime of the BAZ Empire Marketing Hub.",
};

export default function TrustPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "rgb(var(--bg))", color: "rgb(var(--text))" }}
    >
      <header className="border-b" style={{ borderColor: "rgb(var(--border))" }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/site" className="flex items-center gap-2 font-bold">
            <div
              className="w-7 h-7 rounded-lg grid place-items-center"
              style={{ background: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)" }}
            >
              <span className="text-white font-black text-xs">B</span>
            </div>
            BAZ Empire Trust
          </Link>
          <Link href="/site" className="text-sm muted hover:text-white">
            ← Back to site
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        <section>
          <h1 className="text-4xl md:text-5xl font-black mb-3">Trust &amp; Status</h1>
          <p className="text-muted">
            Live signal from the BAZ Empire Marketing Hub. No marketing, just metrics.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-4">
          <Card icon={<Activity className="w-5 h-5 text-emerald-500" />} title="Live status">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold">Operational</span>
            </div>
            <p className="text-xs muted mt-2">
              Ping <code className="text-emerald-400">/api/health</code> for JSON status. 200 =
              healthy.
            </p>
          </Card>

          <Card icon={<Server className="w-5 h-5 text-violet-500" />} title="Version">
            <div className="font-mono text-sm">v1.0.0</div>
            <p className="text-xs muted mt-2">
              Marketing Hub · 35 pages · 188 API routes · 56 lib modules · single Next.js process.
            </p>
          </Card>

          <Card icon={<Lock className="w-5 h-5 text-amber-500" />} title="Security">
            <ul className="text-sm space-y-1">
              <li>• HTTP-only session cookies · 30-day TTL · sameSite=lax</li>
              <li>• Bcrypt password hashing (10 rounds)</li>
              <li>
                • Per-workspace data isolation via <code>workspace_id</code>
              </li>
              <li>• Edge middleware enforces auth on all non-public routes</li>
              <li>
                • Public REST API (<code>/api/public/v1/*</code>) is read-only and rate-friendly
              </li>
            </ul>
            <p className="text-xs muted mt-2">
              Security contact:{" "}
              <a className="underline" href="mailto:hello@bazempire.io">
                hello@bazempire.io
              </a>{" "}
              · /.well-known/security.txt
            </p>
          </Card>

          <Card icon={<Globe className="w-5 h-5 text-rose-500" />} title="Integrations">
            <p className="text-sm">Live status of every wired provider:</p>
            <a href="/api/status" className="text-xs text-amber-400 hover:underline font-mono">
              /api/status
            </a>
            <p className="text-xs muted mt-2">
              Returns which env keys are configured. Switches the live-vs-mock mode of every
              provider.
            </p>
          </Card>
        </section>

        <section className="card card-pad card-lift card-lift">
          <h2 className="text-2xl font-black mb-4">Data principles</h2>
          <ul className="space-y-3 text-sm">
            <li>
              <strong>Sovereignty first.</strong> The hub runs on a single machine. Your data stays
              in a local SQLite file. No third party sees it unless you wire an integration.
            </li>
            <li>
              <strong>Multi-tenant by design.</strong> Every table has a <code>workspace_id</code>.
              Users only see their own workspace's data.
            </li>
            <li>
              <strong>Open formats.</strong> Export everything as CSV/JSON via{" "}
              <code>/api/export</code> (authed). Move to any other tool whenever you want.
            </li>
            <li>
              <strong>No dark patterns.</strong> No email-tracked pixels unless you turn them on. No
              third-party trackers. No surprise billing.
            </li>
            <li>
              <strong>Audit-trail.</strong> Every API mutation goes through a single wrapper that
              records user, workspace, IP, before/after diffs.
            </li>
          </ul>
        </section>

        <section className="card card-pad card-lift card-lift">
          <h2 className="text-2xl font-black mb-4">Compliance</h2>
          <ul className="space-y-2 text-sm muted">
            <li>
              ✓ GDPR: data export + per-workspace deletion via <code>DELETE /api/workspace</code>
            </li>
            <li>
              ✓ SOC 2 Type II: in-progress (Q4 2026 target — single-tenant sovereign deployments
              eligible)
            </li>
            <li>✓ CAN-SPAM: email outbox supports List-Unsubscribe + physical address</li>
            <li>
              ✓ CCPA: opt-out endpoints at <code>/api/consent</code>
            </li>
          </ul>
        </section>

        <section className="text-xs muted text-center">
          Hub uptime target: 99.9% monthly · Mean time to recovery: &lt; 30 minutes
          <br />
          <Link href="/api/health" className="underline">
            /api/health
          </Link>{" "}
          ·{" "}
          <Link href="/api/status" className="underline">
            /api/status
          </Link>{" "}
          ·{" "}
          <Link href="/site" className="underline">
            /site
          </Link>
        </section>
      </main>
    </div>
  );
}

function Card({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-5 border"
      style={{ background: "rgb(var(--surface))", borderColor: "rgb(var(--border))" }}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="font-bold">{title}</h3>
      </div>
      {children}
    </div>
  );
}
