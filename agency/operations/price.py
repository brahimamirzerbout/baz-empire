#!/usr/bin/env python3
"""
Agency Pricing Calculator
Calculate project pricing based on service type, scope, and client size
Usage: python3 price.py --service <service> [--scope small/medium/large] [--client micro/smb/enterprise]
"""

import argparse
import json
from datetime import datetime

# Base prices in DZD (Algerian Dinar)
PRICING = {
    "qr-solution": {
        "name": "QR Solution (QrCreator-powered)",
        "description": "Custom QR landing page for business",
        "scopes": {
            "small": {"price": 5000, "label": "Single QR page (menu/vitrine)", "delivery": "2-3 days"},
            "medium": {"price": 15000, "label": "Multi-page QR (menu + vitrine + links)", "delivery": "5-7 days"},
            "large": {"price": 30000, "label": "Full QR suite (menu + vitrine + products + NFC cards)", "delivery": "10-14 days"},
        },
        "retainer": 5000,
        "retainer_includes": "QR updates, analytics reports, content changes",
    },
    "web-design": {
        "name": "Web Design & Development",
        "description": "Landing pages, vitrines, mini-sites",
        "scopes": {
            "small": {"price": 15000, "label": "Single landing page", "delivery": "3-5 days"},
            "medium": {"price": 35000, "label": "Multi-page website (5-10 pages)", "delivery": "7-14 days"},
            "large": {"price": 80000, "label": "Full website with CMS", "delivery": "21-30 days"},
        },
        "retainer": 10000,
        "retainer_includes": "Hosting, maintenance, minor updates",
    },
    "seo": {
        "name": "SEO & Search Visibility",
        "description": "Local SEO, keyword targeting, content optimization",
        "scopes": {
            "small": {"price": 10000, "label": "SEO audit + basic optimization", "delivery": "3-5 days"},
            "medium": {"price": 25000, "label": "Full SEO setup + 3 months content", "delivery": "Ongoing"},
            "large": {"price": 50000, "label": "Comprehensive SEO strategy + 6 months content", "delivery": "Ongoing"},
        },
        "retainer": 15000,
        "retainer_includes": "Monthly reports, content, link building",
    },
    "social-media": {
        "name": "Social Media Management",
        "description": "Content creation, scheduling, engagement, growth",
        "scopes": {
            "small": {"price": 10000, "label": "2 platforms, 3 posts/week", "delivery": "Monthly"},
            "medium": {"price": 20000, "label": "3 platforms, 5 posts/week", "delivery": "Monthly"},
            "large": {"price": 35000, "label": "5 platforms, daily posts + stories", "delivery": "Monthly"},
        },
        "retainer": 15000,
        "retainer_includes": "Content creation, scheduling, community management",
    },
    "branding": {
        "name": "Branding & Identity",
        "description": "Logo, brand guidelines, visual identity",
        "scopes": {
            "small": {"price": 10000, "label": "Logo design", "delivery": "3-5 days"},
            "medium": {"price": 25000, "label": "Logo + brand kit + social templates", "delivery": "7-10 days"},
            "large": {"price": 50000, "label": "Full brand identity system", "delivery": "14-21 days"},
        },
        "retainer": 5000,
        "retainer_includes": "Brand template updates",
    },
    "content": {
        "name": "Content Creation",
        "description": "Blog posts, copy, marketing materials",
        "scopes": {
            "small": {"price": 5000, "label": "2 blog posts", "delivery": "3-5 days"},
            "medium": {"price": 15000, "label": "5 blog posts + social copy", "delivery": "7-10 days"},
            "large": {"price": 30000, "label": "Full content package (10+ pieces)", "delivery": "14-21 days"},
        },
        "retainer": 10000,
        "retainer_includes": "4 blog posts + social copy per month",
    },
    "email-marketing": {
        "name": "Email Marketing",
        "description": "Campaigns, newsletters, automation",
        "scopes": {
            "small": {"price": 8000, "label": "1 campaign (design + send)", "delivery": "3-5 days"},
            "medium": {"price": 20000, "label": "Monthly newsletter + 2 campaigns", "delivery": "Monthly"},
            "large": {"price": 40000, "label": "Full email automation setup", "delivery": "14-21 days"},
        },
        "retainer": 12000,
        "retainer_includes": "2 campaigns + newsletter per month",
    },
    "full-stack": {
        "name": "Full Stack Marketing",
        "description": "Complete marketing package (everything)",
        "scopes": {
            "small": {"price": 30000, "label": "QR + social + basic SEO", "delivery": "7-10 days"},
            "medium": {"price": 60000, "label": "QR + web + social + SEO + content", "delivery": "14-21 days"},
            "large": {"price": 120000, "label": "Full agency service (all services)", "delivery": "21-30 days"},
        },
        "retainer": 50000,
        "retainer_includes": "All services, priority support, monthly strategy",
    },
}

# Client size multipliers
CLIENT_MULTIPLIERS = {
    "micro": 0.8,    # Solo entrepreneur / very small
    "smb": 1.0,      # Standard pricing
    "enterprise": 1.5, # Larger organizations
}

def calculate_pricing(args):
    service = PRICING.get(args.service)
    if not service:
        print(f"Unknown service: {args.service}")
        return

    scope = service["scopes"].get(args.scope)
    if not scope:
        print(f"Unknown scope: {args.scope}")
        return

    multiplier = CLIENT_MULTIPLIERS.get(args.client, 1.0)
    base_price = scope["price"]
    adjusted_price = int(base_price * multiplier)
    retainer = int(service["retainer"] * multiplier)

    print("\n" + "=" * 60)
    print(f"  💰 PRICING QUOTE")
    print("=" * 60)
    print(f"\n  Service:    {service['name']}")
    print(f"  Client:     {args.client.upper()}")
    print(f"  Scope:      {scope['label']}")
    print(f"  Delivery:   {scope['delivery']}")
    print(f"\n  ┌─────────────────────────────────────┐")
    print(f"  │  ONE-TIME:   {adjusted_price:>10,} DZD     │")
    print(f"  │  RETAINER:  {retainer:>10,} DZD/mo   │")
    print(f"  └─────────────────────────────────────┘")
    print(f"\n  Retainer includes:")
    print(f"    • {service['retainer_includes']}")

    # Bundle suggestions
    print(f"\n  📦 Bundle Suggestions:")
    if args.service == "qr-solution":
        print(f"    • QR + Social Media:     {int((5000+10000)*multiplier):>10,} DZD")
        print(f"    • QR + Web Design:       {int((5000+15000)*multiplier):>10,} DZD")
        print(f"    • Full Stack (best deal): {int(30000*multiplier):>10,} DZD")
    elif args.service == "web-design":
        print(f"    • Web + SEO:             {int((15000+10000)*multiplier):>10,} DZD")
        print(f"    • Web + Social + Content: {int((15000+10000+5000)*multiplier):>10,} DZD")
        print(f"    • Full Stack (best deal): {int(30000*multiplier):>10,} DZD")

    print(f"\n  💡 Pro Tip: Offer QR as a low-cost entry point,")
    print(f"     then upsell social media & SEO retainers.")
    print("=" * 60)

def list_services(args):
    print("\n" + "=" * 60)
    print("  📋 AGENCY SERVICES & PRICING")
    print("=" * 60)
    for key, svc in PRICING.items():
        print(f"\n  {svc['name']}")
        print(f"  {svc['description']}")
        for scope, details in svc["scopes"].items():
            print(f"    {scope:>6s}: {details['label']:<45s} {details['price']:>8,} DZD")
        print(f"    Retainer: {svc['retainer']:>,} DZD/mo — {svc['retainer_includes']}")
    print("\n" + "=" * 60)

def main():
    parser = argparse.ArgumentParser(description="Agency Pricing Calculator")
    subparsers = parser.add_subparsers(dest="command")

    # Calculate pricing
    calc_p = subparsers.add_parser("calc", help="Calculate pricing for a service")
    calc_p.add_argument("--service", "-s", required=True, choices=PRICING.keys())
    calc_p.add_argument("--scope", choices=["small", "medium", "large"], default="medium")
    calc_p.add_argument("--client", "-c", choices=CLIENT_MULTIPLIERS.keys(), default="smb")

    # List all services
    subparsers.add_parser("list", help="List all services and pricing")

    args = parser.parse_args()
    if args.command == "calc":
        calculate_pricing(args)
    elif args.command == "list":
        list_services(args)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()