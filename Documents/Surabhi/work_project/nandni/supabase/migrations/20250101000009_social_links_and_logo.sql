-- Social links (footer) and logo image URL for admin control
-- Replaces "Storage" in dashboard media section with social media + logo

-- Social links: used in footer across the site
CREATE TABLE IF NOT EXISTS social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_links_display_order ON social_links(display_order);

DROP TRIGGER IF EXISTS update_social_links_updated_at ON social_links;
CREATE TRIGGER update_social_links_updated_at BEFORE UPDATE ON social_links
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read social_links" ON social_links;
DROP POLICY IF EXISTS "Public write social_links" ON social_links;
CREATE POLICY "Public read social_links" ON social_links FOR SELECT USING (true);
CREATE POLICY "Public write social_links" ON social_links FOR ALL USING (true);
GRANT SELECT, INSERT, UPDATE, DELETE ON social_links TO anon;

-- Logo image URL on site_settings (optional; when set, logo shows image instead of text)
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS logo_image_url TEXT;

-- Seed default social links (fallback values)
INSERT INTO social_links (name, url, display_order)
SELECT * FROM (VALUES
  ('Instagram'::text, 'https://instagram.com/wildcardmotions', 1),
  ('Facebook', 'https://facebook.com/wildcardmotions', 2),
  ('YouTube', 'https://www.youtube.com/@WildCardMotions', 3)
) AS v(name, url, display_order)
WHERE NOT EXISTS (SELECT 1 FROM social_links LIMIT 1);
