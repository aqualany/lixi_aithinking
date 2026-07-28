// src/lib/cms/queries/navigation.ts
// Phase 3: Data access layer

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import type { NavigationRow } from '@/lib/cms/types';

export async function getNavigation(
  supabase: SupabaseClient<Database>,
  location: 'header' | 'footer' | 'mobile',
): Promise<NavigationRow[]> {
  const { data, error } = await supabase
    .from('navigation')
    .select('*')
    .eq('location', location)
    .eq('is_visible', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error(`[CMS] getNavigation(${location}) failed:`, error.message);
    return [];
  }
  return data ?? [];
}
