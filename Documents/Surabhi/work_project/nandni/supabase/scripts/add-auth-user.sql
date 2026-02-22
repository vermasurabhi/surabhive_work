-- Add an admin user to Supabase Auth via SQL Editor.
-- Run this in Supabase Dashboard → SQL Editor.
-- Replace 'your-email@example.com' and 'your_password' with the desired email and password.
--
-- If you get "Database error querying schema": run the DO $$ ... $$ block only
-- (pgcrypto is usually already enabled). Or create the user via Dashboard → Authentication → Users → Add user.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  v_user_id     UUID := gen_random_uuid();
  v_email       TEXT := 'your-email@example.com';   -- change this
  v_password    TEXT := 'your_password';             -- change this
  v_encrypted   TEXT := crypt(v_password, gen_salt('bf'));
BEGIN
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    v_user_id,
    'authenticated',
    'authenticated',
    v_email,
    v_encrypted,
    NOW(),
    '',
    '',
    '',
    '',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    NOW(),
    NOW()
  );

  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  )
  VALUES (
    v_user_id,
    v_user_id,
    format('{"sub":"%s","email":"%s"}', v_user_id, v_email)::jsonb,
    'email',
    v_user_id::text,
    NOW(),
    NOW(),
    NOW()
  );

  RAISE NOTICE 'User created. Sign in at /login with: % and your chosen password.', v_email;
END $$;
