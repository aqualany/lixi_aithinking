// src/hooks/cms/usePages.ts
// Phase 3: Data access layer

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getAllPages, getPageBySlug } from '@/lib/cms/queries/pages';
import { toSectionTabsProps, toPageSeoProps } from '@/lib/cms/mappers';
import type { SectionTabsProps, PageSeoProps } from '@/lib/cms/types';

export function useAllPages() {
  return useQuery({
    queryKey: ['cms', 'pages'],
    queryFn: () => getAllPages(supabase),
    staleTime: 1000 * 60 * 10,
  });
}

export function useSectionTabsProps(): {
  data: SectionTabsProps | null;
  isLoading: boolean;
} {
  const { data: pages, isLoading } = useAllPages();
  return {
    data: pages ? toSectionTabsProps(pages) : null,
    isLoading,
  };
}

export function usePageSeo(slug: string): {
  data: PageSeoProps | null;
  isLoading: boolean;
} {
  const { data, isLoading } = useQuery({
    queryKey: ['cms', 'page', slug],
    queryFn: () => getPageBySlug(supabase, slug),
    staleTime: 1000 * 60 * 10,
  });

  return {
    data: data ? toPageSeoProps(data) : null,
    isLoading,
  };
}
