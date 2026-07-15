#!/usr/bin/env bash
# fix-vscode-xfce-icon.sh — make the code-oss taskbar icon resolve on XFCE
# Root cause: code-oss windows set WM_CLASS="code-oss-dev" but no _NET_WM_ICON,
# and there is no icon named "code-oss-dev" in the icon theme. XFCE tasklist
# (icon-only mode) looks up an icon by WM_CLASS, finds nothing -> blank button.
# Fix: mirror the existing kali-code-oss icon under the name code-oss-dev, refresh caches.
# Run:  sudo bash ~/fix-vscode-xfce-icon.sh
set -euo pipefail

SRC=/usr/share/icons/hicolor
if [ ! -f "$SRC/scalable/apps/kali-code-oss.svg" ]; then
  echo "kali-code-oss icon not found — install code-oss first." >&2; exit 1
fi

n=0
for f in $(find "$SRC" -name 'kali-code-oss.*'); do
  ext="${f##*.}"
  dst="$(dirname "$f")/code-oss-dev.$ext"
  cp -f "$f" "$dst"; n=$((n+1))
done
echo "installed $n icon files named code-oss-dev"

gtk-update-icon-cache -f -t "$SRC" >/dev/null 2>&1 || true
for t in /usr/share/icons/*; do
  [ -d "$t" ] && gtk-update-icon-cache -f -t "$t" >/dev/null 2>&1 || true
done
echo "icon caches refreshed"

# Restart the panel so it re-reads icons (safe, non-destructive)
if command -v xfce4-panel >/dev/null 2>&1; then
  xfce4-panel -r >/dev/null 2>&1 &  echo "restarting xfce4-panel…"
fi

echo "done — VS Code icon should now show in the taskbar."
echo "If a window is already open, it updates on next focus/relaunch."