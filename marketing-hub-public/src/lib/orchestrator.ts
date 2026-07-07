/**
 * Orchestrator — campaigns, milestones, tasks, agent runs, marketplace.
 *
 * Single source of truth for "what's being shipped, by whom, when, with
 * what result." Pulls the strategy agents, the task system, and the
 * marketer marketplace into one coherent execution surface.
 */
import { db, uid, now } from "@/lib/db";

/* ──────────── Campaigns ──────────── */

export interface Campaign {
  id: string;
  workspace_id: string;
  name: string;
  brief: string;
  target_metric: string;
  target_value: number;
  current_value: number;
  channel: string;
  status: "planning" | "active" | "paused" | "completed" | "archived";
  start_date: number | null;
  end_date: number | null;
  budget_cents: number;
  spent_cents: number;
  owner_id: string | null;
  created_at: number;
  updated_at: number;
}

export function listCampaigns(workspaceId: string): Campaign[] {
  return db
    .prepare(`SELECT * FROM orchestrator_campaigns WHERE workspace_id = ? ORDER BY created_at DESC`)
    .all(workspaceId) as Record<string, unknown>[];
}
export function getCampaign(id: string): Campaign | null {
  return db.prepare(`SELECT * FROM orchestrator_campaigns WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
}
export function createCampaign(
  input: Partial<Campaign> & { workspace_id: string; name: string },
): Campaign {
  const id = uid("oc_");
  const t = now();
  db.prepare(
    `
    INSERT INTO orchestrator_campaigns (id, workspace_id, name, brief, target_metric, target_value, current_value, channel, status, start_date, end_date, budget_cents, spent_cents, owner_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    id,
    input.workspace_id,
    input.name,
    input.brief || "",
    input.target_metric || "",
    input.target_value || 0,
    input.current_value || 0,
    input.channel || "",
    input.status || "planning",
    input.start_date || null,
    input.end_date || null,
    input.budget_cents || 0,
    input.spent_cents || 0,
    input.owner_id || null,
    t,
    t,
  );
  return getCampaign(id)!;
}
export function updateCampaign(id: string, patch: Partial<Campaign>): Campaign | null {
  const cur = getCampaign(id);
  if (!cur) return null;
  const merged = { ...cur, ...patch, updated_at: now() };
  db.prepare(
    `
    UPDATE orchestrator_campaigns SET
      name=?, brief=?, target_metric=?, target_value=?, current_value=?, channel=?, status=?,
      start_date=?, end_date=?, budget_cents=?, spent_cents=?, owner_id=?, updated_at=?
    WHERE id=?
  `,
  ).run(
    merged.name,
    merged.brief,
    merged.target_metric,
    merged.target_value,
    merged.current_value,
    merged.channel,
    merged.status,
    merged.start_date,
    merged.end_date,
    merged.budget_cents,
    merged.spent_cents,
    merged.owner_id,
    merged.updated_at,
    id,
  );
  return merged;
}
export function deleteCampaign(id: string) {
  db.prepare(`DELETE FROM orchestrator_tasks WHERE campaign_id = ?`).run(id);
  db.prepare(`DELETE FROM orchestrator_milestones WHERE campaign_id = ?`).run(id);
  db.prepare(`DELETE FROM orchestrator_campaigns WHERE id = ?`).run(id);
}

/* ──────────── Milestones ──────────── */

export interface Milestone {
  id: string;
  campaign_id: string;
  title: string;
  description: string;
  due_date: number | null;
  status: "pending" | "in_progress" | "done" | "skipped";
  sort_order: number;
  created_at: number;
  updated_at: number;
}

export function listMilestones(campaignId: string): Milestone[] {
  return db
    .prepare(
      `SELECT * FROM orchestrator_milestones WHERE campaign_id = ? ORDER BY sort_order ASC, due_date ASC`,
    )
    .all(campaignId) as Record<string, unknown>[];
}
export function createMilestone(input: {
  campaign_id: string;
  title: string;
  description?: string;
  due_date?: number;
  sort_order?: number;
}): Milestone {
  const id = uid("ms_");
  const t = now();
  db.prepare(
    `
    INSERT INTO orchestrator_milestones (id, campaign_id, title, description, due_date, status, sort_order, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?)
  `,
  ).run(
    id,
    input.campaign_id,
    input.title,
    input.description || "",
    input.due_date || null,
    input.sort_order || 0,
    t,
    t,
  );
  return db.prepare(`SELECT * FROM orchestrator_milestones WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
}
export function updateMilestone(id: string, patch: Partial<Milestone>): Milestone | null {
  const cur = db.prepare(`SELECT * FROM orchestrator_milestones WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
  if (!cur) return null;
  const merged = { ...cur, ...patch, updated_at: now() };
  db.prepare(
    `UPDATE orchestrator_milestones SET title=?, description=?, due_date=?, status=?, sort_order=?, updated_at=? WHERE id=?`,
  ).run(
    merged.title,
    merged.description,
    merged.due_date,
    merged.status,
    merged.sort_order,
    merged.updated_at,
    id,
  );
  return merged;
}
export function deleteMilestone(id: string) {
  db.prepare(`DELETE FROM orchestrator_milestones WHERE id = ?`).run(id);
}

/* ──────────── Tasks (the calendar grid) ──────────── */

export type TaskKind =
  "manual" | "email" | "social" | "content" | "paid" | "seo" | "sales" | "analytics" | "agent";
export type TaskStatus = "todo" | "in_progress" | "blocked" | "done" | "cancelled";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: string;
  campaign_id: string | null;
  milestone_id: string | null;
  workspace_id: string;
  title: string;
  description: string;
  kind: TaskKind;
  priority: TaskPriority;
  status: TaskStatus;
  assignee_id: string | null;
  assignee_agent: string | null;
  duration_min: number;
  start_at: number | null;
  due_at: number | null;
  depends_on: string | null;
  related_id: string | null;
  related_kind: string | null;
  created_at: number;
  updated_at: number;
  completed_at: number | null;
}

export function listTasks(
  workspaceId: string,
  opts: {
    campaign_id?: string;
    status?: TaskStatus;
    assignee_id?: string;
    from?: number;
    to?: number;
  } = {},
): Task[] {
  let sql = `SELECT * FROM orchestrator_tasks WHERE workspace_id = ?`;
  const args: (string | number)[] = [workspaceId];
  if (opts.campaign_id) {
    sql += ` AND campaign_id = ?`;
    args.push(opts.campaign_id);
  }
  if (opts.status) {
    sql += ` AND status = ?`;
    args.push(opts.status);
  }
  if (opts.assignee_id) {
    sql += ` AND assignee_id = ?`;
    args.push(opts.assignee_id);
  }
  if (opts.from) {
    sql += ` AND (due_at IS NULL OR due_at >= ?)`;
    args.push(opts.from);
  }
  if (opts.to) {
    sql += ` AND (due_at IS NULL OR due_at <= ?)`;
    args.push(opts.to);
  }
  sql += ` ORDER BY COALESCE(due_at, 9999999999999) ASC, priority DESC`;
  return db.prepare(sql).all(...args) as Record<string, unknown>[];
}
export function getTask(id: string): Task | null {
  return db.prepare(`SELECT * FROM orchestrator_tasks WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
}
export function createTask(input: Partial<Task> & { workspace_id: string; title: string }): Task {
  const id = uid("ot_");
  const t = now();
  db.prepare(
    `
    INSERT INTO orchestrator_tasks (id, campaign_id, milestone_id, workspace_id, title, description, kind, priority, status, assignee_id, assignee_agent, duration_min, start_at, due_at, depends_on, related_id, related_kind, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    id,
    input.campaign_id || null,
    input.milestone_id || null,
    input.workspace_id,
    input.title,
    input.description || "",
    input.kind || "manual",
    input.priority || "medium",
    input.status || "todo",
    input.assignee_id || null,
    input.assignee_agent || null,
    input.duration_min || 30,
    input.start_at || null,
    input.due_at || null,
    input.depends_on || null,
    input.related_id || null,
    input.related_kind || null,
    t,
    t,
  );
  return getTask(id)!;
}
export function updateTask(id: string, patch: Partial<Task>): Task | null {
  const cur = getTask(id);
  if (!cur) return null;
  const merged: Record<string, unknown> = { ...cur, ...patch, updated_at: now() };
  if (patch.status === "done" && cur.status !== "done") merged.completed_at = now();
  db.prepare(
    `
    UPDATE orchestrator_tasks SET
      campaign_id=?, milestone_id=?, title=?, description=?, kind=?, priority=?, status=?,
      assignee_id=?, assignee_agent=?, duration_min=?, start_at=?, due_at=?, depends_on=?,
      related_id=?, related_kind=?, updated_at=?, completed_at=?
    WHERE id=?
  `,
  ).run(
    merged.campaign_id,
    merged.milestone_id,
    merged.title,
    merged.description,
    merged.kind,
    merged.priority,
    merged.status,
    merged.assignee_id,
    merged.assignee_agent,
    merged.duration_min,
    merged.start_at,
    merged.due_at,
    merged.depends_on,
    merged.related_id,
    merged.related_kind,
    merged.updated_at,
    merged.completed_at,
    id,
  );
  return getTask(id);
}
export function deleteTask(id: string) {
  db.prepare(`DELETE FROM orchestrator_tasks WHERE id = ?`).run(id);
}

/* ──────────── Agent runs ──────────── */

export type AgentId =
  "strategist" | "storyteller" | "copywriter" | "analyst" | "pr_brain" | "researcher";

export interface AgentRun {
  id: string;
  task_id: string | null;
  campaign_id: string | null;
  workspace_id: string;
  agent: AgentId;
  status: "queued" | "running" | "done" | "failed" | "cancelled";
  input: string;
  output: string;
  started_at: number | null;
  completed_at: number | null;
  error: string | null;
  cost_cents: number;
  created_at: number;
}

export function enqueueAgentRun(input: {
  workspace_id: string;
  agent: AgentId;
  task_id?: string;
  campaign_id?: string;
  agent_input: Record<string, unknown>;
}): AgentRun {
  const id = uid("ar_");
  const t = now();
  db.prepare(
    `
    INSERT INTO orchestrator_agent_runs (id, task_id, campaign_id, workspace_id, agent, status, input, output, started_at, completed_at, error, cost_cents, created_at)
    VALUES (?, ?, ?, ?, ?, 'queued', ?, '', NULL, NULL, NULL, 0, ?)
  `,
  ).run(
    id,
    input.task_id || null,
    input.campaign_id || null,
    input.workspace_id,
    input.agent,
    JSON.stringify(input.agent_input || {}),
    t,
  );
  return db.prepare(`SELECT * FROM orchestrator_agent_runs WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
}

export function listAgentRuns(workspaceId: string, limit = 50): AgentRun[] {
  return db
    .prepare(
      `SELECT * FROM orchestrator_agent_runs WHERE workspace_id = ? ORDER BY created_at DESC LIMIT ?`,
    )
    .all(workspaceId, limit) as Record<string, unknown>[];
}
export function getAgentRun(id: string): AgentRun | null {
  return db.prepare(`SELECT * FROM orchestrator_agent_runs WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
}
export function updateAgentRun(id: string, patch: Partial<AgentRun>): AgentRun | null {
  const cur = getAgentRun(id);
  if (!cur) return null;
  const merged: Record<string, unknown> = { ...cur, ...patch };
  db.prepare(
    `UPDATE orchestrator_agent_runs SET status=?, input=?, output=?, started_at=?, completed_at=?, error=?, cost_cents=? WHERE id=?`,
  ).run(
    merged.status,
    merged.input,
    merged.output,
    merged.started_at,
    merged.completed_at,
    merged.error,
    merged.cost_cents || 0,
    id,
  );
  return getAgentRun(id);
}

/* ──────────── The orchestrator runner ──────────── */

/**
 * Run the next queued agent run, or a specific one.
 * Calls into the strategy agents lib. In a real impl this would be
 * pushed onto a queue (BullMQ). For now: synchronous.
 */
import { runAgent } from "@/lib/agents";

export async function runNextAgentRun(workspaceId: string): Promise<AgentRun | null> {
  const queued = db
    .prepare(
      `SELECT * FROM orchestrator_agent_runs WHERE workspace_id = ? AND status = 'queued' ORDER BY created_at ASC LIMIT 1`,
    )
    .get(workspaceId) as Record<string, unknown> | undefined;
  if (!queued) return null;
  return runAgentRunById(queued.id);
}

export async function runAgentRunById(id: string): Promise<AgentRun | null> {
  const r = getAgentRun(id);
  if (!r) return null;
  updateAgentRun(id, { status: "running", started_at: now() });
  try {
    const input = JSON.parse(r.input || "{}");
    const output: unknown = await runAgent(r.agent, input);
    updateAgentRun(id, {
      status: "done",
      completed_at: now(),
      output: JSON.stringify(output),
    });
    // If a task is linked, mark it done
    if (r.task_id) {
      updateTask(r.task_id, { status: "done" });
    }
    return getAgentRun(id);
  } catch (e: unknown) {
    updateAgentRun(id, { status: "failed", completed_at: now(), error: e.message });
    return getAgentRun(id);
  }
}

/* ──────────── Calendar view ──────────── */

/**
 * Returns the calendar grid for a workspace: every task in the window
 * grouped by day. Used by the orchestrator's calendar view.
 */
export function calendarView(
  workspaceId: string,
  from: number,
  to: number,
): Array<{
  day: string; // YYYY-MM-DD
  tasks: Task[];
}> {
  const tasks = listTasks(workspaceId, { from, to });
  const buckets = new Map<string, Task[]>();
  for (const t of tasks) {
    const ts = t.due_at || t.start_at || t.created_at;
    const d = new Date(ts);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(t);
  }
  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, tasks]) => ({ day, tasks }));
}

/* ──────────── Marketers marketplace ──────────── */

export interface MarketerProfile {
  id: string;
  slug: string;
  workspace_id: string | null;
  name: string;
  headline: string;
  bio: string;
  avatar_url: string | null;
  specialties: string[]; // parsed from JSON
  frameworks: string[];
  industries: string[];
  hourly_rate_cents: number | null;
  monthly_rate_cents: number | null;
  currency: string;
  availability: "available" | "busy" | "booked";
  rating: number;
  reviews_count: number;
  wins_count: number;
  is_featured: number;
  is_verified: number;
  contact_email: string | null;
  social_links: Record<string, string>;
  portfolio_items: unknown[];
  created_at: number;
  updated_at: number;
}

export function listMarketers(
  opts: {
    specialty?: string;
    availability?: string;
    featured?: boolean;
    search?: string;
    limit?: number;
  } = {},
): MarketerProfile[] {
  let sql = `SELECT * FROM marketer_profiles WHERE 1=1`;
  const args: Record<string, unknown>[] = [];
  if (opts.specialty) {
    sql += ` AND specialties LIKE ?`;
    args.push(`%"${opts.specialty}"%`);
  }
  if (opts.availability) {
    sql += ` AND availability = ?`;
    args.push(opts.availability);
  }
  if (opts.featured) {
    sql += ` AND is_featured = 1`;
  }
  if (opts.search) {
    sql += ` AND (name LIKE ? OR headline LIKE ? OR bio LIKE ?)`;
    const s = `%${opts.search}%`;
    args.push(s, s, s);
  }
  sql += ` ORDER BY is_featured DESC, rating DESC, reviews_count DESC LIMIT ?`;
  args.push(opts.limit || 50);
  const rows = db.prepare(sql).all(...args) as Record<string, unknown>[];
  return rows.map(hydrateMarketer);
}

export function getMarketer(slug: string): MarketerProfile | null {
  const row = db.prepare(`SELECT * FROM marketer_profiles WHERE slug = ?`).get(slug) as Record<string, unknown> | undefined;
  return row ? hydrateMarketer(row) : null;
}

export function getMarketerById(id: string): MarketerProfile | null {
  const row = db.prepare(`SELECT * FROM marketer_profiles WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
  return row ? hydrateMarketer(row) : null;
}

export function createMarketer(
  input: Partial<MarketerProfile> & { slug: string; name: string },
): MarketerProfile {
  const id = uid("mk_");
  const t = now();
  db.prepare(
    `
    INSERT INTO marketer_profiles
      (id, slug, workspace_id, name, headline, bio, avatar_url, specialties, frameworks, industries,
       hourly_rate_cents, monthly_rate_cents, currency, availability, rating, reviews_count, wins_count,
       is_featured, is_verified, contact_email, social_links, portfolio_items, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    id,
    input.slug,
    input.workspace_id || null,
    input.name,
    input.headline || "",
    input.bio || "",
    input.avatar_url || null,
    JSON.stringify(input.specialties || []),
    JSON.stringify(input.frameworks || []),
    JSON.stringify(input.industries || []),
    input.hourly_rate_cents || null,
    input.monthly_rate_cents || null,
    input.currency || "USD",
    input.availability || "available",
    input.rating || 0,
    input.reviews_count || 0,
    input.wins_count || 0,
    input.is_featured ? 1 : 0,
    input.is_verified ? 1 : 0,
    input.contact_email || null,
    JSON.stringify(input.social_links || {}),
    JSON.stringify(input.portfolio_items || []),
    t,
    t,
  );
  return getMarketerById(id)!;
}

export function updateMarketer(
  id: string,
  patch: Partial<MarketerProfile>,
): MarketerProfile | null {
  const cur = getMarketerById(id);
  if (!cur) return null;
  const merged: Record<string, unknown> = { ...cur, ...patch, updated_at: now() };
  db.prepare(
    `
    UPDATE marketer_profiles SET
      name=?, headline=?, bio=?, avatar_url=?, specialties=?, frameworks=?, industries=?,
      hourly_rate_cents=?, monthly_rate_cents=?, currency=?, availability=?,
      rating=?, reviews_count=?, wins_count=?, is_featured=?, is_verified=?,
      contact_email=?, social_links=?, portfolio_items=?, updated_at=?
    WHERE id=?
  `,
  ).run(
    merged.name,
    merged.headline,
    merged.bio,
    merged.avatar_url,
    JSON.stringify(merged.specialties),
    JSON.stringify(merged.frameworks),
    JSON.stringify(merged.industries),
    merged.hourly_rate_cents,
    merged.monthly_rate_cents,
    merged.currency,
    merged.availability,
    merged.rating,
    merged.reviews_count,
    merged.wins_count,
    merged.is_featured ? 1 : 0,
    merged.is_verified ? 1 : 0,
    merged.contact_email,
    JSON.stringify(merged.social_links),
    JSON.stringify(merged.portfolio_items),
    merged.updated_at,
    id,
  );
  return getMarketerById(id);
}

export function deleteMarketer(id: string) {
  db.prepare(`DELETE FROM marketer_reviews WHERE marketer_id = ?`).run(id);
  db.prepare(`DELETE FROM marketer_engagements WHERE marketer_id = ?`).run(id);
  db.prepare(`DELETE FROM marketer_profiles WHERE id = ?`).run(id);
}

function hydrateMarketer(row: Record<string, unknown>): MarketerProfile {
  const parse = <T,>(s: string | null, def: T[] = [] as unknown as T[]) => {
    if (!s) return def;
    try {
      return JSON.parse(s);
    } catch {
      return def;
    }
  };
  return {
    ...row,
    specialties: parse(row.specialties),
    frameworks: parse(row.frameworks),
    industries: parse(row.industries),
    social_links: parse(row.social_links, {}),
    portfolio_items: parse(row.portfolio_items),
  };
}

/* ──────────── Engagements ──────────── */

export interface Engagement {
  id: string;
  workspace_id: string;
  marketer_id: string;
  status: "inquiry" | "negotiating" | "active" | "completed" | "cancelled";
  scope: string;
  rate_cents: number;
  rate_kind: "hourly" | "monthly" | "fixed";
  currency: string;
  start_at: number | null;
  end_at: number | null;
  notes: string;
  created_at: number;
  updated_at: number;
}

export function listEngagements(workspaceId: string): Engagement[] {
  return db
    .prepare(`SELECT * FROM marketer_engagements WHERE workspace_id = ? ORDER BY created_at DESC`)
    .all(workspaceId) as Record<string, unknown>[];
}
export function createEngagement(input: {
  workspace_id: string;
  marketer_id: string;
  scope: string;
  rate_cents?: number;
  rate_kind?: string;
  currency?: string;
  start_at?: number;
  end_at?: number;
  notes?: string;
}): Engagement {
  const id = uid("eng_");
  const t = now();
  db.prepare(
    `
    INSERT INTO marketer_engagements (id, workspace_id, marketer_id, status, scope, rate_cents, rate_kind, currency, start_at, end_at, notes, created_at, updated_at)
    VALUES (?, ?, ?, 'inquiry', ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    id,
    input.workspace_id,
    input.marketer_id,
    input.scope,
    input.rate_cents || 0,
    input.rate_kind || "fixed",
    input.currency || "USD",
    input.start_at || null,
    input.end_at || null,
    input.notes || "",
    t,
    t,
  );
  return db.prepare(`SELECT * FROM marketer_engagements WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
}
export function updateEngagement(id: string, patch: Partial<Engagement>): Engagement | null {
  const cur = db.prepare(`SELECT * FROM marketer_engagements WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
  if (!cur) return null;
  const merged = { ...cur, ...patch, updated_at: now() };
  db.prepare(
    `UPDATE marketer_engagements SET status=?, scope=?, rate_cents=?, rate_kind=?, currency=?, start_at=?, end_at=?, notes=?, updated_at=? WHERE id=?`,
  ).run(
    merged.status,
    merged.scope,
    merged.rate_cents,
    merged.rate_kind,
    merged.currency,
    merged.start_at,
    merged.end_at,
    merged.notes,
    merged.updated_at,
    id,
  );
  return merged;
}

/* ──────────── Reviews ──────────── */

export interface Review {
  id: string;
  marketer_id: string;
  workspace_id: string;
  engagement_id: string | null;
  rating: number;
  title: string;
  body: string;
  author_name: string;
  created_at: number;
}

export function listReviews(marketerId: string): Review[] {
  return db
    .prepare(`SELECT * FROM marketer_reviews WHERE marketer_id = ? ORDER BY created_at DESC`)
    .all(marketerId) as Record<string, unknown>[];
}
export function createReview(input: {
  marketer_id: string;
  workspace_id: string;
  engagement_id?: string;
  rating: number;
  title?: string;
  body?: string;
  author_name?: string;
}): Review {
  const id = uid("rev_");
  const t = now();
  db.prepare(
    `
    INSERT INTO marketer_reviews (id, marketer_id, workspace_id, engagement_id, rating, title, body, author_name, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    id,
    input.marketer_id,
    input.workspace_id,
    input.engagement_id || null,
    input.rating,
    input.title || "",
    input.body || "",
    input.author_name || "Anonymous",
    t,
  );
  // Recompute rating
  const r = db
    .prepare(`SELECT AVG(rating) AS avg, COUNT(*) AS n FROM marketer_reviews WHERE marketer_id = ?`)
    .get(input.marketer_id) as Record<string, unknown> | undefined;
  db.prepare(
    `UPDATE marketer_profiles SET rating = ?, reviews_count = ?, updated_at = ? WHERE id = ?`,
  ).run(Math.round((r.avg || 0) * 10) / 10, r.n || 0, t, input.marketer_id);
  return db.prepare(`SELECT * FROM marketer_reviews WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
}

/* ──────────── Seed sample marketers ──────────── */

export function seedMarketers() {
  const count = (db.prepare(`SELECT COUNT(*) AS n FROM marketer_profiles`).get() as { n: number } | undefined)?.n;
  if (count > 0) return;
  const seeds: Array<Partial<MarketerProfile>> = [
    {
      slug: "seth-godin",
      name: "Seth Godin",
      headline: "Marketing is the generous act of helping someone become who they want to be.",
      bio: "Author of This Is Marketing, Purple Cow, All Marketers Are Liars, Tribes. 40+ years of helping marketers find their smallest viable audience. Author of the daily blog seths.blog.",
      specialties: [
        "tribes",
        "permission_marketing",
        "remarkable",
        "purple_cow",
        "smallest_viable_audience",
        "story",
      ],
      frameworks: ["tribes", "purple_cow", "permission", "im_me_test"],
      industries: ["b2b", "consumer", "publishing"],
      hourly_rate_cents: 5000000,
      monthly_rate_cents: null,
      is_featured: 1,
      is_verified: 1,
      rating: 5.0,
      reviews_count: 247,
      wins_count: 1000,
      contact_email: "seth@example.com",
      social_links: { blog: "seths.blog", twitter: "@ThisIsSethsBlog" },
      availability: "booked",
    },
    {
      slug: "gary-vaynerchuk",
      name: "Gary Vaynerchuk",
      headline: "Document, don't create. The work is the content.",
      bio: "Founder of VaynerMedia. Author of Jab Jab Jab Right Hook, Crushing It, The Thank You Economy. Pioneer of document-in-public content marketing. Daily podcast, daily content across every platform.",
      specialties: [
        "document_dont_create",
        "attention_arbitrage",
        "platform_native",
        "volume",
        "jab_jab_jab",
        "personal_brand",
      ],
      frameworks: [
        "jab_jab_jab_right_hook",
        "document_dont_create",
        "attention_arbitrage",
        "platform_native_30",
      ],
      industries: ["b2b", "b2c", "ecommerce", "personal_brand"],
      hourly_rate_cents: 1000000,
      monthly_rate_cents: 1500000,
      is_featured: 1,
      is_verified: 1,
      rating: 4.8,
      reviews_count: 189,
      wins_count: 850,
      contact_email: "gv@vaynermedia.com",
      social_links: { youtube: "@garyvee", instagram: "@garyvee" },
      availability: "busy",
    },
    {
      slug: "patrick-bet-david",
      name: "Patrick Bet-David",
      headline: "Your skill set + your work ethic = your income. The math never lies.",
      bio: "Founder of Valuetainment. Built PHP Agency from $0 to $100M+. Teaches entrepreneurs how to think in systems, not goals. Master of sales pipelines and direct response.",
      specialties: [
        "sales_pipelines",
        "direct_response",
        "entrepreneurship",
        "agency_scaling",
        "media_buying",
      ],
      frameworks: ["valuetainment_method", "php_sales_stack", "media_buy_math"],
      industries: ["b2b", "agency", "saas", "consulting"],
      hourly_rate_cents: 1500000,
      monthly_rate_cents: 5000000,
      is_featured: 1,
      is_verified: 1,
      rating: 4.9,
      reviews_count: 312,
      wins_count: 1200,
      contact_email: "pbd@valuetainment.com",
      social_links: { youtube: "@patrickbetdavid" },
      availability: "busy",
    },
    {
      slug: "philip-kotler",
      name: "Philip Kotler",
      headline: "Marketing is the science and art of finding, creating, and delivering value.",
      bio: "Father of modern marketing. Author of Marketing Management (15 editions). S.C. Johnson Distinguished Professor at Kellogg. The STP + 7Ps framework. The strategic spine of the discipline.",
      specialties: [
        "stp",
        "seven_ps",
        "marketing_management",
        "strategic_planning",
        "value_creation",
      ],
      frameworks: ["stp", "7ps", "marketing_mix", "positioning"],
      industries: ["enterprise", "b2b", "global", "manufacturing"],
      hourly_rate_cents: 2000000,
      monthly_rate_cents: null,
      is_featured: 1,
      is_verified: 1,
      rating: 4.9,
      reviews_count: 98,
      wins_count: 500,
      contact_email: "p-kotler@kellogg.northwestern.edu",
      availability: "available",
    },
    {
      slug: "eugene-schwartz",
      name: "Eugene Schwartz (Legacy)",
      headline: "Copy cannot create desire for a product. It can only channel desire.",
      bio: "Author of Breakthrough Advertising (1966, the bible of copywriting). Five levels of awareness. Market sophistication. Mass desire pre-exists. We just articulate it.",
      specialties: [
        "copywriting",
        "headlines",
        "mass_desire",
        "levels_of_awareness",
        "market_sophistication",
      ],
      frameworks: ["5_levels_of_awareness", "market_sophistication_stages", "headline_hierarchy"],
      industries: ["direct_response", "copywriting"],
      hourly_rate_cents: null,
      monthly_rate_cents: null,
      is_featured: 1,
      is_verified: 1,
      rating: 5.0,
      reviews_count: 156,
      wins_count: 0, // passed
      contact_email: null,
      availability: "booked",
    },
    {
      slug: "david-ogilvy",
      name: "David Ogilvy (Legacy)",
      headline: "The best ideas come as jokes. Make your thinking as funny as possible.",
      bio: "Founder of Ogilvy & Mather. The Father of Advertising. Rolls-Royce copywriter. 5x more effective headlines. The Research Giant.",
      specialties: ["long_form_copy", "headlines", "research_driven", "brand_building"],
      frameworks: ["ogilvy_5x_headline", "research_first", "long_form_authority"],
      industries: ["advertising", "luxury", "consumer"],
      hourly_rate_cents: 4000000,
      monthly_rate_cents: null,
      is_featured: 1,
      is_verified: 1,
      rating: 5.0,
      reviews_count: 203,
      wins_count: 0,
      contact_email: null,
      availability: "booked",
    },
    {
      slug: "alex-hormozi",
      name: "Alex Hormozi",
      headline: "Make your offer so good people feel stupid saying no.",
      bio: "Founder of Acquisition.com. Built and sold 4 companies. $100M Offers. $100M Leads. Gym Launch Secrets. The Grand Slam Offer formula: dream outcome × perceived likelihood / time × effort × sacrifice.",
      specialties: ["offers", "pricing", "monetisation", "lead_generation", "gym_launch"],
      frameworks: ["grand_slam_offer", "core_four", "lead_magnet_value_stack", "take_rate_pricing"],
      industries: ["saas", "b2b", "consumer", "service"],
      hourly_rate_cents: 7500000,
      monthly_rate_cents: 50000000,
      is_featured: 1,
      is_verified: 1,
      rating: 5.0,
      reviews_count: 421,
      wins_count: 800,
      contact_email: "hormozi@example.com",
      social_links: { twitter: "@AlexHormozi", site: "acquisition.com" },
      availability: "booked",
    },
    {
      slug: "sabri-suby",
      name: "Sabri Suby",
      headline: "Great marketing makes a sale. Great copy makes a sale every day.",
      bio: "Founder of Sabri Suby (formerly WebSavvy). $100M+ in client revenue. Sell Like Crazy. $100M Offers contributor. The god of conversion-rate-optimisation.",
      specialties: [
        "conversion_rate_optimisation",
        "direct_response_copy",
        "funnels",
        "paid_acquisition",
      ],
      frameworks: ["slc_offer", "hook_story_offer", "big_marketing_calendar", "client_letter"],
      industries: ["b2b", "saas", "service", "ecommerce"],
      hourly_rate_cents: 5000000,
      monthly_rate_cents: 30000000,
      is_featured: 1,
      is_verified: 1,
      rating: 4.9,
      reviews_count: 198,
      wins_count: 350,
      contact_email: "sabri@example.com",
      social_links: { twitter: "@SabriSuby", site: "sabrisuby.com" },
      availability: "available",
    },
    {
      slug: "eugenia-anami",
      name: "Eugenia Anami",
      headline: "I grew 3 SaaS startups from $0 to $5M ARR. SEO is my weapon.",
      bio: "Ex-HubSpot PMM. Now runs a $5M ARR bootstrapped SaaS. 100% organic acquisition. Teaches SEO-driven content systems.",
      specialties: ["seo", "programmatic_seo", "content_systems", "pmm"],
      frameworks: ["topical_authority", "programmatic_seo_100k", "product_led_content"],
      industries: ["saas", "b2b", "developer_tools"],
      hourly_rate_cents: 35000,
      monthly_rate_cents: 1200000,
      is_featured: 0,
      is_verified: 1,
      rating: 4.7,
      reviews_count: 64,
      wins_count: 80,
      contact_email: "eugenia@example.com",
      social_links: { twitter: "@eugenia_anami" },
      availability: "available",
    },
    {
      slug: "marcus-chen",
      name: "Marcus Chen",
      headline: "Paid media + lifecycle = 8x ROAS in 90 days.",
      bio: "Ex-Facebook, now runs a $20M/yr ad spend management practice. Specializes in B2B SaaS paid acquisition. Bootstrapped three companies to acquisition.",
      specialties: [
        "paid_media",
        "facebook_ads",
        "google_ads",
        "b2b_saas_acquisition",
        "lifecycle",
      ],
      frameworks: ["b2b_paid_funnel", "lifecycle_machine", "creative_testing_50_variants"],
      industries: ["saas", "b2b", "ecommerce"],
      hourly_rate_cents: 50000,
      monthly_rate_cents: 2500000,
      is_featured: 0,
      is_verified: 1,
      rating: 4.6,
      reviews_count: 88,
      wins_count: 120,
      contact_email: "marcus@example.com",
      social_links: { linkedin: "marcuschen-growth" },
      availability: "available",
    },
    {
      slug: "aisha-okafor",
      name: "Aisha Okafor",
      headline: "I build content engines that compound. 1 piece → 30 assets.",
      bio: "Ex-CMO at a B2B unicorn. Now freelance. Built content ops for 40+ Series A/B startups. The queen of repurposing.",
      specialties: [
        "content_engines",
        "repurposing",
        "editorial",
        "personal_branding",
        "ghostwriting",
      ],
      frameworks: ["pillar_repurpose_30", "atomic_content", "voice_dna"],
      industries: ["saas", "b2b", "media"],
      hourly_rate_cents: 30000,
      monthly_rate_cents: 1500000,
      is_featured: 0,
      is_verified: 1,
      rating: 4.9,
      reviews_count: 142,
      wins_count: 200,
      contact_email: "aisha@example.com",
      social_links: { twitter: "@aishabuilds" },
      availability: "available",
    },
    {
      slug: "diego-santos",
      name: "Diego Santos",
      headline: "Lifecycle + email = the only marketing that compounds.",
      bio: "Built the email + lifecycle program for 3 unicorns. Open rates above 50%. The practitioner marketers hire when nothing else works.",
      specialties: ["email_marketing", "lifecycle", "automation", "retention", "deliverability"],
      frameworks: ["lifecycle_email_90", "deliverability_first", "win_back_machine"],
      industries: ["saas", "ecommerce", "b2b"],
      hourly_rate_cents: 40000,
      monthly_rate_cents: 1800000,
      is_featured: 0,
      is_verified: 1,
      rating: 4.8,
      reviews_count: 96,
      wins_count: 150,
      contact_email: "diego@example.com",
      social_links: { linkedin: "diego-lifecycle" },
      availability: "available",
    },
    {
      slug: "nova-park",
      name: "Nova Park",
      headline: "PR that gets cited. 200+ TechCrunch features and counting.",
      bio: "Ex-TechCrunch contributor. Now runs a boutique PR firm for B2B SaaS. Specializes in funding announcements and category creation.",
      specialties: ["pr", "media_relations", "category_creation", "funding_announcements"],
      frameworks: ["news_jacking", "category_creation_loop", "embargo_strategy"],
      industries: ["saas", "fintech", "ai"],
      hourly_rate_cents: 60000,
      monthly_rate_cents: 3000000,
      is_featured: 0,
      is_verified: 1,
      rating: 4.7,
      reviews_count: 75,
      wins_count: 200,
      contact_email: "nova@example.com",
      social_links: { twitter: "@novapark_pr" },
      availability: "available",
    },
    {
      slug: "kenji-watanabe",
      name: "Kenji Watanabe",
      headline: "SEO is a 24-month game. I play the long game.",
      bio: "SEO specialist. 12 years in. Built organic programs that generated $50M+ in pipeline for B2B SaaS. Quietly does the work that compounds.",
      specialties: ["seo", "technical_seo", "programmatic_seo", "link_building", "content_pr"],
      frameworks: ["topical_authority_long", "programmatic_seo_1000", "link_magnet_loop"],
      industries: ["saas", "b2b", "ecommerce"],
      hourly_rate_cents: 25000,
      monthly_rate_cents: 1000000,
      is_featured: 0,
      is_verified: 1,
      rating: 4.9,
      reviews_count: 53,
      wins_count: 90,
      contact_email: "kenji@example.com",
      social_links: { twitter: "@kenji_seo" },
      availability: "available",
    },
  ];
  for (const s of seeds) {
    try {
      createMarketer(s as Record<string, unknown>);
    } catch {}
  }
}
