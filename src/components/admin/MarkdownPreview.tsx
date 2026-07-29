import { ProseMarkdown } from "@/lib/cms/markdown";

interface MarkdownPreviewProps {
  content: string;
  /** URL to open for full preview (e.g. /experiments/slug) */
  previewUrl?: string;
  /** Label for the preview button */
  previewLabel?: string;
}

export function MarkdownPreview({ content, previewUrl, previewLabel }: MarkdownPreviewProps) {
  // Only renders content for the admin edit section label
  // Preview opens in a new tab via the button on the edit page
  return null;
}

/** Inline markdown render (used outside edit form) */
export function RenderedMarkdown({ content }: { content: string }) {
  if (!content) return <p className="text-xs text-stone-400 italic">暂无内容</p>;
  return (
    <div className="prose-article max-w-none rounded-lg border border-stone-200 bg-white p-6">
      <ProseMarkdown content={content} />
    </div>
  );
}
