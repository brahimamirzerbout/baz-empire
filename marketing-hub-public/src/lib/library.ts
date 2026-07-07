/**
 * The Library — proven marketing formulas, codified.
 *
 * Each formula carries: inputs, output, the math, when to use, a worked example.
 * Categories: acquisition, conversion, retention, revenue, brand, growth, pricing, analytics.
 */
export type FormulaCategory =
  | "acquisition"
  | "conversion"
  | "retention"
  | "revenue"
  | "brand"
  | "growth"
  | "pricing"
  | "analytics";

export interface Formula {
  id: string;
  name: string;
  category: FormulaCategory;
  short: string; // one-line description
  when: string; // when to use this
  inputs: { name: string; label: string; type: "number" | "percent"; default?: number }[];
  formula: string; // human-readable formula
  example: { inputs: Record<string, number>; result: unknown };
  compute: (inputs: Record<string, number>) => any;
}

export const FORMULAS: Formula[] = [
  /* ───────────── Acquisition ───────────── */
  {
    id: "cac",
    name: "Customer Acquisition Cost (CAC)",
    category: "acquisition",
    short: "Total cost to acquire one paying customer.",
    when: "Always. Before spending another dollar on ads.",
    inputs: [
      { name: "marketing_spend", label: "Marketing spend ($)", type: "number", default: 5000 },
      { name: "sales_spend", label: "Sales spend ($)", type: "number", default: 3000 },
      { name: "new_customers", label: "New customers", type: "number", default: 40 },
    ],
    formula: "(marketing_spend + sales_spend) / new_customers",
    example: {
      inputs: { marketing_spend: 8000, sales_spend: 4000, new_customers: 50 },
      result: 240,
    },
    compute: (i) =>
      Math.round(
        ((i.marketing_spend || 0) + (i.sales_spend || 0)) / Math.max(1, i.new_customers || 1),
      ),
  },
  {
    id: "ltv",
    name: "Customer Lifetime Value (LTV)",
    category: "acquisition",
    short: "Total revenue a customer pays over their lifetime.",
    when: "Always. Compare to CAC — LTV/CAC ≥ 3x is the line.",
    inputs: [
      { name: "avg_order_value", label: "Avg order value ($)", type: "number", default: 80 },
      { name: "purchases_per_year", label: "Purchases per year", type: "number", default: 4 },
      {
        name: "customer_lifespan_years",
        label: "Customer lifespan (years)",
        type: "number",
        default: 3,
      },
      { name: "gross_margin", label: "Gross margin (%)", type: "percent", default: 75 },
    ],
    formula: "AOV × purchases/year × years × gross_margin",
    example: {
      inputs: {
        avg_order_value: 100,
        purchases_per_year: 6,
        customer_lifespan_years: 4,
        gross_margin: 75,
      },
      result: 1800,
    },
    compute: (i) =>
      Math.round(
        (i.avg_order_value || 0) *
          (i.purchases_per_year || 0) *
          (i.customer_lifespan_years || 0) *
          ((i.gross_margin || 0) / 100),
      ),
  },
  {
    id: "ltv_cac",
    name: "LTV : CAC Ratio",
    category: "acquisition",
    short: "How many dollars of LTV you get per dollar of CAC.",
    when: "Quarterly. Below 3x = burning. Above 5x = invest more.",
    inputs: [
      { name: "ltv", label: "LTV ($)", type: "number", default: 1800 },
      { name: "cac", label: "CAC ($)", type: "number", default: 240 },
    ],
    formula: "LTV / CAC",
    example: { inputs: { ltv: 1800, cac: 240 }, result: "7.5x" },
    compute: (i) => {
      const r = (i.ltv || 0) / Math.max(1, i.cac || 1);
      return `${r.toFixed(1)}x`;
    },
  },
  {
    id: "payback",
    name: "CAC Payback Period",
    category: "acquisition",
    short: "Months to recover CAC from gross profit.",
    when: "When deciding whether to scale a channel. < 12mo is fundable.",
    inputs: [
      { name: "cac", label: "CAC ($)", type: "number", default: 240 },
      {
        name: "monthly_revenue_per_customer",
        label: "Monthly revenue / customer ($)",
        type: "number",
        default: 80,
      },
      { name: "gross_margin", label: "Gross margin (%)", type: "percent", default: 75 },
    ],
    formula: "CAC / (monthly_revenue_per_customer × gross_margin)",
    example: {
      inputs: { cac: 240, monthly_revenue_per_customer: 80, gross_margin: 75 },
      result: "4.0 months",
    },
    compute: (i) => {
      const monthly_profit = (i.monthly_revenue_per_customer || 0) * ((i.gross_margin || 0) / 100);
      return monthly_profit > 0 ? `${(i.cac / monthly_profit).toFixed(1)} months` : "—";
    },
  },

  /* ───────────── Conversion ───────────── */
  {
    id: "cvr",
    name: "Conversion Rate (CVR)",
    category: "conversion",
    short: "% of visitors who take the desired action.",
    when: "Every landing page. Industry avg 2-5%, top decile 11%+.",
    inputs: [
      { name: "conversions", label: "Conversions", type: "number", default: 320 },
      { name: "visitors", label: "Visitors", type: "number", default: 8000 },
    ],
    formula: "conversions / visitors",
    example: { inputs: { conversions: 400, visitors: 10000 }, result: "4.0%" },
    compute: (i) => `${(((i.conversions || 0) / Math.max(1, i.visitors || 1)) * 100).toFixed(2)}%`,
  },
  {
    id: "roas",
    name: "Return on Ad Spend (ROAS)",
    category: "conversion",
    short: "Revenue per dollar of ad spend.",
    when: "Per campaign. 4x+ is healthy for ecom. Lower for SaaS.",
    inputs: [
      { name: "revenue", label: "Revenue ($)", type: "number", default: 24000 },
      { name: "ad_spend", label: "Ad spend ($)", type: "number", default: 6000 },
    ],
    formula: "revenue / ad_spend",
    example: { inputs: { revenue: 24000, ad_spend: 6000 }, result: "4.0x" },
    compute: (i) => `${((i.revenue || 0) / Math.max(1, i.ad_spend || 1)).toFixed(1)}x`,
  },
  {
    id: "ctr",
    name: "Click-Through Rate (CTR)",
    category: "conversion",
    short: "% of impressions that become clicks.",
    when: "Per ad, per email subject. Search ads 2-5%, display 0.5-1%.",
    inputs: [
      { name: "clicks", label: "Clicks", type: "number", default: 480 },
      { name: "impressions", label: "Impressions", type: "number", default: 120000 },
    ],
    formula: "clicks / impressions",
    example: { inputs: { clicks: 600, impressions: 100000 }, result: "0.60%" },
    compute: (i) => `${(((i.clicks || 0) / Math.max(1, i.impressions || 1)) * 100).toFixed(2)}%`,
  },
  {
    id: "bounce_rate",
    name: "Bounce Rate",
    category: "conversion",
    short: "% of visitors who leave without interacting.",
    when: "Every page. Above 70% = serious problem with message or match.",
    inputs: [
      {
        name: "single_page_sessions",
        label: "Single-page sessions",
        type: "number",
        default: 5400,
      },
      { name: "total_sessions", label: "Total sessions", type: "number", default: 8000 },
    ],
    formula: "single_page_sessions / total_sessions",
    example: { inputs: { single_page_sessions: 6000, total_sessions: 8000 }, result: "75.0%" },
    compute: (i) =>
      `${(((i.single_page_sessions || 0) / Math.max(1, i.total_sessions || 1)) * 100).toFixed(1)}%`,
  },
  {
    id: "funnel_cvr",
    name: "Funnel Stage Conversion",
    category: "conversion",
    short: "% who advance from one stage to the next.",
    when: "Every funnel step. The leakiest step is where the money is.",
    inputs: [
      { name: "next_stage", label: "Next stage count", type: "number", default: 1800 },
      { name: "this_stage", label: "This stage count", type: "number", default: 8000 },
    ],
    formula: "next_stage / this_stage",
    example: { inputs: { next_stage: 2000, this_stage: 10000 }, result: "20.0%" },
    compute: (i) => `${(((i.next_stage || 0) / Math.max(1, i.this_stage || 1)) * 100).toFixed(1)}%`,
  },

  /* ───────────── Retention ───────────── */
  {
    id: "churn_rate",
    name: "Churn Rate",
    category: "retention",
    short: "% of customers who leave in a given period.",
    when: "Monthly. Below 5%/mo for SMB SaaS, below 1%/mo for enterprise.",
    inputs: [
      { name: "churned", label: "Customers lost", type: "number", default: 12 },
      { name: "start_customers", label: "Customers at start", type: "number", default: 480 },
    ],
    formula: "churned / start_customers",
    example: { inputs: { churned: 15, start_customers: 500 }, result: "3.0%" },
    compute: (i) =>
      `${(((i.churned || 0) / Math.max(1, i.start_customers || 1)) * 100).toFixed(2)}%`,
  },
  {
    id: "nps",
    name: "Net Promoter Score (NPS)",
    category: "retention",
    short: "Loyalty metric from -100 to +100.",
    when: "Quarterly. Above 50 = world-class. Below 0 = product problem.",
    inputs: [
      { name: "promoters", label: "Promoters (9-10)", type: "number", default: 220 },
      { name: "passives", label: "Passives (7-8)", type: "number", default: 130 },
      { name: "detractors", label: "Detractors (0-6)", type: "number", default: 50 },
    ],
    formula: "%promoters - %detractors",
    example: { inputs: { promoters: 300, passives: 100, detractors: 100 }, result: "+40" },
    compute: (i) => {
      const total = (i.promoters || 0) + (i.passives || 0) + (i.detractors || 0);
      if (!total) return 0;
      return Math.round(((i.promoters - i.detractors) / total) * 100);
    },
  },
  {
    id: "retention_curve",
    name: "N-Week Retention",
    category: "retention",
    short: "% of cohort still active at week N.",
    when: "Every cohort. W1 predicts LTV. W4 predicts survival.",
    inputs: [
      { name: "active_users", label: "Active in week N", type: "number", default: 180 },
      { name: "cohort_size", label: "Cohort size", type: "number", default: 500 },
    ],
    formula: "active_users / cohort_size",
    example: { inputs: { active_users: 200, cohort_size: 500 }, result: "40.0%" },
    compute: (i) =>
      `${(((i.active_users || 0) / Math.max(1, i.cohort_size || 1)) * 100).toFixed(1)}%`,
  },
  {
    id: "engagement_rate",
    name: "Engagement Rate (Social)",
    category: "retention",
    short: "% of audience that interacted with a post.",
    when: "Every post. Above 3% is solid. Above 6% is exceptional.",
    inputs: [
      {
        name: "interactions",
        label: "Interactions (likes+comments+shares)",
        type: "number",
        default: 240,
      },
      { name: "impressions", label: "Impressions", type: "number", default: 8000 },
    ],
    formula: "interactions / impressions",
    example: { inputs: { interactions: 400, impressions: 8000 }, result: "5.0%" },
    compute: (i) =>
      `${(((i.interactions || 0) / Math.max(1, i.impressions || 1)) * 100).toFixed(2)}%`,
  },

  /* ───────────── Revenue ───────────── */
  {
    id: "mrr_growth",
    name: "MRR Growth Rate",
    category: "revenue",
    short: "Month-over-month MRR growth.",
    when: "Monthly. Above 10%/mo = hypergrowth. Above 20%/mo = unicorn.",
    inputs: [
      { name: "this_month_mrr", label: "This month MRR ($)", type: "number", default: 38000 },
      { name: "last_month_mrr", label: "Last month MRR ($)", type: "number", default: 35000 },
    ],
    formula: "(this - last) / last",
    example: { inputs: { this_month_mrr: 40000, last_month_mrr: 35000 }, result: "14.3%" },
    compute: (i) =>
      `${((((i.this_month_mrr || 0) - (i.last_month_mrr || 0)) / Math.max(1, i.last_month_mrr || 1)) * 100).toFixed(1)}%`,
  },
  {
    id: "arpu",
    name: "Average Revenue Per User (ARPU)",
    category: "revenue",
    short: "Average revenue per active customer per period.",
    when: "Monthly. Compare across segments to find your whales.",
    inputs: [
      { name: "total_revenue", label: "Total revenue ($)", type: "number", default: 42000 },
      { name: "active_customers", label: "Active customers", type: "number", default: 480 },
    ],
    formula: "total_revenue / active_customers",
    example: { inputs: { total_revenue: 50000, active_customers: 500 }, result: "$100" },
    compute: (i) => `$${Math.round((i.total_revenue || 0) / Math.max(1, i.active_customers || 1))}`,
  },
  {
    id: "gross_margin",
    name: "Gross Margin",
    category: "revenue",
    short: "Revenue minus cost of goods, as a % of revenue.",
    when: "Quarterly. SaaS should be 70%+. Ecom 40-60%.",
    inputs: [
      { name: "revenue", label: "Revenue ($)", type: "number", default: 100000 },
      { name: "cogs", label: "Cost of goods ($)", type: "number", default: 25000 },
    ],
    formula: "(revenue - cogs) / revenue",
    example: { inputs: { revenue: 100000, cogs: 25000 }, result: "75.0%" },
    compute: (i) =>
      `${((((i.revenue || 0) - (i.cogs || 0)) / Math.max(1, i.revenue || 1)) * 100).toFixed(1)}%`,
  },
  {
    id: "pipeline_coverage",
    name: "Pipeline Coverage Ratio",
    category: "revenue",
    short: "Pipeline value vs. target. 3x = safe. 5x = great quarter.",
    when: "Each Monday. If below 3x, time to prospect.",
    inputs: [
      { name: "open_pipeline", label: "Open pipeline ($)", type: "number", default: 380000 },
      { name: "quarterly_target", label: "Quarterly target ($)", type: "number", default: 120000 },
    ],
    formula: "open_pipeline / quarterly_target",
    example: { inputs: { open_pipeline: 400000, quarterly_target: 100000 }, result: "4.0x" },
    compute: (i) =>
      `${((i.open_pipeline || 0) / Math.max(1, i.quarterly_target || 1)).toFixed(1)}x`,
  },

  /* ───────────── Brand ───────────── */
  {
    id: "brand_recall",
    name: "Unaided Brand Recall",
    category: "brand",
    short: "% of target who name your brand without prompting.",
    when: "Quarterly. Track trend, not absolute.",
    inputs: [
      { name: "named_brand", label: "Named your brand", type: "number", default: 38 },
      { name: "surveyed", label: "Surveyed", type: "number", default: 200 },
    ],
    formula: "named_brand / surveyed",
    example: { inputs: { named_brand: 60, surveyed: 200 }, result: "30.0%" },
    compute: (i) => `${(((i.named_brand || 0) / Math.max(1, i.surveyed || 1)) * 100).toFixed(1)}%`,
  },
  {
    id: "share_of_voice",
    name: "Share of Voice (SOV)",
    category: "brand",
    short: "% of category conversation your brand owns.",
    when: "Monthly. Track vs. share of market to find the gap.",
    inputs: [
      { name: "your_mentions", label: "Your mentions", type: "number", default: 240 },
      { name: "category_mentions", label: "Category mentions", type: "number", default: 1500 },
    ],
    formula: "your_mentions / category_mentions",
    example: { inputs: { your_mentions: 300, category_mentions: 1500 }, result: "20.0%" },
    compute: (i) =>
      `${(((i.your_mentions || 0) / Math.max(1, i.category_mentions || 1)) * 100).toFixed(1)}%`,
  },

  /* ───────────── Growth ───────────── */
  {
    id: "viral_coefficient",
    name: "Viral Coefficient (K)",
    category: "growth",
    short: "How many new users each user brings. K>1 = viral.",
    when: "When evaluating referral / invite mechanics.",
    inputs: [
      { name: "invites_per_user", label: "Invites per user", type: "number", default: 4 },
      { name: "conversion_rate", label: "Invite conversion (%)", type: "percent", default: 12 },
    ],
    formula: "invites_per_user × (conversion_rate / 100)",
    example: { inputs: { invites_per_user: 5, conversion_rate: 20 }, result: "1.0 (viral)" },
    compute: (i) => {
      const k = (i.invites_per_user || 0) * ((i.conversion_rate || 0) / 100);
      return `${k.toFixed(2)}${k > 1 ? " (viral)" : k === 1 ? " (1:1)" : ""}`;
    },
  },
  {
    id: "rule_of_40",
    name: "Rule of 40",
    category: "growth",
    short: "Growth rate + profit margin should sum to ≥ 40%.",
    when: "Quarterly. SaaS benchmark for healthy scaling.",
    inputs: [
      { name: "growth_rate", label: "Growth rate (%)", type: "percent", default: 25 },
      { name: "profit_margin", label: "Profit margin (%)", type: "percent", default: 12 },
    ],
    formula: "growth_rate + profit_margin",
    example: { inputs: { growth_rate: 30, profit_margin: 15 }, result: "45% (healthy)" },
    compute: (i) => {
      const s = (i.growth_rate || 0) + (i.profit_margin || 0);
      return `${s}%${s >= 40 ? " (healthy)" : s >= 20 ? " (ok)" : " (warning)"}`;
    },
  },
  {
    id: "magic_number",
    name: "Sales Magic Number",
    category: "growth",
    short: "Sales efficiency. $1 of sales/marketing → $X of new ARR.",
    when: "Quarterly. Above 1.0 = exceptional efficiency.",
    inputs: [
      { name: "new_arr", label: "New ARR added ($)", type: "number", default: 80000 },
      { name: "sales_marketing_spend", label: "S&M spend ($)", type: "number", default: 50000 },
    ],
    formula: "new_arr / sales_marketing_spend",
    example: { inputs: { new_arr: 100000, sales_marketing_spend: 50000 }, result: "2.0x" },
    compute: (i) => `${((i.new_arr || 0) / Math.max(1, i.sales_marketing_spend || 1)).toFixed(1)}x`,
  },

  /* ───────────── Pricing ───────────── */
  {
    id: "price_elasticity",
    name: "Price Elasticity of Demand",
    category: "pricing",
    short: "% change in demand per 1% change in price.",
    when: "When considering a price change. Elastic = |e| > 1.",
    inputs: [
      { name: "demand_change_pct", label: "Demand change (%)", type: "percent", default: -15 },
      { name: "price_change_pct", label: "Price change (%)", type: "percent", default: 10 },
    ],
    formula: "%Δdemand / %Δprice",
    example: { inputs: { demand_change_pct: -20, price_change_pct: 10 }, result: "-2.0 (elastic)" },
    compute: (i) => {
      const e = (i.demand_change_pct || 0) / Math.max(0.01, i.price_change_pct || 0.01);
      const tag = Math.abs(e) > 1 ? "elastic" : "inelastic";
      return `${e.toFixed(2)} (${tag})`;
    },
  },
  {
    id: "break_even",
    name: "Break-Even ROAS",
    category: "pricing",
    short: "ROAS needed to break even on a product sale.",
    when: "Before launching any paid campaign for a product.",
    inputs: [
      { name: "price", label: "Price ($)", type: "number", default: 80 },
      { name: "cogs", label: "COGS ($)", type: "number", default: 20 },
      { name: "other_costs", label: "Other variable costs ($)", type: "number", default: 5 },
    ],
    formula: "price / (price - cogs - other_costs)",
    example: { inputs: { price: 100, cogs: 25, other_costs: 5 }, result: "1.43x" },
    compute: (i) => {
      const contrib = (i.price || 0) - (i.cogs || 0) - (i.other_costs || 0);
      return contrib > 0 ? `${(i.price / contrib).toFixed(2)}x` : "—";
    },
  },

  /* ───────────── Analytics ───────────── */
  {
    id: "statistical_significance",
    name: "Statistical Significance (p-value)",
    category: "analytics",
    short: "Two-proportion z-test p-value. < 0.05 = significant.",
    when: "Every A/B test before shipping the winner.",
    inputs: [
      { name: "a_users", label: "Variant A users", type: "number", default: 5000 },
      { name: "a_conv", label: "Variant A conversions", type: "number", default: 250 },
      { name: "b_users", label: "Variant B users", type: "number", default: 5000 },
      { name: "b_conv", label: "Variant B conversions", type: "number", default: 325 },
    ],
    formula: "2 × (1 - Φ(|z|)) where z is two-proportion z-statistic",
    example: {
      inputs: { a_users: 5000, a_conv: 250, b_users: 5000, b_conv: 325 },
      result: "p=0.0013",
    },
    compute: (i) => {
      const p1 = (i.a_conv || 0) / Math.max(1, i.a_users || 1);
      const p2 = (i.b_conv || 0) / Math.max(1, i.b_users || 1);
      const pPool =
        ((i.a_conv || 0) + (i.b_conv || 0)) / Math.max(1, (i.a_users || 0) + (i.b_users || 0));
      const se = Math.sqrt(
        pPool * (1 - pPool) * (1 / Math.max(1, i.a_users || 1) + 1 / Math.max(1, i.b_users || 1)),
      );
      const z = se > 0 ? (p2 - p1) / se : 0;
      // Φ approximation
      const erf = (x: number) => {
        const a1 = 0.254829592,
          a2 = -0.284496736,
          a3 = 1.421413741,
          a4 = -1.453152027,
          a5 = 1.061405429,
          p = 0.3275911;
        const sign = x < 0 ? -1 : 1;
        const ax = Math.abs(x);
        const t = 1 / (1 + p * ax);
        const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax);
        return sign * y;
      };
      const cdf = 0.5 * (1 + erf(z / Math.SQRT2));
      const p = 2 * (1 - cdf);
      return `p=${Math.max(0, p).toFixed(4)} (${p < 0.05 ? "significant" : "not sig"})`;
    },
  },
  {
    id: "sample_size",
    name: "Required Sample Size",
    category: "analytics",
    short: "Sample size to detect a given lift at 95% confidence.",
    when: "When planning an A/B test (before you start).",
    inputs: [
      { name: "baseline_rate", label: "Baseline conversion (%)", type: "percent", default: 5 },
      {
        name: "min_detectable_lift_pct",
        label: "Min detectable lift (%)",
        type: "percent",
        default: 10,
      },
    ],
    formula: "(Z_α/2 + Z_β)² × 2 × p × (1-p) / Δ²",
    example: {
      inputs: { baseline_rate: 5, min_detectable_lift_pct: 10 },
      result: "31,058 per variant",
    },
    compute: (i) => {
      const p = (i.baseline_rate || 0) / 100;
      const delta = p * ((i.min_detectable_lift_pct || 0) / 100);
      const n = ((1.96 + 0.84) ** 2 * 2 * p * (1 - p)) / Math.max(0.0001, delta * delta);
      return `${Math.ceil(n).toLocaleString()} per variant`;
    },
  },
];

export const FORMULAS_BY_CATEGORY: Record<FormulaCategory, Formula[]> = FORMULAS.reduce(
  (acc, f) => {
    (acc[f.category] = acc[f.category] || []).push(f);
    return acc;
  },
  {} as Record<FormulaCategory, Formula[]>,
);
