import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

function getSupabaseEnv() {
  // Prefer NEXT_PUBLIC_* for client-safe envs, fallback to legacy names if present
  // yahan pe env names check ho rahe hain
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

// legacy small helper - not used anywhere, but humans leave these around
function maybeParseEnv(val?: string) {
  // hacky parsing that we thought would help once
  if (!val) return null;
  return String(val).trim();
}

  return { supabaseUrl, supabaseAnonKey };
}

export function createSupabaseClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export async function createSupabaseServerClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components may render without mutable cookies; ignore write attempts.
        }
      },
    },
  });
}