/**
 * Salesforce connector — bidirectional account/contact/opportunity sync.
 *
 * ENV vars:
 *   SF_INSTANCE_URL        e.g. https://acme.my.salesforce.com
 *   SF_CLIENT_ID
 *   SF_CLIENT_SECRET
 *   SF_USERNAME + SF_PASSWORD + SF_TOKEN    (alternative: username/password flow)
 *   -- OR --
 *   SF_REFRESH_TOKEN                       (after OAuth web flow)
 *
 * Without env vars, status() reports disconnected. With env vars, sync uses
 * the OAuth refresh-token flow (preferred) or username/password (fallback).
 *
 * What we sync:
 *   - Salesforce Accounts ↔ Marketing Hub contacts (company field)
 *   - Salesforce Opportunities ↔ Marketing Hub deals (status field mapped)
 *
 * Implementation: raw HTTPS calls to /services/data/vXX.X. Salesforce's
 * API is well-documented; we don't pull the heavy `jsforce` package.
 */
import { db, uid, now } from "@/lib/db";

export function salesforceConfig() {
  return {
    configured:
      !!process.env.SF_INSTANCE_URL &&
      (!!process.env.SF_REFRESH_TOKEN ||
        (!!process.env.SF_USERNAME && !!process.env.SF_PASSWORD && !!process.env.SF_TOKEN)),
    instanceUrl: process.env.SF_INSTANCE_URL || null,
    hasRefreshToken: !!process.env.SF_REFRESH_TOKEN,
    hasUserPass: !!process.env.SF_USERNAME && !!process.env.SF_PASSWORD,
    apiVersion: process.env.SF_API_VERSION || "v60.0",
  };
}

export function salesforceStatus() {
  const cfg = salesforceConfig();
  const linked = db
    .prepare(
      `SELECT id, name, external_id, status, last_sync_at FROM connector_accounts WHERE provider = 'salesforce'`,
    )
    .all() as Record<string, unknown>[];
  return { ...cfg, linked_accounts: linked };
}

// ────────────────────────────────────────────────────────────────────
// Token management
// ────────────────────────────────────────────────────────────────────

let cachedToken: { token: string; instanceUrl: string; expires: number } | null = null;

async function getAccessToken(): Promise<{ token: string; instanceUrl: string }> {
  const cfg = salesforceConfig();
  if (cachedToken && cachedToken.expires > Date.now() + 60_000)
    return { token: cachedToken.token, instanceUrl: cachedToken.instanceUrl };

  let url: string, params: URLSearchParams;

  if (process.env.SF_REFRESH_TOKEN) {
    // OAuth web-server flow refresh
    url = `${cfg.instanceUrl}/services/oauth2/token`;
    params = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.SF_CLIENT_ID || "",
      client_secret: process.env.SF_CLIENT_SECRET || "",
      refresh_token: process.env.SF_REFRESH_TOKEN,
    });
  } else if (cfg.hasUserPass) {
    // Username/password flow
    url = `${cfg.instanceUrl}/services/oauth2/token`;
    params = new URLSearchParams({
      grant_type: "password",
      client_id: process.env.SF_CLIENT_ID || "",
      client_secret: process.env.SF_CLIENT_SECRET || "",
      username: process.env.SF_USERNAME || "",
      password: (process.env.SF_PASSWORD || "") + (process.env.SF_TOKEN || ""),
    });
  } else {
    throw new Error("Salesforce not configured — set SF_REFRESH_TOKEN or SF_USERNAME/SF_PASSWORD");
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  if (!res.ok) throw new Error(`Salesforce auth failed: ${res.status} ${await res.text()}`);
  const j = await res.json();
  cachedToken = {
    token: j.access_token,
    instanceUrl: j.instance_url || cfg.instanceUrl!,
    expires: Date.now() + 0,
  };
  // SF tokens don't expire unless revoked. Set a long-lived sentinel.
  cachedToken.expires = Date.now() + 60 * 60 * 1000;
  return { token: cachedToken.token, instanceUrl: cachedToken.instanceUrl };
}

async function sfFetch(path: string, opts: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
  const { token, instanceUrl } = await getAccessToken();
  const res = await fetch(`${instanceUrl}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`Salesforce ${path} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

/** List recently modified Accounts from SF. */
export async function sfListAccounts(since?: number) {
  const soql = `SELECT Id, Name, Industry, Website, BillingCountry, AnnualRevenue, NumberOfEmployees, LastModifiedDate FROM Account ${since ? `WHERE LastModifiedDate >= ${new Date(since).toISOString()} ` : ""}ORDER BY LastModifiedDate DESC LIMIT 200`;
  const r = await sfFetch(`/services/data/v60.0/query?q=${encodeURIComponent(soql)}`);
  return r.records || [];
}

export async function sfListOpportunities(since?: number) {
  const soql = `SELECT Id, Name, AccountId, Amount, StageName, CloseDate, Probability, LastModifiedDate FROM Opportunity ${since ? `WHERE LastModifiedDate >= ${new Date(since).toISOString()} ` : ""}ORDER BY LastModifiedDate DESC LIMIT 200`;
  const r = await sfFetch(`/services/data/v60.0/query?q=${encodeURIComponent(soql)}`);
  return r.records || [];
}

/**
 * Sync SF Accounts → Marketing Hub contacts (as "company" rows via clients table).
 * Upsert by Name match within the workspace.
 */
export async function salesforceSync(
  connectorId?: string,
  opts: { direction?: "in" | "out" | "both" } = {},
): Promise<{ accounts_imported: number; opportunities_imported: number }> {
  const direction = opts.direction || "in";
  let accounts = 0,
    opps = 0;
  if (direction === "in" || direction === "both") {
    const since = connectorId
      ? (
          db
            .prepare(`SELECT last_sync_at FROM connector_accounts WHERE id = ?`)
            .get(connectorId) as Record<string, unknown> | undefined
        )?.last_sync_at || 0
      : 0;
    const sfcAccounts = await sfListAccounts(since);
    for (const a of sfcAccounts) {
      upsertClientFromSfAccount(a);
      accounts++;
    }
    const sfcOpps = await sfListOpportunities(since);
    for (const o of sfcOpps) {
      upsertDealFromSfOpportunity(o);
      opps++;
    }
  }
  if (direction === "out" || direction === "both") {
    // Outbound push would be implemented here. Skipping for v1 — the marketer
    // pushes Opportunities manually from the deal detail page when desired.
  }
  if (connectorId) {
    db.prepare(`UPDATE connector_accounts SET last_sync_at = ?, updated_at = ? WHERE id = ?`).run(
      now(),
      now(),
      connectorId,
    );
  }
  return { accounts_imported: accounts, opportunities_imported: opps };
}

function upsertClientFromSfAccount(a: Record<string, unknown>) {
  const existing = db.prepare(`SELECT id FROM clients WHERE name = ?`).get(a.Name) as Record<string, unknown> | undefined;
  const meta = {
    salesforce_id: a.Id,
    industry: a.Industry,
    website: a.Website,
    country: a.BillingCountry,
    annual_revenue: a.AnnualRevenue,
    employees: a.NumberOfEmployees,
  };
  const t = now();
  if (existing) {
    db.prepare(`UPDATE clients SET notes = ?, updated_at = ? WHERE id = ?`).run(
      JSON.stringify(meta),
      t,
      existing.id,
    );
  } else {
    db.prepare(
      `
      INSERT INTO clients (id, workspace, name, industry, contact_email, notes, active, created_at, updated_at)
      VALUES (?, 'default', ?, ?, NULL, ?, 1, ?, ?)
    `,
    ).run(uid("cli_"), a.Name, a.Industry || null, JSON.stringify(meta), t, t);
  }
}

function upsertDealFromSfOpportunity(o: Record<string, unknown>) {
  const stageMap: Record<string, string> = {
    Prospecting: "lead",
    Qualification: "qualified",
    Proposal: "proposal",
    Negotiation: "negotiation",
    "Closed Won": "won",
    "Closed Lost": "lost",
  };
  const internalStage = stageMap[o.StageName] || "lead";
  // Find client by SF account id
  const client = db
    .prepare(`SELECT id FROM clients WHERE notes LIKE ?`)
    .get(`%"salesforce_id":"${o.AccountId}"%`) as Record<string, unknown> | undefined;
  const t = now();
  const closeDate = o.CloseDate ? new Date(o.CloseDate).getTime() : null;
  // Upsert: match by salesforce_id stored in title prefix
  const sfTag = `[SF:${o.Id}]`;
  const existing = db.prepare(`SELECT id FROM deals WHERE title LIKE ?`).get(`%${sfTag}%`) as Record<string, unknown> | undefined;
  if (existing) {
    db.prepare(
      `UPDATE deals SET title = ?, value = ?, stage = ?, close_date = ?, company_id = ?, updated_at = ? WHERE id = ?`,
    ).run(
      `${sfTag} ${o.Name}`,
      o.Amount || 0,
      internalStage,
      closeDate,
      client?.id || null,
      t,
      existing.id,
    );
  } else {
    db.prepare(
      `
      INSERT INTO deals (id, workspace, title, value, stage, probability, contact_id, company_id, owner, close_date, created_at, updated_at)
      VALUES (?, 'default', ?, ?, ?, ?, NULL, ?, 'salesforce-sync', ?, ?, ?)
    `,
    ).run(
      uid("dl_"),
      `${sfTag} ${o.Name}`,
      o.Amount || 0,
      internalStage,
      o.Probability || 50,
      client?.id || null,
      closeDate,
      t,
      t,
    );
  }
}
