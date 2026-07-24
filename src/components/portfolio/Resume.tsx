type Entry = {
  year: string;
  role: string;
  org: string;
  detail: string;
};

const experience: Entry[] = [
  {
    year: "2024 — 至今",
    role: "独立研究者 · 创意数据方向",
    org: "为多家语言模型团队提供咨询",
    detail:
      "为文学与对话数据设计人机在环的流水线；建立标注方案，用于捕获修订轨迹、声音不变量与编辑约束。",
  },
  {
    year: "2022 — 2024",
    role: "高级产品经理 · NLP",
    org: "字浪科技（Bytewave AI）",
    detail:
      "主导创作辅助写作产品线；负责提示词设计、评测框架，以及一套面向写作者的数据采集界面，用于微调一款 34B 中文模型。",
  },
  {
    year: "2020 — 2022",
    role: "产品经理 · 语言工具",
    org: "文智科技",
    detail:
      "上线一款面向译者的双语编辑产品；主持审校计划，产出了内部的&ldquo;平行修订&rdquo;语料。",
  },
  {
    year: "2018 — 2020",
    role: "UI 设计师 · 编辑数据方向",
    org: "枭书出版",
    detail:
      "编辑部与工程团队之间的接口；第一次直接观察到&ldquo;编辑心里知道的东西&rdquo;与&ldquo;训练语料真正记录下的东西&rdquo;之间的差。",
  },
];

const education: Entry[] = [
  {
    year: "2016 — 2018",
    role: "文学硕士 · 比较文学",
    org: "复旦大学",
    detail: "毕业论文：《形式约束在现代主义诗歌中的角色》。",
  },
  {
    year: "2012 — 2016",
    role: "工学学士 · 计算机科学（辅修中国文学）",
    org: "浙江大学",
    detail: "自然语言处理与古典诗学并置修读。",
  },
];

const writings = [
  {
    year: "2026",
    title: "《流畅之后：论写作、语言理解与创意数据》",
    venue: "个人主页（本页第 01 节）",
  },
  {
    year: "2025",
    title: "《为什么修订轨迹应该被当作一等公民语料》",
    venue: "内部技术备忘 · 字浪科技",
  },
  {
    year: "2024",
    title: "《当模型学会流畅：一份写给编辑的说明》",
    venue: "《读库》约稿",
  },
];

const skills = [
  "创意数据流水线设计",
  "人类标注计划管理",
  "提示词与评测框架",
  "与模型团队协作微调",
  "编辑判断与文学阅读",
  "中 / 英双语写作",
  "Python · SQL",
  "读者小组研究",
];

function CVList({ entries }: { entries: Entry[] }) {
  return (
    <ol className="space-y-8">
      {entries.map((e) => (
        <li
          key={e.year + e.role}
          className="grid gap-x-6 gap-y-2 border-b border-border pb-8 last:border-b-0 last:pb-0 md:grid-cols-[7rem_1fr]"
        >
          <p className="font-mono text-[12px] tracking-[0.12em] text-muted-foreground pt-1">
            {e.year}
          </p>
          <div>
            <h4 className="font-serif text-[19px] leading-[1.5] tracking-[0.02em] text-foreground">
              {e.role}
            </h4>
            <p className="mt-1 font-sans text-[13px] tracking-[0.02em] text-muted-foreground">
              {e.org}
            </p>
            <p
              className="mt-3 font-serif text-[15.5px] leading-[1.9] tracking-[0.01em] text-foreground"
              dangerouslySetInnerHTML={{ __html: e.detail }}
            />
          </div>
        </li>
      ))}
    </ol>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-16 grid gap-8 border-t border-border pt-10 md:grid-cols-[12rem_1fr] md:gap-x-12">
      <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </h3>
      <div>{children}</div>
    </div>
  );
}

export function Resume() {
  return (
    <section
      id="resume"
      className="scroll-mt-24 border-t border-border bg-background"
    >
      <div className="mx-auto max-w-3xl px-6 py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          简历 · 03
        </p>
        <h2 className="mt-6 zh-title font-serif text-[36px] leading-[1.35] tracking-[0.02em] text-foreground sm:text-[44px]">
          聂蓝玉 · 简历
        </h2>
        <p className="mt-6 font-serif text-[16px] leading-[1.9] tracking-[0.01em] text-muted-foreground">
          从 UI 设计与产品出身，逐步转入创作数据与人机协作写作方向。以下按&ldquo;经历—教育—写作—技能&rdquo;分列。
        </p>

        <Section label="工作经历">
          <CVList entries={experience} />
        </Section>

        <Section label="教育">
          <CVList entries={education} />
        </Section>

        <Section label="部分写作">
          <ol className="space-y-5">
            {writings.map((w) => (
              <li
                key={w.title}
                className="grid gap-x-6 gap-y-1 md:grid-cols-[7rem_1fr]"
              >
                <p className="font-mono text-[12px] tracking-[0.12em] text-muted-foreground pt-1">
                  {w.year}
                </p>
                <div>
                  <p className="font-serif text-[16.5px] leading-[1.6] tracking-[0.02em] text-foreground">
                    {w.title}
                  </p>
                  <p className="mt-1 font-sans text-[13px] text-muted-foreground">
                    {w.venue}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section label="工作方法 / 技能">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 font-serif text-[15.5px] leading-[1.85] text-foreground sm:grid-cols-2">
            {skills.map((s) => (
              <li key={s} className="before:content-['—'] before:mr-2 before:text-muted-foreground">
                {s}
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </section>
  );
}