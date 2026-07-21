#!/bin/bash
# ============================================================
#  DESKTOP HEADLESS SETUP — COMPLETE
#  Run this ON THE DESKTOP (via USB, Deskflow, or temp keyboard)
#  ==================================
#  - Diagnose random reboots
#  - Enable Wake-on-LAN (power on remotely from ThinkPad)
#  - Full Deskflow headless setup
#  - Auto-login, auto-start, auto-reconnect
# ============================================================

set -e

# ===================== CONFIGURATION =====================
USERNAME="uzer"
PASSWORD="nikomga3"
SERVER_IP="192.168.100.21"       # ThinkPad IP
SERVER_PORT="24800"
SCREEN_NAME=""                   # Leave empty to use hostname
AUTO_LOGIN=true
# =========================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

[ -z "$SCREEN_NAME" ] && SCREEN_NAME=$(hostname)

echo -e "${CYAN}============================================================${NC}"
echo -e "${CYAN}  ${BOLD}DESKTOP HEADLESS SETUP — COMPLETE${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""
echo -e "  User:          ${YELLOW}${USERNAME}${NC}"
echo -e "  Server:        ${YELLOW}${SERVER_IP}:${SERVER_PORT}${NC}"
echo -e "  Screen name:   ${YELLOW}${SCREEN_NAME}${NC}"
echo -e "  Auto-login:    ${YELLOW}${AUTO_LOGIN}${NC}"
echo ""
read -p "Continue? [y/N] " CONFIRM
[[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]] && echo "Aborted." && exit 1

# ============================================================
#  PART 1: DIAGNOSE RANDOM REBOOTS
# ============================================================
echo ""
echo -e "${CYAN}━━━ PART 1: Diagnose Random Reboots ━━━${NC}"

echo -e "${YELLOW}Checking for crash/reboot causes...${NC}"

# Check for kernel panics
echo -e "\n${GREEN}--- Kernel panics / oops ---${NC}"
dmesg | grep -iE "panic|oops|error|hardware error|mce" | tail -10 || echo "  None found in dmesg"

# Check for thermal throttling / overheat
echo -e "\n${GREEN}--- Thermal issues ---${NC}"
if [ -d /sys/class/thermal/thermal_zone0 ]; then
    for tz in /sys/class/thermal/thermal_zone*; do
        type=$(cat "$tz/type" 2>/dev/null)
        temp=$(cat "$tz/temp" 2>/dev/null)
        [ -n "$temp" ] && echo "  $type: $((temp/1000))°C"
    done
else
    echo "  No thermal zones found"
fi

# Check last shutdowns
echo -e "\n${GREEN}--- Recent shutdowns/reboots ---${NC}"
last -x shutdown reboot 2>/dev/null | head -10 || journalctl --list-boots | head -10

# Check if watchdog is causing reboots
echo -e "\n${GREEN}--- Watchdog ---${NC}"
if [ -e /dev/watchdog ]; then
    echo -e "  ${RED}Watchdog device found: /dev/watchdog${NC}"
    cat /proc/sys/kernel/watchdog 2>/dev/null && echo "  Watchdog is ENABLED" || true
else
    echo "  No hardware watchdog device"
fi

# Check for power state issues
echo -e "\n${GREEN}--- Power supply / ACPI ---${NC}"
dmesg | grep -iE "acpi|power|battery|voltage" | tail -5 || echo "  No power issues in logs"

# Check systemd failures
echo -e "\n${GREEN}--- Failed services ---${NC}"
systemctl --failed | head -15

# BIOS/firmware info
echo -e "\n${GREEN}--- BIOS/Firmware ---${NC}"
dmidecode -s bios-version 2>/dev/null || echo "  (need root for dmidecode)"
cat /sys/devices/virtual/dmi/id/board_vendor 2>/dev/null
cat /sys/devices/virtual/dmi/id/board_name 2>/dev/null

# Check for OOM killer
echo -e "\n${GREEN}--- OOM kills ---${NC}"
dmesg | grep -i "out of memory\|oom-killer\|killed process" | tail -5 || echo "  None"

# Check disk health
echo -e "\n${GREEN}--- Disk health ---${NC}"
for disk in $(lsblk -d -n -o NAME | grep -E "^sd|^vd|^nvme"); do
    echo "  /dev/$disk:"
    smartctl -H "/dev/$disk" 2>/dev/null || echo "    (smartctl not available)"
done

echo ""
echo -e "${YELLOW}If random reboots continue, check:${NC}"
echo -e "  1. ${YELLOW}Power supply${NC} — bad PSU causes random reboots"
echo -e "  2. ${YELLOW}RAM${NC} — run: memtest86+"
echo -e "  3. ${YELLOW}Overheating${NC} — check CPU temps under load"
echo -e "  4. ${YELLOW}BIOS update${NC} — check vendor for firmware updates"
echo ""
read -p "Continue to WoL + Deskflow setup? [y/N] " CONFIRM2
[[ "$CONFIRM2" != "y" && "$CONFIRM2" != "Y" ]] && echo "Stopped." && exit 0

# ============================================================
#  PART 2: WAKE-ON-LAN
# ============================================================
echo ""
echo -e "${CYAN}━━━ PART 2: Wake-on-LAN Setup ━━━${NC}"

# Find the network interface
IFACE=$(ip route | grep default | awk '{print $5}' | head -1)
[ -z "$IFACE" ] && IFACE=$(ip link | awk -F: '/state UP/{print $2}' | head -1 | tr -d ' ')
echo -e "Network interface: ${YELLOW}${IFACE}${NC}"

# Get MAC address
MAC=$(cat /sys/class/net/$IFACE/address 2>/dev/null)
echo -e "MAC address: ${YELLOW}${MAC}${NC}"

# Enable WoL
echo -e "${GREEN}Enabling Wake-on-LAN on ${IFACE}...${NC}"
ethtool -s "$IFACE" wol g 2>/dev/null || echo "  ethtool not available, trying alternative..."

# Check if WoL is supported
echo -e "\n${GREEN}WoL capabilities:${NC}"
ethtool "$IFACE" 2>/dev/null | grep -i wake || echo "  (ethtool not available)"

# Make WoL persistent across reboots — networkd or NetworkManager
echo -e "${GREEN}Making WoL persistent...${NC}"

# Method 1: NetworkManager
if command -v nmcli &>/dev/null; then
    NM_CONN=$(nmcli -g GENERAL.CONNECTION dev show "$IFACE" 2>/dev/null | head -1)
    if [ -n "$NM_CONN" ]; then
        nmcli connection modify "$NM_CONN" 802-3-ethernet.wake-on-lan magic 2>/dev/null && echo "  NetworkManager WoL enabled for '$NM_CONN'" || true
    fi
fi

# Method 2: systemd link file (fallback)
mkdir -p /etc/systemd/network
cat > /etc/systemd/network/50-wired.link << WOLEOF
[Match]
OriginalName=$IFACE

[Link]
WakeOnLan=magic
WOLEOF
echo "  Created /etc/systemd/network/50-wired.link"

# Method 3: systemd service to enable WoL at boot (belt & suspenders)
cat > /etc/systemd/system/wol-enable.service << WOLSVC
[Unit]
Description=Enable Wake-on-LAN
After=network.target

[Service]
Type=oneshot
ExecStart=/sbin/ethtool -s $IFACE wol g

[Install]
WantedBy=multi-user.target
WOLSVC
systemctl daemon-reload
systemctl enable wol-enable.service
echo "  Created wol-enable.service"

# Disable fast startup / hibernation that breaks WoL
echo -e "${GREEN}Disabling features that break WoL...${NC}"

# Disable PCIe ASPM power savings (can break WoL)
mkdir -p /etc/tmpfiles.d
echo "w /sys/module/pcie_aspm/parameters/policy - - - - performance" > /etc/tmpfiles.d/pcie-aspm.conf 2>/dev/null || true

# GRUB: disable fast boot, enable WoL
if [ -f /etc/default/grub ]; then
    echo -e "${GREEN}Updating GRUB for WoL compatibility...${NC}"
    # Check if GRUB_CMDLINE_LINUX already exists
    if grep -q "^GRUB_CMDLINE_LINUX=" /etc/default/grub; then
        sed -i 's/^GRUB_CMDLINE_LINUX="\(.*\)"/GRUB_CMDLINE_LINUX="\1 pcie_aspm=off"/' /etc/default/grub
    else
        echo 'GRUB_CMDLINE_LINUX="pcie_aspm=off"' >> /etc/default/grub
    fi
    # Update grub
    if [ -f /boot/grub/grub.cfg ]; then
        update-grub 2>/dev/null || grub-mkconfig -o /boot/grub/grub.cfg 2>/dev/null || true
    elif [ -f /boot/grub2/grub.cfg ]; then
        grub2-mkconfig -o /boot/grub2/grub.cfg 2>/dev/null || true
    fi
fi

# Print WoL info for the ThinkPad
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Wake-on-LAN is ENABLED${NC}"
echo -e ""
echo -e "  To wake this desktop from the ThinkPad, run:"
echo -e "    ${BOLD}wakeonlan ${MAC}${NC}"
echo -e ""
echo -e "  Or from this Kali machine:"
echo -e "    ${BOLD}etherwake -i ${IFACE} ${MAC}${NC}"
echo -e ""
echo -e "  MAC: ${YELLOW}${MAC}${NC}  Interface: ${YELLOW}${IFACE}${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ============================================================
#  PART 3: DESKFLOW HEADLESS SETUP
# ============================================================
echo -e "${CYAN}━━━ PART 3: Deskflow Headless Setup ━━━${NC}"

# Create user
echo -e "${GREEN}[1/7] Creating user ${USERNAME}...${NC}"
if id "$USERNAME" &>/dev/null; then
    echo "  User already exists, setting password..."
else
    useradd -m -s /bin/bash "$USERNAME"
fi
echo "$USERNAME:$PASSWORD" | chpasswd
usermod -aG sudo "$USERNAME" 2>/dev/null || usermod -aG wheel "$USERNAME" 2>/dev/null || true
groupadd -r autologin 2>/dev/null || true
usermod -aG autologin "$USERNAME"

# Install Deskflow
echo -e "${GREEN}[2/7] Installing Deskflow...${NC}"
if command -v apt &>/dev/null; then
    apt update -qq
    apt install -y deskflow
elif command -v dnf &>/dev/null; then
    dnf install -y deskflow
elif command -v pacman &>/dev/null; then
    pacman -S --noconfirm deskflow
else
    echo -e "${RED}Install Deskflow manually and re-run.${NC}"
    exit 1
fi

# Config for root (login screen)
echo -e "${GREEN}[3/7] Configuring Deskflow (root/greeter)...${NC}"
mkdir -p /root/.config/Deskflow/tls

if [ ! -f /root/.config/Deskflow/tls/deskflow.pem ]; then
    openssl req -x509 -nodes -days 3650 \
        -newkey rsa:2048 \
        -keyout /root/.config/Deskflow/tls/deskflow-key.pem \
        -out /root/.config/Deskflow/tls/deskflow.pem \
        -subj "/CN=Deskflow" 2>/dev/null
fi

cat > /root/.config/Deskflow/tls/trusted-servers << 'TLSEOF'
v2:sha256:0c5e65830772866a36f22b73e080a290a14987d11d31c4c9f8485ee8b9d99720
TLSEOF

cat > /root/.config/Deskflow/Deskflow.conf << CONFEOF
[client]
remoteHost=${SERVER_IP}

[core]
computerName=${SCREEN_NAME}
coreMode=1

[gui]
closeReminder=false
enableUpdateCheck=false
startCoreWithGui=true

[internalConfig]
clipboardSharing=true
clipboardSharingSize=@Variant(\0\0\0\x84\0\0\0\0\0\0\f\0)
defaultLockToScreenState=false
disableLockToScreen=false
hasHeartbeat=false
hasSwitchDelay=false
hasSwitchDoubleTap=false
heartbeat=5000
hotkeys\size=0
numColumns=5
numRows=3
protocol=1
relativeMouseMoves=false
screens\size=0
switchCornerArray\size=0
switchCornerSize=0
switchDelay=250
switchDoubleTap=250
win32KeepForeground=false
CONFEOF

# Config for user session
echo -e "${GREEN}[4/7] Configuring Deskflow (user session)...${NC}"
USER_HOME=$(eval echo "~${USERNAME}")
mkdir -p "${USER_HOME}/.config/Deskflow/tls"

if [ ! -f "${USER_HOME}/.config/Deskflow/tls/deskflow.pem" ]; then
    openssl req -x509 -nodes -days 3650 \
        -newkey rsa:2048 \
        -keyout "${USER_HOME}/.config/Deskflow/tls/deskflow-key.pem" \
        -out "${USER_HOME}/.config/Deskflow/tls/deskflow.pem" \
        -subj "/CN=Deskflow" 2>/dev/null
fi

cat > "${USER_HOME}/.config/Deskflow/tls/trusted-servers" << 'TLSEOF'
v2:sha256:0c5e65830772866a36f22b73e080a290a14987d11d31c4c9f8485ee8b9d99720
TLSEOF

cat > "${USER_HOME}/.config/Deskflow/Deskflow.conf" << CONFEOF
[client]
remoteHost=${SERVER_IP}

[core]
computerName=${SCREEN_NAME}
coreMode=1

[gui]
closeReminder=false
enableUpdateCheck=false
logExpanded=false
shownFirstConnectedMessage=true
startCoreWithGui=true

[internalConfig]
clipboardSharing=true
clipboardSharingSize=@Variant(\0\0\0\x84\0\0\0\0\0\0\f\0)
defaultLockToScreenState=false
disableLockToScreen=false
hasHeartbeat=false
hasSwitchDelay=false
hasSwitchDoubleTap=false
heartbeat=5000
hotkeys\size=0
numColumns=5
numRows=3
protocol=1
relativeMouseMoves=false
screens\size=0
switchCornerArray\size=0
switchCornerSize=0
switchDelay=250
switchDoubleTap=250
win32KeepForeground=false
CONFEOF

chown -R "${USERNAME}:${USERNAME}" "${USER_HOME}/.config"

# Greeter service
echo -e "${GREEN}[5/7] Creating greeter service (login screen)...${NC}"

if systemctl is-active lightdm.service &>/dev/null; then
    DM="lightdm.service"
    XAUTH="/var/run/lightdm/root/:0"
elif systemctl is-active gdm.service &>/dev/null; then
    DM="gdm.service"
    XAUTH="/run/gdm/Xauthority"
elif systemctl is-active sddm.service &>/dev/null; then
    DM="sddm.service"
    XAUTH="/var/lib/sddm/.Xauthority"
else
    DM="display-manager.service"
    XAUTH="/var/run/lightdm/root/:0"
fi

cat > /etc/systemd/system/deskflow-greeter.service << SVCEOF
[Unit]
Description=Deskflow client at login screen (auto-reconnect)
After=${DM} network-online.target
Wants=${DM} network-online.target

[Service]
Type=simple
Environment=DISPLAY=:0
Environment=XAUTHORITY=${XAUTH}
Environment=HOME=/root
ExecStartPre=/bin/sleep 5
ExecStart=/usr/bin/deskflow-core client
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
SVCEOF

# User service
echo -e "${GREEN}[6/7] Creating user service (after login)...${NC}"
mkdir -p "${USER_HOME}/.config/systemd/user"

cat > "${USER_HOME}/.config/systemd/user/deskflow-client.service" << USVSCEOF
[Unit]
Description=Deskflow client — auto-reconnect to ThinkPad server (${SERVER_IP}:${SERVER_PORT})
Documentation=man:deskflow-core
After=graphical-session.target

[Service]
Type=simple
Environment=DISPLAY=:0.0
Environment=XAUTHORITY=%h/.Xauthority
Environment=XDG_RUNTIME_DIR=/run/user/%U
ExecStartPre=/usr/bin/systemctl stop deskflow-greeter.service
ExecStart=/usr/bin/deskflow-core client
Restart=always
RestartSec=3
TimeoutStopSec=5

[Install]
WantedBy=default.target
USVSCEOF

chown -R "${USERNAME}:${USERNAME}" "${USER_HOME}/.config/systemd"

# Enable everything
echo -e "${GREEN}[7/7] Enabling all services...${NC}"

systemctl daemon-reload
systemctl enable deskflow-greeter.service
systemctl enable wol-enable.service
systemctl enable NetworkManager-wait-online.service 2>/dev/null || true
sudo -u "$USERNAME" XDG_RUNTIME_DIR="/run/user/$(id -u $USERNAME)" systemctl --user enable deskflow-client.service 2>/dev/null || true

# Auto-login
if [ "$AUTO_LOGIN" = true ]; then
    echo -e "${GREEN}Enabling auto-login for ${USERNAME}...${NC}"
    if [ -f /etc/lightdm/lightdm.conf ]; then
        sed -i "s/^#autologin-user=.*/autologin-user=${USERNAME}/" /etc/lightdm/lightdm.conf
        sed -i "s/^#autologin-user-timeout=.*/autologin-user-timeout=0/" /etc/lightdm/lightdm.conf
        if ! grep -q "^autologin-user=" /etc/lightdm/lightdm.conf; then
            sed -i "/^\[Seat:\*\]/a autologin-user=${USERNAME}\nautologin-user-timeout=0" /etc/lightdm/lightdm.conf
        fi
    elif [ -f /etc/gdm/custom.conf ]; then
        sed -i "s/^#AutomaticLogin=.*/AutomaticLogin=${USERNAME}/" /etc/gdm/custom.conf
        sed -i "s/^#AutomaticLoginEnable=.*/AutomaticLoginEnable=True/" /etc/gdm/custom.conf
    elif [ -f /etc/sddm.conf ]; then
        cat >> /etc/sddm.conf << SDDMEOF
[Autologin]
User=${USERNAME}
Session=
SDDMEOF
    fi
fi

# Start greeter now
systemctl start deskflow-greeter.service || true

echo ""
echo -e "${CYAN}============================================================${NC}"
echo -e "${GREEN}  ${BOLD}✅  COMPLETE SETUP DONE${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""
echo -e "  Boot flow:"
echo -e "    1. ${YELLOW}Power on${NC} (Wake-on-LAN or power button)"
echo -e "    2. ${YELLOW}Network connects${NC} (auto)"
echo -e "    3. ${YELLOW}Deskflow connects to ThinkPad${NC}"
if [ "$AUTO_LOGIN" = true ]; then
echo -e "    4. ${YELLOW}Auto-login as ${USERNAME}${NC} (no password needed)"
else
echo -e "    4. ${YELLOW}Type password from ThinkPad${NC}"
fi
echo -e "    5. ${YELLOW}Desktop session — ThinkPad controls everything${NC}"
echo ""
echo -e "  Wake from ThinkPad:"
echo -e "    ${BOLD}wakeonlan ${MAC}${NC}"
echo -e ""
echo -e "  Troubleshooting reboots — check:"
echo -e "    ${CYAN}dmesg | grep -iE 'panic|error|mce|thermal'${NC}"
echo -e "    ${CYAN}journalctl -b -1 | tail -50${NC}  (previous boot)"
echo -e "    ${CYAN}sensors${NC}  (if lm-sensors installed)"
echo -e "    ${CYAN}smartctl -a /dev/sdX${NC}  (disk health)"
echo ""