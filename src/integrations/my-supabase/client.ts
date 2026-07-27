import { createClient } from "@supabase/supabase-js";

// External Supabase project (not Lovable Cloud).
// URL and publishable key are safe to expose to the browser.
export const MY_SUPABASE_URL = "https://eoiltvhuypeeqcgwwnbj.supabase.co";
export const MY_SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_9g6RXTBBlKXBEGfMNmIGCg_dJ63zfy5";

export const mySupabase = createClient(
  MY_SUPABASE_URL,
  MY_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: "my-supabase-auth",
    },
  },
);