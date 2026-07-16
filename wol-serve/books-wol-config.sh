#!/bin/bash
# books WoL config — run AT books console as:  curl -s http://192.168.100.21:8000/books-wol-config.sh | sudo bash
# Safe: no reboot, no poweroff. Auto-detects wired NIC, enables WoL, persists, reports.
set -u
echo "=== books identity ==="; hostname; (. /etc/os-release 2>/dev/null && echo "$PRETTY_NAME") || echo "(os-release n/a)"; uname -r
command -v ethtool >/dev/null 2>&1 || apt-get install -y ethtool

echo "=== all ifaces (wired = no wireless dir) ==="
WIRED=""
for i in /sys/class/net/*; do
  iface=${i##*/}; [ "$iface" = lo ] && continue
  wl=no; [ -e "$i/wireless" ] && wl=yes
  mac=$(cat "$i/address" 2>/dev/null); car=$(cat "$i/carrier" 2>/dev/null || echo 0)
  echo "  $iface  wireless=$wl  carrier=$car  mac=$mac"
  [ "$wl" = no ] && [ "$car" = 1 ] && WIRED="$WIRED $iface"
done
echo "WIRED+carrier-up:${WIRED:-  NONE — cable books to the switch first}"

for IFACE in $WIRED; do
  echo "=== $IFACE — WoL support (before) ==="
  ethtool "$IFACE" 2>/dev/null | grep -iE 'Supports Wake-on|Wake-on:' || { echo "  ethtool can't read $IFACE"; continue; }
  sup=$(ethtool "$IFACE" 2>/dev/null | awk -F': ' '/Supports Wake-on/{print $2}')
  case "$sup" in *g*) ;; *) echo "  !! $IFACE does NOT support magic-packet (g) — WoL impossible on this NIC."; continue ;; esac
  if ethtool -s "$IFACE" wol g 2>/dev/null; then echo "  enabled: ethtool -s $IFACE wol g"; else echo "  !! ethtool -s failed (driver refused)"; fi
  echo "  WoL (after):"; ethtool "$IFACE" 2>/dev/null | grep -i 'Wake-on:'
  MAC=$(cat /sys/class/net/$IFACE/address)
  if command -v nmcli >/dev/null 2>&1 && systemctl is-active --quiet NetworkManager 2>/dev/null; then
    CON=$(nmcli -t -f NAME,DEVICE con show --active 2>/dev/null | grep ":$IFACE$" | cut -d: -f1 | head -1)
    [ -n "$CON" ] && nmcli con modify "$CON" 802-3-ethernet.wake-on-lan magic 2>/dev/null && echo "  persisted via nmcli ($CON)"
  fi
  if ! command -v nmcli >/dev/null 2>&1 || ! systemctl is-active --quiet NetworkManager 2>/dev/null; then
    mkdir -p /etc/systemd/network
    cat >/etc/systemd/network/10-wol.link <<EOF
[Match]
MACAddress=$MAC
[Link]
WakeOnLan=magic
EOF
    echo "  persisted via /etc/systemd/network/10-wol.link (MAC=$MAC) — needs systemd-networkd renderer"
  fi
  echo "  >>> $IFACE  MAC=$MAC   (ThinkPad earlier saw 88:82:79:05:2D:6C)"
done

echo "=== sshd state ==="; systemctl is-enabled ssh 2>/dev/null; systemctl is-active ssh 2>/dev/null
echo "=== OPTIONAL remote-takeover (uncomment to let the ThinkPad SSH in hereafter + fix rsync) ==="
echo "  # systemctl enable --now ssh"
echo "  # U=uzer; mkdir -p /home/\$U/.ssh; echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFA9FwBi4RRYZ4cmANu0DV02i+kPLlfCen5U+gz7GfDT uzer@debian' >> /home/\$U/.ssh/authorized_keys; chmod 700 /home/\$U/.ssh; chmod 600 /home/\$U/.ssh/authorized_keys; sort -u /home/\$U/.ssh/authorized_keys -o /home/\$U/.ssh/authorized_keys"
echo "=== DONE — paste me back: each 'Supports Wake-on' + 'Wake-on:' line and the wired MAC. ==="
