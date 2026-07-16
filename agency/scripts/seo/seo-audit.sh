#!/bin/bash
# ============================================================
# SEO Audit Script — Quick site analysis
# Usage: seo-audit.sh <url>
# Example: seo-audit.sh https://example.com
# ============================================================

set -e
URL="${1:?Usage: seo-audit.sh <url>}"
DOMAIN=$(echo "$URL" | sed -E 's|https?://([^/]+).*|\1|')
DATE=$(date +%Y-%m-%d)
REPORT_DIR="$HOME/agency/reports/seo-audit-$DOMAIN-$DATE"
mkdir -p "$REPORT_DIR"

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${CYAN}======================================${NC}"
echo -e "${CYAN}  SEO AUDIT: $DOMAIN${NC}"
echo -e "${CYAN}======================================${NC}"
echo ""

# --- DNS ---
echo -e "${GREEN}[+] DNS Records${NC}"
dig +short "$DOMAIN" A | head -5 > "$REPORT_DIR/dns-a.txt"
dig +short "$DOMAIN" MX | head -5 > "$REPORT_DIR/dns-mx.txt"
dig +short "$DOMAIN" NS | head -5 > "$REPORT_DIR/dns-ns.txt"
dig +short "$DOMAIN" TXT | head -10 > "$REPORT_DIR/dns-txt.txt"
echo "  A:    $(cat "$REPORT_DIR/dns-a.txt" | tr '\n' ' ')"
echo "  MX:   $(cat "$REPORT_DIR/dns-mx.txt" | tr '\n' ' ')"
echo "  NS:   $(cat "$REPORT_DIR/dns-ns.txt" | tr '\n' ' ')"
echo ""

# --- HTTP Headers ---
echo -e "${GREEN}[+] HTTP Headers${NC}"
curl -sI "$URL" -m 10 | head -20 | tee "$REPORT_DIR/headers.txt"
echo ""

# --- SSL Check ---
echo -e "${GREEN}[+] SSL/TLS${NC}"
echo | openssl s_client -connect "$DOMAIN:443" -servername "$DOMAIN" 2>/dev/null | \
    openssl x509 -noout -dates -subject 2>/dev/null | tee "$REPORT_DIR/ssl.txt" || \
    echo "  No SSL certificate found or connection failed"
echo ""

# --- Robots.txt ---
echo -e "${GREEN}[+] Robots.txt${NC}"
curl -s "$URL/robots.txt" -m 10 | head -30 | tee "$REPORT_DIR/robots.txt"
echo ""

# --- Sitemap ---
echo -e "${GREEN}[+] Sitemap${NC}"
curl -s "$URL/sitemap.xml" -m 10 | head -20 | tee "$REPORT_DIR/sitemap.txt"
echo ""

# --- Page Load Time ---
echo -e "${GREEN}[+] Page Load Time${NC}"
LOAD_TIME=$(curl -sI "$URL" -m 10 -o /dev/null -w "%{time_total}s\n")
echo "  Load time: $LOAD_TIME"
echo "$LOAD_TIME" > "$REPORT_DIR/load-time.txt"
echo ""

# --- HTTP Status ---
echo -e "${GREEN}[+] HTTP Status${NC}"
STATUS=$(curl -sI "$URL" -m 10 -o /dev/null -w "%{http_code}")
REDIRECT=$(curl -sI "$URL" -m 10 -o /dev/null -w "%{redirect_url}")
echo "  Status: $STATUS"
[ -n "$REDIRECT" ] && echo "  Redirect: $REDIRECT"
echo ""

# --- Page Content Analysis ---
echo -e "${GREEN}[+] Page Analysis${NC}"
HTML=$(curl -s "$URL" -m 15)

# Title
TITLE=$(echo "$HTML" | grep -oP '<title>\K[^<]+' | head -1)
echo "  Title: ${TITLE:-<none>}"

# Meta description
META_DESC=$(echo "$HTML" | grep -oiP '<meta\s+name="description"\s+content="\K[^"]+' | head -1)
echo "  Meta Description: ${META_DESC:-<none>}"

# H1 tags
H1=$(echo "$HTML" | grep -oP '<h1[^>]*>\K[^<]+' | head -3)
echo "  H1: ${H1:-<none>}"

# Image count
IMG_COUNT=$(echo "$HTML" | grep -c '<img' || echo 0)
echo "  Images: $IMG_COUNT"

# Links count
LINK_COUNT=$(echo "$HTML" | grep -c '<a ' || echo 0)
echo "  Links: $LINK_COUNT"

# Word count (rough)
WORD_COUNT=$(echo "$HTML" | sed 's/<[^>]*>//g' | wc -w)
echo "  Word count (approx): $WORD_COUNT"
echo ""

# --- Save full HTML ---
echo "$HTML" > "$REPORT_DIR/page.html"

# --- Generate Report ---
cat > "$REPORT_DIR/report.md" << REPORT
# SEO Audit Report: $DOMAIN
**Date:** $DATE
**URL:** $URL

## Summary

| Metric | Value |
|--------|-------|
| HTTP Status | $STATUS |
| Load Time | $LOAD_TIME |
| Title | ${TITLE:-Missing} |
| Meta Description | ${META_DESC:-Missing} |
| H1 | ${H1:-Missing} |
| Word Count | ~$WORD_COUNT |
| Images | $IMG_COUNT |
| Links | $LINK_COUNT |

## Recommendations
$( [ -z "$TITLE" ] && echo "- ⚠️ Missing page title" )
$( [ -z "$META_DESC" ] && echo "- ⚠️ Missing meta description" )
$( [ -z "$H1" ] && echo "- ⚠️ Missing H1 tag" )
$( [ "$WORD_COUNT" -lt 300 ] 2>/dev/null && echo "- ⚠️ Low word count — aim for 300+" )
$( [ "$IMG_COUNT" -gt 50 ] 2>/dev/null && echo "- ⚠️ Many images — consider lazy loading" )

## Files
- Full HTML: page.html
- Headers: headers.txt
- DNS: dns-*.txt
- SSL: ssl.txt
- Robots: robots.txt
REPORT

echo -e "${YELLOW}======================================${NC}"
echo -e "${YELLOW}  Report saved to: $REPORT_DIR/${NC}"
echo -e "${YELLOW}  View: cat $REPORT_DIR/report.md${NC}"
echo -e "${YELLOW}======================================${NC}"