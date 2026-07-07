import { NextRequest } from "next/server";
import { json } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

/**
 * GET /api/status
 * Public liveness + integrations check. Returns what's wired and what's not,
 * so the operator can see at a glance which keys are missing.
 *
 * No secrets are exposed — only boolean flags + a category label.
 */
export async function GET(req: NextRequest) {
  const checks = {
    server: { ok: true, message: "Next.js process running" },
    core: { rest_api: "live", public_site: "live", cockpit: "live", nova: "live", audit: "live" },
    ai: {
      openai: {
        configured: !!process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_MODEL || "gpt-4o",
      },
      stability: { configured: !!process.env.STABILITY_API_KEY },
      replicate: { configured: !!process.env.REPLICATE_API_KEY },
      mode: process.env.OPENAI_API_KEY
        ? "openai"
        : process.env.STABILITY_API_KEY
          ? "stability"
          : process.env.REPLICATE_API_KEY
            ? "replicate"
            : "placeholder",
    },
    billing: {
      stripe: {
        configured: !!process.env.STRIPE_SECRET_KEY,
        webhook: !!process.env.STRIPE_WEBHOOK_SECRET,
      },
      revolut: { configured: !!process.env.REVOLUT_API_KEY },
      mode: process.env.STRIPE_SECRET_KEY
        ? "stripe"
        : process.env.REVOLUT_API_KEY
          ? "revolut"
          : "mock",
    },
    email: {
      resend: { configured: !!process.env.RESEND_API_KEY },
      sendgrid: { configured: !!process.env.SENDGRID_API_KEY },
      smtp: { configured: !!process.env.SMTP_HOST },
      mode: process.env.RESEND_API_KEY
        ? "resend"
        : process.env.SENDGRID_API_KEY
          ? "sendgrid"
          : process.env.SMTP_HOST
            ? "smtp"
            : "local",
    },
    domains: {
      caddy: { configured: !!process.env.CADDY_API_URL },
      auto_ssl: !!process.env.CADDY_API_URL,
    },
    analytics: {
      plausible: {
        configured: !!process.env.PLAUSIBLE_DOMAIN,
        domain: process.env.PLAUSIBLE_DOMAIN || null,
      },
      posthog: { configured: !!process.env.POSTHOG_API_KEY },
    },
    mobile: {
      fcm: { configured: !!process.env.FCM_SERVER_KEY },
      apns: { configured: !!process.env.APNS_KEY_ID },
    },
    api: {
      public_token_required: !!process.env.PUBLIC_API_TOKEN,
    },
  };

  // What the marketing surface (baz-marketing-hub-snapshot) needs to function end-to-end.
  // These are checked by hitting the actual endpoints, not by env-var presence.
  const merged_site_checks: { label: string; ok: boolean; endpoint: string }[] = [];
  const endpoints = [
    { label: "Case studies", endpoint: "/api/case-studies" },
    { label: "Lead intake", endpoint: "/api/leads" },
    { label: "Org chart", endpoint: "/api/public/team" },
    // Don't self-fetch: avoid recursion and timeouts.
  ];
  for (const { label, endpoint } of endpoints) {
    try {
      const base =
        process.env.NEXT_PUBLIC_BASE_URL ?? `http://127.0.0.1:${process.env.PORT ?? "3000"}`;
      const r = await fetch(base + endpoint, { method: endpoint === "/api/leads" ? "GET" : "GET" });
      merged_site_checks.push({ label, ok: r.ok, endpoint });
    } catch {
      merged_site_checks.push({ label, ok: false, endpoint });
    }
  }
  const merged_site_wired = merged_site_checks.filter((c) => c.ok).length;
  const merged_site_pct = Math.round((merged_site_wired / merged_site_checks.length) * 100);

  // Compute a "wired %" — what fraction of categories have at least one working provider.
  // Core is always live (the hub ships with REST API + public site + cockpit + Nova + audit out of the box).
  const categories = ["core", "ai", "billing", "email", "domains", "analytics", "mobile"];
  let wired = 0;
  for (const c of categories) {
    if (c === "core")
      wired++; // always live — REST + site + cockpit + Nova + audit ship with the hub
    else if (c === "ai" && checks.ai.mode !== "placeholder") wired++;
    else if (c === "billing" && checks.billing.mode !== "mock") wired++;
    else if (c === "email" && checks.email.mode !== "local") wired++;
    else if (c === "domains" && checks.domains.auto_ssl) wired++;
    else if (
      c === "analytics" &&
      (checks.analytics.plausible.configured || checks.analytics.posthog.configured)
    )
      wired++;
    else if (c === "mobile" && (checks.mobile.fcm.configured || checks.mobile.apns.configured))
      wired++;
  }
  const wired_pct = Math.round((wired / categories.length) * 100);

  return json({
    checks,
    wired_count: wired,
    total_categories: categories.length,
    wired_pct,
    // What the marketing surface needs. These are end-to-end checks, not env-var booleans.
    merged_site: {
      wired_count: merged_site_wired,
      total: merged_site_checks.length,
      pct: merged_site_pct,
      checks: merged_site_checks,
    },
    recommendations: buildRecommendations(checks),
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
}

function buildRecommendations(c: Record<string, unknown>): string[] {
  const out: string[] = [];
  if (c.ai.mode === "placeholder")
    out.push("Add OPENAI_API_KEY (or STABILITY/REPLICATE) to enable live image/copy generation.");
  if (c.billing.mode === "mock")
    out.push("Add STRIPE_SECRET_KEY to enable real checkout and Connect.");
  if (c.email.mode === "local") out.push("Add RESEND_API_KEY (or SMTP) to actually send emails.");
  if (!c.domains.auto_ssl)
    out.push(
      "Add CADDY_API_URL + CADDY_API_TOKEN for automatic SSL provisioning on custom domains.",
    );
  if (!c.analytics.plausible.configured && !c.analytics.posthog.configured)
    out.push("Wire Plausible or PostHog to attribute public-blog traffic.");
  if (!c.mobile.fcm.configured && !c.mobile.apns.configured)
    out.push("Add FCM/APNs keys before shipping the Capacitor mobile wrappers.");
  if (out.length === 0) out.push("All integrations wired. You're ready to ship.");
  return out;
}
