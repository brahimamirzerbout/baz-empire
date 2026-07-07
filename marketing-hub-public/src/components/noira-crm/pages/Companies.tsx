import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  useCompanies,
  useContacts,
  useDeals,
  useDeleteCompany,
  useUpsertCompany,
} from "@/lib/crm/queries";
import { crmFormat, PIPELINE_STAGES, STAGE_BY_ID } from "@/lib/crm/store";
import Button from "@/components/shared/Button";
import { Input, Textarea } from "@/components/shared/Input";
import Modal from "@/components/shared/Modal";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { Monogram } from "@/components/crm/Monogram";
import { useToast } from "@/components/shared/Toaster";
import PageShell from "../PageShell";
import {
  Company as CompanyIcon,
  Plus,
  Search,
  Edit,
  Trash,
  Briefcase,
  TrendUp,
} from "@/components/shared/svgs";
import { stageStyle } from "../constants";
import { cn } from "@/lib/utils";
import type { Company } from "@/lib/crm/types";

const Companies = () => {
  const { data: companies, isLoading } = useCompanies();
  const { data: contacts } = useContacts();
  const { data: deals } = useDeals();
  const del = useDeleteCompany();
  const upsert = useUpsertCompany();
  const { showToast } = useToast();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Company | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Company | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (companies || []).filter((c) => {
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        (c.industry || "").toLowerCase().includes(q) ||
        (c.domain || "").toLowerCase().includes(q)
      );
    });
  }, [companies, query]);

  return (
    <PageShell
      title={
        <span className="flex items-center gap-3">
          <CompanyIcon className="h-6 w-6 text-primary-500" />
          Companies
        </span>
      }
      description="The organizations behind your contacts — and the engine of every deal."
      actions={
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" />
          New company
        </Button>
      }
    >
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-3" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search companies…"
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-dark-3 border border-surface-border text-sm text-light-1 placeholder:text-light-3 focus:border-primary-500 outline-none"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 rounded-2xl border border-surface-border bg-surface-card animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-surface-border bg-surface-card p-12 text-center">
          <CompanyIcon className="h-10 w-10 text-light-3 mx-auto mb-3" />
          <p className="text-light-1 font-semibold">No companies yet</p>
          <p className="text-light-3 text-sm mt-1">
            Companies are auto-created when you add a contact — or you can add one directly.
          </p>
          <Button className="mt-4" onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" />
            Add a company
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((co) => {
            const cContacts = (contacts || []).filter((c) => c.companyId === co.id);
            const cDeals = (deals || []).filter((d) => d.companyId === co.id);
            const cOpen = cDeals.filter((d) => d.stage !== "won" && d.stage !== "lost");
            const cValue = cOpen.reduce((a, d) => a + d.amount, 0);
            const stageCount = PIPELINE_STAGES.map((s) => ({
              stage: s,
              count: cDeals.filter((d) => d.stage === s.id).length,
            }));
            return (
              <article
                key={co.id}
                className="rounded-2xl border border-surface-border bg-surface-card p-4 flex flex-col gap-3 hover:border-surface-muted transition"
              >
                <header className="flex items-start gap-3">
                  <Monogram name={co.name} color={co.logoColor} size="lg" ring />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-light-1 truncate">{co.name}</p>
                    {co.industry ? (
                      <p className="text-xs text-light-3 truncate">
                        {co.industry}
                        {co.size ? ` · ${co.size}` : ""}
                      </p>
                    ) : null}
                    {co.domain ? (
                      <a
                        href={`https://${co.domain}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary-400 hover:text-primary-300 truncate inline-block max-w-full"
                      >
                        {co.domain}
                      </a>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditing(co)}
                      className="p-1.5 rounded-md hover:bg-surface-muted"
                      aria-label="Edit"
                    >
                      <Edit className="h-3.5 w-3.5 text-light-2" />
                    </button>
                    <button
                      onClick={() => setDeleting(co)}
                      className="p-1.5 rounded-md hover:bg-rose-500/10"
                      aria-label="Delete"
                    >
                      <Trash className="h-3.5 w-3.5 text-rose-300" />
                    </button>
                  </div>
                </header>

                {/* mini pipeline */}
                <div className="flex items-center gap-1 h-1.5 rounded-full overflow-hidden bg-surface-muted">
                  {stageCount
                    .filter((s) => s.count > 0)
                    .map((s) => {
                      const total = cDeals.length || 1;
                      return (
                        <div
                          key={s.stage.id}
                          className={cn("h-full", stageStyle(s.stage.color).dot)}
                          style={{ width: `${(s.count / total) * 100}%` }}
                          title={`${s.stage.label}: ${s.count}`}
                        />
                      );
                    })}
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <Stat label="People" value={cContacts.length} />
                  <Stat label="Open deals" value={cOpen.length} />
                  <Stat label="Pipeline" value={cValue ? crmFormat.money(cValue) : "—"} mono />
                </div>

                {cContacts.length > 0 ? (
                  <div className="flex items-center gap-1 pt-2 border-t border-surface-border">
                    <span className="text-[10px] text-light-3 uppercase tracking-wider mr-1">
                      Team
                    </span>
                    <div className="flex -space-x-2">
                      {cContacts.slice(0, 5).map((c) => (
                        <Link key={c.id} to={`/crm/contacts/${c.id}`} title={c.fullName}>
                          <Monogram
                            name={c.fullName}
                            color={c.avatarColor}
                            size="xs"
                            className="ring-2 ring-surface-card"
                          />
                        </Link>
                      ))}
                      {cContacts.length > 5 ? (
                        <span className="ml-2 text-[10px] text-light-3 self-center">
                          +{cContacts.length - 5}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}

      <CompanyForm
        isOpen={creating}
        onClose={() => setCreating(false)}
        onSubmit={(input) => {
          upsert.mutate(input, {
            onSuccess: () => {
              setCreating(false);
              showToast("Company created", "success");
            },
          });
        }}
      />
      <CompanyForm
        isOpen={!!editing}
        company={editing || undefined}
        onClose={() => setEditing(null)}
        onSubmit={(input) => {
          upsert.mutate(input, {
            onSuccess: () => {
              setEditing(null);
              showToast("Company updated", "success");
            },
          });
        }}
      />
      <ConfirmModal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (!deleting) return;
          del.mutate(deleting.id, {
            onSuccess: () => {
              setDeleting(null);
              showToast("Company removed", "success");
            },
          });
        }}
        title="Delete company?"
        message={`This will remove ${deleting?.name} and unlink it from related contacts.`}
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

function CompanyForm({
  isOpen,
  company,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  company?: Company;
  onClose: () => void;
  onSubmit: (input: Omit<Company, "id" | "createdAt" | "updatedAt"> & { id?: string }) => void;
}) {
  const [name, setName] = useState(company?.name || "");
  const [domain, setDomain] = useState(company?.domain || "");
  const [industry, setIndustry] = useState(company?.industry || "");
  const [size, setSize] = useState(company?.size || "");
  const [logoColor, setLogoColor] = useState(company?.logoColor || "indigo");
  const [notes, setNotes] = useState(company?.notes || "");

  const companyId = company?.id;
  useMemoReset(companyId, () => {
    setName(company?.name || "");
    setDomain(company?.domain || "");
    setIndustry(company?.industry || "");
    setSize(company?.size || "");
    setLogoColor(company?.logoColor || "indigo");
    setNotes(company?.notes || "");
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      id: company?.id,
      name: name.trim(),
      domain: domain.trim() || undefined,
      industry: industry.trim() || undefined,
      size: size.trim() || undefined,
      logoColor,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={company ? "Edit company" : "New company"}
      description="The company record anchors every contact and deal in its orbit."
      size="md"
    >
      <form onSubmit={submit} className="space-y-3">
        <div className="flex items-center gap-4">
          <Monogram name={name || "?"} color={logoColor} size="xl" ring />
          <div className="flex-1">
            <p className="text-xs text-light-3 mb-1">Logo color</p>
            <div className="flex flex-wrap gap-1.5">
              {AVATAR_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setLogoColor(c)}
                  className={cn(
                    "h-6 w-6 rounded-full ring-1 ring-surface-border transition",
                    `bg-${c}-500/40`,
                    logoColor === c && "ring-2 ring-primary-500",
                  )}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </div>
        </div>

        <Field label="Name" required>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Acme Inc."
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Domain">
            <Input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="acme.com"
            />
          </Field>
          <Field label="Industry">
            <Input
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="SaaS, Retail, etc."
            />
          </Field>
        </div>
        <Field label="Size">
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-dark-3 px-4 py-3 text-light-1 outline-none focus:border-primary-500 transition"
          >
            <option value="">Select…</option>
            <option value="1-10">1-10</option>
            <option value="10-50">10-50</option>
            <option value="50-200">50-200</option>
            <option value="200-500">200-500</option>
            <option value="500-1000">500-1000</option>
            <option value="1000-5000">1000-5000</option>
            <option value="5000+">5000+</option>
          </select>
        </Field>
        <Field label="Notes">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Anything worth remembering about this company…"
          />
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{company ? "Save changes" : "Create company"}</Button>
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

export default Companies;
