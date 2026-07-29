-- Phase 7.1: Add seo_title to pages table
ALTER TABLE public.pages
  ADD COLUMN IF NOT EXISTS seo_title text NOT NULL DEFAULT '';

-- Update existing pages with seo_title
UPDATE public.pages SET seo_title = title WHERE seo_title = '';
