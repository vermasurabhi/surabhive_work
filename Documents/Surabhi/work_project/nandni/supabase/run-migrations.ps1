# Run all database migrations (001 through 007)

$containerName = "supabase_db_nandni"
$running = docker ps --filter "name=$containerName" --format "{{.Names}}"
if (-not $running) {
    Write-Host "Error: Container $containerName is not running. Run: docker-compose up -d" -ForegroundColor Red
    exit 1
}

$migrations = @(
    "20250101000001_initial_schema.sql",
    "20250101000002_seed_data.sql",
    "20250101000003_auth_schema.sql",
    "20250101000004_create_super_admin.sql",
    "20250101000005_admin_write_permissions.sql",
    "20250101000006_media_and_storage.sql",
    "20250101000007_content_tables.sql",
    "20250101000008_site_media_bucket.sql",
    "20250101000009_social_links_and_logo.sql",
    "20250101000010_media_bucket.sql"
)

foreach ($file in $migrations) {
    $path = "migrations\$file"
    if (-not (Test-Path $path)) { Write-Host "Missing: $path" -ForegroundColor Red; exit 1 }
    Write-Host "Running $file..." -ForegroundColor Cyan
    Get-Content $path | docker exec -i $containerName psql -U postgres -d postgres
    if ($LASTEXITCODE -ne 0) { Write-Host "Failed: $file" -ForegroundColor Red; exit 1 }
    Write-Host "  OK" -ForegroundColor Green
}

Write-Host ""
Write-Host "Migrations complete. API: http://localhost:3001" -ForegroundColor Green
