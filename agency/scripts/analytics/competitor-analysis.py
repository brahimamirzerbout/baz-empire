#!/usr/bin/env python3
"""
Competitor Analysis Tool
Scrapes and compares website metrics against competitors
Usage: python3 competitor-analysis.py <your_url> <competitor1> [competitor2 ...]
"""

import subprocess
import json
import argparse
from datetime import datetime
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

REPORTS_DIR = Path.home() / "agency" / "reports" / "competitor-analysis"

def fetch_site_info(url):
    """Gather basic info about a website."""
    info = {"url": url, "timestamp": datetime.now().isoformat()}

    # HTTP headers
    try:
        result = subprocess.run(
            ["curl", "-sI", "-m", "10", "-L", url],
            capture_output=True, text=True, timeout=15
        )
        headers = {}
        for line in result.stdout.split("\n"):
            if ": " in line:
                key, val = line.split(": ", 1)
                headers[key.lower()] = val.strip()
        info["headers"] = headers
        info["status"] = headers.get("HTTP", "unknown")
        info["server"] = headers.get("server", "unknown")
        info["content_type"] = headers.get("content-type", "unknown")
    except Exception:
        info["headers"] = {}

    # DNS
    domain = url.replace("https://", "").replace("http://", "").split("/")[0]
    try:
        result = subprocess.run(["dig", "+short", domain, "A"], capture_output=True, text=True, timeout=10)
        info["ip"] = result.stdout.strip().split("\n")[0] or "unknown"
    except Exception:
        info["ip"] = "unknown"

    # Page content analysis
    try:
        result = subprocess.run(
            ["curl", "-s", "-m", "15", "-L", url],
            capture_output=True, text=True, timeout=20
        )
        html = result.stdout

        # Title
        import re
        title_match = re.search(r'<title[^>]*>(.*?)</title>', html, re.DOTALL)
        info["title"] = title_match.group(1).strip() if title_match else "No title"

        # Meta description
        desc_match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', html, re.IGNORECASE)
        info["meta_desc"] = desc_match.group(1) if desc_match else "No meta description"

        # H1
        h1_match = re.search(r'<h1[^>]*>(.*?)</h1>', html, re.DOTALL)
        info["h1"] = h1_match.group(1).strip() if h1_match else "No H1"

        # Counts
        info["word_count"] = len(re.sub(r'<[^>]+>', '', html).split())
        info["image_count"] = len(re.findall(r'<img', html))
        info["link_count"] = len(re.findall(r'<a ', html))
        info["heading_count"] = len(re.findall(r'<h[1-6]', html))

        # Page size
        info["page_size_kb"] = round(len(html) / 1024, 1)

    except Exception as e:
        info["error"] = str(e)

    return info

def compare_sites(our_info, competitor_infos):
    """Generate comparison report."""
    report = {
        "generated": datetime.now().isoformat(),
        "our_site": our_info,
        "competitors": competitor_infos,
        "analysis": {}
    }

    # Word count comparison
    our_words = our_info.get("word_count", 0)
    avg_comp_words = sum(c.get("word_count", 0) for c in competitor_infos) / max(len(competitor_infos), 1)
    report["analysis"]["word_count"] = {
        "ours": our_words,
        "competitor_avg": round(avg_comp_words),
        "recommendation": "Increase content length" if our_words < avg_comp_words else "Content length is competitive"
    }

    # Title length
    our_title = len(our_info.get("title", ""))
    report["analysis"]["title_length"] = {
        "ours": our_title,
        "optimal": "30-60 characters",
        "recommendation": "Title is too short" if our_title < 30 else "Title is too long" if our_title > 60 else "Title length is optimal"
    }

    # Meta description
    has_desc = bool(our_info.get("meta_desc", "No meta description") != "No meta description")
    report["analysis"]["meta_description"] = {
        "present": has_desc,
        "recommendation": "Add a meta description (150-160 chars)" if not has_desc else "Meta description present ✓"
    }

    # Images
    our_images = our_info.get("image_count", 0)
    avg_images = sum(c.get("image_count", 0) for c in competitor_infos) / max(len(competitor_infos), 1)
    report["analysis"]["images"] = {
        "ours": our_images,
        "competitor_avg": round(avg_images),
    }

    return report

def print_report(report):
    """Print formatted comparison report."""
    print("\n" + "=" * 70)
    print("  📊 COMPETITOR ANALYSIS REPORT")
    print("=" * 70)

    our = report["our_site"]
    print(f"\n  🏠 YOUR SITE: {our['url']}")
    print(f"     Title: {our.get('title', 'N/A')}")
    print(f"     Words: {our.get('word_count', 'N/A')} | Images: {our.get('image_count', 'N/A')} | Links: {our.get('link_count', 'N/A')}")
    print(f"     Server: {our.get('server', 'N/A')} | Size: {our.get('page_size_kb', 'N/A')}KB")

    print(f"\n  🏁 COMPETITORS:")
    for i, comp in enumerate(report["competitors"], 1):
        print(f"\n  {i}. {comp['url']}")
        print(f"     Title: {comp.get('title', 'N/A')}")
        print(f"     Words: {comp.get('word_count', 'N/A')} | Images: {comp.get('image_count', 'N/A')} | Links: {comp.get('link_count', 'N/A')}")
        print(f"     Server: {comp.get('server', 'N/A')} | Size: {comp.get('page_size_kb', 'N/A')}KB")

    print(f"\n  📈 ANALYSIS:")
    for key, val in report["analysis"].items():
        print(f"     {key}: {json.dumps(val, indent=0) if isinstance(val, dict) else val}")

    print("\n" + "=" * 70)

def main():
    parser = argparse.ArgumentParser(description="Competitor Analysis Tool")
    parser.add_argument("urls", nargs="+", help="Your URL followed by competitor URLs")
    parser.add_argument("--json", "-j", action="store_true", help="Output as JSON")
    args = parser.parse_args()

    if len(args.urls) < 2:
        print("Error: Provide your URL and at least one competitor URL")
        print("Usage: competitor-analysis.py <your_url> <competitor1> [competitor2 ...]")
        return

    print("🔍 Analyzing sites...")

    with ThreadPoolExecutor(max_workers=5) as executor:
        our_info = list(executor.map(fetch_site_info, [args.urls[0]]))[0]
        comp_infos = list(executor.map(fetch_site_info, args.urls[1:]))

    report = compare_sites(our_info, comp_infos)

    # Save report
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_file = REPORTS_DIR / f"analysis_{timestamp}.json"

    with open(report_file, "w") as f:
        json.dump(report, f, indent=2)

    if args.json:
        print(json.dumps(report, indent=2))
    else:
        print_report(report)

    print(f"\n💾 Report saved: {report_file}")

if __name__ == "__main__":
    main()