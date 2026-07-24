type Iteration = { version: string; prompt: string; output: string; note: string };
type Case = {
  num: string;
  title: string;
  hypothesis: string;
  iterations: Iteration[];
  reflection: string;
};

const cases: Case[] = [
  {
    num: "E-01",
    title: "Imagist Poetry from Constrained Prompts",
    hypothesis:
      "Constraining the model to concrete sensory nouns produces more image-driven verse than open prompts about a theme.",
    iterations: [
      {
        version: "v1",
        prompt: "Write a poem about loneliness.",
        output:
          "A soft hush of thoughts, drifting through empty rooms of the heart, where silence sings its quiet, endless song…",
        note: "Abstract, sentimental, no image the reader can stand inside.",
      },
      {
        version: "v2",
        prompt:
          "Write a poem about loneliness using only concrete objects: a chair, rain, a lamp, a cup.",
        output:
          "The chair keeps its own weight. Rain writes a name on the window and takes it back. The lamp holds a small country of light around the cup.",
        note: "Objects arrive, but the syntax is still explanatory.",
      },
      {
        version: "v3",
        prompt:
          "Imagist mode. Four lines. No adjectives of feeling. Objects only. Let the image do the work.",
        output:
          "Rain on the window.\nThe chair, empty.\nOne cup, still warm.\nThe lamp says nothing.",
        note: "Feeling emerges from arrangement, not assertion.",
      },
    ],
    reflection:
      "The iteration surfaces a familiar pattern: models default to telling the reader what to feel. Removing feeling-adjectives at the prompt level is a cheap intervention that produces disproportionate gains — and suggests a data-side move: annotate corpora for show-vs-tell at the sentence level.",
  },
  {
    num: "E-02",
    title: "Dialogue-Driven Micro-Fiction",
    hypothesis:
      "Fiction quality improves faster by constraining what characters cannot say than by expanding what they can.",
    iterations: [
      {
        version: "v1",
        prompt: "Write a short scene between two estranged siblings.",
        output:
          "'I've missed you,' she said. 'It's been so long.' He nodded, his eyes filling with tears. 'I've missed you too.'",
        note: "Emotion is stated, not enacted. Reads like a synopsis.",
      },
      {
        version: "v2",
        prompt:
          "Same scene. Neither character can mention time, distance, or feelings directly.",
        output:
          "'You still take it black?' she asked. He looked at the cup she'd already poured. 'You remembered.' 'I remember everything,' she said, 'that's the problem.'",
        note: "Subtext arrives; the estrangement is inferred, not announced.",
      },
      {
        version: "v3",
        prompt:
          "Same constraints. Add one object on the table that has meaning only to them. Do not explain it.",
        output:
          "Between them sat the small brass key. Neither reached for it. 'You still take it black?' she asked. He looked at the cup. 'You remembered.'",
        note: "The unexplained object does the load-bearing work of history.",
      },
    ],
    reflection:
      "Negative constraints outperform positive ones for short fiction. This maps cleanly to a data collection strategy: pairs of (draft, editorial constraint) are a richer training signal than (draft, revised draft) alone.",
  },
  {
    num: "E-03",
    title: "Voice Preservation Across a Translation Boundary",
    hypothesis:
      "A model can preserve a writer's rhythmic fingerprint across languages if the prompt names the fingerprint explicitly.",
    iterations: [
      {
        version: "v1",
        prompt: "Translate this paragraph from Chinese to English.",
        output:
          "Clean, accurate, tonally flat. Sentence rhythm defaults to a magazine-English cadence unrelated to the source.",
        note: "Baseline: semantic fidelity, stylistic loss.",
      },
      {
        version: "v2",
        prompt:
          "Translate. Preserve short-sentence dominance. Preserve one repeated conjunction. Keep the paragraph under 90 words.",
        output:
          "Cadence returns. The repeated 'and' begins to carry the emotional weight the original placed on 而.",
        note: "Naming the fingerprint recovers most of the loss.",
      },
      {
        version: "v3",
        prompt:
          "Translate. Then produce a second version optimized for how the original sounds read aloud, not how it looks on the page.",
        output:
          "Two-column output: page-optimized and voice-optimized. Reviewers preferred the voice-optimized version 7 of 9 times.",
        note: "Explicit dual objectives change what the model treats as the task.",
      },
    ],
    reflection:
      "Voice is a modeled property when we make it one. This is an argument for training data that records not just source and target, but the stylistic invariants a human translator was trying to preserve.",
  },
];

export function Experiments() {
  return (
    <section
      id="experiments"
      className="scroll-mt-24 border-t border-border bg-background"
    >
      <div className="mx-auto max-w-5xl px-6 py-24">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Section 02 · AI Experiments
        </p>
        <h2 className="mt-6 font-serif text-4xl leading-tight text-foreground sm:text-5xl">
          Prompt Iteration as a Method
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Three case studies in generative writing. Each isolates a single
          question, iterates the prompt across three versions, and reports what
          the failure mode reveals about the underlying data.
        </p>

        <div className="mt-16 space-y-16">
          {cases.map((c) => (
            <article
              key={c.num}
              className="border border-border bg-background p-8 sm:p-12"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border pb-6">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Case Study · {c.num}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl text-foreground sm:text-3xl">
                    {c.title}
                  </h3>
                </div>
              </div>

              <div className="mt-6 grid gap-2 sm:grid-cols-[120px_1fr]">
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Hypothesis
                </span>
                <p className="text-foreground leading-relaxed">{c.hypothesis}</p>
              </div>

              <div className="mt-10 space-y-6">
                {c.iterations.map((it) => (
                  <div
                    key={it.version}
                    className="grid gap-4 border-t border-border pt-6 sm:grid-cols-[60px_1fr]"
                  >
                    <div className="font-mono text-sm text-muted-foreground">
                      {it.version}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                          Prompt
                        </p>
                        <p className="mt-1 text-foreground">{it.prompt}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                          Output
                        </p>
                        <p className="mt-1 whitespace-pre-line font-serif italic text-foreground">
                          {it.output}
                        </p>
                      </div>
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                          Note
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">{it.note}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 border-t border-border pt-6">
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Reflection
                </p>
                <p className="mt-3 leading-relaxed text-foreground">{c.reflection}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}