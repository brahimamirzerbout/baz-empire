#!/usr/bin/env python3
"""Single source of truth for the Agency Research Database.

Reads data/agencies.json and (re)generates:
  - data/agencies.db        SQLite database
  - data/agencies.csv       flat agency export
  - data/tools.csv          tool-level export
  - data/agencies.json.export  re-normalized JSON
  - per-agency/<slug>.md    one Markdown file per agency
  - docs/SOURCES.md, PERFORMANCE_AGENCIES.md, PROPRIETARY_TOOLS.md, OPEN_SOURCE.md

Run:  python3 build_db.py
"""
import json, os, sqlite3, csv, datetime, re

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, "data")
DOC = os.path.join(ROOT, "docs")
PER = os.path.join(ROOT, "per-agency")
os.makedirs(DATA, exist_ok=True)
os.makedirs(DOC, exist_ok=True)
os.makedirs(PER, exist_ok=True)

DB = os.path.join(DATA, "agencies.db")

def slugify(s: str) -> str:
    s = s.lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return re.sub(r"-+", "-", s).strip("-")

def jload():
    with open(os.path.join(DATA, "agencies.json"), encoding="utf-8") as f:
        return json.load(f)

# ---------------------------------------------------------------- schema
def build():
    data = jload()
    sources = data.get("sources", [])
    agencies = data.get("agencies", [])

    if os.path.exists(DB):
        os.remove(DB)
    con = sqlite3.connect(DB)
    con.execute("PRAGMA foreign_keys=ON")
    cur = con.cursor()

    cur.executescript("""
    CREATE TABLE sources(
      id TEXT PRIMARY KEY, url TEXT, title TEXT, publisher TEXT,
      publish_date TEXT, scraped_at TEXT, status TEXT, notes TEXT);
    CREATE TABLE agencies(
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, slug TEXT UNIQUE,
      category TEXT, hq TEXT, country TEXT, founded INTEGER,
      employees_min INTEGER, employees_max INTEGER, website TEXT, description TEXT,
      has_proprietary_tools INTEGER, proprietary_tools TEXT, uses_open_source INTEGER,
      open_source_stack TEXT, rating REAL, min_project_cost TEXT, notes TEXT);
    CREATE TABLE agency_services(id INTEGER PRIMARY KEY AUTOINCREMENT, agency_id INTEGER, service TEXT);
    CREATE TABLE agency_clients(id INTEGER PRIMARY KEY AUTOINCREMENT, agency_id INTEGER, client TEXT);
    CREATE TABLE agency_industries(id INTEGER PRIMARY KEY AUTOINCREMENT, agency_id INTEGER, industry TEXT);
    CREATE TABLE tools(id INTEGER PRIMARY KEY AUTOINCREMENT, agency_id INTEGER, tool_name TEXT, tool_type TEXT, category TEXT, url TEXT);
    CREATE TABLE agency_sources(id INTEGER PRIMARY KEY AUTOINCREMENT, agency_id INTEGER, source_id TEXT, rank_in_source INTEGER, notes TEXT);
    CREATE VIEW v_proprietary AS SELECT name, proprietary_tools FROM agencies WHERE has_proprietary_tools=1;
    CREATE VIEW v_open_source AS SELECT name, open_source_stack FROM agencies WHERE uses_open_source=1;
    """)

    for s in sources:
        cur.execute("INSERT INTO sources(id,url,title,publisher,publish_date,scraped_at,status,notes) "
                    "VALUES(?,?,?,?,?,?,?,?)",
                    (s.get("id"), s.get("url"), s.get("title"), s.get("publisher"),
                     s.get("publish_date"), s.get("scraped_at"), s.get("status"), s.get("notes")))

    def aid_of(slug):
        return cur.execute("SELECT id FROM agencies WHERE slug=?", (slug,)).fetchone()[0]

    for a in agencies:
        slug = a.get("slug") or slugify(a["name"])
        cur.execute("""INSERT INTO agencies(name,slug,category,hq,country,founded,employees_min,
          employees_max,website,description,has_proprietary_tools,proprietary_tools,uses_open_source,
          open_source_stack,rating,min_project_cost,notes)
          VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
          (a.get("name"), slug, a.get("category"), a.get("hq"), a.get("country"),
           a.get("founded"), a.get("employees_min"), a.get("employees_max"),
           a.get("website"), a.get("description"),
           1 if a.get("has_proprietary_tools") is True else (0 if a.get("has_proprietary_tools") is False else None),
           json.dumps(a.get("proprietary_tools", []) or [], ensure_ascii=False),
           1 if a.get("uses_open_source") is True else (0 if a.get("uses_open_source") is False else None),
           json.dumps(a.get("open_source_stack", []) or [], ensure_ascii=False),
           a.get("rating"), a.get("min_project_cost"), a.get("notes")))
        aid = cur.lastrowid
        for svc in a.get("services", []):
            cur.execute("INSERT INTO agency_services(agency_id,service) VALUES(?,?)", (aid, svc))
        for cl in a.get("clients", []):
            cur.execute("INSERT INTO agency_clients(agency_id,client) VALUES(?,?)", (aid, cl))
        for ind in a.get("industries", []):
            cur.execute("INSERT INTO agency_industries(agency_id,industry) VALUES(?,?)", (aid, ind))
        for t in a.get("tools", []) or []:
            if isinstance(t, str):
                t = {"tool_name": t, "tool_type": "commercial"}
            cur.execute("INSERT INTO tools(agency_id,tool_name,tool_type,category,url) VALUES(?,?,?,?,?)",
                        (aid, t.get("tool_name"), t.get("tool_type"), t.get("category"), t.get("url")))
        for sr in a.get("source_ranks", []):
            cur.execute("INSERT INTO agency_sources(agency_id,source_id,rank_in_source,notes) VALUES(?,?,?,?)",
                        (aid, sr.get("source"), sr.get("rank"), sr.get("notes")))
        for tname in a.get("proprietary_tools", []) or []:
            if tname:
                cur.execute("INSERT INTO tools(agency_id,tool_name,tool_type,category,url) VALUES(?,?,?,?,?)",
                            (aid, tname, "proprietary", None, None))
        for tname in a.get("open_source_stack", []) or []:
            if tname:
                cur.execute("INSERT INTO tools(agency_id,tool_name,tool_type,category,url) VALUES(?,?,?,?,?)",
                            (aid, tname, "open-source", None, None))

    con.commit()

    # ------------------------------------------------------------ exports
    rows = cur.execute("""SELECT id,name,slug,category,hq,country,founded,employees_min,employees_max,website,
      description,has_proprietary_tools,proprietary_tools,uses_open_source,open_source_stack,rating,
      min_project_cost,notes FROM agencies ORDER BY name""").fetchall()
    cols = ["id","name","slug","category","hq","country","founded","employees_min","employees_max","website",
            "description","has_proprietary_tools","proprietary_tools","uses_open_source","open_source_stack",
            "rating","min_project_cost","notes"]
    with open(os.path.join(DATA, "agencies.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f); w.writerow(cols)
        for r in rows: w.writerow(r)

    # normalized JSON export
    out = []
    for r in rows:
        d = dict(zip(cols, r))
        d["proprietary_tools"] = json.loads(d["proprietary_tools"]) if d["proprietary_tools"] else []
        d["open_source_stack"] = json.loads(d["open_source_stack"]) if d["open_source_stack"] else []
        aid = d["id"]
        d["services"] = [x[0] for x in cur.execute("SELECT service FROM agency_services WHERE agency_id=?", (aid,))]
        d["clients"] = [x[0] for x in cur.execute("SELECT client FROM agency_clients WHERE agency_id=?", (aid,))]
        d["industries"] = [x[0] for x in cur.execute("SELECT industry FROM agency_industries WHERE agency_id=?", (aid,))]
        d["tools"] = [dict(zip(["tool_name","tool_type","category","url"], x)) for x in
                      cur.execute("SELECT tool_name,tool_type,category,url FROM tools WHERE agency_id=?", (aid,))]
        d["source_ranks"] = [dict(zip(["source","rank_in_source","notes"], x)) for x in
                             cur.execute("SELECT source_id,rank_in_source,notes FROM agency_sources WHERE agency_id=?", (aid,))]
        out.append(d)
    with open(os.path.join(DATA, "agencies.json.export"), "w", encoding="utf-8") as f:
        json.dump({"sources": sources, "agencies": out}, f, indent=2, ensure_ascii=False)

    # tools CSV
    trows = cur.execute("SELECT a.name,t.tool_name,t.tool_type,t.category,t.url FROM tools t JOIN agencies a ON a.id=t.agency_id ORDER BY a.name").fetchall()
    with open(os.path.join(DATA, "tools.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f); w.writerow(["agency","tool_name","tool_type","category","url"])
        for r in trows: w.writerow(r)

    con.close()
    return sources, out

# ---------------------------------------------------------------- per-agency MD
def gen_per_agency(agencies):
    for a in agencies:
        lines = [f"# {a['name']}", ""]
        if a.get("slug"):
            lines.append(f"- **Slug:** {a['slug']}")
        if a.get("category"): lines.append(f"- **Category:** {a['category']}")
        if a.get("hq"): lines.append(f"- **HQ:** {a['hq']}")
        if a.get("country"): lines.append(f"- **Country:** {a['country']}")
        if a.get("founded"): lines.append(f"- **Founded:** {a['founded']}")
        if a.get("employees_min") or a.get("employees_max"):
            lines.append(f"- **Employees:** {a.get('employees_min')}-{a.get('employees_max')}")
        if a.get("website"): lines.append(f"- **Website:** {a['website']}")
        if a.get("rating"): lines.append(f"- **Rating:** {a['rating']}")
        if a.get("min_project_cost"): lines.append(f"- **Min project cost:** {a['min_project_cost']}")
        lines.append("")
        if a.get("description"):
            lines.append("## Overview"); lines.append(""); lines.append(a["description"]); lines.append("")
        if a.get("services"):
            lines.append("## Services"); lines.append(""); 
            lines += [f"- {x}" for x in a["services"]]; lines.append("")
        if a.get("industries"):
            lines.append("## Industries served"); lines.append("")
            lines += [f"- {x}" for x in a["industries"]]; lines.append("")
        if a.get("clients"):
            lines.append("## Notable clients"); lines.append("")
            lines += [f"- {x}" for x in a["clients"]]; lines.append("")
        pt = a.get("proprietary_tools") or []
        lines.append("## Proprietary tools")
        lines.append("")
        lines.append(f"Owns proprietary tooling: **{a.get('has_proprietary_tools')}**")
        lines.append("")
        if pt: lines += [f"- {x}" for x in pt]
        else: lines.append("- None documented")
        lines.append("")
        os_stack = a.get("open_source_stack") or []
        lines.append("## Open-source usage")
        lines.append("")
        lines.append(f"Uses open-source tooling: **{a.get('uses_open_source')}**")
        lines.append("")
        if os_stack: lines += [f"- {x}" for x in os_stack]
        else: lines.append("- None documented")
        lines.append("")
        if a.get("tools"):
            lines.append("## Known tools"); lines.append("")
            for t in a["tools"]:
                lines.append(f"- {t['tool_name']} ({t.get('tool_type')}{('/'+t['category']) if t.get('category') else ''})")
            lines.append("")
        if a.get("source_ranks"):
            lines.append("## Appears in rankings"); lines.append("")
            for sr in a["source_ranks"]:
                rk = f" (rank {sr['rank_in_source']})" if sr.get("rank_in_source") else ""
                lines.append(f"- {sr['source']}{rk}")
            lines.append("")
        if a.get("notes"):
            lines.append("## Notes"); lines.append(""); lines.append(a["notes"]); lines.append("")
        with open(os.path.join(PER, f"{a['slug']}.md"), "w", encoding="utf-8") as f:
            f.write("\n".join(lines))

# ---------------------------------------------------------------- index docs
def gen_docs(sources, agencies):
    # SOURCES.md
    s = ["# Scraped Sources", "", f"Total: {len(sources)}. Scraped 2026-07-15.", ""]
    s.append("| # | ID | Publisher | Title | Date | Status |")
    s.append("|---|----|-----------|-------|------|--------|")
    for i, x in enumerate(sources, 1):
        s.append(f"| {i} | `{x['id']}` | {x.get('publisher','')} | [{x.get('title','')}]({x.get('url','')}) | {x.get('publish_date','') or '?'} | {x.get('status','')} |")
    with open(os.path.join(DOC, "SOURCES.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(s) + "\n")

    perf = [a for a in agencies if a.get("category") in ("independent","specialist","network")]
    p = ["# Performance Marketing Agencies", "",
         "Curated from the scraped 2026 rankings. Categories: network / independent / specialist.", ""]
    p.append("| Agency | Category | HQ | Proprietary tools | Open-source |")
    p.append("|--------|----------|----|-------------------|-------------|")
    for a in sorted(agencies, key=lambda x: x["name"].lower()):
        pt = ", ".join(a.get("proprietary_tools") or []) or "-"
        osu = a.get("uses_open_source")
        osu = "yes" if osu is True else ("no" if osu is False else "?")
        p.append(f"| {a['name']} | {a.get('category','')} | {a.get('hq','') or '-'} | {pt} | {osu} |")
    with open(os.path.join(DOC, "PERFORMANCE_AGENCIES.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(p) + "\n")

    prop = [a for a in agencies if a.get("has_proprietary_tools") is True]
    t = ["# Agencies With Proprietary Tools", "",
         f"{len(prop)} of {len(agencies)} documented agencies own their own technology.", ""]
    t.append("| Agency | Proprietary tools |")
    t.append("|--------|-------------------|")
    for a in sorted(prop, key=lambda x: x["name"].lower()):
        t.append(f"| {a['name']} | {', '.join(a.get('proprietary_tools') or [])} |")
    with open(os.path.join(DOC, "PROPRIETARY_TOOLS.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(t) + "\n")

    oss = [a for a in agencies if a.get("uses_open_source") is True]
    o = ["# Agencies Using Open-Source Tooling", "",
         f"{len(oss)} agencies have documented open-source usage (typically data/analytics stacks).", ""]
    o.append("| Agency | Open-source stack |")
    o.append("|--------|-------------------|")
    for a in sorted(oss, key=lambda x: x["name"].lower()):
        o.append(f"| {a['name']} | {', '.join(a.get('open_source_stack') or [])} |")
    with open(os.path.join(DOC, "OPEN_SOURCE.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(o) + "\n")

if __name__ == "__main__":
    sources, agencies = build()
    gen_per_agency(agencies)
    gen_docs(sources, agencies)
    print(f"OK: {len(sources)} sources, {len(agencies)} agencies -> agencies.db + exports + per-agency MD + docs")
