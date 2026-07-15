/**
 * Unit tests for the 3 domain algorithms — plain Node `assert`, no test
 * framework needed. Run: `npm run test:services`
 */
import assert from "node:assert/strict";
import { PerformanceService } from "../src/services/performance.service";
import { SeoService } from "../src/services/seo.service";
import { InfluencerService } from "../src/services/influencer.service";
import { WebPerfService } from "../src/services/webperf.service";
import { MediaService } from "../src/services/media.service";
import { CommerceService } from "../src/services/commerce.service";
import { OutreachService } from "../src/services/outreach.service";
import { LeadScoringService } from "../src/services/leadscoring.service";
import type { AdMetricInput, InfluencerInput, WebPerfBudget, CwvMetric, MediaChannel, CommerceInput, OutreachSequence, LeadSignal } from "../src/types";

let passed = 0;
const ok = (name: string) => { passed++; console.log(`  ✓ ${name}`); };

/* ── PerformanceService ── */
(function testPerformance() {
  const metrics: AdMetricInput[] = [
    { channel: "Google Ads", budgetSpent: 5000, impressions: 220000, clicks: 8800, conversions: 410, revenue: 28000 },
    { channel: "Meta Ads", budgetSpent: 4000, impressions: 310000, clicks: 6200, conversions: 180, revenue: 9000 },
    { channel: "TikTok Ads", budgetSpent: 3000, impressions: 540000, clicks: 4100, conversions: 42, revenue: 2100 },
  ];

  const result = PerformanceService.calculateOptimalBudgets(metrics, 12000);
  assert.equal(result.length, 3, "returns one row per channel");

  // total suggested ≈ totalAvailableBudget
  const total = result.reduce((s, r) => s + r.suggestedBudget, 0);
  assert.ok(Math.abs(total - 12000) < 1, `sum of suggestions ≈ budget (got ${total})`);

  // Google has the highest ROAS → INCREASE
  const google = result.find((r) => r.channel === "Google Ads")!;
  assert.equal(google.action, "INCREASE", "Google (highest ROAS) → INCREASE");
  assert.ok(google.roas > 5, `Google ROAS ~5.6 (got ${google.roas})`);
  ok("performance: ROAS-weighted reallocation sums to budget + flags top channel INCREASE");

  // empty input
  assert.equal(PerformanceService.calculateOptimalBudgets([], 1000).length, 0);
  ok("performance: empty metrics → empty result");

  // negative budget throws
  assert.throws(() => PerformanceService.calculateOptimalBudgets(metrics, -1));
  ok("performance: negative budget throws");
})();

/* ── SeoService ── */
(function testSeo() {
  const body = "An agency connects brands with the right talent for campaigns, runways and editorial work. " +
    "Choosing the right partner means working with professionals who understand casting, contracts and production. " +
    "This directory explains every agency type so models and brands can make informed decisions before they book. " +
    "From branding to performance, each discipline plays a distinct role in the modern marketing stack. " +
    "A strong partner will align your visual identity with your commercial goals and deliver measurable reach across channels.";
  const goodHtml = `<html><head><title>Best Fashion Agency | Model Directory</title></head>
    <body><h1>Fashion Agency Guide</h1><p>${body}</p>
    <img src="a.jpg" alt="model on runway"><img src="b.jpg" alt="studio shoot"></body></html>`;
  const r1 = SeoService.analyzePage(goodHtml, "fashion agency");
  assert.ok(r1.score >= 90, `good page scores high (got ${r1.score})`);
  assert.equal(r1.issues.length, 0, "no issues on a clean page");
  ok("seo: clean page with h1/title/alt → score >= 90, 0 issues");

  const badHtml = `<html><body><p>random content</p><img src="x.jpg"><img src="y.jpg"></body></html>`;
  const r2 = SeoService.analyzePage(badHtml, "nonexistentkeyword");
  assert.ok(r2.score < 60, `bad page scores low (got ${r2.score})`);
  assert.ok(r2.issues.some((i) => i.includes("H1")), "flags missing H1");
  assert.ok(r2.issues.some((i) => i.includes("title")), "flags missing title");
  assert.ok(r2.issues.some((i) => i.includes("alt")), "flags missing alt tags");
  assert.ok(r2.recommendations.length >= r2.issues.length, "every issue has a recommendation");
  ok("seo: broken page → low score, flags H1 + title + alt, recommendations provided");

  // stuffing
  const stuffed = `<html><head><title>x</title></head><body><h1>x</h1><p>${"shoes ".repeat(120)}</p></body></html>`;
  const r3 = SeoService.analyzePage(stuffed, "shoes");
  assert.ok(r3.keywordDensity > 4, `stuffing detected (density ${r3.keywordDensity}%)`);
  assert.ok(r3.issues.some((i) => i.includes("stuffing")), "flags keyword stuffing");
  ok("seo: keyword stuffing detected and penalised");

  assert.throws(() => SeoService.analyzePage("", "kw"));
  assert.throws(() => SeoService.analyzePage("x", ""));
  ok("seo: invalid inputs throw");
})();

/* ── InfluencerService ── */
(function testInfluencer() {
  const pool: InfluencerInput[] = [
    { id: 1, name: "Lina Vogue", platform: "Instagram", handle: "@lina", followers: 480000, engagementRate: 0.062, costPerPost: 3200, categories: ["fashion", "beauty"] },
    { id: 2, name: "Cheap Charl", platform: "TikTok", handle: "@charl", followers: 60000, engagementRate: 0.012, costPerPost: 300, categories: ["fashion"] },
    { id: 3, name: "Nadia Luxe", platform: "Instagram", handle: "@nadia", followers: 1500000, engagementRate: 0.018, costPerPost: 18000, categories: ["luxury"] },
  ];

  const matches = InfluencerService.calculateMatches(pool, ["fashion"], 5000);
  // Nadia (18000) filtered out by budget; Charl low-engagement penalised
  assert.equal(matches.length, 2, "budget filter removes over-budget influencer");

  // Lina should rank above Charl (category + high engagement + good efficiency)
  assert.equal(matches[0].influencer.handle, "@lina", "Lina ranks #1");
  assert.ok(matches[0].matchScore > matches[1].matchScore, "sorted descending by score");
  assert.ok(matches[0].matchScore >= 90, `Lina score high (got ${matches[0].matchScore})`);
  assert.ok(matches[1].matchScore < matches[0].matchScore, "Charl scored lower (low engagement)");
  ok("influencer: budget filter + category/engagement scoring → correct ranking");

  // estimated reach = followers * engagementRate
  const lina = matches.find((m) => m.influencer.handle === "@lina")!;
  assert.equal(lina.estimatedReach, Math.round(480000 * 0.062), "estimatedReach = followers × engagement");
  ok("influencer: estimatedReach math correct");

  // empty target categories
  const m2 = InfluencerService.calculateMatches(pool, [], 5000);
  assert.equal(m2.length, 2, "no category filter still respects budget");
  ok("influencer: empty targetCategories handled");

  assert.throws(() => InfluencerService.calculateMatches(pool, ["x"], -1));
  ok("influencer: negative budget throws");
})();

/* ── WebPerfService (dominator: Increasio / BAZ doctrine — CWV by contract) ── */
(function testWebPerf() {
  const budget: WebPerfBudget = {
    targetLcpMs: 1500, // BAZ doctrine floor
    current: { ttfb: 800, renderBlockingJs: 400, imageLoad: 1200, fontLoad: 200, clientJs: 600 },
  };
  const r = WebPerfService.allocateLcpBudget(budget);
  assert.equal(Object.keys(r.allocations).length, 5, "allocates across 5 contributors");
  const sumAlloc = Object.values(r.allocations).reduce((s, n) => s + n, 0);
  assert.ok(sumAlloc > 0 && sumAlloc <= 1500 * 5, `allocations bounded (sum ${sumAlloc})`);
  assert.equal(typeof r.projectedLcpMs, "number");
  assert.equal(typeof r.pass, "boolean");
  assert.ok(r.recommendations.length > 0, "always returns recommendations");
  // imageLoad is the worst lever (1200 vs 800 ceiling) → recommended
  assert.ok(r.recommendations.some((rec) => rec.includes("LCP image")), "flags image as worst lever");
  ok("webperf: LCP budget allocates across 5 contributors + flags worst lever");

  // CWV scoring — BAZ doctrine: LCP floor 1500ms (stricter than Google 2500)
  const metrics: CwvMetric[] = [
    { metric: "lcp", p75: 1400 }, // passes BAZ floor
    { metric: "inp", p75: 180 },  // passes
    { metric: "cls", p75: 0.08 }, // passes
  ];
  const score = WebPerfService.scoreCwv(metrics);
  assert.equal(score.passRate, 100, "all-green → 100% pass rate");
  assert.equal(score.passed, 3);
  ok("webperf: all-green CWV → 100% pass rate (BAZ sub-1.5s LCP floor)");

  const fail: CwvMetric[] = [
    { metric: "lcp", p75: 2800 }, // fails even Google's 2.5s
    { metric: "inp", p75: 250 },  // fails
    { metric: "cls", p75: 0.05 }, // passes
  ];
  const score2 = WebPerfService.scoreCwv(fail);
  assert.equal(score2.passRate, 33, "1/3 pass → 33%");
  assert.equal(score2.passed, 1);
  ok("webperf: 2/3 failing → 33% pass rate");

  assert.throws(() => WebPerfService.allocateLcpBudget({ ...budget, targetLcpMs: 0 }));
  ok("webperf: zero target throws");
})();

/* ── MediaService (dominator: WPP Media / Publicis Media — CPM-min mix) ── */
(function testMedia() {
  const channels: MediaChannel[] = [
    { channel: "CTV", cpm: 35, audienceSize: 4000000, maxSpend: 30000 },
    { channel: "Display", cpm: 8, audienceSize: 2000000, maxSpend: 15000 },
    { channel: "Social", cpm: 12, audienceSize: 3000000 },
  ];
  const r = MediaService.optimizeMix(channels, 50000);
  assert.equal(r.channels.length, 3);
  assert.equal(r.totalSpend, 50000, "spends the full budget");
  assert.ok(r.totalImpressions > 0, "impressions > 0");
  assert.ok(r.blendedCpm > 0 && r.blendedCpm < 35, `blended CPM below the dearest channel (got ${r.blendedCpm})`);
  assert.ok(r.estimatedReach > 0, "reach > 0");
  // Greedy should favour the cheapest CPM (Display $8) up to its cap before dearer ones
  const display = r.channels.find((c) => c.channel === "Display")!;
  assert.ok(display.spend >= 15000 || display.spend === 50000, "Display (cheapest) hit its cap or soaked the budget first");
  ok("media: greedy CPM-min mix spends full budget, favours cheapest channel, blended CPM under dearest");

  // empty input
  const empty = MediaService.optimizeMix([], 1000);
  assert.equal(empty.channels.length, 0);
  assert.equal(empty.blendedCpm, 0);
  ok("media: empty channels → empty result");

  assert.throws(() => MediaService.optimizeMix(channels, -1));
  ok("media: negative budget throws");
})();

/* ── CommerceService (dominator: Fuel Made / BVA — break-even ROAS) ── */
(function testCommerce() {
  // Healthy DTC unit: $60 AOV, $20 COGS, 2.9%+$0.30 fees, $5 shipping, 1000 orders, $15k spend
  const input: CommerceInput = {
    productPrice: 60,
    costOfGoods: 20,
    adSpend: 15000,
    shippingHandling: 5,
    transactionFeeRate: 0.029,
    orders: 1000,
  };
  const r = CommerceService.analyze(input);
  // contribution = 60 - 20 - (60*0.029) - 5 = 60 - 20 - 1.74 - 5 = 33.26
  assert.ok(r.contributionPerOrder > 33 && r.contributionPerOrder < 34, `contribution/order ~33.26 (got ${r.contributionPerOrder})`);
  // contribution margin ~55%
  assert.ok(r.contributionMarginPct > 53 && r.contributionMarginPct < 57, `margin ~55% (got ${r.contributionMarginPct})`);
  // break-even ROAS = 1/0.55 ≈ 1.8
  assert.ok(r.breakEvenRoas > 1.7 && r.breakEvenRoas < 2.0, `break-even ROAS ~1.8 (got ${r.breakEvenRoas})`);
  // revenue = 60*1000 = 60000; actual ROAS = 60000/15000 = 4.0 → profitable
  assert.equal(r.revenue, 60000);
  assert.ok(r.actualRoas >= 3.9, `actual ROAS ~4.0 (got ${r.actualRoas})`);
  assert.equal(r.profitable, true, "4.0 ROAS > 1.8 break-even → profitable");
  assert.ok(r.verdict.includes("Profitable"), "verdict says profitable + scale");
  ok("commerce: break-even ROAS + contribution margin → profitable verdict + scale signal");

  // Unprofitable: same unit, $50k spend, only 500 orders
  const bad = CommerceService.analyze({ ...input, adSpend: 50000, orders: 500 });
  // revenue 30000, ROAS 0.6 < 1.8 → unprofitable
  assert.equal(bad.profitable, false);
  assert.ok(bad.verdict.includes("Unprofitable"), "flags unprofitable + gap");
  ok("commerce: ROAS below break-even → unprofitable verdict + gap");

  // Negative margin (COGS > price)
  const neg = CommerceService.analyze({ ...input, costOfGoods: 70 });
  assert.equal(neg.breakEvenRoas, -1, "negative margin → break-even -1 (infinity sentinel)");
  assert.ok(neg.verdict.includes("unit economics"), "flags unit economics before spend");
  ok("commerce: negative contribution margin → blocks paid spend");

  assert.throws(() => CommerceService.analyze({ ...input, productPrice: 0 }));
  ok("commerce: zero price throws");
})();

/* ── OutreachService (dominator: ORRJO — demand-before-outbound, 90% show) ── */
(function testOutreach() {
  // Warm, signal-based, multi-channel, good deliverability → strong
  const warm: OutreachSequence = {
    steps: 4,
    channels: ["email", "linkedin", "phone"],
    warmMarket: true,
    deliverabilityScore: 85,
    personalizationLevel: "signal",
    prospectCount: 1000,
  };
  const r = OutreachService.forecast(warm);
  assert.ok(r.estimatedReplyRate > 8, `warm+signal reply > 8% (got ${r.estimatedReplyRate}%)`);
  assert.equal(r.estimatedShowRate, 90, "warm market → 90% show rate (ORRJO)");
  assert.ok(r.estimatedAttended > 0, "attended > 0");
  assert.ok(r.signal.includes("Strong"), "strong signal verdict");
  ok("outreach: warm+signal+multi-channel → >8% reply, 90% show, strong verdict");

  // Cold, template, single channel, poor deliverability → weak
  const cold: OutreachSequence = {
    steps: 1,
    channels: ["email"],
    warmMarket: false,
    deliverabilityScore: 30,
    personalizationLevel: "template",
    prospectCount: 1000,
  };
  const r2 = OutreachService.forecast(cold);
  assert.ok(r2.estimatedReplyRate < 3, `cold+template+poor-deliv reply < 3% (got ${r2.estimatedReplyRate}%)`);
  assert.equal(r2.estimatedShowRate, 75, "cold → 75% show rate (Bridge Group bench)");
  assert.ok(r2.signal.includes("Weak"), "weak signal verdict");
  ok("outreach: cold+template+poor-deliverability → <3% reply, 75% show, weak verdict");

  // Warm lifts reply vs cold (~35%)
  assert.ok(r.estimatedReplyRate > r2.estimatedReplyRate, "warm > cold reply rate");
  ok("outreach: warm-market multiplier lifts reply rate");

  assert.throws(() => OutreachService.forecast({ ...warm, prospectCount: -1 }));
  assert.throws(() => OutreachService.forecast({ ...warm, steps: 0 }));
  ok("outreach: invalid inputs throw");
})();

/* ── LeadScoringService (dominator: ORRJO 100-pt / 15-signal model) ── */
(function testLeadScoring() {
  // Tier A: high fit + engagement + intent
  const a = LeadScoringService.score({ fitScore: 45, engagementScore: 25, intentScore: 18 });
  assert.equal(a.totalScore, 88);
  assert.equal(a.tier, "A");
  assert.equal(a.readyForSales, true);
  assert.ok(a.recommendedAction.includes("48h"), "Tier A → book within 48h");
  ok("lead-score: 88 → Tier A, sales-ready, book-within-48h");

  // Tier B: mid
  const b = LeadScoringService.score({ fitScore: 30, engagementScore: 15, intentScore: 8 });
  assert.equal(b.totalScore, 53);
  assert.equal(b.tier, "B");
  assert.equal(b.readyForSales, false);
  assert.ok(b.recommendedAction.includes("Nurture"), "Tier B → nurture");
  ok("lead-score: 53 → Tier B, nurture");

  // Tier C: low
  const c = LeadScoringService.score({ fitScore: 10, engagementScore: 5, intentScore: 2 });
  assert.equal(c.totalScore, 17);
  assert.equal(c.tier, "C");
  assert.equal(c.readyForSales, false);
  assert.ok(c.recommendedAction.includes("Disqualify"), "Tier C → disqualify");
  ok("lead-score: 17 → Tier C, disqualify");

  // Batch: returns Tier A only, sorted desc
  const batch = LeadScoringService.scoreBatch([
    { fitScore: 45, engagementScore: 25, intentScore: 18 }, // 88 A
    { fitScore: 10, engagementScore: 5, intentScore: 2 },   // 17 C
    { fitScore: 40, engagementScore: 20, intentScore: 15 }, // 75 A
  ]);
  assert.equal(batch.length, 2, "only Tier A returned");
  assert.equal(batch[0].totalScore, 88, "sorted descending");
  assert.equal(batch[1].totalScore, 75);
  ok("lead-score: batch returns Tier A only, sorted descending");

  assert.throws(() => LeadScoringService.score({ fitScore: 60, engagementScore: 0, intentScore: 0 }));
  ok("lead-score: out-of-range fitScore throws");
})();

console.log(`\n  ${passed} passed — all algorithm tests green.\n`);