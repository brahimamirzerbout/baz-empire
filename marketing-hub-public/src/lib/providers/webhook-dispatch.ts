/**
 * Webhook dispatcher — fans events out to user-registered endpoints.
 *
 * Used for:
 *   - ad.budget.alert     (CPA spike, spend cap)
 *   - deal.won           (CRM -> ad platforms for smart bidding)
 *   - campaign.paused    (collaboration notifications)
 *
 * Each delivery is recorded in webhook_deliveries for the audit trail.
 */
import { db, newId, now } from "@/lib/db";
import { createHmac } from "node:crypto";

export async function dispatchEvent(eventName: string, payload: Record<string, unknown>, workspace = "default") {
  const hooks = db
    .prepare(`SELECT id, url, secret, events FROM user_webhooks WHERE workspace = ? AND active = 1`)
    .all(workspace) as Record<string, unknown>[];
  const matched = hooks.filter((h) => {
    try {
      return (JSON.parse(h.events) as string[]).includes(eventName);
    } catch {
      return false;
    }
  });
  const t = now();
  for (const hook of matched) {
    const body = JSON.stringify({ event: eventName, payload, ts: t });
    let sigHeader: Record<string, string> = {};
    if (hook.secret) {
      const sig = createHmac("sha256", hook.secret).update(body).digest("hex");
      sigHeader["X-Webhook-Signature"] = `sha256=${sig}`;
    }
    const deliveryId = newId("wd_");
    db.prepare(
      `INSERT INTO webhook_deliveries (id, url, payload, event, attempt, ok, created_at) VALUES (?, ?, ?, ?, 1, 0, ?)`,
    ).run(deliveryId, hook.url, body, eventName, t);
    // Fire-and-forget. The fetch happens async; we update the delivery row
    // when it completes. In production swap to a queue with retries.
    fetch(hook.url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...sigHeader },
      body,
    })
      .then(async (r) => {
        const text = await r.text().catch(() => "");
        db.prepare(
          `UPDATE webhook_deliveries SET response_status = ?, response_body = ?, ok = ? WHERE id = ?`,
        ).run(r.status, text.slice(0, 1000), r.ok ? 1 : 0, deliveryId);
      })
      .catch((err) => {
        db.prepare(`UPDATE webhook_deliveries SET response_body = ?, ok = 0 WHERE id = ?`).run(
          String(err),
          deliveryId,
        );
      });
  }
  return matched.length;
}
