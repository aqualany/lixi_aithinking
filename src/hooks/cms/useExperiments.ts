// src/hooks/cms/useExperiments.ts
// Phase 3: Data access layer

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getPostsByContentType } from '@/lib/cms/queries/posts';
import { toExperimentCardData } from '@/lib/cms/mappers';
import type { ExperimentsListProps } from '@/lib/cms/types';

export function useExperimentsList(): {
  data: ExperimentsListProps | null;
  isLoading: boolean;
} {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['cms', 'experiments'],
    queryFn: () => getPostsByContentType(supabase, 'experiment'),
    staleTime: 1000 * 60 * 10,
  });

  return {
    data: posts ? { experiments: toExperimentCardData(posts) } : null,
    isLoading,
  };
}
