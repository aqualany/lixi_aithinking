-- 副标题字段拆分:
-- 现有 subtitle 列（文章标签）改名为 tag
-- 新增 subtitle 列存副标题（与文章标签 tag 独立）
ALTER TABLE public.posts RENAME COLUMN subtitle TO tag;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS subtitle text;
