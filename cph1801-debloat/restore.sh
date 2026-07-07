#!/usr/bin/env bash
# One-command restore — re-installs everything in removed.log
# (pm install-existing re-activates a system APK for user 0)
set -uo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
LOG="${1:-$DIR/removed.log}"
[ -f "$LOG" ] || { echo "[!] no $LOG — nothing to restore"; exit 1; }
n=0; t=0
while IFS= read -r pkg; do
  [ -z "$pkg" ] && continue
  t=$((t+1))
  out="$(adb shell pm install-existing --user 0 "$pkg" </dev/null 2>&1 | tr -d '\r')"
  case "$out" in
    *Success*) printf "  [restored] %s\n" "$pkg"; n=$((n+1));;
    *) # maybe it was disabled not uninstalled — enable it
       out2="$(adb shell pm enable "$pkg" </dev/null 2>&1 | tr -d '\r')"
       case "$out2" in
         *enabled*) printf "  [enabled]  %s\n" "$pkg"; n=$((n+1));;
         *) printf "  [%s] %s | %s\n" "$pkg" "$out" "$out2";;
       esac;;
  esac
done < "$LOG"
echo "──────────────────────────"
echo "  attempted : $t   restored : $n"