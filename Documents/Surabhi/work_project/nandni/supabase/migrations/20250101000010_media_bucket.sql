-- Create media bucket and allow uploads/reads (used by admin Storage page: dance_gallery, hero, etc.)
-- Fixes 400 Bad Request when uploading to media from StorageUpload

-- Create media bucket (id and name = bucket name used in client)
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies so this migration is idempotent
DROP POLICY IF EXISTS "Allow public insert media" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read media" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update media" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete media" ON storage.objects;

-- Allow uploads (INSERT) and reads (SELECT) for media bucket
CREATE POLICY "Allow public insert media"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'media');

CREATE POLICY "Allow public read media"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'media');

CREATE POLICY "Allow public update media"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'media');

CREATE POLICY "Allow public delete media"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'media');
