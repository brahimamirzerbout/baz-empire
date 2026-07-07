/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE SECRET STASH — The Marketing Hub's Hidden Arsenal
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * A curated collection of frameworks, templates, scripts, swipe files,
 * and battle-tested systems from the greatest marketing minds alive.
 * This is the secret weapon — the database that powers the Strategist.
 *
 * Every entry is attributable to a master, practical, and ready to deploy.
 */

export type StashCategory =
  | "framework"
  | "copy"
  | "offer"
  | "funnel"
  | "email"
  | "script"
  | "checklist"
  | "swipe"
  | "psychology"
  | "pricing"
  | "positioning"
  | "growth"
  | "research"
  | "sop";

export type StashType =
  | "framework"
  | "template"
  | "script"
  | "sequence"
  | "formula"
  | "checklist"
  | "swipe-file"
  | "playbook"
  | "calculator";

export interface StashItem {
  id: string;
  title: string;
  category: StashCategory;
  type: StashType;
  author: string; // which master this comes from
  body: string; // the meat — how it works
  template?: string; // copy-paste-ready template
  tags: string[];
}

export const STASH: StashItem[] = [
  // ═══ FRAMEWORKS ═══════════════════════════════════════════════════════════
  {
    id: "fw-aida",
    title: "AIDA — Attention, Interest, Desire, Action",
    category: "framework",
    type: "framework",
    author: "E. St. Elmo Lewis",
    body: "The original conversion funnel. Every piece of marketing copy moves the reader through four stages: grab attention, build interest, create desire, drive action. Still the spine of every landing page, email, and ad 126 years later.",
    template:
      "[ATTENTION]: A headline that stops the scroll — a question, a claim, or a surprise.\n[INTEREST]: The first 2 sentences that prove this is worth reading. Specific, relevant, useful.\n[DESIRE]: The body that builds want. Benefits, proof, story, social evidence.\n[ACTION]: One clear CTA. One thing to do next. Make it obvious and frictionless.",
    tags: ["copy", "funnel", "conversion", "classic"],
  },
  {
    id: "fw-pas",
    title: "PAS — Problem, Agitate, Solution",
    category: "framework",
    type: "framework",
    author: "Dan Kennedy",
    body: "The most reliable copy framework for direct response. Name the problem, twist the knife (agitate), then present your solution. Works because people are more motivated to avoid pain than to pursue pleasure.",
    template:
      "[PROBLEM]: Name the exact pain your prospect is feeling right now. Be specific.\n[AGITATE]: Make it worse. What happens if they don't fix it? What does it cost them daily? How does it feel?\n[SOLUTION]: Enter your product as the obvious answer. Not just a solution — THE solution. With proof.",
    tags: ["copy", "direct-response", "pain-points"],
  },
  {
    id: "fw-storybrand",
    title: "StoryBrand 7-Part Framework",
    category: "framework",
    type: "framework",
    author: "Donald Miller",
    body: "Position your customer as the hero and your brand as the guide. Every landing page, email, and ad should follow: Character → Problem → Guide → Plan → CTA → Avoid Failure → Achieve Success.",
    template:
      "1. CHARACTER: Who is the hero? (Your customer, not you)\n2. PROBLEM: What villain are they fighting? (External, internal, philosophical)\n3. GUIDE: You understand. You've been there. Here's your authority.\n4. PLAN: 3 simple steps to win.\n5. CTA: One clear, direct ask.\n6. AVOID FAILURE: What happens if they do nothing?\n7. ACHIEVE SUCCESS: What does their life look like after?",
    tags: ["brand", "storytelling", "positioning", "landing-page"],
  },
  {
    id: "fw-hook-story-offer",
    title: "Hook, Story, Offer",
    category: "framework",
    type: "framework",
    author: "Russell Brunson",
    body: "The only three things that matter in marketing. The Hook grabs attention in 2.7 seconds. The Story builds desire and trust through narrative. The Offer closes the sale with an irresistible package. Get all three right and you can sell anything.",
    template:
      "HOOK: Pattern interrupt. Something unexpected, curious, or provocative.\n  - 'How a deaf wrestler built a $100M software company'\n  - 'The 3-word email that generated $47,000 in 24 hours'\n  - 'Why everything you know about [topic] is wrong'\n\nSTORY: The journey. The struggle. The discovery. The transformation.\n  - Where were you? What went wrong? What did you try? What finally worked?\n  - Make them feel it. Details, not abstractions.\n\nOFFER: The package. Not just the product — the whole stack.\n  - Core product + bonuses + guarantee + urgency + price\n  - Make it so good they feel stupid saying no.",
    tags: ["funnel", "conversion", "copy", "offers"],
  },
  {
    id: "fw-value-ladder",
    title: "The Value Ladder",
    category: "framework",
    type: "framework",
    author: "Russell Brunson",
    body: "Map your entire business as a ladder of ascending offers. Each rung delivers more value and costs more. The bottom rungs acquire customers. The top rungs create wealth. Most businesses sell one rung and leave 80% of revenue on the table.",
    template:
      "RUNG 1 — FREE (Lead Magnet): A checklist, template, or guide. Goal: capture email.\nRUNG 2 — LOW ($7-$47): A tripwire or book. Goal: convert to buyer, cover ad costs.\nRUNG 3 — MID ($97-$497): Core product or course. Goal: deliver the main transformation.\nRUNG 4 — HIGH ($1,000-$10,000): Coaching, mastermind, or done-for-you. Goal: create profit.\nRUNG 5 — CONTINUITY ($97-$997/mo): Membership or retainer. Goal: recurring revenue.",
    tags: ["funnel", "pricing", "offers", "business-model"],
  },
  {
    id: "fw-cvj",
    title: "Customer Value Journey (8 Phases)",
    category: "framework",
    type: "framework",
    author: "Ryan Deiss",
    body: "Every customer goes through 8 phases: Aware → Engage → Subscribe → Convert → Excite → Ascend → Advocate → Promote. Optimize each independently. The journey is not a funnel — it's a cycle. The goal is to turn customers into promoters.",
    template:
      "1. AWARE: They discover you (SEO, ads, social, referral)\n2. ENGAGE: They interact (content, social proof, about page)\n3. SUBSCRIBE: They give email (lead magnet, newsletter)\n4. CONVERT: First purchase (tripwire, low-ticket offer)\n5. EXCITE: They experience value (onboarding, quick win)\n6. ASCEND: They buy more (upsell, cross-sell, premium)\n7. ADVOCATE: They recommend (NPS, testimonial, review)\n8. PROMOTE: They sell for you (referral, affiliate, case study)",
    tags: ["funnel", "lifecycle", "retention", "growth"],
  },
  {
    id: "fw-awareness-levels",
    title: "5 Levels of Awareness",
    category: "framework",
    type: "framework",
    author: "Eugene Schwartz",
    body: "Your copy changes completely depending on which awareness level your prospect is at. Matching copy to awareness level is the single highest-leverage copywriting skill.",
    template:
      "LEVEL 1 — UNAWARE: They don't know they have a problem.\n  Copy: 'Do you have trouble sleeping?' (Name the problem)\n\nLEVEL 2 — PROBLEM AWARE: They know the problem, not the solution.\n  Copy: 'How to eliminate insomnia in 7 nights' (Promise the solution)\n\nLEVEL 3 — SOLUTION AWARE: They know solutions exist, not yours.\n  Copy: 'Why natural sleep aids work when melatonin fails' (Differentiate)\n\nLEVEL 4 — PRODUCT AWARE: They know your product, haven't bought.\n  Copy: 'Why our mattress is 40% cooler than memory foam' (Prove superiority)\n\nLEVEL 5 — MOST AWARE: They know and have bought before.\n  Copy: 'New colors. 20% off. Friday only.' (Direct offer)",
    tags: ["copy", "awareness", "schwartz", "targeting"],
  },
  {
    id: "fw-slippery-slope",
    title: "The Slippery Slope",
    category: "framework",
    type: "framework",
    author: "Joseph Sugarman",
    body: "Every sentence must make the reader want to read the next. The headline sells the first sentence. The first sentence sells the second. By the time they reach the price, they're already sold.",
    template:
      "HEADLINE → gets them to read sentence 1\nSENTENCE 1 → gets them to read sentence 2\n  Example: 'When I put on these glasses, I couldn't believe my eyes.'\nSENTENCE 2 → gets them to read sentence 3\n  Example: 'Everything I saw was sharper, clearer, more vivid than I'd ever seen.'\n... continue the slide ...\nPRICE → they're already sold, the price is just logistics",
    tags: ["copy", "direct-response", "sugarman"],
  },
  {
    id: "fw-6-principles",
    title: "Cialdini's 6 Principles of Influence",
    category: "framework",
    type: "framework",
    author: "Robert Cialdini",
    body: "Six universal psychological principles that drive compliance. Use ethically.",
    template:
      "1. RECIPROCITY: Give first. The gift creates obligation.\n   Apply: Free lead magnet, free audit, free sample.\n\n2. COMMITMENT/CONSISTENCY: Small yes → big yes.\n   Apply: Micro-commitment (free trial) → paid commitment.\n\n3. SOCIAL PROOF: People follow the crowd.\n   Apply: Testimonials, user counts, '247 people viewing.'\n\n4. AUTHORITY: People follow experts.\n   Apply: Credentials, awards, media features, data.\n\n5. LIKING: People buy from people they like.\n   Apply: Personality, shared values, authentic storytelling.\n\n6. SCARCITY: People want what they can't have.\n   Apply: Limited seats, deadline, exclusive access. Must be genuine.",
    tags: ["psychology", "influence", "conversion", "cialdini"],
  },

  // ═══ COPY TEMPLATES ══════════════════════════════════════════════════════
  {
    id: "cp-headlines-ogilvy",
    title: "Ogilvy's 10 Headline Formulas",
    category: "copy",
    type: "swipe-file",
    author: "David Ogilvy",
    body: "The headline is 80 cents of your dollar. If it doesn't work, the body copy is wasted. These 10 formulas have generated billions in sales.",
    template:
      "1. How to [do something] without [common pain]\n2. The [adjective] way to [result] in [timeframe]\n3. [Number] ways to [benefit] — and the one that works best\n4. What [authority] knows about [topic] that you don't\n5. How to [result] even if [common objection]\n6. The truth about [topic] that [authority] doesn't want you to know\n7. [Number] mistakes that are costing you [pain] — and how to fix them\n8. Why [common belief] is wrong (and what to do instead)\n9. How I [achieved result] in [timeframe] — and how you can too\n10. At last: [the thing they've been waiting for]",
    tags: ["headlines", "ogilvy", "copy", "swipe"],
  },
  {
    id: "cp-headlines-halbert",
    title: "Halbert's Magnetic Headline Formulas",
    category: "copy",
    type: "swipe-file",
    author: "Gary Halbert",
    body: "Gary Halbert's headlines made millions because they were impossible to not read. The secret: curiosity + specificity + promise.",
    template:
      "1. The [type of person] who [does something unusual]\n2. How to [do something] in [specific timeframe] — even if [objection]\n3. Confessions of a [role/title]\n4. The [number]-[unit] [method] that [result]\n5. What everybody ought to know about [topic]\n6. The lazy [person]'s way to [result]\n7. How to [result] without [expected cost/effort]\n8. A [timeframe] plan for [result]\n9. The secret of [desirable thing]\n10. To the [person] who wants [result] but [can't because...]",
    tags: ["headlines", "halbert", "copy", "swipe", "direct-response"],
  },
  {
    id: "cp-subject-lines",
    title: "Email Subject Lines That Get Opened",
    category: "copy",
    type: "swipe-file",
    author: "Joanna Wiebe",
    body: "The subject line determines if your email gets read. These patterns consistently outperform. Use voice-of-customer language. Be specific. Be human.",
    template:
      "CURIOSITY: 'the thing I almost didn't send you'\nSPECIFIC: 'your [specific metric] is [specific number]'\nQUESTION: 'is [problem] still happening?'\nSTORY: 'how [person] went from [pain] to [result]'\nURGENCY: 'last chance: [specific thing] closes [time]'\nPERSONAL: '[first name], I noticed something'\nBLUNT: 'this is embarrassing but...'\nVALUE: '[number] [things] for [audience]'\nPATTERN INTERRUPT: 'forget what I said about [topic]'\nFOMO: 'you missed this (and it cost you [specific thing])'",
    tags: ["email", "subject-lines", "wiebe", "swipe"],
  },
  {
    id: "cp-vsl-structure",
    title: "Video Sales Letter Structure (Sugarman + Brunson)",
    category: "copy",
    type: "template",
    author: "Joseph Sugarman / Russell Brunson",
    body: "The structure that has generated over $1B in online sales. Every section has a job. Skip one and conversion drops.",
    template:
      "1. HOOK (0-15s): Pattern interrupt. Promise the outcome.\n2. INTRODUCTION (15-60s): Who am I? Why listen to me?\n3. THE PROBLEM (60-3min): Name the pain. Agitate it.\n4. THE STORY (3-7min): How I discovered the solution.\n5. THE MECHANISM (7-12min): Why this works when nothing else has.\n6. THE OFFER (12-15min): What you get. The full stack.\n7. THE PROOF (15-18min): Testimonials, case studies, data.\n8. THE GUARANTEE (18-20min): Risk reversal.\n9. THE URGENCY (20-22min): Why now. Scarcity. Deadline.\n10. THE CTA (22-25min): Exact steps to buy. One button.",
    tags: ["vsl", "video", "sales-letter", "funnel", "copy"],
  },

  // ═══ OFFERS ══════════════════════════════════════════════════════════════
  {
    id: "of-grand-slam",
    title: "The Grand Slam Offer (Hormozi)",
    category: "offer",
    type: "playbook",
    author: "Alex Hormozi",
    body: "An offer so good people feel stupid saying no. Combine: dream outcome + believable mechanism + risk reversal + value stack. Price becomes irrelevant when perceived value is 10x.",
    template:
      "STEP 1 — DREAM OUTCOME: What is the specific transformation?\n  'We help [who] achieve [what] in [timeframe] via [mechanism].'\n\nSTEP 2 — MECHANISM: Why it works when nothing else has.\n  Your unique process. The thing only you do.\n\nSTEP 3 — RISK REVERSAL: Flip the risk to you.\n  'If we don't [result] in [timeframe], you don't pay + we give you $100.'\n\nSTEP 4 — VALUE STACK: List everything they get.\n  Core product ($X value)\n  + Bonus 1 ($X value)\n  + Bonus 2 ($X value)\n  + Support ($X value)\n  + Guarantee ($X value)\n  Total value: $XXXX\n  Your price: $YY\n\nSTEP 5 — URGENCY: Why act now?\n  Limited capacity, time-bound bonus, cohort closing date.",
    tags: ["offers", "hormozi", "pricing", "conversion"],
  },
  {
    id: "of-value-equation",
    title: "The Value Equation (Hormozi)",
    category: "offer",
    type: "formula",
    author: "Alex Hormozi",
    body: "Value = (Dream Outcome × Perceived Likelihood of Achievement) / (Time to Achievement × Effort & Sacrifice). Increase value by increasing the dream, increasing belief, decreasing time, decreasing effort.",
    template:
      "INCREASE THE DREAM:\n  - What's the ultimate outcome? Make it bigger.\n  - Paint the picture: what does life look like after?\n\nINCREASE BELIEF:\n  - Proof: case studies, testimonials, data\n  - Mechanism: why it works (the science/method)\n  - Guarantee: risk reversal\n\nDECREASE TIME:\n  - 'Results in 6 weeks, not 6 months'\n  - 'Setup in 24 hours'\n  - Speed bonuses for fast action\n\nDECREASE EFFORT:\n  - 'Done-for-you' vs 'done-with-you' vs 'DIY'\n  - Remove friction: fewer steps, simpler process\n  - We do the heavy lifting",
    tags: ["offers", "hormozi", "value", "pricing"],
  },

  // ═══ EMAIL SEQUENCES ══════════════════════════════════════════════════════
  {
    id: "em-welcome-5",
    title: "5-Email Welcome Sequence",
    category: "email",
    type: "sequence",
    author: "Ryan Deiss / Joanna Wiebe",
    body: "The first 5 emails after someone subscribes determine if they become a buyer or a ghost. Deliver value, build trust, then make the first offer.",
    template:
      "EMAIL 1 (Immediate): Welcome + deliver lead magnet + what to expect.\n  Subject: 'Here's your [lead magnet name]'\n  Body: Deliver. Set expectations. Tease tomorrow.\n\nEMAIL 2 (Day 1): The origin story. Build connection.\n  Subject: 'why I do what I do'\n  Body: Your story. Why you care. Who you help.\n\nEMAIL 3 (Day 3): The quick win. Prove value.\n  Subject: 'the [timeframe] trick for [result]'\n  Body: One actionable tip they can use today.\n\nEMAIL 4 (Day 5): Social proof. Build belief.\n  Subject: 'how [customer] went from [pain] to [result]'\n  Body: Case study. Before/after. 'You can do this too.'\n\nEMAIL 5 (Day 7): The first offer. Soft pitch.\n  Subject: 'I think you're ready for this'\n  Body: Recap the value. Introduce the product. Risk-free guarantee. Clear CTA.",
    tags: ["email", "welcome", "sequence", "onboarding", "nurture"],
  },
  {
    id: "em-sales-7",
    title: "7-Day Sales Sequence (Kennedy-style)",
    category: "email",
    type: "sequence",
    author: "Dan Kennedy",
    body: "A 7-day email sequence designed to close. Each email has a specific job: hook, educate, agitate, prove, offer, urgency, last chance.",
    template:
      "DAY 1 — THE HOOK: Announce the offer. Big promise.\nDAY 2 — THE STORY: Why you created this. The journey.\nDAY 3 — THE PROBLEM: What happens if they don't act. The cost of inaction.\nDAY 4 — THE PROOF: Case studies, testimonials, data.\nDAY 5 — THE OFFER: Full value stack. The deal.\nDAY 6 — THE URGENCY: Deadline approaching. Limited capacity.\nDAY 7 — LAST CHANCE: Final email. 'This closes at midnight.'",
    tags: ["email", "sales", "sequence", "kennedy", "launch"],
  },
  {
    id: "em-reengagement",
    title: "Re-Engagement Email Sequence (3 emails)",
    category: "email",
    type: "sequence",
    author: "Dean Jackson",
    body: "When a list goes cold, these 3 emails wake them up. The key: be honest, be human, and make it easy to say yes or no.",
    template:
      "EMAIL 1: 'Are you still interested in [topic]?'\n  One question. One click. Reply 'yes' or 'no'.\n\nEMAIL 2: 'I noticed you haven't been opening my emails'\n  Acknowledge it. Ask what's changed. Offer to adjust.\n\nEMAIL 3: 'Last one from me (unless you want more)'\n  The break-up email. 'I'll stop sending unless you click here.' Counterintuitively, this gets the highest response rate.",
    tags: ["email", "reengagement", "retention", "dean-jackson"],
  },

  // ═══ SCRIPTS ═════════════════════════════════════════════════════════════
  {
    id: "sc-cold-email",
    title: "Cold Email Script (4 emails)",
    category: "script",
    type: "script",
    author: "Sabri Suby / Alex Hormozi",
    body: "A 4-email outbound sequence that gets replies without being pushy. Give value first. Be specific. Make the ask small.",
    template:
      "EMAIL 1 — VALUE: Share a free resource or insight. No ask.\n  'I noticed [specific thing about their business]. I made a [resource] about this. Here it is, free.'\n\nEMAIL 2 — CASE STUDY: Show results for a similar company.\n  'We helped [similar company] achieve [specific result] in [timeframe]. I think the same approach could work for you.'\n\nEMAIL 3 — THE SOFT ASK: One question, low friction.\n  'Worth a 15-minute call to see if this makes sense for you?'\n\nEMAIL 4 — THE BREAK-UP: Permission to stop.\n  'I don't want to clutter your inbox. Should I stop reaching out, or is there a better time?'",
    tags: ["outbound", "cold-email", "sales", "acquisition"],
  },
  {
    id: "sc-discovery-call",
    title: "Discovery Call Script",
    category: "script",
    type: "script",
    author: "Claude Hopkins / Dan Kennedy",
    body: "A structured 30-minute discovery call that qualifies, builds trust, and sets up the close. Ask first, sell second.",
    template:
      "MIN 0-5 — RAPPORT: 'How did you find us? What made you reach out now?'\nMIN 5-15 — DISCOVERY: 'What's the biggest challenge? What have you tried? What happened? What's it costing you?'\nMIN 15-20 — IMPACT: 'If we could solve this, what would that mean for you? What would change?'\nMIN 20-25 — QUALIFY: 'Who else is involved in this decision? What's your timeline? What's your budget range?'\nMIN 25-30 — NEXT: 'Based on what you've shared, I think we can help. Here's what I recommend... [schedule the pitch]'",
    tags: ["sales", "discovery", "qualification", "script"],
  },
  {
    id: "sc-objection-handlers",
    title: "Top 5 Objection Handlers",
    category: "script",
    type: "script",
    author: "Alex Hormozi / Dan Kennedy",
    body: "The 5 objections that kill deals — and the exact responses that flip them. Memorize these.",
    template:
      "1. 'IT'S TOO EXPENSIVE'\n  → 'Compared to what? What's the cost of not solving this?' (Reframe: inaction is more expensive)\n\n2. 'I NEED TO THINK ABOUT IT'\n  → 'What specifically do you need to think about? Is it the price, the timing, or something else?' (Isolate the real objection)\n\n3. 'I NEED TO TALK TO MY PARTNER'\n  → 'Absolutely. What do you think they'll say? What concerns will they have?' (Pre-handle the partner objection)\n\n4. 'TIMING ISN'T RIGHT'\n  → 'When would be the right time? What needs to happen first?' (Uncover the real blocker)\n\n5. 'I'VE BEEN BURNED BEFORE'\n  → 'I understand. What happened? What would you need to see to feel confident this is different?' (Address the trust gap with proof)",
    tags: ["sales", "objections", "closing", "script"],
  },

  // ═══ PSYCHOLOGY ══════════════════════════════════════════════════════════
  {
    id: "ps-scarcity",
    title: "The Scarcity Response Function",
    category: "psychology",
    type: "formula",
    author: "Robert Cialdini / BAZ Research",
    body: "Scarcity increases conversion by 22% when genuine, but decreases it by 8% when perceived as fake. The optimal scarcity threshold is 3-5 units or 12-24 hours.",
    template:
      "GENUINE SCARCITY (works):\n  - 'Only 3 seats left at this price'\n  - 'Registration closes Friday at 5pm'\n  - 'First 10 buyers get [bonus]'\n\nFAKE SCARCITY (backfires):\n  - 'Limited time!' (vague = fake)\n  - Countdown timer that resets (detected = trust destroyed)\n  - 'Only 5 left!' when 500 are in stock\n\nOPTIMAL THRESHOLDS:\n  - Quantity: 3-5 units\n  - Time: 12-24 hours\n  - Access: Close + reopen periodically\n\nSCARCITY FATIGUE: Showing scarcity on >40% of pages reduces effectiveness by 60%. Use sparingly.",
    tags: ["psychology", "scarcity", "urgency", "conversion", "cialdini"],
  },
  {
    id: "ps-commitment",
    title: "The Foot-in-the-Door Technique",
    category: "psychology",
    type: "playbook",
    author: "Robert Cialdini",
    body: "Small commitments lead to big commitments. Get a yes to something small first, then ask for the bigger thing. The initial yes creates a consistency pressure that drives the bigger yes.",
    template:
      "STEP 1 — MICRO COMMITMENT: Free trial, free audit, free sample, quiz.\nSTEP 2 — ENGAGEMENT: Ask them to invest time (onboarding, questionnaire).\nSTEP 3 — LOW-STAKES PURCHASE: Tripwire, $7 product, shipping-only offer.\nSTEP 4 — CORE OFFER: The main product. They're already a buyer — the friction is gone.\nSTEP 5 — ASCENSION: Premium offer. They've already said yes multiple times.",
    tags: ["psychology", "commitment", "consistency", "funnel", "cialdini"],
  },

  // ═══ PRICING ═════════════════════════════════════════════════════════════
  {
    id: "pr-good-better-best",
    title: "Good-Better-Best Pricing Architecture",
    category: "pricing",
    type: "template",
    author: "Rory Sutherland / Dan Kennedy",
    body: "Three tiers with the middle pre-selected. The middle should be the most popular. The high tier makes the middle look reasonable. The low tier captures price-sensitive buyers. Never offer more than 3 — choice fatigue kills conversion.",
    template:
      "GOOD ($X): Basic features. For the self-starter.\n  - Feature 1, Feature 2, Feature 3\n  - Community support\n\nBETTER ($Y) ★ MOST POPULAR: Core features + bonuses. For the serious operator.\n  - Everything in Good, plus:\n  - Feature 4, Feature 5\n  - Priority support\n  - Bonus: [high-value bonus]\n\nBEST ($Z): Everything + done-for-you. For the premium buyer.\n  - Everything in Better, plus:\n  - Feature 6, Feature 7\n  - 1-on-1 support\n  - Bonus: [premium bonus]\n\nPRICING RATIO: Good = 1x, Better = 2.5x, Best = 5x\nThe Better tier should deliver 3x the value of Good at 2.5x the price.",
    tags: ["pricing", "offers", "tiers", "decoy", "psychology"],
  },

  // ═══ POSITIONING ══════════════════════════════════════════════════════════
  {
    id: "po-category-creation",
    title: "Category Creation (Godin)",
    category: "positioning",
    type: "playbook",
    author: "Seth Godin",
    body: "Don't compete in an existing category. Create a new one where you're the only player. The smallest viable audience + a remarkable promise = a category of one.",
    template:
      "STEP 1 — FIND THE GAP: What category is missing? What do people want that no one is offering?\nSTEP 2 — NAME IT: Give your category a name. 'Content marketing.' 'Growth hacking.' 'Conversion copywriting.' The name makes it real.\nSTEP 3 — DEFINE THE RULES: What makes someone in this category different? What do they do that others don't?\nSTEP 4 — LEAD THE TRIBE: Find the smallest group that cares. Serve them so well they can't imagine going elsewhere.\nSTEP 5 — SPREAD THE WORD: If you're remarkable, they'll tell others. The category grows because the tribe grows.",
    tags: ["positioning", "category-design", "godin", "strategy"],
  },
  {
    id: "po-niche-domination",
    title: "Niche Domination Strategy (Halbert)",
    category: "positioning",
    type: "playbook",
    author: "Gary Halbert",
    body: "Find a starving crowd. Don't try to serve everyone — serve one niche so well that you dominate it completely. Then expand.",
    template:
      "STEP 1 — IDENTIFY THE HUNGER: Who is already desperate for what you sell? Not who might want it — who NEEDS it?\nSTEP 2 — GO DEEP: Serve this niche exclusively. Learn their language, their pain, their dreams. Become one of them.\nSTEP 3 — DOMINATE: Become the #1 choice in this niche. The default. The obvious answer.\nSTEP 4 — DOCUMENT: Case studies, testimonials, results. Proof that you own this niche.\nSTEP 5 — EXPAND: Only after domination, expand to adjacent niches. Each new niche leverages the proof from the last.",
    tags: ["positioning", "niche", "halbert", "strategy"],
  },

  // ═══ GROWTH ══════════════════════════════════════════════════════════════
  {
    id: "gr-referral-system",
    title: "The Referral System (Deiss + Cialdini)",
    category: "growth",
    type: "playbook",
    author: "Ryan Deiss / Robert Cialdini",
    body: "Turn customers into promoters. When customers acquire customers, CAC drops to near zero and growth compounds.",
    template:
      "PHASE 1 — DELIVER: Exceed expectations. The referral won't happen if the experience is just 'okay.'\nPHASE 2 — MEASURE: NPS survey. 'How likely are you to recommend us?' Score 9-10 = promoters.\nPHASE 3 — ASK: Contact promoters within 48 hours. 'Would you be willing to refer us?'\nPHASE 4 — REWARD: Double-sided reward. They get X, their friend gets X. Both sides win.\nPHASE 5 — SHOWCASE: Feature referrals as case studies. Social proof that compounds.\nPHASE 6 — SYSTEMATIZE: Automated trigger: NPS 9-10 → referral request → reward → case study.",
    tags: ["growth", "referral", "retention", "flywheel", "deiss"],
  },
  {
    id: "gr-content-engine",
    title: "The Content Engine (GaryVee + Brunson)",
    category: "growth",
    type: "playbook",
    author: "Gary Vaynerchuk / Russell Brunson",
    body: "Document, don't create. One pillar piece of content per week → repurpose into 20+ pieces of micro-content → distribute across all platforms natively.",
    template:
      "PILLAR CONTENT (weekly):\n  - 1 long-form video, podcast, or blog (30-60 min)\n  - This is the 'document' — your process, your journey, your expertise\n\nREPURPOSE (daily):\n  - 5-7 short clips (15-60 sec) for TikTok/Reels/Shorts\n  - 3-5 text posts for LinkedIn/Twitter\n  - 1 email summarizing the week\n  - 1 carousel or infographic for Instagram\n\nDISTRIBUTE (native to each platform):\n  - TikTok: raw, authentic, trending audio\n  - LinkedIn: professional, story-driven, actionable\n  - Twitter: punchy, thread-style, controversial\n  - Instagram: visual, carousel, behind-the-scenes\n  - YouTube: searchable, educational, long-form\n\nCADENCE: 1 pillar → 20 micro-pieces → 5 platforms = 100 touchpoints/week",
    tags: ["growth", "content", "garyvee", "repurpose", "distribution"],
  },

  // ═══ RESEARCH ════════════════════════════════════════════════════════════
  {
    id: "rs-voc-research",
    title: "Voice-of-Customer Research Protocol (Wiebe)",
    category: "research",
    type: "checklist",
    author: "Joanna Wiebe",
    body: "The best copy comes from your customers, not your imagination. This protocol collects their exact words and puts them in the right place.",
    template:
      "SOURCE 1 — REVIEWS: Read 50 customer reviews (yours + competitors').\n  Look for: exact phrases, pain words, desire words, objections.\n\nSOURCE 2 — SALES CALLS: Listen to 5 recorded sales calls.\n  Look for: how they describe the problem, what they've tried, what they want.\n\nSOURCE 3 — SUPPORT TICKETS: Read 20 support tickets.\n  Look for: language, frustration, questions, confusion points.\n\nSOURCE 4 — SURVEYS: Send a 3-question survey to recent buyers.\n  'What was happening before you bought? What almost stopped you? What changed after?'\n\nSOURCE 5 — INTERVIEWS: Interview 5 customers for 15 min each.\n  'Tell me about the day you decided to buy. What were you feeling?'\n\nOUTPUT: A swipe file of customer language. Use their exact words in your copy.",
    tags: ["research", "voice-of-customer", "wiebe", "copy", "checklist"],
  },

  // ═══ CHECKLISTS ═══════════════════════════════════════════════════════════
  {
    id: "cl-launch-checklist",
    title: "Product Launch Checklist (25 items)",
    category: "checklist",
    type: "checklist",
    author: "Russell Brunson / Ryan Deiss",
    body: "Everything you need to check before, during, and after a launch. Miss one and you leak revenue.",
    template:
      "PRE-LAUNCH:\n  [ ] Landing page tested on mobile + desktop\n  [ ] Checkout flow tested with real payment\n  [ ] Email sequence loaded and scheduled\n  [ ] Social proof (testimonials, case studies) ready\n  [ ] Ad creative approved and loaded\n  [ ] UTM tracking on all links\n  [ ] Server load tested (can it handle traffic spike?)\n  [ ] Backup payment processor ready\n\nLAUNCH DAY:\n  [ ] Email #1 sent at 6am\n  [ ] Social posts scheduled every 2 hours\n  [ ] Team on standby for support tickets\n  [ ] Live chat enabled\n  [ ] Conversion tracking verified\n  [ ] Slack alert on every sale\n\nPOST-LAUNCH:\n  [ ] Thank-you email sent within 1 hour\n  [ ] Onboarding sequence triggered\n  [ ] Abandoned cart email sent at 6 hours\n  [ ] Day 1 revenue counted\n  [ ] Lessons documented for next launch",
    tags: ["checklist", "launch", "operations", "funnel"],
  },
  {
    id: "cl-audit-checklist",
    title: "Marketing Audit Checklist (20 items)",
    category: "checklist",
    type: "checklist",
    author: "David Ogilvy / Claude Hopkins",
    body: "Audit your entire marketing operation. Find the leaks, fix the bottlenecks, identify the leverage.",
    template:
      "POSITIONING:\n  [ ] Can you state your positioning in 1 sentence?\n  [ ] Does your target audience feel 'finally, someone gets it'?\n  [ ] Could 10 competitors say the same thing? (If yes, it's not positioning)\n\nOFFER:\n  [ ] Is your offer so good people feel stupid saying no?\n  [ ] Do you have a risk reversal / guarantee?\n  [ ] Is there genuine urgency to buy now?\n\nACQUISITION:\n  [ ] Do you know your CAC by channel?\n  [ ] Is LTV/CAC > 3x?\n  [ ] Are you testing at least 2 new channels per quarter?\n\nCONVERSION:\n  [ ] Do you A/B test headlines, CTAs, and pricing?\n  [ ] Is your landing page load time < 3 seconds?\n  [ ] Do you follow up with leads within 5 minutes?\n\nRETENTION:\n  [ ] Do you measure NPS?\n  [ ] Do you have a referral system?\n  [ ] Do you know your churn rate by cohort?\n\nANALYTICS:\n  [ ] Do you track every touchpoint?\n  [ ] Do you know which 20% of efforts produce 80% of results?\n  [ ] Do you have a daily numbers ritual (Patrick Number)?",
    tags: ["checklist", "audit", "ogilvy", "hopkins", "operations"],
  },

  // ═══ SOPs ════════════════════════════════════════════════════════════════
  {
    id: "sop-client-onboarding",
    title: "Client Onboarding SOP",
    category: "sop",
    type: "playbook",
    author: "BAZ Empire",
    body: "The first 7 days of a client relationship determine the next 12 months. This SOP ensures every client gets the same premium experience.",
    template:
      "DAY 0 — WELCOME:\n  - Send welcome email with next steps\n  - Schedule kickoff call within 48 hours\n  - Send onboarding questionnaire\n  - Grant access to client portal\n\nDAY 1-2 — DISCOVERY:\n  - Kickoff call (60 min): goals, timeline, KPIs, team\n  - Collect assets: brand kit, analytics access, existing content\n  - Document the 'before' state with baseline metrics\n\nDAY 3-5 — STRATEGY:\n  - Present strategy document within 5 days\n  - Positioning, offer, channels, 90-day roadmap\n  - Get client sign-off before execution\n\nDAY 6-7 — ACTIVATION:\n  - Begin first deliverable\n  - Set up weekly reporting cadence\n  - Schedule first monthly QBR\n  - Send 'first win' email when first result is achieved",
    tags: ["sop", "onboarding", "client", "agency", "operations"],
  },
  {
    id: "sop-weekly-report",
    title: "Weekly Client Report SOP",
    category: "sop",
    type: "playbook",
    author: "Claude Hopkins",
    body: "Every Friday at 4pm. Same format every week. Clients should never wonder 'what are they doing?' The report answers before they ask.",
    template:
      "SECTION 1 — RESULTS THIS WEEK:\n  - Metrics that moved (with before/after numbers)\n  - Revenue or pipeline impact\n  - Comparison to target\n\nSECTION 2 — WHAT WE DID:\n  - 3-5 bullet points of work completed\n  - Links to deliverables (ads, emails, landing pages)\n\nSECTION 3 — WHAT'S NEXT:\n  - 3-5 bullet points of planned work for next week\n  - Any decisions needed from the client\n\nSECTION 4 — INSIGHTS:\n  - 1 key learning or observation\n  - 1 recommendation for improvement\n\nSECTION 5 — BLOCKERS:\n  - Anything slowing progress\n  - What we need from the client to move faster",
    tags: ["sop", "reporting", "client", "agency", "hopkins"],
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
export const STASH_BY_CATEGORY: Record<StashCategory, StashItem[]> = STASH.reduce(
  (acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  },
  {} as Record<StashCategory, StashItem[]>,
);

export const STASH_BY_AUTHOR: Record<string, StashItem[]> = STASH.reduce(
  (acc, item) => {
    (acc[item.author] = acc[item.author] || []).push(item);
    return acc;
  },
  {} as Record<string, StashItem[]>,
);

export const STASH_CATEGORIES: { id: StashCategory; label: string; icon: string; color: string }[] =
  [
    { id: "framework", label: "Frameworks", icon: "🏗️", color: "violet" },
    { id: "copy", label: "Copy Templates", icon: "✍️", color: "amber" },
    { id: "offer", label: "Offers", icon: "💎", color: "sky" },
    { id: "funnel", label: "Funnels", icon: "🌀", color: "rose" },
    { id: "email", label: "Email Sequences", icon: "📧", color: "emerald" },
    { id: "script", label: "Sales Scripts", icon: "🎭", color: "fuchsia" },
    { id: "checklist", label: "Checklists", icon: "✅", color: "blue" },
    { id: "swipe", label: "Swipe Files", icon: "📋", color: "orange" },
    { id: "psychology", label: "Psychology", icon: "🧠", color: "purple" },
    { id: "pricing", label: "Pricing", icon: "💰", color: "indigo" },
    { id: "positioning", label: "Positioning", icon: "🎯", color: "pink" },
    { id: "growth", label: "Growth", icon: "🚀", color: "green" },
    { id: "research", label: "Research", icon: "🔬", color: "teal" },
    { id: "sop", label: "SOPs", icon: "📐", color: "slate" },
  ];
