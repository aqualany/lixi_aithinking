import type { ResumeProps } from "@/lib/cms/types";

type Entry = {
  year: string;
  role: string;
  org: string;
  detail: string;
};

function CVList({ entries }: { entries: Entry[] }) {
  return (
    <ol className="space-y-8">
      {entries.map((e) => (
        <li
          key={e.year + e.role}
          className="grid gap-x-6 gap-y-2 border-b border-border pb-8 last:border-b-0 last:pb-0 md:grid-cols-[7rem_1fr]"
        >
          <p className="font-mono text-[12px] tracking-[0.12em] text-muted-foreground pt-1">
            {e.year}
          </p>
          <div>
            <h4 className="font-serif text-[19px] leading-[1.5] tracking-[0.02em] text-foreground">
              {e.role}
            </h4>
            <p className="mt-1 font-sans text-[13px] tracking-[0.02em] text-muted-foreground">
              {e.org}
            </p>
            <p
              className="mt-3 font-serif text-[15.5px] leading-[1.9] tracking-[0.01em] text-foreground"
              dangerouslySetInnerHTML={{ __html: e.detail }}
            />
          </div>
        </li>
      ))}
    </ol>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-16 grid gap-8 border-t border-border pt-10 md:grid-cols-[12rem_1fr] md:gap-x-12">
      <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </h3>
      <div>{children}</div>
    </div>
  );
}

export function Resume({ data }: { data?: ResumeProps }) {
  // Item 8: No hardcoded fallback — render nothing if no data
  if (!data) return null;

  const { title, summary, experience, education, writings, skills } = data;

  return (
    <section
      id="resume"
      className="scroll-mt-24 border-t border-border bg-background"
    >
      <div className="mx-auto max-w-3xl px-6 py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          简历 · 03
        </p>
        <h2 className="mt-6 zh-title font-serif text-[36px] leading-[1.35] tracking-[0.02em] text-foreground sm:text-[44px]">
          {title}
        </h2>
        <p className="mt-6 font-serif text-[16px] leading-[1.9] tracking-[0.01em] text-muted-foreground">
          {summary}
        </p>

        <Section label="工作经历">
          <CVList entries={experience} />
        </Section>

        <Section label="教育">
          <CVList entries={education} />
        </Section>

        <Section label="部分写作">
          <ol className="space-y-5">
            {writings.map((w) => (
              <li
                key={w.title}
                className="grid gap-x-6 gap-y-1 md:grid-cols-[7rem_1fr]"
              >
                <p className="font-mono text-[12px] tracking-[0.12em] text-muted-foreground pt-1">
                  {w.year}
                </p>
                <div>
                  <p className="font-serif text-[16.5px] leading-[1.6] tracking-[0.02em] text-foreground">
                    {w.title}
                  </p>
                  <p className="mt-1 font-sans text-[13px] text-muted-foreground">
                    {w.venue}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section label="工作方法 / 技能">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 font-serif text-[15.5px] leading-[1.85] text-foreground sm:grid-cols-2">
            {skills.map((s) => (
              <li key={s} className="before:content-['—'] before:mr-2 before:text-muted-foreground">
                {s}
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </section>
  );
}
