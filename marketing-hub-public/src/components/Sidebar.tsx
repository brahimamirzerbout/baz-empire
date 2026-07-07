"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Megaphone, Calendar, Pencil, Mail, Globe,
  Activity, Users, Wand2, Target, FolderOpen, Workflow, FileText,
  Settings, Search, Sparkles, Zap, Brain, Palette, Filter, FormInput,
  Download, FlaskConical, Star, CalendarDays, Swords, Inbox, DollarSign,
  BookOpenCheck, MessageSquare, Layers, Newspaper, Crown, BookOpen,
  BarChart3, History, Building, ShieldCheck, GitBranch, Rocket, CreditCard,
  X, Heart, BookMarked, LineChart, TrendingUp, Landmark, ClipboardList,
  Database, Banknote, Briefcase, Receipt,
} from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   SIDEBAR NAV — Agency Department Structure v4.0
   Organized by real marketing departments so entire companies can
   run their operations from this hub.
   ═══════════════════════════════════════════════════════════════════ */
const NAV = [
  { href: "/cockpit", label: "Cockpit", icon: Rocket, badge: "LIVE" },
  { href: "/intensity", label: "Intensity", icon: Zap, badge: "⚡" },

  { group: "Strategy", items: [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/intelligence", label: "Intelligence", icon: Brain },
    { href: "/brand", label: "Brand", icon: Palette },
    { href: "/brand/documents", label: "Documents", icon: FileText },
    { href: "/personas", label: "Personas", icon: Users },
    { href: "/competitors", label: "Competitors", icon: Swords },
    { href: "/campaigns", label: "Campaigns", icon: Megaphone },
    { href: "/budget", label: "Budget", icon: DollarSign },
    { href: "/playbooks", label: "Playbooks", icon: BookOpenCheck },
    { href: "/strategy", label: "Strategy", icon: Target },
  ]},
  { group: "Creative", items: [
    { href: "/machine", label: "Content Machine", icon: Rocket },
    { href: "/calendar", label: "Calendar", icon: Calendar },
    { href: "/studio", label: "Social Studio", icon: Pencil },
    { href: "/studio-pro", label: "Studio Pro", icon: Layers },
    { href: "/copy", label: "Copy Generator", icon: Wand2 },
    { href: "/emails", label: "Email Builder", icon: Mail },
    { href: "/landing-pages", label: "Landing Pages", icon: Globe },
    { href: "/assets", label: "Asset Library", icon: FolderOpen },
  ]},
  { group: "Media", items: [
    { href: "/seo", label: "SEO Toolkit", icon: Search },
    { href: "/ads", label: "Ads Manager", icon: Target },
    { href: "/attribution", label: "Attribution", icon: GitBranch },
    { href: "/experiments", label: "A/B Tests", icon: FlaskConical },
    { href: "/funnels", label: "Funnels", icon: Target },
    { href: "/funnel-builder", label: "Funnel Builder", icon: GitBranch, badge: "NEW" },
  ]},
  { group: "Revenue", items: [
    { href: "/crm", label: "CRM & Deals", icon: Users },
    { href: "/accounts", label: "ABM Accounts", icon: Building },
    { href: "/sequences", label: "Sequences", icon: Zap },
    { href: "/forms", label: "Forms", icon: FormInput },
    { href: "/lead-magnets", label: "Lead Magnets", icon: Download },
    { href: "/segments", label: "Segments", icon: Filter },
    { href: "/billing", label: "Billing", icon: CreditCard },
  ]},
  { group: "Client Success", items: [
    { href: "/inbox", label: "Inbox", icon: Inbox },
    { href: "/testimonials", label: "Testimonials", icon: Star },
    { href: "/surveys", label: "NPS & Surveys", icon: MessageSquare },
    { href: "/retention", label: "Retention", icon: Activity },
    { href: "/events", label: "Events", icon: CalendarDays },
    { href: "/loyalty", label: "Loyalty Score", icon: Heart, badge: "★" },
    { href: "/brand-equity", label: "Brand Equity", icon: Crown, badge: "NEW" },
  ]},
  { group: "Analytics", items: [
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/reports", label: "Reports", icon: FileText },
    { href: "/wire", label: "The Wire", icon: Newspaper },
    { href: "/dive", label: "Marketing Dive", icon: Globe },
    { href: "/trends", label: "Trends", icon: TrendingUp },
    { href: "/predictive", label: "Predictive", icon: LineChart },
  ]},
  { group: "Operations", items: [
    { href: "/finance", label: "Finance", icon: Landmark },
    { href: "/finance/contractors", label: "Contractors", icon: Globe },
    { href: "/finance/payouts", label: "Payouts", icon: Banknote },
    { href: "/finance/timesheets", label: "Timesheets", icon: Briefcase },
    { href: "/finance/invoices", label: "Invoices", icon: Receipt },
    { href: "/finance/profitability", label: "Profitability", icon: TrendingUp },
    { href: "/roi-marketing", label: "ROI Marketing", icon: Crown, badge: "♔" },
    { href: "/audit", label: "Audit", icon: ShieldCheck },
    { href: "/automations", label: "Automations", icon: Workflow },
    { href: "/tasks", label: "Tasks", icon: ClipboardList },
  ]},
  { group: "Knowledge", items: [
    { href: "/triangle", label: "Triangle Loop", icon: Activity },
    { href: "/nova", label: "Nova AI", icon: Brain },
    { href: "/strategist", label: "Strategist", icon: Target, badge: "AI" },
    { href: "/library", label: "Library", icon: BookOpen },
    { href: "/vault", label: "Book Vault", icon: BookMarked, badge: "📖" },
    { href: "/masters", label: "The Masters", icon: Sparkles, badge: "SOUL" },
    { href: "/papers", label: "Papers", icon: FileText, badge: "NEW" },
  ]},
  { group: "System", items: [
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/integrations", label: "Integrations", icon: Database },
    { href: "/design-system", label: "Design System", icon: Layers },
    { href: "/status", label: "System Status", icon: Activity },
    { href: "/changelog", label: "Changelog", icon: GitBranch },
  ]},
];

let _mobileOpen = false;
const _listeners = new Set<(v: boolean) => void>();
export function toggleMobileSidebar() { _mobileOpen = !_mobileOpen; _listeners.forEach((fn) => fn(_mobileOpen)); }
export function closeMobileSidebar() { _mobileOpen = false; _listeners.forEach((fn) => fn(_mobileOpen)); }

export function Sidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => { _listeners.add(setMobileOpen); return () => { _listeners.delete(setMobileOpen); }; }, []);
  useEffect(() => { closeMobileSidebar(); }, [pathname]);

  const navContent = (
    <nav className="flex-1 overflow-y-auto p-[13px] scrollbar-thin" aria-label="Main navigation">
      {NAV.map((entry) => {
        if (!("group" in entry)) {
          const e = entry as Record<string, unknown>;
          const Icon = e.icon as typeof Rocket;
          const active = mounted && pathname === e.href;
          return (
            <div key={e.href as string} className="mb-[5px]">
              <Link
                href={e.href as string}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "relative flex items-center gap-[5px] px-[5px] py-[8px] rounded-[8px] text-[13px] font-semibold transition-colors",
                  active
                    ? "text-[rgb(var(--text))] border border-[rgb(var(--border-strong))] bg-[rgb(var(--hover))]"
                    : "hover:bg-[rgb(var(--hover))] muted hover:text-[rgb(var(--text))]",
                )}
              >
                <Icon className="w-[16px] h-[16px] flex-shrink-0" />
                <span className="truncate">{e.label as string}</span>
                {e.badge && (
                  <span className={clsx(
                    "text-[8px] font-bold uppercase tracking-wider px-[3px] py-[1px] rounded-[3px] ml-auto",
                    e.badge === "LIVE"
                      ? "bg-[hsla(145,70%,55%,0.089)] text-[hsl(145,70%,55%)]"
                      : e.badge === "⚡"
                        ? "bg-[hsla(38,85%,58%,0.089)] text-[hsl(38,85%,58%)]"
                        : "bg-[rgb(var(--hover))] text-[rgb(var(--text-secondary))]",
                  )}>{e.badge as string}</span>
                )}
              </Link>
            </div>
          );
        }
        const group = entry as { group: string; items: Record<string, unknown>[] };
        return (
          <div key={group.group} className="mb-[5px]">
            <div className="text-[10px] font-bold uppercase tracking-[0.08em] muted px-[3px] mb-[3px]">
              {group.group}
            </div>
            {group.items.map((item) => {
              const href = item.href as string;
              const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
              const Icon = item.icon as typeof Rocket;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={clsx(
                    "relative flex items-center gap-[5px] px-[5px] py-[3px] rounded-[8px] text-[13px] transition-colors",
                    active
                      ? "text-[rgb(var(--text))] font-semibold"
                      : "hover:bg-[rgb(var(--hover))] muted",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-[rgb(var(--hover))] rounded-[8px]"
                      transition={{ type: "spring", stiffness: 233, damping: 34 }}
                    />
                  )}
                  <Icon className="w-[16px] h-[16px] relative z-10 flex-shrink-0" />
                  <span className="relative z-10 truncate">{item.label as string}</span>
                  {item.badge && (
                    <span className={clsx(
                      "relative z-10 text-[8px] font-bold uppercase tracking-wider px-[3px] py-[1px] rounded-[3px] ml-auto",
                      item.badge === "NEW"
                            ? "bg-[rgba(var(--theme-brand-rgb),0.089)] text-[var(--accent)]"
                            : item.badge === "SOUL"
                          ? "bg-[hsla(38,85%,58%,0.089)] text-[hsl(38,85%,58%)]"
                          : item.badge === "⚡"
                            ? "bg-[hsla(38,85%,58%,0.089)] text-[hsl(38,85%,58%)]"
                            : item.badge === "♔"
                            ? "bg-[rgba(var(--theme-brand-rgb),0.089)] text-[var(--accent)]"
                            : "bg-[rgb(var(--hover))] text-[rgb(var(--text-secondary))]",
                    )}>{item.badge as string}</span>
                  )}
                </Link>
              );
            })}
          </div>
        );
      })}
    </nav>
  );

  const sidebarHeader = (
    <div
      className="px-[21px] py-[13px] border-b flex items-center justify-between"
      style={{ borderColor: "rgb(var(--border))" }}
    >
      <div className="flex items-center gap-[5px]">
        <motion.div
          initial={{ rotate: -8, scale: 0.9 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 377, ease: [0.618, 0, 0.618, 1] }}
          className="w-[34px] h-[34px] rounded-[13px] bg-gradient-to-br from-[var(--accent)] to-[color-mix(in srgb,var(--accent),black 20%)] flex items-center justify-center text-white shadow-[0_5px_13px_rgba(var(--theme-brand-rgb),0.233)]"
        >
          <Sparkles className="w-[21px] h-[21px]" />
        </motion.div>
        <div>
          <div className="font-bold text-[13px] text-[rgb(var(--text))]">Marketing Hub</div>
          <div className="text-[10px] muted">All-in-one · v4.0</div>
        </div>
      </div>
      <button
        onClick={() => closeMobileSidebar()}
        className="md:hidden p-[3px] rounded-[8px] hover:bg-[rgb(var(--hover))] transition-colors"
        aria-label="Close navigation menu"
      >
        <X className="w-[21px] h-[21px]" />
      </button>
    </div>
  );

  const sidebarFooter = (
    <div className="p-[13px] border-t text-[10px] muted" style={{ borderColor: "rgb(var(--border))" }}>
      <div>Hub v4.0 · Æther · SQLite</div>
    </div>
  );

  return (
    <>
      <aside
        className="hidden md:flex w-[256px] border-r flex-col flex-shrink-0"
        style={{ background: "rgb(var(--surface))", borderColor: "rgb(var(--border))" }}
        aria-label="Main navigation"
      >
        {sidebarHeader}
        {navContent}
        {sidebarFooter}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.233 }}
              className="fixed inset-0 z-[55] bg-[rgb(var(--bg))] backdrop-blur-[8px] md:hidden"
              onClick={() => closeMobileSidebar()}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 233, damping: 34 }}
              className="fixed top-0 left-0 bottom-0 z-[89] w-[288px] flex flex-col md:hidden"
              style={{ background: "rgb(var(--surface))", borderRight: "1px solid rgb(var(--border))" }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              {sidebarHeader}
              {navContent}
              {sidebarFooter}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}