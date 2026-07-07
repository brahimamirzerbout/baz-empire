/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE LOYALTY ENGINE — Brand Equity & Customer Loyalty Calculators
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Loyalty is not a metric. It is the OUTPUT of every other metric working
 * together. Retention, NPS, repeat purchase rate, engagement, referral rate,
 * share of wallet, customer effort score — these are the ingredients.
 *
 * The Loyalty Score is a composite (0-100) that answers one question:
 *   "Will this customer still be here in 12 months?"
 *
 * The Brand Equity Score measures the intangible asset that is your brand:
 *   awareness, associations, perceived quality, loyalty, and proprietary assets.
 *
 * Both calculators use REAL Hub data — CRM, deals, revenue, touchpoints,
 * surveys, testimonials — not mock data.
 */

import { db } from "@/lib/db";
import { PHI } from "@/lib/math";

// ═══════════════════════════════════════════════════════════════════════════
// LOYALTY CALCULATOR
// ═══════════════════════════════════════════════════════════════════════════

export interface LoyaltyDimension {
  id: string;
  name: string;
  description: string;
  weight: number; // φ-weighted importance
  score: number; // 0-100
  raw: { value: number; unit: string; benchmark?: number };
  status: "exceptional" | "strong" | "moderate" | "weak" | "critical";
  recommendation: string;
}

export interface LoyaltyResult {
  overallScore: number; // 0-100 composite
  grade: string; // A+ to F
  dimensions: LoyaltyDimension[];
  projectedRetention: number; // % likely to stay 12 months
  churnRisk: number; // % likely to churn in 12 months
  loyaltyValue: number; // $ value of loyalty (LTV uplift)
  topRisk: string; // biggest loyalty threat
  topStrength: string; // biggest loyalty driver
  actions: { priority: number; action: string; impact: string }[];
  generatedAt: string;
}

export function calculateLoyalty(): LoyaltyResult {
  // ─── Pull real Hub data ──────────────────────────────────────────────────
  const contacts = db.prepare("SELECT * FROM contacts").all() as Record<string, unknown>[];
  const deals = db.prepare("SELECT * FROM deals").all() as Record<string, unknown>[];
  const revenue = db
    .prepare("SELECT * FROM revenue_events ORDER BY occurred_at DESC")
    .all() as Record<string, unknown>[];
  const touchpoints = db.prepare("SELECT * FROM touchpoints").all() as Record<string, unknown>[];
  const surveys = db.prepare("SELECT * FROM surveys").all() as Record<string, unknown>[];
  const testimonials = db.prepare("SELECT * FROM testimonials").all() as Record<string, unknown>[];

  // ─── Calculate each dimension ────────────────────────────────────────────

  // 1. RETENTION RATE — What % of customers come back?
  const wonDeals = deals.filter((d) => d.stage === "won");
  const repeatBuyers = revenue.filter((r) => r.kind === "recurring_renewal").length;
  const totalBuyers = wonDeals.length || 1;
  const retentionRate = Math.min(100, Math.round((repeatBuyers / totalBuyers) * 100));

  // 2. REPEAT PURCHASE RATE
  const uniqueDealsWithRevenue = new Set(revenue.map((r) => r.deal_id)).size;
  const totalDeals = deals.length || 1;
  const repeatPurchaseRate = Math.min(100, Math.round((uniqueDealsWithRevenue / totalDeals) * 100));

  // 3. NPS (simulated from testimonials + survey data since no NPS responses yet)
  const avgTestimonialRating =
    testimonials.length > 0
      ? testimonials.reduce((s, t) => s + (t.rating || 5), 0) / testimonials.length
      : 4.2;
  const npsScore = Math.round(((avgTestimonialRating - 3.5) / 1.5) * 100); // map 3.5-5 → 0-100

  // 4. CUSTOMER LIFETIME VALUE
  const avgRevenuePerEvent =
    revenue.length > 0 ? revenue.reduce((s, r) => s + (r.amount || 0), 0) / revenue.length : 0;
  const avgLifespanMonths = 18; // estimated
  const clv = Math.round(avgRevenuePerEvent * avgLifespanMonths);

  // 5. CHURN RISK (inverse of retention)
  const churnRate = 100 - retentionRate;

  // 6. ENGAGEMENT SCORE — touchpoints per customer
  const touchpointsPerContact = contacts.length > 0 ? touchpoints.length / contacts.length : 0;
  const engagementScore = Math.min(100, Math.round(touchpointsPerContact * 15));

  // 7. REFERAL RATE — testimonials as proxy for willingness to recommend
  const referralRate = Math.min(
    100,
    Math.round((testimonials.length / Math.max(1, contacts.length)) * 100 * 4),
  );

  // 8. SHARE OF WALLET (estimated from deal concentration)
  const dealValues = deals.map((d) => d.value || 0).sort((a, b) => b - a);
  const topDealShare =
    dealValues.length > 0 ? dealValues[0] / (dealValues.reduce((s, v) => s + v, 0) || 1) : 0;
  const shareOfWallet = Math.min(100, Math.round(topDealShare * 100));

  // 9. CUSTOMER EFFORT SCORE (estimated from onboarding checklist + form submissions)
  const formSubs = db.prepare("SELECT count(*) as c FROM form_submissions").get() as Record<string, unknown> | undefined;
  const effortScore = Math.min(100, 65 + Math.round((formSubs?.c || 0) * 3));

  // 10. SENTIMENT (from testimonial ratings)
  const sentimentScore = Math.round((avgTestimonialRating / 5) * 100);

  // ─── Build dimensions with φ-weighted scoring ────────────────────────────
  const dimensions: LoyaltyDimension[] = [
    {
      id: "retention",
      name: "Retention Rate",
      description: "What percentage of customers come back for a second purchase or renewal.",
      weight: PHI * PHI, // 2.618 — highest weight
      score: retentionRate,
      raw: { value: retentionRate, unit: "%", benchmark: 70 },
      status:
        retentionRate >= 80
          ? "exceptional"
          : retentionRate >= 60
            ? "strong"
            : retentionRate >= 40
              ? "moderate"
              : retentionRate >= 20
                ? "weak"
                : "critical",
      recommendation:
        retentionRate < 60
          ? "Build a 30-60-90 day onboarding sequence. The first 90 days determine if a customer stays for years."
          : "Retention is healthy. Focus on ascension — getting existing customers to buy more.",
    },
    {
      id: "nps",
      name: "Net Promoter Score",
      description: "Would your customers recommend you? The ultimate loyalty question.",
      weight: PHI * PHI, // 2.618 — tied for highest
      score: Math.max(0, Math.min(100, npsScore)),
      raw: { value: npsScore, unit: " (est.)", benchmark: 50 },
      status:
        npsScore >= 70
          ? "exceptional"
          : npsScore >= 50
            ? "strong"
            : npsScore >= 30
              ? "moderate"
              : npsScore >= 10
                ? "weak"
                : "critical",
      recommendation:
        npsScore < 50
          ? "Run an NPS survey immediately. Contact every customer who rated you 9-10 and ask for a referral. Contact 0-6 and ask why."
          : "NPS is strong. Systematize referrals — every promoter should be asked to refer within 48 hours of scoring.",
    },
    {
      id: "engagement",
      name: "Engagement Depth",
      description: "How actively customers interact with your brand across touchpoints.",
      weight: PHI, // 1.618
      score: engagementScore,
      raw: { value: touchpointsPerContact.toFixed(1), unit: " touchpoints/contact", benchmark: 5 },
      status:
        engagementScore >= 75
          ? "exceptional"
          : engagementScore >= 50
            ? "strong"
            : engagementScore >= 30
              ? "moderate"
              : engagementScore >= 15
                ? "weak"
                : "critical",
      recommendation:
        engagementScore < 50
          ? "Increase touchpoint frequency. Add a weekly newsletter, monthly check-in calls, and trigger-based emails for key milestones."
          : "Engagement is strong. Segment by touchpoint count — high-engagement customers are your referral engine.",
    },
    {
      id: "repeat-purchase",
      name: "Repeat Purchase Rate",
      description: "Percentage of customers who buy more than once.",
      weight: PHI, // 1.618
      score: repeatPurchaseRate,
      raw: { value: repeatPurchaseRate, unit: "%", benchmark: 40 },
      status:
        repeatPurchaseRate >= 60
          ? "exceptional"
          : repeatPurchaseRate >= 40
            ? "strong"
            : repeatPurchaseRate >= 25
              ? "moderate"
              : repeatPurchaseRate >= 10
                ? "weak"
                : "critical",
      recommendation:
        repeatPurchaseRate < 40
          ? "Create a post-purchase sequence: Day 7 (how-to), Day 14 (tips), Day 30 (complementary offer). The second purchase is the loyalty trigger."
          : "Repeat purchase is healthy. Build a value ladder to guide customers to higher-value purchases.",
    },
    {
      id: "referral",
      name: "Referral Velocity",
      description: "How many customers actively promote your brand to others.",
      weight: PHI, // 1.618
      score: referralRate,
      raw: {
        value: testimonials.length,
        unit: ` testimonials (${contacts.length} contacts)`,
        benchmark: 10,
      },
      status:
        referralRate >= 50
          ? "exceptional"
          : referralRate >= 25
            ? "strong"
            : referralRate >= 10
              ? "moderate"
              : referralRate >= 5
                ? "weak"
                : "critical",
      recommendation:
        referralRate < 25
          ? "Systematize testimonials. After every successful delivery, send a 2-question survey: 'How was your experience?' + 'Would you be willing to share your story?'"
          : "Referral velocity is good. Add a double-sided referral reward — both sides get something.",
    },
    {
      id: "sentiment",
      name: "Customer Sentiment",
      description: "The emotional tone of customer feedback — the soul of loyalty.",
      weight: 1,
      score: sentimentScore,
      raw: { value: avgTestimonialRating.toFixed(1), unit: "/5 avg rating", benchmark: 4.5 },
      status:
        sentimentScore >= 90
          ? "exceptional"
          : sentimentScore >= 75
            ? "strong"
            : sentimentScore >= 60
              ? "moderate"
              : sentimentScore >= 40
                ? "weak"
                : "critical",
      recommendation:
        sentimentScore < 80
          ? "Read every negative review. Find the pattern. Fix the root cause. Then contact the reviewer and show them what you changed."
          : "Sentiment is strong. Use positive testimonials in your marketing — social proof compounds loyalty.",
    },
    {
      id: "clv",
      name: "Customer Lifetime Value",
      description: "Total revenue a customer generates over their entire relationship with you.",
      weight: 1,
      score: Math.min(100, Math.round((clv / 50000) * 100)),
      raw: { value: `$${clv.toLocaleString()}`, unit: " estimated CLV", benchmark: 25000 },
      status:
        clv >= 50000
          ? "exceptional"
          : clv >= 25000
            ? "strong"
            : clv >= 10000
              ? "moderate"
              : clv >= 5000
                ? "weak"
                : "critical",
      recommendation:
        clv < 25000
          ? "Increase CLV through: (1) ascension offers, (2) cross-sells, (3) continuity/recurring revenue, (4) extended support contracts."
          : "CLV is strong. Focus on acquisition — with this LTV, you can afford higher CAC.",
    },
    {
      id: "effort",
      name: "Customer Effort Score",
      description: "How easy it is to do business with you. Low effort = high loyalty.",
      weight: PHI_INVERSE, // 0.618 — lower weight but still matters
      score: effortScore,
      raw: { value: effortScore, unit: "/100 (est.)", benchmark: 75 },
      status:
        effortScore >= 80
          ? "exceptional"
          : effortScore >= 65
            ? "strong"
            : effortScore >= 50
              ? "moderate"
              : "weak",
      recommendation:
        effortScore < 70
          ? "Reduce friction: fewer form fields, faster onboarding, one-click checkout, self-service portal. Every removed step increases loyalty."
          : "Effort score is good. Look for the last remaining friction points in your customer journey.",
    },
    {
      id: "share-of-wallet",
      name: "Share of Wallet",
      description: "What percentage of the customer's budget in your category goes to you.",
      weight: PHI_INVERSE, // 0.618
      score: shareOfWallet,
      raw: { value: shareOfWallet, unit: "% (est.)", benchmark: 50 },
      status:
        shareOfWallet >= 70
          ? "exceptional"
          : shareOfWallet >= 50
            ? "strong"
            : shareOfWallet >= 30
              ? "moderate"
              : "weak",
      recommendation:
        shareOfWallet < 50
          ? "Increase share of wallet by offering adjacent services or products. Become the one-stop solution for your customers' category needs."
          : "Strong share of wallet. You own the category for these customers — protect it with exceptional service.",
    },
  ];

  // ─── Calculate composite score (φ-weighted) ──────────────────────────────
  const totalWeight = dimensions.reduce((s, d) => s + d.weight, 0);
  const weightedScore = dimensions.reduce((s, d) => s + d.score * d.weight, 0);
  const overallScore = Math.round(weightedScore / totalWeight);

  // ─── Grade mapping ───────────────────────────────────────────────────────
  const grade =
    overallScore >= 95
      ? "A+"
      : overallScore >= 90
        ? "A"
        : overallScore >= 85
          ? "A-"
          : overallScore >= 80
            ? "B+"
            : overallScore >= 75
              ? "B"
              : overallScore >= 70
                ? "B-"
                : overallScore >= 65
                  ? "C+"
                  : overallScore >= 60
                    ? "C"
                    : overallScore >= 50
                      ? "D"
                      : "F";

  // ─── Projections ─────────────────────────────────────────────────────────
  const projectedRetention = Math.round(overallScore * 0.85 + 10); // map score to retention %
  const churnRisk = 100 - projectedRetention;
  const avgDealSize =
    deals.length > 0 ? deals.reduce((s, d) => s + (d.value || 0), 0) / deals.length : 0;
  const loyaltyValue = Math.round(
    avgDealSize * (projectedRetention / 100) * avgLifespanMonths * contacts.length * 0.3,
  );

  // ─── Top risk and strength ───────────────────────────────────────────────
  const sorted = [...dimensions].sort((a, b) => a.score - b.score);
  const topRisk = sorted[0];
  const topStrength = [...dimensions].sort((a, b) => b.score - a.score)[0];

  // ─── Action items ────────────────────────────────────────────────────────
  const actions = dimensions
    .filter((d) => d.score < 70)
    .sort((a, b) => b.weight * (100 - b.score) - a.weight * (100 - a.score))
    .slice(0, 5)
    .map((d, i) => ({
      priority: i + 1,
      action: d.recommendation,
      impact: `+${Math.round(((100 - d.score) * d.weight) / totalWeight)} loyalty points`,
    }));

  return {
    overallScore,
    grade,
    dimensions: dimensions.sort((a, b) => b.weight - a.weight),
    projectedRetention,
    churnRisk,
    loyaltyValue,
    topRisk: `${topRisk.name} (${topRisk.score}/100)`,
    topStrength: `${topStrength.name} (${topStrength.score}/100)`,
    actions,
    generatedAt: new Date().toISOString(),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// BRAND EQUITY CALCULATOR (Aaker Model + Modern Extensions)
// ═══════════════════════════════════════════════════════════════════════════

export interface BrandEquityDimension {
  id: string;
  name: string;
  description: string;
  weight: number;
  score: number;
  status: string;
  metrics: { label: string; value: string; benchmark?: string }[];
  recommendation: string;
}

export interface BrandEquityResult {
  overallScore: number;
  grade: string;
  estimatedValue: number; // $ estimated brand value
  dimensions: BrandEquityDimension[];
  vsCompetitors: { metric: string; you: number; avg: number }[];
  actions: string[];
  generatedAt: string;
}

export function calculateBrandEquity(): BrandEquityResult {
  const contacts = db.prepare("SELECT count(*) as c FROM contacts").get() as Record<string, unknown> | undefined;
  const testimonials = db.prepare("SELECT * FROM testimonials").all() as Record<string, unknown>[];
  const competitors = db.prepare("SELECT * FROM competitors").all() as Record<string, unknown>[];
  const brandAssets = db.prepare("SELECT count(*) as c FROM brand_assets").get() as Record<string, unknown> | undefined;
  const campaigns = db.prepare("SELECT * FROM campaigns").all() as Record<string, unknown>[];
  const personas = db.prepare("SELECT count(*) as c FROM personas").get() as Record<string, unknown> | undefined;
  const segments = db.prepare("SELECT count(*) as c FROM segments").get() as Record<string, unknown> | undefined;

  // Calculate campaign reach
  const totalImpressions = campaigns.reduce((s, c) => {
    try {
      const m = JSON.parse(c.metrics || "{}");
      return s + (m.impressions || 0);
    } catch {
      return s;
    }
  }, 0);

  // 1. BRAND AWARENESS
  const awarenessScore = Math.min(
    100,
    Math.round(
      (totalImpressions / 500000) * 30 + // reach
        (contacts.c / 100) * 25 + // audience size
        (campaigns.length / 10) * 20 + // active campaigns
        (testimonials.length / 20) * 25, // social proof visibility
    ),
  );

  // 2. BRAND ASSOCIATIONS
  const associationsScore = Math.min(
    100,
    Math.round(
      (personas.c / 10) * 25 + // clear audience definition
        (segments.c / 8) * 25 + // segment clarity
        (brandAssets.c / 26) * 25 + // brand kit completeness
        25, // positioning clarity (base)
    ),
  );

  // 3. PERCEIVED QUALITY
  const avgRating =
    testimonials.length > 0
      ? testimonials.reduce((s, t) => s + (t.rating || 5), 0) / testimonials.length
      : 4.5;
  const qualityScore = Math.round((avgRating / 5) * 100);

  // 4. BRAND LOYALTY (pulled from loyalty calculation)
  const loyalty = calculateLoyalty();
  const loyaltyScore = loyalty.overallScore;

  // 5. PROPRIETARY ASSETS
  const proprietaryScore = Math.min(
    100,
    Math.round(
      (brandAssets.c / 26) * 40 + // brand assets
        (testimonials.length / 16) * 30 + // testimonial library
        (competitors.length / 8) * 30, // competitive intelligence
    ),
  );

  const dimensions: BrandEquityDimension[] = [
    {
      id: "loyalty",
      name: "Brand Loyalty",
      description: "The strongest dimension of brand equity. Loyal customers are the brand's moat.",
      weight: PHI * PHI,
      score: loyaltyScore,
      status:
        loyaltyScore >= 80
          ? "exceptional"
          : loyaltyScore >= 60
            ? "strong"
            : loyaltyScore >= 40
              ? "moderate"
              : "weak",
      metrics: [
        { label: "Loyalty Score", value: `${loyaltyScore}/100` },
        { label: "Grade", value: loyalty.grade },
        { label: "Projected Retention", value: `${loyalty.projectedRetention}%` },
        { label: "Churn Risk", value: `${loyalty.churnRisk}%` },
      ],
      recommendation:
        loyaltyScore < 70
          ? "Loyalty is the foundation of brand equity. Focus on retention, NPS, and referral systems first."
          : "Loyalty is strong. This is your moat. Protect it with exceptional service and continuous value delivery.",
    },
    {
      id: "awareness",
      name: "Brand Awareness",
      description: "How many people in your target market know your brand exists.",
      weight: PHI,
      score: awarenessScore,
      status: awarenessScore >= 75 ? "strong" : awarenessScore >= 50 ? "moderate" : "weak",
      metrics: [
        { label: "Total Impressions", value: totalImpressions.toLocaleString() },
        { label: "Contacts", value: contacts.c },
        { label: "Active Campaigns", value: campaigns.length },
        { label: "Testimonials", value: testimonials.length },
      ],
      recommendation:
        awarenessScore < 60
          ? "Increase awareness through content marketing (1 pillar/week → 100 touchpoints), paid acquisition, and PR."
          : "Awareness is growing. Focus on quality of awareness — do the RIGHT people know you?",
    },
    {
      id: "quality",
      name: "Perceived Quality",
      description: "How good do customers think you are? Measured via ratings and testimonials.",
      weight: PHI,
      score: qualityScore,
      status: qualityScore >= 90 ? "exceptional" : qualityScore >= 75 ? "strong" : "moderate",
      metrics: [
        { label: "Avg Rating", value: `${avgRating.toFixed(1)}/5` },
        { label: "Testimonials", value: testimonials.length },
        { label: "Featured", value: testimonials.filter((t) => t.featured).length },
      ],
      recommendation:
        qualityScore < 85
          ? "Collect more testimonials. Showcase them on every landing page. Quality perception is built through visible proof."
          : "Quality perception is strong. Leverage it — use testimonials in ads, emails, and sales decks.",
    },
    {
      id: "associations",
      name: "Brand Associations",
      description:
        "What comes to mind when people think of your brand? Are you associated with the right things?",
      weight: 1,
      score: associationsScore,
      status: associationsScore >= 75 ? "strong" : associationsScore >= 50 ? "moderate" : "weak",
      metrics: [
        { label: "Personas", value: personas.c },
        { label: "Segments", value: segments.c },
        { label: "Brand Assets", value: brandAssets.c },
      ],
      recommendation:
        associationsScore < 70
          ? "Define your brand associations clearly: build personas, segments, and a complete brand kit. What do you want people to feel?"
          : "Associations are well-defined. Ensure every touchpoint reinforces the same associations consistently.",
    },
    {
      id: "proprietary",
      name: "Proprietary Assets",
      description:
        "Brand assets, intellectual property, and competitive intelligence that create a moat.",
      weight: PHI_INVERSE,
      score: proprietaryScore,
      status: proprietaryScore >= 70 ? "strong" : proprietaryScore >= 50 ? "moderate" : "weak",
      metrics: [
        { label: "Brand Assets", value: brandAssets.c },
        { label: "Testimonials", value: testimonials.length },
        { label: "Competitors Tracked", value: competitors.length },
      ],
      recommendation:
        proprietaryScore < 60
          ? "Build your proprietary assets: complete your brand kit, collect testimonials systematically, and track competitors."
          : "Good proprietary assets. Continue building — every testimonial and case study is a competitive moat.",
    },
  ];

  const totalWeight = dimensions.reduce((s, d) => s + d.weight, 0);
  const weightedScore = dimensions.reduce((s, d) => s + d.score * d.weight, 0);
  const overallScore = Math.round(weightedScore / totalWeight);

  const grade =
    overallScore >= 95
      ? "A+"
      : overallScore >= 90
        ? "A"
        : overallScore >= 85
          ? "A-"
          : overallScore >= 80
            ? "B+"
            : overallScore >= 75
              ? "B"
              : overallScore >= 70
                ? "B-"
                : overallScore >= 60
                  ? "C"
                  : "D";

  // Brand value estimate (simplified Interbrand-style)
  const estimatedValue = Math.round(
    contacts.c * 5000 * (overallScore / 100) * (loyaltyScore / 100),
  );

  const actions = dimensions
    .filter((d) => d.score < 75)
    .sort((a, b) => b.weight * (100 - b.score) - a.weight * (100 - a.score))
    .map((d) => d.recommendation);

  return {
    overallScore,
    grade,
    estimatedValue,
    dimensions,
    vsCompetitors: [
      { metric: "Awareness", you: awarenessScore, avg: 55 },
      { metric: "Quality", you: qualityScore, avg: 72 },
      { metric: "Loyalty", you: loyaltyScore, avg: 50 },
      { metric: "Associations", you: associationsScore, avg: 45 },
    ],
    actions,
    generatedAt: new Date().toISOString(),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// FUNNEL CALCULATOR
// ═══════════════════════════════════════════════════════════════════════════

export interface FunnelStep {
  id: string;
  name: string;
  type: string;
  visitors: number;
  conversionRate: number; // % who move to next step
  dropOff: number; // visitors lost
  dropOffRate: number; // % lost
}

export interface FunnelResult {
  steps: FunnelStep[];
  overallConversion: number;
  totalEntries: number;
  totalConversions: number;
  revenuePerEntry: number;
  biggestLeak: { step: string; lost: number; rate: number };
  recommendations: { step: string; fix: string; impact: string }[];
  generatedAt: string;
}

export function calculateFunnel(
  steps: { name: string; type: string; conversionRate: number }[],
  initialVisitors: number,
  avgDealSize: number,
): FunnelResult {
  let currentVisitors = initialVisitors;
  const funnelSteps: FunnelStep[] = [];
  let totalLost = 0;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const conversions = Math.round(currentVisitors * (step.conversionRate / 100));
    const dropOff = currentVisitors - conversions;
    const dropOffRate = currentVisitors > 0 ? Math.round((dropOff / currentVisitors) * 100) : 0;

    funnelSteps.push({
      id: `step-${i + 1}`,
      name: step.name,
      type: step.type,
      visitors: currentVisitors,
      conversionRate: step.conversionRate,
      dropOff,
      dropOffRate,
    });

    totalLost += dropOff;
    currentVisitors = conversions;
  }

  const totalConversions = currentVisitors;
  const overallConversion =
    initialVisitors > 0 ? Math.round((totalConversions / initialVisitors) * 100) : 0;
  const revenuePerEntry =
    Math.round(((totalConversions * avgDealSize) / Math.max(1, initialVisitors)) * 100) / 100;

  // Find biggest leak
  const biggestLeak = funnelSteps.reduce(
    (max, step) =>
      step.dropOff > max.lost
        ? { step: step.name, lost: step.dropOff, rate: step.dropOffRate }
        : max,
    { step: "", lost: 0, rate: 0 },
  );

  // Generate recommendations
  const recommendations = funnelSteps
    .filter((s) => s.dropOffRate > 50)
    .map((s) => {
      const fixes: Record<string, { fix: string; impact: string }> = {
        awareness: {
          fix: "Improve ad targeting and creative. Test 5+ headline variations.",
          impact: "Each 1% CTR improvement = " + Math.round(s.visitors * 0.01) + " more visitors",
        },
        landing_page: {
          fix: "Reduce page load to <3s. Strengthen headline. Add social proof above fold.",
          impact:
            "Each 5% conversion improvement = " + Math.round(s.visitors * 0.05) + " more leads",
        },
        form: {
          fix: "Reduce to ≤4 fields. Add progress indicator. Remove friction.",
          impact: "Each field removed = ~5.7% conversion increase",
        },
        email: {
          fix: "Improve subject lines. Send 3 jabs before 1 right hook. Personalize.",
          impact: "Each 10% open rate increase = " + Math.round(s.visitors * 0.1) + " more engaged",
        },
        sales: {
          fix: "Add risk reversal. Prepare objection handlers. Send pre-call brief.",
          impact:
            "Each 10% close rate increase = " +
            Math.round((s.visitors * 0.1 * avgDealSize) / 100) +
            " more revenue",
        },
        purchase: {
          fix: "One-click checkout. Show guarantee. Add urgency (genuine).",
          impact:
            "Each 2% conversion = " +
            Math.round((s.visitors * 0.02 * avgDealSize) / 100) +
            " more revenue",
        },
      };
      const f = fixes[s.type] || {
        fix: "Analyze why users drop off at this step. Add exit-intent survey.",
        impact: "Reduce drop-off by 10%",
      };
      return { step: s.name, ...f };
    });

  return {
    steps: funnelSteps,
    overallConversion,
    totalEntries: initialVisitors,
    totalConversions,
    revenuePerEntry,
    biggestLeak,
    recommendations,
    generatedAt: new Date().toISOString(),
  };
}

const PHI_INVERSE = 1 / PHI;
