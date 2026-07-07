/**
 * SendGrid provider — POST https://api.sendgrid.com/v3/mail/send
 * Auth: Bearer token
 * Docs: https://docs.sendgrid.com/api-reference/mail-send/mail-send
 */
import type { EmailProvider, ProviderConfig, SendInput, SendResult, TestResult } from "./types";

type SendGridConfig = { apiKey: string; from: string; fromName?: string };

export const sendgridProvider: EmailProvider = {
  id: "sendgrid",
  displayName: "SendGrid",
  async test(cfg: ProviderConfig): Promise<TestResult> {
    const c = cfg as SendGridConfig;
    if (!c.apiKey) return { ok: false, error: "apiKey required" };
    try {
      // Verify the key by listing scopes (cheap, doesn't send mail)
      const res = await fetch("https://api.sendgrid.com/v3/scopes", {
        headers: { Authorization: `Bearer ${c.apiKey}` },
      });
      if (res.ok) {
        const j = (await res.json()) as Record<string, unknown>;
        return { ok: true, detail: `SendGrid key valid (${j.scopes?.length ?? 0} scopes)` };
      }
      const text = await res.text();
      return { ok: false, error: `SendGrid rejected key (${res.status}): ${text.slice(0, 200)}` };
    } catch (e: unknown) {
      return { ok: false, error: e.message };
    }
  },

  async send(cfg: ProviderConfig, msg: SendInput): Promise<SendResult> {
    const c = cfg as SendGridConfig;
    const fromEmail = msg.from || c.from;
    const fromName = msg.fromName || c.fromName || c.from;
    const body = {
      personalizations: [
        {
          to: [{ email: msg.to, name: msg.toName }],
        },
      ],
      from: { email: fromEmail, name: fromName },
      reply_to: msg.replyTo ? { email: msg.replyTo } : undefined,
      subject: msg.subject,
      content: [
        ...(msg.text ? [{ type: "text/plain", value: msg.text }] : []),
        { type: "text/html", value: msg.html },
      ],
      // Custom args surface as event metadata — useful for tracking correlation
      custom_args: msg.tags
        ? Object.fromEntries(Object.entries(msg.tags).map(([k, v]) => [`mh_${k}`, v]))
        : undefined,
      tracking_settings: {
        click_tracking: { enable: false, enable_text: false }, // we do our own
        open_tracking: { enable: false }, // we do our own
      },
    };
    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${c.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (res.status === 202) {
      const messageId = res.headers.get("x-message-id") || `${Date.now()}`;
      return { ok: true, providerMessageId: messageId, raw: { status: 202 } };
    }
    const text = await res.text();
    let json: Record<string, unknown> | undefined;
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }
    return { ok: false, error: json?.errors?.[0]?.message || `HTTP ${res.status}`, raw: json };
  },
};
