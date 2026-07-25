import { useEffect, useRef, useState } from "react";

const AVATAR_KEY = "portfolio.avatar";

export function Hero() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AVATAR_KEY);
      if (saved) setAvatar(saved);
    } catch {}
  }, []);

  const onPick = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const data = String(reader.result || "");
      setAvatar(data);
      try {
        localStorage.setItem(AVATAR_KEY, data);
      } catch {}
    };
    reader.readAsDataURL(file);
  };

  return (
    <header id="top" className="mx-auto max-w-3xl px-6 pt-32 pb-16">
      <div className="grid grid-cols-[1fr_auto] items-start gap-8 sm:gap-12">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            个人主页 · 最近更新 二〇二六年十一月
          </p>
          <h1 className="mt-8 font-zhuque text-[52px] leading-[1.15] tracking-[0.06em] text-foreground sm:text-[68px]">
            聂灵晞
          </h1>
          <p className="mt-3 font-sans text-xs tracking-[0.28em] text-muted-foreground uppercase">
            Nie&nbsp;Lingxi
          </p>

          <div className="mt-8 space-y-2.5 font-serif text-[16.5px] leading-[1.9] tracking-[0.01em] text-foreground">
            <p>写作者，AI 创作探索中。</p>
            <p>曾是六年 UI 设计师。</p>
            <p>兴趣：设计与制作首饰，vibe-coding 产品点子。</p>
            <p>理性分析 &amp; 感性共情的 INFJ。</p>
          </div>
        </div>

        <div className="shrink-0">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="group relative block h-28 w-28 overflow-hidden rounded-full border border-border bg-muted sm:h-36 sm:w-36"
            aria-label="上传头像"
          >
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
            <span className="absolute inset-0 flex items-end justify-center bg-foreground/0 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-transparent transition-all group-hover:bg-foreground/40 group-hover:text-background">
              更换
            </span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onPick(f);
            }}
          />
        </div>
      </div>
    </header>
  );
}