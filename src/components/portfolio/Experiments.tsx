type Iteration = { version: string; prompt: string; output: string; note: string };
type Case = {
  num: string;
  date: string;
  title: string;
  hypothesis: string;
  iterations: Iteration[];
  reflection: string;
};

const cases: Case[] = [
  {
    num: "笔记 01",
    date: "2026 · 08",
    title: "形式约束下的现代诗生成",
    hypothesis:
      "如果把&ldquo;不许写情绪形容词&rdquo;这样的负约束显式化，模型能否在保留意象的同时，从&ldquo;告诉读者去感觉什么&rdquo;转到&ldquo;让画面自己承受重量&rdquo;？",
    iterations: [
      {
        version: "v1",
        prompt: "写一首关于孤独的现代诗。",
        output:
          "思绪轻轻低语，飘过心的空房间，寂静在那里唱着它安静的、无尽的歌……",
        note: "抽象、感伤，没有任何一个读者可以站进去的意象。",
      },
      {
        version: "v2",
        prompt:
          "写一首关于孤独的诗，只允许使用具体的物：一把椅子、雨、一盏灯、一只杯子。",
        output:
          "椅子撑住自己的重量。／雨在窗上写一个名字，又收回去。／灯给杯子围起一小片国度的光。",
        note: "物件到场了，但句法仍然在&ldquo;解释&rdquo;。",
      },
      {
        version: "v3",
        prompt:
          "意象派写法。四行。禁止使用任何情绪形容词。只写物。让画面做事。",
        output:
          "窗上有雨。／椅子，空的。／一只杯，还温着。／灯没有说话。",
        note: "情绪从&ldquo;排布&rdquo;里长出来，而不是被&ldquo;声明&rdquo;出来。",
      },
    ],
    reflection:
      "这条迭代路径复现了一个熟悉的模式：模型默认想告诉读者该感觉什么。在提示词一侧把&ldquo;情绪形容词&rdquo;禁掉是一个便宜的干预，效果不成比例。它同时提示了一个数据侧的动作：在句子层面为语料标注&ldquo;show&nbsp;/&nbsp;tell&rdquo;。",
  },
  {
    num: "笔记 02",
    date: "2026 · 09",
    title: "短篇小说的人物一致性：以&ldquo;不许说什么&rdquo;为约束",
    hypothesis:
      "对短篇而言，限制两个人物&ldquo;不能直接说什么&rdquo;，比扩充&ldquo;可以说什么&rdquo;，更快地把小说从摘要写法逼进潜台词。",
    iterations: [
      {
        version: "v1",
        prompt: "写一段情节，两个多年不见的兄妹重逢。",
        output:
          "&ldquo;我很想你，&rdquo;她说，&ldquo;这么多年了。&rdquo;他点点头，眼圈红了：&ldquo;我也想你。&rdquo;",
        note: "情绪被&ldquo;声明&rdquo;，读起来像剧情梗概。",
      },
      {
        version: "v2",
        prompt:
          "同一场景。两人都不许直接提到时间、距离或感情。",
        output:
          "&ldquo;还是不加糖？&rdquo;她问。／他看了一眼已经倒好的那杯：&ldquo;你还记得。&rdquo;／&ldquo;我什么都记得，&rdquo;她说，&ldquo;这是问题所在。&rdquo;",
        note: "潜台词到场；&ldquo;疏远&rdquo;从推断中长出来，而不是被宣布。",
      },
      {
        version: "v3",
        prompt:
          "同样约束。桌上多放一件只对他们两个人有意义的物，不许解释它。",
        output:
          "桌上摆着那把小小的黄铜钥匙。／谁都没有伸手去碰它。／&ldquo;还是不加糖？&rdquo;她问。他看了看那只杯子：&ldquo;你还记得。&rdquo;",
        note: "那件&ldquo;不被解释&rdquo;的物，承担了整段历史的承重。",
      },
    ],
    reflection:
      "对短篇小说，负约束优于正约束。这可以干净地映射到一条数据采集策略上：（草稿，编辑约束）的成对样本，比（草稿，修订稿）本身更富信息。",
  },
  {
    num: "笔记 03",
    date: "2026 · 10",
    title: "以修订轨迹作为训练信号：宋词一则",
    hypothesis:
      "让模型看&ldquo;从初稿到定稿之间被划掉的那些字&rdquo;，比只让它看定稿，更能学到什么叫&ldquo;声音&rdquo;。",
    iterations: [
      {
        version: "v1",
        prompt: "仿一阕辛弃疾风格的《青玉案》，写夜色。",
        output:
          "格律基本对，用词漂亮而空。像一位很懂平仄的中学生写的作业。",
        note: "定稿到定稿的映射：学到形，学不到取舍。",
      },
      {
        version: "v2",
        prompt:
          "同题。给出三份候选，标出你会划掉哪一份、为什么。",
        output:
          "三份并列，其中一份被划去。理由：&ldquo;意象过密，节奏被塞死。&rdquo;",
        note: "模型开始有&ldquo;编辑视角&rdquo;，但仍是外部人的口吻。",
      },
      {
        version: "v3",
        prompt:
          "同题。写完之后，把它当作第一稿，交给三十年后的自己修订，用删除线保留原字，并在句末标出为什么改。",
        output:
          "定稿伴随一条&ldquo;修订小注&rdquo;：为什么把&ldquo;寒&rdquo;换成&ldquo;凉&rdquo;，为什么把整句砍掉换成一个逗号。",
        note: "取舍变成显式信号；这本身就是一份小型的训练数据。",
      },
    ],
    reflection:
      "&ldquo;声音&rdquo;不是从成品里学到的，是从&ldquo;为什么这个字而不是那个字&rdquo;里学到的。把修订过程本身当作被采集的对象，是我目前认为最被低估的创意数据形态。",
  },
];

export function Experiments() {
  return (
    <section
      id="experiments"
      className="scroll-mt-24 border-t border-border bg-background"
    >
      <div className="mx-auto max-w-3xl px-6 py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          实验笔记 · 02
        </p>
        <h2 className="mt-6 zh-title font-serif text-[36px] leading-[1.35] tracking-[0.02em] text-foreground sm:text-[44px]">
          提示词作为方法
        </h2>
        <p className="mt-6 font-serif text-[17px] leading-[1.9] tracking-[0.01em] text-muted-foreground">
          三则与模型协作写作的记录。每一则围绕一个具体问题反复迭代提示词，观察失败模式，并试图从失败模式里读出关于数据的信息。它们不是&ldquo;成果展示&rdquo;，是工作台上的便签。
        </p>

        <div className="mt-16 space-y-20">
          {cases.map((c, i) => (
            <article key={c.num}>
              <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-border pb-4">
                <span className="font-mono text-[12px] tracking-[0.15em] text-muted-foreground">
                  {c.num}
                </span>
                <span className="font-mono text-[12px] tracking-[0.15em] text-muted-foreground" aria-hidden>·</span>
                <span className="font-mono text-[12px] tracking-[0.15em] text-muted-foreground">
                  {c.date}
                </span>
              </header>
              <h3 className="mt-5 zh-title font-serif text-[26px] leading-[1.4] tracking-[0.02em] text-foreground">
                {c.title}
              </h3>
              <p
                className="mt-5 border-l border-foreground pl-5 font-serif text-[16px] italic leading-[1.9] tracking-[0.01em] text-foreground"
                dangerouslySetInnerHTML={{ __html: "假设。" + c.hypothesis }}
              />

              <div className="mt-10 overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      <th className="w-16 py-2 pr-3 font-normal align-top">版本</th>
                      <th className="py-2 pr-6 font-normal align-top">提示词</th>
                      <th className="py-2 pr-6 font-normal align-top">输出片段</th>
                      <th className="py-2 font-normal align-top">失败模式 / 观察</th>
                    </tr>
                  </thead>
                  <tbody className="font-serif text-[14.5px] leading-[1.8] text-foreground">
                    {c.iterations.map((it) => (
                      <tr key={it.version} className="border-b border-border align-top">
                        <td className="py-4 pr-3 font-mono text-[13px] text-muted-foreground">
                          {it.version}
                        </td>
                        <td className="py-4 pr-6">{it.prompt}</td>
                        <td
                          className="py-4 pr-6 italic"
                          dangerouslySetInnerHTML={{ __html: it.output.replace(/\n/g, "<br/>") }}
                        />
                        <td className="py-4 text-muted-foreground">{it.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                  记录
                </p>
                <p
                  className="mt-3 font-serif text-[16px] leading-[1.95] tracking-[0.01em] text-foreground"
                  dangerouslySetInnerHTML={{ __html: c.reflection }}
                />
              </div>

              {i < cases.length - 1 && (
                <div className="divider-dots mt-16" aria-hidden>· · ·</div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}