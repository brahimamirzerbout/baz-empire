import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useContactRelations,
  useCompanies,
  useDeleteContact,
  useDeleteDeal,
  useDeleteNote,
  useDeleteTask,
  useSetTaskStatus,
  useTasks,
  useTouchContact,
  useUpsertContact,
  useUpsertDeal,
  useUpsertNote,
  useUpsertTask,
} from "@/lib/crm/queries";
import { crmFormat, PIPELINE_STAGES, STAGE_BY_ID } from "@/lib/crm/store";
import {
  LIFECYCLE_LABELS,
  LIFECYCLE_ORDER,
  type Contact,
  type Deal,
  type DealPriority,
  type DealStage,
  type Note as CrmNote,
  type Task as CrmTask,
  type TaskStatus,
  type TaskType,
} from "@/lib/crm/types";
import { Monogram } from "@/components/crm/Monogram";
import Button from "@/components/shared/Button";
import { Input, Textarea } from "@/components/shared/Input";
import Modal from "@/components/shared/Modal";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { useToast } from "@/components/shared/Toaster";
import PageShell from "../PageShell";
import { ContactForm } from "./Contacts";
import ContactScoreCard from "../components/ContactScoreCard";
import {
  Contact as ContactIcon,
  Mail,
  Phone,
  Briefcase,
  Tag,
  Edit,
  Trash,
  Plus,
  Calendar,
  Note,
  Pin,
  Clock,
  Deal as DealIcon,
  Tasks as TasksIcon,
  ChevronRight,
  Star,
  Sparkle,
  ChevronDown,
  TrendUp,
} from "@/components/shared/svgs";
import { priorityStyle, stageStyle, taskTypeStyle, lifecycleStyle } from "../constants";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "activity", label: "Activity" },
  { key: "deals", label: "Deals" },
  { key: "tasks", label: "Tasks" },
  { key: "notes", label: "Notes" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

const ContactDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: relations, isLoading } = useContactRelations(id || "");
  const { data: companies } = useCompanies();
  const touch = useTouchContact();
  const del = useDeleteContact();
  const [tab, setTab] = useState<TabKey>("activity");
  const [editOpen, setEditOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [dealForm, setDealForm] = useState<Deal | null>(null);
  const [dealFormOpen, setDealFormOpen] = useState(false);
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [noteFormOpen, setNoteFormOpen] = useState(false);
  const { showToast } = useToast();

  const company = relations?.company;

  const allNotes = relations?.notes || [];
  const allDeals = relations?.deals || [];
  const allTasks = relations?.tasks || [];

  const tabContent = useMemo(() => {
    if (tab === "activity") {
      return buildActivity(allNotes, allDeals, allTasks);
    }
    if (tab === "deals") return allDeals;
    if (tab === "tasks") return allTasks;
    return allNotes;
  }, [tab, allNotes, allDeals, allTasks]);

  if (isLoading) {
    return (
      <PageShell title="Loading contact…">
        <div className="h-64 rounded-2xl border border-surface-border bg-surface-card animate-pulse" />
      </PageShell>
    );
  }

  if (!relations || !relations.contact) {
    return (
      <PageShell
        title="Contact not found"
        description="The contact you're looking for doesn't exist or has been deleted."
        actions={
          <Link to="/crm/contacts">
            <Button variant="ghost">
              <ChevronRight className="h-3 w-3 rotate-180" />
              Back to contacts
            </Button>
          </Link>
        }
      >
        <div className="rounded-2xl border border-dashed border-surface-border bg-surface-card p-12 text-center">
          <ContactIcon className="h-10 w-10 text-light-3 mx-auto mb-3" />
          <p className="text-light-2">We couldn't find that contact.</p>
        </div>
      </PageShell>
    );
  }

  const c = relations.contact;
  const lc = lifecycleStyle(c.lifecycle);
  const openDeals = allDeals.filter((d) => d.stage !== "won" && d.stage !== "lost");
  const wonDeals = allDeals.filter((d) => d.stage === "won");

  return (
    <PageShell
      title={
        <span className="flex items-center gap-3 min-w-0">
          <Monogram name={c.fullName} color={c.avatarColor} size="lg" ring />
          <span className="flex flex-col min-w-0">
            <span className="truncate">{c.fullName}</span>
            <span className="text-sm font-normal text-light-3 truncate">
              {c.title}
              {company ? ` · ${company.name}` : ""}
            </span>
          </span>
        </span>
      }
      description=""
      actions={
        <>
          <Button
            variant="ghost"
            onClick={() => {
              touch.mutate(c.id);
              showToast("Marked as contacted", "success");
            }}
          >
            <Phone className="h-4 w-4" />
            Log contact
          </Button>
          <Button variant="dark" onClick={() => setEditOpen(true)}>
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="danger" onClick={() => setDelOpen(true)}>
            <Trash className="h-4 w-4" />
          </Button>
        </>
      }
    >
      {/* === Profile card ===================================================== */}
      <section className="rounded-2xl border border-surface-border bg-surface-card p-5 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-md font-semibold",
                lc.bg,
                lc.text,
              )}
            >
              {LIFECYCLE_LABELS[c.lifecycle]}
            </span>
            {c.tags.map((t) => (
              <span
                key={t}
                className="text-[10px] text-light-3 px-1.5 py-0.5 rounded bg-surface-muted"
              >
                {t}
              </span>
            ))}
            {c.status !== "active" ? (
              <span className="text-[10px] uppercase tracking-wider text-light-3 px-1.5 py-0.5 rounded bg-surface-muted">
                {c.status}
              </span>
            ) : null}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <Info icon={Mail} label="Email" value={c.email} href={`mailto:${c.email}`} />
            {c.phone ? (
              <Info icon={Phone} label="Phone" value={c.phone} href={`tel:${c.phone}`} />
            ) : null}
            {c.title ? <Info icon={Briefcase} label="Title" value={c.title} /> : null}
            {company ? <Info icon={Briefcase} label="Company" value={company.name} /> : null}
            {c.leadSource ? <Info icon={Sparkle} label="Lead source" value={c.leadSource} /> : null}
            {c.lastContactedAt ? (
              <Info
                icon={Clock}
                label="Last contacted"
                value={crmFormat.relative(c.lastContactedAt)}
              />
            ) : null}
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 gap-3">
          <KPI label="Open deals" value={openDeals.length} accent="amber" />
          <KPI
            label="Pipeline value"
            value={crmFormat.money(relations.pipelineValue)}
            accent="primary"
          />
          <KPI
            label="Won"
            value={crmFormat.money(wonDeals.reduce((a, d) => a + d.amount, 0))}
            accent="emerald"
          />
          <KPI label="Open tasks" value={relations.openTasks} accent="rose" />
        </div>
      </section>

      {/* === Nova scores (per-contact) ========================================== */}
      <ContactScoreCard contact={c} />

      {/* === Quick actions ==================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Button
          variant="dark"
          onClick={() => {
            setDealForm(null);
            setDealFormOpen(true);
          }}
        >
          <DealIcon className="h-4 w-4" />
          New deal
        </Button>
        <Button variant="dark" onClick={() => setTaskFormOpen(true)}>
          <TasksIcon className="h-4 w-4" />
          New task
        </Button>
        <Button variant="dark" onClick={() => setNoteFormOpen(true)}>
          <Note className="h-4 w-4" />
          New note
        </Button>
        <Link to={`mailto:${c.email}`} onClick={() => touch.mutate(c.id)}>
          <Button variant="primary" className="w-full">
            <Mail className="h-4 w-4" />
            Email
          </Button>
        </Link>
      </div>

      {/* === Tabs ============================================================= */}
      <div className="flex items-center gap-1 border-b border-surface-border">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "px-3 py-2 text-sm font-medium transition border-b-2 -mb-px",
              tab === t.key
                ? "border-primary-500 text-light-1"
                : "border-transparent text-light-3 hover:text-light-1",
            )}
          >
            {t.label}
            {t.key === "deals" ? (
              <span className="ml-1 text-[10px] text-light-3">({allDeals.length})</span>
            ) : null}
            {t.key === "tasks" ? (
              <span className="ml-1 text-[10px] text-light-3">({allTasks.length})</span>
            ) : null}
            {t.key === "notes" ? (
              <span className="ml-1 text-[10px] text-light-3">({allNotes.length})</span>
            ) : null}
          </button>
        ))}
      </div>

      {tab === "activity" ? (
        <ActivityTimeline items={tabContent as ActivityItem[]} />
      ) : tab === "deals" ? (
        <DealsList
          deals={tabContent as Deal[]}
          onEdit={(d) => {
            setDealForm(d);
            setDealFormOpen(true);
          }}
        />
      ) : tab === "tasks" ? (
        <TasksList tasks={tabContent as CrmTask[]} contact={c} />
      ) : (
        <NotesList notes={tabContent as CrmNote[]} />
      )}

      {/* === Forms / modals ================================================== */}
      <ContactForm
        isOpen={editOpen}
        contact={c}
        onClose={() => setEditOpen(false)}
        onSubmit={(input) => {
          const upsert = useUpsertContact();
          upsert.mutate(input, {
            onSuccess: (updated) => {
              setEditOpen(false);
              showToast(`Contact ${updated.fullName} updated`, "success");
            },
          });
        }}
        saving={false}
      />
      <ConfirmModal
        isOpen={delOpen}
        onClose={() => setDelOpen(false)}
        onConfirm={() => {
          del.mutate(c.id, {
            onSuccess: () => {
              setDelOpen(false);
              showToast("Contact removed", "success");
              navigate("/crm/contacts");
            },
          });
        }}
        title="Delete contact?"
        message={`This will remove ${c.fullName} and all related deals, tasks, and notes. This cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Keep"
        variant="danger"
      />
      <DealForm
        isOpen={dealFormOpen}
        onClose={() => setDealFormOpen(false)}
        contact={c}
        deal={dealForm || undefined}
      />
      <TaskForm isOpen={taskFormOpen} onClose={() => setTaskFormOpen(false)} contact={c} />
      <NoteForm isOpen={noteFormOpen} onClose={() => setNoteFormOpen(false)} contact={c} />
    </PageShell>
  );
};

// Helper to keep JSX simple in the page
// ============================================================================
// Subcomponents
// ============================================================================

function Info({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <span className="flex items-center gap-2 text-light-1">
      <Icon className="h-3.5 w-3.5 text-light-3" />
      <span className="truncate">{value}</span>
    </span>
  );
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wider text-light-3">{label}</span>
      {href ? (
        <a className="hover:text-primary-400 transition" href={href}>
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}

function KPI({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent: "primary" | "sky" | "emerald" | "rose" | "amber";
}) {
  const colors: Record<string, string> = {
    primary: "from-primary-500/20 to-primary-500/5 text-primary-300",
    sky: "from-sky-500/20 to-sky-500/5 text-sky-300",
    emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-300",
    rose: "from-rose-500/20 to-rose-500/5 text-rose-300",
    amber: "from-amber-500/20 to-amber-500/5 text-amber-300",
  };
  return (
    <div
      className={cn(
        "rounded-xl border border-surface-border p-3 bg-gradient-to-br",
        colors[accent],
      )}
    >
      <p className="text-[10px] uppercase tracking-wider text-light-3">{label}</p>
      <p className={cn("text-xl font-bold mt-1")}>{value}</p>
    </div>
  );
}

// ---- Tabs content ---------------------------------------------------------

interface ActivityItem {
  kind: "note" | "deal" | "task";
  at: string;
  data: CrmNote | Deal | CrmTask;
}

function buildActivity(notes: CrmNote[], deals: Deal[], tasks: CrmTask[]): ActivityItem[] {
  const items: ActivityItem[] = [];
  notes.forEach((n) => items.push({ kind: "note", at: n.createdAt, data: n }));
  deals.forEach((d) => items.push({ kind: "deal", at: d.updatedAt, data: d }));
  tasks.forEach((t) => {
    items.push({ kind: "task", at: t.completedAt || t.dueDate || t.createdAt, data: t });
  });
  return items.sort((a, b) => b.at.localeCompare(a.at));
}

function ActivityTimeline({ items }: { items: ActivityItem[] }) {
  const { showToast } = useToast();
  const setStatus = useSetTaskStatus();
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-surface-border bg-surface-card p-12 text-center">
        <Sparkle className="h-8 w-8 text-light-3 mx-auto mb-2" />
        <p className="text-light-2">
          No activity yet — log a call, create a deal, or jot down a note to start the timeline.
        </p>
      </div>
    );
  }
  return (
    <ol className="relative space-y-2 pl-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-surface-border">
      {items.map((it, i) => {
        if (it.kind === "note") {
          const n = it.data as CrmNote;
          return (
            <li key={i} className="relative">
              <span className="absolute -left-[14px] top-2 h-3 w-3 rounded-full bg-violet-500/40 ring-2 ring-surface-card" />
              <div className="rounded-xl border border-surface-border bg-surface-card p-3">
                <div className="flex items-center gap-2 text-xs text-light-3">
                  <Note className="h-3 w-3" />
                  <span>Note</span>
                  <span>·</span>
                  <span>{crmFormat.relative(n.createdAt)}</span>
                  {n.pinned ? <Pin className="h-3 w-3 text-amber-300" /> : null}
                </div>
                <p className="text-sm text-light-1 mt-1 whitespace-pre-wrap">{n.body}</p>
              </div>
            </li>
          );
        }
        if (it.kind === "deal") {
          const d = it.data as Deal;
          const stage = STAGE_BY_ID[d.stage];
          const s = stageStyle(stage.color);
          return (
            <li key={i} className="relative">
              <span
                className={cn(
                  "absolute -left-[14px] top-2 h-3 w-3 rounded-full ring-2 ring-surface-card",
                  s.dot,
                )}
              />
              <div className="rounded-xl border border-surface-border bg-surface-card p-3 flex items-center gap-3">
                <DealIcon className="h-4 w-4 text-light-3" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-light-1 truncate">
                    Deal: {d.name} · {crmFormat.money(d.amount, d.currency)}
                  </p>
                  <p className="text-xs text-light-3">
                    Stage: {stage.label} · {crmFormat.relative(d.updatedAt)}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-md font-semibold",
                    s.bg,
                    s.text,
                  )}
                >
                  {stage.label}
                </span>
              </div>
            </li>
          );
        }
        const t = it.data as CrmTask;
        const ts = taskTypeStyle(t.type);
        const ps = priorityStyle(t.priority);
        return (
          <li key={i} className="relative">
            <span className="absolute -left-[14px] top-2 h-3 w-3 rounded-full bg-emerald-500/40 ring-2 ring-surface-card" />
            <div className="rounded-xl border border-surface-border bg-surface-card p-3 flex items-center gap-3">
              <div className={cn("h-7 w-7 rounded-md flex-center", ts.bg, ts.text)}>
                <TasksIcon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm truncate",
                    t.status === "completed" ? "line-through text-light-3" : "text-light-1",
                  )}
                >
                  {t.title}
                </p>
                <p className="text-xs text-light-3">
                  {ts.label} · <span className={ps.text}>{t.priority}</span>
                  {t.dueDate ? ` · due ${crmFormat.date(t.dueDate)}` : ""}
                </p>
              </div>
              {t.status === "open" ? (
                <button
                  onClick={() =>
                    setStatus.mutate(
                      { id: t.id, status: "completed" },
                      { onSuccess: () => showToast("Task completed", "success") },
                    )
                  }
                  className="text-xs text-primary-400 hover:text-primary-300"
                >
                  Mark done
                </button>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function DealsList({ deals, onEdit }: { deals: Deal[]; onEdit: (d: Deal) => void }) {
  const del = useDeleteDeal();
  const { showToast } = useToast();
  if (deals.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-surface-border bg-surface-card p-12 text-center">
        <DealIcon className="h-8 w-8 text-light-3 mx-auto mb-2" />
        <p className="text-light-2">No deals yet — start a new one above.</p>
      </div>
    );
  }
  return (
    <ul className="space-y-2">
      {deals.map((d) => {
        const stage = STAGE_BY_ID[d.stage];
        const s = stageStyle(stage.color);
        const ps = priorityStyle(d.priority);
        return (
          <li
            key={d.id}
            className="rounded-xl border border-surface-border bg-surface-card p-3 flex items-center gap-3"
          >
            <div className={cn("h-8 w-8 rounded-md flex-center", s.bg, s.text)}>
              <DealIcon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-light-1 truncate">{d.name}</p>
                <span
                  className={cn(
                    "text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-md font-semibold",
                    s.bg,
                    s.text,
                  )}
                >
                  {stage.label}
                </span>
                <span
                  className={cn(
                    "text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-md font-medium",
                    ps.text,
                    "bg-surface-muted",
                  )}
                >
                  {d.priority}
                </span>
              </div>
              <p className="text-xs text-light-3">
                {crmFormat.money(d.amount, d.currency)} · close {crmFormat.date(d.closeDate)} ·{" "}
                {Math.round(d.probability * 100)}% probability
              </p>
            </div>
            <Button variant="ghost" onClick={() => onEdit(d)}>
              <Edit className="h-3 w-3" />
              Edit
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                del.mutate(d.id, {
                  onSuccess: () => showToast("Deal deleted", "success"),
                });
              }}
            >
              <Trash className="h-3 w-3" />
            </Button>
          </li>
        );
      })}
    </ul>
  );
}

function TasksList({ tasks, contact }: { tasks: CrmTask[]; contact: Contact }) {
  const setStatus = useSetTaskStatus();
  const del = useDeleteTask();
  const { showToast } = useToast();
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-surface-border bg-surface-card p-12 text-center">
        <TasksIcon className="h-8 w-8 text-light-3 mx-auto mb-2" />
        <p className="text-light-2">No tasks — add one above to keep momentum.</p>
      </div>
    );
  }
  return (
    <ul className="space-y-2">
      {tasks.map((t) => {
        const ts = taskTypeStyle(t.type);
        const ps = priorityStyle(t.priority);
        const overdue =
          t.status === "open" &&
          t.dueDate &&
          new Date(t.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));
        return (
          <li
            key={t.id}
            className="rounded-xl border border-surface-border bg-surface-card p-3 flex items-center gap-3"
          >
            <input
              type="checkbox"
              checked={t.status === "completed"}
              onChange={(e) =>
                setStatus.mutate(
                  { id: t.id, status: e.target.checked ? "completed" : "open" },
                  { onSuccess: () => showToast("Updated", "success") },
                )
              }
              className="h-4 w-4 rounded border-surface-border accent-primary-500"
            />
            <div className={cn("h-8 w-8 rounded-md flex-center", ts.bg, ts.text)}>
              <TasksIcon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  "text-sm truncate",
                  t.status === "completed" ? "line-through text-light-3" : "text-light-1",
                )}
              >
                {t.title}
              </p>
              <p className="text-xs text-light-3">
                {ts.label} · <span className={ps.text}>{t.priority}</span>
                {t.dueDate ? (
                  <>
                    {" "}
                    ·{" "}
                    <span className={cn(overdue && "text-rose-300 font-medium")}>
                      due {crmFormat.date(t.dueDate)}
                    </span>
                  </>
                ) : null}
              </p>
            </div>
            <Button
              variant="danger"
              onClick={() =>
                del.mutate(t.id, {
                  onSuccess: () => showToast("Task deleted", "success"),
                })
              }
            >
              <Trash className="h-3 w-3" />
            </Button>
          </li>
        );
      })}
    </ul>
  );
}

function NotesList({ notes }: { notes: CrmNote[] }) {
  const del = useDeleteNote();
  const { showToast } = useToast();
  const upsert = useUpsertNote();
  if (notes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-surface-border bg-surface-card p-12 text-center">
        <Note className="h-8 w-8 text-light-3 mx-auto mb-2" />
        <p className="text-light-2">No notes yet — capture context, decisions, and follow-ups.</p>
      </div>
    );
  }
  return (
    <ul className="space-y-2">
      {notes.map((n) => (
        <li key={n.id} className="rounded-xl border border-surface-border bg-surface-card p-3">
          <div className="flex items-center gap-2 text-xs text-light-3">
            <Note className="h-3 w-3" />
            <span>{crmFormat.dateTime(n.createdAt)}</span>
            {n.pinned ? <Pin className="h-3 w-3 text-amber-300" /> : null}
            <div className="ml-auto flex items-center gap-1">
              <button
                className="p-1 hover:bg-surface-muted rounded"
                onClick={() =>
                  upsert.mutate({
                    id: n.id,
                    contactId: n.contactId,
                    body: n.body,
                    pinned: !n.pinned,
                  })
                }
              >
                <Pin className={cn("h-3 w-3", n.pinned ? "text-amber-300" : "text-light-3")} />
              </button>
              <button
                className="p-1 hover:bg-rose-500/10 rounded"
                onClick={() =>
                  del.mutate(n.id, {
                    onSuccess: () => showToast("Note deleted", "success"),
                  })
                }
              >
                <Trash className="h-3 w-3 text-rose-300" />
              </button>
            </div>
          </div>
          <p className="text-sm text-light-1 mt-1 whitespace-pre-wrap">{n.body}</p>
        </li>
      ))}
    </ul>
  );
}

// ---- Forms ----------------------------------------------------------------

function DealForm({
  isOpen,
  onClose,
  contact,
  deal,
}: {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact;
  deal?: Deal;
}) {
  const upsert = useUpsertDeal();
  const { showToast } = useToast();
  const [name, setName] = useState(deal?.name || "");
  const [amount, setAmount] = useState(deal?.amount || 10000);
  const [stage, setStage] = useState<DealStage>(deal?.stage || "lead");
  const [priority, setPriority] = useState<DealPriority>(deal?.priority || "medium");
  const [closeDate, setCloseDate] = useState(
    deal?.closeDate.slice(0, 10) ||
      new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10),
  );
  const [description, setDescription] = useState(deal?.description || "");

  const dealId = deal?.id;
  useMemoReset(dealId, () => {
    setName(deal?.name || "");
    setAmount(deal?.amount || 10000);
    setStage(deal?.stage || "lead");
    setPriority(deal?.priority || "medium");
    setCloseDate(
      deal?.closeDate.slice(0, 10) ||
        new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    );
    setDescription(deal?.description || "");
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const stageDef = STAGE_BY_ID[stage];
    upsert.mutate(
      {
        id: deal?.id,
        name: name.trim(),
        contactId: contact.id,
        companyId: contact.companyId,
        ownerId: deal?.ownerId || "me",
        stage,
        amount: Number(amount),
        currency: deal?.currency || "USD",
        probability: stageDef.probability,
        priority,
        closeDate: new Date(closeDate).toISOString(),
        description: description.trim() || undefined,
      },
      {
        onSuccess: () => {
          onClose();
          showToast(deal ? "Deal updated" : "Deal created", "success");
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={deal ? "Edit deal" : "New deal"}
      description={`Linked to ${contact.fullName}`}
      size="md"
    >
      <form onSubmit={submit} className="space-y-3">
        <Field label="Deal name" required>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Annual contract"
            required
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount (USD)">
            <Input
              type="number"
              min={0}
              step={100}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </Field>
          <Field label="Close date">
            <Input type="date" value={closeDate} onChange={(e) => setCloseDate(e.target.value)} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Stage">
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as DealStage)}
              className="w-full rounded-lg border border-surface-border bg-dark-3 px-4 py-3 text-light-1 outline-none focus:border-primary-500 transition"
            >
              {PIPELINE_STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label} · {Math.round(s.probability * 100)}%
                </option>
              ))}
            </select>
          </Field>
          <Field label="Priority">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as DealPriority)}
              className="w-full rounded-lg border border-surface-border bg-dark-3 px-4 py-3 text-light-1 outline-none focus:border-primary-500 transition"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </Field>
        </div>
        <Field label="Description">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Why this deal, what success looks like, key players…"
          />
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{deal ? "Save changes" : "Create deal"}</Button>
        </div>
      </form>
    </Modal>
  );
}

function TaskForm({
  isOpen,
  onClose,
  contact,
}: {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact;
}) {
  const upsert = useUpsertTask();
  const { showToast } = useToast();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<TaskType>("todo");
  const [priority, setPriority] = useState<DealPriority>("medium");
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().slice(0, 10),
  );
  const [description, setDescription] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    upsert.mutate(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        status: "open",
        priority,
        dueDate: new Date(dueDate).toISOString(),
        contactId: contact.id,
        ownerId: "me",
      },
      {
        onSuccess: () => {
          showToast("Task created", "success");
          setTitle("");
          setDescription("");
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New task"
      description={`For ${contact.fullName}`}
      size="md"
    >
      <form onSubmit={submit} className="space-y-3">
        <Field label="Title" required>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Send proposal"
            required
          />
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Type">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TaskType)}
              className="w-full rounded-lg border border-surface-border bg-dark-3 px-4 py-3 text-light-1 outline-none focus:border-primary-500 transition"
            >
              <option value="todo">To-do</option>
              <option value="call">Call</option>
              <option value="email">Email</option>
              <option value="meeting">Meeting</option>
              <option value="follow_up">Follow-up</option>
              <option value="note">Note</option>
            </select>
          </Field>
          <Field label="Priority">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as DealPriority)}
              className="w-full rounded-lg border border-surface-border bg-dark-3 px-4 py-3 text-light-1 outline-none focus:border-primary-500 transition"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </Field>
          <Field label="Due">
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </Field>
        </div>
        <Field label="Notes">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Context, talking points, what success looks like…"
          />
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create task</Button>
        </div>
      </form>
    </Modal>
  );
}

function NoteForm({
  isOpen,
  onClose,
  contact,
}: {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact;
}) {
  const upsert = useUpsertNote();
  const { showToast } = useToast();
  const [body, setBody] = useState("");
  const [pinned, setPinned] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    upsert.mutate(
      {
        contactId: contact.id,
        body: body.trim(),
        pinned,
      },
      {
        onSuccess: () => {
          showToast("Note added", "success");
          setBody("");
          setPinned(false);
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New note"
      description={`For ${contact.fullName}`}
      size="md"
    >
      <form onSubmit={submit} className="space-y-3">
        <Field label="Note">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            placeholder="What did you learn? What needs to happen next?"
            autoFocus
          />
        </Field>
        <label className="flex items-center gap-2 text-sm text-light-2">
          <input
            type="checkbox"
            checked={pinned}
            onChange={(e) => setPinned(e.target.checked)}
            className="h-4 w-4 rounded border-surface-border accent-primary-500"
          />
          <span className="flex items-center gap-1">
            <Pin className="h-3 w-3 text-amber-300" /> Pin to top of timeline
          </span>
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add note</Button>
        </div>
      </form>
    </Modal>
  );
}

// Field helper component
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

function useMemoReset<T>(key: T, fn: () => void) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => fn(), [key]);
}

export default ContactDetail;
