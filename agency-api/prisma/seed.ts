/**
 * Idempotent seed — upserts the 24 canonical agency types by `name`.
 * Safe to run repeatedly: existing rows are updated, missing rows inserted.
 * Run: `npm run seed`  (or `npx prisma db seed`)
 */
import { PrismaClient } from "@prisma/client";
import { AGENCY_CATEGORIES } from "../src/lib/config";

const prisma = new PrismaClient();

type SeedAgency = {
  name: string;
  category: (typeof AGENCY_CATEGORIES)[number];
  shortDesc: string;
  goal: string;
  tasks: string[];
  modelRelevance: string;
};

const AGENCIES: SeedAgency[] = [
  { name: "App Agency", category: "Digital & Web", shortDesc: "Specializes in developing tools, utilities, and platforms for smartphones.", goal: "Create intuitive, high-performance mobile applications that solve problems or engage users.", tasks: ["UI/UX mobile design", "iOS & Android development", "App store optimization (ASO)", "App maintenance"], modelRelevance: "Models are occasionally booked to feature in app promotional videos, UI screenshots, or social media demo campaigns." },
  { name: "Branding Agency", category: "Creative & Design", shortDesc: "Creates and maintains a consistent image, identity, and standard for brands.", goal: "Build a recognizable, consistent, and trusted brand image that can adapt to changing trends.", tasks: ["Corporate identity design", "Logo creation", "Brand style guides", "Rebranding strategies"], modelRelevance: "Very high. When a brand implements new creative ideas in photos, videos, or runway shows, they hire models to represent the new brand identity." },
  { name: "Content Marketing Agency", category: "Marketing & Sales", shortDesc: "Combines content creation with distribution strategies to ensure high visibility.", goal: "Produce valuable, relevant text, photo, and video content that gets clicked and viewed in a crowded media landscape.", tasks: ["Content strategy", "Copywriting & editorial planning", "SEO content production", "Performance distribution"], modelRelevance: "Models are frequently hired for high-volume content shoots, lookbooks, and short-form social video campaigns." },
  { name: "Design Agency", category: "Creative & Design", shortDesc: "Responsible for visual communication, layout, colors, and physical brand touchpoints.", goal: "Ensure a company has an appealing, unified look from logos to product packaging and store layouts.", tasks: ["Graphic design", "Packaging design", "Point of Sale (POS) design", "Image brochures"], modelRelevance: "Models are featured in layout mockups, high-end print brochures, and retail store display banners designed by these agencies." },
  { name: "Digital Agency", category: "Digital & Web", shortDesc: "Forms a unified online brand presence across websites, web apps, and digital channels.", goal: "Create a centralized, cohesive digital footprint for traditional brands transitioning to or expanding online.", tasks: ["Web development", "Digital brand design", "Cross-channel online marketing", "User experience optimization"], modelRelevance: "They manage the final websites and digital platforms where model campaign photos and videos are displayed." },
  { name: "Dialog Marketing Agency", category: "Marketing & Sales", shortDesc: "Focuses on direct, personal communication with targeted customer groups.", goal: "Establish a direct line of communication between the brand and potential buyers to drive actions.", tasks: ["Direct mail campaigns", "Newsletter marketing", "Customer relationship management (CRM)", "Telemarketing"], modelRelevance: "Models appear in direct mail catalogs, personalized email campaigns, and customized digital newsletters." },
  { name: "E-commerce Agency", category: "Digital & Web", shortDesc: "Develops and optimizes digital storefronts and marketplaces.", goal: "Ensure online shoppers have a seamless, worry-free shopping experience that maximizes sales.", tasks: ["Online shop development", "Shop system integration (Shopify, Magento)", "Conversion rate optimization", "Marketplace management"], modelRelevance: "Highly relevant. Models are hired to shoot e-commerce catalog photos, showing off clothes or products in clean studio lighting." },
  { name: "Event Agency", category: "Media & Strategy", shortDesc: "Promotes topics, products, or brands through live, experiential events.", goal: "Create memorable, real-world experiences that generate press, social media buzz, and word-of-mouth.", tasks: ["Event planning & execution", "Guest management", "Set design & production", "PR event coordination"], modelRelevance: "Models are booked as runway models, hostesses, or brand ambassadors to interact with high-profile guests at live events." },
  { name: "Full Service Agency", category: "Creative & Design", shortDesc: "An agency that handles campaigns from start to finish under one roof.", goal: "Develop and implement customized 360-degree advertising campaigns that reach the target audience across all mediums.", tasks: ["Campaign planning", "Creative conception", "Media buying", "Production execution"], modelRelevance: "Models work with full-service agencies on major campaigns, from initial castings and test shoots to the final commercial productions." },
  { name: "Inbound Marketing Agency", category: "Marketing & Sales", shortDesc: "Draws customers in through helpful, organic, and highly targeted digital content.", goal: "Build brand reach to secure conversions, such as booking workshops, buying tickets, or ordering online items.", tasks: ["Lead generation", "Search engine optimization (SEO)", "Marketing automation", "Funnel building"], modelRelevance: "Models are booked for landing page visual assets, educational video courses, and digital lead magnets." },
  { name: "Influencer Marketing Agency", category: "Marketing & Sales", shortDesc: "Leverages the reach and trust of social media personalities to promote brands.", goal: "Charge a brand with positive image associations by partnering with trusted community influencers.", tasks: ["Influencer scouting", "Campaign management", "Contract negotiation", "Reporting & analytics"], modelRelevance: "Many models also act as micro-influencers. These agencies frequently book models who have built a strong personal brand on social media." },
  { name: "Internet & Web Agency", category: "Digital & Web", shortDesc: "Creates websites, platforms, and online storefronts for businesses.", goal: "Establish a strong, functional technical presence for brands on the World Wide Web.", tasks: ["Web design & UI/UX", "Frontend & Backend development", "Website hosting & security", "CMS integration"], modelRelevance: "While rarely present at shoots, they build the digital portfolios, websites, and agency booking portals where models are showcased." },
  { name: "Communication Agency", category: "Media & Strategy", shortDesc: "Specializes in strategically formulating and delivering brand messages across channels.", goal: "Reach audiences by packaging and reformulating brand messages through tailored media work.", tasks: ["Communications strategy", "Media relations", "Crisis management", "Content production"], modelRelevance: "Models often interact with communication strategists during major commercial launches, press junkets, and brand re-launches." },
  { name: "Creative Agency", category: "Creative & Design", shortDesc: "Develops innovative ideas, concepts, and holistic brand presences.", goal: "Analyze trends, customer demographics, and competitors to design creative concepts for product launches or brand redesigns.", tasks: ["Concept ideation", "Creative direction", "Trend analysis", "Cross-channel design"], modelRelevance: "Very close. Creative directors and art directors from these agencies run the castings, select the models, and direct photo/video shoots." },
  { name: "Media Agency (Planning)", category: "Media & Strategy", shortDesc: "Specializes in the strategic buying and scheduling of advertising space.", goal: "Optimize campaign budgets by buying the most effective ad spaces across TV, print, and digital media.", tasks: ["Media planning", "Ad space negotiation & buying", "Target group analysis", "Performance tracking"], modelRelevance: "While models don't shoot directly for media planners, these agencies decide where the model's face will appear (e.g., billboards, TV, magazines)." },
  { name: "Online Marketing Agency", category: "Marketing & Sales", shortDesc: "Builds targeted online reach and drives direct customer actions.", goal: "Develop digital strategies to secure online sign-ups, newsletter subscriptions, or e-commerce purchases.", tasks: ["Email marketing", "Social ads", "Affiliate marketing", "Digital strategy"], modelRelevance: "Models are booked to shoot high-converting imagery for display ads, promotional emails, and online sales banners." },
  { name: "Performance Marketing Agency", category: "Marketing & Sales", shortDesc: "Focuses on optimizing digital ads to achieve measurable user actions (conversions).", goal: "Generate immediate, trackable returns on ad spend through targeted online-only marketing campaigns.", tasks: ["Paid search & social ads", "A/B testing creative assets", "Conversion rate optimization", "Web analytics"], modelRelevance: "Models are hired to shoot a variety of quick, expressive photo or video assets that will be A/B tested to see which performs best." },
  { name: "PR Agency", category: "Media & Strategy", shortDesc: "Manages a brand's public image, reputation, and relationship with the press.", goal: "Build public trust and positive media buzz through strategic outreach to journalists, magazines, and influencers.", tasks: ["Press releases", "Media relations", "Press events & conferences", "Reputation management"], modelRelevance: "PR agencies invite models to high-profile brand dinners, red carpet events, and product launches to increase media coverage." },
  { name: "Social Media Agency", category: "Digital & Web", shortDesc: "Manages organic and paid social content on platforms like TikTok, Instagram, and YouTube.", goal: "Build active online communities, generate viral reach, and manage daily brand profiles.", tasks: ["Social media strategy", "Community management", "Short-form video production", "Social ad setup"], modelRelevance: "High relevance. They frequently book models for social media shoots, demanding dynamic, authentic, and fast-paced video content (e.g., UGC style)." },
  { name: "SEO / SEA Agency", category: "Digital & Web", shortDesc: "Optimizes visibility within search engines like Google through organic ranking and paid shopping ads.", goal: "Ensure a brand's products and services rank first when a potential customer searches online.", tasks: ["Keyword research", "On-page & Off-page SEO", "Google Ads management", "Google Shopping optimization"], modelRelevance: "They select and optimize the image tags and product feeds (Google Shopping) where models' product shoots appear." },
  { name: "Strategy Agency", category: "Media & Strategy", shortDesc: "Consults on long-term brand building, future concepts, and massive projects.", goal: "Provide brands with a roadmap for long-term growth, expansion, or establishing completely new concepts.", tasks: ["Market research", "Brand positioning strategies", "Future trend forecasting", "Portfolio restructuring"], modelRelevance: "They set the high-level goals that will eventually dictate the style of models and visual assets the brand will need years down the line." },
  { name: "Management Consulting", category: "Media & Strategy", shortDesc: "Advises executive-level operations to make business lines more profitable.", goal: "Analyze organizational structures, locate inefficiencies, and introduce new business models.", tasks: ["Process optimization", "Financial analysis", "Restructuring advisement", "Operational scale strategy"], modelRelevance: "Indirect. If a consulting firm advises a fashion conglomerate to pivot or scale, it will eventually shift their overall marketing budgets." },
  { name: "Video / Film Agency", category: "Creative & Design", shortDesc: "Handles the conceptualization, shooting, and editing of video materials.", goal: "Create high-end video footage (commercials, campaigns, documentaries) to be used across diverse media channels.", tasks: ["Storyboarding & scripting", "Film production & directing", "Video editing & color grading", "Sound design"], modelRelevance: "Extremely high. Models work directly with film agencies on set for commercial shoots, social videos, and digital video campaigns." },
  { name: "Advertising Agency", category: "Marketing & Sales", shortDesc: "Handles the conceptualization and deployment of multi-channel promotional campaigns.", goal: "Bring awareness, identity, and customer interest to a brand through creative, widespread marketing efforts.", tasks: ["Campaign ideation", "Print, digital, and TV ad production", "Public relations coordination", "Market research"], modelRelevance: "Models are heavily utilized in advertising agency campaigns, appearing in television ads, digital banners, and outdoor billboards." },
];

async function main() {
  console.log(`\n  Seeding ${AGENCIES.length} agencies (idempotent upsert by name)…\n`);
  let created = 0;
  let updated = 0;

  for (const a of AGENCIES) {
    const result = await prisma.agency.upsert({
      where: { name: a.name },
      update: {
        category: a.category,
        shortDesc: a.shortDesc,
        goal: a.goal,
        tasks: JSON.stringify(a.tasks),
        modelRelevance: a.modelRelevance,
      },
      create: {
        name: a.name,
        category: a.category,
        shortDesc: a.shortDesc,
        goal: a.goal,
        tasks: JSON.stringify(a.tasks),
        modelRelevance: a.modelRelevance,
      },
    });
    // Heuristic: if updatedAt ≈ createdAt it was just created.
    if (result.createdAt.getTime() === result.updatedAt.getTime()) created++;
    else updated++;
    console.log(`    ✓ ${String(result.id).padStart(2, "0")}  ${a.name}`);
  }

  const total = await prisma.agency.count();
  console.log(`\n  Done. Created ${created}, updated ${updated}. Total rows: ${total}\n`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });