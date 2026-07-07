/**
 * Marketing Lexicon — the Investopedia of marketing, our way.
 *
 * Every term gets:
 *   - Definition (concise, no jargon-on-jargon)
 *   - Origin (who coined it, when)
 *   - Formula (when applicable, verbatim)
 *   - Worked example
 *   - Case study (real, named)
 *   - "Hot word" flag — when the term is trending in 2026 marketing
 *   - Related terms
 */
export type TermCategory =
  | "strategy"
  | "tribe"
  | "copy"
  | "funnel"
  | "analytics"
  | "pricing"
  | "growth"
  | "content"
  | "pr"
  | "automation"
  | "data"
  | "brand";

export interface Term {
  slug: string;
  name: string;
  short: string; // 1-line definition
  category: TermCategory;
  origin: string; // "Seth Godin, 2008" or "Hughes, 1994"
  body: string; // long-form explanation, ~3-6 paragraphs
  formula?: string; // verbatim formula
  example?: { inputs: Record<string, number>; result: unknown };
  case_study: {
    title: string;
    subject: string; // who/what
    year: string;
    summary: string;
  };
  hot: boolean; // trending in 2026
  related: string[]; // other slugs
  tags: string[]; // searchable
}

export const TERMS: Term[] = [
  /* ──────────── Strategy ──────────── */
  {
    slug: "stp",
    name: "STP — Segmentation, Targeting, Positioning",
    short: "Pick a segment, choose one, position to win.",
    category: "strategy",
    origin: "Philip Kotler, 1960s",
    body: "STP is the spine of strategic marketing. Segmentation: divide the market into groups of people with similar needs. Targeting: pick the one group you can win. Positioning: write the one sentence that makes them choose you. Most marketing failures happen at the targeting step — trying to be for everyone means being for no one. A good segment is need-based, large enough to matter, small enough to focus, reachable, and winnable. A good target is the one you can dominate, not the biggest one. A good position is a trade the customer gets to make: 'for [target] who [need], [brand] is the [category] that [promise] because [proof].' If you can't fill in that sentence, you don't have a strategy.",
    case_study: {
      title: "Salesforce dominates enterprise CRM by picking the SMB-adjacent target",
      subject: "Salesforce",
      year: "1999-present",
      summary:
        "When Siebel owned enterprise CRM, Salesforce picked sales-rep-cloud for SMB. Same category, different STP. Result: $200B+ market cap.",
    },
    hot: true,
    related: ["positioning", "7ps", "tribe", "smallest-viable-audience"],
    tags: ["strategy", "kotler", "positioning", "STP"],
  },
  {
    slug: "7ps",
    name: "The 7 Ps (Marketing Mix)",
    short: "Walk every P before you ship. Most marketing fails one P at a time.",
    category: "strategy",
    origin: "E. Jerome McCarthy, 1960 (4 Ps) · Booms & Bitner, 1981 (extended to 7)",
    body: "The 7 Ps are the operational checklist for any marketing plan. Product: what you're selling and what job it does. Price: the signal it sends and the value it captures. Place: where the customer expects to find you. Promotion: the story, not the spend. People: every touchpoint is the brand. Process: can the customer succeed in 3 minutes? Physical evidence: receipts, packaging, screenshots. The discipline is to walk every P and ask 'does this support the position, or undermine it?' Most failures are uneven — great product, weak price signal, zero physical evidence. The 7 Ps are the cure for that.",
    case_study: {
      title: "Apple's 7-Ps alignment around 'creative simplicity'",
      subject: "Apple",
      year: "2007 (iPhone launch)",
      summary:
        "Product: minimalist. Price: premium. Place: Apple Store as temple. Promotion: '1,000 songs in your pocket.' People: trained geniuses. Process: one-button. Physical evidence: the unboxing. Every P reinforced the same position.",
    },
    hot: false,
    related: ["stp", "positioning"],
    tags: ["strategy", "marketing-mix", "mcCarthy"],
  },
  {
    slug: "positioning",
    name: "Positioning",
    short: "The choice the customer gets to make.",
    category: "strategy",
    origin: "Trout & Ries, 1980 (Positioning: The Battle for Your Mind)",
    body: "Positioning is not what you do to a product. It's what you do to the mind of the prospect. You position the product IN THE MIND relative to the alternatives. The best positioning is a trade the customer gets to make: 'we're not X, we're Y for Z.' It's not a tagline. It's a category choice. Once you choose the category, the tagline, the pricing, the design, the channel — all follow. Repositioning is harder than positioning from scratch because you have to overcome the existing memory. Position from a position of strength: what do you already own in the mind?",
    case_study: {
      title: "Southwest positions as 'the low-cost airline that is fun'",
      subject: "Southwest Airlines",
      year: "1971-2010s",
      summary:
        "Most airlines positioned on route network, on-time, premium service. Southwest picked 'fun, low-cost, point-to-point.' Every operational decision — no assigned seats, single aircraft type, quick turnarounds — reinforced that position.",
    },
    hot: false,
    related: ["stp", "tribe", "7ps", "smallest-viable-audience"],
    tags: ["strategy", "trout", "ries", "positioning"],
  },

  /* ──────────── Tribe ──────────── */
  {
    slug: "tribe",
    name: "Tribe",
    short: "A tribe is a group of people connected to one another, to a leader, and to an idea.",
    category: "tribe",
    origin: "Seth Godin, 2008 (Tribes: We Need You to Lead Us)",
    body: "A tribe is not a market segment. A market segment is a demographic. A tribe is a people. They share a worldview, a vocabulary, a way of being. The leader's job is to notice the tribe, name the worldview, and make change worth belonging to. Marketing discovers the tribe. The product serves them. The leader leads them. Tribes spread ideas that change things. Without a tribe, you have a product. With a tribe, you have a religion. The smallest viable audience is the 100 people who would notice if you disappeared. Find them first. Lead them. Then scale.",
    case_study: {
      title: "Apple's tribe of creators",
      subject: "Apple",
      year: "1984-present",
      summary:
        "Apple didn't have a product segmentation — they had a tribe. Creators, designers, thinkers. The 'Think Different' campaign wasn't a tagline. It was a rallying cry for the tribe. The product was built for them.",
    },
    hot: true,
    related: ["smallest-viable-audience", "permission-marketing", "remarkable", "im-me-test"],
    tags: ["seth-godin", "tribe", "community", "positioning"],
  },
  {
    slug: "smallest-viable-audience",
    name: "Smallest Viable Audience (SVA)",
    short: "The 100 people who would notice if you disappeared. Lead them first.",
    category: "tribe",
    origin: "Seth Godin, multiple books",
    body: "The SVA is the smallest group of people whose happiness is critical to your success. Not your total addressable market. Not your demographic. The 100 people who would actually buy from you, refer you, defend you, and notice if you vanished. Most marketers think too big. They say 'everyone is my customer' which means no one is. The discipline is to pick the smallest group that matters and to give them a story worth spreading. Then the spread does the rest. If you can't make 100 people happy, you can't make 100,000 happy.",
    case_study: {
      title: "Wikipedia starts with a niche of editors",
      subject: "Wikipedia",
      year: "2001",
      summary:
        "Started with a few thousand dedicated editors, not 'everyone who wants to read.' Made them happy first. They built the product. Then it spread.",
    },
    hot: true,
    related: ["tribe", "permission-marketing", "remarkable"],
    tags: ["seth-godin", "SVA", "tribe"],
  },
  {
    slug: "permission-marketing",
    name: "Permission Marketing",
    short:
      "The privilege of delivering anticipated, personal, relevant messages — to people who want to get them.",
    category: "tribe",
    origin:
      "Seth Godin, 1999 (Permission Marketing: Turning Strangers into Friends, and Friends into Customers)",
    body: "Interruption marketing (TV ads, banner ads, cold calls) rents attention. Permission marketing earns it. The shift: instead of blasting a message to a million people hoping 0.1% convert, ask 100 people for the privilege of talking to them. Then deliver something worth their attention. The math: 100 × 10 minutes of attention > 1,000,000 × 0.5 seconds of annoyance. Email, content, communities, subscriptions — all permission channels. The discipline is to never abuse the privilege. Every email must be anticipated (they signed up), personal (segment by interest), and relevant (segment by behavior). The moment you send spam, you lose the privilege.",
    case_study: {
      title: "Hubspot's blog → flywheel built on permission",
      subject: "Hubspot",
      year: "2006-2014",
      summary:
        "Started with a 'free marketing grader' that required an email. Email = permission. Then dripped valuable content. Built a 100k+ list. Converted to paying at 5-10%. The blog wasn't a marketing channel — it was a permission-earning engine.",
    },
    hot: true,
    related: ["tribe", "smallest-viable-audience", "lifecycle"],
    tags: ["seth-godin", "permission", "email", "lifecycle"],
  },
  {
    slug: "remarkable",
    name: "The IM ME Test (Remarkable)",
    short:
      "Worth making a remark about. Incongruous, minimal, memorable, endorsed, emotional, story.",
    category: "tribe",
    origin: "Seth Godin, 2003 (Purple Cow)",
    body: "If your product is just OK, it will die. OK is the silent killer. Remarkable means worth making a remark about. The IM ME checklist: Incongruous (surprising), Minimal (focused on one thing), Memorable (sticks), Endorsed (someone important loves it), Emotional (evokes a feeling), Story (has a character + conflict + resolution). Purple Cow is the philosophy: the only way to be remarkable is to be. The moment you set out to be remarkable, you've lost. Be the thing that's actually worth remarking about. Then market that.",
    case_study: {
      title: "Tesla Model S — the only remarkable car",
      subject: "Tesla",
      year: "2012",
      summary:
        "For 100 years, every new car was an iteration. The Model S was a reinvention: no engine, no gas, no dealer network, no emissions. Worth remarking about. Sold 250k+ before any meaningful ad spend.",
    },
    hot: true,
    related: ["tribe", "smallest-viable-audience", "purple-cow"],
    tags: ["seth-godin", "purple-cow", "remarkable"],
  },
  {
    slug: "im-me-test",
    name: "IM ME Test",
    short: "Incongruous · Minimal · Memorable · Endorsed · Emotional · Story",
    category: "tribe",
    origin: "Seth Godin, 2003",
    body: "The checklist for 'remarkable.' Score your product or campaign 0-2 on each of six criteria. If you score under 8/12, you're safe — and doomed. IMME: Incongruous (does it surprise?), Minimal (one thing done well), Memorable (sticks after one exposure), Endorsed (who famous loves it?), Emotional (which feeling?), Story (what's the narrative?). A purple cow scores high on all six. A commodity scores low on all six. The remedy: pick the one criterion where you're weakest, and design the next iteration to fix that. Iterate until every score is 2.",
    case_study: {
      title: "Apple's iPod ad (2001) — all 6 IMME boxes ticked",
      subject: "Apple iPod",
      year: "2001",
      summary:
        "Incongruous: silhouette dancing with white earbuds. Minimal: one product, one color. Memorable: '1,000 songs in your pocket.' Endorsed: the silhouette says 'famous person uses this.' Emotional: pure joy. Story: the underdog winning. Six for six.",
    },
    hot: false,
    related: ["remarkable", "purple-cow"],
    tags: ["seth-godin", "remarkable", "checklist"],
  },

  /* ──────────── Copy ──────────── */
  {
    slug: "aida",
    name: "AIDA (Attention, Interest, Desire, Action)",
    short: "The first codified funnel. 125+ years old. Still the spine.",
    category: "copy",
    origin: "E. St. Elmo Lewis, 1898",
    body: "Lewis was a sales manager at a Philadelphia carbide company. He wrote down the four steps a prospect moves through and gave marketing its first lingua franca. Attention: stop them. Interest: hook them. Desire: make them want it. Action: make it easy. Every modern framework (PAS, BAB, StoryBrand, HSO) is AIDA with different verbs. The mistake most copywriters make: they skip Attention and try to start at Interest. The result: nothing happens. The discipline: the FIRST line, the FIRST image, the FIRST word — must earn the right to exist by stopping the scroll. Then everything else has a chance.",
    case_study: {
      title: "Every successful direct-response letter follows AIDA",
      subject: "Direct-response copywriting canon",
      year: "1898-present",
      summary:
        "Gary Halbert's classic sales letters, Ogilvy's Rolls-Royce ad, Schwartz's Breakthrough Advertising — all AIDA. The framework outlives every trend.",
    },
    hot: true,
    related: ["pas", "bab", "storybrand", "5-levels-of-awareness"],
    tags: ["copywriting", "funnel", "classic"],
  },
  {
    slug: "pas",
    name: "PAS (Problem, Agitate, Solution)",
    short: "When the pain is vivid and the fix is obvious. The fastest conversion framework.",
    category: "copy",
    origin: "Dan Kennedy, adapted by many",
    body: "PAS is AIDA compressed. Problem: name the specific pain. Agitate: twist the knife, show what it costs them. Solution: introduce the fix. It works because most buying decisions are pain-driven, not aspiration-driven. The risk: over-agitation. If you push too hard, you sound manipulative. The fix: be SPECIFIC about the pain. Specificity is convincing; vague alarm isn't. 'You've tried 4 CRMs and they all suck' is convincing. 'Are you struggling with customer management?' is not. PAS is the right framework when the buyer is already problem-aware. For problem-unaware, use AIDA or story-led.",
    case_study: {
      title: "Pain-agitate-solution in a 6-word email",
      subject: "B2B SaaS sales",
      year: "2024",
      summary:
        "'Your trial users churn in week 2. Here's why. Click.' 8% reply rate. Compare: 'Try our new onboarding.' 0.3% reply rate.",
    },
    hot: true,
    related: ["aida", "bab", "5-levels-of-awareness"],
    tags: ["copywriting", "PAS", "dan-kennedy"],
  },
  {
    slug: "bab",
    name: "BAB (Before, After, Bridge)",
    short: "Status-quo disruption. Use when the buyer needs to see the gap.",
    category: "copy",
    origin: "Classic direct-response",
    body: "BAB is the cleanest framework for status-quo disruption. Before: paint the current state with pain. After: paint the future state with relief. Bridge: your product is the bridge. It works because humans are wired to want the After — and to avoid staying stuck. The risk: the After can sound like a fantasy. The fix: be specific with numbers and timelines. 'Right now you're spending 8 hours a week on reporting. With us, 30 minutes.' Specificity is the difference between persuasion and hype. BAB is the right framework when the buyer is aware of the status quo and open to change, but hasn't identified the gap yet.",
    case_study: {
      title: "Stripe's 'before' and 'after' positioning",
      subject: "Stripe",
      year: "2010-present",
      summary:
        "Before: 13 weeks to integrate payments. After: 7 lines of code. Bridge: the Stripe API. The 'Before' was true for every developer. The 'After' was the dream. The Bridge was real. Multi-billion-dollar outcome.",
    },
    hot: false,
    related: ["aida", "pas", "5-levels-of-awareness"],
    tags: ["copywriting", "BAB", "direct-response"],
  },
  {
    slug: "5-levels-of-awareness",
    name: "5 Levels of Awareness (Schwartz)",
    short: "Most-aware sells on offer. Unaware sells on story. Match the message to the mind.",
    category: "copy",
    origin: "Eugene Schwartz, 1966 (Breakthrough Advertising)",
    body: "Schwartz identified 5 stages of prospect awareness: Most aware (they want it, just give them the offer). Product aware (they know you exist, prove your mechanism is better). Solution aware (they know the problem, introduce the category). Problem aware (they feel the pain, name it, agitate, then promise). Unaware (no idea, tell a status-quo story first). The mistake: writing the SAME message to everyone. The discipline: segment by awareness stage, write five different messages. Each stage requires a different headline, a different offer, a different proof. Breakthrough Advertising is the closest thing to a copywriting bible. Read it twice.",
    case_study: {
      title: "P90X infomercials match awareness to the moment",
      subject: "P90X",
      year: "2003-2010",
      summary:
        "First 5 minutes: 'You're tired. You used to be fit. Beachbody Insanity ads sold the problem.' Next 5: 'There IS a way — 90 days, no equipment.' Then: 'P90X. $119.' Awareness staged perfectly across 30 minutes.",
    },
    hot: false,
    related: ["aida", "pas", "bab", "market-sophistication"],
    tags: ["copywriting", "schwartz", "awareness"],
  },
  {
    slug: "market-sophistication",
    name: "5 Stages of Market Sophistication",
    short: "Stage 1: claim works. Stage 5: claim the mechanism behind the mechanism.",
    category: "copy",
    origin: "Eugene Schwartz, 1966",
    body: "Every market starts at Stage 1 (the claim alone is enough to sell) and moves to Stage 5 (the claim is assumed; you need to claim the mechanism, then the meta-mechanism). The discipline: be one step ahead of your market. If your competitors say 'lose weight fast,' you say 'lose weight fast with our proprietary thermogenic blend.' If they say 'with our proprietary blend,' you say 'a blend that works by activating brown adipose tissue.' When your market reaches Stage 5, invent Stage 6. The moment you stop evolving, the market catches up and you commodify.",
    case_study: {
      title: "Supplement industry's 5 stages, 1980-2020",
      subject: "Supplement industry",
      year: "1980-2020",
      summary:
        "Stage 1: lose weight. Stage 2: lose weight with this formula. Stage 3: with this proprietary formula. Stage 4: with the proprietary formula that's clinically studied. Stage 5: with the formula that activates AMPK. Each stage 5-10 years. Winners moved through every stage.",
    },
    hot: false,
    related: ["5-levels-of-awareness", "purple-cow"],
    tags: ["copywriting", "schwartz", "market-sophistication"],
  },

  /* ──────────── Funnel ──────────── */
  {
    slug: "funnel",
    name: "Marketing Funnel",
    short: "Awareness → Interest → Consideration → Decision → Retention → Advocacy.",
    category: "funnel",
    origin: "St. Elmo Lewis (AIDA, 1898) extended through the 20th century",
    body: "The funnel is the universal abstraction: people start wide, narrow toward action, then expand again into loyalty. The mistake: treating it as linear. It's not. The modern funnel is a flywheel: every customer who reaches the bottom becomes a force that pulls new people into the top. Advocacy → Awareness. The best funnels have the highest 'advocacy coefficient' (K in viral coefficient). The discipline: measure the conversion rate between each stage. The stage with the worst drop-off is where the money is. That's where the leak is. That's the next test. The funnel isn't a document — it's a diagnostic.",
    case_study: {
      title: "HubSpot's flywheel replaced the funnel",
      subject: "HubSpot",
      year: "2018",
      summary:
        "Old funnel: stop at 'Customer.' New flywheel: customers attract strangers. The flywheel is the same abstraction but with feedback loops. Result: better LTV/CAC and faster growth.",
    },
    hot: true,
    related: ["aarrr", "k-factor", "viral-coefficient"],
    tags: ["funnel", "flywheel", "growth"],
  },
  {
    slug: "aarrr",
    name: "AARRR (Pirate Metrics)",
    short: "Acquisition, Activation, Retention, Referral, Revenue — find the leak.",
    category: "funnel",
    origin: "Dave McClure, 2007",
    body: "Every funnel has five stages. The discipline: find the WORST-converting stage. That's the only one worth optimizing this week. Once it's fixed, move to the next. AARRR forces you to pick. McClure's insight: most companies obsess about Acquisition (because it's measurable) when the real leak is in Retention or Referral (where the math compounds). The framework is simple: Acquire a user, Activate them (the aha moment), make them Retain (come back), get them to Refer (K > 0), and earn Revenue. Each stage has its own metric, its own number, its own experiment.",
    case_study: {
      title: "Facebook's growth team used AARRR to find the activation moment",
      subject: "Facebook",
      year: "2007-2009",
      summary:
        "They discovered that users who added 7 friends in 10 days retained at 3x the rate. Activation = 7 friends in 10 days. Everything (onboarding, email, notifications) optimized to that single moment.",
    },
    hot: false,
    related: ["funnel", "k-factor", "north-star-metric"],
    tags: ["funnel", "growth", "McClure"],
  },
  {
    slug: "k-factor",
    name: "Viral Coefficient (K)",
    short: "Each user brings K new users. K > 1 = viral. K < 1 = linear.",
    category: "funnel",
    origin: "Reed Hastings / Netflix memo, 2000s; formalized by Andrew Chen",
    body: "K = invites_per_user × conversion_rate. If every user invites 4 friends and 25% convert, K = 1.0 — sustainable. K = 1.2 — viral growth. K = 0.5 — slow death. The discipline: optimize either the invites per user (every UX should have a viral hook) or the conversion rate (the invite page must convert). Most companies ignore K because it's hard to measure. Big mistake. The math doesn't lie. K > 1 means the company will outgrow its marketing budget. K < 1 means it will die. The only question is when.",
    case_study: {
      title: "WhatsApp's K > 1 made it the largest messaging app in the world",
      subject: "WhatsApp",
      year: "2009-2014",
      summary:
        "Each WhatsApp user invited ~3 contacts; conversion ~80%. K = 2.4. The company grew from 0 to 600M users in 5 years with $0 marketing spend. Sold to Facebook for $19B.",
    },
    hot: true,
    related: ["funnel", "aarrr", "north-star-metric"],
    tags: ["viral", "growth", "metric"],
  },
  {
    slug: "north-star-metric",
    name: "North Star Metric",
    short: "The one number that, if it goes up, the business goes up.",
    category: "funnel",
    origin: "Sean Ellis, 2010s (popularized by Amplitude & growth teams)",
    body: "Every business has ONE metric that, if it goes up, the rest follows. For Airbnb: nights booked. For WhatsApp: messages sent. For HubSpot: weekly active teams. The North Star is NOT revenue (revenue is an output) and NOT users (vanity). It's the moment of delivered value — the thing users came for. The discipline: ignore it during quarterly slumps, double-down on it during product reviews, and design every experiment to move it. The risk: optimizing the North Star so hard that you damage the supporting metrics (acquisition, retention). The remedy: pair the North Star with a set of counter-metrics that prevent over-optimization.",
    case_study: {
      title: "Airbnb's North Star is nights booked, not signups",
      subject: "Airbnb",
      year: "2012-present",
      summary:
        "Nights booked = a real person stayed in a real home. Signups can be faked. Nights booked cannot. The whole company orients around nights booked. Every team — engineering, design, marketing, support — measures against it.",
    },
    hot: false,
    related: ["aarrr", "k-factor"],
    tags: ["metric", "growth", "sean-ellis"],
  },

  /* ──────────── Analytics ──────────── */
  {
    slug: "rfm",
    name: "RFM (Recency, Frequency, Monetary)",
    short: "Score every customer on R, F, M. Segment. Treat each segment differently.",
    category: "analytics",
    origin: "Arthur Hughes, 1994 (The Complete Database Marketer)",
    body: "RFM is the original customer segmentation. Recency: how long since they bought? (more recent = better). Frequency: how often? (more often = better). Monetary: how much? (more = better). Score 1-5 on each. Combine. Champions: 555. At-risk: 155. Hibernating: 111. The discipline: treat each RFM segment differently. Champions get early access and rewards. At-risk get win-back campaigns. Hibernating get re-engagement. Most companies send the same email to everyone. RFM forces differentiation. The math compounds: a 5% retention lift on a Champion segment can be worth more than a 50% acquisition lift on a cold list.",
    case_study: {
      title: "Amazon's RFM powers the recommendation engine",
      subject: "Amazon",
      year: "2000s-present",
      summary:
        "Every product recommendation is a function of RFM. Customers who bought X recently and frequently are recommended Y. The RFM score drives both personalization and email targeting.",
    },
    hot: true,
    related: ["churn-rate", "ltv", "cac"],
    tags: ["analytics", "segmentation", "database-marketing"],
  },
  {
    slug: "cac",
    name: "CAC (Customer Acquisition Cost)",
    short: "Total cost to acquire one paying customer. The first metric to fix.",
    category: "analytics",
    origin: "Direct-response marketing canon, 1990s",
    body: "CAC = (marketing_spend + sales_spend) / new_customers. Not impressions, not clicks — paying customers. The discipline: most companies report a 'blended' CAC that's wrong. Split by channel: paid CAC, content CAC, outbound CAC. The channel with the worst CAC gets cut first, the best gets more budget. The trap: optimizing CAC at the expense of LTV. A $500 customer that LTVs $50 is worse than a $1,000 customer that LTVs $5,000. The LTV/CAC ratio is the real north star. Below 1 = you lose money. Above 3 = you have a business. Above 5 = you have an empire.",
    case_study: {
      title: "Dropbox's referral program dropped CAC 60%",
      subject: "Dropbox",
      year: "2008-2010",
      summary:
        "Original paid CAC: $233. Referred CAC: $79. The referral program — extra storage for both referrer and referred — turned every user into a viral channel. CAC dropped 60% in 18 months.",
    },
    hot: true,
    related: ["ltv", "ltv-cac", "k-factor"],
    tags: ["analytics", "unit-economics", "cac"],
  },
  {
    slug: "ltv",
    name: "LTV (Lifetime Value)",
    short: "Total revenue a customer pays over their lifetime.",
    category: "analytics",
    origin: "Direct-response marketing canon, 1990s",
    body: "LTV = avg_order_value × purchases_per_year × customer_lifespan_years × gross_margin. The discipline: most companies under-count lifespan. They use 1 year when real is 4. They forget gross margin. They forget refunds. The remedy: cohort analysis. Take a real cohort — say, January signups — and measure their cumulative revenue over 3 years. That's the LTV. Use real numbers. Use real gross margin. The LTV is what determines how much you can pay to acquire. A $5,000 LTV supports a $1,000 CAC. A $200 LTV supports a $40 CAC. Most businesses that 'can't grow profitably' are actually buying customers too expensive for the LTV they deliver. The fix is in the offer, not the channel.",
    case_study: {
      title: "Amazon Prime's LTV justified years of below-cost pricing",
      subject: "Amazon Prime",
      year: "2005-present",
      summary:
        "Prime members spend 2x as much, churn 1/4 as much, and stay 8+ years. $139/year × 8 years × 70% margin = $780 LTV. Amazon lost money on Prime for years, knowing the LTV was massive. Won.",
    },
    hot: true,
    related: ["cac", "ltv-cac", "rfm"],
    tags: ["analytics", "LTV", "unit-economics"],
  },
  {
    slug: "ltv-cac",
    name: "LTV:CAC Ratio",
    short: "How many dollars of LTV you get per dollar of CAC. The unit economics ratio.",
    category: "analytics",
    origin: "Direct-response + SaaS canon, 2000s",
    body: "LTV/CAC is the single most important number in the business. Below 1: you lose money on every customer. 1-3: you survive, growth is slow. 3-5: healthy, you can invest in growth. 5-10: exceptional, scale aggressively. Above 10: you're under-investing in growth. The discipline: don't optimize CAC at the expense of LTV/CAC. A $50 CAC for a $500 LTV (ratio 10) beats a $20 CAC for a $200 LTV (ratio 10) IF the LTV/CAC is the same. The real move: raise the LTV. The cheapest way to raise LTV: improve retention, not acquisition. Each month of retention typically increases LTV 5-15%. The companies that win don't acquire more — they retain better.",
    case_study: {
      title: "HubSpot's freemium drove LTV:CAC above 8",
      subject: "HubSpot",
      year: "2010-present",
      summary:
        "Free CRM → upgrade to Marketing Hub Pro. Free users have LTV near zero (use forever), paid users have LTV $5k+. The blend of free + paid drove LTV/CAC to 8x. They outgrew Salesforce in mid-market.",
    },
    hot: true,
    related: ["cac", "ltv", "k-factor"],
    tags: ["analytics", "unit-economics"],
  },
  {
    slug: "churn-rate",
    name: "Churn Rate",
    short: "% of customers who leave in a given period. The silent killer.",
    category: "analytics",
    origin: "SaaS canon, 2000s",
    body: "Churn rate = customers_lost_in_period / customers_at_start. For SMB SaaS, 5% monthly is a crisis. For enterprise SaaS, 5% annual is a crisis. The discipline: split churn by reason. Voluntary (they chose to leave) vs involuntary (payment failed, churned by accident). Voluntary churn is the real signal. Reduce voluntary churn 1pp = 10-20% revenue lift. The biggest churn driver: users who never reach the aha moment. They sign up, try once, never come back. The fix is activation, not retention. The biggest retention driver: habit. Daily-use products churn less. Push the user back in for 7+ days in a row and retention goes from 20% to 60%.",
    case_study: {
      title: "Slack's daily-use retention kept churn under 5%",
      subject: "Slack",
      year: "2014-present",
      summary:
        "Most B2B SaaS has 3-5% monthly churn. Slack had <1% by becoming a daily-use product. Theaha: 2,000 messages sent in a team. After that, switching cost is too high.",
    },
    hot: true,
    related: ["rfm", "ltv", "nps"],
    tags: ["analytics", "churn", "SaaS"],
  },
  {
    slug: "nps",
    name: "NPS (Net Promoter Score)",
    short: "Loyalty in one number. Above 50 = world-class.",
    category: "analytics",
    origin: "Fred Reichheld, 2003 (The One Number You Need to Grow)",
    body: "NPS = %promoters (9-10) - %detractors (0-6). The question: 'How likely are you to recommend us?' Range: -100 to +100. Above 50 = world-class (Tesla, Apple). Above 0 = good. Below 0 = you have a product problem, not a marketing problem. The discipline: NPS is a system, not a number. Survey continuously. Segment by user cohort. Track over time. Use the qualitative comments ('what would make you more likely to recommend?') as a roadmap. The trap: gaming NPS with 'rate your experience' surveys that exclude unhappy users. NPS only works if you sample the WHOLE population, not the satisfied ones.",
    case_study: {
      title: "Tesla's NPS above 90 — every owner becomes a salesperson",
      subject: "Tesla",
      year: "2015-present",
      summary:
        "Tesla owners post about their cars on social media unprompted. NPS above 90 means every customer is a brand ambassador. Zero traditional advertising spend. The product IS the marketing.",
    },
    hot: true,
    related: ["rfm", "churn-rate"],
    tags: ["analytics", "metric", "loyalty"],
  },
  {
    slug: "multi-touch-attribution",
    name: "Multi-Touch Attribution",
    short: "Credit every channel that contributed — not just the last one.",
    category: "analytics",
    origin: "Digital marketing canon, 2010s (formalized by Google & Facebook)",
    body: "Last-touch attribution gives 100% credit to the final channel. First-touch gives 100% to the first. Both lie. Real attribution distributes credit. Linear: equal across touches. Time-decay: more to recent. Position-based (U-shaped): 40% first, 40% last, 20% spread. Data-driven: learns from your data. The discipline: pick the model that matches your funnel. Long consideration cycles (B2B SaaS) → position-based. Short cycles (e-commerce) → last-touch. The trap: over-attribution. If you have 5 channels and use U-shaped, you can hide inefficiency. Start with linear, then graduate to position-based. Data-driven is for mature teams with lots of conversions.",
    case_study: {
      title: "HubSpot's data-driven attribution shifted budget to content",
      subject: "HubSpot",
      year: "2018",
      summary:
        "After switching from last-touch to data-driven, HubSpot discovered content (blog, YouTube) drove 3x more pipeline than paid. Reallocated budget. CAC dropped 40%.",
    },
    hot: true,
    related: ["funnel", "aarrr", "north-star-metric"],
    tags: ["attribution", "analytics", "growth"],
  },

  /* ──────────── Pricing ──────────── */
  {
    slug: "grand-slam-offer",
    name: "The Grand Slam Offer",
    short: "Dream outcome × perceived likelihood / (time × effort × sacrifice).",
    category: "pricing",
    origin: "Alex Hormozi, $100M Offers (2021)",
    body: "The Grand Slam Offer formula measures how valuable an offer feels. Numerator: dream outcome (what they want) × perceived likelihood (how sure they are it works). Denominator: time to result × effort required × sacrifice (money, status, risk). The discipline: move any one factor. Higher dream outcome, higher likelihood, lower time, lower effort, lower sacrifice — each one makes the offer better. The Grand Slam Offer is so good the customer feels stupid saying no. You can charge 10x what you think. Pricing is a function of value, not cost. The cost of a meal is $5. The price at a Michelin restaurant is $300. Same cost. Different offer.",
    case_study: {
      title: "$100M Lead Magnet: $1,000 free course that sells a $10,000 mastermind",
      subject: "Alex Hormozi / Acquisition.com",
      year: "2020-present",
      summary:
        "Give away a $1,000-value free course. Sell $10k mastermind on the back. Free users become sales assets. Course is the Grand Slam Offer of the funnel.",
    },
    hot: true,
    related: ["3-tier-pricing", "guarantee", "value-ladder"],
    tags: ["hormozi", "offer", "pricing"],
  },
  {
    slug: "3-tier-pricing",
    name: "Three-Tier Pricing (Good-Better-Best)",
    short: "Three options. The middle one is the one you want them to buy.",
    category: "pricing",
    origin: "Marketing canon, refined by Hormozi & Cialdini",
    body: "Three options force the buyer to make a comparison, not a yes/no. The middle option becomes the default. The top option (decoy) makes the middle look reasonable. The bottom option (real) makes the middle look valuable. The discipline: don't price them as a price ladder (10/20/30). Price them as value tiers (Starter $49 / Pro $99 / Agency $299). The price gap from Pro to Agency must be large enough that Agency feels 'reserved for serious people.' The gap from Starter to Pro must be small enough that Pro feels like the obvious choice. Most companies under-price the top tier by 3-5x. The grand slam offer is in the top tier.",
    case_study: {
      title: "P90X pricing tiers: $39.95 / $119.85 / $239.70",
      subject: "Beachbody / P90X",
      year: "2003-2010",
      summary:
        "Three options, deliberately structured so the middle is the obvious buy. The top (with bonus DVDs and a 'free' month of coaching) made the middle feel reasonable. 80% chose middle.",
    },
    hot: true,
    related: ["grand-slam-offer", "anchoring", "decoy-effect"],
    tags: ["pricing", "hormozi", "tiers"],
  },
  {
    slug: "guarantee",
    name: "The Guarantee (Risk Reversal)",
    short: "Unconditional. Long. Removes the objection that blocks the sale.",
    category: "pricing",
    origin: "Direct-response canon, Ogilvy / Caples / Hormozi",
    body: "A guarantee removes the buyer's risk. The longer and more unconditional, the more you sell. The discipline: name the guarantee, make it specific, remove all conditions. '30-day money-back, no questions asked' beats '30-day money-back if you attended all sessions.' The trap: fear of refund-seekers. In practice, refund-seekers are 1-3% of customers. The 30-50% conversion lift you get from a real guarantee dwarfs that. Hormozi's rule: the higher the price, the longer the guarantee. $100 product: 30 days. $10,000 mastermind: 12 months. The guarantee is part of the offer — not a footnote.",
    case_study: {
      title: "L.L.Bean's unconditional lifetime guarantee",
      subject: "L.L.Bean",
      year: "1916-present",
      summary:
        "100+ years, no questions asked. Some customers abused it. The cost was less than the value of the trust. The company became a $1B+ brand on the back of one guarantee.",
    },
    hot: true,
    related: ["grand-slam-offer", "3-tier-pricing"],
    tags: ["pricing", "guarantee", "trust"],
  },

  /* ──────────── Growth ──────────── */
  {
    slug: "growth-loop",
    name: "The Growth Loop",
    short: "Output of one user becomes input for the next. Self-reinforcing.",
    category: "growth",
    origin: "Brian Balfour, multiple essays (2010s); formalized at Reforge",
    body: "A growth loop is a closed system: users come in, get value, generate output, output attracts new users. Examples: content SEO (you write → rank → visitors → customers → more content), referral (user invites friend → friend becomes user → invites another), UGC (user posts → attracts new users → become posters), marketplace (sellers attract buyers → buyers attract sellers). The discipline: every growth model is a loop. The funnel is one slice. Most growth stalls because the loop is broken — the output doesn't feed the input. The fix: find the loop, measure the conversion at every step, and remove friction. Loops compound. Funnels just add.",
    case_study: {
      title: "YouTube's growth loop: viewers become creators",
      subject: "YouTube",
      year: "2005-present",
      summary:
        "Viewer watches → suggested videos → starts a channel → posts videos → attracts more viewers. The loop is self-reinforcing. Every feature (subscribe, comment, share) tightens the loop.",
    },
    hot: true,
    related: ["funnel", "k-factor", "aarrr"],
    tags: ["growth", "loops", "Balfour"],
  },
  {
    slug: "purple-cow",
    name: "The Purple Cow",
    short: "Remarkable beats reliable. The product is the marketing.",
    category: "brand",
    origin: "Seth Godin, 2003 (Purple Cow: Transform Your Business by Being Remarkable)",
    body: "TV-ads are dead. Brochures are dead. Most marketing is 'safe' — and 'safe' is the silent killer. A purple cow is a product so remarkable that people remark about it. The discipline: design the product to be remarkable, not just the marketing. Apple is remarkable. Tesla is remarkable. Spanx is remarkable. The marketing doesn't save an unremarkable product. The marketing is just amplifying the remark. If your product is boring, marketing it harder just makes it more boring faster. The purple cow doesn't need a marketing budget. It needs a story.",
    case_study: {
      title: "Spanx — Sara Blakely's $1B product with zero ad budget",
      subject: "Spanx",
      year: "2000-2015",
      summary:
        "Spanx had no advertising budget for 5 years. Sara Blakely sold Oprah, then Today Show, then every woman in America through WOM. The product was so remarkable the marketing was free.",
    },
    hot: true,
    related: ["remarkable", "tribe", "smallest-viable-audience"],
    tags: ["seth-godin", "remarkable", "brand"],
  },
  // ═══ EXPANDED TERMS — 70+ new entries covering all categories ═════════════

  /* ──────────── Content ──────────── */
  {
    slug: "pillar-content",
    name: "Pillar Content",
    short: "Long-form content that becomes the source for dozens of micro-pieces.",
    category: "content",
    origin: "Gary Vaynerchuk, 2017",
    body: "Pillar content is the deep, long-form piece — a 45-minute podcast, a 3,000-word article, a 60-minute webinar — that documents your expertise. From this one pillar, you repurpose 20-30 micro-content pieces: short clips, quotes, carousels, tweets, threads. One pillar feeds all platforms for a week. The discipline is documenting, not creating — show your process, not your polished output.",
    case_study: {
      title: "GaryVee's daily pillar strategy",
      subject: "Gary Vaynerchuk",
      year: "2017-present",
      summary:
        "Gary records one long-form piece daily and his team repurposes it into 30+ pieces across 8 platforms. Result: 30M+ followers.",
    },
    hot: true,
    related: ["content-engine", "jab-jab-jab", "native-content"],
    tags: ["content", "garyvee", "repurpose", "document"],
  },
  {
    slug: "content-engine",
    name: "Content Engine",
    short: "A system that turns one pillar into 100+ touchpoints per week.",
    category: "content",
    origin: "Gary Vaynerchuk / Russell Brunson, 2020",
    body: "The content engine is the systematized version of pillar content. Step 1: Create one pillar (video, podcast, or blog). Step 2: Repurpose into 5-7 short clips, 3-5 text posts, 1 email, 1 carousel. Step 3: Distribute natively on each platform. Result: 100+ touchpoints per week from one piece of effort. The engine scales content without scaling effort.",
    case_study: {
      title: "ClickFunnels' daily publishing",
      subject: "Russell Brunson",
      year: "2020",
      summary:
        "Brunson published daily for 365 days on YouTube. The audience built ClickFunnels to $100M+ ARR.",
    },
    hot: true,
    related: ["pillar-content", "native-content", "jab-jab-jab"],
    tags: ["content", "system", "distribution", "scale"],
  },
  {
    slug: "native-content",
    name: "Native Content",
    short: "Content that speaks the language of the platform it lives on.",
    category: "content",
    origin: "Gary Vaynerchuk, 2013",
    body: "A LinkedIn post should read like a memo. A TikTok should feel like a friend showing you something. A YouTube video should be educational and searchable. Don't post a TV ad on Instagram. Don't post a blog post on TikTok. Each platform has a culture, a format, a language. Speak it fluently or don't speak at all. Content is king, but context is God.",
    case_study: {
      title: "Wendy's Twitter roasts",
      subject: "Wendy's",
      year: "2017",
      summary:
        "Wendy's adopted Twitter's native language (snark, humor, real-time). Result: 3x engagement, millions in earned media.",
    },
    hot: true,
    related: ["pillar-content", "content-engine", "jab-jab-jab"],
    tags: ["content", "platform", "garyvee", "context"],
  },
  {
    slug: "lead-magnet",
    name: "Lead Magnet",
    short: "A free resource given in exchange for an email address.",
    category: "content",
    origin: "Ryan Deiss, 2012",
    body: "A lead magnet is the entry point of every funnel. It must be: specific (solve one problem), valuable (worth paying for), consumable (finishable in 5-10 minutes), and relevant (connected to your core offer). The best lead magnets are checklists, templates, quizzes, and mini-courses — not ebooks. The conversion rate from lead magnet to first purchase should be 5-15% within 30 days.",
    case_study: {
      title: "HubSpot's Website Grader",
      subject: "HubSpot",
      year: "2006-present",
      summary:
        "A free tool that grades your website. Generated millions of leads and built HubSpot's $1B+ business.",
    },
    hot: true,
    related: ["tripwire", "value-ladder", "conversion-funnel"],
    tags: ["content", "leads", "funnel", "free"],
  },
  {
    slug: "tripwire",
    name: "Tripwire Offer",
    short: "A low-priced offer that converts subscribers into buyers.",
    category: "content",
    origin: "Russell Brunson, 2014",
    body: "A tripwire is a low-priced product ($7-$47) offered immediately after someone opts in. Its job is not to make profit — it's to convert a subscriber into a buyer. Once someone buys anything, even $7, the psychological barrier to buying again drops dramatically. Tripwires should be priced to break even on ad spend, making acquisition effectively free.",
    case_study: {
      title: "ClickFunnels' free book + shipping",
      subject: "Russell Brunson",
      year: "2014",
      summary:
        "Brunson offers his books free, charging only $7.95 shipping. The tripwire converts at 30%+ and funds ad spend.",
    },
    hot: true,
    related: ["lead-magnet", "value-ladder", "conversion-funnel"],
    tags: ["funnel", "offers", "conversion", "brunson"],
  },

  /* ──────────── PR & Earned ──────────── */
  {
    slug: "earned-media",
    name: "Earned Media",
    short: "Coverage you didn't pay for — the most trusted form of marketing.",
    category: "pr",
    origin: "Traditional PR, pre-digital",
    body: "Earned media is the coverage your brand gets without paying for it: press mentions, reviews, shares, word-of-mouth, user-generated content. It's the most trusted form of marketing because it comes from third parties. The leverage is enormous — one viral moment can do more than $100K in ads. But it's not luck — it's engineered through remarkable work, relationships with journalists, and making yourself worth talking about.",
    case_study: {
      title: "Dollar Shave Club's launch video",
      subject: "Dollar Shave Club",
      year: "2012",
      summary:
        "A $4,500 video earned 12,000 orders in 48 hours and 26M views. Unilever bought them for $1B.",
    },
    hot: true,
    related: ["remarkable", "purple-cow", "viral-coefficient"],
    tags: ["pr", "earned-media", "viral", "word-of-mouth"],
  },
  {
    slug: "haro",
    name: "HARO (Help a Reporter Out)",
    short: "Service connecting journalists with expert sources for earned media.",
    category: "pr",
    origin: "Peter Shankman, 2008",
    body: "HARO sends daily emails with queries from journalists looking for expert sources. Responding with a good answer gets you quoted in major publications — free PR with high-authority backlinks. The strategy: respond fast (within 1 hour), be specific, give data, and make the journalist's job easy. One good HARO placement can drive traffic for years.",
    case_study: {
      title: "Drift's HARO strategy",
      subject: "Drift",
      year: "2015-2018",
      summary:
        "Drift's team responded to 200+ HARO queries, earning mentions in Forbes, Inc, and Entrepreneur — building authority that helped them reach $100M ARR.",
    },
    hot: false,
    related: ["earned-media", "authority", "backlinks"],
    tags: ["pr", "haro", "earned-media", "backlinks"],
  },

  /* ──────────── Automation ──────────── */
  {
    slug: "lifecycle-automation",
    name: "Lifecycle Automation",
    short: "Automated messaging triggered by where the customer is in their journey.",
    category: "automation",
    origin: "Ryan Deiss, 2017",
    body: "Lifecycle automation maps every message to the customer's phase in the Customer Value Journey. A new lead gets a welcome sequence. A first-time buyer gets an onboarding sequence. A repeat buyer gets an ascension offer. A churned customer gets a win-back sequence. Each sequence is triggered automatically — no manual work. The system runs 24/7, nurturing every contact at the right time with the right message.",
    case_study: {
      title: "Amazon's recommendation engine",
      subject: "Amazon",
      year: "2006-present",
      summary:
        "Automated product recommendations based on browsing and purchase history. Drives 35% of Amazon's revenue.",
    },
    hot: true,
    related: ["cvj", "email-sequence", "trigger-based"],
    tags: ["automation", "lifecycle", "deiss", "email"],
  },
  {
    slug: "trigger-based-marketing",
    name: "Trigger-Based Marketing",
    short: "Messages sent automatically when a specific action is taken.",
    category: "automation",
    origin: "Marketing automation era, 2010s",
    body: "Trigger-based marketing sends a message when a specific event occurs: abandoned cart → email in 1 hour. New signup → welcome sequence. NPS score 9-10 → referral request. Deal stage change → notification to owner. The trigger + message + timing is the unit of automation. The best triggers are behavioral (what they did), not temporal (when they did it). Behavioral triggers convert 3x higher than scheduled emails.",
    case_study: {
      title: "Cart abandonment emails",
      subject: "Various e-commerce",
      year: "2015-present",
      summary:
        "Triggered cart abandonment emails recover 10-15% of lost sales. Average order value is often higher than initial cart.",
    },
    hot: true,
    related: ["lifecycle-automation", "email-sequence", "conversion-funnel"],
    tags: ["automation", "triggers", "email", "behavioral"],
  },

  /* ──────────── Data & Intelligence ──────────── */
  {
    slug: "attribution-modeling",
    name: "Attribution Modeling",
    short: "Determining which marketing touchpoints deserve credit for a conversion.",
    category: "data",
    origin: "Digital advertising, 2010s",
    body: "Attribution models assign credit for a sale across the touchpoints that contributed. First-touch: credit the first interaction. Last-touch: credit the final click. Linear: equal credit to all. Time-decay: more credit to recent touches. Position-based: 40% first, 40% last, 20% middle. Data-driven: algorithmic based on actual conversion patterns. The model you choose changes which channels look 'profitable' — so test multiple models before scaling.",
    case_study: {
      title: "Google's data-driven attribution",
      subject: "Google Ads",
      year: "2016-present",
      summary:
        "Google's DDA uses machine learning to assign credit. Advertisers using DDA see 15-20% more efficient spend allocation.",
    },
    hot: true,
    related: ["multi-touch", "cac", "roas"],
    tags: ["data", "attribution", "analytics", "touchpoints"],
  },
  {
    slug: "cohort-analysis",
    name: "Cohort Analysis",
    short: "Grouping customers by acquisition period to track retention over time.",
    category: "data",
    origin: "SaaS analytics, 2010s",
    body: "A cohort is a group of customers acquired in the same time period (e.g., 'June 2026 signups'). Tracking each cohort's retention over time reveals: which acquisition channels bring loyal customers, whether product improvements reduce churn, and the true LTV by cohort. The Week 8 retention metric (what % of users are still active 8 weeks after signup) is the gold standard for product health.",
    case_study: {
      title: "Slack's cohort-driven growth",
      subject: "Slack",
      year: "2014-2019",
      summary:
        "Slack tracked cohorts religiously. Teams that sent 2,000+ messages in their first weeks had 95% retention. They optimized onboarding to hit that threshold.",
    },
    hot: true,
    related: ["retention", "ltv", "churn-rate"],
    tags: ["data", "retention", "cohorts", "saas"],
  },
  {
    slug: "rsi",
    name: "Relationship Strength Index (RSI)",
    short: "Composite score of relationship health: Recency + Frequency + Quality + Sentiment.",
    category: "data",
    origin: "BAZ Empire / Nova Intelligence, 2026",
    body: "RSI measures how strong your relationship is with any contact. Recency: when was the last interaction? Frequency: how often do you interact? Quality: what was the nature (call vs. email vs. deal)? Sentiment: was it positive or negative? RSI = Recency×0.30 + Frequency×0.25 + Quality×0.25 + Sentiment×0.20. Score > 70 = strong relationship. Score < 40 = at risk. RSI powers the Hub's Intelligence module.",
    case_study: {
      title: "BAZ Empire CRM scoring",
      subject: "Marketing Hub",
      year: "2026",
      summary:
        "The Hub's Intelligence module uses RSI to rank 68 contacts. Score > 70 = hot lead. Score < 40 = churn risk. Drives the 'Today's Moves' recommendations.",
    },
    hot: true,
    related: ["lead-priority", "churn-risk", "nba"],
    tags: ["data", "intelligence", "crm", "scoring", "nova"],
  },
  {
    slug: "nba-next-best-action",
    name: "Next Best Action (NBA)",
    short: "The single highest-impact action you can take right now for a contact.",
    category: "data",
    origin: "BAZ Empire / Nova Intelligence, 2026",
    body: "NBA = RevenueImpact×0.35 + Urgency×0.25 + Confidence×0.20 + EffortReduction×0.20. The Hub's Intelligence module calculates NBA for every contact and surfaces the top 5 as 'Today's Moves.' Examples: 'Qualify further: David Kim (RSI 62)' or 'Follow up: proposal sent 12 days ago.' NBA replaces guesswork with math — it tells you exactly what to do today.",
    case_study: {
      title: "Hub Today's Moves",
      subject: "Marketing Hub",
      year: "2026",
      summary:
        "The Today API generates priority-ranked actions based on RSI, deal stage, and recency. Replaces the morning 'what should I do?' question.",
    },
    hot: true,
    related: ["rsi", "lead-priority", "churn-risk"],
    tags: ["data", "intelligence", "nova", "action", "scoring"],
  },

  /* ──────────── More Strategy ──────────── */
  {
    slug: "blue-ocean",
    name: "Blue Ocean Strategy",
    short: "Create uncontested market space instead of fighting in red oceans.",
    category: "strategy",
    origin: "Kim & Mauborgne, 2005",
    body: "Red oceans are existing markets where competitors fight for the same customers. Blue oceans are new markets you create by combining elements in a way no one has before. Cirque du Soleil didn't compete with Ringling Bros — it combined circus with theater and created a new category. The framework: Eliminate (what industry takes for granted), Reduce (what's overdesigned), Raise (what's underdelivered), Create (what's never been offered).",
    case_study: {
      title: "Cirque du Soleil",
      subject: "Cirque du Soleil",
      year: "1984-present",
      summary:
        "Eliminated animals and stars. Raised artistry and music. Created a new category: theatrical circus. Grew to $1B+ revenue.",
    },
    hot: false,
    related: ["positioning", "category-creation", "stp"],
    tags: ["strategy", "blue-ocean", "innovation", "category"],
  },
  {
    slug: "category-creation",
    name: "Category Creation",
    short: "Don't compete in a category — invent a new one where you're the only player.",
    category: "strategy",
    origin: "Seth Godin, 2018",
    body: "Category creation is the ultimate positioning move. Instead of being 'better' than competitors in an existing category, you create a new category where you're the only option. The steps: Find the gap (what do people want that no one offers), Name it (a category name makes it real), Define the rules (what makes this different), Lead the tribe (serve the smallest group that cares), Spread the word (remarkable work spreads). Examples: 'Content marketing,' 'Growth hacking,' 'Conversion copywriting' — all invented categories.",
    case_study: {
      title: "Drift invents 'conversational marketing'",
      subject: "Drift",
      year: "2016-2019",
      summary:
        "Drift didn't compete in 'live chat' — they invented 'conversational marketing.' Grew to $100M ARR and got acquired by Salesloft.",
    },
    hot: true,
    related: ["positioning", "blue-ocean", "smallest-viable-audience", "remarkable"],
    tags: ["strategy", "positioning", "category-design", "godin"],
  },

  /* ──────────── More Copy ──────────── */
  {
    slug: "four-liner",
    name: "Four-Liner (Schwartz)",
    short: "The opening structure that makes copy impossible to stop reading.",
    category: "copy",
    origin: "Eugene Schwartz, 1966",
    body: "Schwartz's four-liner: Line 1 states a fact or asks a question. Line 2 expands it with a surprising detail. Line 3 makes a promise. Line 4 starts the story. Example: 'Most people can't sleep. (1) But a new study found that 73% of insomniacs share one deficiency. (2) Fix it, and you fall asleep in 7 minutes. (3) Here's what happened when I tried it... (4)' The four-liner is the engine of every great sales letter.",
    case_study: {
      title: "Schwartz's BluBlocker ad",
      subject: "BluBlocker Sunglasses",
      year: "1986",
      summary:
        "Schwartz's four-liner opened: 'When I put on these glasses, I couldn't believe my eyes.' The ad sold 20 million pairs.",
    },
    hot: false,
    related: ["awareness-levels", "slippery-slope", "headline"],
    tags: ["copy", "schwartz", "direct-response", "opening"],
  },
  {
    slug: "voice-of-customer",
    name: "Voice of Customer (VoC)",
    short: "Using your customers' exact words in your copy — not your marketing team's words.",
    category: "copy",
    origin: "Joanna Wiebe, 2015",
    body: "VoC is the practice of collecting customer language (from reviews, support tickets, sales calls, interviews) and using it verbatim in your copy. When your copy sounds like the customer talking to themselves, conversion skyrockets. The process: Research (read 50 reviews, listen to 5 calls) → Extract (find the exact phrases) → Assemble (put them in the right place). Copy is not written — it's assembled from customer language.",
    case_study: {
      title: "Wiebe rewrites SaaS landing page",
      subject: "Various SaaS",
      year: "2015-present",
      summary:
        "Wiebe rewrote a landing page using only customer interview words. Conversion went from 2.1% to 5.7% — a 171% lift.",
    },
    hot: true,
    related: ["conversion-copywriting", "headline", "awareness-levels"],
    tags: ["copy", "wiebe", "research", "voc", "conversion"],
  },
  {
    slug: "reason-why",
    name: "Reason-Why Copy",
    short: "Every claim needs a mechanism — a reason it's true.",
    category: "copy",
    origin: "Claude Hopkins, 1923",
    body: "'Whiter wash' is a claim. 'Whiter wash because of oxygen bubbles' is a reason. People don't buy claims — they buy reasons. The reason is the proof. Hopkins used reason-why in every ad: 'This beer is brewed in plate-glass rooms with filtered air' is the reason. 'Best beer' is just a claim. Always give the mechanism. Always answer 'why?'",
    case_study: {
      title: "Schlitz beer",
      subject: "Schlitz",
      year: "1920s",
      summary:
        "Hopkins toured the Schlitz brewery and wrote ads about the filtration process. Schlitz went from #8 to #1. The process was the same as competitors — but he was first to tell the story.",
    },
    hot: false,
    related: ["scientific-advertising", "headline", "proof"],
    tags: ["copy", "hopkins", "reason-why", "proof", "mechanism"],
  },

  /* ──────────── More Funnel ──────────── */
  {
    slug: "value-ladder",
    name: "Value Ladder",
    short: "Ascending offers from free to premium that guide customers up the value chain.",
    category: "funnel",
    origin: "Russell Brunson, 2014",
    body: "The value ladder maps your entire business as a series of ascending offers. Rung 1: Free (lead magnet, capture email). Rung 2: Low-ticket ($7-$47, tripwire, convert to buyer). Rung 3: Mid-ticket ($97-$497, core product, deliver transformation). Rung 4: High-ticket ($1,000-$10,000, coaching/DFY, create profit). Rung 5: Continuity ($97-$997/mo, membership/retainer, recurring revenue). Most businesses sell one rung — leaving 80% of revenue on the table.",
    case_study: {
      title: "ClickFunnels value ladder",
      subject: "ClickFunnels",
      year: "2014-present",
      summary:
        "Free book (shipping $7.95) → Software ($97/mo) → Inner Circle ($5,000) → Mastermind ($25,000). Built to $100M+ ARR.",
    },
    hot: true,
    related: ["tripwire", "lead-magnet", "conversion-funnel", "hook-story-offer"],
    tags: ["funnel", "brunson", "offers", "ladder", "pricing"],
  },
  {
    slug: "hook-story-offer",
    name: "Hook, Story, Offer",
    short: "The only three things that matter in marketing.",
    category: "funnel",
    origin: "Russell Brunson, 2014",
    body: "Hook: the pattern interrupt that grabs attention in 2.7 seconds. Story: the narrative that builds desire and trust. Offer: the package that closes the sale. Get all three right and you can sell anything. Get any one wrong and nothing works. The Hook is tested with ad CTR. The Story is tested with watch/scroll time. The Offer is tested with conversion rate. Test each independently.",
    case_study: {
      title: "ClickFunnels' framework",
      subject: "Russell Brunson",
      year: "2014-present",
      summary:
        "Every ClickFunnels landing page follows Hook-Story-Offer. The framework generated over $1B in tracked sales through the platform.",
    },
    hot: true,
    related: ["value-ladder", "conversion-funnel", "slippery-slope"],
    tags: ["funnel", "brunson", "hook", "story", "offer"],
  },

  /* ──────────── More Analytics ──────────── */
  {
    slug: "roas",
    name: "ROAS (Return on Ad Spend)",
    short: "Revenue generated for every dollar spent on advertising.",
    category: "analytics",
    origin: "Digital advertising, 2010s",
    body: "ROAS = Revenue from Ads / Ad Spend. A ROAS of 3x means you earned $3 for every $1 spent. Target ROAS varies by industry: e-commerce 3-5x, SaaS 1-3x (because LTV is high), local services 5-10x. ROAS > 4x is generally healthy. ROAS < 2x means you're losing money after accounting for COGS and overhead. Always calculate ROAS on attributed revenue, not last-click.",
    case_study: {
      title: "Nike's digital ROAS",
      subject: "Nike",
      year: "2020",
      summary:
        "Nike shifted to digital-first advertising, achieving 5.2x ROAS on Instagram vs 2.1x on TV. Drove $5B in digital revenue.",
    },
    hot: true,
    related: ["cac", "ltv", "attribution-modeling", "conversion-funnel"],
    tags: ["analytics", "roas", "ads", "roi"],
  },
  {
    slug: "churn-rate",
    name: "Churn Rate",
    short: "The percentage of customers who cancel in a given period.",
    category: "analytics",
    origin: "SaaS metrics, 2000s",
    body: "Churn rate = (customers lost / customers at start of period) × 100. Monthly churn of 5% means you lose 5% of customers each month — which compounds to 46% annual churn. Healthy SaaS churn: < 3% monthly (B2B), < 5% monthly (B2C). The two types: logo churn (lost customers) and revenue churn (lost MRR). Net revenue churn can be negative if expansion revenue exceeds lost revenue — the holy grail of SaaS.",
    case_study: {
      title: "Netflix's churn optimization",
      subject: "Netflix",
      year: "2007-present",
      summary:
        "Netflix reduced monthly churn from 4.5% to 2.4% through personalization and original content. Each 0.1% churn reduction = ~$50M/yr in retained revenue.",
    },
    hot: true,
    related: ["cohort-analysis", "retention", "ltv", "mrr"],
    tags: ["analytics", "churn", "retention", "saas"],
  },
  {
    slug: "mrr",
    name: "MRR (Monthly Recurring Revenue)",
    short: "The predictable monthly revenue from subscriptions.",
    category: "analytics",
    origin: "SaaS metrics, 2000s",
    body: "MRR is the lifeblood of any subscription business. It's the sum of all recurring revenue in a month. Net new MRR = New MRR + Expansion MRR - Churned MRR - Contraction MRR. ARR = MRR × 12. The Patrick Number tracks MRR as a core metric because recurring revenue is the most valuable form of revenue — it's predictable, compounding, and valued at a premium by investors (8-12x ARR for SaaS).",
    case_study: {
      title: "HubSpot's MRR focus",
      subject: "HubSpot",
      year: "2006-present",
      summary:
        "HubSpot tracks MRR daily. Grew from $0 to $1.7B ARR by obsessing over net new MRR and churn.",
    },
    hot: true,
    related: ["churn-rate", "ltv", "arr", "patrick-number"],
    tags: ["analytics", "mrr", "arr", "saas", "recurring"],
  },
  {
    slug: "pipeline-velocity",
    name: "Pipeline Velocity",
    short: "How fast deals move through your pipeline, measured in dollars per day.",
    category: "analytics",
    origin: "Sales operations, 2010s",
    body: "Pipeline Velocity = (Number of Open Deals × Average Deal Size × Win Rate) / Average Sales Cycle Length. If you have 25 open deals at $18,862 average, 42.9% win rate, and 34-day cycle: Velocity = (25 × $18,862 × 0.429) / 34 = $5,949/day. To increase velocity: more deals (acquisition), bigger deals (pricing), higher win rate (conversion), or shorter cycle (efficiency). The Hub's Intelligence module tracks this as $/day.",
    case_study: {
      title: "Salesforce's velocity optimization",
      subject: "Salesforce",
      year: "2015",
      summary:
        "Salesforce reduced average sales cycle from 90 to 45 days through automated follow-ups. Velocity doubled without adding headcount.",
    },
    hot: true,
    related: ["cac", "ltv", "conversion-funnel", "patrick-number"],
    tags: ["analytics", "pipeline", "velocity", "sales"],
  },

  /* ──────────── More Tribe ──────────── */
  {
    slug: "jab-jab-jab",
    name: "Jab, Jab, Jab, Right Hook",
    short: "Give value three times before you ask for anything.",
    category: "tribe",
    origin: "Gary Vaynerchuk, 2013",
    body: "Jabs are the value you give — useful content, entertainment, help, education. The right hook is the ask — buy this, sign up, subscribe. Three jabs for every right hook. If you only throw right hooks, you lose. The ratio matters: 3:1 minimum, 5:1 for cold audiences, 7:1 for skeptical markets. Track your ratio in the content calendar — if you have 3 promotional posts, you need 9-21 value posts to balance.",
    case_study: {
      title: "GaryVee's content ratio",
      subject: "Gary Vaynerchuk",
      year: "2013-present",
      summary:
        "Gary estimates he throws 50 jabs for every right hook. His audience trusts him completely — when he does ask, conversion is extraordinarily high.",
    },
    hot: true,
    related: ["native-content", "content-engine", "pillar-content"],
    tags: ["tribe", "garyvee", "value", "content", "ratio"],
  },
  {
    slug: "smallest-viable-audience",
    name: "Smallest Viable Audience",
    short: "Don't find customers for your products. Find products for your customers.",
    category: "tribe",
    origin: "Seth Godin, 2018",
    body: "The smallest viable audience is the minimum group that can sustain your business — and that you can serve so well they can't imagine going elsewhere. Start with 100 people who care. Not 100,000 who sort of care. 100 who love you. If you win them, they tell others. The math: 100 customers × $1,000/mo = $1.2M ARR. That's a real business. You don't need scale to start — you need depth.",
    case_study: {
      title: "Basecamp's 47 customers",
      subject: "Basecamp",
      year: "2004",
      summary:
        "Basecamp launched with 47 customers. They served them so well that word spread. Today: millions of customers, profitable from year one.",
    },
    hot: true,
    related: ["tribe", "remarkable", "category-creation", "positioning"],
    tags: ["tribe", "godin", "audience", "focus", "sva"],
  },

  /* ──────────── More Brand ──────────── */
  {
    slug: "purple-cow",
    name: "Purple Cow",
    short: "Being very good is not enough. You must be remarkable — worth making a remark about.",
    category: "brand",
    origin: "Seth Godin, 2003",
    body: "A purple cow in a field of brown cows is remarkable — you can't help but notice it and talk about it. Safe is risky. The safest thing you can do is be remarkable. 'Good enough' is the enemy of remarkable. If your product, your service, your marketing, your customer experience is not worth talking about, you're invisible. The test: would someone tell a friend about this? If not, it's not done.",
    case_study: {
      title: "Dyson vacuum",
      subject: "Dyson",
      year: "1993",
      summary:
        "Dyson made a vacuum that looked like a machine, not an appliance. People talked. Result: $8B+ company from a 'boring' product category.",
    },
    hot: false,
    related: ["remarkable", "tribe", "smallest-viable-audience"],
    tags: ["brand", "godin", "remarkable", "differentiation"],
  },
  {
    slug: "peak-end-rule",
    name: "Peak-End Rule",
    short: "People remember the peak moment and the ending — not the average.",
    category: "brand",
    origin: "Daniel Kahneman, 1993",
    body: "95% of experience evaluations are determined by the most intense moment (peak) and the final moment (end). Not the average. Memory = 0.62 × Peak + 0.38 × End. Negative peaks are 2.5x more memorable than positive ones — eliminate them. A strong ending increases repurchase intent by 67%. Engineer peak moments in onboarding (the 'aha' moment) and strong endings at every touchpoint (thank-you pages, sign-off emails).",
    case_study: {
      title: "Disney's peak-end engineering",
      subject: "Disney World",
      year: "1971-present",
      summary:
        "Disney engineers every ride to end with a dramatic finale (the peak). The last 30 seconds of 'It's a Small World' is the most memorable part.",
    },
    hot: true,
    related: ["customer-experience", "onboarding", "retention"],
    tags: ["brand", "kahneman", "experience", "memory", "psychology"],
  },

  /* ──────────── More Pricing ──────────── */
  {
    slug: "anchor-pricing",
    name: "Anchor Pricing",
    short: "The first price a customer sees becomes the reference point for all future judgments.",
    category: "pricing",
    origin: "Dan Ariely, 2008",
    body: "Anchoring is a cognitive bias where the first number seen influences all subsequent judgments. If you show a $5,000 price first, a $500 price feels cheap. If you show a $50 price first, $500 feels expensive. Use anchoring by: showing the most expensive tier first, displaying the 'value' before the price, or comparing to a more expensive alternative. The anchor must be credible — a fake $100K price next to a $100 price doesn't anchor.",
    case_study: {
      title: "Williams-Sonoma bread maker",
      subject: "Williams-Sonoma",
      year: "1992",
      summary:
        "Added a $429 bread maker next to the existing $279 model. Sales of the $279 doubled — the $429 made it look reasonable.",
    },
    hot: true,
    related: ["good-better-best", "value-equation", "decoy-pricing"],
    tags: ["pricing", "anchoring", "psychology", "ariely"],
  },
  {
    slug: "decoy-pricing",
    name: "Decoy Pricing",
    short: "A third option that exists only to make another option look better.",
    category: "pricing",
    origin: "Dan Ariely, 2008",
    body: "The decoy is a pricing option designed to be dominated by one of the other options — its sole purpose is to make that option look more attractive. Example: A=print $59, B=digital $125, C=print+digital $125. C dominates B (same price, more value). Most people choose C. Without the decoy B, most would choose A. The decoy shifts behavior without being chosen itself.",
    case_study: {
      title: "The Economist subscription",
      subject: "The Economist",
      year: "2009",
      summary:
        "Ariely tested: 84% chose print+digital ($125) when the decoy (print-only $125) was present. Without the decoy, 68% chose digital-only ($59).",
    },
    hot: true,
    related: ["anchor-pricing", "good-better-best", "value-equation"],
    tags: ["pricing", "decoy", "psychology", "ariely"],
  },

  /* ──────────── More Growth ──────────── */
  {
    slug: "viral-coefficient",
    name: "Viral Coefficient (K-factor)",
    short: "How many new users each existing user brings in.",
    category: "growth",
    origin: "Growth hacking, 2010s",
    body: "K = invitations sent per user × conversion rate of invitations. If each user invites 5 people and 20% sign up: K = 5 × 0.20 = 1.0. K > 1 = viral growth (each user brings more than one new user). K < 1 = you need paid acquisition. K = 1.0 means the product grows linearly from referrals alone. Most products have K = 0.1-0.3. Getting K > 1 is rare but creates exponential growth.",
    case_study: {
      title: "Dropbox's referral program",
      subject: "Dropbox",
      year: "2008",
      summary:
        "Dropbox gave 500MB free for both referrer and referee. K reached 4.0 in some cohorts. User base grew from 100K to 4M in 15 months.",
    },
    hot: true,
    related: ["referral-loop", "earned-media", "growth-loop"],
    tags: ["growth", "viral", "k-factor", "referrals"],
  },
  {
    slug: "growth-loop",
    name: "Growth Loop",
    short: "A self-reinforcing cycle where outputs become inputs for the next cycle.",
    category: "growth",
    origin: "Reforge / Brian Balfour, 2018",
    body: "A growth loop is a system where the output of one cycle feeds the input of the next. Example: New users → create content → content attracts new users → those users create more content. Unlike funnels (which leak), loops compound. The three types: viral loop (users invite users), content loop (users create content that attracts users), and paid loop (revenue funds acquisition that generates revenue). Identify your loop and optimize the weakest link.",
    case_study: {
      title: "Pinterest's content loop",
      subject: "Pinterest",
      year: "2010-2015",
      summary:
        "Users pin images → pins show up in Google → new users discover Pinterest → they pin more images. The loop drove Pinterest to 450M users with near-zero ad spend.",
    },
    hot: true,
    related: ["viral-coefficient", "referral-loop", "content-engine"],
    tags: ["growth", "loops", "compounding", "reforge"],
  },
  {
    slug: "referral-loop",
    name: "Referral Loop",
    short: "A system where customers automatically acquire new customers.",
    category: "growth",
    origin: "Ryan Deiss / Cialdini, 2017",
    body: "The referral loop: Customer has great experience → asked for referral at peak satisfaction → both sides rewarded → new customer has great experience → loop repeats. The key moments: ask at the right time (after a win, not randomly), make it easy (one click), reward both sides (double-sided incentive), and showcase referrals as social proof. A well-tuned referral loop can make CAC negative.",
    case_study: {
      title: "Tesla's referral program",
      subject: "Tesla",
      year: "2015-2019",
      summary:
        "Tesla gave both referrer and referee free Supercharger miles. Generated $1B+ in referral sales with zero ad spend.",
    },
    hot: true,
    related: ["viral-coefficient", "growth-loop", "earned-media"],
    tags: ["growth", "referrals", "loop", "deiss", "cialdini"],
  },

  /* ──────────── Modern 2026 Terms ──────────── */
  {
    slug: "ai-augmented-marketing",
    name: "AI-Augmented Marketing",
    short: "Using AI to enhance — not replace — human marketing decisions.",
    category: "automation",
    origin: "2024-present",
    body: "AI-augmented marketing uses LLMs (GLM-4, GPT-4, Claude) to generate copy, analyze data, score leads, and recommend actions — while humans make the strategic decisions. The Hub's Strategist module is an example: GLM-4 generates recommendations, but the marketer decides what to execute. The principle: AI does the research, assembly, and first draft. The human does the judgment, editing, and approval. AI without human judgment is noise. Human without AI is slow.",
    case_study: {
      title: "Hub Strategist module",
      subject: "Marketing Hub",
      year: "2026",
      summary:
        "The Strategist uses GLM-4 with 10 master marketers as system prompt + real Hub data. Generates ranked recommendations by impact/effort/speed.",
    },
    hot: true,
    related: ["lifecycle-automation", "trigger-based-marketing", "nba-next-best-action"],
    tags: ["ai", "automation", "glm", "llm", "2026"],
  },
  {
    slug: "attention-economy",
    name: "Attention Economy",
    short: "Attention is the scarce resource. Everything else is abundant.",
    category: "growth",
    origin: "Herbert Simon, 1971 / Gary Vaynerchuk, 2013",
    body: "In an information-rich world, attention is the scarce resource. Nobel laureate Herbert Simon predicted this in 1971. By 2026, the average attention span is 8.25 seconds — shorter than a goldfish. The implication for marketing: you have 2.7 seconds to prove your content is worth the user's cognitive investment. Attention is not a commodity — it's the most valuable asset on earth. Traffic is the currency. Conversion is the exchange rate.",
    case_study: {
      title: "TikTok's attention dominance",
      subject: "TikTok",
      year: "2020-present",
      summary:
        "TikTok optimized for 8-second attention spans. Average session: 52 minutes. Result: 1B+ users, $200B+ valuation.",
    },
    hot: true,
    related: ["native-content", "jab-jab-jab", "pillar-content"],
    tags: ["growth", "attention", "economy", "garyvee", "2026"],
  },
  {
    slug: "zero-party-data",
    name: "Zero-Party Data",
    short: "Data customers intentionally share with you — the most valuable and compliant.",
    category: "data",
    origin: "Forrester, 2018",
    body: "Zero-party data is information customers proactively share: preferences, purchase intentions, personal context. Unlike first-party data (observed behavior) or third-party data (purchased), zero-party is explicitly given — making it the most accurate, compliant, and valuable. Collect it through quizzes, preference centers, interactive content, and progressive profiling. In the post-cookie era, zero-party data is the foundation of personalization.",
    case_study: {
      title: "Sephora's Beauty Insider quiz",
      subject: "Sephora",
      year: "2020-present",
      summary:
        "Sephora collects zero-party data through a beauty profile quiz. Powers personalized recommendations that drive 80% of their digital revenue.",
    },
    hot: true,
    related: ["attribution-modeling", "cohort-analysis", "personalization"],
    tags: ["data", "privacy", "zero-party", "personalization", "2026"],
  },
  {
    slug: "patrick-number",
    name: "The Patrick Number",
    short: "One number that tells you if the business is winning. Cash is truth.",
    category: "analytics",
    origin: "BAZ Empire, 2026",
    body: "The Patrick Number is the Hub's signature metric: a composite score (0-100) that combines cash flow, growth, efficiency, and risk into one number. The philosophy: cash is truth. Revenue can be manipulated, pipeline can be inflated, but cash collected is real. The Patrick ritual: every morning, look at the number. If it's green, keep going. If it's amber, find the leak. If it's red, stop everything and fix it. The number includes: cash collected (40%), MRR growth (25%), LTV/CAC (20%), risk score (15%).",
    case_study: {
      title: "BAZ Empire daily ritual",
      subject: "Marketing Hub",
      year: "2026",
      summary:
        "The Hub's Patrick API calculates the score daily. Current: 96/100 (healthy). Cash: $330,504. MRR: $145,125/mo. LTV/CAC: 26.82x.",
    },
    hot: true,
    related: ["mrr", "pipeline-velocity", "cac", "ltv"],
    tags: ["analytics", "patrick", "cash", "baz-empire", "daily", "2026"],
  },

  /* ──────────── More Offers ──────────── */
  {
    slug: "risk-reversal",
    name: "Risk Reversal",
    short: "Flip the risk from the customer to you. If it doesn't work, they don't pay.",
    category: "funnel",
    origin: "Alex Hormozi, 2021",
    body: "In most transactions, the customer takes all the risk. Flip it. You take the risk. If it doesn't work, they get their money back — plus something extra. The stronger the guarantee, the higher the price you can charge. Examples: 'Results in 30 days or full refund.' 'If we don't hit your KPI, you don't pay.' 'Lose 20lbs in 6 weeks or your money back + $100 for your time.' The risk reversal makes saying yes the easiest decision the customer makes all day.",
    case_study: {
      title: "Hormozi's gym launch",
      subject: "Gym Launch",
      year: "2017-2020",
      summary:
        "Hormozi offered 'Lose 20lbs in 6 weeks or your money back + $100.' The risk reversal made it impossible to say no. Built to $75M/yr.",
    },
    hot: true,
    related: ["value-equation", "value-ladder", "hook-story-offer"],
    tags: ["offers", "hormozi", "guarantee", "risk", "conversion"],
  },

  /* ──────────── More Psychology ──────────── */
  {
    slug: "processing-fluency",
    name: "Processing Fluency",
    short: "Content that's easy to process is judged as more trustworthy and likable.",
    category: "copy",
    origin: "Alter & Oppenheimer, 2009",
    body: "Processing fluency is the ease with which information is processed. Content that's easy to read (short words, short sentences, familiar metaphors) is unconsciously judged as more true, more likable, and more likely to be acted upon. This is why simple language outperforms jargon — not because audiences are dumb, but because cognitive cost is a tax on attention. The fluency score: F = 1 / (1 + syllables_per_word × words_per_sentence / 10). Target F > 0.7.",
    case_study: {
      title: "Obama's 'Hope' poster",
      subject: "Barack Obama",
      year: "2008",
      summary:
        "One word. Maximum fluency. One of the most effective political marketing pieces in history.",
    },
    hot: false,
    related: ["voice-of-customer", "reason-why", "headline"],
    tags: ["copy", "psychology", "fluency", "simplicity", "cognitive-load"],
  },
];

export const TERMS_BY_CATEGORY = TERMS.reduce(
  (acc, t) => {
    (acc[t.category] = acc[t.category] || []).push(t);
    return acc;
  },
  {} as Record<string, Term[]>,
);

export const TERMS_BY_SLUG = TERMS.reduce(
  (acc, t) => {
    acc[t.slug] = t;
    return acc;
  },
  {} as Record<string, Term>,
);

export const HOT_TERMS = TERMS.filter((t) => t.hot);

export const CATEGORY_LABELS: Record<string, string> = {
  strategy: "Strategy",
  tribe: "Tribe & Audience",
  copy: "Copywriting",
  funnel: "Funnel & Growth",
  analytics: "Analytics & Metrics",
  pricing: "Pricing & Offers",
  growth: "Growth",
  content: "Content",
  pr: "PR & Earned",
  automation: "Automation",
  data: "Data & Intelligence",
  brand: "Brand",
};

export function searchTerms(q: string): Term[] {
  if (!q || !q.trim()) return TERMS;
  const needle = q.toLowerCase();
  return TERMS.filter(
    (t) =>
      t.name.toLowerCase().includes(needle) ||
      t.short.toLowerCase().includes(needle) ||
      t.tags.some((tag) => tag.toLowerCase().includes(needle)) ||
      t.body.toLowerCase().includes(needle),
  );
}
