// Lazy Supabase client creation — avoids env var access at module load time (build-time safe)
import { createClient } from '@supabase/supabase-js';

// eslint-disable-next-line
let _supabase: any = null;
// eslint-disable-next-line
let _supabaseAdmin: any = null;

// eslint-disable-next-line
export function getSupabase(): any {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
      {
        db: { schema: 'figureflex' },
        global: { fetch: (url: any, init: any) => fetch(url, { ...init, cache: 'no-store' }) },
      }
    );
  }
  return _supabase;
}

// eslint-disable-next-line
export function getSupabaseAdmin(): any {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string,
      {
        db: { schema: 'figureflex' },
        global: { fetch: (url: any, init: any) => fetch(url, { ...init, cache: 'no-store' }) },
      }
    );
  }
  return _supabaseAdmin;
}

// Proxy objects so existing code using `supabaseAdmin.from(...)` keeps working.
// eslint-disable-next-line
export const supabase: any = new Proxy({}, {
  // eslint-disable-next-line
  get(_t: any, prop: string) { return getSupabase()[prop]; },
});

// eslint-disable-next-line
export const supabaseAdmin: any = new Proxy({}, {
  // eslint-disable-next-line
  get(_t: any, prop: string) { return getSupabaseAdmin()[prop]; },
});
