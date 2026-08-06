// src/components/admin/article-image-extensions.tsx
// Custom TipTap image node built on a "display frame" model:
//  - Every image is wrapped in <div class="img-frame">. The frame is resizable
//    (width via the right handle, height via the bottom handle); the image
//    fills the frame proportionally and scrolls inside it.
//  - frameWidth / frameHeight are serialized into the node attrs, so the size
//    survives reloads and the frontend reproduces the same structure.
//  - Side-by-side is expressed with layout attrs (NOT a container node):
//      layout: "half" + groupId -> consecutive images with the same groupId
//      render as a flex/inline row. Each image stays an independent, selectable
//      ResizableImage node (no nested NodeView selection issues).

import { mergeAttributes } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import { NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from "@tiptap/react";
import { useEffect, useRef, useState } from "react";

// Same thresholds as the frontend ArticleBody long-image detection.
const LONG_MIN_ASPECT = 2; // height / width ratio
const LONG_MAX_HEIGHT = 500; // px

// Helper: from a parsed element (frame div OR legacy plain img) get the <img>.
function imgOf(el: HTMLElement | null): HTMLImageElement | null {
  if (!el) return null;
  return el.tagName === "IMG" ? (el as HTMLImageElement) : el.querySelector("img");
}

// Resolve the frame element an attribute is parsed from (frame div, or the
// frame an <img> lives inside; null for legacy plain images).
function frameOf(el: HTMLElement | null): HTMLElement | null {
  if (!el) return null;
  return el.classList.contains("img-frame") ? el : el.closest(".img-frame");
}

// ── Standalone image: resizable display frame ──────────────────────────────

function ResizableImageNodeView({ node, updateAttributes, selected }: NodeViewProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const wHandleRef = useRef<HTMLSpanElement>(null);
  const hHandleRef = useRef<HTMLSpanElement>(null);
  const [isLong, setIsLong] = useState(false);

  // Detect long images so the frame caps its height and scrolls.
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    const check = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      setIsLong(w > 0 && h > 0 && h / w >= LONG_MIN_ASPECT && h > LONG_MAX_HEIGHT);
    };
    if (img.complete) check();
    else img.addEventListener("load", check, { once: true });
    return () => img.removeEventListener("load", check);
  }, [node.attrs.src]);

  // Native mousedown (fires before ProseMirror) on the right handle → width.
  useEffect(() => {
    const el = wHandleRef.current;
    if (!el) return;
    const onDown = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const startX = e.clientX;
      const startW = frameRef.current?.clientWidth || 0;
      const move = (ev: MouseEvent) => {
        updateAttributes({ frameWidth: Math.max(80, Math.round(startW + (ev.clientX - startX))) });
      };
      const up = () => {
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
      };
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    };
    el.addEventListener("mousedown", onDown);
    return () => el.removeEventListener("mousedown", onDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node.attrs.src]);

  // Bottom handle → height.
  useEffect(() => {
    const el = hHandleRef.current;
    if (!el) return;
    const onDown = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const startY = e.clientY;
      const startH = frameRef.current?.clientHeight || 0;
      const move = (ev: MouseEvent) => {
        updateAttributes({ frameHeight: Math.max(60, Math.round(startH + (ev.clientY - startY))) });
      };
      const up = () => {
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
      };
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    };
    el.addEventListener("mousedown", onDown);
    return () => el.removeEventListener("mousedown", onDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node.attrs.src]);

  const attrs = node.attrs as any;
  const style: any = {};
  if (attrs.frameWidth) style.width = `${attrs.frameWidth}px`;
  if (attrs.frameHeight) style.height = `${attrs.frameHeight}px`;

  return (
    <NodeViewWrapper className={attrs.layout === "half" ? "image-half" : undefined}>
      <div
        ref={frameRef}
        className={`img-frame${isLong ? " is-long" : ""}${selected ? " is-selected" : ""}`}
        style={style}
      >
        {/* draggable={false}: prevent the browser's native image drag from
            hijacking mousedown, so ProseMirror can select the node on click */}
        <img ref={imgRef} src={attrs.src} alt={attrs.alt || ""} draggable={false} />
        <span ref={wHandleRef} className="img-frame-resize img-frame-resize-w" title="拖拽调整宽度" />
        <span ref={hHandleRef} className="img-frame-resize img-frame-resize-h" title="拖拽调整高度" />
      </div>
    </NodeViewWrapper>
  );
}

export const ResizableImage = Image.extend({
  // draggable: false keeps the resize handle drag from being hijacked by
  // ProseMirror's node dragging.
  draggable: false,
  // Atom so each image is an independent selectable unit — critical for the
  // side-by-side layout where images are plain siblings (no container node).
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (el) => imgOf(el as HTMLElement)?.getAttribute("src") || null,
        renderHTML: (attrs) => (attrs.src ? { src: attrs.src } : {}),
      },
      alt: {
        default: null,
        parseHTML: (el) => imgOf(el as HTMLElement)?.getAttribute("alt") || null,
        renderHTML: (attrs) => (attrs.alt ? { alt: attrs.alt } : {}),
      },
      title: {
        default: null,
        parseHTML: (el) => imgOf(el as HTMLElement)?.getAttribute("title") || null,
        renderHTML: (attrs) => (attrs.title ? { title: attrs.title } : {}),
      },
      frameWidth: {
        default: null,
        parseHTML: (el) => {
          const m = ((el as HTMLElement).getAttribute?.("style") || "").match(/width:\s*(\d+)px/);
          return m ? m[1] : null;
        },
        renderHTML: () => ({}), // applied to the frame in renderHTML below
      },
      frameHeight: {
        default: null,
        parseHTML: (el) => {
          const m = ((el as HTMLElement).getAttribute?.("style") || "").match(/height:\s*(\d+)px/);
          return m ? m[1] : null;
        },
        renderHTML: () => ({}), // applied to the frame in renderHTML below
      },
      layout: {
        default: "default",
        parseHTML: (el) => frameOf(el as HTMLElement)?.getAttribute("data-layout") || "default",
        renderHTML: () => ({}), // applied to the frame in renderHTML below
      },
      groupId: {
        default: null,
        parseHTML: (el) => frameOf(el as HTMLElement)?.getAttribute("data-group") || null,
        renderHTML: () => ({}), // applied to the frame in renderHTML below
      },
    };
  },

  parseHTML() {
    return [{ tag: "div.img-frame" }, { tag: "img[src]" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const a = node.attrs as any;
    const style: string[] = [];
    if (a.frameWidth) style.push(`width:${a.frameWidth}px`);
    if (a.frameHeight) style.push(`height:${a.frameHeight}px`);
    const frame: Record<string, string> = { class: "img-frame" };
    if (style.length) frame.style = style.join(";");
    if (a.layout === "half") frame["data-layout"] = "half";
    if (a.groupId) frame["data-group"] = a.groupId;
    return ["div", frame, ["img", mergeAttributes(HTMLAttributes)]];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageNodeView);
  },
});
