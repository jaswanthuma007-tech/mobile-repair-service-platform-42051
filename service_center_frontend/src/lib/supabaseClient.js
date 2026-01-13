import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client initialization for Service Center portal.
 * Uses CRA env vars: REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY.
 *
 * If env vars are missing/empty, we return null and use localStorage fallback.
 */
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const isSupabaseConfigured = Boolean(supabase);
