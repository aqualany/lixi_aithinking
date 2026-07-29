import type { FooterProps } from "@/lib/cms/types";

export function Footer({ data }: { data?: FooterProps }) {
  if (!data) {
    return (
      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <div className="font-mono text-[12px] tracking-[0.12em] text-muted-foreground">
            &copy; 2026
          </div>
        </div>
      </footer>
    );
  }

  // Use contactLinks if available, otherwise fall back to legacy links
  // NEVER render both (was causing duplicate display)
  const showLinks = (data.contactLinks && data.contactLinks.length > 0) 
    ? data.contactLinks 
    : (data.links && data.links.length > 0 
      ? data.links.map(l => ({ label: l.label, href: l.href })) 
      : []);

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <div className="flex flex-wrap items-baseline justify-between gap-y-4 font-mono text-[12px] tracking-[0.12em] text-muted-foreground">
          <span>
            &copy; 2026　{data.authorName}　{data.authorNameEn}
          </span>
          {showLinks.length > 0 && (
            <div className="flex flex-wrap gap-x-5">
              {showLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
