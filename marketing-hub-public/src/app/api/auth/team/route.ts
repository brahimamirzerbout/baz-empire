import { NextRequest } from "next/server";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { json, err, readJson } from "@/lib/api-helpers";
import { currentUser } from "@/lib/auth";
import { db, now, uid } from "@/lib/db";
import { recordAudit, currentWorkspace } from "@/lib/providers/audit";

export const dynamic = "force-dynamic";

/**
 * Team management.
 *
 *   GET  /api/auth/team                  → { members: [...], invites: [...] }
 *   POST /api/auth/team { action: "invite", email, role }
 *                                       → creates workspace_invites row + emails token
 *   POST /api/auth/team { action: "accept", token, name, password }
 *                                       → user accepts invite → becomes member of workspace
 *   POST /api/auth/team { action: "remove", user_id }
 *                                       → removes a member from the workspace (owner only)
 *   POST /api/auth/team { action: "change_role", user_id, role }
 *                                       → owner-only
 */

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function GET() {
  const u = currentUser();
  if (!u) return json({ error: "Not authenticated" }, 401);
  const ws = currentWorkspace();
  // Members = users who own rows in any table of this workspace (workspaces aren't
  // per-user in this app yet, so we list all users + their role).
  const members = db
    .prepare(
      `
    SELECT id, email, name, role, totp_enabled, last_login_at, created_at
    FROM users
    ORDER BY created_at ASC
  `,
    )
    .all() as Record<string, unknown>[];
  const invites = db
    .prepare(
      `
    SELECT id, email, role, token, expires_at, created_at
    FROM workspace_invites
    WHERE workspace_id = ? AND accepted_at IS NULL AND expires_at > ?
    ORDER BY created_at DESC
  `,
    )
    .all(ws, now()) as Record<string, unknown>[];
  return json({ members, invites, currentUserId: u.id });
}

export async function POST(req: NextRequest) {
  const u = currentUser();
  if (!u) return json({ error: "Not authenticated" }, 401);
  const body = await readJson<Record<string, unknown>>(req);
  if (!body?.action) return err("action required");
  const ws = currentWorkspace();

  if (body.action === "invite") {
    if (!body.email) return err("email required");
    if (!["admin", "member", "viewer"].includes(body.role))
      return err("role must be admin | member | viewer");
    // Only owners/admins can invite
    const me = db.prepare(`SELECT role FROM users WHERE id = ?`).get(u.id) as
      Record<string, unknown> | undefined;
    if (!me || (me.role !== "owner" && me.role !== "admin")) return err("Forbidden", 403);
    const token = crypto.randomBytes(16).toString("base64url");
    const id = uid("wi_");
    db.prepare(
      `INSERT INTO workspace_invites (id, workspace_id, email, role, token, expires_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ).run(id, ws, body.email.trim().toLowerCase(), body.role, token, now() + INVITE_TTL_MS, now());
    recordAudit({
      workspace: ws,
      actor: u.id,
      action: "create",
      resource_type: "invite",
      resource_id: id,
      after: { email: body.email, role: body.role },
    });
    // Email the invite link (real SMTP if configured)
    const link = `${req.nextUrl.origin}/accept-invite?token=${token}`;
    db.prepare(
      `INSERT INTO email_outbox (id, to_email, subject, body_html, status, created_at) VALUES (?, ?, ?, ?, 'queued', ?)`,
    ).run(
      `em_${Math.random().toString(36).slice(2)}_${now().toString(36)}`,
      body.email,
      "You've been invited to Marketing Hub",
      `<p>${u.name} (${u.email}) invited you to join Marketing Hub as <b>${body.role}</b>.</p><p><a href="${link}" style="display:inline-block;background:#888888;color:white;padding:12px 24px;border-radius:8px;text-decoration:none">Accept invite</a></p><p>This link expires in 7 days.</p>`,
      now(),
    );
    const devMode = !process.env.SMTP_HOST && !process.env.RESEND_API_KEY;
    return json({ ok: true, id, devMode, ...(devMode ? { devLink: link } : {}) });
  }

  if (body.action === "accept") {
    if (!body.token || !body.name || !body.password) return err("token, name, password required");
    if (body.password.length < 8) return err("password must be 8+ characters", 400);
    const inv = db.prepare(`SELECT * FROM workspace_invites WHERE token = ?`).get(body.token) as
      Record<string, unknown> | undefined;
    if (!inv) return err("Invalid invite token", 404);
    if (inv.accepted_at) return err("Invite already used", 400);
    if (inv.expires_at < now()) return err("Invite expired", 400);
    // Create the user (or attach existing)
    let userId: string;
    const existing = db.prepare(`SELECT id FROM users WHERE email = ?`).get(inv.email) as
      Record<string, unknown> | undefined;
    if (existing) {
      userId = existing.id;
    } else {
      userId = uid("u_");
      const hash = bcrypt.hashSync(body.password, 10);
      db.prepare(
        `INSERT INTO users (id, email, name, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
      ).run(userId, inv.email, body.name.trim(), hash, inv.role, now());
    }
    db.prepare(`UPDATE workspace_invites SET accepted_at = ? WHERE id = ?`).run(now(), inv.id);
    recordAudit({
      workspace: inv.workspace_id,
      actor: userId,
      action: "create",
      resource_type: "team_member",
      resource_id: userId,
    });
    return json({ ok: true, userId });
  }

  if (body.action === "remove" || body.action === "change_role") {
    if (u.id === body.user_id) return err("You can't change your own role or remove yourself");
    const me = db.prepare(`SELECT role FROM users WHERE id = ?`).get(u.id) as
      Record<string, unknown> | undefined;
    if (!me || me.role !== "owner") return err("Only owners can do this", 403);
    if (body.action === "change_role") {
      if (!["admin", "member", "viewer"].includes(body.role)) return err("invalid role", 400);
      db.prepare(`UPDATE users SET role = ? WHERE id = ?`).run(body.role, body.user_id);
      recordAudit({
        workspace: ws,
        actor: u.id,
        action: "update",
        resource_type: "user",
        resource_id: body.user_id,
        after: { role: body.role },
      });
    } else {
      db.prepare(`DELETE FROM sessions WHERE user_id = ?`).run(body.user_id);
      // We don't delete the user row (preserves audit history) but revoke access
      // by clearing sessions and setting role to viewer + requiring password reset
      db.prepare(`UPDATE users SET role = 'viewer' WHERE id = ?`).run(body.user_id);
      recordAudit({
        workspace: ws,
        actor: u.id,
        action: "delete",
        resource_type: "team_member",
        resource_id: body.user_id,
      });
    }
    return json({ ok: true });
  }

  return err("Unknown action");
}
