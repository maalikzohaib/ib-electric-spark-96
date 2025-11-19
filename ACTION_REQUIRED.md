# URGENT: Action Required Before Deploying to Live Site

## ⚠️ CRITICAL STEP - Get Your Supabase Anon Public Key

Your `.env` file currently has a **PLACEHOLDER** value for `VITE_SUPABASE_ANON_KEY`. 

**YOU MUST REPLACE IT** before deploying, or the site may not work correctly.

## Quick Steps (5 minutes):

### 1. Open Supabase Dashboard
Go to: https://supabase.com/dashboard/project/okbomxxronimfqehcjvz/settings/api

### 2. Find "Project API keys"
Look for the section showing your API keys.

### 3. Copy the "anon public" key
- Click the copy icon next to **"anon public"** (NOT "service_role")
- It starts with `eyJhbGc...` and is about 200+ characters long

### 4. Update Your .env File
Replace this line:
```env
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rYm9teHhyb25pbWZxZWhjanZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNzQ4MjQsImV4cCI6MjA3NTY1MDgyNH0.PLACEHOLDER_REPLACE_WITH_REAL_ANON_KEY
```

With:
```env
VITE_SUPABASE_ANON_KEY=<paste the anon public key you just copied>
```

### 5. Update Vercel
1. Go to: Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add new variable:
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: (paste the same anon public key)
3. **IMPORTANT**: Remove `VITE_SUPABASE_SERVICE_KEY` if it exists (security risk!)
4. Save changes

### 6. Deploy
```bash
git add .env
git commit -m "Add Supabase anon key"
git push
```

## Why This Matters

❌ **Without the correct anon key**:
- The placeholder value is invalid
- The site might not connect to Supabase properly
- Pages may not load correctly

✅ **With the correct anon key**:
- Secure connection to Supabase
- All features work as expected
- Pages persist after refresh

## What's the Difference?

### Service Role Key (NEVER expose to frontend):
- Has full admin access
- Bypasses all security rules
- Only used on backend/server

### Anon Public Key (Safe for frontend):
- Limited access based on security rules
- Safe to expose in browser code
- Used for client-side operations

---

**Need Help?**
If you can't find the anon key, contact your Supabase admin or check the Supabase project settings.

**Don't Skip This Step!**
The fixes won't work properly without the correct anon key in place.
