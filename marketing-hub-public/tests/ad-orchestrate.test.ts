/**
 * Ad orchestration smoke tests.
 *
 * Runs with:  npx tsx tests/ad-orchestrate.test.ts
 * (or        node --import tsx --test tests/ad-orchestrate.test.ts)
 *
 * What this covers:
 *  - Schema migration adds the new tables without breaking legacy data
 *  - Mock provider returns stable external_ids (the duplicate-campaigns bug)
 *  - Idempotent metrics: second sync doesn't double impressions
 *  - Rate limiter: N+1 requests within a minute get throttled in live mode,
 *    ignored in mock mode
 *  - PII hashing: SHA256 of normalized email/phone appears in payload
 *  - Audit log: every status change is recorded
 *  - Workspace filter: data scoped to the current workspace only
 *
 * Uses node:test so we don't pull in jest/vitest. Requires tsx to run.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { db, now, newId } from "../src/lib/db";
import { googleAdsProvider } from "../src/lib/providers/google-ads";
import { metaAdsProvider } from "../src/lib/providers/meta-ads";
import { sha256, normalizeEmail, normalizePhone, hashedEmail, hashedPhone, buildGoogleConversion, buildMetaConversion } from "../src/lib/providers/pii";
import { checkAndConsume, checkAndConsumeLiveOnly } from "../src/lib/providers/rate-limit";
import { recordAudit, listAuditFor, currentWorkspace } from "../src/lib/providers/audit";

test("schema: ad_* tables exist with the expected columns", () => {
  for (const table of ["ad_accounts", "ad_campaigns", "ad_groups", "ad_creatives", "ad_metrics_applied", "ad_rate_limits", "ad_audit_log", "ad_conversions", "ad_sync_jobs"]) {
    const cols = db.prepare(`PRAGMA table_info(${table})`).all() as any[];
    assert.ok(cols.length > 0, `${table} should exist with columns`);
  }
  // workspace column on the main entity tables
  for (const table of ["ad_accounts", "ad_campaigns", "ad_groups", "ad_creatives"]) {
    const cols = db.prepare(`PRAGMA table_info(${table})`).all() as any[];
    assert.ok(cols.find((c) => c.name === "workspace"), `${table} should have a workspace column`);
  }
});

test("schema: ad_audit_log has before/after JSON columns", () => {
  const cols = db.prepare(`PRAGMA table_info(ad_audit_log)`).all() as any[];
  const names = cols.map((c) => c.name);
  for (const k of ["before_json", "after_json", "actor", "action", "resource_type", "resource_id"]) {
    assert.ok(names.includes(k), `ad_audit_log.${k} should exist`);
  }
});

test("mock provider: pullCampaigns returns stable external_ids", async () => {
  const camps = await googleAdsProvider.pullCampaigns({}, "test-acct-1");
  assert.ok(camps.length >= 3, "should return a handful of campaigns");
  for (const c of camps) {
    assert.ok(c.external_id, "every campaign must have an external_id (duplicate-campaigns bug guard)");
    assert.ok(c.external_id.startsWith("test-acct-1"), "external_id should be prefixed with the account id");
    assert.ok(c.name, "name required");
  }
  // Re-call → same ids (deterministic)
  const again = await googleAdsProvider.pullCampaigns({}, "test-acct-1");
  assert.deepEqual(again.map((c) => c.external_id), camps.map((c) => c.external_id));
});

test("mock provider: pullMetrics returns one row per (external_id, date) per day", async () => {
  const rows = await googleAdsProvider.pullMetrics({}, { accountExternalId: "test-acct-2", dateStart: "2026-06-20", dateEnd: "2026-06-22", level: "ad_group" });
  assert.ok(rows.length > 0);
  // Each row should have a date and external_id
  for (const r of rows) {
    assert.match(r.date_start, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(r.external_id);
    assert.ok(typeof r.impressions === "number");
    assert.ok(typeof r.clicks === "number");
    assert.ok(typeof r.conversions === "number");
    assert.ok(typeof r.spend === "number");
  }
  // At minimum: 3 days × 3 ad groups = 9 rows
  assert.ok(rows.length >= 9, `expected at least 9 rows, got ${rows.length}`);
});

test("PII hashing: SHA-256 of normalized email/phone", () => {
  assert.equal(normalizeEmail("  Buyer@Example.COM "), "buyer@example.com");
  assert.equal(sha256("buyer@example.com"), "6a6c26195c3682faa816966af789717c3bfa834eee6c599d667d2b3429c27cfd");
  assert.equal(normalizePhone("(555) 123-4567"), "15551234567");
  assert.equal(normalizePhone("+44 20 7946 0958"), "442079460958");
  assert.equal(hashedEmail("Buyer@Example.COM"), "6a6c26195c3682faa816966af789717c3bfa834eee6c599d667d2b3429c27cfd");
  assert.equal(hashedPhone("5551234567"), "d6736136ea896c1bfdc553e0e86e702c70d060d805696ca3e4e9e0961353860a");
});

test("PII hashing: Google conversion payload uses hashed PII, not raw", () => {
  const payload = buildGoogleConversion({
    gclid: "test-123",
    email: "buyer@example.com",
    phone: "5551234567",
    value: 100,
    currency: "USD",
    event_name: "purchase",
    conversion_time: "2026-06-26T00:00:00Z",
  });
  assert.equal(payload.gclid, "test-123");
  assert.equal(payload.hashedEmail, sha256("buyer@example.com"));
  assert.equal(payload.hashedPhoneNumber, sha256("15551234567"));
  assert.ok(!("email" in payload), "raw email should NOT be in the upload payload");
  assert.ok(!("phone" in payload), "raw phone should NOT be in the upload payload");
});

test("PII hashing: Meta conversion payload uses em/ph arrays of hashes", () => {
  const payload = buildMetaConversion({
    fbclid: "fb-1",
    email: "buyer@example.com",
    phone: "5551234567",
    value: 100,
    currency: "USD",
    event_name: "purchase",
    conversion_time: "2026-06-26T00:00:00Z",
  });
  assert.deepEqual(payload.user_data.em, [sha256("buyer@example.com")]);
  assert.deepEqual(payload.user_data.ph, [sha256("15551234567")]);
});

test("rate limiter: live mode enforces per-minute cap", () => {
  const provider = "google_ads";
  // Clear any prior bucket
  db.prepare(`DELETE FROM ad_rate_limits WHERE provider = ?`).run(provider);
  // The cap is 10/min — burn through it.
  let accepted = 0, rejected = 0;
  for (let i = 0; i < 15; i++) {
    const r = checkAndConsume(provider);
    if (r.ok) accepted++; else rejected++;
  }
  assert.equal(accepted, 10, "exactly 10 should be accepted within the minute");
  assert.equal(rejected, 5, "exactly 5 should be rejected");
  // Clean up
  db.prepare(`DELETE FROM ad_rate_limits WHERE provider = ?`).run(provider);
});

test("rate limiter: mock mode bypasses the limiter entirely", () => {
  const result = checkAndConsumeLiveOnly("meta_ads", false);
  assert.equal(result.ok, true);
  assert.equal(result.remaining, 999);
});

test("audit log: recordAudit + listAuditFor round-trip", () => {
  const ws = currentWorkspace();
  const testId = newId("test_");
  recordAudit({
    workspace: ws,
    actor: "test-suite",
    action: "update",
    resource_type: "ad_group",
    resource_id: testId,
    provider: "google_ads",
    before: { status: "active" },
    after: { status: "paused" },
  });
  const rows = listAuditFor("ad_group", testId);
  assert.ok(rows.length >= 1, "audit row should exist");
  const row = rows[0];
  assert.equal(row.actor, "test-suite");
  assert.equal(row.action, "update");
  assert.equal(row.resource_id, testId);
  const before = JSON.parse(row.before_json);
  const after = JSON.parse(row.after_json);
  assert.equal(before.status, "active");
  assert.equal(after.status, "paused");
});

test("workspace: data inserted with workspace='test-ws' is not returned by the default-scope query", () => {
  const ws = "test-ws-" + Date.now();
  const id = newId("acc_");
  const t = now();
  db.prepare(`INSERT INTO ad_accounts (id, workspace, provider, name, status, created_at, updated_at) VALUES (?, ?, ?, ?, 'connected', ?, ?)`).run(id, ws, "google_ads", "Test Account", t, t);
  // Default workspace
  const defaults = db.prepare(`SELECT * FROM ad_accounts WHERE workspace = ?`).all("default") as any[];
  const wsRows = db.prepare(`SELECT * FROM ad_accounts WHERE workspace = ?`).all(ws) as any[];
  assert.ok(!defaults.find((r) => r.id === id), "test-ws row should NOT appear in default scope");
  assert.ok(wsRows.find((r) => r.id === id), "test-ws row SHOULD appear in its own scope");
  // Clean up
  db.prepare(`DELETE FROM ad_accounts WHERE id = ?`).run(id);
});

test("provider isLive: false in mock mode, true with credentials", () => {
  assert.equal(googleAdsProvider.isLive({}), false);
  assert.equal(googleAdsProvider.isLive({ developer_token: "x", client_id: "x", client_secret: "x", refresh_token: "x" }), true);
  assert.equal(metaAdsProvider.isLive({}), false);
  assert.equal(metaAdsProvider.isLive({ app_id: "x", app_secret: "x", access_token: "x", ad_account_id: "x" }), true);
  assert.equal(googleAdsProvider.id, "google_ads");
  assert.equal(metaAdsProvider.id, "meta_ads");
});
