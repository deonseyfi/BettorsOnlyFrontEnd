import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

// When env vars are missing we still export a client-shaped object so the rest of
// the app can call .auth.* without crashing. Every method returns an error result
// telling the developer what to configure.
function stubClient() {
  const err = { message: 'Supabase not configured — set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env' };
  const notReady = async () => ({ data: { user: null, session: null }, error: err });
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: notReady,
      signUp: notReady,
      signOut: async () => ({ error: null })
    }
  };
}

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : stubClient();
