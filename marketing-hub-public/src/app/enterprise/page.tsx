"use client";
import {
  Shield,
  Lock,
  Database,
  Zap,
  Users,
  Code,
  FileText,
  CheckCircle2,
  Globe,
  Webhook,
  Key,
  Server,
  Eye,
  Download,
  GitBranch,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const PILLARS = [
  {
    icon: Shield,
    title: "Security",
    color: "#0ea5e9",
    points: [
      "HttpOnly session cookies — tokens never exposed to JavaScript",
      "Bcrypt password hashing (10 rounds)",
      "Rate limiting on auth endpoints (10 attempts / 15 min lockout)",
      "SQL injection prevention on all 244 API routes (parameterized queries + identifier validation)",
      "File upload validation (type whitelist, 10MB max, empty-file check)",
      "PII hashing (SHA-256) for ad platform offline conversions",
      "GDPR consent logging with purpose-level granularity",
    ],
  },
  {
    icon: Users,
    title: "Enterprise Readiness",
    color: "var(--accent)",
    points: [
      "Multi-workspace tenancy with workspace_id isolation on every table",
      "Role-based access: Owner, Admin, Editor, Viewer",
      "Workspace audit log — every action tracked with user, entity, IP, timestamp",
      "Workspace invites with expiring tokens (7-day TTL)",
      "API keys with scoped permissions and last-used tracking",
      "Custom domain support with SSL status tracking",
      "Data export — full workspace export to tar.gz in one click",
    ],
  },
  {
    icon: Code,
    title: "Developer Experience",
    color: "#16a34a",
    points: [
      "244 REST API endpoints with consistent response shapes",
      "Webhook system — 30+ event types with delivery tracking and retry",
      "API key authentication with scope-based authorization",
      "Public API for read-only data access (case studies, blog, health)",
      "SQLite with WAL mode — zero-config, zero-maintenance, ACID-compliant",
      "Self-hosted — your data never leaves your infrastructure",
      "No vendor lock-in — export everything, anytime",
    ],
  },
  {
    icon: Eye,
    title: "Transparency",
    color: "#f59e0b",
    points: [
      "Open architecture — every line of code is inspectable",
      "No hidden tracking — no third-party analytics, no telemetry, no beacons",
      "No data sent to external servers (unless you configure ad integrations)",
      "Full audit trail — see exactly who did what and when",
      "Consent log — every contact's consent state is queryable",
      "Privacy by design — GDPR-ready, consent-gated, PII-hashed",
    ],
  },
];

const COMPARISONS = [
  {
    feature: "Self-hosted / data ownership",
    us: true,
    hubspot: false,
    marketo: false,
    salesforce: false,
  },
  { feature: "No per-seat pricing", us: true, hubspot: false, marketo: false, salesforce: false },
  {
    feature: "Full API access (no paywalls)",
    us: true,
    hubspot: false,
    marketo: false,
    salesforce: false,
  },
  { feature: "Webhook system included", us: true, hubspot: true, marketo: true, salesforce: true },
  { feature: "Custom domain + SSL", us: true, hubspot: "$$", marketo: "$$$", salesforce: "$$$" },
  { feature: "Audit log included", us: true, hubspot: "$$", marketo: "$$", salesforce: true },
  {
    feature: "Data export (full)",
    us: true,
    hubspot: "limited",
    marketo: "limited",
    salesforce: "limited",
  },
  {
    feature: "Setup time",
    us: "90 seconds",
    hubspot: "weeks",
    marketo: "weeks",
    salesforce: "months",
  },
  {
    feature: "Monthly cost (50 users)",
    us: "$0",
    hubspot: "$2,400+",
    marketo: "$3,000+",
    salesforce: "$5,000+",
  },
];

export default function EnterprisePage() {
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
          className="absolute inset-0 opacity-30"
          style={{ background: "var(--gradient-mesh)" }}
        />
        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-bold uppercase tracking-wider"
            style={{
              background: "rgba(var(--theme-brand-rgb), 0.08)",
              color: "var(--accent)",
            }}
          >
            <Shield className="w-3.5 h-3.5" />
            Enterprise-ready · Built for teams that audit everything
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight leading-tight"
          >
            Your data. Your rules.
            <br />
            <span className="text-gradient">Your marketing engine.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg muted mt-6 max-w-2xl mx-auto"
          >
            Self-hosted. Multi-tenant. API-first. No vendor lock-in. The marketing platform built
            for teams who treat data as infrastructure.
          </motion.p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <Link href="/" className="btn btn-primary">
              Explore the platform →
            </Link>
            <Link href="/developers" className="btn btn-secondary">
              <Code className="w-4 h-4" /> Developer portal
            </Link>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="card card-pad card-lift card-lift"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: `${p.color}15`, color: p.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">{p.title}</h2>
                </div>
                <ul className="space-y-2.5">
                  {p.points.map((point, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2
                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                        style={{ color: p.color }}
                      />
                      <span className="text-slate-600 dark:text-zinc-300 dark:text-zinc-400">{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-black text-center mb-2">How we compare</h2>
        <p className="text-sm muted text-center mb-8">
          No per-seat pricing. No paywalled APIs. No vendor lock-in.
        </p>
        <div className="card overflow-hidden">
          <table className="tbl">
            <thead>
              <tr>
                <th>Capability</th>
                <th className="text-center">Marketing Hub</th>
                <th className="text-center">HubSpot</th>
                <th className="text-center">Marketo</th>
                <th className="text-center">Salesforce</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISONS.map((c, i) => (
                <tr key={i}>
                  <td className="font-medium">{c.feature}</td>
                  <td className="text-center">
                    {c.us === true ? (
                      <CheckCircle2 className="w-5 h-5 inline text-emerald-500" />
                    ) : (
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {c.us}
                      </span>
                    )}
                  </td>
                  <td className="text-center text-sm muted">
                    {typeof c.hubspot === "boolean" ? (c.hubspot ? "✓" : "✗") : c.hubspot}
                  </td>
                  <td className="text-center text-sm muted">
                    {typeof c.marketo === "boolean" ? (c.marketo ? "✓" : "✗") : c.marketo}
                  </td>
                  <td className="text-center text-sm muted">
                    {typeof c.salesforce === "boolean" ? (c.salesforce ? "✓" : "✗") : c.salesforce}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div
          className="card card-pad card-lift card-lift"
          style={{
            background:
              "linear-gradient(135deg, rgba(var(--theme-brand-rgb), 0.06), transparent)",
          }}
        >
          <h2 className="text-2xl font-black mb-3">Ready to own your marketing stack?</h2>
          <p className="text-sm muted mb-6 max-w-md mx-auto">
            Deploy in 90 seconds. No sales calls. No procurement. No per-seat pricing. Your data
            stays on your infrastructure.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/" className="btn btn-primary">
              Start using it now →
            </Link>
            <Link href="/trust" className="btn btn-secondary">
              <Shield className="w-4 h-4" /> Security details
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
