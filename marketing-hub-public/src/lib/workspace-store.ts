/**
 * Tenant-scoped store helpers.
 *
 * Drop-in replacements for direct db.prepare() calls on the multi-tenant
 * tables. Auto-inject workspace_id on insert + filter on select.
 *
 * Tables in scope (the high-value marketing data):
 *   contacts, deals, campaigns, content, emails, landing_pages, ads,
 *   automations, tasks, assets, forms, form_submissions, lead_magnets,
 *   funnels, experiments, testimonials, events, conversations, budget_items,
 *   playbooks, surveys, personas, segments, brand_stories, ideas,
 *   studio_projects, sequences, accounts, touchpoints, repurposed_assets,
 *   pillar_content
 */

import { db, uid, now } from "@/lib/db";

export const TENANT_TABLES = [
  "contacts",
  "companies",
  "deals",
  "campaigns",
  "content",
  "emails",
  "landing_pages",
  "ads",
  "automations",
  "tasks",
  "assets",
  "form_submissions",
  "lead_magnets",
  "funnels",
  "experiments",
  "testimonials",
  "events",
  "event_registrations",
  "competitors",
  "conversations",
  "budget_items",
  "playbooks",
  "surveys",
  "survey_responses",
  "personas",
  "segments",
  "brand_assets",
  "ideas",
  "studio_projects",
  "sales_sequences",
  "accounts",
  "sequence_enrollments",
  "touchpoints",
  "repurposed_assets",
  "pillar_content",
] as const;

export type TenantTable = (typeof TENANT_TABLES)[number];

/** Insert with workspace_id auto-bound. */
export function tenantInsert(
  table: TenantTable,
  fields: Record<string, any>,
  workspaceId: string,
): Record<string, any> {
  const merged: Record<string, any> = { ...fields, workspace_id: workspaceId };
  const cols = Object.keys(merged);
  const placeholders = cols.map(() => "?").join(",");
  const vals = cols.map((c) => merged[c] ?? null);
  db.prepare(`INSERT INTO ${table} (${cols.join(",")}) VALUES (${placeholders})`).run(...vals);
  return merged;
}

/** List rows in workspace, ordered by created_at DESC. */
export function tenantList(
  table: TenantTable,
  workspaceId: string,
  opts: { limit?: number; order?: string } = {},
): Record<string, unknown>[] {
  const order = opts.order || "created_at DESC";
  return db
    .prepare(`SELECT * FROM ${table} WHERE workspace_id = ? ORDER BY ${order} LIMIT ?`)
    .all(workspaceId, opts.limit || 500) as Record<string, unknown>[];
}

export function tenantGet(table: TenantTable, id: string, workspaceId: string): Record<string, unknown> | null {
  return db
    .prepare(`SELECT * FROM ${table} WHERE id = ? AND workspace_id = ?`)
    .get(id, workspaceId);
}

export function tenantUpdate(
  table: TenantTable,
  id: string,
  workspaceId: string,
  patch: Record<string, any>,
): Record<string, unknown> | null {
  const cols = Object.keys(patch);
  if (!cols.length) return tenantGet(table, id, workspaceId);
  const sets = cols.map((c) => `${c} = ?`).join(", ");
  const vals = cols.map((c) => patch[c]);
  db.prepare(`UPDATE ${table} SET ${sets}, updated_at = ? WHERE id = ? AND workspace_id = ?`).run(
    ...vals,
    now(),
    id,
    workspaceId,
  );
  return tenantGet(table, id, workspaceId);
}

export function tenantDelete(table: TenantTable, id: string, workspaceId: string): boolean {
  const r = db
    .prepare(`DELETE FROM ${table} WHERE id = ? AND workspace_id = ?`)
    .run(id, workspaceId);
  return r.changes > 0;
}

export function tenantCount(table: TenantTable, workspaceId: string): number {
  return (
    (
      db
        .prepare(`SELECT COUNT(*) AS n FROM ${table} WHERE workspace_id = ?`)
        .get(workspaceId) as Record<string, unknown> | undefined
    ).n || 0
  );
}
