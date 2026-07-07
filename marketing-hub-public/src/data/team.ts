// Public team fixture for the merged marketing site.
// C-suite + their direct-report suites, grouped by department.
// Designed to mirror what real clients actually look like (CMO owns
// content/brand/growth; CEO owns strategy/ops/people; CFO owns finance).
//
// All names are fictional. Departments are stable across the site.

import { db } from "@/lib/db";

export interface RoleRecord {
  title: string;
  reportsTo: "CEO" | "CFO" | "CMO" | null;
  department: "Executive" | "Finance" | "Marketing";
}

export const TEAM_ROLES: RoleRecord[] = [
  // Executive
  { title: "Chief Executive Officer", reportsTo: null, department: "Executive" },

  // Finance (reports to CEO)
  { title: "Chief Financial Officer", reportsTo: "CEO", department: "Finance" },
  { title: "VP Finance", reportsTo: "CFO", department: "Finance" },
  { title: "Controller", reportsTo: "CFO", department: "Finance" },
  { title: "FP&A Lead", reportsTo: "VP Finance", department: "Finance" },
  { title: "Procurement Manager", reportsTo: "VP Finance", department: "Finance" },

  // Marketing (reports to CEO)
  { title: "Chief Marketing Officer", reportsTo: "CEO", department: "Marketing" },
  { title: "VP Brand", reportsTo: "CMO", department: "Marketing" },
  { title: "VP Growth", reportsTo: "CMO", department: "Marketing" },
  { title: "VP Content", reportsTo: "CMO", department: "Marketing" },
  { title: "Brand Director", reportsTo: "VP Brand", department: "Marketing" },
  { title: "Growth Lead", reportsTo: "VP Growth", department: "Marketing" },
  { title: "Content Director", reportsTo: "VP Content", department: "Marketing" },
  { title: "Performance Marketing Lead", reportsTo: "VP Growth", department: "Marketing" },
  { title: "SEO Lead", reportsTo: "VP Content", department: "Marketing" },
];

// Real headcounts from the Hub contacts table. If the DB has nothing for
// a given role (e.g. before seed), we fall back to 1 so the UI stays usable.
function realHeadcountFor(title: string): number {
  try {
    const row = db.prepare("SELECT COUNT(*) AS n FROM contacts WHERE title = ?").get(title) as
      { n: number } | undefined;
    return row && row.n > 0 ? row.n : 1;
  } catch {
    return 1;
  }
}

// Aggregated view: each department has the role that reports to the
// parent org level (C-suite). Returned shape is what the public /api/public/team route emits.
export interface DepartmentOrg {
  department: "Executive" | "Finance" | "Marketing";
  head: string; // e.g. "CEO"
  headTitle: string; // e.g. "Chief Executive Officer"
  headcount: number; // count of contacts with this title in the Hub
  reports: Array<{ title: string; headcount: number }>;
}

export function buildOrgChart(): DepartmentOrg[] {
  const rolesByDepartment: Record<string, RoleRecord[]> = {
    Executive: [],
    Finance: [],
    Marketing: [],
  };
  for (const r of TEAM_ROLES) rolesByDepartment[r.department].push(r);

  const headTitle = (dept: string): string => {
    if (dept === "Executive") return TEAM_ROLES.find((r) => r.department === "Executive")!.title;
    if (dept === "Finance")
      return TEAM_ROLES.find((r) => r.department === "Finance" && r.reportsTo === "CEO")!.title;
    return TEAM_ROLES.find((r) => r.department === "Marketing" && r.reportsTo === "CEO")!.title;
  };

  const departments: DepartmentOrg[] = (["Executive", "Finance", "Marketing"] as const).map(
    (dept) => {
      const roles = rolesByDepartment[dept];
      const head = dept === "Executive" ? "CEO" : dept === "Finance" ? "CFO" : "CMO";
      const headTitleName = headTitle(dept);
      const reports = roles
        .filter((r) => r.reportsTo === head)
        .map((r) => ({ title: r.title, headcount: realHeadcountFor(r.title) }));
      return {
        department: dept,
        head,
        headTitle: headTitleName,
        headcount: realHeadcountFor(headTitleName),
        reports,
      };
    },
  );

  return departments;
}
