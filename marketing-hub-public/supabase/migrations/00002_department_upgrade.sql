-- ═══════════════════════════════════════════════════════════════════
-- Marketing Hub v4.0 — Department Upgrade Migration
-- Adds tables for 8-department agency operations + real-world data
-- ═══════════════════════════════════════════════════════════════════

-- ── Revenue Events (Finance department) ──
CREATE TABLE IF NOT EXISTS revenue_events (
  id TEXT PRIMARY KEY,
  deal_id TEXT,
  contact_id TEXT,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  kind TEXT NOT NULL,
  occurred_at BIGINT NOT NULL,
  notes TEXT,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- ── Daily KPIs (Analytics department) ──
CREATE TABLE IF NOT EXISTS daily_kpis (
  date TEXT PRIMARY KEY,
  cash_collected REAL DEFAULT 0,
  new_leads INTEGER DEFAULT 0,
  new_deals INTEGER DEFAULT 0,
  deals_won INTEGER DEFAULT 0,
  deals_lost INTEGER DEFAULT 0,
  mrr_added REAL DEFAULT 0,
  mrr_churned REAL DEFAULT 0,
  notes TEXT,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- ── Sales Sequences (Revenue department) ──
CREATE TABLE IF NOT EXISTS sales_sequences (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  steps TEXT,
  status TEXT DEFAULT 'draft',
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

CREATE TABLE IF NOT EXISTS sequence_enrollments (
  id TEXT PRIMARY KEY,
  sequence_id TEXT NOT NULL REFERENCES sales_sequences(id) ON DELETE CASCADE,
  contact_id TEXT NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active',
  current_step INTEGER DEFAULT 0,
  enrolled_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  last_step_at BIGINT,
  completed_at BIGINT
);

-- ── Agency Clients (Revenue department) ──
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT,
  size TEXT,
  arr REAL DEFAULT 0,
  status TEXT DEFAULT 'active',
  owner TEXT,
  start_date BIGINT,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- ── Team / Employees (Operations department) ──
CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  title TEXT,
  role TEXT,
  status TEXT DEFAULT 'active',
  hire_date BIGINT,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- ── Finance (Operations department) ──
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  amount REAL NOT NULL,
  description TEXT,
  date BIGINT NOT NULL,
  approved_by TEXT,
  status TEXT DEFAULT 'pending',
  receipt_url TEXT,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

CREATE TABLE IF NOT EXISTS billing_events (
  id TEXT PRIMARY KEY,
  client_id TEXT,
  amount REAL NOT NULL,
  kind TEXT NOT NULL,
  description TEXT,
  occurred_at BIGINT NOT NULL,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

CREATE TABLE IF NOT EXISTS billing_invoices (
  id TEXT PRIMARY KEY,
  client_id TEXT,
  amount REAL NOT NULL,
  status TEXT DEFAULT 'draft',
  due_date BIGINT,
  paid_at BIGINT,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

CREATE TABLE IF NOT EXISTS billing_subscriptions (
  id TEXT PRIMARY KEY,
  client_id TEXT,
  plan TEXT NOT NULL,
  amount REAL NOT NULL,
  interval TEXT DEFAULT 'monthly',
  status TEXT DEFAULT 'active',
  started_at BIGINT NOT NULL,
  cancelled_at BIGINT,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- ── Journal Entries (Finance department) ──
CREATE TABLE IF NOT EXISTS journal_entries (
  id TEXT PRIMARY KEY,
  date BIGINT NOT NULL,
  description TEXT NOT NULL,
  reference TEXT,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

CREATE TABLE IF NOT EXISTS journal_lines (
  id TEXT PRIMARY KEY,
  entry_id TEXT NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
  account TEXT NOT NULL,
  debit REAL DEFAULT 0,
  credit REAL DEFAULT 0,
  description TEXT
);

-- ── Chart of Accounts (Finance department) ──
CREATE TABLE IF NOT EXISTS chart_of_accounts (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  parent_id TEXT,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- ── Payroll (Operations department) ──
CREATE TABLE IF NOT EXISTS payroll_runs (
  id TEXT PRIMARY KEY,
  period TEXT NOT NULL,
  total_gross REAL NOT NULL,
  total_tax REAL NOT NULL,
  total_net REAL NOT NULL,
  status TEXT DEFAULT 'draft',
  run_date BIGINT NOT NULL,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

CREATE TABLE IF NOT EXISTS payroll_lines (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL REFERENCES payroll_runs(id) ON DELETE CASCADE,
  employee_id TEXT NOT NULL,
  gross REAL NOT NULL,
  tax REAL DEFAULT 0,
  net REAL NOT NULL,
  deductions TEXT
);

-- ── Taxes (Operations department) ──
CREATE TABLE IF NOT EXISTS tax_codes (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  rate REAL NOT NULL,
  region TEXT
);

CREATE TABLE IF NOT EXISTS tax_filings (
  id TEXT PRIMARY KEY,
  period TEXT NOT NULL,
  jurisdiction TEXT NOT NULL,
  amount REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  filed_at BIGINT,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- ── FX Rates (Finance department) ──
CREATE TABLE IF NOT EXISTS fx_rates (
  id TEXT PRIMARY KEY,
  base TEXT NOT NULL,
  quote TEXT NOT NULL,
  rate REAL NOT NULL,
  source TEXT,
  timestamp BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS fx_alerts (
  id TEXT PRIMARY KEY,
  pair TEXT NOT NULL,
  threshold REAL NOT NULL,
  direction TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  triggered_at BIGINT,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- ── Market Quotes (Analytics department) ──
CREATE TABLE IF NOT EXISTS market_quotes (
  id TEXT PRIMARY KEY,
  symbol TEXT NOT NULL,
  price REAL NOT NULL,
  change_pct REAL DEFAULT 0,
  volume REAL DEFAULT 0,
  timestamp BIGINT NOT NULL
);

-- ── Marketer Profiles (Marketplace) ──
CREATE TABLE IF NOT EXISTS marketer_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  headline TEXT,
  bio TEXT,
  skills TEXT,
  hourly_rate REAL,
  availability TEXT DEFAULT 'available',
  rating REAL DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

CREATE TABLE IF NOT EXISTS marketer_engagements (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  marketer_id TEXT NOT NULL,
  service TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  start_date BIGINT NOT NULL,
  end_date BIGINT,
  rate REAL,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

CREATE TABLE IF NOT EXISTS marketer_reviews (
  id TEXT PRIMARY KEY,
  engagement_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- ── Marketing Leads (from BAZ site) ──
CREATE TABLE IF NOT EXISTS marketing_leads (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT,
  source TEXT,
  service TEXT,
  budget TEXT,
  score INTEGER DEFAULT 0,
  intent TEXT,
  status TEXT DEFAULT 'new',
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- ── Nova History (Knowledge department) ──
CREATE TABLE IF NOT EXISTS nova_history (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT,
  sources TEXT,
  confidence REAL,
  model TEXT,
  tokens_used INTEGER DEFAULT 0,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- ── Orchestrator (Knowledge department) ──
CREATE TABLE IF NOT EXISTS orchestrator_tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  agent_id TEXT,
  result TEXT,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

CREATE TABLE IF NOT EXISTS orchestrator_campaigns (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  progress REAL DEFAULT 0,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

CREATE TABLE IF NOT EXISTS orchestrator_milestones (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL,
  name TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at BIGINT,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- ── Presence (real-time) ──
CREATE TABLE IF NOT EXISTS presence (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  status TEXT DEFAULT 'online',
  last_seen BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- ── Password Reset ──
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at BIGINT NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- ── Two-Factor Auth ──
CREATE TABLE IF NOT EXISTS two_fa_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  expires_at BIGINT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- ── Workspace ──
CREATE TABLE IF NOT EXISTS workspaces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free',
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

CREATE TABLE IF NOT EXISTS workspace_members (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

CREATE TABLE IF NOT EXISTS workspace_invites (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'member',
  token TEXT UNIQUE NOT NULL,
  accepted BOOLEAN DEFAULT FALSE,
  expires_at BIGINT NOT NULL,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

CREATE TABLE IF NOT EXISTS workspace_domains (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  domain TEXT UNIQUE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- ═══════════════════════════════════════════════════════════════════
-- INDEXES for production performance
-- ═══════════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts(company);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_score ON contacts(score);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);
CREATE INDEX IF NOT EXISTS idx_deals_company ON deals(company_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_content_type ON content(type);
CREATE INDEX IF NOT EXISTS idx_content_status ON content(status);
CREATE INDEX IF NOT EXISTS idx_daily_kpis_date ON daily_kpis(date);
CREATE INDEX IF NOT EXISTS idx_revenue_events_kind ON revenue_events(kind);
CREATE INDEX IF NOT EXISTS idx_revenue_events_occurred ON revenue_events(occurred_at);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_marketing_leads_score ON marketing_leads(score);
CREATE INDEX IF NOT EXISTS idx_marketing_leads_status ON marketing_leads(status);
CREATE INDEX IF NOT EXISTS idx_nova_history_created ON nova_history(created_at);
CREATE INDEX IF NOT EXISTS idx_conversations_channel ON conversations(channel);
CREATE INDEX IF NOT EXISTS idx_activities_entity ON activities(entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_budget_items_period ON budget_items(period);
CREATE INDEX IF NOT EXISTS idx_experiments_status ON experiments(status);

-- ═══════════════════════════════════════════════════════════════════
-- RLS Policies — enable row-level security for production
-- ═══════════════════════════════════════════════════════════════════
-- Enable RLS on all tables
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_magnets ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE sequence_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE nova_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE orchestrator_tasks ENABLE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY "Service role full access" ON contacts FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON companies FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON deals FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON campaigns FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON daily_kpis FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON revenue_events FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON marketing_leads FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Authenticated users can read all tables
CREATE POLICY "Authenticated read" ON contacts FOR SELECT USING (auth.role() IN ('authenticated', 'service_role'));
CREATE POLICY "Authenticated read" ON companies FOR SELECT USING (auth.role() IN ('authenticated', 'service_role'));
CREATE POLICY "Authenticated read" ON deals FOR SELECT USING (auth.role() IN ('authenticated', 'service_role'));
CREATE POLICY "Authenticated read" ON campaigns FOR SELECT USING (auth.role() IN ('authenticated', 'service_role'));
CREATE POLICY "Authenticated read" ON daily_kpis FOR SELECT USING (auth.role() IN ('authenticated', 'service_role'));
CREATE POLICY "Authenticated read" on revenue_events FOR SELECT USING (auth.role() IN ('authenticated', 'service_role'));

-- Marketing leads can be inserted by anon (from BAZ site)
CREATE POLICY "Anon insert leads" ON marketing_leads FOR INSERT WITH CHECK (true);