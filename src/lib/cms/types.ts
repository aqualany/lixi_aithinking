// src/lib/cms/types.ts — DB row types + Extra JSON shapes
// Phase 3: Data access layer

import type { Database } from '@/integrations/supabase/types';

// Phase 7.1 fields (added via SQL migration, not yet in generated types)
interface Phase71Fields {
  favicon_media_id?: string | null;
  contact_links?: any;
  category_label?: string;
  type_label?: string;
  back_label?: string;
  seo_title?: string;
  media_category?: string;
  display_number?: string;
}

// Extended DB row types with Phase 7.1 migration fields
export type SiteSettingsRow = Database['public']['Tables']['site_settings']['Row'] & Phase71Fields;
export type ContentTypeRow = Database['public']['Tables']['content_types']['Row'] & Phase71Fields;
export type PageRow = Database['public']['Tables']['pages']['Row'] & Phase71Fields;
export type PostRow = Database['public']['Tables']['posts']['Row'] & Phase71Fields;
export type PostSectionRow = Database['public']['Tables']['post_sections']['Row'];
export type NavigationRow = Database['public']['Tables']['navigation']['Row'];
export type MediaRow = Database['public']['Tables']['media']['Row'] & Phase71Fields;

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
  /** Truncated ~50% body for homepage preview */
  previewBodyMd?: string;
  /** From content_types — e.g. "研究 · 论文" */
  typeLabelMeta?: string;
  categoryLabelMeta?: string;
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
  pageDescription?: string;
  categoryLabel?: string;
  typeLabel?: string;
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
  summary: string;
  bodyMd: string;
  categoryLabel?: string;
  typeLabel?: string;
  backLabel?: string;
}

export interface ResumeProps {
  title: string;
  summary: string;
  experience: ResumeEntry[];
  education: ResumeEntry[];
  writings: ResumeWriting[];
  skills: string[];
}

export interface ContactLink {
  label: string;
  value: string;
  href: string;
}

export interface FooterProps {
  authorName: string;
  authorNameEn: string;
  links: { label: string; href: string; isExternal: boolean }[];
  contactLinks?: ContactLink[];
  contactEmail?: string;
  githubUrl?: string;
}

export interface PostDisplayProps {
  categoryLabel: string;
  typeLabel: string;
  number: string;
  backLabel: string;
}

export interface PageSeoProps {
  title: string;
  description: string;
}
