-- 001: Extensions & helper functions
-- Phase 2 — Portfolio CMS Migration

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Admin check function (SECURITY INVOKER — uses calling user's permissions)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
AS $$
  SELECT auth.uid() IS NOT NULL
    AND auth.uid() = (SELECT admin_user_id FROM public.site_settings LIMIT 1)
$$;
