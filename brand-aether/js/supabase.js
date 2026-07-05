/* ═══════════════════════════════════════════════════════════════════════
   Æ T H E R  —  Supabase Client
   ═══════════════════════════════════════════════════════════════════════
   Usage:
     import { supabase } from './js/supabase.js'
     // or <script type="module" src="/js/supabase.js"></script>

   Set these in .env for local dev, or as Vercel env vars for production:
     VITE_SUPABASE_URL    = https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY = your-anon-key
   ═══════════════════════════════════════════════════════════════════════ */

const SUPABASE_URL = window.__SUPABASE_URL;
const SUPABASE_ANON_KEY = window.__SUPABASE_ANON_KEY;

// Hard fallback for local dev (Supabase demo credentials)
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  if (window.__SUPABASE_URL === undefined) {
    console.warn(
      'Æther: Supabase credentials not configured.\n' +
      '  Copy js/config.example.js → js/config.js and set your URL + anon key.\n' +
      '  Or set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY env vars on Vercel.'
    );
  }
}

const _URL = SUPABASE_URL || 'http://127.0.0.1:54321';
const _KEY = SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

// ── Load the Supabase client library ──
async function loadSupabaseClient() {
  if (window.supabase) return window.supabase;
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  window.supabase = createClient(_URL, _KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
  return window.supabase;
}

const supabasePromise = loadSupabaseClient();

export async function getSupabase() {
  return await supabasePromise;
}

// ── Auth helpers ──

export async function signIn(email, password) {
  const supabase = await getSupabase();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(email, password) {
  const supabase = await getSupabase();
  return supabase.auth.signUp({ email, password });
}

export async function signOut() {
  const supabase = await getSupabase();
  return supabase.auth.signOut();
}

export async function getSession() {
  const supabase = await getSupabase();
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function onAuthStateChange(callback) {
  const supabase = await getSupabase();
  return supabase.auth.onAuthStateChange(callback);
}
