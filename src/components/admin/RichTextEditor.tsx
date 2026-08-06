// src/components/admin/RichTextEditor.tsx — shared rich text editor (TipTap)
// Used by BOTH 当下的思考 (research) and 与AI创作中 (experiment) editors.

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { ResizableImage } from "@/components/admin/article-image-extensions";
import { useEffect, useReducer, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Quote,
  List,
  ListOrdered,
  Link2,
  ImagePlus,
  Minus,
  Undo2,
  Redo2,
  Pilcrow,
  Columns2,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder = "开始撰写…" }: RichTextEditorProps) {
  const [, force] = useReducer((x: number) => x + 1, 0);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      ResizableImage.configure({ allowBase64: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    editorProps: {
      attributes: { class: "rich-editor-prosemirror" },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      force();
    },
    onSelectionUpdate: () => force(),
    onTransaction: () => force(),
  });

  // TEMP: expose editor on window for runtime getJSON/getHTML verification
  useEffect(() => {
    if (editor) (window as any).EDITOR = editor;
    else delete (window as any).EDITOR;
  }, [editor]);

  // External value sync (e.g. after async post load)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if ((value || "") !== current) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  const run = (fn: (chain: any) => any) => {
    if (!editor) return;
    fn(editor.chain().focus()).run();
    force();
  };

  const isActive = (name: string, attrs?: any) => editor?.isActive(name, attrs) ?? false;

  // ── Image picker state ────────────────────────────────────
  const [showMedia, setShowMedia] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pairMode, setPairMode] = useState(false);
  const [pairSel, setPairSel] = useState<string[]>([]);

  const loadMedia = async () => {
    setLoadingMedia(true);
    const { data } = await (supabase.from("media") as any)
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setFiles(data);
    setLoadingMedia(false);
  };

  const toggleMedia = () => {
    if (!showMedia && files.length === 0) loadMedia();
    setShowMedia(!showMedia);
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `uploads/${Date.now()}.${ext}`;
    const { error: storageErr } = await (supabase.storage.from("media") as any).upload(path, file);
    if (storageErr) {
      setUploading(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path);
    await (supabase.from("media") as any).insert({
      storage_path: path,
      public_url: publicUrl,
      mime_type: file.type,
      alt: file.name,
      media_category: "article",
    });
    setUploading(false);
    loadMedia();
  };

  const insertImage = (src: string) => {
    run((chain: any) => chain.setImage({ src }));
    setShowMedia(false);
  };

  const togglePairMode = () => {
    if (!showMedia && files.length === 0) loadMedia();
    setPairMode(!pairMode);
    setPairSel([]);
    setShowMedia(true);
  };

  const handleMediaClick = (f: any) => {
    if (pairMode) {
      const next = pairSel.includes(f.public_url) ? pairSel : [...pairSel, f.public_url];
      if (next.length === 2) {
        // Plan B: insert TWO independent image nodes (not a container). They
        // share a groupId + layout:"half" so they render side by side.
        const groupId = `g${Date.now()}${Math.random().toString(36).slice(2, 6)}`;
        // Single insertContent with an array — chaining two insertContent calls
        // only applies one of them, which broke the pair insertion.
        run((chain: any) =>
          chain.insertContent([
            { type: "image", attrs: { src: next[0], alt: "", layout: "half", groupId } },
            { type: "image", attrs: { src: next[1], alt: "", layout: "half", groupId } },
          ])
        );
        setPairMode(false);
        setPairSel([]);
        setShowMedia(false);
      } else {
        setPairSel(next);
      }
    } else {
      insertImage(f.public_url);
    }
  };

  const setLink = () => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("链接 URL", prev || "https://");
    if (url === null) return;
    if (url.trim() === "") {
      run((chain: any) => chain.unsetLink());
    } else {
      run((chain: any) => chain.extendMarkRange("link").setLink({ href: url.trim() }));
    }
  };

  const btn = (active: boolean) =>
    `inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
      active ? "bg-stone-900 text-white" : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"
    }`;

  return (
    <div className="rich-editor rounded-xl border border-stone-200 bg-white overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-stone-200 bg-stone-50/60 px-2 py-1.5">
        <button type="button" className={btn(isActive("paragraph"))} title="正文" onClick={() => run((c: any) => c.setParagraph())}>
          <Pilcrow className="h-4 w-4" />
        </button>
        <span className="mx-1 h-5 w-px bg-stone-200" />
        <button type="button" className={btn(isActive("heading", { level: 1 }))} title="一级标题" onClick={() => run((c: any) => c.toggleHeading({ level: 1 }))}>
          <Heading1 className="h-4 w-4" />
        </button>
        <button type="button" className={btn(isActive("heading", { level: 2 }))} title="二级标题" onClick={() => run((c: any) => c.toggleHeading({ level: 2 }))}>
          <Heading2 className="h-4 w-4" />
        </button>
        <button type="button" className={btn(isActive("heading", { level: 3 }))} title="三级标题" onClick={() => run((c: any) => c.toggleHeading({ level: 3 }))}>
          <Heading3 className="h-4 w-4" />
        </button>
        <span className="mx-1 h-5 w-px bg-stone-200" />
        <button type="button" className={btn(isActive("bold"))} title="粗体" onClick={() => run((c: any) => c.toggleBold())}>
          <Bold className="h-4 w-4" />
        </button>
        <button type="button" className={btn(isActive("italic"))} title="斜体" onClick={() => run((c: any) => c.toggleItalic())}>
          <Italic className="h-4 w-4" />
        </button>
        <span className="mx-1 h-5 w-px bg-stone-200" />
        <button type="button" className={btn(isActive("blockquote"))} title="引用" onClick={() => run((c: any) => c.toggleBlockquote())}>
          <Quote className="h-4 w-4" />
        </button>
        <button type="button" className={btn(isActive("bulletList"))} title="无序列表" onClick={() => run((c: any) => c.toggleBulletList())}>
          <List className="h-4 w-4" />
        </button>
        <button type="button" className={btn(isActive("orderedList"))} title="有序列表" onClick={() => run((c: any) => c.toggleOrderedList())}>
          <ListOrdered className="h-4 w-4" />
        </button>
        <span className="mx-1 h-5 w-px bg-stone-200" />
        <button type="button" className={btn(isActive("link"))} title="链接" onClick={setLink}>
          <Link2 className="h-4 w-4" />
        </button>
        <button type="button" className={btn(false)} title="分割线" onClick={() => run((c: any) => c.setHorizontalRule())}>
          <Minus className="h-4 w-4" />
        </button>
        <button type="button" className={btn(showMedia)} title="插入图片" onClick={toggleMedia}>
          <ImagePlus className="h-4 w-4" />
        </button>
        <button type="button" className={btn(pairMode)} title="两图并排" onClick={togglePairMode}>
          <Columns2 className="h-4 w-4" />
        </button>
        <span className="mx-1 h-5 w-px bg-stone-200" />
        <button type="button" className={btn(false)} title="撤销" onClick={() => run((c: any) => c.undo())}>
          <Undo2 className="h-4 w-4" />
        </button>
        <button type="button" className={btn(false)} title="重做" onClick={() => run((c: any) => c.redo())}>
          <Redo2 className="h-4 w-4" />
        </button>
      </div>

      {/* Media panel */}
      {showMedia && (
        <div className="border-b border-stone-200 bg-white px-3 py-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs text-stone-500">{pairMode ? "并排模式" : "从媒体库插入图片"}</p>
            <div className="flex items-center gap-2">
              {pairMode && (
                <span className="text-[11px] text-stone-400">已选 {pairSel.length}/2</span>
              )}
              <label className="cursor-pointer rounded border border-dashed border-stone-300 px-2 py-1 text-[11px] text-stone-500 hover:border-stone-400">
                {uploading ? "上传中…" : "+ 上传新图片"}
                <input type="file" accept="image/*" onChange={uploadImage} className="hidden" disabled={uploading} />
              </label>
            </div>
          </div>
          {pairMode && (
            <p className="mb-2 text-[11px] text-stone-400">点击两张图片横向排列；再点一次取消已选</p>
          )}
          {loadingMedia ? (
            <p className="text-xs text-stone-400">加载中…</p>
          ) : files.length === 0 ? (
            <p className="text-xs text-stone-400">暂无媒体文件</p>
          ) : (
            <div className="grid grid-cols-8 gap-2 max-h-44 overflow-y-auto">
              {files.map((f: any) => {
                const selIdx = pairMode ? pairSel.indexOf(f.public_url) : -1;
                return (
                  <button key={f.id} type="button"
                    onClick={() => handleMediaClick(f)}
                    className={`group relative aspect-square overflow-hidden rounded border hover:border-stone-400 ${selIdx >= 0 ? "border-stone-500" : "border-stone-100"}`}>
                    <img src={f.public_url} alt={f.alt} className="h-full w-full object-cover" />
                    <span className={`absolute inset-0 flex items-center justify-center text-[10px] text-white transition-opacity ${
                      selIdx >= 0
                        ? "bg-black/40 opacity-100"
                        : "bg-black/0 opacity-0 group-hover:bg-black/30 group-hover:opacity-100"
                    }`}>
                      {pairMode ? (selIdx >= 0 ? `${selIdx + 1}` : "选") : "插入"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Editor body */}
      <EditorContent editor={editor} />
    </div>
  );
}
