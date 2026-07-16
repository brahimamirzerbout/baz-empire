#!/usr/bin/env bash
# BAZ deskflow-recover — wire remote `books` (192.168.100.12) as a Deskflow client
# driven by THIS box (debian, 192.168.100.21:24800, TLS on).
#
# PREREQ: sshd must already be reachable on the remote. Do the one-time USB-keyboard
# bootstrap on the remote first:
#     sudo systemctl enable --now ssh
# Then run THIS script from the ThinkPad:
#     ~/deskflow-recover/deploy-to-books.sh
#
# What it does (all over SSH):
#   1. preflight SSH to books
#   2. ensure deskflow installed on remote
#   3. seed remote trusted-servers with this server's fingerprint (no trust prompt)
#   4. enable lingering so the user service survives logout/reboot
#   5. install a systemd --user deskflow-client service (WantedBy=graphical-session)
#   6. start it now (graphical session must be active on the remote)
#   7. back-fill this server's trusted-clients with the remote's fingerprint
#   8. verify the client is connected on the server side
set -euo pipefail

REMOTE="${REMOTE:-books}"
SERVER_IP="${SERVER_IP:-192.168.100.21}"
PORT="${PORT:-24800}"
SCREEN="${SCREEN:-kali}"          # MUST match the screen name in this box's deskflow-server.conf
HERE="$(cd "$(dirname "$0")" && pwd)"
FP_FILE="$HERE/server-fingerprint.txt"
LOCAL_TRUSTED="$HOME/.config/Deskflow/tls/trusted-clients"

[ -f "$FP_FILE" ] || { echo "ERR: missing $FP_FILE"; exit 1; }
SERVER_FP="$(tr -d '[:space:]' < "$FP_FILE")"

log(){ printf '\033[1;36m>>\033[0m %s\n' "$*"; }

log "preflight: ssh $REMOTE"
ssh -o ConnectTimeout=5 "$REMOTE" true
log "OK: SSH to $REMOTE works"

log "remote: ensure deskflow installed"
ssh -t "$REMOTE" 'dpkg -s deskflow >/dev/null 2>&1 || { sudo apt-get update && sudo apt-get install -y deskflow; }' || true

log "remote: seed trusted-servers (server fp = ${SERVER_FP:0:24}...)"
ssh "$REMOTE" "mkdir -p ~/.config/Deskflow/tls && printf '%s\n' '$SERVER_FP' > ~/.config/Deskflow/tls/trusted-servers && chmod 600 ~/.config/Deskflow/tls/trusted-servers"

log "remote: enable lingering (survive logout/reboot)"
ssh -t "$REMOTE" 'sudo loginctl enable-linger "$USER"' || true

log "remote: install systemd --user unit (screen=$SCREEN, server=$SERVER_IP:$PORT)"
# Values baked locally; unit sent over stdin so no remote-shell expansion surprises.
cat > "$HERE/deskflow-client.service" <<UNIT
[Unit]
Description=Deskflow client (shares this screen with $SERVER_IP)
After=graphical-session.target
PartOf=graphical-session.target

[Service]
Type=simple
Environment=DISPLAY=:0
ExecStart=/usr/bin/deskflow-client -n $SCREEN --enable-crypto $SERVER_IP:$PORT
Restart=on-failure
RestartSec=3

[Install]
WantedBy=graphical-session.target
UNIT
ssh "$REMOTE" 'mkdir -p ~/.config/systemd/user' < "$HERE/deskflow-client.service" \
  "> ~/.config/systemd/user/deskflow-client.service"

log "remote: enable + start the service (requires an active graphical session)"
ssh "$REMOTE" 'export XDG_RUNTIME_DIR=/run/user/$(id -u); systemctl --user daemon-reload; systemctl --user enable --now deskflow-client.service; sleep 1; systemctl --user --no-pager --full status deskflow-client.service | head -12' || true

log "remote: read its own client fingerprint, back-fill this server's trusted-clients"
REM_FP="$(ssh "$REMOTE" 'cat ~/.config/Deskflow/tls/local-fingerprint 2>/dev/null | tr -d "[:space:]"' || true)"
if [ -n "$REM_FP" ]; then
  if grep -qxF "$REM_FP" "$LOCAL_TRUSTED" 2>/dev/null; then
    log "server already trusts this client fp — no change"
  else
    printf '%s\n' "$REM_FP" >> "$LOCAL_TRUSTED"
    log "server trusted-clients updated. Restart the local deskflow server (GUI) to reload, or:"
    log "    pkill -f deskflow-server; nohup deskflow-server ... &  (re-run with your real args)"
  fi
else
  log "WARN: remote local-fingerprint not found (cert may generate on first connect). Re-run this script after the first attempt."
fi

log "verify: server-side connection from $REMOTE"
sleep 2
if ss -tn 'dport = :24800' 2>/dev/null | grep -q "192.168.100.12"; then
  log "LIVE: client $REMOTE is connected to :24800"
else
  log "PENDING: no client socket yet. If remote is Wayland, log into an X11 session (deskflow needs X11/xtest). Check: ssh $REMOTE 'journalctl --user -u deskflow-client -n 30 --no-pager'"
fi
log "done."