"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFetch, apiFetch } from "./useFetch";
import {
  Plus,
  User,
  Briefcase,
  Building2,
  Megaphone,
  FileText,
  ListChecks,
  Wand2,
  BookOpen,
  Mail,
  Image as ImageIcon,
  X,
  Lightbulb,
  Hash,
  Layers,
} from "lucide-react";
import { Modal } from "./Modal";
import clsx from "clsx";

type Kind = "contact" | "deal" | "company" | "campaign" | "idea" | "task" | "copy" | "studio";

interface QuickAddConfig {
  kind: Kind;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const QUICK: QuickAddConfig[] = [
  { kind: "contact", label: "New contact", icon: User, color: "violet" },
  { kind: "company", label: "New company", icon: Building2, color: "sky" },
  { kind: "deal", label: "New deal", icon: Briefcase, color: "emerald" },
  { kind: "campaign", label: "New campaign", icon: Megaphone, color: "rose" },
  { kind: "idea", label: "New idea", icon: Lightbulb, color: "amber" },
  { kind: "task", label: "New task", icon: ListChecks, color: "sky" },
  { kind: "copy", label: "Generate copy", icon: Wand2, color: "violet" },
  { kind: "studio", label: "New Studio Pro project", icon: Layers, color: "rose" },
];

const COLOR_CLASSES: Record<string, string> = {
  violet: "bg-violet-100 text-violet-700 hover:bg-violet-200",
  sky: "bg-sky-100 text-sky-700 hover:bg-sky-200",
  emerald: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
  rose: "bg-rose-100 text-rose-700 hover:bg-rose-200",
  amber: "bg-amber-100 text-amber-700 hover:bg-amber-200",
};

export function QuickAdd() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Kind | null>(null);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        title="Quick add (press N anywhere)"
        className={clsx(
          "fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full",
          "text-white flex items-center justify-center transition-all duration-300",
          "hover:scale-110 active:scale-95",
          open && "rotate-45",
        )}
        style={{
          background:
            "linear-gradient(135deg, var(--theme-brand, #888), var(--theme-brand-secondary, #888))",
          boxShadow: "0 8px 32px -4px var(--theme-brand-glow, rgba(100, 100, 100, 0.4))",
        }}
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Picker overlay */}
      {open && (
        <div className="fixed inset-0 z-30" onClick={() => setOpen(false)}>
          <div
            className="absolute bottom-24 right-6 w-72 overflow-hidden"
            style={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid var(--glass-border)",
              borderRadius: "16px",
              boxShadow: "var(--shadow-xl)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="p-3 border-b"
              style={{
                borderColor: "rgb(var(--border))",
                background:
                  "linear-gradient(90deg, var(--theme-brand-soft, rgba(100,100,100,0.06)), var(--theme-brand-soft, rgba(100,100,100,0.04)))",
              }}
            >
              <div className="text-xs uppercase tracking-wider font-bold text-[color-mix(in srgb,var(--accent),black 20%)] dark:text-[color-mix(in srgb,var(--accent),white 5%)]">
                Quick add
              </div>
              <div className="text-[10px] muted mt-0.5">Press N anywhere · Esc to close</div>
            </div>
            <div className="grid grid-cols-2 gap-1 p-2">
              {QUICK.map((q) => {
                const Icon = q.icon;
                return (
                  <button
                    key={q.kind}
                    onClick={() => {
                      setOpen(false);
                      setActive(q.kind);
                    }}
                    className={clsx(
                      "p-3 rounded-lg flex flex-col items-center gap-1 text-center transition-colors",
                      COLOR_CLASSES[q.color],
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="text-xs font-semibold">{q.label.replace(/^New /, "")}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {active && <QuickAddModal kind={active} onClose={() => setActive(null)} />}
    </>
  );
}

function QuickAddModal({ kind, onClose }: { kind: Kind; onClose: () => void }) {
  if (kind === "copy") {
    // Redirect to copy page with prefilled state — simple: open copy page
    if (typeof window !== "undefined") window.location.href = "/copy";
    return null;
  }
  if (kind === "studio") {
    if (typeof window !== "undefined") window.location.href = "/studio-pro";
    return null;
  }
  return <QuickAddForm kind={kind} onClose={onClose} />;
}

function QuickAddForm({ kind, onClose }: { kind: Kind; onClose: () => void }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState<unknown>(defaultsFor(kind));

  async function save() {
    setBusy(true);
    try {
      const endpoint = endpointFor(kind);
      const r = (await apiFetch(endpoint, { method: "POST", body: JSON.stringify(f) })) as Record<string, unknown>;
      const id = r?.id;
      const dest = redirectFor(kind);
      if (dest) {
        // Stay on current page but toast? Simpler: navigate
        onClose();
        router.refresh();
        if (id && dest.includes(":")) {
          router.push(dest.replace(":", id));
        } else {
          router.push(dest);
        }
      } else {
        onClose();
        router.refresh();
      }
    } catch (e: unknown) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open onClose={onClose} title={QUICK.find((q) => q.kind === kind)?.label || "New"}>
      <div className="space-y-3">
        {fieldsFor(kind).map((field) => (
          <div key={field.name}>
            <label className="label">
              {field.label}
              {field.required ? " *" : ""}
            </label>
            {field.type === "textarea" ? (
              <textarea
                className="textarea"
                rows={3}
                value={f[field.name] || ""}
                onChange={(e) => setF({ ...f, [field.name]: e.target.value })}
                placeholder={field.placeholder}
              />
            ) : field.type === "select" ? (
              <select
                className="input"
                value={f[field.name] || ""}
                onChange={(e) => setF({ ...f, [field.name]: e.target.value })}
              >
                <option value="">—</option>
                {field.options?.map((o: string) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="input"
                type={field.type || "text"}
                value={f[field.name] || ""}
                onChange={(e) => setF({ ...f, [field.name]: e.target.value })}
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}
        <div
          className="flex justify-end gap-2 pt-2 border-t"
          style={{ borderColor: "rgb(var(--border))" }}
        >
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={save} disabled={!isValid(kind, f) || busy}>
            {busy ? "Saving…" : "Create"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function defaultsFor(kind: Kind): Record<string, unknown> {
  switch (kind) {
    case "contact":
      return {
        first_name: "",
        last_name: "",
        email: "",
        company: "",
        source: "manual",
        status: "lead",
      };
    case "company":
      return { name: "", domain: "", industry: "", size: "" };
    case "deal":
      return { title: "", value: 5000, stage: "lead", probability: 20 };
    case "campaign":
      return { name: "", type: "awareness", status: "draft", budget: 1000 };
    case "idea":
      return { title: "", description: "", category: "remarkable" };
    case "task":
      return { title: "", priority: "medium", project: "" };
  }
  return {};
}

function fieldsFor(
  kind: Kind,
): Array<{
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
}> {
  switch (kind) {
    case "contact":
      return [
        { name: "first_name", label: "First name", required: true, placeholder: "Brahim" },
        { name: "last_name", label: "Last name", placeholder: "Zerbout" },
        {
          name: "email",
          label: "Email",
          type: "email",
          required: true,
          placeholder: "[email protected]",
        },
        { name: "company", label: "Company", placeholder: "Acme Co" },
        {
          name: "source",
          label: "Source",
          type: "select",
          options: ["manual", "referral", "organic", "paid", "outbound", "ads", "social"],
        },
      ];
    case "company":
      return [
        { name: "name", label: "Name", required: true, placeholder: "Hooli" },
        { name: "domain", label: "Domain", placeholder: "hooli.com" },
        { name: "industry", label: "Industry", placeholder: "SaaS" },
        {
          name: "size",
          label: "Size",
          type: "select",
          options: ["1-10", "11-50", "51-200", "201-1000", "1000+"],
        },
      ];
    case "deal":
      return [
        { name: "title", label: "Title", required: true, placeholder: "Annual retainer" },
        { name: "value", label: "Value (USD)", type: "number", required: true },
        {
          name: "stage",
          label: "Stage",
          type: "select",
          options: ["lead", "qualified", "proposal", "negotiation", "won", "lost"],
        },
        { name: "probability", label: "Probability (%)", type: "number" },
      ];
    case "campaign":
      return [
        { name: "name", label: "Name", required: true, placeholder: "Q4 push" },
        {
          name: "type",
          label: "Type",
          type: "select",
          options: ["awareness", "conversion", "launch", "retention", "consideration"],
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["draft", "scheduled", "live", "paused", "completed"],
        },
        { name: "budget", label: "Budget (USD)", type: "number" },
      ];
    case "idea":
      return [
        {
          name: "title",
          label: "Title",
          required: true,
          placeholder: "Hand-written welcome cards",
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          required: true,
          placeholder: "Real pen-on-paper card mailed the day a customer signs up…",
        },
        {
          name: "category",
          label: "Category",
          type: "select",
          options: [
            "remarkable",
            "minimal",
            "memorable",
            "endorsed",
            "emotional",
            "story",
            "contrarian",
          ],
        },
      ];
    case "task":
      return [
        { name: "title", label: "Title", required: true, placeholder: "Call 3 stale deals" },
        { name: "priority", label: "Priority", type: "select", options: ["low", "medium", "high"] },
        { name: "project", label: "Project", placeholder: "Retention" },
      ];
  }
  return [];
}

function endpointFor(kind: Kind): string {
  return (
    {
      contact: "/api/contacts",
      company: "/api/companies",
      deal: "/api/deals",
      campaign: "/api/campaigns",
      idea: "/api/ideas",
      task: "/api/tasks",
    }[kind as keyof typeof ENDPOINTS] || "/api/tasks"
  );
}
const ENDPOINTS = { contact: 1, company: 1, deal: 1, campaign: 1, idea: 1, task: 1 };

function redirectFor(kind: Kind): string | null {
  return (
    {
      contact: "/crm",
      company: "/crm",
      deal: "/crm",
      campaign: "/campaigns",
      idea: "/ideas",
      task: "/tasks",
    }[kind as keyof typeof ENDPOINTS] || null
  );
}

function isValid(kind: Kind, f: Record<string, unknown>): boolean {
  switch (kind) {
    case "contact":
      return !!f.first_name && !!f.email;
    case "deal":
      return !!f.title && Number(f.value) > 0;
    case "campaign":
      return !!f.name;
    case "idea":
      return !!f.title && !!f.description;
    case "task":
      return !!f.title;
    case "company":
      return !!f.name;
  }
  return true;
}
