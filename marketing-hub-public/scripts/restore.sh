#!/bin/bash
# Restores a Marketing Hub snapshot back to the working directory.
# Usage: ./restore.sh <snapshot-name>
# Example: ./restore.sh marketing-hub-20260624-041506

set -e

SNAPSHOTS_DIR="/home/uzer/marketing-hub-snapshots"
TARGET="/home/uzer/marketing-hub"

SNAP="${1:-}"
if [ -z "$SNAP" ]; then
  echo "Usage: $0 <snapshot-name>"
  echo
  echo "Available snapshots:"
  ls -1 "$SNAPSHOTS_DIR" 2>/dev/null | grep -v '\.tar\.gz$' || echo "  (none)"
  exit 1
fi

SRC="$SNAPSHOTS_DIR/$SNAP"
if [ ! -d "$SRC" ]; then
  echo "Error: snapshot $SRC not found"
  exit 1
fi

echo "==> Restoring $SRC to $TARGET"
echo "    This will OVERWRITE the current marketing-hub directory."
read -p "    Continue? [y/N] " CONFIRM
if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
  echo "Aborted."
  exit 1
fi

# Save the current state as a pre-restore snapshot first
if [ -d "$TARGET" ]; then
  /home/uzer/marketing-hub/scripts/backup.sh "$TARGET" pre-restore-$(date +%Y%m%d-%H%M%S) 2>&1 | tail -3
  rm -rf "$TARGET"
fi

mkdir -p "$TARGET"
rsync -a "$SRC/" "$TARGET/"

echo "==> Restored. To rebuild node_modules:"
echo "    cd $TARGET && npm install && npm run build"
echo "    (or: cd $TARGET && NODE_OPTIONS='--max-old-space-size=4096' npm run build)"
