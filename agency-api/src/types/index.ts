/**
 * Decoupled domain input/output types. Services accept these plain shapes
 * (not Prisma rows) so they stay pure, deterministic, and unit-testable.
 * Controllers map Prisma rows → these (handling JSON-array serialization).
 */

export interface AdMetricInput {
  channel: string;
  budgetSpent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
}

export interface InfluencerInput {
  id: number;
  name: string;
  platform: string;
  handle: string;
  followers: number;
  engagementRate: number;
  costPerPost: number;
  categories: string[];
}

export interface BudgetReallocation {
  channel: string;
  currentBudget: number;
  suggestedBudget: number;
  roas: number;
  action: "INCREASE" | "DECREASE" | "HOLD";
  reason: string;
}

export interface SeoAuditResult {
  score: number;
  keywordDensity: number;
  issues: string[];
  recommendations: string[];
}

export interface InfluencerMatch {
  influencer: InfluencerInput;
  matchScore: number; // 0–100
  estimatedReach: number;
  expectedCostPerEngagement: number;
}

/* ── Web Performance (WebPerfService) — dominator: Increasio / Tridence / BAZ doctrine ── */

export interface WebPerfBudget {
  targetLcpMs: number;
  current: {
    ttfb: number;            // server response time (ms)
    renderBlockingJs: number; // render-blocking JS/CSS (ms)
    imageLoad: number;        // LCP image load (ms)
    fontLoad: number;         // web font load (ms)
    clientJs: number;         // client JS hydration (ms)
  };
}

export interface LcpAllocation {
  targetLcpMs: number;
  allocations: {
    ttfb: number;
    renderBlockingJs: number;
    imageLoad: number;
    fontLoad: number;
    clientJs: number;
  };
  projectedLcpMs: number;
  pass: boolean;
  overageMs: number;
  worstLever: string;
  recommendations: string[];
}

export interface CwvMetric {
  metric: "lcp" | "inp" | "cls";
  p75: number; // 75th-percentile field value
}

/* ── Media Buying (MediaService) — dominator: WPP Media / Publicis Media / Horizon ── */

export interface MediaChannel {
  channel: string;
  cpm: number;          // cost per thousand impressions
  audienceSize: number; // reachable unique users
  maxSpend?: number;    // optional cap per channel
}

export interface MediaMixAllocation {
  channel: string;
  cpm: number;
  spend: number;
  impressions: number;
  reach: number;
}

export interface MediaMixResult {
  channels: MediaMixAllocation[];
  totalSpend: number;
  totalImpressions: number;
  blendedCpm: number;
  estimatedReach: number;
}

/* ── E-commerce (CommerceService) — dominator: Fuel Made / BVA — break-even ROAS ── */

export interface CommerceInput {
  productPrice: number;      // average order value (AOV)
  costOfGoods: number;       // COGS per order
  adSpend: number;           // period ad spend
  shippingHandling: number;  // per-order fulfillment cost
  transactionFeeRate: number;// platform/payment fee as decimal (e.g. 0.029 + 0.03)
  orders: number;            // orders in period
}

export interface CommerceResult {
  contributionMarginPct: number; // (price - COGS - fees - shipping) / price
  contributionPerOrder: number;
  breakEvenRoas: number;         // 1 / contributionMarginPct
  actualRoas: number;            // revenue / adSpend
  revenue: number;
  grossProfit: number;
  netProfit: number;             // grossProfit - adSpend
  profitable: boolean;
  forecastRevenue: number;       // projected from AOV × orders × growthRate
  verdict: string;
}

/* ── Dialog/Outreach (OutreachService) — dominator: ORRJO — demand-before-outbound ── */

export interface OutreachSequence {
  steps: number;                 // number of touches
  channels: string[];            // email, linkedin, phone, sms
  warmMarket: boolean;           // demand-gen ran before outbound (ORRJO 90% show)
  deliverabilityScore: number;   // 0–100 (SPF/DKIM/DMARC + warmup + rotation)
  personalizationLevel: "template" | "signal" | "hyper-personal";
  prospectCount: number;
}

export interface OutreachForecast {
  estimatedReplyRate: number;    // decimal (0–1)
  estimatedReplies: number;
  estimatedMeetingRate: number;  // reply→meeting conversion
  estimatedMeetings: number;
  estimatedShowRate: number;      // meeting→attended (ORRJO 90% w/ warm market)
  estimatedAttended: number;
  signal: string;
}

/* ── Inbound (LeadScoringService) — dominator: ORRJO 15-signal / 100-pt model ── */

export interface LeadSignal {
  fitScore: number;        // 0–50: ICP match (industry, size, role)
  engagementScore: number; // 0–30: content/website/email engagement
  intentScore: number;     // 0–20: buying signals (funding, hiring, tech change)
}

export interface LeadScoreResult {
  totalScore: number;       // 0–100
  tier: "A" | "B" | "C";
  readyForSales: boolean;
  recommendedAction: string;
}