// src/lib/cms/mappers.ts — Supabase rows → component props
// Phase 3: Data access layer

import type {
  SiteSettingsRow,
  NavigationRow,
  PostRow,
  PostSectionRow,
  PageRow,
  MediaRow,
  ContentTypeRow,
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
  PostDisplayProps,
  ContactLink,
} from './types';
import { extractHeadings } from './rich-html';

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

export { formatChineseDate };

function formatExperimentDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()} · ${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export { formatExperimentDate };

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
  let contactLinks: ContactLink[] = [];
  const rawContactLinks = (settings as any).contact_links;
  if (Array.isArray(rawContactLinks) && rawContactLinks.length > 0) {
    contactLinks = rawContactLinks as ContactLink[];
  }
  if (contactLinks.length === 0) {
    if (settings.contact_email) {
      contactLinks.push({ label: settings.contact_email, value: settings.contact_email, href: `mailto:${settings.contact_email}` });
    }
    if (settings.github_url) {
      contactLinks.push({ label: 'GitHub', value: settings.github_url, href: settings.github_url });
    }
  }
  return {
    authorName: settings.author_name,
    authorNameEn: settings.author_name_en,
    links,
    contactLinks,
    contactEmail: settings.contact_email || undefined,
    githubUrl: settings.github_url || undefined,
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
    title: (page as any).seo_title || page.title,
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
  const bodyMd = post.body_md;
  const bodyHtml = (extra as any).body_html ?? '';
  // Compute ~25% truncated preview at nearest paragraph break (markdown only)
  const quarterLen = Math.floor(bodyMd.length / 4);
  const previewBodyMd = bodyMd.length > 200
    ? (() => {
        const before = bodyMd.lastIndexOf('\n\n', quarterLen);
        const after = bodyMd.indexOf('\n\n', quarterLen);
        const cut = (before > quarterLen - 200 && before > 0) ? before
                  : (after > 0 && after < quarterLen + 200) ? after
                  : quarterLen;
        return bodyMd.slice(0, Math.max(cut, 1));
      })()
    : bodyMd;
  return {
    title: post.title,
    subtitle: post.subtitle ?? '',
    authorName,
    date: formatChineseDate(post.published_at),
    wordCount: extra.word_count ?? 0,
    summary: post.summary,
    sections: [...sections]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((s) => ({ id: s.anchor, heading: s.title })),
    bodyMd,
    bodyHtml: bodyHtml || undefined,
    previewBodyMd,
    previewBodyHtml: bodyHtml || undefined,
    typeLabelMeta: post.tag ?? '',
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
        num: extra.num ?? (p as any).display_number ?? '',
        date: formatExperimentDate(p.published_at),
        category: p.tag ?? '',
        title: p.title,
        keyInsight: p.summary,
      };
    });
}

// ── Experiment detail ─────────────────────────────────────

export function toExperimentDetailProps(post: PostRow): ExperimentDetailProps {
  const extra = (post.extra ?? {}) as ExperimentExtra;
  const bodyHtml = (extra as any).body_html ?? '';
  const bodyMd = post.body_md;
  // Auto TOC from body H1/H2/H3 — identical rules to research article
  const sections = (bodyHtml || '').trim()
    ? extractHeadings(bodyHtml).map((s) => ({ id: s.anchor, heading: s.title }))
    : [];

  return {
    num: extra.num ?? (post as any).display_number ?? '',
    date: formatExperimentDate(post.published_at),
    category: post.tag ?? '',
    subtitle: post.subtitle ?? '',
    title: post.title,
    summary: post.summary,
    bodyMd,
    bodyHtml: bodyHtml || undefined,
    sections,
    categoryLabel: post.tag ?? '',
    backLabel: undefined,
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
