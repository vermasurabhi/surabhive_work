-- Seed data for the portfolio website

-- Insert home page content
INSERT INTO home_page_content (hero_title, hero_subtitle, hero_description, hero_image_url, featured_video_url, featured_video_title)
VALUES (
  'ALEXANDRA',
  'MARTINEZ',
  'Professional Dancer & Choreographer',
  'https://via.placeholder.com/800x1000',
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  'Featured Performance'
);

-- Insert dance styles
INSERT INTO dance_styles (title, description, image_url, display_order) VALUES
('Contemporary', 'Expressive and fluid movements that blend modern dance techniques', 'https://via.placeholder.com/400x500', 1),
('Hip Hop', 'Energetic street dance style with urban flair and rhythm', 'https://via.placeholder.com/400x500', 2),
('Ballet', 'Classical dance form with grace, precision, and elegance', 'https://via.placeholder.com/400x500', 3);

-- Insert videos
INSERT INTO videos (youtube_id, title, display_order) VALUES
('dQw4w9WgXcQ', 'Performance at Grand Theater', 1),
('jNQXAC9IVRw', 'Contemporary Dance Showcase', 2),
('9bZkp7q19f0', 'Hip Hop Battle Championship', 3),
('kJQP7kiw5Fk', 'Ballet Recital 2024', 4),
('fJ9rUzIMcZQ', 'Modern Dance Fusion', 5),
('LXb3EKWsOfQ', 'Street Dance Competition', 6);

-- Insert events
INSERT INTO events (title, description, event_date, location, media_type, media_url, image_url, is_featured, display_order) VALUES
(
  'Grand Performance Night',
  'An unforgettable evening of dance and artistry featuring contemporary, hip hop, and ballet performances.',
  NOW() + INTERVAL '30 days',
  'Grand Theater, Main Hall',
  'video',
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  'https://via.placeholder.com/600x400',
  TRUE,
  1
),
(
  'Dance Workshop Series',
  'Join us for an intensive workshop series covering multiple dance styles and techniques.',
  NOW() + INTERVAL '45 days',
  'Dance Studio Downtown',
  'image',
  NULL,
  'https://via.placeholder.com/600x400',
  FALSE,
  2
),
(
  'Summer Dance Festival',
  'A vibrant outdoor festival celebrating dance with performances, workshops, and community engagement.',
  NOW() + INTERVAL '60 days',
  'City Park Amphitheater',
  'video',
  'https://www.youtube.com/embed/jNQXAC9IVRw',
  'https://via.placeholder.com/600x400',
  FALSE,
  3
);

-- Insert blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, image_url, published_date, is_published) VALUES
(
  'The Art of Contemporary Dance',
  'the-art-of-contemporary-dance',
  'Exploring the expressive world of contemporary dance and how it blends emotion with movement.',
  '<p class="mb-4">Contemporary dance is a genre of dance performance that developed during the mid-twentieth century and has since grown to become one of the dominant genres for formally trained dancers throughout the world, with particularly strong popularity in the U.S. and Europe.</p><p class="mb-4">Unlike ballet, which is structured and formal, contemporary dance emphasizes freedom of movement and personal expression. Dancers use their bodies to express emotions, tell stories, and explore the boundaries of physical movement.</p><h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-4">The Evolution of Contemporary Dance</h2><p class="mb-4">Contemporary dance emerged as a rebellion against the rigid structure of classical ballet. Pioneers like Martha Graham, Merce Cunningham, and Pina Bausch pushed the boundaries of what dance could be, incorporating elements from modern dance, jazz, and even everyday movements.</p><p class="mb-4">Today, contemporary dance continues to evolve, incorporating influences from hip hop, street dance, and various cultural traditions. It remains a dynamic and ever-changing art form that reflects the times we live in.</p><h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-4">Key Characteristics</h2><ul class="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300"><li>Fluid, organic movements</li><li>Emphasis on floor work and gravity</li><li>Use of improvisation</li><li>Focus on emotional expression</li><li>Integration of various dance styles</li></ul>',
  'https://via.placeholder.com/800x400',
  '2024-03-15',
  TRUE
),
(
  'Hip Hop: More Than Just Moves',
  'hip-hop-more-than-just-moves',
  'Understanding the cultural roots and artistic depth of hip hop dance as a form of expression.',
  '<p class="mb-4">Hip hop dance is a vibrant form of dance that combines a variety of freestyle movements to create a cultural piece of art. Through its three main styles of popping, locking, and breaking, hip-hop dance has evolved into one of the most popular and influential styles of dance.</p><p class="mb-4">Born in the streets of New York City in the 1970s, hip hop dance was more than just entertainment—it was a form of expression for marginalized communities. It provided a voice and a way to tell stories through movement.</p><h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-4">The Four Pillars of Hip Hop</h2><p class="mb-4">Hip hop culture is built on four foundational elements: DJing, MCing (rapping), graffiti art, and breaking (dance). Each element contributes to the rich tapestry of hip hop culture, with dance serving as a physical manifestation of the music and message.</p><h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-4">Styles and Techniques</h2><p class="mb-4">Hip hop dance encompasses various styles including breaking, popping, locking, and krumping. Each style has its own unique characteristics and techniques, but all share a common emphasis on rhythm, musicality, and personal style.</p>',
  'https://via.placeholder.com/800x400',
  '2024-03-10',
  TRUE
),
(
  'Ballet Fundamentals for Beginners',
  'ballet-fundamentals-for-beginners',
  'A comprehensive guide to getting started with ballet, from basic positions to advanced techniques.',
  '<p class="mb-4">Ballet is a classical dance form that originated in the Italian Renaissance courts of the 15th century and later developed into a concert dance form in France and Russia. It has since become a highly technical form of dance with its own vocabulary based on French terminology.</p><p class="mb-4">For beginners, ballet provides an excellent foundation for all other forms of dance. It teaches discipline, grace, strength, and flexibility while developing musicality and artistic expression.</p><h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-4">The Five Basic Positions</h2><p class="mb-4">Every ballet dancer begins by learning the five basic positions of the feet. These positions form the foundation for all ballet movements and are essential for proper technique and alignment.</p><h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-4">Getting Started</h2><p class="mb-4">Starting ballet requires patience and dedication. It''s important to find a qualified instructor who can guide you through proper technique and help prevent injuries. Regular practice and stretching are essential for progress.</p>',
  'https://via.placeholder.com/800x400',
  '2024-03-05',
  TRUE
),
(
  'Preparing for Your First Performance',
  'preparing-for-your-first-performance',
  'Tips and advice for dancers preparing to step onto the stage for the first time.',
  '<p class="mb-4">Your first performance is a milestone in any dancer''s journey. It''s a moment filled with excitement, nerves, and anticipation. Proper preparation is key to making your debut a success.</p><h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-4">Mental Preparation</h2><p class="mb-4">Mental preparation is just as important as physical practice. Visualization techniques, breathing exercises, and positive self-talk can help calm nerves and boost confidence before taking the stage.</p><h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-4">Physical Preparation</h2><p class="mb-4">In the weeks leading up to your performance, maintain a consistent practice schedule. Focus on perfecting your choreography, building stamina, and taking care of your body through proper nutrition and rest.</p><h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-4">On Performance Day</h2><p class="mb-4">Arrive early, warm up properly, and trust in your preparation. Remember that mistakes are part of the learning process, and the audience is there to support you. Enjoy the moment and let your passion for dance shine through.</p>',
  'https://via.placeholder.com/800x400',
  '2024-02-28',
  TRUE
);

-- Insert about page content
INSERT INTO about_page_content (section_title, content, profile_image_url, display_order) VALUES
(
  NULL,
  'Welcome to my dance journey! I am a passionate and dedicated professional dancer with over 10 years of experience in various dance styles including contemporary, hip hop, and ballet.',
  'https://via.placeholder.com/600x800',
  1
),
(
  NULL,
  'My love for dance began at a young age, and I have dedicated my life to perfecting my craft and sharing the beauty of movement with audiences around the world. Through years of training and performance, I have developed a unique style that blends classical techniques with modern expression.',
  NULL,
  2
),
(
  NULL,
  'I believe dance is a universal language that connects people across cultures and backgrounds. Each performance is an opportunity to tell a story, evoke emotions, and inspire others to discover their own passion for movement.',
  NULL,
  3
);

-- Insert achievements
INSERT INTO achievements (title, description, display_order) VALUES
('Winner of International Dance Competition 2023', NULL, 1),
('Featured performer at Grand Theater for 3 consecutive years', NULL, 2),
('Choreographed over 50 original dance pieces', NULL, 3),
('Trained 200+ students in various dance styles', NULL, 4);

-- Insert contact info
INSERT INTO contact_info (email, phone, location) VALUES
('contact@dancerportfolio.com', '+1 (555) 123-4567', 'New York, NY, USA');

-- Insert social media links
INSERT INTO social_media (platform, url, icon_name, display_order, is_active) VALUES
('Instagram', 'https://instagram.com', 'Instagram', 1, TRUE),
('YouTube', 'https://youtube.com', 'Youtube', 2, TRUE),
('Facebook', 'https://facebook.com', 'Facebook', 3, TRUE),
('Twitter', 'https://twitter.com', 'Twitter', 4, TRUE);
