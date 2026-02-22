-- Add INSERT, UPDATE, and DELETE policies for admin operations
-- Since we're using custom authentication, we'll allow public write access
-- In production, you might want to add proper authentication checks

-- Events table
DROP POLICY IF EXISTS "Public insert access for events" ON events;
DROP POLICY IF EXISTS "Public update access for events" ON events;
DROP POLICY IF EXISTS "Public delete access for events" ON events;

CREATE POLICY "Public insert access for events" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for events" ON events FOR UPDATE USING (true);
CREATE POLICY "Public delete access for events" ON events FOR DELETE USING (true);

-- Home page content
DROP POLICY IF EXISTS "Public insert access for home_page_content" ON home_page_content;
DROP POLICY IF EXISTS "Public update access for home_page_content" ON home_page_content;
DROP POLICY IF EXISTS "Public delete access for home_page_content" ON home_page_content;

CREATE POLICY "Public insert access for home_page_content" ON home_page_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for home_page_content" ON home_page_content FOR UPDATE USING (true);
CREATE POLICY "Public delete access for home_page_content" ON home_page_content FOR DELETE USING (true);

-- Dance styles
DROP POLICY IF EXISTS "Public insert access for dance_styles" ON dance_styles;
DROP POLICY IF EXISTS "Public update access for dance_styles" ON dance_styles;
DROP POLICY IF EXISTS "Public delete access for dance_styles" ON dance_styles;

CREATE POLICY "Public insert access for dance_styles" ON dance_styles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for dance_styles" ON dance_styles FOR UPDATE USING (true);
CREATE POLICY "Public delete access for dance_styles" ON dance_styles FOR DELETE USING (true);

-- Videos
DROP POLICY IF EXISTS "Public insert access for videos" ON videos;
DROP POLICY IF EXISTS "Public update access for videos" ON videos;
DROP POLICY IF EXISTS "Public delete access for videos" ON videos;

CREATE POLICY "Public insert access for videos" ON videos FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for videos" ON videos FOR UPDATE USING (true);
CREATE POLICY "Public delete access for videos" ON videos FOR DELETE USING (true);

-- Blog posts
DROP POLICY IF EXISTS "Public insert access for blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Public update access for blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Public delete access for blog_posts" ON blog_posts;

CREATE POLICY "Public insert access for blog_posts" ON blog_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for blog_posts" ON blog_posts FOR UPDATE USING (true);
CREATE POLICY "Public delete access for blog_posts" ON blog_posts FOR DELETE USING (true);

-- About page content
DROP POLICY IF EXISTS "Public insert access for about_page_content" ON about_page_content;
DROP POLICY IF EXISTS "Public update access for about_page_content" ON about_page_content;
DROP POLICY IF EXISTS "Public delete access for about_page_content" ON about_page_content;

CREATE POLICY "Public insert access for about_page_content" ON about_page_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for about_page_content" ON about_page_content FOR UPDATE USING (true);
CREATE POLICY "Public delete access for about_page_content" ON about_page_content FOR DELETE USING (true);

-- Achievements
DROP POLICY IF EXISTS "Public insert access for achievements" ON achievements;
DROP POLICY IF EXISTS "Public update access for achievements" ON achievements;
DROP POLICY IF EXISTS "Public delete access for achievements" ON achievements;

CREATE POLICY "Public insert access for achievements" ON achievements FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for achievements" ON achievements FOR UPDATE USING (true);
CREATE POLICY "Public delete access for achievements" ON achievements FOR DELETE USING (true);

-- Contact info
DROP POLICY IF EXISTS "Public insert access for contact_info" ON contact_info;
DROP POLICY IF EXISTS "Public update access for contact_info" ON contact_info;
DROP POLICY IF EXISTS "Public delete access for contact_info" ON contact_info;

CREATE POLICY "Public insert access for contact_info" ON contact_info FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for contact_info" ON contact_info FOR UPDATE USING (true);
CREATE POLICY "Public delete access for contact_info" ON contact_info FOR DELETE USING (true);

-- Social media
DROP POLICY IF EXISTS "Public insert access for social_media" ON social_media;
DROP POLICY IF EXISTS "Public update access for social_media" ON social_media;
DROP POLICY IF EXISTS "Public delete access for social_media" ON social_media;

CREATE POLICY "Public insert access for social_media" ON social_media FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for social_media" ON social_media FOR UPDATE USING (true);
CREATE POLICY "Public delete access for social_media" ON social_media FOR DELETE USING (true);

-- Grant anon role write access for PostgREST
GRANT INSERT, UPDATE, DELETE ON events, home_page_content, dance_styles, videos, blog_posts, about_page_content, achievements, contact_info, social_media TO anon;
