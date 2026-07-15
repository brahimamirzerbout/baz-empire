import type { CommerceInput, CommerceResult } from "../types";

/**
 * E-commerce — break-even ROAS + contribution-margin pricing + revenue forecast.
 *
 * Extracted from the dominator methodology of Fuel Made (Shopify+Klaviyo, CVR/AOV/LTV)
 * and BVA/Accenture Song ($1B GMV) — the category kings that price media against
 * *contribution margin*, not vanity ROAS. Break-even ROAS = 1 / contribution-margin%.
 *
 * A campaign is profitable when actual ROAS > break-even ROAS. This is the number
 * a DTC brand's CFO actually needs before scaling spend.
 *
 * Pure function — no I/O, deterministic. Unit-tested.
 */
export class CommerceService {
  static analyze(input: CommerceInput, growthRate = 0): CommerceResult {
    if (input.productPrice <= 0) throw new Error("productPrice must be > 0");
    if (input.orders < 0) throw new Error("orders must be >= 0");

    const transactionFee = input.productPrice * input.transactionFeeRate;
    const variableCosts = input.costOfGoods + transactionFee + input.shippingHandling;
    const contributionPerOrder = input.productPrice - variableCosts;
    const contributionMarginPct =
      input.productPrice > 0 ? contributionPerOrder / input.productPrice : 0;

    // Break-even ROAS: the ROAS at which ad spend equals gross profit.
    // Below this, every dollar of ad spend loses money.
    const breakEvenRoas = contributionMarginPct > 0 ? 1 / contributionMarginPct : Infinity;

    const revenue = input.productPrice * input.orders;
    const grossProfit = contributionPerOrder * input.orders;
    const netProfit = grossProfit - input.adSpend;
    const actualRoas = input.adSpend > 0 ? revenue / input.adSpend : 0;
    const profitable = actualRoas >= breakEvenRoas && input.adSpend > 0;

    const forecastRevenue = Math.round(revenue * (1 + growthRate) * 100) / 100;

    let verdict: string;
    if (input.adSpend === 0) {
      verdict = "No ad spend — organic-only. Track LTV to decide paid scaling.";
    } else if (breakEvenRoas === Infinity) {
      verdict = "Negative contribution margin — fix unit economics before any paid spend.";
    } else if (profitable) {
      const headroom = Math.round((actualRoas - breakEvenRoas) * 100) / 100;
      verdict = `Profitable. Actual ROAS ${actualRoas.toFixed(2)} is ${headroom.toFixed(2)} above break-even ${breakEvenRoas.toFixed(2)}. Scale spend.`;
    } else {
      const gap = Math.round((breakEvenRoas - actualRoas) * 100) / 100;
      verdict = `Unprofitable. Need ROAS ${breakEvenRoas.toFixed(2)} to break even; actual ${actualRoas.toFixed(2)} is ${gap.toFixed(2)} short. Cut spend or lift AOV/margin.`;
    }

    return {
      contributionMarginPct: Math.round(contributionMarginPct * 10000) / 100, // as %
      contributionPerOrder: Math.round(contributionPerOrder * 100) / 100,
      breakEvenRoas: breakEvenRoas === Infinity ? -1 : Math.round(breakEvenRoas * 100) / 100,
      actualRoas: Math.round(actualRoas * 100) / 100,
      revenue: Math.round(revenue * 100) / 100,
      grossProfit: Math.round(grossProfit * 100) / 100,
      netProfit: Math.round(netProfit * 100) / 100,
      profitable,
      forecastRevenue,
      verdict,
    };
  }
}