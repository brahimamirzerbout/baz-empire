#!/usr/bin/env python3
"""
Website Lighthouse Score Checker
Runs Lighthouse audits via Chromium and generates reports
Usage: python3 lh-check.py <url> [--output html/json]
Requires: lighthouse (npm install -g lighthouse)
"""

import subprocess
import json
import argparse
import os
from datetime import datetime
from pathlib import Path

REPORTS_DIR = Path.home() / "agency" / "reports" / "lighthouse"

def run_lighthouse(url, output_format="html"):
    """Run Lighthouse audit on a URL."""
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    domain = url.replace("https://", "").replace("http://", "").split("/")[0]
    base_name = f"{domain}_{timestamp}"

    output_path = REPORTS_DIR / f"{base_name}.{output_format}"

    print(f"🔍 Running Lighthouse audit on: {url}")
    print(f"   Output: {output_format}")
    print(f"   This may take 30-60 seconds...\n")

    cmd = [
        "lighthouse", url,
        "--output", output_format,
        "--output-path", str(output_path),
        "--chrome-flags", "--headless --no-sandbox",
        "--quiet",
    ]

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)

        if output_format == "json" and output_path.exists():
            with open(output_path) as f:
                data = json.load(f)

            cats = data.get("categories", {})
            print("┌──────────────────────────────────────────┐")
            print("│        LIGHTHOUSE AUDIT RESULTS          │")
            print("├──────────────────────────────────────────┤")
            for key, val in cats.items():
                score = int((val.get("score", 0) or 0) * 100)
                bar = "█" * (score // 5) + "░" * (20 - score // 5)
                emoji = "🟢" if score >= 90 else "🟡" if score >= 50 else "🔴"
                print(f"│ {emoji} {val['title']:20s} {score:3d}  {bar} │")
            print("└──────────────────────────────────────────┘")
            print(f"\n📄 Full report: {output_path}")
            return data

        elif output_path.exists():
            print(f"✅ Report saved: {output_path}")
            print(f"   Open in browser: file://{output_path}")
            return str(output_path)

    except subprocess.TimeoutExpired:
        print("❌ Lighthouse timed out (120s)")
    except FileNotFoundError:
        print("❌ Lighthouse not found. Install with: npm install -g lighthouse")
    except Exception as e:
        print(f"❌ Error: {e}")

    return None

def main():
    parser = argparse.ArgumentParser(description="Lighthouse Score Checker")
    parser.add_argument("url", help="URL to audit")
    parser.add_argument("--output", "-o", choices=["html", "json"], default="html",
                       help="Output format (default: html)")
    parser.add_argument("--benchmark", "-b", action="store_true",
                       help="Run 3 audits and average the scores")
    args = parser.parse_args()

    if args.benchmark:
        scores = []
        for i in range(3):
            print(f"\n📊 Run {i+1}/3")
            result = run_lighthouse(args.url, "json")
            if result and isinstance(result, dict):
                cats = result.get("categories", {})
                run_scores = {k: int((v.get("score", 0) or 0) * 100) for k, v in cats.items()}
                scores.append(run_scores)

        if scores:
            print("\n📈 BENCHMARK AVERAGES:")
            print("-" * 40)
            all_keys = scores[0].keys()
            for key in all_keys:
                avg = sum(s[key] for s in scores) / len(scores)
                print(f"  {key:20s}: {avg:.0f}")

    else:
        run_lighthouse(args.url, args.output)

if __name__ == "__main__":
    main()