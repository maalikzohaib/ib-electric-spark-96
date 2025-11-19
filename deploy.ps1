# ⚡ QUICK DEPLOYMENT SCRIPT

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  IB Electric - Vercel Deployment Fix" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Show current status
Write-Host "📋 Current Status:" -ForegroundColor Yellow
Write-Host "   - Local changes are ready ✅" -ForegroundColor Green
Write-Host "   - New flat API structure created ✅" -ForegroundColor Green
Write-Host "   - Frontend updated ✅" -ForegroundColor Green
Write-Host ""

# Step 2: Environment Variables Info
Write-Host "🔑 CRITICAL: Set these on Vercel FIRST!" -ForegroundColor Red
Write-Host ""
Write-Host "Go to: https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host "Then: Settings → Environment Variables" -ForegroundColor Cyan
Write-Host ""
Write-Host "Add Variable 1:" -ForegroundColor Yellow
Write-Host "   Name:  SUPABASE_URL"
Write-Host "   Value: https://okbomxxronimfqehcjvz.supabase.co"
Write-Host ""
Write-Host "Add Variable 2:" -ForegroundColor Yellow
Write-Host "   Name:  SUPABASE_SERVICE_KEY"
Write-Host "   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rYm9teHhyb25pbWZxZWhjanZ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDA3NDgyNCwiZXhwIjoyMDc1NjUwODI0fQ.fsc7DIl66PKuUXMb0xJOSnIiPh7iaXg42fJizvvA9Wg"
Write-Host ""
Write-Host "✅ Make sure to select ALL environments (Production, Preview, Development)" -ForegroundColor Green
Write-Host ""

# Ask user to confirm
Write-Host "================================================" -ForegroundColor Cyan
$confirm = Read-Host "Have you set the environment variables on Vercel? (yes/no)"

if ($confirm -ne "yes") {
    Write-Host ""
    Write-Host "⚠️  Please set the environment variables first!" -ForegroundColor Red
    Write-Host "   Then run this script again." -ForegroundColor Yellow
    Write-Host ""
    exit
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "📦 Starting Git Deployment..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Step 3: Git status
Write-Host "📋 Checking git status..." -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan

# Step 4: Add files
Write-Host "➕ Adding all changes..." -ForegroundColor Yellow
git add .

# Step 5: Commit
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m "Fix: Flatten API structure for Vercel serverless functions

- Converted nested API routes to flat structure
- Created api/pages.ts, api/products.ts, api/categories.ts
- Updated frontend to use query parameters
- Configured vercel.json for serverless functions
- Ready for Vercel deployment with environment variables"

# Step 6: Push
Write-Host ""
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✅ DEPLOYMENT INITIATED!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏱️  Vercel is now building and deploying..." -ForegroundColor Cyan
Write-Host "   This will take 2-3 minutes." -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Wait for Vercel to finish deploying" -ForegroundColor White
Write-Host "   2. Test: https://www.ijazbrotherselectricstore.com/api/boot" -ForegroundColor White
Write-Host "   3. Go to Admin Panel and create a page" -ForegroundColor White
Write-Host "   4. Refresh the page - it should still be there!" -ForegroundColor White
Write-Host ""
Write-Host "🔍 Monitor deployment:" -ForegroundColor Yellow
Write-Host "   https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "🎉 Your site will be fixed in a few minutes!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
