# Supabase Database Setup Script
# This script will help you set up your database connection

Write-Host "🚀 Supabase Database Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env already exists
if (Test-Path .env) {
    Write-Host "⚠️  .env file already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/n)"
    if ($overwrite -ne 'y') {
        Write-Host "❌ Setup cancelled." -ForegroundColor Red
        exit
    }
}

# Get database password from user
Write-Host ""
Write-Host "📋 Step 1: Get your database password" -ForegroundColor Green
Write-Host "   1. Go to: https://supabase.com/dashboard/project/okbomxxronimfqehcjvz/settings/database" -ForegroundColor Gray
Write-Host "   2. Scroll to 'Connection String'" -ForegroundColor Gray
Write-Host "   3. Click 'URI' tab" -ForegroundColor Gray
Write-Host "   4. Copy your password from the connection string" -ForegroundColor Gray
Write-Host ""

$password = Read-Host "Enter your Supabase database password" -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

if ([string]::IsNullOrWhiteSpace($passwordPlain)) {
    Write-Host "❌ Password cannot be empty!" -ForegroundColor Red
    exit
}

# Create .env file
Write-Host ""
Write-Host "📝 Step 2: Creating .env file..." -ForegroundColor Green

$envContent = @"
# Supabase Configuration
SUPABASE_URL=https://okbomxxronimfqehcjvz.supabase.co
SUPABASE_SERVICE_KEY=sbp_4106aec120b0aab8f0552ca0d2ef77bfda138378

# Supabase PostgreSQL Connection String
DATABASE_URL=postgresql://postgres:$passwordPlain@db.okbomxxronimfqehcjvz.supabase.co:5432/postgres
SUPABASE_DATABASE_URL=postgresql://postgres:$passwordPlain@db.okbomxxronimfqehcjvz.supabase.co:5432/postgres

# Vite Environment Variables (for frontend)
VITE_SUPABASE_URL=https://okbomxxronimfqehcjvz.supabase.co
VITE_SUPABASE_SERVICE_KEY=sbp_4106aec120b0aab8f0552ca0d2ef77bfda138378
VITE_DATABASE_URL=postgresql://postgres:$passwordPlain@db.okbomxxronimfqehcjvz.supabase.co:5432/postgres
"@

$envContent | Out-File -FilePath .env -Encoding utf8 -NoNewline
Write-Host "✅ .env file created successfully!" -ForegroundColor Green

# Run migrations
Write-Host ""
Write-Host "🔧 Step 3: Running database migrations..." -ForegroundColor Green
Write-Host ""

npm run migrate

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Migration completed successfully!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "⚠️  Migration had some warnings, but might still work." -ForegroundColor Yellow
}

# Final instructions
Write-Host ""
Write-Host "🎉 Setup Complete!" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Green
Write-Host "  1. Start your dev server: npm run dev" -ForegroundColor Gray
Write-Host "  2. Open your browser and go to the admin panel" -ForegroundColor Gray
Write-Host "  3. Try creating a page - it should work now! ✨" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 For more help, see:" -ForegroundColor Yellow
Write-Host "   - FIX_DATABASE_ERROR.md" -ForegroundColor Gray
Write-Host "   - QUICK_START.md" -ForegroundColor Gray
Write-Host "   - ENV_SETUP.md" -ForegroundColor Gray
Write-Host ""


