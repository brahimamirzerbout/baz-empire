#!/usr/bin/env python3
"""Build a compact continuity digest from the kilocode export, grouped by project.
Output: ~/.pi/agent/context/kilocode/KILOCODE_CONTINUITY.md + load-index.json
"""
import json, glob, os
from collections import defaultdict

HOME = os.path.expanduser("~")
EXPORT = os.path.join(HOME, "kilocode-export")
OUTDIR = os.path.join(HOME, ".pi/agent/context/kilocode")
os.makedirs(OUTDIR, exist_ok=True)

sessions = []
for f in sorted(glob.glob(os.path.join(EXPORT, "kilo-cli/*.json"))):
    sessions.append(json.load(open(f)))

# group by project worktree / directory
def proj_key(s):
    p = s.get("project") or {}
    return p.get("worktree") or s.get("directory") or "(none)"

groups = defaultdict(list)
for s in sessions:
    groups[proj_key(s)].append(s)

def last_user_prompt(s):
    for m in s["messages"]:
        d = m["data"] or {}
        if d.get("role") == "user":
            for p in m["parts"]:
                pd = p["data"] or {}
                if pd.get("type") == "text" and pd.get("text", "").strip():
                    return pd["text"].strip()
    return None

def last_assistant_text(s):
    txt = None
    for m in s["messages"]:
        d = m["data"] or {}
        if d.get("role") == "assistant":
            for p in m["parts"]:
                pd = p["data"] or {}
                if pd.get("type") == "text" and pd.get("text", "").strip():
                    txt = pd["text"].strip()
    return txt

def trunc(x, n=240):
    if not x:
        return None
    x = " ".join(x.split())
    return x if len(x) <= n else x[:n] + "…"

lines = ["# Kilocode continuity digest (loaded into pi context)",
         "",
         "Source: `~/kilocode-export/` (extracted from `kilo.db` before purge).",
         f"Total sessions: {len(sessions)} across {len(groups)} projects.",
         "Each session's full transcript: `~/kilocode-export/kilo-cli/<id>.md`.",
         "",
         "Incomplete todos = work-in-progress to continue in pi.",
         ""]

# load-index for machine use
load_index = {"projects": {}, "total_sessions": len(sessions)}

for proj in sorted(groups):
    ss = sorted(groups[proj], key=lambda s: s.get("time_updated") or s.get("time_created") or "", reverse=True)
    lines += [f"## Project: `{proj}`  ({len(ss)} sessions)", ""]
    load_index["projects"][proj] = [{"id": s["id"], "title": s["title"]} for s in ss]
    for s in ss:
        inc = [t for t in s.get("todos", []) if t["status"] != "completed"]
        lp = trunc(last_user_prompt(s))
        la = trunc(last_assistant_text(s))
        lines += [f"### {s['title']}", ""]
        lines += [f"- **id**: `{s['id']}`  |  agent: `{s['agent']}`  |  msgs: {s['message_count']}  |  parts: {s['part_count']}  |  updated: {s['time_updated']}"]
        lines += [f"- **last user prompt**: {lp or '_none_'}"]
        lines += [f"- **last assistant text**: {la or '_none_'}"]
        if inc:
            lines += [f"- **incomplete todos ({len(inc)}):**"]
            for t in inc:
                lines += [f"    - [{t['status']}] {t['content']}"]
        else:
            lines += ["- **incomplete todos**: 0 (all done or none)"]
        lines += [f"- transcript: `~/kilocode-export/kilo-cli/{s['id']}.md`", ""]

out = os.path.join(OUTDIR, "KILOCODE_CONTINUITY.md")
with open(out, "w", encoding="utf-8") as f:
    f.write("\n".join(lines) + "\n")
with open(os.path.join(OUTDIR, "load-index.json"), "w", encoding="utf-8") as f:
    json.dump(load_index, f, indent=2)
print(f"[done] {out}")
print(f"       sessions={len(sessions)} projects={len(groups)}")
print(f"       size={os.path.getsize(out)} bytes")