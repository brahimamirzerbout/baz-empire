/**
 * Resend provider — POST https://api.resend.com/emails
 * Auth: Bearer token
 * Docs: https://resend.com/docs/api-reference/emails/send-email
 */
import type { EmailProvider, ProviderConfig, SendInput, SendResult, TestResult } from "./types";

type ResendConfig = { apiKey: string; from: string };

async function resendFetch(cfg: ResendConfig, path: string, body: Record<string, unknown>) {
  const res = await fetch(`https://api.resend.com${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json: Record<string, unknown> | undefined;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  return { ok: res.ok, status: res.status, json };
}

export const resendProvider: EmailProvider = {
  id: "resend",
  displayName: "Resend",
  async test(cfg: ProviderConfig): Promise<TestResult> {
    const c = cfg as ResendConfig;
    if (!c.apiKey) return { ok: false, error: "apiKey required" };
    try {
      // Resend exposes GET /api-keys — use it to verify the key
      const res = await fetch("https://api.resend.com/api-keys", {
        headers: { Authorization: `Bearer ${c.apiKey}` },
      });
      if (res.ok) return { ok: true, detail: "Resend API key is valid" };
      const text = await res.text();
      return { ok: false, error: `Resend rejected key (${res.status}): ${text.slice(0, 200)}` };
    } catch (e: unknown) {
      return { ok: false, error: e.message };
    }
  },

  async send(cfg: ProviderConfig, msg: SendInput): Promise<SendResult> {
    const c = cfg as ResendConfig;
    const r = await resendFetch(c, "/emails", {
      from: msg.from || c.from,
      to: [msg.to],
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
      reply_to: msg.replyTo ? [msg.replyTo] : undefined,
      tags: msg.tags
        ? Object.entries(msg.tags).map(([name, value]) => ({ name, value }))
        : undefined,
    });
    if (r.ok && r.json?.id) return { ok: true, providerMessageId: r.json.id, raw: r.json };
    return {
      ok: false,
      error: r.json?.message || r.json?.error?.message || `HTTP ${r.status}`,
      raw: r.json,
    };
  },
};
