#!/usr/bin/env python3
"""
Kilocode data extractor.

Pulls ALL session data from every Kilocode data store on this machine:
  1. Kilo CLI SQLite DB  -> ~/.local/share/kilo/kilo.db  (primary: 74 sessions)
       - session, message, part, todo, project, session_message, session_input
  2. VS Code extension tasks -> ~/.config/Code - OSS/User/globalStorage/kilocode.kilo-code/tasks/
       - api_conversation_history.json, ui_messages.json, task_metadata.json

Output (~/kilocode-export/):
  index.json                  master index of all sessions (both sources)
  summary.md                  human-readable overview
  kilo-cli/<session_id>.json  one file per Kilo CLI session (full reconstruction)
  kilo-cli/<session_id>.md    readable transcript
  vscode-tasks/<task_id>.json one file per VS Code extension task
  vscode-tasks/<task_id>.md   readable transcript
  projects.json               project map
  todos.json                  all todos grouped by session
"""
import json
import os
import sqlite3
import sys
from datetime import datetime, timezone

HOME = os.path.expanduser("~")
KILO_DB = os.path.join(HOME, ".local/share/kilo/kilo.db")
VSCODE_TASKS = os.path.join(HOME, ".config/Code - OSS/User/globalStorage/kilocode.kilo-code/tasks")
OUT = os.path.join(HOME, "kilocode-export")
OUT_CLI = os.path.join(OUT, "kilo-cli")
OUT_VSC = os.path.join(OUT, "vscode-tasks")

os.makedirs(OUT_CLI, exist_ok=True)
os.makedirs(OUT_VSC, exist_ok=True)


def ts(ms):
    if not ms:
        return None
    try:
        return datetime.fromtimestamp(ms / 1000, tz=timezone.utc).isoformat()
    except Exception:
        return None


def load_json(path):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        return {"_error": str(e)}


# ---------------------------------------------------------------------------
# 1. KILO CLI DB
# ---------------------------------------------------------------------------
def extract_cli():
    if not os.path.exists(KILO_DB):
        print(f"[warn] no kilo.db at {KILO_DB}")
        return [], {}

    # readonly uri
    con = sqlite3.connect(f"file:{KILO_DB}?mode=ro", uri=True)
    con.row_factory = sqlite3.Row
    cur = con.cursor()

    # projects
    projects = {}
    for r in cur.execute("SELECT * FROM project"):
        projects[r["id"]] = {
            "id": r["id"],
            "name": r["name"],
            "vcs": r["vcs"],
            "worktree": r["worktree"],
            "time_created": ts(r["time_created"]),
        }

    # todos grouped by session
    todos = {}
    for r in cur.execute("SELECT * FROM todo ORDER BY session_id, position"):
        todos.setdefault(r["session_id"], []).append({
            "content": r["content"],
            "status": r["status"],
            "priority": r["priority"],
            "position": r["position"],
        })

    # session lifecycle events (agent/model switches)
    lifecycle = {}
    for r in cur.execute("SELECT * FROM session_message ORDER BY session_id, seq"):
        lifecycle.setdefault(r["session_id"], []).append({
            "type": r["type"],
            "seq": r["seq"],
            "time": ts(r["time_created"]),
            "data": json.loads(r["data"]) if r["data"] else None,
        })

    # parts grouped by message
    parts_by_msg = {}
    for r in cur.execute("SELECT * FROM part ORDER BY message_id, id"):
        parts_by_msg.setdefault(r["message_id"], []).append({
            "id": r["id"],
            "time": ts(r["time_created"]),
            "data": json.loads(r["data"]) if r["data"] else None,
        })

    # messages grouped by session
    msgs_by_session = {}
    for r in cur.execute("SELECT * FROM message ORDER BY session_id, time_created, id"):
        msgs_by_session.setdefault(r["session_id"], []).append({
            "id": r["id"],
            "time": ts(r["time_created"]),
            "data": json.loads(r["data"]) if r["data"] else None,
            "parts": parts_by_msg.get(r["id"], []),
        })

    sessions = []
    for r in cur.execute("SELECT * FROM session ORDER BY time_created DESC"):
        sid = r["id"]
        proj = projects.get(r["project_id"], {})
        sess = {
            "source": "kilo-cli",
            "id": sid,
            "title": r["title"],
            "slug": r["slug"],
            "directory": r["directory"],
            "agent": r["agent"],
            "model": r["model"],
            "cost": r["cost"],
            "tokens": {
                "input": r["tokens_input"],
                "output": r["tokens_output"],
                "reasoning": r["tokens_reasoning"],
                "cache_read": r["tokens_cache_read"],
                "cache_write": r["tokens_cache_write"],
            },
            "project": proj,
            "parent_id": r["parent_id"],
            "workspace_id": r["workspace_id"],
            "path": r["path"],
            "share_url": r["share_url"],
            "summary": {
                "additions": r["summary_additions"],
                "deletions": r["summary_deletions"],
                "files": r["summary_files"],
                "diffs": r["summary_diffs"],
            },
            "time_created": ts(r["time_created"]),
            "time_updated": ts(r["time_updated"]),
            "time_archived": ts(r["time_archived"]),
            "metadata": json.loads(r["metadata"]) if r["metadata"] else None,
            "message_count": len(msgs_by_session.get(sid, [])),
            "part_count": sum(len(m["parts"]) for m in msgs_by_session.get(sid, [])),
            "todo_count": len(todos.get(sid, [])),
            "lifecycle": lifecycle.get(sid, []),
            "todos": todos.get(sid, []),
            "messages": msgs_by_session.get(sid, []),
        }
        sessions.append(sess)

        # write per-session json
        with open(os.path.join(OUT_CLI, f"{sid}.json"), "w", encoding="utf-8") as f:
            json.dump(sess, f, indent=2, ensure_ascii=False)
        # write readable markdown
        with open(os.path.join(OUT_CLI, f"{sid}.md"), "w", encoding="utf-8") as f:
            f.write(render_cli_md(sess))

    con.close()
    return sessions, projects


def render_cli_md(sess):
    lines = []
    lines.append(f"# {sess['title']}")
    lines.append(f"- **id**: `{sess['id']}`")
    lines.append(f"- **agent**: {sess['agent']}  |  **model**: {sess['model']}")
    lines.append(f"- **directory**: `{sess['directory']}`")
    lines.append(f"- **project**: {sess['project'].get('name') or sess['project'].get('worktree','')}")
    lines.append(f"- **created**: {sess['time_created']}  |  **updated**: {sess['time_updated']}")
    lines.append(f"- **cost**: ${sess['cost']:.4f}  |  **tokens**: in={sess['tokens']['input']} out={sess['tokens']['output']} reason={sess['tokens']['reasoning']}")
    lines.append(f"- **messages**: {sess['message_count']}  |  **parts**: {sess['part_count']}  |  **todos**: {sess['todo_count']}")
    if sess["todos"]:
        lines.append("\n## Todos")
        for t in sess["todos"]:
            mark = "x" if t["status"] == "completed" else " "
            lines.append(f"- [{mark}] {t['content']}")
    lines.append("\n## Transcript")
    for m in sess["messages"]:
        d = m["data"] or {}
        role = d.get("role", "?")
        model = d.get("modelID", "")
        tcreated = (d.get("time") or {}).get("created")
        lines.append(f"\n### [{role}] {ts(tcreated) or m['time']}  {('@'+model) if model else ''}")
        for p in m["parts"]:
            lines.append(render_part(p["data"]))
    return "\n".join(lines) + "\n"


def render_part(data):
    if not data:
        return ""
    t = data.get("type")
    if t == "text":
        return f"\n{data.get('text','')}"
    if t == "reasoning":
        return f"\n> _reasoning_: {data.get('text','')}"
    if t == "tool":
        st = data.get("state", {}) or {}
        inp = st.get("input", {})
        out = st.get("output", "")
        if isinstance(out, str) and len(out) > 1500:
            out = out[:1500] + f"\n... [+{len(out)-1500} chars truncated]"
        return f"\n**tool `{data.get('tool')}`** {st.get('status','')}\n```input\n{json.dumps(inp, indent=2, ensure_ascii=False) if inp else ''}\n```\n```output\n{out}\n```"
    if t == "patch":
        return f"\n**patch** {data.get('path','')}\n```diff\n{data.get('diff','')}\n```"
    if t == "file":
        return f"\n**file** {data.get('path','')}"
    if t in ("step-start", "step-finish"):
        return ""  # skip noise
    if t == "compaction":
        return f"\n_[compaction]_"
    return f"\n_[{t}]_ {json.dumps(data, ensure_ascii=False)[:300]}"


# ---------------------------------------------------------------------------
# 2. VS CODE EXTENSION TASKS
# ---------------------------------------------------------------------------
def extract_vscode():
    tasks = []
    if not os.path.isdir(VSCODE_TASKS):
        print(f"[warn] no vscode tasks dir at {VSCODE_TASKS}")
        return tasks
    for task_id in sorted(os.listdir(VSCODE_TASKS)):
        d = os.path.join(VSCODE_TASKS, task_id)
        if not os.path.isdir(d):
            continue
        conv = load_json(os.path.join(d, "api_conversation_history.json"))
        ui = load_json(os.path.join(d, "ui_messages.json"))
        meta = load_json(os.path.join(d, "task_metadata.json"))
        task = {
            "source": "vscode-extension",
            "task_id": task_id,
            "metadata": meta,
            "api_conversation_history": conv,
            "ui_messages": ui,
        }
        tasks.append(task)
        with open(os.path.join(OUT_VSC, f"{task_id}.json"), "w", encoding="utf-8") as f:
            json.dump(task, f, indent=2, ensure_ascii=False)
        with open(os.path.join(OUT_VSC, f"{task_id}.md"), "w", encoding="utf-8") as f:
            f.write(render_vscode_md(task))
    return tasks


def render_vscode_md(task):
    lines = [f"# VS Code task {task['task_id']}"]
    meta = task.get("metadata") or {}
    if isinstance(meta, dict):
        lines.append(f"- **files in context**: {len(meta.get('files_in_context', []))}")
        for fl in (meta.get("files_in_context") or [])[:10]:
            lines.append(f"  - {fl.get('path')} ({fl.get('record_state')})")
    lines.append("\n## API conversation history")
    conv = task.get("api_conversation_history")
    if isinstance(conv, list):
        for msg in conv:
            if not isinstance(msg, dict):
                continue
            role = msg.get("role", "?")
            content = msg.get("content", "")
            if isinstance(content, list):
                content = "\n".join(
                    json.dumps(c, ensure_ascii=False) if not isinstance(c, dict) else
                    (c.get("text") or json.dumps(c, ensure_ascii=False))
                    for c in content
                )
            lines.append(f"\n### [{role}]\n{content}")
    elif isinstance(conv, dict) and "_error" in conv:
        lines.append(f"_error: {conv['_error']}_")
    return "\n".join(lines) + "\n"


# ---------------------------------------------------------------------------
# 3. MASTER INDEX + SUMMARY
# ---------------------------------------------------------------------------
def build_index(cli_sessions, vscode_tasks, projects):
    index = {
        "generated": datetime.now(timezone.utc).isoformat(),
        "sources": {
            "kilo_cli_db": KILO_DB,
            "vscode_tasks": VSCODE_TASKS,
        },
        "counts": {
            "kilo_cli_sessions": len(cli_sessions),
            "vscode_tasks": len(vscode_tasks),
            "projects": len(projects),
        },
        "kilo_cli_sessions": [
            {
                "id": s["id"],
                "title": s["title"],
                "agent": s["agent"],
                "model": s["model"],
                "directory": s["directory"],
                "project": s["project"].get("name") or s["project"].get("worktree"),
                "message_count": s["message_count"],
                "part_count": s["part_count"],
                "todo_count": s["todo_count"],
                "cost": s["cost"],
                "time_created": s["time_created"],
                "file": f"kilo-cli/{s['id']}.json",
            }
            for s in cli_sessions
        ],
        "vscode_tasks": [
            {
                "task_id": t["task_id"],
                "file": f"vscode-tasks/{t['task_id']}.json",
                "files_in_context": len((t.get("metadata") or {}).get("files_in_context", [])) if isinstance(t.get("metadata"), dict) else 0,
            }
            for t in vscode_tasks
        ],
    }
    with open(os.path.join(OUT, "index.json"), "w", encoding="utf-8") as f:
        json.dump(index, f, indent=2, ensure_ascii=False)
    with open(os.path.join(OUT, "projects.json"), "w", encoding="utf-8") as f:
        json.dump(projects, f, indent=2, ensure_ascii=False)
    return index


def build_summary(index, cli_sessions, vscode_tasks):
    lines = [
        "# Kilocode data export — summary",
        f"Generated: {index['generated']}",
        "",
        f"- **Kilo CLI sessions**: {len(cli_sessions)}  (from `{KILO_DB}`)",
        f"- **VS Code extension tasks**: {len(vscode_tasks)}  (from `{VSCODE_TASKS}`)",
        f"- **Projects**: {index['counts']['projects']}",
        "",
        "## Kilo CLI sessions (newest first)",
        "",
        "| # | title | agent | msgs | parts | todos | cost | created |",
        "|---|-------|-------|------|-------|-------|------|---------|",
    ]
    for i, s in enumerate(cli_sessions, 1):
        title = (s["title"] or "").replace("|", "\\|")[:50]
        lines.append(
            f"| {i} | {title} | {s['agent']} | {s['message_count']} | {s['part_count']} | {s['todo_count']} | ${s['cost']:.3f} | {s['time_created']} |"
        )
    lines += ["", "## VS Code extension tasks", ""]
    for t in vscode_tasks:
        lines.append(f"- `{t['task_id']}` — vscode-tasks/{t['task_id']}.md")
    lines += ["", "## Files", "",
        "- `index.json` — master index",
        "- `projects.json` — project map",
        "- `kilo-cli/<session_id>.json` / `.md` — per-session full data + transcript",
        "- `vscode-tasks/<task_id>.json` / `.md` — per-task full data + transcript",
    ]
    with open(os.path.join(OUT, "summary.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")


def main():
    print(f"[extract] kilo.db: {KILO_DB}")
    cli_sessions, projects = extract_cli()
    print(f"[extract] {len(cli_sessions)} kilo-cli sessions")
    vscode_tasks = extract_vscode()
    print(f"[extract] {len(vscode_tasks)} vscode tasks")
    index = build_index(cli_sessions, vscode_tasks, projects)
    build_summary(index, cli_sessions, vscode_tasks)
    print(f"[done] export -> {OUT}")
    print(f"       index: {OUT}/index.json")
    print(f"       summary: {OUT}/summary.md")


if __name__ == "__main__":
    main()