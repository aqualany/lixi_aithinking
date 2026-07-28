// src/lib/cms/mappers.ts — Supabase rows → component props
// Phase 3: Data access layer

import type {
  SiteSettingsRow,
  NavigationRow,
  PostRow,
  PostSectionRow,
  PageRow,
  MediaRow,
  ExperimentExtra,
  ResumeExtra,
  ResearchExtra,
  HeroProps,
  FixedNavProps,
  SectionTabsProps,
  ResearchFullProps,
  ExperimentCardData,
  ExperimentDetailProps,
  ResumeProps,
  FooterProps,
  PageSeoProps,
} from './types';

// ── Helpers ────────────────────────────────────────────────

function formatChineseDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const chineseMonths = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
  const cnYear = String(year)
    .split('')
    .map((c) => '〇一二三四五六七八九'[parseInt(c)])
    .join('');
  return `${cnYear}年${chineseMonths[month - 1]}月`;
}

function formatExperimentDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()} · ${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function padHint(n: number): string {
  return String(n + 1).padStart(2, '0');
}

// ── Site settings ──────────────────────────────────────────

export function toHeroProps(
  settings: SiteSettingsRow,
  avatarUrl: string | null,
): HeroProps {
  return {
    authorName: settings.author_name,
    authorNameEn: settings.author_name_en,
    heroEyebrow: settings.hero_eyebrow,
    bioLines: settings.bio_lines ?? [],
    avatarUrl,
  };
}

export function toFixedNavProps(
  settings: SiteSettingsRow,
  navItems: NavigationRow[],
): FixedNavProps {
  return {
    authorName: settings.author_name,
    authorNameEn: settings.author_name_en,
    sections: navItems.map((n) => ({
      id: n.href.replace('/#', ''),
      label: n.label,
      href: n.href,
    })),
  };
}

export function toFooterProps(
  settings: SiteSettingsRow,
  footerNavItems: NavigationRow[],
): FooterProps {
  const links = footerNavItems.map((n) => ({
    label: n.label,
    href: n.href,
    isExternal: n.is_external,
  }));
  return {
    authorName: settings.author_name,
    authorNameEn: settings.author_name_en,
    links,
  };
}

export function toSiteSeoProps(settings: SiteSettingsRow): PageSeoProps {
  return {
    title: settings.site_title,
    description: settings.site_description,
  };
}

// ── Pages / tabs ──────────────────────────────────────────

export function toSectionTabsProps(
  pages: PageRow[],
  headerNav?: NavigationRow[],
): SectionTabsProps {
  // Only section pages (skip landing pages like "home")
  const sectionPages = pages.filter((p) => p.slug !== 'home');
  const sorted = [...sectionPages].sort((a, b) => a.sort_order - b.sort_order);

  // Build a quick lookup: slug → label from header navigation
  const navLabelMap: Record<string, string> = {};
  if (headerNav) {
    for (const nav of headerNav) {
      const key = nav.href.replace('/#', '');
      navLabelMap[key] = nav.label;
    }
  }

  return {
    tabs: sorted.map((p, i) => ({
      id: p.slug,
      label: navLabelMap[p.slug] ?? p.title,
      hint: padHint(i),
    })),
  };
}

export function toPageSeoProps(page: PageRow): PageSeoProps {
  return {
    title: page.title,
    description: page.description,
  };
}

// ── Research article ──────────────────────────────────────

export function toResearchFullProps(
  post: PostRow,
  sections: PostSectionRow[],
  authorName: string,
): ResearchFullProps {
  const extra = (post.extra ?? {}) as ResearchExtra;
  return {
    title: post.title,
    authorName,
    date: formatChineseDate(post.published_at),
    wordCount: extra.word_count ?? 0,
    summary: post.summary,
    sections: [...sections]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((s) => ({ id: s.anchor, heading: s.title })),
    bodyMd: post.body_md,
  };
}

// ── Experiments list ──────────────────────────────────────

export function toExperimentCardData(posts: PostRow[]): ExperimentCardData[] {
  return [...posts]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((p) => {
      const extra = (p.extra ?? {}) as ExperimentExtra;
      return {
        slug: p.slug,
        num: extra.num ?? '',
        date: formatExperimentDate(p.published_at),
        category: p.subtitle,
        title: p.title,
        keyInsight: p.summary,
      };
    });
}

// ── Experiment detail ─────────────────────────────────────

export function toExperimentDetailProps(
  post: PostRow,
  mediaRows: MediaRow[],
): ExperimentDetailProps {
  const extra = (post.extra ?? {}) as ExperimentExtra;
  const extraCategory = extra as any;

  // Build screenshot URLs from media rows
  const screenshotUrls = mediaRows.map((m) => m.public_url);

  return {
    num: extra.num ?? '',
    date: formatExperimentDate(post.published_at),
    category: extraCategory.category ?? post.subtitle,
    title: post.title,
    hypothesis: extra.hypothesis ?? '',
    optimization: extra.optimization ?? [],
    selfTraining: extra.self_training ?? [],
    screenshotUrls,
  };
}

// ── Resume ─────────────────────────────────────────────────

export function toResumeProps(post: PostRow): ResumeProps {
  const extra = (post.extra ?? {}) as ResumeExtra;
  return {
    title: post.title,
    summary: post.summary,
    experience: extra.experience ?? [],
    education: extra.education ?? [],
    writings: extra.writings ?? [],
    skills: extra.skills ?? [],
  };
}
