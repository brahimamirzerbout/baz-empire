import { db, uid } from "../src/lib/db";

console.log("🌱 Seeding Marketing Hub database...");

const T = Date.now();

// Clear existing data
const tables = [
  "users", "workspaces", "settings", "contacts", "companies", "deals",
  "activities", "campaigns", "content", "emails", "landing_pages",
  "seo_keywords", "seo_audits", "ads", "assets", "automations",
  "integrations", "api_keys", "copy_templates", "notes", "tasks",
];
for (const t of tables) {
  try { db.prepare(`DELETE FROM ${t}`).run(); } catch {}
}

// Settings
db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run("workspace_name", "Acme Marketing");
db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run("brand_color", "#888888");
db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run("from_name", "Acme Team");
db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run("from_email", "hello@acme.com");

// Companies
const companies = ["Acme Corp", "Globex Inc", "Initech", "Hooli", "Pied Piper", "Stark Industries", "Wayne Enterprises", "Wonka Co"];
const companyIds: string[] = [];
for (const name of companies) {
  const id = uid("co_");
  companyIds.push(id);
  db.prepare(`INSERT INTO companies (id, name, domain, industry, size, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
    id, name, `${name.toLowerCase().replace(/\s+/g, "")}.com`,
    ["SaaS", "Retail", "Finance", "Healthcare", "Manufacturing"][Math.floor(Math.random() * 5)],
    ["1-10", "11-50", "51-200", "201-1000", "1000+"][Math.floor(Math.random() * 5)],
    "Auto-imported sample.", T - Math.floor(Math.random() * 90) * 86400000
  );
}

// Contacts
const firstNames = ["Sarah", "Mike", "Elena", "David", "Priya", "James", "Sofia", "Ahmed", "Lisa", "Marcus", "Anna", "Carlos", "Yuki", "Ben", "Zara"];
const lastNames = ["Chen", "Smith", "Garcia", "Patel", "Kim", "Brown", "Singh", "Müller", "Tanaka", "Silva", "Rossi", "Khan", "Nguyen", "Cohen"];
const sources = ["organic", "paid", "referral", "social", "event", "cold"];
const statuses = ["lead", "prospect", "customer", "evangelist", "churned"];
const contactIds: string[] = [];
for (let i = 0; i < 60; i++) {
  const id = uid("c_");
  contactIds.push(id);
  const first = firstNames[i % firstNames.length];
  const last = lastNames[i % lastNames.length];
  db.prepare(`INSERT INTO contacts (id, first_name, last_name, email, phone, company, title, status, source, tags, notes, score, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    id, first, last,
    `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
    `+1 555 ${String(1000 + i).padStart(4, "0")}`,
    companies[i % companies.length],
    ["CMO", "Marketing Director", "Growth Lead", "Founder", "VP Marketing"][i % 5],
    statuses[Math.min(statuses.length - 1, Math.floor(Math.random() * 3))],
    sources[i % sources.length],
    JSON.stringify(["newsletter", "vip"].slice(0, (i % 2) + 1)),
    "Sample contact from seed.",
    Math.floor(Math.random() * 100),
    T - Math.floor(Math.random() * 180) * 86400000,
    T - Math.floor(Math.random() * 30) * 86400000
  );
}

// C-suite + direct reports (mirrors src/data/team.ts)
const EXEC = { name: "Executives", status: "evangelist", source: "founder-led", tag: JSON.stringify(["executive"]) };
const FINANCE = { name: "Finance", status: "evangelist", source: "founder-led", tag: JSON.stringify(["executive", "cfo"]) };
const MARKETING = { name: "Marketing", status: "customer", source: "founder-led", tag: JSON.stringify(["executive", "cmo"]) };
const C_SUITE = [
  // Executive
  { first: "Eleanor", last: "Hughes", title: "Chief Executive Officer", dept: EXEC, reports_to: null },
  // Finance → CEO
  { first: "Marcus", last: "Okafor", title: "Chief Financial Officer", dept: FINANCE, reports_to: "Chief Executive Officer" },
  { first: "Priya", last: "Anand", title: "VP Finance", dept: FINANCE, reports_to: "Chief Financial Officer" },
  { first: "Diego", last: "Restrepo", title: "Controller", dept: FINANCE, reports_to: "Chief Financial Officer" },
  // Marketing → CEO
  { first: "Sofia", last: "Park", title: "Chief Marketing Officer", dept: MARKETING, reports_to: "Chief Executive Officer" },
  { first: "James", last: "Oduya", title: "VP Brand", dept: MARKETING, reports_to: "Chief Marketing Officer" },
  { first: "Hannah", last: "Reyes", title: "VP Growth", dept: MARKETING, reports_to: "Chief Marketing Officer" },
  { first: "Aanya", last: "Kapoor", title: "VP Content", dept: MARKETING, reports_to: "Chief Marketing Officer" },
];
for (const p of C_SUITE) {
  const id = uid("c_");
  contactIds.push(id);
  db.prepare(`INSERT INTO contacts (id, first_name, last_name, email, phone, company, title, status, source, tags, notes, score, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    id, p.first, p.last,
    `${p.first.toLowerCase()}.${p.last.toLowerCase()}@baz-agency.test`,
    `+1 555 ${String(9000 + (C_SUITE.indexOf(p))).padStart(4, "0")}`,
    p.dept.name,
    p.title,
    p.dept.status,
    p.dept.source,
    p.dept.tag,
    `C-suite record for org chart. Reports to: ${p.reports_to ?? "n/a"}.`,
    95,
    T - 365 * 86400000,
    T - 7 * 86400000
  );
}

// Deals
const dealTitles = ["Q4 brand campaign", "Website redesign", "Annual retainer", "Product launch", "Email automation", "SEO overhaul", "Paid media", "Content strategy"];
const stages = ["lead", "qualified", "proposal", "negotiation", "won", "lost"];
const dealIds: string[] = [];
for (let i = 0; i < 25; i++) {
  const id = uid("d_");
  dealIds.push(id);
  const stage = stages[i % stages.length];
  const value = 2000 + Math.floor(Math.random() * 50000);
  const prob = stage === "won" ? 100 : stage === "lost" ? 0 : Math.min(95, Math.max(5, Math.floor(Math.random() * 90)));
  // Won deals get a won_at timestamp and a cost_to_acquire for CAC math
  const wonAt = stage === "won" ? T - Math.floor(Math.random() * 25) * 86400000 : null;
  const cac = stage === "won" ? Math.floor(value * 0.15 + Math.random() * 800) : 0;
  db.prepare(`INSERT INTO deals (id, title, value, value_collected, cost_to_acquire, source, stage, probability, contact_id, company_id, owner, close_date, won_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    id, dealTitles[i % dealTitles.length], value, stage === "won" ? value : 0, cac,
    ["referral", "organic", "paid", "outbound"][i % 4],
    stage, prob,
    contactIds[i % contactIds.length],
    companyIds[i % companyIds.length],
    ["Alex", "Jordan", "Sam", "Robin"][i % 4],
    T + (Math.floor(Math.random() * 60) - 10) * 86400000,
    wonAt,
    T - Math.floor(Math.random() * 60) * 86400000,
    T - Math.floor(Math.random() * 7) * 86400000
  );
}

// Wire articles — needed for the Trends + Micro-trend monitor to have signal.
// Re-runs are safe: the seed in lib/wire.ts skips if rows already exist.
import { seedWire } from "../src/lib/wire";
seedWire();

// Quick links
db.prepare(`CREATE TABLE IF NOT EXISTS wire_seed_done (id INTEGER PRIMARY KEY)`).run();
db.prepare(`INSERT OR IGNORE INTO wire_seed_done (id) VALUES (1)`).run();

// ─── HubSpot killers: touchpoints, sequences, accounts ───
const accountsSeed = [
  { name: "Hooli", domain: "hooli.xyz", industry: "SaaS", size: "201-1000", tier: "tier_1", owner: "Sam" },
  { name: "Globex Inc", domain: "globex.io", industry: "Manufacturing", size: "51-200", tier: "tier_2", owner: "Alex" },
  { name: "Wonka Co", domain: "wonka.co", industry: "Retail", size: "11-50", tier: "tier_3", owner: "Robin" },
  { name: "Initech", domain: "initech.com", industry: "Software", size: "1000+", tier: "tier_1", owner: "Sam" },
  { name: "Stark Industries", domain: "stark.io", industry: "Defense", size: "1000+", tier: "tier_1", owner: "Sam" },
];
const accountIds: string[] = [];
for (const a of accountsSeed) {
  const id = uid("acc_");
  accountIds.push(id);
  db.prepare(`
    INSERT INTO accounts (id, name, domain, industry, size, tier, owner, abm_score, intent_score, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, a.name, a.domain, a.industry, a.size, a.tier, a.owner, Math.floor(Math.random() * 40) + 30, Math.floor(Math.random() * 60) + 20, T, T);
}

// Seed touchpoints on every deal so attribution has signal
const channels = ["email", "paid", "organic", "social", "referral", "direct", "content", "event"];
for (const d of dealIds) {
  const deal = db.prepare(`SELECT * FROM deals WHERE id = ?`).get(d) as any;
  if (!deal) continue;
  const touchCount = 3 + Math.floor(Math.random() * 6); // 3-8 touchpoints
  for (let i = 0; i < touchCount; i++) {
    const channel = channels[Math.floor(Math.random() * channels.length)];
    const days_back = Math.floor(Math.random() * 60);
    db.prepare(`
      INSERT INTO touchpoints (id, deal_id, contact_id, channel, asset, occurred_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      uid("tp_"), d, deal.contact_id, channel,
      ["homepage", "pricing", "blog-post", "case-study", "demo-video"][Math.floor(Math.random() * 5)],
      T - days_back * 86400000, T
    );
  }
}

// Seed sequences
const sequencesSeed = [
  {
    name: "SaaS Founders — 5-touch",
    description: "Day 0, 3, 7, 14, 21. Cold email + LinkedIn + email.",
    steps: [
      { day: 0, channel: "email" as const, subject: "Quick question about {{company}}", body: "Hi {{first_name}}, I noticed {{company}} is scaling fast — short note on what we do." },
      { day: 3, channel: "linkedin" as const, task_title: "Connect on LinkedIn — mention their Series A / launch" },
      { day: 7, channel: "email" as const, subject: "Re: Quick question", body: "Bumping this — 30-sec video that explains the leverage." },
      { day: 14, channel: "email" as const, subject: "One more thing", body: "If timing is off, fair. If not, 15-min call this week?" },
      { day: 21, channel: "task" as const, task_title: "Final breakup email + remove from list" },
    ],
  },
  {
    name: "Ecom Owners — 3-touch",
    description: "Day 0, 5, 12. Quick wins focus.",
    steps: [
      { day: 0, channel: "email" as const, subject: "A 90-second teardown of {{company}}'s homepage", body: "No pitch. Just one observation you can ship today." },
      { day: 5, channel: "email" as const, subject: "Quick win for {{company}}", body: "Specific subject line + CTA tweak we tested with similar brands." },
      { day: 12, channel: "email" as const, subject: "Last note", body: "Closing the loop. If you want the full teardown, reply." },
    ],
  },
];
const sequenceIds: string[] = [];
for (const s of sequencesSeed) {
  const id = uid("seq_");
  sequenceIds.push(id);
  db.prepare(`
    INSERT INTO sales_sequences (id, name, description, active, steps, enrolled_count, replied_count, booked_count, created_at)
    VALUES (?, ?, ?, 1, ?, 0, 0, 0, ?)
  `).run(id, s.name, s.description, JSON.stringify(s.steps), T);
}

// Seed consent records (GDPR baseline — most contacts opt in to marketing)
for (let i = 0; i < 20; i++) {
  db.prepare(`
    INSERT INTO consent_log (id, contact_id, purpose, granted, source, occurred_at)
    VALUES (?, ?, 'marketing', ?, 'seed', ?)
  `).run(uid("cn_"), contactIds[i], Math.random() > 0.1 ? 1 : 0, T - Math.floor(Math.random() * 30) * 86400000);
}

console.log(`\n🏢 HubSpot killers:`);
console.log(`   - ${accountIds.length} accounts (tier 1/2/3)`);
console.log(`   - ${dealIds.length * 5} touchpoints (multi-touch attribution ready)`);
console.log(`   - ${sequenceIds.length} sales sequences`);
console.log(`   - 20 consent records (GDPR baseline)`);

// Revenue events — real dollars hitting the bank for won deals + recurring MRR
const wonDeals = dealIds.slice(0, 4); // first 4 deals are won in seed
for (let i = 0; i < wonDeals.length; i++) {
  const dealId = wonDeals[i];
  const d = db.prepare(`SELECT value FROM deals WHERE id = ?`).get(dealId) as any;
  if (!d) continue;
  // Initial one-time
  db.prepare(`INSERT INTO revenue_events (id, deal_id, contact_id, amount, kind, occurred_at, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
    uid("rev_"), dealId, null, d.value, "one_time",
    T - (28 - i * 4) * 86400000, `Invoice paid · Deal ${dealId.slice(0, 8)}`, T
  );
  // Recurring MRR for 3 of them — this month + previous month for trend
  if (i < 3) {
    const monthly = Math.floor(d.value * 0.25);
    // This month: 1-2 renewals
    db.prepare(`INSERT INTO revenue_events (id, deal_id, contact_id, amount, kind, occurred_at, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
      uid("rev_"), dealId, null, monthly, "recurring_first",
      T - (3 + i * 2) * 86400000, `Monthly retainer · Deal ${dealId.slice(0, 8)} · first`, T
    );
    db.prepare(`INSERT INTO revenue_events (id, deal_id, contact_id, amount, kind, occurred_at, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
      uid("rev_"), dealId, null, monthly, "recurring_renewal",
      T - (1 + i) * 86400000, `Monthly retainer · Deal ${dealId.slice(0, 8)} · renewal`, T
    );
    // Last month baseline
    db.prepare(`INSERT INTO revenue_events (id, deal_id, contact_id, amount, kind, occurred_at, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
      uid("rev_"), dealId, null, monthly, "recurring_renewal",
      T - (32 + i) * 86400000, `Monthly retainer · Deal ${dealId.slice(0, 8)} · last-month`, T
    );
  }
}
// A refund to show churn math
db.prepare(`INSERT INTO revenue_events (id, deal_id, contact_id, amount, kind, occurred_at, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
  uid("rev_"), null, null, 800, "refund",
  T - 5 * 86400000, "Refund · customer cancellation", T
);
// Last month baseline for "vs last month" comparison
for (let i = 0; i < 3; i++) {
  db.prepare(`INSERT INTO revenue_events (id, deal_id, contact_id, amount, kind, occurred_at, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
    uid("rev_"), null, null, 8000 + Math.floor(Math.random() * 5000), "one_time",
    T - (35 + i * 5) * 86400000, `Last-month close ${i + 1}`, T
  );
}

// Campaigns
const campaignData = [
  { name: "Q4 Brand Awareness Push", type: "awareness", status: "live", budget: 25000, spent: 18400, channels: ["paid", "social", "email"], goal: "Reach 5M impressions" },
  { name: "Holiday Sale 2026", type: "conversion", status: "scheduled", budget: 50000, spent: 0, channels: ["paid", "email", "social"], goal: "$200K in sales" },
  { name: "Product Launch — V2", type: "launch", status: "draft", budget: 40000, spent: 0, channels: ["social", "email", "pr"], goal: "10K signups" },
  { name: "Retention Newsletter Series", type: "retention", status: "live", budget: 2000, spent: 1200, channels: ["email"], goal: "Reduce churn by 15%" },
  { name: "Webinar Funnel", type: "consideration", status: "completed", budget: 5000, spent: 4800, channels: ["email", "paid", "social"], goal: "500 registrants" },
  { name: "Re-engagement Campaign", type: "retention", status: "paused", budget: 3000, spent: 1200, channels: ["email", "paid"], goal: "Reactivate 500 users" },
  { name: "Local SEO Domination", type: "awareness", status: "live", budget: 8000, spent: 5200, channels: ["organic", "content"], goal: "Top 3 rankings for 50 keywords" },
];
const campaignIds: string[] = [];
for (const c of campaignData) {
  const id = uid("cmp_");
  campaignIds.push(id);
  const metrics = JSON.stringify({
    impressions: Math.floor(50000 + Math.random() * 500000),
    clicks: Math.floor(1000 + Math.random() * 10000),
    conversions: Math.floor(50 + Math.random() * 500),
    ctr: (1 + Math.random() * 4).toFixed(2),
    cpc: (0.5 + Math.random() * 3).toFixed(2),
  });
  db.prepare(`INSERT INTO campaigns (id, name, type, status, budget, spent, channels, start_date, end_date, goal, metrics, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    id, c.name, c.type, c.status, c.budget, c.spent,
    JSON.stringify(c.channels),
    T - Math.floor(Math.random() * 60) * 86400000,
    T + Math.floor(Math.random() * 90) * 86400000,
    c.goal, metrics,
    T - Math.floor(Math.random() * 30) * 86400000,
    T - Math.floor(Math.random() * 7) * 86400000
  );
}

// Content
const contentData = [
  { title: "5 ways AI is changing marketing", channel: "blog", status: "published", body: "Full article here..." },
  { title: "Black Friday is coming", channel: "twitter", status: "scheduled", body: "Get ready for the biggest sale of the year 🔥", scheduled: 5 },
  { title: "New feature spotlight", channel: "linkedin", status: "draft", body: "We're thrilled to announce..." },
  { title: "Behind the scenes", channel: "instagram", status: "scheduled", body: "A look at our creative process 📸", scheduled: 2 },
  { title: "Customer love", channel: "facebook", status: "published", body: "Hear what our customers are saying..." },
  { title: "Tutorial: Quick start", channel: "youtube", status: "draft", body: "Get up and running in 5 minutes." },
  { title: "Weekly newsletter #42", channel: "email", status: "scheduled", body: "This week in marketing...", scheduled: 1 },
  { title: "Pin: Productivity tips", channel: "pinterest", status: "published", body: "10 productivity tips for marketers" },
];
for (const c of contentData) {
  const id = uid("cnt_");
  const hashtags = JSON.stringify(c.channel === "email" ? [] : [`#marketing`, `#${c.channel}`]);
  db.prepare(`INSERT INTO content (id, title, body, channel, status, scheduled_for, campaign_id, hashtags, media_urls, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    id, c.title, c.body, c.channel, c.status,
    c.scheduled ? T + c.scheduled * 86400000 : null,
    c.status === "draft" ? campaignIds[2] : campaignIds[0],
    hashtags, "[]",
    T - Math.floor(Math.random() * 14) * 86400000,
    T - Math.floor(Math.random() * 3) * 86400000
  );
}

// Emails
const emailTemplates = [
  { name: "Welcome email", subject: "Welcome aboard 🎉", body: "<h1>Hi {{first_name}}!</h1><p>Thanks for joining. Here's how to get started in 5 minutes.</p><a href='#'>Get started</a>" },
  { name: "Re-engagement", subject: "We miss you", body: "<h1>It's been a while</h1><p>Come back and see what's new.</p>" },
  { name: "Product update", subject: "New: {{feature}}", body: "<h1>Just shipped</h1><p>A new feature that will save you hours.</p>" },
];
for (const e of emailTemplates) {
  db.prepare(`INSERT INTO emails (id, name, subject, preheader, from_name, from_email, body_html, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    uid("em_"), e.name, e.subject, "Preview text", "Acme Team", "hello@acme.com", e.body, "draft", T, T
  );
}

// Landing pages
db.prepare(`INSERT INTO landing_pages (id, slug, title, description, blocks, published, meta_title, meta_description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
  uid("lp_"), "welcome",
  "Welcome to Acme",
  "Get started in minutes",
  JSON.stringify([
    { id: "b1", type: "hero", headline: "Marketing that works while you sleep", sub: "Automate, analyze, and amplify your reach.", cta: { label: "Start free", href: "#" } },
    { id: "b2", type: "features", items: [
      { icon: "⚡", title: "Fast", body: "Built for speed and scale." },
      { icon: "🧠", title: "Smart", body: "AI-powered suggestions." },
      { icon: "🔒", title: "Secure", body: "Enterprise-grade security." },
    ] },
    { id: "b3", type: "testimonial", quote: "This transformed our marketing.", author: "Jane Doe", role: "CMO, Acme" },
    { id: "b4", type: "cta", headline: "Ready?", body: "Join thousands of teams.", button: { label: "Get started", href: "#" } },
  ]),
  1, "Welcome to Acme", "Get started with Acme in minutes.",
  T, T
);

// SEO keywords
const kwList = [
  ["marketing automation", 12000, "commercial"],
  ["email marketing software", 18000, "commercial"],
  ["seo tools", 9000, "commercial"],
  ["social media scheduler", 5500, "commercial"],
  ["crm for small business", 7400, "commercial"],
  ["how to write copy", 3200, "informational"],
  ["best marketing tools 2026", 4800, "commercial"],
  ["landing page builder", 6200, "commercial"],
  ["content calendar template", 2900, "informational"],
  ["marketing analytics dashboard", 4100, "commercial"],
];
for (const [kw, vol, intent] of kwList) {
  const pos = Math.random() * 50 + 1;
  db.prepare(`INSERT INTO seo_keywords (id, keyword, volume, difficulty, intent, position, url, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    uid("kw_"), kw, vol, Math.floor(Math.random() * 80) + 10, intent, pos, `/blog/${(kw as string).replace(/\s+/g, "-")}`, "", T, T
  );
}

// Ads
for (let i = 0; i < 6; i++) {
  const impressions = Math.floor(50000 + Math.random() * 500000);
  const clicks = Math.floor(impressions * (0.005 + Math.random() * 0.02));
  const conversions = Math.floor(clicks * (0.02 + Math.random() * 0.08));
  db.prepare(`INSERT INTO ads (id, campaign_id, name, channel, status, budget, spent, impressions, clicks, conversions, creative, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    uid("ad_"),
    campaignIds[i % campaignIds.length],
    ["Brand Awareness Video", "Retargeting Display", "Search — Branded", "Lookalike Acquisition", "Holiday Promo", "Webinar Signup"][i],
    ["meta_ads", "google_ads", "tiktok_ads", "linkedin_ads"][i % 4],
    ["live", "paused", "live", "draft"][i % 4],
    2000 + Math.random() * 8000,
    Math.random() * 5000,
    impressions, clicks, conversions,
    JSON.stringify({ headline: "Discover Acme", body: "Built for modern marketers.", cta: "Learn more" }),
    T - Math.floor(Math.random() * 14) * 86400000,
    T
  );
}

// Assets
const assetList = [
  { name: "Brand logo.png", kind: "image", url: "/assets/logo.png", size: 24000 },
  { name: "Hero banner.jpg", kind: "image", url: "/assets/hero.jpg", size: 480000 },
  { name: "Product demo.mp4", kind: "video", url: "/assets/demo.mp4", size: 12400000 },
  { name: "Sales deck.pdf", kind: "document", url: "/assets/deck.pdf", size: 3200000 },
  { name: "Brand guidelines.pdf", kind: "document", url: "/assets/brand.pdf", size: 1800000 },
];
for (const a of assetList) {
  db.prepare(`INSERT INTO assets (id, name, kind, url, size, tags, folder, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
    uid("a_"), a.name, a.kind, a.url, a.size, JSON.stringify(["brand"]), "Brand", T
  );
}

// Automations
const automations = [
  { name: "Welcome new subscribers", trigger: "contact_created", action: "send_email", runs: 312 },
  { name: "Deal stage → notify Slack", trigger: "deal_stage_changed", action: "notify_slack", runs: 84 },
  { name: "Tag high-intent leads", trigger: "score_threshold", action: "add_tag", runs: 156 },
  { name: "Re-engage cold leads", trigger: "date_reached", action: "enroll_sequence", runs: 28 },
];
for (const a of automations) {
  db.prepare(`INSERT INTO automations (id, name, trigger, action, active, runs, last_run, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
    uid("au_"), a.name, a.trigger, a.action, 1, a.runs, T - Math.floor(Math.random() * 86400000), T
  );
}

// Integrations — seed some as connected, some not
const services = ["mailchimp", "sendgrid", "hubspot", "buffer", "google_analytics", "search_console", "meta_ads", "google_ads", "stripe", "slack"];
for (const s of services) {
  db.prepare(`INSERT INTO integrations (id, service, status, config, connected_at, created_at) VALUES (?, ?, ?, ?, ?, ?)`).run(
    uid("i_"), s, Math.random() > 0.4 ? "connected" : "disconnected", "{}", Math.random() > 0.4 ? T - Math.floor(Math.random() * 30) * 86400000 : null, T
  );
}

// Tasks
const taskList = [
  { title: "Review Q4 campaign creative", done: 0, priority: "high", project: "Q4 Brand" },
  { title: "Approve landing page copy", done: 1, priority: "medium", project: "Product Launch" },
  { title: "Schedule newsletter for Friday", done: 0, priority: "high", project: "Retention" },
  { title: "Audit SEO keywords", done: 0, priority: "low", project: "SEO" },
  { title: "Brief design team on new banners", done: 1, priority: "medium", project: "Q4 Brand" },
];
for (const t of taskList) {
  db.prepare(`INSERT INTO tasks (id, title, done, priority, due_date, project, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
    uid("tk_"), t.title, t.done, t.priority, T + Math.floor(Math.random() * 7) * 86400000, t.project, T
  );
}

// Notes
db.prepare(`INSERT INTO notes (id, title, body, pinned, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`).run(
  uid("n_"), "Welcome to your Hub",
  "This is a fully working marketing app. Edit anything — changes save to your local SQLite database. Try the Copy Generator, Email Builder, or Landing Page builder to start.",
  1, T, T
);

// ═══════════════════════════════════════════════════════════════════════
// NEW SECTIONS SEED DATA (v2.0)
// ═══════════════════════════════════════════════════════════════════════

// Brand kit
const brandItems = [
  { kind: "logo", name: "Primary logo", data: { url: "/brand/logo.svg", variant: "primary" } },
  { kind: "logo", name: "Dark mode logo", data: { url: "/brand/logo-dark.svg", variant: "dark" } },
  { kind: "logo", name: "Icon mark", data: { url: "/brand/icon.svg", variant: "icon" } },
  { kind: "color", name: "Brand purple", data: { hex: "#7c3aed", usage: "primary" } },
  { kind: "color", name: "Accent emerald", data: { hex: "#16a34a", usage: "accent" } },
  { kind: "color", name: "Sky", data: { hex: "#0ea5e9", usage: "secondary" } },
  { kind: "color", name: "Slate ink", data: { hex: "#0f172a", usage: "text" } },
  { kind: "color", name: "Off-white", data: { hex: "#f8fafc", usage: "background" } },
  { kind: "typography", name: "Inter — Headings", data: { family: "Inter", weight: "700", usage: "heading", sample: "Bold ideas, beautifully set" } },
  { kind: "typography", name: "Inter — Body", data: { family: "Inter", weight: "400", usage: "body", sample: "The quick brown fox jumps over the lazy dog" } },
  { kind: "typography", name: "Hack — Code", data: { family: "Hack", weight: "400", usage: "caption", sample: "const x = 42;" } },
  { kind: "voice", name: "Voice & tone", data: { body: "We are confident, not cocky.\nFriendly, not folksy.\nConcise, not curt.\nSmart, not showy.\n\nWe are not:\n- Jargon-heavy\n- Vague or fluffy\n- Overly hyped\n- Cold or robotic" } },
  { kind: "guideline", name: "Logo usage", data: { body: "Maintain at least 16px of clear space around the logo. Never recolor or skew. Don't place on busy backgrounds without a scrim. Minimum size: 24px height for digital, 0.5\" for print." } },
];
for (const b of brandItems) {
  db.prepare(`INSERT INTO brand_assets (id, kind, name, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`).run(
    uid("br_"), b.kind, b.name, JSON.stringify(b.data), T, T
  );
}

// Personas
const personas = [
  { name: "Marketing Mary", role: "Head of Growth at a B2B SaaS", avatar: "👩‍💼", tier: "primary",
    demographics: { age: "32–42", location: "US urban", income: "$120k–180k" },
    goals: ["Hit MQL targets each quarter","Prove ROI on every campaign","Reduce CAC","Build a team"],
    pain_points: ["Too many disconnected tools","No clear attribution","Reporting takes all day","Can't scale what works"],
    channels: ["LinkedIn","Twitter","Podcasts","Email","Substack"], messaging: "Speak to overwhelm. Promise unification. Show, don't tell.", },
  { name: "Founder Felix", role: "Solo founder, pre-Series A", avatar: "🧑‍💻", tier: "primary",
    demographics: { age: "28–40", location: "Global", income: "Founder equity" },
    goals: ["Get first 100 paying customers","Validate product-market fit","Look legit","Not burn out"],
    pain_points: ["No time for marketing","Can't afford a team","Distracted by shiny tactics","Burned by agencies"],
    channels: ["Twitter","Indie Hackers","Product Hunt","Hacker News"], messaging: "Pragmatic. Tactical. Cheap. Fast.", },
  { name: "VP Vanessa", role: "VP Marketing at mid-market", avatar: "👩‍🚀", tier: "primary",
    demographics: { age: "38–50", location: "US/EU", income: "$180k–280k" },
    goals: ["Build demand gen engine","Hit pipeline number","Coach team","Earn board credibility"],
    pain_points: ["Sales-marketing friction","Long sales cycles","Attribution gaps","Executive noise"],
    channels: ["LinkedIn","Industry events","Slack communities","Newsletters"], messaging: "Strategic, mature, executive-friendly.", },
  { name: "Agency Ana", role: "Marketing agency owner", avatar: "🧝‍♀️", tier: "secondary",
    demographics: { age: "30–45", location: "Global", income: "$150k+" },
    goals: ["Manage multiple clients","Deliver fast","Upsell","Retain accounts"],
    pain_points: ["Client churn","Scope creep","Reporting overhead","Tool stack sprawl"],
    channels: ["LinkedIn","Twitter","Slack","Email"], messaging: "Efficiency, white-label, multi-tenant.", },
  { name: "Spam Sam", role: "Low-quality leads", avatar: "🤵", tier: "negative",
    demographics: { age: "—", location: "—", income: "—" },
    goals: ["—"], pain_points: ["—"], channels: ["—"], messaging: "Avoid. Don't optimize for.", },
];
for (const p of personas) {
  db.prepare(`INSERT INTO personas (id, name, role, avatar, demographics, goals, pain_points, channels, messaging, tier, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    uid("per_"), p.name, p.role, p.avatar, JSON.stringify(p.demographics), JSON.stringify(p.goals), JSON.stringify(p.pain_points), JSON.stringify(p.channels), p.messaging, p.tier, T, T
  );
}

// Segments
const segments = [
  { name: "High-intent leads", description: "Leads with score > 70", rules: [{ field: "score", op: ">", value: "70" }], contact_count: 142, color: "#7c3aed" },
  { name: "Newsletter subscribers", description: "Contacts tagged newsletter", rules: [{ field: "tags", op: "contains", value: "newsletter" }], contact_count: 824, color: "#0ea5e9" },
  { name: "US enterprise", description: "Companies with 1000+ employees in the US", rules: [{ field: "company", op: "contains", value: "Inc" }, { field: "score", op: ">", value: "50" }], contact_count: 67, color: "#16a34a" },
  { name: "Churned last 90d", description: "Customers who churned in last 90 days", rules: [{ field: "status", op: "=", value: "churned" }], contact_count: 23, color: "#ef4444" },
];
for (const s of segments) {
  db.prepare(`INSERT INTO segments (id, name, description, rules, contact_count, color, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
    uid("seg_"), s.name, s.description, JSON.stringify(s.rules), s.contact_count, s.color, T, T
  );
}

// Forms
const forms = [
  { name: "Newsletter signup", description: "Footer signup form", fields: [{ id: "f1", type: "email", label: "Email", required: true }], submit_button: "Subscribe", success_message: "Thanks! Check your inbox to confirm.", notify_email: "", tags: ["newsletter","footer"], leads_count: 412, status: "active" },
  { name: "Demo request", description: "Book a 30-min demo", fields: [
    { id: "f1", type: "text", label: "Full name", required: true },
    { id: "f2", type: "email", label: "Work email", required: true },
    { id: "f3", type: "text", label: "Company" },
    { id: "f4", type: "select", label: "Team size", options: ["1-10","11-50","51-200","201-1000","1000+"] },
    { id: "f5", type: "textarea", label: "What are you trying to solve?" },
  ], submit_button: "Book demo", success_message: "We'll be in touch within 1 business day.", notify_email: "sales@acme.com", tags: ["demo","sales"], leads_count: 87, status: "active" },
  { name: "eBook download — Growth guide", description: "Gate the growth guide PDF", fields: [
    { id: "f1", type: "text", label: "Name", required: true },
    { id: "f2", type: "email", label: "Email", required: true },
    { id: "f3", type: "checkbox", label: "I agree to receive marketing emails" },
  ], submit_button: "Get the guide", success_message: "Your download is on its way!", notify_email: "", tags: ["gated","ebook"], leads_count: 256, status: "active" },
];
for (const f of forms) {
  db.prepare(`INSERT INTO forms (id, name, description, fields, submit_button, success_message, notify_email, tags, leads_count, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    uid("frm_"), f.name, f.description, JSON.stringify(f.fields), f.submit_button, f.success_message, f.notify_email, JSON.stringify(f.tags), f.leads_count, f.status, T, T
  );
}

// Lead magnets
const leadMagnets = [
  { name: "Growth Marketing Playbook", type: "ebook", description: "The 47-page guide we wish we had when we started.", url: "/downloads/growth-playbook.pdf", file_size: "4.2 MB", downloads: 1248, tags: ["growth","marketing","free"], status: "live" },
  { name: "Email subject line swipe file", type: "template", description: "200+ proven subject lines that boost open rates.", url: "/downloads/subject-lines.csv", file_size: "84 KB", downloads: 832, tags: ["email","copywriting"], status: "live" },
  { name: "Weekly marketing checklist", type: "checklist", description: "Stay on track with this 15-min weekly checklist.", url: "/downloads/weekly-checklist.pdf", file_size: "120 KB", downloads: 421, tags: ["productivity"], status: "live" },
  { name: "Free 1:1 strategy call", type: "webinar", description: "30-min strategy call with our growth team.", url: "https://calendly.com/acme/strategy", file_size: "", downloads: 167, tags: ["high-touch","sales"], status: "live" },
  { name: "10% off your first month", type: "coupon", description: "Welcome coupon for new sign-ups.", url: "WELCOME10", file_size: "", downloads: 304, tags: ["promo","conversion"], status: "live" },
  { name: "Onboarding video series", type: "video", description: "5-part video series to get you from zero to hero.", url: "/videos/onboarding", file_size: "—", downloads: 612, tags: ["onboarding","education"], status: "live" },
];
for (const l of leadMagnets) {
  db.prepare(`INSERT INTO lead_magnets (id, name, type, description, url, file_size, downloads, tags, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    uid("lm_"), l.name, l.type, l.description, l.url, l.file_size, l.downloads, JSON.stringify(l.tags), l.status, T, T
  );
}

// Funnels
const funnels = [
  { name: "Free trial → Paid SaaS", description: "Top-of-funnel ad → trial signup → onboarding → upgrade", goal: "Convert trial users to paid", steps: [
    { type: "awareness", name: "Google search ad click" },
    { type: "landing_page", name: "SaaS landing page" },
    { type: "form", name: "Free trial signup" },
    { type: "email", name: "Onboarding sequence (5 emails)" },
    { type: "sales", name: "Optional demo call" },
    { type: "purchase", name: "Upgrade to paid plan" },
  ], status: "live", conversion_rate: 3.2, entries: 12500 },
  { name: "Lead magnet funnel", description: "Blog reader → eBook → email list → demo", goal: "Build email list and book demos", steps: [
    { type: "awareness", name: "Blog SEO traffic" },
    { type: "landing_page", name: "eBook landing page" },
    { type: "form", name: "Email opt-in" },
    { type: "email", name: "5-day value sequence" },
    { type: "sales", name: "Demo CTA" },
    { type: "purchase", name: "Paid plan" },
  ], status: "live", conversion_rate: 4.7, entries: 8400 },
  { name: "Webinar funnel", description: "Cold traffic → webinar registration → live attendance → pitch → sale", goal: "Drive $50K MRR from webinars", steps: [
    { type: "awareness", name: "LinkedIn / email invites" },
    { type: "landing_page", name: "Webinar registration page" },
    { type: "form", name: "Registration" },
    { type: "email", name: "Reminder sequence" },
    { type: "sales", name: "Live webinar attendance" },
    { type: "purchase", name: "Post-webinar offer" },
  ], status: "live", conversion_rate: 8.1, entries: 3200 },
];
for (const f of funnels) {
  db.prepare(`INSERT INTO funnels (id, name, description, goal, steps, status, conversion_rate, entries, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    uid("fnl_"), f.name, f.description, f.goal, JSON.stringify(f.steps), f.status, f.conversion_rate, f.entries, T, T
  );
}

// Experiments (A/B tests)
const experiments = [
  { name: "Homepage hero CTA", hypothesis: "Changing CTA from 'Get started' to 'Start free trial' will lift trial signups by 15%", type: "ab", status: "completed",
    variant_a: { name: "Get started", traffic: 8420, conversions: 168 }, variant_b: { name: "Start free trial", traffic: 8391, conversions: 252 },
    metric: "trial signup rate", confidence: 98.4, winner: "B", start_date: T - 21 * 86400000, end_date: T - 7 * 86400000 },
  { name: "Email subject — emoji vs no emoji", hypothesis: "Adding a 🚀 emoji to subject line will increase open rate", type: "ab", status: "running",
    variant_a: { name: "Welcome to Acme", traffic: 4200, conversions: 1302 }, variant_b: { name: "🚀 Welcome to Acme", traffic: 4188, conversions: 1382 },
    metric: "open rate", confidence: 71.2, winner: "", start_date: T - 10 * 86400000, end_date: null },
  { name: "Pricing page — monthly vs annual default", hypothesis: "Showing annual pricing by default increases plan value", type: "ab", status: "running",
    variant_a: { name: "Monthly default", traffic: 1820, conversions: 91 }, variant_b: { name: "Annual default", traffic: 1802, conversions: 119 },
    metric: "average plan value", confidence: 84.7, winner: "B", start_date: T - 14 * 86400000, end_date: null },
  { name: "Checkout — single page vs multi-step", hypothesis: "A single-page checkout reduces abandonment", type: "ab", status: "draft",
    variant_a: { name: "Single page", traffic: 0, conversions: 0 }, variant_b: { name: "Multi-step", traffic: 0, conversions: 0 },
    metric: "checkout completion rate", confidence: 0, winner: "", start_date: null, end_date: null },
];
for (const e of experiments) {
  db.prepare(`INSERT INTO experiments (id, name, hypothesis, type, status, variant_a, variant_b, metric, confidence, winner, start_date, end_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    uid("exp_"), e.name, e.hypothesis, e.type, e.status, JSON.stringify(e.variant_a), JSON.stringify(e.variant_b), e.metric, e.confidence, e.winner, e.start_date, e.end_date, T, T
  );
}

// Testimonials
const testimonials = [
  { author_name: "Sarah Chen", author_role: "Head of Marketing", author_company: "Vercel", rating: 5, body: "This is hands-down the best marketing tool we've used. The integration of CRM, content, and analytics in one place saved us 3 tools and 10 hours a week.", source: "g2", featured: 1, tags: ["saas","growth"] },
  { author_name: "Marcus Johnson", author_role: "Founder", author_company: "Indie Stack", rating: 5, body: "I went from solo marketer to running campaigns like a 5-person team. The funnel builder alone is worth 10x the price.", source: "twitter", featured: 1, tags: ["solo","founder"] },
  { author_name: "Priya Patel", author_role: "VP Marketing", author_company: "Notion", rating: 5, body: "The competitive intelligence module changed how we think about positioning. We caught a competitor move 2 weeks before anyone else did.", source: "linkedin", featured: 1, tags: ["enterprise","strategy"] },
  { author_name: "Ben Cohen", author_role: "Growth Lead", author_company: "Linear", rating: 4, body: "Great product. The A/B testing module is intuitive and the reporting is solid. Would love deeper integrations with our data warehouse.", source: "g2", featured: 0, tags: ["growth"] },
  { author_name: "Elena Garcia", author_role: "CMO", author_company: "Webflow", rating: 5, body: "We replaced 4 tools with this and our team actually enjoys using it. The brand kit module keeps everyone aligned.", source: "manual", featured: 1, tags: ["branding","enterprise"] },
  { author_name: "James Smith", author_role: "Director of Demand Gen", author_company: "HubSpot", rating: 5, body: "The campaign planning features are best-in-class. We've tripled our campaign output without adding headcount.", source: "trustpilot", featured: 0, tags: ["demand-gen"] },
  { author_name: "Yuki Tanaka", author_role: "Marketing Manager", author_company: "Rakuten", rating: 4, body: "Solid all-in-one. The content calendar finally gave our team one source of truth.", source: "capterra", featured: 0, tags: ["content"] },
  { author_name: "Alex Kim", author_role: "Solo founder", author_company: "MakerKit", rating: 5, body: "I'm a one-person marketing team. This is like having 5 specialists on call. The copy generator alone pays for itself.", source: "twitter", featured: 0, tags: ["solo"] },
];
for (const t of testimonials) {
  db.prepare(`INSERT INTO testimonials (id, author_name, author_role, author_company, author_avatar, rating, body, source, url, featured, tags, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    uid("ts_"), t.author_name, t.author_role, t.author_company, "", t.rating, t.body, t.source, "", t.featured, JSON.stringify(t.tags), T - Math.floor(Math.random() * 60) * 86400000
  );
}

// Events
const events = [
  { name: "Growth Marketing Summit 2026", type: "conference", description: "Our flagship annual conference with 30+ speakers.", start_date: T + 30 * 86400000, end_date: T + 32 * 86400000, timezone: "America/Los_Angeles", venue: "Moscone Center, SF", url: "https://summit.acme.com", capacity: 800, registrations: 612, attendees: 0, status: "upcoming" },
  { name: "AI for Marketers — Free Webinar", type: "webinar", description: "Live walkthrough of how to use AI in your marketing stack.", start_date: T + 7 * 86400000, end_date: null, timezone: "UTC", venue: "Online", url: "https://acme.com/webinars/ai", capacity: 500, registrations: 387, attendees: 0, status: "upcoming" },
  { name: "Marketing Leaders Dinner — NYC", type: "meetup", description: "Invite-only dinner for senior marketing leaders.", start_date: T + 14 * 86400000, end_date: null, timezone: "America/New_York", venue: "Catch Steak, NYC", url: "", capacity: 30, registrations: 28, attendees: 0, status: "upcoming" },
  { name: "Product Launch — V2.0", type: "launch", description: "Live product launch event with demos and Q&A.", start_date: T + 21 * 86400000, end_date: T + 21 * 86400000 + 7200000, timezone: "UTC", venue: "Online", url: "https://acme.com/launch", capacity: 2000, registrations: 1205, attendees: 0, status: "upcoming" },
  { name: "Advanced Funnel Building Workshop", type: "workshop", description: "3-hour hands-on workshop on building high-converting funnels.", start_date: T + 3 * 86400000, end_date: null, timezone: "UTC", venue: "Online", url: "https://acme.com/workshops", capacity: 100, registrations: 89, attendees: 0, status: "upcoming" },
  { name: "Q1 Customer Day", type: "demo", description: "Live demos and customer success stories.", start_date: T - 30 * 86400000, end_date: null, timezone: "UTC", venue: "Online", url: "", capacity: 300, registrations: 245, attendees: 187, status: "past" },
];
for (const e of events) {
  db.prepare(`INSERT INTO events (id, name, type, description, start_date, end_date, timezone, venue, url, capacity, registrations, attendees, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    uid("evt_"), e.name, e.type, e.description, e.start_date, e.end_date, e.timezone, e.venue, e.url, e.capacity, e.registrations, e.attendees, e.status, T - 60 * 86400000, T
  );
}

// Competitors
const competitors = [
  { name: "HubSpot", domain: "hubspot.com", description: "All-in-one CRM platform with marketing hub.", positioning: "All-in-one CRM for scaling companies",
    strengths: ["Massive brand recognition","Strong content","Free CRM","Huge partner ecosystem"],
    weaknesses: ["Expensive at scale","Complex UI","Steep learning curve","Locked into their ecosystem"],
    pricing_model: "tiered SaaS", pricing_low: 18, pricing_high: 3200, market_share: 28.4, channels: ["content","seo","events","ads"],
    notes: "Direct competitor. We're better on price-to-value, especially for SMBs. They're better at enterprise.",
    swot: { strengths: ["Brand","Free CRM"], weaknesses: ["Cost","Complexity"], opportunities: ["SMB gap","AI features"], threats: ["Aggressive pricing"] } },
  { name: "ActiveCampaign", domain: "activecampaign.com", description: "Email marketing + CRM with strong automation.", positioning: "Customer experience automation",
    strengths: ["Powerful automations","Affordable","Good deliverability","Strong email features"],
    weaknesses: ["Limited analytics","Smaller ecosystem","No built-in landing pages","Limited social tools"],
    pricing_model: "tiered SaaS", pricing_low: 29, pricing_high: 149, market_share: 8.2, channels: ["content","seo","affiliate"],
    notes: "Closest competitor on email + automation. They win on pure email. We win on integrated everything.",
    swot: { strengths: ["Automation","Price"], weaknesses: ["Scope"], opportunities: ["All-in-one play"], threats: ["Our expansion"] } },
  { name: "Customer.io", domain: "customer.io", description: "Product-led messaging platform.", positioning: "Messaging for SaaS product teams",
    strengths: ["Developer-friendly","Behavioral targeting","Powerful segmentation","Strong SaaS focus"],
    weaknesses: ["Not for non-technical","Limited content tools","Higher learning curve","Expensive"],
    pricing_model: "usage-based", pricing_low: 100, pricing_high: 1000, market_share: 2.1, channels: ["developer-marketing","content"],
    notes: "Different ICP (devs). We can co-exist. Some overlap on automation features.",
    swot: { strengths: ["Dev tools","Targeting"], weaknesses: ["Niche"], opportunities: ["Non-dev features"], threats: ["Our automation"] } },
  { name: "Mailchimp", domain: "mailchimp.com", description: "Email marketing platform for SMBs.", positioning: "Email marketing for small business",
    strengths: ["Easy to use","Massive market share","Strong brand","Integrations"],
    weaknesses: ["Poor automation","Weak CRM","Getting expensive","Limited analytics"],
    pricing_model: "tiered SaaS", pricing_low: 13, pricing_high: 350, market_share: 18.7, channels: ["brand","content","affiliate"],
    notes: "We're not chasing their SMB segment directly. They lose customers as they scale.",
    swot: { strengths: ["Brand","UX"], weaknesses: ["Scale","Cost"], opportunities: ["Mid-market"], threats: ["Brand extension"] } },
];
for (const c of competitors) {
  db.prepare(`INSERT INTO competitors (id, name, domain, description, positioning, strengths, weaknesses, pricing_model, pricing_low, pricing_high, market_share, channels, notes, swot, last_tracked, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    uid("cmp_"), c.name, c.domain, c.description, c.positioning, JSON.stringify(c.strengths), JSON.stringify(c.weaknesses), c.pricing_model, c.pricing_low, c.pricing_high, c.market_share, JSON.stringify(c.channels), c.notes, JSON.stringify(c.swot), T, T, T
  );
}

// Conversations (inbox)
const conversations = [
  { channel: "twitter", contact_name: "Sarah Chen", direction: "inbound", subject: "", body: "Just tried your new dashboard — it's incredible. How do you handle attribution across channels?", sentiment: "positive" },
  { channel: "twitter", contact_name: "Mike Brown", direction: "outbound", subject: "", body: "Thanks for the kind words! Multi-touch attribution is built in — check the Analytics tab.", sentiment: "neutral" },
  { channel: "linkedin", contact_name: "Priya Patel", direction: "inbound", subject: "Partnership opportunity", body: "Hi! Our team has been using Acme for 6 months. Would love to discuss a case study collaboration with your team.", sentiment: "positive" },
  { channel: "email", contact_name: "David Kim", direction: "inbound", subject: "Question about pricing", body: "Hi team, we're a team of 15 and trying to decide between the Pro and Team plans. Can you help us understand the differences?", sentiment: "neutral" },
  { channel: "instagram", contact_name: "Sofia Martin", direction: "inbound", subject: "", body: "🔥🔥🔥 that product launch teaser was sick", sentiment: "positive" },
  { channel: "email", contact_name: "Ahmed Hassan", direction: "inbound", subject: "Bug report", body: "Hey — when I try to export a campaign report I get a 500 error. Can someone take a look?", sentiment: "negative" },
  { channel: "linkedin", contact_name: "Lisa Wong", direction: "inbound", subject: "", body: "Following up on the demo we had last week. Our team is interested but we have a few questions about enterprise features.", sentiment: "neutral" },
  { channel: "twitter", contact_name: "Carlos Silva", direction: "inbound", subject: "", body: "your pricing page is broken on mobile. Just fyi", sentiment: "negative" },
  { channel: "email", contact_name: "Anna Petrov", direction: "outbound", subject: "Re: Webinar follow-up", body: "Great chatting yesterday! Here are the slides as promised. Let me know if you have any questions.", sentiment: "positive" },
  { channel: "facebook", contact_name: "Marcus Lee", direction: "inbound", subject: "", body: "How do I cancel my subscription?", sentiment: "negative" },
  { channel: "sms", contact_name: "Yuki Tanaka", direction: "inbound", subject: "", body: "Got the link, thanks!", sentiment: "positive" },
  { channel: "twitter", contact_name: "Ben Cohen", direction: "inbound", subject: "", body: "do you have a public roadmap?", sentiment: "neutral" },
];
for (const c of conversations) {
  const read = Math.random() > 0.4 ? 1 : 0;
  const starred = Math.random() > 0.85 ? 1 : 0;
  db.prepare(`INSERT INTO conversations (id, channel, contact_id, contact_name, contact_avatar, direction, subject, body, read, starred, sentiment, campaign_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    uid("cnv_"), c.channel, null, c.contact_name, "", c.direction, c.subject, c.body, read, starred, c.sentiment, null, T - Math.floor(Math.random() * 7) * 86400000
  );
}

// Budget items (current month)
const currentPeriod = new Date().toISOString().slice(0, 7);
const lastPeriod = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 7);
const budgetItems = [
  { name: "Google Ads — Brand", category: "paid_ads", channel: "Google", period: currentPeriod, planned: 8000, actual: 6240, owner: "Alex" },
  { name: "Meta Ads — Acquisition", category: "paid_ads", channel: "Meta", period: currentPeriod, planned: 12000, actual: 11200, owner: "Jordan" },
  { name: "LinkedIn Ads — Enterprise", category: "paid_ads", channel: "LinkedIn", period: currentPeriod, planned: 6000, actual: 7500, owner: "Alex" },
  { name: "TikTok Ads — Brand awareness", category: "paid_ads", channel: "TikTok", period: currentPeriod, planned: 4000, actual: 3200, owner: "Sam" },
  { name: "Blog content production", category: "content", channel: "—", period: currentPeriod, planned: 3500, actual: 3500, owner: "Robin" },
  { name: "Video production", category: "content", channel: "—", period: currentPeriod, planned: 6000, actual: 4200, owner: "Sam" },
  { name: "HubSpot subscription", category: "tools", channel: "HubSpot", period: currentPeriod, planned: 800, actual: 800, owner: "Alex" },
  { name: "Ahrefs subscription", category: "tools", channel: "Ahrefs", period: currentPeriod, planned: 200, actual: 200, owner: "Jordan" },
  { name: "Growth Marketing Summit (booth)", category: "events", channel: "—", period: currentPeriod, planned: 15000, actual: 12000, owner: "Robin" },
  { name: "Content team salaries", category: "salaries", channel: "—", period: currentPeriod, planned: 18000, actual: 18000, owner: "—" },
  { name: "PR agency retainer", category: "agencies", channel: "—", period: currentPeriod, planned: 5000, actual: 5000, owner: "Sam" },
  { name: "Influencer — Tech reviewer", category: "influencers", channel: "YouTube", period: currentPeriod, planned: 3000, actual: 3500, owner: "Sam" },
  // Last month
  { name: "Google Ads — Brand", category: "paid_ads", channel: "Google", period: lastPeriod, planned: 8000, actual: 7100, owner: "Alex" },
  { name: "Meta Ads — Acquisition", category: "paid_ads", channel: "Meta", period: lastPeriod, planned: 12000, actual: 13500, owner: "Jordan" },
  { name: "Blog content production", category: "content", channel: "—", period: lastPeriod, planned: 3500, actual: 3500, owner: "Robin" },
  { name: "PR agency retainer", category: "agencies", channel: "—", period: lastPeriod, planned: 5000, actual: 5000, owner: "Sam" },
];
for (const b of budgetItems) {
  db.prepare(`INSERT INTO budget_items (id, name, category, channel, period, planned, actual, owner, notes, campaign_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    uid("bdg_"), b.name, b.category, b.channel, b.period, b.planned, b.actual, b.owner, "", null, T, T
  );
}

// Playbooks
const playbooks = [
  { name: "Product launch playbook", category: "launch", summary: "12-week product launch — from positioning to press coverage to retention.",
    steps: [
      { title: "Positioning & messaging", description: "Lock positioning, value props, and 3-message narrative.", owner: "Marketing lead", duration: "1 week" },
      { title: "Asset creation", description: "Landing page, demo video, sales deck, blog post, social kit.", owner: "Content team", duration: "2 weeks" },
      { title: "PR & analyst outreach", description: "Brief analysts, prep press kit, schedule embargoed briefings.", owner: "Comms", duration: "2 weeks" },
      { title: "Launch event", description: "Live launch with demos, customer quotes, and community activation.", owner: "Marketing lead", duration: "1 day" },
      { title: "Paid amplification", description: "Run paid across Meta, Google, LinkedIn for 4 weeks post-launch.", owner: "Performance team", duration: "4 weeks" },
      { title: "Retention push", description: "Onboarding sequence, in-product nudges, customer comms.", owner: "Lifecycle team", duration: "4 weeks" },
    ],
    kpis: ["100K landing page visits in week 1","1,000 free trial signups in week 1","$50K ARR from launch campaign"], tags: ["launch","saas"] },
  { name: "Re-engagement campaign", category: "retention", summary: "Win back churned or dormant users with a 4-touch sequence.",
    steps: [
      { title: "Define dormant segment", description: "Users who haven't logged in for 60+ days.", owner: "Lifecycle", duration: "1 day" },
      { title: "Personalized email #1", description: "Soft touch — 'we miss you' with a useful tip.", owner: "Copywriter", duration: "3 days" },
      { title: "Email #2 with offer", description: "Discount or extended trial.", owner: "Copywriter", duration: "3 days" },
      { title: "In-app message", description: "Targeted banner for users who don't engage.", owner: "Product", duration: "1 week" },
      { title: "Final win-back email", description: "Last touch with strongest offer.", owner: "Copywriter", duration: "3 days" },
    ],
    kpis: ["10% reactivation rate","$25K recovered MRR"], tags: ["retention","email"] },
  { name: "SEO content engine", category: "acquisition", summary: "How we ship 4 high-quality SEO posts every week.",
    steps: [
      { title: "Keyword research", description: "Use Ahrefs/SEMrush to find 20-30 keyword opportunities per month.", owner: "SEO lead", duration: "1 day" },
      { title: "Content brief", description: "Outrank analysis, outline, target keywords, internal links.", owner: "SEO lead", duration: "1 day" },
      { title: "Draft + edit", description: "Writer drafts; editor polishes.", owner: "Content team", duration: "3 days" },
      { title: "Publish + promote", description: "Publish, share on social, link from related posts.", owner: "Content team", duration: "1 day" },
      { title: "Track + update", description: "Monitor rankings, update quarterly.", owner: "SEO lead", duration: "ongoing" },
    ],
    kpis: ["4 posts/week","Avg post ranks top 10 within 90 days","20K organic visits/month"], tags: ["seo","content"] },
];
for (const p of playbooks) {
  db.prepare(`INSERT INTO playbooks (id, name, category, summary, steps, kpis, tags, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    uid("pb_"), p.name, p.category, p.summary, JSON.stringify(p.steps), JSON.stringify(p.kpis), JSON.stringify(p.tags), T, T
  );
}

// Surveys
const surveys = [
  { name: "Q2 2026 NPS pulse", type: "nps", question: "How likely are you to recommend Acme to a friend or colleague?", audience: "customers", responses: 184, score: 47, status: "active" },
  { name: "Onboarding CSAT", type: "csat", question: "How satisfied are you with your onboarding experience?", audience: "customers", responses: 92, score: 4.3, status: "active" },
  { name: "Support CES", type: "ces", question: "How easy was it to get the help you needed today?", audience: "contacts", responses: 318, score: 5.1, status: "active" },
  { name: "Feature interest poll", type: "custom", question: "Which of these features would you most want us to ship next?", audience: "customers", responses: 421, score: 0, status: "active" },
];
for (const s of surveys) {
  db.prepare(`INSERT INTO surveys (id, name, type, question, audience, responses, score, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    uid("srv_"), s.name, s.type, s.question, s.audience, s.responses, s.score, s.status, T, T
  );
}

console.log("✅ Seeded:");
console.log(`   - ${companies.length} companies`);
console.log(`   - ${contactIds.length} contacts`);
console.log(`   - 25 deals`);
console.log(`   - ${campaignData.length} campaigns`);
console.log(`   - ${contentData.length} content items`);
console.log(`   - ${emailTemplates.length} emails`);
console.log(`   - ${kwList.length} keywords`);
console.log(`   - 6 ads`);
console.log(`   - ${assetList.length} assets`);
console.log(`   - ${automations.length} automations`);
console.log(`   - ${services.length} integrations`);
console.log(`   - ${taskList.length} tasks`);
console.log(`\n🆕 New sections:`);
console.log(`   - ${brandItems.length} brand assets (logos, colors, type, voice, guidelines)`);
console.log(`   - ${personas.length} personas (primary/secondary/anti-persona)`);
console.log(`   - ${segments.length} audience segments`);
console.log(`   - ${forms.length} forms (with leads captured)`);
console.log(`   - ${leadMagnets.length} lead magnets`);
console.log(`   - ${funnels.length} customer journey funnels`);
console.log(`   - ${experiments.length} A/B experiments (1 sig-winner)`);
console.log(`   - ${testimonials.length} testimonials (5★ reviews)`);
console.log(`   - ${events.length} events (webinars, conferences, meetups)`);
console.log(`   - ${competitors.length} competitors with SWOT analysis`);
console.log(`   - ${conversations.length} conversations in unified inbox`);
console.log(`   - ${budgetItems.length} budget line items`);
console.log(`   - ${playbooks.length} marketing playbooks`);
console.log(`   - ${surveys.length} NPS/CSAT surveys`);
console.log(`   - ${C_SUITE.length} C-suite contacts (CEO, CFO, CMO + reports)`);

// ─── Triangle bootstrap ──────────────────────────────────────────────
// Make sure a few contacts are "hot and un-enrolled" so the very first
// scheduler tick has something to route. Nova will re-score them anyway.
try {
  const hotUnenrolled = db.prepare(`
    UPDATE contacts SET score = 75, last_touch_at = ?
    WHERE id NOT IN (SELECT contact_id FROM sequence_enrollments WHERE status = 'active')
    LIMIT 5
  `).run(T);
  console.log(`   - triangle bootstrap: ${hotUnenrolled.changes} hot leads primed for routing`);
} catch (e) { /* non-fatal */ }
