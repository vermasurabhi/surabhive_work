-- Content tables for dynamic site (home, dance, fitness)
-- site_settings: footer slogan, site URL (single row)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  footer_slogan TEXT NOT NULL DEFAULT 'Move Wild. Live Fit.',
  site_url TEXT NOT NULL DEFAULT 'www.wildcardmotions.com',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read site_settings" ON site_settings;
DROP POLICY IF EXISTS "Public write site_settings" ON site_settings;
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public write site_settings" ON site_settings FOR ALL USING (true);
GRANT SELECT, INSERT, UPDATE, DELETE ON site_settings TO anon;

-- home_verticals: main page panels (DANCE / FITNESS)
CREATE TABLE IF NOT EXISTS home_verticals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  href TEXT NOT NULL DEFAULT '/dance',
  color TEXT NOT NULL DEFAULT '#710014',
  video_src TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_home_verticals_display_order ON home_verticals(display_order);
DROP TRIGGER IF EXISTS update_home_verticals_updated_at ON home_verticals;
CREATE TRIGGER update_home_verticals_updated_at BEFORE UPDATE ON home_verticals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
ALTER TABLE home_verticals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read home_verticals" ON home_verticals;
DROP POLICY IF EXISTS "Public write home_verticals" ON home_verticals;
CREATE POLICY "Public read home_verticals" ON home_verticals FOR SELECT USING (true);
CREATE POLICY "Public write home_verticals" ON home_verticals FOR ALL USING (true);
GRANT SELECT, INSERT, UPDATE, DELETE ON home_verticals TO anon;

-- dance_page: single row config for dance page (hero, section headings, CTA)
CREATE TABLE IF NOT EXISTS dance_page (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_video_url TEXT,
  hero_title TEXT NOT NULL DEFAULT 'DANCE',
  hero_tagline TEXT,
  services_heading TEXT NOT NULL DEFAULT 'Our Services',
  gallery_heading TEXT NOT NULL DEFAULT 'Gallery',
  cta_heading TEXT NOT NULL DEFAULT 'Ready to Get Started?',
  cta_subheading TEXT,
  cta_button_text TEXT NOT NULL DEFAULT 'Enquire Now',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_dance_page_updated_at ON dance_page;
CREATE TRIGGER update_dance_page_updated_at BEFORE UPDATE ON dance_page
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
ALTER TABLE dance_page ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read dance_page" ON dance_page;
DROP POLICY IF EXISTS "Public write dance_page" ON dance_page;
CREATE POLICY "Public read dance_page" ON dance_page FOR SELECT USING (true);
CREATE POLICY "Public write dance_page" ON dance_page FOR ALL USING (true);
GRANT SELECT, INSERT, UPDATE, DELETE ON dance_page TO anon;

-- fitness_page: single row config for fitness page
CREATE TABLE IF NOT EXISTS fitness_page (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_video_url TEXT,
  hero_title TEXT NOT NULL DEFAULT 'FITNESS',
  hero_tagline TEXT,
  programs_heading TEXT NOT NULL DEFAULT 'Our Programs',
  program_types_heading TEXT NOT NULL DEFAULT 'Choose Your Format',
  program_types_subheading TEXT,
  cta_heading TEXT NOT NULL DEFAULT 'Ready to Transform Your Life?',
  cta_subheading TEXT,
  cta_button_text TEXT NOT NULL DEFAULT 'Join Now',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_fitness_page_updated_at ON fitness_page;
CREATE TRIGGER update_fitness_page_updated_at BEFORE UPDATE ON fitness_page
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
ALTER TABLE fitness_page ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read fitness_page" ON fitness_page;
DROP POLICY IF EXISTS "Public write fitness_page" ON fitness_page;
CREATE POLICY "Public read fitness_page" ON fitness_page FOR SELECT USING (true);
CREATE POLICY "Public write fitness_page" ON fitness_page FOR ALL USING (true);
GRANT SELECT, INSERT, UPDATE, DELETE ON fitness_page TO anon;

-- dance_services: services list on dance page (Wedding Choreography, Classes, etc.)
CREATE TABLE IF NOT EXISTS dance_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  gradient TEXT NOT NULL DEFAULT '#710014',
  span TEXT NOT NULL DEFAULT 'col-span-1' CHECK (span IN ('col-span-1', 'col-span-2')),
  icon TEXT,
  image_path TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dance_services_display_order ON dance_services(display_order);
DROP TRIGGER IF EXISTS update_dance_services_updated_at ON dance_services;
CREATE TRIGGER update_dance_services_updated_at BEFORE UPDATE ON dance_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
ALTER TABLE dance_services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read dance_services" ON dance_services;
DROP POLICY IF EXISTS "Public write dance_services" ON dance_services;
CREATE POLICY "Public read dance_services" ON dance_services FOR SELECT USING (true);
CREATE POLICY "Public write dance_services" ON dance_services FOR ALL USING (true);
GRANT SELECT, INSERT, UPDATE, DELETE ON dance_services TO anon;

-- fitness_programs: programs list on fitness page
CREATE TABLE IF NOT EXISTS fitness_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  gradient TEXT NOT NULL DEFAULT '#B38F6F',
  span TEXT NOT NULL DEFAULT 'col-span-1' CHECK (span IN ('col-span-1', 'col-span-2')),
  icon TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fitness_programs_display_order ON fitness_programs(display_order);
DROP TRIGGER IF EXISTS update_fitness_programs_updated_at ON fitness_programs;
CREATE TRIGGER update_fitness_programs_updated_at BEFORE UPDATE ON fitness_programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
ALTER TABLE fitness_programs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read fitness_programs" ON fitness_programs;
DROP POLICY IF EXISTS "Public write fitness_programs" ON fitness_programs;
CREATE POLICY "Public read fitness_programs" ON fitness_programs FOR SELECT USING (true);
CREATE POLICY "Public write fitness_programs" ON fitness_programs FOR ALL USING (true);
GRANT SELECT, INSERT, UPDATE, DELETE ON fitness_programs TO anon;

-- fitness_program_types: Online / Offline format section
CREATE TABLE IF NOT EXISTS fitness_program_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fitness_program_types_display_order ON fitness_program_types(display_order);
DROP TRIGGER IF EXISTS update_fitness_program_types_updated_at ON fitness_program_types;
CREATE TRIGGER update_fitness_program_types_updated_at BEFORE UPDATE ON fitness_program_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
ALTER TABLE fitness_program_types ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read fitness_program_types" ON fitness_program_types;
DROP POLICY IF EXISTS "Public write fitness_program_types" ON fitness_program_types;
CREATE POLICY "Public read fitness_program_types" ON fitness_program_types FOR SELECT USING (true);
CREATE POLICY "Public write fitness_program_types" ON fitness_program_types FOR ALL USING (true);
GRANT SELECT, INSERT, UPDATE, DELETE ON fitness_program_types TO anon;

-- Add display_order to media for gallery ordering
ALTER TABLE media ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_media_display_order ON media(section, display_order);

-- Seed default content (idempotent: only insert when empty)
INSERT INTO site_settings (footer_slogan, site_url)
SELECT 'Move Wild. Live Fit.', 'www.wildcardmotions.com'
WHERE NOT EXISTS (SELECT 1 FROM site_settings LIMIT 1);

INSERT INTO home_verticals (title, description, href, color, video_src, display_order)
SELECT * FROM (VALUES
  ('DANCE'::text, 'Wedding choreography, classes, workshops, corporate training', '/dance', '#710014', 'https://pub-6db26c3b7fbe46bca9a78d93775a7cc1.r2.dev/videos/dance-panel.mp4', 1),
  ('FITNESS', 'Wellness plans, meal plans, workout routines, lifestyle transformation', '/fitness', '#B38F6F', 'https://pub-6db26c3b7fbe46bca9a78d93775a7cc1.r2.dev/videos/fitness-panel.mp4', 2)
) AS v(title, description, href, color, video_src, display_order)
WHERE NOT EXISTS (SELECT 1 FROM home_verticals LIMIT 1);

INSERT INTO dance_page (hero_video_url, hero_title, hero_tagline, services_heading, gallery_heading, cta_heading, cta_subheading, cta_button_text)
SELECT 'https://pub-6db26c3b7fbe46bca9a78d93775a7cc1.r2.dev/videos/dance-hero.mp4', 'DANCE', 'Express yourself through movement. Master the art of dance.', 'Our Services', 'Gallery', 'Ready to Get Started?', 'Fill out the form below and we''ll get back to you as soon as possible.', 'Enquire Now'
WHERE NOT EXISTS (SELECT 1 FROM dance_page LIMIT 1);

INSERT INTO fitness_page (hero_video_url, hero_title, hero_tagline, programs_heading, program_types_heading, program_types_subheading, cta_heading, cta_subheading, cta_button_text)
SELECT 'https://pub-6db26c3b7fbe46bca9a78d93775a7cc1.r2.dev/videos/fitness-hero.mp4', 'FITNESS', 'Transform your body, transform your life. Your wellness journey starts here.', 'Our Programs', 'Choose Your Format', 'Select the training format that best fits your lifestyle and preferences', 'Ready to Transform Your Life?', 'Join our fitness program and start your wellness journey today.', 'Join Now'
WHERE NOT EXISTS (SELECT 1 FROM fitness_page LIMIT 1);

INSERT INTO dance_services (title, description, gradient, span, icon, image_path, features, display_order)
SELECT * FROM (VALUES
  ('Wedding Choreography'::text, 'Make your special day unforgettable with stunning dance performances', '#710014', 'col-span-2'::text, '💃', '/images/services/dance-wedding-choreography.jpg', '["Custom choreography for couple","Group performances","Rehearsal sessions","Professional guidance"]'::jsonb, 1),
  ('Beginner & Regular Classes', 'Learn from the best with our structured dance programs', '#710014', 'col-span-1', '🎓', '/images/services/dance-beginner-classes.jpg', '["Multiple dance styles","Progressive learning","Small class sizes","Flexible schedules"]'::jsonb, 2),
  ('Workshops', 'Intensive sessions to master new styles and techniques', '#710014', 'col-span-1', '⚡', '/images/services/dance-workshops.jpg', '["Expert instructors","Intensive training","Skill development","Certificate programs"]'::jsonb, 3),
  ('Corporate Training', 'Team building through dance and movement', '#710014', 'col-span-2', '👔', '/images/services/dance-corporate-training.jpg', '["Team building activities","Corporate events","Wellness programs","Customized sessions"]'::jsonb, 4)
) AS v(title, description, gradient, span, icon, image_path, features, display_order)
WHERE NOT EXISTS (SELECT 1 FROM dance_services LIMIT 1);

INSERT INTO fitness_programs (title, description, gradient, span, icon, features, display_order)
SELECT * FROM (VALUES
  ('Wellness Plans'::text, 'Comprehensive health and wellness programs tailored to your needs', '#B38F6F', 'col-span-2'::text, '💚', '["Personalized assessment","Holistic approach","Long-term support","Health tracking"]'::jsonb, 1),
  ('Meal Plans', 'Nutritionally balanced meal plans designed for your goals', '#B38F6F', 'col-span-1', '🥗', '["Customized recipes","Macro tracking","Dietitian support","Shopping lists"]'::jsonb, 2),
  ('Workout Routines', 'Effective training programs for all fitness levels', '#B38F6F', 'col-span-1', '💪', '["Progressive training","Form guidance","Flexible scheduling","Video tutorials"]'::jsonb, 3),
  ('Lifestyle Transformation', 'Complete lifestyle overhaul for sustainable results', '#B38F6F', 'col-span-2', '🌟', '["Habit coaching","Mindset training","Community support","Progress tracking"]'::jsonb, 4)
) AS v(title, description, gradient, span, icon, features, display_order)
WHERE NOT EXISTS (SELECT 1 FROM fitness_programs LIMIT 1);

INSERT INTO fitness_program_types (title, description, icon, display_order)
SELECT * FROM (VALUES
  ('Online Programs'::text, 'Train from anywhere with our comprehensive online platform', '💻', 1),
  ('Offline Programs', 'In-person training at our state-of-the-art facilities', '🏋️', 2)
) AS v(title, description, icon, display_order)
WHERE NOT EXISTS (SELECT 1 FROM fitness_program_types LIMIT 1);
