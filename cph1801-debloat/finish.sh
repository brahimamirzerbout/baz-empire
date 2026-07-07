#!/usr/bin/env bash
# finisher — run AFTER you re-enable USB debugging on the CPH1801.
# Waits for ADB, deletes radio/calculator/backup, retries GMS purge, dumps state.
set -uo pipefail
cd /home/uzer/cph1801-debloat
sh() { adb shell "$@" </dev/null 2>&1 | tr -d '\r'; }

echo "[*] waiting up to 180s for ADB to re-attach..."
adb kill-server >/dev/null 2>&1; adb start-server >/dev/null 2>&1
ok=0
for i in $(seq 1 60); do
  if adb get-state 2>/dev/null | grep -q device; then ok=1; break; fi
  sleep 3
done
if [ "$ok" != 1 ]; then
  echo "[!] no ADB after 180s — USB debugging still off. On the phone:"
  echo "    Settings → Additional settings → Developer options → USB debugging = ON"
  echo "    + USB debugging (Security settings) = ON"
  echo "    + USB notification → 'File transfer / Android Auto' → replug → tap Allow"
  exit 1
fi
echo "[+] ADB attached: $(adb get-serialno)"

echo "=== delete radio / calculator / backup (+backup remoteservice) ==="
for p in com.caf.fmradio com.android.calculator2 com.coloros.backuprestore com.coloros.backuprestore.remoteservice; do
  echo "  $p -> $(sh pm uninstall --user 0 "$p")"; echo "$p">>removed.log
done
echo "  verify:"
for p in com.caf.fmradio com.android.calculator2 com.coloros.backuprestore com.coloros.backuprestore.remoteservice; do
  [ "$(sh pm list packages | grep -c "package:$p$")" = 0 ] && echo "    [gone] $p" || echo "    [STILL EN] $p"
done

echo "=== retry GMS purge (remove device-admin, then uninstall) ==="
echo "  active admins:"; sh dpm list-active-admins | sed 's/^/    /'
ADM="$(sh dpm list-active-admins | grep 'com.google.android.gms' | grep -oE 'com\.google\.android\.gms[^ ,}]+' | sort -u)"
echo "$ADM" | while IFS= read -r c; do [ -n "$c" ] && echo "  remove-active-admin $c -> $(sh dpm remove-active-admin "$c" 2>&1)"; done
echo "  uninstall GMS -> $(sh pm uninstall --user 0 com.google.android.gms 2>&1)"
if sh pm list packages | grep -q 'package:com.google.android.gms$'; then
  echo "  [GMS still present] containment: disable-user -> $(sh pm disable-user --user 0 com.google.android.gms 2>&1)"
  sh am force-stop com.google.android.gms >/dev/null 2>&1
fi

echo "=== FINAL STATE ==="
echo "  boot=$(sh getprop sys.boot_completed)  enabled=$(sh pm list packages|wc -l)  disabled=$(sh pm list packages -d|wc -l)"
echo "  google pkgs left : $(sh pm list packages|grep -c 'package:com.google.')  (expect 3: packageinstaller + ext.services + ext.shared)"
sh pm list packages | grep 'package:com.google.' | sed 's/^/    /'
echo "  GMS enabled      : $(sh pm list packages|grep -c 'package:com.google.android.gms$')"
echo "  IME              : $(sh settings get secure default_input_method)"
echo "  HOME             : $(sh cmd package resolve-activity --brief -a android.intent.action.MAIN -c android.intent.category.HOME|tail -1)"
echo "  sanity EN        : sysui=$(sh pm list packages|grep -c 'package:com.android.systemui$') settings=$(sh pm list packages|grep -c 'package:com.android.settings$') phone=$(sh pm list packages|grep -c 'package:com.android.phone$') launcher=$(sh pm list packages|grep -c 'package:com.oppo.launcher$')"
echo "  removed.log      : $(wc -l <removed.log) pkgs   (restore all: bash restore.sh)"