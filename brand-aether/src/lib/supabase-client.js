// ── Browser-side Supabase client ──
// Include this as a module in your HTML pages to interact with Supabase.
// Usage: <script type="module" src="/src/lib/supabase-client.js"></script>

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://uyqgmdrzyapbbvmaumvk.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_RhlyuI-vQGilK1oBhGZd_w_xs11x4ps'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
