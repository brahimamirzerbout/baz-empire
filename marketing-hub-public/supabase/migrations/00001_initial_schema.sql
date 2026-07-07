-- ROI Marketing Hub — Initial Schema (SQLite → PostgreSQL migration)
-- This creates all tables from the SQLite database in PostgreSQL

-- Users & Auth
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at BIGINT NOT NULL,
  created_at BIGINT NOT NULL
);

-- CRM
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  title TEXT,
  status TEXT DEFAULT 'lead',
  source TEXT,
  tags TEXT,
  notes TEXT,
  sentiment REAL DEFAULT 0.1,
  last_touch_at BIGINT,
  score INTEGER DEFAULT 0,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  workspace_id TEXT DEFAULT 'default'
);

CREATE TABLE IF NOT EXISTS companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT,
  industry TEXT,
  size TEXT,
  notes TEXT,
  created_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS deals (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  value REAL DEFAULT 0,
  value_collected REAL DEFAULT 0,
  cost_to_acquire REAL DEFAULT 0,
  source TEXT,
  stage TEXT DEFAULT 'lead',
  probability INTEGER DEFAULT 10,
  contact_id TEXT,
  company_id TEXT,
  owner TEXT,
  close_date BIGINT,
  won_at BIGINT,
  lost_at BIGINT,
  lost_reason TEXT,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  workspace_id TEXT DEFAULT 'default'
);

CREATE TABLE IF NOT EXISTS touchpoints (
  id TEXT PRIMARY KEY,
  deal_id TEXT,
  contact_id TEXT,
  channel TEXT NOT NULL,
  campaign_id TEXT,
  asset TEXT,
  occurred_at BIGINT NOT NULL,
  attribution_weight REAL DEFAULT 1.0,
  created_at BIGINT NOT NULL
);

-- Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  budget REAL DEFAULT 0,
  spent REAL DEFAULT 0,
  channels TEXT,
  start_date BIGINT,
  end_date BIGINT,
  goal TEXT,
  metrics TEXT,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  workspace_id TEXT DEFAULT 'default'
);

CREATE TABLE IF NOT EXISTS content (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  channel TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  scheduled_for BIGINT,
  campaign_id TEXT,
  hashtags TEXT,
  media_urls TEXT,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  workspace_id TEXT DEFAULT 'default'
);

CREATE TABLE IF NOT EXISTS emails (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  preheader TEXT,
  from_name TEXT,
  from_email TEXT,
  body_html TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  list_id TEXT,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  workspace_id TEXT DEFAULT 'default'
);

CREATE TABLE IF NOT EXISTS revenue_events (
  id TEXT PRIMARY KEY,
  deal_id TEXT,
  contact_id TEXT,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  kind TEXT NOT NULL,
  occurred_at BIGINT NOT NULL,
  notes TEXT,
  created_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_role TEXT,
  author_company TEXT,
  author_avatar TEXT,
  rating INTEGER DEFAULT 5,
  body TEXT NOT NULL,
  source TEXT,
  url TEXT,
  featured INTEGER DEFAULT 0,
  tags TEXT,
  created_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  done INTEGER DEFAULT 0,
  status TEXT DEFAULT 'open',
  priority TEXT DEFAULT 'medium',
  due_date BIGINT,
  project TEXT,
  notes TEXT,
  updated_at BIGINT,
  created_at BIGINT NOT NULL,
  workspace_id TEXT DEFAULT 'default'
);

CREATE TABLE IF NOT EXISTS automations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  trigger TEXT NOT NULL,
  action TEXT NOT NULL,
  config TEXT,
  active INTEGER DEFAULT 1,
  runs INTEGER DEFAULT 0,
  last_run BIGINT,
  created_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS competitors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT,
  description TEXT,
  positioning TEXT,
  strengths TEXT,
  weaknesses TEXT,
  pricing_model TEXT,
  pricing_low REAL,
  pricing_high REAL,
  market_share REAL,
  channels TEXT,
  notes TEXT,
  swot TEXT,
  last_tracked BIGINT,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  workspace_id TEXT DEFAULT 'default'
);

CREATE TABLE IF NOT EXISTS wire_articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT,
  source TEXT,
  author TEXT,
  published_at BIGINT,
  category TEXT,
  summary TEXT,
  nova_take TEXT,
  relevance INTEGER,
  is_featured INTEGER DEFAULT 0,
  is_read INTEGER DEFAULT 0,
  is_saved INTEGER DEFAULT 0,
  linked_idea_id TEXT,
  created_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS forms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  fields TEXT NOT NULL,
  submit_button TEXT DEFAULT 'Submit',
  success_message TEXT DEFAULT 'Thanks',
  notify_email TEXT,
  tags TEXT,
  leads_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  workspace_id TEXT DEFAULT 'default'
);

CREATE TABLE IF NOT EXISTS form_submissions (
  id TEXT PRIMARY KEY,
  form_id TEXT NOT NULL,
  contact_id TEXT,
  payload TEXT NOT NULL,
  contact_email TEXT,
  contact_name TEXT,
  source TEXT,
  ip TEXT,
  created_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Workspace
CREATE TABLE IF NOT EXISTS workspaces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id TEXT,
  plan TEXT DEFAULT 'free',
  status TEXT DEFAULT 'active',
  brand_color TEXT DEFAULT '#888888',
  settings TEXT,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS workspace_members (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT DEFAULT 'editor',
  created_at BIGINT NOT NULL,
  UNIQUE(workspace_id, user_id)
);

-- Seed default workspace
INSERT INTO workspaces (id, name, slug, plan, status, brand_color, created_at, updated_at)
VALUES ('default', 'ROI Marketing', 'default', 'pro', 'active', '#888888', 1, 1)
ON CONFLICT (id) DO NOTHING;

-- Seed admin user (password: bazempire2026)
INSERT INTO users (id, email, name, password_hash, created_at)
VALUES ('u_admin', 'admin@roi.marketing', 'BAZ Admin', '$2a$10$placeholder', 1)
ON CONFLICT (id) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_contacts_workspace ON contacts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_deals_workspace ON deals(workspace_id);
CREATE INDEX IF NOT EXISTS idx_touchpoints_deal ON touchpoints(deal_id);
CREATE INDEX IF NOT EXISTS idx_wire_published ON wire_articles(published_at);
CREATE INDEX IF NOT EXISTS idx_revenue_occurred ON revenue_events(occurred_at);
