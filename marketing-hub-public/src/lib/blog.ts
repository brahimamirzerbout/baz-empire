/**
 * Blog seed posts — derived from the Lexicon.
 * Each post is a long-form essay (markdown-ish) that introduces a concept,
 * explains who coined it, gives a quick playbook, and CTAs to /leads.
 *
 * Hand-authored so they read like a real founder blog, not generated fluff.
 */

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string; // 1-2 sentence teaser
  category:
    "strategy" | "copy" | "tribe" | "growth" | "brand" | "pricing" | "analytics" | "automation";
  author: string; // Display name
  publishedAt: number; // ms epoch
  readMinutes: number;
  tags: string[];
  body: string; // markdown-lite (paragraphs + headings + lists)
  relatedLexicon?: string[]; // slugs
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "stp-the-spine-of-every-winning-campaign",
    title: "STP: the spine of every campaign that ever won",
    excerpt:
      "Most marketing fails at the targeting step. Trying to be for everyone means being for no one. Here's the 60-year-old framework that still separates winners from noise.",
    category: "strategy",
    author: "Brahim · BAZ Empire",
    publishedAt: Date.now() - 1000 * 60 * 60 * 24 * 7, // 7 days ago
    readMinutes: 5,
    tags: ["strategy", "STP", "Kotler", "positioning"],
    relatedLexicon: ["stp", "positioning"],
    body: `Most marketing fails at the targeting step. Trying to be for everyone means being for no one.

## What STP actually is

Philip Kotler gave us three letters in the 1960s and they remain the spine of every campaign that ever won:

- **Segmentation.** Divide the market into groups of people with similar needs. Not by demographics first — by what they're trying to do, what they're afraid of, what would make them cry with relief.
- **Targeting.** Pick the one group you can win. The one you can be the obvious choice for, with the resources you have, in the time you have.
- **Positioning.** Write the one sentence that makes them choose you. The promise in their language, not yours.

## Why most teams skip it

Because it's hard. Segmentation requires you to say "no" to people you could serve. Targeting means watching competitors take the rest. Positioning means condensing your entire worldview into a sentence your customer says back to you at dinner.

So most teams skip straight to tactics. They run ads, write copy, build landing pages. They confuse motion for progress. Three months in, the metrics are flat and they hire another agency.

## The 90-minute STP workshop

Pick the next campaign. Spend 90 minutes on STP before any tactics. Use this template:

1. List 10 customers who love you. Why? What did they look like before they found you?
2. Cluster them. You'll find 2-3 segments, not 10.
3. Pick one. The one where you have the most unfair advantage.
4. Write the positioning in their words. "We help [segment] do [dream outcome] without [sacrifice]."

That's it. Tactics will get 10x easier. Your cost of acquisition will halve. You'll know which channels to ignore.

## The BAZ Empire take

The Marketing Hub's Cockpit scores your STP fit on the Patrick Number. Run a free audit at [/leads](/leads) — we'll show you which segment your current copy is actually written for, and which one it should be.`,
  },
  {
    slug: "permission-marketing-still-wins",
    title: "Permission marketing still wins (and interruption is dying faster than you think)",
    excerpt:
      "Seth Godin wrote the book on permission in 1999. Twenty-six years later, every platform is forcing it back into your funnel. Here's the playbook.",
    category: "growth",
    author: "Brahim · BAZ Empire",
    publishedAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    readMinutes: 4,
    tags: ["permission", "Seth Godin", "email", "list-building"],
    relatedLexicon: ["permission-marketing", "smallest-viable-audience"],
    body: `Seth Godin wrote *Permission Marketing* in 1999. The thesis was simple: interruption is a loan, not income. Eventually the lender calls it.

Twenty-six years later, the loan has been called. Safari kills third-party cookies. iOS kills email pixels. YouTube kills pre-roll. TikTok kills anything that doesn't grab in 1.2 seconds. RSS, the original permission channel, has quietly outlived three of its killers.

## The math of interruption vs permission

- **Interruption.** Reach 100,000. Convert 0.5%. Pay $20 CAC. Earn $50 LTV. Margin: razor-thin. One platform change and you're negative.
- **Permission.** Reach 5,000 (your list). Convert 8%. Pay $1.50 CAC (just the email tool). Earn $120 LTV (because you earned the right to upsell). Margin: fat. The platform can't take it away.

## The 4-step permission playbook

1. **Earn the first attention.** A free thing of real value — not a PDF of "5 tips," but something they'd actually pay for.
2. **Deliver more than promised.** Over-deliver on day one so day two feels safe.
3. **Ask for the next step.** A second free thing. A category. A small commitment. Don't jump to the sale.
4. **Treat the list like a garden.** Segment by what they read. Remove people who never open. Water the ones who do.

## What we built

The Hub has a permission-first architecture: every form captures emails into a segmented list, every sequence starts with value, every automation respects opt-out. The Library, Lexicon, and Wire are the bait. The Cockpit shows you who's paying attention.

Start your own 7-day sprint at [/leads](/leads).`,
  },
  {
    slug: "smallest-viable-audience-not-target-market",
    title: "Smallest Viable Audience isn't your target market. It's smaller.",
    excerpt:
      "Seth Godin's most underrated idea: don't aim for the biggest group you can serve. Aim for the smallest group you can change.",
    category: "tribe",
    author: "Brahim · BAZ Empire",
    publishedAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    readMinutes: 4,
    tags: ["SVA", "Seth Godin", "niche", "tribe"],
    relatedLexicon: ["smallest-viable-audience", "tribe"],
    body: `Most marketers think "niche" means "industry vertical." B2B SaaS for dentists. Yoga studios in Brooklyn. SaaS for plumbers.

Seth Godin's Smallest Viable Audience is smaller than that. Much smaller.

## The difference

- **Target market.** The largest group you could plausibly serve.
- **Smallest Viable Audience.** The smallest group that, if they loved you, would tell everyone who matters.

A SaaS for dentists is a target market. A SaaS for the 200 dentists in Austin who are early adopters and tweet about their practices — that's an SVA. You can be the obvious choice for 200 people. You can't be the obvious choice for 200,000.

## Why SVA works

Because leadership isn't about size. It's about density. If 200 people who all talk to each other are obsessed with you, you have a movement. If 200,000 people have vaguely heard of you, you have noise.

## The test

Ask yourself: if my product disappeared tomorrow, would the people I serve actually notice? Not "would they be mildly inconvenienced" — would they feel a void? If yes, you have an SVA. If no, you're selling to a market, not leading a tribe.

## The BAZ Empire take

The Hub's Marketplace is built around SVA thinking. We list 12 marketers — Seth, Gary Vee, Alex Hormozi, Sabri Suby — not because they're famous, but because each has a tiny, dense tribe of operators who treat their work as scripture. We don't list 1,000 "marketing consultants." We list the 12 who actually changed the game.

Find your SVA: [/leads](/leads).`,
  },
  {
    slug: "the-grand-slam-offer",
    title: "The Grand Slam Offer: Hormozi's formula and where it breaks",
    excerpt:
      "Dream outcome × perceived likelihood / (time × effort × sacrifice). The math is seductive. The execution is brutal. Here's where it actually breaks.",
    category: "pricing",
    author: "Brahim · BAZ Empire",
    publishedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    readMinutes: 6,
    tags: ["offer", "Hormozi", "pricing", "value-stack"],
    relatedLexicon: ["grand-slam-offer", "value-stack"],
    body: `Alex Hormozi wrote *\$100M Offers* in 2021. The thesis is a deceptively simple formula:

> Value = (Dream Outcome × Perceived Likelihood of Achievement) / (Time Delay × Effort & Sacrifice)

The book is worth the \$25. The formula is good. But where it **breaks** is where most founders lose their shirts.

## Where the formula works

When you have a clearly defined dream outcome, a track record of delivering it, and a price that lets you absorb the cost of delivery. The math scales beautifully when you control all four variables.

## Where it breaks

**Time Delay.** Almost every business underestimates this. The customer thinks "instant." You know it takes 6 weeks. If your copy doesn't reset the expectation, the perceived value drops to zero on day 8.

**Effort & Sacrifice.** This is the part Hormozi glosses over. *The customer's* effort and sacrifice, not yours. If they have to learn a new tool, fire their current vendor, get sign-off from procurement, train their team — you've added three sacrifices you didn't price in.

**Perceived Likelihood.** This is the variable you control with case studies, guarantees, and brand. It's also the one that erodes fastest. If you say "10x your pipeline" and you don't have 5 customer logos proving it, the perceived likelihood is zero regardless of the math.

## The BAZ Empire take

We ship the formula into the Hub's Library — 26 formulas with input + output examples you can run on your own offer. Then we audit yours at [/leads](/leads) — Hormozi lens, no fluff, scored 0-100.

The score tells you exactly which of the four variables to fix first.`,
  },
  {
    slug: "the-im-me-test",
    title: "The IM ME Test: a 4-word filter for everything you ship",
    excerpt:
      "Would your customer tell a friend about you? Would they put it on their résumé? Would they miss it if it were gone? If not, it's not remarkable.",
    category: "brand",
    author: "Brahim · BAZ Empire",
    publishedAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
    readMinutes: 3,
    tags: ["Purple Cow", "Seth Godin", "remarkability", "positioning"],
    relatedLexicon: ["im-me-test", "remarkability"],
    body: `Seth Godin gave us the Purple Cow. Inside the Purple Cow is a 4-word filter that decides whether anything you ship deserves to exist:

> "I'm me." — said by your customer about themselves, after using your thing.

## The test

Ask four questions about the customer experience:

1. **I** — Are *I* (the customer) the centre, or am I a data point?
2. **M** — Is this for *me* specifically, or is this for "everyone"?
3. **M** — Does this *matter* to me, or am I just being marketed at?
4. **E** — Is this an *experience* I want to repeat, or a transaction I want to forget?

If the answer to any of those is "no" or "kind of," it's not remarkable. It's not even worth shipping.

## Why this is hard

Because "for everyone" is the default. Mass marketing is the default. Generic landing pages are the default. Personalised, specific, opinionated work is rare — which is exactly why it works when you do it.

## The 30-day IM ME test

Pick one piece of your funnel. Your home page. Your onboarding. Your pricing page. Apply the test. If it fails, rewrite it for *one specific person* — not a persona, an actual person you know. Watch the conversion change.

## The BAZ Empire take

The Hub is opinionated. The Lexicon defines words the way Seth and Kotler mean them, not the way a content marketer would rephrase them. The audit gives you a real grade, not a vanity score. The Patrick Number shows you the one number that matters, not 47.

See how opinionated it is: [/leads](/leads).`,
  },
  {
    slug: "5-levels-of-awareness",
    title: "5 Levels of Awareness: Schwartz's 1966 framework still writes the best copy",
    excerpt:
      "Unaware → Problem Aware → Solution Aware → Product Aware → Most Aware. Most copy fails because it pitches to the wrong level. Here's the fix.",
    category: "copy",
    author: "Brahim · BAZ Empire",
    publishedAt: Date.now() - 1000 * 60 * 60 * 60 * 18,
    readMinutes: 5,
    tags: ["Eugene Schwartz", "copywriting", "awareness", "headline"],
    relatedLexicon: ["5-levels-of-awareness", "market-sophistication"],
    body: `Eugene Schwartz wrote *Breakthrough Advertising* in 1966. It's still the best book on copywriting ever written, and 90% of marketers haven't read it.

The single most useful idea in the book is the **5 Levels of Awareness**:

1. **Unaware.** They don't know they have the problem. ("I'm not tired, I'm just busy.")
2. **Problem Aware.** They know the problem, don't know solutions exist. ("I'm tired all the time.")
3. **Solution Aware.** They know solutions exist, don't know your product. ("I've heard caffeine pills might help.")
4. **Product Aware.** They know your product, haven't bought. ("Nootropics look interesting but I don't know which.")
5. **Most Aware.** They know your product, just need a reason to buy now. ("Stack X is on sale, I should buy today.")

## The mistake

Most copy is written for Level 5 ("Buy now! 20% off!") and shown to Level 2 audiences. It doesn't land.

- A Level 2 person needs the problem explained and named before they care about your solution.
- A Level 3 person needs to see how your solution compares to alternatives.
- A Level 4 person needs proof, case studies, specifics.
- A Level 5 person needs urgency, scarcity, or a deal.

## The Schwartz test

Before you write a headline, ask: what level is the audience I'm targeting? Then write the headline for *that* level. Not for all five at once.

## The BAZ Empire take

The Hub's Lexicon defines the 5 levels with examples and case studies. The Studio Pro copy generator asks you which level before drafting. The Audit scores your headlines against the right level.

Try the free audit: [/leads](/leads).`,
  },
  {
    slug: "5-stages-of-market-sophistication",
    title: "5 Stages of Market Sophistication: why your launch copy feels flat",
    excerpt:
      "Stage 1 markets explain the mechanism. Stage 5 markets can't even use the word. Eugene Schwartz mapped the entire curve — and most teams copy Stage 1 tactics in Stage 4 markets.",
    category: "copy",
    author: "Brahim · BAZ Empire",
    publishedAt: Date.now() - 1000 * 60 * 60 * 60 * 12,
    readMinutes: 5,
    tags: ["Eugene Schwartz", "market sophistication", "headline", "copy"],
    relatedLexicon: ["5-stages-of-market-sophistication", "5-levels-of-awareness"],
    body: `If you've ever written copy that "should have worked" but didn't, this is why.

Eugene Schwartz identified 5 stages of market sophistication. As a market matures, the *mechanism* you can advertise becomes louder, more obvious, more crowded.

## The 5 stages

1. **Stage 1.** No one knows the mechanism works. You explain it. "How I grew tomatoes in my basement using ultraviolet light." (Pure mechanism copy.)
2. **Stage 2.** A few competitors exist. You differentiate on *how* the mechanism works. "My system uses 365nm UV, theirs uses 395nm."
3. **Stage 3.** Crowded. You claim *better* results. "Grow 3x more tomatoes in half the time."
4. **Stage 4.** The mechanism is assumed. You compete on *identity*. "Join 12,000 serious growers who won't settle for grocery-store tomatoes."
5. **Stage 5.** The mechanism and identity are exhausted. Only *identification with a tribe* works. "If you believe food should be grown, not shipped, this is for you."

## Why most copy feels flat

Because most teams are still writing Stage 1 copy ("our product does X") in Stage 3 markets where the customer has heard X from 50 vendors.

## The fix

1. Diagnose what stage your market is in. (Harder than it sounds — talk to 10 customers.)
2. Write copy one stage *below* where you think you are. (Customers are always more sophisticated than you think.)
3. As you scale, *move up the stages*. Stage 1 → 2 → 3 over years, not weeks.

## The BAZ Empire take

The Hub's Lexicon has the framework. The Library has the formulas. The Audit tells you where your market is and what stage your copy is actually written for.

Get the audit: [/leads](/leads).`,
  },
  {
    slug: "aida-1898-and-still-alive",
    title: "AIDA is 127 years old. It still works.",
    excerpt:
      "Attention. Interest. Desire. Action. E. St. Elmo Lewis published this in 1898. It's still the spine of every high-converting page on the web.",
    category: "copy",
    author: "Brahim · BAZ Empire",
    publishedAt: Date.now() - 1000 * 60 * 60 * 60 * 6,
    readMinutes: 4,
    tags: ["AIDA", "copywriting", "funnel", "conversion"],
    relatedLexicon: ["aida", "pas", "bab"],
    body: `In 1898, E. St. Elmo Lewis published a four-letter framework for salesmanship:

**A**ttention → **I**nterest → **D**esire → **A**ction.

127 years later, every high-converting page on the web follows the same sequence. TikTok ads. Cold emails. Sales calls. Even Nobel-level lectures.

## Why it works

Because the human brain still works the same way it did in 1898. We can't want something we don't notice. We can't consider something that doesn't interest us. We can't buy something we don't desire. We can't act without a reason.

## Where each step breaks

- **Attention.** Lost in 1.2 seconds on TikTok, 8 seconds on a landing page. Fix: a specific, opinionated headline.
- **Interest.** Lost if the next sentence is generic. Fix: a sub-headline that names the dream outcome.
- **Desire.** Lost if you don't show it working. Fix: a case study, a screenshot, a number.
- **Action.** Lost if there's friction. Fix: one CTA, no signup wall, no "learn more."

## AIDA vs PAS vs BAB

- **AIDA** is the universal structure. Use it for any conversion.
- **PAS** (Problem → Agitate → Solution) is for cold outreach where the prospect is unaware.
- **BAB** (Before → After → Bridge) is for case studies and testimonials.

Pick the right one for the channel and the audience. They're all variants of the same idea.

## The BAZ Empire take

The Hub's Library has all three frameworks with templates. The Studio Pro generator lets you pick the model before drafting. The Audit scores your existing copy against the right one.

Try the audit: [/leads](/leads).`,
  },
  {
    slug: "the-flywheel-vs-the-funnel",
    title: "The Flywheel beats the Funnel (and HubSpot figured this out 8 years too late)",
    excerpt:
      "Funnels assume customers fall out the bottom. Flywheels assume customers power the next revolution. Same customers, different physics.",
    category: "growth",
    author: "Brahim · BAZ Empire",
    publishedAt: Date.now() - 1000 * 60 * 60 * 60 * 3,
    readMinutes: 4,
    tags: ["flywheel", "funnel", "HubSpot", "retention"],
    relatedLexicon: ["flywheel", "retention-loop"],
    body: `In 2018, HubSpot announced they were replacing the funnel with the flywheel. It was 30 years too late. The physics were always right.

## The difference

- **Funnel.** Customers enter at the top, fall out at the bottom. You constantly pour new ones in.
- **Flywheel.** Customers enter, get energy from your service, power the next revolution of the wheel, attract the next customer.

Same customers. Different physics. The funnel treats each one as a transaction. The flywheel treats each one as compounding energy.

## Why flywheels win

Because acquisition is the expensive part. Retention is cheap. If your existing customers are your best acquisition channel — through word-of-mouth, reviews, referrals, upsell — your CAC drops to zero over time.

## The flywheel math

- 100 customers, NPS 50, 30% referral rate → 30 new customers/month from existing.
- Acquisition cost: ~\$0 for referred, full CAC for cold.
- Over 12 months, your blended CAC drops 40-70%.

## How to build one

1. **Make the product so good the customer would notice if it disappeared.** (See: IM ME Test.)
2. **Instrument the share moment.** Built-in referral links, public reviews, share-on-social CTAs *in the product*.
3. **Reward the referrer and the referred.** Two-sided incentives work.
4. **Measure the wheel.** Track NPS, referral rate, second-order revenue.

## The BAZ Empire take

The Hub's Cockpit shows you your flywheel score on the Patrick Number. Your retention cohort, your NPS, your referral rate — all in one place. The Audit tells you where the friction is.

See your score: [/leads](/leads).`,
  },
  {
    slug: "marketing-myopia-is-still-the-best-business-book-ever",
    title: "Marketing Myopia is 65 years old. It's still the best business book ever written.",
    excerpt:
      "Levitt asked one question in 1960: what business are you really in? Railroads thought they were in railroads. They were in transportation. Hollywood thought it was in movies. It was in stories.",
    category: "strategy",
    author: "Brahim · BAZ Empire",
    publishedAt: Date.now() - 1000 * 60 * 60 * 30, // 30 min ago
    readMinutes: 6,
    tags: ["Theodore Levitt", "strategy", "positioning", "purpose"],
    relatedLexicon: ["marketing-myopia", "purpose"],
    body: `Theodore Levitt published "Marketing Myopia" in the *Harvard Business Review* in 1960. It's a 12-page article that's more useful than most business books published since.

The thesis: companies fail when they define their business by the product, not by the purpose.

## The examples that built the argument

- **Railroads.** Defined themselves as "in the railroad business." They were in transportation. They lost to trucks, planes, and cars.
- **Hollywood.** Defined itself as "in the movie business." It was in stories. TV won the storytelling wars.
- **Oil companies.** Defined themselves as "in the oil business." They're in energy. They're now losing to solar and nuclear.

## How to apply it today

Ask yourself: if my product disappeared tomorrow, what would my customer lose?

- If they lose *your product*, you have a product business. Fragile.
- If they lose *the outcome your product enables*, you have a purpose business. Durable.

The Hub is not a "marketing automation tool." It's a revenue engine for sovereign operators. If we disappear, operators don't lose "a tool" — they lose the ability to run their entire business from one place. That's harder to replicate.

## The Levitt questions

Use these quarterly:

1. What business are we really in?
2. Who are our customers, really? (Not "ICP" — actual humans.)
3. What would our customers miss if we disappeared?
4. What industry are we adjacent to that could subsume us?
5. What would we have to become to win in 10 years?

If the answers scare you, you're thinking clearly.

## The BAZ Empire take

The Hub's Strategy section makes you answer those questions. The Patrick Number scores how well your answers match your actions. The Library has Levitt's framework in actionable form.

Build the purpose, not the product: [/leads](/leads).`,
  },
];

export const BLOG_CATEGORIES: { id: BlogPost["category"]; label: string; description: string }[] = [
  {
    id: "strategy",
    label: "Strategy",
    description: "STP, positioning, myopia, the decisions that compound.",
  },
  { id: "copy", label: "Copywriting", description: "Schwartz, AIDA, headlines that ship." },
  { id: "tribe", label: "Tribe & Brand", description: "Seth Godin's SVA, Purple Cow, IM ME Test." },
  {
    id: "growth",
    label: "Growth",
    description: "Funnels, flywheels, permission, retention loops.",
  },
  { id: "brand", label: "Brand", description: "What makes you remarkable, not just visible." },
  {
    id: "pricing",
    label: "Pricing & Offer",
    description: "Hormozi's Grand Slam, value stacks, guarantees.",
  },
  { id: "analytics", label: "Analytics", description: "Numbers that matter vs. numbers that lie." },
  { id: "automation", label: "Automation", description: "The 1% of automation that compounds." },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const post = getBlogPost(slug);
  if (!post) return BLOG_POSTS.slice(0, limit);
  return BLOG_POSTS.filter((p) => p.slug !== slug)
    .map((p) => {
      let score = 0;
      if (p.category === post.category) score += 3;
      score += p.tags.filter((t) => post.tags.includes(t)).length;
      score +=
        (p.relatedLexicon ?? []).filter((l) => (post.relatedLexicon ?? []).includes(l)).length * 2;
      return { post: p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.post);
}
