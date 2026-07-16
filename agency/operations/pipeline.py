#!/usr/bin/env python3
"""
Agency Lead Tracker & Pipeline Manager
Track leads from first contact to closed deal
Usage: python3 pipeline.py add <name> <service> [--value VALUE] [--stage STAGE]
       python3 pipeline.py list [--stage STAGE]
       python3 pipeline.py advance <id>
       python3 pipeline.py report
"""

import json
import argparse
from datetime import datetime
from pathlib import Path

PIPELINE_FILE = Path.home() / "agency" / "operations" / "pipeline.json"

STAGES = [
    "lead",        # First contact / inquiry
    "contacted",   # Reached out, initial conversation
    "proposal",    # Sent proposal
    "negotiation", # Discussing terms
    "won",         # Deal closed!
    "lost",        # Deal lost
]

SERVICES = [
    "qr-solution",
    "web-design",
    "seo",
    "social-media",
    "branding",
    "content",
    "email-marketing",
    "full-stack",
]

def load_pipeline():
    if PIPELINE_FILE.exists():
        with open(PIPELINE_FILE) as f:
            return json.load(f)
    return {"leads": [], "next_id": 1}

def save_pipeline(data):
    PIPELINE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(PIPELINE_FILE, "w") as f:
        json.dump(data, f, indent=2)

def add_lead(args):
    data = load_pipeline()
    lead = {
        "id": data["next_id"],
        "name": args.name,
        "service": args.service,
        "value": args.value or 0,
        "stage": args.stage or "lead",
        "contact": args.contact or "",
        "notes": args.notes or "",
        "source": args.source or "",
        "created": datetime.now().isoformat(),
        "updated": datetime.now().isoformat(),
    }
    data["leads"].append(lead)
    data["next_id"] += 1
    save_pipeline(data)
    print(f"✅ Lead #{lead['id']} added: {args.name} ({args.service}) — Stage: {lead['stage']}")

def list_leads(args):
    data = load_pipeline()
    leads = data["leads"]
    if args.stage:
        leads = [l for l in leads if l["stage"] == args.stage]
    if args.service:
        leads = [l for l in leads if l["service"] == args.service]
    if not leads:
        print("No leads found.")
        return

    stage_icons = {
        "lead": "🆕", "contacted": "📞", "proposal": "📋",
        "negotiation": "🤝", "won": "💰", "lost": "❌"
    }

    print(f"\n{'ID':>3} {'Stage':>12} {'Service':>16} {'Value':>12} {'Name':20s} {'Source'}")
    print("-" * 90)
    for l in leads:
        icon = stage_icons.get(l["stage"], "?")
        value_str = f"{l['value']:,} DZD" if l["value"] else "—"
        print(f"{l['id']:>3} {icon} {l['stage']:<10} {l['service']:>16} {value_str:>12} {l['name']:20s} {l.get('source', '')}")

def advance_lead(args):
    data = load_pipeline()
    for lead in data["leads"]:
        if lead["id"] == args.lead_id:
            current_idx = STAGES.index(lead["stage"])
            if current_idx < len(STAGES) - 1:
                lead["stage"] = STAGES[current_idx + 1]
                lead["updated"] = datetime.now().isoformat()
                save_pipeline(data)
                print(f"✅ Lead #{lead['id']} moved to: {lead['stage']}")
            else:
                print(f"⚠️ Lead #{lead['id']} is already at stage: {lead['stage']}")
            return
    print(f"❌ Lead #{args.lead_id} not found.")

def pipeline_report(args):
    data = load_pipeline()
    leads = data["leads"]
    if not leads:
        print("No leads in pipeline.")
        return

    total_value = sum(l["value"] for l in leads if l["stage"] == "won")
    pipeline_value = sum(l["value"] for l in leads if l["stage"] not in ["won", "lost"])

    print("\n" + "=" * 60)
    print("  📊 AGENCY PIPELINE REPORT")
    print("=" * 60)

    print(f"\n  Total Leads:     {len(leads)}")
    print(f"  Won Revenue:     {total_value:>10,} DZD")
    print(f"  Pipeline Value:  {pipeline_value:>10,} DZD")

    print(f"\n  {'Stage':<15} {'Count':>5} {'Value':>12}")
    print("  " + "-" * 35)
    for stage in STAGES:
        stage_leads = [l for l in leads if l["stage"] == stage]
        stage_value = sum(l["value"] for l in stage_leads)
        icon = {"lead": "🆕", "contacted": "📞", "proposal": "📋",
                "negotiation": "🤝", "won": "💰", "lost": "❌"}.get(stage, "?")
        print(f"  {icon} {stage:<13} {len(stage_leads):>5} {stage_value:>10,} DZD")

    # Conversion rate
    won = len([l for l in leads if l["stage"] == "won"])
    total_closed = won + len([l for l in leads if l["stage"] == "lost"])
    rate = (won / total_closed * 100) if total_closed > 0 else 0

    print(f"\n  Win Rate: {rate:.0f}%")
    print(f"\n  Recent Activity:")
    recent = sorted(leads, key=lambda x: x["updated"], reverse=True)[:5]
    for r in recent:
        print(f"    {r['name']:20s} → {r['stage']}")
    print("=" * 60)

def main():
    parser = argparse.ArgumentParser(description="Agency Pipeline Manager")
    subparsers = parser.add_subparsers(dest="command")

    # Add lead
    add_p = subparsers.add_parser("add", help="Add a lead")
    add_p.add_argument("name", help="Lead/client name")
    add_p.add_argument("service", choices=SERVICES, help="Service interested in")
    add_p.add_argument("--value", "-v", type=int, help="Deal value in DZD")
    add_p.add_argument("--stage", "-s", choices=STAGES, default="lead")
    add_p.add_argument("--contact", "-c", help="Contact info")
    add_p.add_argument("--source", help="Lead source (instagram, referral, etc)")
    add_p.add_argument("--notes", "-n", help="Notes")

    # List leads
    list_p = subparsers.add_parser("list", help="List leads")
    list_p.add_argument("--stage", "-s", choices=STAGES)
    list_p.add_argument("--service", choices=SERVICES)

    # Advance lead
    adv_p = subparsers.add_parser("advance", help="Move lead to next stage")
    adv_p.add_argument("lead_id", type=int, help="Lead ID")

    # Report
    subparsers.add_parser("report", help="Pipeline report")

    args = parser.parse_args()
    if args.command == "add":
        add_lead(args)
    elif args.command == "list":
        list_leads(args)
    elif args.command == "advance":
        advance_lead(args)
    elif args.command == "report":
        pipeline_report(args)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()