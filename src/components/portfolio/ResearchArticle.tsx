export function ResearchArticle() {
  return (
    <section
      id="research"
      className="scroll-mt-24 border-t border-border bg-background"
    >
      <div className="mx-auto max-w-3xl px-6 py-24">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Research · Essay · 01
        </p>
        <h2 className="mt-6 font-serif text-4xl leading-tight text-foreground sm:text-5xl">
          The Quiet Problem of Meaning: On Writing, Language Understanding, and Creative Data
        </h2>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
          <span>Lin Yuan</span>
          <span>November 2026</span>
          <span>~18 min read</span>
        </div>

        <div className="mt-12 border-l-2 border-foreground pl-6 font-serif text-xl italic leading-relaxed text-foreground">
          Large language models have learned to write fluently, but fluency is
          not the same as meaning. The next generation of creative AI systems
          will be defined less by the models themselves and more by the data
          that teaches them to care about what they are saying.
        </div>

        <article className="prose-article mt-14 space-y-6 text-[17px] leading-[1.75] text-foreground">
          <h3 className="pt-6 font-serif text-2xl">1. The plateau of fluency</h3>
          <p>
            For most of the last decade, the story of AI writing has been a
            story of surface. Grammar improved. Coherence improved. Style
            transfer became routine. Yet if you read enough machine-generated
            prose, a pattern emerges: the sentences are correct, the paragraphs
            are shaped like paragraphs, and almost nothing is at stake. The
            model has learned the geometry of language without learning what
            language is for.
          </p>
          <p>
            This is not a failure of scale. It is a failure of data. Pre-training
            corpora reward statistical regularity, and statistical regularity
            in human writing tends to be its least interesting layer — the
            connective tissue between ideas rather than the ideas themselves.
            When we scale that signal, we scale the connective tissue.
          </p>

          <h3 className="pt-6 font-serif text-2xl">2. What language understanding actually asks for</h3>
          <p>
            &ldquo;Understanding&rdquo; is a loaded word, so let me narrow it. A
            system understands language, in a working sense, when its outputs
            respond to <em>what is meant</em>, not just <em>what is said</em>.
            Meaning lives in three places that current training data captures
            poorly:
          </p>
          <ul className="list-disc space-y-2 pl-6 marker:text-muted-foreground">
            <li>
              <span className="text-foreground">Intent</span> — why a sentence
              exists in a paragraph, and what work it is doing for the writer.
            </li>
            <li>
              <span className="text-foreground">Constraint</span> — the tacit
              rules a form imposes (a sonnet is not free verse in a smaller box).
            </li>
            <li>
              <span className="text-foreground">Consequence</span> — how a line
              changes the reader&rsquo;s expectation of the next line.
            </li>
          </ul>
          <p>
            None of these are visible in raw text. They are visible in
            <em> revisions</em>, in editorial notes, in the difference between a
            first draft and a fifth, in the margins of workshop manuscripts.
            This is the substrate of creative data.
          </p>

          <h3 className="pt-6 font-serif text-2xl">3. Creative data as a product problem</h3>
          <p>
            Treating creative data as a product problem changes what we build.
            It stops being a scraping exercise and becomes a design exercise:
            what should a writer, poet, or editor be asked to contribute, in
            what format, under what compensation, with what feedback loop? The
            questions look like product questions because they are.
          </p>
          <p>
            At DeepSeek scale, the interesting datasets will not come from the
            open web. They will come from purpose-built environments where
            skilled human writers make explicit the choices that used to live
            only in their heads: why this word, why not that one, what the
            paragraph is trying to do, what would break it.
          </p>

          <blockquote className="border-l-2 border-border pl-6 font-serif text-xl italic text-muted-foreground">
            The most valuable creative dataset of the next five years will look
            less like a library and more like a studio.
          </blockquote>

          <h3 className="pt-6 font-serif text-2xl">4. Three principles I keep returning to</h3>
          <p>
            Across the experiments in the next section, three principles keep
            re-appearing. I offer them not as conclusions but as working
            hypotheses.
          </p>
          <ol className="list-decimal space-y-3 pl-6 marker:font-serif marker:text-muted-foreground">
            <li>
              <span className="text-foreground">Elicit revision, not just output.</span>{" "}
              A single polished paragraph teaches less than the trajectory that produced it.
            </li>
            <li>
              <span className="text-foreground">Preserve voice at the token level.</span>{" "}
              Averaging across writers destroys the signal we most want to model.
            </li>
            <li>
              <span className="text-foreground">Instrument the reader, not only the writer.</span>{" "}
              Meaning is a two-sided phenomenon; datasets that ignore reception are half-blind.
            </li>
          </ol>

          <h3 className="pt-6 font-serif text-2xl">5. What this portfolio argues</h3>
          <p>
            The experiments that follow are small, deliberately. Each one
            isolates a single question about creative data and iterates prompts
            against it until the failure mode becomes legible. The résumé at
            the end is the professional history that put me in a position to
            ask these questions in the first place.
          </p>
          <p>
            None of this is finished work. It is an argument, in progress,
            about where creative AI becomes interesting again — and about the
            kind of product discipline required to get us there.
          </p>
        </article>

        <footer className="mt-16 border-t border-border pt-6 text-xs font-mono uppercase tracking-widest text-muted-foreground">
          End of essay · Continue to experiments ↓
        </footer>
      </div>
    </section>
  );
}