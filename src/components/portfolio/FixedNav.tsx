import { useEffect, useState } from "react";

const sections = [
  { id: "research", label: "Research" },
  { id: "experiments", label: "AI Experiments" },
  { id: "resume", label: "Resume" },
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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-serif text-lg tracking-tight text-foreground">
          Lin&nbsp;Yuan
        </a>
        <ul className="flex items-center gap-6 sm:gap-10 text-sm">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={
                  "transition-colors " +
                  (active === s.id
                    ? "text-foreground border-b border-foreground pb-1"
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