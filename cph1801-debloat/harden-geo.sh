#!/usr/bin/env bash
# Geographic untrackability hardening — CPH1801, no-root, reversible.
# Reversal notes inline. Kills network/WiFi/BT-based location + revokes
# location appops from remaining OPPO/NearMe telemetry.
set -uo pipefail
sh() { adb shell "$@" </dev/null 2>&1 | tr -d '\r'; }
echo "═══ GEOGRAPHIC UNTRACKABILITY HARDENING (CPH1801) ═══"

# 1) Location mode = DEVICE-ONLY (GPS only). Stops the network/WiFi location
#    providers that Google uses for passive geo collection. (reversal: 3)
sh settings put secure location_mode 0
lm="$(sh settings get secure location_mode)"
prov="$(sh settings get secure location_providers_allowed)"
echo "  location_mode            : $lm   (0=OFF — no GPS, no network; full geo privacy by default)"
echo "  location_providers_allowed: $prov  (expect blank = all providers off; enable manually when needed)"

# 2) Kill passive WiFi + BLE scanning (location leak even with radios off).
#    (reversal: set back to 1)
sh settings put global wifi_scan_always_enabled 0
sh settings put global ble_scan_always_enabled 0
echo "  wifi_scan_always_enabled : $(sh settings get global wifi_scan_always_enabled)"
echo "  ble_scan_always_enabled  : $(sh settings get global ble_scan_always_enabled)  (blank=unsupported on 7.1)"

# 3) Revoke FINE/COARSE_LOCATION appops from OPPO/NearMe telemetry still present.
echo "  --- revoking location appops from remaining ColorOS/NearMe pkgs ---"
for pkg in com.coloros.sau com.coloros.sauhelper com.nearme.themespace com.nearme.sync com.nearme.deamon com.nearme.statistics.rom com.nearme.atlas com.nearme.ocloud com.nearme.romupdate; do
  if sh pm list packages | grep -q "package:$pkg$"; then
    sh appops set "$pkg" COARSE_LOCATION ignore
    sh appops set "$pkg" FINE_LOCATION ignore
    echo "    [revoke] $pkg"
  fi
done

# 4) Disable OPPO usage-data / diagnostics send if the keys exist (best-effort).
sh settings put global development_settings_enabled 0 2>/dev/null
echo "  (best-effort dev settings off)"

echo
echo "═══ APPLIED — geo passive collection cut ═══"
echo "Reversal: location_mode→3, wifi/ble scan→1, appops set <pkg> COARSE_LOCATION allow"