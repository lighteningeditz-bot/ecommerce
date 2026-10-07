import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "../config/env";

// Service role client with elevated privileges for trusted backend tasks (place_order RPC, cancel_order RPC, ai_requests log)
export const supabaseAdmin: SupabaseClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

// Anonymous client for unauthenticated public reads
export const supabasePublic: SupabaseClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

// Per-request client initialized with the caller's JWT so Postgres RLS applies
export function createScopedSupabaseClient(jwtToken: string): SupabaseClient {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    },
  });
}
