-- 002: 8 tables DDL + indexes + foreign keys
-- Phase 2 — Portfolio CMS Migration

-- ---------------------------------------------------------------
-- 1. site_settings — 单行站点配置
-- ---------------------------------------------------------------
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_title text NOT NULL,
  site_description text NOT NULL,
  seo_keywords text[] DEFAULT '{}',
  author_name text NOT NULL,
  author_name_en text NOT NULL DEFAULT '',
  hero_eyebrow text NOT NULL DEFAULT '',
  bio_lines text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  avatar_media_id uuid,                         -- FK → media, set in Phase 4
  github_url text NOT NULL DEFAULT '',
  contact_email text NOT NULL DEFAULT '',
  admin_user_id uuid,                           -- set manually after Auth user creation
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enforce single row via partial unique index
CREATE UNIQUE INDEX site_settings_singleton ON public.site_settings ((id IS NOT NULL));

-- ---------------------------------------------------------------
-- 2. pages — 页面注册表
-- ---------------------------------------------------------------
CREATE TABLE public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  is_visible boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_pages_slug ON public.pages (slug);
CREATE INDEX idx_pages_sort ON public.pages (sort_order);

-- ---------------------------------------------------------------
-- 3. navigation — 导航链接
-- ---------------------------------------------------------------
CREATE TABLE public.navigation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location text NOT NULL CHECK (location IN ('header', 'mobile', 'footer')),
  label text NOT NULL,
  href text NOT NULL,
  is_external boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_navigation_location ON public.navigation (location, sort_order);

-- ---------------------------------------------------------------
-- 4. content_types — 内容类型注册表
-- ---------------------------------------------------------------
CREATE TABLE public.content_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  schema jsonb,                                 -- reserved; not used in Phase 2
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------
-- 5. posts — 所有长文内容（统一表）
-- ---------------------------------------------------------------
CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type_id uuid NOT NULL REFERENCES public.content_types(id),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  cover_media_id uuid,                         -- FK → media, optional
  body_md text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  published_at timestamptz,
  sort_order int NOT NULL DEFAULT 0,
  extra jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_posts_slug ON public.posts (slug);
CREATE INDEX idx_posts_content_type ON public.posts (content_type_id);
CREATE INDEX idx_posts_status ON public.posts (status);
CREATE INDEX idx_posts_published_at ON public.posts (published_at DESC);

-- ---------------------------------------------------------------
-- 6. post_sections — 文章章节/目录/锚点
-- ---------------------------------------------------------------
CREATE TABLE public.post_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  anchor text NOT NULL,
  title text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_post_sections_post ON public.post_sections (post_id, sort_order);

-- ---------------------------------------------------------------
-- 7. media — 图片与素材
-- ---------------------------------------------------------------
CREATE TABLE public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path text NOT NULL,
  public_url text NOT NULL DEFAULT '',
  alt text NOT NULL DEFAULT '',
  width int,
  height int,
  mime_type text NOT NULL DEFAULT 'image/png',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------
-- 8. custom_blocks — 简单图片入口模块（预留）
-- ---------------------------------------------------------------
CREATE TABLE public.custom_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES public.pages(id) ON DELETE SET NULL,
  title text,
  image_media_id uuid REFERENCES public.media(id) ON DELETE SET NULL,
  link_url text NOT NULL DEFAULT '',
  placement text NOT NULL DEFAULT 'bottom' CHECK (placement IN ('top', 'sidebar', 'bottom')),
  sort_order int NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Foreign key from site_settings → media (deferred)
ALTER TABLE public.site_settings
  ADD CONSTRAINT fk_site_settings_avatar
  FOREIGN KEY (avatar_media_id) REFERENCES public.media(id) ON DELETE SET NULL;

-- Foreign key from posts → media (deferred)
ALTER TABLE public.posts
  ADD CONSTRAINT fk_posts_cover
  FOREIGN KEY (cover_media_id) REFERENCES public.media(id) ON DELETE SET NULL;

-- ---------------------------------------------------------------
-- Admin check function (must be created AFTER site_settings table exists)
-- ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
AS $$
  SELECT auth.uid() IS NOT NULL
    AND auth.uid() = (SELECT admin_user_id FROM public.site_settings LIMIT 1)
$$;
