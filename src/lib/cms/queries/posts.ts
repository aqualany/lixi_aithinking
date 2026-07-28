// src/lib/cms/queries/posts.ts
// Phase 3: Data access layer

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import type { PostRow, PostSectionRow } from '@/lib/cms/types';

export async function getPostsByContentType(
  supabase: SupabaseClient<Database>,
  contentTypeSlug: string,
): Promise<PostRow[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*, content_types!inner(slug)')
    .eq('content_types.slug', contentTypeSlug)
    .eq('status', 'published')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error(`[CMS] getPostsByContentType(${contentTypeSlug}) failed:`, error.message);
    return [];
  }
  return data ?? [];
}

export async function getPostBySlug(
  supabase: SupabaseClient<Database>,
  slug: string,
): Promise<PostRow | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .limit(1)
    .single();

  if (error) {
    console.error(`[CMS] getPostBySlug(${slug}) failed:`, error.message);
    return null;
  }
  return data;
}

export async function getPostSections(
  supabase: SupabaseClient<Database>,
  postId: string,
): Promise<PostSectionRow[]> {
  const { data, error } = await supabase
    .from('post_sections')
    .select('*')
    .eq('post_id', postId)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error(`[CMS] getPostSections failed:`, error.message);
    return [];
  }
  return data ?? [];
}
