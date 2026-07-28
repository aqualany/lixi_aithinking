// src/lib/cms/types.ts — DB row types + Extra JSON shapes
// Phase 3: Data access layer

import type { Database } from '@/integrations/supabase/types';

// Re-export Supabase-generated row types
export type SiteSettingsRow = Database['public']['Tables']['site_settings']['Row'];
export type PageRow = Database['public']['Tables']['pages']['Row'];
export type NavigationRow = Database['public']['Tables']['navigation']['Row'];
export type ContentTypeRow = Database['public']['Tables']['content_types']['Row'];
export type PostRow = Database['public']['Tables']['posts']['Row'];
export type PostSectionRow = Database['public']['Tables']['post_sections']['Row'];
export type MediaRow = Database['public']['Tables']['media']['Row'];

// ── Extra JSON shapes (stored in posts.extra) ──────────────

export interface ExperimentExtra {
  num: string;
  hypothesis: string;
  optimization: string[];
  self_training: string[];
  screenshot_media_ids: string[];
}

export interface ResumeEntry {
  year: string;
  role: string;
  org: string;
  detail: string;
}

export interface ResumeWriting {
  year: string;
  title: string;
  venue: string;
}

export interface ResumeExtra {
  experience: ResumeEntry[];
  education: ResumeEntry[];
  writings: ResumeWriting[];
  skills: string[];
}

export interface ResearchExtra {
  word_count?: number;
}

// ── Component prop shapes (output of mappers) ──────────────

export interface HeroProps {
  authorName: string;
  authorNameEn: string;
  heroEyebrow: string;
  bioLines: string[];
  avatarUrl: string | null;
}

export interface FixedNavProps {
  authorName: string;
  authorNameEn: string;
  sections: { id: string; label: string; href: string }[];
}

export interface SectionTabsProps {
  tabs: { id: string; label: string; hint: string }[];
}

export interface ResearchSection {
  id: string;
  heading: string;
}

export interface ResearchFullProps {
  title: string;
  authorName: string;
  date: string;
  wordCount: number;
  summary: string;
  sections: ResearchSection[];
  bodyMd: string;
}

export interface ExperimentCardData {
  slug: string;
  num: string;
  date: string;
  category: string;
  title: string;
  keyInsight: string;
}

export interface ExperimentsListProps {
  experiments: ExperimentCardData[];
}

export interface ExperimentDetailProps {
  num: string;
  date: string;
  category: string;
  title: string;
  hypothesis: string;
  optimization: string[];
  selfTraining: string[];
  screenshotUrls: string[];
}

export interface ResumeProps {
  title: string;
  summary: string;
  experience: ResumeEntry[];
  education: ResumeEntry[];
  writings: ResumeWriting[];
  skills: string[];
}

export interface FooterProps {
  authorName: string;
  authorNameEn: string;
  links: { label: string; href: string; isExternal: boolean }[];
}

export interface PageSeoProps {
  title: string;
  description: string;
}
