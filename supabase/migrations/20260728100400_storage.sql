-- 005: Storage — media bucket + RLS on storage.objects
-- Phase 2 — Portfolio CMS Migration

-- Create the media bucket (publicly readable)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  10485760,  -- 10 MB
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: storage.objects policies (idempotent)
DROP POLICY IF EXISTS "media_select_anon" ON storage.objects;
CREATE POLICY "media_select_anon" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

DROP POLICY IF EXISTS "media_insert_admin" ON storage.objects;
CREATE POLICY "media_insert_admin" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'media' AND is_admin()
  );

DROP POLICY IF EXISTS "media_update_admin" ON storage.objects;
CREATE POLICY "media_update_admin" ON storage.objects
  FOR UPDATE USING (bucket_id = 'media' AND is_admin());

DROP POLICY IF EXISTS "media_delete_admin" ON storage.objects;
CREATE POLICY "media_delete_admin" ON storage.objects
  FOR DELETE USING (bucket_id = 'media' AND is_admin());
