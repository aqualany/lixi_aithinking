// src/lib/cms/queries/site.ts
// Phase 3: Data access layer

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import type { SiteSettingsRow, MediaRow } from '@/lib/cms/types';

export async function getSiteSettings(
  supabase: SupabaseClient<Database>,
): Promise<SiteSettingsRow | null> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .single();

  if (error || !data) {
    console.error('[CMS] getSiteSettings failed:', error?.message);
    return null;
  }
  return data;
}

export async function getAvatarMedia(
  supabase: SupabaseClient<Database>,
  mediaId: string | null,
): Promise<string | null> {
  if (!mediaId) return null;

  const { data, error } = await supabase
    .from('media')
    .select('public_url')
    .eq('id', mediaId)
    .limit(1)
    .single();

  if (error || !data) {
    console.error('[CMS] getAvatarMedia failed:', error?.message);
    return null;
  }
  return data.public_url || null;
}
