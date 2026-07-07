"use client";

import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { getBooksForModule } from "@/lib/books";
import { MASTERS } from "@/lib/wisdom";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MODULE WISDOM — Shows the book knowledge and master principles
 * that power each module in the Hub.
 *
 * This is how the site EMBODIES the book principles:
 * - Every module page shows which books and masters teach its principles
 * - Clicking through to the Book Vault connects theory to practice
 * - The user never has to wonder "why?" — the answer is always one click away
 *
 * Embodied principles:
 * - Ogilvy: "Big ideas come from big research" → links to the research (books)
 * - Hopkins: "Every dollar accountable" → measurable connection to ROI
 * - Miller: "Customer is the hero" → you're using the module, we show why it works
 * - Cialdini: "Authority" → citing the masters who proved it works
 * - Schwartz: "Channel existing desire" → showing knowledge the user already wants
 * ═══════════════════════════════════════════════════════════════════════════
 */

interface ModuleWisdomProps {
  /** The module ID, matching the module names in books.ts relatedModules */
  moduleId: string;
  /** Optional module name override */
  moduleName?: string;
}

const MODULE_LABELS: Record<string, string> = {
  copy: "Copy Generator",
  personas: "Personas",
  funnels: "Funnels",
  campaigns: "Campaigns",
  landing_pages: "Landing Pages",
  emails: "Email Builder",
  lead_magnets: "Lead Magnets",
  ads: "Ads Manager",
  crm: "CRM & Deals",
  sequences: "Sequences",
  experiments: "A/B Testing",
  testimonials: "Testimonials",
  brand: "Brand Kit",
  competitors: "Competitors",
  seo: "SEO Toolkit",
  analytics: "Analytics",
  budget: "Budget Planner",
  playbooks: "Playbooks",
  forms: "Forms",
  inbox: "Inbox",
  surveys: "Surveys",
  content_calendar: "Content Calendar",
  social_studio: "Social Studio",
  attribution: "Attribution",
  automations: "Automations",
  intelligence: "Intelligence",
  tasks: "Tasks",
};

export function ModuleWisdom({ moduleId, moduleName }: ModuleWisdomProps) {
  const books = getBooksForModule(moduleId);
  const relevantMasters = MASTERS.filter((m) =>
    m.embodiedIn.toLowerCase().includes(moduleId) ||
    m.principles.some((p) => p.howToApply.toLowerCase().includes(moduleId))
  );

  if (books.length === 0 && relevantMasters.length === 0) return null;

  const label = moduleName || MODULE_LABELS[moduleId] || moduleId;

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "rgb(var(--border))", background: "rgb(var(--surface))" }}>
      {/* Header */}
      <div className="px-5 py-4 border-b" style={{ borderColor: "rgb(var(--border))" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg grid place-items-center" style={{ background: "rgba(var(--theme-brand-rgb), 0.12)" }}>
            <BookOpen className="w-4 h-4 text-[var(--accent)]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: "rgb(var(--text))" }}>
              Knowledge behind {label}
            </h3>
            <p className="text-xs" style={{ color: "rgb(var(--muted))" }}>
              The books and masters that teach the principles powering this module
            </p>
          </div>
        </div>
      </div>

      {/* Books */}
      {books.length > 0 && (
        <div className="px-5 py-3 border-b" style={{ borderColor: "rgb(var(--border))" }}>
          <div className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: "rgb(var(--muted))" }}>
            Books ({books.length})
          </div>
          <div className="space-y-2">
            {books.slice(0, 5).map((book) => (
              <Link
                key={book.id}
                href="/vault"
                className="group flex items-start gap-3 p-2.5 rounded-lg transition-colors hover:bg-white/[0.03]"
              >
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: "var(--theme-brand, #888)" }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold group-hover:text-[var(--accent)] transition-colors" style={{ color: "rgb(var(--text))" }}>
                    {book.title}
                  </div>
                  <div className="text-[10px]" style={{ color: "rgb(var(--muted))" }}>
                    {book.author} · <em>{book.insights.tldr}</em>
                  </div>
                </div>
                <ArrowRight className="w-3 h-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--theme-brand, #888)" }} />
              </Link>
            ))}
            {books.length > 5 && (
              <Link
                href="/vault"
                className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 mt-1"
                style={{ color: "var(--theme-brand, #888)" }}
              >
                + {books.length - 5} more books <ArrowRight className="w-2.5 h-2.5" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Masters */}
      {relevantMasters.length > 0 && (
        <div className="px-5 py-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: "rgb(var(--muted))" }}>
            Masters ({relevantMasters.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {relevantMasters.slice(0, 8).map((master) => (
              <Link
                key={master.id}
                href="/masters"
                className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors hover:border-[var(--accent)]/40"
                style={{ borderColor: "rgb(var(--border))", background: "rgb(var(--surface-2))" }}
              >
                <span className="text-base">{master.avatar}</span>
                <span className="text-xs font-medium group-hover:text-[var(--accent)] transition-colors" style={{ color: "rgb(var(--text))" }}>
                  {master.name}
                </span>
              </Link>
            ))}
            {relevantMasters.length > 8 && (
              <span className="text-[10px] px-2 py-1.5" style={{ color: "rgb(var(--muted))" }}>
                +{relevantMasters.length - 8} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="px-5 py-3 border-t" style={{ borderColor: "rgb(var(--border))" }}>
        <Link
          href="/vault"
          className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all"
          style={{ color: "var(--theme-brand, #888)" }}
        >
          Explore all 74 books in the Book Vault <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}