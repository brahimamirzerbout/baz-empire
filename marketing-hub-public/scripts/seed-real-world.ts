/**
 * ═══════════════════════════════════════════════════════════════════
 * REAL-WORLD DATA SEED — Agency-Grade Marketing Data
 * ═══════════════════════════════════════════════════════════════════
 *
 * Populates the hub with realistic data representing a full-service
 * marketing agency running 8 departments. Every record is designed
 * so that a real company could operate entirely from this hub.
 *
 * Departments:
 *   Strategy — CMO office, brand, personas, campaigns, budget
 *   Creative — Content, social, email, landing pages, assets
 *   Media    — SEO, paid ads, attribution, A/B tests, funnels
 *   Revenue  — CRM, ABM, sequences, forms, lead magnets, billing
 *   Client Success — Inbox, testimonials, NPS, retention, events
 *   Analytics — Reports, wire, marketing dive, trends, predictive
 *   Operations — Finance, audit, automations, tasks
 *   Knowledge — AI agents, library, book vault, masters
 *
 * Run: npx tsx scripts/seed-real-world.ts
 */

import Database from "better-sqlite3";
import path from "node:path";
import { randomUUID } from "node:crypto";

const DB_PATH = path.join(process.cwd(), "data", "hub.sqlite");
const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

console.log("🏢 Seeding real-world agency data...\n");

const uid = (prefix: string) => `${prefix}_${randomUUID().slice(0, 12)}`;
const T = Date.now();
const DAY = 86400000;

// ═══════════════════════════════════════════════════════════════════
// TEAM MEMBERS — 8 departments, 42 people
// ═══════════════════════════════════════════════════════════════════
const TEAM = [
  // ── Strategy (6) ──
  { name: "Sofia Park", title: "Chief Marketing Officer", dept: "Strategy", role: "cmo" },
  { name: "Marcus Chen", title: "VP Strategy", dept: "Strategy", role: "vp_strategy" },
  { name: "Elena Rossi", title: "Brand Strategist", dept: "Strategy", role: "brand" },
  { name: "David Okafor", title: "Campaign Planner", dept: "Strategy", role: "campaigns" },
  { name: "Priya Anand", title: "Research Analyst", dept: "Strategy", role: "research" },
  { name: "James Kim", title: "Budget Manager", dept: "Strategy", role: "budget" },

  // ── Creative (7) ──
  { name: "Hannah Reyes", title: "VP Content", dept: "Creative", role: "vp_content" },
  { name: "Liam O'Brien", title: "Senior Copywriter", dept: "Creative", role: "copy" },
  { name: "Aisha Mwangi", title: "Social Media Manager", dept: "Creative", role: "social" },
  { name: "Carlos Mendez", title: "Email Marketing Specialist", dept: "Creative", role: "email" },
  { name: "Yuki Tanaka", title: "Graphic Designer", dept: "Creative", role: "design" },
  { name: "Zara Hussein", title: "Video Producer", dept: "Creative", role: "video" },
  { name: "Ben Adler", title: "Content Calendar Manager", dept: "Creative", role: "calendar" },

  // ── Media (6) ──
  { name: "Alex Rivera", title: "VP Growth", dept: "Media", role: "vp_growth" },
  { name: "Jordan Lee", title: "SEO Manager", dept: "Media", role: "seo" },
  { name: "Sam Nguyen", title: "Paid Media Manager", dept: "Media", role: "ads" },
  { name: "Rachel Foster", title: "Attribution Analyst", dept: "Media", role: "attribution" },
  { name: "Omar Siddiqui", title: "A/B Testing Lead", dept: "Media", role: "ab" },
  { name: "Nina Petrova", title: "Funnel Strategist", dept: "Media", role: "funnels" },

  // ── Revenue (6) ──
  { name: "Tom Bradley", title: "VP Sales", dept: "Revenue", role: "vp_sales" },
  { name: "Amanda Foster", title: "SDR Team Lead", dept: "Revenue", role: "sdr" },
  { name: "Kai Yamamoto", title: "ABM Manager", dept: "Revenue", role: "abm" },
  { name: "Lisa Chen", title: "Sales Ops", dept: "Revenue", role: "sales_ops" },
  { name: "Diego Restrepo", title: "Billing Manager", dept: "Revenue", role: "billing" },
  { name: "Sarah Williams", title: "Lead Gen Specialist", dept: "Revenue", role: "lead_gen" },

  // ── Client Success (6) ──
  { name: "Emma Thompson", title: "VP Client Success", dept: "Client Success", role: "vp_cs" },
  { name: "Raj Patel", title: "Account Manager", dept: "Client Success", role: "am" },
  { name: "Maya Johnson", title: "NPS Coordinator", dept: "Client Success", role: "nps" },
  { name: "Jake Wilson", title: "Retention Specialist", dept: "Client Success", role: "retention" },
  { name: "Olivia Davis", title: "Events Manager", dept: "Client Success", role: "events" },
  { name: "Chris Martinez", title: "Community Manager", dept: "Client Success", role: "community" },

  // ── Analytics (5) ──
  { name: "Daniel Kim", title: "VP Analytics", dept: "Analytics", role: "vp_analytics" },
  { name: "Grace Liu", title: "Data Analyst", dept: "Analytics", role: "data" },
  { name: "Mike Brown", title: "Reporting Specialist", dept: "Analytics", role: "reports" },
  { name: "Sofia Garcia", title: "Predictive Modeler", dept: "Analytics", role: "predictive" },
  { name: "Ahmed Hassan", title: "BI Developer", dept: "Analytics", role: "bi" },

  // ── Operations (3) ──
  { name: "Marcus Okafor", title: "CFO", dept: "Operations", role: "cfo" },
  { name: "Anna Petrov", title: "Finance Manager", dept: "Operations", role: "finance" },
  { name: "Peter Schmidt", title: "Operations Lead", dept: "Operations", role: "ops" },

  // ── Knowledge (3) ──
  { name: "Nora West", title: "AI Research Lead", dept: "Knowledge", role: "ai" },
  { name: "Ivan Kozlov", title: "Librarian", dept: "Knowledge", role: "library" },
  { name: "Luna Park", title: "Knowledge Manager", dept: "Knowledge", role: "knowledge" },
];

// Seed team as contacts with company = department
for (const t of TEAM) {
  const [first, ...rest] = t.name.split(" ");
  const last = rest.join(" ");
  db.prepare(`INSERT OR IGNORE INTO contacts (id, first_name, last_name, email, phone, company, title, status, source, tags, notes, score, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    uid("team_"), first, last,
    `${first.toLowerCase()}.${last.toLowerCase()}@baz-agency.com`,
    `+1 555 ${String(1000 + TEAM.indexOf(t)).padStart(4, "0")}`,
    t.dept, t.title, "customer", "internal",
    JSON.stringify([t.dept.toLowerCase().replace(/\s+/g, "-"), t.role]),
    `Team member: ${t.dept} department`,
    95, T - Math.floor(Math.random() * 365) * DAY, T
  );
}

// ═══════════════════════════════════════════════════════════════════
// CLIENT COMPANIES — 25 real-ish companies across verticals
// ═══════════════════════════════════════════════════════════════════
const CLIENTS = [
  { name: "Meridian Health", industry: "Healthcare", size: "201-1000", arr: 2400000 },
  { name: "CloudScale SaaS", industry: "SaaS", size: "51-200", arr: 890000 },
  { name: "Urban Nest Realty", industry: "Real Estate", size: "11-50", arr: 320000 },
  { name: "FitForge", industry: "Fitness", size: "11-50", arr: 180000 },
  { name: "GreenPath Energy", industry: "Energy", size: "201-1000", arr: 1500000 },
  { name: "Artisan Coffee Co", industry: "Retail", size: "1-10", arr: 95000 },
  { name: "Quantum Finance", industry: "Finance", size: "51-200", arr: 2100000 },
  { name: "ByteCraft Labs", industry: "Technology", size: "11-50", arr: 450000 },
  { name: "Evergreen Law", industry: "Legal", size: "11-50", arr: 560000 },
  { name: "Pulse Fitness", industry: "Health & Wellness", size: "1-10", arr: 120000 },
  { name: "NovaTech Solutions", industry: "SaaS", size: "51-200", arr: 780000 },
  { name: "Summit Education", industry: "Education", size: "51-200", arr: 340000 },
  { name: "Apex Manufacturing", industry: "Manufacturing", size: "201-1000", arr: 950000 },
  { name: "TidalWave Surf", industry: "Retail", size: "1-10", arr: 75000 },
  { name: "ClearView Optics", industry: "Healthcare", size: "11-50", arr: 280000 },
  { name: "Velocity Logistics", industry: "Logistics", size: "201-1000", arr: 1800000 },
  { name: "Spark EV", industry: "Automotive", size: "51-200", arr: 4200000 },
  { name: "Harmony Music", industry: "Entertainment", size: "11-50", arr: 210000 },
  { name: "Pinnacle Consulting", industry: "Consulting", size: "11-50", arr: 650000 },
  { name: "FreshBite Meal Kits", industry: "Food & Bev", size: "51-200", arr: 890000 },
  { name: "Coral Reef Travel", industry: "Travel", size: "11-50", arr: 340000 },
  { name: "Shield Insurance", industry: "Insurance", size: "201-1000", arr: 3200000 },
  { name: "Wanderlust Hostels", industry: "Hospitality", size: "1-10", arr: 145000 },
  { name: "Catalyst Biotech", industry: "Biotech", size: "51-200", arr: 1900000 },
  { name: "Nexus Digital", industry: "Marketing", size: "1-10", arr: 240000 },
];

const companyIds: string[] = [];
for (const c of CLIENTS) {
  const id = uid("co_");
  companyIds.push(id);
  db.prepare(`INSERT OR IGNORE INTO companies (id, name, domain, industry, size, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
    id, c.name, `${c.name.toLowerCase().replace(/\s+/g, "")}.com`,
    c.industry, c.size, `Client: $${(c.arr / 1000).toFixed(0)}K ARR`, T - Math.floor(Math.random() * 365) * DAY
  );
}

// ═══════════════════════════════════════════════════════════════════
// DEALS — Pipeline with realistic amounts and stages
// ═══════════════════════════════════════════════════════════════════
const DEAL_STAGES = ["lead", "qualified", "proposal", "negotiation", "won", "lost"];
const DEAL_DATA = [
  { company: "CloudScale SaaS", stage: "won", value: 89000, service: "SEO + Content" },
  { company: "Meridian Health", stage: "won", value: 240000, service: "Full-service retainer" },
  { company: "Urban Nest Realty", stage: "negotiation", value: 45000, service: "Paid ads + CRO" },
  { company: "FitForge", stage: "proposal", value: 32000, service: "Social media management" },
  { company: "GreenPath Energy", stage: "won", value: 180000, service: "Brand + ABM" },
  { company: "Quantum Finance", stage: "won", value: 350000, service: "Full-service retainer" },
  { company: "ByteCraft Labs", stage: "qualified", value: 67000, service: "SEO + Email" },
  { company: "Evergreen Law", stage: "proposal", value: 56000, service: "Content + SEO" },
  { company: "Pulse Fitness", stage: "lead", value: 18000, service: "Starter package" },
  { company: "NovaTech Solutions", stage: "negotiation", value: 95000, service: "Attribution + Analytics" },
  { company: "Summit Education", stage: "won", value: 42000, service: "Email automation" },
  { company: "Apex Manufacturing", stage: "qualified", value: 150000, service: "Full-service" },
  { company: "TidalWave Surf", stage: "lost", value: 12000, service: "Starter package" },
  { company: "ClearView Optics", stage: "proposal", value: 38000, service: "Paid ads" },
  { company: "Velocity Logistics", stage: "won", value: 210000, service: "Full-service retainer" },
  { company: "Spark EV", stage: "negotiation", value: 450000, service: "Brand + Events + ABM" },
  { company: "Harmony Music", stage: "lead", value: 28000, service: "Social + Content" },
  { company: "Pinnacle Consulting", stage: "won", value: 85000, service: "SEO + Content" },
  { company: "FreshBite Meal Kits", stage: "proposal", value: 110000, service: "Full-service" },
  { company: "Shield Insurance", stage: "qualified", value: 280000, service: "Full-service + ABM" },
  { company: "Catalyst Biotech", stage: "won", value: 190000, service: "Brand + SEO + Content" },
  { company: "Nexus Digital", stage: "lead", value: 35000, service: "Consulting" },
  { company: "Coral Reef Travel", stage: "lost", value: 22000, service: "Starter package" },
  { company: "Wanderlust Hostels", stage: "proposal", value: 15000, service: "Social media" },
  { company: "Artisan Coffee Co", stage: "won", value: 28000, service: "Local SEO + Social" },
];

let totalPipeline = 0;
let totalWon = 0;
let wonCount = 0;
for (const d of DEAL_DATA) {
  const id = uid("deal_");
  totalPipeline += d.value;
  if (d.stage === "won") { totalWon += d.value; wonCount++; }
  const dealTitle = `${d.service} — ${d.company}`;
  const companyId = companyIds[CLIENTS.findIndex(c => c.name === d.company)] || uid("co_");
  db.prepare(`INSERT OR IGNORE INTO deals (id, title, company_id, value, stage, probability, source, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    id, dealTitle, companyId, d.value, d.stage,
    d.stage === "won" ? 100 : d.stage === "lost" ? 0 : d.stage === "negotiation" ? 75 : d.stage === "proposal" ? 50 : d.stage === "qualified" ? 30 : 10,
    d.service, T - Math.floor(Math.random() * 90) * DAY, T
  );
}

// ═══════════════════════════════════════════════════════════════════
// CAMPAIGNS — 12 active campaigns across channels
// ═══════════════════════════════════════════════════════════════════
const CAMPAIGNS = [
  { name: "Q3 Brand Awareness Push", status: "live", type: "awareness", channel: "Meta", budget: 24000, leads: 342, conversions: 28 },
  { name: "CloudScale SEO Sprint", status: "live", type: "consideration", channel: "Organic", budget: 8500, leads: 156, conversions: 19 },
  { name: "Meridian Health Content Series", status: "live", type: "conversion", channel: "Email", budget: 12000, leads: 210, conversions: 42 },
  { name: "GreenPath ABM Campaign", status: "live", type: "conversion", channel: "LinkedIn", budget: 18000, leads: 78, conversions: 12 },
  { name: "FitForge Social Blitz", status: "paused", type: "awareness", channel: "TikTok", budget: 6000, leads: 89, conversions: 5 },
  { name: "Quantum Finance Thought Leadership", status: "live", type: "consideration", channel: "LinkedIn", budget: 15000, leads: 134, conversions: 22 },
  { name: "Urban Nest Local Ads", status: "live", type: "conversion", channel: "Google", budget: 9500, leads: 267, conversions: 31 },
  { name: "Velocity Logistics Retargeting", status: "completed", type: "conversion", channel: "Meta", budget: 22000, leads: 456, conversions: 58 },
  { name: "Spark EV Launch Campaign", status: "live", type: "launch", channel: "Multi-channel", budget: 55000, leads: 892, conversions: 67 },
  { name: "Evergreen Law Email Nurture", status: "live", type: "retention", channel: "Email", budget: 4500, leads: 98, conversions: 15 },
  { name: "FreshBite Influencer Program", status: "live", type: "awareness", channel: "Instagram", budget: 11000, leads: 234, conversions: 18 },
  { name: "Shield Insurance Webinar Series", status: "scheduled", type: "consideration", channel: "Zoom", budget: 8000, leads: 0, conversions: 0 },
];

for (const c of CAMPAIGNS) {
  db.prepare(`INSERT OR IGNORE INTO campaigns (id, name, status, type, budget, channels, start_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    uid("cmp_"), c.name, c.status, c.type, c.budget, JSON.stringify([c.channel]),
    T - Math.floor(Math.random() * 60) * DAY, T - Math.floor(Math.random() * 90) * DAY, T
  );
}

// ═══════════════════════════════════════════════════════════════════
// REVENUE EVENTS — Monthly recurring revenue tracking
// ═══════════════════════════════════════════════════════════════════
if (db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='revenue_events'").get()) {
  const months = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"];
  const mrr = [185000, 198000, 215000, 228000, 241000, 256000];
  for (let i = 0; i < months.length; i++) {
    db.prepare(`INSERT OR IGNORE INTO revenue_events (id, amount, kind, occurred_at, notes, created_at) VALUES (?, ?, ?, ?, ?, ?)`).run(
      uid("rev_"), mrr[i], "mrr", T - (6 - i) * 30 * DAY, `MRR ${months[i]}`, T - (6 - i) * 30 * DAY
    );
  }
}

// ═══════════════════════════════════════════════════════════════════
// DAILY KPIs — 90 days of metrics
// ═══════════════════════════════════════════════════════════════════
if (db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='daily_kpis'").get()) {
  for (let d = 89; d >= 0; d--) {
    const date = new Date(T - d * DAY).toISOString().slice(0, 10);
    const baseVisitors = 1200 + Math.floor(Math.random() * 400);
    const growth = d < 30 ? 1.3 : d < 60 ? 1.15 : 1.0;
    const newLeads = Math.floor(baseVisitors * growth * 0.04);
    const newDeals = Math.floor(baseVisitors * growth * 0.004);
    const dealsWon = Math.floor(baseVisitors * growth * 0.0008);
    const mrrAdded = Math.floor(256000 + (89 - d) * 800 + Math.random() * 5000);
    db.prepare(`INSERT OR IGNORE INTO daily_kpis (date, cash_collected, new_leads, new_deals, deals_won, deals_lost, mrr_added, mrr_churned, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      date,
      Math.floor(8500 + Math.random() * 3000),
      newLeads,
      newDeals,
      dealsWon,
      Math.floor(dealsWon * 0.3),
      mrrAdded,
      Math.floor(mrrAdded * 0.05),
      '',
      T - d * DAY
    );
  }
}

// ═══════════════════════════════════════════════════════════════════
// PRINT SUMMARY
// ═══════════════════════════════════════════════════════════════════
console.log("\n✅ Real-world agency data seeded:");
console.log(`   👥 ${TEAM.length} team members across 8 departments`);
console.log(`   🏢 ${CLIENTS.length} client companies`);
console.log(`   💰 ${DEAL_DATA.length} deals (pipeline: $${(totalPipeline / 1000).toFixed(0)}K, won: $${(totalWon / 1000).toFixed(0)}K)`);
console.log(`   📣 ${CAMPAIGNS.length} active campaigns`);
console.log(`   📊 90 days of daily KPIs`);
console.log(`   💵 6 months of MRR data`);
console.log("\n🏢 Department structure:");
console.log("   Strategy:    CMO, VP Strategy, Brand, Campaigns, Research, Budget");
console.log("   Creative:    VP Content, Copy, Social, Email, Design, Video, Calendar");
console.log("   Media:       VP Growth, SEO, Ads, Attribution, A/B, Funnels");
console.log("   Revenue:     VP Sales, SDR, ABM, Sales Ops, Billing, Lead Gen");
console.log("   Client Svc:  VP CS, AM, NPS, Retention, Events, Community");
console.log("   Analytics:   VP Analytics, Data, Reports, Predictive, BI");
console.log("   Operations:  CFO, Finance, Ops Lead");
console.log("   Knowledge:   AI Research, Librarian, Knowledge Manager");
console.log("\n🚀 A full marketing agency can now run entirely from this hub.");