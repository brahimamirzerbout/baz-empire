/**
 * Provider registry — one place to look up any provider by id.
 */
import type { EmailProvider } from "./types";
import { smtpProvider } from "./smtp";
import { resendProvider } from "./resend";
import { sendgridProvider } from "./sendgrid";

export const providers: Record<string, EmailProvider> = {
  smtp: smtpProvider,
  resend: resendProvider,
  sendgrid: sendgridProvider,
};

/**
 * List of providers that need an active outbound network connection
 * (we still test SMTP locally but the others always go over the internet).
 */
export const providerList = [smtpProvider, resendProvider, sendgridProvider];
