# Fix Supabase API Key

Write-Host "`n=== Supabase API Key Fix ===" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

Write-Host "`n[ERROR] Issue Found:" -ForegroundColor Red
Write-Host "   The service key 'sbp_...' is NOT in the correct JWT format" -ForegroundColor Yellow
Write-Host "   Supabase API keys must start with 'eyJ...'" -ForegroundColor Yellow

Write-Host "`n[INFO] How to Get the Correct Key:" -ForegroundColor Green
Write-Host "   1. Open: https://supabase.com/dashboard/project/okbomxxronimfqehcjvz/settings/api" -ForegroundColor White
Write-Host "   2. Scroll down to 'Project API keys'" -ForegroundColor White
Write-Host "   3. Copy the 'service_role' key (NOT the anon key)" -ForegroundColor White
Write-Host "   4. It should start with 'eyJhbGc...' (JWT format)" -ForegroundColor White

Write-Host "`n[INPUT] Paste your service_role key here:" -ForegroundColor Cyan
$serviceKey = Read-Host "Service Role Key"

if ([string]::IsNullOrWhiteSpace($serviceKey)) {
    Write-Host "`n[ERROR] Key cannot be empty!" -ForegroundColor Red
    exit 1
}

if (!$serviceKey.StartsWith("eyJ")) {
    Write-Host "`n[WARNING] Key doesn't start with 'eyJ' - this might not be correct" -ForegroundColor Yellow
    $confirm = Read-Host "Continue anyway? (y/n)"
    if ($confirm -ne 'y') {
        exit 1
    }
}

# Update .env file
$envContent = Get-Content .env -Raw
$envContent = $envContent -replace 'SUPABASE_SERVICE_KEY=.*', "SUPABASE_SERVICE_KEY=$serviceKey"
$envContent = $envContent -replace 'VITE_SUPABASE_SERVICE_KEY=.*', "VITE_SUPABASE_SERVICE_KEY=$serviceKey"
$envContent | Out-File -FilePath .env -Encoding utf8 -NoNewline

Write-Host "`n[OK] Updated .env file with new service key!" -ForegroundColor Green
Write-Host "`n[NEXT] Now restart your dev server:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor White

Write-Host "`n[SUCCESS] Then test creating a page in admin panel!" -ForegroundColor Green

