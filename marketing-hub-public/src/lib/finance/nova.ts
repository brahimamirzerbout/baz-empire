/**
 * Nova — finance extension.
 *
 * Existing lib/nova.ts handles marketing intents. This module adds the
 * finance intents so the unified Nova experience can answer questions like:
 *
 *   "What's our cash position?"
 *   "How much VAT do we owe this quarter?"
 *   "Show me the P&L for the last 90 days."
 *   "What's our balance sheet?"
 *   "What's EUR/USD done this quarter?"
 *   "When is our next tax filing due?"
 *   "Forecast next quarter's cash."
 *   "Reconcile Plaid vs ledger."
 *
 * Same NovaAnswer shape as the parent module — drop-in compatible.
 */
import { db, now } from "@/lib/db";
import { financialHealth, profitAndLoss, balanceSheet, cashFlowStatement } from "./accounting";
import { calculateTax, dueDatesThisMonth, listLawUpdates } from "./tax";
import { getRate, convert, latestCore, deflation } from "./fx";
import { computeNDP, cumulativeInflation, tradeBalance } from "./macro";
import { allQuotes } from "./markets";

export type FinanceIntent =
  | "pnl"
  | "balance_sheet"
  | "cash_flow"
  | "fx"
  | "tax"
  | "tax_due"
  | "forecast"
  | "reconcile"
  | "macro"
  | "markets";

export interface FinanceAnswer {
  intent: FinanceIntent;
  question: string;
  answer: string;
  data: Record<string, unknown>;
  sources: string[];
  actions: string[];
  followups: string[];
  confidence: number;
  generated_at: number;
}

function classifyFinance(q: string): FinanceIntent[] {
  const lower = q.toLowerCase();
  const out = new Set<FinanceIntent>();
  if (/\b(p&l|profit|loss|income statement|revenue.*expense|net income|gross margin)\b/.test(lower))
    out.add("pnl");
  if (/\b(balance sheet|assets|liabilities|equity|net worth|book value)\b/.test(lower))
    out.add("balance_sheet");
  if (/\b(cash flow|cash position|cash on hand|liquidity|burn rate)\b/.test(lower)) {
    out.add("cash_flow");
    out.add("pnl");
  }
  if (/\b(fx|exchange rate|currency|usd|eur|chf|gbp|jpy|deflation|devaluation|forex)\b/.test(lower))
    out.add("fx");
  if (/\b(tax|vat|gst|fbt|capital gain|payroll tax)\b/.test(lower)) out.add("tax");
  if (
    /\b(due|deadline|filing|remind|when is)\b/.test(lower) &&
    /\b(tax|vat|gst|payroll)\b/.test(lower)
  )
    out.add("tax_due");
  if (/\b(forecast|predict|next quarter|projection)\b/.test(lower)) out.add("forecast");
  if (/\b(reconcile|match|discrepancy|plaid|revolut)\b/.test(lower)) out.add("reconcile");
  if (/\b(gdp|ndp|inflation|cpi|trade|import|export|macro|world bank)\b/.test(lower))
    out.add("macro");
  if (/\b(stock|equity|market|share|nasdaq|s&p|sp500|ftse|smi|tsx|dax)\b/.test(lower))
    out.add("markets");
  if (out.size === 0) out.add("pnl"); // sensible default
  return [...out];
}

function persistRun(q: string, intent: FinanceIntent, answer: FinanceAnswer) {
  db.prepare(
    `
    INSERT INTO nova_finance_runs (id, question, intent, answer, data, sources, confidence, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    `nfr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    q,
    intent,
    answer.answer,
    JSON.stringify(answer.data),
    JSON.stringify(answer.sources),
    answer.confidence,
    now(),
  );
}

export function askFinanceNova(question: string): FinanceAnswer {
  const intents = classifyFinance(question);
  const primary = intents[0];
  const sources: string[] = [];
  const actions: string[] = [];
  const followups: string[] = [];
  let answer = "";
  let data: Record<string, unknown> = {};
  let confidence = 70;

  switch (primary) {
    case "pnl": {
      const pl = profitAndLoss({ from: Date.now() - 30 * 86400_000, to: Date.now() });
      answer = `In the last 30 days: revenue ${pl.total_revenue.toFixed(2)}, expenses ${pl.total_expense.toFixed(2)}, net income ${pl.net_income.toFixed(2)}.`;
      if (pl.gross_margin != null)
        answer += ` Gross margin ${(pl.gross_margin * 100).toFixed(1)}%.`;
      if (pl.operating_margin != null)
        answer += ` Operating margin ${(pl.operating_margin * 100).toFixed(1)}%.`;
      data = pl;
      sources.push("lib/finance/accounting.ts#profitAndLoss");
      actions.push("View full P&L report at /finance/reports/pnl");
      followups.push("How does this compare to last quarter?", "Which expense line is biggest?");
      confidence = 95;
      break;
    }
    case "balance_sheet": {
      const bs = balanceSheet({ asOf: Date.now() });
      answer = `Assets ${bs.total_assets.toFixed(2)}, liabilities ${bs.total_liabilities.toFixed(2)}, equity ${bs.total_equity.toFixed(2)}.`;
      if (Math.abs(bs.imbalance) > 0.01)
        answer += ` ⚠️ Imbalance: ${bs.imbalance.toFixed(2)} — investigate.`;
      else answer += " Balanced ✓.";
      data = bs;
      sources.push("lib/finance/accounting.ts#balanceSheet");
      actions.push("View balance sheet at /finance/reports/balance-sheet");
      followups.push("What's our debt-to-equity ratio?", "Which asset is the largest?");
      confidence = 95;
      break;
    }
    case "cash_flow": {
      const cf = cashFlowStatement({ from: Date.now() - 30 * 86400_000, to: Date.now() });
      answer = `Cash position: opened at ${cf.opening_cash.toFixed(2)}, closed at ${cf.closing_cash.toFixed(2)} (net change ${cf.net_change >= 0 ? "+" : ""}${cf.net_change.toFixed(2)}).`;
      answer += ` Operating: +${cf.operating_inflows.toFixed(2)} in / -${cf.operating_outflows.toFixed(2)} out.`;
      data = cf;
      sources.push("lib/finance/accounting.ts#cashFlowStatement");
      actions.push("See the cash-flow waterfall at /finance");
      followups.push("At this burn rate, how many months of runway?", "Should we invoice earlier?");
      confidence = 92;
      break;
    }
    case "fx": {
      const core = latestCore();
      const matches = question.match(/\b([A-Z]{3})\b/g) || [];
      const pair = matches.length >= 2 ? matches.slice(0, 2) : ["USD", "EUR"];
      const [base, quote] = pair;
      const r = getRate(base, quote);
      const def = deflation(base, quote, 90);
      if (r) {
        answer = `${base}/${quote} = ${r.rate.toFixed(4)} (source: ${r.source}, as of ${new Date(r.as_of).toISOString().slice(0, 10)}).`;
        if (def)
          answer += ` Over the last 90 days: ${def.change_pct >= 0 ? "+" : ""}${def.change_pct.toFixed(2)}% (${def.from_rate.toFixed(4)} → ${def.to_rate.toFixed(4)}).`;
        answer += ` Core USD pairs: ${Object.entries(core)
          .map(([k, v]) => `${k}=${v.usd.toFixed(4)}`)
          .join(", ")}.`;
      } else {
        answer = `No rate available for ${base}/${quote}. Try refreshing at POST /api/finance/fx-rates {action:'refresh'}.`;
      }
      data = { pair: { base, quote }, rate: r, deflation: def, core };
      sources.push("lib/finance/fx.ts#getRate", "api.frankfurter.app");
      actions.push(
        "Refresh rates: POST /api/finance/fx-rates {action:'refresh'}",
        "Set an FX alert at /finance/fx",
      );
      followups.push("What's the 12-month trend?", "What if we convert $100,000 to EUR right now?");
      confidence = r ? 90 : 60;
      break;
    }
    case "tax": {
      // Try to extract country + amount from the question
      const countryMatch = question
        .match(/\b(US|GB|UK|CH|EU|DE|FR|CA|NY|CA)\b/i)?.[0]
        ?.toUpperCase();
      const amountMatch = question.match(/\$?([\d,]+)/)?.[1]?.replace(/,/g, "");
      const country = countryMatch || "US";
      const amount = parseFloat(amountMatch || "100000");
      const r = calculateTax({ country, kind: "corporate", taxable_amount: amount });
      answer = `${r.rule_label || "Tax"} on ${amount.toLocaleString()} ${country === "US" ? "USD" : country}: tax owed ${r.tax_owed.toLocaleString()} (rate ${(r.rate * 100).toFixed(2)}%, effective ${(r.effective_rate * 100).toFixed(2)}%).`;
      data = r;
      sources.push("lib/finance/tax.ts#calculateTax", r.rule_code || "manual");
      actions.push(
        "See all tax rules at /finance/taxes",
        "Compute for a different country at /finance/taxes",
      );
      followups.push("What about payroll tax for an employee?", "What's our next filing due?");
      confidence = r.rule_label ? 90 : 65;
      break;
    }
    case "tax_due": {
      const upcoming = dueDatesThisMonth("default", { withinDays: 60 });
      answer =
        upcoming.length === 0
          ? "No tax filings due in the next 60 days."
          : `${upcoming.length} tax filings due in the next 60 days. Next: ${upcoming[0]?.label} ${upcoming[0]?.overdue ? "OVERDUE" : "in " + upcoming[0]?.days_away + " days"}.`;
      data = upcoming;
      sources.push("lib/finance/tax.ts#dueDatesThisMonth");
      actions.push("See all upcoming filings at /finance/taxes");
      followups.push("Set up email reminders for these?", "Which one has the highest amount owed?");
      confidence = 95;
      break;
    }
    case "forecast": {
      const h = financialHealth({ periodDays: 90 });
      const cf = cashFlowStatement({ from: Date.now() - 90 * 86400_000, to: Date.now() });
      // Simple linear projection: monthly burn × 6 months
      const monthlyNet = (cf.net_change || 0) / 3;
      const projected6mo = h.cash_position + monthlyNet * 6;
      answer = `Current cash: ${h.cash_position.toFixed(2)}. Net monthly burn (90d avg): ${monthlyNet.toFixed(2)}. Projected 6-month cash: ${projected6mo.toFixed(2)}.`;
      if (projected6mo < 0) answer += ` ⚠️ Negative — you need to raise, cut, or invoice faster.`;
      data = { health: h, monthlyNet, projected6mo };
      sources.push("lib/finance/accounting.ts#cashFlowStatement");
      actions.push("Set up a runway alert", "Review your largest expenses");
      followups.push("What's our break-even point?", "Should we invoice net-15 instead of net-30?");
      confidence = 75;
      break;
    }
    case "reconcile": {
      // Show Plaid transactions that haven't been matched to ledger entries.
      const conns = db
        .prepare(
          `SELECT * FROM connector_accounts WHERE provider IN ('plaid','revolut') AND status = 'active'`,
        )
        .all() as Record<string, unknown>[];
      answer =
        `${conns.length} active bank connector(s). ` +
        `Reconciliation is per-transaction; the matching algo runs on every sync. ` +
        `Currently we have no automated orphan detector — for now, compare the count of bank transactions vs journal entries with source='plaid' / 'revolut' in the same period.`;
      const plaidCount = db
        .prepare(`SELECT COUNT(*) AS n FROM journal_entries WHERE source = 'plaid'`)
        .get() as Record<string, unknown> | undefined;
      const revCount = db
        .prepare(`SELECT COUNT(*) AS n FROM journal_entries WHERE source = 'revolut'`)
        .get() as Record<string, unknown> | undefined;
      data = { connectors: conns.length, plaid_entries: plaidCount.n, revolut_entries: revCount.n };
      sources.push("lib/finance/connectors/plaid.ts", "lib/finance/connectors/revolut.ts");
      actions.push("Run a sync at /finance/connectors");
      followups.push("Show me unmatched transactions");
      confidence = 60;
      break;
    }
    case "macro": {
      const m = db
        .prepare(`SELECT * FROM market_quotes WHERE kind='macro' ORDER BY as_of DESC LIMIT 50`)
        .all() as Record<string, unknown>[];
      const countries = [...new Set(m.map((x) => x.symbol.split(".").pop()))];
      const country = countries[0] || "USA";
      const ndp = computeNDP(country);
      const infl = cumulativeInflation(country, 5);
      answer = `${country}: GDP ${ndp?.gdp ? "$" + (ndp.gdp / 1e12).toFixed(2) + "T" : "n/a"}, NDP estimate ${ndp?.ndp ? "$" + (ndp.ndp / 1e12).toFixed(2) + "T (5% depreciation)" : "n/a"}.`;
      if (infl)
        answer += ` 5y cumulative inflation: ${infl.total_pct.toFixed(1)}% (purchasing power ×${infl.purchasing_power_factor.toFixed(3)}).`;
      data = { country, ndp, inflation: infl };
      sources.push("api.worldbank.org", "lib/finance/macro.ts");
      actions.push(
        "Refresh macro data: POST /api/finance/macro",
        "Compare countries at /finance/macro",
      );
      followups.push(
        "What's our purchasing power vs USD?",
        "What's the inflation rate in Switzerland?",
      );
      confidence = 80;
      break;
    }
    case "markets": {
      const q = allQuotes();
      const gainers = q.filter((x) => (x.change_pct || 0) > 0).slice(0, 3);
      const losers = q.filter((x) => (x.change_pct || 0) < 0).slice(0, 3);
      answer = `${q.length} symbols tracked. Top gainers: ${gainers.map((g) => `${g.symbol} +${g.change_pct?.toFixed(1)}%`).join(", ") || "none"}. Top losers: ${losers.map((l) => `${l.symbol} ${l.change_pct?.toFixed(1)}%`).join(", ") || "none"}.`;
      data = { gainers, losers, total: q.length };
      sources.push("lib/finance/markets.ts", "alphavantage.co", "coingecko.com");
      actions.push(
        "Refresh market data: POST /api/finance/markets",
        "View heatmap at /finance/markets",
      );
      followups.push("How is NVDA doing?", "What did the S&P 500 do this week?");
      confidence = 88;
      break;
    }
    default: {
      const h = financialHealth({ periodDays: 30 });
      answer = `Cash ${h.cash_position.toFixed(2)} · Net income 30d ${h.net_income.toFixed(2)} · ${h.period_days}-day snapshot. Ask me about P&L, balance sheet, cash flow, tax, FX, macro, or markets.`;
      data = h;
      confidence = 80;
    }
  }

  const out: FinanceAnswer = {
    intent: primary,
    question,
    answer,
    data,
    sources,
    actions,
    followups,
    confidence,
    generated_at: now(),
  };
  persistRun(question, primary, out);
  return out;
}

export function recentFinanceRuns(limit = 20) {
  return db
    .prepare(`SELECT * FROM nova_finance_runs ORDER BY created_at DESC LIMIT ?`)
    .all(limit) as Record<string, unknown>[];
}
