import { Link } from "@tanstack/react-router";

export type ExperimentSlug = "wuxia" | "song-ci" | "modern-poetry";

export type ExperimentCase = {
  slug: ExperimentSlug;
  num: string;
  date: string;
  category: string;
  title: string;
  keyInsight: string;
  hypothesis: string;
  optimization: string[];
  selfTraining: string[];
};

export const experiments: ExperimentCase[] = [
  {
    slug: "wuxia",
    num: "笔记 01",
    date: "2026 · 08",
    category: "武侠小说创作",
    title: "招式不写“快”：以动作为骨的武侠段落",
    keyInsight:
      "把“凌厉、迅捷、狠辣”这类形容词禁掉，只允许写身体、器物与呼吸——武打段落从戏剧摘要变成可被读者身体感到的动作。",
    hypothesis:
      "武侠段落的“力气”来自动词与关节位置，而非形容词。禁用副词是最小干预。",
    optimization: [
      "v1：让模型直接“写一段武打”，产出的是电视剧解说词。",
      "v2：加入约束“不许使用形容词与副词”，模型开始写身体。",
      "v3：加入“镜头只跟随一件器物”，画面自动获得节奏与视点。",
    ],
    selfTraining: [
      "把武侠语料按“动作/心理/景物”三层拆开，训练模型学习“留白比例”。",
      "将修订前后的删除线作为对比样本，教会模型识别“过度描写”。",
    ],
  },
  {
    slug: "song-ci",
    num: "笔记 02",
    date: "2026 · 09",
    category: "宋词创作",
    title: "以修订轨迹作训练信号：一阕《青玉案》的诞生",
    keyInsight:
      "让模型看“从初稿到定稿之间被划掉的字”，比只让它看定稿，更能学到什么叫“声音”。取舍即数据。",
    hypothesis:
      "词牌的“味”不在字面，而在“为什么这个字而不是那个字”的选择过程。",
    optimization: [
      "v1：仿辛弃疾风格作《青玉案》——格律对，用词漂亮而空。",
      "v2：要求模型给三份候选并说明会划掉哪一份，出现“编辑视角”。",
      "v3：把定稿当第一稿交给三十年后的自己修订，产出带修订小注的双层文本。",
    ],
    selfTraining: [
      "构造 (草稿, 修订理由, 定稿) 的三元组作为微调样本。",
      "以“字级别删除线”作为损失函数的注意力权重，让模型学习“克制”。",
    ],
  },
  {
    slug: "modern-poetry",
    num: "笔记 03",
    date: "2026 · 10",
    category: "现代诗创作",
    title: "形式约束下的意象派：只写物，不许写情绪",
    keyInsight:
      "把“不许写情绪形容词”的负约束显式化，模型从“告诉读者感觉什么”转向“让画面自己承受重量”。",
    hypothesis:
      "负约束（不许写什么）比正约束（要写什么）更快把诗从摘要逼进意象。",
    optimization: [
      "v1：“写一首关于孤独的现代诗”——抽象、感伤，无落脚点。",
      "v2：限定“只能用具体物：椅子、雨、灯、杯”，物件到场，句法仍在解释。",
      "v3：四行，禁一切情绪形容词，只写物——情绪从排布里长出来。",
    ],
    selfTraining: [
      "在语料中给句子标注 show/tell 二值标签，作为可训练的“质地”信号。",
      "构造“禁用词-输出”成对样本，教会模型在缺失常用词时寻找替代表达。",
    ],
  },
];

export function Experiments() {
  return (
    <section
      id="experiments"
      className="scroll-mt-24 border-t border-border bg-background"
    >
      <div className="mx-auto max-w-3xl px-6 py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          实验笔记 · 02
        </p>
        <h2 className="mt-6 zh-title font-serif text-[36px] leading-[1.35] tracking-[0.02em] text-foreground sm:text-[44px]">
          提示词作为方法
        </h2>
        <p className="mt-6 font-serif text-[16.5px] leading-[1.9] tracking-[0.01em] text-muted-foreground">
          三则与模型协作写作的记录。每一张卡片是一次提示词优化的落点，点击进入笔记内页，看到完整的对话过程与从中提炼的自训练思路。
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {experiments.map((e) => (
            <Link
              key={e.slug}
              to="/experiments/$slug"
              params={{ slug: e.slug }}
              className="group flex h-full flex-col border border-border p-6 transition-colors hover:border-foreground"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
                  {e.num}
                </span>
                <span className="font-mono text-[11px] tracking-[0.15em] text-muted-foreground">
                  {e.date}
                </span>
              </div>
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {e.category}
              </p>
              <h3 className="mt-3 zh-title font-serif text-[20px] leading-[1.45] tracking-[0.02em] text-foreground">
                {e.title}
              </h3>
              <p className="mt-5 flex-1 font-serif text-[14.5px] leading-[1.85] text-foreground">
                {e.keyInsight}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-foreground">
                进入笔记
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
