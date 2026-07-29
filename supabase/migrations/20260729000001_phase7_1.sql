-- Phase 7.1: CMS体验优化 + 内容系统一致性修复
-- Adds: favicon, contact_links (JSONB), post display properties, media category

-- ===============================================================
-- 1. Add favicon_media_id to site_settings
-- ===============================================================
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS favicon_media_id uuid REFERENCES public.media(id) ON DELETE SET NULL;

-- ===============================================================
-- 2. Add contact_links as JSONB (flexible contact info storage)
--    Each entry: { label, value, href, icon }
--    Falls back to existing contact_email and github_url
-- ===============================================================
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS contact_links jsonb NOT NULL DEFAULT '[]';

-- ===============================================================
-- 3. Add category_label and type_label to content_types
--    These are display labels for the post table
-- ===============================================================
ALTER TABLE public.content_types
  ADD COLUMN IF NOT EXISTS category_label text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS type_label text NOT NULL DEFAULT '';

-- Seed category_label / type_label for existing content_types
UPDATE public.content_types
SET category_label = '研究',
    type_label = '论文'
WHERE slug = 'research';

UPDATE public.content_types
SET category_label = '实验笔记',
    type_label = '实验'
WHERE slug = 'experiment';

UPDATE public.content_types
SET category_label = '简历',
    type_label = '简历'
WHERE slug = 'resume';

-- ===============================================================
-- 4. Add back_label to pages (for back-button text)
-- ===============================================================
ALTER TABLE public.pages
  ADD COLUMN IF NOT EXISTS back_label text NOT NULL DEFAULT '';

UPDATE public.pages
SET back_label = '← 返回主页'
WHERE slug = 'research';

UPDATE public.pages
SET back_label = '← 返回实验笔记'
WHERE slug = 'experiments';

UPDATE public.pages
SET back_label = '← 返回主页'
WHERE slug = 'resume';

-- ===============================================================
-- 5. Add media_category to media table (for segmented management)
--    Values: 'avatar', 'article', 'experiment', 'general'
-- ===============================================================
ALTER TABLE public.media
  ADD COLUMN IF NOT EXISTS media_category text NOT NULL DEFAULT 'general';

-- ===============================================================
-- 6. Add a function to auto-generate slug from title
-- ===============================================================
CREATE OR REPLACE FUNCTION public.generate_slug(title text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT lower(
    regexp_replace(
      regexp_replace(
        trim(title),
        '[^a-zA-Z0-9\u4e00-\u9fff\\-\\s]', '', 'g'
      ),
      '\\s+', '-', 'g'
    )
  );
$$;

-- ===============================================================
-- 7. Add number to posts (display number, independent from sort_order)
-- ===============================================================
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS display_number text NOT NULL DEFAULT '';
