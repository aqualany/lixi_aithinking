// src/components/portfolio/ArticleDirectory.tsx
// Site-wide article directory shown at the bottom of article pages.
// Lists all published articles (research + experiments, no resume).

import { Link } from "@tanstack/react-router";
import type { ArticleDirectoryItem, ExperimentCardData } from "@/lib/cms/types";

/** Build the site-wide article directory from CMS data (research + experiments). */
export function buildArticleDirectory(opts: {
  researchTitle?: string | null;
  experiments?: ExperimentCardData[];
}): ArticleDirectoryItem[] {
  const items: ArticleDirectoryItem[] = [];
  if (opts.researchTitle) {
    items.push({ key: "research", title: opts.researchTitle, to: "/research" });
  }
  for (const e of opts.experiments ?? []) {
    items.push({
      key: `experiment:${e.slug}`,
      title: e.title,
      to: "/experiments/$slug",
      params: { slug: e.slug },
    });
  }
  return items;
}

export function ArticleDirectory({
  items,
  currentKey,
}: {
  items: ArticleDirectoryItem[];
  currentKey?: string;
}) {
  if (!items || items.length === 0) return null;

  return (
    <div className="mt-20 border-t border-border pt-12">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
        全站文章
      </p>
      <ul className="mt-6 space-y-3">
        {items.map((item) =>
          item.key === currentKey ? (
            <li key={item.key}>
              <span className="font-serif text-[16px] leading-[1.8] text-foreground">
                {item.title}
              </span>
            </li>
          ) : (
            <li key={item.key}>
              <Link
                to={item.to as any}
                params={item.params as any}
                className="font-serif text-[16px] leading-[1.8] text-foreground transition-colors hover:text-muted-foreground"
              >
                {item.title}
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
