import type { FooterProps } from "@/lib/cms/types";

const FALLBACK_PROPS: FooterProps = {
  authorName: "聂灵晞",
  authorNameEn: "Lixi Nie",
  links: [
    { label: "nielanyu@example.com", href: "mailto:nielanyu@example.com", isExternal: true },
    { label: "GitHub", href: "https://github.com/", isExternal: true },
  ],
};

export function Footer({ data }: { data?: FooterProps }) {
  const d = data ?? FALLBACK_PROPS;



  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <div className="flex flex-wrap items-baseline justify-between gap-y-4 font-mono text-[12px] tracking-[0.12em] text-muted-foreground">
          <span>
            &copy; 2026　{d.authorName}　{d.authorNameEn}
          </span>
          <div className="flex flex-wrap gap-x-5">
  
          </div>
        </div>
        
      </div>
    </footer>
  );
}
