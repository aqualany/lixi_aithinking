import { Link } from "@tanstack/react-router";
import type { ExperimentsListProps, ExperimentCardData } from "@/lib/cms/types";

export function Experiments({ data }: { data?: ExperimentsListProps }) {
  if (!data || !data.experiments || data.experiments.length === 0) return null;

  const cards: ExperimentCardData[] = data.experiments;
  const description = data.pageDescription || '';

  return (
    <section
      id="experiments"
      className="scroll-mt-24 border-t border-border bg-background"
    >
      <div className="mx-auto max-w-3xl px-6 py-20">
        {/* No hardcoded "实验笔记" or "提示词作为方法" — everything from DB */}
        {description && (
          <p className="font-serif text-[16.5px] leading-[1.9] tracking-[0.01em] text-muted-foreground">
            {description}
          </p>
        )}

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {cards.map((e) => (
            <Link
              key={e.slug}
              to="/experiments/$slug"
              params={{ slug: e.slug }}
              className="group flex h-full flex-col border border-border p-6 transition-colors hover:border-foreground"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
                  {e.num}
                </span>
                <span className="font-mono text-[11px] tracking-[0.15em] text-muted-foreground">
                  {e.date}
                </span>
              </div>
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {e.category}
              </p>
              <h3 className="mt-3 zh-title font-serif text-[20px] leading-[1.45] tracking-[0.02em] text-foreground">
                {e.title}
              </h3>
              <p className="mt-5 flex-1 font-serif text-[14.5px] leading-[1.85] text-foreground">
                {e.keyInsight}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-foreground">
                进入笔记
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
