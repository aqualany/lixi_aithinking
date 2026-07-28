// src/hooks/cms/usePost.ts
// Phase 3: Data access layer

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getPostBySlug, getPostSections } from '@/lib/cms/queries/posts';
import {
  toResearchFullProps,
  toExperimentDetailProps,
  toResumeProps,
} from '@/lib/cms/mappers';
import { getMediaByIds } from '@/lib/cms/queries/media';
import { getSiteSettings } from '@/lib/cms/queries/site';
import type {
  ResearchFullProps,
  ExperimentDetailProps,
  ResumeProps,
  ExperimentExtra,
} from '@/lib/cms/types';

/** Research article — combined query for post + sections + author */
export function useResearchPost(slug: string) {
  return useQuery({
    queryKey: ['cms', 'research', slug],
    queryFn: async (): Promise<ResearchFullProps | null> => {
      const post = await getPostBySlug(supabase, slug);
      if (!post) return null;

      const [sections, settings] = await Promise.all([
        getPostSections(supabase, post.id),
        getSiteSettings(supabase),
      ]);

      return toResearchFullProps(post, sections, settings?.author_name ?? '');
    },
    staleTime: 1000 * 60 * 10,
  });
}

/** Experiment detail — post + screenshots */
export function useExperimentDetail(slug: string) {
  return useQuery({
    queryKey: ['cms', 'experiment', slug],
    queryFn: async (): Promise<ExperimentDetailProps | null> => {
      const post = await getPostBySlug(supabase, slug);
      if (!post) return null;

      const extra = (post.extra ?? {}) as ExperimentExtra;
      const mediaIds = extra.screenshot_media_ids ?? [];
      const mediaRows = await getMediaByIds(supabase, mediaIds);

      return toExperimentDetailProps(post, mediaRows);
    },
    staleTime: 1000 * 60 * 10,
  });
}

/** Resume — single post with structured extra */
export function useResumeData() {
  return useQuery({
    queryKey: ['cms', 'resume'],
    queryFn: async (): Promise<ResumeProps | null> => {
      const post = await getPostBySlug(supabase, 'main');
      if (!post) return null;
      return toResumeProps(post);
    },
    staleTime: 1000 * 60 * 10,
  });
}
