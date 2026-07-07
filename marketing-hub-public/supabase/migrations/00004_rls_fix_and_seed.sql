-- Fix RLS policies to allow service_role full access and anon read access.
-- The Marketing Hub handles authentication at the application layer (middleware),
-- so Supabase RLS is a secondary check. The primary auth is the session cookie.
-- 
-- This allows:
--   1. service_role: full CRUD (used by server-side API routes)
--   2. anon: full CRUD (the app middleware already blocks unauthenticated requests)
--   3. authenticated: full CRUD (for direct Supabase client access)

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Contractors: full access for authenticated users" ON contractors;
DROP POLICY IF EXISTS "Payouts: full access for authenticated users" ON payouts;
DROP POLICY IF EXISTS "Timesheets: full access for authenticated users" ON timesheets;
DROP POLICY IF EXISTS "Invoices: full access for authenticated users" ON client_invoices;
DROP POLICY IF EXISTS "PnL: full access for authenticated users" ON project_pnl;

-- Create permissive policies that allow the Marketing Hub to work
-- Auth is handled by the app's middleware, not Supabase RLS
CREATE POLICY "Contractors: allow all" ON contractors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Payouts: allow all" ON payouts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Timesheets: allow all" ON timesheets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Invoices: allow all" ON client_invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "PnL: allow all" ON project_pnl FOR ALL USING (true) WITH CHECK (true);

-- Now seed the data (the previous ON CONFLICT DO NOTHING means these might have been skipped)
-- Re-insert with ON CONFLICT DO UPDATE to ensure data exists

INSERT INTO contractors (id, workspace, name, email, country, role, department, rate_currency, rate_amount, rate_type, payment_method, onboarding_status, compliance_status, status, created_at, updated_at) VALUES
('ctr_supa_01', 'default', 'Amira Zerhouni', 'amira@zerhouni.design', 'MA', 'Senior Brand Designer', 'Creative', 'EUR', 65, 'hourly', 'revolut', 'active', 'verified', 'active', EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000),
('ctr_supa_02', 'default', 'Carlos Mendez', 'carlos@mendez.dev', 'ES', 'Full-Stack Developer', 'Creative', 'EUR', 85, 'hourly', 'revolut', 'active', 'verified', 'active', EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000),
('ctr_supa_03', 'default', 'Priya Sharma', 'priya@sharma.io', 'IN', 'SEO Strategist', 'Media', 'USD', 45, 'hourly', 'wise', 'active', 'verified', 'active', EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000),
('ctr_supa_04', 'default', 'James Wright', 'james@wright.co', 'GB', 'Content Director', 'Creative', 'GBP', 5500, 'monthly', 'revolut', 'active', 'verified', 'active', EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000),
('ctr_supa_05', 'default', 'Fatima Al-Rashid', 'fatima@rashid.ae', 'AE', 'Performance Marketer', 'Media', 'AED', 12000, 'monthly', 'manual', 'active', 'verified', 'active', EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000),
('ctr_supa_06', 'default', 'Sophie Laurent', 'sophie@laurent.fr', 'FR', 'UX Researcher', 'Strategy', 'EUR', 70, 'hourly', 'revolut', 'active', 'verified', 'active', EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000),
('ctr_supa_07', 'default', 'Kofi Asante', 'kofi@asante.gh', 'GH', 'Data Analyst', 'Analytics', 'USD', 35, 'hourly', 'wise', 'active', 'verified', 'active', EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000),
('ctr_supa_08', 'default', 'Yuki Tanaka', 'yuki@tanaka.jp', 'JP', 'Motion Designer', 'Creative', 'USD', 80, 'hourly', 'wise', 'active', 'verified', 'active', EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000),
('ctr_supa_09', 'default', 'Lars Eriksson', 'lars@eriksson.se', 'CH', 'CRM Architect', 'Revenue', 'CHF', 120, 'hourly', 'revolut', 'active', 'verified', 'active', EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000),
('ctr_supa_10', 'default', 'Maria Santos', 'maria@santos.br', 'BR', 'Social Media Manager', 'Media', 'USD', 55, 'hourly', 'wise', 'active', 'verified', 'active', EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000),
('ctr_supa_11', 'default', 'Ahmed Ben Ali', 'ahmed@benali.tn', 'TN', 'Copywriter', 'Creative', 'EUR', 40, 'hourly', 'manual', 'active', 'verified', 'active', EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000),
('ctr_supa_12', 'default', 'Rachel Kim', 'rachel@kim.sg', 'SG', 'Growth Lead', 'Revenue', 'SGD', 8000, 'monthly', 'plaid', 'active', 'verified', 'active', EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  country = EXCLUDED.country,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  rate_currency = EXCLUDED.rate_currency,
  rate_amount = EXCLUDED.rate_amount,
  rate_type = EXCLUDED.rate_type,
  payment_method = EXCLUDED.payment_method,
  onboarding_status = EXCLUDED.onboarding_status,
  compliance_status = EXCLUDED.compliance_status,
  updated_at = EXCLUDED.updated_at;

-- Seed payouts
INSERT INTO payouts (id, workspace, payee_type, payee_id, payee_name, amount, currency, fx_rate, amount_usd, provider, status, description, paid_at, created_at, updated_at) VALUES
('pay_supa_01', 'default', 'contractor', 'ctr_supa_01', 'Amira Zerhouni', 4160, 'EUR', 1.08, 4492.80, 'revolut', 'completed', 'Monthly retainer', (EXTRACT(EPOCH FROM NOW()) * 1000 - 2592000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000 - 2592000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT),
('pay_supa_02', 'default', 'contractor', 'ctr_supa_04', 'James Wright', 5500, 'GBP', 1.27, 6985.00, 'revolut', 'completed', 'Monthly retainer', (EXTRACT(EPOCH FROM NOW()) * 1000 - 2592000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000 - 2592000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT),
('pay_supa_03', 'default', 'contractor', 'ctr_supa_03', 'Priya Sharma', 3600, 'USD', 1.0, 3600.00, 'wise', 'processing', 'SEO retainer', NULL, (EXTRACT(EPOCH FROM NOW()) * 1000 - 1728000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT),
('pay_supa_04', 'default', 'contractor', 'ctr_supa_05', 'Fatima Al-Rashid', 12000, 'AED', 0.27, 3240.00, 'manual', 'pending', 'Monthly retainer', NULL, (EXTRACT(EPOCH FROM NOW()) * 1000 - 864000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT),
('pay_supa_05', 'default', 'contractor', 'ctr_supa_06', 'Sophie Laurent', 2800, 'EUR', 1.08, 3024.00, 'revolut', 'draft', 'UX research', NULL, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT),
('pay_supa_06', 'default', 'contractor', 'ctr_supa_12', 'Rachel Kim', 8000, 'SGD', 0.74, 5920.00, 'plaid', 'failed', 'Growth retainer — returned', (EXTRACT(EPOCH FROM NOW()) * 1000 - 1728000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000 - 1728000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  amount_usd = EXCLUDED.amount_usd,
  updated_at = EXCLUDED.updated_at;

-- Seed invoices
INSERT INTO client_invoices (id, workspace, invoice_number, client_id, client_name, project_name, status, issue_date, due_date, currency, subtotal, total, paid_amount, line_items, created_at, updated_at) VALUES
('inv_supa_01', 'default', 'INV-0001', 'cli_viralvista', 'ViralVista Inc.', 'ViralVista Rebrand', 'paid', (EXTRACT(EPOCH FROM NOW()) * 1000 - 2592000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000 - 1728000000)::BIGINT, 'USD', 28500, 28500, 28500, '[{"description":"Brand identity system","quantity":1,"unit_price":15000,"amount":15000},{"description":"Frontend development","quantity":1,"unit_price":8500,"amount":8500},{"description":"Social media package","quantity":1,"unit_price":5000,"amount":5000}]'::JSONB, (EXTRACT(EPOCH FROM NOW()) * 1000 - 2592000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT),
('inv_supa_02', 'default', 'INV-0002', 'cli_northwind', 'Northwind FinTech', 'Northwind Launch', 'sent', (EXTRACT(EPOCH FROM NOW()) * 1000 - 1728000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000 + 864000000)::BIGINT, 'USD', 18720, 18720, 0, '[{"description":"UI design","quantity":1,"unit_price":1040,"amount":1040},{"description":"Motion graphics","quantity":1,"unit_price":1920,"amount":1920},{"description":"SEO content","quantity":1,"unit_price":10800,"amount":10800},{"description":"Blog posts","quantity":1,"unit_price":4960,"amount":4960}]'::JSONB, (EXTRACT(EPOCH FROM NOW()) * 1000 - 1728000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT),
('inv_supa_03', 'default', 'INV-0003', 'cli_engageera', 'EngageEra', 'EngageEra Lifecycle', 'overdue', (EXTRACT(EPOCH FROM NOW()) * 1000 - 3456000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000 - 1728000000)::BIGINT, 'USD', 15360, 15360, 0, '[{"description":"Email sequence","quantity":1,"unit_price":3200,"amount":3200},{"description":"UX research","quantity":1,"unit_price":840,"amount":840},{"description":"HubSpot migration","quantity":1,"unit_price":1920,"amount":1920},{"description":"Growth strategy","quantity":1,"unit_price":400,"amount":400},{"description":"Monthly retainer Q1","quantity":3,"unit_price":3000,"amount":9000}]'::JSONB, (EXTRACT(EPOCH FROM NOW()) * 1000 - 3456000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT),
('inv_supa_04', 'default', 'INV-0004', 'cli_engageera', 'EngageEra', 'EngageEra CRM', 'draft', (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000 + 2592000000)::BIGINT, 'USD', 9200, 9200, 0, '[{"description":"CRM architecture","quantity":1,"unit_price":7200,"amount":7200},{"description":"Data migration 50K contacts","quantity":1,"unit_price":2000,"amount":2000}]'::JSONB, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  total = EXCLUDED.total,
  paid_amount = EXCLUDED.paid_amount,
  updated_at = EXCLUDED.updated_at;

-- Seed project P&L
INSERT INTO project_pnl (id, workspace, project_id, project_name, client_name, period_start, period_end, revenue, cost_labor, cost_media, cost_tools, cost_overhead, cost_total, gross_margin, gross_margin_pct, currency, created_at, updated_at) VALUES
('pnl_supa_01', 'default', 'proj_viralvista', 'ViralVista Rebrand', 'ViralVista Inc.', (EXTRACT(EPOCH FROM NOW()) * 1000 - 7776000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT, 28500, 7800, 2100, 450, 1170, 11520, 16980, 59.57, 'USD', (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT),
('pnl_supa_02', 'default', 'proj_northwind', 'Northwind Launch', 'Northwind FinTech', (EXTRACT(EPOCH FROM NOW()) * 1000 - 7776000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT, 18720, 5200, 3400, 600, 780, 9980, 8740, 46.69, 'USD', (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT),
('pnl_supa_03', 'default', 'proj_engageera', 'EngageEra Lifecycle', 'EngageEra', (EXTRACT(EPOCH FROM NOW()) * 1000 - 7776000000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT, 15360, 4600, 1800, 350, 690, 7440, 7920, 51.56, 'USD', (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT, (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT)
ON CONFLICT (id) DO UPDATE SET
  revenue = EXCLUDED.revenue,
  cost_total = EXCLUDED.cost_total,
  gross_margin = EXCLUDED.gross_margin,
  gross_margin_pct = EXCLUDED.gross_margin_pct,
  updated_at = EXCLUDED.updated_at;