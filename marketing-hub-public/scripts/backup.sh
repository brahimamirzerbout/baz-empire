#!/bin/bash
# Creates a snapshot of the Marketing Hub at the given path.
# Excludes node_modules and .next build artifacts (regenerable),
# but keeps the SQLite database and uploaded assets.

set -e

SRC="${1:-/home/uzer/marketing-hub}"
SNAPSHOTS_DIR="${SNAPSHOTS_DIR:-/home/uzer/marketing-hub-snapshots}"
LABEL="${2:-$(date +%Y%m%d-%H%M%S)}"
NAME="${3:-marketing-hub-${LABEL}}"

if [ ! -d "$SRC" ]; then
  echo "Error: source directory $SRC does not exist" >&2
  exit 1
fi

mkdir -p "$SNAPSHOTS_DIR"
DEST="$SNAPSHOTS_DIR/$NAME"

if [ -e "$DEST" ]; then
  echo "Error: destination $DEST already exists" >&2
  exit 1
fi

echo "==> Creating snapshot at $DEST"
mkdir -p "$DEST"

# Use rsync for efficiency. Exclude heavy/rebuildable dirs.
rsync -a \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='*.log' \
  --exclude='.DS_Store' \
  --exclude='.vite' \
  "$SRC/" "$DEST/"

# Capture a version manifest
cat > "$DEST/SNAPSHOT.txt" <<EOF
Marketing Hub snapshot
======================
Source:     $SRC
Created:    $(date -Iseconds)
Hostname:   $(hostname)
Git status: $(cd "$SRC" && git status --short 2>/dev/null || echo "(not a git repo)")
Package:    $(grep '"version"' "$SRC/package.json" | head -1)
Database:   $(stat -c '%s bytes, modified %y' "$SRC/data/hub.sqlite" 2>/dev/null || echo "(missing)")
EOF

SIZE=$(du -sh "$DEST" | cut -f1)
echo "==> Snapshot complete: $DEST ($SIZE)"

# Also create a compressed archive alongside (handy for copying)
ARCHIVE="$SNAPSHOTS_DIR/${NAME}.tar.gz"
echo "==> Creating archive $ARCHIVE"
tar -czf "$ARCHIVE" -C "$SNAPSHOTS_DIR" "$NAME"
ARCHIVE_SIZE=$(du -sh "$ARCHIVE" | cut -f1)
echo "==> Archive complete: $ARCHIVE ($ARCHIVE_SIZE)"
echo
echo "To restore: rsync -a $DEST/ /home/uzer/marketing-hub/  (after removing node_modules + .next)"
echo "Or extract:  tar -xzf $ARCHIVE -C /tmp/"
