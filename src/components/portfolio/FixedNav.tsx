import { Link, useLocation } from "@tanstack/react-router";
import type { FixedNavProps } from "@/lib/cms/types";

type SectionId = string;

export function FixedNav({
  activeTab,
  onTabChange,
  data,
}: {
  activeTab?: SectionId;
  onTabChange?: (id: SectionId) => void;
  data?: FixedNavProps;
}) {
  const location = useLocation();
  const onHome = location.pathname === "/";

  // Item 8: No hardcoded content — if no data, render empty
  if (!data) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-6">
        <Link
          to="/"
          className="flex items-baseline gap-3"
        >
          <span className="font-serif text-[15px] tracking-[0.05em] text-foreground">{data.authorName}</span>
          <span className="hidden sm:inline font-sans text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {data.authorNameEn}
          </span>
        </Link>
        {data.sections.length > 0 && (
          <ul className="flex items-center gap-6 sm:gap-9 text-[13px]">
            {data.sections.map((s) => {
              const isActive = onHome && activeTab === s.id;
              const className =
                "transition-colors tracking-[0.15em] " +
                (isActive
                  ? "text-foreground border-b border-foreground pb-0.5"
                  : "text-muted-foreground hover:text-foreground");
              if (onHome && onTabChange) {
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      className={className}
                      onClick={() => onTabChange(s.id)}
                    >
                      {s.label}
                    </button>
                  </li>
                );
              }
              return (
                <li key={s.id}>
                  <Link to="/" hash={s.id} className={className}>
                    {s.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </nav>
  );
}
