export function Hero() {
  return (
    <header id="top" className="mx-auto max-w-3xl px-6 pt-40 pb-20">
      <p className="mb-8 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Research Portfolio · November 2026
      </p>
      <h1 className="font-serif text-5xl leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl">
        On Writing, Language, and the Data That Teaches Machines to Imagine
      </h1>
      <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
        A collection of essays, generation experiments, and professional
        background from <span className="text-foreground">Lin Yuan</span>,
        applying for the AI Creative Data Product Manager role at DeepSeek.
      </p>
      <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground">
        <span>
          <span className="text-foreground">Author</span> — Lin Yuan
        </span>
        <span>
          <span className="text-foreground">Role</span> — Creative Data · Product
        </span>
        <span>
          <span className="text-foreground">Reading time</span> — ~18 min
        </span>
      </div>
    </header>
  );
}