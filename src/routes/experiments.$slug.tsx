import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { FixedNav } from "@/components/portfolio/FixedNav";
import { Footer } from "@/components/portfolio/Footer";
import type { FooterProps, FixedNavProps } from "@/lib/cms/types";

import { experiments, type ExperimentSlug } from "@/components/portfolio/Experiments";

export const Route = createFileRoute("/experiments/$slug")({
  head: (ctx) => {
    const seo = (ctx as any)?.context?.pageSeoMap?.["experiments"] ?? null;
    return {
      meta: [
        { title: seo?.title ?? "实验笔记 · 聂灵晞" },
        { name: "description", content: seo?.description ?? "AI 创作实验笔记：与模型协作的完整过程与自训练思路。" },
        { property: "og:title", content: seo?.title ?? "实验笔记 · 聂灵晞" },
        { property: "og:description", content: seo?.description ?? "提示词优化的过程记录与从中提炼的 AI 自训练思路。" },
      ],
    };
  },
  loader: ({ params }) => {
    const found = experiments.find((e) => e.slug === params.slug);
    if (!found) throw notFound();
    return { slug: found.slug };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <p className="font-serif text-[20px] text-foreground">未找到这则实验笔记。</p>
        <Link to="/" hash="experiments" className="mt-4 inline-block font-mono text-[12px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
          ← 返回主页
        </Link>
      </div>
    </div>
  ),
  component: ExperimentDetail,
});

function ExperimentDetail() {
  const rootCtx = Route.useRouteContext() as { footerProps?: FooterProps | null; fixedNavProps?: FixedNavProps | null };
  const { slug } = Route.useParams();
  const data = experiments.find((e) => e.slug === (slug as ExperimentSlug))!;
  const [images, setImages] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const storageKey = `experiment.images.${slug}`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setImages(JSON.parse(raw));
    } catch {}
  }, [storageKey]);

  const persist = (next: string[]) => {
    setImages(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {}
  };

  const onAdd = (files: FileList | null) => {
    if (!files) return;
    const readers = Array.from(files).map(
      (f) =>
        new Promise<string>((resolve) => {
          const r = new FileReader();
          r.onload = () => resolve(String(r.result || ""));
          r.readAsDataURL(f);
        }),
    );
    Promise.all(readers).then((datas) => persist([...images, ...datas]));
  };

  const remove = (i: number) => persist(images.filter((_, idx) => idx !== i));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <FixedNav data={rootCtx.fixedNavProps ?? undefined} />
      <main className="pt-16">
        <div className="mx-auto max-w-3xl px-6 pt-10">
          <Link
            to="/"
            hash="experiments"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
          >
            ← 返回实验笔记
          </Link>
        </div>

        <section className="border-t border-border">
          <div className="mx-auto max-w-3xl px-6 py-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              {data.num} · {data.date} · {data.category}
            </p>
            <h1 className="mt-6 zh-title font-serif text-[36px] leading-[1.35] tracking-[0.02em] text-foreground sm:text-[42px]">
              {data.title}
            </h1>
            <p className="mt-8 border-l border-foreground pl-6 font-serif text-[17px] italic leading-[1.95] tracking-[0.02em] text-foreground">
              <span className="not-italic font-medium">假设。</span>
              {data.hypothesis}
            </p>

            <div className="mt-16">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                一 · 与 AI 沟通过程
              </p>
              <h2 className="mt-4 zh-title font-serif text-[24px] leading-[1.4] tracking-[0.02em] text-foreground">
                提示词优化的过程
              </h2>
              <p className="mt-6 font-serif text-[16px] leading-[1.9] tracking-[0.01em] text-foreground">
                {data.keyInsight}
              </p>
              <ol className="mt-8 space-y-4 border-l border-border pl-6 font-serif text-[15.5px] leading-[1.9] text-foreground">
                {data.optimization.map((step, i) => (
                  <li key={i}>
                    <span className="font-mono text-[11px] tracking-[0.15em] text-muted-foreground">
                      步骤 {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-16">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                二 · 对话截图
              </p>
              <div className="mt-4 flex items-baseline justify-between">
                <h2 className="zh-title font-serif text-[24px] leading-[1.4] tracking-[0.02em] text-foreground">
                  与 AI 的往返
                </h2>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="border border-foreground px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-foreground hover:text-background"
                >
                  + 上传截图
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    onAdd(e.target.files);
                    e.target.value = "";
                  }}
                />
              </div>

              {images.length === 0 ? (
                <div className="mt-6 border border-dashed border-border p-10 text-center">
                  <p className="font-serif text-[15px] italic leading-[1.9] text-muted-foreground">
                    还没有截图。点击右上「上传截图」，把你与 AI 的多轮对话按顺序放进来，
                    <br />可上下滑动阅读。
                  </p>
                </div>
              ) : (
                <div className="mt-6 max-h-[720px] space-y-6 overflow-y-auto border border-border p-4">
                  {images.map((src, i) => (
                    <figure key={i} className="relative">
                      <img
                        src={src}
                        alt={`对话截图 ${i + 1}`}
                        className="block w-full border border-border"
                      />
                      <figcaption className="mt-2 flex items-baseline justify-between font-mono text-[11px] tracking-[0.15em] text-muted-foreground">
                        <span>截图 {String(i + 1).padStart(2, "0")}</span>
                        <button
                          type="button"
                          onClick={() => remove(i)}
                          className="uppercase tracking-[0.2em] transition-colors hover:text-foreground"
                        >
                          移除
                        </button>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-16">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                三 · 自训练思路
              </p>
              <h2 className="mt-4 zh-title font-serif text-[24px] leading-[1.4] tracking-[0.02em] text-foreground">
                这条优化过程如何被 AI 自训练
              </h2>
              <p className="mt-6 font-serif text-[16px] leading-[1.9] tracking-[0.01em] text-muted-foreground">
                把上面的“人 → AI → 反馈 → 再提示”这条链条形式化，就可以变成一份小型的、可训练的数据结构。以下是我从这次迭代里提炼的两条动作：
              </p>
              <ol className="mt-8 space-y-6 font-serif text-[16px] leading-[1.95] text-foreground">
                {data.selfTraining.map((s, i) => (
                  <li key={i} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-border pb-6 last:border-b-0">
                    <span className="font-mono text-[12px] tracking-[0.15em] text-muted-foreground pt-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p>{s}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </main>
      <Footer data={rootCtx.footerProps ?? undefined} />
    </div>
  );
}