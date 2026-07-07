"use client";
import { useState } from "react";
import { Code, Key, Webhook, Copy, Terminal, Zap, Shield, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import clsx from "clsx";

const API_CATEGORIES = [
  {
    name: "Core Resources",
    endpoints: [
      { method: "GET", path: "/api/contacts", desc: "List all contacts", auth: true },
      { method: "POST", path: "/api/contacts", desc: "Create a contact", auth: true },
      { method: "GET", path: "/api/contacts/{id}", desc: "Get a contact", auth: true },
      { method: "PATCH", path: "/api/contacts/{id}", desc: "Update a contact", auth: true },
      { method: "GET", path: "/api/deals", desc: "List all deals", auth: true },
      { method: "POST", path: "/api/deals", desc: "Create a deal", auth: true },
      { method: "GET", path: "/api/campaigns", desc: "List campaigns", auth: true },
      { method: "POST", path: "/api/campaigns", desc: "Create a campaign", auth: true },
      { method: "GET", path: "/api/companies", desc: "List companies", auth: true },
    ],
  },
  {
    name: "Content & Email",
    endpoints: [
      { method: "GET", path: "/api/content", desc: "List content items", auth: true },
      { method: "POST", path: "/api/content", desc: "Create content", auth: true },
      { method: "GET", path: "/api/emails", desc: "List emails", auth: true },
      { method: "POST", path: "/api/emails", desc: "Create an email", auth: true },
      { method: "POST", path: "/api/emails/send", desc: "Queue an email for sending", auth: true },
      { method: "GET", path: "/api/landing-pages", desc: "List landing pages", auth: true },
      { method: "POST", path: "/api/landing-pages", desc: "Create a landing page", auth: true },
      { method: "GET", path: "/api/forms", desc: "List forms", auth: true },
      {
        method: "POST",
        path: "/api/forms/submissions",
        desc: "Submit a form (public)",
        auth: false,
      },
    ],
  },
  {
    name: "Analytics & Intelligence",
    endpoints: [
      { method: "GET", path: "/api/dashboard", desc: "Dashboard metrics", auth: true },
      { method: "GET", path: "/api/analytics", desc: "Traffic analytics", auth: true },
      {
        method: "GET",
        path: "/api/intelligence",
        desc: "Marketing intelligence score",
        auth: true,
      },
      { method: "GET", path: "/api/attribution", desc: "Attribution rollup", auth: true },
      { method: "GET", path: "/api/retention", desc: "Cohort retention", auth: true },
      { method: "GET", path: "/api/predictive", desc: "Predictive scoring", auth: true },
      {
        method: "GET",
        path: "/api/patrick",
        desc: "The Patrick Number (daily verdict)",
        auth: true,
      },
      { method: "GET", path: "/api/today", desc: "Today's priority moves", auth: true },
    ],
  },
  {
    name: "Automation & Webhooks",
    endpoints: [
      { method: "GET", path: "/api/automations", desc: "List automations", auth: true },
      { method: "POST", path: "/api/automations", desc: "Create an automation", auth: true },
      {
        method: "GET",
        path: "/api/webhooks/dispatch",
        desc: "List webhook deliveries",
        auth: true,
      },
      { method: "POST", path: "/api/webhooks/dispatch", desc: "Dispatch a webhook", auth: true },
      { method: "GET", path: "/api/outbox", desc: "Email outbox status", auth: true },
      { method: "POST", path: "/api/outbox/send-now", desc: "Send an outbox item now", auth: true },
    ],
  },
  {
    name: "Workspace & Enterprise",
    endpoints: [
      { method: "GET", path: "/api/workspaces", desc: "List workspaces", auth: true },
      { method: "POST", path: "/api/workspaces", desc: "Create a workspace", auth: true },
      { method: "GET", path: "/api/workspaces/{id}/members", desc: "List members", auth: true },
      { method: "GET", path: "/api/workspaces/{id}/audit", desc: "Audit log", auth: true },
      { method: "POST", path: "/api/api-keys", desc: "Create an API key", auth: true },
      { method: "GET", path: "/api/export", desc: "Export all workspace data", auth: true },
      {
        method: "GET",
        path: "/api/admin/backup",
        desc: "Download full backup (tar.gz)",
        auth: true,
      },
    ],
  },
  {
    name: "Public (no auth)",
    endpoints: [
      { method: "GET", path: "/api/health", desc: "Health check + DB status", auth: false },
      { method: "GET", path: "/api/status", desc: "Service status", auth: false },
      { method: "POST", path: "/api/leads", desc: "Public lead capture", auth: false },
      { method: "GET", path: "/api/case-studies", desc: "Public case studies", auth: false },
      {
        method: "GET",
        path: "/api/public/v1/health",
        desc: "Versioned public health",
        auth: false,
      },
    ],
  },
];

const WEBHOOK_EVENTS = [
  "contact.created",
  "contact.updated",
  "deal.created",
  "deal.stage_changed",
  "deal.won",
  "deal.lost",
  "campaign.created",
  "campaign.status_changed",
  "form.submitted",
  "email.sent",
  "email.opened",
  "email.clicked",
  "email.bounced",
  "automation.triggered",
  "task.completed",
  "lead.captured",
];

const CODE_EXAMPLES = {
  curl: `curl -X POST https://your-domain.com/api/contacts \\
  -H "Authorization: Bearer sk_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "first_name": "Brahim",
    "email": "brahim@bazempire.com",
    "company": "BAZ Empire",
    "status": "lead"
  }'`,
  javascript: `const res = await fetch("https://your-domain.com/api/contacts", {
  method: "POST",
  headers: {
    "Authorization": "Bearer sk_your_api_key",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    first_name: "Brahim",
    email: "brahim@bazempire.com",
    company: "BAZ Empire",
    status: "lead",
  }),
});
const contact = await res.json();
console.log(contact.id); // "c_abc123..."`,
  python: `import requests

res = requests.post(
    "https://your-domain.com/api/contacts",
    headers={
        "Authorization": "Bearer sk_your_api_key",
        "Content-Type": "application/json",
    },
    json={
        "first_name": "Brahim",
        "email": "brahim@bazempire.com",
        "company": "BAZ Empire",
        "status": "lead",
    },
)
contact = res.json()
print(contact["id"])  # "c_abc123..."`,
};

export default function DevelopersPage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeExample, setActiveExample] = useState<keyof typeof CODE_EXAMPLES>("curl");
  const [copied, setCopied] = useState(false);

  function copyCode() {
    navigator.clipboard.writeText(CODE_EXAMPLES[activeExample]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "rgb(var(--bg))", color: "rgb(var(--text))" }}
    >
      {/* HERO */}
      <section
        className="relative overflow-hidden border-b"
        style={{ borderColor: "rgb(var(--border))" }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: "var(--gradient-mesh)" }}
        />
        <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-20">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 text-xs font-bold uppercase tracking-wider"
            style={{
              background: "var(--theme-brand-soft, rgba(var(--theme-brand-rgb),0.08))",
              color: "var(--theme-brand, var(--accent))",
            }}
          >
            <Code className="w-3.5 h-3.5" /> Developer Portal · v1
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            244 endpoints. One API.
            <br />
            <span className="text-gradient">Zero paywalls.</span>
          </h1>
          <p className="text-lg muted mt-5 max-w-2xl">
            Every feature in the platform is accessible via a REST API. No tier-gated endpoints. No
            "contact sales for API access." Authenticate, integrate, automate.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-6 text-sm">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-4 h-4 muted" /> REST API
            </span>
            <span className="flex items-center gap-1.5">
              <Key className="w-4 h-4 muted" /> API Key Auth
            </span>
            <span className="flex items-center gap-1.5">
              <Webhook className="w-4 h-4 muted" /> 16+ Webhook Events
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 muted" /> Real-time
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* SIDEBAR NAV */}
        <aside className="lg:col-span-1">
          <div className="sticky top-6 space-y-5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider muted mb-2">Endpoints</h3>
              <nav className="space-y-1">
                {API_CATEGORIES.map((cat, i) => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(i)}
                    className={clsx(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                      activeCategory === i
                        ? "font-semibold text-[var(--accent)] dark:text-[color-mix(in srgb,var(--accent),white 10%)]"
                        : "muted hover:text-slate-900 dark:hover:text-white",
                    )}
                  >
                    {cat.name}
                    <span className="text-xs ml-1 opacity-50">({cat.endpoints.length})</span>
                  </button>
                ))}
              </nav>
            </div>
            <div className="pt-4 border-t" style={{ borderColor: "rgb(var(--border))" }}>
              <Link
                href="/enterprise"
                className="block text-sm muted hover:text-[var(--accent)] dark:hover:text-[color-mix(in srgb,var(--accent),white 10%)]"
              >
                → Enterprise
              </Link>
              <Link
                href="/trust"
                className="block text-sm muted hover:text-[var(--accent)] dark:hover:text-[color-mix(in srgb,var(--accent),white 10%)] mt-1"
              >
                → Security
              </Link>
              <Link
                href="/"
                className="block text-sm muted hover:text-[var(--accent)] dark:hover:text-[color-mix(in srgb,var(--accent),white 10%)] mt-1"
              >
                → Dashboard
              </Link>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="lg:col-span-3 space-y-8">
          {/* API ENDPOINTS */}
          <section>
            <h2 className="text-xl font-black mb-4">{API_CATEGORIES[activeCategory].name}</h2>
            <div className="card overflow-hidden">
              {API_CATEGORIES[activeCategory].endpoints.map((ep, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 border-b last:border-0"
                  style={{ borderColor: "rgb(var(--border))" }}
                >
                  <span
                    className={clsx(
                      "text-xs font-bold px-2 py-0.5 rounded font-mono",
                      ep.method === "GET"
                        ? "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400"
                        : ep.method === "POST"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : ep.method === "PATCH"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
                    )}
                  >
                    {ep.method}
                  </span>
                  <code className="text-sm font-mono flex-1 truncate">{ep.path}</code>
                  <span className="text-xs muted truncate hidden sm:inline">{ep.desc}</span>
                  {ep.auth ? (
                    <Shield
                      className="w-3.5 h-3.5 text-amber-500 flex-shrink-0"
                      title="Auth required"
                    />
                  ) : (
                    <span className="text-[10px] font-bold uppercase text-emerald-500 flex-shrink-0">
                      Public
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* CODE EXAMPLES */}
          <section>
            <h2 className="text-xl font-black mb-4">Quick start</h2>
            <div className="flex items-center gap-2 mb-3">
              {(Object.keys(CODE_EXAMPLES) as Array<keyof typeof CODE_EXAMPLES>).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveExample(lang)}
                  className={clsx(
                    "px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors",
                    activeExample === lang
                      ? "bg-[var(--accent)] text-white"
                      : "muted hover:bg-slate-100 dark:hover:bg-white/5 dark:bg-zinc-800 dark:hover:bg-white/5",
                  )}
                >
                  {lang === "curl" ? "cURL" : lang === "javascript" ? "JavaScript" : "Python"}
                </button>
              ))}
              <button
                onClick={copyCode}
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm muted hover:bg-slate-100 dark:hover:bg-white/5 dark:bg-zinc-800 dark:hover:bg-white/5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre
              className="card p-4 overflow-auto text-sm font-mono leading-relaxed"
              style={{ background: "rgb(var(--surface-3))" }}
            >
              <code>{CODE_EXAMPLES[activeExample]}</code>
            </pre>
          </section>

          {/* WEBHOOKS */}
          <section>
            <h2 className="text-xl font-black mb-2">Webhook events</h2>
            <p className="text-sm muted mb-4">
              Subscribe to 16+ event types. Every delivery is tracked with response status and retry
              logic.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {WEBHOOK_EVENTS.map((e) => (
                <div
                  key={e}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                  style={{ background: "rgb(var(--surface-2))" }}
                >
                  <Webhook className="w-3.5 h-3.5 text-[var(--accent)] dark:text-[color-mix(in srgb,var(--accent),white 10%)] flex-shrink-0" />
                  <code className="font-mono text-xs">{e}</code>
                </div>
              ))}
            </div>
          </section>

          {/* AUTH */}
          <section className="card card-pad card-lift card-lift">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Key className="w-5 h-5 text-[var(--accent)] dark:text-[color-mix(in srgb,var(--accent),white 10%)]" /> Authentication
            </h2>
            <p className="text-sm text-slate-600 dark:text-zinc-300 dark:text-zinc-400 mb-3">
              Create an API key in Settings → API Keys. Keys are SHA-256 hashed at rest — the
              plaintext is shown once at creation. Include the key in the{" "}
              <code
                className="font-mono text-xs px-1.5 py-0.5 rounded"
                style={{ background: "rgb(var(--surface-2))" }}
              >
                Authorization
              </code>{" "}
              header:
            </p>
            <pre
              className="p-3 rounded-lg text-sm font-mono"
              style={{ background: "rgb(var(--surface-3))" }}
            >
              <code>Authorization: Bearer sk_your_api_key_here</code>
            </pre>
            <p className="text-xs muted mt-3">
              API keys support scoped permissions. Use{" "}
              <code className="font-mono">X-Workspace-Id</code> header to target a specific
              workspace.
            </p>
          </section>

          {/* RATE LIMITS */}
          <section className="card card-pad card-lift card-lift">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" /> Rate limiting
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-bold text-lg">100/min</div>
                <div className="text-xs muted">API key requests</div>
              </div>
              <div>
                <div className="font-bold text-lg">10/15min</div>
                <div className="text-xs muted">Auth attempts (then locked)</div>
              </div>
              <div>
                <div className="font-bold text-lg">10MB</div>
                <div className="text-xs muted">Max upload size</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
