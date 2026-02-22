#!/bin/bash
# Run all database migrations (001 through 005)

CONTAINER="supabase_db_nandni"
if ! docker ps --format "{{.Names}}" | grep -q "^${CONTAINER}$"; then
    echo "Error: Container $CONTAINER is not running. Run: docker-compose up -d"
    exit 1
fi

for f in migrations/20250101000001_initial_schema.sql migrations/20250101000002_seed_data.sql migrations/20250101000003_auth_schema.sql migrations/20250101000004_create_super_admin.sql migrations/20250101000005_admin_write_permissions.sql migrations/20250101000006_media_and_storage.sql; do
    [ -f "$f" ] || { echo "Missing: $f"; exit 1; }
    echo "Running $(basename "$f")..."
    docker exec -i $CONTAINER psql -U postgres -d postgres < "$f" || exit 1
    echo "  OK"
done

echo ""
echo "Migrations complete. API: http://localhost:3001"
