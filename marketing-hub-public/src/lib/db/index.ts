import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

// On Vercel serverless, the filesystem is read-only except /tmp.
// The DB will be ephemeral (recreated on cold start) but the app renders.
// For production, migrate to Turso/libSQL or PostgreSQL.
const DATA_DIR = process.env.VERCEL ? "/tmp/data" : path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const DB_PATH = path.join(DATA_DIR, "hub.sqlite");

declare global {
  // eslint-disable-next-line no-var
  var __hub_db: Database.Database | undefined;
}

export const db: Database.Database = global.__hub_db ?? new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
// Cache the connection globally — survives warm serverless invocations
global.__hub_db = db;

export function init() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS magic_link_tokens (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      used INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_magic_link_user ON magic_link_tokens(user_id);
    CREATE TABLE IF NOT EXISTS login_attempts (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      ip TEXT,
      ok INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS audit_log (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT NOT NULL,
      entity TEXT,
      entity_id TEXT,
      meta TEXT,
      created_at INTEGER NOT NULL
    );

    -- Outbox / provider tables (transactional email pipeline)
    CREATE TABLE IF NOT EXISTS email_outbox (
      id TEXT PRIMARY KEY,
      to_email TEXT NOT NULL,
      to_name TEXT,
      from_email TEXT,
      from_name TEXT,
      subject TEXT NOT NULL,
      body_html TEXT,
      body_text TEXT,
      reply_to TEXT,
      campaign_id TEXT,
      contact_id TEXT,
      automation_id TEXT,
      status TEXT NOT NULL DEFAULT 'queued',
      provider TEXT,
      provider_message_id TEXT,
      provider_response TEXT,
      last_error TEXT,
      attempts INTEGER NOT NULL DEFAULT 0,
      scheduled_for INTEGER,
      sent_at INTEGER,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_outbox_status ON email_outbox(status);
    CREATE INDEX IF NOT EXISTS idx_outbox_scheduled ON email_outbox(scheduled_for);
    CREATE TABLE IF NOT EXISTS email_events (
      id TEXT PRIMARY KEY,
      outbox_id TEXT NOT NULL,
      kind TEXT NOT NULL,
      url TEXT,
      meta TEXT,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_email_events_outbox ON email_events(outbox_id);
    CREATE TABLE IF NOT EXISTS provider_keys (
      id TEXT PRIMARY KEY,
      provider TEXT NOT NULL,
      label TEXT,
      config TEXT,
      active INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    -- Strategy / agent tables
    CREATE TABLE IF NOT EXISTS brand_stories (
      id TEXT PRIMARY KEY,
      workspace TEXT,
      title TEXT NOT NULL,
      hook TEXT,
      problem TEXT,
      shift TEXT,
      resolution TEXT,
      call_to_action TEXT,
      notes TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS positioning_statements (
      id TEXT PRIMARY KEY,
      workspace TEXT,
      target TEXT NOT NULL,
      frame_of_reference TEXT NOT NULL,
      points_of_difference TEXT NOT NULL,
      reasons_to_believe TEXT NOT NULL,
      brand_character TEXT,
      one_word_positioning TEXT,
      notes TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS pricing_strategies (
      id TEXT PRIMARY KEY,
      workspace TEXT,
      product TEXT NOT NULL,
      strategy TEXT NOT NULL,
      rationale TEXT NOT NULL,
      tiers TEXT,
      notes TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS campaign_briefs (
      id TEXT PRIMARY KEY,
      workspace TEXT,
      title TEXT NOT NULL,
      objective TEXT NOT NULL,
      target_audience TEXT NOT NULL,
      insight TEXT NOT NULL,
      promise TEXT NOT NULL,
      proof TEXT NOT NULL,
      call_to_action TEXT NOT NULL,
      success_metric TEXT NOT NULL,
      channels TEXT,
      notes TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT,
      config TEXT,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS agent_runs (
      id TEXT PRIMARY KEY,
      agent TEXT NOT NULL,
      input TEXT,
      output TEXT,
      linked_to TEXT,
      linked_type TEXT,
      user_id TEXT,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_agent_runs_agent ON agent_runs(agent);
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      workspace TEXT,
      name TEXT NOT NULL,
      industry TEXT,
      website TEXT,
      contact_email TEXT,
      notes TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS ideas (
      id TEXT PRIMARY KEY,
      workspace TEXT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      tags TEXT,
      audience TEXT,
      why_now TEXT,
      estimated_effort TEXT,
      expected_impact TEXT,
      experiment TEXT,
      learnings TEXT,
      impact TEXT,
      effort TEXT,
      status TEXT,
      notes TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    -- Studio Pro: visual canvas (Canva×Obsidian)
    CREATE TABLE IF NOT EXISTS studio_projects (
      id TEXT PRIMARY KEY,
      workspace TEXT,
      name TEXT NOT NULL,
      kind TEXT NOT NULL DEFAULT 'social_card', -- social_card | landing_page | ad_creative | email_header | infographic | og_image
      template TEXT,
      width INTEGER DEFAULT 1200,
      height INTEGER DEFAULT 630,
      brand_color TEXT,
      brand_color_2 TEXT,
      font_heading TEXT,
      font_body TEXT,
      blocks TEXT,        -- JSON array
      thumbnail TEXT,     -- data URL or storage path
      tags TEXT,
      linked_to TEXT,
      linked_type TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_studio_kind ON studio_projects(kind);

    -- Wire: marketing news + Nova analysis
    CREATE TABLE IF NOT EXISTS wire_articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      url TEXT,
      source TEXT,           -- TechCrunch, HBR, Seth's blog, etc.
      author TEXT,
      published_at INTEGER,
      category TEXT,         -- strategy, copy, brand, growth, product, ai, seo
      summary TEXT,
      nova_take TEXT,        -- generated by Nova per workspace
      relevance INTEGER,     -- 0..100, scored against workspace positioning/personas
      is_featured INTEGER DEFAULT 0,
      is_read INTEGER DEFAULT 0,
      is_saved INTEGER DEFAULT 0,
      linked_idea_id TEXT,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_wire_published ON wire_articles(published_at);
    CREATE INDEX IF NOT EXISTS idx_wire_category ON wire_articles(category);
    -- workspaces is created OUTSIDE this exec block (below) so the DROP-and-recreate works even on legacy schemas.
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT,
      email TEXT,
      phone TEXT,
      company TEXT,
      title TEXT,
      status TEXT NOT NULL DEFAULT 'lead',
      source TEXT,
      tags TEXT,
      notes TEXT,
      sentiment REAL DEFAULT 0.1,
      last_touch_at INTEGER,
      score INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS companies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      domain TEXT,
      industry TEXT,
      size TEXT,
      notes TEXT,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS deals (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      value REAL DEFAULT 0,
      value_collected REAL DEFAULT 0,
      cost_to_acquire REAL DEFAULT 0,
      source TEXT,
      stage TEXT NOT NULL DEFAULT 'lead',
      probability INTEGER DEFAULT 10,
      contact_id TEXT,
      company_id TEXT,
      owner TEXT,
      close_date INTEGER,
      won_at INTEGER,
      lost_at INTEGER,
      lost_reason TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    -- ──── HubSpot killers ────

    -- Touchpoints: every interaction that contributed to a deal
    CREATE TABLE IF NOT EXISTS touchpoints (
      id TEXT PRIMARY KEY,
      deal_id TEXT,
      contact_id TEXT,
      channel TEXT NOT NULL,          -- email, paid, organic, social, referral, direct, content, event, sales
      campaign_id TEXT,
      asset TEXT,                    -- page slug, email id, post url, ad name
      occurred_at INTEGER NOT NULL,
      attribution_weight REAL DEFAULT 1.0,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_touchpoint_deal ON touchpoints(deal_id);
    CREATE INDEX IF NOT EXISTS idx_touchpoint_contact ON touchpoints(contact_id);
    CREATE INDEX IF NOT EXISTS idx_touchpoint_channel ON touchpoints(channel);

    -- Sales sequences: multi-step cadences
    CREATE TABLE IF NOT EXISTS sales_sequences (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      active INTEGER DEFAULT 1,
      steps TEXT,                    -- JSON array of {day, channel, template_id, subject, body}
      enrolled_count INTEGER DEFAULT 0,
      replied_count INTEGER DEFAULT 0,
      booked_count INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sequence_enrollments (
      id TEXT PRIMARY KEY,
      sequence_id TEXT NOT NULL,
      contact_id TEXT NOT NULL,
      deal_id TEXT,
      current_step INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',   -- active | paused | replied | booked | completed | stopped
      enrolled_at INTEGER NOT NULL,
      next_action_at INTEGER,
      last_event_at INTEGER,
      events TEXT,                   -- JSON array of step results
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_enrollments_contact ON sequence_enrollments(contact_id);
    CREATE INDEX IF NOT EXISTS idx_enrollments_seq ON sequence_enrollments(sequence_id);

    -- ABM accounts: company-level targeting & scoring
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      domain TEXT,
      industry TEXT,
      size TEXT,                     -- 1-10 / 11-50 / 51-200 / 201-1000 / 1000+
      revenue_range TEXT,
      tier TEXT DEFAULT 'tier_3',     -- tier_1 (strategic) | tier_2 (named) | tier_3 (programmatic)
      abm_score INTEGER DEFAULT 0,    -- 0-100 engagement score
      intent_score INTEGER DEFAULT 0, -- 0-100 third-party intent
      owner TEXT,
      notes TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_accounts_tier ON accounts(tier);

    -- GDPR consent log
    CREATE TABLE IF NOT EXISTS consent_log (
      id TEXT PRIMARY KEY,
      contact_id TEXT NOT NULL,
      purpose TEXT NOT NULL,         -- marketing | analytics | sales | third_party
      granted INTEGER NOT NULL,
      ip TEXT,
      user_agent TEXT,
      source TEXT,                   -- form_name, api, manual
      occurred_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_consent_contact ON consent_log(contact_id);
    CREATE INDEX IF NOT EXISTS idx_consent_purpose ON consent_log(purpose);

    -- Dashboards: saved KPI views
    CREATE TABLE IF NOT EXISTS dashboards (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      widgets TEXT,                  -- JSON array of widget configs
      is_default INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    -- Revenue events: every dollar that actually hits the bank
    CREATE TABLE IF NOT EXISTS revenue_events (
      id TEXT PRIMARY KEY,
      deal_id TEXT,
      contact_id TEXT,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      kind TEXT NOT NULL,                 -- one_time | recurring_first | recurring_renewal | refund
      occurred_at INTEGER NOT NULL,
      notes TEXT,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_revenue_occurred ON revenue_events(occurred_at);

    -- Content Machine (Gary Vee — document don't create, repurpose at scale)
    CREATE TABLE IF NOT EXISTS pillar_content (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      source TEXT NOT NULL,
      raw_content TEXT NOT NULL,
      key_insights TEXT,
      status TEXT DEFAULT 'raw',
      source_url TEXT,
      occurred_at INTEGER,
      notes TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_pillar_status ON pillar_content(status);

    CREATE TABLE IF NOT EXISTS repurposed_assets (
      id TEXT PRIMARY KEY,
      pillar_id TEXT NOT NULL,
      platform TEXT NOT NULL,
      insight_index INTEGER,
      body TEXT NOT NULL,
      format TEXT,
      hashtags TEXT,
      hook TEXT,
      cta TEXT,
      status TEXT DEFAULT 'draft',
      scheduled_for INTEGER,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_repurpose_pillar ON repurposed_assets(pillar_id);
    CREATE INDEX IF NOT EXISTS idx_repurpose_platform ON repurposed_assets(platform);

    -- Daily KPI ritual — the morning 5-minute number check
    CREATE TABLE IF NOT EXISTS daily_kpis (
      date TEXT PRIMARY KEY,              -- YYYY-MM-DD
      cash_collected REAL DEFAULT 0,
      new_leads INTEGER DEFAULT 0,
      new_deals INTEGER DEFAULT 0,
      deals_won INTEGER DEFAULT 0,
      deals_lost INTEGER DEFAULT 0,
      mrr_added REAL DEFAULT 0,
      mrr_churned REAL DEFAULT 0,
      notes TEXT,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT,
      contact_id TEXT,
      deal_id TEXT,
      campaign_id TEXT,
      updated_at INTEGER,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS campaigns (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      budget REAL DEFAULT 0,
      spent REAL DEFAULT 0,
      channels TEXT,
      start_date INTEGER,
      end_date INTEGER,
      goal TEXT,
      metrics TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS content (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      channel TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      scheduled_for INTEGER,
      campaign_id TEXT,
      hashtags TEXT,
      media_urls TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS emails (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      subject TEXT NOT NULL,
      preheader TEXT,
      from_name TEXT,
      from_email TEXT,
      body_html TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      list_id TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS landing_pages (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      blocks TEXT NOT NULL,
      published INTEGER DEFAULT 0,
      meta_title TEXT,
      meta_description TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS seo_keywords (
      id TEXT PRIMARY KEY,
      keyword TEXT NOT NULL,
      volume INTEGER DEFAULT 0,
      difficulty INTEGER DEFAULT 0,
      intent TEXT,
      position REAL,
      url TEXT,
      notes TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS seo_audits (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      score INTEGER DEFAULT 0,
      issues TEXT,
      suggestions TEXT,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ads (
      id TEXT PRIMARY KEY,
      campaign_id TEXT,
      name TEXT NOT NULL,
      channel TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      budget REAL DEFAULT 0,
      spent REAL DEFAULT 0,
      impressions INTEGER DEFAULT 0,
      clicks INTEGER DEFAULT 0,
      conversions INTEGER DEFAULT 0,
      creative TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      kind TEXT NOT NULL,
      url TEXT NOT NULL,
      size INTEGER DEFAULT 0,
      tags TEXT,
      folder TEXT,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS automations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      trigger TEXT NOT NULL,
      action TEXT NOT NULL,
      config TEXT,                       -- JSON for webhook URL, email template id, etc.
      active INTEGER DEFAULT 1,
      runs INTEGER DEFAULT 0,
      last_run INTEGER,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS webhook_deliveries (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      payload TEXT NOT NULL,
      event TEXT NOT NULL,                -- e.g. deal.won, contact.created
      response_status INTEGER,
      response_body TEXT,
      attempt INTEGER DEFAULT 1,
      ok INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_webhook_event ON webhook_deliveries(event);
    CREATE INDEX IF NOT EXISTS idx_webhook_created ON webhook_deliveries(created_at);

    CREATE TABLE IF NOT EXISTS integrations (
      id TEXT PRIMARY KEY,
      service TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'disconnected',
      config TEXT,
      connected_at INTEGER,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS api_keys (
      id TEXT PRIMARY KEY,
      workspace_id TEXT,
      name TEXT NOT NULL,
      key_hash TEXT NOT NULL,
      prefix TEXT NOT NULL,
      scopes TEXT,
      last_used_at INTEGER,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS copy_templates (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      template TEXT NOT NULL,
      tags TEXT,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      body TEXT,
      pinned INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      done INTEGER DEFAULT 0,
      status TEXT DEFAULT 'open',
      priority TEXT DEFAULT 'medium',
      due_date INTEGER,
      project TEXT,
      notes TEXT,
      updated_at INTEGER,
      created_at INTEGER NOT NULL
    );

    -- ═══════════════════════════════════════════════════════════════════════
    -- NEW TABLES — full marketing coverage (v2.0)
    -- ═══════════════════════════════════════════════════════════════════════

    CREATE TABLE IF NOT EXISTS brand_assets (
      id TEXT PRIMARY KEY,
      kind TEXT NOT NULL,            -- logo, color, typography, voice, guideline
      name TEXT NOT NULL,
      data TEXT NOT NULL,            -- JSON payload (varies by kind)
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS personas (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT,
      avatar TEXT,                   -- emoji or URL
      demographics TEXT,             -- JSON
      goals TEXT,                    -- JSON array
      pain_points TEXT,              -- JSON array
      channels TEXT,                 -- JSON array
      messaging TEXT,
      tier TEXT DEFAULT 'primary',  -- primary | secondary | negative
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS segments (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      rules TEXT NOT NULL,           -- JSON array of {field, op, value}
      contact_count INTEGER DEFAULT 0,
      color TEXT DEFAULT '#888888',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS forms (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      fields TEXT NOT NULL,          -- JSON array of field defs
      submit_button TEXT DEFAULT 'Submit',
      success_message TEXT DEFAULT 'Thanks — we’ll be in touch.',
      notify_email TEXT,
      tags TEXT,                     -- JSON array
      leads_count INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',  -- active | draft | archived
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS form_submissions (
      id TEXT PRIMARY KEY,
      form_id TEXT NOT NULL,
      contact_id TEXT,
      payload TEXT NOT NULL,         -- JSON of {field_name: value}
      contact_email TEXT,
      contact_name TEXT,
      source TEXT,
      ip TEXT,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lead_magnets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,            -- ebook | template | checklist | webinar | coupon | video | tool
      description TEXT,
      url TEXT,
      file_size TEXT,
      downloads INTEGER DEFAULT 0,
      form_id TEXT,
      tags TEXT,                     -- JSON array
      status TEXT DEFAULT 'live',    -- live | draft | archived
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS funnels (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      goal TEXT,
      steps TEXT NOT NULL,           -- JSON array of {type, name, config, ...}
      status TEXT DEFAULT 'draft',   -- draft | live | paused
      conversion_rate REAL DEFAULT 0,
      entries INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS experiments (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      hypothesis TEXT,
      type TEXT NOT NULL,            -- ab | multivariate | split_url
      status TEXT DEFAULT 'running', -- running | completed | paused | draft
      variant_a TEXT NOT NULL,       -- JSON {name, traffic, conversions}
      variant_b TEXT NOT NULL,       -- JSON {name, traffic, conversions}
      metric TEXT NOT NULL,
      confidence REAL DEFAULT 0,
      winner TEXT,
      start_date INTEGER,
      end_date INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id TEXT PRIMARY KEY,
      author_name TEXT NOT NULL,
      author_role TEXT,
      author_company TEXT,
      author_avatar TEXT,
      rating INTEGER DEFAULT 5,
      body TEXT NOT NULL,
      source TEXT,                   -- g2 | twitter | email | manual | trustpilot
      url TEXT,
      featured INTEGER DEFAULT 0,
      tags TEXT,                     -- JSON array
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,            -- webinar | conference | meetup | workshop | launch | demo
      description TEXT,
      start_date INTEGER NOT NULL,
      end_date INTEGER,
      timezone TEXT DEFAULT 'UTC',
      venue TEXT,                    -- physical address OR 'Online'
      url TEXT,                      -- registration URL
      capacity INTEGER DEFAULT 0,
      registrations INTEGER DEFAULT 0,
      attendees INTEGER DEFAULT 0,
      status TEXT DEFAULT 'upcoming',-- upcoming | live | past | cancelled
      campaign_id TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS event_registrations (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      contact_id TEXT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      status TEXT DEFAULT 'registered', -- registered | attended | no_show | cancelled
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS competitors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      domain TEXT,
      description TEXT,
      positioning TEXT,
      strengths TEXT,                -- JSON array
      weaknesses TEXT,               -- JSON array
      pricing_model TEXT,
      pricing_low REAL,
      pricing_high REAL,
      market_share REAL,
      channels TEXT,                 -- JSON array
      notes TEXT,
      swot TEXT,                     -- JSON {strengths, weaknesses, opportunities, threats}
      last_tracked INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      channel TEXT NOT NULL,         -- twitter | linkedin | instagram | facebook | email | sms | dm
      contact_id TEXT,
      contact_name TEXT NOT NULL,
      contact_avatar TEXT,
      direction TEXT NOT NULL,       -- inbound | outbound
      subject TEXT,
      body TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      starred INTEGER DEFAULT 0,
      sentiment TEXT,                -- positive | neutral | negative
      campaign_id TEXT,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS budget_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,        -- paid_ads | content | tools | events | salaries | agencies | influencers | other
      channel TEXT,
      period TEXT NOT NULL,          -- 2026-06 (YYYY-MM)
      planned REAL NOT NULL,
      actual REAL DEFAULT 0,
      owner TEXT,
      notes TEXT,
      campaign_id TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS playbooks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT,                 -- acquisition | activation | retention | revenue | branding
      summary TEXT,
      steps TEXT NOT NULL,           -- JSON array of {title, description, owner, duration}
      kpis TEXT,                     -- JSON array
      tags TEXT,                     -- JSON array
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS surveys (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,            -- nps | csat | ces | custom
      question TEXT NOT NULL,
      audience TEXT,                 -- contacts | customers | segment_id
      responses INTEGER DEFAULT 0,
      score REAL DEFAULT 0,
      status TEXT DEFAULT 'active',  -- active | draft | closed
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS survey_responses (
      id TEXT PRIMARY KEY,
      survey_id TEXT NOT NULL,
      contact_id TEXT,
      score INTEGER NOT NULL,
      comment TEXT,
      created_at INTEGER NOT NULL
    );

    -- Marketing leads (public lead capture from landing pages)
    CREATE TABLE IF NOT EXISTS marketing_leads (
      id TEXT PRIMARY KEY,
      workspace_id TEXT,
      email TEXT NOT NULL,
      name TEXT,
      company TEXT,
      source TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_marketing_leads_email ON marketing_leads(email);
    CREATE INDEX IF NOT EXISTS idx_marketing_leads_workspace ON marketing_leads(workspace_id);
  `);
}

init();

// Workspace migration: add workspace_id to every high-value table (idempotent)
// Inline workspace table creation to avoid circular import with workspace.ts
const DEFAULT_WORKSPACE = "default";

const TENANT_TABLES_FOR_MIGRATION = [
  "contacts",
  "companies",
  "deals",
  "activities",
  "campaigns",
  "content",
  "emails",
  "landing_pages",
  "ads",
  "automations",
  "tasks",
  "assets",
  "forms",
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
  "accounts",
  "sales_sequences",
  "sequence_enrollments",
  "touchpoints",
  "repurposed_assets",
  "pillar_content",
  "notes",
  "copy_templates",
  "integrations",
  "brand_stories",
  "positioning_statements",
  "pricing_strategies",
  "campaign_briefs",
  "clients",
  "api_keys",
  "webhook_deliveries",
];
for (const _t of TENANT_TABLES_FOR_MIGRATION) {
  try {
    db.exec(`ALTER TABLE ${_t} ADD COLUMN workspace_id TEXT`);
  } catch {
    /* exists */
  }
  try {
    db.exec(`CREATE INDEX IF NOT EXISTS idx_${_t}_workspace ON ${_t}(workspace_id)`);
  } catch {}
  // Backfill: any rows missing workspace_id default to the seed workspace
  db.prepare(
    `UPDATE ${_t} SET workspace_id = ? WHERE workspace_id IS NULL OR workspace_id = ''`,
  ).run(DEFAULT_WORKSPACE);
}
db.exec(`
  CREATE TABLE IF NOT EXISTS workspaces (
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
  );
  INSERT OR IGNORE INTO workspaces (id, name, slug, plan, status, brand_color, created_at, updated_at)
    VALUES ('${DEFAULT_WORKSPACE}', 'My Workspace', 'default', 'pro', 'active', '#888888', 1, 1);
  CREATE TABLE IF NOT EXISTS workspace_members (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'editor',
    created_at INTEGER NOT NULL,
    UNIQUE(workspace_id, user_id)
  );
  CREATE TABLE IF NOT EXISTS workspace_domains (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL,
    hostname TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    verification_token TEXT,
    verified_at INTEGER,
    ssl_status TEXT DEFAULT 'pending',
    ssl_expires_at INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    UNIQUE(workspace_id, hostname)
  );
  CREATE TABLE IF NOT EXISTS agency_client_accounts (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_name TEXT NOT NULL,
    stripe_account_id TEXT,
    onboarding_status TEXT NOT NULL DEFAULT 'pending',
    take_rate_pct REAL NOT NULL DEFAULT 10,
    total_charged_cents INTEGER NOT NULL DEFAULT 0,
    total_earned_cents INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS presence (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    page TEXT NOT NULL DEFAULT '/',
    x REAL DEFAULT 0,
    y REAL DEFAULT 0,
    last_ping INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS portal_links (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    client_name TEXT,
    brand_color TEXT DEFAULT '#888888',
    scope TEXT, -- JSON array of strings describing what's visible
    revoked INTEGER NOT NULL DEFAULT 0,
    last_viewed_at INTEGER,
    view_count INTEGER NOT NULL DEFAULT 0,
    expires_at INTEGER,
    created_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS generated_assets (
    id TEXT PRIMARY KEY,
    kind TEXT NOT NULL, -- 'image' | 'video' | 'copy'
    prompt TEXT NOT NULL,
    style TEXT,
    size TEXT,
    provider TEXT NOT NULL,
    output_url TEXT,
    output_meta TEXT,
    user_id TEXT,
    created_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS nova_history (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT,
    created_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_nova_history_user ON nova_history(user_id, created_at);
  CREATE TABLE IF NOT EXISTS workspace_invites (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'editor',
    token TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    accepted_at INTEGER,
    created_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS workspace_audit (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL,
    user_id TEXT,
    action TEXT NOT NULL,
    entity TEXT,
    entity_id TEXT,
    meta TEXT,
    ip TEXT,
    created_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS billing_subscriptions (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL,
    user_id TEXT,
    provider TEXT NOT NULL,            -- 'stripe' | 'revolut'
    provider_customer_id TEXT,
    provider_subscription_id TEXT,
    plan TEXT NOT NULL,                -- 'free' | 'pro' | 'agency'
    status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete'
    current_period_start INTEGER,
    current_period_end INTEGER,
    cancel_at_period_end INTEGER DEFAULT 0,
    canceled_at INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_billing_sub_ws ON billing_subscriptions(workspace_id);
  CREATE INDEX IF NOT EXISTS idx_billing_sub_provider ON billing_subscriptions(provider, provider_subscription_id);
  CREATE TABLE IF NOT EXISTS billing_invoices (
    id TEXT PRIMARY KEY,
    subscription_id TEXT,
    workspace_id TEXT NOT NULL,
    provider TEXT NOT NULL,
    provider_invoice_id TEXT,
    amount_due INTEGER,                -- smallest currency unit (cents)
    currency TEXT DEFAULT 'USD',
    status TEXT NOT NULL,              -- 'draft' | 'open' | 'paid' | 'uncollectible' | 'void'
    invoice_url TEXT,
    pdf_url TEXT,
    period_start INTEGER,
    period_end INTEGER,
    paid_at INTEGER,
    created_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_billing_inv_ws ON billing_invoices(workspace_id);
  CREATE TABLE IF NOT EXISTS billing_events (
    id TEXT PRIMARY KEY,
    provider TEXT NOT NULL,
    event_type TEXT NOT NULL,
    provider_event_id TEXT,
    payload TEXT,
    workspace_id TEXT,
    processed_at INTEGER,
    created_at INTEGER NOT NULL
  );

  -- ── Orchestrator: campaigns, milestones, tasks, agent runs ──
  CREATE TABLE IF NOT EXISTS orchestrator_campaigns (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL,
    name TEXT NOT NULL,
    brief TEXT,                        -- campaign brief / objective
    target_metric TEXT,                -- e.g. 'mql', 'revenue', 'signups'
    target_value REAL DEFAULT 0,
    current_value REAL DEFAULT 0,
    channel TEXT,                      -- primary channel
    status TEXT NOT NULL DEFAULT 'planning', -- planning | active | paused | completed | archived
    start_date INTEGER,
    end_date INTEGER,
    budget_cents INTEGER DEFAULT 0,
    spent_cents INTEGER DEFAULT 0,
    owner_id TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_orch_status ON orchestrator_campaigns(workspace_id, status);

  CREATE TABLE IF NOT EXISTS orchestrator_milestones (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date INTEGER,
    status TEXT NOT NULL DEFAULT 'pending', -- pending | in_progress | done | skipped
    sort_order INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_milestone_campaign ON orchestrator_milestones(campaign_id);

  CREATE TABLE IF NOT EXISTS orchestrator_tasks (
    id TEXT PRIMARY KEY,
    campaign_id TEXT,
    milestone_id TEXT,
    workspace_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    kind TEXT NOT NULL DEFAULT 'manual',     -- manual | email | social | content | paid | seo | sales | analytics | agent
    priority TEXT NOT NULL DEFAULT 'medium', -- low | medium | high | urgent
    status TEXT NOT NULL DEFAULT 'todo',     -- todo | in_progress | blocked | done | cancelled
    assignee_id TEXT,                        -- user
    assignee_agent TEXT,                    -- strategist | storyteller | ...
    duration_min INTEGER DEFAULT 30,
    start_at INTEGER,                        -- calendar slot
    due_at INTEGER,
    depends_on TEXT,                         -- task id this depends on
    related_id TEXT,                         -- related entity (e.g. email_id)
    related_kind TEXT,                       -- 'email' | 'studio' | 'idea' | 'experiment'
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    completed_at INTEGER
  );
  CREATE INDEX IF NOT EXISTS idx_task_workspace ON orchestrator_tasks(workspace_id);
  CREATE INDEX IF NOT EXISTS idx_task_campaign ON orchestrator_tasks(campaign_id);
  CREATE INDEX IF NOT EXISTS idx_task_status ON orchestrator_tasks(workspace_id, status);
  CREATE INDEX IF NOT EXISTS idx_task_due ON orchestrator_tasks(due_at);

  CREATE TABLE IF NOT EXISTS orchestrator_agent_runs (
    id TEXT PRIMARY KEY,
    task_id TEXT,
    campaign_id TEXT,
    workspace_id TEXT NOT NULL,
    agent TEXT NOT NULL,                -- strategist | storyteller | copywriter | analyst | pr_brain | researcher
    status TEXT NOT NULL DEFAULT 'queued', -- queued | running | done | failed | cancelled
    input TEXT,                         -- JSON
    output TEXT,                         -- JSON
    started_at INTEGER,
    completed_at INTEGER,
    error TEXT,
    cost_cents INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_agent_run_workspace ON orchestrator_agent_runs(workspace_id);
  CREATE INDEX IF NOT EXISTS idx_agent_run_status ON orchestrator_agent_runs(workspace_id, status);

  -- ── Marketers marketplace ──
  -- Anyone can list themselves. Workspaces can hire them for engagements.
  CREATE TABLE IF NOT EXISTS marketer_profiles (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    workspace_id TEXT,                  -- optional: links to their own BAZ workspace
    name TEXT NOT NULL,
    headline TEXT,                      -- "I 10x'd HubSpot's pipeline in 90 days"
    bio TEXT,
    avatar_url TEXT,
    specialties TEXT,                   -- JSON array: ['paid_media','copy','seo','analytics','pr','content']
    frameworks TEXT,                    -- JSON array of frameworks they use
    industries TEXT,                     -- JSON array
    hourly_rate_cents INTEGER,
    monthly_rate_cents INTEGER,
    currency TEXT DEFAULT 'USD',
    availability TEXT DEFAULT 'available', -- available | busy | booked
    rating REAL DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    wins_count INTEGER DEFAULT 0,
    is_featured INTEGER DEFAULT 0,
    is_verified INTEGER DEFAULT 0,
    contact_email TEXT,
    social_links TEXT,                  -- JSON
    portfolio_items TEXT,               -- JSON array
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_marketer_slug ON marketer_profiles(slug);
  CREATE INDEX IF NOT EXISTS idx_marketer_specialties ON marketer_profiles(specialties);
  CREATE INDEX IF NOT EXISTS idx_marketer_featured ON marketer_profiles(is_featured);

  -- Engagement: a workspace hires a marketer
  CREATE TABLE IF NOT EXISTS marketer_engagements (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL,
    marketer_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'inquiry', -- inquiry | negotiating | active | completed | cancelled
    scope TEXT,                          -- what they will do
    rate_cents INTEGER,
    rate_kind TEXT,                      -- 'hourly' | 'monthly' | 'fixed'
    currency TEXT DEFAULT 'USD',
    start_at INTEGER,
    end_at INTEGER,
    notes TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_engagement_workspace ON marketer_engagements(workspace_id);

  -- Reviews on marketers
  CREATE TABLE IF NOT EXISTS marketer_reviews (
    id TEXT PRIMARY KEY,
    marketer_id TEXT NOT NULL,
    workspace_id TEXT NOT NULL,
    engagement_id TEXT,
    rating INTEGER NOT NULL,             -- 1-5
    title TEXT,
    body TEXT,
    author_name TEXT,
    created_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_review_marketer ON marketer_reviews(marketer_id);

  -- ── Contractors (international workers) ──
  CREATE TABLE IF NOT EXISTS contractors (
    id TEXT PRIMARY KEY,
    workspace TEXT NOT NULL DEFAULT 'default',
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    country TEXT NOT NULL,
    timezone TEXT,
    role TEXT,
    department TEXT,
    rate_currency TEXT NOT NULL DEFAULT 'USD',
    rate_amount REAL NOT NULL,
    rate_type TEXT NOT NULL DEFAULT 'hourly',
    tax_id TEXT,
    tax_residency TEXT,
    payment_method TEXT DEFAULT 'manual',
    payment_details TEXT,
    bank_country TEXT,
    contract_url TEXT,
    contract_start INTEGER,
    contract_end INTEGER,
    onboarding_status TEXT NOT NULL DEFAULT 'draft',
    compliance_status TEXT NOT NULL DEFAULT 'pending',
    compliance_notes TEXT,
    documents TEXT,
    notes TEXT,
    avatar_url TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_contractors_ws ON contractors(workspace);
  CREATE INDEX IF NOT EXISTS idx_contractors_country ON contractors(country);
  CREATE INDEX IF NOT EXISTS idx_contractors_status ON contractors(onboarding_status);

  -- ── Payouts (payments to contractors/employees) ──
  CREATE TABLE IF NOT EXISTS payouts (
    id TEXT PRIMARY KEY,
    workspace TEXT NOT NULL DEFAULT 'default',
    payee_type TEXT NOT NULL,
    payee_id TEXT NOT NULL,
    payee_name TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    fx_rate REAL DEFAULT 1.0,
    amount_usd REAL,
    provider TEXT NOT NULL DEFAULT 'manual',
    provider_transfer_id TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    payroll_run_id TEXT,
    description TEXT,
    invoice_url TEXT,
    receipt_url TEXT,
    paid_at INTEGER,
    failed_at INTEGER,
    failure_reason TEXT,
    metadata TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_payouts_payee ON payouts(payee_id);
  CREATE INDEX IF NOT EXISTS idx_payouts_status ON payouts(status);
  CREATE INDEX IF NOT EXISTS idx_payouts_provider ON payouts(provider);
  CREATE INDEX IF NOT EXISTS idx_payouts_ws ON payouts(workspace);

  -- ── Timesheets ──
  CREATE TABLE IF NOT EXISTS timesheets (
    id TEXT PRIMARY KEY,
    workspace TEXT NOT NULL DEFAULT 'default',
    person_type TEXT NOT NULL,
    person_id TEXT NOT NULL,
    person_name TEXT NOT NULL,
    project_id TEXT,
    project_name TEXT,
    client_id TEXT,
    client_name TEXT,
    date INTEGER NOT NULL,
    hours REAL NOT NULL DEFAULT 0,
    description TEXT,
    billable INTEGER NOT NULL DEFAULT 1,
    rate REAL,
    rate_currency TEXT DEFAULT 'USD',
    amount REAL,
    approved_by TEXT,
    approved_at INTEGER,
    status TEXT NOT NULL DEFAULT 'draft',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_timesheets_person ON timesheets(person_id);
  CREATE INDEX IF NOT EXISTS idx_timesheets_project ON timesheets(project_id);
  CREATE INDEX IF NOT EXISTS idx_timesheets_date ON timesheets(date);
  CREATE INDEX IF NOT EXISTS idx_timesheets_status ON timesheets(status);

  -- ── Client Invoices ──
  CREATE TABLE IF NOT EXISTS client_invoices (
    id TEXT PRIMARY KEY,
    workspace TEXT NOT NULL DEFAULT 'default',
    invoice_number TEXT NOT NULL UNIQUE,
    client_id TEXT NOT NULL,
    client_name TEXT NOT NULL,
    project_id TEXT,
    project_name TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    issue_date INTEGER NOT NULL,
    due_date INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    subtotal REAL NOT NULL DEFAULT 0,
    tax_rate REAL DEFAULT 0,
    tax_amount REAL DEFAULT 0,
    discount_rate REAL DEFAULT 0,
    discount_amount REAL DEFAULT 0,
    total REAL NOT NULL DEFAULT 0,
    paid_amount REAL DEFAULT 0,
    notes TEXT,
    terms TEXT,
    line_items TEXT NOT NULL,
    pdf_url TEXT,
    stripe_invoice_id TEXT,
    paid_at INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_inv_client ON client_invoices(client_id);
  CREATE INDEX IF NOT EXISTS idx_inv_status ON client_invoices(status);
  CREATE INDEX IF NOT EXISTS idx_inv_number ON client_invoices(invoice_number);

  -- ── Project Profitability ──
  CREATE TABLE IF NOT EXISTS project_pnl (
    id TEXT PRIMARY KEY,
    workspace TEXT NOT NULL DEFAULT 'default',
    project_id TEXT NOT NULL,
    project_name TEXT NOT NULL,
    client_id TEXT,
    client_name TEXT,
    period_start INTEGER NOT NULL,
    period_end INTEGER NOT NULL,
    revenue REAL NOT NULL DEFAULT 0,
    cost_labor REAL NOT NULL DEFAULT 0,
    cost_media REAL NOT NULL DEFAULT 0,
    cost_tools REAL NOT NULL DEFAULT 0,
    cost_overhead REAL NOT NULL DEFAULT 0,
    cost_total REAL NOT NULL DEFAULT 0,
    gross_margin REAL NOT NULL DEFAULT 0,
    gross_margin_pct REAL NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'USD',
    metadata TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_pnl_project ON project_pnl(project_id);
  CREATE INDEX IF NOT EXISTS idx_pnl_client ON project_pnl(client_id);
  CREATE INDEX IF NOT EXISTS idx_pnl_period ON project_pnl(period_start, period_end);
`);

export function now() {
  return Date.now();
}

export function uid(prefix = "") {
  return prefix + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export const newId = uid;

export function json<T>(s: string | null | undefined, fallback: T): T {
  if (!s) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}
