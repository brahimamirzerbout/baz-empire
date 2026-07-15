/**
 * Domain seed — demo campaign (Performance Marketing agency) with real ad
 * metrics across 3 channels, plus 6 influencers spanning price/engagement
 * tiers. Lets the /performance/optimize and /influencers/match endpoints
 * return meaningful data out of the box. Idempotent: skips if handle/name
 * already exists.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_INFLUENCERS = [
  { name: "Lina Vogue", platform: "Instagram", handle: "@linavogue", followers: 480000, engagementRate: 0.062, costPerPost: 3200, categories: ["fashion", "beauty", "lifestyle"] },
  { name: "Marco Streets", platform: "TikTok", handle: "@marcostreets", followers: 920000, engagementRate: 0.071, costPerPost: 4500, categories: ["fashion", "streetwear"] },
  { name: "Aya Kim", platform: "Instagram", handle: "@ayakim", followers: 210000, engagementRate: 0.041, costPerPost: 1100, categories: ["beauty", "skincare"] },
  { name: "The Minimalist Man", platform: "YouTube", handle: "@minimalistman", followers: 340000, engagementRate: 0.028, costPerPost: 2500, categories: ["fashion", "lifestyle", "watches"] },
  { name: "Cheap Charl", platform: "TikTok", handle: "@cheapcharl", followers: 60000, engagementRate: 0.012, costPerPost: 300, categories: ["fashion"] },
  { name: "Nadia Luxe", platform: "Instagram", handle: "@nadiaxluxe", followers: 1500000, engagementRate: 0.018, costPerPost: 18000, categories: ["fashion", "luxury", "lifestyle"] },
];

// Channel performance — Google strong, Meta mid, TikTok weak (for the reallocator)
const DEMO_METRICS = [
  { channel: "Google Ads", budgetSpent: 5000, impressions: 220000, clicks: 8800, conversions: 410, revenue: 28000 },
  { channel: "Meta Ads", budgetSpent: 4000, impressions: 310000, clicks: 6200, conversions: 180, revenue: 9000 },
  { channel: "TikTok Ads", budgetSpent: 3000, impressions: 540000, clicks: 4100, conversions: 42, revenue: 2100 },
];

async function main() {
  // Find the Performance Marketing agency (seeded by prisma/seed.ts)
  const agency = await prisma.agency.findFirst({ where: { name: "Performance Marketing Agency" } });
  if (!agency) {
    console.log("  [skip] Performance Marketing Agency not found — run the agency seed first.");
    return;
  }

  // Demo campaign (upsert by name+agency)
  let campaign = await prisma.campaign.findFirst({ where: { name: "Q3 Growth Pilot", agencyId: agency.id } });
  if (!campaign) {
    campaign = await prisma.campaign.create({
      data: { name: "Q3 Growth Pilot", agencyId: agency.id, status: "ACTIVE", budget: 12000 },
    });
    console.log(`  + Campaign: ${campaign.name} (id ${campaign.id})`);
  } else {
    console.log(`  = Campaign exists: ${campaign.name} (id ${campaign.id})`);
  }

  // Ad metrics (only if none yet for this campaign)
  const existingMetrics = await prisma.adMetric.count({ where: { campaignId: campaign.id } });
  if (existingMetrics === 0) {
    for (const m of DEMO_METRICS) {
      await prisma.adMetric.create({ data: { ...m, campaignId: campaign.id } });
    }
    console.log(`  + Ad metrics: ${DEMO_METRICS.length} channels logged`);
  } else {
    console.log(`  = Ad metrics exist (${existingMetrics}) — skipping`);
  }

  // Influencers (upsert by unique handle)
  let created = 0;
  for (const inf of DEMO_INFLUENCERS) {
    const found = await prisma.influencer.findUnique({ where: { handle: inf.handle } });
    if (found) continue;
    await prisma.influencer.create({
      data: { ...inf, categories: JSON.stringify(inf.categories) },
    });
    created++;
  }
  const totalInf = await prisma.influencer.count();
  console.log(`  + Influencers: ${created} created, ${totalInf} total in pool`);
}

main()
  .catch((e) => { console.error("Domain seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });