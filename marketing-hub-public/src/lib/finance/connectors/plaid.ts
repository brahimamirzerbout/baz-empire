/**
 * Plaid connector.
 *
 * ENV vars (all optional):
 *   PLAID_CLIENT_ID
 *   PLAID_SECRET
 *   PLAID_ENV            'sandbox' (default) | 'development' | 'production'
 *
 * Without env vars, `status()` reports disconnected and `linkToken()`/`sync()`
 * throw a clear error. The UI at /finance/connectors shows the missing config
 * and offers "Configure" instructions.
 *
 * Once configured, the connector:
 *   1. Issues a Plaid Link token (the frontend opens Plaid Link UI)
 *   2. Exchanges the public_token for an access_token (server-side, stored in
 *      connector_accounts.access_token_encrypted)
 *   3. /sync pulls transactions since last cursor and posts them as journal
 *      entries via createJournalEntry() — debiting cash / crediting revenue,
 *      or crediting cash / debiting expense, depending on direction.
 *
 * Implementation note: we don't add `plaid` to package.json (the official
 * SDK is heavy). Instead, we make raw HTTPS calls — the Plaid API is small
 * and well-documented. If you want the SDK, `npm i plaid` and swap these
 * calls.
 */
import { db, uid, now } from "@/lib/db";
import { createJournalEntry } from "../accounting";

const PLAID_HOSTS: Record<string, string> = {
  sandbox: "https://sandbox.plaid.com",
  development: "https://development.plaid.com",
  production: "https://production.plaid.com",
};

export function plaidConfig() {
  const clientId = process.env.PLAID_CLIENT_ID;
  const secret = process.env.PLAID_SECRET;
  const env = process.env.PLAID_ENV || "sandbox";
  return {
    configured: !!clientId && !!secret,
    env,
    host: PLAID_HOSTS[env] || PLAID_HOSTS.sandbox,
    clientId,
    secret,
  };
}

export function plaidStatus() {
  const cfg = plaidConfig();
  const linkedAccounts = db
    .prepare(
      `SELECT id, name, external_id, status, last_sync_at FROM connector_accounts WHERE provider = 'plaid'`,
    )
    .all() as Record<string, unknown>[];
  return { ...cfg, linked_accounts: linkedAccounts };
}

async function plaidFetch(path: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
  const cfg = plaidConfig();
  if (!cfg.configured)
    throw new Error("Plaid not configured — set PLAID_CLIENT_ID and PLAID_SECRET");
  const res = await fetch(`${cfg.host}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Plaid ${path} failed (${res.status}): ${text.slice(0, 300)}`);
  }
  return res.json();
}

/** Create a Link token the frontend uses to open Plaid Link. */
export async function plaidLinkToken(opts: {
  userId: string;
  userName?: string;
}): Promise<{ link_token: string; expiration: string }> {
  return plaidFetch("/link/token/create", {
    client_id: plaidConfig().clientId,
    secret: plaidConfig().secret,
    user: { client_user_id: opts.userId },
    client_name: "Marketing Hub Finance",
    products: ["transactions"],
    country_codes: ["US", "CA", "GB", "DE", "FR", "ES", "NL", "CH", "IE"],
    language: "en",
  });
}

/** Exchange a Link public_token for a long-lived access_token, save it. */
export async function plaidExchangePublicToken(opts: {
  publicToken: string;
  name?: string;
}): Promise<{ id: string; item_id: string }> {
  const r = await plaidFetch("/item/public_token/exchange", {
    public_token: opts.publicToken,
  });
  const id = uid("conn_");
  db.prepare(
    `
    INSERT INTO connector_accounts (id, workspace, provider, name, external_id, access_token_encrypted, status, last_sync_at, metadata, created_at, updated_at)
    VALUES (?, 'default', 'plaid', ?, ?, ?, 'active', NULL, ?, ?, ?)
  `,
  ).run(
    id,
    opts.name || "Plaid Item",
    r.item_id,
    r.access_token,
    JSON.stringify({ access_token: r.access_token, item_id: r.item_id }),
    now(),
    now(),
  );
  return { id, item_id: r.item_id };
}

/**
 * Pull new transactions since the stored cursor and post them as journal entries.
 * Returns counts + last sync timestamp.
 */
export async function plaidSync(
  connectorId: string,
): Promise<{ added: number; modified: number; removed: number; cursor_set: boolean }> {
  const row = db.prepare(`SELECT * FROM connector_accounts WHERE id = ?`).get(connectorId) as Record<string, unknown> | undefined;
  if (!row) throw new Error("Connector not found");
  const meta = JSON.parse(row.metadata || "{}");
  const accessToken = meta.access_token;
  if (!accessToken) throw new Error("No access token in connector metadata");

  // Pull cursor from metadata
  const cursor = meta.cursor || "";

  const r = await plaidFetch("/transactions/sync", {
    access_token: accessToken,
    cursor: cursor || undefined,
  });

  let added = 0,
    modified = 0,
    removed = 0;
  for (const t of r.added || []) {
    postTransaction(row.workspace, t);
    added++;
  }
  for (const t of r.modified || []) {
    // TBD: handle correctly
    modified++;
  }
  for (const t of r.removed || []) {
    removed++;
  }

  // Persist new cursor
  meta.cursor = r.next_cursor;
  db.prepare(
    `UPDATE connector_accounts SET metadata = ?, last_sync_at = ?, updated_at = ? WHERE id = ?`,
  ).run(JSON.stringify(meta), now(), now(), connectorId);

  return { added, modified, removed, cursor_set: !!r.next_cursor };
}

function postTransaction(workspace: string, txn: Record<string, unknown>) {
  const amount: number = txn.amount; // positive = outflow
  const direction = amount >= 0 ? "out" : "in";
  const absAmount = Math.abs(amount);

  // Default mapping: outgoing -> expense, incoming -> revenue
  const cashAccount = "1100"; // Bank — Operating
  const offsetAccount = direction === "in" ? "4000" : "6700"; // revenue or office supplies

  createJournalEntry({
    workspace,
    txn_date: new Date(txn.date).getTime(),
    description: txn.name || txn.merchant_name || "Bank transaction",
    reference: txn.transaction_id,
    source: "plaid",
    source_id: txn.transaction_id,
    currency: txn.iso_currency_code || "USD",
    lines:
      direction === "in"
        ? [
            {
              account_code: cashAccount,
              debit: absAmount,
              amount_currency: absAmount,
              currency: txn.iso_currency_code || "USD",
            },
            {
              account_code: offsetAccount,
              credit: absAmount,
              amount_currency: absAmount,
              currency: txn.iso_currency_code || "USD",
              memo: txn.merchant_name || "",
            },
          ]
        : [
            {
              account_code: offsetAccount,
              debit: absAmount,
              amount_currency: absAmount,
              currency: txn.iso_currency_code || "USD",
              memo: txn.merchant_name || "",
            },
            {
              account_code: cashAccount,
              credit: absAmount,
              amount_currency: absAmount,
              currency: txn.iso_currency_code || "USD",
            },
          ],
    tags: txn.category ? txn.category : undefined,
  });
}
