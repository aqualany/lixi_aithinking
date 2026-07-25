import { Link, useLocation } from "@tanstack/react-router";

const sections = [
  { id: "research", label: "研究" },
  { id: "experiments", label: "实验" },
  { id: "resume", label: "简历" },
] as const;

type SectionId = (typeof sections)[number]["id"];

export function FixedNav({
  activeTab,
  onTabChange,
}: {
  activeTab?: SectionId;
  onTabChange?: (id: SectionId) => void;
}) {
  const location = useLocation();
  const onHome = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-6">
        <Link
          to="/"
          className="flex items-baseline gap-3 font-serif text-[15px] tracking-[0.05em] text-foreground"
        >
          <span>聂灵晞</span>
          <span className="hidden sm:inline text-[11px] font-sans tracking-[0.2em] text-muted-foreground uppercase">
            Nie Lingxi
          </span>
        </Link>
        <ul className="flex items-center gap-6 sm:gap-9 text-[13px]">
          {sections.map((s) => {
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
      </div>
    </nav>
  );
}