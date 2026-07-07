/**
 * Audit log + workspace helpers for the ad orchestration layer.
 *
 * Every state change (create/update/delete/sync/pause) records a row in
 * ad_audit_log with before+after JSON snapshots. This is how you answer
 * "who paused the Google Ads campaign at 2am last Tuesday?"
 */

import { db, newId, now } from "@/lib/db";

export type AuditAction =
  "create" | "update" | "delete" | "sync" | "pause" | "resume" | "connect" | "disconnect" | "flush";
export type AuditResource = "account" | "campaign" | "ad_group" | "creative" | "conversion";

export function recordAudit(args: {
  workspace?: string;
  actor?: string;
  action: AuditAction;
  resource_type: AuditResource;
  resource_id: string;
  provider?: string;
  before?: unknown;
  after?: unknown;
  ip?: string;
  user_agent?: string;
}) {
  try {
    db.prepare(
      `
      INSERT INTO ad_audit_log (id, workspace, actor, action, resource_type, resource_id, provider, before_json, after_json, ip, user_agent, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    ).run(
      newId("aud_"),
      args.workspace || "default",
      args.actor || "system",
      args.action,
      args.resource_type,
      args.resource_id,
      args.provider || null,
      args.before !== undefined ? JSON.stringify(args.before) : null,
      args.after !== undefined ? JSON.stringify(args.after) : null,
      args.ip || null,
      args.user_agent || null,
      now(),
    );
  } catch (e: unknown) {
    // Audit must never break the calling action. Log and continue.
    console.error("[audit] failed to record:", e.message);
  }
}

export function listAuditFor(resource_type: AuditResource, resource_id: string, limit = 50) {
  return db
    .prepare(
      `SELECT * FROM ad_audit_log WHERE resource_type = ? AND resource_id = ? ORDER BY created_at DESC LIMIT ?`,
    )
    .all(resource_type, resource_id, limit) as Record<string, unknown>[];
}

export function listAuditForWorkspace(workspace: string, limit = 100) {
  return db
    .prepare(`SELECT * FROM ad_audit_log WHERE workspace = ? ORDER BY created_at DESC LIMIT ?`)
    .all(workspace, limit) as Record<string, unknown>[];
}

/**
 * Current workspace. Today everything is 'default' but the schema is ready
 * for multi-tenant later. Future: read from cookie/session/header.
 */
export function currentWorkspace(): string {
  return "default";
}
