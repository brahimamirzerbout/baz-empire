#!/usr/bin/env python3
"""
Client Project Tracker
Manages client projects, tasks, and deadlines
Usage: python3 tracker.py add <client> <task> [--priority HIGH/MED/LOW] [--due DATE]
       python3 tracker.py list [--client CLIENT] [--status STATUS]
       python3 tracker.py done <task_id>
       python3 tracker.py report
"""

import json
import argparse
from datetime import datetime, timedelta
from pathlib import Path

TRACKER_FILE = Path.home() / "agency" / "config" / "tracker.json"

def load_data():
    """Load tracker data."""
    if TRACKER_FILE.exists():
        with open(TRACKER_FILE) as f:
            return json.load(f)
    return {"tasks": [], "clients": {}}

def save_data(data):
    """Save tracker data."""
    TRACKER_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(TRACKER_FILE, "w") as f:
        json.dump(data, f, indent=2)

def add_task(args):
    """Add a new task."""
    data = load_data()
    task_id = len(data["tasks"]) + 1

    task = {
        "id": task_id,
        "client": args.client,
        "task": args.task,
        "priority": args.priority or "MED",
        "status": "TODO",
        "due": args.due or (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d"),
        "created": datetime.now().isoformat(),
        "completed": None,
    }

    data["tasks"].append(task)

    # Update client list
    if args.client not in data["clients"]:
        data["clients"][args.client] = {"created": datetime.now().isoformat(), "tasks": 0}
    data["clients"][args.client]["tasks"] = data["clients"][args.client].get("tasks", 0) + 1

    save_data(data)
    print(f"✅ Task #{task_id} added: {args.task} (Client: {args.client}, Priority: {task['priority']}, Due: {task['due']})")

def list_tasks(args):
    """List tasks with optional filters."""
    data = load_data()
    tasks = data["tasks"]

    if args.client:
        tasks = [t for t in tasks if t["client"].lower() == args.client.lower()]
    if args.status:
        tasks = [t for t in tasks if t["status"].upper() == args.status.upper()]

    if not tasks:
        print("No tasks found.")
        return

    priority_colors = {"HIGH": "🔴", "MED": "🟡", "LOW": "🟢"}
    status_icons = {"TODO": "⬜", "PROGRESS": "🔄", "DONE": "✅", "REVIEW": "👀"}

    print(f"\n{'ID':>4} {'Status':>6} {'Priority':>8} {'Client':>15} {'Due':>12} Task")
    print("-" * 80)
    for t in tasks:
        icon = status_icons.get(t["status"], "?")
        prio = priority_colors.get(t["priority"], "⚪")
        print(f"{t['id']:>4} {icon} {t['status']:<6} {prio} {t['priority']:<6} {t['client']:>15} {t['due']:>12} {t['task']}")

def complete_task(args):
    """Mark a task as done."""
    data = load_data()
    for task in data["tasks"]:
        if task["id"] == args.task_id:
            task["status"] = "DONE"
            task["completed"] = datetime.now().isoformat()
            save_data(data)
            print(f"✅ Task #{args.task_id} completed!")
            return
    print(f"❌ Task #{args.task_id} not found.")

def start_task(args):
    """Mark a task as in progress."""
    data = load_data()
    for task in data["tasks"]:
        if task["id"] == args.task_id:
            task["status"] = "PROGRESS"
            save_data(data)
            print(f"🔄 Task #{args.task_id} moved to in progress.")
            return
    print(f"❌ Task #{args.task_id} not found.")

def generate_report(args):
    """Generate status report."""
    data = load_data()
    tasks = data["tasks"]

    if not tasks:
        print("No tasks to report.")
        return

    total = len(tasks)
    done = len([t for t in tasks if t["status"] == "DONE"])
    in_progress = len([t for t in tasks if t["status"] == "PROGRESS"])
    todo = len([t for t in tasks if t["status"] == "TODO"])
    overdue = len([t for t in tasks if t["status"] != "DONE" and t["due"] < datetime.now().strftime("%Y-%m-%d")])

    # Per-client breakdown
    clients = {}
    for t in tasks:
        if t["client"] not in clients:
            clients[t["client"]] = {"total": 0, "done": 0, "in_progress": 0, "todo": 0}
        clients[t["client"]]["total"] += 1
        clients[t["client"]][t["status"].lower()] += 1
        # Fix key names
        clients[t["client"]]["in_progress"] = clients[t["client"]].get("in_progress", 0)

    print("\n" + "=" * 60)
    print("  📊 AGENCY STATUS REPORT")
    print("=" * 60)
    print(f"  Date: {datetime.now().strftime('%Y-%m-%d')}")
    print()
    print(f"  Total Tasks:     {total}")
    print(f"  ✅ Completed:     {done} ({done*100//max(total,1)}%)")
    print(f"  🔄 In Progress:   {in_progress}")
    print(f"  ⬜ Todo:          {todo}")
    print(f"  ⚠️  Overdue:       {overdue}")
    print()
    print("  Per-Client Breakdown:")
    print("  " + "-" * 50)
    for client, stats in clients.items():
        pct = stats["done"] * 100 // max(stats["total"], 1)
        bar = "█" * (pct // 10) + "░" * (10 - pct // 10)
        print(f"  {client:>15}  [{bar}] {pct}% ({stats['done']}/{stats['total']})")
    print("=" * 60)

def main():
    parser = argparse.ArgumentParser(description="Client Project Tracker")
    subparsers = parser.add_subparsers(dest="command")

    # Add task
    add_parser = subparsers.add_parser("add", help="Add a task")
    add_parser.add_argument("client", help="Client name")
    add_parser.add_argument("task", help="Task description")
    add_parser.add_argument("--priority", "-p", choices=["HIGH", "MED", "LOW"], default="MED")
    add_parser.add_argument("--due", "-d", help="Due date (YYYY-MM-DD)")

    # List tasks
    list_parser = subparsers.add_parser("list", help="List tasks")
    list_parser.add_argument("--client", "-c", help="Filter by client")
    list_parser.add_argument("--status", "-s", help="Filter by status")

    # Complete task
    done_parser = subparsers.add_parser("done", help="Complete a task")
    done_parser.add_argument("task_id", type=int, help="Task ID")

    # Start task
    start_parser = subparsers.add_parser("start", help="Start a task")
    start_parser.add_argument("task_id", type=int, help="Task ID")

    # Report
    subparsers.add_parser("report", help="Generate status report")

    args = parser.parse_args()

    if args.command == "add":
        add_task(args)
    elif args.command == "list":
        list_tasks(args)
    elif args.command == "done":
        complete_task(args)
    elif args.command == "start":
        start_task(args)
    elif args.command == "report":
        generate_report(args)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()