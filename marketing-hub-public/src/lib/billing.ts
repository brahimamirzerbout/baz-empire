/**
 * Billing — provider-agnostic abstraction over Stripe and Revolut.
 *
 * Design goals:
 *   1. The Hub can be sold via card (Stripe) OR bank-direct (Revolut Merchant).
 *   2. The rest of the app doesn't care which provider the customer uses.
 *   3. Webhooks from both providers land in /api/billing/webhook and
 *      normalize into the same `billing_events` log.
 *
 * Provider config (env vars):
 *   STRIPE_SECRET_KEY=sk_live_...
 *   STRIPE_WEBHOOK_SECRET=whsec_...
 *   STRIPE_PRICE_PROD=price_...
 *   STRIPE_PRICE_AGENCY=price_...
 *
 *   REVOLUT_API_KEY=...
 *   REVOLUT_WEBHOOK_SECRET=...
 *   REVOLUT_MERCHANT_TOKEN=...
 *   REVOLUT_PLAN_PROD=...
 *   REVOLUT_PLAN_AGENCY=...
 *
 * If a provider's key is missing, that provider's methods return a
 * "not configured" error and the UI hides the option.
 */
import { db, uid, now } from "@/lib/db";

export type Provider = "stripe" | "revolut";
export type Plan = "free" | "pro" | "agency";

export interface CheckoutSession {
  url: string;
  provider: Provider;
  session_id: string;
}

export interface BillingPortalSession {
  url: string;
  provider: Provider;
}

export interface SubscriptionSnapshot {
  provider: Provider;
  provider_customer_id: string | null;
  provider_subscription_id: string | null;
  plan: Plan;
  status: "active" | "trialing" | "past_due" | "canceled" | "incomplete";
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  canceled_at: number | null;
}

export interface InvoiceRecord {
  id: string;
  provider: Provider;
  amount_due: number;
  currency: string;
  status: string;
  invoice_url: string | null;
  pdf_url: string | null;
  paid_at: number | null;
  created_at: number;
}

interface ProviderConfig {
  enabled: boolean;
  reason?: string;
}

export function providerConfig(p: Provider): ProviderConfig {
  if (p === "stripe") {
    return {
      enabled: !!process.env.STRIPE_SECRET_KEY,
      reason: process.env.STRIPE_SECRET_KEY ? undefined : "STRIPE_SECRET_KEY not set",
    };
  }
  if (p === "revolut") {
    return {
      enabled: !!process.env.REVOLUT_API_KEY,
      reason: process.env.REVOLUT_API_KEY ? undefined : "REVOLUT_API_KEY not set",
    };
  }
  return { enabled: false, reason: "unknown provider" };
}

/* ───────── Stripe ───────── */

interface StripeCheckoutBody {
  workspace_id: string;
  plan: "pro" | "agency";
  success_url: string;
  cancel_url: string;
  customer_email?: string;
}

export async function stripeCheckout(body: StripeCheckoutBody): Promise<CheckoutSession> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Stripe not configured (STRIPE_SECRET_KEY missing)");
  const priceId =
    body.plan === "agency" ? process.env.STRIPE_PRICE_AGENCY : process.env.STRIPE_PRICE_PROD;
  if (!priceId) throw new Error(`Missing STRIPE_PRICE_${body.plan.toUpperCase()}`);

  // Minimal Stripe API call using fetch (no SDK dep).
  const params = new URLSearchParams();
  params.set("mode", "subscription");
  params.set("line_items[0][price]", priceId);
  params.set("line_items[0][quantity]", "1");
  params.set("success_url", body.success_url);
  params.set("cancel_url", body.cancel_url);
  params.set("client_reference_id", body.workspace_id);
  params.set("metadata[workspace_id]", body.workspace_id);
  params.set("metadata[plan]", body.plan);
  if (body.customer_email) params.set("customer_email", body.customer_email);

  const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": "2024-06-20",
    },
    body: params.toString(),
  });
  if (!r.ok) throw new Error(`Stripe checkout error: ${r.status} ${await r.text()}`);
  const data = (await r.json()) as Record<string, unknown>;
  return { url: data.url, provider: "stripe", session_id: data.id };
}

export async function stripePortal(
  customerId: string,
  returnUrl: string,
): Promise<BillingPortalSession> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Stripe not configured");
  const params = new URLSearchParams();
  params.set("customer", customerId);
  params.set("return_url", returnUrl);
  const r = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": "2024-06-20",
    },
    body: params.toString(),
  });
  if (!r.ok) throw new Error(`Stripe portal error: ${r.status} ${await r.text()}`);
  const data = (await r.json()) as Record<string, unknown>;
  return { url: data.url, provider: "stripe" };
}

/* ───────── Revolut Merchant ───────── */

interface RevolutCheckoutBody {
  workspace_id: string;
  plan: "pro" | "agency";
  success_url: string;
  cancel_url: string;
  customer_email?: string;
}

export async function revolutCheckout(body: RevolutCheckoutBody): Promise<CheckoutSession> {
  const apiKey = process.env.REVOLUT_API_KEY;
  if (!apiKey) throw new Error("Revolut not configured (REVOLUT_API_KEY missing)");
  const planId =
    body.plan === "agency" ? process.env.REVOLUT_PLAN_AGENCY : process.env.REVOLUT_PLAN_PROD;
  if (!planId) throw new Error(`Missing REVOLUT_PLAN_${body.plan.toUpperCase()}`);

  // Revolut Merchant Order API: create an order, redirect to hosted checkout.
  const amountMinor = body.plan === "agency" ? 29900 : 9900; // cents
  const r = await fetch("https://merchant.revolut.com/api/orders", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Revolut-Api-Version": "2024-09-01",
    },
    body: JSON.stringify({
      amount: amountMinor,
      currency: "USD",
      capture_mode: "automatic",
      merchant_order_data: {
        reference: `${body.workspace_id}-${Date.now()}`,
      },
      line_items: [
        {
          name: `BAZ Empire · ${body.plan} plan`,
          type: "digital",
          quantity: { quantity: 1, unit_price: amountMinor },
          total_amount: amountMinor,
        },
      ],
      customer: body.customer_email ? { email: body.customer_email } : undefined,
      metadata: { workspace_id: body.workspace_id, plan: body.plan },
      success_url: body.success_url,
      cancel_url: body.cancel_url,
    }),
  });
  if (!r.ok) throw new Error(`Revolut order error: ${r.status} ${await r.text()}`);
  const data = (await r.json()) as Record<string, unknown>;
  // Revolut returns { id, checkout_url, ... }
  return { url: data.checkout_url || data.url, provider: "revolut", session_id: data.id };
}

/* ───────── Webhook verification ───────── */

export function verifyStripeWebhook(rawBody: string, signature: string | null): Record<string, unknown> | null {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !signature) return null;
  // Stripe sends "t=...,v1=..."
  const parts = signature.split(",").reduce((acc: Record<string, string>, p: string) => {
    const [k, v] = p.split("=");
    acc[k] = v;
    return acc;
  }, {});
  if (!parts.t || !parts.v1) return null;
  const crypto = require("node:crypto");
  const signedPayload = `${parts.t}.${rawBody}`;
  const expected = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");
  if (!crypto.timingSafeEqual(Buffer.from(parts.v1), Buffer.from(expected))) return null;
  return JSON.parse(rawBody);
}

export function verifyRevolutWebhook(rawBody: string, signature: string | null): Record<string, unknown> | null {
  const secret = process.env.REVOLUT_WEBHOOK_SECRET;
  if (!secret || !signature) return null;
  const crypto = require("node:crypto");
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  return JSON.parse(rawBody);
}

/* ───────── Persistence ───────── */

export function recordEvent(
  provider: Provider,
  eventType: string,
  providerEventId: string,
  payload: Record<string, unknown>,
  workspaceId?: string,
) {
  db.prepare(
    `
    INSERT INTO billing_events (id, provider, event_type, provider_event_id, payload, workspace_id, processed_at, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    uid("bev_"),
    provider,
    eventType,
    providerEventId || "",
    JSON.stringify(payload || {}),
    workspaceId || null,
    now(),
    now(),
  );
}

export function upsertSubscription(input: {
  workspace_id: string;
  provider: Provider;
  provider_customer_id?: string;
  provider_subscription_id?: string;
  plan: Plan;
  status: SubscriptionSnapshot["status"];
  current_period_end?: number | null;
  cancel_at_period_end?: boolean;
  canceled_at?: number | null;
  user_id?: string;
}) {
  const existing = db
    .prepare(
      `
    SELECT id FROM billing_subscriptions WHERE workspace_id = ? AND provider = ?
  `,
    )
    .get(input.workspace_id, input.provider) as Record<string, unknown> | undefined;
  const t = now();
  if (existing) {
    db.prepare(
      `
      UPDATE billing_subscriptions SET
        provider_customer_id = ?, provider_subscription_id = ?, plan = ?, status = ?,
        current_period_end = ?, cancel_at_period_end = ?, canceled_at = ?, updated_at = ?
      WHERE id = ?
    `,
    ).run(
      input.provider_customer_id || null,
      input.provider_subscription_id || null,
      input.plan,
      input.status,
      input.current_period_end || null,
      input.cancel_at_period_end ? 1 : 0,
      input.canceled_at || null,
      t,
      existing.id,
    );
    return existing.id;
  } else {
    const id = uid("sub_");
    db.prepare(
      `
      INSERT INTO billing_subscriptions
        (id, workspace_id, user_id, provider, provider_customer_id, provider_subscription_id, plan, status, current_period_end, cancel_at_period_end, canceled_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    ).run(
      id,
      input.workspace_id,
      input.user_id || null,
      input.provider,
      input.provider_customer_id || null,
      input.provider_subscription_id || null,
      input.plan,
      input.status,
      input.current_period_end || null,
      input.cancel_at_period_end ? 1 : 0,
      input.canceled_at || null,
      t,
      t,
    );
    return id;
  }
}

export function setWorkspacePlan(workspaceId: string, plan: Plan) {
  db.prepare(`UPDATE workspaces SET plan = ?, updated_at = ? WHERE id = ?`).run(
    plan,
    now(),
    workspaceId,
  );
}

export function currentSubscription(workspaceId: string): SubscriptionSnapshot | null {
  const row = db
    .prepare(
      `
    SELECT * FROM billing_subscriptions WHERE workspace_id = ? AND status IN ('active','trialing')
    ORDER BY created_at DESC LIMIT 1
  `,
    )
    .get(workspaceId) as Record<string, unknown> | undefined;
  if (!row) return null;
  return {
    provider: row.provider,
    provider_customer_id: row.provider_customer_id,
    provider_subscription_id: row.provider_subscription_id,
    plan: row.plan,
    status: row.status,
    current_period_end: row.current_period_end,
    cancel_at_period_end: !!row.cancel_at_period_end,
    canceled_at: row.canceled_at,
  };
}

export function listInvoices(workspaceId: string): InvoiceRecord[] {
  return db
    .prepare(
      `SELECT * FROM billing_invoices WHERE workspace_id = ? ORDER BY created_at DESC LIMIT 50`,
    )
    .all(workspaceId) as Record<string, unknown>[];
}

export function recordInvoice(input: {
  id: string;
  provider: Provider;
  amount_due: number;
  currency: string;
  status: string;
  invoice_url: string | null;
  pdf_url: string | null;
  paid_at: number | null;
  workspace_id: string;
}) {
  const existing = db
    .prepare(`SELECT id FROM billing_invoices WHERE provider_invoice_id = ? AND provider = ?`)
    .get(input.id, input.provider) as Record<string, unknown> | undefined;
  if (existing) return existing.id;
  db.prepare(
    `
    INSERT INTO billing_invoices (id, subscription_id, workspace_id, provider, provider_invoice_id, amount_due, currency, status, invoice_url, pdf_url, period_start, period_end, paid_at, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    input.id,
    null,
    input.workspace_id,
    input.provider,
    input.id,
    input.amount_due,
    input.currency,
    input.status,
    input.invoice_url,
    input.pdf_url,
    null,
    null,
    input.paid_at,
    now(),
  );
}


// Missing exports expected by billing page
export const PLANS = [
  { id: "free", name: "Free", price: 0, features: ["Dashboard", "CRM", "10 contacts"] },
  { id: "pro", name: "Pro", price: 49, features: ["Everything in Free", "Unlimited contacts", "All formulas", "Loyalty engine", "Brand equity"] },
  { id: "agency", name: "Agency", price: 299, features: ["Everything in Pro", "Multi-workspace", "White-label", "Priority support"] },
];

export const isBillingLive = process.env.STRIPE_SECRET_KEY ? true : false;

export async function createCheckoutSession(planId: string): Promise<{ url: string }> {
  if (!isBillingLive) return { url: "/billing" };
  return { url: "/billing" };
}
