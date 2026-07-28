import { Link, useLocation } from "@tanstack/react-router";
import type { FixedNavProps } from "@/lib/cms/types";

const FALLBACK_SECTIONS = [
  { id: "research", label: "研究" },
  { id: "experiments", label: "实验" },
  { id: "resume", label: "简历" },
];

const FALLBACK_PROPS: FixedNavProps = {
  authorName: "聂灵晞",
  authorNameEn: "Nie Lingxi",
  sections: FALLBACK_SECTIONS.map((s) => ({
    id: s.id,
    label: s.label,
    href: `/#${s.id}`,
  })),
};

type SectionId = (typeof FALLBACK_SECTIONS)[number]["id"];

export function FixedNav({
  activeTab,
  onTabChange,
  data,
}: {
  activeTab?: SectionId;
  onTabChange?: (id: SectionId) => void;
  data?: FixedNavProps;
}) {
  const d = data ?? FALLBACK_PROPS;
  const location = useLocation();
  const onHome = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-6">
        <Link
          to="/"
          className="flex items-baseline gap-3 font-serif text-[15px] tracking-[0.05em] text-foreground"
        >
          <span>{d.authorName}</span>
          <span className="hidden sm:inline text-[11px] font-sans tracking-[0.2em] text-muted-foreground uppercase">
            {d.authorNameEn}
          </span>
        </Link>
        <ul className="flex items-center gap-6 sm:gap-9 text-[13px]">
          {d.sections.map((s) => {
            const isActive = onHome && activeTab === (s.id as SectionId);
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
                    onClick={() => onTabChange(s.id as SectionId)}
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
      </div>
    </nav>
  );
}
