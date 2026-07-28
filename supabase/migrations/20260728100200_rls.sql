-- 003: RLS policies
-- Phase 2 — Portfolio CMS Migration

-- Enable Row Level Security on all tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_blocks ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------
-- site_settings — anon + authenticated can read; admin only writes
-- ---------------------------------------------------------------
CREATE POLICY "site_settings_select_anon" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "site_settings_insert_admin" ON public.site_settings
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "site_settings_update_admin" ON public.site_settings
  FOR UPDATE USING (is_admin());

CREATE POLICY "site_settings_delete_admin" ON public.site_settings
  FOR DELETE USING (is_admin());

-- ---------------------------------------------------------------
-- pages — anon + authenticated can read visible; admin writes
-- ---------------------------------------------------------------
CREATE POLICY "pages_select_anon" ON public.pages
  FOR SELECT USING (true);

CREATE POLICY "pages_insert_admin" ON public.pages
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "pages_update_admin" ON public.pages
  FOR UPDATE USING (is_admin());

CREATE POLICY "pages_delete_admin" ON public.pages
  FOR DELETE USING (is_admin());

-- ---------------------------------------------------------------
-- navigation — anon + authenticated can read visible; admin writes
-- ---------------------------------------------------------------
CREATE POLICY "navigation_select_anon" ON public.navigation
  FOR SELECT USING (true);

CREATE POLICY "navigation_insert_admin" ON public.navigation
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "navigation_update_admin" ON public.navigation
  FOR UPDATE USING (is_admin());

CREATE POLICY "navigation_delete_admin" ON public.navigation
  FOR DELETE USING (is_admin());

-- ---------------------------------------------------------------
-- content_types — anon can read; admin writes
-- ---------------------------------------------------------------
CREATE POLICY "content_types_select_anon" ON public.content_types
  FOR SELECT USING (true);

CREATE POLICY "content_types_insert_admin" ON public.content_types
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "content_types_update_admin" ON public.content_types
  FOR UPDATE USING (is_admin());

CREATE POLICY "content_types_delete_admin" ON public.content_types
  FOR DELETE USING (is_admin());

-- ---------------------------------------------------------------
-- posts — anon: published only; admin: all statuses
-- ---------------------------------------------------------------
CREATE POLICY "posts_select_anon" ON public.posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "posts_select_admin" ON public.posts
  FOR SELECT USING (is_admin());

CREATE POLICY "posts_insert_admin" ON public.posts
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "posts_update_admin" ON public.posts
  FOR UPDATE USING (is_admin());

CREATE POLICY "posts_delete_admin" ON public.posts
  FOR DELETE USING (is_admin());

-- ---------------------------------------------------------------
-- post_sections — anon: parent post published; admin: all
-- ---------------------------------------------------------------
CREATE POLICY "post_sections_select_anon" ON public.post_sections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = post_sections.post_id
        AND posts.status = 'published'
    )
  );

CREATE POLICY "post_sections_select_admin" ON public.post_sections
  FOR SELECT USING (is_admin());

CREATE POLICY "post_sections_insert_admin" ON public.post_sections
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "post_sections_update_admin" ON public.post_sections
  FOR UPDATE USING (is_admin());

CREATE POLICY "post_sections_delete_admin" ON public.post_sections
  FOR DELETE USING (is_admin());

-- ---------------------------------------------------------------
-- media — anon can read; admin writes
-- ---------------------------------------------------------------
CREATE POLICY "media_select_anon" ON public.media
  FOR SELECT USING (true);

CREATE POLICY "media_insert_admin" ON public.media
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "media_update_admin" ON public.media
  FOR UPDATE USING (is_admin());

CREATE POLICY "media_delete_admin" ON public.media
  FOR DELETE USING (is_admin());

-- ---------------------------------------------------------------
-- custom_blocks — anon: visible only; admin: all; admin writes
-- ---------------------------------------------------------------
CREATE POLICY "custom_blocks_select_anon" ON public.custom_blocks
  FOR SELECT USING (is_visible = true);

CREATE POLICY "custom_blocks_select_admin" ON public.custom_blocks
  FOR SELECT USING (is_admin());

CREATE POLICY "custom_blocks_insert_admin" ON public.custom_blocks
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "custom_blocks_update_admin" ON public.custom_blocks
  FOR UPDATE USING (is_admin());

CREATE POLICY "custom_blocks_delete_admin" ON public.custom_blocks
  FOR DELETE USING (is_admin());
