/**
 * Budget alerts: after each sync, scan ad_groups for bad performance and
 * fire webhook events. Configurable thresholds via env vars; falls back to
 * sensible defaults.
 *
 * Examples fired:
 *   - ad.budget.alert    { kind: "cpa_spike", cpa, threshold, ad_group_id, ... }
 *   - ad.budget.alert    { kind: "overspend", spent, daily_budget, ad_group_id, ... }
 */
import { db } from "@/lib/db";
import { dispatchEvent } from "./webhook-dispatch";
import { recordAudit, currentWorkspace } from "./audit";

const CPA_THRESHOLD = parseFloat(process.env.BUDGET_ALERT_CPA_USD || "50");
const OVERSPEND_RATIO = parseFloat(process.env.BUDGET_ALERT_OVERSPEND_RATIO || "1.5");

export async function checkBudgetAlerts(accountId?: string) {
  const ws = currentWorkspace();
  const where = accountId
    ? `account_id IN (SELECT id FROM ad_campaigns WHERE account_id = ?) AND conversions > 0`
    : `conversions > 0`;
  const params: (string | number)[] = accountId ? [accountId] : [];
  const groups = db
    .prepare(
      `SELECT id, name, campaign_id, spent, conversions, budget FROM ad_groups WHERE ${where}`,
    )
    .all(...params) as Record<string, unknown>[];

  const alerts: Record<string, unknown>[] = [];
  for (const g of groups) {
    const cpa = (g.spent || 0) / (g.conversions || 1);
    if (cpa > CPA_THRESHOLD) {
      const evt = {
        kind: "cpa_spike",
        account_id: accountId,
        ad_group_id: g.id,
        ad_group_name: g.name,
        cpa: +cpa.toFixed(2),
        threshold: CPA_THRESHOLD,
        spent: g.spent,
        conversions: g.conversions,
      };
      alerts.push(evt);
      await dispatchEvent("ad.budget.alert", evt, ws);
      recordAudit({
        workspace: ws,
        actor: "system",
        action: "sync",
        resource_type: "ad_group",
        resource_id: g.id,
        after: evt,
      });
    }
    if (g.budget && g.spent > g.budget * OVERSPEND_RATIO) {
      const evt = {
        kind: "overspend",
        account_id: accountId,
        ad_group_id: g.id,
        ad_group_name: g.name,
        spent: g.spent,
        daily_budget: g.budget,
        ratio: +(g.spent / g.budget).toFixed(2),
      };
      alerts.push(evt);
      await dispatchEvent("ad.budget.alert", evt, ws);
      recordAudit({
        workspace: ws,
        actor: "system",
        action: "sync",
        resource_type: "ad_group",
        resource_id: g.id,
        after: evt,
      });
    }
  }
  return alerts;
}
