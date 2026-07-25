export type TabId = "research" | "experiments" | "resume";

const tabs: { id: TabId; label: string; hint: string }[] = [
  { id: "research", label: "研究", hint: "01" },
  { id: "experiments", label: "实验笔记", hint: "02" },
  { id: "resume", label: "简历", hint: "03" },
];

export function SectionTabs({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (id: TabId) => void;
}) {
  return (
    <section className="mx-auto max-w-3xl px-6">
      <div className="border-y border-border">
        <ul className="flex items-stretch">
          {tabs.map((t) => {
            const isActive = active === t.id;
            return (
              <li key={t.id} className="flex-1">
                <button
                  type="button"
                  onClick={() => onChange(t.id)}
                  className={
                    "group flex w-full items-baseline justify-center gap-3 py-4 transition-colors " +
                    (isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground")
                  }
                >
                  <span className="font-mono text-[11px] tracking-[0.2em]">
                    {t.hint}
                  </span>
                  <span
                    className={
                      "font-serif text-[16px] tracking-[0.08em] " +
                      (isActive
                        ? "border-b border-foreground pb-1"
                        : "")
                    }
                  >
                    {t.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}