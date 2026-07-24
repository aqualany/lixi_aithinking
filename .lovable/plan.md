# 改造为中文 AI 研究者个人网站

整体从"求职作品集"改为"研究者个人主页"风格（参考 Chris Olah、Gwern、arXiv 作者页、《The Paris Review》专栏页），但保留审美层次——不是纯素文本，而是有讲究的编辑设计。全站文案改为中文。

## 中文字体系统

在 `src/routes/__root.tsx` 的 `head.links` 中加载 Google Fonts（不要在 styles.css 里 `@import` 远程 URL）：

- 衬线（标题、正文长文）：`Noto Serif SC`（400/500/700） + 拉丁配对 `Source Serif 4`
- 无衬线（导航、元信息、CV）：`Noto Sans SC`（400/500） + 拉丁配对 `Inter`
- 等宽（编号、表格、脚注）：`JetBrains Mono`

在 `src/styles.css` 的 `@theme` 里更新 token：

```
--font-serif: "Source Serif 4", "Noto Serif SC", "Songti SC", "SimSun", serif;
--font-sans:  "Inter", "Noto Sans SC", "PingFang SC", system-ui, sans-serif;
--font-mono:  "JetBrains Mono", ui-monospace, monospace;
```

`html` 默认 `font-sans`；`.prose-article`、文章 h1/h2、Hero 名称、引言使用 `font-serif`。
中文行高比拉丁略大：正文 `leading-[1.85]`，标题 `leading-[1.35]`；中文字距 `tracking-[0.01em]`。

## 全局视觉（保留审美）

- `src/styles.css`：
  - 背景不用纯白，用微暖 `oklch(0.985 0.005 85)`（纸感）；`--foreground` `oklch(0.18 0.01 60)`（近黑带暖）；`--muted-foreground` `oklch(0.5 0.01 60)`；`--border` `oklch(0.88 0.005 85)`。
  - 保留 `scroll-behavior: smooth`。
  - 新增 `.prose-article` 类：正文 17px / 1.85，段首缩进 2em（中文习惯），段间距 1.2em；`p + p` 不加额外 margin，靠 text-indent 分段。
  - 引言/摘要用 `border-l` + 斜体衬线。
  - 提供一个装饰性分节符 `§` 或三点 `· · ·` 居中作为章节间隔（比纯 hr 更有编辑感）。

## FixedNav（顶部导航）

- 更细（h-12），左：中文姓名 + 一行身份（"林渊 · 独立研究者 · 创意数据"）。
- 右：三个中文锚点 —— `研究`、`实验`、`简历`。
- 当前区块下加 1px 实线下划线，非胶囊背景；hover 只是轻微字重变化。
- 移动端保留全部三个链接，只缩小间距，不做汉堡菜单。

## Hero → 作者头部

不再是大标题海报，而是一段研究者自陈：

- 一行 serif 大字姓名"聂蓝玉 "（muted）。
- 单行身份："AI 创作数据方向研究者 · 前UI设计师"。
- 一段 3–4 句中文自述（研究立场，不是求职话术）："我关注的是当大模型学会流畅之后，创造性写作的数据从哪里来……"
- 联系行：手机号码 · 邮箱 ，纯文字链，`·` 分隔。
- 末尾一行斜体 muted："最近更新：2026 年 11 月"。
- 去掉"阅读时长"、"作者/角色/时长"三栏。

## AbstractCards → 目录

取消三张卡片，改为一张"本页目录"（像论文 TOC，但排版讲究）：

- 左侧 mono 编号 `01 02 03`，右侧中文标题 + 一行副标题（灰色）。
- 每行 hairline 分隔，hover 时右侧标题下划线。
- 例：
  - `01 ——` 我对AI创作数据的思考
  - `02 —— AI写作记录｜在现代诗、宋词和小说写作时，与AI协作的经历和迭代提示词的思考`
  - `03 —— 简历｜工作经历`

## ResearchArticle（研究文章）

内容全文中译并重写为研究者语气（非市场语），保留原有五节结构：

- 顶部 eyebrow：`研究 · 论文 01`（mono 小字）。
- 大标题（serif，中文）："流畅之后：论写作、语言理解与创意数据"。
- 副行：作者 · 日期 · 阅读字数（"约 4,800 字"）。
- 摘要段：`摘要。`开头，斜体衬线，3 句。
- 五个二级标题改为中文编号："一、流畅的高原"、"二、语言理解真正要求什么"、"三、创意数据作为一个产品问题"、"四、三条我反复回到的原则"、"五、这份主页想论证什么"。
- 正文中出现 `[1]` `[2]` 上标脚注引用；文末"注释"区列出 3–5 条（可含参考文献风格条目：作者《篇名》，期刊/出版社，年份）。
- 保留一处引文（blockquote），衬线斜体大字。
- 桌面端加右侧边注列 `md:grid-cols-[1fr_180px]`，放 2–3 条 marginalia（发布日期、交叉引用、术语说明）；移动端折叠。
- 章节间用居中 `· · ·` 分隔符。

## Experiments（实验）→ 实验笔记

改为"实验笔记"栏目，三则中文条目：

- 标题行：`笔记 01 · 形式约束下的诗歌生成 · 2026-08`
- 一句斜体假设："如果把韵律约束显式化，模型能否在保留意象的同时收敛到指定格律？"
- 提示词迭代表格（mono 字体，紧凑）：列为 `版本 / 提示词摘要 / 输出片段 / 失败模式`，v1→v2→v3。
- 结尾 2–3 句"记录"：写观察到什么、下一步会试什么。
- 三则之间用 hairline + `· · ·` 分节。
- 三则主题：诗歌形式约束、短篇小说人物一致性、编辑修订轨迹作为训练信号。

## Resume → 简历 / CV

- 标题改为中文"简历"，副标题"工作经历"。
- 两列布局：左列 mono 年份区间（固定宽 9rem），右列职务 / 机构 / 一行说明。取消 timeline 圆点竖线。
- 分四小节：`工作经历`、`教育`（新增，3–4 条：年份 · 中文标题 · 载体）、`技能与联系`。
- 技能改为一段散文式中文列举，不再用 tag pills。
- 末尾"联系"：手机号码、邮箱。

## Footer

单行细体：`聂蓝玉 · 2026 · 用普通的 HTML 写成 · GitHub`，纯文字链，一条 hairline 上边框。

## 文件改动

编辑：

- `src/styles.css`（字体 token、纸色背景、`.prose-article`、中文行高字距）
- `src/routes/__root.tsx`（Google Fonts links、meta 改为中文标题/描述）
- `src/routes/index.tsx`（meta 中文化，结构不变）
- `FixedNav.tsx`、`Hero.tsx`、`AbstractCards.tsx`、`ResearchArticle.tsx`、`Experiments.tsx`、`Resume.tsx`、`Footer.tsx`（全部中文化 + 排版调整）

&nbsp;