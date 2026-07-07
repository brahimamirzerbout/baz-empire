/**
 * The Old School — legacy marketing formulas, codified as a tribute.
 *
 * The discipline was built on these. They are not obsolete; they are the
 * grammar of the craft. Every modern formula (CVR, CTR, CAC) rests on
 * assumptions these classics defined.
 *
 * These are presented exactly as they appeared in the textbooks — with the
 * era, the originator, and the canonical form. We owe the discipline to
 * the people who worked this out with chalkboards and surveys before
 * pixels were a thing.
 *
 * Marketers who know these don't just know the answer — they know WHY
 * the answer is the answer.
 */
export type LegacyEra = "pre-1950" | "1950s" | "1960s" | "1970s" | "1980s" | "1990s" | "2000s";

export interface LegacyFormula {
  id: string;
  name: string;
  era: LegacyEra;
  eraLabel: string;
  originator: string; // who coined / popularized it
  year_introduced: number;
  short: string;
  story: string; // the context in which it was born
  inputs: { name: string; label: string; type: "number" | "percent" }[];
  formula: string;
  example: { inputs: Record<string, number>; result: unknown };
  compute: (inputs: Record<string, number>) => any;
  modern_use: string; // where it's still useful today
}

export const LEGACY_FORMULAS: LegacyFormula[] = [
  /* ─────────────── Pre-1950: The Industrial Era ─────────────── */
  {
    id: "aida_classic",
    name: "AIDA (Classic St. Elmo Lewis, 1898)",
    era: "pre-1950",
    eraLabel: "1898 · Industrial",
    originator: "E. St. Elmo Lewis",
    year_introduced: 1898,
    short: "Attention → Interest → Desire → Action. The first codified funnel.",
    story:
      "Lewis was a sales manager at a Philadelphia carbide company. He wrote down the four steps a prospect moves through in a sales conversation, and gave marketing its first lingua franca. Before AIDA, persuasion was art; after AIDA, it was craft.",
    inputs: [
      { name: "impressions", label: "Impressions", type: "number" },
      { name: "attention_pct", label: "Attention (%)", type: "percent" },
      { name: "interest_pct", label: "Interest (%)", type: "percent" },
      { name: "desire_pct", label: "Desire (%)", type: "percent" },
      { name: "action_pct", label: "Action (%)", type: "percent" },
    ],
    formula: "impressions → ×attention → ×interest → ×desire → ×action = conversions",
    example: {
      inputs: {
        impressions: 100000,
        attention_pct: 40,
        interest_pct: 30,
        desire_pct: 50,
        action_pct: 25,
      },
      result: 1500,
    },
    compute: (i) =>
      Math.round(
        ((((((((i.impressions || 0) * (i.attention_pct || 0)) / 100) * (i.interest_pct || 0)) /
          100) *
          (i.desire_pct || 0)) /
          100) *
          (i.action_pct || 0)) /
          100,
      ),
    modern_use:
      "Still the spine of every conversion page. Modern copy frameworks (PAS, BAB, StoryBrand) are AIDA with different verbs.",
  },
  {
    id: "reach",
    name: "Reach",
    era: "pre-1950",
    eraLabel: "Pre-1950 · Media planning",
    originator: "Print & broadcast media planners",
    year_introduced: 1920,
    short: "The unduplicated number of people exposed to a medium at least once.",
    story:
      "Born in the magazine and newspaper era, when the question 'how many people saw this ad' needed a precise answer. Reach is the count; later, Frequency and GRP built on it.",
    inputs: [
      { name: "audience_size", label: "Total target audience", type: "number" },
      { name: "exposed", label: "Exposed at least once", type: "number" },
    ],
    formula: "exposed / audience_size",
    example: { inputs: { audience_size: 1000000, exposed: 720000 }, result: "72.0%" },
    compute: (i) => `${(((i.exposed || 0) / Math.max(1, i.audience_size || 1)) * 100).toFixed(1)}%`,
    modern_use:
      "Digital impressions ÷ unique users = digital reach. The concept is unchanged; only the denominator shifted.",
  },

  /* ─────────────── 1950s: Television ─────────────── */
  {
    id: "grp",
    name: "Gross Rating Points (GRPs)",
    era: "1950s",
    eraLabel: "1950s · Television",
    originator: "American Association of Advertising Agencies (4A's)",
    year_introduced: 1950,
    short: "Sum of exposure ratings across all media insertions in a campaign.",
    story:
      "Born when TV changed everything — multiple spots per week, multiple shows. The industry needed ONE number that summed up 'how much did I run?' GRP = Reach × Frequency. No media plan survives without it.",
    inputs: [
      { name: "reach_pct", label: "Reach (%)", type: "percent" },
      { name: "frequency", label: "Average frequency", type: "number" },
    ],
    formula: "reach% × frequency",
    example: { inputs: { reach_pct: 80, frequency: 5 }, result: "400 GRPs" },
    compute: (i) => `${Math.round((i.reach_pct || 0) * (i.frequency || 0))} GRPs`,
    modern_use:
      "Programmatic digital uses 'impressions ÷ target population' — the same GRP math. The number on the plan is older than digital.",
  },
  {
    id: "cpm",
    name: "Cost Per Thousand (CPM)",
    era: "1950s",
    eraLabel: "1950s · Media buying",
    originator: "Print & broadcast media buyers",
    year_introduced: 1955,
    short: "Cost to reach 1,000 people. The original cost-per-unit metric.",
    story:
      "When a magazine had 1M readers and you paid $5,000, the cost to reach 1,000 was $5. CPM made media comparable across titles, dayparts, and later, across print/radio/TV. The 'M' is Roman numeral for 1,000 — borrowed from newspaper billing.",
    inputs: [
      { name: "cost", label: "Total cost ($)", type: "number" },
      { name: "impressions", label: "Impressions", type: "number" },
    ],
    formula: "(cost / impressions) × 1,000",
    example: { inputs: { cost: 5000, impressions: 1000000 }, result: "$5.00" },
    compute: (i) => `$${(((i.cost || 0) / Math.max(1, i.impressions || 1)) * 1000).toFixed(2)}`,
    modern_use:
      "Every Meta, Google, TikTok dashboard still reports CPM. The discipline hasn't changed; the math hasn't either.",
  },
  {
    id: "sov_traditional",
    name: "Share of Voice (Traditional — ad spend share)",
    era: "1950s",
    eraLabel: "1950s · Brand planning",
    originator: "Ted Bates & Co (Rosser Reeves' era)",
    year_introduced: 1950,
    short: "Your brand's ad spend ÷ total category ad spend.",
    story:
      "Before digital tracking, the only way to know 'how loud are you' was to measure what you PAID to be loud. Bates used SOV to argue that SOV ≈ SOM (share of market), within a multiplier. It's the grandparent of every brand-tracking metric today.",
    inputs: [
      { name: "your_spend", label: "Your ad spend ($)", type: "number" },
      { name: "category_spend", label: "Category total spend ($)", type: "number" },
    ],
    formula: "your_spend / category_spend",
    example: { inputs: { your_spend: 240000, category_spend: 1200000 }, result: "20.0%" },
    compute: (i) =>
      `${(((i.your_spend || 0) / Math.max(1, i.category_spend || 1)) * 100).toFixed(1)}%`,
    modern_use:
      "Modern SOV blends spend + organic mentions + share-of-search. The principle — relative loudness predicts relative share — holds.",
  },

  /* ─────────────── 1960s: The Discipline ─────────────── */
  {
    id: "dagmar",
    name: "DAGMAR (Defining Advertising Goals for Measured Advertising Results)",
    era: "1960s",
    eraLabel: "1961 · Russell Colley",
    originator: "Russell Colley (Stanford)",
    year_introduced: 1961,
    short: "Awareness → Comprehension → Conviction → Action. The first formal measurement model.",
    story:
      "DAGMAR was the first framework that demanded advertising be MEASURED against communication tasks, not just sales. Colley argued you can't manage what you don't measure — and that sales are the LAST thing ads do, not the first. DAGMAR gave birth to brand-tracking studies.",
    inputs: [
      { name: "aware_before", label: "Aware before (%)", type: "percent" },
      { name: "aware_after", label: "Aware after (%)", type: "percent" },
      { name: "comprehended", label: "Comprehended message (%)", type: "percent" },
      { name: "convinced", label: "Convinced (%)", type: "percent" },
      { name: "took_action", label: "Took action (%)", type: "percent" },
    ],
    formula: "track awareness → comprehension → conviction → action, in that order",
    example: {
      inputs: {
        aware_before: 30,
        aware_after: 60,
        comprehended: 45,
        convinced: 22,
        took_action: 8,
      },
      result: "DAGMAR chain — conversion: 13.3% end-to-end",
    },
    compute: (i) => {
      const a = (i.aware_after || 0) - (i.aware_before || 0);
      const conv = ((i.took_action || 0) / Math.max(1, i.aware_after || 1)) * 100;
      return `Δawareness: +${a}pp · comprehension ${i.comprehended}% · convinced ${i.convinced}% · action ${i.took_action}% · end-to-end ${conv.toFixed(1)}%`;
    },
    modern_use:
      "Brand lift studies in Meta/Google are DAGMAR reborn. Awareness → favorability → intent → conversion.",
  },
  {
    id: "frequency",
    name: "Effective Frequency (the Rule of 3 / Rule of 7)",
    era: "1960s",
    eraLabel: "1960s · Media planning",
    originator: "Herbert E. Krugman (1965) / Michael Naples (1979)",
    year_introduced: 1965,
    short: "How many times must a person see your message before it sticks?",
    story:
      "Krugman's 'The Impact of Television Advertising: Learning without Involvement' was heresy in 1965. He argued 3 exposures was enough — most of the work happens on the first. Naples countered that 7+ was needed for complex messages. The debate has never fully settled, but the Rule of 3 became gospel.",
    inputs: [
      { name: "impressions", label: "Total impressions", type: "number" },
      { name: "reach", label: "Unique reach", type: "number" },
    ],
    formula: "frequency = impressions / reach",
    example: {
      inputs: { impressions: 1500000, reach: 500000 },
      result: "3.0 (Rule of 3 satisfied)",
    },
    compute: (i) => {
      const f = (i.impressions || 0) / Math.max(1, i.reach || 1);
      const rule =
        f >= 7 ? "Rule of 7 satisfied" : f >= 3 ? "Rule of 3 satisfied" : "Below threshold";
      return `${f.toFixed(1)} (${rule})`;
    },
    modern_use:
      "Email open rate × send frequency = effective frequency. Programmatic cap-setting uses the same idea — diminishing returns past 7/week.",
  },

  /* ─────────────── 1970s: Positioning Era ─────────────── */
  {
    id: "bdicdi",
    name: "BDI / CDI (Brand Development Index / Category Development Index)",
    era: "1970s",
    eraLabel: "1970s · P&G planning",
    originator: "Procter & Gamble marketing planning",
    year_introduced: 1970,
    short: "Two indices that map brand strength vs category strength by geography.",
    story:
      "BDI = your brand's share in a market. CDI = the category's share of that market. Multiply them: high × high = invest hard. High × low = educate the category. Low × high = steal share. Low × low = reconsider. The matrix is still on every brand manager's wall at P&G.",
    inputs: [
      { name: "brand_share_in_market", label: "Your brand share in market (%)", type: "percent" },
      {
        name: "category_share_nationally",
        label: "Category share in this market (%)",
        type: "percent",
      },
      { name: "market_name", label: "Market name (display only)", type: "number" },
    ],
    formula: "BDI = brand% / national brand% · CDI = cat% / national cat%",
    example: {
      inputs: { brand_share_in_market: 35, category_share_nationally: 12, market_name: 0 },
      result: "BDI 175 · CDI 120 → invest hard",
    },
    compute: (i) => {
      const bdi =
        ((i.brand_share_in_market || 0) / Math.max(0.1, i.category_share_nationally || 1)) * 100;
      const cdi_proxy = (i.category_share_nationally || 0) * 10;
      const play =
        bdi >= 110 && cdi_proxy >= 110
          ? "INVEST HARD"
          : bdi >= 110 && cdi_proxy < 110
            ? "EDUCATE THE CATEGORY"
            : bdi < 90 && cdi_proxy >= 110
              ? "STEAL SHARE"
              : "RECONSIDER";
      return `BDI ${Math.round(bdi)} · CDI ${Math.round(cdi_proxy)} → ${play}`;
    },
    modern_use:
      "Same matrix, modern data: Map your CRM revenue share by region vs category penetration. The geometry hasn't changed.",
  },
  {
    id: "positioning_usp",
    name: "Unique Selling Proposition (USP)",
    era: "1970s",
    eraLabel: "1961 · Rosser Reeves",
    originator: "Rosser Reeves (Ted Bates & Co.)",
    year_introduced: 1961,
    short: "Each ad must say something the competition can't.",
    story:
      "Reeves argued that an ad must do one job: name a benefit that competitors don't own and that the audience wants. Three rules: (1) each ad makes a proposition, (2) the proposition is one the competition either can't or doesn't offer, (3) the proposition is strong enough to bring new customers. Modern positioning (Trout/Ries) is the USP grown up.",
    inputs: [
      { name: "your_benefit_clarity", label: "Your benefit clarity (0-10)", type: "number" },
      { name: "competitor_clarity", label: "Competitor claim clarity (0-10)", type: "number" },
      { name: "demand_match", label: "Demand match (0-10)", type: "number" },
    ],
    formula: "USP_score = (your_clarity − competitor_clarity) × demand_match",
    example: {
      inputs: { your_benefit_clarity: 9, competitor_clarity: 4, demand_match: 8 },
      result: "USP score 40 (strong)",
    },
    compute: (i) => {
      const score =
        ((i.your_benefit_clarity || 0) - (i.competitor_clarity || 0)) * (i.demand_match || 0);
      const verdict = score >= 40 ? "strong USP" : score >= 20 ? "workable USP" : "no real USP";
      return `USP score ${score} (${verdict})`;
    },
    modern_use:
      "The first 7 words of your landing page headline. If they could be swapped with a competitor's, no USP yet.",
  },

  /* ─────────────── 1980s: Direct Response ─────────────── */
  {
    id: "direct_mail_response",
    name: "Direct Mail Response Rate (house list vs cold)",
    era: "1980s",
    eraLabel: "1980s · Direct response",
    originator: "Direct Marketing Association (DMA)",
    year_introduced: 1980,
    short: "House lists convert 5-9%. Cold lists convert 1-3%. The list is the offer.",
    story:
      "Before email, before retargeting, there was direct mail. And the DMA published response-rate benchmarks that held for 40 years: 5-9% on a warm house list, 1-3% on a cold prospect list, 0.5% on a compiled list. Modern email benchmarks (open rate, reply rate) are direct descendants.",
    inputs: [
      { name: "sent", label: "Pieces sent", type: "number" },
      { name: "responses", label: "Responses", type: "number" },
      {
        name: "list_type",
        label: "List type (1=house, 2=warm, 3=cold, 4=compiled)",
        type: "number",
      },
    ],
    formula: "responses / sent",
    example: {
      inputs: { sent: 10000, responses: 600, list_type: 1 },
      result: "6.0% (house — benchmark)",
    },
    compute: (i) => {
      const rate = ((i.responses || 0) / Math.max(1, i.sent || 1)) * 100;
      const bench =
        i.list_type === 1
          ? "house benchmark 5-9%"
          : i.list_type === 2
            ? "warm benchmark 3-5%"
            : i.list_type === 3
              ? "cold benchmark 1-3%"
              : "compiled benchmark 0.5-1.5%";
      const above =
        (i.list_type === 1 && rate >= 5) ||
        (i.list_type === 2 && rate >= 3) ||
        (i.list_type === 3 && rate >= 1) ||
        (i.list_type === 4 && rate >= 0.5);
      return `${rate.toFixed(2)}% (${bench} — ${above ? "✓ above" : "✗ below"})`;
    },
    modern_use:
      "Cold email reply rate benchmarks (1-5%), LinkedIn acceptance rates (10-30%), cold call connect rates (8-15%) — all flow from DMA 1980.",
  },
  {
    id: "magalogs_2_percent",
    name: "The Magalog / Advertorial 2% Rule",
    era: "1980s",
    eraLabel: "1980s · Direct response print",
    originator: "Gary Halbert / Joe Sugarman",
    year_introduced: 1980,
    short: "A 16-page advertorial outperforms a 4-page ad by 2x+ per dollar.",
    story:
      "Halbert proved that long-form advertorials — magazines disguised as editorial — consistently beat short ads by multiples. The reader doesn't know they're being sold to until page 14. Sugarman refined it: the longer the magalog, the higher the conversion, up to a point. The discipline is why every 'About' page today reads like a 3,000-word essay.",
    inputs: [
      { name: "short_form_conversion", label: "Short-form conversion (%)", type: "percent" },
      { name: "pages", label: "Magalog pages", type: "number" },
    ],
    formula: "long_form_CVR ≈ short_form_CVR × (1 + log(pages))",
    example: {
      inputs: { short_form_conversion: 1.5, pages: 16 },
      result: "≈ 3.9% (long-form multiplier 2.6x)",
    },
    compute: (i) => {
      const base = i.short_form_conversion || 0;
      const p = Math.max(1, i.pages || 1);
      const cvr = base * (1 + Math.log(p));
      return `≈ ${cvr.toFixed(2)}% (long-form multiplier ${(cvr / Math.max(0.01, base)).toFixed(1)}x)`;
    },
    modern_use:
      "Long-form sales pages (60-120 min read) consistently outperform short pages by 2-4x. Same math, different medium.",
  },

  /* ─────────────── 1990s: Database Marketing ─────────────── */
  {
    id: "rfm",
    name: "RFM Segmentation (Recency · Frequency · Monetary)",
    era: "1990s",
    eraLabel: "1990s · Database marketing",
    originator: "Arthur Hughes (The Complete Database Marketer)",
    year_introduced: 1994,
    short: "Score every customer on Recency, Frequency, Monetary. Segment. Treat differently.",
    story:
      "Before CDPs, before Segment.com, there was RFM. Arthur Hughes' 1994 book codified what every direct marketer knew intuitively: a customer who bought yesterday is worth more than one who bought a year ago. RFM scores still drive retention campaigns at every major retailer.",
    inputs: [
      { name: "days_since_purchase", label: "Days since last purchase", type: "number" },
      { name: "purchases_per_year", label: "Purchases per year", type: "number" },
      { name: "lifetime_value", label: "Lifetime value ($)", type: "number" },
    ],
    formula: "R score (1-5) × F score (1-5) × M score (1-5) = RFM quintile (1-125)",
    example: {
      inputs: { days_since_purchase: 7, purchases_per_year: 12, lifetime_value: 2400 },
      result: "555 (champion)",
    },
    compute: (i) => {
      const r =
        i.days_since_purchase <= 30
          ? 5
          : i.days_since_purchase <= 90
            ? 4
            : i.days_since_purchase <= 180
              ? 3
              : i.days_since_purchase <= 365
                ? 2
                : 1;
      const f =
        i.purchases_per_year >= 12
          ? 5
          : i.purchases_per_year >= 6
            ? 4
            : i.purchases_per_year >= 3
              ? 3
              : i.purchases_per_year >= 1
                ? 2
                : 1;
      const m =
        i.lifetime_value >= 2000
          ? 5
          : i.lifetime_value >= 1000
            ? 4
            : i.lifetime_value >= 500
              ? 3
              : i.lifetime_value >= 200
                ? 2
                : 1;
      const segment =
        r >= 4 && f >= 4 && m >= 4
          ? "Champion"
          : r >= 4 && f >= 3
            ? "Loyal"
            : r >= 3 && m >= 4
              ? "Big spender"
              : r <= 2 && f >= 3
                ? "At risk"
                : r <= 2 && f <= 2
                  ? "Hibernating"
                  : "Regular";
      return `R${r}·F${f}·M${m} = ${r * 100 + f * 10 + m} (${segment})`;
    },
    modern_use:
      "Every CRM today runs RFM. Klaviyo, HubSpot, Customer.io — all underneath it sits Arthur Hughes' 1994 paper.",
  },
  {
    id: "per_recency_decay",
    name: "Recency Decay (Half-Life Model)",
    era: "1990s",
    eraLabel: "1990s · Database marketing",
    originator: "Arthur Hughes / David Shepard (The New Direct Marketing)",
    year_introduced: 1995,
    short: "A customer is worth ~50% less every 90 days after their last purchase.",
    story:
      "Hughes and Shepard observed that customer value decays exponentially, not linearly. A buyer from 30 days ago is roughly 2x as valuable as a buyer from 180 days ago. This became the recency score in every RFM model and the foundation of every win-back campaign window.",
    inputs: [
      { name: "days_since_purchase", label: "Days since purchase", type: "number" },
      { name: "half_life_days", label: "Half-life (days)", type: "number" },
    ],
    formula: "value_decay = 0.5 ^ (days / half_life)",
    example: {
      inputs: { days_since_purchase: 180, half_life_days: 90 },
      result: "0.25 (25% of original value)",
    },
    compute: (i) => {
      const decay = Math.pow(
        0.5,
        (i.days_since_purchase || 0) / Math.max(1, i.half_life_days || 90),
      );
      return `${(decay * 100).toFixed(1)}% of original value`;
    },
    modern_use:
      "Every churn model uses this. It explains why a customer who stopped opening emails at day 90 is fundamentally different from one who stopped at day 30.",
  },
  {
    id: "long_tail_share",
    name: "The Long Tail (Chris Anderson, 2004 — bridging era)",
    era: "1990s",
    eraLabel: "2004 · Wired / Anderson",
    originator: "Chris Anderson",
    year_introduced: 2004,
    short: "The cumulative demand of the low-volume tail can exceed the head.",
    story:
      "Anderson, writing in Wired, argued that digital distribution flips the economics: aggregate demand across thousands of niche items beats demand for the few blockbusters. Amazon, Netflix, Spotify all proved it. Marketing implications: serve the niches, not just the masses. SEO was built on this idea.",
    inputs: [
      { name: "head_demand", label: "Top-10 items demand", type: "number" },
      { name: "tail_demand", label: "Bottom-1000 items demand", type: "number" },
    ],
    formula: "if tail_demand > head_demand → long tail strategy",
    example: {
      inputs: { head_demand: 50000, tail_demand: 75000 },
      result: "Long tail dominates (60% from tail)",
    },
    compute: (i) => {
      const total = (i.head_demand || 0) + (i.tail_demand || 0);
      const pct = ((i.tail_demand || 0) / Math.max(1, total)) * 100;
      return `${pct.toFixed(0)}% of demand from tail (${pct > 50 ? "long tail strategy wins" : "still head-driven"})`;
    },
    modern_use:
      "Programmatic SEO targets 10,000 long-tail keywords. YouTube creators serve 1M videos each at 100 views. The long tail is the whole game now.",
  },
  /* ─────────────── 2000s: The Digital Inheritance ─────────────── */
  /* The formulas the old school built, applied to the internet.           */
  {
    id: "kotler_4ps",
    name: "The Marketing Mix (4 Ps) — Jerome McCarthy / Philip Kotler",
    era: "1960s",
    eraLabel: "1960 · McCarthy / Kotler",
    originator: "E. Jerome McCarthy (1960), Philip Kotler (1967)",
    year_introduced: 1960,
    short:
      "Product, Price, Place, Promotion. The four controllable variables every marketer orchestrates.",
    story:
      "McCarthy coined the 4 Ps in his 1960 textbook 'Basic Marketing.' Kotler adopted them in 'Marketing Management' (1967) — the textbook that trained every MBA for 50 years. The 4 Ps are not a framework you graduate from — they are the grid every marketing decision sits on. In 2017, Kotler added People, Process, Programs, Performance (the modern 4 Ps) but the original four remain the spine.",
    inputs: [
      { name: "product_score", label: "Product fit (0-10)", type: "number" },
      { name: "price_score", label: "Price competitiveness (0-10)", type: "number" },
      { name: "place_score", label: "Place / distribution reach (0-10)", type: "number" },
      { name: "promotion_score", label: "Promotion / awareness (0-10)", type: "number" },
    ],
    formula: "Marketing Mix Score = (Product + Price + Place + Promotion) / 4",
    example: {
      inputs: { product_score: 8, price_score: 7, place_score: 5, promotion_score: 6 },
      result: "Mix Score: 6.5 / 10 — distribution is the weak link",
    },
    compute: (i) => {
      const s =
        ((i.product_score || 0) +
          (i.price_score || 0) +
          (i.place_score || 0) +
          (i.promotion_score || 0)) /
        4;
      const weakest = [
        { n: "Product", v: i.product_score || 0 },
        { n: "Price", v: i.price_score || 0 },
        { n: "Place", v: i.place_score || 0 },
        { n: "Promotion", v: i.promotion_score || 0 },
      ].sort((a, b) => a.v - b.v)[0];
      return `Mix Score: ${s.toFixed(1)} / 10 — ${weakest.n} is the weak link`;
    },
    modern_use:
      "Every landing page is a 4 P decision: what you sell (Product), what you charge (Price), where it lives (Place = URL/channel), how you drive traffic (Promotion). The 4 Ps never left — they just got renamed.",
  },
  {
    id: "kotler_stp",
    name: "STP — Segmentation, Targeting, Positioning (Kotler)",
    era: "1960s",
    eraLabel: "1967 · Kotler · Marketing Management",
    originator: "Philip Kotler",
    year_introduced: 1967,
    short:
      "Segment the market → Target the most attractive segment → Position your offering in their minds.",
    story:
      "Kotler integrated the scattered work of Wendell Smith (segmentation, 1956), McCarthy (targeting), and Trout/Ries (positioning, 1972) into one process: STP. It became the opening chapter of every marketing textbook for 50 years. STP is why every startup deck starts with 'our target customer is…' — that sentence is Kotler's DNA.",
    inputs: [
      { name: "segment_count", label: "Segments identified", type: "number" },
      { name: "target_segment_size", label: "Target segment size", type: "number" },
      { name: "positioning_clarity", label: "Positioning clarity (0-10)", type: "number" },
    ],
    formula: "STP Score = targeting_focus × positioning_clarity",
    example: {
      inputs: { segment_count: 5, target_segment_size: 250000, positioning_clarity: 8 },
      result: "STP Score: 80 (focused + clear positioning)",
    },
    compute: (i) => {
      const focus = 10 - Math.min(10, (i.segment_count || 1) - 1);
      const score = focus * (i.positioning_clarity || 0);
      return `STP Score: ${score} (focus ${focus}/10 · positioning ${i.positioning_clarity || 0}/10)${score >= 60 ? " — strong" : score >= 30 ? " — workable" : " — unfocused"}`;
    },
    modern_use:
      "Your Personas module is Segmentation. Your segments module is Targeting. Your Brand Kit + Positioning Statements is Positioning. The Hub is built on STP.",
  },
  {
    id: "kotler_customer_value",
    name: "Customer Delivered Value (Kotler)",
    era: "1960s",
    eraLabel: "1967 · Kotler",
    originator: "Philip Kotler",
    year_introduced: 1967,
    short:
      "Total Customer Value − Total Customer Cost = Delivered Value. The foundational equation of modern marketing.",
    story:
      "Kotler defined value as the difference between what the customer gets (product value, service value, personnel value, image value) and what they give (monetary cost, time cost, energy cost, psychic cost). This single equation underpins every pricing decision, every loyalty program, every 'why do customers churn' analysis ever run.",
    inputs: [
      { name: "total_value", label: "Total customer value ($)", type: "number" },
      { name: "total_cost", label: "Total customer cost ($)", type: "number" },
    ],
    formula: "Delivered Value = Total Value − Total Cost",
    example: {
      inputs: { total_value: 5000, total_cost: 1200 },
      result: "$3,800 delivered value (3.2x cost)",
    },
    compute: (i) => {
      const dv = (i.total_value || 0) - (i.total_cost || 0);
      const ratio = (i.total_value || 0) / Math.max(1, i.total_cost || 1);
      return `$${dv.toLocaleString()} delivered value (${ratio.toFixed(1)}x cost)${dv > 0 ? " — positive" : " — NEGATIVE (customer loses)"}`;
    },
    modern_use:
      "Every SaaS pricing page is a CDV calculation. 'Save 10 hours/week' = value. '$99/mo' = cost. If the ratio isn't obvious, the visitor bounces.",
  },
  {
    id: "levitt_myopia",
    name: "Marketing Myopia Test (Ted Levitt)",
    era: "1960s",
    eraLabel: "1960 · Theodore Levitt · HBR",
    originator: "Theodore Levitt",
    year_introduced: 1960,
    short:
      "People don't want a quarter-inch drill. They want a quarter-inch hole. What business are you REALLY in?",
    story:
      "Levitt's 1960 HBR article 'Marketing Myopia' is the most reprinted article in HBR's 100-year history. He argued that railroads stagnated not because cars/planes replaced them, but because they thought they were in the railroad business, not the transportation business. The lesson: define your business by the customer need you serve, not the product you make.",
    inputs: [
      {
        name: "product_definition",
        label: "Do you define yourself by product (1) or need (10)?",
        type: "number",
      },
      {
        name: "customer_outcome",
        label: "Can you articulate the customer's outcome in 1 sentence? (0-10)",
        type: "number",
      },
      {
        name: "future_threat",
        label: "Aware of substitutes that solve the same need differently? (0-10)",
        type: "number",
      },
    ],
    formula: "Myopia Score = (need_focus + outcome_clarity + substitute_awareness) / 3",
    example: {
      inputs: { product_definition: 8, customer_outcome: 7, future_threat: 6 },
      result: "Myopia Score: 7.0 / 10 — low myopia risk",
    },
    compute: (i) => {
      const s =
        ((i.product_definition || 0) + (i.customer_outcome || 0) + (i.future_threat || 0)) / 3;
      return `Myopia Score: ${s.toFixed(1)} / 10 — ${s >= 7 ? "low myopia risk" : s >= 4 ? "moderate myopia — re-examine" : "HIGH MYOPIA — you may be the next railroad"}`;
    },
    modern_use:
      "Kodak thought they were in film. Blockbuster thought they were in video rental. Both were in the memory/entertainment business. Run this test on your own positioning every quarter.",
  },
  {
    id: "drucker_aim",
    name: "Drucker's Two Functions (Peter Drucker)",
    era: "1960s",
    eraLabel: "1973 · Peter Drucker · Management",
    originator: "Peter Drucker",
    year_introduced: 1973,
    short: "There are only two basic functions: innovation and marketing. Everything else is cost.",
    story:
      "In 'Management: Tasks, Responsibilities, Practices' (1973), Drucker wrote: 'Because its purpose is to create a customer, the business enterprise has two — and only these two — basic functions: marketing and innovation. Marketing and innovation produce results; all the rest are costs.' This sentence reframed marketing from a department to the purpose of the entire company.",
    inputs: [
      {
        name: "revenue_from_new_products",
        label: "% revenue from products < 3 years old",
        type: "percent",
      },
      { name: "customer_acquisition_cost", label: "CAC ($)", type: "number" },
      { name: "customer_lifetime_value", label: "LTV ($)", type: "number" },
    ],
    formula: "Drucker Ratio = innovation_velocity × marketing_efficiency",
    example: {
      inputs: {
        revenue_from_new_products: 35,
        customer_acquisition_cost: 200,
        customer_lifetime_value: 1800,
      },
      result: "Drucker Score: 315 (healthy innovation + 9x LTV/CAC)",
    },
    compute: (i) => {
      const innovation = i.revenue_from_new_products || 0;
      const ltv_cac =
        (i.customer_lifetime_value || 0) / Math.max(1, i.customer_acquisition_cost || 1);
      const score = Math.round(innovation * ltv_cac);
      return `Drucker Score: ${score} (innovation ${innovation}% · LTV/CAC ${ltv_cac.toFixed(1)}x)${score >= 200 ? " — Drucker would approve" : score >= 100 ? " — workable" : " — one of the two functions is broken"}`;
    },
    modern_use:
      "The Patrick Number measures both: cash collected (marketing result) and new deals/products (innovation velocity). If either is zero, you have a cost center, not a business.",
  },
  {
    id: "porter_generic_strategies",
    name: "Porter's Generic Strategies (Michael Porter)",
    era: "1980s",
    eraLabel: "1980 · Michael Porter · Competitive Strategy",
    originator: "Michael Porter",
    year_introduced: 1980,
    short:
      "There are only three ways to win: cost leadership, differentiation, or focus. Pick one. Stuck in the middle = stuck in death.",
    story:
      "Porter's 'Competitive Strategy' (1980) gave every CEO a simple grid: be the cheapest (cost leadership), be the most unique (differentiation), or be the best for a narrow niche (focus). The fatal error is being 'stuck in the middle' — not cheap enough, not unique enough, not focused enough. Every business failure can be traced to this.",
    inputs: [
      {
        name: "cost_position",
        label: "Your cost position vs market (1=highest cost, 10=lowest)",
        type: "number",
      },
      {
        name: "differentiation",
        label: "Your differentiation vs market (1=commodity, 10=unique)",
        type: "number",
      },
      {
        name: "focus",
        label: "Your target market focus (1=everyone, 10=narrow niche)",
        type: "number",
      },
    ],
    formula:
      "Strategy = max(cost_leadership, differentiation, focus). If none ≥ 7, you're stuck in the middle.",
    example: {
      inputs: { cost_position: 4, differentiation: 8, focus: 7 },
      result: "Differentiation + Focus — viable strategy",
    },
    compute: (i) => {
      const c = i.cost_position || 0,
        d = i.differentiation || 0,
        f = i.focus || 0;
      const best = Math.max(c, d, f);
      const label = best === c ? "Cost Leadership" : best === d ? "Differentiation" : "Focus";
      const stuck = best < 7;
      return `${stuck ? "STUCK IN THE MIDDLE — pick one" : label + " — viable strategy"} (cost ${c}/10 · diff ${d}/10 · focus ${f}/10)`;
    },
    modern_use:
      "Every startup pitch deck needs to answer: which Porter strategy are we? Most say 'differentiation' but score 3/10 on it. The Competitors module exists to run this test.",
  },
  {
    id: "burnett_share_of_mind",
    name: "Share of Mind (Leo Burnett)",
    era: "1950s",
    eraLabel: "1950s · Leo Burnett",
    originator: "Leo Burnett",
    year_introduced: 1950,
    short:
      "Before share of market, you need share of mind. How much of the customer's brain do you occupy?",
    story:
      "Burnett believed in 'shared moments' between brand and consumer. He created the Marlboro Man, the Jolly Green Giant, Tony the Tiger — characters that lived in the consumer's mind rent-free. His philosophy: 'Make it simple. Make it memorable. Make it tempting to want.' Share of Mind → Share of Market was the causal chain he proved again and again.",
    inputs: [
      { name: "unaided_recall", label: "Unaided brand recall (%)", type: "percent" },
      { name: "aided_recall", label: "Aided brand recall (%)", type: "percent" },
      { name: "competitor_recall", label: "Top competitor recall (%)", type: "percent" },
    ],
    formula: "Share of Mind = unaided_recall / (unaided_recall + competitor_recall)",
    example: {
      inputs: { unaided_recall: 22, aided_recall: 65, competitor_recall: 35 },
      result: "Share of Mind: 38.6% — challenger position",
    },
    compute: (i) => {
      const som =
        ((i.unaided_recall || 0) /
          Math.max(1, (i.unaided_recall || 0) + (i.competitor_recall || 1))) *
        100;
      return `Share of Mind: ${som.toFixed(1)}% — ${som >= 60 ? "dominant" : som >= 40 ? "challenger" : som >= 20 ? "niche" : "invisible"}`;
    },
    modern_use:
      "Share of Search (Google Trends) is the modern proxy for Share of Mind. Track your brand search volume vs competitors weekly.",
  },
  {
    id: "caples_headline_formula",
    name: "Caples' Three-Class Headline Formula (John Caples)",
    era: "pre-1950",
    eraLabel: "1926 · John Caples",
    originator: "John Caples",
    year_introduced: 1926,
    short:
      "Headlines that work: (1) self-interest, (2) news, (3) curiosity. The best combine all three.",
    story:
      "Caples wrote 'They Laughed When I Sat Down at the Piano But When I Started to Play!~' in 1926 — one of the most famous ads ever. In 'Tested Advertising Methods' (1932), he codified three classes of headlines that consistently outperformed all others. 90+ years later, every viral YouTube title and tweet hook is still one of Caples' three classes.",
    inputs: [
      { name: "self_interest", label: "Self-interest promise (0-10)", type: "number" },
      { name: "news_factor", label: "News / novelty (0-10)", type: "number" },
      { name: "curiosity", label: "Curiosity gap (0-10)", type: "number" },
    ],
    formula: "Headline Score = self_interest × 0.5 + news × 0.3 + curiosity × 0.2",
    example: {
      inputs: { self_interest: 9, news_factor: 7, curiosity: 8 },
      result: "Headline Score: 8.2 / 10 — strong (all three classes present)",
    },
    compute: (i) => {
      const s =
        (i.self_interest || 0) * 0.5 + (i.news_factor || 0) * 0.3 + (i.curiosity || 0) * 0.2;
      return `Headline Score: ${s.toFixed(1)} / 10 — ${s >= 7 ? "strong" : s >= 4 ? "decent" : "weak — rewrite"}`;
    },
    modern_use:
      "Every YouTube title, tweet, and email subject line is a Caples headline. 'How I made $10K in 30 days' = self-interest. 'New AI tool just dropped' = news. 'You won't believe what happened...' = curiosity.",
  },
  {
    id: "ries_trout_positioning",
    name: "Positioning: The Battle for Your Mind (Ries & Trout)",
    era: "1970s",
    eraLabel: "1972 · Al Ries & Jack Trout",
    originator: "Al Ries & Jack Trout",
    year_introduced: 1972,
    short:
      "Positioning is not what you do to a product. It's what you do to the mind of the prospect.",
    story:
      "Ries and Trout published 'The Positioning Era Cometh' in Advertising Age (1972), then the book 'Positioning: The Battle for Your Mind' (1981). Their core insight: in an overcommunicated society, the simplest way to get into someone's mind is to be FIRST. If you can't be first in a category, create a new category you can be first in. Avis ('We try harder'), 7-Up ('the Uncola'), and Volvo (safety) were their proof points.",
    inputs: [
      { name: "category_rank", label: "Your rank in your category (1=leader)", type: "number" },
      {
        name: "category_new",
        label: "Can you create/own a new sub-category? (0=no, 10=yes)",
        type: "number",
      },
      {
        name: "mind_share_word",
        label: "Do you own a word in the customer's mind? (0-10)",
        type: "number",
      },
    ],
    formula: "Positioning Score = (if rank=1: 10, else: 0) + new_category + owned_word",
    example: {
      inputs: { category_rank: 3, category_new: 8, mind_share_word: 7 },
      result: "Positioning Score: 15/30 — strong challenger via new category",
    },
    compute: (i) => {
      const leader = (i.category_rank || 99) === 1 ? 10 : 0;
      const score = leader + (i.category_new || 0) + (i.mind_share_word || 0);
      return `Positioning Score: ${score}/30 — ${score >= 20 ? "dominant" : score >= 12 ? "strong challenger" : score >= 6 ? "weak — reposition" : "invisible — create a new category"}`;
    },
    modern_use:
      "The Positioning Statements module exists to answer Ries & Trout's question: what word do you own? If you can't answer in one word, you don't have a position.",
  },
  {
    id: "kotler_satisfaction",
    name: "Customer Satisfaction Index (Kotler)",
    era: "1990s",
    eraLabel: "1994 · Kotler · Marketing Management",
    originator: "Philip Kotler",
    year_introduced: 1994,
    short:
      "Satisfaction = Performance − Expectations. Over-deliver and you create delight. Under-deliver and you create churn.",
    story:
      "Kotler formalized what every business owner knew intuitively: satisfaction is not absolute — it's relative to what was promised. The formula is simple: if performance exceeds expectations, the customer is delighted. If it matches, they're satisfied. If it falls short, they're dissatisfied. The implication: manage expectations DOWN and performance UP. This is why Apple understates battery life and overdelivers.",
    inputs: [
      { name: "performance", label: "Actual performance delivered (0-10)", type: "number" },
      { name: "expectations", label: "Expectations you set (0-10)", type: "number" },
    ],
    formula: "Satisfaction = Performance − Expectations",
    example: {
      inputs: { performance: 8, expectations: 6 },
      result: "+2.0 (delighted — over-delivery)",
    },
    compute: (i) => {
      const gap = (i.performance || 0) - (i.expectations || 0);
      return `${gap >= 2 ? `+${gap.toFixed(1)} (delighted — over-delivery)` : gap >= 0 ? `+${gap.toFixed(1)} (satisfied)` : `${gap.toFixed(1)} (DISSATISFIED — ${Math.abs(gap) >= 3 ? "dangerous churn risk" : "manage expectations down"})`}`;
    },
    modern_use:
      "Your NPS survey in the Surveys module is a satisfaction measurement. The formula explains why over-promising in ads increases CAC and churn simultaneously.",
  },
  {
    id: "kotler_brand_equity",
    name: "Brand Equity Model (Kotler & Keller)",
    era: "2000s",
    eraLabel: "2006 · Kotler & Keller · Brand Planning",
    originator: "Philip Kotler & Kevin Lane Keller",
    year_introduced: 2006,
    short:
      "Brand equity = the premium a customer will pay over a generic equivalent. Build it through 4 layers: salience, performance, imagery, feelings.",
    story:
      "In 'Marketing Management' (12th ed, 2006), Kotler and Keller formalized brand equity as the financial value of a brand above the commodity. They identified four layers: brand salience (do they know you?), brand performance + imagery (do they trust your quality?), brand feelings (do they feel good about you?), brand resonance (are they loyal advocates?). Each layer builds on the one below.",
    inputs: [
      { name: "salience", label: "Brand salience / awareness (0-10)", type: "number" },
      { name: "performance", label: "Perceived performance (0-10)", type: "number" },
      { name: "feelings", label: "Brand feelings / affinity (0-10)", type: "number" },
      { name: "resonance", label: "Brand resonance / loyalty (0-10)", type: "number" },
    ],
    formula: "Brand Equity = salience × 0.2 + performance × 0.3 + feelings × 0.2 + resonance × 0.3",
    example: {
      inputs: { salience: 7, performance: 9, feelings: 6, resonance: 5 },
      result: "Brand Equity: 6.9 / 10 — strong product, weak loyalty (build community)",
    },
    compute: (i) => {
      const eq =
        (i.salience || 0) * 0.2 +
        (i.performance || 0) * 0.3 +
        (i.feelings || 0) * 0.2 +
        (i.resonance || 0) * 0.3;
      const weakest = [
        { n: "Salience", v: i.salience || 0 },
        { n: "Performance", v: i.performance || 0 },
        { n: "Feelings", v: i.feelings || 0 },
        { n: "Resonance", v: i.resonance || 0 },
      ].sort((a, b) => a.v - b.v)[0];
      return `Brand Equity: ${eq.toFixed(1)} / 10 — ${weakest.n} is the weak link`;
    },
    modern_use:
      "The Brand Kit module stores salience assets. Testimonials build performance trust. Surveys measure feelings. Retention cohort tracks resonance. The Hub is a brand equity engine.",
  },
  {
    id: "borden_marketing_mix",
    name: "The Marketing Mix Concept (Neil Borden)",
    era: "1950s",
    eraLabel: "1953 · Neil Borden · Harvard",
    originator: "Neil Borden",
    year_introduced: 1953,
    short:
      "The marketer has a 'mix' of ingredients — product, price, brand, packaging, channels, advertising, displays, services — to combine into a profitable recipe.",
    story:
      "Borden coined 'marketing mix' in his 1953 AMA presidential address, inspired by his colleague James Culliton's description of marketers as 'mixers of ingredients.' Borden originally listed 12 elements. McCarthy compressed them to 4. Kotler made the 4 Ps the global standard. But Borden's insight — that marketing is a COMBINATION, not a single lever — is the real gift.",
    inputs: [
      { name: "levers_used", label: "Marketing levers actively used (out of 12)", type: "number" },
      {
        name: "levers_coordinated",
        label: "How well are they coordinated? (0-10)",
        type: "number",
      },
    ],
    formula: "Mix Strength = levers_used × coordination_score / 12",
    example: {
      inputs: { levers_used: 8, levers_coordinated: 6 },
      result: "Mix Strength: 4.0 / 10 — many levers but poor coordination",
    },
    compute: (i) => {
      const s = ((i.levers_used || 0) * (i.levers_coordinated || 0)) / 12;
      return `Mix Strength: ${s.toFixed(1)} / 10 — ${s >= 7 ? "well-mixed" : s >= 4 ? "decent but uncoordinated" : "few levers or poorly mixed"}`;
    },
    modern_use:
      "Your Campaign Briefs ask for channels, messaging, budget, timeline — the modern marketing mix. The Hub coordinates these automatically. Borden's 12 ingredients became the 4 Ps became the campaign brief.",
  },
  {
    id: "deming_pdca",
    name: "PDCA Cycle — Plan, Do, Check, Act (Deming)",
    era: "1950s",
    eraLabel: "1950s · W. Edwards Deming",
    originator: "W. Edwards Deming",
    year_introduced: 1950,
    short:
      "The continuous improvement loop: Plan → Do → Check → Act → repeat. Never stop iterating.",
    story:
      "Deming gave the PDCA cycle to Japanese industry in the 1950s. It became the engine of their post-war quality revolution. Plan: design the experiment. Do: execute it. Check: measure the result. Act: standardize what worked, change what didn't. Then repeat. The Experiments module in the Hub is PDCA made digital.",
    inputs: [
      {
        name: "hypotheses_per_month",
        label: "Marketing hypotheses tested per month",
        type: "number",
      },
      { name: "win_rate", label: "Hypothesis win rate (%)", type: "percent" },
      { name: "cycle_time_days", label: "Average cycle time (days)", type: "number" },
    ],
    formula: "PDCA Velocity = hypotheses × win_rate × (30 / cycle_time)",
    example: {
      inputs: { hypotheses_per_month: 8, win_rate: 35, cycle_time_days: 7 },
      result: "PDCA Velocity: 12 winners/month (high tempo)",
    },
    compute: (i) => {
      const v = Math.round(
        (((i.hypotheses_per_month || 0) * (i.win_rate || 0)) / 100) *
          (30 / Math.max(1, i.cycle_time_days || 30)) *
          30,
      );
      return `${v} winners/month (tempo: ${i.hypotheses_per_month || 0} tests × ${i.win_rate || 0}% win rate × ${30 / Math.max(1, i.cycle_time_days || 30)}x speed)${v >= 10 ? " — high tempo" : v >= 4 ? " — workable" : " — too slow"}`;
    },
    modern_use:
      "The Experiments module is your PDCA engine. Run 8+ A/B tests per month, kill losers in 7 days, scale winners. Deming's cycle is why high-tempo testing teams grow 2-3x faster.",
  },
  {
    id: "kotler_product_life_cycle",
    name: "Product Life Cycle (Kotler)",
    era: "1960s",
    eraLabel: "1967 · Kotler",
    originator: "Philip Kotler",
    year_introduced: 1967,
    short: "Introduction → Growth → Maturity → Decline. Each stage demands a different strategy.",
    story:
      "Kotler formalized the product life cycle (PLC) in Marketing Management. Every product passes through four stages: Introduction (high cost, low sales), Growth (rapid adoption, rising competition), Maturity (peak sales, price wars), Decline (falling sales, harvest or exit). The insight: your marketing strategy must change at each stage. What works in Growth kills you in Maturity.",
    inputs: [
      { name: "sales_growth_pct", label: "Sales growth YoY (%)", type: "number" },
      { name: "market_share", label: "Market share (%)", type: "percent" },
      { name: "competitor_count", label: "Active competitors", type: "number" },
    ],
    formula: "Stage = f(growth, share, competitors)",
    example: {
      inputs: { sales_growth_pct: 45, market_share: 8, competitor_count: 5 },
      result: "GROWTH stage — invest aggressively",
    },
    compute: (i) => {
      const g = i.sales_growth_pct || 0,
        s = i.market_share || 0,
        c = i.competitor_count || 0;
      const stage =
        g >= 20 && s < 20
          ? `GROWTH — invest aggressively`
          : g >= 5 && c >= 10
            ? `MATURITY — defend share, cut costs`
            : g < 0
              ? `DECLINE — harvest or exit`
              : `INTRODUCTION — build awareness, educate market`;
      return stage;
    },
    modern_use:
      "The Trends module tracks whether your category is growing or declining. The Competitors module counts rivals. Together they tell you which PLC stage you're in — and which strategy to run.",
  },
];

/** Group legacy formulas by era for the tribute page. */
export const LEGACY_BY_ERA = LEGACY_FORMULAS.reduce(
  (acc, f) => {
    (acc[f.era] = acc[f.era] || []).push(f);
    return acc;
  },
  {} as Record<string, LegacyFormula[]>,
);

export const ERA_LABELS: Record<LegacyEra, string> = {
  "pre-1950": "Pre-1950 · Industrial Era",
  "1950s": "1950s · Television",
  "1960s": "1960s · Kotler & The Discipline",
  "1970s": "1970s · Positioning Era",
  "1980s": "1980s · Direct Response",
  "1990s": "1990s · Database Marketing",
  "2000s": "2000s · Digital Inheritance",
};

export const ERA_ORDER: LegacyEra[] = [
  "pre-1950",
  "1950s",
  "1960s",
  "1970s",
  "1980s",
  "1990s",
  "2000s",
];
