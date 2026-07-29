import type { SectionTabsProps } from "@/lib/cms/types";

export type TabId = "research" | "experiments" | "resume";

export function SectionTabs({
  active,
  onChange,
  data,
}: {
  active: TabId;
  onChange: (id: string) => void;
  data?: SectionTabsProps;
}) {
  // Item 8: NO hardcoded fallback tabs — if no data, render nothing
  if (!data || !data.tabs || data.tabs.length === 0) return null;

  return (
    <section className="mx-auto max-w-3xl px-6">
      <div className="border-y border-border">
        <ul className="flex items-stretch">
          {data.tabs.map((t) => {
            const isActive = active === t.id;
            return (
              <li key={t.id} className="flex-1">
                <button
                  type="button"
                  onClick={() => onChange(t.id as TabId)}
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
