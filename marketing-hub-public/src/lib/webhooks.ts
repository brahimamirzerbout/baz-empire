/**
 * Webhook outbound — fire signed POSTs when domain events happen.
 * Stores every attempt in webhook_deliveries for audit and replay.
 */
import { db, uid, now } from "@/lib/db";
import crypto from "node:crypto";

export type WebhookEvent =
  | "deal.won"
  | "deal.lost"
  | "deal.created"
  | "contact.created"
  | "contact.updated"
  | "revenue.logged"
  | "campaign.started"
  | "campaign.completed"
  | "experiment.shipped"
  | "experiment.killed"
  | "lead.high_intent"
  | "churn.high_risk";

export interface DispatchResult {
  ok: boolean;
  status?: number;
  response_body?: string;
  error?: string;
}

export async function dispatchWebhook(
  url: string,
  event: WebhookEvent,
  payload: Record<string, unknown>,
  secret?: string,
): Promise<DispatchResult> {
  const body = JSON.stringify({ event, payload, ts: Date.now() });
  const signature = secret
    ? crypto.createHmac("sha256", secret).update(body).digest("hex")
    : undefined;

  let status: number | undefined,
    responseBody: string | undefined,
    ok = false,
    error: string | undefined;
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "BAZ-Empire-Webhooks/1.0",
        ...(signature ? { "X-BAZ-Signature": `sha256=${signature}` } : {}),
        "X-BAZ-Event": event,
      },
      body,
      signal: AbortSignal.timeout(10_000),
    });
    status = r.status;
    responseBody = (await r.text()).slice(0, 4000);
    ok = r.ok;
  } catch (e: unknown) {
    error = e.message || "fetch failed";
  }

  db.prepare(
    `
    INSERT INTO webhook_deliveries (id, url, payload, event, response_status, response_body, ok, attempt, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(uid("wh_"), url, body, event, status || null, responseBody || null, ok ? 1 : 0, 1, now());

  return { ok, status, response_body: responseBody, error };
}

/** Find all automations whose trigger matches the event and fire them. */
export async function fireAutomationsForEvent(
  event: WebhookEvent,
  payload: Record<string, unknown>,
): Promise<DispatchResult[]> {
  const autos = db
    .prepare(`SELECT * FROM automations WHERE active = 1 AND trigger = ?`)
    .all(event) as Record<string, unknown>[];
  const results: DispatchResult[] = [];
  for (const a of autos) {
    let cfg: Record<string, unknown> = {};
    try {
      cfg = JSON.parse(a.config || "{}");
    } catch {}
    if (a.action === "webhook" && cfg.url) {
      const r = await dispatchWebhook(
        cfg.url,
        event,
        { ...payload, automation_id: a.id, automation_name: a.name },
        cfg.secret,
      );
      db.prepare(`UPDATE automations SET runs = runs + 1, last_run = ? WHERE id = ?`).run(
        now(),
        a.id,
      );
      results.push(r);
    }
  }
  return results;
}

export function listDeliveries(event?: string, limit = 100) {
  if (event)
    return db
      .prepare(`SELECT * FROM webhook_deliveries WHERE event = ? ORDER BY created_at DESC LIMIT ?`)
      .all(event, limit) as Record<string, unknown>[];
  return db
    .prepare(`SELECT * FROM webhook_deliveries ORDER BY created_at DESC LIMIT ?`)
    .all(limit) as Record<string, unknown>[];
}
