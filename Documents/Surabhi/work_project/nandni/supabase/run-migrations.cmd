@echo off
set CONTAINER=supabase_db_nandni
set MIGRATIONS=20250101000001_initial_schema.sql 20250101000002_seed_data.sql 20250101000003_auth_schema.sql 20250101000004_create_super_admin.sql 20250101000005_admin_write_permissions.sql 20250101000006_media_and_storage.sql

cd /d "%~dp0"

docker ps --filter "name=%CONTAINER%" --format "{{.Names}}" | findstr /r "." >nul
if errorlevel 1 (
    echo Error: Container %CONTAINER% is not running. Run: docker-compose up -d
    exit /b 1
)

for %%f in (%MIGRATIONS%) do (
    echo Running %%f...
    type "migrations\%%f" | docker exec -i %CONTAINER% psql -U postgres -d postgres
    if errorlevel 1 (
        echo Failed: %%f
        exit /b 1
    )
    echo   OK
)

echo.
echo Migrations complete. API: http://localhost:3001
