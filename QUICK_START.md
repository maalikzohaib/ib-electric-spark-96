# 🚀 Quick Start Guide - Supabase Integration

## Step-by-Step Setup (5 minutes)

### Step 1: Get Your Database Password
1. Go to: https://supabase.com/dashboard/project/okbomxxronimfqehcjvz
2. Click **Settings** (gear icon) → **Database**
3. Scroll to **Connection String** section
4. Click **URI** tab
5. Copy the connection string - your password is visible there
6. Note down your password (it looks like a long random string)

### Step 2: Create .env File
Create a file named `.env` in your project root and add:

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.okbomxxronimfqehcjvz.supabase.co:5432/postgres
SUPABASE_URL=https://okbomxxronimfqehcjvz.supabase.co
SUPABASE_SERVICE_KEY=sbp_4106aec120b0aab8f0552ca0d2ef77bfda138378
VITE_DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.okbomxxronimfqehcjvz.supabase.co:5432/postgres
VITE_SUPABASE_URL=https://okbomxxronimfqehcjvz.supabase.co
VITE_SUPABASE_SERVICE_KEY=sbp_4106aec120b0aab8f0552ca0d2ef77bfda138378
```

**Important**: Replace `[YOUR-PASSWORD]` with the actual password from Step 1!

### Step 3: Run Migrations
```bash
npm run migrate
```

This creates all database tables in your Supabase database.

### Step 4: Start Your App
```bash
npm run dev
```

That's it! Your app is now using Supabase! 🎉

---

## ✅ What's Been Done

- ✅ Removed Neon.tech database
- ✅ Integrated Supabase PostgreSQL
- ✅ All APIs work without changes
- ✅ Same SQL syntax, different database

---

## 📝 Files to Know About

- `ENV_SETUP.md` - Detailed environment setup guide
- `SUPABASE_MIGRATION_SUMMARY.md` - Complete migration details
- `README.md` - Updated with Supabase instructions

---

## Need Help?

**Can't find your password?**
- Go to Supabase Dashboard → Settings → Database → Connection String (URI)
- Or reset your database password in Settings → Database → Database Password

**Migration errors?**
- Check your DATABASE_URL is correct in `.env`
- Ensure password doesn't have special characters that need escaping
- Try wrapping password in quotes if it has special characters

**Still stuck?**
- Check `ENV_SETUP.md` for troubleshooting
- Visit Supabase docs: https://supabase.com/docs


