# Deskflow Headless Desktop Setup Guide

## What This Does

Sets up a Linux desktop with **NO keyboard or mouse** — all input comes from
the ThinkPad server (192.168.100.21) via Deskflow, from the very first boot screen.

## Boot Flow

```
Power On
  → Network connects (auto)
  → LightDM login screen appears
  → deskflow-greeter.service starts, connects to ThinkPad
  → Type password from ThinkPad (or auto-login if enabled)
  → Desktop session starts
  → deskflow-client.service takes over (stops greeter service)
  → Seamless — all input from ThinkPad, zero latency
```

## Files

| File | Purpose |
|------|---------|
| `/etc/systemd/system/deskflow-greeter.service` | System service — Deskflow at login screen |
| `~uzer/.config/systemd/user/deskflow-client.service` | User service — Deskflow after login |
| `/root/.config/Deskflow/Deskflow.conf` | Config for greeter (root) |
| `~uzer/.config/Deskflow/Deskflow.conf` | Config for user session |
| `/root/.config/Deskflow/tls/` | TLS certs (root) |
| `~uzer/.config/Deskflow/tls/` | TLS certs (user) |

## Setup on a New Machine

```bash
# 1. Boot with a live USB or temporary keyboard
# 2. Copy deskflow-headless-setup.sh to the machine
# 3. Run it:
sudo bash deskflow-headless-setup.sh

# 4. Remove keyboard & mouse, reboot
# 5. Control everything from ThinkPad
```

## Key Commands

```bash
# Check login-screen service
systemctl status deskflow-greeter

# Check user session service
systemctl --user status deskflow-client

# Watch logs
journalctl -u deskflow-greeter -f

# Restart
systemctl restart deskflow-greeter          # login screen
systemctl --user restart deskflow-client     # after login

# Enable/disable auto-login
# Edit /etc/lightdm/lightdm.conf:
#   autologin-user=uzer
#   autologin-user-timeout=0
```

## On the ThinkPad (Server)

Make sure this machine's screen name is added to the server's screen layout
in the Deskflow server configuration.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| No connection at login screen | `systemctl status deskflow-greeter` — check network |
| "No server addresses configured" | Check `/root/.config/Deskflow/Deskflow.conf` exists |
| Can't type at login screen | Check `XAUTHORITY` path in greeter service |
| Connection drops | Services auto-reconnect with `Restart=always` |
| Port filtered | Open port 24800 on server firewall |
| Two instances running | User service auto-stops greeter via `ExecStartPre` |