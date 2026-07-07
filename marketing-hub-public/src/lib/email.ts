/**
 * Email orchestrator — the single entry point for sending.
 *
 * Rules:
 *   1. ALWAYS write to email_outbox first. The marketer's record of truth.
 *   2. If a provider is configured AND the message has no scheduled_for in the future,
 *      try to deliver through the provider. Mark outbox row with the result.
 *   3. If provider fails, the row stays in 'queued' so the scheduler can retry.
 *   4. If no provider is configured, the row goes straight to 'sent' with provider='local'
 *      (visible in /outbox as a locally-recorded send).
 *   5. Tracking pixels + click redirects are injected into HTML automatically.
 */
import { db, uid, now } from "@/lib/db";
import { providers } from "@/lib/providers";
import { linkifyHtml } from "@/lib/tracking";

type OutboxRow = {
  id: string;
  to_email: string;
  to_name?: string;
  from_email?: string;
  from_name?: string;
  subject: string;
  body_html: string;
  body_text?: string;
  reply_to?: string;
  campaign_id?: string;
  contact_id?: string;
  automation_id?: string;
  status: string;
  provider?: string;
  provider_message_id?: string;
  provider_response?: string;
  attempts: number;
  last_error?: string;
  scheduled_for?: number;
  sent_at?: number;
  created_at: number;
};

export function getActiveProvider(): { provider: string; config: Record<string, unknown> } | null {
  const row = db
    .prepare(`SELECT provider, config FROM provider_keys WHERE active = 1 LIMIT 1`)
    .get() as Record<string, unknown> | undefined;
  if (!row) return null;
  let cfg: Record<string, unknown> | undefined;
  try {
    cfg = JSON.parse(row.config);
  } catch {
    cfg = {};
  }
  return { provider: row.provider, config: cfg };
}

export function getDefaultFrom(provider: string, cfg: Record<string, unknown>): string {
  if (provider === "smtp") return cfg.user || "";
  if (provider === "resend") return cfg.from || "";
  if (provider === "sendgrid") return cfg.from || "";
  return "";
}

export type QueueInput = {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  fromName?: string;
  replyTo?: string;
  campaign_id?: string;
  contact_id?: string;
  automation_id?: string;
  scheduled_for?: number;
};

export async function queueAndSend(
  msg: QueueInput,
): Promise<{ id: string; status: string; provider?: string; error?: string }> {
  const id = uid("ob_");
  const t = now();

  // 1) Inject tracking pixels + click redirects BEFORE storing, so the stored
  //    HTML is already "armed" — no double-tracking if a retry happens later.
  const armedHtml = linkifyHtml(msg.html, {
    outboxId: id,
    baseUrl: process.env.MARKETING_HUB_PUBLIC_URL || "",
  });

  // 2) Insert into outbox as queued
  db.prepare(
    `
    INSERT INTO email_outbox
      (id, to_email, to_name, from_email, from_name, subject, body_html, body_text, reply_to,
       campaign_id, contact_id, automation_id, status, scheduled_for, attempts, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'queued', ?, 0, ?)
  `,
  ).run(
    id,
    msg.to,
    msg.toName || null,
    msg.from || null,
    msg.fromName || null,
    msg.subject,
    armedHtml,
    msg.text || null,
    msg.replyTo || null,
    msg.campaign_id || null,
    msg.contact_id || null,
    msg.automation_id || null,
    msg.scheduled_for || null,
    t,
  );

  // 3) If scheduled for the future, return — scheduler will pick it up
  if (msg.scheduled_for && msg.scheduled_for > t) {
    return { id, status: "queued" };
  }

  // 4) Try to send immediately
  const result = await tryDeliver(id);
  return { id, status: result.status, provider: result.provider, error: result.error };
}

export async function tryDeliver(
  outboxId: string,
): Promise<{ status: string; provider?: string; error?: string }> {
  const row = db.prepare(`SELECT * FROM email_outbox WHERE id = ?`).get(outboxId) as Record<string, unknown> | undefined;
  if (!row) return { status: "missing" };

  const active = getActiveProvider();

  // Local fallback — no provider configured → mark sent locally
  if (!active) {
    db.prepare(
      `UPDATE email_outbox SET status='sent', provider='local', sent_at=?, attempts=attempts+1 WHERE id=?`,
    ).run(now(), outboxId);
    return { status: "sent", provider: "local" };
  }

  // Provider configured → attempt send
  const provider = providers[active.provider];
  if (!provider) {
    db.prepare(
      `UPDATE email_outbox SET status='failed', last_error='Unknown provider', attempts=attempts+1 WHERE id=?`,
    ).run(outboxId);
    return { status: "failed", error: "Unknown provider" };
  }

  db.prepare(
    `UPDATE email_outbox SET status='sending', attempts=attempts+1, provider=? WHERE id=?`,
  ).run(active.provider, outboxId);

  const result = await provider.send(active.config, {
    to: row.to_email,
    toName: row.to_name || undefined,
    from: row.from_email || getDefaultFrom(active.provider, active.config),
    fromName: row.from_name || undefined,
    replyTo: row.reply_to || undefined,
    subject: row.subject,
    html: row.body_html,
    text: row.body_text || undefined,
    tags: row.campaign_id
      ? { campaign_id: row.campaign_id, outbox_id: row.id }
      : { outbox_id: row.id },
  });

  if (result.ok) {
    db.prepare(
      `
      UPDATE email_outbox
      SET status='sent', provider=?, provider_message_id=?, provider_response=?, sent_at=?, last_error=NULL
      WHERE id=?
    `,
    ).run(
      active.provider,
      result.providerMessageId,
      JSON.stringify(result.raw || {}).slice(0, 4000),
      now(),
      outboxId,
    );
    return { status: "sent", provider: active.provider };
  } else {
    db.prepare(
      `
      UPDATE email_outbox
      SET status='failed', last_error=?, provider_response=?
      WHERE id=?
    `,
    ).run(
      String(result.error).slice(0, 1000),
      JSON.stringify(result.raw || {}).slice(0, 4000),
      outboxId,
    );
    return { status: "failed", error: result.error, provider: active.provider };
  }
}

export function logEmailEvent(
  outboxId: string,
  kind: "open" | "click" | "delivery" | "bounce",
  url?: string,
  meta?: Record<string, unknown>,
) {
  db.prepare(
    `
    INSERT INTO email_events (id, outbox_id, kind, url, meta, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
  ).run(uid("ev_"), outboxId, kind, url || null, meta ? JSON.stringify(meta) : null, now());
}

/** Counts for the outbox UI summary. */
export function outboxStats() {
  const row = db
    .prepare(
      `
    SELECT
      COUNT(*) AS total,
      SUM(status='queued') AS queued,
      SUM(status='sending') AS sending,
      SUM(status='sent') AS sent,
      SUM(status='failed') AS failed,
      SUM(status='local') AS local_count
    FROM email_outbox
  `,
    )
    .get() as Record<string, unknown> | undefined;
  return {
    total: row.total || 0,
    queued: row.queued || 0,
    sending: row.sending || 0,
    sent: row.sent || 0,
    failed: row.failed || 0,
    local: row.local_count || 0,
  };
}
