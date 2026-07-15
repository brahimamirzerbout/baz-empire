#!/usr/bin/env node
/**
 * BAZ Signal Engine — Proprietary Intelligence Layer (Alpha discipline)
 *
 * Equalizes the three competitor technologies BAZventures lacked:
 *   1. Predictive, explainable lead scoring
 *   2. Attribution / revenue-contribution modeling
 *   3. AEO / GEO readiness scoring
 *
 * Reads the live marketing-hub SQLite database. Outputs a JSON report and a
 * human-readable MARKDOWN report. Designed to be explainable (every score shows
 * its driving factors) — per JPMorgan/BAZ principle: "explainable results."
 *
 * Run:  node engine.js [path/to/hub.sqlite]
 */

const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

const DB_PATH = process.argv[2] || "/home/uzer/marketing-hub/data/hub.sqlite";
const OUT_DIR = __dirname;

// ---------------------------------------------------------------------------
// Load
// ---------------------------------------------------------------------------
function load(db, table) {
  try {
    return db.prepare(`SELECT * FROM ${table}`).all();
  } catch (e) {
    return [];
  }
}

let db;
try {
  db = new Database(DB_PATH, { readonly: true, fileMustExist: true });
} catch (e) {
  console.error("Could not open database at", DB_PATH, "\n", e.message);
  process.exit(1);
}

const contacts = load(db, "contacts");
const deals = load(db, "deals");
const campaigns = load(db, "campaigns");
const ads = load(db, "ads");
const competitors = load(db, "competitors");
const seoKeywords = load(db, "seo_keywords");
const aeoQueries = load(db, "aeo_queries");
db.close();

const now = Date.now();
const DAY = 86400000;

// ---------------------------------------------------------------------------
// 1. PREDICTIVE LEAD SCORING (explainable)
// ---------------------------------------------------------------------------
// Map each contact to deal value + probability if a deal exists.
const dealByContact = {};
for (const d of deals) {
  if (d.contact_id) {
    const prev = dealByContact[d.contact_id];
    if (!prev || (d.value || 0) > (prev.value || 0)) dealByContact[d.contact_id] = d;
  }
}

const STATUS_WEIGHT = {
  customer: 22, won: 22, qualified: 16, lead: 12, subscriber: 8,
  prospect: 10, opportunity: 14, "sql": 14, "mql": 11, cold: 3, churned: -10,
};
const SOURCE_WEIGHT = {
  referral: 14, "inbound": 10, "organic": 9, "linkedin": 9, "email": 7,
  "paid": 6, "webinar": 8, "event": 8, "outbound": 5, "partner": 11, "other": 4,
};

function scoreContact(c) {
  const reasons = [];
  let pts = 0;

  // Baseline
  pts += 18; reasons.push(["baseline", 18]);

  // Sentiment (0..1)
  const sent = typeof c.sentiment === "number" ? c.sentiment : 0.5;
  const sPts = Math.round((sent - 0.5) * 30);
  pts += sPts; reasons.push([`sentiment ${(sent * 100).toFixed(0)}%`, sPts]);

  // Status
  const sw = STATUS_WEIGHT[(c.status || "").toLowerCase()] ?? 6;
  pts += sw; reasons.push([`status:${c.status || "unknown"}`, sw]);

  // Source
  const sow = SOURCE_WEIGHT[(c.source || "").toLowerCase()] ?? 4;
  pts += sow; reasons.push([`source:${c.source || "unknown"}`, sow]);

  // Recency of last touch
  let recPts = 0;
  if (c.last_touch_at) {
    const days = Math.max(0, (now - c.last_touch_at) / DAY);
    recPts = days < 7 ? 12 : days < 30 ? 8 : days < 90 ? 4 : -4;
  }
  pts += recPts; reasons.push([`recency`, recPts]);

  // Engagement depth (tags)
  const tags = (c.tags || "").split(",").filter(Boolean).length;
  const tPts = Math.min(tags * 2, 8);
  pts += tPts; reasons.push([`tags:${tags}`, tPts]);

  // Associated deal (the strongest predictive signal)
  const deal = dealByContact[c.id];
  if (deal) {
    const prob = (deal.probability ?? 0) / 100;
    const dPts = Math.round(10 + prob * 25);
    pts += dPts;
    reasons.push([`open deal ${Math.round(deal.value || 0)}$ (${deal.probability ?? 0}%)`, dPts]);
  }

  // Existing hub score drift (kept as a small prior)
  if (typeof c.score === "number") {
    const drift = Math.round((c.score - 50) / 10);
    pts += drift; reasons.push([`prior hub score ${c.score}`, drift]);
  }

  const score = Math.max(0, Math.min(100, pts));
  return { score, reasons: reasons.filter(([, v]) => v !== 0) };
}

const scored = contacts.map((c) => {
  const { score, reasons } = scoreContact(c);
  return {
    id: c.id,
    name: `${c.first_name || ""} ${c.last_name || ""}`.trim() || c.email || c.id,
    email: c.email,
    company: c.company,
    score,
    priorScore: typeof c.score === "number" ? c.score : null,
    reasons,
  };
}).sort((a, b) => b.score - a.score);

const topLeads = scored.slice(0, 10);
const avgScore = scored.length
  ? Math.round(scored.reduce((s, x) => s + x.score, 0) / scored.length)
  : 0;
const hot = scored.filter((x) => x.score >= 70).length;

// ---------------------------------------------------------------------------
// 2. ATTRIBUTION / REVENUE CONTRIBUTION (conversion-share model v1)
// ---------------------------------------------------------------------------
const wonDeals = deals.filter((d) => d.won_at);
const totalWon = wonDeals.reduce((s, d) => s + (d.value || 0), 0);
const totalSpent =
  ads.reduce((s, a) => s + (a.spent || 0), 0) +
  campaigns.reduce((s, c) => s + (c.spent || 0), 0);

const totalConversions = ads.reduce((s, a) => s + (a.conversions || 0), 0);
const channelMap = {};
for (const a of ads) {
  const ch = (a.channel || "unknown").toLowerCase();
  const m = (channelMap[ch] = channelMap[ch] || { spent: 0, impressions: 0, clicks: 0, conversions: 0 });
  m.spent += a.spent || 0;
  m.impressions += a.impressions || 0;
  m.clicks += a.clicks || 0;
  m.conversions += a.conversions || 0;
}
// Modeled revenue per channel: split won revenue by conversion share.
const channels = Object.entries(channelMap).map(([ch, m]) => {
  const convShare = totalConversions > 0 ? m.conversions / totalConversions : 0;
  const modeledRevenue = Math.round(totalWon * convShare);
  const roas = m.spent > 0 ? modeledRevenue / m.spent : 0;
  const cpa = m.conversions > 0 ? m.spent / m.conversions : 0;
  const ctr = m.impressions > 0 ? (m.clicks / m.impressions) * 100 : 0;
  return { channel: ch, ...m, convShare: +convShare.toFixed(3), modeledRevenue, roas: +roas.toFixed(2), cpa: +cpa.toFixed(2), ctr: +ctr.toFixed(2) };
}).sort((a, b) => b.modeledRevenue - a.modeledRevenue);

const blendedRoas = totalSpent > 0 ? totalWon / totalSpent : 0;

// ---------------------------------------------------------------------------
// 3. AEO / GEO READINESS
// ---------------------------------------------------------------------------
const kwCount = seoKeywords.length;
const intentMix = new Set(seoKeywords.map((k) => (k.intent || "unknown").toLowerCase())).size;
const avgPosition = kwCount
  ? seoKeywords.reduce((s, k) => s + (k.position || 0), 0) / kwCount
  : 0;
const aeoCoverage = aeoQueries.length; // 0 = no AI-search tracking yet

const readinessChecks = [
  ["Tracked keywords / topic coverage", kwCount >= 20 ? 1 : kwCount / 20, `${kwCount} keywords`],
  ["Search-intent diversity (informational/nav/trans/comm)", intentMix >= 3 ? 1 : intentMix / 3, `${intentMix} intents`],
  ["Avg SERP position <= 10", avgPosition > 0 && avgPosition <= 10 ? 1 : avgPosition > 10 ? 0.4 : 0.2, `pos ${avgPosition.toFixed(1)}`],
  ["AI-search (ChatGPT/Perplexity) query tracking", aeoCoverage > 0 ? 1 : 0, aeoCoverage === 0 ? "NONE — gap" : `${aeoCoverage} tracked`],
  ["Structured data / schema for answer engines", 0, "not detected — gap"],
  ["Entity / brand presence in AI Overviews", 0, "not measured — gap"],
];
const readinessOkSum = readinessChecks.reduce((s, [, ok]) => s + (typeof ok === "number" ? ok : 0), 0);
const readinessScore = Math.round((readinessOkSum / readinessChecks.length) * 100);
const aeoGaps = readinessChecks.filter(([ok]) => (typeof ok === "number" ? ok : 0) < 1).map(([name, ok, note]) => ({ name, note }));

// ---------------------------------------------------------------------------
// COMPETITOR GAP MATRIX
// ---------------------------------------------------------------------------
const competitorMatrix = [
  { capability: "Proprietary AI / custom models on client data", competitors: "RZLT, ICODA, NinjaPromo", baz: "Template copy-gen only", status: "PARTIAL" },
  { capability: "Predictive lead scoring (explainable)", competitors: "monday, LeadSquared, NinjaPromo", baz: "Flat rule score (now: Signal Engine)", status: "CLOSED" },
  { capability: "Attribution / revenue contribution", competitors: "Marketo, Kantar LIFT ROI", baz: "Spend-only (now: Signal Engine)", status: "CLOSED" },
  { capability: "AEO / GEO (ChatGPT/Perplexity) visibility", competitors: "RevvGrowth, ICODA", baz: "Classic SEO only", status: "GAP" },
  { capability: "Prescriptive / scenario 'what-if' modeling", competitors: "Scopic, McKinsey", baz: "Manual", status: "GAP" },
  { capability: "GTM operating system w/ telemetry", competitors: "TripleDart", baz: "Marketing Hub modules", status: "PARTIAL" },
];

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------
const report = {
  generatedAt: new Date().toISOString(),
  engine: "BAZ Signal Engine v1 (Alpha layer)",
  database: DB_PATH,
  data: { contacts: contacts.length, deals: deals.length, wonDeals: wonDeals.length, campaigns: campaigns.length, ads: ads.length, competitors: competitors.length },
  predictiveScoring: { avgScore, hotLeads: hot, topLeads },
  attribution: { totalWon: Math.round(totalWon), totalSpent: Math.round(totalSpent), blendedRoas: +blendedRoas.toFixed(2), channels },
  aeoReadiness: { score: readinessScore, checks: readinessChecks, gaps: aeoGaps },
  competitorMatrix,
};

fs.writeFileSync(path.join(OUT_DIR, "report.json"), JSON.stringify(report, null, 2));

// Markdown
let md = `# BAZ Signal Engine — Intelligence Report\n`;
md += `_Generated ${report.generatedAt} · source: ${path.basename(DB_PATH)}_\n\n`;
md += `## Data under analysis\n`;
md += `- Contacts: **${contacts.length}** · Deals: **${deals.length}** (won: ${wonDeals.length}) · Campaigns: **${campaigns.length}** · Ads: **${ads.length}** · Competitors tracked: **${competitors.length}**\n\n`;

md += `## 1. Predictive Lead Scoring (explainable)\n`;
md += `- Average score: **${avgScore}** · Hot leads (≥70): **${hot}**\n`;
md += `- Top 10 leads:\n\n`;
md += `| # | Lead | Score | Why |\n|---|------|-------|-----|\n`;
topLeads.forEach((l, i) => {
  const why = l.reasons.sort((a, b) => b[1] - a[1]).slice(0, 3).map((r) => `${r[0]}(${r[1] > 0 ? "+" : ""}${r[1]})`).join(", ");
  md += `| ${i + 1} | ${l.name}${l.company ? " · " + l.company : ""} | **${l.score}** | ${why} |\n`;
});

md += `\n## 2. Attribution / Revenue Contribution (conversion-share model v1)\n`;
md += `- Won revenue modeled: **$${Math.round(totalWon).toLocaleString()}** · Spend: **$${Math.round(totalSpent).toLocaleString()}** · Blended ROAS: **${blendedRoas.toFixed(2)}x**\n`;
md += `- By channel:\n\n`;
md += `| Channel | Spend | Conv. | ConvShare | Modeled $ | ROAS | CPA | CTR% |\n|---|---|---|---|---|---|---|---|\n`;
for (const c of channels) {
  md += `| ${c.channel} | $${Math.round(c.spent)} | ${c.conversions} | ${c.convShare} | $${c.modeledRevenue.toLocaleString()} | ${c.roas}x | $${c.cpa} | ${c.ctr} |\n`;
}
md += `\n> Model v1 splits won revenue by conversion share. Upgrade to multi-touch with clickstream/activities data.\n`;

md += `\n## 3. AEO / GEO Readiness\n`;
md += `- Readiness score: **${readinessScore}/100**\n`;
md += `- Gaps vs competitors:\n`;
for (const g of aeoGaps) md += `  - **${g.name}** — ${g.note}\n`;

md += `\n## Competitor Gap Matrix\n`;
md += `| Capability | Competitors | BAZventures | Status |\n|---|---|---|---|\n`;
for (const r of competitorMatrix) md += `| ${r.capability} | ${r.competitors} | ${r.baz} | ${r.status} |\n`;

fs.writeFileSync(path.join(OUT_DIR, "report.md"), md);

console.log(`BAZ Signal Engine v1 — ran against ${path.basename(DB_PATH)}`);
console.log(`  Contacts: ${contacts.length} | Deals: ${deals.length} (won ${wonDeals.length}) | Campaigns: ${campaigns.length} | Ads: ${ads.length}`);
console.log(`  Predictive: avg ${avgScore}, hot(≥70) ${hot}, top lead "${topLeads[0]?.name}" @ ${topLeads[0]?.score}`);
console.log(`  Attribution: $${Math.round(totalWon).toLocaleString()} won / $${Math.round(totalSpent).toLocaleString()} spent / ${blendedRoas.toFixed(2)}x ROAS`);
console.log(`  AEO readiness: ${readinessScore}/100`);
console.log(`  Reports written: report.json, report.md`);
