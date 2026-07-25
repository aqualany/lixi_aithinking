import { Link } from "@tanstack/react-router";

export const articleTitle = "流畅之后：论写作、语言理解与创意数据";

export const articleSections = [
  {
    id: "sec-1",
    heading: "一、流畅的高原",
    body: [
      "过去十年，AI 写作的故事基本是一个关于“表面”的故事。语法在改善，连贯性在改善，风格迁移变得例行公事。但读得足够多机器生成的文本之后，会浮现出一种共通的病征：句子是对的，段落是段落的形状，几乎没有任何东西真正处于紧张之中。模型学会了语言的几何，却没有学会语言是用来做什么的。",
      "这不是规模的失败，而是数据的失败。预训练语料奖励统计规律性，而人类写作中的统计规律性，恰恰是它最不有趣的那一层——是想法之间的结缔组织，而不是想法本身。当我们把这个信号放大，我们放大的是结缔组织。",
    ],
  },
  {
    id: "sec-2",
    heading: "二、语言理解真正要求什么",
    body: [
      "“理解”是一个负担过重的词，让我把它收窄。在一个可以操作的意义上，一个系统“理解”语言，是指它的输出回应了被想说的东西，而不仅仅是被说出来的东西。而意义至少活在三个当前训练数据难以捕获的地方：意图、约束、后果。",
      "这三样东西都不可见于原文。它们可见于修订，可见于编辑批注，可见于第一稿与第五稿之间的差异，可见于工作坊手稿的页边空白。这才是创意数据真正的衬底。",
    ],
  },
  {
    id: "sec-3",
    heading: "三、创意数据作为一个产品问题",
    body: [
      "把创意数据当作一个产品问题来看，改变的是“我们在建什么”。它不再是抓取的活儿，而是设计的活儿：应该邀请一位作者、诗人或编辑贡献什么，以什么格式，在什么补偿之下，通过什么反馈回路。这些问题看起来像产品问题，是因为它们就是。",
      "在真正有意思的规模上，接下来最有价值的数据集不会来自公开网络，而会来自专门搭建的环境——在那里，训练有素的写作者被要求把过去只留在脑子里的判断显式化：为什么用这个词，不用另一个；这一段试图做什么工；什么样的改动会把它毁掉。",
    ],
  },
  {
    id: "sec-4",
    heading: "四、三条我反复回到的原则",
    body: [
      "壹　采集修订，而不只是采集成品。一段被打磨过的完美文字，教给模型的东西，少于产出它的那条轨迹。",
      "贰　在 token 层保留声音。在作者之间取平均，会摧毁我们最想建模的那种信号。",
      "叁　让读者也进入数据，不只是让作者进入。意义是一件双向的事；忽视接收端的数据集是半盲的。",
    ],
  },
  {
    id: "sec-5",
    heading: "五、这份主页想论证什么",
    body: [
      "后面的实验刻意都很小。每一则只隔离一个关于创意数据的问题，把提示词沿着它反复迭代，直到失败模式变得可读。",
      "这里没有一件事是完成的。它是一个仍在展开的论证——关于创造性 AI 何时会重新变得有趣，以及要把它推到那个位置，需要什么样的产品纪律。",
    ],
  },
];

function Header({ linkTitle = false }: { linkTitle?: boolean }) {
  const Title = (
    <h2 className="zh-title font-serif text-[36px] leading-[1.35] tracking-[0.02em] text-foreground sm:text-[44px]">
      流畅之后<span className="text-muted-foreground">：</span>论写作、语言理解与创意数据
    </h2>
  );
  return (
    <>
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        研究 · 论文 01
      </p>
      <div className="mt-6">
        {linkTitle ? (
          <Link to="/research" className="group inline-block">
            <span className="block group-hover:underline underline-offset-[8px] decoration-[0.5px]">
              {Title}
            </span>
          </Link>
        ) : (
          Title
        )}
      </div>
      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[12px] tracking-[0.12em] text-muted-foreground">
        <span>聂灵晞</span>
        <span aria-hidden>·</span>
        <span>二〇二六年十一月</span>
        <span aria-hidden>·</span>
        <span>约 4,800 字</span>
      </div>

      <p className="mt-10 border-l border-foreground pl-6 font-serif text-[17px] italic leading-[1.95] tracking-[0.02em] text-foreground">
        <span className="not-italic font-medium">摘要。</span>
        大语言模型已经学会流畅地写作，但流畅并不等于意义。下一代创造性 AI 系统的分水岭，不在模型本身，而在教它&ldquo;在意自己在说什么&rdquo;的那批数据。本文从数据的角度重述这个问题，并给出三条我在实验中反复回到的工作假设。
      </p>
    </>
  );
}

function Sidebar({ activeOnly }: { activeOnly?: boolean }) {
  return (
    <aside className="hidden md:block">
      <div className="sticky top-24 border-l border-border pl-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          目录
        </p>
        <ul className="mt-4 space-y-3">
          {articleSections.map((s) => (
            <li key={s.id}>
              {activeOnly ? (
                <a
                  href={`#${s.id}`}
                  className="font-serif text-[13.5px] leading-[1.7] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {s.heading}
                </a>
              ) : (
                <Link
                  to="/research"
                  hash={s.id}
                  className="font-serif text-[13.5px] leading-[1.7] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {s.heading}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

/** Preview shown on the homepage: header + first section + fade + read-more. */
export function ResearchPreview() {
  const first = articleSections[0];
  return (
    <section
      id="research"
      className="scroll-mt-24 border-t border-border bg-background"
    >
      <div className="mx-auto max-w-3xl px-6 py-20">
        <Header linkTitle />

        <div className="mt-14 md:grid md:grid-cols-[1fr_180px] md:gap-x-10">
          <div>
            <div className="relative">
              <article className="prose-article fade-mask-b">
                <h3>{first.heading}</h3>
                {first.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                <p className="opacity-60">
                  这不是规模的失败，而是数据的失败。预训练语料奖励统计规律性，而人类写作中的统计规律性，恰恰是它最不有趣的那一层——
                </p>
              </article>
            </div>
            <div className="mt-8 flex justify-center">
              <Link
                to="/research"
                className="group inline-flex items-center gap-3 border border-foreground px-6 py-2.5 font-serif text-[15px] tracking-[0.15em] text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                阅读全文
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
          <Sidebar />
        </div>
      </div>
    </section>
  );
}

/** Full article for the /research route. */
export function ResearchFull() {
  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <Header />

        <div className="mt-14 md:grid md:grid-cols-[1fr_180px] md:gap-x-10">
          <article className="prose-article">
            {articleSections.map((s, i) => (
              <div key={s.id}>
                <h3 id={s.id} className="scroll-mt-24">
                  {s.heading}
                </h3>
                {s.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
                {i < articleSections.length - 1 && (
                  <div className="divider-dots" aria-hidden>· · ·</div>
                )}
              </div>
            ))}
          </article>
          <Sidebar activeOnly />
        </div>
      </div>
    </section>
  );
}