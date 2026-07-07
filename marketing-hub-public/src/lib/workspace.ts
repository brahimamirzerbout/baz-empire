/**
 * Workspace / tenancy layer.
 *
 * Every table carries workspace_id. Every read & write goes through one of
 * these helpers — so a single query bug can't leak data across tenants.
 *
 * The "default" workspace is used for the seeded single-user flow so the
 * existing app keeps working. When a real signup happens, the workspace is
 * created and the user becomes its owner.
 */
import { db, uid, now } from "@/lib/db";
import type { NextRequest } from "next/server";

export const DEFAULT_WORKSPACE = "default";
export const DEFAULT_WORKSPACE_NAME = "My Workspace";

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  owner_id?: string;
  plan: "free" | "pro" | "agency";
  status: "active" | "trial" | "suspended";
  brand_color?: string;
  created_at: number;
  updated_at: number;
}

// Tables are created in db/index.ts (avoids circular import).
// This function is a no-op kept for backward compat.
export function ensureWorkspacesTable() {
  // no-op — tables are created in db/index.ts to avoid circular import.
}

let seeded = false;
export function seedDefaultWorkspace() {
  if (seeded) return;
  seeded = true;
  // Ensure table exists (in case this module loads before init()).
  db.exec(`CREATE TABLE IF NOT EXISTS workspaces (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    owner_id TEXT,
    plan TEXT NOT NULL DEFAULT 'free',
    status TEXT NOT NULL DEFAULT 'active',
    brand_color TEXT DEFAULT '#888888',
    settings TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`);
  const exists = db.prepare(`SELECT id FROM workspaces WHERE id = ?`).get(DEFAULT_WORKSPACE) as Record<string, unknown> | undefined;
  if (exists) return;
  const t = now();
  db.prepare(
    `
    INSERT INTO workspaces (id, name, slug, plan, status, brand_color, created_at, updated_at)
    VALUES (?, ?, ?, 'pro', 'active', '#888888', ?, ?)
  `,
  ).run(DEFAULT_WORKSPACE, DEFAULT_WORKSPACE_NAME, "default", t, t);
}

/* ───── Workspace CRUD ───── */

export function listWorkspaces(): Workspace[] {
  return db.prepare(`SELECT * FROM workspaces ORDER BY created_at ASC`).all() as Record<string, unknown>[];
}

export function getWorkspace(id: string): Workspace | null {
  return db.prepare(`SELECT * FROM workspaces WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
}

export function getWorkspaceBySlug(slug: string): Workspace | null {
  return db.prepare(`SELECT * FROM workspaces WHERE slug = ?`).get(slug) as Record<string, unknown> | undefined;
}

export function createWorkspace(input: {
  name: string;
  slug?: string;
  owner_id?: string;
  plan?: Workspace["plan"];
  brand_color?: string;
}): Workspace {
  seedDefaultWorkspace();
  const id = uid("ws_");
  const slug =
    (input.slug || input.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 32) || "ws";
  // Ensure unique slug
  let finalSlug = slug;
  let i = 1;
  while (db.prepare(`SELECT id FROM workspaces WHERE slug = ?`).get(finalSlug)) {
    finalSlug = `${slug}-${i++}`;
  }
  const t = now();
  db.prepare(
    `
    INSERT INTO workspaces (id, name, slug, owner_id, plan, status, brand_color, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 'active', ?, ?, ?)
  `,
  ).run(
    id,
    input.name,
    finalSlug,
    input.owner_id || null,
    input.plan || "free",
    input.brand_color || "#888888",
    t,
    t,
  );

  if (input.owner_id) {
    db.prepare(
      `INSERT INTO workspace_members (id, workspace_id, user_id, role, created_at) VALUES (?, ?, ?, 'owner', ?)`,
    ).run(uid("wsm_"), id, input.owner_id, t);
  }
  return getWorkspace(id)!;
}

export function updateWorkspace(id: string, patch: Partial<Workspace>): Workspace | null {
  const existing = getWorkspace(id);
  if (!existing) return null;
  const merged = { ...existing, ...patch, updated_at: now() };
  db.prepare(`UPDATE workspaces SET name=?, plan=?, status=?, brand_color=? WHERE id=?`).run(
    merged.name,
    merged.plan,
    merged.status,
    merged.brand_color,
    id,
  );
  return merged;
}

/* ───── Members ───── */

export function getMembers(workspaceId: string) {
  return db
    .prepare(
      `
    SELECT m.*, u.email, u.name
    FROM workspace_members m
    JOIN users u ON u.id = m.user_id
    WHERE m.workspace_id = ?
    ORDER BY m.created_at ASC
  `,
    )
    .all(workspaceId) as Record<string, unknown>[];
}

export function getUserWorkspaces(userId: string): Workspace[] {
  const rows = db
    .prepare(
      `
    SELECT w.* FROM workspaces w
    JOIN workspace_members m ON m.workspace_id = w.id
    WHERE m.user_id = ?
    ORDER BY w.created_at ASC
  `,
    )
    .all(userId) as Record<string, unknown>[];
  return rows;
}

export function addMember(workspaceId: string, userId: string, role = "editor") {
  const id = uid("wsm_");
  try {
    db.prepare(
      `INSERT INTO workspace_members (id, workspace_id, user_id, role, created_at) VALUES (?, ?, ?, ?, ?)`,
    ).run(id, workspaceId, userId, role, now());
  } catch {
    /* already a member */
  }
}

export function removeMember(workspaceId: string, userId: string) {
  db.prepare(`DELETE FROM workspace_members WHERE workspace_id = ? AND user_id = ?`).run(
    workspaceId,
    userId,
  );
}

/* ───── Invites ───── */

export function createInvite(
  workspaceId: string,
  email: string,
  role = "editor",
): { id: string; token: string; url: string } {
  const id = uid("inv_");
  const token = uid("tok_") + uid("tok_").slice(0, 8);
  const expiresAt = now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  db.prepare(
    `
    INSERT INTO workspace_invites (id, workspace_id, email, role, token, expires_at, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(id, workspaceId, email.toLowerCase(), role, token, expiresAt, now());
  return { id, token, url: `/invite/${token}` };
}

export function acceptInvite(token: string, userId: string): string | null {
  const inv = db
    .prepare(
      `SELECT * FROM workspace_invites WHERE token = ? AND accepted_at IS NULL AND expires_at > ?`,
    )
    .get(token, now()) as Record<string, unknown> | undefined;
  if (!inv) return null;
  addMember(inv.workspace_id, userId, inv.role);
  db.prepare(`UPDATE workspace_invites SET accepted_at = ? WHERE id = ?`).run(now(), inv.id);
  return inv.workspace_id;
}

/* ───── API keys ───── */

export function createApiKey(
  workspaceId: string,
  name: string,
  scopes: string[] = [],
): { id: string; key: string; prefix: string } {
  const id = uid("apk_");
  // Plaintext key shown ONCE — we only store the hash.
  const raw = uid("sk_") + uid("").slice(0, 24);
  const prefix = raw.slice(0, 8);
  const hash = hashKey(raw);
  db.prepare(
    `
    INSERT INTO api_keys (id, workspace_id, name, key_hash, prefix, scopes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(id, workspaceId, name, hash, prefix, JSON.stringify(scopes), now());
  return { id, key: raw, prefix };
}

export function verifyApiKey(
  raw: string,
): { workspace_id: string; id: string; scopes: string[] } | null {
  const hash = hashKey(raw);
  const row = db.prepare(`SELECT * FROM api_keys WHERE key_hash = ?`).get(hash) as Record<string, unknown> | undefined;
  if (!row) return null;
  db.prepare(`UPDATE api_keys SET last_used_at = ? WHERE id = ?`).run(now(), row.id);
  let scopes: string[] = [];
  try {
    scopes = JSON.parse(row.scopes || "[]");
  } catch {}
  return { workspace_id: row.workspace_id, id: row.id, scopes };
}

function hashKey(raw: string): string {
  // Lightweight: SHA-256 hex (we can swap to bcrypt if it becomes hot)
  // Inline to avoid a node:crypto import for hot paths.
  const crypto = require("node:crypto");
  return crypto.createHash("sha256").update(raw).digest("hex");
}

/* ───── Audit ───── */

export function audit(
  workspaceId: string,
  action: string,
  opts: { user_id?: string; entity?: string; entity_id?: string; meta?: Record<string, unknown>; ip?: string } = {},
) {
  db.prepare(
    `
    INSERT INTO workspace_audit (id, workspace_id, user_id, action, entity, entity_id, meta, ip, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    uid("aud_"),
    workspaceId,
    opts.user_id || null,
    action,
    opts.entity || null,
    opts.entity_id || null,
    opts.meta ? JSON.stringify(opts.meta) : null,
    opts.ip || null,
    now(),
  );
}

export function recentAudit(workspaceId: string, limit = 50) {
  return db
    .prepare(
      `SELECT * FROM workspace_audit WHERE workspace_id = ? ORDER BY created_at DESC LIMIT ?`,
    )
    .all(workspaceId, limit) as Record<string, unknown>[];
}

/* ───── Resolution helper ───── */

/**
 * Resolve the active workspace from a Next.js request.
 *
 * Resolution order:
 *   1. X-Workspace-Id header (API clients)
 *   2. ?workspace=… query param
 *   3. The logged-in user's default workspace
 *   4. "default"
 */
export function resolveWorkspace(req: NextRequest, userId?: string): string {
  const fromHeader = req.headers.get("x-workspace-id");
  if (fromHeader) return fromHeader;
  const fromQuery = req.nextUrl.searchParams.get("workspace");
  if (fromQuery) return fromQuery;
  if (userId) {
    const list = getUserWorkspaces(userId);
    if (list.length) return list[0].id;
  }
  return DEFAULT_WORKSPACE;
}

/* ───── Plan limits (for upsell) ───── */

export interface PlanLimits {
  max_contacts: number;
  max_deals: number;
  max_workspaces: number;
  custom_domain: boolean;
  api_access: boolean;
  webhooks: boolean;
}

export const PLAN_LIMITS: Record<Workspace["plan"], PlanLimits> = {
  free: {
    max_contacts: 100,
    max_deals: 50,
    max_workspaces: 1,
    custom_domain: false,
    api_access: false,
    webhooks: false,
  },
  pro: {
    max_contacts: 10_000,
    max_deals: 5_000,
    max_workspaces: 1,
    custom_domain: true,
    api_access: true,
    webhooks: true,
  },
  agency: {
    max_contacts: 100_000,
    max_deals: 50_000,
    max_workspaces: 10,
    custom_domain: true,
    api_access: true,
    webhooks: true,
  },
};

export function checkLimit(
  workspaceId: string,
  key: keyof PlanLimits,
  current: number,
): { ok: boolean; limit: number; current: number } {
  const ws = getWorkspace(workspaceId);
  const plan = ws?.plan || "free";
  const limit = PLAN_LIMITS[plan][key] as number;
  if (limit === -1) return { ok: true, limit: -1, current };
  return { ok: current < limit, limit, current };
}
