// src/lib/cms/queries/media.ts
// Phase 3: Data access layer

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import type { MediaRow } from '@/lib/cms/types';

export async function getMediaByIds(
  supabase: SupabaseClient<Database>,
  ids: string[],
): Promise<MediaRow[]> {
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from('media')
    .select('*')
    .in('id', ids);

  if (error) {
    console.error('[CMS] getMediaByIds failed:', error.message);
    return [];
  }
  return data ?? [];
}
