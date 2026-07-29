import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Toaster, toast } from "sonner";
import { MediaSection } from "@/components/admin/MediaSection";
import { generateSlug } from "@/lib/utils";

export const Route = createFileRoute("/admin/posts/$id/edit")({
  component: PostEditPage,
});

function PostEditPage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const isNew = id === 'new';
  const [form, setForm] = useState<any>({
    title: '', slug: '', summary: '', body_md: '',
    status: 'published', sort_order: 0, extra: '{}', content_type_id: '',
  });
  const [sections, setSections] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
  const [showExtra, setShowExtra] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Unsaved changes warning
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const markDirty = () => { if (!dirty) setDirty(true); };

  useEffect(() => {
    (supabase.from('content_types') as any)
      .select('*')
      .order('sort_order')
      .then(({ data }: any) => { if (data) setTypes(data); });
    if (!isNew) {
      (supabase.from('posts') as any)
        .select('*, post_sections(*)')
        .eq('id', id)
        .single()
        .then(({ data }: any) => {
          if (data) {
            setForm({
              ...data,
              extra: typeof data.extra === 'object' ? JSON.stringify(data.extra, null, 2) : data.extra,
            });
            setSections(data.post_sections ?? []);
          }
        });
    }
  }, [id]);

  const handleTitleChange = (title: string) => {
    markDirty();
    setForm({ ...form, title });
    // Auto-generate slug if slug hasn't been manually edited
    if (!slugEdited && isNew) {
      setForm((prev: any) => ({ ...prev, title, slug: generateSlug(title) }));
    }
  };

  const insertImage = (md: string) => {
    setForm((prev: any) => ({ ...prev, body_md: prev.body_md + '\n' + md }));
  };

  const save = async () => {
    setSaving(true);
    let extra: any = {};
    try { extra = JSON.parse(form.extra); }
    catch {
      toast.error("Extra JSON 格式无效");
      setSaving(false);
      return;
    }
    // Merge word_count into extra
    if (form.word_count !== undefined && form.word_count !== '') {
      extra.word_count = Number(form.word_count);
    } else {
      delete extra.word_count;
    }
    const payload: any = {
      title: form.title,
      slug: form.slug || generateSlug(form.title),
      subtitle: form.subtitle || '',
      summary: form.summary,
      body_md: form.body_md,
      published_at: form.published_at || null,
      status: form.status,
      sort_order: Number(form.sort_order),
      extra,
      content_type_id: form.content_type_id,
    };
    if (!isNew) payload.id = id;

    const { data: saved, error }: any = await (supabase.from('posts') as any)
      .upsert(payload)
      .select('id')
      .single();

    if (error) {
      toast.error("保存失败: " + error.message);
      setSaving(false);
      return;
    }

    if (sections.length > 0) {
      await (supabase.from('post_sections') as any).delete().eq('post_id', saved.id);
      await (supabase.from('post_sections') as any)
        .insert(sections.map((s: any, i: number) => ({
          post_id: saved.id,
          anchor: s.anchor || `sec-${i + 1}`,
          title: s.title,
          sort_order: i,
        })));
    }

    toast.success("✓ 已保存");
    setDirty(false);
    setSaving(false);
  };

  return (
    <div>
      <Toaster position="top-right" richColors />
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-medium text-stone-800">
          {isNew ? '新建文章' : '编辑文章'}
        </h1>
        <button
          onClick={() => router.navigate({ to: '/admin/posts' })}
          className="text-sm text-stone-400 hover:text-stone-700 transition-colors"
        >
          ← 返回列表
        </button>
      </div>
      <p className="text-sm text-stone-400 mb-8">
        {isNew ? '使用 Markdown 撰写新内容' : '编辑已有内容'}
      </p>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Main content */}
        <div className="col-span-2 space-y-5">
          <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-medium text-stone-700 mb-4">正文</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-stone-400 mb-1">标题</label>
                <input
                  value={form.title}
                  onChange={e => handleTitleChange(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-400 mb-1">摘要</label>
                <textarea
                  value={form.summary}
                  onChange={e => setForm({ ...form, summary: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-400 mb-1">
                  正文 Markdown
                  <span className="ml-2 text-[10px] text-stone-300">支持 Markdown 语法和图片</span>
                </label>
                <textarea
                  value={form.body_md}
                  onChange={e => setForm({ ...form, body_md: e.target.value })}
                  rows={20}
                  className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-stone-200 resize-y"
                  placeholder="在此撰写 Markdown 内容…"
                />
              </div>
              {/* Media inline picker - Item 1 & 2 */}
              <MediaSection onInsertImage={insertImage} />
            </div>
          </section>
        </div>

        {/* Right: Meta + Settings */}
        <div className="space-y-5">
          <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-medium text-stone-700 mb-4">属性</h2>
            <div className="space-y-4">
              {/* Slug - Items 19 & 20 */}
              <div>
                <label className="block text-xs text-stone-400 mb-1">
                  Slug
                  <span className="ml-1 text-[10px] text-stone-300">（URL 标识，新文章自动生成）</span>
                </label>
                <input
                  value={form.slug}
                  onChange={e => { markDirty(); setForm({ ...form, slug: e.target.value }); setSlugEdited(true); }}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
                />
                <p className="mt-1 text-[10px] text-stone-400">
                  URL: /posts/{form.slug || '{slug}'}
                  {!slugEdited && isNew && <span className="ml-2 text-green-500">自动生成</span>}
                </p>
              </div>
              <div>
                <label className="block text-xs text-stone-400 mb-1">
                  文章标签
                  <span className="ml-1 text-[10px] text-stone-300">显示在文章标题左上角</span>
                </label>
                <input
                  value={form.subtitle || ''}
                  onChange={e => { markDirty(); setForm({ ...form, subtitle: e.target.value }); }}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-400 mb-1">状态</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
                >
                  <option value="published">已发布</option>
                  <option value="draft">草稿</option>
                  <option value="archived">归档</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-stone-400 mb-1">
                  排序
                  <span className="ml-1 text-[10px] text-stone-300">（数字越小越靠前）</span>
                </label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={e => setForm({ ...form, sort_order: e.target.value })}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-400 mb-1">
                  发布日期
                  <span className="ml-1 text-[10px] text-stone-300">（YYYY-MM-DD，前台显示中文）</span>
                </label>
                <input
                  type="date"
                  value={form.published_at?.slice(0, 10) || ''}
                  onChange={e => setForm({ ...form, published_at: e.target.value })}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-400 mb-1">
                  字数
                  <span className="ml-1 text-[10px] text-stone-300">（前台显示 "约 X 字"）</span>
                </label>
                <input
                  type="number"
                  value={form.word_count !== undefined ? form.word_count : ''}
                  onChange={e => setForm({ ...form, word_count: e.target.value })}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-medium text-stone-700 mb-4">章节</h2>
            {sections.length === 0 && (
              <p className="text-xs text-stone-400 mb-3">暂无章节</p>
            )}
            <div className="space-y-2">
              {sections.map((s: any, i: number) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    value={s.anchor}
                    onChange={e => {
                      const ns = [...sections]; ns[i].anchor = e.target.value; setSections(ns);
                    }}
                    placeholder="锚点"
                    className="w-20 rounded border border-stone-200 px-2 py-1.5 text-xs focus:outline-none"
                  />
                  <input
                    value={s.title}
                    onChange={e => {
                      const ns = [...sections]; ns[i].title = e.target.value; setSections(ns);
                    }}
                    placeholder="标题"
                    className="flex-1 rounded border border-stone-200 px-2 py-1.5 text-xs focus:outline-none"
                  />
                  <button
                    onClick={() => setSections(sections.filter((_: any, j: number) => j !== i))}
                    className="text-xs text-stone-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={() => setSections([...sections, { anchor: '', title: '' }])}
                className="text-xs text-stone-500 hover:text-stone-700 mt-2"
              >
                + 添加章节
              </button>
            </div>
          </section>

          <button
            onClick={() => setShowExtra(!showExtra)}
            className="w-full text-left text-xs text-stone-400 hover:text-stone-600 py-2"
          >
            {showExtra ? '▾ 收起' : '▸'} Extra JSON
          </button>
          {showExtra && (
            <textarea
              value={form.extra}
              onChange={e => setForm({ ...form, extra: e.target.value })}
              rows={8}
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-stone-200"
            />
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4 sticky bottom-0 pb-6 bg-white/80 backdrop-blur-sm">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-stone-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800 disabled:opacity-50"
        >
          {saving ? "保存中…" : dirty ? "保存修改" : "保存"}
        </button>
        {form.slug && !isNew && (
          <a
            href={`/experiments/${form.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
          >
            预览
          </a>
        )}
        {dirty && <span className="text-xs text-amber-600">有未保存的修改</span>}
      </div>
    </div>
  );
}
