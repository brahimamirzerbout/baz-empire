#!/bin/bash
# ============================================================
# Quick Site Deploy — Static site to local nginx or surge.sh
# Usage: deploy.sh <client-dir> [--surge]
# Example: deploy.sh clientname
#          deploy.sh clientname --surge
# ============================================================

set -e
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

CLIENT="${1:?Usage: deploy.sh <client-dir> [--surge]}"
DEPLOY_METHOD="${2:-local}"
AGENCY_DIR="$HOME/agency"
WEB_ROOT="/var/www/agency/local/public"

echo -e "${CYAN}🚀 Deploying: $CLIENT${NC}"

if [ "$DEPLOY_METHOD" == "--surge" ]; then
    # Deploy to surge.sh (free static hosting)
    echo -e "${GREEN}[+] Deploying to surge.sh...${NC}"
    CLIENT_DIR="$AGENCY_DIR/clients/$CLIENT/site"
    if [ ! -d "$CLIENT_DIR" ]; then
        echo -e "${YELLOW}[!] No site directory found at $CLIENT_DIR${NC}"
        echo -e "${YELLOW}[!] Creating scaffold...${NC}"
        mkdir -p "$CLIENT_DIR"
        cp "$AGENCY_DIR/templates/site-scaffold/index.html" "$CLIENT_DIR/index.html" 2>/dev/null || \
            echo "<!DOCTYPE html><html><head><title>$CLIENT</title></head><body><h1>$CLIENT</h1></body></html>" > "$CLIENT_DIR/index.html"
    fi
    surge "$CLIENT_DIR" "${CLIENT}.surge.sh" 2>/dev/null || {
        echo -e "${YELLOW}[!] Install surge first: npm install -g surge${NC}"
        exit 1
    }
    echo -e "${GREEN}[✓] Live at: https://${CLIENT}.surge.sh${NC}"

elif [ "$DEPLOY_METHOD" == "--live" ]; then
    # Deploy to nginx with proper domain
    echo -e "${GREEN}[+] Deploying to nginx (live)...${NC}"
    CLIENT_DIR="$AGENCY_DIR/clients/$CLIENT/site"
    sudo cp -r "$CLIENT_DIR"/* "$WEB_ROOT/$CLIENT/" 2>/dev/null || {
        sudo mkdir -p "$WEB_ROOT/$CLIENT"
        sudo cp -r "$CLIENT_DIR"/* "$WEB_ROOT/$CLIENT/"
    }
    echo -e "${GREEN}[✓] Live at: http://localhost:8080/$CLIENT/${NC}"

else
    # Local deploy
    echo -e "${GREEN}[+] Deploying locally...${NC}"
    CLIENT_DIR="$AGENCY_DIR/clients/$CLIENT/site"

    if [ ! -d "$CLIENT_DIR" ]; then
        echo -e "${YELLOW}[!] No site directory found at $CLIENT_DIR${NC}"
        echo -e "${YELLOW}[!] Creating scaffold...${NC}"
        mkdir -p "$CLIENT_DIR"
        echo "<!DOCTYPE html><html><head><title>$CLIENT</title></head><body><h1>$CLIENT</h1></body></html>" > "$CLIENT_DIR/index.html"
    fi

    sudo mkdir -p "$WEB_ROOT/$CLIENT"
    sudo cp -r "$CLIENT_DIR"/* "$WEB_ROOT/$CLIENT/"
    sudo chown -R www-data:www-data "$WEB_ROOT/$CLIENT"
    sudo systemctl reload nginx 2>/dev/null

    echo -e "${GREEN}[✓] Live at: http://localhost:8080/$CLIENT/${NC}"
fi

echo -e "${CYAN}[→] Site files: $AGENCY_DIR/clients/$CLIENT/site/${NC}"