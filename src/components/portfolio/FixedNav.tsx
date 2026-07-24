import { useEffect, useState } from "react";

const sections = [
  { id: "research", label: "研究" },
  { id: "experiments", label: "实验" },
  { id: "resume", label: "简历" },
];

export function FixedNav() {
  const [active, setActive] = useState<string>("research");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-6">
        <a
          href="#top"
          className="flex items-baseline gap-3 font-serif text-[15px] tracking-[0.05em] text-foreground"
        >
          <span>聂蓝玉</span>
          <span className="hidden sm:inline text-[11px] font-sans tracking-[0.2em] text-muted-foreground uppercase">
            Nie Lanyu
          </span>
        </a>
        <ul className="flex items-center gap-6 sm:gap-9 text-[13px]">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={
                  "transition-colors tracking-[0.15em] " +
                  (active === s.id
                    ? "text-foreground border-b border-foreground pb-0.5"
                    : "text-muted-foreground hover:text-foreground")
                }
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}