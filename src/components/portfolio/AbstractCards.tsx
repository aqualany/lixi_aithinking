const items = [
  {
    num: "01",
    href: "#research",
    eyebrow: "论文",
    title: "流畅之后：论写作、语言理解与创意数据",
    body: "一篇长文，讨论生成式写作系统为什么在意义层仍然吃力，以及一种以产品思维重新组织创意数据的方式可能改变什么。",
  },
  {
    num: "02",
    href: "#experiments",
    eyebrow: "实验笔记",
    title: "关于现代诗、宋词与短篇小说的提示词迭代",
    body: "三则与模型协作写作的记录，各自围绕一个具体问题反复迭代提示词，直到失败模式变得可读。",
  },
  {
    num: "03",
    href: "#resume",
    eyebrow: "简历",
    title: "工作经历与联系方式",
    body: "设计与产品出身，转入创作数据与人机协作写作的研究工作。",
  },
];

export function AbstractCards() {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        本页目录
      </p>
      <ul className="mt-6 border-t border-border">
        {items.map((it) => (
          <li key={it.num} className="border-b border-border">
            <a
              href={it.href}
              className="group grid grid-cols-[3rem_1fr_1.5rem] items-baseline gap-4 py-6 transition-colors"
            >
              <span className="font-mono text-[12px] tracking-[0.15em] text-muted-foreground">
                {it.num}
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {it.eyebrow}
                </p>
                <h3 className="mt-2 font-serif text-[19px] leading-[1.5] tracking-[0.02em] text-foreground group-hover:underline underline-offset-[6px] decoration-[0.5px]">
                  {it.title}
                </h3>
                <p className="mt-2 font-serif text-[14.5px] leading-[1.75] text-muted-foreground">
                  {it.body}
                </p>
              </div>
              <span
                aria-hidden
                className="justify-self-end font-serif text-muted-foreground transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}