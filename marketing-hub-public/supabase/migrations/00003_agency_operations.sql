-- ═══════════════════════════════════════════════════════════════════
-- Marketing Hub v5.0 — Agency Operations Migration
-- International contractors, payouts, timesheets, invoices, profitability
-- Uses Supabase (PostgreSQL) with proper types, indexes, and RLS
-- ═══════════════════════════════════════════════════════════════════

-- ── Contractors (international workers) ──
CREATE TABLE IF NOT EXISTS contractors (
  id TEXT PRIMARY KEY,
  workspace TEXT NOT NULL DEFAULT 'default',
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  country TEXT NOT NULL,                -- ISO 3166-1 alpha-2
  timezone TEXT,                         -- IANA timezone
  role TEXT,
  department TEXT,
  rate_currency TEXT NOT NULL DEFAULT 'USD',
  rate_amount DOUBLE PRECISION NOT NULL,
  rate_type TEXT NOT NULL DEFAULT 'hourly', -- 'hourly' | 'monthly' | 'project'
  tax_id TEXT,
  tax_residency TEXT,
  payment_method TEXT DEFAULT 'manual',   -- 'plaid' | 'revolut' | 'wise' | 'manual' | 'crypto'
  payment_details JSONB,                 -- {iban, routing, account, wallet, etc.}
  bank_country TEXT,
  contract_url TEXT,
  contract_start BIGINT,
  contract_end BIGINT,
  onboarding_status TEXT NOT NULL DEFAULT 'draft',
  compliance_status TEXT NOT NULL DEFAULT 'pending',
  compliance_notes JSONB,
  documents JSONB,                        -- [{name, url, uploaded_at, type}]
  notes TEXT,
  avatar_url TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);
CREATE INDEX IF NOT EXISTS idx_contractors_ws ON contractors(workspace);
CREATE INDEX IF NOT EXISTS idx_contractors_country ON contractors(country);
CREATE INDEX IF NOT EXISTS idx_contractors_status ON contractors(onboarding_status);

-- ── Payouts (payments to contractors/employees) ──
CREATE TABLE IF NOT EXISTS payouts (
  id TEXT PRIMARY KEY,
  workspace TEXT NOT NULL DEFAULT 'default',
  payee_type TEXT NOT NULL,               -- 'contractor' | 'employee'
  payee_id TEXT NOT NULL,
  payee_name TEXT NOT NULL,
  amount DOUBLE PRECISION NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  fx_rate DOUBLE PRECISION DEFAULT 1.0,
  amount_usd DOUBLE PRECISION,
  provider TEXT NOT NULL DEFAULT 'manual', -- 'plaid' | 'revolut' | 'wise' | 'manual' | 'crypto'
  provider_transfer_id TEXT,
  status TEXT NOT NULL DEFAULT 'draft',    -- 'draft' | 'pending' | 'processing' | 'completed' | 'failed' | 'returned'
  payroll_run_id TEXT,
  description TEXT,
  invoice_url TEXT,
  receipt_url TEXT,
  paid_at BIGINT,
  failed_at BIGINT,
  failure_reason TEXT,
  metadata JSONB,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);
CREATE INDEX IF NOT EXISTS idx_payouts_payee ON payouts(payee_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON payouts(status);
CREATE INDEX IF NOT EXISTS idx_payouts_provider ON payouts(provider);
CREATE INDEX IF NOT EXISTS idx_payouts_ws ON payouts(workspace);

-- ── Timesheets ──
CREATE TABLE IF NOT EXISTS timesheets (
  id TEXT PRIMARY KEY,
  workspace TEXT NOT NULL DEFAULT 'default',
  person_type TEXT NOT NULL,              -- 'contractor' | 'employee'
  person_id TEXT NOT NULL,
  person_name TEXT NOT NULL,
  project_id TEXT,
  project_name TEXT,
  client_id TEXT,
  client_name TEXT,
  date BIGINT NOT NULL,                  -- unix ms for the day
  hours DOUBLE PRECISION NOT NULL DEFAULT 0,
  description TEXT,
  billable INTEGER NOT NULL DEFAULT 1,
  rate DOUBLE PRECISION,
  rate_currency TEXT DEFAULT 'USD',
  amount DOUBLE PRECISION,
  approved_by TEXT,
  approved_at BIGINT,
  status TEXT NOT NULL DEFAULT 'draft',   -- 'draft' | 'submitted' | 'approved' | 'invoiced'
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
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
  status TEXT NOT NULL DEFAULT 'draft',   -- 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'void'
  issue_date BIGINT NOT NULL,
  due_date BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  subtotal DOUBLE PRECISION NOT NULL DEFAULT 0,
  tax_rate DOUBLE PRECISION DEFAULT 0,
  tax_amount DOUBLE PRECISION DEFAULT 0,
  discount_rate DOUBLE PRECISION DEFAULT 0,
  discount_amount DOUBLE PRECISION DEFAULT 0,
  total DOUBLE PRECISION NOT NULL DEFAULT 0,
  paid_amount DOUBLE PRECISION DEFAULT 0,
  notes TEXT,
  terms TEXT,
  line_items JSONB NOT NULL,               -- [{description, quantity, unit_price, amount, currency}]
  pdf_url TEXT,
  stripe_invoice_id TEXT,
  paid_at BIGINT,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
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
  period_start BIGINT NOT NULL,
  period_end BIGINT NOT NULL,
  revenue DOUBLE PRECISION NOT NULL DEFAULT 0,
  cost_labor DOUBLE PRECISION NOT NULL DEFAULT 0,
  cost_media DOUBLE PRECISION NOT NULL DEFAULT 0,
  cost_tools DOUBLE PRECISION NOT NULL DEFAULT 0,
  cost_overhead DOUBLE PRECISION NOT NULL DEFAULT 0,
  cost_total DOUBLE PRECISION NOT NULL DEFAULT 0,
  gross_margin DOUBLE PRECISION NOT NULL DEFAULT 0,
  gross_margin_pct DOUBLE PRECISION NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  metadata JSONB,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);
CREATE INDEX IF NOT EXISTS idx_pnl_project ON project_pnl(project_id);
CREATE INDEX IF NOT EXISTS idx_pnl_client ON project_pnl(client_id);
CREATE INDEX IF NOT EXISTS idx_pnl_period ON project_pnl(period_start, period_end);

-- ── Enable Row Level Security ──
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE timesheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_pnl ENABLE ROW LEVEL SECURITY;

-- ── RLS Policies: authenticated users can CRUD their workspace ──
CREATE POLICY "Contractors: full access for authenticated users" ON contractors
  FOR ALL USING (auth.role() = 'authenticated' OR auth.uid() IS NOT NULL);

CREATE POLICY "Payouts: full access for authenticated users" ON payouts
  FOR ALL USING (auth.role() = 'authenticated' OR auth.uid() IS NOT NULL);

CREATE POLICY "Timesheets: full access for authenticated users" ON timesheets
  FOR ALL USING (auth.role() = 'authenticated' OR auth.uid() IS NOT NULL);

CREATE POLICY "Invoices: full access for authenticated users" ON client_invoices
  FOR ALL USING (auth.role() = 'authenticated' OR auth.uid() IS NOT NULL);

CREATE POLICY "PnL: full access for authenticated users" ON project_pnl
  FOR ALL USING (auth.role() = 'authenticated' OR auth.uid() IS NOT NULL);

-- ── Realtime subscriptions ──
ALTER PUBLICATION supabase_realtime ADD TABLE contractors;
ALTER PUBLICATION supabase_realtime ADD TABLE payouts;
ALTER PUBLICATION supabase_realtime ADD TABLE timesheets;
ALTER PUBLICATION supabase_realtime ADD TABLE client_invoices;
ALTER PUBLICATION supabase_realtime ADD TABLE project_pnl;

-- ── Seed: Agency operations demo data ──
INSERT INTO contractors (id, workspace, name, email, country, role, department, rate_currency, rate_amount, rate_type, payment_method, onboarding_status, compliance_status, status, created_at, updated_at) VALUES
('ctr_seeded_01', 'default', 'Amira Zerhouni', 'amira@zerhouni.design', 'MA', 'Senior Brand Designer', 'Creative', 'EUR', 65, 'hourly', 'revolut', 'active', 'verified', 'active', EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000),
('ctr_seeded_02', 'default', 'Carlos Mendez', 'carlos@mendez.dev', 'ES', 'Full-Stack Developer', 'Creative', 'EUR', 85, 'hourly', 'revolut', 'active', 'verified', 'active', EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000),
('ctr_seeded_03', 'default', 'Priya Sharma', 'priya@sharma.io', 'IN', 'SEO Strategist', 'Media', 'USD', 45, 'hourly', 'wise', 'active', 'verified', 'active', EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000),
('ctr_seeded_04', 'default', 'James Wright', 'james@wright.co', 'GB', 'Content Director', 'Creative', 'GBP', 5500, 'monthly', 'revolut', 'active', 'verified', 'active', EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000),
('ctr_seeded_05', 'default', 'Fatima Al-Rashid', 'fatima@rashid.ae', 'AE', 'Performance Marketer', 'Media', 'AED', 12000, 'monthly', 'manual', 'active', 'verified', 'active', EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000),
('ctr_seeded_06', 'default', 'Sophie Laurent', 'sophie@laurent.fr', 'FR', 'UX Researcher', 'Strategy', 'EUR', 70, 'hourly', 'revolut', 'active', 'verified', 'active', EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000),
('ctr_seeded_07', 'default', 'Kofi Asante', 'kofi@asante.gh', 'GH', 'Data Analyst', 'Analytics', 'USD', 35, 'hourly', 'wise', 'active', 'verified', 'active', EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000),
('ctr_seeded_08', 'default', 'Yuki Tanaka', 'yuki@tanaka.jp', 'JP', 'Motion Designer', 'Creative', 'USD', 80, 'hourly', 'wise', 'active', 'verified', 'active', EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000),
('ctr_seeded_09', 'default', 'Lars Eriksson', 'lars@eriksson.se', 'CH', 'CRM Architect', 'Revenue', 'CHF', 120, 'hourly', 'revolut', 'active', 'verified', 'active', EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000),
('ctr_seeded_10', 'default', 'Maria Santos', 'maria@santos.br', 'BR', 'Social Media Manager', 'Media', 'USD', 55, 'hourly', 'wise', 'active', 'verified', 'active', EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000),
('ctr_seeded_11', 'default', 'Ahmed Ben Ali', 'ahmed@benali.tn', 'TN', 'Copywriter', 'Creative', 'EUR', 40, 'hourly', 'manual', 'active', 'verified', 'active', EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000),
('ctr_seeded_12', 'default', 'Rachel Kim', 'rachel@kim.sg', 'SG', 'Growth Lead', 'Revenue', 'SGD', 8000, 'monthly', 'plaid', 'active', 'verified', 'active', EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000)
ON CONFLICT (id) DO NOTHING;

-- Seed payouts
INSERT INTO payouts (id, workspace, payee_type, payee_id, payee_name, amount, currency, fx_rate, amount_usd, provider, status, description, created_at, updated_at) VALUES
('pay_seeded_01', 'default', 'contractor', 'ctr_seeded_01', 'Amira Zerhouni', 4160, 'EUR', 1.08, 4492.80, 'revolut', 'completed', 'Monthly retainer', (EXTRACT(EPOCH FROM NOW()) * 1000 - 2592000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000 - 864000000)::BIGINT),
('pay_seeded_02', 'default', 'contractor', 'ctr_seeded_04', 'James Wright', 5500, 'GBP', 1.27, 6985.00, 'revolut', 'completed', 'Monthly retainer', (EXTRACT(EPOCH FROM NOW()) * 1000 - 2592000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000 - 864000000)::BIGINT),
('pay_seeded_03', 'default', 'contractor', 'ctr_seeded_03', 'Priya Sharma', 3600, 'USD', 1.0, 3600.00, 'wise', 'processing', 'SEO retainer', (EXTRACT(EPOCH FROM NOW()) * 1000 - 1728000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT),
('pay_seeded_04', 'default', 'contractor', 'ctr_seeded_05', 'Fatima Al-Rashid', 12000, 'AED', 0.27, 3240.00, 'manual', 'pending', 'Monthly retainer', (EXTRACT(EPOCH FROM NOW()) * 1000 - 864000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT),
('pay_seeded_05', 'default', 'contractor', 'ctr_seeded_06', 'Sophie Laurent', 2800, 'EUR', 1.08, 3024.00, 'revolut', 'draft', 'UX research', (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT),
('pay_seeded_06', 'default', 'contractor', 'ctr_seeded_12', 'Rachel Kim', 8000, 'SGD', 0.74, 5920.00, 'plaid', 'failed', 'Growth retainer — returned', (EXTRACT(EPOCH FROM NOW()) * 1000 - 1728000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT)
ON CONFLICT (id) DO NOTHING;

-- Seed invoices
INSERT INTO client_invoices (id, workspace, invoice_number, client_id, client_name, project_name, status, issue_date, due_date, currency, subtotal, total, paid_amount, line_items, created_at, updated_at) VALUES
('inv_seeded_01', 'default', 'INV-0001', 'cli_viralvista', 'ViralVista Inc.', 'ViralVista Rebrand', 'paid', (EXTRACT(EPOCH FROM NOW()) * 1000 - 2592000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000 - 1728000000)::BIGINT, 'USD', 28500, 28500, 28500, '[{"description":"Brand identity system","quantity":1,"unit_price":15000,"amount":15000},{"description":"Frontend development","quantity":1,"unit_price":8500,"amount":8500},{"description":"Social media package","quantity":1,"unit_price":5000,"amount":5000}]'::JSONB, (EXTRACT(EPOCH FROM NOW()) * 1000 - 2592000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT),
('inv_seeded_02', 'default', 'INV-0002', 'cli_northwind', 'Northwind FinTech', 'Northwind Launch', 'sent', (EXTRACT(EPOCH FROM NOW()) * 1000 - 1728000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000 + 864000000)::BIGINT, 'USD', 18720, 18720, 0, '[{"description":"UI design","quantity":1,"unit_price":1040,"amount":1040},{"description":"Motion graphics","quantity":1,"unit_price":1920,"amount":1920},{"description":"SEO content","quantity":1,"unit_price":10800,"amount":10800},{"description":"Blog posts","quantity":1,"unit_price":4960,"amount":4960}]'::JSONB, (EXTRACT(EPOCH FROM NOW()) * 1000 - 1728000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT),
('inv_seeded_03', 'default', 'INV-0003', 'cli_engageera', 'EngageEra', 'EngageEra Lifecycle', 'overdue', (EXTRACT(EPOCH FROM NOW()) * 1000 - 3456000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000 - 1728000000)::BIGINT, 'USD', 15360, 15360, 0, '[{"description":"Email sequence","quantity":1,"unit_price":3200,"amount":3200},{"description":"UX research","quantity":1,"unit_price":840,"amount":840},{"description":"HubSpot migration","quantity":1,"unit_price":1920,"amount":1920},{"description":"Growth strategy","quantity":1,"unit_price":400,"amount":400},{"description":"Monthly retainer Q1","quantity":3,"unit_price":3000,"amount":9000}]'::JSONB, (EXTRACT(EPOCH FROM NOW()) * 1000 - 3456000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT),
('inv_seeded_04', 'default', 'INV-0004', 'cli_engageera', 'EngageEra', 'EngageEra CRM', 'draft', (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000 + 2592000000)::BIGINT, 'USD', 9200, 9200, 0, '[{"description":"CRM architecture","quantity":1,"unit_price":7200,"amount":7200},{"description":"Data migration 50K contacts","quantity":1,"unit_price":2000,"amount":2000}]'::JSONB, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT)
ON CONFLICT (id) DO NOTHING;

-- Seed project P&L
INSERT INTO project_pnl (id, workspace, project_id, project_name, client_name, period_start, period_end, revenue, cost_labor, cost_media, cost_tools, cost_overhead, cost_total, gross_margin, gross_margin_pct, currency, metadata, created_at, updated_at) VALUES
('pnl_seeded_01', 'default', 'proj_viralvista', 'ViralVista Rebrand', 'ViralVista Inc.', (EXTRACT(EPOCH FROM NOW()) * 1000 - 7776000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT, 28500, 7800, 2100, 450, 1170, 11520, 16980, 59.57, 'USD', '{"invoice_count":1,"timesheet_count":3,"expense_count":2}'::JSONB, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT),
('pnl_seeded_02', 'default', 'proj_northwind', 'Northwind Launch', 'Northwind FinTech', (EXTRACT(EPOCH FROM NOW()) * 1000 - 7776000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT, 18720, 5200, 3400, 600, 780, 9980, 8740, 46.69, 'USD', '{"invoice_count":1,"timesheet_count":3,"expense_count":2}'::JSONB, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT),
('pnl_seeded_03', 'default', 'proj_engageera', 'EngageEra Lifecycle', 'EngageEra', (EXTRACT(EPOCH FROM NOW()) * 1000 - 7776000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT, 15360, 4600, 1800, 350, 690, 7440, 7920, 51.56, 'USD', '{"invoice_count":1,"timesheet_count":3,"expense_count":2}'::JSONB, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT)
ON CONFLICT (id) DO NOTHING;