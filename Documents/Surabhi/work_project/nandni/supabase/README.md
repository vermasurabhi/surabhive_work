# Supabase

## Hosted project (current)

The app is pointed at **hosted Supabase** (`project1_1/.env`). To create tables and storage, **apply all migrations** once. See **[REMOTE_MIGRATIONS.md](./REMOTE_MIGRATIONS.md)** for steps (Dashboard SQL Editor or CLI `db push`).

**Admin login:** There is no default admin for hosted Supabase. Create a user in **Dashboard → Authentication → Users → Add user** (use a real email and a password). Then sign in at your app’s `/login` with that email and password. See REMOTE_MIGRATIONS.md for details.

---

## Local development

Use the **Supabase CLI** – no custom docker-compose. Same approach as projects like supabase-gadda-backend: `config.toml` + `supabase start`. Studio and API work out of the box.

## Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli) installed  
  - **Windows (scoop):** `scoop install supabase`  
  - **macOS:** `brew install supabase/tap/supabase`  
  - **npm:** `npm install -g supabase`  
- Docker Desktop running (CLI uses Docker under the hood)

## Quick start (recommended)

From the **project root** (`nandni/`), where the `supabase/` folder lives:

```bash
supabase start
```

This will:

- Start Postgres, PostgREST, Studio, Auth, Storage, etc. in Docker
- Run all migrations in `supabase/migrations/` automatically
- Print local URLs and keys

Then:

1. **Supabase Studio (browser UI)**  
   - **URL: http://localhost:54323**  
   - No login required for local; Table Editor and SQL Editor work.

2. **API base URL**  
   - **URL: http://127.0.0.1:54321**  
   - REST: `http://127.0.0.1:54321/rest/v1/`  
   - Use the **anon** key from `supabase status` in the `apikey` header.

3. **Get local keys** (from project root):
   ```bash
   supabase status
   ```
   Copy `API URL`, `anon key`, and `service_role key` for your app.

## Create an Auth user (for project1_1 admin login)

Your admin panel uses **Supabase Auth** (email + password). The migration creates `admin@dancerportfolio.com` only in the **custom `users` table**; the app login uses **Supabase Auth** (`auth.users`), so you must create the same user in Auth once.

1. **Restart Supabase** so Studio can reach the Auth API (needed after config change):
   ```bash
   supabase stop
   supabase start
   ```

2. Open **Studio:** http://localhost:54323

3. In the left sidebar go to **Authentication** → **Users**.

4. Click **“Add user”** / **“Create new user”** (or **“Invite user”**).

5. Enter **email** and **password**, then create.  
   Local config has email confirmation **off**, so you can sign in at `http://localhost:3000/login` immediately with that email and password.

If **“Add user”** in Studio still fails (e.g. error or greyed out), create the user via the Auth API from the project root:

**Option A – Script (recommended)**  
From repo root, with Supabase running: `.\supabase\scripts\create-admin-auth.ps1`

**Option B – curl**

```bash
curl -X POST "http://127.0.0.1:54321/auth/v1/signup" -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0" -H "Content-Type: application/json" -d "{\"email\":\"admin@dancerportfolio.com\",\"password\":\"admin123\"}"
```

**Option C – Studio:** Authentication → Users → Add user (email: `admin@dancerportfolio.com`, password: `admin123`).

Then sign in at `http://localhost:3000/login` with **admin@dancerportfolio.com** / **admin123**.

## Env (for app)

After `supabase start`, use the values from `supabase status`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from supabase status>
```

## Structure

```
supabase/
├── config.toml          # Supabase CLI config (API 54321, Studio 54323, DB 54322)
├── migrations/          # Timestamped SQL migrations (run automatically on start)
├── README.md
├── run-migrations.ps1  # Optional: manual migrations for docker-compose
└── docker-compose.yml  # Optional: custom stack if you don’t use CLI
```

## Commands (Supabase CLI)

From **project root** (`nandni/`):

- **Start:** `supabase start`
- **Stop:** `supabase stop`
- **Status (URLs + keys):** `supabase status`
- **Reset DB and re-run migrations:** `supabase db reset`

## Optional: custom Docker stack

If you prefer not to use the Supabase CLI, you can still use the custom docker-compose setup:

1. From `supabase/`: `docker-compose up -d`
2. Run migrations:  
   **PowerShell:** `.\run-migrations.ps1`  
   **CMD:** `run-migrations.cmd`  
   **Bash:** `./run-migrations.sh`
3. Studio (via Kong): **http://localhost:8000** (login: admin / admin)  
   API: **http://localhost:8000/rest/v1/** or **http://localhost:3001** (direct PostgREST).

Migrations live in `supabase/migrations/` with timestamped names (e.g. `20250101000001_initial_schema.sql`). The same files are used by both the CLI and the manual migration scripts.
