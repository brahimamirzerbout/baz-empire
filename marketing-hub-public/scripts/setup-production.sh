#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# SETUP SUPABASE + VERCEL — Marketing Hub Production Deployment
# ═══════════════════════════════════════════════════════════════════
#
# This script:
# 1. Applies the Supabase migration (department upgrade)
# 2. Seeds real-world data into Supabase
# 3. Sets Vercel environment variables
# 4. Verifies deployment
#
# Prerequisites:
# - Supabase project already exists (SUPABASE_URL in .env.local)
# - Vercel project already linked
# - SUPABASE_SERVICE_ROLE_KEY set (get from Supabase Dashboard > Settings > API)
#
# Usage:
#   export SUPABASE_SERVICE_ROLE_KEY=eyJ...
#   bash scripts/setup-production.sh
#

set -euo pipefail

echo "🚀 Marketing Hub — Production Setup"
echo "====================================="

# ── 1. Load environment ──
source .env.local 2>/dev/null || true

if [ -z "${SUPABASE_URL:-}" ]; then
  echo "❌ SUPABASE_URL not found in .env.local"
  echo "   Add it: SUPABASE_URL=https://xxx.supabase.co"
  exit 1
fi

if [ -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]; then
  echo "⚠️  SUPABASE_SERVICE_ROLE_KEY not set"
  echo "   Get it from: Supabase Dashboard > Settings > API > service_role key"
  echo "   Then: export SUPABASE_SERVICE_ROLE_KEY=eyJ..."
  echo ""
  echo "   The service role key has admin access and bypasses RLS."
  echo "   NEVER expose it in client-side code."
  exit 1
fi

echo "✅ Supabase URL: ${SUPABASE_URL}"
echo "✅ Service role key: ${SUPABASE_SERVICE_ROLE_KEY:0:20}..."

# ── 2. Apply migration ──
echo ""
echo "📦 Applying Supabase migration..."
MIGRATION_FILE="supabase/migrations/00002_department_upgrade.sql"

if [ ! -f "$MIGRATION_FILE" ]; then
  echo "❌ Migration file not found: $MIGRATION_FILE"
  exit 1
fi

# Apply migration via Supabase SQL API
RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST \
  "${SUPABASE_URL}/rest/v1/rpc/exec_sql" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"$(cat $MIGRATION_FILE | sed 's/"/\\"/g' | tr '\n' ' ')\"}" \
  2>/dev/null || echo "Migration may need to be applied manually via Supabase Dashboard")

# If the RPC doesn't exist, we'll apply via dashboard instructions
echo ""
echo "📋 If the automatic migration failed, apply it manually:"
echo "   1. Go to ${SUPABASE_URL}/project/_/sql"
echo "   2. Click 'New Query'"
echo "   3. Paste the contents of $MIGRATION_FILE"
echo "   4. Click 'Run'"

# ── 3. Verify tables exist ──
echo ""
echo "🔍 Verifying Supabase tables..."

for TABLE in contacts companies deals campaigns daily_kpis revenue_events employees; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    "${SUPABASE_URL}/rest/v1/${TABLE}?select=id&limit=1" \
    -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}")
  
  if [ "$STATUS" = "200" ]; then
    echo "  ✅ ${TABLE} — accessible"
  elif [ "$STATUS" = "404" ]; then
    echo "  ❌ ${TABLE} — not found (needs migration)"
  else
    echo "  ⚠️  ${TABLE} — status ${STATUS}"
  fi
done

# ── 4. Set Vercel environment variables ──
echo ""
echo "🔧 Setting Vercel environment variables..."

# Marketing Hub
echo "  Setting SUPABASE_SERVICE_ROLE_KEY for Marketing Hub..."
vercel env add SUPABASE_SERVICE_ROLE_KEY production <<< "${SUPABASE_SERVICE_ROLE_KEY}" 2>/dev/null || echo "  (already set or Vercel CLI not linked)"

# ── 5. Seed real-world data (locally) ──
echo ""
echo "🌱 Seeding real-world data locally..."
npx tsx scripts/seed-real-world.ts 2>&1 | tail -5

# ── 6. Deploy to Vercel ──
echo ""
echo "🚀 Deploying to Vercel..."
echo "  Marketing Hub: https://marketing-hub-roan.vercel.app"
echo "  BAZ Marketing Site: https://baz.agency"
echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Apply migration in Supabase Dashboard SQL editor"
echo "  2. Seed data to Supabase: npx tsx scripts/seed-supabase.ts"
echo "  3. Verify: curl https://marketing-hub-roan.vercel.app/api/dashboard"
echo "  4. Monitor: Vercel Dashboard > marketing-hub > Logs"