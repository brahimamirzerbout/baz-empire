#!/usr/bin/env bash
set -uo pipefail
cd /home/uzer/cph1801-debloat
sh() { adb shell "$@" </dev/null 2>&1 | tr -d '\r'; }

echo "════════ 1. DISABLE OPPO APK-VERIFICATION (try to stop the auto-purge) ════════"
echo "  before: HK=$(sh pm path org.pocketworkstation.pckeyboard | tr -d '\n')  OL=$(sh pm path com.benny.openlauncher | tr -d '\n')"
sh settings put global upload_apk_enable 0
sh settings put global package_verifier_enable 0
sh settings put global verifier_verify_adb_installs 0
sh settings put secure install_non_market_apps 1 2>/dev/null
echo "  upload_apk_enable=$(sh settings get global upload_apk_enable)  install_non_market_apps=$(sh settings get secure install_non_market_apps)  verifier=$(sh settings get global package_verifier_enable)"

echo
echo "════════ 2. RE-INSTALL HK + OpenLauncher, wait 15s, recheck ════════"
adb install -r HackersKeyboard.apk 2>&1 | tail -1
adb install -r OpenLauncher.apk 2>&1 | tail -1
sleep 15
HKOK=0; OLOK=0
sh pm path org.pocketworkstation.pckeyboard | grep -q base.apk && HKOK=1
sh pm path com.benny.openlauncher | grep -q base.apk && OLOK=1
echo "  after 15s: HK persisted=$HKOK  OpenLauncher persisted=$OLOK"

echo
echo "════════ 3. KEYBOARD SWAP (only if HK persisted) ════════"
if [ "$HKOK" = 1 ]; then
  HK="org.pocketworkstation.pckeyboard/.LatinIME"
  sh ime enable "$HK" >/dev/null; sh ime set "$HK" >/dev/null
  cur="$(sh settings get secure default_input_method)"
  echo "  default_input_method: $cur"
  if [ "$cur" = "org.pocketworkstation.pckeyboard/.LatinIME" ]; then
    echo "  [OK] Hacker's Keyboard default — purging TouchPal + Swype + add-ons"
    for p in com.emoji.keyboard.touchpal com.nuance.swype.oppo; do
      echo "    $p -> $(sh pm uninstall --user 0 "$p")"; echo "$p">>removed.log
    done
    sh pm list packages com.cootek | sed 's/package://' | while IFS= read -r p; do
      [ -n "$p" ] && { echo "    $p -> $(sh pm uninstall --user 0 "$p")"; echo "$p">>removed.log; }
    done
  else
    echo "  [!] HK installed but not settable as default ('$cur'). TouchPal kept."
  fi
else
  echo "  [!] HK auto-purged AGAIN despite verification off → ColorOS Safe Center is the wall."
  echo "      ROOT needed to freeze com.coloros.safecenter/oppoguardelf verification."
fi

echo
echo "════════ 4. LAUNCHER SWAP (only if OpenLauncher persisted) ════════"
if [ "$OLOK" = 1 ]; then
  OL="com.benny.openlauncher/com.benny.openlauncher.activity.HomeActivity"
  r="$(sh cmd package set-home-activity "$OL")"
  echo "  set-home-activity -> $r"
  if echo "$r" | grep -qi success; then
    d="$(sh pm disable-user --user 0 com.oppo.launcher)"
    echo "  disable com.oppo.launcher -> $d"
    case "$d" in *disabled-user*) echo "  [OK] OPPO launcher disabled, OpenLauncher is home";;
      *) echo "  fallback uninstall -> $(sh pm uninstall --user 0 com.oppo.launcher)";; esac
    sh input keyevent KEYCODE_WAKEUP >/dev/null; sh am start -n "$OL" >/dev/null
  else
    echo "  [!] set-home-activity failed ('$r'). OPPO launcher kept (no black screen)."
  fi
else
  echo "  [!] OpenLauncher auto-purged again. ROOT needed. OPPO launcher still default (safe)."
fi

echo
echo "════════ 5. PURGE ALL GOOGLE APPS (keep only system modules: packageinstaller, ext.services, ext.shared) ════════"
GPKGS="$(sh pm list packages | sed 's/package://' | grep -E '^com\.google\.|^com\.android\.(vending|chrome)$' | grep -vE 'packageinstaller|ext\.services|ext\.shared')"
GPKGS="$(printf '%s\n' "$GPKGS"; echo com.google.android.webview)"
echo "  purging $(echo "$GPKGS" | grep -c .) google pkgs:"
echo "$GPKGS" | while IFS= read -r p; do
  [ -z "$p" ] && continue
  present=0
  sh pm list packages | grep -q "package:$p$" && present=1
  sh pm list packages -d | grep -q "package:$p$" && present=1
  if [ "$present" = 1 ]; then
    o="$(sh pm uninstall --user 0 "$p" 2>/dev/null)"
    printf "    %-45s -> %s\n" "$p" "$o"; echo "$p">>removed.log
  fi
done
echo "  --- user-installed google (full remove) ---"
for p in com.google.android.music com.google.android.apps.docs com.google.android.videos com.google.android.apps.photos; do
  sh pm list packages | grep -q "package:$p$" && { echo "    $p -> $(sh pm uninstall --user 0 "$p")"; echo "$p">>removed.log; }
done

echo
echo "════════ 6. FINAL STATE ════════"
echo "  device        : $(sh getprop ro.product.model) Android $(sh getprop ro.build.version.release) boot=$(sh getprop sys.boot_completed)"
echo "  packages      : enabled=$(sh pm list packages | wc -l)  disabled=$(sh pm list packages -d | wc -l)"
echo "  com.google.* still enabled : $(sh pm list packages | grep -c 'package:com.google.')"
sh pm list packages | grep 'package:com.google.' | sed 's/^/    /'
echo "  default IME   : $(sh settings get secure default_input_method)"
echo "  HOME default  : $(sh cmd package resolve-activity --brief -a android.intent.action.MAIN -c android.intent.category.HOME | tail -1)"
echo "  location_mode : $(sh settings get secure location_mode)  upload_apk: $(sh settings get global upload_apk_enable)"
echo "  --- sanity (phone must stay alive) ---"
for p in com.android.systemui com.android.settings com.android.phone com.oppo.launcher com.emoji.keyboard.touchpal com.benny.openlauncher org.pocketworkstation.pckeyboard com.google.android.packageinstaller com.google.android.ext.services; do
  en="$(sh pm list packages | grep -c "package:$p$")"; ds="$(sh pm list packages -d | grep -c "package:$p$")"
  [ "$en" = 1 ] && echo "    [EN]   $p" || { [ "$ds" = 1 ] && echo "    [DIS]  $p" || echo "    [gone] $p"; }
done
echo "  removed.log : $(wc -l <removed.log) pkgs  (restore everything: bash restore.sh)"
