# 🔑 VERCEL ENVIRONMENT VARIABLES

Copy these EXACT values to Vercel:

---

## Variable 1: SUPABASE_URL

**Name (copy this):**
```
SUPABASE_URL
```

**Value (copy this):**
```
https://okbomxxronimfqehcjvz.supabase.co
```

**Environments:** ✅ Production ✅ Preview ✅ Development

---

## Variable 2: SUPABASE_SERVICE_KEY

**Name (copy this):**
```
SUPABASE_SERVICE_KEY
```

**Value (copy this - ENTIRE LINE):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rYm9teHhyb25pbWZxZWhjanZ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDA3NDgyNCwiZXhwIjoyMDc1NjUwODI0fQ.fsc7DIl66PKuUXMb0xJOSnIiPh7iaXg42fJizvvA9Wg
```

**Environments:** ✅ Production ✅ Preview ✅ Development

---

## How to Add on Vercel:

1. Go to: **https://vercel.com/dashboard**
2. Click on your project
3. Click **Settings** (top menu)
4. Click **Environment Variables** (left sidebar)
5. For each variable above:
   - Click **Add Variable**
   - Copy-paste the **Name**
   - Copy-paste the **Value** (make sure you get the ENTIRE value!)
   - Select **All** environments (Production, Preview, Development)
   - Click **Save**

---

## ⚠️ IMPORTANT:

- Make sure you copy the ENTIRE service key (it's very long!)
- Do NOT add quotes around the values
- Select ALL THREE environments for both variables
- After adding both, you can deploy your code

---

## After Adding Variables:

Run this in PowerShell:
```powershell
.\deploy.ps1
```

Or manually:
```powershell
git add .
git commit -m "Fix: Flatten API for Vercel"
git push origin main
```

Then wait 2-3 minutes and your site will work! ✅
