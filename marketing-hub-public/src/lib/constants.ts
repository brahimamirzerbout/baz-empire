export const CHANNELS = [
  { id: "twitter", label: "Twitter / X", color: "#0ea5e9", charLimit: 280 },
  { id: "linkedin", label: "LinkedIn", color: "#2563eb", charLimit: 3000 },
  { id: "instagram", label: "Instagram", color: "#ec4899", charLimit: 2200 },
  { id: "facebook", label: "Facebook", color: "#1d4ed8", charLimit: 63206 },
  { id: "tiktok", label: "TikTok", color: "#111827", charLimit: 2200 },
  { id: "youtube", label: "YouTube", color: "#dc2626", charLimit: 5000 },
  { id: "email", label: "Email", color: "var(--accent)", charLimit: 200000 },
  { id: "blog", label: "Blog / SEO", color: "#16a34a", charLimit: 100000 },
  { id: "pinterest", label: "Pinterest", color: "#ef4444", charLimit: 500 },
  { id: "threads", label: "Threads", color: "#0f172a", charLimit: 500 },
];

export const DEAL_STAGES = [
  { id: "lead", label: "Lead", color: "#94a3b8" },
  { id: "qualified", label: "Qualified", color: "#0ea5e9" },
  { id: "proposal", label: "Proposal", color: "#a78bfa" },
  { id: "negotiation", label: "Negotiation", color: "#f59e0b" },
  { id: "won", label: "Won", color: "#16a34a" },
  { id: "lost", label: "Lost", color: "#dc2626" },
];

export const CONTACT_STATUSES = ["lead", "prospect", "customer", "evangelist", "churned"] as const;
export const CAMPAIGN_STATUSES = ["draft", "scheduled", "live", "paused", "completed"] as const;
export const CAMPAIGN_TYPES = [
  "awareness",
  "consideration",
  "conversion",
  "retention",
  "launch",
] as const;
export const INTEGRATIONS = [
  { id: "mailchimp", name: "Mailchimp", category: "Email", color: "#ffe01b" },
  { id: "sendgrid", name: "SendGrid", category: "Email", color: "#1a82e2" },
  { id: "convertkit", name: "ConvertKit", category: "Email", color: "#fb6970" },
  { id: "hubspot", name: "HubSpot", category: "CRM", color: "#ff7a59" },
  { id: "salesforce", name: "Salesforce", category: "CRM", color: "#00a1e0" },
  { id: "buffer", name: "Buffer", category: "Social", color: "#2c4bff" },
  { id: "hootsuite", name: "Hootsuite", category: "Social", color: "#143059" },
  { id: "later", name: "Later", category: "Social", color: "#3b3edd" },
  { id: "google_analytics", name: "Google Analytics", category: "Analytics", color: "#f9ab00" },
  { id: "search_console", name: "Search Console", category: "SEO", color: "#4285f4" },
  { id: "ahrefs", name: "Ahrefs", category: "SEO", color: "#3b82f6" },
  { id: "semrush", name: "SEMrush", category: "SEO", color: "#ff642d" },
  { id: "meta_ads", name: "Meta Ads", category: "Ads", color: "#1877f2" },
  { id: "google_ads", name: "Google Ads", category: "Ads", color: "#4285f4" },
  { id: "tiktok_ads", name: "TikTok Ads", category: "Ads", color: "#fe2c55" },
  { id: "linkedin_ads", name: "LinkedIn Ads", category: "Ads", color: "#0a66c2" },
  { id: "stripe", name: "Stripe", category: "Payments", color: "#635bff" },
  { id: "shopify", name: "Shopify", category: "Commerce", color: "#7ab55c" },
  { id: "wordpress", name: "WordPress", category: "CMS", color: "#21759b" },
  { id: "webflow", name: "Webflow", category: "CMS", color: "#4353ff" },
  { id: "slack", name: "Slack", category: "Productivity", color: "#4a154b" },
  { id: "notion", name: "Notion", category: "Productivity", color: "#000000" },
  { id: "zapier", name: "Zapier", category: "Automation", color: "#ff4a00" },
  { id: "make", name: "Make", category: "Automation", color: "#6d00cc" },
];

export const AUTOMATION_TRIGGERS = [
  "contact_created",
  "deal_stage_changed",
  "form_submitted",
  "email_opened",
  "link_clicked",
  "tag_added",
  "date_reached",
  "score_threshold",
];
export const AUTOMATION_ACTIONS = [
  "send_email",
  "create_deal",
  "add_tag",
  "notify_slack",
  "enroll_sequence",
  "update_field",
  "post_social",
  "create_task",
];

export const PLATFORMS_FOR_SOCIAL = CHANNELS.filter((c) =>
  [
    "twitter",
    "linkedin",
    "instagram",
    "facebook",
    "tiktok",
    "youtube",
    "pinterest",
    "threads",
  ].includes(c.id),
);

export function formatCurrency(n: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n || 0);
}
export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n || 0);
}
export function formatDate(ts: number | null | undefined) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
export function formatDateTime(ts: number | null | undefined) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
export function relative(ts: number | null | undefined) {
  if (!ts) return "—";
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return formatDate(ts);
}
