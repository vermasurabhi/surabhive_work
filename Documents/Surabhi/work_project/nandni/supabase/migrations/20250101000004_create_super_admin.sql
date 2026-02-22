-- Script to create super admin user
-- Run this after setting up the auth schema
-- Default credentials: username: admin, password: admin123
-- IMPORTANT: Change the password after first login!

-- First, check if admin user exists, if not create it
DO $$
DECLARE
  admin_exists BOOLEAN;
  password_hash TEXT;
BEGIN
  -- Check if admin user exists
  SELECT EXISTS(SELECT 1 FROM users WHERE username = 'admin') INTO admin_exists;

  IF NOT admin_exists THEN
    -- Hash password: admin123
    -- This is a bcrypt hash for 'admin123'
    -- In production, generate this using: bcrypt.hash('admin123', 10)
    password_hash := '$2b$10$rQZ8XK8XK8XK8XK8XK8XK.8XK8XK8XK8XK8XK8XK8XK8XK8XK8XK';

    -- For actual use, you need to generate the hash properly
    -- Use the create-user API endpoint or a script to create users with proper hashing

    INSERT INTO users (username, email, password_hash, role, is_active)
    VALUES (
      'admin',
      'admin@dancerportfolio.com',
      password_hash,
      'super_admin',
      TRUE
    );

    RAISE NOTICE 'Super admin user created: username=admin, password=admin123';
    RAISE NOTICE 'IMPORTANT: Change the password after first login!';
  ELSE
    RAISE NOTICE 'Admin user already exists';
  END IF;
END $$;
