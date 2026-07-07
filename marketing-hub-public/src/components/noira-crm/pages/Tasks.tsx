import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  useContacts,
  useDeals,
  useDeleteTask,
  useSetTaskStatus,
  useTasks,
  useUpsertTask,
} from "@/lib/crm/queries";
import { crmFormat } from "@/lib/crm/store";
import Button from "@/components/shared/Button";
import { Input, Textarea } from "@/components/shared/Input";
import Modal from "@/components/shared/Modal";
import { Monogram } from "@/components/crm/Monogram";
import { useToast } from "@/components/shared/Toaster";
import { FilterBar } from "@/components/shared/FilterBar";
import {
  FILTERABLE_FIELDS,
  emptyGroup,
  filterRecords,
  serializeFilter,
  deserializeFilter,
  type FilterGroup,
} from "@/lib/crm/filter";
import PageShell from "../PageShell";
import {
  Tasks as TasksIcon,
  Plus,
  Search,
  Filter2,
  Calendar,
  Phone,
  Mail,
  Note,
  Clock,
  Edit,
  Trash,
  Check,
  Sparkle,
} from "@/components/shared/svgs";
import { priorityStyle, taskTypeStyle } from "../constants";
import type { DealPriority, Task as CrmTask, TaskType } from "@/lib/crm/types";
import { cn } from "@/lib/utils";

const TASK_TYPE_OPTIONS: { value: TaskType | "all"; label: string }[] = [
  { value: "all", label: "All types" },
  { value: "call", label: "Calls" },
  { value: "email", label: "Emails" },
  { value: "meeting", label: "Meetings" },
  { value: "todo", label: "To-dos" },
  { value: "follow_up", label: "Follow-ups" },
  { value: "note", label: "Notes" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "completed", label: "Completed" },
  { value: "overdue", label: "Overdue" },
];

const PRIORITY_OPTIONS = [
  { value: "all", label: "All priorities" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

const Tasks = () => {
  const { data: tasks, isLoading } = useTasks();
  const { data: contacts } = useContacts();
  const { data: deals } = useDeals();
  const setStatus = useSetTaskStatus();
  const upsert = useUpsertTask();
  const del = useDeleteTask();
  const { showToast } = useToast();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TaskType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<string>("open");
  const [priorityFilter, setPriorityFilter] = useState<DealPriority | "all">("all");
  const [newOpen, setNewOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("new") === "1";
  });
  const [editing, setEditing] = useState<CrmTask | null>(null);

  // Smart group — a typed FilterGroup that drives a saved/URL-shareable view.
  // Default: "open tasks due in the next 7 days" — one rule, no hand-rolled
  // date buckets. Users can add/remove rules; the URL stays in sync.
  const [filterGroup, setFilterGroup] = useState<FilterGroup>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get("filter");
      if (raw) {
        const back = deserializeFilter(raw);
        if (back) return back;
      }
    }
    return emptyGroup("AND");
  });

  const persistFilterToUrl = (g: FilterGroup) => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (g.rules.length === 0 && g.groups.length === 0) {
      params.delete("filter");
    } else {
      params.set("filter", serializeFilter(g));
    }
    const url = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.replaceState({}, "", url);
  };

  const now = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    // Pre-filter by simple dropdowns (status / type / priority / search).
    const pre = (tasks || []).filter((t) => {
      if (typeFilter !== "all" && t.type !== typeFilter) return false;
      if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
      if (statusFilter === "open") {
        if (t.status !== "open") return false;
      } else if (statusFilter === "completed") {
        if (t.status !== "completed") return false;
      } else if (statusFilter === "overdue") {
        if (t.status !== "open" || !t.dueDate) return false;
        if (new Date(t.dueDate) >= now) return false;
      }
      if (!q) return true;
      const contact = (contacts || []).find((c) => c.id === t.contactId);
      return (
        t.title.toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q) ||
        (contact?.fullName.toLowerCase().includes(q) ?? false)
      );
    });
    // Smart group: apply typed FilterGroup on top of the pre-filtered set.
    // When the group is empty, this is a no-op (matches everything).
    return filterRecords(
      pre as unknown as Record<string, unknown>[],
      filterGroup,
      now,
    ) as unknown as CrmTask[];
  }, [tasks, typeFilter, priorityFilter, statusFilter, query, contacts, now, filterGroup]);

  const grouped = useMemo(() => {
    const g: Record<string, CrmTask[]> = {
      overdue: [],
      today: [],
      tomorrow: [],
      thisWeek: [],
      later: [],
      noDate: [],
      completed: [],
    };
    const todayEnd = new Date(now);
    todayEnd.setDate(now.getDate() + 1);
    const tomorrowEnd = new Date(now);
    tomorrowEnd.setDate(now.getDate() + 2);
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() + 7);
    for (const t of filtered) {
      if (t.status === "completed") {
        g.completed.push(t);
        continue;
      }
      if (!t.dueDate) {
        g.noDate.push(t);
        continue;
      }
      const d = new Date(t.dueDate);
      d.setHours(0, 0, 0, 0);
      if (d < now) g.overdue.push(t);
      else if (d < todayEnd) g.today.push(t);
      else if (d < tomorrowEnd) g.tomorrow.push(t);
      else if (d < weekEnd) g.thisWeek.push(t);
      else g.later.push(t);
    }
    return g;
  }, [filtered, now]);

  const stats = useMemo(() => {
    const all = tasks || [];
    return {
      total: all.length,
      open: all.filter((t) => t.status === "open").length,
      overdue: all.filter((t) => t.status === "open" && t.dueDate && new Date(t.dueDate) < now)
        .length,
      today: all.filter((t) => {
        if (!t.dueDate || t.status !== "open") return false;
        const d = new Date(t.dueDate);
        return d.toDateString() === now.toDateString();
      }).length,
      doneThisWeek: all.filter(
        (t) =>
          t.completedAt && new Date(t.completedAt) >= new Date(Date.now() - 7 * 24 * 3600 * 1000),
      ).length,
    };
  }, [tasks, now]);

  return (
    <PageShell
      title={
        <span className="flex items-center gap-3">
          <TasksIcon className="h-6 w-6 text-primary-500" />
          Tasks & activities
        </span>
      }
      description="Calls, emails, meetings, and to-dos — all in one place."
      actions={
        <Button onClick={() => setNewOpen(true)}>
          <Plus className="h-4 w-4" />
          New task
        </Button>
      }
    >
      {/* === Stats =========================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Stat label="Total" value={stats.total} />
        <Stat label="Open" value={stats.open} accent="primary" />
        <Stat label="Due today" value={stats.today} accent="amber" />
        <Stat
          label="Overdue"
          value={stats.overdue}
          accent={stats.overdue > 0 ? "rose" : "emerald"}
        />
        <Stat label="Done this week" value={stats.doneThisWeek} accent="emerald" />
      </div>

      {/* === Filters ========================================================= */}
      <div className="rounded-2xl border border-surface-border bg-surface-card p-3 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="flex-1 min-w-0 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-3" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks…"
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-dark-3 border border-surface-border text-sm text-light-1 placeholder:text-light-3 focus:border-primary-500 outline-none"
          />
        </div>
        <PillSelect
          label="Status"
          value={statusFilter}
          options={STATUS_OPTIONS}
          onChange={setStatusFilter}
        />
        <PillSelect
          label="Type"
          value={typeFilter}
          options={TASK_TYPE_OPTIONS}
          onChange={(v) => setTypeFilter(v as TaskType | "all")}
        />
        <PillSelect
          label="Priority"
          value={priorityFilter}
          options={PRIORITY_OPTIONS}
          onChange={(v) => setPriorityFilter(v as DealPriority | "all")}
        />
      </div>

      {/* === Smart group (typed filter language) ========================== */}
      <div className="rounded-2xl border border-surface-border bg-surface-card p-3 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase tracking-wider text-light-3">
            Smart group · shareable URL
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => {
                // Quick preset: open tasks due in the next 7 days.
                const g = emptyGroup("AND");
                g.rules = [
                  {
                    id: `r_${Date.now()}_a`,
                    field: "status",
                    operand: "IS",
                    value: "open",
                  },
                  {
                    id: `r_${Date.now()}_b`,
                    field: "dueDate",
                    operand: "IS_RELATIVE",
                    value: { direction: "NEXT", amount: 7, unit: "DAY" },
                  },
                ];
                setFilterGroup(g);
                persistFilterToUrl(g);
              }}
              className="text-[10px] px-2 py-1 rounded-full bg-primary-500/15 text-primary-300 hover:bg-primary-500/25"
            >
              Next 7 days
            </button>
            <button
              type="button"
              onClick={() => {
                const g = emptyGroup("AND");
                g.rules = [
                  {
                    id: `r_${Date.now()}_c`,
                    field: "status",
                    operand: "IS",
                    value: "open",
                  },
                  {
                    id: `r_${Date.now()}_d`,
                    field: "dueDate",
                    operand: "IS_IN_PAST",
                    value: null,
                  },
                ];
                setFilterGroup(g);
                persistFilterToUrl(g);
              }}
              className="text-[10px] px-2 py-1 rounded-full bg-rose-500/15 text-rose-300 hover:bg-rose-500/25"
            >
              All overdue
            </button>
            <button
              type="button"
              onClick={() => {
                const g = emptyGroup("AND");
                g.rules = [
                  {
                    id: `r_${Date.now()}_e`,
                    field: "status",
                    operand: "IS",
                    value: "open",
                  },
                  {
                    id: `r_${Date.now()}_f`,
                    field: "dueDate",
                    operand: "IS_RELATIVE",
                    value: { direction: "THIS", unit: "WEEK" },
                  },
                ];
                setFilterGroup(g);
                persistFilterToUrl(g);
              }}
              className="text-[10px] px-2 py-1 rounded-full bg-violet-500/15 text-violet-300 hover:bg-violet-500/25"
            >
              This week
            </button>
          </div>
        </div>
        <FilterBar
          group={filterGroup}
          onChange={(g) => {
            setFilterGroup(g);
            persistFilterToUrl(g);
          }}
          fields={FILTERABLE_FIELDS.task}
        />
      </div>

      {/* === Groups ========================================================== */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-xl border border-surface-border bg-surface-card animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-surface-border bg-surface-card p-12 text-center">
          <Sparkle className="h-8 w-8 text-light-3 mx-auto mb-2" />
          <p className="text-light-2">All caught up! No tasks match the current filters.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {(
            [
              ["overdue", "Overdue", "rose"],
              ["today", "Today", "amber"],
              ["tomorrow", "Tomorrow", "sky"],
              ["thisWeek", "This week", "violet"],
              ["later", "Later", "slate"],
              ["noDate", "No due date", "slate"],
              ["completed", "Completed", "emerald"],
            ] as const
          ).map(([key, label, color]) => {
            const list = grouped[key];
            if (!list || list.length === 0) return null;
            return (
              <section key={key}>
                <header className="flex items-center gap-2 mb-2">
                  <h2
                    className={cn(
                      "text-sm font-semibold uppercase tracking-wider",
                      `text-${color}-300`,
                    )}
                  >
                    {label}
                  </h2>
                  <span className="text-[10px] text-light-3 bg-surface-muted px-1.5 py-0.5 rounded">
                    {list.length}
                  </span>
                </header>
                <ul className="space-y-2">
                  {list.map((t) => {
                    const contact = (contacts || []).find((c) => c.id === t.contactId);
                    const deal = (deals || []).find((d) => d.id === t.dealId);
                    const ts = taskTypeStyle(t.type);
                    const ps = priorityStyle(t.priority);
                    const TypeIcon =
                      t.type === "call"
                        ? Phone
                        : t.type === "email"
                          ? Mail
                          : t.type === "meeting"
                            ? Calendar
                            : t.type === "note"
                              ? Note
                              : t.type === "follow_up"
                                ? Clock
                                : TasksIcon;
                    return (
                      <li
                        key={t.id}
                        className={cn(
                          "rounded-xl border bg-surface-card p-3 flex items-center gap-3 hover:border-surface-muted transition",
                          t.status === "completed" && "opacity-60",
                        )}
                      >
                        <button
                          onClick={() =>
                            setStatus.mutate(
                              {
                                id: t.id,
                                status: t.status === "completed" ? "open" : "completed",
                              },
                              { onSuccess: () => showToast("Updated", "success") },
                            )
                          }
                          className={cn(
                            "h-5 w-5 rounded-md flex-center border flex-shrink-0 transition",
                            t.status === "completed"
                              ? "bg-primary-500 border-primary-500 text-white"
                              : "border-surface-border hover:border-primary-500",
                          )}
                          aria-label={t.status === "completed" ? "Reopen task" : "Complete task"}
                        >
                          {t.status === "completed" ? <Check className="h-3 w-3" /> : null}
                        </button>
                        <div
                          className={cn(
                            "h-8 w-8 rounded-md flex items-center justify-center flex-shrink-0",
                            ts.bg,
                            ts.text,
                          )}
                        >
                          <TypeIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              "text-sm font-medium truncate",
                              t.status === "completed"
                                ? "line-through text-light-3"
                                : "text-light-1",
                            )}
                          >
                            {t.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-light-3 flex-wrap">
                            {contact ? (
                              <Link
                                to={`/crm/contacts/${contact.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1 hover:text-primary-400"
                              >
                                <Monogram
                                  name={contact.fullName}
                                  color={contact.avatarColor}
                                  size="xs"
                                />
                                <span>{contact.fullName}</span>
                              </Link>
                            ) : null}
                            {deal ? <span className="text-light-3">· {deal.name}</span> : null}
                            <span>·</span>
                            <span className={ps.text}>{t.priority}</span>
                            {t.dueDate ? (
                              <>
                                <span>·</span>
                                <span>{crmFormat.date(t.dueDate)}</span>
                              </>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button variant="ghost" onClick={() => setEditing(t)}>
                            <Edit className="h-3 w-3" />
                          </Button>
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
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      <TaskForm
        isOpen={newOpen}
        onClose={() => {
          setNewOpen(false);
          if (typeof window !== "undefined") {
            const url = window.location.pathname + window.location.hash;
            window.history.replaceState({}, "", url);
          }
        }}
        contacts={contacts || []}
        onSubmit={(input) => {
          upsert.mutate(input, {
            onSuccess: () => {
              setNewOpen(false);
              showToast("Task created", "success");
              if (typeof window !== "undefined") {
                const url = window.location.pathname + window.location.hash;
                window.history.replaceState({}, "", url);
              }
            },
          });
        }}
      />
      <TaskForm
        isOpen={!!editing}
        task={editing || undefined}
        onClose={() => setEditing(null)}
        contacts={contacts || []}
        onSubmit={(input) => {
          upsert.mutate(input, {
            onSuccess: () => {
              setEditing(null);
              showToast("Task updated", "success");
            },
          });
        }}
      />
    </PageShell>
  );
};

function Stat({
  label,
  value,
  accent = "primary",
}: {
  label: string;
  value: number;
  accent?: "primary" | "amber" | "emerald" | "rose" | "sky";
}) {
  const colors: Record<string, string> = {
    primary: "text-primary-300",
    amber: "text-amber-300",
    emerald: "text-emerald-300",
    rose: "text-rose-300",
    sky: "text-sky-300",
  };
  return (
    <div className="rounded-xl border border-surface-border bg-surface-card p-3">
      <p className="text-[10px] uppercase tracking-wider text-light-3">{label}</p>
      <p className={cn("text-2xl font-bold mt-1", colors[accent])}>{value}</p>
    </div>
  );
}

interface PillSelectProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}
function PillSelect({ label, value, options, onChange }: PillSelectProps) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full md:w-auto inline-flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-surface-border bg-dark-3 text-sm text-light-1 hover:border-surface-muted transition min-w-[140px]"
      >
        <span className="flex items-center gap-2 truncate">
          <Filter2 className="h-3.5 w-3.5 text-light-3" />
          <span className="text-[10px] uppercase tracking-wider text-light-3">{label}</span>
          <span className="truncate">{current?.label}</span>
        </span>
        <span className="text-light-3 text-xs">▾</span>
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

interface TaskFormProps {
  isOpen: boolean;
  task?: CrmTask;
  onClose: () => void;
  contacts: { id: string; fullName: string }[];
  onSubmit: (input: Omit<CrmTask, "id" | "createdAt" | "updatedAt"> & { id?: string }) => void;
}

function TaskForm({ isOpen, task, onClose, contacts, onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [type, setType] = useState<TaskType>(task?.type || "todo");
  const [priority, setPriority] = useState<DealPriority>(task?.priority || "medium");
  const [dueDate, setDueDate] = useState(
    task?.dueDate
      ? task.dueDate.slice(0, 10)
      : new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().slice(0, 10),
  );
  const [contactId, setContactId] = useState(task?.contactId || "");
  const [description, setDescription] = useState(task?.description || "");

  const taskId = task?.id;
  useMemoReset(taskId, () => {
    setTitle(task?.title || "");
    setType(task?.type || "todo");
    setPriority(task?.priority || "medium");
    setDueDate(
      task?.dueDate
        ? task.dueDate.slice(0, 10)
        : new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    );
    setContactId(task?.contactId || "");
    setDescription(task?.description || "");
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      id: task?.id,
      title: title.trim(),
      description: description.trim() || undefined,
      type,
      status: task?.status || "open",
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      contactId: contactId || undefined,
      dealId: task?.dealId,
      ownerId: task?.ownerId || "me",
      completedAt: task?.completedAt,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? "Edit task" : "New task"}
      description="Capture the next action — small, specific, and time-bound."
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
              className="w-full rounded-lg border border-surface-border bg-dark-3 px-3 py-3 text-light-1 outline-none focus:border-primary-500 transition"
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
              className="w-full rounded-lg border border-surface-border bg-dark-3 px-3 py-3 text-light-1 outline-none focus:border-primary-500 transition"
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
        <Field label="Contact">
          <select
            value={contactId}
            onChange={(e) => setContactId(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-dark-3 px-4 py-3 text-light-1 outline-none focus:border-primary-500 transition"
          >
            <option value="">None</option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Notes">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Talking points, success criteria, what to remember…"
          />
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{task ? "Save changes" : "Create task"}</Button>
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

function useMemoReset<T>(key: T, fn: () => void) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => fn(), [key]);
}

export default Tasks;
