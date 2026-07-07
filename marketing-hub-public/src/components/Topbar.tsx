"use client";
import {
  Search,
  Bell,
  Plus,
  Sun,
  Moon,
  Monitor,
  Keyboard,
  X,
  ArrowRight,
  Command,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "./Toast";
import { toggleMobileSidebar } from "./Sidebar";

type SearchHit = { section: string; href: string; title: string; subtitle?: string };
type SearchResults = SearchHit[];

const TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/campaigns": "Campaigns",
  "/calendar": "Content calendar",
  "/studio": "Social studio",
  "/emails": "Email builder",
  "/landing-pages": "Landing pages",
  "/copy": "Copy generator",
  "/seo": "SEO toolkit",
  "/ads": "Ads manager",
  "/crm": "CRM & deals",
  "/analytics": "Analytics",
  "/automations": "Automations",
  "/assets": "Asset library",
  "/integrations": "Integrations",
  "/reports": "Reports",
  "/settings": "Settings",
  "/enterprise": "Enterprise",
  "/developers": "Developer Portal",
  "/design-system": "Design System",
  "/status": "System Status",
  "/changelog": "Changelog",
  "/tasks": "Tasks",
  "/intelligence": "Intelligence",
  "/retention": "Cohort Retention",
  "/wire": "The Wire",
  "/studio-pro": "Studio Pro",
  "/agency": "Agency Site",
  "/webhooks": "Webhooks",
  "/empire": "Empire",
  "/ideas": "Idea Board",
  "/strategy": "Strategy",
  "/library": "The Library",
  "/trends": "Trends",
  "/old-school": "Old School",
  "/attribution": "Attribution",
  "/sequences": "Sales Sequences",
  "/accounts": "ABM Accounts",
  "/predictive": "Predictive Scoring",
  "/consent": "Consent & GDPR",
  "/patrick": "Patrick Number",
  "/forms": "Forms",
  "/lead-magnets": "Lead Magnets",
  "/funnels": "Funnels",
  "/experiments": "A/B Tests",
  "/testimonials": "Testimonials",
  "/events": "Events",
  "/competitors": "Competitors",
  "/inbox": "Inbox",
  "/budget": "Budget",
  "/playbooks": "Playbooks",
  "/surveys": "Surveys",
  "/outbox": "Outbox",
  "/brand": "Brand Kit",
  "/personas": "Personas",
  "/segments": "Segments",
  "/machine": "Content Machine",
  "/orchestrator": "Orchestrator",
  "/marketplace": "Marketplace",
  "/nova": "Nova AI",
  "/triangle": "Triangle Loop",
  "/cockpit": "The Cockpit",
  "/finance": "Finance Hub",
  "/dive": "Marketing Dive",
  "/intensity": "Intensity",
};

type Mode = "auto" | "light" | "dark";
type ThemeId = "hub" | "noira-dark" | "noira-light" | "noira-amoled" | "agency-light" | "aether";

const THEMES: Record<ThemeId, { label: string; mode: "light" | "dark"; brand: string }> = {
  hub: { label: "Hub Default", mode: "light", brand: "var(--accent)" },
  "noira-dark": { label: "Violet Dark", mode: "dark", brand: "var(--accent)" },
  "noira-light": { label: "Violet Light", mode: "light", brand: "var(--accent)" },
  "noira-amoled": { label: "Violet AMOLED", mode: "dark", brand: "var(--accent)" },
  "agency-light": { label: "Marketing Agency", mode: "light", brand: "#1A2C6A" },
  aether: { label: "ÆTHER Monochrome", mode: "dark", brand: "#f5f5f5" },
};

export function Topbar() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const title =
    TITLES[pathname] ||
    (pathname.startsWith("/campaigns/")
      ? "Campaign detail"
      : pathname.startsWith("/emails/")
        ? "Email detail"
        : pathname.startsWith("/landing-pages/")
          ? "Landing page detail"
          : pathname.startsWith("/crm/")
            ? "CRM"
            : "ROI Marketing");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResults>([]);
  const [searching, setSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<number | null>(null);
  const aborterRef = useRef<AbortController | null>(null);
  const [shortcut, setShortcut] = useState("Ctrl K");
  const [theme, setTheme] = useState<ThemeId>("hub");
  const [mode, setMode] = useState<Mode>("auto");
  const toast = useToast();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/settings/theme", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled || !d?.current) return;
        if (d.current.theme) setTheme(d.current.theme);
        if (d.current.mode) setMode(d.current.mode);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
    setShortcut(isMac ? "⌘ K" : "Ctrl K");
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("topbar-search")?.focus();
      }
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
        (document.getElementById("topbar-search") as HTMLInputElement | null)?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [searchOpen]);

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (aborterRef.current) aborterRef.current.abort();
    const q = search.trim();
    if (q.length < 2) {
      setResults([]);
      setSearching(false);
      setSearchOpen(false);
      return;
    }
    setSearching(true);
    debounceRef.current = window.setTimeout(async () => {
      const ac = new AbortController();
      aborterRef.current = ac;
      try {
        const r = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: ac.signal,
          cache: "no-store",
        });
        if (!r.ok) throw new Error("search failed");
        const data = await r.json();
        setResults(Array.isArray(data) ? data : []);
        setActiveIdx(0);
        setSearchOpen(true);
      } catch (e: unknown) {
        if (e?.name !== "AbortError") {
          setResults([]);
          toast.error("Search failed", e?.message ?? "Unknown error");
        }
      } finally {
        setSearching(false);
      }
    }, 220);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      if (aborterRef.current) aborterRef.current.abort();
    };
  }, [search, pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!searchOpen) return;
    const onDown = (e: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [searchOpen]);

  useEffect(() => {
    setSearchOpen(false);
    setSearch("");
  }, [pathname]);

  const grouped = useMemo(() => {
    const map = new Map<string, SearchHit[]>();
    for (const h of results) {
      if (!map.has(h.section)) map.set(h.section, []);
      map.get(h.section)!.push(h);
    }
    return Array.from(map.entries());
  }, [results]);

  function go(hit: SearchHit) {
    setSearchOpen(false);
    setSearch("");
    router.push(hit.href);
  }

  function onSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!searchOpen || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const hit = results[activeIdx];
      if (hit) go(hit);
    }
  }

  const effectiveMode: "light" | "dark" = "dark"; // ROI Marketing — dark only
  const _unused = useMemo(() => {
    return "dark"; // always dark
    return mode;
  }, [theme, mode]);

  async function cycleTheme() {
    const currentIsDark = effectiveMode === "dark";
    let nextTheme: ThemeId;
    let nextMode: Mode;
    if (currentIsDark) {
      // Dark → Light cycle: aether → noira-light → hub → noira-light
      if (theme === "aether") { nextTheme = "hub"; nextMode = "light"; }
      else if (theme === "noira-amoled") { nextTheme = "noira-light"; nextMode = "light"; }
      else if (theme === "noira-dark") { nextTheme = "hub"; nextMode = "light"; }
      else { nextTheme = "hub"; nextMode = "light"; }
    } else {
      // Light → Dark cycle: hub → aether → noira-dark → noira-amoled
      if (theme === "hub") { nextTheme = "aether"; nextMode = "dark"; }
      else if (theme === "agency-light") { nextTheme = "aether"; nextMode = "dark"; }
      else if (theme === "noira-light") { nextTheme = "noira-dark"; nextMode = "dark"; }
      else { nextTheme = "noira-dark"; nextMode = "dark"; }
    }
    setTheme(nextTheme);
    setMode(nextMode);
    try {
      await fetch("/api/settings/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: nextTheme, mode: nextMode }),
      });
      toast.success("Theme changed", `${THEMES[nextTheme].label} · ${nextMode}`);
      setTimeout(() => window.location.reload(), 400);
    } catch (e: unknown) {
      toast.error("Couldn't change theme", e.message);
    }
  }

  const ModeIcon = effectiveMode === "dark" ? Moon : effectiveMode === "light" ? Sun : Monitor;
  const themeBrand = THEMES[theme]?.brand ?? "var(--accent)";

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="h-14 border-b flex items-center px-6 gap-4 sticky top-0 z-40"
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "blur(var(--glass-blur))",
        WebkitBackdropFilter: "blur(var(--glass-blur))",
        borderColor: "rgb(var(--border))",
      }}
    >
      {/* Mobile menu toggle */}
      <button
        onClick={() => toggleMobileSidebar()}
        className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 dark:bg-zinc-800 dark:hover:bg-white/5 transition-colors flex-shrink-0"
        aria-label="Open navigation menu"
      >
        <Menu className="w-5 h-5" />
      </button>
      <h1 className="text-base font-bold tracking-tight truncate">{title}</h1>

      {/* Search */}
      <div ref={searchWrapRef} className="flex-1 max-w-md mx-auto relative">
        <div className="relative group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 group-focus-within:text-[var(--accent)] transition-colors" />
          <input
            id="topbar-search"
            role="combobox"
            aria-expanded="true"
            aria-label="Search across all records"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setSearchOpen(true);
            }}
            onKeyDown={onSearchKeyDown}
            autoComplete="off"
            spellCheck={false}
            className="w-full pl-9 pr-20 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800/80 text-sm focus:outline-none focus:bg-white dark:bg-zinc-900 dark:focus:bg-zinc-800 focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] border border-transparent transition-all"
            placeholder="Search anything…"
          />
          {search.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setResults([]);
                setSearchOpen(false);
              }}
              className="absolute right-9 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-slate-200 dark:hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-700 text-slate-400 dark:text-zinc-500"
              title="Clear"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-500 dark:text-zinc-400 bg-white/80 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-800 dark:border-zinc-700 shadow-sm hidden md:inline-flex items-center gap-0.5">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </div>

        <AnimatePresence>
          {searchOpen && results.length > 0 ? (
            <motion.div
              key="search-panel"
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 right-0 top-full mt-2 z-50 rounded-lg border shadow-xl overflow-hidden"
              style={{
                borderColor: "rgb(var(--border))",
                background: "var(--glass-bg)",
                backdropFilter: "blur(var(--glass-blur))",
                WebkitBackdropFilter: "blur(var(--glass-blur))",
              }}
              role="listbox"
            >
              <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
                {grouped.map(([section, hits]) => (
                  <div key={section}>
                    <div className="px-3 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                      {section}
                    </div>
                    {hits.map((hit) => {
                      const flatIdx = results.indexOf(hit);
                      const active = flatIdx === activeIdx;
                      return (
                        <button
                          key={`${section}-${hit.href}-${hit.title}`}
                          type="button"
                          onClick={() => go(hit)}
                          onMouseEnter={() => setActiveIdx(flatIdx)}
                          className={`w-full text-left px-3 py-2.5 flex items-center gap-2 text-sm transition-colors ${active ? "bg-[rgba(var(--theme-brand-rgb),0.055)]" : "hover:bg-slate-50 dark:hover:bg-white/5 dark:bg-zinc-800/50 dark:hover:bg-white/5 dark:hover:bg-white dark:bg-zinc-900/5"}`}
                        >
                          <span className="flex-1 min-w-0">
                            <span className="block font-medium truncate">{hit.title}</span>
                            {hit.subtitle ? (
                              <span className="block text-xs text-slate-500 dark:text-zinc-400 truncate">
                                {hit.subtitle}
                              </span>
                            ) : null}
                          </span>
                          <ArrowRight
                            className={`w-3.5 h-3.5 flex-shrink-0 ${active ? "text-[color-mix(in srgb,var(--accent),black 20%)]" : "text-slate-300 dark:text-zinc-600"}`}
                          />
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div
                className="px-3 py-1.5 border-t text-[10px] text-slate-400 dark:text-zinc-500 flex items-center justify-between bg-slate-50 dark:bg-zinc-800/50/50 dark:bg-zinc-800/50"
                style={{ borderColor: "rgb(var(--border))" }}
              >
                <span>↑↓ navigate · ↵ open · esc close</span>
                <span>
                  {results.length} result{results.length === 1 ? "" : "s"}
                </span>
              </div>
            </motion.div>
          ) : searchOpen && searching ? (
            <motion.div
              key="search-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-0 right-0 top-full mt-2 z-50 rounded-lg border shadow-lg px-3 py-2 text-xs text-slate-500 dark:text-zinc-400 glass"
            >
              Searching…
            </motion.div>
          ) : searchOpen && search.trim().length >= 2 && results.length === 0 && !searching ? (
            <motion.div
              key="search-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-0 right-0 top-full mt-2 z-50 rounded-lg border shadow-lg px-3 py-2 text-xs text-slate-500 dark:text-zinc-400 glass"
            >
              No matches for "{search}".
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Theme switcher */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => window.location.href = "/roi-marketing"}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 dark:bg-zinc-800 dark:hover:bg-white/5/80 dark:hover:bg-white dark:bg-zinc-900/5 relative group transition-colors"
        title="ROI Marketing — You are Roi. We are ROI."
      >
        <span
          className="w-2.5 h-2.5 rounded-full shadow-sm transition-transform group-hover:scale-125"
          style={{ background: themeBrand }}
        />
        <ModeIcon className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
        <span className="text-xs font-semibold text-slate-600 dark:text-zinc-300 hidden lg:inline capitalize">
          {effectiveMode}
        </span>
      </motion.button>

      {/* Notifications */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 dark:bg-zinc-800 dark:hover:bg-white/5/80 dark:hover:bg-white dark:bg-zinc-900/5 relative transition-colors"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white/80 animate-pulse" />
      </motion.button>

      <button
        onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "?" }))}
        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 dark:bg-zinc-800 dark:hover:bg-white/5/80 dark:hover:bg-white dark:bg-zinc-900/5 relative transition-colors"
        aria-label="Keyboard shortcuts"
        title="Keyboard shortcuts (?)"
      >
        <Keyboard className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
      </button>

      <Link
        href="/campaigns"
        className="btn btn-primary shadow-lg shadow-[var(--accent)]/20 hover:shadow-[0_5px_21px_rgba(var(--theme-brand-rgb),0.377)] transition-all"
      >
        <Plus className="w-4 h-4" /> New
      </Link>
    </motion.header>
  );
}
