# Apply migrations to hosted Supabase

Your app is configured to use **hosted Supabase** (see `project1_1/.env`). Apply all migrations once so tables, RLS, and storage exist.

## Option A: Supabase Dashboard (no CLI)

1. Open **[Supabase Dashboard](https://supabase.com/dashboard)** → your project **pmtagteyledocusqcrpm**.
2. Go to **SQL Editor**.
3. Run each migration file **in this order** (copy-paste contents and Run):
   - `migrations/20250101000001_initial_schema.sql`
   - `migrations/20250101000002_seed_data.sql`
   - `migrations/20250101000003_auth_schema.sql`
   - `migrations/20250101000004_create_super_admin.sql`
   - `migrations/20250101000005_admin_write_permissions.sql`
   - `migrations/20250101000006_media_and_storage.sql`
   - `migrations/20250101000007_content_tables.sql`
   - `migrations/20250101000008_site_media_bucket.sql`
   - `migrations/20250101000009_social_links_and_logo.sql`
   - `migrations/20250101000010_media_bucket.sql`
   - `migrations/20250101000011_whatsapp_number.sql`
4. In **Authentication → Users**, add an admin user (e.g. email + password) so you can log in at `/login`.

## Option B: Supabase CLI (if you have access)

From the **nandni** folder (where this file lives):

```bash
supabase login
supabase link --project-ref pmtagteyledocusqcrpm
```

When prompted, use your **database password** (Dashboard → Settings → Database → Database password).

Then:

```bash
supabase db push
```

This applies all migrations. Then create an admin user in Dashboard → Authentication → Users.

## After migrations

### Admin login (why it fails until you add a user)

The app uses **Supabase Auth** for `/login`. The user must exist in your **hosted** project’s **Authentication → Users**. The custom `users` table in migrations is not used for login.

- **Create the admin in the Dashboard:**  
  Authentication → **Users** → **Add user** → enter email and password, then sign in at `/login`.

- **Or add the user via SQL Editor:**  
  Run the script **`supabase/scripts/add-auth-user.sql`** in Dashboard → SQL Editor. Edit the two variables at the top (`v_email` and `v_password`), then run. Sign in at `/login` with that email and password.
- **Service role key (optional):** For server-side admin APIs, add `SUPABASE_SERVICE_ROLE_KEY` to `project1_1/.env` from Dashboard → Settings → API.
