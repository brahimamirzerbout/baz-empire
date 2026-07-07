#!/usr/bin/env bash
# finisher 2 — run AFTER you (A) re-enable USB debugging + File-transfer mode
# AND (B) deactivate "Find My Device" device admin in Settings → Security.
set -uo pipefail
cd /home/uzer/cph1801-debloat
sh() { adb shell "$@" </dev/null 2>&1 | tr -d '\r'; }

echo "[*] waiting up to 180s for ADB..."
adb kill-server >/dev/null 2>&1; adb start-server >/dev/null 2>&1
ok=0; for i in $(seq 1 60); do adb get-state 2>/dev/null | grep -q device && { ok=1; break; }; sleep 3; done
[ "$ok" = 1 ] || { echo "[!] no ADB after 180s — re-enable USB debugging + 'File transfer / Android Auto' mode + replug + Allow"; exit 1; }
echo "[+] ADB: $(adb get-serialno)"

echo "=== delete phone-manager / clock / theme-store [+ calculator retry] ==="
for p in com.coloros.appmanager com.coloros.alarmclock com.nearme.themespace com.android.calculator2; do
  r="$(sh pm uninstall --user 0 "$p" 2>/dev/null)"; printf "  %-42s uninstall -> %s\n" "$p" "$r"
  case "$r" in *Success*) echo "$p" >> removed.log;; esac
  echo "$r" | grep -q Success || { d="$(sh pm disable-user --user 0 "$p" 2>/dev/null)"; printf "  %-42s disable   -> %s\n" "$p" "$d"; case "$d" in *disabled-user*) echo "$p" >> removed.log;; esac; }
done
echo "  verify:"
for p in com.coloros.appmanager com.coloros.alarmclock com.nearme.themespace com.android.calculator2; do
  en="$(sh pm list packages | grep -c "package:$p$")"; ds="$(sh pm list packages -d | grep -c "package:$p$")"
  [ "$en" = 1 ] && echo "    [EN]     $p" || { [ "$ds" = 1 ] && echo "    [DIS]    $p" || echo "    [gone]   $p"; }
done

echo "=== active device admins (dumpsys device_policy) ==="
sh dumpsys device_policy 2>/dev/null | grep -iE 'Admin Info|Component|packageName|gms|google|testOnly' | head -25 | sed 's/^/  /'

echo "=== uninstall GMS (only works if Find My Device admin deactivated) ==="
echo "  GMS uninstall -> $(sh pm uninstall --user 0 com.google.android.gms 2>&1)"
if sh pm list packages | grep -q 'package:com.google.android.gms$'; then
  echo "  [GMS STILL PRESENT]"
  echo "    -> On phone: Settings → Security → Device administrators → uncheck 'Find My Device' → Deactivate"
  echo "    -> then rerun: bash finish2.sh"
  echo "  (containment) force-stop + disable-user:"
  sh am force-stop com.google.android.gms >/dev/null 2>&1
  echo "    disable-user -> $(sh pm disable-user --user 0 com.google.android.gms 2>&1)"
else
  echo "  [GMS GONE] — de-Google complete; GMS/GSF crash-loop should stop."
fi

echo "=== FINAL STATE ==="
echo "  boot=$(sh getprop sys.boot_completed)  enabled=$(sh pm list packages|wc -l)  google-left=$(sh pm list packages|grep -c 'package:com.google.')"
sh pm list packages | grep 'package:com.google.' | sed 's/^/    /'
echo "  IME=$(sh settings get secure default_input_method)"
echo "  HOME=$(sh cmd package resolve-activity --brief -a android.intent.action.MAIN -c android.intent.category.HOME|tail -1)"
echo "  sanity EN: sysui=$(sh pm list packages|grep -c 'package:com.android.systemui$') settings=$(sh pm list packages|grep -c 'package:com.android.settings$') phone=$(sh pm list packages|grep -c 'package:com.android.phone$') launcher=$(sh pm list packages|grep -c 'package:com.oppo.launcher$')"
echo "  removed.log=$(wc -l <removed.log)  (restore: bash restore.sh)"