import { createClient } from '@supabase/supabase-js';

// Lazy getters — clients are created on first call, not at module load time.
// This prevents build-time failures when env vars aren't set.

let _supabase: ReturnType<typeof createClient> | null = null;
let _supabaseAdmin: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { db: { schema: 'figureflex' } }
    );
  }
  return _supabase;
}

export function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { db: { schema: 'figureflex' } }
    );
  }
  return _supabaseAdmin;
}

// Proxy objects so existing code using `supabaseAdmin.from(...)` keeps working.
export const supabase = new Proxy({} as ReturnType<typeof getSupabase>, {
  // eslint-disable-next-line
  get(_target: any, prop: string) {
    // eslint-disable-next-line
    return (getSupabase() as any)[prop];
  },
});

export const supabaseAdmin = new Proxy({} as ReturnType<typeof getSupabaseAdmin>, {
  // eslint-disable-next-line
  get(_target: any, prop: string) {
    // eslint-disable-next-line
    return (getSupabaseAdmin() as any)[prop];
  },
});
