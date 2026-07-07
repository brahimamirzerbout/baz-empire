import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useUserContext, INITIAL_USER } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  useDashboard,
  useResetCrm,
  useUpsertContact,
  useUpsertDeal,
  useUpsertTask,
} from "@/lib/crm/queries";
import { useToast } from "@/components/shared/Toaster";
import { crmSidebarLinks, isCrmPath, type CrmBadgeCounts } from "./constants";
import {
  Logo,
  Logout,
  Settings as SettingsIcon,
  Chart,
  More,
  Sparkle,
  ChevronDown,
  Search as SearchIcon,
} from "@/components/shared/svgs";
import Avatar from "@/components/shared/Avatar";
import ThemeToggle from "@/components/shared/ThemeToggle";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { cn } from "@/lib/utils";

const CrmLayout = () => {
  const { user, setUser, signOut } = useUserContext();
  const { theme } = useTheme();
  const { data: dashboard } = useDashboard();
  const { mutate: resetCrm, isSuccess: resetOk } = useResetCrm();
  const { showToast: toast } = useToast();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [resetOpen, setResetOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const upsertContact = useUpsertContact();
  const upsertDeal = useUpsertDeal();
  const upsertTask = useUpsertTask();

  const quickCreate = useCallback(
    (kind: "contact" | "deal" | "task") => {
      if (kind === "contact") {
        upsertContact.mutate(
          {
            firstName: "New",
            lastName: "Contact",
            email: `new.contact.${Date.now()}@example.com`,
            ownerId: user.id,
            lifecycle: "lead",
            status: "active",
            avatarColor: "sky",
            tags: [],
          },
          {
            onSuccess: (created) => {
              toast("Contact created", "success");
              navigate(`/crm/contacts/${created.id}`);
            },
          },
        );
      } else if (kind === "deal") {
        toast("Open a contact first, then add a deal", "default");
        navigate("/crm/contacts");
      } else if (kind === "task") {
        upsertTask.mutate(
          {
            title: "New task",
            type: "todo",
            status: "open",
            priority: "medium",
            ownerId: user.id,
            dueDate: new Date(Date.now() + 3 * 86_400_000).toISOString(),
          },
          { onSuccess: () => toast("Task created", "success") },
        );
      }
    },
    [upsertContact, upsertDeal, upsertTask, user.id, toast, navigate],
  );

  // Keyboard shortcuts:
  //   ⌘K / /  → command palette
  //   c      → new contact
  //   d      → new deal (lands on /crm/pipeline)
  //   t      → new task
  //   g d    → go to dashboard
  //   g c    → go to contacts
  //   g p    → go to pipeline
  //   g t    → go to tasks
  useKeyboardShortcuts({
    "mod+k": () => setPaletteOpen(true),
    "/": (e) => {
      const t = e.target as HTMLElement | null;
      const inField =
        t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (!inField) setPaletteOpen(true);
    },
    c: () => navigate("/crm/contacts?new=1"),
    d: () => navigate("/crm/pipeline"),
    t: () => navigate("/crm/tasks?new=1"),
    "g d": () => navigate("/crm"),
    "g c": () => navigate("/crm/contacts"),
    "g p": () => navigate("/crm/pipeline"),
    "g t": () => navigate("/crm/tasks"),
  });

  const badges: CrmBadgeCounts = useMemo(() => {
    if (!dashboard) {
      return { contacts: 0, openDeals: 0, openTasks: 0, overdueTasks: 0 };
    }
    return {
      contacts: dashboard.totalContacts,
      openDeals: dashboard.openDeals,
      openTasks: dashboard.openTasks,
      overdueTasks: dashboard.overdueTasks,
    };
  }, [dashboard]);

  useEffect(() => {
    if (resetOk) {
      toast("CRM data has been reset to demo seed", "success");
    }
  }, [resetOk]);

  // Make sure social-style TopBar/BottomBar don't try to render inside CRM
  // routes — those are rendered by RootLayout, but our CRM layout lives under
  // the same `<section>`. To keep things clean and consistent, we render a
  // dedicated shell that mimics the existing design system.
  return (
    <div className="w-full md:flex min-h-screen bg-surface-bg">
      <aside className="hidden md:flex sticky left-0 top-0 h-screen w-[260px] flex-col justify-between border-r border-surface-border bg-surface-card px-5 py-6 overflow-y-auto">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex gap-3 items-center">
              <Logo className="h-9 w-9" />
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-light-1">Noira</span>
                <span className="text-[10px] uppercase tracking-wider text-light-3">CRM Suite</span>
              </div>
            </Link>
            <ThemeToggle />
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-2 py-1 text-[11px] text-light-3 hover:text-light-1 hover:bg-surface-muted transition"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
            Switch to Social
          </Link>

          <Link
            to="/crm/settings"
            className="flex gap-3 items-center rounded-xl p-2 hover:bg-surface-muted transition"
          >
            <Avatar src={user.imageUrl || null} alt={user.name} name={user.name} size="md" />
            <div className="flex flex-col min-w-0">
              <p className="body-bold text-light-1 truncate">{user.name}</p>
              <p className="small-regular text-light-3 truncate">Sales Manager</p>
            </div>
          </Link>

          <nav className="flex flex-col gap-1">
            {crmSidebarLinks.map((link) => {
              const active =
                isCrmPath(pathname) &&
                (pathname === link.route ||
                  (link.route !== "/crm" && pathname.startsWith(link.route)));
              const badge = link.badgeKey ? badges[link.badgeKey] : undefined;
              return (
                <NavLink
                  key={link.label}
                  to={link.route}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-lg px-3 py-2 transition",
                    active ? "bg-primary-500 text-white" : "text-light-1 hover:bg-surface-muted",
                  )}
                  end={link.route === "/crm"}
                >
                  <span className="flex items-center gap-3">
                    <link.imgURL
                      className={cn("h-4 w-4", active ? "invert-white" : "text-light-2")}
                    />
                    <span className="text-sm font-medium">{link.label}</span>
                  </span>
                  {badge !== undefined && badge > 0 ? (
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-semibold min-w-[20px] text-center",
                        active ? "bg-white/20 text-white" : "bg-surface-muted text-light-2",
                        link.badgeKey === "overdueTasks" && badge > 0
                          ? "!bg-rose-500/20 !text-rose-300"
                          : "",
                      )}
                    >
                      {badge > 99 ? "99+" : badge}
                    </span>
                  ) : null}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-1">
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-full flex items-center gap-2 rounded-lg p-2 hover:bg-surface-muted transition text-left"
            >
              <Sparkle className="h-4 w-4 text-primary-500" />
              <span className="text-xs text-light-2 flex-1">Workspace tips</span>
              <ChevronDown
                className={cn("h-3 w-3 text-light-3 transition", menuOpen ? "rotate-180" : "")}
              />
            </button>
            {menuOpen ? (
              <div className="absolute bottom-full left-0 right-0 mb-2 rounded-lg border border-surface-border bg-surface-card p-3 text-xs text-light-2 shadow-2xl">
                <p className="font-semibold text-light-1 mb-1">Noira CRM</p>
                <p>
                  Drag deals across the pipeline to update their stage. Open any contact to see
                  related deals, tasks, and notes.
                </p>
              </div>
            ) : null}
          </div>

          <Link
            to="/crm/settings"
            className="flex items-center gap-3 rounded-lg p-2 hover:bg-surface-muted transition text-light-1"
          >
            <SettingsIcon className="h-4 w-4 text-light-2" />
            <span className="text-sm font-medium">Settings</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg p-2 hover:bg-surface-muted transition text-light-1"
          >
            <Chart className="h-4 w-4 text-light-2" />
            <span className="text-sm font-medium">Back to social</span>
          </Link>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 rounded-lg p-2 hover:bg-surface-muted transition text-light-1 w-full text-left"
          >
            <Logout className="h-4 w-4 text-light-2" />
            <span className="text-sm font-medium">Sign out</span>
          </button>

          <button
            onClick={() => setResetOpen(true)}
            className="flex items-center gap-3 rounded-lg p-2 hover:bg-rose-500/10 transition text-rose-300 w-full text-left text-xs"
          >
            <More className="h-4 w-4" />
            <span>Reset demo data</span>
          </button>

          <p className="text-center text-light-4 tiny-medium mt-2">Noira CRM v1.0</p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-surface-border bg-surface-card/85 backdrop-blur-md px-4 md:px-8 h-14">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/crm" className="md:hidden">
              <Logo className="h-7 w-7" />
            </Link>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-light-3">
                {theme === "dark" ? "Workspace" : "Workspace · Light"}
              </p>
              <h1 className="text-sm font-semibold text-light-1 truncate">
                {pathnameLabel(pathname)}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-subtle bg-surface-2 text-light-3 hover:text-light-1 hover:border-accent/40 transition text-xs"
              title="Open command palette (⌘K)"
            >
              <SearchIcon className="h-3.5 w-3.5" />
              <span>Search…</span>
              <kbd className="ml-1 px-1 rounded bg-surface-card border border-border-subtle text-[10px]">
                ⌘K
              </kbd>
            </button>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="md:hidden rounded-full p-2 hover:bg-surface-muted transition"
              aria-label="Open command palette"
            >
              <SearchIcon className="h-5 w-5 text-light-2" />
            </button>
            <Link
              to="/crm/settings"
              className="rounded-full p-2 hover:bg-surface-muted transition"
              aria-label="Settings"
            >
              <SettingsIcon className="h-5 w-5 text-light-2" />
            </Link>
            <button
              onClick={() => {
                signOut?.();
                setUser(INITIAL_USER);
                toast("Signed out — local profile reset", "default");
              }}
              className="rounded-full p-2 hover:bg-surface-muted transition md:hidden"
              aria-label="Sign out"
            >
              <Logout className="h-5 w-5 text-light-2" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <ConfirmModal
        isOpen={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={() => {
          resetCrm();
          setResetOpen(false);
        }}
        title="Reset CRM data?"
        message="This will replace all current contacts, deals, tasks, and notes with the demo seed."
        confirmLabel="Reset"
        cancelLabel="Keep"
        variant="danger"
      />

      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onReset={() => {
          resetCrm();
          setPaletteOpen(false);
        }}
        onQuickCreate={quickCreate}
      />
    </div>
  );
};

function pathnameLabel(p: string): string {
  if (p === "/crm") return "Dashboard";
  if (p.startsWith("/crm/contacts/")) return "Contact details";
  if (p === "/crm/contacts") return "Contacts";
  if (p === "/crm/companies") return "Companies";
  if (p === "/crm/pipeline") return "Sales pipeline";
  if (p === "/crm/tasks") return "Tasks & activities";
  if (p === "/crm/deals") return "All deals";
  return "Noira CRM";
}

export default CrmLayout;
