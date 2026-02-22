-- Create site_media bucket and allow uploads/reads (used by admin dance/fitness service images)
-- Fixes 400 Bad Request when uploading to site_media from AdminDanceForm

-- Create site_media bucket (id and name = bucket name used in client)
INSERT INTO storage.buckets (id, name, public)
VALUES ('site_media', 'site_media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies so this migration is idempotent
DROP POLICY IF EXISTS "Allow public insert site_media" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read site_media" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update site_media" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete site_media" ON storage.objects;

-- Allow uploads (INSERT) and reads (SELECT) for site_media bucket
CREATE POLICY "Allow public insert site_media"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'site_media');

CREATE POLICY "Allow public read site_media"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'site_media');

CREATE POLICY "Allow public update site_media"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'site_media');

CREATE POLICY "Allow public delete site_media"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'site_media');
