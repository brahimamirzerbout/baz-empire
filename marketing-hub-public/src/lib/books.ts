/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE BOOK VAULT — Marketing Knowledge from the Kali Archives
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Every marketing and business book looted from the other Kali,
 * cataloged, indexed, and wired into the Marketing Hub.
 *
 * Each book links to: the masters who taught its principles,
 * the Hub modules that embody them, and the formulas that prove them.
 *
 * "You are the same person at 30 as you were at 20,
 *  except for the books you read and the people you meet."
 *   — Charlie "Tremendous" Jones
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type BookCategory =
  | "copywriting"       // Words that sell
  | "advertising"       // Paid attention
  | "direct-response"   // Measurable marketing
  | "digital-marketing" // Online channels & tactics
  | "sales"             // Closing & negotiation
  | "persuasion"        // Psychology of influence
  | "strategy"          // Positioning, competition, business model
  | "funnels"           // Customer journey architecture
  | "growth"            // Scaling, startups, entrepreneurship
  | "brand"             // Identity, positioning, storytelling
  | "content"           // Content marketing, social media
  | "seo"               // Search engine optimization
  | "ai-marketing"      // AI-assisted marketing
  | "foundational"      // timeless principles, mindset, personal development
  | "negotiation"       // Deal-making, conflict resolution
  | "leadership"        // Management, organizational culture
  | "wealth"            // Financial literacy, wealth building
  | "habits"            // Behavior change, productivity
  | "startup"            // Startups, entrepreneurship
  | "military-strategy" // Applied to business

export type Difficulty = "beginner" | "intermediate" | "advanced" | "masterclass"

export interface BookInsight {
  /** The core lesson in one sentence */
  tldr: string;
  /** 3-5 key takeaways */
  takeaways: string[];
  /** Which Hub masters teach the same principles */
  relatedMasters: string[];
  /** Which Hub modules embody these principles */
  relatedModules: string[];
  /** Which Library formulas connect */
  relatedFormulas: string[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  category: BookCategory[];
  difficulty: Difficulty;
  /** Original file on the Kali */
  file?: string;
  /** One-line summary */
  summary: string;
  /** The big idea */
  bigIdea: string;
  /** Deep insights & Hub connections */
  insights: BookInsight;
  /** Memorable quotes from the book */
  quotes: { text: string; chapter?: string }[];
  /** Chapter-level reading map */
  chapters?: { number: number; title: string; why: string }[];
}

// ═══════════════════════════════════════════════════════════════════════════
// THE BOOKS — Cataloged from the Kali Archives
// ═══════════════════════════════════════════════════════════════════════════

export const BOOKS: Book[] = [
  /* ───────────── COPYWRITING ───────────── */
  {
    id: "breakthrough-advertising",
    title: "Breakthrough Advertising",
    author: "Eugene M. Schwartz",
    year: 1966,
    category: ["copywriting", "direct-response", "advertising"],
    difficulty: "masterclass",
    file: "Breakthrough_Advertising_DATASET.pdf",
    summary: "The most sophisticated book ever written on how advertising works. Introduces the 5 Levels of Awareness, Market Sophistication, and the Intensity Scale — the framework that determines what copy works, when, and why.",
    bigIdea: "You cannot create desire — you can only channel existing desire toward your product. Your copy strategy is determined by the awareness level of your audience and the sophistication of the market.",
    insights: {
      tldr: "Match your copy to the audience's awareness level and market sophistication — the wrong copy at the right awareness level fails every time.",
      takeaways: [
        "The 5 Awareness Levels (Unaware → Most Aware) determine your entire copy approach",
        "Market Sophistication (Stage 1–4) dictates whether you claim the benefit, claim superiority, claim a unique mechanism, or reframe the problem",
        "The Intensity Scale matches copy urgency to audience desire — mismatched intensity kills conversion",
        "Copy is not written — it is assembled from market research",
        "The headline is 80% of the ad; it must reach the right awareness level",
      ],
      relatedMasters: ["eugene-schwartz", "john-caples", "claude-hopkins"],
      relatedModules: ["copy", "personas", "funnels", "campaigns"],
      relatedFormulas: ["cvr", "funnel_cvr", "ctr"],
    },
    quotes: [
      { text: "You cannot create desire. You can only channel it to your product.", chapter: "Chapter 1" },
      { text: "Copy is not written. Copy is assembled.", chapter: "Chapter 2" },
      { text: "The best copywriters are the most relentless researchers.", chapter: "Chapter 2" },
    ],
    chapters: [
      { number: 1, title: "The Power of Mass Desire", why: "Understand that desire already exists — find it, don't create it" },
      { number: 2, title: "The Anatomy of Mass Desire", why: "Map the three intensities: pervasive, urgent, immediate" },
      { number: 3, title: "The Five Levels of Awareness", why: "The most important concept in copy — determines entire approach" },
      { number: 4, title: "Market Sophistication", why: "Stage 1–4 determines whether you claim, differentiate, or reframe" },
      { number: 5, title: "The Intensity Scale", why: "Match your copy's urgency to the audience's desire level" },
    ],
  },
  {
    id: "cashvertising",
    title: "Cashvertising",
    author: "Drew Eric Whitman",
    year: 2008,
    category: ["copywriting", "direct-response", "advertising"],
    difficulty: "intermediate",
    file: "Cashvertising_ How to Use More Than 100 Secrets of Ad-Agency Pso Make Big Money Selling Anything to Anyone - Drew Eric Whitman.pdf",
    summary: "100+ advertising psychology secrets from the ad agencies. The practical, tactical guide to writing copy that sells using the 8 basic desires and 9 secondary wants.",
    bigIdea: "All advertising appeals to one of 8 basic desires (survival, sex, affiliation, care, social approval, authority, safety, belonging) or 9 secondary wants. Hit the right desire and the copy almost writes itself.",
    insights: {
      tldr: "Human behavior is driven by 8 primary desires and 9 secondary wants — appeal to these and your copy sells itself.",
      takeaways: [
        "The 8 Basic Desires: survival, sexual companionship, affiliation, care for loved ones, social approval, authority, safety, belonging",
        "The 9 Secondary Wants: to be informed, curiosity, aesthetic satisfaction, money, convenience, cleanliness, efficiency, dependability, beauty",
        "Fear sells faster than hope — but hope sustains longer",
        "Every ad needs a hook, a promise, and proof — remove one and it fails",
        "The 'Life Force 8' are hardwired — they work across every culture and every era",
      ],
      relatedMasters: ["eugene-schwartz", "john-caples", "claude-hopkins"],
      relatedModules: ["copy", "landing-pages", "campaigns", "ads"],
      relatedFormulas: ["cvr", "ctr", "roas"],
    },
    quotes: [
      { text: "People don't buy products — they buy better versions of themselves." },
      { text: "The 8 Life Forces are hardwired into every human brain. Appeal to them and you can sell almost anything." },
      { text: "Your ad has 3 seconds to grab attention. Use them wisely." },
    ],
  },
  {
    id: "scientific-advertising",
    title: "Scientific Advertising",
    author: "Claude C. Hopkins",
    year: 1923,
    category: ["direct-response", "advertising", "copywriting"],
    difficulty: "beginner",
    file: "Scientific_Advertising.pdf",
    summary: "The foundational text of measurable marketing. Hopkins proved that advertising should be treated as a science — test everything, measure everything, kill what doesn't work, scale what does.",
    bigIdea: "Advertising is salesmanship in print. Every dollar must be accountable. Test with coupons, measure the result, and let the data decide.",
    insights: {
      tldr: "Treat advertising as a science, not an art. Test everything. Measure every dollar. Let data decide.",
      takeaways: [
        "Advertising is salesmanship multiplied — not art, not entertainment",
        "Use keyed coupons to test 50 headlines and find the winner",
        "Give a reason why — every claim needs a mechanism that makes it credible",
        "Free samples remove risk and prove quality — the sample is the salesperson",
        "The only purpose of advertising is to make sales — not impressions, not awareness",
      ],
      relatedMasters: ["claude-hopkins", "john-caples", "dan-kennedy"],
      relatedModules: ["experiments", "attribution", "lead-magnets", "ads"],
      relatedFormulas: ["roas", "cac", "cvr", "statistical_significance"],
    },
    quotes: [
      { text: "Advertising is salesmanship in print.", chapter: "Chapter 1" },
      { text: "The only purpose of advertising is to make sales. It is not for general effect.", chapter: "Chapter 1" },
      { text: "Almost any question can be answered cheaply, quickly and finally by a test.", chapter: "Chapter 6" },
      { text: "Platitudes and generalities roll off the human understanding like water from a duck.", chapter: "Chapter 3" },
    ],
  },
  {
    id: "masters-of-copywriting",
    title: "Masters of Copywriting / Breakthrough Copywriter 2.0",
    author: "Dr. Robert C. Worstell",
    year: 2018,
    category: ["copywriting", "direct-response"],
    difficulty: "intermediate",
    file: "Masters_of_Copywriting_Dr._Robert_C._Worstell_-_Breakthrough_Copywriter_2.0__An_Advertising_Field_Guide_to_Eugene_M._Schwartz_Classic-Midwest_Journal_Press_20181.epub",
    summary: "An advertising field guide to Eugene Schwartz's classic. Bridges Schwartz's Breakthrough Advertising to modern copywriting practice.",
    bigIdea: "Schwartz's awareness levels and market sophistication framework remain the most powerful copywriting system ever devised — this book makes them practical.",
    insights: {
      tldr: "Eugene Schwartz's framework is the operating system for all great copy — learn it, practice it, master it.",
      takeaways: [
        "The 5 awareness levels are the copywriter's compass — know where your audience stands",
        "Market sophistication tells you whether to claim, differentiate, or reframe",
        "Great copy is assembled from research, not invented from imagination",
        "The headline must match the awareness level — a mistake here kills the entire ad",
        "Swipe files are the copywriter's arsenal — collect winners, study their structure",
      ],
      relatedMasters: ["eugene-schwartz", "john-caples", "gary-halbert", "joseph-sugarman"],
      relatedModules: ["copy", "landing-pages", "emails"],
      relatedFormulas: ["cvr", "ctr"],
    },
    quotes: [
      { text: "The copywriter's most important skill is not writing — it's listening to the market." },
    ],
  },

  /* ───────────── DIRECT RESPONSE ───────────── */
  {
    id: "magnetic-marketing",
    title: "Magnetic Marketing",
    author: "Dan S. Kennedy & Rusty Shelton",
    year: 1992,
    category: ["direct-response", "sales", "strategy"],
    difficulty: "intermediate",
    file: "Magnetic Marketing_ How to Attract a Flood of New Customers Tha Stay, and Refer - Dan S. Kennedy _ Rusty Shelton _ Forbesbooks.pdf",
    summary: "The complete system for attracting customers instead of chasing them. Kennedy's three pillars: magnetic message, magnetic media, magnetic market — pull instead of push.",
    bigIdea: "Stop chasing prospects. Attract them with a magnetic message that pulls in your ideal customer and repels everyone else.",
    insights: {
      tldr: "The right message to the right audience through the right media is worth more than the best message to the wrong audience.",
      takeaways: [
        "The 3 Ms: Message, Market, Media — get all three aligned or nothing works",
        "Your customer list is your #1 asset — treat it like gold",
        "Every offer needs a real, specific deadline — 'limited time' is not a deadline",
        "Price is what you pay, value is what you get — never compete on price",
        "Direct response marketing is measurable — if you can't track it, don't spend it",
      ],
      relatedMasters: ["dan-kennedy", "claude-hopkins", "gary-halbert"],
      relatedModules: ["crm", "campaigns", "sequences", "budget"],
      relatedFormulas: ["cac", "ltv", "ltv_cac", "roas"],
    },
    quotes: [
      { text: "The money is in the list.", chapter: "Chapter 3" },
      { text: "If you can't track the ROI, don't spend the money." },
      { text: "Price is what you pay. Value is what you get." },
    ],
  },
  {
    id: "dotcom-secrets",
    title: "DotCom Secrets",
    author: "Russell Brunson",
    year: 2014,
    category: ["funnels", "digital-marketing", "direct-response"],
    difficulty: "beginner",
    file: "DotCom Secrets - Russell Brunson.pdf",
    summary: "The underground playbook for growing your company online. Introduces the value ladder, the hook-story-offer framework, and the concept of 'whoop' pages.",
    bigIdea: "Every business needs a value ladder — a series of ascending offers from free to premium. Build funnels that capture, nurture, and convert automatically.",
    insights: {
      tldr: "Build a value ladder from free to premium. Use funnels to automate the journey. Hook → Story → Offer is all marketing is.",
      takeaways: [
        "The Value Ladder: Free → Tripwire → Core Offer → Profit Maximizer → Continuity",
        "Hook, Story, Offer — the only three things that matter in any marketing",
        "Your frontend offer pays for acquisition. Your backend creates wealth.",
        "Every page has one job — move the visitor to the next step",
        "The 'whoop' page: a transition page between funnel steps that builds anticipation",
      ],
      relatedMasters: ["russell-brunson", "alex-hormozi", "dan-kennedy"],
      relatedModules: ["funnels", "landing-pages", "campaigns", "emails", "lead-magnets"],
      relatedFormulas: ["ltv", "ltv_cac", "cvr", "funnel_cvr"],
    },
    quotes: [
      { text: "Hook, story, offer — that's all marketing is.", chapter: "Section 1" },
      { text: "Your frontend pays for acquisition. Your backend creates wealth.", chapter: "Section 2" },
    ],
  },
  {
    id: "traffic-secrets",
    title: "Traffic Secrets",
    author: "Russell Brunson",
    year: 2020,
    category: ["digital-marketing", "growth", "content"],
    difficulty: "beginner",
    file: "Traffic Secrets - Russell Brunson.pdf",
    summary: "The underground playbook for filling your websites and funnels with your dream customers. Covers organic traffic, paid traffic, and the 'who' framework.",
    bigIdea: "Traffic is not about algorithms — it's about understanding who your dream customer is and showing up where they already are.",
    insights: {
      tldr: "Find your dream customer. Figure out where they hang out. Show up there consistently with value. The traffic follows.",
      takeaways: [
        "The 'Who' Framework: Who is your dream customer? Where do they hang out? What bait will attract them?",
        "Publish daily for 365 days — consistency builds the audience that builds the business",
        "Dream 100: Make a list of the 100 influencers/businesses who already have your dream customers",
        "Owned traffic (email list) > borrowed traffic (social followers) > paid traffic (ads)",
        "Every traffic source should feed the same funnel — the funnel is the asset, traffic is the fuel",
      ],
      relatedMasters: ["russell-brunson", "gary-vaynerchuk", "seth-godin"],
      relatedModules: ["campaigns", "seo", "ads", "content-calendar", "social-studio"],
      relatedFormulas: ["cac", "cvr", "ctr", "engagement_rate"],
    },
    quotes: [
      { text: "Your dream customers are already congregating somewhere. Find them and show up." },
      { text: "Publish daily for a year and you'll have a business." },
    ],
  },
  {
    id: "expert-secrets",
    title: "Expert Secrets",
    author: "Russell Brunson",
    year: 2017,
    category: ["funnels", "brand", "content"],
    difficulty: "intermediate",
    file: "Expert Secrets_ The Underground Playbook for Creating a Mass Movement of People Who Will Pay for Your Advice - Russell Brunson.pdf",
    summary: "How to build a mass movement of people who will pay for your advice. Creates a tribe, a cause, and a new opportunity.",
    bigIdea: "Build a mass movement by creating a new opportunity (not an improvement), giving it a name, and leading a tribe from a place of false beliefs to a place of truth.",
    insights: {
      tldr: "Don't offer improvement — offer transformation through a new opportunity. Name it. Build a tribe around it.",
      takeaways: [
        "New Opportunity > Improvement Offer — people don't want to improve; they want to start fresh",
        "The 3 elements of a mass movement: charismatic leader, future-based cause, new opportunity",
        "Epiphany Bridge: take them from false beliefs to new beliefs through a story",
        "The Perfect Webinar framework: stack the value, then reveal the price",
        "Your origin story is your most valuable marketing asset",
      ],
      relatedMasters: ["russell-brunson", "seth-godin", "donald-miller"],
      relatedModules: ["brand", "campaigns", "personas", "landing-pages"],
      relatedFormulas: ["cvr", "ltv"],
    },
    quotes: [
      { text: "A mass movement needs three things: a charismatic leader, a future-based cause, and a new opportunity." },
      { text: "Don't sell improvement. Sell a new opportunity." },
    ],
  },

  /* ───────────── PERSUASION & PSYCHOLOGY ───────────── */
  {
    id: "influence",
    title: "Influence: The Psychology of Persuasion",
    author: "Robert B. Cialdini",
    year: 1984,
    category: ["persuasion", "sales", "foundational"],
    difficulty: "beginner",
    file: "Influence_ The Psychology of Persuasion - Robert B. Cialdini.pdf",
    summary: "The foundational text on the 6 universal principles of influence: reciprocity, commitment/consistency, social proof, authority, liking, and scarcity. Every marketer must read this.",
    bigIdea: "There are 6 universal shortcuts the human brain uses to make decisions. Understand them and you understand marketing.",
    insights: {
      tldr: "People use 6 mental shortcuts to decide: reciprocity, consistency, social proof, authority, liking, and scarcity. Use them ethically.",
      takeaways: [
        "Reciprocity: give first, then ask — the first gift should be valuable, unexpected, and personalized",
        "Commitment & Consistency: small commitments lead to larger ones — the foot-in-the-door technique",
        "Social Proof: people look to others when uncertain — show that others have chosen you",
        "Authority: expertise and credibility signal trust — display credentials and social proof",
        "Liking: people buy from people they like — similarity, praise, and cooperation build liking",
        "Scarcity: genuine scarcity creates urgency — fake scarcity destroys trust",
      ],
      relatedMasters: ["robert-cialdini", "joseph-sugarman", "eugene-schwartz"],
      relatedModules: ["testimonials", "lead-magnets", "landing-pages", "forms"],
      relatedFormulas: ["cvr", "funnel_cvr", "nps"],
    },
    quotes: [
      { text: "People prefer to say yes to those they know and like.", chapter: "Chapter 5" },
      { text: "The idea is to give first, then ask.", chapter: "Chapter 2" },
      { text: "We view a behavior as correct in a given situation to the degree that we see others performing it.", chapter: "Chapter 4" },
    ],
  },
  {
    id: "how-to-win-friends",
    title: "How to Win Friends and Influence People",
    author: "Dale Carnegie",
    year: 1936,
    category: ["persuasion", "sales", "foundational"],
    difficulty: "beginner",
    file: "How to Win Friends and Influence People - Dale Carnegie.pdf",
    summary: "The original handbook on human relations. 30 principles for making people like you, winning them to your way of thinking, and changing people without resentment.",
    bigIdea: "You can make more friends in two months by becoming interested in other people than you can in two years by trying to get other people interested in you.",
    insights: {
      tldr: "Be genuinely interested in others. Smile. Listen. Make the other person feel important — and do it sincerely.",
      takeaways: [
        "Don't criticize, condemn, or complain — it puts people on the defensive",
        "Give honest and sincere appreciation — people crave recognition more than money",
        "Arouse in the other person an eager want — frame everything from their perspective",
        "Become genuinely interested in other people — curiosity is the ultimate networking tool",
        "Talk in terms of the other person's interests — self-interest drives all decisions",
      ],
      relatedMasters: ["robert-cialdini", "david-ogilvy", "donald-miller"],
      relatedModules: ["crm", "inbox", "personas", "surveys"],
      relatedFormulas: ["nps", "engagement_rate"],
    },
    quotes: [
      { text: "You can make more friends in two months by becoming interested in other people than in two years by trying to get people interested in you." },
      { text: "A person's name is to that person the sweetest sound in any language." },
      { text: "Talk to someone about themselves and they'll listen for hours." },
    ],
  },
  {
    id: "pitch-anything",
    title: "Pitch Anything",
    author: "Oren Klaff",
    year: 2011,
    category: ["sales", "persuasion", "negotiation"],
    difficulty: "intermediate",
    file: "Pitch Anything_ An Innovative Method for Presenting, Persuading, and Winning the Deal - Oren Klaff.pdf",
    summary: "The neuroeconomics of pitching. Introduces the STRONG method (Setting the frame, Telling the story, Revealing the intrigue, Offering the prize, Nailing the hookpoint, Getting the deal) based on how the croc brain filters information.",
    bigIdea: "The croc brain processes information before the neocortex. If your pitch doesn't survive the croc brain's filters (novel, high-status, time-sensitive), it never reaches the decision-maker.",
    insights: {
      tldr: "Frame control determines who wins the pitch. If you own the frame, you own the room. The croc brain filters everything — survive it first.",
      takeaways: [
        "Frame control: the person who controls the frame controls the conversation",
        "The croc brain filters for novelty, danger, and status — your pitch must trigger these",
        "Prizing: you are the prize, not the investor — flip the status dynamic",
        "Time compression: create urgency by showing that the opportunity is time-limited",
        "The STRONG method: Setting, Telling, Revealing, Offering, Nailing, Getting",
      ],
      relatedMasters: ["robert-cialdini", "alex-hormozi", "gary-halbert"],
      relatedModules: ["campaigns", "crm", "deals"],
      relatedFormulas: ["pipeline_coverage", "cvr"],
    },
    quotes: [
      { text: "If you are not generating intrigue, you are not pitching." },
      { text: "The person who controls the frame controls the conversation." },
    ],
  },

  /* ───────────── SALES ───────────── */
  {
    id: "fanatical-prospecting",
    title: "Fanatical Prospecting",
    author: "Jeb Blount",
    year: 2015,
    category: ["sales", "growth"],
    difficulty: "intermediate",
    file: "Fanatical Prospecting_ The Ultimate Guide to Opening Sales Conv Selling, Telephone, Email, Text, and Cold Calling - Jeb Blount.pdf",
    summary: "The definitive guide to filling your pipeline. Covers phone, email, text, social, and in-person prospecting with exact scripts and daily disciplines.",
    bigIdea: "The number one reason for pipeline failure is not prospecting enough. The fix is simple: prospect fanatically, every day, across multiple channels, with proven scripts.",
    insights: {
      tldr: "Prospect every day, across multiple channels, with proven scripts. The pipeline is the business.",
      takeaways: [
        "The 3 pillars: phone, text/email, social — use all three daily",
        "The 5-minute rule: any prospecting activity you can do in 5 minutes, do immediately",
        "The 30-day rule: if you stop prospecting for 30 days, your pipeline dies in 60",
        "Gold calling hours: 8–10am and 4–6pm — protect this time ruthlessly",
        "The law of replacement: for every deal you close, you need 3 new prospects entering the pipeline",
      ],
      relatedMasters: ["dan-kennedy", "gary-halbert"],
      relatedModules: ["crm", "sequences", "inbox", "campaigns"],
      relatedFormulas: ["pipeline_coverage", "cac", "cvr"],
    },
    quotes: [
      { text: "The number one reason for pipeline failure is not prospecting enough." },
      { text: "If you stop prospecting for 30 days, your pipeline dies in 60." },
    ],
  },
  {
    id: "gap-selling",
    title: "Gap Selling",
    author: "Keenan",
    year: 2019,
    category: ["sales", "persuasion"],
    difficulty: "intermediate",
    file: "Gap Selling_ Getting the Customer to Yes_ How Problem-Centric Selationships, Overcoming Objections, Closing and Price - Keenan.pdf",
    summary: "Problem-centric selling. Stop selling solutions — sell the gap between where the prospect is and where they want to be. The bigger the gap, the easier the sale.",
    bigIdea: "People buy to close a gap. Your job is to make the gap visible and painful, then show how your solution closes it.",
    insights: {
      tldr: "Don't sell the solution. Sell the gap between the current state and the desired state. Make the gap hurt.",
      takeaways: [
        "The Gap = Current State → Desired State. Your product is the bridge",
        "Most salespeople jump to the solution too fast — stay in the problem longer",
        "Discovery is the most important part of the sale — 70% of the call should be listening",
        "The bigger the gap, the easier the close — don't minimize problems, amplify them",
        "Impact questions: 'What happens if this problem isn't solved?' — this creates urgency",
      ],
      relatedMasters: ["donald-miller", "alex-hormozi", "robert-cialdini"],
      relatedModules: ["crm", "personas", "campaigns", "funnels"],
      relatedFormulas: ["pipeline_coverage", "cvr"],
    },
    quotes: [
      { text: "Stop selling solutions. Sell the gap." },
      { text: "The bigger the gap, the easier the close." },
    ],
  },
  {
    id: "psychology-of-selling",
    title: "The Psychology of Selling",
    author: "Brian Tracy",
    year: 1981,
    category: ["sales", "persuasion"],
    difficulty: "beginner",
    file: "Psychology of Selling_ How to Sell More, Easier, and Faster Than You Ever Thought Possible, The - Brian Tracy.pdf",
    summary: "The mental game of selling. Tracy's key insight: selling is 80% psychology and 20% technique. Your mindset determines your results more than any script or tactic.",
    bigIdea: "Selling is 80% inner game (your psychology) and 20% outer game (your technique). Master your mindset and the sales follow.",
    insights: {
      tldr: "Your sales results are determined by your self-concept. Raise your self-concept and your sales rise automatically.",
      takeaways: [
        "Self-concept: you cannot outperform your self-concept for more than a short period",
        "Goal setting: write your goals daily, in the present tense, as if already achieved",
        "The 6 buying motives: desire for gain, fear of loss, comfort, pride, satisfaction, security",
        "The law of attraction in sales: your dominant thoughts attract corresponding customers",
        "Prospecting is a numbers game — the more you contact, the luckier you get",
      ],
      relatedMasters: ["dan-kennedy", "gary-halbert"],
      relatedModules: ["crm", "personas", "campaigns"],
      relatedFormulas: ["pipeline_coverage", "cvr"],
    },
    quotes: [
      { text: "You cannot outperform your self-concept for more than a short period." },
      { text: "Selling is 80% psychology and 20% technique." },
    ],
  },
  {
    id: "way-of-the-wolf",
    title: "Way of the Wolf: Straight Line Selling",
    author: "Jordan Belfort",
    year: 2017,
    category: ["sales", "persuasion"],
    difficulty: "intermediate",
    file: "Way of the Wolf_ Straight Line Selling_ Master the Art of Persuasion, Influence, and Success - Jordan Belfort.pdf",
    summary: "The Straight Line Persuasion system: every sale follows a straight line from open to close. The art is keeping the prospect on that line by building certainty in the product, the company, and you.",
    bigIdea: "Every sale is a straight line. The prospect will try to zigzag off the line. Your job is to keep them on it by building three certainties: the product works, you can be trusted, the company is solid.",
    insights: {
      tldr: "Keep the sale on a straight line by building certainty in the product, the company, and yourself.",
      takeaways: [
        "The 3 10s: the prospect must be at a 10 on product, trust in you, and trust in company",
        "The Straight Line: open → gather intelligence → build certainty → close",
        "Tonality and body language matter more than words in the first 4 seconds",
        "Looping: if they say no, don't push — loop back to building certainty",
        "The art of the close is not pushing — it's making the decision feel inevitable",
      ],
      relatedMasters: ["robert-cialdini", "oren-klaff"],
      relatedModules: ["crm", "campaigns", "personas"],
      relatedFormulas: ["cvr", "pipeline_coverage"],
    },
    quotes: [
      { text: "Every sale is a straight line from open to close." },
      { text: "The first 4 seconds determine the entire relationship." },
    ],
  },
  {
    id: "ultimate-sales-machine",
    title: "The Ultimate Sales Machine",
    author: "Chet Holmes",
    year: 2007,
    category: ["sales", "strategy", "growth"],
    difficulty: "intermediate",
    file: "The Ultimate Sales Machine - Chet Holmes.pdf",
    summary: "12 key strategies for growing any business. Holmes' core insight: pig-headed discipline beats brilliant strategy every time. Focus on 12 things, execute them relentlessly.",
    bigIdea: "It's not about doing 5000 things. It's about doing 12 things 5000 times. Pig-headed discipline and focus beat talent and strategy.",
    insights: {
      tldr: "Pig-headed discipline beats brilliant strategy. Pick 12 strategies and execute them relentlessly.",
      takeaways: [
        "The 12 strategies: time management, training, meetings, strategic planning, education-based marketing, testimonials, PR, direct mail, referrals, internet, trade shows, the dream 100",
        "The Dream 100: make a list of 100 ideal clients and pursue them relentlessly until they buy",
        "Education-based marketing: teach, don't sell — position yourself as the expert",
        "The Core Story: create a compelling educational piece that positions you as the authority",
        "Pig-headed discipline: do the same things over and over until they work — consistency is the weapon",
      ],
      relatedMasters: ["dan-kennedy", "gary-halbert", "claude-hopkins"],
      relatedModules: ["crm", "campaigns", "content-calendar", "sequences"],
      relatedFormulas: ["cac", "ltv", "pipeline_coverage"],
    },
    quotes: [
      { text: "It's not about doing 5000 things. It's about doing 12 things 5000 times." },
      { text: "The Dream 100: pursue your 100 ideal clients relentlessly until they buy." },
    ],
  },

  /* ───────────── DIGITAL MARKETING ───────────── */
  {
    id: "digital-marketing-textbook",
    title: "Digital Marketing (Strategy & Implementation)",
    author: "Iain Grant & Dave Chaffey",
    year: 2020,
    category: ["digital-marketing", "strategy"],
    difficulty: "beginner",
    file: "0749453893-Digital-Marketing.pdf",
    summary: "The comprehensive textbook on digital marketing strategy and implementation. Covers SEO, PPC, social media, email, analytics, and conversion optimization.",
    bigIdea: "Digital marketing is not a channel — it's a strategy that integrates all channels into a unified customer journey.",
    insights: {
      tldr: "Integrate all digital channels into a unified strategy. Each channel supports the others. The journey is the strategy.",
      takeaways: [
        "SOSTAC: Situation, Objectives, Strategy, Tactics, Action, Control — the planning framework",
        "RACE: Reach, Act, Convert, Engage — the customer lifecycle framework",
        "Content, context, and channel must align — the same message on the wrong channel fails",
        "Data-driven decision making: measure everything, optimize continuously",
        "The customer journey is non-linear — design for multiple entry points",
      ],
      relatedMasters: ["philip-kotler", "ryan-deiss"],
      relatedModules: ["campaigns", "analytics", "seo", "ads", "funnels"],
      relatedFormulas: ["cvr", "roas", "cac", "ltv"],
    },
    quotes: [
      { text: "Digital marketing is not a channel. It's a strategy." },
    ],
  },
  {
    id: "modern-digital-marketing",
    title: "A Step-By-Step Guide to Modern Digital Marketing",
    author: "Various",
    year: 2020,
    category: ["digital-marketing"],
    difficulty: "beginner",
    file: "A-Step-By-Step-Guide-to-Modern-Digital-Marketing.pdf",
    summary: "Practical step-by-step guide covering SEO, social media, email marketing, content marketing, PPC, and analytics.",
    bigIdea: "Modern digital marketing is an integrated system, not a collection of tactics. Master the basics first, then scale.",
    insights: {
      tldr: "Start with fundamentals (SEO, content, email), measure everything, then scale what works.",
      takeaways: [
        "SEO is a long game — start with on-page optimization and content",
        "Email marketing has the highest ROI of any digital channel",
        "Content is the fuel that feeds all other channels",
        "Social media is about engagement, not broadcasting",
        "Analytics is not optional — it's the steering wheel",
      ],
      relatedMasters: ["gary-vaynerchuk", "seth-godin"],
      relatedModules: ["seo", "emails", "content-calendar", "analytics"],
      relatedFormulas: ["roas", "engagement_rate", "cvr"],
    },
    quotes: [
      { text: "Digital marketing without analytics is like driving with your eyes closed." },
    ],
  },
  {
    id: "big-book-digital-marketing",
    title: "Big Book of Digital Marketing",
    author: "Various",
    year: 2023,
    category: ["digital-marketing", "strategy"],
    difficulty: "beginner",
    file: "Big-Book-of-Digital-Marketing.pdf",
    summary: "Comprehensive reference covering all aspects of digital marketing from strategy to execution.",
    bigIdea: "Digital marketing success comes from systematic execution across all channels, not hero tactics on any single one.",
    insights: {
      tldr: "Systematic execution across all channels beats hero tactics on any single channel.",
      takeaways: [
        "The best channel strategy is an omnichannel strategy",
        "Consistency beats creativity — same message, multiple touchpoints",
        "Attribution modeling reveals which channels actually drive conversion",
        "Test small, scale what works, kill what doesn't",
        "The customer doesn't see channels — they see the brand",
      ],
      relatedMasters: ["philip-kotler", "ryan-deiss", "gary-vaynerchuk"],
      relatedModules: ["campaigns", "attribution", "analytics", "brand"],
      relatedFormulas: ["roas", "cac", "attribution"],
    },
    quotes: [
      { text: "The customer doesn't see channels. They see the brand." },
    ],
  },
  {
    id: "seo-2023",
    title: "SEO 2023: Learn Search Engine Optimization",
    author: "Adam Clarke",
    year: 2023,
    category: ["seo", "digital-marketing"],
    difficulty: "beginner",
    file: "400) SEO 2023. Learn Search Engine Optimization With Smart Internet Marketing Strategies (Adam Clarke) 2023.pdf",
    summary: "Updated SEO strategies for 2023. Covers on-page, off-page, technical SEO, content strategy, and Google algorithm changes.",
    bigIdea: "SEO is not about gaming Google — it's about being the best answer to the searcher's question.",
    insights: {
      tldr: "Be the best answer. Optimize for the searcher, not the algorithm. The algorithm rewards what searchers reward.",
      takeaways: [
        "Core Web Vitals are now ranking factors — speed, interactivity, visual stability",
        "E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) is Google's quality framework",
        "Content clusters beat isolated blog posts — build topic authority",
        "Internal linking is the most underrated SEO tactic",
        "Featured snippets are the new #1 position — structure your content for them",
      ],
      relatedMasters: ["seth-godin", "david-ogilvy"],
      relatedModules: ["seo", "content-calendar", "analytics"],
      relatedFormulas: ["ctr", "cvr"],
    },
    quotes: [
      { text: "Be the best answer, not the most optimized page." },
    ],
  },

  /* ───────────── AI MARKETING ───────────── */
  {
    id: "ai-marketing-revolution",
    title: "The AI Marketing Revolution",
    author: "Vitalij Kolotikov",
    year: 2024,
    category: ["ai-marketing", "digital-marketing"],
    difficulty: "beginner",
    file: "The AI Marketing Revolution_ Unleash the Power of Artificial -- Vitalij Kolotikov -- 1st Edition, 2024 -- FDS Cards ltd -- 9789934919909 -- 24eb45c1fd61116ceda0dc2ccd25d30d -- Anna's Archive.epub",
    summary: "How AI is transforming marketing strategy, content creation, personalization, and analytics. Practical guide to integrating AI tools into your marketing workflow.",
    bigIdea: "AI doesn't replace marketers — it amplifies them. The marketers who use AI will replace the marketers who don't.",
    insights: {
      tldr: "AI amplifies marketers. Use it for content generation, personalization, analytics, and automation — but keep the strategy human.",
      takeaways: [
        "AI-generated content needs human editing — it's a first draft, not a final product",
        "Personalization at scale: AI can personalize every message for every customer segment",
        "Predictive analytics: AI identifies patterns humans miss — use it for lead scoring and churn prediction",
        "The AI marketing stack: generation, optimization, analysis, automation",
        "Strategy is human. Execution can be AI-assisted. Never outsource strategy to AI",
      ],
      relatedMasters: ["gary-vaynerchuk", "seth-godin"],
      relatedModules: ["copy", "analytics", "automations", "intelligence"],
      relatedFormulas: ["cvr", "engagement_rate", "churn_rate"],
    },
    quotes: [
      { text: "AI doesn't replace marketers. It amplifies them." },
      { text: "The marketers who use AI will replace the marketers who don't." },
    ],
  },

  /* ───────────── FUNNELS & OFFERS ───────────── */
  {
    id: "100m-offers",
    title: "$100M Offers",
    author: "Alex Hormozi",
    year: 2021,
    category: ["funnels", "sales", "strategy"],
    difficulty: "beginner",
    summary: "How to create offers so good people feel stupid saying no. The Grand Slam Offer framework: dream outcome, perceived likelihood, time to achievement, effort & sacrifice.",
    bigIdea: "Make an offer so good people feel stupid saying no. Value = (Dream Outcome × Perceived Likelihood) / (Time × Effort). Stack value, reverse risk, make it a no-brainer.",
    insights: {
      tldr: "Create Grand Slam Offers by stacking value, reversing risk, and making the decision feel stupid to say no to.",
      takeaways: [
        "The Value Equation: Value = (Dream Outcome × Perceived Likelihood) / (Time × Effort)",
        "Risk reversal: the customer should carry zero risk — money-back guarantees, performance promises",
        "Bonus stacking: add bonuses until the perceived value is 10x the price",
        "The offer IS the product — a great offer with mediocre execution beats a mediocre offer with great execution",
        "Price objections are almost always value objections in disguise",
      ],
      relatedMasters: ["alex-hormozi", "dan-kennedy", "russell-brunson"],
      relatedModules: ["funnels", "landing-pages", "lead-magnets", "campaigns"],
      relatedFormulas: ["ltv", "ltv_cac", "price_elasticity", "break_even"],
    },
    quotes: [
      { text: "Make an offer so good people feel stupid saying no." },
      { text: "You don't need better ads. You need better offers." },
      { text: "Create more value than you capture." },
    ],
  },

  /* ───────────── STRATEGY & POSITIONING ───────────── */
  {
    id: "zero-to-one",
    title: "Zero to One",
    author: "Peter Thiel & Blake Masters",
    year: 2014,
    category: ["strategy", "growth", "startup"],
    difficulty: "intermediate",
    file: "Zero to One_ Notes on Startups, or How to Build the Future - Peter Thiel _ Blake Masters.pdf",
    summary: "Every moment in business happens only once. The next Bill Gates won't build an OS. The next Larry Page won't build a search engine. If you're copying, you're not learning.",
    bigIdea: "Competition is for losers. Build a monopoly by creating something genuinely new — from zero to one, not one to n.",
    insights: {
      tldr: "Build a monopoly by creating something new. Competition is for losers. Go from zero to one.",
      takeaways: [
        "Zero to One: creating something new vs. One to n: copying what works",
        "The 7 questions: engineering, timing, monopoly, people, distribution, durability, secret",
        "Start small and monopolize a niche before expanding",
        "The power law: one investment pays for all the others — find that one",
        "Sales matter as much as product — distribution is not an afterthought",
      ],
      relatedMasters: ["peter-drucker", "philip-kotler", "al-ries-jack-trout"],
      relatedModules: ["competitors", "brand", "campaigns"],
      relatedFormulas: ["ltv_cac", "rule_of_40"],
    },
    quotes: [
      { text: "Competition is for losers." },
      { text: "Every moment in business happens only once." },
      { text: "The most valuable businesses of the future will be the ones that create something new." },
    ],
  },
  {
    id: "lean-startup",
    title: "The Lean Startup",
    author: "Eric Ries",
    year: 2011,
    category: ["strategy", "growth", "startup"],
    difficulty: "beginner",
    file: "Lean Startup_ How Today_s Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses, The - Eric Ries.pdf",
    summary: "The methodology for building startups under conditions of extreme uncertainty. Build-Measure-Learn feedback loop, minimum viable product, innovation accounting.",
    bigIdea: "The only reason to build a product is to learn. Build the minimum viable product, measure its impact, learn from the data, and pivot or persevere.",
    insights: {
      tldr: "Build-Measure-Learn. Start with an MVP, measure its impact, learn, and iterate. Validated learning is the unit of progress.",
      takeaways: [
        "Build-Measure-Learn is the feedback loop — speed through the loop is your competitive advantage",
        "MVP: the minimum product that lets you learn. Not the minimum product you can ship",
        "Innovation accounting: define metrics that matter, don't use vanity metrics",
        "Pivot or persevere: if the data says change, change fast",
        "Five Whys: ask 'why' 5 times to find root cause — not surface symptom",
      ],
      relatedMasters: ["w-edwards-deming", "claude-hopkins"],
      relatedModules: ["experiments", "analytics", "funnels", "campaigns"],
      relatedFormulas: ["cvr", "statistical_significance", "sample_size"],
    },
    quotes: [
      { text: "The only reason to build a product is to learn." },
      { text: "Innovation accounting: measure progress with validated learning, not vanity metrics." },
    ],
  },
  {
    id: "e-myth-revisited",
    title: "The E-Myth Revisited",
    author: "Michael E. Gerber",
    year: 1995,
    category: ["strategy", "growth", "foundational"],
    difficulty: "beginner",
    file: "E-Myth Revisited_ Why Most Small Businesses Don_t Work and What to Do About It, The - Michael E. Gerber.pdf",
    summary: "Most businesses fail because the founder is a technician suffering from an entrepreneurial seizure. The fix: build systems that let the business run without you.",
    bigIdea: "Every business owner plays three roles: technician, manager, and entrepreneur. Most founders are trapped in the technician role. The business must be a system, not a job.",
    insights: {
      tldr: "Stop working IN your business and start working ON it. Build systems. Create processes. Make yourself unnecessary.",
      takeaways: [
        "The 3 roles: Technician (doing the work), Manager (organizing), Entrepreneur (visioning)",
        "Most founders are technicians who had an 'entrepreneurial seizure' — they like baking, not running a bakery",
        "The franchise prototype: build every process as if you were going to franchise it",
        "SOPs are the business — if it's not documented, it doesn't exist",
        "Work ON the business, not IN it — this is the single most important shift",
      ],
      relatedMasters: ["w-edwards-deming", "peter-drucker"],
      relatedModules: ["playbooks", "automations", "campaigns"],
      relatedFormulas: ["cac", "ltv"],
    },
    quotes: [
      { text: "Most entrepreneurs are merely technicians with an entrepreneurial seizure." },
      { text: "Work ON your business, not IN it." },
    ],
  },
  {
    id: "lean-marketing",
    title: "Lean Marketing",
    author: "Allan Dib",
    year: 2024,
    category: ["strategy", "digital-marketing"],
    difficulty: "beginner",
    file: "Lean Marketing_ More leads_ More profit_ Less marketing_ -- Allan Dib -- 2024 -- Page Two -- aa0bbfc02a23d8dba2ecf92ba3573662 -- Anna's Archive.pdf",
    summary: "More leads, more profit, less marketing. The lean approach: strip away waste, focus on what works, and create a 1-page marketing plan.",
    bigIdea: "Marketing doesn't need to be complex or expensive. The 1-page marketing plan covers: target market, message, media, offer, and follow-up. Everything else is waste.",
    insights: {
      tldr: "A 1-page marketing plan beats a 50-page marketing strategy. Focus on target, message, media, offer, follow-up.",
      takeaways: [
        "The 3 phases: Before (prospects), During (leads), After (customers)",
        "Target market: get specific — 'everyone' is not a target",
        "The right message to the right market through the right media = profit",
        "Lead magnets should be valuable enough to charge for — give them away",
        "Follow-up is where the money is — most businesses give up after 1 contact",
      ],
      relatedMasters: ["dan-kennedy", "alex-hormozi"],
      relatedModules: ["campaigns", "personas", "sequences", "lead-magnets"],
      relatedFormulas: ["cac", "ltv", "ltv_cac"],
    },
    quotes: [
      { text: "More leads, more profit, less marketing." },
      { text: "The right message to the right market through the right media." },
    ],
  },

  /* ───────────── WEALTH & MINDSET ───────────── */
  {
    id: "think-and-grow-rich",
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    year: 1937,
    category: ["foundational", "wealth"],
    difficulty: "beginner",
    file: "Think and Grow Rich - Napoleon Hill.pdf",
    summary: "The original wealth mindset book. 13 principles distilled from 500+ interviews with the wealthiest people of the early 20th century.",
    bigIdea: "Thoughts become things. Desire, faith, and persistence, organized through a definite plan, are the starting point of all achievement.",
    insights: {
      tldr: "Define a specific goal, create a plan, and persist until you achieve it. Your mindset determines your outcome.",
      takeaways: [
        "Burning desire: start with a specific, measurable goal and a deadline",
        "Faith: visualize yourself already in possession of the goal",
        "Autosuggestion: repeat your goal daily until it becomes embedded in your subconscious",
        "Mastermind: surround yourself with people who challenge and support you",
        "The 6 ghosts of fear: poverty, criticism, ill health, loss of love, old age, death — face them",
      ],
      relatedMasters: ["alex-hormozi", "russell-brunson"],
      relatedModules: ["campaigns", "brand", "personas"],
      relatedFormulas: [],
    },
    quotes: [
      { text: "Whatever the mind can conceive and believe, it can achieve." },
      { text: "A goal without a plan is just a wish." },
    ],
  },
  {
    id: "compound-effect",
    title: "The Compound Effect",
    author: "Darren Hardy",
    year: 2010,
    category: ["habits", "foundational"],
    difficulty: "beginner",
    file: "The Compound Effect - Darren Hardy.pdf",
    summary: "Small, consistent actions, compounded over time, produce massive results. The difference between success and failure is not dramatic — it's incremental.",
    bigIdea: "The compound effect: small, smart choices + consistency + time = radical difference. It's not about big moves — it's about small ones, repeated daily.",
    insights: {
      tldr: "Small consistent actions beat dramatic sporadic efforts. 1% better every day = 37x better in a year.",
      takeaways: [
        "The Compound Effect: small choices + consistency + time = radical results",
        "Track everything: what gets measured gets managed (Drucker, Deming)",
        "1% better every day compounds to 37x improvement in a year",
        "Big goals are achieved through small, daily disciplines — not dramatic one-time events",
        "Eliminate the 5%: find the small inputs that produce the biggest outputs",
      ],
      relatedMasters: ["w-edwards-deming", "peter-drucker"],
      relatedModules: ["analytics", "campaigns", "playbooks"],
      relatedFormulas: ["rule_of_40", "mrr_growth"],
    },
    quotes: [
      { text: "Small, smart choices + consistency + time = radical difference." },
      { text: "It's not the big moves that make the difference. It's the small ones." },
    ],
  },
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    year: 2018,
    category: ["habits", "foundational"],
    difficulty: "beginner",
    file: "Atomic Habits_ An Easy _ Proven Way to Build Good Habits _ Break Bad Ones - James Clear.pdf",
    summary: "Tiny changes, remarkable results. The four laws of behavior change: make it obvious, make it attractive, make it easy, make it satisfying.",
    bigIdea: "You do not rise to the level of your goals. You fall to the level of your systems. Build systems, not goals.",
    insights: {
      tldr: "Build systems, not goals. Make good habits obvious, attractive, easy, and satisfying. Make bad habits invisible, unattractive, difficult, and unsatisfying.",
      takeaways: [
        "The 4 Laws: (1) Make it obvious, (2) Make it attractive, (3) Make it easy, (4) Make it satisfying",
        "Identity-based habits: 'I am a runner' beats 'I want to run'",
        "Habit stacking: after [current habit], I will [new habit]",
        "The 2-minute rule: scale down any habit to 2 minutes to start",
        "Environment design: shape your environment to make good habits easier and bad habits harder",
      ],
      relatedMasters: ["w-edwards-deming", "claude-hopkins"],
      relatedModules: ["playbooks", "campaigns", "content-calendar"],
      relatedFormulas: [],
    },
    quotes: [
      { text: "You do not rise to the level of your goals. You fall to the level of your systems." },
      { text: "Every action you take is a vote for the type of person you wish to become." },
    ],
  },
  {
    id: "48-laws-of-power",
    title: "The 48 Laws of Power",
    author: "Robert Greene",
    year: 1998,
    category: ["strategy", "military-strategy"],
    difficulty: "advanced",
    file: "48 Laws of Power - Robert Greene.pdf",
    summary: "The ruthless manual of power dynamics. 48 laws distilled from 3,000 years of history. Essential for understanding competitive strategy.",
    bigIdea: "Power is neither good nor evil — it is a tool. Understand how it works, or become a victim of those who do.",
    insights: {
      tldr: "Power follows patterns. Learn the patterns or be manipulated by those who have.",
      takeaways: [
        "Law 1: Never outshine the master — let those above you feel superior",
        "Law 3: Conceal your intentions — keep people off balance",
        "Law 15: Crush your enemy totally — half measures create vendettas",
        "Law 16: Use absence to increase respect — scarcity creates value",
        "Law 28: Enter action with boldness — hesitation creates doubt",
      ],
      relatedMasters: ["michael-porter", "al-ries-jack-trout"],
      relatedModules: ["competitors", "brand", "campaigns"],
      relatedFormulas: [],
    },
    quotes: [
      { text: "Power is not everything. It is the only thing." },
      { text: "Never outshine the master." },
    ],
  },
  {
    id: "art-of-war",
    title: "The Art of War",
    author: "Sun Tzu",
    year: -500,
    category: ["military-strategy", "strategy"],
    difficulty: "intermediate",
    file: "Sun_Tzu__Lionel_Giles_Translator_-_The_Art_of_War-Project_Gutenberg_1994-1.pdf",
    summary: "The oldest military treatise in the world. Its principles of strategy, deception, and competitive advantage apply directly to business and marketing.",
    bigIdea: "Every battle is won before it is fought. Victory comes from knowing yourself, knowing your enemy, and choosing the terrain.",
    insights: {
      tldr: "Know yourself, know your enemy, and choose your terrain. The battle is won before it begins.",
      takeaways: [
        "Know yourself and know your enemy — you need not fear the result of 100 battles",
        "All warfare is based on deception — appear weak when you are strong",
        "The supreme art of war is to subdue the enemy without fighting",
        "In the midst of chaos, there is also opportunity",
        "Speed is the essence of war — take advantage of the enemy's unreadiness",
      ],
      relatedMasters: ["michael-porter", "al-ries-jack-trout"],
      relatedModules: ["competitors", "brand", "campaigns", "intelligence"],
      relatedFormulas: [],
    },
    quotes: [
      { text: "Every battle is won before it is fought." },
      { text: "Know yourself and know your enemy, and you need not fear the result of 100 battles." },
      { text: "The supreme art of war is to subdue the enemy without fighting." },
    ],
  },
  {
    id: "personal-mba",
    title: "The Personal MBA",
    author: "Josh Kaufman",
    year: 2010,
    category: ["strategy", "foundational", "wealth"],
    difficulty: "beginner",
    file: "Personal MBA_ Master the Art of Business, The - Josh Kaufman.pdf",
    summary: "A world-class business education in one book. Covers the 12 core disciplines of business: value creation, marketing, sales, value delivery, finance, the human mind, etc.",
    bigIdea: "You don't need an MBA — you need to understand the core principles of business. Every complex system is made of simple parts. Learn the parts.",
    insights: {
      tldr: "Business is 5 things: value creation, marketing, sales, value delivery, finance. Master each.",
      takeaways: [
        "Value creation: find a valuable problem and solve it better than anyone else",
        "Marketing: getting attention, then convincing people you have something they want",
        "Sales: closing the deal — turning prospects into customers",
        "Value delivery: giving customers what you promised, reliably and consistently",
        "Finance: understanding the numbers that tell you if your business is actually working",
      ],
      relatedMasters: ["philip-kotler", "peter-drucker"],
      relatedModules: ["campaigns", "budget", "analytics", "crm"],
      relatedFormulas: ["cac", "ltv", "ltv_cac", "gross_margin", "mrr_growth"],
    },
    quotes: [
      { text: "Every business is a collection of processes that can be improved." },
      { text: "You don't need an MBA. You need to understand the core principles." },
    ],
  },

  /* ───────────── SALES & NEGOTIATION ───────────── */
  {
    id: "never-split-the-difference",
    title: "Never Split the Difference",
    author: "Chris Voss & Tahl Raz",
    year: 2016,
    category: ["negotiation", "sales", "persuasion"],
    difficulty: "intermediate",
    file: "Never Split the Difference_ Negotiating as if Your Life Depended on It - Chris Voss _ Tahl Raz.pdf",
    summary: "Negotiation techniques from an FBI hostage negotiator. Tactical empathy, calibrated questions, mirroring, and labeling — applied to business.",
    bigIdea: "Never split the difference. Splitting the difference is a lazy compromise. Use tactical empathy and calibrated questions to discover what the other side really wants.",
    insights: {
      tldr: "Use tactical empathy, mirroring, and calibrated questions. Never split the difference — that's a lazy compromise.",
      takeaways: [
        "Mirroring: repeat the last 1-3 words — it makes people elaborate and feel heard",
        "Labeling: 'It seems like you're concerned about...' — naming emotions defuses them",
        "Calibrated questions: 'How am I supposed to do that?' — forces the other side to solve your problem",
        "The Accusation Audit: list every negative thing they could say about you before they say it",
        "No is the start of the negotiation, not the end — 'No' makes people feel safe",
      ],
      relatedMasters: ["robert-cialdini", "gary-halbert"],
      relatedModules: ["crm", "campaigns", "personas"],
      relatedFormulas: ["pipeline_coverage"],
    },
    quotes: [
      { text: "Never split the difference." },
      { text: "He who has learned to disagree without being disagreeable has discovered the most valuable secret of negotiation." },
    ],
  },

  /* ───────────── BRAND & GROWTH ───────────── */
  {
    id: "international-marketing-research",
    title: "International Marketing Research",
    author: "V. Kumar",
    year: 2024,
    category: ["strategy", "digital-marketing"],
    difficulty: "advanced",
    file: "International Marketing Research _ A Transformative Approach -- V_ Kumar -- Springer Nature (Textbooks & Major Reference Works), Cham, -- Palgrave -- 9783031546495 -- c2f201d256bc5467558b0e172c1c2466 -- Anna's Archive.pdf",
    summary: "Transformative approach to international marketing research. Covers cross-cultural consumer behavior, global brand strategy, and market entry frameworks.",
    bigIdea: "Global marketing is not local marketing translated — it requires understanding cultural, economic, and institutional differences in each market.",
    insights: {
      tldr: "Global expansion requires understanding local cultural, economic, and institutional contexts. Don't translate — transform.",
      takeaways: [
        "Cultural dimensions (Hofstede) dramatically affect marketing effectiveness",
        "Market entry strategy depends on institutional distance — not just geographic distance",
        "Brand positioning must be globally consistent but locally resonant",
        "Data-driven market selection beats intuition every time",
        "Cross-cultural consumer behavior differs more than most marketers think",
      ],
      relatedMasters: ["philip-kotler", "al-ries-jack-trout"],
      relatedModules: ["competitors", "personas", "brand", "campaigns"],
      relatedFormulas: ["cac", "ltv", "share_of_voice"],
    },
    quotes: [
      { text: "Global marketing is not translated local marketing." },
    ],
  },

  /* ───────────── SALES MASTERY ───────────── */
  {
    id: "greatest-salesman",
    title: "The Greatest Salesman in the World",
    author: "Og Mandino",
    year: 1968,
    category: ["sales", "foundational"],
    difficulty: "beginner",
    file: "The Greatest Salesman in the World - Og Mandino.pdf",
    summary: "A parable of ten ancient scrolls containing the secrets of salesmanship and life. The most inspirational sales book ever written.",
    bigIdea: "Success is a habit formed by daily repetition of empowering principles. The scrolls teach: persistence, love, self-worth, action, and living in the present.",
    insights: {
      tldr: "Success is not a destination — it's a daily habit. Read the scrolls, live the principles, and the results follow.",
      takeaways: [
        "Scroll I: Today I begin a new life — every day is a fresh start",
        "Scroll II: I will greet this day with love in my heart — love is the greatest sales tool",
        "Scroll III: I will persist until I succeed — persistence is the master key",
        "Scroll IV: I am nature's greatest miracle — self-worth fuels action",
        "Scroll IX: I will act now — procrastination is the assassin of opportunity",
      ],
      relatedMasters: ["gary-halbert", "dan-kennedy"],
      relatedModules: ["playbooks", "campaigns"],
      relatedFormulas: [],
    },
    quotes: [
      { text: "I will persist until I succeed." },
      { text: "I will act now. Without action, the scrolls are meaningless." },
    ],
  },
  {
    id: "go-pro",
    title: "Go Pro: 7 Steps to Becoming a Network Marketing Professional",
    author: "Eric Worre",
    year: 2013,
    category: ["sales", "growth"],
    difficulty: "beginner",
    file: "Go Pro_ 7 steps to becoming a network marketing professional -- Eric Worre -- Wichita, KS, 2013 -- Network Marketing Pro -- 9780988667907 -- a6d39ff4bbec99aa3dd45dc6a7d388a3 -- Anna's Archive.pdf",
    summary: "7 steps to professional network marketing. While focused on network marketing, the principles apply to any relationship-based selling.",
    bigIdea: "Network marketing is a profession, not a hobby. Treat it professionally: learn the skills, commit to the process, and serve people.",
    insights: {
      tldr: "Treat selling as a profession. Learn the skills, commit daily, and focus on serving others.",
      takeaways: [
        "7 Steps: Commit, Become a Product, Create Your List, Invite, Present, Follow Up, Promote",
        "The invite is everything — without people to talk to, nothing else matters",
        "Follow up is where the money is — most quit after one contact",
        "Promote events and people, not just products",
        "Duplication beats personal production — teach others to fish",
      ],
      relatedMasters: ["dan-kennedy", "gary-halbert"],
      relatedModules: ["crm", "sequences", "campaigns"],
      relatedFormulas: ["ltv", "viral_coefficient"],
    },
    quotes: [
      { text: "Network marketing is a profession, not a hobby." },
    ],
  },

  /* ───────────── ENTREPRENEURSHIP & MINDSET ───────────── */
  {
    id: "millionaire-fastlane",
    title: "The Millionaire Fastlane",
    author: "MJ DeMarco",
    year: 2011,
    category: ["wealth", "strategy"],
    difficulty: "beginner",
    file: "The Millionaire Fastlane - MJ DeMarco.pdf",
    summary: "The Slowlane (save, invest, wait 40 years) vs the Fastlane (build systems that produce wealth). Wealth is not a function of time — it's a function of systems.",
    bigIdea: "Wealth = (Net Profit × Asset Scale) / Time. The Fastlane is about building scalable systems that produce wealth independently of your time.",
    insights: {
      tldr: "Wealth comes from scalable systems, not saving. Build something once that pays forever.",
      takeaways: [
        "The Slowlane: trade time for money, save 10%, wait 40 years — flawed math",
        "The Fastlane: build scalable systems that produce income independently of your time",
        "The Commandment of Scale: your business must be able to serve millions, not hundreds",
        "The Commandment of Entry: if everyone can do it, it's not a Fastlane",
        "The Commandment of Control: you must control the vehicle, not be a passenger",
      ],
      relatedMasters: ["peter-drucker", "alex-hormozi"],
      relatedModules: ["funnels", "campaigns", "budget"],
      relatedFormulas: ["ltv", "mrr_growth", "rule_of_40"],
    },
    quotes: [
      { text: "Wealth is not a function of time. It's a function of systems." },
      { text: "Get rich quick exists. Get rich easy does not." },
    ],
  },
  {
    id: "rich-dad-poor-dad",
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    year: 1997,
    category: ["wealth", "foundational"],
    difficulty: "beginner",
    file: "Rich Dad, Poor Dad - Robert T. Kiyosaki, Sharon L. Lechter.pdf",
    summary: "The classic on financial literacy. Assets put money in your pocket; liabilities take money out. The rich buy assets. The poor buy liabilities they think are assets.",
    bigIdea: "Financial freedom comes from building assets that generate income — not from earning a higher salary.",
    insights: {
      tldr: "Buy assets, not liabilities. An asset puts money in your pocket. A liability takes money out.",
      takeaways: [
        "The rich buy assets. The poor buy expenses. The middle class buys liabilities they think are assets",
        "Your house is not an asset — it's a liability (it costs money every month)",
        "Financial literacy: understand cash flow, assets, liabilities, and the difference between them",
        "The Rat Race: earn, spend, earn, spend — break it by building income-producing assets",
        "Your greatest asset is your mind — invest in financial education",
      ],
      relatedMasters: ["peter-drucker"],
      relatedModules: ["budget", "analytics"],
      relatedFormulas: ["gross_margin", "mrr_growth"],
    },
    quotes: [
      { text: "The rich buy assets. The poor buy expenses." },
      { text: "Don't work for money. Make money work for you." },
    ],
  },
  {
    id: "slight-edge",
    title: "The Slight Edge",
    author: "Jeff Olson",
    year: 2005,
    category: ["habits", "foundational"],
    difficulty: "beginner",
    file: "The Slight Edge - Jeff Olson _ John David Mann.pdf",
    summary: "Simple daily disciplines repeated over time create massive success. The things that are easy to do are also easy not to do — and that difference compounds.",
    bigIdea: "The slight edge: daily disciplines that are easy to do and easy not to do. The difference between success and failure is doing the easy things consistently.",
    insights: {
      tldr: "Easy to do, easy not to do. The difference between success and failure is doing the easy things daily.",
      takeaways: [
        "The Slight Edge: simple daily disciplines × time = success or failure",
        "What's easy to do is also easy not to do — and that's the whole game",
        "The philosophy is simple: show up, be consistent, be patient",
        "Track your daily habits — the compound effect is invisible day-to-day",
        "Your life is the result of choices that seemed insignificant at the time",
      ],
      relatedMasters: ["w-edwards-deming"],
      relatedModules: ["playbooks", "campaigns"],
      relatedFormulas: ["mrr_growth"],
    },
    quotes: [
      { text: "What's easy to do is also easy not to do. That is the slight edge." },
    ],
  },

  /* ───────────── DIGITAL MARKETING STRATEGY ───────────── */
  {
    id: "digital-marketing-strategy",
    title: "Digital Marketing Strategy",
    author: "Various",
    year: 2021,
    category: ["digital-marketing", "strategy"],
    difficulty: "beginner",
    file: "Digital-Marketing-Strategy-eBook.pdf",
    summary: "Comprehensive digital marketing strategy guide covering SEO, PPC, social, email, content, analytics, and conversion optimization.",
    bigIdea: "Digital strategy is about connecting channels into a unified customer journey — not optimizing channels in isolation.",
    insights: {
      tldr: "Connect all channels into a unified journey. Siloed channels produce siloed results.",
      takeaways: [
        "Strategy first, tactics second — channels are tactics, not strategy",
        "The customer journey is non-linear — design for multiple entry points",
        "Measurement is the bridge between strategy and execution",
        "Content fuels all channels — start with content strategy",
        "Testing velocity determines growth velocity — test more, learn faster",
      ],
      relatedMasters: ["philip-kotler", "ryan-deiss"],
      relatedModules: ["campaigns", "analytics", "seo", "ads", "funnels"],
      relatedFormulas: ["cvr", "roas", "cac"],
    },
    quotes: [
      { text: "Strategy first. Tactics second. Channels are tools, not strategy." },
    ],
  },
  {
    id: "7-marketing-basics",
    title: "7 Marketing Basics: How to Do Less and Sell More",
    author: "Various",
    year: 2020,
    category: ["digital-marketing", "strategy"],
    difficulty: "beginner",
    file: "7 Marketing Basics_ How to Do Less and Sell More -- 7 Marketing Basics- How to Do Less and Sell More -- 2020 -- CreateSpace Independent Publishing -- 9781530203574 -- e174cb74644963ed1389d415cf35596a -- Anna's Archive.epub",
    summary: "The 7 fundamentals of marketing: do less and sell more by focusing on what matters.",
    bigIdea: "Doing less but doing it better is the secret to marketing that works. Focus beats breadth every time.",
    insights: {
      tldr: "Do less, sell more. Focus on the 7 basics: message, market, media, offer, follow-up, measurement, and iteration.",
      takeaways: [
        "Message: get crystal clear on what you say and who you say it to",
        "Market: find the smallest viable audience and own it",
        "Media: pick one channel and master it before adding another",
        "Offer: make it irresistible — risk reversal, bonuses, guarantees",
        "Follow-up: the fortune is in the follow-up — most businesses give up too soon",
      ],
      relatedMasters: ["seth-godin", "alex-hormozi", "dan-kennedy"],
      relatedModules: ["personas", "campaigns", "sequences"],
      relatedFormulas: ["cac", "ltv", "cvr"],
    },
    quotes: [
      { text: "Do less and sell more by focusing on what matters." },
    ],
  },
  {
    id: "internet-marketing-textbook",
    title: "Internet Marketing",
    author: "Various",
    year: 2020,
    category: ["digital-marketing"],
    difficulty: "intermediate",
    file: "Internet Marketing textbook.pdf",
    summary: "Academic textbook on internet marketing covering digital strategy, web analytics, social media, email, SEO, PPC, and mobile marketing.",
    bigIdea: "Internet marketing is not separate from marketing — it IS marketing in the digital age.",
    insights: {
      tldr: "All marketing is digital marketing. The principles don't change — only the channels do.",
      takeaways: [
        "The marketing mix (4Ps) applies online with new dynamics",
        "Web analytics turns marketing from art to science",
        "Email remains the highest-ROI digital channel",
        "Social media is engagement, not just broadcasting",
        "Mobile-first design is no longer optional",
      ],
      relatedMasters: ["philip-kotler", "gary-vaynerchuk"],
      relatedModules: ["analytics", "seo", "ads", "emails"],
      relatedFormulas: ["roas", "cvr", "engagement_rate"],
    },
    quotes: [
      { text: "All marketing is digital marketing." },
    ],
  },

  /* ───────────── COPYWRITING & ADVERTISING ───────────── */
  {
    id: "curve",
    title: "The Curve: How Smart Companies Find High-Value Customers",
    author: "Nicholas Lovell",
    year: 2014,
    category: ["strategy", "growth", "digital-marketing"],
    difficulty: "intermediate",
    file: "Curve_ How Smart Companies Find High-Value Customers, The - Nicholas Lovell.pdf",
    summary: "The Curve model: give most things away for free, charge a few people a lot. The power law of customer value — a tiny fraction of customers provide the majority of revenue.",
    bigIdea: "In the Curve, you give away most of what you make for free, and charge the few who love it the most, the most. The power law means 1% of customers can fund everything.",
    insights: {
      tldr: "Give most away free. Charge the passionate few. The power law does the rest.",
      takeaways: [
        "The Curve: free for many, premium for the few who care deeply",
        "The power law: 1% of customers generate most of your revenue",
        "Freemium is not a pricing strategy — it's a discovery strategy",
        "Don't optimize for average revenue per customer — optimize for total revenue from the curve",
        "Community and belonging drive the premium end of the curve",
      ],
      relatedMasters: ["seth-godin", "alex-hormozi"],
      relatedModules: ["funnels", "lead-magnets", "budget"],
      relatedFormulas: ["ltv", "arpu", "viral_coefficient"],
    },
    quotes: [
      { text: "Give most away. Charge the few who care most." },
    ],
  },
  {
    id: "disrupt-you",
    title: "Disrupt You!",
    author: "Jay Samit",
    year: 2015,
    category: ["strategy", "growth"],
    difficulty: "intermediate",
    file: "Disrupt You!_ Master Personal Transformation, Seize Opportunity, and Thrive in the Era of Endless Innovation - Jay Samit.pdf",
    summary: "How to disrupt your own thinking, find opportunities in disruption, and build something new from the chaos.",
    bigIdea: "Disruption creates opportunity. Every industry disruption is an invitation to build something better.",
    insights: {
      tldr: "Disruption creates opportunity. Disrupt yourself before someone else does.",
      takeaways: [
        "Self-disruption: disrupt your own business before someone else does",
        "Find the pain in every disruption — pain is where the opportunity lives",
        "Partner with your disruptors, don't fight them",
        "The best time to disrupt is when you're at the top — not when you're struggling",
        "Every problem is an opportunity with its coat on",
      ],
      relatedMasters: ["peter-drucker", "theodore-levitt"],
      relatedModules: ["competitors", "campaigns", "brand"],
      relatedFormulas: [],
    },
    quotes: [
      { text: "Disrupt yourself before someone else does." },
    ],
  },

  /* ───────────── SCIENTIFIC ADVERTISING & CLASSIC ───────────── */
  {
    id: "uncover-your-difference",
    title: "Uncover Your Difference",
    author: "Meera Kothand",
    year: 2021,
    category: ["brand", "strategy"],
    difficulty: "beginner",
    file: "Uncover Your Difference_ Discover Your Unfair Advantage, -- Meera Kothand -- 2021 -- Independently Published -- 9780061241895 -- 6600dcaea280e7c09383f0aacf41b77c -- Anna's Archive.epub",
    summary: "How to discover and articulate your unique differentiation — your unfair advantage in the market.",
    bigIdea: "Your difference is not your features — it's the unique intersection of what you do, who you serve, and why it matters.",
    insights: {
      tldr: "Find the intersection of what you do uniquely, who you serve specifically, and why it matters deeply.",
      takeaways: [
        "Differentiation is not about being different — it's about being different in a way that matters",
        "Your unfair advantage: the thing you do that others can't easily copy",
        "The differentiation matrix: what you do × who you serve × why it matters",
        "Stop competing on features — compete on identity and transformation",
        "Clarity of difference beats quantity of features",
      ],
      relatedMasters: ["al-ries-jack-trout", "seth-godin"],
      relatedModules: ["brand", "competitors", "personas"],
      relatedFormulas: ["share_of_voice"],
    },
    quotes: [
      { text: "Your difference is not your features. It's the intersection of what you do, who you serve, and why it matters." },
    ],
  },

  /* ───────────── LEADERSHIP & CULTURE ───────────── */
  {
    id: "culture-code",
    title: "The Culture Code",
    author: "Daniel Coyle",
    year: 2018,
    category: ["leadership", "foundational"],
    difficulty: "beginner",
    file: "Culture Code_ The Secrets of Highly Successful Groups, The - Daniel Coyle.pdf",
    summary: "The 3 skills that build great group culture: build safety, share vulnerability, and establish purpose. Great culture is not created by charisma — it's built by consistent signals.",
    bigIdea: "Culture is not something you are — it's something you do. It's built through consistent, small signals of belonging, vulnerability, and purpose.",
    insights: {
      tldr: "Build safety, share vulnerability, establish purpose. Culture is built through consistent small signals, not grand gestures.",
      takeaways: [
        "Build safety: belonging cues (eye contact, names, inside jokes) signal 'you are part of this group'",
        "Share vulnerability: when leaders admit mistakes first, the team feels safe to take risks",
        "Establish purpose: repeat the mission until it's automatic — high-purpose environments have clear, repeated catchphrases",
        "The Navy SEALs select for 'who' not 'what' — skill can be taught, character cannot",
        "Google's Project Aristotle: psychological safety was the #1 predictor of team success",
      ],
      relatedMasters: ["seth-godin", "donald-miller"],
      relatedModules: ["playbooks", "brand"],
      relatedFormulas: ["nps", "engagement_rate"],
    },
    quotes: [
      { text: "Culture is not something you are. It's something you do." },
      { text: "Safety is not the absence of risk. It's the presence of connection." },
    ],
  },
  {
    id: "5-levels-of-leadership",
    title: "The 5 Levels of Leadership",
    author: "John C. Maxwell",
    year: 2011,
    category: ["leadership", "foundational"],
    difficulty: "beginner",
    file: "Maxwell_John_C_-_The_5_Levels_of_Leadership-Center_Street_2011-1.pdf",
    summary: "Leadership is not a title — it's a progression through 5 levels: Position, Permission, Production, People Development, and Pinnacle. Each level must be earned.",
    bigIdea: "People follow you because they have to (Position), because they want to (Permission), because of what you've done (Production), because of what you've done for them (People Development), or because of who you are (Pinnacle).",
    insights: {
      tldr: "Leadership is earned through 5 levels. Each level unlocks more influence and more results.",
      takeaways: [
        "Level 1 (Position): people follow because they have to — this is the weakest foundation",
        "Level 2 (Permission): people follow because they want to — built on relationships",
        "Level 3 (Production): people follow because of what you've done for the organization",
        "Level 4 (People Development): people follow because of what you've done for them",
        "Level 5 (Pinnacle): people follow because of who you are and what you represent",
      ],
      relatedMasters: ["peter-drucker"],
      relatedModules: ["playbooks", "brand"],
      relatedFormulas: [],
    },
    quotes: [
      { text: "Leadership is not about titles or positions. It's about influence." },
      { text: "A leader is great not because of power, but because of the ability to empower others." },
    ],
  },
  {
    id: "start-with-why",
    title: "Start With Why",
    author: "Simon Sinek",
    year: 2009,
    category: ["brand", "leadership", "strategy"],
    difficulty: "beginner",
    file: "Start With Why_ How Great Leaders Inspire Everyone to Take Action - Simon Sinek.pdf",
    summary: "People don't buy what you do — they buy why you do it. The Golden Circle (Why → How → What) explains why some leaders inspire and others don't.",
    bigIdea: "Start with WHY. Every inspiring leader and organization communicates from the inside out: Why (purpose) → How (process) → What (product). Most companies start with What.",
    insights: {
      tldr: "Start with WHY. People don't buy what you do — they buy why you do it. The Golden Circle flips conventional communication.",
      takeaways: [
        "The Golden Circle: Why (purpose) → How (process) → What (product). Most companies communicate What first. Inspiring ones start with Why",
        "Apple doesn't say 'we make great computers.' They say 'everything we do, we believe in challenging the status quo'",
        "The limbic brain (why) drives decisions. The neocortex (what) rationalizes them. Sell to the limbic first",
        "Loyalty is not to the product — it's to the why. People line up for Apple not because of specs but because of identity",
        "The Celery Test: if your Why is health, don't buy Oreos — even if someone says they're popular. Filter every decision through your Why",
      ],
      relatedMasters: ["seth-godin", "donald-miller"],
      relatedModules: ["brand", "personas", "campaigns"],
      relatedFormulas: ["brand_recall", "share_of_voice"],
    },
    quotes: [
      { text: "People don't buy what you do. They buy why you do it." },
      { text: "Start with Why. The rest follows." },
    ],
  },

  /* ───────────── PSYCHOLOGY & PERSUASION (DEEP CUTS) ───────────── */
  {
    id: "power-of-habit",
    title: "The Power of Habit",
    author: "Charles Duhigg",
    year: 2012,
    category: ["habits", "foundational"],
    difficulty: "beginner",
    file: "The Power of Habit - Charles Duhigg.pdf",
    summary: "The habit loop: Cue → Routine → Reward. Habits cannot be destroyed — they can only be replaced. Change the routine, keep the cue and reward.",
    bigIdea: "Habits are a 3-step loop: cue (trigger), routine (behavior), reward (satisfaction). To change a habit, keep the cue and reward, but change the routine.",
    insights: {
      tldr: "Cue → Routine → Reward. You can't destroy habits — only replace the routine while keeping the cue and reward.",
      takeaways: [
        "The Habit Loop: Cue (trigger) → Routine (behavior) → Reward (satisfaction)",
        "Keystone habits: some habits trigger cascading change — exercise, for example, improves diet, sleep, and productivity",
        "You cannot extinguish a habit — you can only replace the routine while keeping the cue and reward",
        "Cravings drive habits: once the brain associates a cue with a reward, the craving begins automatically",
        "Organizations have habits too — changing a keystone organizational habit changes the culture",
      ],
      relatedMasters: ["w-edwards-deming", "claude-hopkins"],
      relatedModules: ["playbooks", "automations"],
      relatedFormulas: [],
    },
    quotes: [
      { text: "Habits cannot be destroyed. They can only be replaced." },
      { text: "Once you understand that habits can change, you have the freedom and the responsibility to remake them." },
    ],
  },
  {
    id: "flow",
    title: "Flow: The Psychology of Optimal Experience",
    author: "Mihaly Csikszentmihalyi",
    year: 1990,
    category: ["foundational", "habits"],
    difficulty: "intermediate",
    file: "Flow_ The Psychology of Optimal Experience by Mihaly Csikszentmihalyi - Mihaly Csikszentmihalyi.pdf",
    summary: "Flow is the state of complete absorption in an activity where time disappears and performance peaks. It happens when challenge matches skill.",
    bigIdea: "Flow occurs at the intersection of challenge and skill. Too much challenge = anxiety. Too little = boredom. The sweet spot is where you're stretched but capable.",
    insights: {
      tldr: "Flow happens when challenge matches skill. Design work for flow and performance peaks.",
      takeaways: [
        "Flow occurs when skill level and challenge level are both high and matched",
        "Clear goals, immediate feedback, and a sense of control are flow prerequisites",
        "The flow channel: between anxiety (too hard) and boredom (too easy)",
        "Autotelic personalities find flow more easily — they're driven by intrinsic motivation",
        "Design marketing work for flow: clear goals, real-time metrics, increasing difficulty",
      ],
      relatedMasters: ["w-edwards-deming"],
      relatedModules: ["analytics", "playbooks"],
      relatedFormulas: [],
    },
    quotes: [
      { text: "The best moments in our lives are not the passive, receptive, relaxing times. The best moments occur when a person's body or mind is stretched to its limits." },
    ],
  },
  {
    id: "deep-work",
    title: "Deep Work",
    author: "Cal Newport",
    year: 2016,
    category: ["habits", "foundational"],
    difficulty: "beginner",
    file: "Deep Work - Cal Newport.pdf",
    summary: "Deep work is the ability to focus without distraction on a cognitively demanding task. It's becoming rare and therefore valuable. Shallow work is the enemy.",
    bigIdea: "Deep work is the superpower of the 21st century. In a world of shallow distractions, the ability to do deep, focused work is both rare and extraordinarily valuable.",
    insights: {
      tldr: "Schedule deep work. Protect it ruthlessly. Shallow work is the enemy of value creation.",
      takeaways: [
        "Deep work: cognitively demanding tasks performed in distraction-free concentration",
        "Shallow work: logistical, administrative tasks that don't require deep focus",
        "The Deep Work Hypothesis: the ability to do deep work is becoming rarer and more valuable simultaneously",
        "Schedule every minute: time blocking eliminates decision fatigue about what to work on",
        "The 4 disciplines: focus on the wildly important, act on lead measures, keep a compelling scoreboard, create a cadence of accountability",
      ],
      relatedMasters: ["w-edwards-deming"],
      relatedModules: ["playbooks", "tasks"],
      relatedFormulas: [],
    },
    quotes: [
      { text: "Deep work is the ability to focus without distraction on a cognitively demanding task." },
      { text: "Clarity about what matters provides clarity about what does not." },
    ],
  },
  {
    id: "essentialism",
    title: "Essentialism: The Disciplined Pursuit of Less",
    author: "Greg McKeown",
    year: 2014,
    category: ["habits", "strategy"],
    difficulty: "beginner",
    file: "Essentialism_ The Disciplined Pursuit of Less - Greg McKeown.pdf",
    summary: "Less but better. The way of the Essentialist means pursuing only what is essential and eliminating everything else. If it isn't a clear yes, it's a no.",
    bigIdea: "If it isn't a clear yes, it's a no. Essentialism is not about getting more done — it's about getting the right things done.",
    insights: {
      tldr: "If it isn't a clear yes, it's a no. Pursue less but better. Essentialism is the disciplined pursuit of less.",
      takeaways: [
        "The Essentialist asks: 'What is essential?' and eliminates everything else",
        "If it isn't a clear yes, it's a clear no — the 90% rule",
        "Protect the asset: sleep, exercise, and recovery are not luxuries — they're productivity tools",
        "The paradox of success: success leads to more options, more options lead to divided attention, divided attention leads to failure",
        "Essential intent: one clear purpose that makes 1,000 later decisions easier",
      ],
      relatedMasters: ["seth-godin", "w-edwards-deming"],
      relatedModules: ["playbooks", "budget"],
      relatedFormulas: ["rule_of_40"],
    },
    quotes: [
      { text: "If it isn't a clear yes, it's a no." },
      { text: "Less but better." },
    ],
  },
  {
    id: "ego-is-the-enemy",
    title: "Ego Is the Enemy",
    author: "Ryan Holiday",
    year: 2016,
    category: ["foundational", "leadership"],
    difficulty: "beginner",
    file: "Ego Is the Enemy - Ryan Holiday.pdf",
    summary: "Ego destroys more careers than failure. In aspiration, success, and failure — ego is the enemy. Replace it with purpose, learning, and resilience.",
    bigIdea: "Ego is the enemy at every stage: in aspiration (it makes you think you're above learning), in success (it makes you think you're above failing), and in failure (it makes you think you're above recovering).",
    insights: {
      tldr: "Ego is the enemy at every stage. Replace it with purpose, humility, and continuous learning.",
      takeaways: [
        "In aspiration: ego tells you you're above the basics — you skip them and fail",
        "In success: ego tells you you're invincible — you stop listening and stagnate",
        "In failure: ego tells you the failure wasn't your fault — you don't learn and repeat it",
        "The antidote: purpose (something bigger than you), learning (always a student), and resilience (the obstacle is the way)",
        "Talk less, do more: ego loves the sound of its own voice. Action speaks.",
      ],
      relatedMasters: ["seth-godin"],
      relatedModules: ["playbooks"],
      relatedFormulas: [],
    },
    quotes: [
      { text: "Ego is the enemy of what you want to achieve." },
      { text: "The ego is the enemy of learning." },
    ],
  },
  {
    id: "psychology-of-money",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    year: 2020,
    category: ["wealth", "foundational"],
    difficulty: "beginner",
    file: "The Psychology of Money - Morgan Housel.pdf",
    summary: "Money is not about intelligence — it's about behavior. 19 stories about the strange ways people think about money, risk, and happiness.",
    bigIdea: "Doing well with money has little to do with how smart you are and a lot to do with how you behave. Financial success is a soft skill — not a hard one.",
    insights: {
      tldr: "Money is about behavior, not intelligence. Your relationship with money determines your financial outcome more than your IQ.",
      takeaways: [
        "No one's crazy: your money decisions make sense given your life experience — they just might not make sense to someone else",
        "Compounding is the most powerful force in finance — Warren Buffett's fortune came from compounding over 70+ years",
        "Wealth is what you don't see: it's the money not spent. Rich is income. Wealth is hidden",
        "Room for error: the most powerful financial force is the ability to survive long enough for compounding to work",
        "Reasonable > rational: a strategy you can stick with beats a 'perfect' strategy you abandon at the first setback",
      ],
      relatedMasters: ["peter-drucker"],
      relatedModules: ["budget", "analytics"],
      relatedFormulas: ["ltv", "gross_margin"],
    },
    quotes: [
      { text: "Wealth is what you don't see." },
      { text: "Doing well with money has little to do with how smart you are and a lot to do with how you behave." },
    ],
  },
  {
    id: "getting-things-done",
    title: "Getting Things Done",
    author: "David Allen",
    year: 2001,
    category: ["habits", "foundational"],
    difficulty: "beginner",
    file: "Getting Things Done - David Allen.pdf",
    summary: "The GTD methodology: capture everything, clarify what it means, organize it, reflect on it, and engage with it. Your mind is for having ideas, not holding them.",
    bigIdea: "Your mind is for having ideas, not holding them. Capture everything into a trusted system. Then process, organize, review, and engage.",
    insights: {
      tldr: "Capture everything. Process it. Organize it. Review it weekly. Your mind is for having ideas, not holding them.",
      takeaways: [
        "Capture: collect everything that has your attention into a trusted system — not your brain",
        "Clarify: what does this mean? What's the next action? If it takes <2 minutes, do it now",
        "Organize: put it where it belongs — projects, next actions, waiting for, someday/maybe",
        "Reflect: weekly review of all projects, actions, and commitments — the most important habit",
        "Engage: trust your system enough to take action without wondering what else you should be doing",
      ],
      relatedMasters: ["peter-drucker", "w-edwards-deming"],
      relatedModules: ["tasks", "playbooks", "automations"],
      relatedFormulas: [],
    },
    quotes: [
      { text: "Your mind is for having ideas, not holding them." },
      { text: "The 2-minute rule: if it takes less than 2 minutes, do it now." },
    ],
  },

  /* ───────────── NEGOTIATION ───────────── */
  {
    id: "flip-the-script",
    title: "Flip the Script",
    author: "Oren Klaff",
    year: 2019,
    category: ["sales", "persuasion", "negotiation"],
    difficulty: "intermediate",
    file: "Flip the Script_ Getting People to Think Your Idea Is Their Idea - Oren Klaff.pdf",
    summary: "The follow-up to Pitch Anything. How to get people to think your idea is their idea — the ultimate persuasion technique.",
    bigIdea: "The most powerful persuasion is when the other person thinks the idea was theirs. Frame the conversation so they arrive at your conclusion on their own.",
    insights: {
      tldr: "Don't pitch your idea. Frame the conversation so they arrive at your conclusion and think it was theirs.",
      takeaways: [
        "Inception: plant the seed of your idea so the other person thinks they came up with it",
        "The confirmation frame: get them to say yes to small things first — yes creates momentum",
        "Attention is the currency: you can't persuade if they're not paying attention",
        "Beta trap: when you're in the beta (submissive) frame, you lose. Always own the frame",
        "The power of 'we': frame everything as a shared problem, not your problem or their problem",
      ],
      relatedMasters: ["robert-cialdini", "oren-klaff"],
      relatedModules: ["crm", "campaigns", "personas"],
      relatedFormulas: ["cvr", "pipeline_coverage"],
    },
    quotes: [
      { text: "The most powerful persuasion is when they think the idea was theirs." },
    ],
  },

  /* ───────────── MASTERY & PHILOSOPHY ───────────── */
  {
    id: "mastery",
    title: "Mastery",
    author: "Robert Greene",
    year: 2012,
    category: ["foundational", "leadership"],
    difficulty: "intermediate",
    file: "Mastery - Robert Greene.pdf",
    summary: "The path to mastery follows three phases: Apprenticeship, Creative-Active, and Mastery. There are no shortcuts — but there is a process.",
    bigIdea: "Mastery is not a gift — it's a process. Three phases: Apprenticeship (learn the rules), Creative-Active (break the rules), Mastery (transcend the rules).",
    insights: {
      tldr: "Apprenticeship → Creative-Active → Mastery. There are no shortcuts, but there is a process.",
      takeaways: [
        "The Apprenticeship phase: submit to learning, find a mentor, practice endlessly, value practice over theory",
        "The Creative-Active phase: start breaking rules, experiment, find your unique voice, create original work",
        "The Mastery phase: intuitive understanding, the ability to see connections others miss, effortless performance",
        "The 10,000-hour rule is real — but only if those hours are deliberate practice, not mindless repetition",
        "Your life's task: find the thing that calls to you, not the thing that pays the most",
      ],
      relatedMasters: ["seth-godin", "claude-hopkins"],
      relatedModules: ["playbooks"],
      relatedFormulas: [],
    },
    quotes: [
      { text: "The greatest impediment to creativity is your impatience." },
      { text: "The future belongs to those who learn more skills and combine them in creative ways." },
    ],
  },
  {
    id: "meditations",
    title: "Meditations",
    author: "Marcus Aurelius",
    year: 180,
    category: ["foundational", "leadership"],
    difficulty: "beginner",
    file: "Meditations - Marcus Aurelius.pdf",
    summary: "The private journal of a Roman emperor. Stoic wisdom on duty, mortality, perception, and self-discipline. The most practical philosophy ever written.",
    bigIdea: "You have power over your mind — not outside events. Realize this, and you will find strength. Perception determines reality.",
    insights: {
      tldr: "Control what you can (your mind) and accept what you can't (everything else). Perception is reality.",
      takeaways: [
        "You have power over your mind — not outside events. Realize this, and you will find strength",
        "The obstacle is the way: what stands in the path becomes the path",
        "Everything is temporary — your reputation, your wealth, your life. Act accordingly",
        "Focus on the present moment: don't waste time on the past or anxiety about the future",
        "The best revenge is not to be like your enemy — maintain your character regardless of provocation",
      ],
      relatedMasters: [],
      relatedModules: ["playbooks"],
      relatedFormulas: [],
    },
    quotes: [
      { text: "You have power over your mind — not outside events. Realize this, and you will find strength." },
      { text: "The object of life is not to be on the side of the majority." },
      { text: "Waste no time arguing about what a good person should be. Be one." },
    ],
  },
  {
    id: "laws-of-human-nature",
    title: "The Laws of Human Nature",
    author: "Robert Greene",
    year: 2018,
    category: ["persuasion", "foundational"],
    difficulty: "advanced",
    file: "The Laws of Human Nature - Robert Greene.pdf",
    summary: "18 laws governing human behavior: irrationality, narcissism, grandiosity, envy, and more. Understanding these laws gives you power over yourself and others.",
    bigIdea: "Humans are fundamentally irrational. Understanding the hidden forces that drive behavior — narcissism, envy, grandiosity, groupthink — gives you the ability to work with human nature instead of against it.",
    insights: {
      tldr: "Humans are irrational. Learn the 18 laws of human nature and you can work with people instead of against them.",
      takeaways: [
        "Law 1: Master your emotional self — you are fundamentally irrational. Accept it and manage it",
        "Law 2: Transform self-love into empathy — narcissism is the default. Override it",
        "Law 4: Determine the dynamic — people play roles. Identify the role and you understand the behavior",
        "Law 9: Confront your dark side — everyone has one. Acknowledge it before it sabotages you",
        "Law 15: Make them depend on you — create something that cannot be easily replaced",
      ],
      relatedMasters: ["robert-cialdini", "robert-greene"],
      relatedModules: ["personas", "crm", "competitors"],
      relatedFormulas: [],
    },
    quotes: [
      { text: "We are all irrational, but we are irrational in predictable ways." },
    ],
  },

  /* ───────────── ENTREPRENEURSHIP ───────────── */
  {
    id: "your-next-five-moves",
    title: "Your Next Five Moves",
    author: "Patrick Bet-David",
    year: 2020,
    category: ["strategy", "growth"],
    difficulty: "intermediate",
    file: "Patrick_Bet-David_-_Your_Next_Five_Moves__Master_the_Art_of_Business_Strategy-Gallery_Books_2020-1.pdf",
    summary: "Think 5 moves ahead. Like a chess grandmaster, every business decision should consider the next 5 moves and their consequences.",
    bigIdea: "Amateur players think 1 move ahead. Good players think 2-3. Grandmasters think 5. Every business decision should consider the next 5 moves and their consequences.",
    insights: {
      tldr: "Think 5 moves ahead. Map the consequences of each decision 5 steps into the future.",
      takeaways: [
        "Move 1: Know your current position — where are you really, not where you wish you were?",
        "Move 2: Know your destination — where do you want to be in 3-5 years?",
        "Move 3: Map the obstacles — what stands between where you are and where you want to be?",
        "Move 4: Identify the levers — what small changes will produce the biggest results?",
        "Move 5: Calculate the risk — what's the worst case and can you survive it?",
      ],
      relatedMasters: ["michael-porter", "peter-drucker"],
      relatedModules: ["competitors", "campaigns", "budget"],
      relatedFormulas: ["cac", "ltv", "pipeline_coverage"],
    },
    quotes: [
      { text: "Amateurs think 1 move ahead. Professionals think 5." },
    ],
  },
  {
    id: "secrets-millionaire-mind",
    title: "Secrets of the Millionaire Mind",
    author: "T. Harv Eker",
    year: 2005,
    category: ["wealth", "foundational"],
    difficulty: "beginner",
    file: "Secrets of the Millionaire Mind - T. Harv Eker.pdf",
    summary: "Your financial thermostat is set by your subconscious beliefs. Change the belief, change the thermostat, change the outcome.",
    bigIdea: "Your inner world creates your outer world. Your financial thermostat — the amount of money you're comfortable having — determines your wealth ceiling.",
    insights: {
      tldr: "Your financial thermostat determines your wealth ceiling. Change the belief, change the thermostat, change the outcome.",
      takeaways: [
        "Your financial thermostat: the amount of money you're comfortable having. If you earn more, you'll subconsciously spend to return to your set point",
        "Rich people believe 'I create my life.' Poor people believe 'Life happens to me'",
        "Rich people focus on opportunities. Poor people focus on obstacles",
        "Rich people manage their money well. Poor people mismanage their money",
        "The habit of managing money is more important than the amount — start with 1% if you have to",
      ],
      relatedMasters: ["alex-hormozi", "dan-kennedy"],
      relatedModules: ["budget", "analytics"],
      relatedFormulas: ["gross_margin", "mrr_growth"],
    },
    quotes: [
      { text: "Your inner world creates your outer world." },
      { text: "If you're not doing well, it's because you're not doing well inside." },
    ],
  },
  {
    id: "total-money-makeover",
    title: "The Total Money Makeover",
    author: "Dave Ramsey",
    year: 2003,
    category: ["wealth"],
    difficulty: "beginner",
    file: "Total Money Makeover_ A Proven Plan for Financial Fitness, The - Dave Ramsey.pdf",
    summary: "7 baby steps to financial peace: save $1,000, pay off debt, build 3-6 month emergency fund, invest 15%, college fund, pay off mortgage, build wealth and give.",
    bigIdea: "Financial peace is not complicated — it's just not easy. 7 baby steps, done in order, with gazelle intensity.",
    insights: {
      tldr: "7 baby steps done with gazelle intensity. Save, pay off debt, build emergency fund, invest, pay off mortgage, build wealth.",
      takeaways: [
        "Baby Step 1: Save $1,000 as a starter emergency fund",
        "Baby Step 2: Pay off all debt (except mortgage) using the debt snowball",
        "Baby Step 3: Save 3-6 months of expenses as a full emergency fund",
        "Baby Step 4: Invest 15% of household income into retirement",
        "Baby Steps 5-7: College fund, pay off mortgage, build wealth and give",
      ],
      relatedMasters: ["dan-kennedy"],
      relatedModules: ["budget"],
      relatedFormulas: ["gross_margin", "mrr_growth"],
    },
    quotes: [
      { text: "Act your wage." },
      { text: "If you will live like no one else, later you can live like no one else." },
    ],
  },
  {
    id: "awaken-the-giant-within",
    title: "Awaken the Giant Within",
    author: "Tony Robbins",
    year: 1991,
    category: ["foundational", "habits"],
    difficulty: "beginner",
    file: "Awaken the Giant Within_ How to Take Immediate Control of Your tal, Emotional, Physical _ Financial Destiny! - Anthony Robbins.pdf",
    summary: "Take control of your emotional, physical, and financial destiny through decisions, beliefs, and consistent action. Your decisions, not your conditions, determine your destiny.",
    bigIdea: "It's your decisions, not your conditions, that determine your destiny. The power of decision is the power of life.",
    insights: {
      tldr: "Your decisions, not your conditions, determine your destiny. Decide, believe, act consistently.",
      takeaways: [
        "The power of decision: decide what you want, decide you'll get it, and act with certainty",
        "The pain-pleasure principle: everything we do is to avoid pain or gain pleasure. Link massive pain to not changing and massive pleasure to changing",
        "Beliefs create the maps that guide our actions. Limiting beliefs must be replaced with empowering ones",
        "The vocabulary of success: the words you use create your emotional state. Change your words, change your state",
        "CANI: Constant And Never-ending Improvement. Small daily improvements compound into massive results",
      ],
      relatedMasters: ["alex-hormozi", "seth-godin"],
      relatedModules: ["playbooks"],
      relatedFormulas: ["mrr_growth"],
    },
    quotes: [
      { text: "It is in your moments of decision that your destiny is shaped." },
      { text: "The only impossible journey is the one you never begin." },
    ],
  },

  /* ───────────── PRODUCTIVITY ───────────── */
  {
    id: "time-is-money",
    title: "Time Is Money: A Simple System to Cure Procrastination",
    author: "Aiden Nolan",
    year: 2019,
    category: ["habits", "foundational"],
    difficulty: "beginner",
    file: "time-is-money-a-simple-system-to-cure-procrastination-without-willpower-become-more-productive-find-your-focus-get-more-done-in-less-time-productivity-success-1-1.pdf",
    summary: "A productivity system that eliminates procrastination without willpower. Time = money. Every hour wasted is money burned.",
    bigIdea: "Procrastination is not a willpower problem — it's a system problem. Build a system that makes productive action automatic and procrastination impossible.",
    insights: {
      tldr: "Procrastination is a system problem, not a willpower problem. Build systems that make action automatic.",
      takeaways: [
        "Time = money: assign a dollar value to each hour. Wasting an hour costs you that amount",
        "The 2-minute rule: if it takes less than 2 minutes, do it now",
        "Time blocking: schedule every hour of your day. Unscheduled time is wasted time",
        "The 5-second rule: count 5-4-3-2-1 and physically move toward the task",
        "Environment design: remove all distractions from your workspace before starting deep work",
      ],
      relatedMasters: ["peter-drucker"],
      relatedModules: ["tasks", "playbooks"],
      relatedFormulas: [],
    },
    quotes: [
      { text: "Time is money. Every hour wasted is money burned." },
    ],
  },

  /* ───────────── MINDSET ───────────── */
  {
    id: "magic-of-thinking-big",
    title: "The Magic of Thinking Big",
    author: "David J. Schwartz",
    year: 1959,
    category: ["foundational", "wealth"],
    difficulty: "beginner",
    file: "The Magic of Thinking Big - David J. Schwartz.pdf",
    summary: "Think big, believe big, act big. The size of your thinking determines the size of your results. Most people think too small.",
    bigIdea: "The size of your beliefs determines the size of your results. Think big, believe in yourself, and act as if failure is impossible.",
    insights: {
      tldr: "Think big, believe big, act big. The size of your thinking determines the size of your results.",
      takeaways: [
        "Believe you can succeed and you will. Your belief system is your thermostat",
        "Excusitis: the disease of excuses. Cure it by taking responsibility",
        "Think big: set goals that excite and scare you. Small goals produce small motivation",
        "Action cures fear. Don't wait for confidence — act your way into it",
        "Associate with people who think big — attitude is contagious",
      ],
      relatedMasters: ["think-and-grow-rich"],
      relatedModules: ["brand", "campaigns"],
      relatedFormulas: [],
    },
    quotes: [
      { text: "Think big and you'll live big. You'll have big jobs, big pay, and big friends." },
      { text: "Action cures fear." },
    ],
  },
  {
    id: "subtle-art",
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    year: 2016,
    category: ["foundational", "habits"],
    difficulty: "beginner",
    file: "The Subtle Art of Not Giving a Fuck - Mark Manson.pdf",
    summary: "The key to a good life is not giving a f*ck about more things — it's giving a f*ck about fewer, better things. Choose your values wisely.",
    bigIdea: "Life is about choosing what to give a f*ck about. You only get so many f*cks — spend them on what matters, not on what's popular or comfortable.",
    insights: {
      tldr: "Stop caring about everything. Choose your values carefully. Give your f*cks to what actually matters.",
      takeaways: [
        "The key to a good life is giving a f*ck about fewer, better things",
        "Pain is inevitable. Suffering is a choice — you choose what to suffer for",
        "You are not special. Accepting your averageness is liberating, not depressing",
        "Choose your values carefully: shitty values produce shitty lives",
        "Responsibility: even if it's not your fault, it's your responsibility to fix it",
      ],
      relatedMasters: ["seth-godin"],
      relatedModules: ["brand", "personas"],
      relatedFormulas: [],
    },
    quotes: [
      { text: "The key to a good life is not giving a f*ck about more. It's giving a f*ck about less." },
    ],
  },
  {
    id: "failing-forward",
    title: "Failing Forward: Turning Mistakes into Stepping Stones",
    author: "John C. Maxwell",
    year: 2000,
    category: ["foundational", "leadership"],
    difficulty: "beginner",
    file: "Failing Forward Turning Mistakes into Stepping Stones for Success - John C. Maxwell.pdf",
    summary: "The difference between average people and achieving people is their perception of and response to failure. Failure is not the opposite of success — it's part of it.",
    bigIdea: "Failure is not the opposite of success — it's part of success. The difference between successful and unsuccessful people is how they respond to failure.",
    insights: {
      tldr: "Failure is part of success. Respond to failure by learning, not by quitting.",
      takeaways: [
        "Failure is not the opposite of success — it's part of success",
        "The difference between successful and unsuccessful people is their response to failure",
        "Learn a new definition of failure: failure is not falling down, it's staying down",
        "The top 10 reasons people fail: poor people skills, negative attitude, bad habits, lack of goals, etc.",
        "Every failure carries a seed of equivalent benefit — find it",
      ],
      relatedMasters: ["seth-godin", "w-edwards-deming"],
      relatedModules: ["experiments", "analytics"],
      relatedFormulas: ["statistical_significance"],
    },
    quotes: [
      { text: "Failure is not the opposite of success. It's part of success." },
      { text: "Fail early, fail often, but always fail forward." },
    ],
  },

  /* ───────────── MORE STRATEGY ───────────── */
  {
    id: "disrupt-you-2",
    title: "Disrupt You!",
    author: "Jay Samit",
    year: 2015,
    category: ["strategy", "growth", "startup"],
    difficulty: "intermediate",
    file: "Disrupt You!_ Master Personal Transformation, Seize Opportunity, and Thrive in the Era of Endless Innovation - Jay Samit.pdf",
    summary: "How to disrupt your own thinking, find opportunities in disruption, and build something new from the chaos.",
    bigIdea: "Disruption creates opportunity. Every industry disruption is an invitation to build something better. Disrupt yourself before someone else does.",
    insights: {
      tldr: "Disruption creates opportunity. Disrupt yourself before someone else does.",
      takeaways: [
        "Self-disruption: disrupt your own business before someone else does",
        "Find the pain in every disruption — pain is where the opportunity lives",
        "Partner with your disruptors, don't fight them",
        "The best time to disrupt is when you're at the top — not when you're struggling",
        "Every problem is an opportunity with its coat on",
      ],
      relatedMasters: ["peter-drucker", "theodore-levitt"],
      relatedModules: ["competitors", "campaigns", "brand"],
      relatedFormulas: [],
    },
    quotes: [
      { text: "Disrupt yourself before someone else does." },
    ],
  },
  {
    id: "unscripted",
    title: "UNSCRIPTED: Life, Liberty, and the Pursuit of Entrepreneurship",
    author: "MJ DeMarco",
    year: 2017,
    category: ["wealth", "strategy", "startup"],
    difficulty: "intermediate",
    file: "UNSCRIPTED_ Life, Liberty, and the Pursuit of Entrepreneurship - MJ DeMarco.pdf",
    summary: "The follow-up to Millionaire Fastlane. The Script is the system that keeps you in the Slowlane. UNSCRIPTED is the framework for breaking free.",
    bigIdea: "The Script tells you to go to school, get a job, save 10%, and retire at 65. UNSCRIPTED says: build a system that produces income independently of your time.",
    insights: {
      tldr: "The Script keeps you in the Slowlane. Break free by building systems that produce income without your time.",
      takeaways: [
        "The Script: go to school, get a job, save 10%, retire at 65 — it's a lie designed to keep you in the system",
        "The Commandment of Need: a business must serve a need, not a passion",
        "The Commandment of Entry: if everyone can do it, it's not worth doing",
        "The Commandment of Scale: your business must be able to serve millions, not hundreds",
        "The Commandment of Time: your income must be decoupled from your hours",
      ],
      relatedMasters: ["peter-drucker", "alex-hormozi"],
      relatedModules: ["funnels", "campaigns", "budget"],
      relatedFormulas: ["ltv", "mrr_growth", "rule_of_40"],
    },
    quotes: [
      { text: "The Script is the system that keeps you in the Slowlane." },
    ],
  },
  {
    id: "how-to-get-rich",
    title: "How to Get Rich",
    author: "Felix Dennis",
    year: 2006,
    category: ["wealth", "foundational"],
    difficulty: "intermediate",
    file: "How to Get Rich_ One of the World_s Greatest Entrepreneurs Shares His Secrets - Felix Dennis.pdf",
    summary: "A brutally honest guide to wealth building from a self-made millionaire. No platitudes, no affirmations — just the truth about what it takes.",
    bigIdea: "Getting rich is not about talent or luck — it's about obsession, stamina, and the willingness to sacrifice everything else. Most people aren't willing to pay the price.",
    insights: {
      tldr: "Getting rich requires obsession, stamina, and sacrifice. Most people aren't willing to pay the price.",
      takeaways: [
        "You must be obsessed — not interested, not passionate — obsessed",
        "The 5 stages: commitment, conviction, focus, momentum, execution",
        "Ownership is everything. Own the business. Own the equity. Don't sell too early",
        "You will pay a price: relationships, health, free time. Decide if you're willing",
        "The most dangerous moment is when you first succeed — that's when most people get lazy",
      ],
      relatedMasters: ["dan-kennedy"],
      relatedModules: ["budget", "analytics"],
      relatedFormulas: ["ltv", "gross_margin"],
    },
    quotes: [
      { text: "You must be obsessed. Not interested. Not passionate. Obsessed." },
    ],
  },
  {
    id: "happiness-advantage",
    title: "The Happiness Advantage",
    author: "Shawn Achor",
    year: 2010,
    category: ["foundational", "habits"],
    difficulty: "beginner",
    file: "The Happiness Advantage - Shawn Achor.pdf",
    summary: "Happiness fuels success — not the other way around. 7 principles that show how a positive brain outperforms a neutral or negative brain in every metric.",
    bigIdea: "Success doesn't bring happiness — happiness brings success. A positive brain is 31% more productive than a neutral brain.",
    insights: {
      tldr: "Happiness fuels success, not the other way around. A positive brain is 31% more productive.",
      takeaways: [
        "The Happiness Advantage: positive brains outperform negative ones in every measurable way",
        "The Fulcrum and the Lever: your mindset is the fulcrum, your belief about your abilities is the lever",
        "The Tetris Effect: training your brain to spot opportunities (not obstacles) creates a positive feedback loop",
        "Falling Up: failures can be springboards, not just obstacles — if you find the path upward",
        "The Zorro Circle: start with small, manageable goals and expand outward — don't try to fix everything at once",
      ],
      relatedMasters: ["seth-godin"],
      relatedModules: ["playbooks"],
      relatedFormulas: [],
    },
    quotes: [
      { text: "Happiness is not the belief that we don't need to change. It's the belief that we can." },
    ],
  },
  {
    id: "influencer-book",
    title: "Influencer: The New Science of Leading Change",
    author: "Kerry Patterson, David Maxfield, Ron McMillan & Al Switzler",
    year: 2007,
    category: ["persuasion", "leadership"],
    difficulty: "intermediate",
    file: "Influencer_ The New Science of Leading Change, Second Edition -_ Kerry Patterson _ David Maxfield _ Ron McMillan _ Al Switzler.pdf",
    summary: "How to create lasting change by identifying vital behaviors and leveraging six sources of influence. Change requires both motivation and ability.",
    bigIdea: "To change behavior, identify the vital behaviors that matter most and engage all six sources of influence: personal motivation, personal ability, social motivation, social ability, structural motivation, and structural ability.",
    insights: {
      tldr: "Change requires both motivation AND ability across personal, social, and structural levels. Miss any and change fails.",
      takeaways: [
        "Identify vital behaviors: find the 2-3 behaviors that if changed, change everything",
        "6 Sources of Influence: personal (motivation + ability), social (motivation + ability), structural (motivation + ability)",
        "Personal motivation: make the undesirable desirable. Connect the behavior to values",
        "Social motivation: find opinion leaders and engage them first — the herd follows",
        "Structural motivation: change the incentives. Make the right behavior rewarding and the wrong behavior costly",
      ],
      relatedMasters: ["robert-cialdini"],
      relatedModules: ["personas", "campaigns", "automations"],
      relatedFormulas: [],
    },
    quotes: [
      { text: "Change requires both motivation and ability. Miss either, and change fails." },
    ],
  },
  {
    id: "make-it-stick",
    title: "Make It Stick: The Science of Successful Learning",
    author: "Peter C. Brown, Henry L. Roediger III & Mark A. McDaniel",
    year: 2014,
    category: ["foundational", "habits"],
    difficulty: "intermediate",
    file: "Make It Stick_ The Science of Successful Learning - Peter C. Brown _ Henry L. Roediger Iii _ Mark A. McDaniel.pdf",
    summary: "The science of effective learning. Rereading and highlighting don't work. Retrieval practice, spaced repetition, and interleaving do.",
    bigIdea: "The most effective learning strategies are not the most intuitive. Rereading and highlighting are ineffective. Retrieval practice, spacing, and interleaving are the gold standard.",
    insights: {
      tldr: "Stop rereading. Start retrieving. Test yourself, space it out, and mix topics for deep, durable learning.",
      takeaways: [
        "Retrieval practice: testing yourself is more effective than rereading — even if you get it wrong",
        "Spaced repetition: spacing study sessions over time produces stronger memory than cramming",
        "Interleaving: mixing different types of problems improves learning more than practicing one type at a time",
        "Generation: trying to solve a problem before being shown the solution produces stronger memory",
        "Reflection: reviewing what you've learned, asking what went well and what didn't, deepens learning",
      ],
      relatedMasters: ["claude-hopkins", "w-edwards-deming"],
      relatedModules: ["playbooks"],
      relatedFormulas: ["statistical_significance"],
    },
    quotes: [
      { text: "Learning is deeper and more durable when it's effortful." },
    ],
  },
  {
    id: "immunity-to-change",
    title: "Immunity to Change",
    author: "Robert Kegan & Lisa Laskow Lahey",
    year: 2009,
    category: ["leadership", "foundational"],
    difficulty: "advanced",
    file: "Immunity to Change - Lisa Laskow Lahey, Robert Kegan.pdf",
    summary: "Why people resist change even when they want it. The immune system that protects our current way of thinking is the same system that blocks new behavior.",
    bigIdea: "You have an immune system that protects your current way of thinking. This same system blocks the change you want. To change, you must identify and overcome your hidden competing commitments.",
    insights: {
      tldr: "You resist change because of hidden competing commitments. Identify them to unlock transformation.",
      takeaways: [
        "The immunity map: (1) your improvement goal, (2) what you're doing instead, (3) your hidden competing commitment, (4) your big assumption",
        "Competing commitments: you're committed to two things — the change and the status quo. The status quo wins because it has bigger assumptions behind it",
        "The big assumption: the belief that drives your competing commitment. Challenge it and the immunity breaks",
        "Three pillars of the mind: socialized mind (shaped by others), self-authoring mind (shaped by self), self-transforming mind (able to hold contradictions)",
        "Most adults operate at the socialized mind level — they conform to expectations rather than authoring their own beliefs",
      ],
      relatedMasters: ["seth-godin"],
      relatedModules: ["playbooks", "personas"],
      relatedFormulas: [],
    },
    quotes: [
      { text: "We are not held back by what we don't know. We are held back by what we believe that isn't so." },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// AI MARKETING RESOURCE COLLECTIONS (from the Kali)
// ═══════════════════════════════════════════════════════════════════════════

export interface AIResource {
  id: string;
  title: string;
  type: "prompts" | "video" | "guide" | "toolkit" | "workflow";
  topic: string;
  file: string;
  summary: string;
}

export const AI_RESOURCES: AIResource[] = [
  { id: "ai-audience-research", title: "AI for Audience & Customer Research", type: "prompts", topic: "research", file: "AI for Audience + Customer Research [8 Prompts] 29cb56100df84ed080ebeacb79efcc0b.html", summary: "8 AI prompts for deep audience and customer research — demographics, psychographics, pain points, buying triggers." },
  { id: "ai-blog-content", title: "AI for Blog Content", type: "prompts", topic: "content", file: "AI for Blog Content [25 Prompts] 9b149e60a5634c06b2af4ff719ecfe4d.html", summary: "25 AI prompts for creating blog content — ideation, outlining, drafting, editing, and optimization." },
  { id: "ai-competitor-research", title: "AI for Competitor Research", type: "prompts", topic: "research", file: "AI for Competitor Research [10 Prompts] 28fa0bf07dea4e2f88a001816818df11.html", summary: "10 AI prompts for competitive analysis — positioning gaps, pricing intelligence, and messaging audits." },
  { id: "ai-creative-brainstorming", title: "AI for Creative Brainstorming", type: "prompts", topic: "creativity", file: "AI For Creative Brainstorming [13 Prompts] ee758cc5af044fd2a1c4297a562123f6.html", summary: "13 AI prompts for creative brainstorming — campaign ideas, brand concepts, and narrative frameworks." },
  { id: "ai-drip-emails", title: "AI for Drip Email Campaigns", type: "prompts", topic: "email", file: "AI For Drip Email Campaigns [10 prompts] d55b689e369941f7b7d4fad907979b83.html", summary: "10 AI prompts for designing and writing drip email sequences — onboarding, nurturing, and re-engagement." },
  { id: "ai-landing-pages", title: "AI for Landing Pages", type: "prompts", topic: "conversion", file: "AI For Landing Pages [15 Prompts] 950d4f15c0634bc2aad7aecc13940181.html", summary: "15 AI prompts for high-converting landing pages — headlines, body copy, CTAs, and social proof." },
  { id: "ai-newsletters", title: "AI for Newsletter Campaigns", type: "prompts", topic: "email", file: "AI For Newsletter Campaigns [9 prompts] 9175b562cb314ba89b7354525389b884.html", summary: "9 AI prompts for newsletter content — subject lines, content structure, and engagement optimization." },
  { id: "ai-product-descriptions", title: "AI for Product Descriptions", type: "prompts", topic: "copywriting", file: "AI For Product Descriptions [4 Prompts] fa1d2dc025a043d192a0551dac66835e.html", summary: "4 AI prompts for product descriptions that sell — benefits over features, sensory language, and urgency." },
  { id: "ai-reporting", title: "AI for Reporting & Analytics", type: "prompts", topic: "analytics", file: "AI For Reporting & Analytics [11 Prompts] 1476235843214e9898abad67a94374b0.html", summary: "11 AI prompts for marketing reporting and analytics — KPI dashboards, performance analysis, and insights." },
  { id: "ai-scripts", title: "AI for Script Creation", type: "prompts", topic: "video", file: "AI For Script Creation [16 Prompts] ce45db0136694467ad2ac5401cb7ae9f.html", summary: "16 AI prompts for video and audio scripts — YouTube, TikTok, podcast, and webinar scripts." },
  { id: "ai-social-media", title: "AI for Social Media", type: "prompts", topic: "social", file: "AI for Social Media [17 Prompts] 8f963cbf8be544ea9d0b56612572f511.html", summary: "17 AI prompts for social media content — captions, threads, carousels, and engagement strategies." },
  { id: "ai-marketing-console", title: "The AI Marketing Console", type: "guide", topic: "ai", file: "The AI Marketing Console Start Here f4658061c6074b159ec24ebeb9a64d9e.html", summary: "The master guide to using AI for marketing — prompts, workflows, and the AI-augmented marketing stack." },
  { id: "ai-marketing-console-guide", title: "How To Use The AI Marketing Console", type: "guide", topic: "ai", file: "How To Use The AI Marketing Console 7515df316ebd4c449bb00d8eda6f9a8f.html", summary: "Step-by-step guide to setting up and using the AI marketing console for daily operations." },
  { id: "ai-prompt-writing", title: "The Fundamentals Of Prompt Writing", type: "guide", topic: "ai", file: "The Fundamentals Of Prompt Writing 8a67bb27761c4ab68a7304312239bd93.html", summary: "The fundamentals of writing effective AI prompts — context, specificity, format, and iteration." },
  { id: "ai-augmentation-mentality", title: "The Augmentation Mentality", type: "guide", topic: "ai", file: "The Augmentation Mentality 1b70d2aa37f844aca7d98d1a9bf93347.html", summary: "Why AI augments marketers rather than replacing them — the mindset shift from replacement to amplification." },
  { id: "ai-creativity", title: "The Case For Creativity With AI", type: "guide", topic: "ai", file: "The Case For Creativity With AI 49b552d893f54260a423e638f24a4fd0.html", summary: "How AI enhances creative output — not replacing creativity, but augmenting it with speed and scale." },
  { id: "visual-marketing-prompts", title: "Visual Marketing Prompts [Midjourney + DALL-E]", type: "prompts", topic: "visual", file: "Visual Marketing Prompts [Midjourney + DALL-E] 9daa778d8002405898d7806681ea0ade.html", summary: "AI prompts for creating visual marketing assets with Midjourney and DALL-E — product shots, social graphics, and brand imagery." },
  { id: "prompt-library", title: "Building Your Own Prompt Library", type: "toolkit", topic: "ai", file: "Building Your Own Prompt Library a0beeea1dcd745018952d9500c327742.html", summary: "How to build and organize your own AI prompt library for consistent marketing output." },
  { id: "tone-variables", title: "45+ Tone Variables For Your Prompts", type: "toolkit", topic: "ai", file: "45+ Tone Variables For Your Prompts 92902ec1798e4b3eb73a280d2becca7a.html", summary: "45+ tone variables to control the voice, style, and personality of AI-generated marketing content." },
  { id: "use-cases", title: "Establishing Your Own Use Cases", type: "toolkit", topic: "ai", file: "Establishing Your Own Use Cases 285c00e8011f4e76b4d48eb4508fdb2c.html", summary: "How to identify and define your own AI use cases for marketing workflows." },
  { id: "game-guides", title: "GAME GUIDES 130+ PROMPTS", type: "prompts", topic: "gaming", file: "GAME GUIDES 130+ PROMPTS 9076169e4e3247f8b3fd00aa51bc953f.html", summary: "130+ game-related prompts — useful for gaming brands, esports marketing, and interactive content." },
  { id: "bonus-content-workflow", title: "Bonus Material: Content Workflow", type: "workflow", topic: "content", file: "Bonus Material Content Workflow 2 0 0b86923c3e8242c9a820432f231ec42d.html", summary: "Complete content workflow template — from ideation to publication to repurposing." },
  { id: "bonus-keynote", title: "Bonus Material: Exclusive Keynote Presentation", type: "workflow", topic: "strategy", file: "Bonus Material Exclusive Keynote Presentation 3eaa1b813cec416a98b5a9f5b25f8353.html", summary: "Keynote presentation on AI-augmented marketing strategy — slides, talking points, and frameworks." },
  { id: "bonus-visual-ai-toolkit", title: "Bonus Material: The Visual AI Toolkit", type: "toolkit", topic: "visual", file: "Bonus Material The Visual AI Toolkit 9b67c2ce61894cc4ac0432bc87721ec3.html", summary: "Visual AI toolkit — prompts and templates for creating marketing visuals with AI image generators." },
  { id: "content-marketing-ai-video", title: "Content Marketing in the Age of AI", type: "video", topic: "content", file: "Content Marketing in the Age of AI.mp4", summary: "Full video course on content marketing strategy in the age of AI — what changes and what stays the same." },
  { id: "chatgpt-marketers-video", title: "How ChatGPT Has Changed Marketers' Jobs", type: "video", topic: "ai", file: "How_ChatGPT_Has_Changed_Marketers_Jobswav.mp4", summary: "Video on how ChatGPT is transforming the marketing profession — new skills, workflows, and opportunities." },
  { id: "blog-writing-video", title: "Blog Writing Prompt", type: "video", topic: "content", file: "Blog Writing Prompt.mp4", summary: "Video walkthrough of the blog writing prompt — how to use AI for blog content creation." },
  { id: "content-creation-video", title: "Content Creation [Comprehensive Guide]", type: "video", topic: "content", file: "Content Creation [Comprehensive Guide] - ChatGPT.mp4", summary: "Comprehensive video guide to content creation with AI — ideation, drafting, editing, and publishing." },
  { id: "content-cultural-trends-video", title: "Content Creation [Cultural Trends + ChatGPT]", type: "video", topic: "content", file: "Content Creation [Cultural Trends + ChatGPT].mp4", summary: "How to combine cultural trend analysis with AI content creation for timely, relevant marketing." },
  { id: "niche-expert-video", title: "Content Creation Prompt [Niche Expert]", type: "video", topic: "content", file: "Content Creation Prompt - ChatGPT [Niche Expert].mp4", summary: "How to use ChatGPT as a niche expert for content creation in specialized industries." },
  { id: "context-video", title: "Giving ChatGPT Context", type: "video", topic: "ai", file: "Giving_ChatGPT_Context_.mp4", summary: "How to provide effective context to ChatGPT for better marketing output." },
  { id: "role-play-video", title: "WaitButWhy Role Play [ChatGPT]", type: "video", topic: "ai", file: "WaitButWhy Role Play [ChatGPT Prompt].mp4", summary: "How to use role-playing prompts with ChatGPT for marketing ideation." },
  { id: "tone-video", title: "How To Give ChatGPT The Right Tone", type: "video", topic: "ai", file: "6._How_To_Give_ChatGPT_The_Right_Tone.mp4", summary: "How to control the tone and style of ChatGPT output for brand-consistent marketing content." },
  { id: "trending-topics-video", title: "Trending Content Topics [ChatGPT]", type: "video", topic: "content", file: "Trending Content Topics [ChatGPT Prompt].mp4", summary: "How to use ChatGPT to identify and capitalize on trending content topics." },
  { id: "product-shots-video", title: "Creating Product Shots [Midjourney & DALL-E]", type: "video", topic: "visual", file: "Creating Product Shots [Midjourney & DALL-E].mp4", summary: "How to create professional product shots using AI image generation tools." },
  { id: "logo-design-video", title: "Midjourney & ChatGPT Logo Design", type: "video", topic: "visual", file: "Midjourney _ ChatGPT Logo Design.mp4", summary: "How to design logos using Midjourney and ChatGPT — prompts, iterations, and brand consistency." },
  { id: "mental-models", title: "8 Mental Models for Marketing", type: "guide", topic: "strategy", file: "8_Mental_Models.pdf", summary: "8 mental models that sharpen marketing thinking — from first principles to inversion thinking." },
  { id: "my-results-ai", title: "My Results From The AI Console", type: "guide", topic: "ai", file: "My Results From The AI Console efc3b32c0cc3414f97164066c58249f7.html", summary: "Real results from using the AI marketing console — case studies, metrics, and lessons learned." },
];

// ═══════════════════════════════════════════════════════════════════════════
// DERIVED LOOKUPS
// ═══════════════════════════════════════════════════════════════════════════

export const BOOKS_BY_CATEGORY: Record<BookCategory, Book[]> = BOOKS.reduce(
  (acc, book) => {
    for (const cat of book.category) {
      (acc[cat] = acc[cat] || []).push(book);
    }
    return acc;
  },
  {} as Record<BookCategory, Book[]>,
);

export const BOOKS_BY_DIFFICULTY: Record<Difficulty, Book[]> = BOOKS.reduce(
  (acc, book) => {
    (acc[book.difficulty] = acc[book.difficulty] || []).push(book);
    return acc;
  },
  {} as Record<Difficulty, Book[]>,
);

export const BOOKS_BY_MASTER: Record<string, Book[]> = BOOKS.reduce(
  (acc, book) => {
    for (const masterId of book.insights.relatedMasters) {
      (acc[masterId] = acc[masterId] || []).push(book);
    }
    return acc;
  },
  {} as Record<string, Book[]>,
);

export const AI_RESOURCES_BY_TYPE: Record<string, AIResource[]> = AI_RESOURCES.reduce(
  (acc, r) => {
    (acc[r.type] = acc[r.type] || []).push(r);
    return acc;
  },
  {} as Record<string, AIResource[]>,
);

export const AI_RESOURCES_BY_TOPIC: Record<string, AIResource[]> = AI_RESOURCES.reduce(
  (acc, r) => {
    (acc[r.topic] = acc[r.topic] || []).push(r);
    return acc;
  },
  {} as Record<string, AIResource[]>,
);

/** Get books that relate to a specific Hub module */
export function getBooksForModule(moduleId: string): Book[] {
  return BOOKS.filter((b) => b.insights.relatedModules.includes(moduleId));
}

/** Get books by a specific master */
export function getBooksByMaster(masterId: string): Book[] {
  return BOOKS.filter((b) => b.insights.relatedMasters.includes(masterId));
}

/** Get books that relate to a specific formula */
export function getBooksForFormula(formulaId: string): Book[] {
  return BOOKS.filter((b) => b.insights.relatedFormulas.includes(formulaId));
}

/** Search books by query */
export function searchBooks(query: string): Book[] {
  const q = query.toLowerCase();
  return BOOKS.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.summary.toLowerCase().includes(q) ||
      b.bigIdea.toLowerCase().includes(q) ||
      b.category.some((c) => c.includes(q)),
  );
}