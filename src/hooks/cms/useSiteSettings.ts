// src/hooks/cms/useSiteSettings.ts
// Phase 3: Data access layer

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getSiteSettings, getAvatarMedia } from '@/lib/cms/queries/site';
import { toHeroProps, toSiteSeoProps } from '@/lib/cms/mappers';
import type { HeroProps, PageSeoProps } from '@/lib/cms/types';

export function useSiteSettings() {
  return useQuery({
    queryKey: ['cms', 'site_settings'],
    queryFn: () => getSiteSettings(supabase),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useHeroProps(): { data: HeroProps | null; isLoading: boolean } {
  const { data: settings, isLoading } = useSiteSettings();
  const avatarQuery = useQuery({
    queryKey: ['cms', 'avatar', settings?.avatar_media_id],
    queryFn: () => getAvatarMedia(supabase, settings?.avatar_media_id ?? null),
    enabled: !!settings,
    staleTime: 1000 * 60 * 10,
  });

  return {
    data: settings ? toHeroProps(settings, avatarQuery.data ?? null) : null,
    isLoading,
  };
}

export function useSiteSeoProps(): { data: PageSeoProps | null; isLoading: boolean } {
  const { data: settings, isLoading } = useSiteSettings();
  return {
    data: settings ? toSiteSeoProps(settings) : null,
    isLoading,
  };
}
