type Entry = {
  year: string;
  role: string;
  org: string;
  detail: string;
};

const experience: Entry[] = [
  {
    year: "2024 — Present",
    role: "Creative Data Lead",
    org: "Independent · Consulting for LLM Labs",
    detail:
      "Designed human-in-the-loop pipelines for literary and dialogue data. Built annotation schemas capturing revision trajectories, voice invariants, and editorial constraints.",
  },
  {
    year: "2022 — 2024",
    role: "Senior Product Manager, NLP",
    org: "Bytewave AI",
    detail:
      "Led the creative writing assistant product line. Owned prompt design, evaluation frameworks, and the writer-facing data collection surface used to fine-tune a 34B model.",
  },
  {
    year: "2020 — 2022",
    role: "Product Manager, Language Tools",
    org: "Wenzhi Technology",
    detail:
      "Shipped a bilingual editing product for translators. Ran the reviewer program that produced the internal parallel-revision corpus.",
  },
  {
    year: "2018 — 2020",
    role: "Editorial Data Analyst",
    org: "Owl Press",
    detail:
      "Bridged editorial and engineering teams. First exposure to the gap between what editors know and what training corpora record.",
  },
];

const education: Entry[] = [
  {
    year: "2016 — 2018",
    role: "M.A., Comparative Literature",
    org: "Fudan University",
    detail: "Thesis on formal constraint in modernist poetry.",
  },
  {
    year: "2012 — 2016",
    role: "B.S., Computer Science; Minor in Chinese Literature",
    org: "Zhejiang University",
    detail: "Combined coursework in NLP and classical Chinese poetics.",
  },
];

const skills = [
  "Creative data pipeline design",
  "Human annotation program management",
  "Prompt evaluation frameworks",
  "LLM fine-tuning collaboration",
  "Editorial & literary judgement",
  "Bilingual (Mandarin / English)",
  "Python, SQL",
  "Reader panel research",
];

function Timeline({ entries }: { entries: Entry[] }) {
  return (
    <ol className="relative border-l border-border">
      {entries.map((e) => (
        <li key={e.year + e.role} className="relative pl-8 pb-12 last:pb-0">
          <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-foreground" />
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {e.year}
          </p>
          <h4 className="mt-2 font-serif text-xl text-foreground">{e.role}</h4>
          <p className="mt-1 text-sm text-muted-foreground">{e.org}</p>
          <p className="mt-3 leading-relaxed text-foreground">{e.detail}</p>
        </li>
      ))}
    </ol>
  );
}

export function Resume() {
  return (
    <section
      id="resume"
      className="scroll-mt-24 border-t border-border bg-background"
    >
      <div className="mx-auto max-w-4xl px-6 py-24">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Section 03 · Résumé
        </p>
        <h2 className="mt-6 font-serif text-4xl leading-tight text-foreground sm:text-5xl">
          Background
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Five years across NLP product, creative AI tooling, and data curation
          for large language model training. Selected roles below.
        </p>

        <div className="mt-16 grid gap-16 md:grid-cols-[220px_1fr]">
          <h3 className="font-serif text-2xl text-foreground">Experience</h3>
          <Timeline entries={experience} />
        </div>

        <div className="mt-16 grid gap-16 border-t border-border pt-16 md:grid-cols-[220px_1fr]">
          <h3 className="font-serif text-2xl text-foreground">Education</h3>
          <Timeline entries={education} />
        </div>

        <div className="mt-16 grid gap-16 border-t border-border pt-16 md:grid-cols-[220px_1fr]">
          <h3 className="font-serif text-2xl text-foreground">Skills</h3>
          <ul className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <li
                key={s}
                className="border border-border px-3 py-1.5 text-sm text-foreground"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}