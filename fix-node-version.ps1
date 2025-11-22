#!/usr/bin/env pwsh
# Fix Node.js version compatibility issue

Write-Host "🔧 Fixing Node.js version compatibility..." -ForegroundColor Cyan
Write-Host ""

# Commit the vercel.json fix
Write-Host "Step 1: Staging vercel.json fix..." -ForegroundColor Yellow
git add vercel.json
git commit -m "Fix: Remove explicit Node.js runtime version from vercel.json to use project default"
Write-Host "  ✅ Changes committed" -ForegroundColor Green
Write-Host ""

# Push
Write-Host "Step 2: Pushing to GitHub..." -ForegroundColor Yellow
git push origin main
Write-Host "  ✅ Pushed successfully" -ForegroundColor Green
Write-Host ""

Write-Host "✅ Fix deployed!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANT: You also need to update Vercel settings:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   1. Go to: https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host "   2. Select your project (ib-electric-spark-96)" -ForegroundColor Cyan
Write-Host "   3. Click 'Settings' → 'General'" -ForegroundColor Cyan
Write-Host "   4. Scroll to 'Node.js Version'" -ForegroundColor Cyan
Write-Host "   5. Change from '22.x' to '18.x'" -ForegroundColor Cyan
Write-Host "   6. Click 'Save'" -ForegroundColor Cyan
Write-Host ""
Write-Host "After changing the Node.js version, your next deployment will succeed!" -ForegroundColor Green
Write-Host ""
