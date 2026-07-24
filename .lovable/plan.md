
# Personal Research Portfolio — DeepSeek Candidate

A single-page site with fixed top nav and smooth-scroll anchors to three sections: Research, AI Experiments, Resume. Editorial/academic aesthetic inspired by OpenAI research pages — white background, black typography, serif display + sans body, generous whitespace, no gradients, minimal motion.

## Design system

Update `src/styles.css`:
- Fonts: load Instrument Serif (display/titles) and Inter (body) via `<link>` in `__root.tsx`.
- Tokens: pure white `--background`, near-black `--foreground` (oklch 0.15), muted gray for meta text, hairline borders. Remove color accents; keep monochrome.
- Base type scale tuned for long-form reading: ~18px body, 1.7 line-height, max-width ~68ch for article prose.

Update `__root.tsx`:
- Add Google Fonts `<link>` entries.
- Update head meta with portfolio-specific title/description/OG.

## Page structure

Rewrite `src/routes/index.tsx` as the single page. Components co-located in `src/components/portfolio/`:

1. **FixedNav** — sticky top bar, thin bottom border, left: name mark, right: three anchor links (`#research`, `#experiments`, `#resume`). Active section highlight via IntersectionObserver.
2. **Hero** — large serif title, subtitle line ("AI Creative Data Product Manager · Research Portfolio"), short bio paragraph, publication date. Left-aligned, editorial.
3. **AbstractCards** — three-column (stacks on mobile) abstract cards summarizing the three sections with anchor links. Bordered, no shadow.
4. **ResearchArticle** (`#research`) — long-form article layout: section eyebrow ("Research · Essay"), H1, byline/date, drop-caps optional, body with H2/H3 headings, blockquotes, footnotes list at end. Content: essay on AI writing, language understanding, and creative data (candidate-voiced, ~1500 words).
5. **Experiments** (`#experiments`) — case study cards, each covering one experiment (AI poetry, short fiction, prompt iteration study). Each card shows: title, one-line hypothesis, prompt iteration table (v1 → v2 → v3 prompts with outputs), reflection.
6. **Resume** (`#resume`) — vertical timeline with year markers on the left, role/company/description on the right. Sections: Experience, Education, Skills (as tag list), Selected Projects.
7. **Footer** — thin top border, name, contact email placeholder, GitHub link (icon + text), copyright.

## Behavior

- Smooth scroll: `html { scroll-behavior: smooth }` in styles; nav links use `href="#id"` with scroll-margin-top to offset fixed nav.
- No route changes; single route at `/`.
- Responsive: nav collapses labels on mobile; grids stack; article stays single-column.
- Minimal motion only: subtle underline on link hover, no fades/parallax.

## Files

- Edit: `src/styles.css`, `src/routes/__root.tsx`, `src/routes/index.tsx`
- Create: `src/components/portfolio/FixedNav.tsx`, `Hero.tsx`, `AbstractCards.tsx`, `ResearchArticle.tsx`, `Experiments.tsx`, `Resume.tsx`, `Footer.tsx`
- Content lives inline in the components (English copy, candidate-authored voice).
