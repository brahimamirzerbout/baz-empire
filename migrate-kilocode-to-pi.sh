#!/usr/bin/env bash
# Kilocode → pi migration script
# Run this AFTER closing all Kilocode/VS Code instances

set -euo pipefail

KILOCODE_TASKS_DIR="$HOME/.config/Code - OSS/User/globalStorage/kilocode.kilo-code/tasks"
KILOCODE_PLANS_DIR="$HOME/.kilo/plans"
PI_SESSIONS_DIR="$HOME/.pi/agent/sessions"
PI_CONTEXT_DIR="$HOME/.pi/agent/context/kilocode-migration"

TIMESTAMP=$(date -u +"%Y-%m-%dT%H-%M-%SZ")
MIGRATION_ID="kilocode-migration-$TIMESTAMP"

echo "🔄 Kilocode → pi migration started: $MIGRATION_ID"

# Create target directories
mkdir -p "$PI_SESSIONS_DIR/--migration-kilocode--"
mkdir -p "$PI_CONTEXT_DIR/plans"

# 1. Migrate task sessions (JSONL format)
echo "📦 Migrating task sessions..."
for task_dir in "$KILOCODE_TASKS_DIR"/*/; do
    task_id=$(basename "$task_dir")
    if [[ -f "$task_dir/api_conversation_history.json" ]]; then
        echo "  → Converting $task_id"
        
        # Convert JSON to JSONL (pi format: one JSON object per line)
        python3 -c "
import json, sys, os
task_id = '$task_id'
task_dir = '$task_dir'
with open(os.path.join(task_dir, 'api_conversation_history.json')) as f:
    data = json.load(f)

output_path = os.path.join('$PI_SESSIONS_DIR/--migration-kilocode--', task_id + '.jsonl')
with open(output_path, 'w') as out:
    for i, msg in enumerate(data):
        entry = {
            'id': f'{task_id}-{i}',
            'type': 'message',
            'role': msg.get('role', 'unknown'),
            'content': msg.get('content', ''),
            'timestamp': msg.get('timestamp', 0),
            'metadata': {
                'source': 'kilocode',
                'task_id': task_id,
                'original_index': i
            }
        }
        out.write(json.dumps(entry) + '\n')
print(f'  Written to {output_path}')
"
    fi
done

# 2. Migrate plans (markdown files)
echo "📋 Migrating plans..."
cp -v "$KILOCODE_PLANS_DIR"/*.md "$PI_CONTEXT_DIR/plans/" 2>/dev/null || true
PLAN_COUNT=$(ls "$PI_CONTEXT_DIR/plans/" 2>/dev/null | wc -l)
echo "  ✓ $PLAN_COUNT plans copied to $PI_CONTEXT_DIR/plans/"

# 3. Create a master context summary for pi
echo "📝 Creating master context summary..."
cat > "$PI_CONTEXT_DIR/MIGRATION_SUMMARY.md" << EOF
# Kilocode → pi Migration Summary
**Migration ID:** $MIGRATION_ID  
**Date:** $(date -u +"%Y-%m-%d %H:%M:%S UTC")  
**Source Machine:** $(hostname)  
**Kilocode Version:** 5.16.2 (from VS Code extension)

## Migrated Sessions
EOF

for task_dir in "$KILOCODE_TASKS_DIR"/*/; do
    task_id=$(basename "$task_dir")
    if [[ -f "$task_dir/task_metadata.json" ]]; then
        # Extract task info
        python3 -c "
import json
with open('$task_dir/task_metadata.json') as f:
    meta = json.load(f)
files = meta.get('files_in_context', [])
print(f'- **$task_id**: {len(files)} files in context')
for f in files[:5]:
    print(f'  - {f[\"path\"]} ({f[\"record_state\"]})')
if len(files) > 5:
    print(f'  ... and {len(files) - 5} more')
"
    fi
done >> "$PI_CONTEXT_DIR/MIGRATION_SUMMARY.md"

cat >> "$PI_CONTEXT_DIR/MIGRATION_SUMMARY.md" << EOF

## Migrated Plans
EOF

for plan in "$PI_CONTEXT_DIR/plans"/*.md; do
    [[ -f "$plan" ]] || continue
    basename=$(basename "$plan")
    # Extract first heading or first line
    first_line=$(head -1 "$plan" 2>/dev/null | sed 's/^#* //')
    echo "- **$basename**: $first_line" >> "$PI_CONTEXT_DIR/MIGRATION_SUMMARY.md"
done

# 4. Create a pi session index that can be resumed
echo "🔗 Creating pi-compatible session index..."
cat > "$PI_SESSIONS_DIR/--migration-kilocode--/SESSION_INDEX.json" << EOF
{
  "migration_id": "$MIGRATION_ID",
  "source": "kilocode",
  "tasks": [
EOF

first=true
for task_dir in "$KILOCODE_TASKS_DIR"/*/; do
    task_id=$(basename "$task_dir")
    if [[ -f "$task_dir/task_metadata.json" ]]; then
        if [[ "$first" == "true" ]]; then
            first=false
        else
            echo "," >> "$PI_SESSIONS_DIR/--migration-kilocode--/SESSION_INDEX.json"
        fi
        python3 -c "
import json, os
with open('$task_dir/task_metadata.json') as f:
    meta = json.load(f)
files = meta.get('files_in_context', [])
active_files = [f['path'] for f in files if f.get('record_state') == 'active']
print('  {')
print(f'    \"task_id\": \"$task_id\",')
print(f'    \"session_file\": \"--migration-kilocode--/$task_id.jsonl\",')
print(f'    \"active_files\": {json.dumps(active_files)},')
print(f'    \"total_files\": {len(files)}')
print('  }', end='')
" >> "$PI_SESSIONS_DIR/--migration-kilocode--/SESSION_INDEX.json"
    fi
done

cat >> "$PI_SESSIONS_DIR/--migration-kilocode--/SESSION_INDEX.json" << EOF

  ],
  "plans_dir": "$PI_CONTEXT_DIR/plans/",
  "summary_file": "$PI_CONTEXT_DIR/MIGRATION_SUMMARY.md"
}
EOF

echo "✅ Migration complete!"
echo ""
echo "📂 Migrated to:"
echo "   Sessions: $PI_SESSIONS_DIR/--migration-kilocode--/"
echo "   Plans:    $PI_CONTEXT_DIR/plans/"
echo "   Summary:  $PI_CONTEXT_DIR/MIGRATION_SUMMARY.md"
echo ""
echo "🚀 To use in pi:"
echo "   1. Start pi in your project directory"
echo "   2. Run: /resume  (pick the kilocode migration session)"
echo "   3. Or read context: cat $PI_CONTEXT_DIR/MIGRATION_SUMMARY.md"
echo ""
echo "💡 Tip: Add this to your pi context permanently by creating"
echo "   ~/.pi/agent/prompts/kilocode-context.md with the summary content"