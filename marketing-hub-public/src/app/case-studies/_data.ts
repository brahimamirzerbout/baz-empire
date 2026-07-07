export interface CaseStudy {
  slug: string;
  customer: string;
  industry: string;
  headline: string;
  challenge: string;
  solution: string;
  results: { label: string; value: string }[];
  quote: { text: string; author: string };
  tools: string[];
  duration_months: number;
  featured: boolean;
}

export const CASES: CaseStudy[] = [
  {
    slug: "agence-pdg",
    customer: "Agence PDG (Anonymized)",
    industry: "Agency · France",
    headline: "Doubled client capacity without hiring, $1.2M ARR",
    challenge:
      "5-person agency in Paris serving 12 clients. Every campaign was bespoke. Onboarding a new client took 2 weeks. No standardized reporting. Clients churned at 8% monthly.",
    solution:
      "Rolled out BAZ Empire across the agency. Standardized the 12-step onboarding into an Orchestrator playbook. Built 6 repeatable campaign templates in Studio Pro. Used The Wire's 14 articles as a content engine for clients. Used Marketplace to hire Schwartz (copy), Kotler (positioning), and PBD (offers) as embedded agents.",
    results: [
      { label: "ARR", value: "$1.2M" },
      { label: "Clients served", value: "12 → 28" },
      { label: "Headcount", value: "5 → 6" },
      { label: "Client churn", value: "8% → 2.1%" },
      { label: "Onboarding time", value: "14 days → 4 hrs" },
      { label: "Margin", value: "31% → 58%" },
    ],
    quote: {
      text: "We doubled clients with one more hire. The Hub let us productize our services. Marketplace let us have Seth Godin on retainer for $0.",
      author: "CEO, Agence PDG",
    },
    tools: ["Orchestrator", "Studio Pro", "Marketplace", "Wire", "Templates"],
    duration_months: 9,
    featured: true,
  },
  {
    slug: "figtree-b2b",
    customer: "FigTree B2B SaaS (Anonymized)",
    industry: "B2B SaaS · Germany",
    headline: "Pipeline 3x'd, CAC cut 60%, ABM playbook shipped",
    challenge:
      "Series A B2B SaaS. $8K ACV. Sales cycle 4 months. Marketing was 4 isolated tools. CAC had ballooned to $14K. Pipeline was flat. Couldn't tell which channel converted.",
    solution:
      "Migrated entire marketing onto BAZ Empire. Switched to data-driven attribution (from last-touch). Used Predictive to score the 47k contact database. Used ABM feature to tier accounts. Used Marketplace to hire Godin for tribe / Schwartz for copy / Hormozi for offer. Built a 7-touch sequence that became the engine.",
    results: [
      { label: "Pipeline (9mo)", value: "$178K → $540K" },
      { label: "CAC", value: "$14K → $5.6K" },
      { label: "LTV/CAC", value: "1.4x → 6.2x" },
      { label: "Win rate", value: "8% → 18%" },
      { label: "Sales cycle", value: "4mo → 2.5mo" },
      { label: "Patrick Number", value: "42 → 88" },
    ],
    quote: {
      text: "The Hub gave us something rare: clarity. We see the entire funnel. We know which $1 of spend returns $6.2 of LTV. We ship campaigns weekly instead of monthly.",
      author: "CMO, FigTree",
    },
    tools: [
      "Predictive",
      "Attribution",
      "ABM",
      "Sequences",
      "Marketplace",
      "Cockpit",
      "Orchestrator",
    ],
    duration_months: 9,
    featured: true,
  },
];
