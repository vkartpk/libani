// Client for the self-hosted / externally-owned Supabase project.
// The URL and publishable (anon) key are public values — RLS protects the data.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export const SUPABASE_URL = "https://asgdaihwlxmpjbiqcufu.supabase.co";
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZ2RhaWh3bHhtcGpiaXFjdWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwNTYwOTksImV4cCI6MjEwMDYzMjA5OX0.frgBc4O5m8Z2FaKGlBtRrdlmWjs4-JrQO23dSf0a1cs";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
