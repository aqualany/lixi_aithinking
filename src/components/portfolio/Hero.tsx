export function Hero() {
  return (
    <header id="top" className="mx-auto max-w-3xl px-6 pt-36 pb-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        个人主页 · 最近更新 二〇二六年十一月
      </p>
      <h1 className="mt-10 font-serif text-[44px] leading-[1.25] tracking-[0.04em] text-foreground sm:text-[56px]">
        聂蓝玉
      </h1>
      <p className="mt-2 font-sans text-sm tracking-[0.25em] text-muted-foreground uppercase">
        Nie&nbsp;Lanyu
      </p>
      <p className="mt-8 font-serif text-lg tracking-[0.02em] text-foreground">
        AI 创作数据方向研究者 · 前 UI 设计师
      </p>

      <div className="mt-10 space-y-5 font-serif text-[17px] leading-[1.95] tracking-[0.01em] text-foreground">
        <p>
          我关注的是当大模型学会流畅之后的事：创造性写作的数据从哪里来，谁在写它，以及那些写作过程中未被记录的判断——为什么用这个词而不是另一个——能否被表述、被组织、被作为一种可训练的信号保存下来。
        </p>
        <p>
          在做研究之前，我做了几年产品与视觉设计。这份履历让我倾向于把&ldquo;数据&rdquo;当作产品问题，而不是抓取问题：它关乎写作者被邀请贡献什么、以什么形式、在什么反馈回路里。
        </p>
        <p>
          这份主页收录三部分：一篇论文式长文、一组提示词迭代的实验笔记、一份简短的简历。它们互相印证的是同一个立场——语言模型接下来变得有趣的地方，不在模型本身，而在我们愿意为它准备什么样的材料。
        </p>
      </div>

      <div className="mt-12 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[12px] tracking-[0.12em] text-muted-foreground">
        <span>+86 138 0000 0000</span>
        <span aria-hidden>·</span>
        <a
          href="mailto:nielanyu@example.com"
          className="transition-colors hover:text-foreground"
        >
          nielanyu@example.com
        </a>
        <span aria-hidden>·</span>
        <span>常驻 · 杭州</span>
      </div>
    </header>
  );
}