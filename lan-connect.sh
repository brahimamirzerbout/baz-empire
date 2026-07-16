#!/usr/bin/env bash
# lan-connect.sh — wire two Kali (or any Debian-based) instances over LAN via SSH.
#
# Usage:
#   ./lan-connect.sh serve              # run on BOTH boxes: install/enable sshd, open fw, print LAN ip + fingerprint
#   ./lan-connect.sh connect <host> [user]  # run on ONE box: ping, copy your key, smoke-test ssh to the other box
#   ./lan-connect.sh alias <host> <name>    # add /etc/hosts alias (e.g. kali2) for the other box (needs sudo)
#   ./lan-connect.sh status                # show this box's LAN ips, sshd state, your pubkey, known hosts
#
# Assumptions (flag if wrong):
#  - Both boxes are on the same L2/L3 LAN (same subnet, no NAT between them).
#  - Default ssh port 22. Edit SSH_PORT below if you moved it.
#  - Password auth is enabled initially for key bootstrap; we harden to key-only after `connect`.
#  - Run `serve` on BOTH machines first, then `connect` from the one you'll drive FROM.
#
# Exit codes: 0 ok, 1 usage, 2 missing dep, 3 network/ssh failure, 4 needs root.

set -euo pipefail
SSH_PORT="${SSH_PORT:-22}"
KEY_FILE="${HOME}/.ssh/id_ed25519"

c_red() { printf '\033[31m%s\033[0m\n' "$*"; }
c_grn() { printf '\033[32m%s\033[0m\n' "$*"; }
c_cyn() { printf '\033[36m%s\033[0m\n' "$*"; }
c_ylw() { printf '\033[33m%s\033[0m\n' "$*"; }

need_root() { [ "$(id -u)" -eq 0 ]; }

ensure_key() {
  if [ ! -f "$KEY_FILE" ]; then
    c_cyn "[*] generating ed25519 key at $KEY_FILE"
    mkdir -p "$HOME/.ssh" && chmod 700 "$HOME/.ssh"
    ssh-keygen -t ed25519 -a 100 -f "$KEY_FILE" -N "" -C "${USER}@$(hostname)" >/dev/null
    c_grn "[+] key created"
  fi
}

lan_ips() {
  # print IPv4 addresses on UP non-loopback interfaces
  ip -4 -br addr 2>/dev/null | awk '$2=="UP" && $1!="lo"{for(i=3;i<=NF;i++) if($i ~ /^[0-9]/){split($i,a,"/"); print a[1]" ("$1")"}}' || true
}

cmd_serve() {
  c_cyn "==> [serve] ensuring sshd on $(hostname)"
  # 1. install if missing
  if ! command -v sshd >/dev/null 2>&1; then
    if need_root; then apt-get update -y && apt-get install -y openssh-server
    else sudo apt-get update -y && sudo apt-get install -y openssh-server; fi
  fi
  # 2. enable + start
  if need_root; then systemctl enable --now ssh
  else sudo systemctl enable --now ssh; fi
  # 3. firewall (only if ufw is present and active)
  if command -v ufw >/dev/null 2>&1; then
    if need_root; then ufw allow ${SSH_PORT}/tcp || true
    else sudo ufw allow ${SSH_PORT}/tcp || true; fi
  fi
  ensure_key
  echo
  c_grn "[+] LAN addresses on $(hostname):"
  lan_ips | sed 's/^/      /'
  echo
  local fp
  fp="$(ssh-keygen -lf "$KEY_FILE" 2>/dev/null | awk '{print $2}')"
  c_grn "[+] this box pubkey fingerprint: ${fp:-<none>}"
  echo
  c_ylw "[i] On the OTHER box run: ./lan-connect.sh serve"
  c_ylw "[i] Then from the box you drive FROM run:"
  echo "        ./lan-connect.sh connect <one-of-the-ips-above>"
}

cmd_connect() {
  local host="${1:-}"; local user="${2:-$USER}"
  [ -z "$host" ] && { c_red "usage: $0 connect <host> [user]"; exit 1; }
  ensure_key
  c_cyn "==> [connect] $user@$host:$SSH_PORT from $(hostname)"
  # 1. ping (ipv4, 2s timeout)
  if ! ping -c 1 -W 2 "$host" >/dev/null 2>&1; then
    c_red "[!] no ping reply from $host — check: same LAN? firewall? host up?"
    exit 3
  fi
  c_grn "[+] ping ok"
  # 2. tcp reachability on ssh port
  if ! timeout 5 bash -c "exec 3<>/dev/tcp/${host}/${SSH_PORT}" 2>/dev/null; then
    c_red "[!] tcp ${SSH_PORT} unreachable on $host — sshd not running or firewalled"
    exit 3
  fi
  c_grn "[+] tcp/${SSH_PORT} reachable"
  # 3. copy key (needs password this once; requires PasswordAuthentication yes on target)
  c_cyn "[*] copying pubkey (enter remote password if prompted)..."
  if ! ssh-copy-id -p ${SSH_PORT} "${user}@${host}" 2>/dev/null; then
    c_ylw "[!] ssh-copy-id failed. If PasswordAuthentication is off on the target, re-enable it:"
    echo "      sudo sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config && sudo systemctl restart ssh"
    echo "      then re-run this command."
    exit 3
  fi
  c_grn "[+] key copied"
  # 4. smoke test: key-only login + remote identity
  c_cyn "[*] smoke-testing key-only login..."
  if ! ssh -p ${SSH_PORT} -o BatchMode=yes -o StrictHostKeyChecking=accept-new "${user}@${host}" \
        'echo "[remote] $(hostname) $(uname -srm) up=$(cut -d. -f1 /proc/uptime)s"'; then
    c_red "[!] key login failed — verify authorized_keys on target"
    exit 3
  fi
  c_grn "[+] passwordless ssh works: ${user}@${host}"
  echo
  c_ylw "[i] quick alias (optional):  ./lan-connect.sh alias ${host} kali2"
  c_ylw "[i] then:  ssh kali2"
}

cmd_alias() {
  local host="${1:-}"; local name="${2:-kali2}"
  [ -z "$host" ] && { c_red "usage: $0 alias <host> [name]"; exit 1; }
  if grep -qE "^[0-9.]+[[:space:]]+${name}\b" /etc/hosts 2>/dev/null; then
    c_ylw "[i] alias ${name} already in /etc/hosts — updating"
    if need_root; then sed -i "/${name}\$/d" /etc/hosts
    else sudo sed -i "/${name}\$/d" /etc/hosts; fi
  fi
  if need_root; then echo "${host} ${name}" >> /etc/hosts
  else echo "${host} ${name}" | sudo tee -a /etc/hosts >/dev/null; fi
  c_grn "[+] /etc/hosts: ${host} ${name}  ->  try: ssh ${name}"
}

cmd_status() {
  c_cyn "==> [status] $(hostname)"
  echo -n "sshd: "; systemctl is-active ssh 2>/dev/null || echo "n/a"
  echo -n "boot-enabled: "; systemctl is-enabled ssh 2>/dev/null || echo "n/a"
  echo "LAN ips:"; lan_ips | sed 's/^/  /'
  if [ -f "$KEY_FILE" ]; then
    echo -n "pubkey fingerprint: "; ssh-keygen -lf "$KEY_FILE" | awk '{print $2}'
    echo "pubkey:"; ssh-keygen -y -f "$KEY_FILE" 2>/dev/null | sed 's/^/  /' | head -1
  else
    echo "pubkey: <none — run 'serve' or 'connect' to generate>"
  fi
  echo "known hosts (hashed unless plaintext):"
  if [ -f "$HOME/.ssh/known_hosts" ]; then
    grep -vE '^\s*(#|$)' "$HOME/.ssh/known_hosts" | awk '{print "  "$1}' || echo "  <none>"
  else echo "  <none>"; fi
}

case "${1:-}" in
  serve)   cmd_serve ;;
  connect) shift; cmd_connect "$@" ;;
  alias)   shift; cmd_alias "$@" ;;
  status)  cmd_status ;;
  *) c_red "usage: $0 {serve|connect <host> [user]|alias <host> [name]|status}"; exit 1 ;;
esac