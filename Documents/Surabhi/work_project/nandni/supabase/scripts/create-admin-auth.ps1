# Create admin user in Supabase Auth so login at /login works.
# Migrations only add admin to the custom `users` table; the app uses Supabase Auth (auth.users).
# Run once after supabase start from repo root:  .\supabase\scripts\create-admin-auth.ps1

$url = "http://127.0.0.1:54321/auth/v1/signup"
$anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
$body = '{"email":"admin@dancerportfolio.com","password":"admin123"}'

try {
  $response = Invoke-RestMethod -Uri $url -Method Post -Headers @{
    "apikey" = $anonKey
    "Content-Type" = "application/json"
  } -Body $body
  Write-Host "Admin Auth user created. You can sign in at /login with:"
  Write-Host "  email:    admin@dancerportfolio.com"
  Write-Host "  password: admin123"
} catch {
  if ($_.Exception.Response.StatusCode -eq 422) {
    Write-Host "User admin@dancerportfolio.com already exists in Supabase Auth. Use:"
    Write-Host "  email:    admin@dancerportfolio.com"
    Write-Host "  password: admin123"
  } else {
    Write-Host "Error: $_"
    exit 1
  }
}
