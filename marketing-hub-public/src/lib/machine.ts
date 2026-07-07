/**
 * The Content Machine — Gary Vaynerchuk's framework codified.
 *
 * Core idea: "Document, don't create." One big moment → 30+ platform-native
 * derivative assets. The marketer's job shifts from making content to
 * CAPTURING content, then the machine multiplies it.
 *
 * Philosophy (Gary Vee):
 *   - Attention is the only稀缺 resource. Buy it with volume, not polish.
 *   - Jab, jab, jab, right hook. Give value at scale. Then ask once.
 *   - One piece of pillar content per week is enough. The work is the
 *     repurpose, not the original recording.
 *   - Platform-native ≠ cross-post. LinkedIn ≠ Twitter ≠ Instagram. Each
 *     format rewards different shapes. The machine respects the difference.
 *   - Document the work you're already doing. The market is starving for
 *     authenticity, not produced content.
 */

export type Platform =
  | "linkedin_post"
  | "linkedin_carousel"
  | "twitter_thread"
  | "twitter_post"
  | "instagram_carousel"
  | "instagram_reel"
  | "youtube_short"
  | "tiktok"
  | "newsletter"
  | "blog_post"
  | "podcast_clip";

export type PillarSource =
  | "podcast"
  | "keynote"
  | "customer_call"
  | "blog_post"
  | "video"
  | "note"
  | "meeting"
  | "interview"
  | "screen_recording";

export interface PlatformSpec {
  id: Platform;
  label: string;
  cadence: string; // recommended posting cadence
  hook_window_sec: number; // seconds before scroll-away
  format: "text" | "thread" | "carousel" | "script" | "long_form" | "video";
  max_length?: number;
  best_for: string;
  gary_take: string; // Gary's lens on this platform
}

export const PLATFORMS: Record<Platform, PlatformSpec> = {
  linkedin_post: {
    id: "linkedin_post",
    label: "LinkedIn Post",
    cadence: "1/day (5/week)",
    hook_window_sec: 3,
    format: "text",
    max_length: 3000,
    best_for: "B2B, founder stories, professional credibility",
    gary_take:
      "Document the work. Show receipts. Long-form storytelling with line breaks. The algorithm rewards dwell time — give them something worth sitting with.",
  },
  linkedin_carousel: {
    id: "linkedin_carousel",
    label: "LinkedIn Carousel (PDF)",
    cadence: "2/week",
    hook_window_sec: 2,
    format: "carousel",
    max_length: 10,
    best_for: "Frameworks, lists, case studies, how-tos",
    gary_take:
      "10 slides. Slide 1 is the hook — make it punch. Last slide is the CTA. Every slide is a billboard for the next.",
  },
  twitter_thread: {
    id: "twitter_thread",
    label: "Twitter/X Thread",
    cadence: "1/day",
    hook_window_sec: 1,
    format: "thread",
    max_length: 25,
    best_for: "Bite-sized frameworks, hot takes, document-in-public",
    gary_take:
      "Tweet 1 sells the next tweet. Thread = free ebook. Tweet the lesson, then link to the proof.",
  },
  twitter_post: {
    id: "twitter_post",
    label: "Twitter/X Post",
    cadence: "3-5/day",
    hook_window_sec: 1,
    format: "text",
    max_length: 280,
    best_for: "Hot takes, observations, document-the-grind",
    gary_take:
      "Volume. Document the meeting, the rejection, the breakthrough. Nobody else is shipping at your cadence.",
  },
  instagram_carousel: {
    id: "instagram_carousel",
    label: "Instagram Carousel",
    cadence: "2/week",
    hook_window_sec: 2,
    format: "carousel",
    max_length: 10,
    best_for: "Visual brand, lifestyle, behind-the-scenes",
    gary_take:
      "Slide 1 is the pattern interrupt. Every slide teaches one thing. The save-rate is the metric that matters.",
  },
  instagram_reel: {
    id: "instagram_reel",
    label: "Instagram Reel",
    cadence: "4-7/week",
    hook_window_sec: 2,
    format: "video",
    max_length: 90,
    best_for: "Personality, energy, quick wins",
    gary_take:
      "First frame is everything. If they don't stop in 2 seconds, you lost. Speak to the camera like one human.",
  },
  youtube_short: {
    id: "youtube_short",
    label: "YouTube Short",
    cadence: "4-7/week",
    hook_window_sec: 2,
    format: "video",
    max_length: 60,
    best_for: "Tutorials, lists, storytime",
    gary_take:
      "Title is the thumbnail is the hook. One idea per short. Ship 7 this week, not 1 perfect one.",
  },
  tiktok: {
    id: "tiktok",
    label: "TikTok",
    cadence: "5-10/week",
    hook_window_sec: 1,
    format: "video",
    max_length: 90,
    best_for: "Younger audience, trending sounds, raw authenticity",
    gary_take: "Lo-fi wins. Phone footage. Native feel. The moment you look produced, you lose.",
  },
  newsletter: {
    id: "newsletter",
    label: "Newsletter",
    cadence: "1/week",
    hook_window_sec: 5,
    format: "long_form",
    max_length: 2500,
    best_for: "Owned audience, deep trust, monetization",
    gary_take:
      "Subject line is 90% of the open. One story, one lesson, one ask. Skip the corporate throat-clearing.",
  },
  blog_post: {
    id: "blog_post",
    label: "Blog Post (SEO)",
    cadence: "2-4/month",
    hook_window_sec: 8,
    format: "long_form",
    max_length: 5000,
    best_for: "Search traffic, evergreen authority, linkable content",
    gary_take:
      "Write the thing you'd want to read. Then ship it without edit-perfection. Compound over years.",
  },
  podcast_clip: {
    id: "podcast_clip",
    label: "Podcast Clip (60s)",
    cadence: "5-10/week",
    hook_window_sec: 5,
    format: "video",
    max_length: 60,
    best_for: "Repurposing long interviews, virality, deep distribution",
    gary_take:
      "One insight per clip. The clip's job is to make them find the full episode. Don't spoil the meal.",
  },
};

/** Extract key insights from a long-form piece by simple heuristic chunking. */
export function extractInsights(rawContent: string, maxInsights = 7): string[] {
  // Split by sentence boundaries, group into ~3-sentence chunks, dedupe by length.
  const sentences = rawContent
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20 && s.length < 400);

  if (!sentences.length) return [];

  const insights: string[] = [];
  const chunkSize = 3;
  for (let i = 0; i < sentences.length && insights.length < maxInsights; i += chunkSize) {
    const chunk = sentences.slice(i, i + chunkSize).join(" ");
    if (chunk.length > 30 && chunk.length < 600) insights.push(chunk);
  }
  return insights;
}

/** Generate a hook (opening line) for a given insight + platform. */
export function generateHook(insight: string, platform: Platform): string {
  const spec = PLATFORMS[platform];
  const firstSentence = insight.split(/[.!?]/)[0].trim();
  const shortInsight =
    firstSentence.length > 60 ? firstSentence.slice(0, 57) + "..." : firstSentence;

  const hooks: Record<Platform, string[]> = {
    linkedin_post: [
      `I spent ${20 + Math.floor(Math.random() * 200)} hours learning this so you don't have to:\n\n${shortInsight}`,
      `Most people get this wrong.\n\nHere's what actually works:`,
      `Unpopular opinion from ${20 + Math.floor(Math.random() * 20)} years in the trenches:`,
      `I wrote this down because I keep forgetting:\n\n${shortInsight}`,
      `The brutal truth nobody wants to hear:`,
    ],
    linkedin_carousel: [
      `${Math.floor(Math.random() * 9) + 3} things I wish I knew before starting.\n\n(Save this carousel — you'll need it.)`,
      `If I had to start over, here's exactly what I'd do:`,
      `The framework I use with every client:`,
    ],
    twitter_thread: [
      `I spent a decade learning this.\n\nHere's everything in ${Math.floor(Math.random() * 12) + 5} tweets 🧵`,
      `Stop scrolling. This thread will save you ${Math.floor(Math.random() * 12) + 6} months.`,
      `The cheat code most people will never share:`,
    ],
    twitter_post: [
      `${shortInsight}`,
      `Unpopular opinion:`,
      `This is the most important thing I'll tweet this year.`,
      `Real ones know:`,
    ],
    instagram_carousel: [
      `${Math.floor(Math.random() * 7) + 3} lessons that changed my life (save this post)`,
      `The cheat codes nobody tells you about`,
      `Bookmark this. You'll need it.`,
    ],
    instagram_reel: [
      `POV: You just figured out ${shortInsight.toLowerCase()}`,
      `Nobody talks about this but:`,
      `The #1 mistake I see every day:`,
      `Watch this if you want to win.`,
    ],
    youtube_short: [
      `The mistake that cost me ${Math.floor(Math.random() * 6) + 2} years (here's how to avoid it)`,
      `99% of people get this wrong. Here's the right way.`,
      `I tried this for 30 days. Here's what happened.`,
    ],
    tiktok: [
      `Tell me you [do X] without telling me you [do X].\n\nMe:`,
      `The advice nobody gives you about [topic]:`,
      `Things that just make sense:`,
    ],
    newsletter: [
      `The one thing I learned this week:`,
      `A story I keep coming back to:`,
      `I almost didn't send this. Then I remembered:`,
    ],
    blog_post: [
      `# ${insight.slice(0, 80)}\n\nLast updated: ${new Date().toLocaleDateString()}\n\nMost [people] get this wrong. Here's what's actually true — and how to use it today.`,
    ],
    podcast_clip: [`[CLIP INTRO]\n"${shortInsight}"\n\n[FULL EPISODE LINK IN COMMENTS]`],
  };

  const opts = hooks[platform] || [shortInsight];
  return opts[Math.floor(Math.random() * opts.length)];
}

/** Generate a CTA for a given platform + insight. */
export function generateCTA(platform: Platform, brandName?: string): string {
  const name = brandName || "us";
  const ctas: Record<Platform, string[]> = {
    linkedin_post: [
      `If this was useful, a comment with your biggest takeaway helps the algorithm.`,
      `Repost if you know someone who needs this. ♻️`,
      `Follow ${name} for more like this.`,
    ],
    linkedin_carousel: [
      `Save this carousel. You'll reference it again.`,
      `Tag someone who needs to see this.`,
    ],
    twitter_thread: [
      `If this helped, retweet tweet 1. It means the world.`,
      `Follow for more threads like this.`,
    ],
    twitter_post: [`Reply if you agree.`],
    instagram_carousel: [`Save this post for later.`],
    instagram_reel: [`Follow for more.`],
    youtube_short: [`Subscribe for weekly videos.`],
    tiktok: [`Follow for part 2.`],
    newsletter: [`Hit reply — I read every email.`, `Forward this to one person who needs it.`],
    blog_post: [
      `Want more like this? Subscribe to the newsletter.`,
      `Have a take? Leave a comment.`,
    ],
    podcast_clip: [`Full episode → link in bio / comments`],
  };
  const opts = ctas[platform] || [""];
  return opts[Math.floor(Math.random() * opts.length)];
}

/** Generate platform-appropriate hashtags. */
export function generateHashtags(platform: Platform, topic: string): string[] {
  const core = ["marketing", "business", "growth", "content", "founder"];
  const fromTopic = topic
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 3)
    .slice(0, 3);
  const platformHashtags: Record<Platform, string[]> = {
    linkedin_post: ["leadership", "strategy"],
    linkedin_carousel: ["carousel", "framework"],
    twitter_thread: ["thread", "🧵"],
    twitter_post: [],
    instagram_carousel: ["reels", "growth"],
    instagram_reel: ["reels", "fyp"],
    youtube_short: ["shorts", "tutorial"],
    tiktok: ["fyp", "viral"],
    newsletter: [],
    blog_post: [],
    podcast_clip: ["podcast"],
  };
  const out = [...new Set([...core, ...fromTopic, ...(platformHashtags[platform] || [])])];
  return out.slice(0, platform === "twitter_post" || platform === "twitter_thread" ? 4 : 8);
}

/**
 * The full repurpose engine — given a pillar piece, generate derivatives
 * for all selected platforms.
 */
export interface RepurposeRequest {
  pillar_id: string;
  pillar_title: string;
  raw_content: string;
  platforms: Platform[];
  brand_name?: string;
}

export interface RepurposeAsset {
  pillar_id: string;
  pillar_title: string;
  platform: Platform;
  format: PlatformSpec["format"];
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
  insight_index: number;
  insight_source: string;
  gary_take: string;
  estimated_reach: string;
}

export function repurpose(req: RepurposeRequest, insights: string[]): RepurposeAsset[] {
  const out: RepurposeAsset[] = [];
  const useInsights = insights.length ? insights : extractInsights(req.raw_content);

  for (const platform of req.platforms) {
    const spec = PLATFORMS[platform];
    useInsights.slice(0, spec.max_length || 3).forEach((insight, i) => {
      const hook = generateHook(insight, platform);
      const cta = generateCTA(platform, req.brand_name);
      const hashtags = generateHashtags(platform, req.pillar_title);
      const body = composeBody(platform, hook, insight, cta, hashtags, req.brand_name);

      out.push({
        pillar_id: req.pillar_id,
        pillar_title: req.pillar_title,
        platform,
        format: spec.format,
        hook,
        body,
        cta,
        hashtags,
        insight_index: i,
        insight_source: insight,
        gary_take: spec.gary_take,
        estimated_reach: estimateReach(platform),
      });
    });
  }
  return out;
}

function composeBody(
  platform: Platform,
  hook: string,
  insight: string,
  cta: string,
  hashtags: string[],
  brand?: string,
): string {
  const tagLine = hashtags.length ? `\n\n${hashtags.map((h) => "#" + h).join(" ")}` : "";
  switch (platform) {
    case "linkedin_post":
      return `${hook}\n\n${insight}\n\n${cta}${tagLine}`;
    case "linkedin_carousel":
      return `SLIDE 1: ${hook}\n\nSLIDE 2: ${insight.slice(0, 200)}\n\nSLIDE 3-${hashtags.length + 3}: [expand each point into a slide]\n\nFINAL SLIDE: ${cta}`;
    case "twitter_thread":
      return `1/ ${hook}\n\n2/ Here's what I mean:\n\n${insight.slice(0, 240)}\n\n3/ The takeaway:\n\n${cta}${tagLine}`;
    case "twitter_post":
      return `${hook}\n\n${insight.slice(0, 200)}${tagLine}`;
    case "instagram_carousel":
      return `COVER: ${hook}\n\nSLIDE 2: ${insight.slice(0, 180)}\n\nSLIDES 3-${hashtags.length + 3}: [expand]\n\nFINAL: ${cta}${tagLine}`;
    case "instagram_reel":
      return `[HOOK — 0-2s] ${hook}\n\n[BODY — 2-30s]\n${insight}\n\n[CTA — last 5s] ${cta}`;
    case "youtube_short":
      return `[HOOK 0-2s] ${hook}\n\n[BODY 2-50s] ${insight}\n\n[CTA 50-60s] ${cta}`;
    case "tiktok":
      return `[0-1s] ${hook}\n\n[1-60s] ${insight}\n\n[END] ${cta}`;
    case "newsletter":
      return `Subject: ${hook}\n\n---\n\nHey,\n\n${insight}\n\n${cta}\n\n— ${brand || "The team"}`;
    case "blog_post":
      return `# ${hook}\n\n*Published ${new Date().toLocaleDateString()}*\n\n## The context\n\n${insight}\n\n## What this means for you\n\n[Expand with concrete examples.]\n\n## The takeaway\n\n${cta}`;
    case "podcast_clip":
      return `[00:00] ${hook}\n\n[00:05] ${insight}\n\n[00:45] ${cta}`;
  }
}

function estimateReach(platform: Platform): string {
  const ranges: Record<Platform, string> = {
    linkedin_post: "500 — 5,000 impressions · 1-5% engagement",
    linkedin_carousel: "2,000 — 15,000 impressions · high save rate",
    twitter_thread: "1,000 — 20,000 impressions · 5-10% engagement",
    twitter_post: "300 — 5,000 impressions",
    instagram_carousel: "1,000 — 10,000 · saves are the metric",
    instagram_reel: "5,000 — 100,000+ (algorithm-driven)",
    youtube_short: "1,000 — 50,000+ · subscribers matter",
    tiktok: "10,000 — 500,000+ (highest virality ceiling)",
    newsletter: "30-50% open · 5-15% click on good ones",
    blog_post: "compounds for years via SEO",
    podcast_clip: "builds long-form audience",
  };
  return ranges[platform];
}

/** Attention-arbitrage calculator — how much value per minute of work? */
export function attentionArbitrage(
  minutesInvested: number,
  expectedReach: number,
  conversionRate: number,
  ltv: number,
) {
  const reachedCustomers = expectedReach * conversionRate;
  const pipeline = reachedCustomers * ltv;
  const valuePerMinute = pipeline / Math.max(1, minutesInvested);
  return {
    minutes_invested: minutesInvested,
    expected_reach: expectedReach,
    conversion_rate: conversionRate,
    customers_reached: Math.round(reachedCustomers),
    pipeline_value: Math.round(pipeline),
    value_per_minute: Math.round(valuePerMinute),
    verdict:
      valuePerMinute > 100
        ? "outstanding leverage"
        : valuePerMinute > 20
          ? "good leverage"
          : "needs optimization",
  };
}
