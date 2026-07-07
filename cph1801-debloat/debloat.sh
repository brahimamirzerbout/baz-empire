#!/usr/bin/env bash
# Debloat executor — CPH1801. Reversible user-profile removal.
# Usage: debloat.sh [list-file]   (default: packages-full.txt)
set -uo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
LIST="${1:-$DIR/packages-full.txt}"
NEVER="$DIR/never-touch.txt"
LOG="$DIR/removed.log"
FAILLOG="$DIR/failed.log"
: > "$LOG"; : > "$FAILLOG"
[ -f "$LIST" ] || { echo "[!] missing $LIST"; exit 1; }

# build never-touch guard set
declare -A NT=()
while IFS= read -r n; do n="${n%%#*}"; n="${n// /}"; [ -n "$n" ] && NT["$n"]=1; done < "$NEVER"

ok=0; blk=0; already=0; fail=0; total=0
echo "[*] debloat from $(basename "$LIST") — guarded by never-touch.txt ($(wc -l <"$NEVER") entries)"
echo
while IFS= read -r pkg; do
  pkg="${pkg%%#*}"; pkg="${pkg// /}"; [ -z "$pkg" ] && continue
  total=$((total+1))
  if [ -n "${NT[$pkg]:-}" ]; then printf "  [BLOCK] %-45s (never-touch)\n" "$pkg"; blk=$((blk+1)); continue; fi
  out="$(adb shell pm uninstall --user 0 "$pkg" </dev/null 2>&1 | tr -d '\r')"
  meth="uninstall"
  case "$out" in
    *Success*) printf "  [OK]    %s\n" "$pkg"; echo "$pkg" >> "$LOG"; ok=$((ok+1)); continue;;
    *"Failure"*not\ installed*) printf "  [skip]  %-45s (already gone)\n" "$pkg"; already=$((already+1)); echo "$pkg|$out">>"$FAILLOG"; continue;;
    *DELETE_FAILED_INTERNAL_ERROR*)
        # already disabled or protected — fall back to disable-user
        out2="$(adb shell pm disable-user --user 0 "$pkg" </dev/null 2>&1 | tr -d '\r')"; meth="disable"; out="$out | disable:$out2";;
    *"Failure"*)
        out2="$(adb shell pm disable-user --user 0 "$pkg" </dev/null 2>&1 | tr -d '\r')"; meth="disable"; out="$out | disable:$out2";;
  esac
  case "$out2" in
    *Success*|*disabled*users*) printf "  [DIS]   %-45s (uninstall blocked, disabled)\n" "$pkg"; echo "$pkg" >> "$LOG"; ok=$((ok+1));;
    *) printf "  [FAIL]  %-45s -> %s\n" "$pkg" "$out"; fail=$((fail+1)); echo "$pkg|$out">>"$FAILLOG";;
  esac
done < "$LIST"

echo
echo "════════════════════════════════════════"
echo "  processed     : $total"
echo "  removed       : $ok    -> removed.log"
echo "  already gone   : $already"
echo "  blocked(never) : $blk"
echo "  failed         : $fail   -> failed.log"
echo "════════════════════════════════════════"
echo "Restore everything:  bash restore.sh"