import { ComponentType, SVGProps } from "react";
import { Dashboard, Contact, Pipeline, Tasks, Company, Briefcase } from "@/components/shared/svgs";
import type { ID } from "@/lib/crm/types";

export type CrmNavLink = {
  imgURL: ComponentType<SVGProps<SVGSVGElement>>;
  route: string;
  label: string;
  /** Optional badge count for sidebar pills. */
  badgeKey?: "openDeals" | "openTasks" | "overdueTasks" | "contacts";
};

export const crmSidebarLinks: CrmNavLink[] = [
  { imgURL: Dashboard, route: "/crm", label: "Dashboard" },
  { imgURL: Contact, route: "/crm/contacts", label: "Contacts", badgeKey: "contacts" },
  { imgURL: Company, route: "/crm/companies", label: "Companies" },
  { imgURL: Pipeline, route: "/crm/pipeline", label: "Pipeline", badgeKey: "openDeals" },
  { imgURL: Tasks, route: "/crm/tasks", label: "Tasks", badgeKey: "openTasks" },
  { imgURL: Briefcase, route: "/crm/finance", label: "Finance Center" },
];

/** Returns true if the given path belongs to the CRM section. */
export function isCrmPath(pathname: string): boolean {
  return pathname === "/crm" || pathname.startsWith("/crm/");
}

/** Stage palette used across the CRM UI. Returns tailwind text+bg+border classes. */
export const STAGE_STYLES: Record<
  string,
  { text: string; bg: string; border: string; dot: string; ring: string }
> = {
  slate: {
    text: "text-slate-300",
    bg: "bg-slate-500/15",
    border: "border-slate-500/30",
    dot: "bg-slate-400",
    ring: "ring-slate-500/30",
  },
  sky: {
    text: "text-sky-300",
    bg: "bg-sky-500/15",
    border: "border-sky-500/30",
    dot: "bg-sky-400",
    ring: "ring-sky-500/30",
  },
  violet: {
    text: "text-violet-300",
    bg: "bg-violet-500/15",
    border: "border-violet-500/30",
    dot: "bg-violet-400",
    ring: "ring-violet-500/30",
  },
  amber: {
    text: "text-amber-300",
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
    dot: "bg-amber-400",
    ring: "ring-amber-500/30",
  },
  emerald: {
    text: "text-emerald-300",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/30",
    dot: "bg-emerald-400",
    ring: "ring-emerald-500/30",
  },
  rose: {
    text: "text-rose-300",
    bg: "bg-rose-500/15",
    border: "border-rose-500/30",
    dot: "bg-rose-400",
    ring: "ring-rose-500/30",
  },
};

export const PRIORITY_STYLES: Record<string, { text: string; bg: string; dot: string }> = {
  low: { text: "text-light-3", bg: "bg-dark-4", dot: "bg-slate-400" },
  medium: { text: "text-sky-300", bg: "bg-sky-500/15", dot: "bg-sky-400" },
  high: { text: "text-amber-300", bg: "bg-amber-500/15", dot: "bg-amber-400" },
  critical: { text: "text-rose-300", bg: "bg-rose-500/15", dot: "bg-rose-400" },
};

export const TASK_TYPE_STYLES: Record<string, { text: string; bg: string; label: string }> = {
  call: { text: "text-sky-300", bg: "bg-sky-500/15", label: "Call" },
  email: { text: "text-violet-300", bg: "bg-violet-500/15", label: "Email" },
  meeting: { text: "text-amber-300", bg: "bg-amber-500/15", label: "Meeting" },
  todo: { text: "text-light-2", bg: "bg-dark-4", label: "To-do" },
  note: { text: "text-slate-300", bg: "bg-slate-500/15", label: "Note" },
  follow_up: { text: "text-emerald-300", bg: "bg-emerald-500/15", label: "Follow-up" },
};

export const LIFECYCLE_STYLES: Record<string, { text: string; bg: string }> = {
  subscriber: { text: "text-slate-300", bg: "bg-slate-500/15" },
  lead: { text: "text-sky-300", bg: "bg-sky-500/15" },
  marketingqualifiedlead: { text: "text-violet-300", bg: "bg-violet-500/15" },
  salesqualifiedlead: { text: "text-amber-300", bg: "bg-amber-500/15" },
  opportunity: { text: "text-orange-300", bg: "bg-orange-500/15" },
  customer: { text: "text-emerald-300", bg: "bg-emerald-500/15" },
  evangelist: { text: "text-fuchsia-300", bg: "bg-fuchsia-500/15" },
};

// Re-exported here for backwards compat with consumers that imported from constants.
export { LIFECYCLE_STYLES as _LIFECYCLE_STYLES_LOCAL };

export function stageStyle(color: string) {
  return STAGE_STYLES[color] || STAGE_STYLES.slate;
}

export function priorityStyle(p: string) {
  return PRIORITY_STYLES[p] || PRIORITY_STYLES.medium;
}

export function lifecycleStyle(l: string) {
  return LIFECYCLE_STYLES[l] || LIFECYCLE_STYLES.lead;
}

export function taskTypeStyle(t: string) {
  return TASK_TYPE_STYLES[t] || TASK_TYPE_STYLES.todo;
}

export type CrmBadgeCounts = {
  contacts: number;
  openDeals: number;
  openTasks: number;
  overdueTasks: number;
};

export type { ID };
