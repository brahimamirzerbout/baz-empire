/**
 * Contractors — International worker management.
 *
 * Handles onboarding, compliance, payment setup, and document tracking
 * for contractors across 40+ countries. Integrates with Plaid (US ACH)
 * and Revolut (SEPA, SWIFT, multi-currency) for payouts.
 */

import { db, uid, now } from "@/lib/db";

export type OnboardingStatus = "draft" | "invited" | "contract_sent" | "signed" | "active" | "offboarded";
export type ComplianceStatus = "pending" | "verified" | "flagged" | "rejected";
export type PaymentMethod = "plaid" | "revolut" | "wise" | "manual" | "crypto";
export type RateType = "hourly" | "monthly" | "project";

export interface Contractor {
  id: string;
  workspace: string;
  name: string;
  email: string | null;
  phone: string | null;
  country: string;
  timezone: string | null;
  role: string | null;
  department: string | null;
  rate_currency: string;
  rate_amount: number;
  rate_type: RateType;
  tax_id: string | null;
  tax_residency: string | null;
  payment_method: PaymentMethod;
  payment_details: string | null; // JSON
  bank_country: string | null;
  contract_url: string | null;
  contract_start: number | null;
  contract_end: number | null;
  onboarding_status: OnboardingStatus;
  compliance_status: ComplianceStatus;
  compliance_notes: string | null;
  documents: string | null; // JSON
  notes: string | null;
  avatar_url: string | null;
  status: string;
  created_at: number;
  updated_at: number;
}

export function listContractors(workspace = "default"): Contractor[] {
  return db
    .prepare(`SELECT * FROM contractors WHERE workspace = ? ORDER BY name`)
    .all(workspace) as Contractor[];
}

export function getContractor(id: string): Contractor | undefined {
  return db.prepare(`SELECT * FROM contractors WHERE id = ?`).get(id) as Contractor | undefined;
}

export function createContractor(input: Partial<Contractor> & { name: string; country: string; rate_amount: number }): string {
  const id = uid("ctr_");
  db.prepare(`
    INSERT INTO contractors (id, workspace, name, email, phone, country, timezone, role, department,
      rate_currency, rate_amount, rate_type, tax_id, tax_residency, payment_method, payment_details,
      bank_country, contract_url, contract_start, contract_end, onboarding_status, compliance_status,
      compliance_notes, documents, notes, avatar_url, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    input.workspace || "default",
    input.name,
    input.email || null,
    input.phone || null,
    input.country,
    input.timezone || null,
    input.role || null,
    input.department || null,
    input.rate_currency || "USD",
    input.rate_amount,
    input.rate_type || "hourly",
    input.tax_id || null,
    input.tax_residency || input.country || null,
    input.payment_method || "manual",
    input.payment_details || null,
    input.bank_country || input.country || null,
    input.contract_url || null,
    input.contract_start || null,
    input.contract_end || null,
    input.onboarding_status || "draft",
    input.compliance_status || "pending",
    input.compliance_notes || null,
    input.documents || null,
    input.notes || null,
    input.avatar_url || null,
    "active",
    now(),
    now(),
  );
  return id;
}

export function updateContractor(id: string, updates: Partial<Contractor>): boolean {
  const fields: string[] = [];
  const values: unknown[] = [];
  for (const [k, v] of Object.entries(updates)) {
    if (k === "id" || k === "created_at") continue;
    fields.push(`${k} = ?`);
    values.push(v);
  }
  if (fields.length === 0) return false;
  fields.push("updated_at = ?");
  values.push(now());
  values.push(id);
  db.prepare(`UPDATE contractors SET ${fields.join(", ")} WHERE id = ?`).run(...values);
  return true;
}

export function deleteContractor(id: string): boolean {
  return db.prepare(`UPDATE contractors SET status = 'archived', updated_at = ? WHERE id = ?`).run(now(), id).changes > 0;
}

/** Advance contractor onboarding to the next status. */
export function advanceOnboarding(id: string): OnboardingStatus {
  const c = getContractor(id);
  if (!c) throw new Error("Contractor not found");
  const flow: OnboardingStatus[] = ["draft", "invited", "contract_sent", "signed", "active"];
  const idx = flow.indexOf(c.onboarding_status);
  const next = idx < flow.length - 1 ? flow[idx + 1] : c.onboarding_status;
  updateContractor(id, { onboarding_status: next });
  return next;
}

/** Compliance check: verify documents and tax info for a given country. */
export function checkCompliance(id: string): ComplianceStatus {
  const c = getContractor(id);
  if (!c) throw new Error("Contractor not found");

  const docs = c.documents ? JSON.parse(c.documents) : [];
  const hasContract = !!c.contract_url || docs.some((d: Record<string, unknown>) => d.type === "contract");
  const hasTaxId = !!c.tax_id;
  const hasPaymentDetails = !!c.payment_details;
  const hasEmail = !!c.email;

  // Country-specific requirements
  const countryReqs: Record<string, string[]> = {
    US: ["W-9", "contract"],
    GB: ["contract", "right-to-work"],
    DE: ["contract", "tax-registration"],
    FR: ["contract", "URSSAF"],
    ES: ["contract", "NIF"],
    NL: ["contract", "BTW-nummer"],
    CH: ["contract", "AHV-number"],
    AE: ["contract", "trade-license"],
    IN: ["contract", "PAN"],
    PH: ["contract", "TIN"],
    BR: ["contract", "CNPJ-or-CPF"],
  };

  const required = countryReqs[c.country] || ["contract"];
  const docTypes = docs.map((d: Record<string, unknown>) => d.type);
  const hasAllDocs = required.every((r) => docTypes.includes(r) || r === "contract" && hasContract);

  let status: ComplianceStatus;
  if (hasAllDocs && hasTaxId && hasPaymentDetails && hasEmail) {
    status = "verified";
  } else if (hasContract && hasEmail) {
    status = "pending";
  } else {
    status = "flagged";
  }

  updateContractor(id, { compliance_status: status, compliance_notes: JSON.stringify({ hasContract, hasTaxId, hasPaymentDetails, hasEmail, hasAllDocs, required }) });
  return status;
}

/** Get contractors grouped by onboarding status. */
export function contractorPipeline(workspace = "default"): Record<OnboardingStatus, number> {
  const rows = db
    .prepare(`SELECT onboarding_status, COUNT(*) as count FROM contractors WHERE workspace = ? AND status != 'archived' GROUP BY onboarding_status`)
    .all(workspace) as Array<{ onboarding_status: OnboardingStatus; count: number }>;
  const result: Record<string, number> = { draft: 0, invited: 0, contract_sent: 0, signed: 0, active: 0, offboarded: 0 };
  for (const r of rows) result[r.onboarding_status] = r.count;
  return result as Record<OnboardingStatus, number>;
}

/** Get total monthly contractor cost. */
export function contractorCostSummary(workspace = "default"): { total_monthly_usd: number; by_country: Record<string, number>; by_department: Record<string, number> } {
  const contractors = listContractors(workspace).filter(c => c.status === "active" && c.onboarding_status === "active");
  let totalMonthly = 0;
  const byCountry: Record<string, number> = {};
  const byDept: Record<string, number> = {};

  for (const c of contractors) {
    let monthly = c.rate_amount;
    if (c.rate_type === "hourly") monthly = c.rate_amount * 160; // ~160 hrs/month
    else if (c.rate_type === "project") monthly = c.rate_amount / 3; // assume 3-month projects

    // Convert to USD (simplified — real FX would use the fx module)
    if (c.rate_currency !== "USD") {
      const fxRates: Record<string, number> = { EUR: 1.08, GBP: 1.27, CHF: 1.12, AED: 0.27, INR: 0.012, PHP: 0.017, BRL: 0.19, MAD: 0.10, TND: 0.32 };
      monthly *= (fxRates[c.rate_currency] || 1);
    }

    totalMonthly += monthly;
    byCountry[c.country] = (byCountry[c.country] || 0) + monthly;
    const dept = c.department || "Unassigned";
    byDept[dept] = (byDept[dept] || 0) + monthly;
  }

  return { total_monthly_usd: Math.round(totalMonthly * 100) / 100, by_country: byCountry, by_department: byDept };
}