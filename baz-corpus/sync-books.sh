#!/usr/bin/env bash
# BAZ corpus sync — pull the ebook corpus from the `books` box (192.168.100.12) into ~/baz-corpus/books/
# Idempotent + resumable (rsync --partial). Re-run anytime to refresh from the source.
# Gentle on the (2-core) remote: nice/ionice the remote rsync; optional BW cap via BAZ_BWLIMIT (kB/s).
# Prereq: keyless SSH to `books` configured in ~/.ssh/config (key already authorized on remote).
# NOTE: only run when remote load is sane (<~2x cores). Check first:  ssh books 'cat /proc/loadavg'
set -euo pipefail

DEST="${HOME}/baz-corpus/books"
mkdir -p "$DEST"

BWLIMIT=()
[ "${BAZ_BWLIMIT:-}" ] && BWLIMIT=(--bwlimit="$BAZ_BWLIMIT")

rsync -a --partial --info=progress2,name0 "${BWLIMIT[@]}" \
  --rsync-path="nice -n 19 ionice -c3 rsync" \
  --include='*.pdf' --include='*.epub' --include='*.mobi' --include='*.azw3' --include='*.azw' --include='*.djvu' --exclude='*' \
  books:Downloads/ "$DEST"/

local_count=$(find "$DEST" -maxdepth 1 -type f | wc -l)
echo "Sync complete. Local books: ${local_count}  (remote source: 708)"