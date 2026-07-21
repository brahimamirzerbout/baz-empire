#!/bin/bash
# ============================================================
# Deskflow Client Setup — Boot-to-Login Keyboard/Mouse Sharing
# ============================================================
# Run this on a NEW machine that has NO keyboard/mouse.
# It installs Deskflow, configures it as a client, and sets up
# a system service so you can type the login password from the
# server (ThinkPad) from the very first boot screen.
#
# Usage:
#   1. Boot the new machine with a LIVE USB (or temporary keyboard)
#   2. Copy this script to it
#   3. Edit the variables below
#   4. Run:  sudo bash deskflow-setup.sh
#
# After setup, remove the keyboard/mouse — the machine will
# connect to the Deskflow server at boot automatically.
# ============================================================

set -e

# ===================== CONFIGURATION =====================
SERVER_IP="192.168.100.21"        # IP of the Deskflow SERVER (ThinkPad)
SERVER_PORT="24800"                # Deskflow port (default 24800)
SCREEN_NAME=""                     # Leave empty to use hostname, or set e.g. "kali"
# =========================================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}============================================================${NC}"
echo -e "${CYAN}  Deskflow Client Setup — Boot-to-Login Sharing${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""

# Detect hostname
[ -z "$SCREEN_NAME" ] && SCREEN_NAME=$(hostname)
echo -e "${YELLOW}Screen name:${NC} $SCREEN_NAME"
echo -e "${YELLOW}Server:${NC} $SERVER_IP:$SERVER_PORT"
echo ""

# ---- Step 1: Install Deskflow ----
echo -e "${GREEN}[1/6] Installing Deskflow...${NC}"
if command -v apt &>/dev/null; then
    apt update
    apt install -y deskflow
elif command -v dnf &>/dev/null; then
    dnf install -y deskflow
elif command -v pacman &>/dev/null; then
    pacman -S --noconfirm deskflow
elif command -v flatpak &>/dev/null; then
    flatpak install -y flathub org.deskflow.deskflow
else
    echo -e "${RED}No supported package manager found. Install Deskflow manually.${NC}"
    exit 1
fi

# ---- Step 2: Create config directory ----
echo -e "${GREEN}[2/6] Creating config for root (login screen)...${NC}"
mkdir -p /root/.config/Deskflow/tls

# ---- Step 3: Generate TLS certificate ----
echo -e "${GREEN}[3/6] Generating TLS certificate...${NC}"
if [ ! -f /root/.config/Deskflow/tls/deskflow.pem ]; then
    openssl req -x509 -nodes -days 365 \
        -newkey rsa:2048 \
        -keyout /root/.config/Deskflow/tls/deskflow-key.pem \
        -out /root/.config/Deskflow/tls/deskflow.pem \
        -subj "/CN=Deskflow" 2>/dev/null
fi

# ---- Step 4: Write config ----
echo -e "${GREEN}[4/6] Writing Deskflow config...${NC}"
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

# ---- Step 5: Create system service (login screen) ----
echo -e "${GREEN}[5/6] Creating system service for login screen...${NC}"

# Detect display manager
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
    echo -e "${YELLOW}Warning: Could not detect display manager, using default: $DM${NC}"
fi

echo -e "${YELLOW}  Display manager:${NC} $DM"
echo -e "${YELLOW}  Xauthority:${NC} $XAUTH"

cat > /etc/systemd/system/deskflow-greeter.service << SVCEOF
[Unit]
Description=Deskflow client at login screen (auto-reconnect)
After=$DM network-online.target
Wants=$DM network-online.target

[Service]
Type=simple
Environment=DISPLAY=:0
Environment=XAUTHORITY=$XAUTH
Environment=HOME=/root
ExecStartPre=/bin/sleep 5
ExecStart=/usr/bin/deskflow-core client
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
SVCEOF

# ---- Step 6: Enable services ----
echo -e "${GREEN}[6/6] Enabling services...${NC}"
systemctl daemon-reload
systemctl enable deskflow-greeter.service
systemctl enable NetworkManager-wait-online.service 2>/dev/null || true

# Start it now if display is up
if [ -f "$XAUTH" ] || [ -f /var/run/lightdm/root/:0 ]; then
    systemctl start deskflow-greeter.service || true
fi

echo ""
echo -e "${CYAN}============================================================${NC}"
echo -e "${GREEN}  ✅  SETUP COMPLETE${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""
echo -e "  Deskflow will connect to ${YELLOW}${SERVER_IP}:${SERVER_PORT}${NC} at boot."
echo -e "  You can type the login password from the ThinkPad."
echo ""
echo -e "  Useful commands:"
echo -e "    ${YELLOW}systemctl status deskflow-greeter${NC}   Check login-screen service"
echo -e "    ${YELLOW}systemctl restart deskflow-greeter${NC}  Restart it"
echo -e "    ${YELLOW}journalctl -u deskflow-greeter -f${NC}    Watch logs"
echo ""
echo -e "  Config files:"
echo -e "    ${YELLOW}/root/.config/Deskflow/Deskflow.conf${NC}  (greeter/root)"
echo -e "    ${YELLOW}/etc/systemd/system/deskflow-greeter.service${NC}"
echo ""
echo -e "${RED}  IMPORTANT: On the SERVER (ThinkPad), make sure this${NC}"
echo -e "${RED}  machine's screen name \"${SCREEN_NAME}\" is added to the${NC}"
echo -e "${RED}  server's screen layout configuration.${NC}"
echo ""