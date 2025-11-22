#!/usr/bin/env pwsh
# Vercel Deployment Fix Script
# This script removes nested API folders and deploys the fixes

Write-Host "🚀 Starting Vercel Deployment Fix..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Remove nested API folders
Write-Host "Step 1: Removing nested API folders..." -ForegroundColor Yellow
if (Test-Path "api/pages") {
    Remove-Item -Recurse -Force "api/pages"
    Write-Host "  ✅ Removed api/pages/" -ForegroundColor Green
}
if (Test-Path "api/products") {
    Remove-Item -Recurse -Force "api/products"
    Write-Host "  ✅ Removed api/products/" -ForegroundColor Green
}
if (Test-Path "api/categories") {
    Remove-Item -Recurse -Force "api/categories"
    Write-Host "  ✅ Removed api/categories/" -ForegroundColor Green
}
Write-Host ""

# Step 2: Show what we're deploying
Write-Host "Step 2: Configuration changes applied:" -ForegroundColor Yellow
Write-Host "  ✅ Created tsconfig.api.json" -ForegroundColor Green
Write-Host "  ✅ Updated tsconfig.json with API reference" -ForegroundColor Green
Write-Host "  ✅ Updated vercel.json with serverless function config" -ForegroundColor Green
Write-Host "  ✅ Updated .gitignore to exclude nested folders" -ForegroundColor Green
Write-Host ""

# Step 3: Git status
Write-Host "Step 3: Checking git status..." -ForegroundColor Yellow
git status --short
Write-Host ""

# Step 4: Stage changes
Write-Host "Step 4: Staging all changes..." -ForegroundColor Yellow
git add .
Write-Host "  ✅ Changes staged" -ForegroundColor Green
Write-Host ""

# Step 5: Commit
Write-Host "Step 5: Creating commit..." -ForegroundColor Yellow
git commit -m "Fix: Configure Vercel for serverless TypeScript API routes

- Remove nested API folders (pages/, products/, categories/) that import from src/
- Create tsconfig.api.json for proper TypeScript compilation
- Update vercel.json with explicit serverless function runtime config
- Add .gitignore entries for deprecated nested structure

This fixes FUNCTION_INVOCATION_FAILED errors by ensuring API routes
use CommonJS modules and don't depend on Vite-specific imports."
Write-Host "  ✅ Commit created" -ForegroundColor Green
Write-Host ""

# Step 6: Push
Write-Host "Step 6: Pushing to GitHub (will trigger Vercel deployment)..." -ForegroundColor Yellow
git push origin main
Write-Host "  ✅ Pushed to GitHub" -ForegroundColor Green
Write-Host ""

Write-Host "✅ All done! Vercel will now deploy your changes." -ForegroundColor Green
Write-Host ""
Write-Host "📊 What was fixed:" -ForegroundColor Cyan
Write-Host "  • Removed API folders that used incompatible imports" -ForegroundColor White
Write-Host "  • Configured TypeScript for Node.js serverless functions" -ForegroundColor White
Write-Host "  • Set proper runtime and memory limits for API routes" -ForegroundColor White
Write-Host ""
Write-Host "⏳ Wait 60-90 seconds for Vercel deployment to complete, then test:" -ForegroundColor Yellow
Write-Host "  🌐 https://www.ijazbrotherselectricstore.com/api/boot" -ForegroundColor Cyan
Write-Host ""
