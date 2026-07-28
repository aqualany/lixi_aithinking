import { useEffect, useRef, useState } from "react";
import type { HeroProps } from "@/lib/cms/types";

const AVATAR_KEY = "portfolio.avatar";

const FALLBACK_PROPS: HeroProps = {
  authorName: "聂灵晞",
  authorNameEn: "Nie Lingxi",
  heroEyebrow: "个人主页 · 最近更新 二〇二六年十一月",
  bioLines: [
    "写作者，AI 创作探索中。",
    "曾是六年 UI 设计师。",
    "兴趣：设计与制作首饰，vibe-coding 产品点子。",
    "理性分析 & 感性共情的 INFJ。",
  ],
  avatarUrl: null,
};

export function Hero({ data }: { data?: HeroProps }) {
  const d = data ?? FALLBACK_PROPS;

  const [avatar] = useState<string | null>(d.avatarUrl ?? null);

  return (
    <header id="top" className="mx-auto max-w-3xl px-6 pt-32 pb-16">
      <div className="grid grid-cols-[1fr_auto] items-start gap-8 sm:gap-12">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            {d.heroEyebrow}
          </p>
          <h1 className="mt-8 font-zhuque text-[52px] leading-[1.15] tracking-[0.06em] text-foreground sm:text-[68px]">
            {d.authorName}
          </h1>
          <p className="mt-3 font-sans text-xs tracking-[0.28em] text-muted-foreground uppercase">
            {d.authorNameEn}
          </p>

          <div className="mt-8 space-y-2.5 font-serif text-[16.5px] leading-[1.9] tracking-[0.01em] text-foreground">
            {d.bioLines.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>

        <div className="shrink-0">
          <div className="block h-28 w-28 overflow-hidden rounded-full border border-border bg-muted sm:h-36 sm:w-36">
            {avatar ? (
              <img
                src={avatar}
                alt="头像"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                上传照片
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
