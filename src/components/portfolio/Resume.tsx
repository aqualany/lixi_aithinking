import type { ResumeProps, ResumeEntry } from "@/lib/cms/types";

/** 把后台编辑框里的多段描述按段落渲染：\n\n 分段，段内 \n 换行。 */
function Detail({ text }: { text: string }) {
  const paragraphs = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return (
    <>
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className="mt-3 font-serif text-[15.5px] leading-[1.9] tracking-[0.01em] text-foreground"
        >
          {p.split('\n').map((line, j) => (
            <span key={j}>
              {j > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
      ))}
    </>
  );
}

function AttachmentLink({ attachment }: { attachment: NonNullable<ResumeEntry['attachment']> }) {
  const display = attachment.name.endsWith('.pdf') ? attachment.name : `${attachment.name}.pdf`;
  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.08em] text-foreground underline underline-offset-4 decoration-[0.5px] transition-opacity hover:opacity-60"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
      </svg>
      {display}
    </a>
  );
}

function CVList({ entries }: { entries: ResumeEntry[] }) {
  return (
    <ol className="space-y-8">
      {entries.map((e, idx) => (
        <li
          key={e.year + e.role + idx}
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
            <Detail text={e.detail} />
            {e.attachment && <AttachmentLink attachment={e.attachment} />}
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

  const { title, summary, experience, education } = data;

  return (
    <section
      id="resume"
      className="scroll-mt-24 border-t border-border bg-background"
    >
      <div className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="zh-title font-serif text-[36px] leading-[1.35] tracking-[0.02em] text-foreground sm:text-[44px]">
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
      </div>
    </section>
  );
}
