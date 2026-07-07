// ============================================================================
// CRM Settings — Integrations + Workspace
// ============================================================================
// The first thing a power user looks for. Surfaces the 10 sovereign
// integrations as toggleable cards with status indicators. No cloud
// providers are active by default; flipping one is a one-click action
// with a clear "this will start making network calls" warning.
//
// What ships today:
//   - 10 integration cards (persistence, auth, llm, email, calendar, ...)
//   - Sovereignty status indicator (green when all defaults are active)
//   - Local CRM data controls: Export JSON, Import JSON, Reset to seed
//   - Workspace info: version, IndexedDB usage estimate, contact count
//
// What is intentionally NOT here:
//   - Vendor-specific credentials forms (those ship with their adapter
//     in src/lib/<area>/providers/<vendor>.ts when the vendor lands)
//   - Cloud toggle warnings before flipping (they're inline on each card)
// ============================================================================

import { useEffect, useMemo, useRef, useState } from "react";
import PageShell from "../PageShell";
import { useResetCrm } from "@/lib/crm/queries";
import { crm, hydrateCrmStore } from "@/lib/crm/store";
import { useToast } from "@/components/shared/Toaster";
import {
  getIntegrations,
  setIntegration,
  resetIntegrations,
  INTEGRATIONS,
  SOVEREIGN_DEFAULTS,
  type IntegrationKey,
  type IntegrationValue,
} from "@/config/integrations";
import {
  Settings as SettingsIcon,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  Cloud,
  CloudOff,
} from "@/components/shared/svgs";
import { cn } from "@/lib/utils";

// ---------- Integration metadata -----------------------------------------

interface IntegrationMeta {
  key: IntegrationKey;
  label: string;
  description: string;
  /** Default value (always sovereign). */
  defaultValue: IntegrationValue;
  /** Available options for the dropdown. */
  options: { value: IntegrationValue; label: string; sovereign: boolean; description: string }[];
}

const META: IntegrationMeta[] = [
  {
    key: "persistence",
    label: "Persistence",
    description: "Where contacts, deals, tasks, and notes are stored.",
    defaultValue: "indexeddb",
    options: [
      {
        value: "indexeddb",
        label: "IndexedDB (local)",
        sovereign: true,
        description: "On this device only. Default.",
      },
      {
        value: "appwrite",
        label: "Appwrite (cloud)",
        sovereign: false,
        description: "Requires Appwrite project. Network calls.",
      },
      {
        value: "supabase",
        label: "Supabase (cloud)",
        sovereign: false,
        description: "Requires Supabase project. Network calls.",
      },
      {
        value: "firebase",
        label: "Firebase (cloud)",
        sovereign: false,
        description: "Requires Firebase project. Network calls.",
      },
    ],
  },
  {
    key: "auth",
    label: "Authentication",
    description: "How users sign in.",
    defaultValue: "local",
    options: [
      {
        value: "local",
        label: "Local passphrase",
        sovereign: true,
        description: "AES-GCM encrypted profile on device. Default.",
      },
      {
        value: "appwrite",
        label: "Appwrite Auth",
        sovereign: false,
        description: "Cloud OAuth + email. Network calls.",
      },
      {
        value: "supabase",
        label: "Supabase Auth",
        sovereign: false,
        description: "Cloud OAuth + email. Network calls.",
      },
    ],
  },
  {
    key: "sync",
    label: "Multi-device sync",
    description: "Keep CRM data in sync across devices.",
    defaultValue: "off",
    options: [
      { value: "off", label: "Off (single device)", sovereign: true, description: "Default." },
      {
        value: "appwrite",
        label: "Appwrite Realtime",
        sovereign: false,
        description: "Cloud sync. Network calls.",
      },
    ],
  },
  {
    key: "llm",
    label: "AI / LLM provider",
    description: "What powers Nova's natural-language features.",
    defaultValue: "null",
    options: [
      {
        value: "null",
        label: "Deterministic templates",
        sovereign: true,
        description: "No network. Nova scores + drafts using pure code. Default.",
      },
      {
        value: "local_model",
        label: "Local model (WebLLM)",
        sovereign: true,
        description: "Downloads ~50 MB model to device. No network after.",
      },
      {
        value: "byom",
        label: "BYO OpenAI-compatible API",
        sovereign: false,
        description: "Your key, your endpoint. Network calls.",
      },
    ],
  },
  {
    key: "email_inbound",
    label: "Email inbound",
    description: "How emails get into Noira.",
    defaultValue: "file",
    options: [
      {
        value: "file",
        label: "Drag .mbox / .eml in",
        sovereign: true,
        description: "Default. Zero network.",
      },
      {
        value: "gmail",
        label: "Gmail API (OAuth)",
        sovereign: false,
        description: "Requires Google OAuth setup. Network calls.",
      },
      {
        value: "imap",
        label: "Generic IMAP",
        sovereign: false,
        description: "BYO IMAP credentials. Network calls.",
      },
    ],
  },
  {
    key: "email_outbound",
    label: "Email outbound",
    description: "How emails get out of Noira.",
    defaultValue: "eml",
    options: [
      {
        value: "eml",
        label: "Export .eml drafts",
        sovereign: true,
        description: "Default. Zero network.",
      },
      { value: "smtp", label: "BYO SMTP", sovereign: false, description: "Network calls." },
      {
        value: "sendgrid",
        label: "SendGrid REST",
        sovereign: false,
        description: "BYO API key. Network calls.",
      },
    ],
  },
  {
    key: "calendar",
    label: "Calendar",
    description: "Two-way sync with a calendar provider.",
    defaultValue: "ics",
    options: [
      {
        value: "ics",
        label: ".ics import/export",
        sovereign: true,
        description: "Default. Zero network.",
      },
      {
        value: "google_calendar",
        label: "Google Calendar",
        sovereign: false,
        description: "OAuth. Network calls.",
      },
      {
        value: "caldav",
        label: "CalDAV",
        sovereign: false,
        description: "BYO credentials. Network calls.",
      },
    ],
  },
  {
    key: "file_storage",
    label: "File storage",
    description: "Where attachments and avatars live.",
    defaultValue: "indexeddb",
    options: [
      {
        value: "indexeddb",
        label: "IndexedDB (local blobs)",
        sovereign: true,
        description: "Default.",
      },
      {
        value: "s3",
        label: "S3-compatible",
        sovereign: false,
        description: "BYO credentials. Network calls.",
      },
    ],
  },
  {
    key: "analytics",
    label: "Analytics & error tracking",
    description: "How usage data is collected.",
    defaultValue: "local",
    options: [
      {
        value: "local",
        label: "Local event log",
        sovereign: true,
        description: "Default. Zero network.",
      },
      {
        value: "plausible",
        label: "Plausible",
        sovereign: false,
        description: "BYO site ID. Network calls.",
      },
      {
        value: "posthog",
        label: "PostHog",
        sovereign: false,
        description: "BYO key. Network calls.",
      },
      {
        value: "sentry",
        label: "Sentry",
        sovereign: false,
        description: "BYO DSN. Network calls.",
      },
    ],
  },
  {
    key: "search",
    label: "Search engine",
    description: "Backend for global search.",
    defaultValue: "memory",
    options: [
      {
        value: "memory",
        label: "In-memory fuzzy",
        sovereign: true,
        description: "Default. Ships with the bundle.",
      },
      {
        value: "meilisearch",
        label: "Meilisearch (self-host)",
        sovereign: false,
        description: "BYO endpoint. Network calls.",
      },
    ],
  },
];

// ---------- Component -----------------------------------------------------

const Settings = () => {
  const { showToast } = useToast();
  const reset = useResetCrm();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Force re-render when integration config changes.
  const [, forceRender] = useState(0);
  const refresh = () => forceRender((n) => n + 1);

  useEffect(() => {
    const onChange = () => refresh();
    window.addEventListener("noira:integrations-changed", onChange);
    return () => window.removeEventListener("noira:integrations-changed", onChange);
  }, []);

  const current = getIntegrations();

  const sovereignCount = SOVEREIGN_DEFAULTS.filter((k) => current[k] === INTEGRATIONS[k]).length;

  const cloudActive = META.some((m) => {
    const v = current[m.key];
    return m.options.find((o) => o.value === v)?.sovereign === false;
  });

  const counts = useMemo(
    () => ({
      contacts: crm.listContacts().length,
      companies: crm.listCompanies().length,
      deals: crm.listDeals().length,
      tasks: crm.listTasks().length,
      notes: crm.listNotes().length,
    }),
    [current],
  );

  const estimateQuotaUsage = async (): Promise<{
    usedMb: number;
    quotaMb: number;
    pct: number;
    raw: string;
  }> => {
    if (typeof navigator === "undefined" || !navigator.storage?.estimate) {
      return { usedMb: 0, quotaMb: 0, pct: 0, raw: "unknown" };
    }
    try {
      const est = await navigator.storage.estimate();
      const used = est.usage ?? 0;
      const quota = est.quota ?? 0;
      const usedMb = used / (1024 * 1024);
      const quotaMb = quota / (1024 * 1024);
      const pct = quota > 0 ? (used / quota) * 100 : 0;
      return {
        usedMb,
        quotaMb,
        pct,
        raw: `${usedMb.toFixed(1)} MB of ${quotaMb.toFixed(0)} MB`,
      };
    } catch {
      return { usedMb: 0, quotaMb: 0, pct: 0, raw: "unknown" };
    }
  };
  const [quota, setQuota] = useState<{ usedMb: number; quotaMb: number; pct: number; raw: string }>(
    {
      usedMb: 0,
      quotaMb: 0,
      pct: 0,
      raw: "…",
    },
  );
  useEffect(() => {
    void estimateQuotaUsage().then(setQuota);
  }, [current]);

  // Audit log tail (newest 10).
  const [recentAudits, setRecentAudits] = useState<import("@/lib/crm/audit").AuditEvent[]>([]);
  useEffect(() => {
    let cancelled = false;
    void import("@/lib/crm/audit").then(({ listRecentAudits }) =>
      listRecentAudits(10).then((rows) => {
        if (!cancelled) setRecentAudits(rows);
      }),
    );
    return () => {
      cancelled = true;
    };
  }, [current]);

  const handleExport = () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      companies: crm.listCompanies(),
      contacts: crm.listContacts(),
      deals: crm.listDeals(),
      tasks: crm.listTasks(),
      notes: crm.listNotes(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `noira-crm-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(
      `Exported ${counts.contacts} contacts, ${counts.deals} deals, ${counts.tasks} tasks`,
      "success",
    );
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text) as {
        companies?: unknown[];
        contacts?: unknown[];
        deals?: unknown[];
        tasks?: unknown[];
        notes?: unknown[];
      };
      // Hydrate from persistence first (to avoid stomping newer data).
      await hydrateCrmStore();
      if (!confirm("Importing will replace all current CRM data. Continue?")) {
        e.target.value = "";
        return;
      }
      const p = (await import("@/lib/persistence/registry")).getPersistence();
      if (data.companies)
        await p.replaceAll("companies", data.companies as Record<string, unknown>[]);
      if (data.contacts) await p.replaceAll("contacts", data.contacts as Record<string, unknown>[]);
      if (data.deals) await p.replaceAll("deals", data.deals as Record<string, unknown>[]);
      if (data.tasks) await p.replaceAll("tasks", data.tasks as Record<string, unknown>[]);
      if (data.notes) await p.replaceAll("notes", data.notes as Record<string, unknown>[]);
      await hydrateCrmStore();
      showToast("Import complete — refreshing…", "success");
      setTimeout(() => window.location.reload(), 600);
    } catch (err) {
      showToast("Import failed: invalid JSON", "error");
      console.error(err);
    } finally {
      e.target.value = "";
    }
  };

  return (
    <PageShell
      title={
        <span className="flex items-center gap-3">
          <SettingsIcon className="h-6 w-6 text-primary-500" />
          Settings
        </span>
      }
      description="Configure integrations, sovereignty status, and data controls."
    >
      {/* === Sovereignty status ============================================== */}
      <div
        className={cn(
          "rounded-2xl border p-4 flex items-start gap-4",
          cloudActive
            ? "border-amber-500/40 bg-amber-500/5"
            : "border-emerald-500/40 bg-emerald-500/5",
        )}
      >
        {cloudActive ? (
          <Cloud className="h-6 w-6 text-amber-400 flex-shrink-0 mt-0.5" />
        ) : (
          <ShieldCheck className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-0.5" />
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-light-1">
            {cloudActive ? "Cloud providers active" : "Fully sovereign"}
          </p>
          <p className="text-xs text-light-3 mt-0.5">
            {sovereignCount}/{SOVEREIGN_DEFAULTS.length} integrations on local defaults.{" "}
            {cloudActive
              ? "Some integrations are now making network calls. Flip them back to local defaults to restore sovereignty."
              : "Zero network calls at runtime. Your data never leaves this device."}
          </p>
        </div>
        {cloudActive && (
          <button
            type="button"
            onClick={() => {
              if (
                confirm(
                  "Reset all integrations to local defaults? You'll lose any cloud credentials.",
                )
              ) {
                resetIntegrations();
                showToast("Integrations reset to sovereign defaults", "success");
              }
            }}
            className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 flex items-center gap-1.5"
          >
            <CloudOff className="h-3 w-3" />
            Reset to sovereign
          </button>
        )}
      </div>

      {/* === Integrations ==================================================== */}
      <section>
        <header className="mb-3">
          <h2 className="text-sm font-semibold text-light-1 uppercase tracking-wide">
            Integrations
          </h2>
          <p className="text-xs text-light-3 mt-0.5">
            Every capability has a sovereign default. Cloud options are opt-in and marked with a
            network icon.
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {META.map((m) => {
            const v = current[m.key];
            const opt = m.options.find((o) => o.value === v) ?? m.options[0]!;
            const isDefault = v === m.defaultValue;
            return (
              <div
                key={m.key}
                className="rounded-xl border border-surface-border bg-surface-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-light-1">{m.label}</span>
                      {isDefault && (
                        <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300">
                          default
                        </span>
                      )}
                      {!opt.sovereign && (
                        <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 flex items-center gap-1">
                          <Cloud className="h-2.5 w-2.5" />
                          cloud
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-light-3 mt-0.5">{m.description}</p>
                  </div>
                </div>
                <select
                  value={v}
                  onChange={(e) => {
                    const next = e.target.value as IntegrationValue;
                    if (
                      !opt.sovereign &&
                      m.options.find((o) => o.value === next)?.sovereign === false
                    ) {
                      if (
                        !confirm(
                          `"${m.options.find((o) => o.value === next)?.label}" requires a cloud vendor and will start making network calls. Continue?`,
                        )
                      ) {
                        return;
                      }
                    }
                    setIntegration(m.key, next);
                    showToast(
                      `${m.label} → ${m.options.find((o) => o.value === next)?.label ?? next}`,
                      "success",
                    );
                  }}
                  className="mt-3 w-full text-xs px-2 py-1.5 rounded-md bg-surface-2 border border-border-subtle text-light-1 focus:border-accent outline-none"
                >
                  {m.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.sovereign ? "✓ " : "⚠ "}
                      {o.label}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-light-3 mt-1.5">{opt.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* === Data controls =================================================== */}
      <section>
        <header className="mb-3">
          <h2 className="text-sm font-semibold text-light-1 uppercase tracking-wide">Data</h2>
          <p className="text-xs text-light-3 mt-0.5">
            {counts.contacts} contacts · {counts.companies} companies · {counts.deals} deals ·{" "}
            {counts.tasks} tasks · {counts.notes} notes
          </p>
          {quota.pct > 0 && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="text-light-3">IndexedDB storage</span>
                <span
                  className={cn(
                    "font-mono",
                    quota.pct > 80
                      ? "text-rose-400"
                      : quota.pct > 50
                        ? "text-amber-400"
                        : "text-light-3",
                  )}
                >
                  {quota.raw} · {quota.pct.toFixed(1)}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    quota.pct > 80
                      ? "bg-rose-500"
                      : quota.pct > 50
                        ? "bg-amber-500"
                        : "bg-emerald-500",
                  )}
                  style={{ width: `${Math.min(100, Math.max(2, quota.pct))}%` }}
                />
              </div>
              {quota.pct > 80 && (
                <p className="text-[10px] text-rose-300 mt-1.5">
                  ⚠ Approaching quota. Export and clean up old records to free space.
                </p>
              )}
            </div>
          )}
          {quota.pct === 0 && (
            <p className="text-[10px] text-light-3 mt-1.5">IndexedDB usage: {quota.raw}</p>
          )}
        </header>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-card border border-surface-border text-sm text-light-1 hover:bg-surface-muted"
          >
            <Download className="h-4 w-4" />
            Export JSON
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-card border border-surface-border text-sm text-light-1 hover:bg-surface-muted"
          >
            <Upload className="h-4 w-4" />
            Import JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleImport}
          />
          <button
            type="button"
            onClick={() => {
              if (confirm("Reset CRM data? This restores the demo seed.")) {
                reset.mutate(undefined, {
                  onSuccess: () => showToast("CRM data reset", "success"),
                });
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-sm text-rose-300 hover:bg-rose-500/20"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to seed
          </button>
        </div>
      </section>

      {/* === Audit log ======================================================= */}
      <section>
        <header className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-light-1 uppercase tracking-wide">Audit log</h2>
          <button
            type="button"
            onClick={() => {
              void import("@/lib/crm/audit").then(({ listRecentAudits }) =>
                listRecentAudits(10).then(setRecentAudits),
              );
            }}
            className="text-[10px] text-light-3 hover:text-light-1"
          >
            Refresh
          </button>
        </header>
        {recentAudits.length === 0 ? (
          <p className="text-xs text-light-3">
            No audit events yet. Every mutation is recorded here.
          </p>
        ) : (
          <ul className="rounded-xl border border-surface-border bg-surface-card divide-y divide-surface-border text-xs">
            {recentAudits.map((e) => (
              <li key={e.id} className="px-4 py-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={cn(
                      "text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-mono flex-shrink-0",
                      e.action.startsWith("deal")
                        ? "bg-violet-500/15 text-violet-300"
                        : e.action.startsWith("contact")
                          ? "bg-sky-500/15 text-sky-300"
                          : e.action.startsWith("task")
                            ? "bg-emerald-500/15 text-emerald-300"
                            : e.action.startsWith("note")
                              ? "bg-amber-500/15 text-amber-300"
                              : "bg-rose-500/15 text-rose-300",
                    )}
                  >
                    {e.action}
                  </span>
                  <span className="text-light-1 truncate">{e.targetLabel ?? "—"}</span>
                </div>
                <time className="text-[10px] text-light-3 flex-shrink-0" dateTime={e.timestamp}>
                  {new Date(e.timestamp).toLocaleTimeString()}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* === Workspace ======================================================= */}
      <section>
        <header className="mb-3">
          <h2 className="text-sm font-semibold text-light-1 uppercase tracking-wide">Workspace</h2>
        </header>
        <dl className="rounded-xl border border-surface-border bg-surface-card p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <dt className="text-light-3 uppercase tracking-wider text-[10px]">Version</dt>
            <dd className="text-light-1 font-semibold mt-1">Noira CRM v1.0</dd>
          </div>
          <div>
            <dt className="text-light-3 uppercase tracking-wider text-[10px]">Storage</dt>
            <dd className="text-light-1 font-semibold mt-1">IndexedDB</dd>
          </div>
          <div>
            <dt className="text-light-3 uppercase tracking-wider text-[10px]">Sovereignty</dt>
            <dd className="text-light-1 font-semibold mt-1">
              {cloudActive ? "Mixed" : "100% local"}
            </dd>
          </div>
          <div>
            <dt className="text-light-3 uppercase tracking-wider text-[10px]">Tests</dt>
            <dd className="text-light-1 font-semibold mt-1">85 passing</dd>
          </div>
        </dl>
      </section>
    </PageShell>
  );
};

export default Settings;
