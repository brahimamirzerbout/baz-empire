/**
 * Idempotent migrations for the ad_* tables — adds the workspace column
 * if a legacy DB exists that was created before the column was added.
 *
 * Lives in its own file so the template-literal SQL block in db/index.ts
 * can never accidentally trap this function declaration.
 *
 * We accept the `db` instance as a parameter to avoid a circular import
 * (this file is imported by db/index.ts; can't import db back from there).
 */
import Database from "better-sqlite3";

const AD_TABLES: Array<[string, string]> = [
  ["ad_accounts", "workspace TEXT NOT NULL DEFAULT 'default'"],
  ["ad_campaigns", "workspace TEXT NOT NULL DEFAULT 'default'"],
  ["ad_groups", "workspace TEXT NOT NULL DEFAULT 'default'"],
  ["ad_creatives", "workspace TEXT NOT NULL DEFAULT 'default'"],
  ["ad_sync_jobs", "workspace TEXT NOT NULL DEFAULT 'default'"],
];

export function migrateAdWorkspaceColumns(db: Database.Database) {
  for (const [table, colDef] of AD_TABLES) {
    const cols = db.prepare(`PRAGMA table_info(${table})`).all() as Record<string, unknown>[];
    if (cols.length === 0) continue; // table doesn't exist yet — CREATE TABLE above handles it
    if (!cols.find((c: Record<string, unknown>) => c.name === "workspace")) {
      try {
        db.exec(`ALTER TABLE ${table} ADD COLUMN ${colDef}`);
      } catch {}
    }
  }
  // Backfill any NULL workspace values on legacy rows.
  for (const [table] of AD_TABLES) {
    try {
      db.exec(
        `UPDATE ${table} SET workspace = 'default' WHERE workspace IS NULL OR workspace = ''`,
      );
    } catch {}
  }
}

/**
 * Migrations for the users table — adds 2FA / role columns when missing.
 */
export function migrateUserAuthColumns(db: Database.Database) {
  const cols = db.prepare(`PRAGMA table_info(users)`).all() as Record<string, unknown>[];
  if (cols.length === 0) return;
  const have = (n: string) => cols.find((c) => c.name === n);
  if (!have("role"))
    try {
      db.exec(`ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'member'`);
    } catch {}
  if (!have("totp_secret"))
    try {
      db.exec(`ALTER TABLE users ADD COLUMN totp_secret TEXT`);
    } catch {}
  if (!have("totp_enabled"))
    try {
      db.exec(`ALTER TABLE users ADD COLUMN totp_enabled INTEGER NOT NULL DEFAULT 0`);
    } catch {}
  if (!have("recovery_codes"))
    try {
      db.exec(`ALTER TABLE users ADD COLUMN recovery_codes TEXT`);
    } catch {}
  if (!have("last_login_at"))
    try {
      db.exec(`ALTER TABLE users ADD COLUMN last_login_at INTEGER`);
    } catch {}
}
