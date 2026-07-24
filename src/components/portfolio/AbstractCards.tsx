const items = [
  {
    num: "01",
    href: "#research",
    eyebrow: "Essay",
    title: "On Writing, Language, and Creative Data",
    body: "A long-form essay on why generative writing systems still struggle with meaning, and what a product-minded approach to creative data can change.",
  },
  {
    num: "02",
    href: "#experiments",
    eyebrow: "Experiments",
    title: "Poetry & Fiction Generation Studies",
    body: "Three prompt-iteration case studies covering imagist poetry, dialogue-driven micro-fiction, and voice preservation across languages.",
  },
  {
    num: "03",
    href: "#resume",
    eyebrow: "Background",
    title: "Professional Résumé",
    body: "Five years across NLP product, creative AI tooling, and data curation for large language model training.",
  },
];

export function AbstractCards() {
  return (
    <section className="mx-auto max-w-6xl border-y border-border">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {items.map((it, i) => (
          <a
            key={it.num}
            href={it.href}
            className={
              "group block px-6 py-10 transition-colors hover:bg-muted " +
              (i < items.length - 1 ? "md:border-r md:border-border border-b md:border-b-0 border-border" : "")
            }
          >
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {it.num} · {it.eyebrow}
              </span>
              <span className="text-muted-foreground transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </div>
            <h3 className="mt-6 font-serif text-2xl leading-snug text-foreground">
              {it.title}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {it.body}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}