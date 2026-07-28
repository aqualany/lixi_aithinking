// src/hooks/cms/useNavigation.ts
// Phase 3: Data access layer

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getNavigation } from '@/lib/cms/queries/navigation';
import { getSiteSettings } from '@/lib/cms/queries/site';
import { toFixedNavProps, toFooterProps } from '@/lib/cms/mappers';
import type { FixedNavProps, FooterProps } from '@/lib/cms/types';

export function useHeaderNav(): { data: FixedNavProps | null; isLoading: boolean } {
  const navQuery = useQuery({
    queryKey: ['cms', 'navigation', 'header'],
    queryFn: () => getNavigation(supabase, 'header'),
    staleTime: 1000 * 60 * 10,
  });

  const settingsQuery = useQuery({
    queryKey: ['cms', 'site_settings'],
    queryFn: () => getSiteSettings(supabase),
    staleTime: 1000 * 60 * 10,
  });

  return {
    data:
      settingsQuery.data && navQuery.data
        ? toFixedNavProps(settingsQuery.data, navQuery.data)
        : null,
    isLoading: navQuery.isLoading || settingsQuery.isLoading,
  };
}

export function useFooterProps(): { data: FooterProps | null; isLoading: boolean } {
  const navQuery = useQuery({
    queryKey: ['cms', 'navigation', 'footer'],
    queryFn: () => getNavigation(supabase, 'footer'),
    staleTime: 1000 * 60 * 10,
  });

  const settingsQuery = useQuery({
    queryKey: ['cms', 'site_settings'],
    queryFn: () => getSiteSettings(supabase),
    staleTime: 1000 * 60 * 10,
  });

  return {
    data:
      settingsQuery.data && navQuery.data
        ? toFooterProps(settingsQuery.data, navQuery.data)
        : null,
    isLoading: navQuery.isLoading || settingsQuery.isLoading,
  };
}
