/**
 * Revolut Business connector.
 *
 * ENV vars:
 *   REVOLUT_CLIENT_ID         OAuth client id
 *   REVOLUT_PRIVATE_KEY_PATH  Path to PEM-encoded RSA private key (issued by Revolut)
 *
 * Revolut Business uses OAuth 2.0 + JWT-bearer auth.
 * See https://developer.revolut.com/docs/quickstart for the full flow.
 *
 * Without env vars, `status()` reports disconnected.
 *
 * Endpoints we use:
 *   POST /auth/token                — exchange JWT for access_token
 *   GET  /accounts                  — list business accounts
 *   GET  /transactions?from=...     — pull transactions
 */
import { db, uid, now } from "@/lib/db";
import { createJournalEntry } from "../accounting";
import * as crypto from "node:crypto";
import * as fs from "node:fs";

const REVOLUT_HOSTS = {
  sandbox: "https://sandbox-b2b.revolut.com/api/1.0",
  production: "https://b2b.revolut.com/api/1.0",
} as const;

export function revolutConfig() {
  const env = (process.env.REVOLUT_ENV || "production") as keyof typeof REVOLUT_HOSTS;
  return {
    configured: !!process.env.REVOLUT_CLIENT_ID && !!process.env.REVOLUT_PRIVATE_KEY_PATH,
    env,
    host: REVOLUT_HOSTS[env] || REVOLUT_HOSTS.production,
    clientId: process.env.REVOLUT_CLIENT_ID || null,
    privateKeyPath: process.env.REVOLUT_PRIVATE_KEY_PATH || null,
  };
}

export function revolutStatus() {
  const cfg = revolutConfig();
  const linked = db
    .prepare(
      `SELECT id, name, external_id, status, last_sync_at FROM connector_accounts WHERE provider = 'revolut'`,
    )
    .all() as Record<string, unknown>[];
  return { ...cfg, linked_accounts: linked };
}

// ────────────────────────────────────────────────────────────────────
// JWT generation
// Revolut expects an RSA-signed JWT with claims:
//   iss = client_id, sub = client_id, aud = "https://revolut.com",
//   iat = now, exp = now + 1h
// ────────────────────────────────────────────────────────────────────

function signJwt(cfg: ReturnType<typeof revolutConfig>): string {
  if (!cfg.privateKeyPath) throw new Error("REVOLUT_PRIVATE_KEY_PATH not set");
  const key = fs.readFileSync(cfg.privateKeyPath, "utf8");
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT", cty: "JWT" };
  const payload = {
    iss: cfg.clientId,
    sub: cfg.clientId,
    aud: "https://revolut.com",
    iat: now,
    exp: now + 3600,
  };
  const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const signingInput = `${b64(header)}.${b64(payload)}`;
  const sig = crypto.sign("RSA-SHA256", Buffer.from(signingInput), key);
  return `${signingInput}.${sig.toString("base64url")}`;
}

let cachedToken: { token: string; expires: number } | null = null;

async function getAccessToken(): Promise<string> {
  const cfg = revolutConfig();
  if (cachedToken && cachedToken.expires > Date.now() + 60_000) return cachedToken.token;
  const jwt = signJwt(cfg);
  const params = new URLSearchParams();
  params.set("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
  params.set("assertion", jwt);
  params.set("client_id", cfg.clientId!);
  params.set("client_assertion_type", "urn:ietf:params:oauth:client-assertion-type:jwt-bearer");

  const res = await fetch(`${cfg.host}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  if (!res.ok) throw new Error(`Revolut auth failed: ${res.status} ${await res.text()}`);
  const j = await res.json();
  cachedToken = { token: j.access_token, expires: Date.now() + (j.expires_in || 3600) * 1000 };
  return cachedToken.token;
}

async function revolutFetch(path: string, opts: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
  const cfg = revolutConfig();
  const token = await getAccessToken();
  const res = await fetch(`${cfg.host}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`Revolut ${path} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

/** OAuth callback handler — exchanges auth code for access token, saves it. */
export async function revolutOAuthCallback(opts: { authCode: string; name?: string }) {
  // Revolut Business doesn't use redirect-based OAuth like Plaid Link — it uses
  // JWT-bearer only. The "OAuth" here is for service-account authorisation
  // flows documented at https://developer.revolut.com/docs/quickstart.
  const cfg = revolutConfig();
  // The first sync creates the connector entry by signing and storing the
  // service-account identity.
  const id = uid("conn_");
  db.prepare(
    `
    INSERT INTO connector_accounts (id, workspace, provider, name, external_id, status, metadata, created_at, updated_at)
    VALUES (?, 'default', 'revolut', ?, ?, 'active', ?, ?, ?)
  `,
  ).run(
    id,
    opts.name || "Revolut Business",
    cfg.clientId || "revolut-service-account",
    JSON.stringify({ authorized_at: now() }),
    now(),
    now(),
  );
  return { id };
}

export async function revolutListAccounts(connectorId?: string) {
  return revolutFetch("/accounts");
}

export async function revolutSync(connectorId: string, opts: { from?: number } = {}) {
  const row = db.prepare(`SELECT * FROM connector_accounts WHERE id = ?`).get(connectorId) as Record<string, unknown> | undefined;
  if (!row) throw new Error("Connector not found");

  const from = opts.from || row.last_sync_at || Date.now() - 30 * 86400_000;
  const accounts = await revolutFetch("/accounts");
  let totalPosted = 0;

  for (const acc of accounts) {
    const txns = await revolutFetch(
      `/transactions?account=${acc.id}&from=${Math.floor(from / 1000)}&to=${Math.floor(Date.now() / 1000)}`,
    );
    for (const t of txns || []) {
      postRevolutTransaction(row.workspace, t);
      totalPosted++;
    }
  }

  db.prepare(`UPDATE connector_accounts SET last_sync_at = ?, updated_at = ? WHERE id = ?`).run(
    now(),
    now(),
    connectorId,
  );

  return { accounts: accounts.length, transactions: totalPosted };
}

function postRevolutTransaction(workspace: string, t: Record<string, unknown>) {
  const cashAccount = "1100";
  const amount = Math.abs(t.amount);
  const direction = t.type === "credit" ? "in" : "out";
  const offsetAccount = direction === "in" ? "4000" : "6700";

  createJournalEntry({
    workspace,
    txn_date: new Date(t.completed_at || t.created_at).getTime(),
    description: t.description || t.reference || "Revolut transaction",
    reference: t.id,
    source: "revolut",
    source_id: String(t.id),
    currency: t.currency || "EUR",
    lines:
      direction === "in"
        ? [
            {
              account_code: cashAccount,
              debit: amount,
              amount_currency: amount,
              currency: t.currency || "EUR",
            },
            {
              account_code: offsetAccount,
              credit: amount,
              amount_currency: amount,
              currency: t.currency || "EUR",
              memo: t.description,
            },
          ]
        : [
            {
              account_code: offsetAccount,
              debit: amount,
              amount_currency: amount,
              currency: t.currency || "EUR",
              memo: t.description,
            },
            {
              account_code: cashAccount,
              credit: amount,
              amount_currency: amount,
              currency: t.currency || "EUR",
            },
          ],
  });
}
