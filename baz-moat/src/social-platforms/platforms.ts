/**
 * Platform models — the 7 organic platforms, each its own algorithm + variables.
 *
 * Weights are normalized to 1.0 per platform (verified by test). Every signal is
 * grounded in the platform's own ranking documentation / creator resources + the
 * BAZ lineage. Benchmark sweet-spots (durations, cadence) are [composite] —
 * replace with the client's real performance data before betting spend.
 *
 * The discipline this encodes (Gary Vaynerchuk): the same idea does NOT ship the
 * same way on TikTok and LinkedIn. The algorithm differs, the variables differ,
 * the native format differs. Native dialect, not cross-post.
 */

import type { PlatformModel, SocialPlatform } from "./types.js";

/** TikTok — interest graph (For You), sound-on, hook in the first second. */
export const TIKTOK: PlatformModel = {
  id: "tiktok",
  name: "TikTok",
  doctrine: "Sound-on, vertical, hook in the first second. The For You page is an interest graph — it tests your video on strangers, not followers.",
  graph: "interest",
  algorithm: [
    { id: "watch-time", label: "Watch time", weight: 0.35, why: "Total seconds watched — the dominant For You signal. Retention > reach.", provenance: "[grounded-in: TikTok For You ranking signals]" },
    { id: "completion", label: "Completion rate", weight: 0.20, why: "Watched-to-the-end ratio. Short + tight beats long + loose.", provenance: "[grounded-in: TikTok creator academy]" },
    { id: "shares", label: "Shares (sends)", weight: 0.15, why: "DM shares = strong interest signal; broadens the test pool.", provenance: "[grounded-in: TikTok For You ranking signals]" },
    { id: "comments", label: "Comments", weight: 0.12, why: "Conversation signal; comment-bait hooks lift the test.", provenance: "[grounded-in: TikTok creator academy]" },
    { id: "rewatch", label: "Rewatches", weight: 0.10, why: "Looped rewatch = high value proxy; rewards tight hooks + loops.", provenance: "[grounded-in: TikTok For You ranking signals]" },
    { id: "likes", label: "Likes", weight: 0.08, why: "Weakest signal — a like is one tap, low commitment.", provenance: "[grounded-in: TikTok For You ranking signals]" },
  ],
  variables: [
    { id: "hook", label: "Hook (first 1–3s)", feeds: ["watch-time", "completion"], guidance: "Pattern-interrupt in the first second. State the payoff or the tension before any context.", constraint: "Hook must land in ≤3s or the For You test fails." },
    { id: "duration", label: "Duration", feeds: ["completion", "watch-time"], guidance: "21–34s sweet spot for completion; 60–90s only if retention-tested.", constraint: "[composite] 21–34s default." },
    { id: "trending-audio", label: "Trending audio", feeds: ["watch-time", "rewatch"], guidance: "Ride a trending sound <7 days old. Sound-on is non-negotiable." },
    { id: "on-screen-text", label: "On-screen text (captions)", feeds: ["watch-time", "completion"], guidance: "Burned captions for sound-off + search indexing. Hook text on frame 1." },
    { id: "hashtags", label: "Hashtags", feeds: ["watch-time"], guidance: "3–5, mix one broad + the rest niche. Categorizes for the For You test." },
    { id: "cadence", label: "Cadence", feeds: ["watch-time"], guidance: "1–3/day. Velocity compounds on an interest graph — each post is a new test.", constraint: "[composite] 1–3/day." },
    { id: "trend-recency", label: "Trend recency", feeds: ["watch-time", "shares"], guidance: "Trends decay fast; ride within 7 days or you're late to the test." },
    { id: "creator-led", label: "Creator-led (face/personality)", feeds: ["watch-time", "comments"], guidance: "Face + voice > polished brand ad. The graph rewards humans, not logos." },
  ],
  nativeFormat: { aspect: "9:16 vertical", duration: "21–34s (up to 60–90s if retention-tested)", format: "Reel-style vertical video, sound-on" },
  cadence: "1–3 posts/day",
  reachKiller: "A polished brand ad with no hook in the first second and no trending audio — the For You test fails on strangers and it dies in ~2 hours.",
  provenance: ["[grounded-in: TikTok For You ranking signals, creator academy]", "[grounded-in: Gary Vaynerchuk — platform-native, sound-on]"],
};

/** Instagram — social+interest hybrid; Reels reach, carousels save, stories retain. */
export const INSTAGRAM: PlatformModel = {
  id: "instagram",
  name: "Instagram",
  doctrine: "Reels for reach, carousels for saves, stories for retention. Saves and DM-shares beat likes — they signal intent, not vanity.",
  graph: "social",
  algorithm: [
    { id: "watch-time", label: "Watch time (Reels)", weight: 0.25, why: "Reels reach is retention-driven, same family as TikTok.", provenance: "[grounded-in: Instagram Reels ranking]" },
    { id: "saves", label: "Saves", weight: 0.22, why: "Save = high intent; the strongest feed signal since 2022.", provenance: "[grounded-in: Instagram ranking — saves weighted over likes]" },
    { id: "shares", label: "Shares (to story / DM)", weight: 0.22, why: "DM-share = strongest reach multiplier on Instagram.", provenance: "[grounded-in: Instagram ranking — shares weighted]" },
    { id: "comments", label: "Comments", weight: 0.13, why: "Conversation signal; lifts the early-velocity test.", provenance: "[grounded-in: Instagram feed ranking]" },
    { id: "follows", label: "Follows from post", weight: 0.10, why: "Post-driven follows = strong relevance signal.", provenance: "[grounded-in: Instagram ranking]" },
    { id: "likes", label: "Likes", weight: 0.08, why: "Weakest intent signal — a tap, not a commitment.", provenance: "[grounded-in: Instagram ranking — likes de-weighted since 2022]" },
  ],
  variables: [
    { id: "format", label: "Format (Reel / Carousel / Story / static)", feeds: ["watch-time", "saves", "shares"], guidance: "Reel for reach, Carousel (8–10 slides) for saves, Story for retention. Choose by goal." },
    { id: "hook", label: "Hook (1st frame / 1st 2s)", feeds: ["watch-time", "shares"], guidance: "The 1st frame + 1st 2 seconds decide the Reel test. Text overlay states the payoff." },
    { id: "caption-seo", label: "Caption (SEO + CTA)", feeds: ["saves", "comments"], guidance: "Hook line 1, value body, one CTA. Instagram indexes caption text for search." },
    { id: "hashtags", label: "Hashtags", feeds: ["watch-time"], guidance: "5–10, niche-first. Categorizes for the explore + Reels test.", constraint: "[composite] 5–10." },
    { id: "alt-text", label: "Alt text", feeds: ["saves"], guidance: "Write real alt text — it doubles as discovery + accessibility." },
    { id: "cadence", label: "Cadence", feeds: ["watch-time", "follows"], guidance: "3–5 Reels/week for reach; carousels between.", constraint: "[composite] 3–5 Reels/week." },
    { id: "grid-cohesion", label: "Grid cohesion", feeds: ["follows"], guidance: "Profile converts visits to follows; keep a coherent aesthetic." },
    { id: "dm-cta", label: "DM-able CTA", feeds: ["shares", "comments"], guidance: "Drive DMs ('comment X for the template') — DM-shares are algorithm gold." },
  ],
  nativeFormat: { aspect: "9:16 (Reel) / 1:1 or 4:5 (Carousel)", duration: "Reel 7–15s / Carousel 8–10 slides", format: "Reel for reach, Carousel for saves" },
  cadence: "3–5 Reels/week",
  reachKiller: "A static post with an outbound link in the caption — the algorithm punishes off-platform exits; reach collapses.",
  provenance: ["[grounded-in: Instagram ranking — saves/shares weighted over likes since 2022]", "[grounded-in: Gary Vaynerchuk — document, don't create]"],
};

/** YouTube — search + recommendations; CTR × retention × session time. */
export const YOUTUBE: PlatformModel = {
  id: "youtube",
  name: "YouTube",
  doctrine: "Two engines: search (evergreen, SEO) and recommendations (browse, CTR×retention). The thumbnail+title sell the click; the first 30 seconds earn the watch.",
  graph: "search",
  algorithm: [
    { id: "retention", label: "Average % viewed (retention)", weight: 0.32, why: "The core recommendation signal — held attention over duration.", provenance: "[grounded-in: YouTube ranking — retention]" },
    { id: "ctr", label: "Click-through rate (thumbnail+title)", weight: 0.28, why: "CTR from impressions — without it, recommendations never test the video.", provenance: "[grounded-in: YouTube ranking — CTR]" },
    { id: "session-time", label: "Session watch time", weight: 0.20, why: "Does this video start a longer session? YouTube rewards session contribution.", provenance: "[grounded-in: YouTube ranking — session watch time]" },
    { id: "avd", label: "Average view duration", weight: 0.10, why: "Absolute seconds watched — compounds with retention on long-form.", provenance: "[grounded-in: YouTube ranking — AVD]" },
    { id: "comments", label: "Comments", weight: 0.10, why: "Engagement signal; pinned question lifts it.", provenance: "[grounded-in: YouTube ranking — engagement]" },
  ],
  variables: [
    { id: "title", label: "Title (CTR driver)", feeds: ["ctr"], guidance: "Curiosity + keyword. The title sells the click; <60 chars for mobile." },
    { id: "thumbnail", label: "Thumbnail (CTR driver)", feeds: ["ctr"], guidance: "High contrast, face+emotion, ≤3 words overlay. A/B test it (Hopkins).", constraint: "Thumbnail is ~50% of the algorithm — never delegate it." },
    { id: "hook", label: "Hook (first 15–30s)", feeds: ["retention", "avd"], guidance: "Deliver the promise + tease the payoff in the first 30s. Cut intro fluff." },
    { id: "pacing", label: "Pacing (retention curve)", feeds: ["retention"], guidance: "Kill dead air; pattern-interrupt every 8–15s. Watch the retention dip and fix it." },
    { id: "duration", label: "Duration", feeds: ["avd", "session-time"], guidance: "8–15min sweet spot for watch time; Shorts for reach, long-form for authority.", constraint: "[composite] 8–15min long-form." },
    { id: "end-screen", label: "End screen / CTA", feeds: ["session-time"], guidance: "Point to the next video, not 'subscribe' — session continuation > subscription." },
    { id: "chapters", label: "Chapters", feeds: ["retention", "ctr"], guidance: "Chapters lift search CTR + let skippers find value." },
    { id: "cadence", label: "Cadence", feeds: ["ctr", "retention"], guidance: "1–2/week, consistent. The algorithm rewards a predictable signal.", constraint: "[composite] 1–2/week." },
    { id: "seo", label: "SEO (title/desc/tags)", feeds: ["ctr"], guidance: "Search is the evergreen engine — keyword in title, first 2 lines of description." },
  ],
  nativeFormat: { aspect: "16:9 (or 9:16 Shorts)", duration: "8–15min long-form / ≤60s Shorts", format: "Long-form horizontal (authority) or Shorts (reach)" },
  cadence: "1–2 videos/week",
  reachKiller: "A great video with a lazy thumbnail — CTR dies and recommendations never pick it up. The thumbnail is half the algorithm.",
  provenance: ["[grounded-in: YouTube ranking — CTR × retention × session time]", "[grounded-in: Hopkins — scientific A/B test the thumbnail]"],
};

/** LinkedIn — professional graph; dwell + comments, the 2-line gate. */
export const LINKEDIN: PlatformModel = {
  id: "linkedin",
  name: "LinkedIn",
  doctrine: "The first two lines are the gate (the 'see more' fold). Comments are the currency — end with a question. No outbound link in the body; it kills reach.",
  graph: "professional",
  algorithm: [
    { id: "dwell", label: "Dwell time (read)", weight: 0.30, why: "Time spent reading — the fold gate decides it. Document posts win dwell.", provenance: "[grounded-in: LinkedIn ranking — dwell time]" },
    { id: "comments", label: "Comments", weight: 0.30, why: "The dominant signal — comments drive 2nd/3rd-degree distribution.", provenance: "[grounded-in: LinkedIn creator-mode ranking — comments weighted]" },
    { id: "reshare-context", label: "Reshares with context", weight: 0.15, why: "A reshare + your take > a naked reshare; rewards added value.", provenance: "[grounded-in: LinkedIn ranking]" },
    { id: "early-velocity", label: "Early engagement velocity", weight: 0.15, why: "Engagement in the first hour seeds distribution to your 2nd/3rd degree.", provenance: "[grounded-in: LinkedIn ranking — early velocity]" },
    { id: "reactions", label: "Reactions", weight: 0.10, why: "Weaker than comments; a tap, not a take.", provenance: "[grounded-in: LinkedIn ranking]" },
  ],
  variables: [
    { id: "format", label: "Format (text / document / poll / article)", feeds: ["dwell", "comments"], guidance: "Document (PDF carousel) for dwell; text+question for comments; poll for cheap reach." },
    { id: "hook", label: "Hook (first 2 lines)", feeds: ["dwell"], guidance: "The 'see more' fold — the 1st 2 lines decide if anyone reads the rest.", constraint: "Hook must earn the 'see more' tap or reach is zero." },
    { id: "angle", label: "Professional angle (insight/contrarian/data)", feeds: ["comments", "reshare-context"], guidance: "Lead with an insight or a defensible contrarian take. Generic = ignored." },
    { id: "comment-bait", label: "Comment-bait (end with a question)", feeds: ["comments", "early-velocity"], guidance: "End with one specific question. Comments are the distribution engine." },
    { id: "no-link-body", label: "No outbound link in body", feeds: ["dwell", "comments"], guidance: "Links in the body kill reach. Put the link in the first comment.", constraint: "Hard — outbound links in the body are demoted." },
    { id: "cadence", label: "Cadence", feeds: ["early-velocity"], guidance: "2–5/week. Consistency seeds the velocity loop.", constraint: "[composite] 2–5/week." },
    { id: "posting-time", label: "Posting time", feeds: ["early-velocity"], guidance: "Business hours in the audience's timezone — early velocity needs eyeballs." },
    { id: "tagging", label: "Tagging (sparingly)", feeds: ["comments"], guidance: "Tag 1–3 relevant people for a comment seed; over-tagging looks desperate." },
  ],
  nativeFormat: { aspect: "1:1 or 4:5 (document) / text", duration: "Text post or 8–15-slide PDF document", format: "Text insight or PDF document carousel" },
  cadence: "2–5 posts/week",
  reachKiller: "An outbound link in the post body — LinkedIn demotes it hard. Put the link in the first comment, always.",
  provenance: ["[grounded-in: LinkedIn creator-mode ranking — dwell + comments weighted]", "[grounded-in: Gary Vaynerchuk — the document post]"],
};

/** X — velocity + replies; the thread payoff in tweet 1. */
export const X: PlatformModel = {
  id: "x",
  name: "X (Twitter)",
  doctrine: "Velocity + replies. Post 3–5x/day, reply 10–20x. The thread's payoff lives in tweet 1, not tweet 7.",
  graph: "social",
  algorithm: [
    { id: "replies", label: "Replies", weight: 0.30, why: "Conversation depth — the dominant For You signal on X.", provenance: "[grounded-in: X ranking — replies weighted]" },
    { id: "quote", label: "Quote-posts", weight: 0.20, why: "Quote with added take = strong amplification signal.", provenance: "[grounded-in: X ranking]" },
    { id: "dwell", label: "Dwell time (reading)", weight: 0.20, why: "Time on the post — longer-form + media lift it.", provenance: "[grounded-in: X ranking — dwell time]" },
    { id: "retweets", label: "Retweets", weight: 0.15, why: "Broadcast signal; weaker than replies/quotes (no added value).", provenance: "[grounded-in: X ranking]" },
    { id: "likes", label: "Likes", weight: 0.10, why: "Low-commitment tap; weakest of the engagement signals.", provenance: "[grounded-in: X ranking — likes de-weighted]" },
    { id: "early-velocity", label: "Early velocity", weight: 0.05, why: "First-hour engagement seeds the For You test.", provenance: "[grounded-in: X ranking — early velocity]" },
  ],
  variables: [
    { id: "format", label: "Format (short / thread / long-form / video)", feeds: ["dwell", "replies"], guidance: "Thread for depth, short for velocity, video for dwell. Match the idea to the format." },
    { id: "hook", label: "Hook (first line)", feeds: ["dwell", "replies"], guidance: "The 1st line is the whole pitch. No '1/🧵' without a payoff in tweet 1." },
    { id: "velocity", label: "Velocity (post volume)", feeds: ["early-velocity"], guidance: "3–5 posts/day. The For You feed rewards a live account, not a weekly broadcaster.", constraint: "[composite] 3–5/day." },
    { id: "reply-volume", label: "Reply volume", feeds: ["replies"], guidance: "Reply 10–20x/day in the niche. Replies are the distribution engine on X.", constraint: "[composite] 10–20 replies/day." },
    { id: "thread-structure", label: "Thread structure", feeds: ["dwell"], guidance: "Payoff in tweet 1, value 2–N, CTA last. Never bury the hook at tweet 7." },
    { id: "media", label: "Media (video / image)", feeds: ["dwell"], guidance: "Native video or image boosts dwell; never a link-card to an external site (kills reach)." },
    { id: "timing", label: "Timing (real-time / opinion)", feeds: ["early-velocity"], guidance: "Ride the news cycle + take a stance. X rewards heat, not evergreen." },
  ],
  nativeFormat: { aspect: "16:9 video / 1:1 image / text", duration: "Short post (≤280) or thread (5–10)", format: "Short post or thread; native media" },
  cadence: "3–5 posts/day + 10–20 replies",
  reachKiller: "A single promotional tweet into a cold feed with zero replies — the For You feed rewards conversation, not broadcast.",
  provenance: ["[grounded-in: X ranking — replies + dwell weighted over likes]", "[grounded-in: Gary Vaynerchuk — reply-guy velocity]"],
};

/** Facebook — community graph; meaningful interaction, native video, no outbound links. */
export const FACEBOOK: PlatformModel = {
  id: "facebook",
  name: "Facebook",
  doctrine: "Groups over pages. Meaningful interaction (comments > reactions) wins; outbound links lose. Native video, not link previews.",
  graph: "community",
  algorithm: [
    { id: "comments", label: "Comments", weight: 0.30, why: "Meaningful interaction — the post-2018 north star. Comments > reactions.", provenance: "[grounded-in: Facebook meaningful social interaction update 2018]" },
    { id: "meaningful-interaction", label: "Meaningful interaction (depth)", weight: 0.25, why: "Back-and-forth comment threads weighted above one-tap reactions.", provenance: "[grounded-in: Facebook MSI update]" },
    { id: "dwell", label: "Dwell time (video watch)", weight: 0.20, why: "Native video watch time — Reels + video feed the ranking.", provenance: "[grounded-in: Facebook video ranking]" },
    { id: "shares", label: "Shares", weight: 0.15, why: "Share = relevance signal; shares-with-context weighted higher.", provenance: "[grounded-in: Facebook ranking]" },
    { id: "reactions", label: "Reactions", weight: 0.10, why: "Weakest MSI signal — a tap, not a conversation.", provenance: "[grounded-in: Facebook MSI update]" },
  ],
  variables: [
    { id: "format", label: "Format (native video / Reel / group post)", feeds: ["dwell", "comments"], guidance: "Native video or Reel; groups > pages for organic reach now." },
    { id: "hook", label: "Hook (1st 3s / 1st line)", feeds: ["dwell", "comments"], guidance: "Open with the tension or the local angle — Facebook rewards relatable." },
    { id: "community-angle", label: "Community angle (group / local)", feeds: ["comments", "meaningful-interaction"], guidance: "Frame for a group or a local context; generic broadcast gets nothing." },
    { id: "no-outbound-link", label: "No outbound link in body", feeds: ["comments", "dwell"], guidance: "Links in the body are demoted hard. Link in the first comment.", constraint: "Hard — outbound links demoted since 2018." },
    { id: "captions", label: "Captions (burned)", feeds: ["dwell"], guidance: "Burned captions — most Facebook video is watched sound-off." },
    { id: "cadence", label: "Cadence", feeds: ["dwell"], guidance: "1–2/day; consistency + community reply velocity matter.", constraint: "[composite] 1–2/day." },
    { id: "local", label: "Local angle", feeds: ["comments", "meaningful-interaction"], guidance: "Name the city / community — local context lifts comment depth." },
  ],
  nativeFormat: { aspect: "9:16 Reel / 16:9 video / 1:1", duration: "Reel ≤60s / native video 1–3min", format: "Native video or Reel; group post" },
  cadence: "1–2 posts/day",
  reachKiller: "A link-preview post — Facebook demotes outbound links hard since the 2018 meaningful-interaction update. Native video only.",
  provenance: ["[grounded-in: Facebook meaningful social interaction update 2018]", "[grounded-in: Hormozi — community/retention economics]"],
};

/** Pinterest — visual search engine; saves + outbound clicks, months of shelf life. */
export const PINTEREST: PlatformModel = {
  id: "pinterest",
  name: "Pinterest",
  doctrine: "It's a visual search engine, not social. Saves + outbound clicks drive distribution; pins live for months, not hours. Lead seasons 30–90 days ahead.",
  graph: "search",
  algorithm: [
    { id: "saves", label: "Saves (pins to boards)", weight: 0.35, why: "The dominant signal — a save = future intent + re-distribution to the saver's audience.", provenance: "[grounded-in: Pinterest ranking — saves]" },
    { id: "outbound-clicks", label: "Outbound clicks", weight: 0.25, why: "Clicks to the destination — Pinterest optimizes for pin → site commerce.", provenance: "[grounded-in: Pinterest ranking — outbound clicks]" },
    { id: "freshness", label: "Freshness (new pins)", weight: 0.15, why: "Fresh pins get a discovery boost; re-pins decay.", provenance: "[grounded-in: Pinterest ranking — fresh content]" },
    { id: "close-ups", label: "Close-ups (zoom)", weight: 0.15, why: "Engagement-with-the-image signal; rewards high-res + text overlay.", provenance: "[grounded-in: Pinterest ranking]" },
    { id: "dwell", label: "Dwell on pin", weight: 0.10, why: "Time on the pin detail — keyword-rich descriptions lift it.", provenance: "[grounded-in: Pinterest ranking]" },
  ],
  variables: [
    { id: "format", label: "Format (2:3 vertical, 1000×1500)", feeds: ["saves", "close-ups"], guidance: "Vertical 2:3, 1000×1500px, high-res. Horizontal pins underperform.", constraint: "Hard — 2:3 vertical, 1000×1500." },
    { id: "keyword-title", label: "Keyword-rich title", feeds: ["outbound-clicks", "dwell"], guidance: "It's search — put the keyword in the title. Pinterest indexes it." },
    { id: "keyword-desc", label: "Keyword-rich description", feeds: ["dwell", "outbound-clicks"], guidance: "Natural-language description with the keyword + a CTA to click." },
    { id: "text-overlay", label: "Text overlay on image", feeds: ["outbound-clicks", "close-ups"], guidance: "Bold text overlay states the payoff — lifts CTR in the feed." },
    { id: "board-seo", label: "Board SEO", feeds: ["saves"], guidance: "Name boards with keywords; the board's SEO feeds the pin's distribution." },
    { id: "fresh-pin-cadence", label: "Fresh-pin cadence", feeds: ["freshness"], guidance: "Fresh pins daily — Pinterest rewards new images, not re-pins.", constraint: "[composite] fresh pins daily." },
    { id: "product-tags", label: "Product tags (shopping)", feeds: ["outbound-clicks"], guidance: "Tag products on the pin for shopping distribution + outbound clicks." },
    { id: "seasonal-lead", label: "Seasonal lead time", feeds: ["saves", "freshness"], guidance: "Lead seasons 30–90 days ahead — Pinterest users plan early.", constraint: "[composite] 30–90 days ahead." },
  ],
  nativeFormat: { aspect: "2:3 vertical (1000×1500)", duration: "Static pin (or idea/video pin)", format: "Vertical pin with text overlay" },
  cadence: "Fresh pins daily",
  reachKiller: "A horizontal image with no text overlay and no keywords — Pinterest can't index it, so it never surfaces in search. Months of shelf life, wasted.",
  provenance: ["[grounded-in: Pinterest — visual search; saves + outbound clicks]", "[grounded-in: Schwartz — search/awareness engine]"],
};

/** Ordered registry — all 7 platforms. */
export const PLATFORMS: PlatformModel[] = [
  TIKTOK, INSTAGRAM, YOUTUBE, LINKEDIN, X, FACEBOOK, PINTEREST,
];

/** Lookup by id. */
export const PLATFORM_BY_ID: Record<SocialPlatform, PlatformModel> = Object.fromEntries(
  PLATFORMS.map((p) => [p.id, p]),
) as Record<SocialPlatform, PlatformModel>;