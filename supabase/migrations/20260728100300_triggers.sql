-- 004: Triggers — admin_user_id protection + updated_at
-- Phase 2 — Portfolio CMS Migration

-- ---------------------------------------------------------------
-- Trigger: protect admin_user_id from being changed once set
-- Allows initial SET from NULL to a uuid (first admin binding).
-- ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_admin_user_id()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.admin_user_id IS DISTINCT FROM NEW.admin_user_id THEN
    -- Allow NULL → uuid (first-time setup)
    IF OLD.admin_user_id IS NULL AND NEW.admin_user_id IS NOT NULL THEN
      RETURN NEW;
    END IF;
    -- Otherwise, reject the change
    RAISE EXCEPTION 'admin_user_id cannot be changed once set';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_site_settings_protect_admin_user_id
  BEFORE UPDATE OF admin_user_id ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_admin_user_id();

-- ---------------------------------------------------------------
-- Trigger: auto-update updated_at on all tables
-- ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_navigation_updated_at
  BEFORE UPDATE ON public.navigation
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_content_types_updated_at
  BEFORE UPDATE ON public.content_types
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_post_sections_updated_at
  BEFORE UPDATE ON public.post_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_media_updated_at
  BEFORE UPDATE ON public.media
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_custom_blocks_updated_at
  BEFORE UPDATE ON public.custom_blocks
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
