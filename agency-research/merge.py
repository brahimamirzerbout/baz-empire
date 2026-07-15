#!/usr/bin/env python3
"""Merge scraped source extracts into the master dataset (data/agencies.json).

Each extract lives at extracts/<source_id>.json and looks like:
  {"source_id": "webtonic",
   "agencies": [ {"name": "...", "category": "...", "hq": "...", "country": "...",
                  "founded": 2020, "website": "...", "description": "...",
                  "services": [...], "clients": [...], "industries": [...],
                  "proprietary_tools": [...], "has_proprietary_tools": true/false/null,
                                  "open_source_stack": [...], "uses_open_source": null,
                                  "rating": 4.9, "min_project_cost": "...", "rank": 1}, ...]}

Run: python3 merge.py
"""
import json, os, re, datetime

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, "data")
EXT = os.path.join(ROOT, "extracts")
MASTER = os.path.join(DATA, "agencies.json")

def norm(s):
    return re.sub(r"\s+", " ", (s or "").strip()).lower()

def slug(s):
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return re.sub(r"-+", "-", s)

def uni(lst):
    seen, out = set(), []
    for x in (lst or []):
        k = norm(x) if isinstance(x, str) else json.dumps(x, sort_keys=True)
        if k not in seen:
            seen.add(k); out.append(x)
    return out

def merge_scalar(old, new):
    if old in (None, "", [], {}):
        return new
    return old

def main():
    with open(MASTER, encoding="utf-8") as f:
        master = json.load(f)
    by_name = {}
    for a in master["agencies"]:
        by_name[norm(a["name"])] = a

    now = datetime.datetime.now().isoformat(timespec="seconds")
    src_status = {s["id"]: s for s in master["sources"]}

    files = sorted(os.listdir(EXT)) if os.path.isdir(EXT) else []
    added, updated, ranked = 0, 0, 0
    for fn in files:
        if not fn.endswith(".json"):
            continue
        with open(os.path.join(EXT, fn), encoding="utf-8") as f:
            ext = json.load(f)
        sid = ext["source_id"]
        if sid in src_status:
            src_status[sid]["status"] = "scraped"
            src_status[sid]["scraped_at"] = now
        for e in ext["agencies"]:
            name = e["name"].strip()
            key = norm(name)
            rank = e.pop("rank", None)
            existing = by_name.get(key)
            if existing is None:
                a = {
                    "name": name,
                    "slug": slug(name),
                    "category": e.get("category", "independent"),
                    "hq": e.get("hq"), "country": e.get("country"),
                    "founded": e.get("founded"), "employees_min": e.get("employees_min"),
                    "employees_max": e.get("employees_max"), "website": e.get("website"),
                    "description": e.get("description"),
                    "has_proprietary_tools": e.get("has_proprietary_tools"),
                    "proprietary_tools": e.get("proprietary_tools", []) or [],
                    "uses_open_source": e.get("uses_open_source"),
                    "open_source_stack": e.get("open_source_stack", []) or [],
                    "rating": e.get("rating"), "min_project_cost": e.get("min_project_cost"),
                    "notes": e.get("notes"),
                    "services": e.get("services", []) or [],
                    "clients": e.get("clients", []) or [],
                    "industries": e.get("industries", []) or [],
                    "tools": e.get("tools", []) or [],
                    "source_ranks": [],
                }
                master["agencies"].append(a)
                by_name[key] = a
                added += 1
                existing = a
            else:
                # merge scalar fields only when missing
                for fld in ("category","hq","country","founded","website","description","notes",
                           "rating","min_project_cost","employees_min","employees_max"):
                    if fld in e and e[fld] not in (None, "", [], {}):
                        existing[fld] = merge_scalar(existing.get(fld), e[fld])
                # merge tool/proprietary flags (promote to true if any source says true)
                for flag in ("has_proprietary_tools","uses_open_source"):
                    if e.get(flag) is True:
                        existing[flag] = True
                for lst in ("services","clients","industries","proprietary_tools","open_source_stack","tools"):
                    if e.get(lst):
                        existing[lst] = uni(existing.get(lst, []) + e[lst])
                updated += 0
            # add source rank link
            sr = existing.setdefault("source_ranks", [])
            if not any(r.get("source") == sid for r in sr):
                sr.append({"source": sid, "rank": rank})
                ranked += 1

    with open(MASTER, "w", encoding="utf-8") as f:
        json.dump(master, f, indent=2, ensure_ascii=False)

    print(f"Merged {len(files)} extracts. agencies now: {len(master['agencies'])} "
          f"(+{added} new). rank links added: {ranked}")

if __name__ == "__main__":
    main()
