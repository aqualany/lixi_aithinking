import { useState } from "react";
import type { HeroProps } from "@/lib/cms/types";

export function Hero({ data }: { data?: HeroProps }) {
  // Item 8 + 13: No hardcoded content — render nothing if no data
  if (!data) return null;

  return (
    <header id="top" className="mx-auto max-w-3xl px-6 pt-32 pb-16">
      <div className="grid grid-cols-[1fr_auto] items-center gap-8 sm:gap-12">
        <div>
          <h1 className="mt-8 font-zhuque text-[52px] leading-[1.15] tracking-[0.06em] text-foreground sm:text-[68px]">
            {data.authorName}
          </h1>
          <p className="mt-3 font-sans text-xs tracking-[0.28em] text-muted-foreground uppercase">
            {data.authorNameEn}
          </p>

          <div className="mt-8 space-y-2.5 font-sans text-[14.5px] leading-[1.9] tracking-[0.01em] text-foreground">
            {data.bioLines.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>

        <div className="shrink-0">
          <div className="block h-28 w-28 overflow-hidden rounded-full border border-border bg-muted sm:h-36 sm:w-36">
            {data.avatarUrl ? (
              <img
                src={data.avatarUrl}
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
