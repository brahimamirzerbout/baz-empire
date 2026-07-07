import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useContacts,
  useCompanies,
  useDeals,
  useDeleteDeal,
  useMoveDealStage,
  useUpsertDeal,
} from "@/lib/crm/queries";
import { crm as crmStore, crmFormat, PIPELINE_STAGES, STAGE_BY_ID } from "@/lib/crm/store";
import Button from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import Modal from "@/components/shared/Modal";
import { Monogram } from "@/components/crm/Monogram";
import { useToast } from "@/components/shared/Toaster";
import PageShell from "../PageShell";
import {
  Pipeline as PipelineIcon,
  Plus,
  Calendar,
  Deal as DealIcon,
  Tag,
  Briefcase,
  ChevronRight,
  Search,
  Filter2,
  More,
  Edit,
  Trash,
  TrendUp,
} from "@/components/shared/svgs";
import { priorityStyle, stageStyle } from "../constants";
import { cn } from "@/lib/utils";
import type { Deal, DealPriority, DealStage } from "@/lib/crm/types";

const Pipeline = () => {
  const { data: deals, isLoading } = useDeals();
  const { data: contacts } = useContacts();
  const { data: companies } = useCompanies();
  const move = useMoveDealStage();
  const upsert = useUpsertDeal();
  const del = useDeleteDeal();
  const { showToast, showActionToast } = useToast();
  const [params] = useSearchParams();
  const focusedDealId = params.get("deal");
  const [dragging, setDragging] = useState<string | null>(null);
  const [hoverStage, setHoverStage] = useState<DealStage | null>(null);
  const [query, setQuery] = useState("");
  const [ownerFilter, setOwnerFilter] = useState<"all" | "me">("all");
  const [newDealOpen, setNewDealOpen] = useState(false);
  const [editing, setEditing] = useState<Deal | null>(null);

  const filteredDeals = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (deals || []).filter((d) => {
      if (ownerFilter === "me" && d.ownerId !== "me") return false;
      if (!q) return true;
      const contact = (contacts || []).find((c) => c.id === d.contactId);
      return (
        d.name.toLowerCase().includes(q) || (contact?.fullName.toLowerCase().includes(q) ?? false)
      );
    });
  }, [deals, contacts, query, ownerFilter]);

  const byStage = useMemo(() => {
    const map: Record<DealStage, Deal[]> = {
      lead: [],
      qualified: [],
      proposal: [],
      negotiation: [],
      won: [],
      lost: [],
    };
    for (const d of filteredDeals) {
      map[d.stage].push(d);
    }
    // Sort each column by value desc
    for (const k of Object.keys(map) as DealStage[]) {
      map[k].sort((a, b) => b.amount - a.amount);
    }
    return map;
  }, [filteredDeals]);

  const totalValue = filteredDeals
    .filter((d) => d.stage !== "won" && d.stage !== "lost")
    .reduce((acc, d) => acc + d.amount, 0);

  const handleDrop = (stage: DealStage, dealId: string) => {
    setDragging(null);
    setHoverStage(null);
    const deal = (deals || []).find((d) => d.id === dealId);
    if (!deal || deal.stage === stage) return;
    move.mutate(
      { id: dealId, stage },
      {
        onSuccess: () => {
          showToast(`Moved "${deal.name}" to ${STAGE_BY_ID[stage].label}`, "success");
        },
      },
    );
  };

  return (
    <PageShell
      title={
        <span className="flex items-center gap-3">
          <PipelineIcon className="h-6 w-6 text-primary-500" />
          Sales pipeline
        </span>
      }
      description="Drag deals between stages. Open any card to see the full record."
      actions={
        <Button onClick={() => setNewDealOpen(true)}>
          <Plus className="h-4 w-4" />
          New deal
        </Button>
      }
    >
      {/* === Filters / summary strip ========================================= */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-3" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search deals or contacts…"
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-dark-3 border border-surface-border text-sm text-light-1 placeholder:text-light-3 focus:border-primary-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOwnerFilter("all")}
            className={cn(
              "px-3 py-2 rounded-lg text-xs font-medium transition",
              ownerFilter === "all"
                ? "bg-primary-500 text-white"
                : "bg-dark-3 text-light-2 hover:bg-surface-muted",
            )}
          >
            All deals
          </button>
          <button
            onClick={() => setOwnerFilter("me")}
            className={cn(
              "px-3 py-2 rounded-lg text-xs font-medium transition",
              ownerFilter === "me"
                ? "bg-primary-500 text-white"
                : "bg-dark-3 text-light-2 hover:bg-surface-muted",
            )}
          >
            My deals
          </button>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-surface-border bg-surface-card text-sm">
          <TrendUp className="h-4 w-4 text-emerald-400" />
          <span className="text-light-2">Open value:</span>
          <span className="text-light-1 font-mono font-semibold">
            {crmFormat.money(totalValue)}
          </span>
        </div>
      </div>

      {/* === Board ============================================================ */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-96 rounded-2xl border border-surface-border bg-surface-card animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 min-h-[60vh]">
          {PIPELINE_STAGES.map((stage) => {
            const list = byStage[stage.id];
            const stageTotal = list.reduce((acc, d) => acc + d.amount, 0);
            const sStyle = stageStyle(stage.color);
            const isHover = hoverStage === stage.id;
            const isClosed = stage.id === "won" || stage.id === "lost";
            return (
              <div
                key={stage.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (hoverStage !== stage.id) setHoverStage(stage.id);
                }}
                onDragLeave={() => {
                  if (hoverStage === stage.id) setHoverStage(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragging) handleDrop(stage.id, dragging);
                }}
                className={cn(
                  "rounded-2xl border bg-surface-card/60 flex flex-col min-h-[60vh] transition",
                  isHover
                    ? "border-primary-500 ring-2 ring-primary-500/30"
                    : "border-surface-border",
                )}
              >
                <header className="p-3 border-b border-surface-border sticky top-0 z-10 bg-surface-card/95 backdrop-blur rounded-t-2xl">
                  <div className="flex items-center gap-2">
                    <span className={cn("h-2.5 w-2.5 rounded-full flex-shrink-0", sStyle.dot)} />
                    <h3 className="text-sm font-semibold text-light-1 flex-1 truncate">
                      {stage.label}
                    </h3>
                    <span className="text-[10px] text-light-3 bg-surface-muted px-1.5 py-0.5 rounded">
                      {list.length}
                    </span>
                  </div>
                  <p className="text-[11px] text-light-3 mt-1 font-mono">
                    {crmFormat.money(stageTotal)}
                    <span className="text-light-4 ml-1">
                      · {Math.round(stage.probability * 100)}%
                    </span>
                  </p>
                </header>

                <div className="flex-1 p-2 space-y-2 overflow-y-auto custom-scrollbar">
                  {list.length === 0 ? (
                    <div className="h-24 flex items-center justify-center text-xs text-light-4 border border-dashed border-surface-border rounded-lg">
                      Drop deals here
                    </div>
                  ) : (
                    list.map((d) => (
                      <DealCard
                        key={d.id}
                        deal={d}
                        contact={(contacts || []).find((c) => c.id === d.contactId)}
                        company={(companies || []).find((co) => co.id === d.companyId)}
                        focused={focusedDealId === d.id}
                        dragging={dragging === d.id}
                        onDragStart={() => setDragging(d.id)}
                        onDragEnd={() => {
                          setDragging(null);
                          setHoverStage(null);
                        }}
                        onEdit={() => setEditing(d)}
                        onDelete={() => {
                          // Undo-able delete: snapshot the deal, fire toast
                          // with an Undo action that re-inserts.
                          const snapshot = { ...d };
                          del.mutate(d.id, {
                            onSuccess: () => {
                              showActionToast(
                                `Deleted "${snapshot.name}"`,
                                {
                                  label: "Undo",
                                  onClick: () => {
                                    // Re-insert via upsert with the original id.
                                    crmStore.upsertDeal(snapshot);
                                    showToast(`Restored "${snapshot.name}"`, "success");
                                  },
                                },
                                "default",
                              );
                            },
                          });
                        }}
                        dimClosed={isClosed}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <DealForm
        isOpen={newDealOpen}
        onClose={() => setNewDealOpen(false)}
        contacts={contacts || []}
        onSubmit={(input) => {
          upsert.mutate(input, {
            onSuccess: () => {
              setNewDealOpen(false);
              showToast("Deal created", "success");
            },
          });
        }}
        saving={upsert.isPending}
      />
      <DealForm
        isOpen={!!editing}
        deal={editing || undefined}
        contacts={contacts || []}
        onClose={() => setEditing(null)}
        onSubmit={(input) => {
          upsert.mutate(input, {
            onSuccess: () => {
              setEditing(null);
              showToast("Deal updated", "success");
            },
          });
        }}
        saving={upsert.isPending}
      />
    </PageShell>
  );
};

function DealCard({
  deal,
  contact,
  company,
  dragging,
  focused,
  onDragStart,
  onDragEnd,
  onEdit,
  onDelete,
  dimClosed,
}: {
  deal: Deal;
  contact?: { id: string; fullName: string; avatarColor: string };
  company?: { id: string; name: string; logoColor: string };
  dragging: boolean;
  focused: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onEdit: () => void;
  onDelete: () => void;
  dimClosed: boolean;
}) {
  const ps = priorityStyle(deal.priority);
  const isOverdue = new Date(deal.closeDate) < new Date();
  return (
    <article
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        "group rounded-xl border bg-surface-card p-3 cursor-grab active:cursor-grabbing transition",
        focused ? "border-primary-500 ring-2 ring-primary-500/30" : "border-surface-border",
        dragging ? "opacity-40 scale-95" : "hover:border-surface-muted",
        dimClosed ? "opacity-75" : "",
      )}
    >
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-light-1 line-clamp-2">{deal.name}</p>
          <p className="text-xs text-light-3 mt-0.5 font-mono">
            {crmFormat.money(deal.amount, deal.currency)}
          </p>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1 rounded hover:bg-surface-muted"
            aria-label="Edit"
          >
            <Edit className="h-3 w-3 text-light-2" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 rounded hover:bg-rose-500/10"
            aria-label="Delete"
          >
            <Trash className="h-3 w-3 text-rose-300" />
          </button>
        </div>
      </div>

      {contact ? (
        <div className="mt-2 flex items-center gap-2 text-xs text-light-2">
          <Monogram name={contact.fullName} color={contact.avatarColor} size="xs" />
          <span className="truncate">{contact.fullName}</span>
        </div>
      ) : null}

      <div className="mt-2 flex items-center gap-2 flex-wrap text-[10px] text-light-3">
        {company ? (
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-muted">
            <Briefcase className="h-2.5 w-2.5" />
            {company.name}
          </span>
        ) : null}
        <span
          className={cn(
            "flex items-center gap-1 px-1.5 py-0.5 rounded",
            isOverdue ? "bg-rose-500/15 text-rose-300" : "bg-surface-muted",
          )}
        >
          <Calendar className="h-2.5 w-2.5" />
          {crmFormat.date(deal.closeDate)}
        </span>
        <span className={cn("px-1.5 py-0.5 rounded font-medium", ps.text, "bg-surface-muted")}>
          {deal.priority}
        </span>
      </div>
    </article>
  );
}

interface DealFormProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: { id: string; fullName: string }[];
  deal?: Deal;
  onSubmit: (
    input: Omit<Deal, "id" | "createdAt" | "updatedAt" | "stageEnteredAt"> & { id?: string },
  ) => void;
  saving?: boolean;
}

function DealForm({ isOpen, onClose, contacts, deal, onSubmit, saving }: DealFormProps) {
  const [name, setName] = useState(deal?.name || "");
  const [amount, setAmount] = useState(deal?.amount || 10000);
  const [stage, setStage] = useState<DealStage>(deal?.stage || "lead");
  const [priority, setPriority] = useState<DealPriority>(deal?.priority || "medium");
  const [closeDate, setCloseDate] = useState(
    deal?.closeDate.slice(0, 10) ||
      new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10),
  );
  const [contactId, setContactId] = useState(deal?.contactId || contacts[0]?.id || "");
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
    setContactId(deal?.contactId || contacts[0]?.id || "");
    setDescription(deal?.description || "");
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contactId) return;
    const contact = contacts.find((c) => c.id === contactId);
    const stageDef = STAGE_BY_ID[stage];
    onSubmit({
      id: deal?.id,
      name: name.trim(),
      contactId,
      companyId: contact ? crmStore.getContact(contactId)?.companyId : undefined,
      ownerId: deal?.ownerId || "me",
      stage,
      amount: Number(amount),
      currency: deal?.currency || "USD",
      probability: stageDef.probability,
      priority,
      closeDate: new Date(closeDate).toISOString(),
      description: description.trim() || undefined,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={deal ? "Edit deal" : "New deal"}
      description="Every deal starts as a probability — give it a value, a stage, and a close date."
      size="md"
    >
      <form onSubmit={submit} className="space-y-3">
        <Field label="Deal name" required>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Q1 expansion"
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
        <div className="grid grid-cols-3 gap-3">
          <Field label="Stage">
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as DealStage)}
              className="w-full rounded-lg border border-surface-border bg-dark-3 px-3 py-3 text-light-1 outline-none focus:border-primary-500 transition"
            >
              {PIPELINE_STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
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
          <Field label="Contact" required>
            <select
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
              className="w-full rounded-lg border border-surface-border bg-dark-3 px-3 py-3 text-light-1 outline-none focus:border-primary-500 transition"
              required
            >
              {contacts.length === 0 ? (
                <option value="">No contacts yet</option>
              ) : (
                contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName}
                  </option>
                ))
              )}
            </select>
          </Field>
        </div>
        <Field label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Key players, success criteria, blockers…"
            className="w-full rounded-lg border border-surface-border bg-dark-3 px-4 py-3 text-light-1 placeholder:text-light-4 outline-none focus:border-primary-500 transition custom-scrollbar"
          />
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={saving}>
            {deal ? "Save changes" : "Create deal"}
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

function useMemoReset<T>(key: T, fn: () => void) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => fn(), [key]);
}

export default Pipeline;
