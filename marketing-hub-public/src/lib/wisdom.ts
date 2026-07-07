/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE WISDOM LIBRARY — The Soul of the Marketing Hub
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * This file contains the teachings, principles, and philosophy of the
 * greatest marketers who ever lived. It is not a formula library —
 * it is a wisdom library. The formulas tell you WHAT to calculate;
 * the wisdom tells you WHY you're calculating it.
 *
 * The Marketing Hub is built on the shoulders of these giants.
 * Every feature, every page, every metric exists because someone
 * worked out the truth of human attention and desire before us.
 *
 * "We are all standing on the shoulders of giants."
 *   — Bernard of Chartres, 1159
 */

export interface Master {
  id: string;
  name: string;
  era: string;
  title: string; // e.g., "The Father of Advertising"
  avatar: string; // emoji or initial
  color: string; // brand color for this master
  philosophy: string; // 1-paragraph core philosophy
  coreTeachings: Teaching[];
  quotes: { text: string; context?: string }[];
  books: string[];
  embodiedIn: string; // how the Hub embodies this master's teachings
  principles: { name: string; description: string; howToApply: string }[];
}

export interface Teaching {
  id: string;
  title: string;
  body: string;
  example?: string;
}

export interface WisdomQuote {
  text: string;
  author: string;
  context?: string;
  category: "empathy" | "attention" | "desire" | "trust" | "action" | "craft" | "soul" | "growth";
}

// ═══════════════════════════════════════════════════════════════════════════
// THE MASTERS
// ═══════════════════════════════════════════════════════════════════════════

export const MASTERS: Master[] = [
  {
    id: "seth-godin",
    name: "Seth Godin",
    era: "1990s — Present",
    title: "The Tribesman",
    avatar: "🎯",
    color: "var(--accent)",
    philosophy:
      "Marketing is not about pushing products — it's the generous act of helping someone become who they want to be. Find the smallest viable audience. Lead them. Be remarkable, because remarkable is the only marketing that spreads. Ship often. The cost of being wrong is less than the cost of doing nothing.",
    coreTeachings: [
      {
        id: "g1",
        title: "The Smallest Viable Audience",
        body: "Don't find customers for your products. Find products for your customers. Start with the smallest group that cares — the ones who will miss you if you're gone. If you can win them, the rest follows.",
        example:
          "Apple started with designers. Nike started with runners. Patagonia started with climbers.",
      },
      {
        id: "g2",
        title: "Remarkable is the only marketing that spreads",
        body: "Being very good is not enough. You must be remarkable — worth making a remark about. A purple cow in a field of brown cows. Safe is risky. The safest thing you can do is be remarkable.",
        example: "The Dyson vacuum looked like a machine, not an appliance. People talked.",
      },
      {
        id: "g3",
        title: "Ship",
        body: "The resistance is real. The lizard brain wants you to hide, to perfect, to wait. Ship anyway. Ship lousy work. Then ship better. The shipping is the point.",
        example: "This is why we built the Hub — to make shipping so easy you can't not do it.",
      },
      {
        id: "g4",
        title: "Strategy is making change inevitable",
        body: "Strategy is not a plan. Strategy is a choice about what change you want to make in the world, and a system to make that change inevitable. Tactics are what you do. Strategy is why you do it.",
        example: "Your Patrick Number isn't a tactic — it's a strategy for facing reality daily.",
      },
      {
        id: "g5",
        title: "People don't buy goods and services",
        body: "They buy relations, stories, and magic. The product is the proof of the story — not the story itself. The story is what makes the product worth buying.",
        example: "Harley-Davidson doesn't sell motorcycles. They sell the idea of freedom.",
      },
    ],
    quotes: [
      {
        text: "Marketing is the generous act of helping someone become who they want to be.",
        context: "This is Marketing, 2018",
      },
      {
        text: "If it doesn't spread, it's not marketing. It's a memo.",
        context: "Unleashing the Ideavirus, 2001",
      },
      {
        text: "People do not buy goods and services. They buy relations, stories, and magic.",
        context: "All Marketers Are Liars, 2005",
      },
      {
        text: "Find the smallest viable audience. Lead them first. The rest follows.",
        context: "The Practice, 2020",
      },
      {
        text: "The cost of being wrong is less than the cost of doing nothing.",
        context: "The Icarus Deception, 2014",
      },
      {
        text: "Don't find customers for your products, find products for your customers.",
        context: "This is Marketing, 2018",
      },
      { text: "The best marketing is invisible.", context: "The Practice, 2020" },
      { text: "Ship often. Ship lousy work. Then ship better.", context: "The Practice, 2020" },
    ],
    books: [
      "Purple Cow (2003)",
      "All Marketers Are Liars (2005)",
      "Linchpin (2010)",
      "The Icarus Deception (2014)",
      "This is Marketing (2018)",
      "The Practice (2020)",
    ],
    embodiedIn:
      "The GodinRibbon daily quote. The 'smallest viable audience' philosophy in Personas. The 'ship' principle in the Calendar and content pipeline. The strategy-first approach in Campaign Briefs.",
    principles: [
      {
        name: "Empathy over demographics",
        description:
          "Understand what your audience fears, wants, and believes — not just their age and income.",
        howToApply:
          "Use Personas to document emotional drivers, not just demographics. Write the 'pains' and 'goals' fields with empathy.",
      },
      {
        name: "Remarkable over competent",
        description: "Good enough is the enemy of remarkable. Be worth talking about.",
        howToApply:
          "In every campaign, ask: would someone tell a friend about this? If not, it's not done.",
      },
      {
        name: "Ship over perfect",
        description: "The resistance wants you to wait. Ship now, improve later.",
        howToApply:
          "The Calendar and content pipeline exist to make shipping frictionless. Don't let perfection delay your next post.",
      },
    ],
  },
  {
    id: "david-ogilvy",
    name: "David Ogilvy",
    era: "1950s — 1980s",
    title: "The Father of Advertising",
    avatar: "🎩",
    color: "#1e3a5f",
    philosophy:
      "The customer is not a moron; she is your wife. Respect her intelligence. Do your research — big ideas come from big research. Write headlines that promise a benefit. When you write, write as if you're writing a letter to someone you love. Test everything. The best advertising is a conversation, not a broadcast.",
    coreTeachings: [
      {
        id: "o1",
        title: "The customer is not a moron",
        body: "She is your wife. Talk to her with respect, intelligence, and warmth. Don't condescend. Don't shout. Explain why your product is better — with facts, not adjectives.",
        example:
          "Ogilvy's Rolls-Royce ad: 'At 60 miles an hour the loudest noise in this new Rolls-Royce comes from the electric clock.' A fact, not a claim.",
      },
      {
        id: "o2",
        title: "Big ideas come from big research",
        body: "Don't guess. Find out what people actually want, what they actually think, what actually keeps them up at night. The data tells you the story. The story tells you the idea.",
        example:
          "The Hathaway shirt ad used an eye patch — a small detail that made the man interesting. The idea came from studying how to make a shirt ad memorable.",
      },
      {
        id: "o3",
        title: "The headline is 80 cents of your dollar",
        body: "If the headline doesn't work, the body copy is wasted. Promise a benefit in the headline. Be specific. Be truthful. And make it impossible to not read the first sentence.",
        example:
          "'How to win friends and influence people' — a headline so good it became the title.",
      },
      {
        id: "o4",
        title: "Long copy sells",
        body: "If your copy is interesting, people will read it — all of it. The average reader of a car ad reads more copy than the average buyer of the car reads in the owner's manual. Long copy outperforms short copy when the product is expensive or complex.",
        example: "Ogilvy's Hathaway ad had 150 words of body copy. People read every one.",
      },
    ],
    quotes: [
      {
        text: "The customer is not a moron, she is your wife.",
        context: "Confessions of an Advertising Man, 1963",
      },
      { text: "Big ideas come from big research.", context: "Ogilvy on Advertising, 1983" },
      { text: "The headline is 80 cents of your dollar.", context: "Ogilvy on Advertising, 1983" },
      {
        text: "In the modern world of business, it is useless to be a creative, original thinker unless you can also sell what you create.",
        context: "Confessions, 1963",
      },
      {
        text: "Never write an advertisement which you wouldn't want your family to read.",
        context: "Ogilvy on Advertising, 1983",
      },
      {
        text: "The best ideas come as jokes. Make your thinking as funny as possible.",
        context: "Ogilvy on Advertising, 1983",
      },
    ],
    books: [
      "Confessions of an Advertising Man (1963)",
      "Ogilvy on Advertising (1983)",
      "The Unpublished David Ogilvy (1988)",
    ],
    embodiedIn:
      "The Copy Generator uses Ogilvy's headline formulas. The Brand Kit stores your 'big idea.' The A/B testing in Experiments follows his 'test everything' philosophy. The CRM treats every contact as a person, not a number.",
    principles: [
      {
        name: "Research before creativity",
        description:
          "Study your audience, your product, your competitors before you write a single headline.",
        howToApply:
          "Before writing copy, check Competitors and Personas. Know the landscape before you enter it.",
      },
      {
        name: "Promise a benefit",
        description: "Every headline should answer: what's in it for me?",
        howToApply:
          "Use the Copy Generator with the 'benefit' framework. Headlines that promise beat headlines that describe.",
      },
      {
        name: "Respect the reader",
        description: "Treat your audience as intelligent. Give them facts, not adjectives.",
        howToApply:
          "In all copy, replace adjectives with proof. 'Fast' → '0-60 in 3.2 seconds.' 'Reliable' → '99.97% uptime.'",
      },
    ],
  },
  {
    id: "gary-vaynerchuk",
    name: "Gary Vaynerchuk",
    era: "2000s — Present",
    title: "The Attention Hunter",
    avatar: "🔥",
    color: "#dc2626",
    philosophy:
      "Attention is the only currency that matters. Document, don't create — show the process, not just the product. Jab, jab, jab, right hook — give value three times before you ask for anything. Be native to each platform. Care more than anyone else. And remember: your legacy is how you made people feel.",
    coreTeachings: [
      {
        id: "v1",
        title: "Document, don't create",
        body: "Stop trying to create perfect content. Document your process, your journey, your learning. People connect with authenticity, not polish. The behind-the-scenes is more interesting than the final product.",
        example:
          "Gary built Wine Library TV by documenting wine tastings — not by producing polished ads.",
      },
      {
        id: "v2",
        title: "Jab, jab, jab, right hook",
        body: "Jabs are the value you give — the useful post, the entertaining video, the helpful answer. The right hook is the ask — buy this, sign up, subscribe. Three jabs for every right hook. If you only throw right hooks, you lose.",
        example:
          "Post 3 educational videos, then 1 product launch. Post 3 behind-the-scenes, then 1 sale.",
      },
      {
        id: "v3",
        title: "Attention is the currency",
        body: "Every platform is an attention market. The attention is there — the question is whether you're showing up where it is, in the format it wants, with the value it needs. Attention moves. Follow it.",
        example:
          "If your audience is on TikTok and you're posting on Facebook, you're fishing in an empty pond.",
      },
      {
        id: "v4",
        title: "Be native",
        body: "Don't post a TV ad on Instagram. Don't post a blog post on TikTok. Each platform has a language, a culture, a format. Speak it fluently or don't speak at all.",
        example:
          "A LinkedIn post should read like a memo. A TikTok should feel like a friend showing you something.",
      },
    ],
    quotes: [
      {
        text: "Attention is the currency of the internet.",
        context: "Jab, Jab, Jab, Right Hook, 2013",
      },
      { text: "Document, don't create.", context: "DailyVee, 2017" },
      { text: "Jab, jab, jab, right hook.", context: "Jab, Jab, Jab, Right Hook, 2013" },
      {
        text: "Your legacy is how you made people feel.",
        context: "The GaryVee Audio Experience, 2020",
      },
      { text: "Care. That's it. Care more than anyone else.", context: "Crush It!, 2009" },
      { text: "Content is king, but context is God.", context: "Jab, Jab, Jab, Right Hook, 2013" },
    ],
    books: [
      "Crush It! (2009)",
      "The Thank You Economy (2011)",
      "Jab, Jab, Jab, Right Hook (2013)",
      "#AskGaryVee (2016)",
    ],
    embodiedIn:
      "The Content Machine (document → repurpose → distribute). The Studio for native social content. The Calendar for jab-right-hook scheduling. The Wire for attention market intelligence.",
    principles: [
      {
        name: "Give before you ask",
        description: "Three jabs (value) for every right hook (ask).",
        howToApply:
          "In the Calendar, schedule 3 value posts before every promotional post. Track the ratio.",
      },
      {
        name: "Show the process",
        description: "Document your journey — people connect with authenticity.",
        howToApply:
          "Use the Content Machine's 'pillar content' to document your process, then repurpose into micro-content.",
      },
      {
        name: "Fish where the fish are",
        description: "Go where the attention is, in the format the platform wants.",
        howToApply:
          "Use the Wire and Trends to find where attention is moving. Then create native content for that platform.",
      },
    ],
  },
  {
    id: "eugene-schwartz",
    name: "Eugene Schwartz",
    era: "1950s — 1990s",
    title: "The Master of Desire",
    avatar: "📖",
    color: "#b45309",
    philosophy:
      "You cannot create desire in a market — you can only channel it. Desire already exists in the mass of prospects. Your job is to take that existing desire and direct it toward your product. The 5 levels of awareness determine everything: what you say, how you say it, and whether it works.",
    coreTeachings: [
      {
        id: "s1",
        title: "The 5 Levels of Awareness",
        body: "1. Unaware — they don't know they have a problem. 2. Problem Aware — they know the problem but not the solution. 3. Solution Aware — they know solutions exist but not yours. 4. Product Aware — they know your product but haven't bought. 5. Most Aware — they know your product and have bought before. Your copy changes completely depending on which level you're targeting.",
        example:
          "To an Unaware audience: 'Do you have trouble sleeping?' To a Product Aware audience: 'Why our mattress is 40% cooler than memory foam.'",
      },
      {
        id: "s2",
        title: "You cannot create desire — you channel it",
        body: "Desire is already in the market. It was put there by life, by frustration, by aspiration, by the culture. Your advertising doesn't create it — it takes that existing desire and points it at your product as the fulfillment.",
        example:
          "Nobody created the desire to be thin. The desire was there. The diet industry channeled it.",
      },
      {
        id: "s3",
        title: "Market Sophistication",
        body: "Stage 1: First in the market — claim the benefit. Stage 2: Competitors entered — claim superiority. Stage 3: Market is saturated — claim uniqueness through mechanism. Stage 4: Me-too products — reframe the entire problem. Your copy strategy changes at each stage.",
        example:
          "First car: 'A horseless carriage.' Stage 3: 'The only car with a hemi engine.' Stage 4: 'Not just a car — a statement about who you are.'",
      },
      {
        id: "s4",
        title: "The Intensity Scale",
        body: "Desire ranges from passive (vague interest) to desperate (will buy now). Your copy must match the intensity. Low-intensity copy for low-intensity desire. High-intensity, urgency-driven copy for high-intensity desire. Mismatched intensity kills conversion.",
        example:
          "A $10 impulse buy needs excitement. A $10,000 B2B purchase needs trust and proof.",
      },
    ],
    quotes: [
      {
        text: "You cannot create desire. You can only channel it to your product.",
        context: "Breakthrough Advertising, 1966",
      },
      {
        text: "Copy is not written. Copy is assembled.",
        context: "Breakthrough Advertising, 1966",
      },
      {
        text: "The best copywriters are the most relentless researchers.",
        context: "Breakthrough Advertising, 1966",
      },
    ],
    books: ["Breakthrough Advertising (1966)", "The Brilliance Breakthrough (1971)"],
    embodiedIn:
      "The Copy Generator includes Schwartz's 5 levels of awareness. The Personas track awareness levels. The Campaign Briefs account for market sophistication.",
    principles: [
      {
        name: "Match awareness to copy",
        description:
          "Know which of the 5 levels your audience is at, and write copy for that level.",
        howToApply:
          "In Personas, document each persona's awareness level. In the Copy Generator, select the awareness level to get the right copy framework.",
      },
      {
        name: "Channel, don't create",
        description: "Find the existing desire in the market and point it at your product.",
        howToApply:
          "Use Trends and The Wire to find what people already want. Then position your product as the fulfillment.",
      },
      {
        name: "Research relentlessly",
        description: "The best copywriters are the most relentless researchers.",
        howToApply:
          "Before writing any copy, spend 30 minutes in Competitors, Wire, and Trends. Know the market before you enter it.",
      },
    ],
  },
  {
    id: "claude-hopkins",
    name: "Claude Hopkins",
    era: "1900s — 1920s",
    title: "The Scientist",
    avatar: "⚗️",
    color: "#0f766e",
    philosophy:
      "Advertising is salesmanship in print. Treat it as a science, not an art. Use coupons and keys to test every ad. Give a reason why. Offer samples. The only purpose of advertising is to make sales — and every dollar spent should be accountable. If an ad doesn't sell, kill it.",
    coreTeachings: [
      {
        id: "h1",
        title: "Scientific Advertising",
        body: "Test everything. Use coupon codes, unique URLs, and tracked phone numbers to know exactly which ad produced which sale. Never guess — measure. When you find a winner, scale it. When you find a loser, kill it immediately.",
        example:
          "Hopkins used keyed coupons to test 50 different headlines for the same product. The winner outperformed the loser by 500%.",
      },
      {
        id: "h2",
        title: "Reason-Why Copy",
        body: "Every claim needs a reason. 'Whiter wash' is a claim. 'Whiter wash because of oxygen bubbles' is a reason. People don't buy claims — they buy reasons. The reason is the proof.",
        example:
          "Schlitz beer wasn't 'the best beer.' It was 'the beer brewed in plate-glass rooms with filtered air.' The reason made the claim credible.",
      },
      {
        id: "h3",
        title: "Sampling",
        body: "Let people try before they buy. A free sample is the most powerful sales tool ever invented. It removes risk, proves quality, and creates reciprocity. The cost of the sample is less than the cost of acquiring the customer another way.",
        example:
          "Hopkins gave away free samples of Palmolive soap. The trial converted at 40% — far cheaper than any ad.",
      },
    ],
    quotes: [
      { text: "Advertising is salesmanship in print.", context: "Scientific Advertising, 1923" },
      {
        text: "The only purpose of advertising is to make sales. It is not for general effect.",
        context: "Scientific Advertising, 1923",
      },
      {
        text: "Almost any question can be answered cheaply, quickly and finally by a test.",
        context: "Scientific Advertising, 1923",
      },
      {
        text: "Platitudes and generalities roll off the human understanding like water from a duck.",
        context: "My Life in Advertising, 1927",
      },
    ],
    books: ["Scientific Advertising (1923)", "My Life in Advertising (1927)"],
    embodiedIn:
      "The Experiments module (A/B testing). The Attribution module (tracking which touchpoint produced which sale). The Lead Magnets (modern sampling). The Patrick Number (every dollar accountable).",
    principles: [
      {
        name: "Test everything",
        description:
          "Never guess when you can test. Every headline, every offer, every channel should be measured.",
        howToApply:
          "Use Experiments for A/B tests. Use Attribution to track which touchpoints produce revenue. Kill losers fast.",
      },
      {
        name: "Give a reason why",
        description: "Every claim needs a mechanism — a reason it's true.",
        howToApply:
          "In the Copy Generator, use the 'reason-why' framework. Replace 'best' with 'best because…'",
      },
      {
        name: "Sample freely",
        description: "Let people try before they buy. The sample is the salesperson.",
        howToApply:
          "Use Lead Magnets to offer free value. Use Forms to capture the trial. The trial converts better than any ad.",
      },
    ],
  },
  {
    id: "alex-hormozi",
    name: "Alex Hormozi",
    era: "2010s — Present",
    title: "The Offer Architect",
    avatar: "💎",
    color: "#0369a1",
    philosophy:
      "Make an offer so good people feel stupid saying no. Value creation through risk reversal, bonuses, and guarantee stacking. The market doesn't reward effort — it rewards perceived value. Create more value than you capture. Your goal isn't to sell — it's to make saying yes the easiest decision your customer makes all day.",
    coreTeachings: [
      {
        id: "ho1",
        title: "The Grand Slam Offer",
        body: "An offer so good people feel stupid saying no. It combines: (1) a core dream outcome, (2) an unbelievable guarantee, (3) a mechanism that makes it work, and (4) bonuses that stack value beyond the price. The offer is the product — everything else is delivery.",
        example:
          "Gym launch: 'Lose 20lbs in 6 weeks or your money back + we'll give you $100 for your time.' The risk reversal made it impossible to say no.",
      },
      {
        id: "ho2",
        title: "Risk Reversal",
        body: "The customer takes all the risk in most transactions. Flip it. You take the risk. If it doesn't work, they get their money back — plus something extra. The more risk you remove, the higher your price can go.",
        example:
          "Money-back guarantee. 'Results in 30 days or full refund.' 'If we don't hit your KPI, you don't pay.'",
      },
      {
        id: "ho3",
        title: "Value Equation",
        body: "Value = (Dream Outcome × Perceived Likelihood of Achievement) / (Time to Achievement × Effort & Sacrifice). To increase value: increase the dream, increase belief it'll work, decrease time, decrease effort. Do all four and price becomes irrelevant.",
        example:
          "Weight loss: dream = look amazing. Belief = science-backed method. Time = 6 weeks. Effort = 20 min/day. Each lever increases perceived value.",
      },
    ],
    quotes: [
      {
        text: "Make an offer so good people feel stupid saying no.",
        context: "$100M Offers, 2021",
      },
      {
        text: "The market doesn't reward effort. It rewards perceived value.",
        context: "$100M Offers, 2021",
      },
      { text: "Create more value than you capture.", context: "$100M Leads, 2023" },
      { text: "You don't need better ads. You need better offers.", context: "$100M Offers, 2021" },
    ],
    books: ["$100M Offers (2021)", "$100M Leads (2023)", "$100M Sales (2024)"],
    embodiedIn:
      "The Funnels module (offer architecture). The Lead Magnets (value-first). The Pricing Strategies. The Campaign Briefs (dream outcome + mechanism). The Experiments (offer testing).",
    principles: [
      {
        name: "Stack the value",
        description: "Add bonuses until the perceived value is 10x the price.",
        howToApply:
          "In Funnels, add bonus steps. In Campaign Briefs, document the full value stack — not just the core product.",
      },
      {
        name: "Reverse the risk",
        description: "Make the customer's decision risk-free. You carry the risk.",
        howToApply:
          "In Landing Pages, add a guarantee section. In Campaign Briefs, write the risk reversal as a core component.",
      },
      {
        name: "Price is a function of value",
        description: "Don't compete on price. Compete on perceived value.",
        howToApply:
          "Use the Value Equation in Pricing Strategies. Increase the dream, belief, speed, and ease — not the discount.",
      },
    ],
  },
  {
    id: "robert-cialdini",
    name: "Robert Cialdini",
    era: "1980s — Present",
    title: "The Psychologist of Persuasion",
    avatar: "🧠",
    color: "#7c2d12",
    philosophy:
      "There are six universal principles of influence: reciprocity, commitment/consistency, social proof, authority, liking, and scarcity. They work because they are shortcuts — heuristics the brain uses to make decisions quickly. Use them ethically. When you understand the shortcuts, you understand marketing.",
    coreTeachings: [
      {
        id: "c1",
        title: "Reciprocity",
        body: "People feel obligated to give back when they receive first. The first gift should be valuable, unexpected, and personalized. The reciprocity gap is the difference between what you give and what they give back — keep it reasonable or it feels like manipulation.",
        example:
          "A restaurant that gives a mint with the bill gets 23% more tips than one that doesn't.",
      },
      {
        id: "c2",
        title: "Social Proof",
        body: "People look to what others do when they're uncertain. Show that others have chosen you — testimonials, case studies, user counts, ratings. The more specific and relatable the proof, the more powerful.",
        example:
          "Amazon's 'customers who bought this also bought' is social proof as a sales engine.",
      },
      {
        id: "c3",
        title: "Scarcity",
        body: "People want what they can't have. But scarcity must be genuine to work. Fake scarcity destroys trust. Real scarcity — limited seats, limited time, limited stock — creates urgency without manipulation.",
        example: "Only 3 seats left at this price. 247 people viewing this page right now.",
      },
    ],
    quotes: [
      { text: "People prefer to say yes to those they know and like.", context: "Influence, 1984" },
      { text: "The idea is to give first, then ask.", context: "Influence, 1984" },
      {
        text: "We view a behavior as correct in a given situation to the degree that we see others performing it.",
        context: "Influence, 1984",
      },
    ],
    books: ["Influence: The Psychology of Persuasion (1984)", "Pre-Suasion (2016)"],
    embodiedIn:
      "The Testimonials module (social proof). The Lead Magnets (reciprocity). The Scarcity formulas in Papers. The Consent/GDPR module (ethical influence). The Forms (commitment/consistency through micro-commitments).",
    principles: [
      {
        name: "Give to get",
        description: "The first move is always a gift. Value first, ask second.",
        howToApply:
          "Use Lead Magnets to give free value before asking for a purchase. The free value creates reciprocity.",
      },
      {
        name: "Show the crowd",
        description: "People follow people. Show that others have chosen you.",
        howToApply:
          "Populate Testimonials with real reviews. Show user counts on landing pages. Use case studies as proof.",
      },
      {
        name: "Be genuine",
        description:
          "Persuasion without ethics is manipulation. Use influence to help people make good decisions.",
        howToApply:
          "Never fake scarcity, testimonials, or urgency. The Hub's Scarcity formula includes an 'authenticity factor' — use it honestly.",
      },
    ],
  },
  {
    id: "donald-miller",
    name: "Donald Miller",
    era: "2010s — Present",
    title: "The Storyteller",
    avatar: "📖",
    color: "#be123c",
    philosophy:
      "Your customer is the hero of the story, not your brand. Your brand is the guide. Every hero has a problem, every guide has a plan, and every story ends with either success or failure. When you frame your marketing as a story, people don't just understand it — they feel it. And feeling is what drives action.",
    coreTeachings: [
      {
        id: "m1",
        title: "The Customer is the Hero",
        body: "Stop positioning your brand as the hero. Your customer is Luke Skywalker — you are Yoda. The hero has a problem. The guide understands it. The guide gives a plan. The hero succeeds (or fails). That's the story.",
        example:
          "Nike doesn't say 'we're the best shoe company.' They say 'you are an athlete. Here's how to run your best.'",
      },
      {
        id: "m2",
        title: "The 7-Part StoryBrand Framework",
        body: "1. A character (your customer) 2. Has a problem (the villain) 3. Meets a guide (your brand) 4. Who gives them a plan (your offer) 5. And calls them to action (your CTA) 6. That helps them avoid failure (stakes) 7. And ends in success (transformation). Every landing page, every email, every ad should follow this structure.",
        example:
          "Apple's 'Think Different': you (the creative) have a problem (conformity). Apple (the guide) gives you a plan (their tools). You avoid mediocrity. You end up changing the world.",
      },
    ],
    quotes: [
      {
        text: "Your customer is the hero, not your brand.",
        context: "Building a StoryBrand, 2017",
      },
      { text: "If you confuse, you lose.", context: "Building a StoryBrand, 2017" },
      {
        text: "Customers don't want to buy your product. They want the transformation your product provides.",
        context: "Building a StoryBrand, 2017",
      },
    ],
    books: [
      "Building a StoryBrand (2017)",
      "Marketing Made Simple (2020)",
      "Hero on a Mission (2022)",
    ],
    embodiedIn:
      "The Brand Stories module (story framework). The Campaign Briefs (hero, problem, guide, plan, CTA). The Personas (hero definition). The Landing Pages (story structure).",
    principles: [
      {
        name: "Be the guide, not the hero",
        description:
          "Position your customer as the hero. You are the wise guide who helps them win.",
        howToApply:
          "In Brand Stories, write from the customer's perspective. In Campaign Briefs, document the customer's problem and your plan — not your features.",
      },
      {
        name: "Sell the transformation",
        description: "People don't buy products. They buy who they become after using the product.",
        howToApply:
          "In Personas, document the 'before' and 'after' states. In Campaign Briefs, write the transformation as the promise.",
      },
    ],
  },
  {
    id: "joseph-sugarman",
    name: "Joseph Sugarman",
    era: "1970s — 2000s",
    title: "The Slippery Slope",
    avatar: "🛝",
    color: "#15803d",
    philosophy:
      "The purpose of the headline is to get you to read the first sentence. The purpose of the first sentence is to get you to read the second sentence. And so on. Every sentence must be so compelling that the reader can't stop. This is the slippery slope — once they start, they slide all the way to the buy button.",
    coreTeachings: [
      {
        id: "su1",
        title: "The Slippery Slope",
        body: "Your copy should be a slippery slope. Each sentence creates a desire to read the next. The headline sells the first sentence. The first sentence sells the second. The second sells the third. By the time they reach the price, they're already sold.",
        example:
          "Sugarman's BluBlocker ad: 'When I put on these glasses, I couldn't believe my eyes.' → you have to read the next line to find out what he saw.",
      },
      {
        id: "su2",
        title: "The Psychological Triggers",
        body: "There are 14 psychological triggers that make people buy: feeling of involvement, honesty, integrity, value, satisfaction, relationship, credibility, urgency, greed, exclusivity, simplicity, human interest, fear, and hope. Stack 3-4 triggers in every piece of copy.",
        example:
          "A limited-edition product (exclusivity + urgency) with a money-back guarantee (credibility + satisfaction) at a special price (greed).",
      },
    ],
    quotes: [
      {
        text: "The purpose of the headline is to get you to read the first sentence.",
        context: "Advertising Secrets of the Written Word, 1998",
      },
      { text: "Copy is not written. Copy is assembled.", context: "Triggers, 1999" },
      {
        text: "Every element of your copy should be designed to get the first sentence read.",
        context: "Advertising Secrets, 1998",
      },
    ],
    books: ["Advertising Secrets of the Written Word (1998)", "Triggers (1999)"],
    embodiedIn:
      "The Copy Generator (slippery slope structure). The Landing Pages (sequential block design). The Emails (sentence-by-sentence copy flow). The Funnels (step-by-step descent).",
    principles: [
      {
        name: "Make it slippery",
        description: "Every sentence must make the reader want the next.",
        howToApply:
          "In the Copy Generator, use the 'slippery slope' template. Read your copy aloud — if you stop, the reader stops.",
      },
      {
        name: "Stack triggers",
        description: "Use 3-4 psychological triggers in every piece of copy.",
        howToApply:
          "In the Copy Generator, select multiple frameworks to stack triggers. Exclusivity + urgency + social proof = a powerful combination.",
      },
    ],
  },
  {
    id: "gary-halbert",
    name: "Gary Halbert",
    era: "1970s — 2000s",
    title: "The Prince of Print",
    avatar: "✍️",
    color: "#a21caf",
    philosophy:
      "Find a starving crowd. The most profitable business is one that serves people who are already desperate for what you sell. You don't need to create desire — you need to find the people who already have it. Then write copy that speaks to their hunger. Long copy. Story-driven. Impossible to put down.",
    coreTeachings: [
      {
        id: "ha1",
        title: "Find the Starving Crowd",
        body: "If you and I both open a hamburger stand, the one who wins is not the one with the best burgers. It's the one who sets up in front of the starving crowd. Market selection beats product quality every time. Find the hunger first.",
        example:
          "Halbert's coat-of-arms letter sold because the audience (people with that surname) were starving for identity and heritage.",
      },
      {
        id: "ha2",
        title: "Story Copy",
        body: "People don't read ads — they read stories. Wrap your sales message in a story and they'll read every word. The story isn't about your product — it's about the reader's transformation through your product.",
        example:
          "The 'Boron Letters' — Halbert wrote his son letters about marketing that became the most-read marketing book ever. Because they were stories.",
      },
    ],
    quotes: [
      { text: "Find a starving crowd.", context: "The Boron Letters, 1986" },
      {
        text: "People don't read ads. They read stories.",
        context: "How to Make Maximum Money with Minimum Customers, 2000",
      },
      {
        text: "The most valuable skill you can have in business is the ability to write copy that sells.",
        context: "The Boron Letters, 1986",
      },
    ],
    books: ["The Boron Letters (1986)", "How to Make Maximum Money with Minimum Customers (2000)"],
    embodiedIn:
      "The Trends module (find the starving crowd). The Wire (market intelligence). The Personas (hunger documentation). The Copy Generator (story-based frameworks).",
    principles: [
      {
        name: "Hunt the hunger",
        description: "Find people who are already desperate for what you sell.",
        howToApply:
          "Use Trends and The Wire to identify what people are hungry for. Don't create demand — find it.",
      },
      {
        name: "Tell stories, not ads",
        description: "Wrap your sales message in a narrative.",
        howToApply:
          "In the Copy Generator, use the 'story' framework. In Emails, open with a story before the pitch.",
      },
    ],
  },
  {
    id: "rory-sutherland",
    name: "Rory Sutherland",
    era: "2000s — Present",
    title: "The Alchemist",
    avatar: "🪄",
    color: "#c2410c",
    philosophy:
      "The opposite of a good idea can also be a good idea. Psychological value often exceeds functional value. A $4,000 Prada suit doesn't keep you 40x warmer than a $100 suit — but it makes you feel 40x more confident. Marketing isn't about lying — it's about finding the psychological truth that functional specs miss.",
    coreTeachings: [
      {
        id: "su1",
        title: "Psychological Value > Functional Value",
        body: "People don't buy the thing — they buy the feeling the thing gives them. The red button that does nothing but makes people feel in control. The long queue that makes the restaurant feel popular. The expensive packaging that makes the gift feel valuable. These are not tricks — they are the real product.",
        example:
          "Google's 'I'm Feeling Lucky' button cost $110M/year in ad revenue. But it made Google feel fun. The psychological value exceeded the functional cost.",
      },
      {
        id: "su2",
        title: "The Opposite of a Good Idea",
        body: "In physics, the opposite of a correct statement is a false statement. In psychology, the opposite of a correct statement can also be correct. 'Plan everything' works. 'Plan nothing' can also work. Context is everything. Don't assume there's one right answer.",
        example:
          "Some airlines succeed by being cheapest. Some succeed by being most expensive. Both are right — for different audiences.",
      },
    ],
    quotes: [
      { text: "The opposite of a good idea can also be a good idea.", context: "Alchemy, 2019" },
      { text: "Things that don't make sense often make the most sense.", context: "Alchemy, 2019" },
      {
        text: "Marketing is not about lying. It's about finding the psychological truth.",
        context: "Alchemy, 2019",
      },
      { text: "The value of something is not the same as its price.", context: "Alchemy, 2019" },
    ],
    books: ["Alchemy: The Dark Art and Curious Science of Creating Magic in Brands (2019)"],
    embodiedIn:
      "The Brand Kit (psychological value, not just functional specs). The Pricing Strategies (psychological pricing). The Funnels (framing and context). The Experiments (test the irrational).",
    principles: [
      {
        name: "Honor the irrational",
        description:
          "People are not rational. They are predictably irrational. Design for how they actually decide.",
        howToApply:
          "In Pricing Strategies, test psychological anchors ($99 vs $100). In Funnels, test 'irrational' design choices.",
      },
      {
        name: "Sell the feeling",
        description: "The functional product is the proof. The feeling is the product.",
        howToApply:
          "In Brand Stories, document the emotional transformation. In Personas, capture the feeling the persona wants.",
      },
    ],
  },
  {
    id: "dan-kennedy",
    name: "Dan Kennedy",
    era: "1980s — 2010s",
    title: "The Godfather of Direct Response",
    avatar: "💰",
    color: "#15803d",
    philosophy:
      "The money is in the list. Every marketing activity must be measurable, accountable, and profitable. If you can't track the ROI, don't spend the money. Build a herd of customers who buy again and again. Use long-form sales letters, magnetic headlines, and irresistible offers with deadlines. Price is what you pay, value is what you get — never compete on price.",
    coreTeachings: [
      {
        id: "k1",
        title: "The Money is in the List",
        body: "Your customer list is your most valuable asset. Not your brand, not your content, not your social following — your list of buyers. Treat it like gold. Mail it regularly. Make offers. Track response. The list is the business.",
        example:
          "Kennedy's clients built 8-figure businesses from email lists of 5,000 buyers — not 500,000 followers.",
      },
      {
        id: "k2",
        title: "Magnetic Marketing",
        body: "Stop chasing prospects. Attract them with a magnetic message that pulls in your ideal customer and repels everyone else. The right message to the right audience is worth more than the best message to the wrong audience.",
        example:
          "A plumber who sent 'Is your water heater about to fail?' to homeowners over 10 years old got a 12% response rate.",
      },
      {
        id: "k3",
        title: "Deadlines and Scarcity",
        body: "Every offer needs a deadline. Without urgency, people procrastinate forever. A real deadline — not a fake one — forces decision. 'This offer expires Friday at 5pm' beats 'limited time offer' every time.",
        example:
          "Kennedy's sales letters always had a specific deadline date, not 'act now.' The specificity made it credible.",
      },
    ],
    quotes: [
      { text: "The money is in the list.", context: "Magnetic Marketing, 1992" },
      {
        text: "If you can't track the ROI, don't spend the money.",
        context: "No B.S. Direct Marketing, 2006",
      },
      {
        text: "Price is what you pay. Value is what you get.",
        context: "No B.S. Sales Success, 2008",
      },
    ],
    books: [
      "Magnetic Marketing (1992)",
      "No B.S. Direct Marketing (2006)",
      "The Ultimate Marketing Plan (2011)",
    ],
    embodiedIn:
      "The CRM (the list). The Sequences module (automated follow-up). The Patrick Number (accountability). The Budget planner (ROI tracking). The Outbox (email as the highest-ROI channel).",
    principles: [
      {
        name: "Mail your list",
        description: "Your buyer list is your #1 asset. Mail it with value and offers regularly.",
        howToApply:
          "Use the Outbox and Emails modules to send weekly value + monthly offers to your CRM contacts.",
      },
      {
        name: "Every dollar accountable",
        description: "If you can't track ROI, don't spend.",
        howToApply:
          "Use Attribution to track every touchpoint. Use the Patrick Number to hold yourself accountable daily.",
      },
      {
        name: "Real deadlines",
        description: "Every offer needs a specific, credible deadline.",
        howToApply:
          "In Campaign Briefs, always include a deadline. In Landing Pages, show a specific date — not 'limited time.'",
      },
    ],
  },
  {
    id: "russell-brunson",
    name: "Russell Brunson",
    era: "2010s — Present",
    title: "The Funnel Architect",
    avatar: "🌀",
    color: "#0369a1",
    philosophy:
      "Every business needs a value ladder — a series of ascending offers that guide customers from free to premium. Build funnels that capture, nurture, and convert automatically. The frontend offer pays for acquisition. The backend offer creates wealth. Publish daily to attract your perfect audience. Your hook, story, and offer are the only three things that matter.",
    coreTeachings: [
      {
        id: "b1",
        title: "The Value Ladder",
        body: "Map your entire business as a ladder: Free to Low-ticket to Mid-ticket to High-ticket to Continuity. Each rung delivers more value and costs more. The bottom rungs are for acquisition. The top rungs are for profit. Most businesses only sell one rung — leaving 80% of revenue on the table.",
        example:
          "ClickFunnels: free book ($0 shipping) to software ($97/mo) to coaching ($5,000+) to mastermind ($25,000+).",
      },
      {
        id: "b2",
        title: "Hook, Story, Offer",
        body: "These are the only three things that matter in marketing. The Hook grabs attention. The Story builds desire and trust. The Offer closes the sale. Get all three right and you can sell anything. Get any one wrong and nothing works.",
        example:
          "Hook: 'How a deaf wrestler built a $100M software company.' Story: The journey, the struggles, the discovery. Offer: 'Get the same system for $97/mo, 14-day free trial.'",
      },
      {
        id: "b3",
        title: "Publish Daily",
        body: "Your content is your audience magnet. Publish one piece of content every day for 365 days. Where? On the platform where your audience lives. The content does not have to be perfect — it has to be consistent. Consistency builds the audience. The audience builds the business.",
        example:
          "Brunson published a daily video for 365 days on YouTube. It built the audience that became ClickFunnels.",
      },
    ],
    quotes: [
      { text: "Hook, story, offer — that's all marketing is.", context: "DotCom Secrets, 2014" },
      {
        text: "Your frontend offer pays for acquisition. Your backend offer creates wealth.",
        context: "Expert Secrets, 2017",
      },
      {
        text: "Publish daily for a year and you'll have a business.",
        context: "Traffic Secrets, 2020",
      },
    ],
    books: ["DotCom Secrets (2014)", "Expert Secrets (2017)", "Traffic Secrets (2020)"],
    embodiedIn:
      "The Funnels module (value ladder visualization). The Landing Pages (frontend offers). The Sequences (automated nurturing). The Calendar (daily publishing). The Campaign Briefs (hook, story, offer structure).",
    principles: [
      {
        name: "Build the ladder",
        description: "Map your entire business as a value ladder from free to premium.",
        howToApply:
          "In Funnels, create a 4-step funnel: lead magnet, tripwire, core offer, continuity. Each step should ascend in value and price.",
      },
      {
        name: "Perfect the trio",
        description: "Hook, story, offer — get all three right.",
        howToApply:
          "In Campaign Briefs, document the hook (attention grabber), story (desire builder), and offer (the close) separately. Test each independently.",
      },
    ],
  },
  {
    id: "joanna-wiebe",
    name: "Joanna Wiebe",
    era: "2010s — Present",
    title: "The Conversion Copywriter",
    avatar: "✒️",
    color: "#be123c",
    philosophy:
      "Copy is not about being clever — it's about being clear. The best copy comes from your customers, not from your imagination. Do voice-of-customer research: read their reviews, their support tickets, their emails. Then write copy that sounds like them talking to themselves. Conversion copy is research, then assembly — not creation.",
    coreTeachings: [
      {
        id: "w1",
        title: "Voice of Customer",
        body: "Your customers already wrote your copy. It's in their reviews, support tickets, sales calls, and emails. Your job is to collect it, organize it, and put it in the right place. When your copy sounds like the customer talking to themselves, conversion skyrockets.",
        example:
          "Instead of 'increase productivity,' use the customer's words: 'stop wasting 3 hours every Monday on reports.'",
      },
      {
        id: "w2",
        title: "Research Before Writing",
        body: "Never start writing copy without research. Read 50 customer reviews. Listen to 5 sales calls. Read 20 support tickets. Then — and only then — write. The research gives you the words. The writing gives them order.",
        example:
          "Wiebe rewrote a SaaS landing page using only words from customer interviews. Conversion went from 2.1% to 5.7%.",
      },
    ],
    quotes: [
      {
        text: "Your customers already wrote your copy. You just need to listen.",
        context: "Conversion Copywriting, 2017",
      },
      {
        text: "The best copy sounds like the customer talking to themselves.",
        context: "Conversion Copywriting, 2017",
      },
    ],
    books: ["Conversion Copywriting (2017)"],
    embodiedIn:
      "The Copy Generator (voice-of-customer templates). The Personas (customer language documentation). The Inbox (real customer language). The Experiments (A/B test copy).",
    principles: [
      {
        name: "Steal their words",
        description: "Use your customers' exact words in your copy.",
        howToApply:
          "In the Inbox, read customer messages. In Personas, document exact phrases. In the Copy Generator, paste those phrases as the foundation.",
      },
      {
        name: "Test everything",
        description: "Never launch copy without testing a variation.",
        howToApply:
          "In Experiments, always run at least 2 headline variations. The winner becomes the new control.",
      },
    ],
  },
  {
    id: "ryan-deiss",
    name: "Ryan Deiss",
    era: "2010s — Present",
    title: "The Journey Architect",
    avatar: "🛤️",
    color: "var(--accent)",
    philosophy:
      "Every customer goes through the same 8-phase journey: awareness, engagement, subscription, conversion, excitement, ascension, advocacy, promotion. Map every touchpoint to this journey. Optimize each phase independently. The customer journey is not a funnel — it's a cycle. The goal is not just to convert but to turn customers into promoters.",
    coreTeachings: [
      {
        id: "d1",
        title: "The Customer Value Journey",
        body: "8 phases: 1. Aware (they discover you) 2. Engage (they interact) 3. Subscribe (they give you their email) 4. Convert (first purchase) 5. Excite (they experience the value) 6. Ascend (they buy more) 7. Advocate (they recommend you) 8. Promote (they sell for you). Each phase has specific tactics and metrics.",
        example:
          "Aware: SEO/ads. Engage: social proof. Subscribe: lead magnet. Convert: tripwire offer. Excite: onboarding. Ascend: upsell. Advocate: NPS. Promote: referral program.",
      },
    ],
    quotes: [
      {
        text: "The customer journey is not a funnel. It's a cycle.",
        context: "The Customer Value Journey, 2017",
      },
      {
        text: "Turn customers into promoters. That's when growth compounds.",
        context: "DigitalMarketer, 2018",
      },
    ],
    books: ["The Customer Value Journey (2017)"],
    embodiedIn:
      "The Funnels module (8-phase journey mapping). The Retention module (ascension tracking). The Surveys (advocacy measurement). The Sequences (automated lifecycle).",
    principles: [
      {
        name: "Map the 8 phases",
        description: "Every customer goes through 8 phases. Optimize each independently.",
        howToApply:
          "In Funnels, create an 8-step funnel matching the CVJ. In Retention, track which phase each customer is in.",
      },
      {
        name: "Build the flywheel",
        description: "Turn customers into promoters so growth compounds.",
        howToApply:
          "In Surveys, measure NPS. In Testimonials, collect stories. In Campaign Briefs, include referral mechanics.",
      },
    ],
  },
  {
    id: "frank-kern",
    name: "Frank Kern",
    era: "2000s — Present",
    title: "The Core Influence Master",
    avatar: "🎭",
    color: "#c2410c",
    philosophy:
      "Stop selling to a crowd. Sell to one person — your perfect customer — as if you're writing them a personal letter. Build core influence by understanding their deepest desires and fears. Use the Results in Advance formula: show them exactly what their life looks like after they use your product, before they buy. When people feel understood, they buy.",
    coreTeachings: [
      {
        id: "ke1",
        title: "Core Influence",
        body: "There are two levels of influence: surface influence (tactics, tricks, persuasion techniques) and core influence (deep understanding). Core influence comes from knowing your customer so well that your marketing feels like mind-reading. When they think 'how does he know exactly how I feel?' — you have core influence.",
        example:
          "Kern's famous promotion: 'I'm not going to try to sell you anything. I just want to tell you a story.' It felt personal. It sold millions.",
      },
      {
        id: "ke2",
        title: "Results in Advance",
        body: "Show your prospect what their life looks like AFTER using your product — before they buy. Take them through the transformation in your marketing. By the time they reach the offer, they've already experienced the result. Now they're not buying a product — they're buying more of what they already felt.",
        example:
          "Weight loss ad: 'Imagine waking up, looking in the mirror, and seeing someone you recognize.' The result is experienced before the purchase.",
      },
    ],
    quotes: [
      { text: "Stop selling to a crowd. Sell to one person.", context: "Core Influence, 2008" },
      { text: "When people feel understood, they buy.", context: "Core Influence, 2008" },
      { text: "Show them the result in advance.", context: "Results in Advance, 2010" },
    ],
    books: ["Core Influence (2008)", "Mass Control (2010)"],
    embodiedIn:
      "The Personas (core influence documentation). The Copy Generator (Results in Advance templates). The Campaign Briefs (transformation-first structure). The Brand Stories (emotional narrative).",
    principles: [
      {
        name: "Write to one person",
        description: "Don't write for an audience. Write for your single perfect customer.",
        howToApply:
          "In Personas, create one avatar persona. Write all copy as a letter to that person. Read it aloud.",
      },
      {
        name: "Results in advance",
        description: "Let them experience the transformation before they buy.",
        howToApply:
          "In Landing Pages, open with the after state. Show the result first, the product second.",
      },
    ],
  },
  {
    id: "philip-kotler",
    name: "Philip Kotler",
    era: "1960s — Present",
    title: "The Father of Modern Marketing",
    avatar: "📚",
    color: "#1e40af",
    philosophy:
      "Marketing is not the art of finding clever ways to dispose of what you make. It is the art of creating genuine customer value. The aim of marketing is to know and understand the customer so well the product fits and sells itself. Marketing takes a day to learn and a lifetime to master. Good marketing is no accident — it is the result of careful planning and execution, using the right tools, the right models, and the right understanding of human behavior.",
    coreTeachings: [
      {
        id: "kot1",
        title: "The Marketing Concept",
        body: "The customer is the center of the business universe. Not the product, not the factory, not the balance sheet — the customer. Every decision starts with: what does the customer need, and how do we serve it better than anyone else? This was revolutionary in 1967, when most companies were still product-centric. Kotler made customer-centricity the default.",
        example:
          "Kotler's Marketing Management textbook (1967, now in its 16th edition) trained every MBA for 50 years. It is the most widely read marketing textbook in history.",
      },
      {
        id: "kot2",
        title: "STP — Segmentation, Targeting, Positioning",
        body: "You cannot serve everyone. Segment the market into groups with distinct needs. Target the segment where you can create the most value. Position your offering in their minds so they choose you over every alternative. STP is the opening chapter of every marketing plan — and the opening of every startup pitch deck.",
        example:
          "Nike segmented athletes, targeted runners (then expanded), positioned as the premium performance brand. STP in three moves.",
      },
      {
        id: "kot3",
        title: "The 4 Ps → 7 Ps → Modern 4 Ps",
        body: "Product, Price, Place, Promotion. The four levers every marketer pulls. Kotler later extended to 7 Ps (adding People, Process, Physical Evidence) for services, and to the modern 4 Ps (People, Processes, Programs, Performance). But the original four remain the spine of every marketing decision.",
        example:
          "Every landing page is a 4 P decision: what you sell (Product), what you charge (Price), where it lives (Place), how you drive traffic (Promotion).",
      },
      {
        id: "kot4",
        title: "Customer Delivered Value",
        body: "Value is not what you put into the product — it's what the customer receives minus what they give. Total Customer Value (product + service + personnel + image) minus Total Customer Cost (money + time + energy + psychic). When this number is positive and large, you have a loyal customer. When it's negative, you have churn.",
        example:
          "Apple's value: product excellence + service (Genius Bar) + image (premium brand) − price (high but perceived as fair for the value).",
      },
      {
        id: "kot5",
        title: "Marketing Myopia — Know What Business You're In",
        body: "Kotler championed Levitt's insight: define your business by the need you serve, not the product you make. Railroads died because they thought they were in the railroad business, not the transportation business. Ask: what need does the customer hire our product to fulfill?",
        example:
          "Kodak thought they were in film. They were in memories. Blockbuster thought they were in rentals. They were in entertainment.",
      },
      {
        id: "kot6",
        title: "Societal Marketing",
        body: "The best marketing serves three stakeholders simultaneously: the customer (satisfaction), the company (profit), and society (wellbeing). Marketing that exploits customers or society is not sustainable. Marketing that serves all three builds compounding brand equity. This was Kotler's evolution beyond pure customer-centricity — to stakeholder-centricity.",
        example:
          "Patagonia: customer gets quality gear, company gets profit, society gets environmental protection. Triple win = compounding loyalty.",
      },
    ],
    quotes: [
      {
        text: "Marketing is not the art of finding clever ways to dispose of what you make. It is the art of creating genuine customer value.",
        context: "Marketing Management, 1967",
      },
      {
        text: "The aim of marketing is to know and understand the customer so well the product fits and sells itself.",
        context:
          "Management: Tasks, Responsibilities, Practices (attributed to Drucker, adopted by Kotler)",
      },
      {
        text: "Marketing takes a day to learn and a lifetime to master.",
        context: "Marketing Management, 1967",
      },
      {
        text: "Good marketing is no accident, but a result of careful planning and execution.",
        context: "Marketing Management, 1967",
      },
      {
        text: "The best advertising is done by satisfied customers.",
        context: "Marketing Management, 1967",
      },
      {
        text: "It is no longer enough to satisfy customers. You must delight them.",
        context: "Marketing 3.0, 2010",
      },
      {
        text: "Companies should think of marketing as a continuing process of learning, not a department.",
        context: "Marketing 4.0, 2016",
      },
      {
        text: "The future of marketing is not about technology. It is about being more human.",
        context: "Marketing 5.0, 2021",
      },
    ],
    books: [
      "Marketing Management (1967, 16 editions)",
      "Principles of Marketing (1980)",
      "Marketing 3.0 (2010)",
      "Marketing 4.0 (2016)",
      "Marketing 5.0 (2021)",
    ],
    embodiedIn:
      "The entire Hub is Kotler's framework digitalized: Personas = Segmentation, Segments = Targeting, Brand Kit = Positioning. The 4 Ps map to Campaigns (Product), Budget (Price), Landing Pages (Place), and the Calendar/Outbox (Promotion). The Patrick Number is his accountability principle.",
    principles: [
      {
        name: "Customer at the center",
        description: "Every decision starts with the customer's need, not the product.",
        howToApply:
          "Before creating any campaign, open Personas. Read their pains. Then design the campaign as the answer to those pains — not as a product feature list.",
      },
      {
        name: "Segment, target, position",
        description: "Don't serve everyone. Pick the segment where you create the most value.",
        howToApply:
          "In Segments, create 3-5 segments. In Personas, build the avatar for your primary segment. In Positioning Statements, write the one-sentence position. STP in three clicks.",
      },
      {
        name: "Deliver value, not features",
        description: "The customer receives value minus cost. Maximize the gap.",
        howToApply:
          "In Campaign Briefs, write the 'dream outcome' before the features. In Pricing Strategies, use the Value Equation. In Landing Pages, lead with the transformation.",
      },
    ],
  },
  {
    id: "theodore-levitt",
    name: "Theodore Levitt",
    era: "1960s — 2000s",
    title: "The Man Who Killed Myopia",
    avatar: "🔭",
    color: "#0c4a6e",
    philosophy:
      "People don't want to buy a quarter-inch drill. They want a quarter-inch hole. Every industry is a customer-satisfying process, not a goods-producing process. Define your business by the customer need you serve, not the product you make. Growth comes from looking outward at the customer, not inward at the factory.",
    coreTeachings: [
      {
        id: "lev1",
        title: "Marketing Myopia",
        body: "The most reprinted article in HBR's 100-year history. Railroads didn't stop growing because the need for transport declined — it grew. They stopped growing because they thought they were in the railroad business, not the transportation business. Every industry that has died died the same death: they loved their product more than their customer.",
        example:
          "Hollywood almost died because it thought it was in the movie business, not the entertainment business. Then TV came and they adapted.",
      },
      {
        id: "lev2",
        title: "The customer-satisfying process",
        body: "Every business is a customer-satisfying process. The product is just the vehicle. When you understand this, you stop optimizing the product and start optimizing the satisfaction. The product becomes a means, not an end.",
        example:
          "People don't buy a mattress. They buy a good night's sleep. The mattress is the vehicle. The sleep is the product.",
      },
    ],
    quotes: [
      {
        text: "People don't want to buy a quarter-inch drill. They want a quarter-inch hole.",
        context: "Marketing Myopia, HBR 1960",
      },
      {
        text: "An industry is a customer-satisfying process, not a goods-producing process.",
        context: "Marketing Myopia, HBR 1960",
      },
      {
        text: "Growth is not attained by being in the right place at the right time. It is attained by being in the right business.",
        context: "Marketing Myopia, HBR 1960",
      },
    ],
    books: [
      "Marketing Myopia (HBR, 1960)",
      "The Marketing Imagination (1983)",
      "Levitt on Marketing (2006)",
    ],
    embodiedIn:
      "The Myopia Test in the Old School formulas. The Positioning Statements module (which need to answer 'what need do you serve?'). The Campaign Briefs (which ask for the customer's outcome, not the product's features).",
    principles: [
      {
        name: "Sell the hole, not the drill",
        description: "Define your business by the customer need, not the product.",
        howToApply:
          "In Positioning Statements, write the 'frame of reference' as the customer's need, not your product category. 'We are in the sleep business' not 'we are in the mattress business.'",
      },
    ],
  },
  {
    id: "michael-porter",
    name: "Michael Porter",
    era: "1980s — Present",
    title: "The Strategist",
    avatar: "♟️",
    color: "#166534",
    philosophy:
      "Strategy is about choosing what NOT to do. There are only three ways to win: cost leadership, differentiation, or focus. The worst position is stuck in the middle — not cheap enough, not unique enough, not focused enough. Competitive advantage is not what you do well — it's what you do differently that creates value competitors can't replicate.",
    coreTeachings: [
      {
        id: "por1",
        title: "Three Generic Strategies",
        body: "Cost leadership: be the cheapest. Differentiation: be the most unique. Focus: be the best for a narrow niche. You must pick ONE. Companies that try to be all three end up being none. The choice is not temporary — it defines your entire operating model.",
        example:
          "Walmart = cost leadership. Apple = differentiation. Rolex = focus (premium niche). Each built their entire supply chain, marketing, and culture around their one strategy.",
      },
      {
        id: "por2",
        title: "The Value Chain",
        body: "Every company is a collection of activities that create value. Map them: inbound logistics, operations, outbound logistics, marketing & sales, service. Each activity is either a cost driver or a value driver. Competitive advantage comes from doing one or more of these activities better or differently than competitors.",
        example:
          "Amazon's advantage isn't one thing — it's the entire chain: logistics (fast), operations (efficient), service (easy returns), marketing (personalization). Each link strengthens the next.",
      },
    ],
    quotes: [
      {
        text: "Strategy is about choosing what not to do.",
        context: "What is Strategy?, HBR 1996",
      },
      {
        text: "The essence of strategy is choosing what not to do.",
        context: "Competitive Strategy, 1980",
      },
      {
        text: "Competitive advantage is not what you do well. It is what you do differently.",
        context: "Competitive Advantage, 1985",
      },
    ],
    books: [
      "Competitive Strategy (1980)",
      "Competitive Advantage (1985)",
      "What is Strategy? (HBR, 1996)",
    ],
    embodiedIn:
      "The Competitors module (map your strategic position). The Positioning Statements (which strategy are you?). The Budget module (resource allocation = strategy). The Generic Strategies formula in the Old School.",
    principles: [
      {
        name: "Pick one strategy",
        description: "Cost, differentiation, or focus. Not all three.",
        howToApply:
          "In Competitors, map yourself on Porter's three strategies. If you score below 7 on all three, you're stuck in the middle — pick one.",
      },
    ],
  },
  {
    id: "al-ries-jack-trout",
    name: "Al Ries & Jack Trout",
    era: "1970s — 2000s",
    title: "The Positioning Pioneers",
    avatar: "🎯",
    color: "#9a3412",
    philosophy:
      "Positioning is not what you do to a product. It is what you do to the mind of the prospect. In an overcommunicated society, the simplest way to get into someone's mind is to be FIRST. If you can't be first in a category, create a new category you can be first in. The basic approach of positioning is not to create something new and different, but to manipulate what is already in the mind.",
    coreTeachings: [
      {
        id: "rt1",
        title: "Be First",
        body: "The first brand in the mind wins. Not the first product — the first brand in the mind. Kleenex, Xerox, Q-tips — they won because they were first in the mind, not because they were first to market. If you're not first, find a category where you can be.",
        example:
          "Avis was #2 in car rental. They positioned as 'We try harder' — and owned the #2 position so well that Hertz couldn't touch them.",
      },
      {
        id: "rt2",
        title: "Own a Word",
        body: "The most powerful positioning owns a single word in the customer's mind. Volvo = safety. BMW = driving. FedEx = overnight. Nordstrom = service. If you can't name the word you own, you don't have a position.",
        example:
          "When you say 'safety' and 'car' in the same sentence, Volvo appears. That word is worth more than any ad campaign.",
      },
    ],
    quotes: [
      {
        text: "Positioning is not what you do to a product. It is what you do to the mind of the prospect.",
        context: "Positioning: The Battle for Your Mind, 1981",
      },
      {
        text: "The basic approach of positioning is not to create something new, but to manipulate what is already in the mind.",
        context: "Positioning, 1981",
      },
      {
        text: "History shows that the first brand into the brain wins.",
        context: "Positioning, 1981",
      },
    ],
    books: [
      "Positioning: The Battle for Your Mind (1981)",
      "Marketing Warfare (1986)",
      "The 22 Immutable Laws of Marketing (1993)",
    ],
    embodiedIn:
      "The Positioning Statements module (one-word positioning field). The Brand Kit (owning a word). The Competitors module (mapping mind-share). The Ries & Trout formula in the Old School.",
    principles: [
      {
        name: "Own a word",
        description: "Find the one word you can own in the customer's mind.",
        howToApply:
          "In Positioning Statements, fill the 'one_word_positioning' field. If you can't answer in one word, you don't have a position yet.",
      },
    ],
  },
  {
    id: "leo-burnett",
    name: "Leo Burnett",
    era: "1930s — 1970s",
    title: "The Man Who Gave Brands a Soul",
    avatar: "🌽",
    color: "#15803d",
    philosophy:
      "Make it simple. Make it memorable. Make it tempting to want. The greatest thing in advertising is to be believed. If you make yourself believable, you have it made. Reach for the stars, not the ceiling. Share of mind comes before share of market. Create symbols that live in people's hearts — the Jolly Green Giant, Tony the Tiger, the Marlboro Man — because symbols carry feelings that words alone can't.",
    coreTeachings: [
      {
        id: "bur1",
        title: "Shared Moments",
        body: "The best advertising creates a shared moment between brand and consumer — a moment of recognition, warmth, or humor. The brand isn't talking AT the consumer; it's talking WITH them. This is why Burnett created characters, not slogans. Characters can share moments. Slogans can't.",
        example:
          "Tony the Tiger doesn't say 'Kellogg's is nutritious.' He says 'They're grrrreat!' — and children hear a friend, not a corporation.",
      },
      {
        id: "bur2",
        title: "Reach for the Stars",
        body: "Don't aim for the ceiling — aim for the stars. The ceiling is what's been done. The stars are what hasn't. The Marlboro Man was a star: a tattooed cowboy selling filter cigarettes to men who didn't want to smoke 'women's cigarettes.' It was absurd. It worked because it was bigger than the category.",
        example:
          "The Jolly Green Giant made canned vegetables feel magical. He sold peas by selling a fairy tale.",
      },
    ],
    quotes: [
      {
        text: "Make it simple. Make it memorable. Make it tempting to want.",
        context: "Leo Burnett Company, 1960s",
      },
      {
        text: "The greatest thing in advertising is to be believed.",
        context: "Leo Burnett, 1950s",
      },
      { text: "Reach for the stars, not the ceiling.", context: "Leo Burnett, 1960s" },
      { text: "Share of mind comes before share of market.", context: "Leo Burnett, 1960s" },
    ],
    books: ["The Leo Burnett Company Archive (Chicago)"],
    embodiedIn:
      "The Brand Kit (visual identity, brand characters). The Testimonials module (shared moments). The Share of Mind formula in the Old School. The Copy Generator's 'memorable' principle.",
    principles: [
      {
        name: "Simple, memorable, tempting",
        description: "Three tests for every piece of marketing.",
        howToApply:
          "Before publishing any campaign, run it through Burnett's test: Is it simple? Is it memorable? Is it tempting to want? If any answer is no, it's not done.",
      },
    ],
  },
  {
    id: "peter-drucker",
    name: "Peter Drucker",
    era: "1940s — 2000s",
    title: "The Father of Management",
    avatar: "👔",
    color: "#374151",
    philosophy:
      "There are only two basic functions of a business: marketing and innovation. Everything else is a cost. The aim of marketing is to know and understand the customer so well the product fits and sells itself. Management is not about control — it's about enabling people to perform. What gets measured gets managed. The best way to predict the future is to create it.",
    coreTeachings: [
      {
        id: "dru1",
        title: "Two Functions Only",
        body: "Marketing and innovation produce results. Everything else — accounting, legal, HR, operations — is a cost. This doesn't mean other functions don't matter. It means they don't produce REVENUE. Only creating something people want (innovation) and communicating it so they buy (marketing) produce revenue. Every CEO should ask daily: what did we innovate and what did we market today?",
        example:
          "Apple's entire organization is structured around these two functions: product teams (innovation) and marketing teams (marketing). Everything else supports them.",
      },
      {
        id: "dru2",
        title: "Know the Customer",
        body: "The aim of marketing is to make selling superfluous. If you understand the customer so well that the product fits their needs perfectly, you don't need to sell — they just buy. This is the highest state of marketing: the product sells itself because it IS what the customer was already looking for.",
        example:
          "Google didn't need to sell search. The product fit the need so perfectly that people just used it. Marketing was superfluous.",
      },
    ],
    quotes: [
      {
        text: "The aim of marketing is to know and understand the customer so well the product fits and sells itself.",
        context: "The Practice of Management, 1954",
      },
      {
        text: "There are only two basic functions: marketing and innovation. Everything else is a cost.",
        context: "Management: Tasks, Responsibilities, Practices, 1973",
      },
      { text: "What gets measured gets managed.", context: "The Effective Executive, 1967" },
      {
        text: "The best way to predict the future is to create it.",
        context: "Managing in a Time of Great Change, 1995",
      },
      { text: "Culture eats strategy for breakfast.", context: "attributed, 2006" },
    ],
    books: [
      "The Practice of Management (1954)",
      "The Effective Executive (1967)",
      "Management: Tasks, Responsibilities, Practices (1973)",
    ],
    embodiedIn:
      "The Patrick Number (Drucker's 'what gets measured gets managed'). The entire Hub (marketing as a continuing process of learning). The dashboard (Drucker's two functions: revenue + innovation). The Drucker Ratio formula in the Old School.",
    principles: [
      {
        name: "Measure everything",
        description: "What gets measured gets managed.",
        howToApply:
          "The Patrick Number is your daily Drucker measurement. If you don't check it daily, you're not managing marketing — you're hoping.",
      },
      {
        name: "Make selling superfluous",
        description: "Know the customer so well the product sells itself.",
        howToApply:
          "Use Personas and Intelligence to know the customer deeply. The better the fit, the less selling you need.",
      },
    ],
  },
  {
    id: "john-caples",
    name: "John Caples",
    era: "1920s — 1970s",
    title: "The Headline Master",
    avatar: "📰",
    color: "#7c2d12",
    philosophy:
      "Good advertising is written from knowledge. The three most powerful headline classes are self-interest, news, and curiosity. If your headline doesn't promise a benefit, deliver news, or create irresistible curiosity, rewrite it. 'They Laughed When I Sat Down at the Piano But When I Started to Play!' — that headline sold piano lessons for 40 years. Not because it was clever — because it had all three: self-interest (play piano), news (surprise reaction), curiosity (what happened?).",
    coreTeachings: [
      {
        id: "cap1",
        title: "Three Headline Classes",
        body: "1. Self-interest: 'How to Win Friends and Influence People.' 2. News: 'A New Discovery in Skin Care.' 3. Curiosity: 'They Laughed When I Sat Down at the Piano.' The best headlines combine two or all three. 90+ years of testing has never dethroned these three.",
        example:
          "Caples' famous piano ad combined all three: self-interest (learn piano), news (social transformation), curiosity (what happened when he played?).",
      },
      {
        id: "cap2",
        title: "Write from Knowledge",
        body: "Don't write from imagination. Write from research. Know the product, know the customer, know the competitor. Then the headline writes itself. 'Whiter wash' is imagination. 'Whiter wash because of oxygen bubbles' is knowledge. Knowledge sells. Imagination doesn't.",
        example:
          "Caples spent weeks studying a product before writing a single headline. The headline was the last thing he wrote — after he knew everything.",
      },
    ],
    quotes: [
      {
        text: "Good advertising is written from knowledge.",
        context: "Tested Advertising Methods, 1932",
      },
      {
        text: "The most important words in your ad are the headline.",
        context: "Tested Advertising Methods, 1932",
      },
    ],
    books: ["Tested Advertising Methods (1932)", "How to Make Your Advertising Make Money (1975)"],
    embodiedIn:
      "The Copy Generator (Caples' three headline classes). The A/B testing in Experiments (test headlines). The Caples Headline Formula in the Old School. The Campaign Briefs (knowledge-first copy).",
    principles: [
      {
        name: "Promise, news, or curiosity",
        description: "Every headline must be one of these three — or a combination.",
        howToApply:
          "In the Copy Generator, try all three frameworks. Self-interest (benefit), news (novelty), curiosity (gap). The winner is usually a combination.",
      },
    ],
  },
  {
    id: "w-edwards-deming",
    name: "W. Edwards Deming",
    era: "1930s — 1990s",
    title: "The Quality Prophet",
    avatar: "📊",
    color: "#1e293b",
    philosophy:
      "In God we trust; all others must bring data. The PDCA cycle — Plan, Do, Check, Act — is the engine of all improvement. You can't manage what you can't measure. You can't improve what you can't manage. 85% of quality problems are system problems, not people problems. Fix the system, not the person. Constant testing, constant measurement, constant improvement.",
    coreTeachings: [
      {
        id: "dem1",
        title: "PDCA — Plan, Do, Check, Act",
        body: "Every marketing activity is an experiment. Plan the hypothesis. Do the test. Check the result. Act on what you learned. Then repeat. The teams that run PDCA fastest grow fastest. High-tempo testing isn't a tactic — it's Deming's 70-year-old cycle applied to digital.",
        example:
          "Deming gave PDCA to Toyota and Japanese industry in the 1950s. It made them the quality leaders of the world. The same cycle, applied to marketing, makes high-tempo testing teams grow 2-3x faster.",
      },
      {
        id: "dem2",
        title: "Fix the System, Not the Person",
        body: "85% of problems are in the system, not the person. If a salesperson fails, don't fire them — fix the sales process. If a campaign fails, don't blame the copywriter — fix the brief, the offer, or the targeting. The system produces the result. Change the system to change the result.",
        example:
          "When your CAC is too high, don't blame the ads manager. Examine the system: offer strength, landing page conversion, targeting precision. Fix the system, and the ads manager suddenly looks brilliant.",
      },
    ],
    quotes: [
      { text: "In God we trust; all others must bring data.", context: "attributed, 1950s" },
      { text: "You can't manage what you can't measure.", context: "Out of the Crisis, 1982" },
      {
        text: "85% of quality problems are system problems, not people problems.",
        context: "Out of the Crisis, 1982",
      },
    ],
    books: ["Out of the Crisis (1982)", "The New Economics (1993)"],
    embodiedIn:
      "The Experiments module (PDCA made digital). The Attribution module (data, not guessing). The Patrick Number (daily measurement). The Deming PDCA formula in the Old School.",
    principles: [
      {
        name: "Test, measure, improve",
        description: "Every marketing activity is an experiment. Measure it. Improve it.",
        howToApply:
          "Use Experiments for every major change. Never launch without a test variant. Kill losers in 7 days, scale winners.",
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// WISDOM QUOTES (for ribbon rotation)
// ═══════════════════════════════════════════════════════════════════════════

export const WISDOM_QUOTES: WisdomQuote[] = [
  // Seth Godin
  {
    text: "Marketing is the generous act of helping someone become who they want to be.",
    author: "Seth Godin",
    context: "This is Marketing",
    category: "soul",
  },
  {
    text: "If it doesn't spread, it's not marketing. It's a memo.",
    author: "Seth Godin",
    category: "attention",
  },
  {
    text: "People do not buy goods and services. They buy relations, stories, and magic.",
    author: "Seth Godin",
    category: "desire",
  },
  {
    text: "Find the smallest viable audience. Lead them first. The rest follows.",
    author: "Seth Godin",
    category: "empathy",
  },
  {
    text: "The cost of being wrong is less than the cost of doing nothing.",
    author: "Seth Godin",
    category: "action",
  },
  {
    text: "Don't find customers for your products, find products for your customers.",
    author: "Seth Godin",
    category: "empathy",
  },
  { text: "The best marketing is invisible.", author: "Seth Godin", category: "craft" },
  {
    text: "Ship often. Ship lousy work. Then ship better.",
    author: "Seth Godin",
    category: "action",
  },
  // David Ogilvy
  {
    text: "The customer is not a moron, she is your wife.",
    author: "David Ogilvy",
    context: "Confessions of an Advertising Man",
    category: "empathy",
  },
  { text: "Big ideas come from big research.", author: "David Ogilvy", category: "craft" },
  {
    text: "The headline is 80 cents of your dollar.",
    author: "David Ogilvy",
    category: "attention",
  },
  {
    text: "Never write an advertisement which you wouldn't want your family to read.",
    author: "David Ogilvy",
    category: "trust",
  },
  // Gary Vaynerchuk
  {
    text: "Attention is the currency of the internet.",
    author: "Gary Vaynerchuk",
    category: "attention",
  },
  { text: "Document, don't create.", author: "Gary Vaynerchuk", category: "action" },
  { text: "Jab, jab, jab, right hook.", author: "Gary Vaynerchuk", category: "action" },
  { text: "Your legacy is how you made people feel.", author: "Gary Vaynerchuk", category: "soul" },
  { text: "Content is king, but context is God.", author: "Gary Vaynerchuk", category: "craft" },
  // Eugene Schwartz
  {
    text: "You cannot create desire. You can only channel it.",
    author: "Eugene Schwartz",
    context: "Breakthrough Advertising",
    category: "desire",
  },
  { text: "Copy is not written. Copy is assembled.", author: "Eugene Schwartz", category: "craft" },
  // Claude Hopkins
  {
    text: "Advertising is salesmanship in print.",
    author: "Claude Hopkins",
    context: "Scientific Advertising",
    category: "craft",
  },
  {
    text: "Almost any question can be answered cheaply, quickly and finally by a test.",
    author: "Claude Hopkins",
    category: "action",
  },
  // Alex Hormozi
  {
    text: "Make an offer so good people feel stupid saying no.",
    author: "Alex Hormozi",
    category: "desire",
  },
  {
    text: "You don't need better ads. You need better offers.",
    author: "Alex Hormozi",
    category: "desire",
  },
  { text: "Create more value than you capture.", author: "Alex Hormozi", category: "soul" },
  // Robert Cialdini
  {
    text: "People prefer to say yes to those they know and like.",
    author: "Robert Cialdini",
    category: "trust",
  },
  { text: "The idea is to give first, then ask.", author: "Robert Cialdini", category: "action" },
  // Donald Miller
  {
    text: "Your customer is the hero, not your brand.",
    author: "Donald Miller",
    category: "empathy",
  },
  { text: "If you confuse, you lose.", author: "Donald Miller", category: "craft" },
  {
    text: "Customers don't want your product. They want the transformation.",
    author: "Donald Miller",
    category: "desire",
  },
  // Joseph Sugarman
  {
    text: "The purpose of the headline is to get you to read the first sentence.",
    author: "Joseph Sugarman",
    category: "attention",
  },
  // Gary Halbert
  {
    text: "Find a starving crowd.",
    author: "Gary Halbert",
    context: "The Boron Letters",
    category: "empathy",
  },
  { text: "People don't read ads. They read stories.", author: "Gary Halbert", category: "craft" },
  // Rory Sutherland
  {
    text: "The opposite of a good idea can also be a good idea.",
    author: "Rory Sutherland",
    category: "craft",
  },
  {
    text: "Marketing is not about lying. It's about finding the psychological truth.",
    author: "Rory Sutherland",
    category: "soul",
  },
  // Sabri Suby
  {
    text: "Attention is the most valuable asset on earth.",
    author: "Sabri Suby",
    category: "attention",
  },
  // Timeless
  {
    text: "Know thy customer as thyself.",
    author: "Ancient Marketing Wisdom",
    category: "empathy",
  },
  {
    text: "The aim of marketing is to know and understand the customer so well the product fits and sells itself.",
    author: "Peter Drucker",
    category: "soul",
  },
  {
    text: "Make it simple. Make it memorable. Make it tempting to want.",
    author: "Leo Burnett",
    category: "craft",
  },
  { text: "Good advertising is written from knowledge.", author: "John Caples", category: "craft" },
  // Dan Kennedy
  { text: "The money is in the list.", author: "Dan Kennedy", category: "trust" },
  {
    text: "If you can not track the ROI, do not spend the money.",
    author: "Dan Kennedy",
    category: "action",
  },
  // Russell Brunson
  {
    text: "Hook, story, offer -- that is all marketing is.",
    author: "Russell Brunson",
    category: "craft",
  },
  {
    text: "Your frontend pays for acquisition. Your backend creates wealth.",
    author: "Russell Brunson",
    category: "desire",
  },
  {
    text: "Publish daily for a year and you will have a business.",
    author: "Russell Brunson",
    category: "action",
  },
  // Joanna Wiebe
  {
    text: "Your customers already wrote your copy. You just need to listen.",
    author: "Joanna Wiebe",
    category: "empathy",
  },
  {
    text: "The best copy sounds like the customer talking to themselves.",
    author: "Joanna Wiebe",
    category: "craft",
  },
  // Ryan Deiss
  {
    text: "The customer journey is not a funnel. It is a cycle.",
    author: "Ryan Deiss",
    category: "growth",
  },
  {
    text: "Turn customers into promoters. That is when growth compounds.",
    author: "Ryan Deiss",
    category: "growth",
  },
  // Frank Kern
  { text: "When people feel understood, they buy.", author: "Frank Kern", category: "empathy" },
  { text: "Show them the result in advance.", author: "Frank Kern", category: "desire" },
  // Perry Marshall
  {
    text: "80% of your results come from 20% of your efforts. Find the 20% and multiply it.",
    author: "Perry Marshall",
    category: "action",
  },
  // Dean Jackson
  {
    text: "Before you try to get more leads, make sure you are not losing the ones you already have.",
    author: "Dean Jackson",
    category: "trust",
  },
  // Philip Kotler — The Father of Modern Marketing
  {
    text: "Marketing is not the art of finding clever ways to dispose of what you make. It is the art of creating genuine customer value.",
    author: "Philip Kotler",
    context: "Marketing Management",
    category: "soul",
  },
  {
    text: "Marketing takes a day to learn and a lifetime to master.",
    author: "Philip Kotler",
    category: "craft",
  },
  {
    text: "Good marketing is no accident, but a result of careful planning and execution.",
    author: "Philip Kotler",
    category: "craft",
  },
  {
    text: "The best advertising is done by satisfied customers.",
    author: "Philip Kotler",
    category: "trust",
  },
  {
    text: "It is no longer enough to satisfy customers. You must delight them.",
    author: "Philip Kotler",
    context: "Marketing 3.0",
    category: "desire",
  },
  {
    text: "The future of marketing is not about technology. It is about being more human.",
    author: "Philip Kotler",
    context: "Marketing 5.0",
    category: "soul",
  },
  // Theodore Levitt
  {
    text: "People don't want to buy a quarter-inch drill. They want a quarter-inch hole.",
    author: "Theodore Levitt",
    context: "Marketing Myopia, HBR 1960",
    category: "empathy",
  },
  {
    text: "An industry is a customer-satisfying process, not a goods-producing process.",
    author: "Theodore Levitt",
    context: "Marketing Myopia",
    category: "soul",
  },
  // Michael Porter
  {
    text: "Strategy is about choosing what not to do.",
    author: "Michael Porter",
    context: "What is Strategy?",
    category: "craft",
  },
  {
    text: "Competitive advantage is not what you do well. It is what you do differently.",
    author: "Michael Porter",
    category: "growth",
  },
  // Al Ries & Jack Trout
  {
    text: "Positioning is not what you do to a product. It is what you do to the mind of the prospect.",
    author: "Al Ries & Jack Trout",
    context: "Positioning, 1981",
    category: "attention",
  },
  {
    text: "History shows that the first brand into the brain wins.",
    author: "Al Ries & Jack Trout",
    context: "Positioning",
    category: "attention",
  },
  // Leo Burnett
  {
    text: "Make it simple. Make it memorable. Make it tempting to want.",
    author: "Leo Burnett",
    category: "craft",
  },
  {
    text: "The greatest thing in advertising is to be believed.",
    author: "Leo Burnett",
    category: "trust",
  },
  {
    text: "Share of mind comes before share of market.",
    author: "Leo Burnett",
    category: "attention",
  },
  // Peter Drucker
  {
    text: "What gets measured gets managed.",
    author: "Peter Drucker",
    context: "The Effective Executive",
    category: "action",
  },
  {
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker",
    category: "growth",
  },
  { text: "Culture eats strategy for breakfast.", author: "Peter Drucker", category: "soul" },
  // John Caples
  {
    text: "Good advertising is written from knowledge.",
    author: "John Caples",
    context: "Tested Advertising Methods, 1932",
    category: "craft",
  },
  // W. Edwards Deming
  {
    text: "In God we trust; all others must bring data.",
    author: "W. Edwards Deming",
    category: "action",
  },
  {
    text: "You can not manage what you can not measure.",
    author: "W. Edwards Deming",
    context: "Out of the Crisis",
    category: "action",
  },
  // Neil Borden
  {
    text: "The marketer is a mixer of ingredients.",
    author: "Neil Borden",
    context: "AMA Presidential Address, 1953",
    category: "craft",
  },
];
