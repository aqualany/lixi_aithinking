// src/lib/cms/queries/pages.ts
// Phase 3: Data access layer

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import type { PageRow } from '@/lib/cms/types';

export async function getAllPages(
  supabase: SupabaseClient<Database>,
): Promise<PageRow[]> {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[CMS] getAllPages failed:', error.message);
    return [];
  }
  return data ?? [];
}

export async function getPageBySlug(
  supabase: SupabaseClient<Database>,
  slug: string,
): Promise<PageRow | null> {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .limit(1)
    .single();

  if (error) {
    console.error(`[CMS] getPageBySlug(${slug}) failed:`, error.message);
    return null;
  }
  return data;
}
