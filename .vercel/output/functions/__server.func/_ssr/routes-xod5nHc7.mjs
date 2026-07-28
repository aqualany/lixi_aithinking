import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Footer, t as FixedNav } from "./Footer-BcWwXwlH.mjs";
import { n as ResearchPreview } from "./ResearchArticle-BeTBQXZ8.mjs";
import { t as Route } from "./routes-Dzg1onfp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-xod5nHc7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_PROPS = {
	authorName: "聂灵晞",
	authorNameEn: "Nie Lingxi",
	heroEyebrow: "个人主页 · 最近更新 二〇二六年十一月",
	bioLines: [
		"写作者，AI 创作探索中。",
		"曾是六年 UI 设计师。",
		"兴趣：设计与制作首饰，vibe-coding 产品点子。",
		"理性分析 & 感性共情的 INFJ。"
	],
	avatarUrl: null
};
function Hero({ data }) {
	const d = data ?? FALLBACK_PROPS;
	const [avatar] = (0, import_react.useState)(d.avatarUrl ?? null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		id: "top",
		className: "mx-auto max-w-3xl px-6 pt-32 pb-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-[1fr_auto] items-start gap-8 sm:gap-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground",
					children: d.heroEyebrow
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-8 font-zhuque text-[52px] leading-[1.15] tracking-[0.06em] text-foreground sm:text-[68px]",
					children: d.authorName
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 font-sans text-xs tracking-[0.28em] text-muted-foreground uppercase",
					children: d.authorNameEn
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 space-y-2.5 font-serif text-[16.5px] leading-[1.9] tracking-[0.01em] text-foreground",
					children: d.bioLines.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: line }, i))
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "block h-28 w-28 overflow-hidden rounded-full border border-border bg-muted sm:h-36 sm:w-36",
					children: avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: avatar,
						alt: "头像",
						className: "h-full w-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex h-full w-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
						children: "上传照片"
					})
				})
			})]
		})
	});
}
var FALLBACK_TABS = [
	{
		id: "research",
		label: "研究",
		hint: "01"
	},
	{
		id: "experiments",
		label: "实验笔记",
		hint: "02"
	},
	{
		id: "resume",
		label: "简历",
		hint: "03"
	}
];
function SectionTabs({ active, onChange, data }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-3xl px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-y border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex items-stretch",
				children: (data?.tabs ?? FALLBACK_TABS).map((t) => {
					const isActive = active === t.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onChange(t.id),
							className: "group flex w-full items-baseline justify-center gap-3 py-4 transition-colors " + (isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[11px] tracking-[0.2em]",
								children: t.hint
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-serif text-[16px] tracking-[0.08em] " + (isActive ? "border-b border-foreground pb-1" : ""),
								children: t.label
							})]
						})
					}, t.id);
				})
			})
		})
	});
}
var FALLBACK_LIST = { experiments: [
	{
		slug: "wuxia",
		num: "笔记 01",
		date: "2026 · 08",
		category: "武侠小说创作",
		title: "招式不写\"快\"：以动作为骨的武侠段落",
		keyInsight: "把\"凌厉、迅捷、狠辣\"这类形容词禁掉，只允许写身体、器物与呼吸——武打段落从戏剧摘要变成可被读者身体感到的动作。",
		hypothesis: "武侠段落的\"力气\"来自动词与关节位置，而非形容词。禁用副词是最小干预。",
		optimization: [
			"v1：让模型直接\"写一段武打\"，产出的是电视剧解说词。",
			"v2：加入约束\"不许使用形容词与副词\"，模型开始写身体。",
			"v3：加入\"镜头只跟随一件器物\"，画面自动获得节奏与视点。"
		],
		selfTraining: ["把武侠语料按\"动作/心理/景物\"三层拆开，训练模型学习\"留白比例\"。", "将修订前后的删除线作为对比样本，教会模型识别\"过度描写\"。"]
	},
	{
		slug: "song-ci",
		num: "笔记 02",
		date: "2026 · 09",
		category: "宋词创作",
		title: "以修订轨迹作训练信号：一阕《青玉案》的诞生",
		keyInsight: "让模型看\"从初稿到定稿之间被划掉的字\"，比只让它看定稿，更能学到什么叫\"声音\"。取舍即数据。",
		hypothesis: "词牌的\"味\"不在字面，而在\"为什么这个字而不是那个字\"的选择过程。",
		optimization: [
			"v1：仿辛弃疾风格作《青玉案》——格律对，用词漂亮而空。",
			"v2：要求模型给三份候选并说明会划掉哪一份，出现\"编辑视角\"。",
			"v3：把定稿当第一稿交给三十年后的自己修订，产出带修订小注的双层文本。"
		],
		selfTraining: ["构造 (草稿, 修订理由, 定稿) 的三元组作为微调样本。", "以\"字级别删除线\"作为损失函数的注意力权重，让模型学习\"克制\"。"]
	},
	{
		slug: "modern-poetry",
		num: "笔记 03",
		date: "2026 · 10",
		category: "现代诗创作",
		title: "形式约束下的意象派：只写物，不许写情绪",
		keyInsight: "把\"不许写情绪形容词\"的负约束显式化，模型从\"告诉读者感觉什么\"转向\"让画面自己承受重量\"。",
		hypothesis: "负约束（不许写什么）比正约束（要写什么）更快把诗从摘要逼进意象。",
		optimization: [
			"v1：\"写一首关于孤独的现代诗\"——抽象、感伤，无落脚点。",
			"v2：限定\"只能用具体物：椅子、雨、灯、杯\"，物件到场，句法仍在解释。",
			"v3：四行，禁一切情绪形容词，只写物——情绪从排布里长出来。"
		],
		selfTraining: ["在语料中给句子标注 show/tell 二值标签，作为可训练的\"质地\"信号。", "构造\"禁用词-输出\"成对样本，教会模型在缺失常用词时寻找替代表达。"]
	}
].map((c) => ({
	slug: c.slug,
	num: c.num,
	date: c.date,
	category: c.category,
	title: c.title,
	keyInsight: c.keyInsight
})) };
function Experiments({ data }) {
	const cards = data?.experiments ?? FALLBACK_LIST.experiments;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "experiments",
		className: "scroll-mt-24 border-t border-border bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl px-6 py-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground",
					children: "实验笔记 · 02"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-6 zh-title font-serif text-[36px] leading-[1.35] tracking-[0.02em] text-foreground sm:text-[44px]",
					children: "提示词作为方法"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 font-serif text-[16.5px] leading-[1.9] tracking-[0.01em] text-muted-foreground",
					children: "三则与模型协作写作的记录。每一张卡片是一次提示词优化的落点，点击进入笔记内页，看到完整的对话过程与从中提炼的自训练思路。"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-14 grid gap-6 md:grid-cols-3",
					children: cards.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/experiments/$slug",
						params: { slug: e.slug },
						className: "group flex h-full flex-col border border-border p-6 transition-colors hover:border-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[11px] tracking-[0.2em] text-muted-foreground",
									children: e.num
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[11px] tracking-[0.15em] text-muted-foreground",
									children: e.date
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground",
								children: e.category
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-3 zh-title font-serif text-[20px] leading-[1.45] tracking-[0.02em] text-foreground",
								children: e.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 flex-1 font-serif text-[14.5px] leading-[1.85] text-foreground",
								children: e.keyInsight
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-6 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-foreground",
								children: ["进入笔记", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									"aria-hidden": true,
									className: "transition-transform group-hover:translate-x-1",
									children: "→"
								})]
							})
						]
					}, e.slug))
				})
			]
		})
	});
}
var experience = [
	{
		year: "2024 — 至今",
		role: "独立研究者 · 创意数据方向",
		org: "为多家语言模型团队提供咨询",
		detail: "为文学与对话数据设计人机在环的流水线；建立标注方案，用于捕获修订轨迹、声音不变量与编辑约束。"
	},
	{
		year: "2022 — 2024",
		role: "高级产品经理 · NLP",
		org: "字浪科技（Bytewave AI）",
		detail: "主导创作辅助写作产品线；负责提示词设计、评测框架，以及一套面向写作者的数据采集界面，用于微调一款 34B 中文模型。"
	},
	{
		year: "2020 — 2022",
		role: "产品经理 · 语言工具",
		org: "文智科技",
		detail: "上线一款面向译者的双语编辑产品；主持审校计划，产出了内部的&ldquo;平行修订&rdquo;语料。"
	},
	{
		year: "2018 — 2020",
		role: "UI 设计师 · 编辑数据方向",
		org: "枭书出版",
		detail: "编辑部与工程团队之间的接口；第一次直接观察到&ldquo;编辑心里知道的东西&rdquo;与&ldquo;训练语料真正记录下的东西&rdquo;之间的差。"
	}
];
var education = [{
	year: "2016 — 2018",
	role: "文学硕士 · 比较文学",
	org: "复旦大学",
	detail: "毕业论文：《形式约束在现代主义诗歌中的角色》。"
}, {
	year: "2012 — 2016",
	role: "工学学士 · 计算机科学（辅修中国文学）",
	org: "浙江大学",
	detail: "自然语言处理与古典诗学并置修读。"
}];
var writings = [
	{
		year: "2026",
		title: "《流畅之后：论写作、语言理解与创意数据》",
		venue: "个人主页（本页第 01 节）"
	},
	{
		year: "2025",
		title: "《为什么修订轨迹应该被当作一等公民语料》",
		venue: "内部技术备忘 · 字浪科技"
	},
	{
		year: "2024",
		title: "《当模型学会流畅：一份写给编辑的说明》",
		venue: "《读库》约稿"
	}
];
var skills = [
	"创意数据流水线设计",
	"人类标注计划管理",
	"提示词与评测框架",
	"与模型团队协作微调",
	"编辑判断与文学阅读",
	"中 / 英双语写作",
	"Python · SQL",
	"读者小组研究"
];
function CVList({ entries }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "space-y-8",
		children: entries.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "grid gap-x-6 gap-y-2 border-b border-border pb-8 last:border-b-0 last:pb-0 md:grid-cols-[7rem_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[12px] tracking-[0.12em] text-muted-foreground pt-1",
				children: e.year
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "font-serif text-[19px] leading-[1.5] tracking-[0.02em] text-foreground",
					children: e.role
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-sans text-[13px] tracking-[0.02em] text-muted-foreground",
					children: e.org
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 font-serif text-[15.5px] leading-[1.9] tracking-[0.01em] text-foreground",
					dangerouslySetInnerHTML: { __html: e.detail }
				})
			] })]
		}, e.year + e.role))
	});
}
function Section({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-16 grid gap-8 border-t border-border pt-10 md:grid-cols-[12rem_1fr] md:gap-x-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children })]
	});
}
var FALLBACK_TITLE = "聂灵晞 · 简历";
var FALLBACK_SUMMARY = "从 UI 设计与产品出身，逐步转入创作数据与人机协作写作方向。以下按\"经历—教育—写作—技能\"分列。";
function Resume({ data }) {
	const d = data ?? {
		title: FALLBACK_TITLE,
		summary: FALLBACK_SUMMARY,
		experience,
		education,
		writings,
		skills
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "resume",
		className: "scroll-mt-24 border-t border-border bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl px-6 py-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground",
					children: "简历 · 03"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-6 zh-title font-serif text-[36px] leading-[1.35] tracking-[0.02em] text-foreground sm:text-[44px]",
					children: d.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 font-serif text-[16px] leading-[1.9] tracking-[0.01em] text-muted-foreground",
					children: "从 UI 设计与产品出身，逐步转入创作数据与人机协作写作方向。以下按“经历—教育—写作—技能”分列。"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					label: "工作经历",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CVList, { entries: d.experience })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					label: "教育",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CVList, { entries: d.education })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					label: "部分写作",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "space-y-5",
						children: d.writings.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "grid gap-x-6 gap-y-1 md:grid-cols-[7rem_1fr]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[12px] tracking-[0.12em] text-muted-foreground pt-1",
								children: w.year
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-[16.5px] leading-[1.6] tracking-[0.02em] text-foreground",
								children: w.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-sans text-[13px] text-muted-foreground",
								children: w.venue
							})] })]
						}, w.title))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					label: "工作方法 / 技能",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid grid-cols-2 gap-x-6 gap-y-2 font-serif text-[15.5px] leading-[1.85] text-foreground sm:grid-cols-2",
						children: d.skills.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "before:content-['—'] before:mr-2 before:text-muted-foreground",
							children: s
						}, s))
					})
				})
			]
		})
	});
}
function Index() {
	const rootCtx = Route.useRouteContext();
	const [tab, setTab] = (0, import_react.useState)("research");
	(0, import_react.useEffect)(() => {
		const apply = () => {
			const h = window.location.hash.replace("#", "");
			if (h === "research" || h === "experiments" || h === "resume") setTab(h);
		};
		apply();
		window.addEventListener("hashchange", apply);
		return () => window.removeEventListener("hashchange", apply);
	}, []);
	const onChange = (id) => {
		setTab(id);
		if (typeof window !== "undefined") history.replaceState(null, "", `#${id}`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FixedNav, {
				activeTab: tab,
				onTabChange: onChange,
				data: rootCtx.fixedNavProps ?? void 0
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, { data: rootCtx.heroProps ?? void 0 }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTabs, {
					active: tab,
					onChange: (id) => onChange(id),
					data: rootCtx.sectionTabsProps ?? void 0
				}),
				tab === "research" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResearchPreview, { data: rootCtx.researchProps ?? void 0 }),
				tab === "experiments" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Experiments, { data: rootCtx.experimentsListProps ?? void 0 }),
				tab === "resume" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Resume, { data: rootCtx.resumeProps ?? void 0 })
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, { data: rootCtx.footerProps ?? void 0 })
		]
	});
}
//#endregion
export { Index as component };
