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
  let contactLinks: ContactLink[] = [];
  if (Array.isArray((settings as any).contact_links)) {
    contactLinks = (settings as any).contact_links as ContactLink[];
  } else if (settings.contact_email || settings.github_url) {
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
  contentType?: ContentTypeRow,
): ResearchFullProps {
  const extra = (post.extra ?? {}) as ResearchExtra;
  const bodyMd = post.body_md;
  // Compute ~50% truncated preview at nearest paragraph break
  const halfLen = Math.floor(bodyMd.length / 4);
  const previewBodyMd = bodyMd.length > 200
    ? (() => {
        // Find nearest paragraph break around 50%
        const before = bodyMd.lastIndexOf('\n\n', halfLen);
        const after = bodyMd.indexOf('\n\n', halfLen);
        const cut = (before > halfLen - 200 && before > 0) ? before
                  : (after > 0 && after < halfLen + 200) ? after
                  : halfLen;
        return bodyMd.slice(0, Math.max(cut, 1));
      })()
    : bodyMd;
  return {
    title: post.title,
    authorName,
    date: formatChineseDate(post.published_at),
    wordCount: extra.word_count ?? 0,
    summary: post.summary,
    sections: [...sections]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((s) => ({ id: s.anchor, heading: s.title })),
    bodyMd,
    previewBodyMd,
    typeLabelMeta: contentType ? `${contentType.category_label || ''} · ${contentType.type_label || ''}` : undefined,
    categoryLabelMeta: contentType?.category_label || undefined,
  };
}

// ── Experiments list ──────────────────────────────────────

export function toExperimentCardData(posts: PostRow[], contentTypes?: ContentTypeRow[]): ExperimentCardData[] {
  const ctMap = new Map(contentTypes?.map(ct => [ct.id, ct]) ?? []);
  return [...posts]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((p) => {
      const extra = (p.extra ?? {}) as ExperimentExtra;
      const ct = ctMap.get(p.content_type_id);
      return {
        slug: p.slug,
        num: extra.num ?? (p as any).display_number ?? '',
        date: formatExperimentDate(p.published_at),
        category: ct?.category_label || p.subtitle,
        title: p.title,
        keyInsight: p.summary,
      };
    });
}

// ── Experiment detail ─────────────────────────────────────

export function toExperimentDetailProps(
  post: PostRow,
  mediaRows: MediaRow[],
  contentType?: ContentTypeRow,
): ExperimentDetailProps {
  const extra = (post.extra ?? {}) as ExperimentExtra;
  const extraCategory = extra as any;

  // Build screenshot URLs from media rows
  const screenshotUrls = mediaRows.map((m) => m.public_url);

  return {
    num: extra.num ?? (post as any).display_number ?? '',
    date: formatExperimentDate(post.published_at),
    category: extraCategory.category ?? post.subtitle,
    title: post.title,
    hypothesis: extra.hypothesis ?? '',
    optimization: extra.optimization ?? [],
    selfTraining: extra.self_training ?? [],
    screenshotUrls,
    summary: post.summary,
    bodyMd: post.body_md,
    categoryLabel: contentType?.category_label || post.subtitle,
    typeLabel: contentType?.type_label || contentType?.name || '',
    backLabel: undefined, // set by caller if available
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
