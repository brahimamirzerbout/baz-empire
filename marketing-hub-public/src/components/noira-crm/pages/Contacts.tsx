import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  useContacts,
  useCompanies,
  useDeleteContact,
  useUpsertContact,
  useTasks,
  useDeals,
  useNotes,
} from "@/lib/crm/queries";
import { crm as crmStore } from "@/lib/crm/store";
import { useToast } from "@/components/shared/Toaster";
import Button from "@/components/shared/Button";
import { Input, Textarea } from "@/components/shared/Input";
import Modal from "@/components/shared/Modal";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { Monogram } from "@/components/crm/Monogram";
import { crmFormat } from "@/lib/crm/store";
import {
  leadPriorityScore,
  churnRiskScore,
  leadPriorityLabel,
  churnRiskLabel,
  type LeadPriorityResult,
  type ChurnRiskResult,
} from "@/lib/crm/scoring";
import {
  LIFECYCLE_LABELS,
  LIFECYCLE_ORDER,
  type Contact,
  type ContactStatus,
  type LifecycleStage,
} from "@/lib/crm/types";
import PageShell from "../PageShell";
import {
  Contact as ContactIcon,
  Plus,
  Search,
  Filter2,
  ChevronDown,
  Tag,
  Edit,
  Trash,
  Sparkle,
  Bookmark,
  Download,
} from "@/components/shared/svgs";
import { FilterBar } from "@/components/shared/FilterBar";
import {
  FILTERABLE_FIELDS,
  emptyGroup,
  filterRecords,
  serializeFilter,
  deserializeFilter,
  type FilterGroup,
} from "@/lib/crm/filter";
import {
  listSavedViews,
  saveCurrentView,
  deleteSavedView,
  type SavedView,
} from "@/lib/crm/saved-views";
import { cn } from "@/lib/utils";
import { LIFECYCLE_STYLES } from "../constants";

const LEAD_TIER_CLASS: Record<LeadPriorityResult["tier"], string> = {
  low: "bg-slate-500/15 text-slate-300",
  medium: "bg-sky-500/15 text-sky-300",
  high: "bg-violet-500/15 text-violet-300",
  top: "bg-rose-500/15 text-rose-300",
};

const CHURN_BAND_CLASS: Record<ChurnRiskResult["band"], string> = {
  low: "bg-emerald-500/15 text-emerald-300",
  elevated: "bg-amber-500/15 text-amber-300",
  high: "bg-rose-500/15 text-rose-300",
  critical: "bg-rose-600/20 text-rose-200 ring-1 ring-rose-500/40",
};

const pct = (n: number): string => `${Math.round(n * 100)}%`;

const Contacts = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { data: contacts, isLoading } = useContacts();
  const { data: companies } = useCompanies();
  const { data: deals } = useDeals();
  const { data: tasks } = useTasks();
  const { data: notes } = useNotes();
  const { showToast } = useToast();
  const upsert = useUpsertContact();
  const del = useDeleteContact();
  const [query, setQuery] = useState("");
  const [lifecycle, setLifecycle] = useState<LifecycleStage | "all">("all");
  const [status, setStatus] = useState<ContactStatus | "all">("active");
  const [companyFilter, setCompanyFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"leadPriority" | "name" | "recent" | "churnRisk">(
    "leadPriority",
  );
  const [openCreate, setOpenCreate] = useState(params.get("new") === "1");
  const [editing, setEditing] = useState<Contact | null>(null);

  // Smart group: typed filter language, URL-shareable.
  const [filterGroup, setFilterGroup] = useState<FilterGroup>(() => {
    if (typeof window !== "undefined") {
      const raw = new URLSearchParams(window.location.search).get("filter");
      if (raw) {
        const back = deserializeFilter(raw);
        if (back) return back;
      }
    }
    return emptyGroup("AND");
  });
  const persistFilterToUrl = (g: FilterGroup) => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    if (g.rules.length === 0 && g.groups.length === 0) p.delete("filter");
    else p.set("filter", serializeFilter(g));
    const url = `${window.location.pathname}${p.toString() ? `?${p.toString()}` : ""}`;
    window.history.replaceState({}, "", url);
  };

  // Saved views — load from localStorage, refresh on cross-tab changes.
  const [savedViews, setSavedViews] = useState<SavedView[]>(() => listSavedViews("contact"));
  useEffect(() => {
    const refresh = () => setSavedViews(listSavedViews("contact"));
    window.addEventListener("noira:saved-views-changed", refresh);
    return () => window.removeEventListener("noira:saved-views-changed", refresh);
  }, []);
  const [saveViewName, setSaveViewName] = useState("");
  const [deleting, setDeleting] = useState<Contact | null>(null);

  // Open create modal when ?new=1 is set
  if (params.get("new") === "1" && !openCreate) {
    setOpenCreate(true);
    params.delete("new");
    setParams(params, { replace: true });
  }

  const allTags = useMemo(() => {
    const s = new Set<string>();
    (contacts || []).forEach((c) => c.tags.forEach((t) => s.add(t)));
    return [...s].sort();
  }, [contacts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pre = (contacts || []).filter((c) => {
      if (status !== "all" && c.status !== status) return false;
      if (lifecycle !== "all" && c.lifecycle !== lifecycle) return false;
      if (companyFilter !== "all" && c.companyId !== companyFilter) return false;
      if (tagFilter !== "all" && !c.tags.includes(tagFilter)) return false;
      if (!q) return true;
      return (
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.title || "").toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
    // Apply typed filter language on top.
    return filterRecords(
      pre as unknown as Record<string, unknown>[],
      filterGroup,
    ) as unknown as typeof pre;
  }, [contacts, query, lifecycle, status, companyFilter, tagFilter, filterGroup]);

  const stats = useMemo(() => {
    const total = (contacts || []).length;
    const customers = (contacts || []).filter((c) => c.lifecycle === "customer").length;
    const leads = (contacts || []).filter((c) =>
      ["lead", "marketingqualifiedlead", "salesqualifiedlead"].includes(c.lifecycle),
    ).length;
    return { total, customers, leads };
  }, [contacts]);

  // Nova scores per contact (Lead Priority + Churn Risk)
  const scoresByContact = useMemo(() => {
    const map: Record<
      string,
      { lead: ReturnType<typeof leadPriorityScore>; churn: ReturnType<typeof churnRiskScore> }
    > = {};
    if (!contacts || !deals || !tasks || !notes) return map;
    const recentCutoff = Date.now() - 30 * 24 * 3600 * 1000;
    const priorCutoff = Date.now() - 60 * 24 * 3600 * 1000;
    for (const c of contacts) {
      const cTasks = tasks.filter((t) => t.contactId === c.id);
      const cNotes = notes.filter((n) => n.contactId === c.id);
      const cDeals = deals.filter((d) => d.contactId === c.id);
      map[c.id] = {
        lead: leadPriorityScore({ contact: c, deals: cDeals, tasks: cTasks, notes: cNotes }),
        churn: churnRiskScore({
          contact: c,
          tasks: cTasks,
          notes: cNotes,
          deals: cDeals,
          tasksCompletedPrev30d: cTasks.filter((t) => {
            if (t.status !== "completed") return false;
            const ts = new Date(t.completedAt ?? t.updatedAt).getTime();
            return ts >= priorCutoff && ts <= recentCutoff;
          }).length,
        }),
      };
    }
    return map;
  }, [contacts, deals, tasks, notes]);

  return (
    <PageShell
      title={
        <span className="flex items-center gap-3">
          <ContactIcon className="h-6 w-6 text-primary-500" />
          Contacts
        </span>
      }
      description="Everyone you do business with — and the people you'll do business with tomorrow."
      actions={
        <Button onClick={() => setOpenCreate(true)}>
          <Plus className="h-4 w-4" />
          New contact
        </Button>
      }
    >
      {/* === Stats strip ===================================================== */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-surface-border bg-surface-card p-3">
          <p className="text-[10px] uppercase tracking-wider text-light-3">All contacts</p>
          <p className="text-xl font-bold text-light-1 mt-1">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-surface-border bg-surface-card p-3">
          <p className="text-[10px] uppercase tracking-wider text-light-3">Customers</p>
          <p className="text-xl font-bold text-emerald-300 mt-1">{stats.customers}</p>
        </div>
        <div className="rounded-xl border border-surface-border bg-surface-card p-3">
          <p className="text-[10px] uppercase tracking-wider text-light-3">Leads</p>
          <p className="text-xl font-bold text-amber-300 mt-1">{stats.leads}</p>
        </div>
      </div>

      {/* === Filters ========================================================= */}
      <div className="rounded-2xl border border-surface-border bg-surface-card p-3 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="flex-1 min-w-0 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-3" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, title, or tag…"
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-dark-3 border border-surface-border text-sm text-light-1 placeholder:text-light-3 focus:border-primary-500 outline-none"
          />
        </div>
        <SelectPill
          icon={<Filter2 className="h-3.5 w-3.5" />}
          label="Lifecycle"
          value={lifecycle}
          options={[
            { value: "all", label: "All lifecycles" },
            ...LIFECYCLE_ORDER.map((l) => ({ value: l, label: LIFECYCLE_LABELS[l] })),
          ]}
          onChange={(v) => setLifecycle(v as LifecycleStage | "all")}
        />
        <SelectPill
          icon={<Filter2 className="h-3.5 w-3.5" />}
          label="Status"
          value={status}
          options={[
            { value: "all", label: "All statuses" },
            { value: "active", label: "Active" },
            { value: "archived", label: "Archived" },
            { value: "blocked", label: "Blocked" },
          ]}
          onChange={(v) => setStatus(v as ContactStatus | "all")}
        />
        <SelectPill
          label="Company"
          value={companyFilter}
          options={[
            { value: "all", label: "All companies" },
            ...(companies || []).map((c) => ({ value: c.id, label: c.name })),
          ]}
          onChange={setCompanyFilter}
        />
        {allTags.length > 0 ? (
          <SelectPill
            icon={<Tag className="h-3.5 w-3.5" />}
            label="Tag"
            value={tagFilter}
            options={[
              { value: "all", label: "All tags" },
              ...allTags.map((t) => ({ value: t, label: t })),
            ]}
            onChange={setTagFilter}
          />
        ) : null}
        <SelectPill
          icon={<Sparkle className="h-3.5 w-3.5" />}
          label="Sort"
          value={sortBy}
          options={[
            { value: "leadPriority", label: "Lead priority" },
            { value: "churnRisk", label: "Churn risk" },
            { value: "recent", label: "Recent" },
            { value: "name", label: "Name" },
          ]}
          onChange={(v) => setSortBy(v as typeof sortBy)}
        />
      </div>

      {/* === Smart group (typed filter language) ============================ */}
      <div className="rounded-2xl border border-surface-border bg-surface-card p-3 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase tracking-wider text-light-3">
            Smart group · shareable URL
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => {
                const g = emptyGroup("AND");
                g.rules = [
                  { id: `r_${Date.now()}_a`, field: "status", operand: "IS", value: "active" },
                  {
                    id: `r_${Date.now()}_b`,
                    field: "lifecycle",
                    operand: "IS_NOT",
                    value: "customer",
                  },
                ];
                setFilterGroup(g);
                persistFilterToUrl(g);
              }}
              className="text-[10px] px-2 py-1 rounded-full bg-violet-500/15 text-violet-300 hover:bg-violet-500/25"
            >
              Active leads
            </button>
            <button
              type="button"
              onClick={() => {
                const g = emptyGroup("AND");
                g.rules = [
                  { id: `r_${Date.now()}_c`, field: "status", operand: "IS", value: "active" },
                  { id: `r_${Date.now()}_d`, field: "lifecycle", operand: "IS", value: "customer" },
                ];
                setFilterGroup(g);
                persistFilterToUrl(g);
              }}
              className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"
            >
              Customers
            </button>
            <button
              type="button"
              onClick={() => {
                const g = emptyGroup("AND");
                g.rules = [
                  {
                    id: `r_${Date.now()}_e`,
                    field: "lastContactedAt",
                    operand: "IS_RELATIVE",
                    value: { direction: "PAST", amount: 30, unit: "DAY" },
                  },
                ];
                setFilterGroup(g);
                persistFilterToUrl(g);
              }}
              className="text-[10px] px-2 py-1 rounded-full bg-amber-500/15 text-amber-300 hover:bg-amber-500/25"
            >
              Stale 30d
            </button>
          </div>
        </div>
        <FilterBar
          group={filterGroup}
          onChange={(g) => {
            setFilterGroup(g);
            persistFilterToUrl(g);
          }}
          fields={FILTERABLE_FIELDS.contact}
        />
        {/* Saved views strip */}
        <div className="flex items-center gap-2 flex-wrap pt-1.5 border-t border-surface-border">
          <span className="text-[10px] uppercase tracking-wider text-light-3 flex items-center gap-1">
            <Bookmark className="h-3 w-3" /> Saved
          </span>
          {savedViews.length === 0 ? (
            <span className="text-[10px] text-light-3 italic">none yet</span>
          ) : (
            savedViews.slice(0, 5).map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  setFilterGroup(v.group);
                  persistFilterToUrl(v.group);
                }}
                className="text-[10px] px-2 py-0.5 rounded-full bg-surface-2 text-light-2 hover:bg-surface-muted hover:text-light-1"
                title={`Apply saved view · updated ${new Date(v.updatedAt).toLocaleDateString()}`}
              >
                {v.name}
              </button>
            ))
          )}
          <div className="flex-1" />
          {filterGroup.rules.length > 0 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const name = saveViewName.trim();
                if (!name) return;
                const view = saveCurrentView("contact", name, filterGroup);
                setSavedViews(listSavedViews("contact"));
                setSaveViewName("");
                showToast(`Saved view "${view.name}"`, "success");
              }}
              className="flex items-center gap-1"
            >
              <input
                value={saveViewName}
                onChange={(e) => setSaveViewName(e.target.value)}
                placeholder="Save current as…"
                className="text-[10px] px-2 py-0.5 rounded-full bg-surface-2 border border-surface-border text-light-1 placeholder:text-light-3 w-32"
              />
              <button
                type="submit"
                disabled={!saveViewName.trim()}
                className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-white disabled:opacity-40"
              >
                Save
              </button>
            </form>
          )}
          {savedViews.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (confirm(`Delete all ${savedViews.length} saved view(s)?`)) {
                  for (const v of savedViews) deleteSavedView("contact", v.id);
                  setSavedViews(listSavedViews("contact"));
                  showToast("Saved views cleared", "success");
                }
              }}
              className="text-[10px] text-light-3 hover:text-rose-300"
              title="Clear all saved views"
            >
              <Trash className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* === List ============================================================ */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl border border-surface-border bg-surface-card animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-surface-border bg-surface-card p-12 text-center">
          <ContactIcon className="h-10 w-10 text-light-3 mx-auto mb-3" />
          <p className="text-light-1 font-semibold">No contacts match your filters</p>
          <p className="text-light-3 text-sm mt-1">
            Adjust filters or add a new contact to grow your book.
          </p>
          <Button className="mt-4" onClick={() => setOpenCreate(true)}>
            <Plus className="h-4 w-4" />
            Add a contact
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered
            .slice()
            .sort((a, b) => {
              const sa = scoresByContact[a.id];
              const sb = scoresByContact[b.id];
              switch (sortBy) {
                case "leadPriority":
                  return (sb?.lead.score ?? 0) - (sa?.lead.score ?? 0);
                case "churnRisk":
                  return (sb?.churn.risk ?? 0) - (sa?.churn.risk ?? 0);
                case "name":
                  return a.fullName.localeCompare(b.fullName);
                case "recent":
                default:
                  return b.createdAt.localeCompare(a.createdAt);
              }
            })
            .map((c) => {
              const company = (companies || []).find((co) => co.id === c.companyId);
              const lc = LIFECYCLE_STYLES[c.lifecycle] || LIFECYCLE_STYLES.lead;
              const cDeals = (deals || []).filter((d) => d.contactId === c.id);
              const cOpen = cDeals.filter((d) => d.stage !== "won" && d.stage !== "lost");
              const cValue = cOpen.reduce((acc, d) => acc + d.amount, 0);
              const cTasks = (tasks || []).filter(
                (t) => t.contactId === c.id && t.status === "open",
              );
              return (
                <article
                  key={c.id}
                  onClick={() => navigate(`/crm/contacts/${c.id}`)}
                  className="group rounded-2xl border border-surface-border bg-surface-card p-4 cursor-pointer hover:border-primary-500/40 transition relative"
                >
                  <div className="flex items-start gap-3">
                    <Monogram name={c.fullName} color={c.avatarColor} size="lg" ring />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-light-1 truncate">{c.fullName}</p>
                        {c.status !== "active" ? (
                          <span className="text-[10px] uppercase tracking-wider text-light-3 px-1.5 py-0.5 rounded bg-surface-muted">
                            {c.status}
                          </span>
                        ) : null}
                      </div>
                      <p className="text-xs text-light-3 truncate">
                        {c.title}
                        {company ? ` · ${company.name}` : ""}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span
                          className={cn(
                            "text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-md font-semibold",
                            lc.bg,
                            lc.text,
                          )}
                        >
                          {LIFECYCLE_LABELS[c.lifecycle]}
                        </span>
                        {c.tags.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] text-light-3 px-1.5 py-0.5 rounded bg-surface-muted"
                          >
                            {t}
                          </span>
                        ))}
                        {c.tags.length > 2 ? (
                          <span className="text-[10px] text-light-3">+{c.tags.length - 2}</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditing(c);
                        }}
                        className="p-1.5 rounded-md hover:bg-surface-muted"
                        aria-label="Edit"
                      >
                        <Edit className="h-3.5 w-3.5 text-light-2" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleting(c);
                        }}
                        className="p-1.5 rounded-md hover:bg-rose-500/10"
                        aria-label="Delete"
                      >
                        <Trash className="h-3.5 w-3.5 text-rose-300" />
                      </button>
                    </div>
                  </div>

                  {(() => {
                    const sc = scoresByContact[c.id];
                    if (!sc) return null;
                    return (
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] uppercase tracking-wider text-light-3 flex items-center gap-1">
                          <Sparkle className="h-3 w-3 text-primary-400" />
                          Nova
                        </span>
                        <span
                          className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded-md font-medium",
                            LEAD_TIER_CLASS[sc.lead.tier],
                          )}
                          title={`Lead Priority ${pct(sc.lead.score)}`}
                        >
                          Lead {pct(sc.lead.score)}
                        </span>
                        {sc.churn.risk > 0.1 ? (
                          <span
                            className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded-md font-medium",
                              CHURN_BAND_CLASS[sc.churn.band],
                            )}
                            title={`Churn Risk ${pct(sc.churn.risk)} · ${churnRiskLabel(sc.churn.band)}`}
                          >
                            Churn {pct(sc.churn.risk)}
                          </span>
                        ) : null}
                      </div>
                    );
                  })()}

                  <div className="mt-3 pt-3 border-t border-surface-border grid grid-cols-3 gap-2 text-center">
                    <Stat label="Open deals" value={cOpen.length} />
                    <Stat label="Pipeline" value={cValue ? crmFormat.money(cValue) : "—"} mono />
                    <Stat label="Tasks" value={cTasks.length} />
                  </div>
                </article>
              );
            })}
        </div>
      )}

      {/* === Modals ========================================================== */}
      <ContactForm
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={(input) => {
          upsert.mutate(input, {
            onSuccess: (created) => {
              setOpenCreate(false);
              showToast(`Contact ${created.fullName} created`, "success");
              navigate(`/crm/contacts/${created.id}`);
            },
          });
        }}
        saving={upsert.isPending}
      />
      <ContactForm
        isOpen={!!editing}
        contact={editing || undefined}
        onClose={() => setEditing(null)}
        onSubmit={(input) => {
          upsert.mutate(input, {
            onSuccess: (updated) => {
              setEditing(null);
              showToast(`Contact ${updated.fullName} updated`, "success");
            },
          });
        }}
        saving={upsert.isPending}
      />
      <ConfirmModal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (!deleting) return;
          del.mutate(deleting.id, {
            onSuccess: () => {
              setDeleting(null);
              showToast(`Removed ${deleting.fullName}`, "success");
            },
          });
        }}
        title="Delete contact?"
        message={`This will remove ${deleting?.fullName} and all related deals, tasks, and notes. This cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Keep"
        variant="danger"
      />
    </PageShell>
  );
};

function Stat({ label, value, mono }: { label: string; value: number | string; mono?: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-light-3">{label}</p>
      <p className={cn("text-sm font-semibold text-light-1 mt-0.5", mono && "font-mono")}>
        {value}
      </p>
    </div>
  );
}

interface SelectPillProps {
  label?: string;
  icon?: React.ReactNode;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}
function SelectPill({ label, icon, value, options, onChange }: SelectPillProps) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full md:w-auto inline-flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-surface-border bg-dark-3 text-sm text-light-1 hover:border-surface-muted transition min-w-[140px]"
      >
        <span className="flex items-center gap-2 truncate">
          {icon}
          <span className="text-[10px] uppercase tracking-wider text-light-3">{label}</span>
          <span className="truncate">{current?.label}</span>
        </span>
        <ChevronDown className={cn("h-3 w-3 text-light-3 transition", open ? "rotate-180" : "")} />
      </button>
      {open ? (
        <div
          className="absolute z-30 right-0 mt-1 w-56 max-h-64 overflow-y-auto rounded-lg border border-surface-border bg-surface-card shadow-2xl custom-scrollbar"
          onMouseLeave={() => setOpen(false)}
        >
          {options.map((o) => (
            <button
              key={o.value}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={cn(
                "w-full text-left px-3 py-2 text-sm hover:bg-surface-muted transition",
                o.value === value ? "text-primary-400" : "text-light-1",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// ============================================================================
// Contact form
// ============================================================================

interface ContactFormProps {
  isOpen: boolean;
  contact?: Contact;
  onClose: () => void;
  onSubmit: (
    input: Omit<Contact, "id" | "createdAt" | "updatedAt" | "fullName"> & { id?: string },
  ) => void;
  saving?: boolean;
}

const AVATAR_COLORS = [
  "indigo",
  "rose",
  "amber",
  "emerald",
  "sky",
  "violet",
  "fuchsia",
  "teal",
  "orange",
  "cyan",
];

function ContactForm({ isOpen, contact, onClose, onSubmit, saving }: ContactFormProps) {
  const { data: companies } = useCompanies();
  const [firstName, setFirstName] = useState(contact?.firstName || "");
  const [lastName, setLastName] = useState(contact?.lastName || "");
  const [email, setEmail] = useState(contact?.email || "");
  const [phone, setPhone] = useState(contact?.phone || "");
  const [title, setTitle] = useState(contact?.title || "");
  const [companyId, setCompanyId] = useState(contact?.companyId || "");
  const [lifecycle, setLifecycle] = useState<LifecycleStage>(contact?.lifecycle || "lead");
  const [status, setStatus] = useState<ContactStatus>(contact?.status || "active");
  const [leadSource, setLeadSource] = useState(contact?.leadSource || "");
  const [avatarColor, setAvatarColor] = useState(contact?.avatarColor || "indigo");
  const [tagsStr, setTagsStr] = useState(contact?.tags.join(", ") || "");
  const [newCompanyName, setNewCompanyName] = useState("");

  // Reset form when contact changes
  const contactId = contact?.id;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useMemoReset(contactId, () => {
    setFirstName(contact?.firstName || "");
    setLastName(contact?.lastName || "");
    setEmail(contact?.email || "");
    setPhone(contact?.phone || "");
    setTitle(contact?.title || "");
    setCompanyId(contact?.companyId || "");
    setLifecycle(contact?.lifecycle || "lead");
    setStatus(contact?.status || "active");
    setLeadSource(contact?.leadSource || "");
    setAvatarColor(contact?.avatarColor || "indigo");
    setTagsStr(contact?.tags.join(", ") || "");
    setNewCompanyName("");
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) return;
    let finalCompanyId = companyId;
    if (newCompanyName.trim() && !finalCompanyId) {
      const created = crmStore.upsertCompany({
        name: newCompanyName.trim(),
        logoColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      });
      finalCompanyId = created.id;
    }
    onSubmit({
      id: contact?.id,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      title: title.trim() || undefined,
      companyId: finalCompanyId || undefined,
      ownerId: contact?.ownerId || "me",
      lifecycle,
      status,
      leadSource: leadSource.trim() || undefined,
      avatarColor,
      tags: tagsStr
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={contact ? "Edit contact" : "New contact"}
      description="People are the heart of your CRM. Capture the essentials now and enrich later."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-4">
          <Monogram
            name={`${firstName} ${lastName}`.trim() || "?"}
            color={avatarColor}
            size="xl"
            ring
          />
          <div className="flex-1">
            <p className="text-xs text-light-3 mb-1">Avatar color</p>
            <div className="flex flex-wrap gap-1.5">
              {AVATAR_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setAvatarColor(c)}
                  className={cn(
                    "h-6 w-6 rounded-full ring-1 ring-surface-border transition",
                    `bg-${c}-500/40`,
                    avatarColor === c && "ring-2 ring-primary-500",
                  )}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="First name" required>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Ava"
              required
            />
          </Field>
          <Field label="Last name">
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Chen"
            />
          </Field>
          <Field label="Email" required>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ava@example.com"
              required
            />
          </Field>
          <Field label="Phone">
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 415 555 0100"
            />
          </Field>
          <Field label="Title">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VP of Sales"
            />
          </Field>
          <Field label="Lead source">
            <Input
              value={leadSource}
              onChange={(e) => setLeadSource(e.target.value)}
              placeholder="Referral, LinkedIn, etc."
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Company">
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="w-full rounded-lg border border-surface-border bg-dark-3 px-4 py-3 text-light-1 outline-none focus:border-primary-500 transition"
            >
              <option value="">No company</option>
              {(companies || []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <Input
              className="mt-2"
              placeholder="…or add a new company"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Lifecycle">
              <select
                value={lifecycle}
                onChange={(e) => setLifecycle(e.target.value as LifecycleStage)}
                className="w-full rounded-lg border border-surface-border bg-dark-3 px-4 py-3 text-light-1 outline-none focus:border-primary-500 transition"
              >
                {LIFECYCLE_ORDER.map((l) => (
                  <option key={l} value={l}>
                    {LIFECYCLE_LABELS[l]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContactStatus)}
                className="w-full rounded-lg border border-surface-border bg-dark-3 px-4 py-3 text-light-1 outline-none focus:border-primary-500 transition"
              >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
                <option value="blocked">Blocked</option>
              </select>
            </Field>
          </div>
        </div>

        <Field label="Tags">
          <Input
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
            placeholder="priority, warm, follow-up (comma-separated)"
          />
        </Field>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={saving}>
            {contact ? "Save changes" : "Create contact"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs text-light-3">
        {label}
        {required ? <span className="text-rose-400"> *</span> : null}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

/** Reset the form when the underlying contact changes (re-open with different record). */
function useMemoReset<T>(key: T, fn: () => void) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => fn(), [key]);
}

export { ContactForm };
export default Contacts;
