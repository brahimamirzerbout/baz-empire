// ============================================================================
// Onboarding — 3-step wizard for first-run users
// ============================================================================
// Detected by: no contacts exist AND the user is on Dashboard.
// Three steps:
//   1. Welcome + sovereignty pitch (so they trust it)
//   2. First contact (one click → seeded with sample data)
//   3. First deal on that contact → land on contact detail
//
// Stored in localStorage as `noira.onboarding.done.v1` once completed.
// Re-runnable from Settings → Reset to seed doesn't re-trigger it.
// ============================================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUpsertContact, useUpsertDeal, useUpsertTask } from "@/lib/crm/queries";
import { useToast } from "@/components/shared/Toaster";
import { ShieldCheck, Sparkle, Check, ArrowRight, ArrowLeft } from "@/components/shared/svgs";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "noira.onboarding.done.v1";

export function isOnboardingDone(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return true;
  }
}

export function markOnboardingDone(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // ignore
  }
}

export function resetOnboarding(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

interface OnboardingProps {
  onDone: () => void;
  /** Optional: pre-fill the demo contact with the user's identity. */
  defaultName?: string;
}

export function Onboarding({ onDone, defaultName = "Your first contact" }: OnboardingProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const upsertContact = useUpsertContact();
  const upsertDeal = useUpsertDeal();
  const upsertTask = useUpsertTask();
  const [contactId, setContactId] = useState<string | null>(null);

  const finish = () => {
    markOnboardingDone();
    onDone();
  };

  const createSampleContact = () => {
    upsertContact.mutate(
      {
        firstName: defaultName.split(" ")[0] ?? "Sample",
        lastName: defaultName.split(" ").slice(1).join(" ") || "Lead",
        email: `${defaultName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        ownerId: "u_demo",
        lifecycle: "salesqualifiedlead",
        status: "active",
        avatarColor: "violet",
        tags: ["onboarding"],
      },
      {
        onSuccess: (created) => {
          setContactId(created.id);
          showToast("Contact created", "success");
          setStep(3);
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-40 bg-surface-bg/95 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-2xl border border-surface-border bg-surface-card shadow-2xl overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-surface-2 flex">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "flex-1 transition-colors",
                s <= step ? "bg-primary-500" : "bg-transparent",
              )}
            />
          ))}
        </div>

        <div className="p-8">
          {/* STEP 1 — Welcome */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-8 w-8 text-emerald-400" />
                <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-semibold">
                  Sovereign by default
                </span>
              </div>
              <h2 className="text-2xl font-bold text-light-1 leading-tight">
                Welcome to Noira CRM
              </h2>
              <p className="text-sm text-light-2 leading-relaxed">
                Noira is the only CRM that runs entirely on your device by default. Zero network
                calls. Zero vendor lock-in. Your contacts, deals, and notes never leave this machine
                unless you explicitly enable a cloud integration in Settings.
              </p>
              <ul className="space-y-2 text-sm text-light-2">
                {[
                  "Open the source, audit it on this laptop",
                  "Export everything as JSON anytime",
                  "Flip to any cloud vendor in Settings when ready",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-500 text-white hover:bg-primary-600 text-sm font-medium"
                >
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — First contact */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Sparkle className="h-8 w-8 text-primary-400" />
                <span className="text-[10px] uppercase tracking-wider text-primary-300 font-semibold">
                  Step 2 of 3
                </span>
              </div>
              <h2 className="text-2xl font-bold text-light-1 leading-tight">
                Create your first contact
              </h2>
              <p className="text-sm text-light-2 leading-relaxed">
                We'll add a sample contact so you can see how deals, tasks, and notes attach to a
                person. You can rename and edit them right after.
              </p>
              <div className="rounded-xl border border-dashed border-primary-500/40 bg-primary-500/5 p-4 text-sm">
                <p className="font-medium text-light-1">Will create:</p>
                <p className="text-light-2 mt-1">
                  <span className="font-mono">{defaultName}</span>{" "}
                  <span className="text-light-3">· salesqualifiedlead · owner: you</span>
                </p>
              </div>
              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-light-3 hover:text-light-1 text-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={createSampleContact}
                  disabled={upsertContact.isPending}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 text-sm font-medium"
                >
                  {upsertContact.isPending ? "Creating…" : "Create contact"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — First deal + task */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Check className="h-8 w-8 text-emerald-400" />
                <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-semibold">
                  Step 3 of 3
                </span>
              </div>
              <h2 className="text-2xl font-bold text-light-1 leading-tight">
                Add a deal and a follow-up task
              </h2>
              <p className="text-sm text-light-2 leading-relaxed">
                Every meaningful contact has a deal and a next step. We'll add both, then drop you
                on the contact page where you can explore.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={!contactId || upsertDeal.isPending}
                  onClick={() => {
                    if (!contactId) return;
                    upsertDeal.mutate(
                      {
                        contactId,
                        ownerId: "u_demo",
                        name: "Discovery call",
                        stage: "qualified",
                        amount: 5000,
                        currency: "USD",
                        probability: 0.3,
                        priority: "high",
                        closeDate: new Date(Date.now() + 30 * 86_400_000)
                          .toISOString()
                          .slice(0, 10),
                      },
                      {
                        onSuccess: () =>
                          upsertTask.mutate(
                            {
                              contactId,
                              ownerId: "u_demo",
                              title: "Send discovery follow-up email",
                              type: "email",
                              status: "open",
                              priority: "high",
                              dueDate: new Date(Date.now() + 86_400_000).toISOString().slice(0, 10),
                            },
                            {
                              onSuccess: () => {
                                showToast("Onboarding complete — welcome to Noira", "success");
                                finish();
                                navigate(`/crm/contacts/${contactId}`);
                              },
                            },
                          ),
                      },
                    );
                  }}
                  className="rounded-xl border border-surface-border bg-surface-2 p-4 text-left hover:border-primary-500/50 transition disabled:opacity-50"
                >
                  <p className="text-xs text-light-3 uppercase tracking-wider">Deal</p>
                  <p className="text-sm font-semibold text-light-1 mt-1">
                    Discovery call · $5,000 · Qualified
                  </p>
                  <p className="text-[10px] text-light-3 mt-2">
                    Close in 30 days · 30% probability
                  </p>
                </button>
                <div className="rounded-xl border border-dashed border-surface-border p-4 text-left">
                  <p className="text-xs text-light-3 uppercase tracking-wider">Task</p>
                  <p className="text-sm font-semibold text-light-1 mt-1">
                    Send discovery follow-up email
                  </p>
                  <p className="text-[10px] text-light-3 mt-2">Due tomorrow · high priority</p>
                </div>
              </div>
              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={finish}
                  className="text-light-3 hover:text-light-1 text-sm"
                >
                  Skip for now
                </button>
                <button
                  type="button"
                  onClick={finish}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-surface-card border border-surface-border text-light-1 hover:bg-surface-2 text-sm font-medium"
                >
                  Skip — go to dashboard
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="px-8 py-3 border-t border-surface-border bg-surface-1 text-[10px] text-light-3 flex items-center justify-between">
          <span>Onboarding · step {step} of 3</span>
          <button type="button" onClick={finish} className="hover:text-light-1">
            Skip setup
          </button>
        </div>
      </div>
    </div>
  );
}
