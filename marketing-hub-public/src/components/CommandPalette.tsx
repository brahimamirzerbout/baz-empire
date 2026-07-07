"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  Hash,
  FileText,
  Users,
  Briefcase,
  Building2,
  Megaphone,
  Mail,
  Globe,
  Wand2,
  LayoutDashboard,
  Calendar,
  Target,
  BarChart3,
  Workflow,
  FolderOpen,
  Settings,
  ListChecks,
  Command,
} from "lucide-react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

interface Hit {
  section: string;
  href: string;
  title: string;
  subtitle?: string;
}

const SECTION_ICONS: Record<string, any> = {
  "Go to": ArrowRight,
  Campaigns: Megaphone,
  Contacts: Users,
  Deals: Briefcase,
  Companies: Building2,
  Content: Calendar,
  Emails: Mail,
  "Landing pages": Globe,
  Ads: Target,
  "SEO keywords": Hash,
  Automations: Workflow,
  Tasks: ListChecks,
  Assets: FolderOpen,
};

const NAV_HITS: Hit[] = [
  { section: "Go to", href: "/", title: "Dashboard", subtitle: "The kingdom overview" },
  { section: "Go to", href: "/cockpit", title: "The Cockpit", subtitle: "Real-time operations" },
  { section: "Go to", href: "/patrick", title: "Patrick Number", subtitle: "The morning ritual" },
  { section: "Go to", href: "/intelligence", title: "Intelligence", subtitle: "10 Nova formulas" },
  { section: "Go to", href: "/brand", title: "Brand kit", subtitle: "Identity, voice, guidelines" },
  { section: "Go to", href: "/personas", title: "Personas", subtitle: "Audience profiles" },
  {
    section: "Go to",
    href: "/segments",
    title: "Audience segments",
    subtitle: "Rule-based groups",
  },
  {
    section: "Go to",
    href: "/competitors",
    title: "Competitors",
    subtitle: "Competitive intelligence",
  },
  { section: "Go to", href: "/campaigns", title: "Campaigns", subtitle: "Multi-channel campaigns" },
  { section: "Go to", href: "/funnels", title: "Funnels", subtitle: "Customer journey maps" },
  {
    section: "Go to",
    href: "/budget",
    title: "Budget planner",
    subtitle: "Spend by month/category",
  },
  { section: "Go to", href: "/playbooks", title: "Playbooks", subtitle: "SOPs & repeatable runs" },
  {
    section: "Go to",
    href: "/calendar",
    title: "Content calendar",
    subtitle: "Publishing schedule",
  },
  { section: "Go to", href: "/studio", title: "Social studio", subtitle: "Compose social posts" },
  { section: "Go to", href: "/studio-pro", title: "Studio Pro", subtitle: "Visual canvas" },
  { section: "Go to", href: "/emails", title: "Email builder", subtitle: "Block-based emails" },
  {
    section: "Go to",
    href: "/landing-pages",
    title: "Landing pages",
    subtitle: "Block-based pages",
  },
  { section: "Go to", href: "/forms", title: "Forms", subtitle: "Lead-capture forms" },
  {
    section: "Go to",
    href: "/lead-magnets",
    title: "Lead magnets",
    subtitle: "eBooks, templates, etc.",
  },
  { section: "Go to", href: "/copy", title: "Copy generator", subtitle: "Headlines, hooks, CTAs" },
  { section: "Go to", href: "/assets", title: "Asset library", subtitle: "Files & media" },
  { section: "Go to", href: "/seo", title: "SEO toolkit", subtitle: "Keywords, audits, sitemap" },
  { section: "Go to", href: "/ads", title: "Ads manager", subtitle: "Paid media tracking" },
  {
    section: "Go to",
    href: "/events",
    title: "Events & webinars",
    subtitle: "Plan & track events",
  },
  { section: "Go to", href: "/crm", title: "CRM & deals", subtitle: "Contacts, companies, deals" },
  {
    section: "Go to",
    href: "/accounts",
    title: "ABM accounts",
    subtitle: "Account-based marketing",
  },
  {
    section: "Go to",
    href: "/sequences",
    title: "Sales sequences",
    subtitle: "Multi-step cadences",
  },
  { section: "Go to", href: "/attribution", title: "Attribution", subtitle: "6 touchpoint models" },
  {
    section: "Go to",
    href: "/automations",
    title: "Automations",
    subtitle: "Trigger-action rules",
  },
  { section: "Go to", href: "/experiments", title: "A/B tests", subtitle: "Experiments & lift" },
  {
    section: "Go to",
    href: "/testimonials",
    title: "Testimonials",
    subtitle: "Social proof library",
  },
  {
    section: "Go to",
    href: "/inbox",
    title: "Conversations inbox",
    subtitle: "DMs, comments, emails",
  },
  {
    section: "Go to",
    href: "/surveys",
    title: "Surveys (NPS, CSAT)",
    subtitle: "Customer feedback",
  },
  {
    section: "Go to",
    href: "/analytics",
    title: "Analytics",
    subtitle: "Traffic, funnels, channels",
  },
  { section: "Go to", href: "/wire", title: "The Wire", subtitle: "Marketing news & analysis" },
  { section: "Go to", href: "/trends", title: "Trends", subtitle: "Market trend tracker" },
  { section: "Go to", href: "/nova", title: "Nova AI", subtitle: "Ask anything" },
  { section: "Go to", href: "/marketplace", title: "Marketplace", subtitle: "Hire marketers" },
  { section: "Go to", href: "/tasks", title: "Tasks", subtitle: "To-do tracker" },
  {
    section: "Go to",
    href: "/integrations",
    title: "Integrations",
    subtitle: "24+ service connectors",
  },
  { section: "Go to", href: "/reports", title: "Reports", subtitle: "Performance summaries" },
  { section: "Go to", href: "/settings", title: "Settings", subtitle: "Workspace, brand, keys" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQ("");
      setHits([]);
      setActive(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (!q.trim()) {
      setHits(NAV_HITS);
      setActive(0);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          const term = q.toLowerCase();
          const matchingNav = NAV_HITS.filter(
            (n) =>
              n.title.toLowerCase().includes(term) ||
              (n.subtitle || "").toLowerCase().includes(term),
          );
          setHits([...matchingNav, ...(data || [])]);
          setActive(0);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 120);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q, open]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, hits.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const hit = hits[active];
      if (hit) navigate(hit);
    }
  }

  function navigate(hit: Hit) {
    router.push(hit.href);
    setOpen(false);
  }

  // Group hits by section
  const grouped = useMemo(() => {
    const map = new Map<string, Hit[]>();
    for (const h of hits) {
      if (!map.has(h.section)) map.set(h.section, []);
      map.get(h.section)!.push(h);
    }
    return Array.from(map.entries());
  }, [hits]);

  // Flat index for active tracking
  const flatIndex = hits;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[999] flex items-start justify-center pt-[10vh] px-4"
          style={{
            background: "rgba(15, 23, 42, 0.5)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl overflow-hidden"
            style={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid var(--glass-border)",
              borderRadius: "18px",
              boxShadow: "var(--shadow-xl)",
            }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Search input */}
            <div
              className="flex items-center gap-3 px-5 py-4 border-b"
              style={{ borderColor: "rgb(var(--border))" }}
            >
              <Search className="w-5 h-5 text-slate-400 dark:text-zinc-500" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search campaigns, contacts, content, or jump to…"
                className="flex-1 bg-transparent outline-none text-base font-medium"
                style={{ color: "rgb(var(--text))" }}
              />
              {loading ? (
                <div className="w-5 h-5 border-2 border-[rgba(var(--theme-brand-rgb),0.15)] border-t-[var(--accent)] rounded-full animate-spin" />
              ) : (
                <kbd
                  className="px-2 py-0.5 rounded text-[10px] font-mono"
                  style={{
                    background: "rgb(var(--surface-2))",
                    color: "rgb(var(--muted))",
                    border: "1px solid rgb(var(--border))",
                  }}
                >
                  esc
                </kbd>
              )}
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
              {!q.trim() && (
                <div className="py-2">
                  {grouped.map(([section, sectionHits]) => (
                    <div key={section}>
                      <div
                        className="px-5 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: "rgb(var(--muted))" }}
                      >
                        {section}
                      </div>
                      {sectionHits.map((hit) => {
                        const flatIdx = flatIndex.indexOf(hit);
                        const Icon = SECTION_ICONS[hit.section] || ArrowRight;
                        const isActive = flatIdx === active;
                        return (
                          <button
                            key={`${hit.href}-${hit.title}`}
                            onMouseEnter={() => setActive(flatIdx)}
                            onClick={() => navigate(hit)}
                            className={clsx(
                              "w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors",
                              isActive && "bg-[rgba(var(--theme-brand-rgb),0.055)]",
                            )}
                          >
                            <div
                              className={clsx(
                                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                                isActive
                                  ? "bg-[rgba(var(--theme-brand-rgb),0.089)] text-[color-mix(in srgb,var(--accent),black 20%)]"
                                  : "bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400",
                              )}
                            >
                              <Icon size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div
                                className="text-sm font-semibold truncate"
                                style={{ color: "rgb(var(--text))" }}
                              >
                                {hit.title}
                              </div>
                              <div
                                className="text-xs truncate"
                                style={{ color: "rgb(var(--muted))" }}
                              >
                                {hit.subtitle}
                              </div>
                            </div>
                            {isActive && (
                              <ArrowRight className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
              {q.trim() && hits.length === 0 && !loading && (
                <div
                  className="px-5 py-12 text-center text-sm"
                  style={{ color: "rgb(var(--muted))" }}
                >
                  No results for "{q}".
                </div>
              )}
              {q.trim() && hits.length > 0 && (
                <div className="py-2">
                  {grouped.map(([section, sectionHits]) => (
                    <div key={section}>
                      <div
                        className="px-5 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: "rgb(var(--muted))" }}
                      >
                        {section}
                      </div>
                      {sectionHits.map((hit) => {
                        const flatIdx = flatIndex.indexOf(hit);
                        const Icon = SECTION_ICONS[hit.section] || FileText;
                        const isActive = flatIdx === active;
                        return (
                          <button
                            key={`${hit.href}-${hit.title}`}
                            onMouseEnter={() => setActive(flatIdx)}
                            onClick={() => navigate(hit)}
                            className={clsx(
                              "w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors",
                              isActive && "bg-[rgba(var(--theme-brand-rgb),0.055)]",
                            )}
                          >
                            <div
                              className={clsx(
                                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                                isActive
                                  ? "bg-[rgba(var(--theme-brand-rgb),0.089)] text-[color-mix(in srgb,var(--accent),black 20%)]"
                                  : "bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400",
                              )}
                            >
                              <Icon size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div
                                className="text-sm font-semibold truncate"
                                style={{ color: "rgb(var(--text))" }}
                              >
                                {hit.title}
                              </div>
                              <div
                                className="text-xs truncate"
                                style={{ color: "rgb(var(--muted))" }}
                              >
                                {hit.subtitle}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="border-t px-5 py-2.5 flex items-center justify-between text-[11px]"
              style={{
                borderColor: "rgb(var(--border))",
                color: "rgb(var(--muted))",
              }}
            >
              <span>
                {hits.length > 0
                  ? `${hits.length} result${hits.length === 1 ? "" : "s"}`
                  : "Type to search"}
              </span>
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="kbd">↑</kbd>
                  <kbd className="kbd">↓</kbd> navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="kbd">↵</kbd> select
                </span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
