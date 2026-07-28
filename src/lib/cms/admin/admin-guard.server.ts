import { createServerFn } from "@tanstack/react-start";
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const ADMIN_CLIENT = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function requireAdmin(supabaseAccessToken?: string): Promise<boolean> {
  if (!supabaseAccessToken) return false;
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } },
    auth: { persistSession: false },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase.from('site_settings').select('admin_user_id').limit(1).single();
  return data?.admin_user_id === user.id;
}

export { ADMIN_CLIENT };
