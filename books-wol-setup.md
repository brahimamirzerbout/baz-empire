# books (192.168.100.12, 2GB) — Wake-on-LAN setup
Run AT books' physical console. WoL cannot be enabled remotely.

## 0. Resolve first (blocks everything)
- **Cable books to the switch/router (WIRED).** WoL does NOT work over WiFi — a sleeping
  WiFi NIC cannot hold an association. The sender (ThinkPad, 192.168.100.21) can stay on WiFi.
- **Confirm books is x86 (PC/laptop), not an SBC/Pi.** Pi/SBC "off" state + WoL mechanics
  differ (no BIOS; wake via GPIO/USB-pwr, not magic-packet-to-S5). Tell me which it is.
- **Plug to AC (not battery)** if books is a laptop — WoL is usually disabled on battery.

## 1. BIOS / UEFI
- Enable: **Wake on LAN** / "Power On by PCI-E/PCI" / "Resume by LAN" / "Wake on PME".
- **Disable: ErP / EuP Ready, Deep Sleep, Fast Boot** (these cut standby power to the NIC).
- If BIOS offers "Wake on LAN from S5" — enable it (this is what lets a FULLY-POWERED-OFF
  box wake; without it, you only get suspend/hibernate wake).

## 2. OS / driver (on the WIRED iface, e.g. enp1s0 / eth0)
```bash
IFACE=enp1s0                       # use books' wired iface name
sudo ethtool $IFACE | grep -iE 'Supports Wake-on|Wake-on'   # Supports must list 'g'
sudo ethtool -s $IFACE wol g        # enable magic-packet wake
ethtool $IFACE | grep Wake-on       # confirm Wake-on: g
cat /sys/class/net/$IFACE/address   # THIS is the MAC to wake — confirm vs 88:82:79:05:2D:6C
```
- If `Supports Wake-on` does NOT contain `g`, that NIC can't do WoL — use a different NIC /
  a USB ethernet adapter that advertises WoL.

## 3. Persist across boot (else it resets on reboot)
```bash
# NetworkManager:
nmcli con modify "Wired connection 1" 802-3-ethernet.wake-on-lan magic
# or systemd .link: /etc/systemd/network/10-books.link → [Link] WakeOnLan=magic
# or udev rule echoing 'g' > /sys/class/net/$IFACE/device/power/wakeup
```

## 4. Send it to sleep/off, then wake from the ThinkPad
```bash
# on books:
sudo systemctl suspend            # test S3 first (most reliable)
#   → from ThinkPad:  wake-books          # should wake it
# once S3 works, test full off:
sudo systemctl poweroff           # S5 wake — only if BIOS "wake from S5" is on
#   → from ThinkPad:  wake-books
```

## 5. Confirm the MAC observed from the ThinkPad
ThinkPad ARP saw books as 88:82:79:05:2D:6C on 2026-07-16.
If books was on WiFi at the time, that's the WiFi MAC (useless for WoL) — after cabling,
run `wake-books` is correct only if books' WIRED NIC MAC == 88:82:79:05:2D:6C.
Re-check books' wired MAC with step 2's `cat /sys/class/net/$IFACE/address` and update
~/.local/bin/wake-books if different.

## Sender-side (already done on ThinkPad 192.168.100.21)
- one-word command: wake-books  (script at ~/.local/bin/wake-books)
- needs: sudo apt-get install -y wakeonlan etherwake   (one-time; wakeonlan fires w/o root)
