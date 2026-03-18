import { createClient } from '@supabase/supabase-js';

// Lazy getters — clients are created on first call, not at module load time.
// This prevents build-time failures when env vars aren't set.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _supabase: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _supabaseAdmin: any = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSupabase(): any {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { db: { schema: 'figureflex' } }
    );
  }
  return _supabase;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSupabaseAdmin(): any {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { db: { schema: 'figureflex' } }
    );
  }
  return _supabaseAdmin;
}

// Proxy objects that forward .from() calls to the lazy clients.
// Allows existing API routes to keep using `supabaseAdmin.from(...)` without changes.
export const supabase = new Proxy({} as ReturnType<typeof getSupabase>, {
  get(_target, prop) {
    return (getSupabase() as any)[prop];
  },
});

export const supabaseAdmin = new Proxy({} as ReturnType<typeof getSupabaseAdmin>, {
  get(_target, prop) {
    return (getSupabaseAdmin() as any)[prop];
  },
});
