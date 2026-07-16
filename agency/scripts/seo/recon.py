#!/usr/bin/env python3
"""
Bulk Domain/IP Recon Tool
Quick OSINT gathering for client domains
Usage: python3 recon.py <domain> [--full]
"""

import subprocess
import json
import argparse
from datetime import datetime
from pathlib import Path

REPORTS_DIR = Path.home() / "agency" / "reports" / "recon"

def run(cmd, timeout=10):
    """Run a shell command and return stripped output."""
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
        return result.stdout.strip()
    except Exception:
        return ""

def recon_domain(domain, full=False):
    """Gather information about a domain."""
    info = {"domain": domain, "timestamp": datetime.now().isoformat()}

    # --- DNS ---
    info["dns"] = {
        "A": run(["dig", "+short", domain, "A"]).split("\n"),
        "AAAA": run(["dig", "+short", domain, "AAAA"]).split("\n"),
        "MX": run(["dig", "+short", domain, "MX"]).split("\n"),
        "NS": run(["dig", "+short", domain, "NS"]).split("\n"),
        "TXT": run(["dig", "+short", domain, "TXT"]).split("\n"),
        "SOA": run(["dig", "+short", domain, "SOA"]).split("\n"),
    }
    info["dns"]["A"] = [x for x in info["dns"]["A"] if x]
    info["dns"]["AAAA"] = [x for x in info["dns"]["AAAA"] if x]
    info["dns"]["MX"] = [x for x in info["dns"]["MX"] if x]
    info["dns"]["NS"] = [x for x in info["dns"]["NS"] if x]
    info["dns"]["TXT"] = [x for x in info["dns"]["TXT"] if x]
    info["dns"]["SOA"] = [x for x in info["dns"]["SOA"] if x]

    # --- Whois ---
    whois_data = run(["whois", domain], timeout=30)
    info["whois"] = {}
    for line in whois_data.split("\n"):
        for field in ["Registrar", "Creation Date", "Expiry Date", "Registry Domain ID",
                      "Registrar URL", "Name Server", "DNSSEC"]:
            if line.lower().startswith(field.lower()):
                key, _, val = line.partition(":")
                info["whois"][key.strip()] = val.strip()

    # --- HTTP ---
    headers = run(["curl", "-sI", "-m", "10", "-L", f"https://{domain}"])
    info["http_headers"] = {}
    for line in headers.split("\n"):
        if ": " in line:
            key, _, val = line.partition(": ")
            info["http_headers"][key.strip()] = val.strip()

    # --- SSL ---
    ssl_info = run([
        "openssl", "s_client", "-connect", f"{domain}:443",
        "-servername", domain
    ], timeout=10)
    if ssl_info:
        cert_data = run(["openssl", "x509", "-noout", "-subject", "-dates", "-issuer"],
                       timeout=5)
        # Pass via stdin
        try:
            result = subprocess.run(
                ["openssl", "x509", "-noout", "-subject", "-dates", "-issuer"],
                input=ssl_info, capture_output=True, text=True, timeout=10
            )
            info["ssl"] = result.stdout.strip()
        except Exception:
            info["ssl"] = "Could not parse SSL cert"
    else:
        info["ssl"] = "No SSL"

    # --- Subdomain discovery (if full) ---
    if full:
        print("  Running full recon (this may take a minute)...")
        # Check common subdomains
        subdomains = []
        common_subs = ["www", "mail", "ftp", "blog", "shop", "api", "dev",
                       "staging", "admin", "portal", "app", "cdn", "ns1", "ns2"]
        for sub in common_subs:
            ip = run(["dig", "+short", f"{sub}.{domain}", "A"])
            if ip:
                subdomains.append({"subdomain": f"{sub}.{domain}", "ip": ip})
        info["subdomains"] = subdomains

        # Open ports on main IP
        if info["dns"]["A"]:
            main_ip = info["dns"]["A"][0]
            ports = run(["nmap", "-T4", "-F", "--top-ports", "100", "-Pn", main_ip], timeout=60)
            info["ports"] = ports

    return info

def print_recon(info):
    """Print formatted recon results."""
    print("\n" + "=" * 60)
    print(f"  🔍 DOMAIN RECON: {info['domain']}")
    print("=" * 60)

    print("\n  📋 DNS Records:")
    for record_type, values in info["dns"].items():
        if values:
            for v in values:
                print(f"     {record_type:6s} → {v}")

    if info.get("whois"):
        print("\n  📝 WHOIS:")
        for key, val in info["whois"].items():
            print(f"     {key}: {val}")

    print("\n  🔒 HTTP Headers:")
    for key, val in info.get("http_headers", {}).items():
        print(f"     {key}: {val}")

    print(f"\n  🔐 SSL: {info.get('ssl', 'N/A')[:200]}")

    if info.get("subdomains"):
        print("\n  🌐 Subdomains:")
        for sub in info["subdomains"]:
            print(f"     {sub['subdomain']:30s} → {sub['ip']}")

    print()

def main():
    parser = argparse.ArgumentParser(description="Domain Recon Tool")
    parser.add_argument("domain", help="Domain to investigate")
    parser.add_argument("--full", "-f", action="store_true", help="Full scan including subdomains & ports")
    parser.add_argument("--json", "-j", action="store_true", help="Output as JSON")
    args = parser.parse_args()

    print(f"🔍 Gathering intel on {args.domain}...")
    info = recon_domain(args.domain, full=args.full)

    # Save
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_file = REPORTS_DIR / f"recon_{args.domain}_{timestamp}.json"

    with open(report_file, "w") as f:
        json.dump(info, f, indent=2)

    if args.json:
        print(json.dumps(info, indent=2))
    else:
        print_recon(info)

    print(f"💾 Saved: {report_file}")

if __name__ == "__main__":
    main()