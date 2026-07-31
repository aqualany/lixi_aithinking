import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Toaster, toast } from "sonner";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { generateSlug } from "@/lib/utils";
import { markdownToHtml, processHtmlHeadings, extractHeadings } from "@/lib/cms/rich-html";

export const Route = createFileRoute("/admin/posts/$id/edit")({
  validateSearch: (search: Record<string, unknown>) => ({
    type: typeof search.type === "string" ? search.type : undefined,
  }),
  component: PostEditPage,
});

function PostEditPage() {
  const { id } = Route.useParams();
  const search = Route.useSearch();
  const router = useRouter();
  const isNew = id === 'new';
  const [currentId, setCurrentId] = useState<string>(id);
  const [types, setTypes] = useState<any[]>([]);
  const [form, setForm] = useState<any>({
    title: '', slug: '', subtitle: '', summary: '', body_md: '',
    status: 'published', sort_order: 0, extra: '{}', content_type_id: '',
    published_at: '', word_count: '',
  });
  const [bodyHtml, setBodyHtml] = useState('');
  const [exp, setExp] = useState<any>({
    num: '', hypothesis: '', optimization: ['', '', ''], self_training: ['', ''],
    screenshot_media_ids: [],
  });
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
  const [showExtra, setShowExtra] = useState(false);
  const [dirty, setDirty] = useState(false);

  const contentType = types.find((t: any) => t.id === form.content_type_id);
  const isExperiment = contentType?.slug === 'experiment';

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
      .then(({ data }: any) => {
        if (data) setTypes(data);
      });
    if (!isNew) {
      (supabase.from('posts') as any)
        .select('*, post_sections(*)')
        .eq('id', currentId)
        .single()
        .then(({ data }: any) => {
          if (data) {
            const extra = typeof data.extra === 'object' ? data.extra : {};
            setForm({
              title: data.title, slug: data.slug, subtitle: data.subtitle ?? '',
              summary: data.summary ?? '', body_md: data.body_md ?? '',
              status: data.status, sort_order: data.sort_order, extra: JSON.stringify(extra, null, 2),
              content_type_id: data.content_type_id, published_at: data.published_at?.slice(0, 10) || '',
              word_count: extra.word_count ?? '',
            });
            setBodyHtml(extra.body_html ?? markdownToHtml(data.body_md ?? ''));
            setExp({
              num: extra.num ?? '',
              hypothesis: extra.hypothesis ?? '',
              optimization: extra.optimization ?? ['', '', ''],
              self_training: extra.self_training ?? ['', ''],
              screenshot_media_ids: extra.screenshot_media_ids ?? [],
            });
            setSlugEdited(true);
          }
          setLoaded(true);
        });
    } else {
      // New post — pick content type (default research, or experiment via ?type=)
      (supabase.from('content_types') as any)
        .select('*')
        .order('sort_order')
        .then(({ data: cts }: any) => {
          if (cts && cts.length > 0) {
            const want = search.type === 'experiment' ? 'experiment' : 'research';
            const ct = cts.find((c: any) => c.slug === want) ?? cts[0];
            setForm((prev: any) => ({ ...prev, content_type_id: ct.id }));
          }
          setLoaded(true);
        });
    }
  }, [currentId]);

  const handleTitleChange = (title: string) => {
    markDirty();
    setForm((prev: any) => ({ ...prev, title }));
    if (!slugEdited && isNew) {
      setForm((prev: any) => ({ ...prev, title, slug: generateSlug(title) }));
    }
  };

  const save = async () => {
    setSaving(true);
    let extra: any = {};
    try { extra = JSON.parse(form.extra || '{}'); }
    catch {
      toast.error("Extra JSON 格式无效");
      setSaving(false);
      return;
    }
    // Rich text HTML body (with sec-N ids injected on H2/H3)
    const { html: bodyHtmlNorm } = processHtmlHeadings(bodyHtml || '');
    extra.body_html = bodyHtmlNorm;
    if (form.word_count !== undefined && form.word_count !== '') {
      extra.word_count = Number(form.word_count);
    } else {
      delete extra.word_count;
    }
    if (isExperiment) {
      extra.num = exp.num || '';
      extra.hypothesis = exp.hypothesis || '';
      extra.optimization = (exp.optimization || []).filter((s: string) => s.trim());
      extra.self_training = (exp.self_training || []).filter((s: string) => s.trim());
      extra.screenshot_media_ids = exp.screenshot_media_ids || [];
    }
    const payload: any = {
      content_type_id: form.content_type_id,
      slug: form.slug || generateSlug(form.title),
      title: form.title,
      subtitle: form.subtitle || '',
      summary: form.summary || '',
      body_md: form.body_md || '',
      published_at: form.published_at || null,
      status: form.status,
      sort_order: Number(form.sort_order),
      extra,
    };
    if (!isNew) payload.id = currentId;

    const { data: saved, error }: any = await (supabase.from('posts') as any)
      .upsert(payload)
      .select('id')
      .single();

    if (error) {
      toast.error("保存失败: " + error.message);
      setSaving(false);
      return;
    }

    // Auto-generate sidebar sections from H2/H3 (only when headings exist)
    const sections = extractHeadings(bodyHtmlNorm || '');
    if (sections.length > 0) {
      await (supabase.from('post_sections') as any).delete().eq('post_id', saved.id);
      await (supabase.from('post_sections') as any)
        .insert(sections.map((s: any, i: number) => ({
          post_id: saved.id,
          anchor: s.anchor,
          title: s.title,
          sort_order: i,
        })));
    }

    toast.success("✓ 已保存");
    setDirty(false);
    setSaving(false);

    // New post → re-point editor at the real id so preview/refresh work
    if (isNew && saved.id && saved.id !== currentId) {
      setCurrentId(saved.id);
      router.navigate({ to: '/admin/posts/$id/edit', params: { id: saved.id }, search: { type: undefined }, replace: true });
    }
  };

  const openPreview = () => {
    const { html: bodyHtmlNorm } = processHtmlHeadings(bodyHtml || '');
    const draft = {
      contentTypeSlug: isExperiment ? 'experiment' : 'research',
      title: form.title,
      subtitle: form.subtitle || '',
      summary: form.summary || '',
      bodyHtml: bodyHtmlNorm,
      publishedAt: form.published_at || null,
      wordCount: form.word_count !== '' ? Number(form.word_count) : 0,
      num: exp.num || '',
      hypothesis: exp.hypothesis || '',
      optimization: (exp.optimization || []).filter((s: string) => s.trim()),
      selfTraining: (exp.self_training || []).filter((s: string) => s.trim()),
      screenshotMediaIds: exp.screenshot_media_ids || [],
    };
    const key = isNew ? 'new' : currentId;
    try {
      localStorage.setItem(`lixi-preview:${key}`, JSON.stringify(draft));
    } catch (e) {
      toast.error("预览暂存失败");
      return;
    }
    window.open(`/preview/posts/${key}`, '_blank');
  };

  if (!loaded) return <div className="text-sm text-stone-400">加载中…</div>;

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
        {isExperiment ? '与AI创作中 · 富文本编辑器' : '当下的思考 · 富文本编辑器'}
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
                  onChange={e => { markDirty(); setForm({ ...form, summary: e.target.value }); }}
                  rows={3}
                  className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-400 mb-2">
                  正文
                  <span className="ml-2 text-[10px] text-stone-300">标题、粗体、引用、列表、图片、链接、分割线</span>
                </label>
                <RichTextEditor
                  value={bodyHtml}
                  onChange={(html) => { markDirty(); setBodyHtml(html); }}
                  placeholder="开始撰写…"
                />
              </div>
            </div>
          </section>

          {isExperiment && (
            <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-medium text-stone-700 mb-4">实验信息（可选）</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">
                      编号
                      <span className="ml-1 text-[10px] text-stone-300">（如 "笔记 01"）</span>
                    </label>
                    <input
                      value={exp.num}
                      onChange={e => { markDirty(); setExp({ ...exp, num: e.target.value }); }}
                      className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">假设 (hypothesis)</label>
                  <textarea
                    value={exp.hypothesis}
                    onChange={e => { markDirty(); setExp({ ...exp, hypothesis: e.target.value }); }}
                    rows={3}
                    className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">优化过程 (optimization)</label>
                  <div className="space-y-2">
                    {exp.optimization.map((v: string, i: number) => (
                      <textarea
                        key={i}
                        value={v}
                        onChange={e => {
                          const arr = [...exp.optimization];
                          arr[i] = e.target.value;
                          markDirty();
                          setExp({ ...exp, optimization: arr });
                        }}
                        rows={2}
                        placeholder={`步骤 ${i + 1}`}
                        className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
                      />
                    ))}
                    <button
                      onClick={() => { markDirty(); setExp({ ...exp, optimization: [...exp.optimization, ''] }); }}
                      className="text-xs text-stone-500 hover:text-stone-700"
                    >
                      + 添加步骤
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">自训练思路 (self_training)</label>
                  <div className="space-y-2">
                    {exp.self_training.map((v: string, i: number) => (
                      <textarea
                        key={i}
                        value={v}
                        onChange={e => {
                          const arr = [...exp.self_training];
                          arr[i] = e.target.value;
                          markDirty();
                          setExp({ ...exp, self_training: arr });
                        }}
                        rows={2}
                        placeholder={`思路 ${i + 1}`}
                        className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
                      />
                    ))}
                    <button
                      onClick={() => { markDirty(); setExp({ ...exp, self_training: [...exp.self_training, ''] }); }}
                      className="text-xs text-stone-500 hover:text-stone-700"
                    >
                      + 添加思路
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">
                    对话截图（可选）
                    <span className="ml-1 text-[10px] text-stone-300">前台以可滑动截图展示</span>
                  </label>
                  <MediaPicker
                    category="experiment"
                    selectedIds={exp.screenshot_media_ids || []}
                    onSelect={(ids) => { markDirty(); setExp({ ...exp, screenshot_media_ids: ids }); }}
                    max={10}
                  />
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right: Meta + Settings */}
        <div className="space-y-5">
          <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-medium text-stone-700 mb-4">属性</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-stone-400 mb-1">内容类型</label>
                {isNew ? (
                  <select
                    value={form.content_type_id}
                    onChange={e => { markDirty(); setForm({ ...form, content_type_id: e.target.value }); }}
                    className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
                  >
                    {types.map((t: any) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                ) : (
                  <p className="rounded-lg bg-stone-50 px-3 py-2 text-sm text-stone-600">{contentType?.name ?? form.content_type_id}</p>
                )}
              </div>
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
                  {isExperiment ? `URL: /experiments/${form.slug || '{slug}'}` : `URL: /posts/${form.slug || '{slug}'}`}
                </p>
              </div>
              <div>
                <label className="block text-xs text-stone-400 mb-1">
                  文章标签
                  <span className="ml-1 text-[10px] text-stone-300">自由填写，显示在标题左上角</span>
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
                  onChange={e => { markDirty(); setForm({ ...form, status: e.target.value }); }}
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
                  onChange={e => { markDirty(); setForm({ ...form, sort_order: e.target.value }); }}
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
                  onChange={e => { markDirty(); setForm({ ...form, published_at: e.target.value }); }}
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
                  onChange={e => { markDirty(); setForm({ ...form, word_count: e.target.value }); }}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
                />
              </div>
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
              onChange={e => { markDirty(); setForm({ ...form, extra: e.target.value }); }}
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
        <button
          onClick={openPreview}
          className="rounded-lg border border-stone-300 px-6 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
        >
          预览
        </button>
        {dirty && <span className="text-xs text-amber-600">有未保存的修改</span>}
      </div>
    </div>
  );
}
