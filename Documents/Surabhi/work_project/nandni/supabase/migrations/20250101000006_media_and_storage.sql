-- Media table: tracks uploads in Supabase Storage bucket "media"
-- Used by admin Storage section (images, documents, videos)
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket TEXT NOT NULL DEFAULT 'media',
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'document', 'video')),
  section TEXT NOT NULL,
  display_name TEXT,
  file_size BIGINT,
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_section ON media(section);
CREATE INDEX IF NOT EXISTS idx_media_file_type ON media(file_type);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at DESC);

CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS: anon can read (public site may resolve URLs); write only via service_role or authenticated
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for media" ON media FOR SELECT USING (true);
CREATE POLICY "Public insert access for media" ON media FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for media" ON media FOR UPDATE USING (true);
CREATE POLICY "Public delete access for media" ON media FOR DELETE USING (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON media TO anon;
