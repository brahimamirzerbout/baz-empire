#!/usr/bin/env bash
# Locate the BAZ "books" box on the LAN by IDENTITY, not by a drifting DHCP IP.
# Identity = keyless uzer SSH works AND ~/Downloads holds the book corpus.
# Usage:  find-books-box.sh            # just locate + report load
#         find-books-box.sh --update   # also rewrite the `books` HostName in ~/.ssh/config
set -uo pipefail
SUBNET="192.168.100.0/24"
KEY="$HOME/.ssh/id_ed25519"
CFG="$HOME/.ssh/config"
UPDATE=0; [ "${1:-}" = "--update" ] && UPDATE=1
SELF=$(ip -4 addr show wlan0 2>/dev/null | awk -F'[ /]' '/inet /{print $6; exit}')

echo "Scanning $SUBNET for hosts with :22 open ..."
mapfile -t HOSTS < <(nmap -sn -n "$SUBNET" -oG - 2>/dev/null | awk '/Up$/{print $2}')

found=""
for h in "${HOSTS[@]}"; do
  [ "$h" = "192.168.100.1" ] && continue        # gateway
  [ "$h" = "$SELF" ] && continue                 # this box
  nmap -Pn -n -p22 --max-retries 0 --host-timeout 5s "$h" 2>/dev/null | grep -q "22/tcp open" || continue
  out=$(timeout 20 ssh -o BatchMode=yes -o IdentitiesOnly=yes -i "$KEY" \
        -o StrictHostKeyChecking=accept-new -o ConnectTimeout=15 "uzer@$h" \
        'echo "LOAD=$(cat /proc/loadavg)"; ls -d ~/Downloads >/dev/null 2>&1 && echo "BOOKS=$(find ~/Downloads -maxdepth 1 \( -iname "*.pdf" -o -iname "*.epub" -o -iname "*.mobi" -o -iname "*.azw*" \) 2>/dev/null | wc -l)"' 2>/dev/null)
  if echo "$out" | grep -q "^BOOKS="; then
    echo ">>> MATCH: books box is at $h  | books=$(echo "$out"|sed -n 's/^BOOKS=//p') | load=$(echo "$out"|sed -n 's/^LOAD=//p')"
    found="$h"; break
  fi
done

if [ -z "$found" ]; then
  echo "No books box found. Confirm it's powered on, wifi connected, not hung (load ~19 crash?)."
  exit 1
fi

if [ "$UPDATE" = 1 ] && grep -q "^Host books" "$CFG"; then
  awk -v ip="$found" '
    /^Host books/ {inb=1; print; next}
    inb && /^[[:space:]]*HostName/ {print "    HostName "ip; inb=0; next}
    {print}
  ' "$CFG" > "$CFG.tmp" && mv "$CFG.tmp" "$CFG"
  echo "Updated 'books' alias in $CFG -> $found"
fi
echo "Verify:  ssh books 'cat /proc/loadavg'"