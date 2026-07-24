export function ResearchArticle() {
  return (
    <section
      id="research"
      className="scroll-mt-24 border-t border-border bg-background"
    >
      <div className="mx-auto max-w-3xl px-6 py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          研究 · 论文 01
        </p>
        <h2 className="mt-6 zh-title font-serif text-[36px] leading-[1.35] tracking-[0.02em] text-foreground sm:text-[44px]">
          流畅之后<span className="text-muted-foreground">：</span>论写作、语言理解与创意数据
        </h2>
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[12px] tracking-[0.12em] text-muted-foreground">
          <span>聂蓝玉</span>
          <span aria-hidden>·</span>
          <span>二〇二六年十一月</span>
          <span aria-hidden>·</span>
          <span>约 4,800 字</span>
        </div>

        <p className="mt-12 border-l border-foreground pl-6 font-serif text-[17px] italic leading-[1.95] tracking-[0.02em] text-foreground">
          <span className="not-italic font-medium">摘要。</span>
          大语言模型已经学会流畅地写作，但流畅并不等于意义。下一代创造性 AI 系统的分水岭，不在模型本身，而在教它&ldquo;在意自己在说什么&rdquo;的那批数据。本文从数据的角度重述这个问题，并给出三条我在实验中反复回到的工作假设。
        </p>

        <div className="mt-16 md:grid md:grid-cols-[1fr_180px] md:gap-x-10">
          <article className="prose-article">
            <h3>一、流畅的高原</h3>
            <p>
              过去十年，AI 写作的故事基本是一个关于&ldquo;表面&rdquo;的故事。语法在改善，连贯性在改善，风格迁移变得例行公事。但读得足够多机器生成的文本之后，会浮现出一种共通的病征：句子是对的，段落是段落的形状，几乎没有任何东西真正处于紧张之中。模型学会了语言的几何，却没有学会语言是用来做什么的<sup>[1]</sup>。
            </p>
            <p>
              这不是规模的失败，而是数据的失败。预训练语料奖励统计规律性，而人类写作中的统计规律性，恰恰是它最不有趣的那一层——是想法之间的结缔组织，而不是想法本身。当我们把这个信号放大，我们放大的是结缔组织。
            </p>

            <div className="divider-dots" aria-hidden>· · ·</div>

            <h3>二、语言理解真正要求什么</h3>
            <p>
              &ldquo;理解&rdquo;是一个负担过重的词，让我把它收窄。在一个可以操作的意义上，一个系统&ldquo;理解&rdquo;语言，是指它的输出回应了<em>被想说的东西</em>，而不仅仅是<em>被说出来的东西</em>。而意义至少活在三个当前训练数据难以捕获的地方：
            </p>
            <ul className="list-none space-y-2 pl-0">
              <li>
                <span className="font-mono text-[12px] tracking-[0.15em] text-muted-foreground">意图</span>
                　一句话为什么出现在这一段里，它在为作者做什么工。
              </li>
              <li>
                <span className="font-mono text-[12px] tracking-[0.15em] text-muted-foreground">约束</span>
                　一种形式默会施加的规则——一首律诗不是&ldquo;塞进更小盒子里的自由诗&rdquo;。
              </li>
              <li>
                <span className="font-mono text-[12px] tracking-[0.15em] text-muted-foreground">后果</span>
                　一行如何改变读者对下一行的期待。
              </li>
            </ul>
            <p>
              这三样东西都不可见于原文。它们可见于<em>修订</em>，可见于编辑批注，可见于第一稿与第五稿之间的差异，可见于工作坊手稿的页边空白。这才是创意数据真正的衬底<sup>[2]</sup>。
            </p>

            <div className="divider-dots" aria-hidden>· · ·</div>

            <h3>三、创意数据作为一个产品问题</h3>
            <p>
              把创意数据当作一个产品问题来看，改变的是&ldquo;我们在建什么&rdquo;。它不再是抓取的活儿，而是设计的活儿：应该邀请一位作者、诗人或编辑贡献什么，以什么格式，在什么补偿之下，通过什么反馈回路。这些问题看起来像产品问题，是因为它们就是。
            </p>
            <p>
              在真正有意思的规模上，接下来最有价值的数据集不会来自公开网络，而会来自专门搭建的环境——在那里，训练有素的写作者被要求把过去只留在脑子里的判断显式化：为什么用这个词，不用另一个；这一段试图做什么工；什么样的改动会把它毁掉。
            </p>

            <blockquote className="border-l border-border pl-6 font-serif text-[19px] italic leading-[1.7] text-foreground">
              未来五年最有价值的创意数据集，看起来不会像一座图书馆，而更像一间工作室。
            </blockquote>

            <div className="divider-dots" aria-hidden>· · ·</div>

            <h3>四、三条我反复回到的原则</h3>
            <p>
              在下一节的三则实验里，有三条原则不断复现。我把它们放在这里，不是作为结论，而是作为可被反驳的工作假设。
            </p>
            <ol className="list-none space-y-4 pl-0 counter-reset">
              <li>
                <span className="font-mono text-[12px] tracking-[0.15em] text-muted-foreground">壹　</span>
                <span className="font-medium">采集修订，而不只是采集成品。</span>
                　一段被打磨过的完美文字，教给模型的东西，少于产出它的那条轨迹。
              </li>
              <li>
                <span className="font-mono text-[12px] tracking-[0.15em] text-muted-foreground">贰　</span>
                <span className="font-medium">在 token 层保留声音。</span>
                　在作者之间取平均，会摧毁我们最想建模的那种信号。
              </li>
              <li>
                <span className="font-mono text-[12px] tracking-[0.15em] text-muted-foreground">叁　</span>
                <span className="font-medium">让读者也进入数据，不只是让作者进入。</span>
                　意义是一件双向的事；忽视接收端的数据集是半盲的。
              </li>
            </ol>

            <div className="divider-dots" aria-hidden>· · ·</div>

            <h3>五、这份主页想论证什么</h3>
            <p>
              后面的实验刻意都很小。每一则只隔离一个关于创意数据的问题，把提示词沿着它反复迭代，直到失败模式变得可读。文末的简历，是让我有资格这样发问的那段职业史。
            </p>
            <p>
              这里没有一件事是完成的。它是一个仍在展开的论证——关于创造性 AI 何时会重新变得有趣，以及要把它推到那个位置，需要什么样的产品纪律。
            </p>
          </article>

          <aside className="mt-14 hidden md:block">
            <div className="sticky top-24 space-y-8 border-l border-border pl-4 text-[12px] leading-[1.7] text-muted-foreground">
              <div>
                <p className="font-mono uppercase tracking-[0.2em]">发表</p>
                <p className="mt-1">初稿 · 2026/09<br />第三次修订 · 2026/11</p>
              </div>
              <div>
                <p className="font-mono uppercase tracking-[0.2em]">相关</p>
                <p className="mt-1">见下节&ldquo;实验笔记 02&rdquo;：<br />短篇小说人物一致性。</p>
              </div>
              <div>
                <p className="font-mono uppercase tracking-[0.2em]">术语</p>
                <p className="mt-1">此处&ldquo;创意数据&rdquo;不是&ldquo;创作出来的数据&rdquo;，而是关于创作过程的数据。</p>
              </div>
            </div>
          </aside>
        </div>

        <footer className="mt-16 border-t border-border pt-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            注释
          </p>
          <ol className="mt-4 space-y-2 font-serif text-[14px] leading-[1.85] text-muted-foreground">
            <li>
              <span className="font-mono text-foreground">[1]</span>　此处的&ldquo;几何&rdquo;沿用某种偏喻：模型学会了 token 之间的距离，却没有学会哪里应该有阻力。
            </li>
            <li>
              <span className="font-mono text-foreground">[2]</span>　参见 M. Turner,《The Literary Mind》，Oxford University Press，1996；以及国内近年关于&ldquo;写作过程语料&rdquo;的少量工作。
            </li>
            <li>
              <span className="font-mono text-foreground">[3]</span>　本文写作与修订过程中的部分片段本身被记录为一份小型&ldquo;修订轨迹&rdquo;数据集，见实验笔记 03。
            </li>
          </ol>
        </footer>
      </div>
    </section>
  );
}