-- Fix "Database error querying schema" when logging in.
-- Supabase Auth expects these columns to be empty string, not NULL.
-- Run this in Supabase Dashboard → SQL Editor (once per user that has the login error).

UPDATE auth.users
SET
  confirmation_token = COALESCE(confirmation_token, ''),
  email_change = COALESCE(email_change, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  recovery_token = COALESCE(recovery_token, '')
WHERE email = 'surabhi0078@gmail.com';

-- If no row is updated, the email is different. Run this to fix ALL users with NULL tokens:
-- UPDATE auth.users
-- SET
--   confirmation_token = COALESCE(confirmation_token, ''),
--   email_change = COALESCE(email_change, ''),
--   email_change_token_new = COALESCE(email_change_token_new, ''),
--   recovery_token = COALESCE(recovery_token, '')
-- WHERE confirmation_token IS NULL OR email_change IS NULL OR email_change_token_new IS NULL OR recovery_token IS NULL;
