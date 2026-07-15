#!/usr/bin/env python3
"""Render site.html locally, capture console errors, and verify favicon/manifest
icon requests all resolve (200). Uses Playwright sync API."""
import re, json
from playwright.sync_api import sync_playwright

URL = "file:///home/uzer/site.html"
errors, requests = [], []

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width":1280,"height":900})
    page.on("console", lambda m: errors.append(f"[{m.type}] {m.text}") if m.type in ("error","warning") else None)
    page.on("pageerror", lambda e: errors.append(f"[pageerror] {e}"))
    page.on("response", lambda r: requests.append((r.request.method, r.status, r.url)) if ("favicon_io" in r.url or "BAZ-Brand-Assets" in r.url) else None)
    page.goto(URL, wait_until="networkidle")
    page.wait_for_timeout(1200)
    # read manifest
    manifest_url = page.evaluate("document.querySelector('link[rel=manifest]')?.href")
    browser.close()

print("=== favicon_io requests ===")
for m,s,u in requests:
    print(f"  {s}  {m}  {u}")
print("\n=== console errors/warnings ===")
for e in errors:
    print("  ", e)
print("\nmanifest href:", manifest_url)
print("icon requests count:", len(requests), "| errors:", len(errors))