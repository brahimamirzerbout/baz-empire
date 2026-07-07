/**
 * Provider abstraction — every email provider implements the same shape.
 * Local-first: if no provider is configured, we still capture the message
 * in the outbox so the marketer sees it in /outbox.
 */

export type SendInput = {
  to: string;
  toName?: string;
  from?: string;
  fromName?: string;
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
  /** Headers / tags the provider supports. Provider-specific keys are ignored if not supported. */
  tags?: Record<string, string>;
};

export type SendResult =
  { ok: true; providerMessageId: string; raw: unknown } | { ok: false; error: string; raw?: unknown };

export type TestResult =
  { ok: true; detail: string; raw?: unknown } | { ok: false; error: string; raw?: unknown };

export type ProviderConfig = {
  /** Provider-specific config: API key, from, host, etc. */
  [key: string]: unknown;
};

export type EmailProvider = {
  id: "smtp" | "resend" | "sendgrid" | "local";
  displayName: string;
  /** Verify the config is reachable (e.g. ping API, validate key). */
  test(cfg: ProviderConfig): Promise<TestResult>;
  /** Actually send the message. */
  send(cfg: ProviderConfig, msg: SendInput): Promise<SendResult>;
};
