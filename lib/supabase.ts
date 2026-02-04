import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? supabaseAnonKey;

function createSupabaseClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Lazy initialization to allow build time without env vars
let _supabaseServer: SupabaseClient | null = null;

export function getSupabaseServer(): SupabaseClient {
  if (!_supabaseServer) {
    _supabaseServer = createSupabaseClient();
  }
  return _supabaseServer;
}

// For backwards compatibility - will throw if used during build without env vars
export const supabaseServer = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return Reflect.get(getSupabaseServer(), prop);
  },
});
