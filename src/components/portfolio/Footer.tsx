export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <div className="flex flex-wrap items-baseline justify-between gap-y-4 font-mono text-[12px] tracking-[0.12em] text-muted-foreground">
          <span>
            © 2026　聂蓝玉　Nie Lanyu
          </span>
          <div className="flex flex-wrap gap-x-5">
            <a
              href="mailto:nielanyu@example.com"
              className="transition-colors hover:text-foreground"
            >
              nielanyu@example.com
            </a>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
        <p className="mt-4 font-serif text-[13px] italic tracking-[0.02em] text-muted-foreground">
          本站正文以思源宋体排版，元数据以思源黑体。感谢阅读。
        </p>
      </div>
    </footer>
  );
}