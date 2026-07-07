/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GUESS THE BRAND — Marketing Brand Database & Game Engine
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * A game that trains the user's brand recognition while simultaneously
 * adding legitimacy to the Hub through logo association.
 *
 * Psychology: Cialdini's social proof + authority. When users see 50+
 * recognizable brand logos in the game, they unconsciously associate
 * those brands with the Hub. "If all these brands are here, this must
 * be serious." It's not manipulation — it's context.
 *
 * Brand categories: agencies, SaaS, DTC, social, media, masters' companies
 */

export type BrandCategory = "agency" | "saas" | "dtc" | "social" | "media" | "master";

export interface Brand {
  id: string;
  name: string;
  category: BrandCategory;
  emoji: string; // visual representation (since we can't use real logos)
  color: string; // brand color
  tagline: string; // famous tagline or slogan
  founder: string; // founder(s)
  year: number; // founded
  famousCampaign: string; // a well-known marketing campaign
  valuation?: string; // known valuation (adds weight)
  description: string; // 1-line description
  difficulty: 1 | 2 | 3; // 1=easy (everyone knows), 3=hard (marketing nerds know)
}

export const BRANDS: Brand[] = [
  // ─── Agencies ─────────────────────────────────────────────────────────────
  {
    id: "ogilvy",
    name: "Ogilvy",
    category: "agency",
    emoji: "🎩",
    color: "#1e3a5f",
    tagline: "We sell, or else",
    founder: "David Ogilvy",
    year: 1948,
    famousCampaign: "The man in the Hathaway shirt",
    valuation: "Part of WPP ($20B+)",
    description: "The Father of Advertising's agency",
    difficulty: 2,
  },
  {
    id: "wieden",
    name: "Wieden+Kennedy",
    category: "agency",
    emoji: "🏃",
    color: "#000000",
    tagline: "Just do it (they wrote it)",
    founder: "Dan Wieden & David Kennedy",
    year: 1982,
    famousCampaign: "Nike 'Just Do It'",
    valuation: "Independent, $500M+ revenue",
    description: "The agency behind Nike's iconic slogan",
    difficulty: 3,
  },
  {
    id: "bbdo",
    name: "BBDO",
    category: "agency",
    emoji: "📺",
    color: "#0066cc",
    tagline: "The work, the work, the work",
    founder: "Bruce Barton, Roy Durstine, Alex Osborn",
    year: 1928,
    famousCampaign: "Apple 'Get a Mac'",
    valuation: "Part of Omnicom ($14B+)",
    description: "One of the oldest and largest ad agencies",
    difficulty: 2,
  },
  {
    id: "droga5",
    name: "Droga5",
    category: "agency",
    emoji: "🎨",
    color: "#e60000",
    tagline: "Great work only",
    founder: "David Droga",
    year: 2006,
    famousCampaign: "Under Armour 'I Will What I Want'",
    valuation: "Acquired by Accenture (~$233M)",
    description: "The indie agency that won everything",
    difficulty: 3,
  },
  {
    id: "saatchi",
    name: "Saatchi & Saatchi",
    category: "agency",
    emoji: "🌍",
    color: "#ff0000",
    tagline: "Nothing is impossible",
    founder: "Maurice & Charles Saatchi",
    year: 1970,
    famousCampaign: "British Airways 'The World's Favourite Airline'",
    valuation: "Part of Publicis ($12B+)",
    description: "The agency that defined 80s advertising",
    difficulty: 2,
  },
  {
    id: "cpb",
    name: "Crispin Porter + Bogusky",
    category: "agency",
    emoji: "🐔",
    color: "#ff6600",
    tagline: "Fearless creativity",
    founder: "Chuck Porter, Alex Bogusky",
    year: 1965,
    famousCampaign: "Burger King 'Subservient Chicken'",
    valuation: "Part of MDC Partners",
    description: "The agency that made Burger King cool again",
    difficulty: 3,
  },
  {
    id: "vam",
    name: "VaynerMedia",
    category: "agency",
    emoji: "🔥",
    color: "#dc2626",
    tagline: "Attention is the currency",
    founder: "Gary Vaynerchuk",
    year: 2009,
    famousCampaign: "Native social for every Fortune 500",
    valuation: "$200M+ revenue",
    description: "GaryVee's social-first agency",
    difficulty: 1,
  },
  {
    id: "rim",
    name: "R/GA",
    category: "agency",
    emoji: "💡",
    color: "#00cc66",
    tagline: "Marketing for the connected age",
    founder: "Robert Greenberg",
    year: 1977,
    famousCampaign: "Nike+ FuelBand",
    valuation: "Part of Interpublic",
    description: "The agency that merged tech and advertising",
    difficulty: 3,
  },

  // ─── SaaS / Marketing Tech ────────────────────────────────────────────────
  {
    id: "hubspot",
    name: "HubSpot",
    category: "saas",
    emoji: "🟠",
    color: "#ff7a59",
    tagline: "Inbound marketing",
    founder: "Brian Halligan, Dharmesh Shah",
    year: 2006,
    famousCampaign: "Invented 'inbound marketing' as a category",
    valuation: "$30B+ market cap",
    description: "The CRM that invented inbound marketing",
    difficulty: 1,
  },
  {
    id: "salesforce",
    name: "Salesforce",
    category: "saas",
    emoji: "☁️",
    color: "#00a1e0",
    tagline: "No software",
    founder: "Marc Benioff",
    year: 1999,
    famousCampaign: "'No Software' with the aerosol can logo",
    valuation: "$240B+ market cap",
    description: "The CRM that killed on-premise software",
    difficulty: 1,
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    category: "saas",
    emoji: "🐵",
    color: "#ffe01b",
    tagline: "Send better email",
    founder: "Ben Chestnut, Dan Kurzius",
    year: 2001,
    famousCampaign: "'Did you mean...?' autocomplete ads",
    valuation: "Acquired by Intuit ($12B)",
    description: "The email platform with the funny monkey",
    difficulty: 1,
  },
  {
    id: "semrush",
    name: "Semrush",
    category: "saas",
    emoji: "🔍",
    color: "#ff642d",
    tagline: "Online visibility made easy",
    founder: "Oleg Shchegolev",
    year: 2008,
    famousCampaign: "SEO data for every keyword on earth",
    valuation: "$2B+ market cap",
    description: "The SEO tool every marketer uses",
    difficulty: 1,
  },
  {
    id: "ahrefs",
    name: "Ahrefs",
    category: "saas",
    emoji: "🔗",
    color: "#0066cc",
    tagline: "The SEO tool you can trust",
    founder: "Dmitry Gerasimenko",
    year: 2010,
    famousCampaign: "Backlink index bigger than Google's",
    valuation: "$1B+ estimated",
    description: "The backlink analysis powerhouse",
    difficulty: 2,
  },
  {
    id: "canva",
    name: "Canva",
    category: "saas",
    emoji: "🎨",
    color: "#00c4cc",
    tagline: "Empowering the world to design",
    founder: "Melanie Perkins",
    year: 2013,
    famousCampaign: "Design school for everyone",
    valuation: "$40B+ valuation",
    description: "The design tool that democratized creativity",
    difficulty: 1,
  },
  {
    id: "moz",
    name: "Moz",
    category: "saas",
    emoji: "🐺",
    color: "#1c87c5",
    tagline: "SEO software you'll love",
    founder: "Rand Fishkin",
    year: 2004,
    famousCampaign: "Whiteboard Friday (Rand's beard)",
    valuation: "Acquired by Zeta Global",
    description: "The SEO education company with the mascot",
    difficulty: 2,
  },
  {
    id: "hootsuite",
    name: "Hootsuite",
    category: "saas",
    emoji: "🦉",
    color: "#143a54",
    tagline: "Manage all your social media",
    founder: "Ryan Holmes",
    year: 2008,
    famousCampaign: "The owl that managed every platform",
    valuation: "$1B+ valuation",
    description: "The social media management owl",
    difficulty: 1,
  },
  {
    id: "drift",
    name: "Drift",
    category: "saas",
    emoji: "💬",
    color: "#0066ff",
    tagline: "Conversational marketing",
    founder: "David Cancel",
    year: 2015,
    famousCampaign: "Invented 'conversational marketing' category",
    valuation: "Acquired by Salesloft",
    description: "The chatbot that became a category",
    difficulty: 2,
  },
  {
    id: "superhuman",
    name: "Superhuman",
    category: "saas",
    emoji: "⚡",
    color: "#000000",
    tagline: "The fastest email experience ever made",
    founder: "Rahul Vohra",
    year: 2017,
    famousCampaign: "Email at the speed of thought",
    valuation: "$825M valuation",
    description: "The email client that saves 4 hours/week",
    difficulty: 3,
  },
  {
    id: "intercom",
    name: "Intercom",
    category: "saas",
    emoji: "🗣️",
    color: "#1f8eed",
    tagline: "The Engagement Platform",
    founder: "Des Traynor, Eoghan McCabe",
    year: 2011,
    famousCampaign: "Customer messaging that doesn't suck",
    valuation: "$1.3B valuation",
    description: "The customer messaging platform",
    difficulty: 2,
  },

  // ─── DTC / E-commerce ─────────────────────────────────────────────────────
  {
    id: "dollar-shave",
    name: "Dollar Shave Club",
    category: "dtc",
    emoji: "🪒",
    color: "#00b3b3",
    tagline: "Shave time. Shave money.",
    founder: "Michael Dubin",
    year: 2011,
    famousCampaign: "'Our Blades Are F***ing Great' ($4.5K video)",
    valuation: "Acquired by Unilever ($1B)",
    description: "The $4,500 video that built a billion-dollar brand",
    difficulty: 1,
  },
  {
    id: "warby",
    name: "Warby Parker",
    category: "dtc",
    emoji: "👓",
    color: "#00a4e4",
    tagline: "Buy a pair, give a pair",
    founder: "Neil Blumenthal, Dave Gilboa",
    year: 2010,
    famousCampaign: "Home try-on: 5 glasses, 5 days, free",
    valuation: "$5B+ IPO",
    description: "The glasses brand that tried on a new model",
    difficulty: 1,
  },
  {
    id: "casper",
    name: "Casper",
    category: "dtc",
    emoji: "🛏️",
    color: "#5c5f6b",
    tagline: "The perfect mattress",
    founder: "Philip Krim",
    year: 2014,
    famousCampaign: "Mattress in a box (sleep is a product)",
    valuation: "$1B+ at IPO",
    description: "The mattress that came in a box",
    difficulty: 1,
  },
  {
    id: "gymshark",
    name: "Gymshark",
    category: "dtc",
    emoji: "💪",
    color: "#000000",
    tagline: "Be a visionary",
    founder: "Ben Francis",
    year: 2012,
    famousCampaign: "Influencer-led fitness community",
    valuation: "$1.3B valuation",
    description: "The gym wear brand built on Instagram",
    difficulty: 2,
  },
  {
    id: "allbirds",
    name: "Allbirds",
    category: "dtc",
    emoji: "🩰",
    color: "#2d5f3f",
    tagline: "The world's most comfortable shoes",
    founder: "Tim Brown",
    year: 2014,
    famousCampaign: "Wool shoes that are better for the planet",
    valuation: "$1B+ IPO",
    description: "The wool shoes that went public",
    difficulty: 2,
  },
  {
    id: "liquid-death",
    name: "Liquid Death",
    category: "dtc",
    emoji: "💀",
    color: "#000000",
    tagline: "Murder your thirst",
    founder: "Mike Cessario",
    year: 2017,
    famousCampaign: "Water in a beer can with a skull logo",
    valuation: "$1.4B valuation",
    description: "Water that looks like death metal",
    difficulty: 2,
  },

  // ─── Social Platforms ─────────────────────────────────────────────────────
  {
    id: "tiktok",
    name: "TikTok",
    category: "social",
    emoji: "🎵",
    color: "#000000",
    tagline: "Make Your Day",
    founder: "ByteDance / Zhang Yiming",
    year: 2016,
    famousCampaign: "The algorithm that ate the internet",
    valuation: "$200B+ (ByteDance)",
    description: "The platform that shrank attention spans",
    difficulty: 1,
  },
  {
    id: "instagram",
    name: "Instagram",
    category: "social",
    emoji: "📷",
    color: "#e1306c",
    tagline: "Share your story",
    founder: "Kevin Systrom, Mike Krieger",
    year: 2010,
    famousCampaign: "The square photo that changed photography",
    valuation: "$100B+ (estimated)",
    description: "The photo app that became a marketplace",
    difficulty: 1,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    category: "social",
    emoji: "💼",
    color: "#0a66c2",
    tagline: "Connect to opportunity",
    founder: "Reid Hoffman",
    year: 2003,
    famousCampaign: "The professional network that employers can't ignore",
    valuation: "Acquired by Microsoft ($26B)",
    description: "The B2B marketer's favorite platform",
    difficulty: 1,
  },
  {
    id: "twitter",
    name: "Twitter / X",
    category: "social",
    emoji: "🐦",
    color: "#1da1f2",
    tagline: "What's happening",
    founder: "Jack Dorsey",
    year: 2006,
    famousCampaign: "The town square that became a battleground",
    valuation: "$44B (Musk acquisition)",
    description: "The platform where brands live and die in public",
    difficulty: 1,
  },
  {
    id: "youtube",
    name: "YouTube",
    category: "social",
    emoji: "▶️",
    color: "#ff0000",
    tagline: "Broadcast yourself",
    founder: "Chad Hurley, Steve Chen, Jawed Karim",
    year: 2005,
    famousCampaign: "The second largest search engine in the world",
    valuation: "Part of Google ($400B+)",
    description: "The video platform that created influencers",
    difficulty: 1,
  },

  // ─── Media / Publications ────────────────────────────────────────────────
  {
    id: "hbr",
    name: "Harvard Business Review",
    category: "media",
    emoji: "📚",
    color: "#a51c30",
    tagline: "Ideas with impact",
    founder: "Harvard Business School",
    year: 1922,
    famousCampaign: "The thinking person's business magazine",
    valuation: "Nonprofit (Harvard)",
    description: "Where marketing strategy gets legitimized",
    difficulty: 2,
  },
  {
    id: "adage",
    name: "Ad Age",
    category: "media",
    emoji: "📰",
    color: "#000000",
    tagline: "The premier source for advertising news",
    founder: "Crain Communications",
    year: 1930,
    famousCampaign: "The ad industry's bible since 1930",
    valuation: "Private (Crain)",
    description: "The advertising industry's newspaper of record",
    difficulty: 2,
  },

  // ─── Masters' Companies ───────────────────────────────────────────────────
  {
    id: "clickfunnels",
    name: "ClickFunnels",
    category: "master",
    emoji: "🌀",
    color: "#0369a1",
    tagline: "Hook, story, offer",
    founder: "Russell Brunson",
    year: 2014,
    famousCampaign: "Free book + shipping (the value ladder)",
    valuation: "$100M+ ARR",
    description: "Brunson's funnel empire",
    difficulty: 1,
  },
  {
    id: "vayner",
    name: "VaynerMedia",
    category: "master",
    emoji: "🍷",
    color: "var(--accent)",
    tagline: "Day trading attention",
    founder: "Gary Vaynerchuk",
    year: 2009,
    famousCampaign: "Wine Library TV → $60M revenue",
    valuation: "$200M+ revenue",
    description: "GaryVee's attention empire",
    difficulty: 1,
  },
  {
    id: "empire",
    name: "Hormozi's Acquisition.com",
    category: "master",
    emoji: "💎",
    color: "#0369a1",
    tagline: "Make offers so good people feel stupid saying no",
    founder: "Alex Hormozi",
    year: 2020,
    famousCampaign: "Gym Launch → $75M/yr",
    valuation: "$100M+ portfolio",
    description: "Hormozi's acquisition and scaling firm",
    difficulty: 2,
  },
  {
    id: "godin",
    name: "The Carbon Almanac",
    category: "master",
    emoji: "🎯",
    color: "var(--accent)",
    tagline: "Marketing is the generous act of helping others",
    founder: "Seth Godin",
    year: 2022,
    famousCampaign: "The Practice + Akimbo podcast",
    valuation: "Books + courses empire",
    description: "Godin's publishing and education network",
    difficulty: 3,
  },
];

// ─── Game Engine ────────────────────────────────────────────────────────────

export type ClueType = "emoji" | "tagline" | "founder" | "campaign" | "description";

export interface GameRound {
  brand: Brand;
  clueType: ClueType;
  clue: string;
  options: string[]; // 4 multiple choice options
  correctIndex: number;
}

export interface GameResult {
  rounds: GameRound[];
  totalRounds: number;
}

const CLUE_LABELS: Record<ClueType, string> = {
  emoji: "Which brand uses this symbol?",
  tagline: "Which brand is known for this tagline?",
  founder: "Which brand was founded by this person?",
  campaign: "Which brand ran this famous campaign?",
  description: "Which brand fits this description?",
};

export function generateGame(roundCount: number = 10): GameResult {
  // Shuffle brands and pick roundCount
  const shuffled = [...BRANDS].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(roundCount, BRANDS.length));

  const rounds: GameRound[] = selected.map((brand) => {
    // Pick a random clue type
    const clueTypes: ClueType[] = ["emoji", "tagline", "founder", "campaign", "description"];
    const clueType = clueTypes[Math.floor(Math.random() * clueTypes.length)];

    let clue = "";
    switch (clueType) {
      case "emoji":
        clue = brand.emoji;
        break;
      case "tagline":
        clue = `"${brand.tagline}"`;
        break;
      case "founder":
        clue = brand.founder;
        break;
      case "campaign":
        clue = brand.famousCampaign;
        break;
      case "description":
        clue = brand.description;
        break;
    }

    // Generate 4 options (1 correct + 3 random wrong)
    const wrongOptions = BRANDS.filter((b) => b.id !== brand.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((b) => b.name);

    const options = [brand.name, ...wrongOptions].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(brand.name);

    return { brand, clueType, clue, options, correctIndex };
  });

  return { rounds, totalRounds: rounds.length };
}

export function getClueLabel(clueType: ClueType): string {
  return CLUE_LABELS[clueType];
}

// ─── Logo wall (for trust building) ─────────────────────────────────────────
export const LOGO_WALL = BRANDS.map((b) => ({
  id: b.id,
  name: b.name,
  emoji: b.emoji,
  color: b.color,
  category: b.category,
}));

export const BRAND_CATEGORIES: { id: BrandCategory; label: string }[] = [
  { id: "agency", label: "Agencies" },
  { id: "saas", label: "SaaS / MarTech" },
  { id: "dtc", label: "DTC Brands" },
  { id: "social", label: "Social Platforms" },
  { id: "media", label: "Media" },
  { id: "master", label: "Masters' Companies" },
];
