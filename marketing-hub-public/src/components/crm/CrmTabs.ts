export type Tab = "dashboard" | "contacts" | "pipeline" | "companies" | "tasks";

export const CRM_TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { id: "contacts", label: "Contacts", icon: "Users" },
  { id: "pipeline", label: "Pipeline", icon: "Kanban" },
  { id: "companies", label: "Companies", icon: "Building2" },
  { id: "tasks", label: "Tasks", icon: "CheckSquare" },
];