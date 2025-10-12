# ⚡ START HERE - Fix Your "Failed to create page" Error

## 🔴 THE PROBLEM
Your `.env` file is **MISSING**. Without it, the website can't connect to the database.

## ✅ THE SOLUTION (2 Minutes)

### Step 1: Get Your Password
Open this link in your browser:
**https://supabase.com/dashboard/project/okbomxxronimfqehcjvz/settings/database**

Scroll down to **"Connection String"** → Click **"URI"** tab

You'll see something like:
```
postgresql://postgres.xxx:YOUR_PASSWORD_HERE@aws-0-xxx...
```

**Copy the password** (the part after the colon and before @)

### Step 2: Run This Command

Open **PowerShell** in your project folder and run:

```powershell
# If you get a security error, run this first:
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Then run:
.\setup-database.ps1
```

Enter your password when asked.

### Step 3: Done!

```bash
npm run dev
```

Go to your admin panel and try creating a page. It should work! ✨

---

## 🔄 Alternative: Quick Copy-Paste Method

If the script doesn't work, copy and run this (replace YOUR_PASSWORD):

```powershell
$password = "YOUR_PASSWORD"
@"
SUPABASE_URL=https://okbomxxronimfqehcjvz.supabase.co
SUPABASE_SERVICE_KEY=sbp_4106aec120b0aab8f0552ca0d2ef77bfda138378
DATABASE_URL=postgresql://postgres:$password@db.okbomxxronimfqehcjvz.supabase.co:5432/postgres
SUPABASE_DATABASE_URL=postgresql://postgres:$password@db.okbomxxronimfqehcjvz.supabase.co:5432/postgres
VITE_SUPABASE_URL=https://okbomxxronimfqehcjvz.supabase.co
VITE_SUPABASE_SERVICE_KEY=sbp_4106aec120b0aab8f0552ca0d2ef77bfda138378
VITE_DATABASE_URL=postgresql://postgres:$password@db.okbomxxronimfqehcjvz.supabase.co:5432/postgres
"@ | Out-File -FilePath .env -Encoding utf8
npm run migrate
npm run dev
```

---

## 📚 Need More Help?

- **README_FIX.md** - Multiple methods to fix
- **FIX_DATABASE_ERROR.md** - Detailed troubleshooting
- **COMPLETE_SOLUTION.md** - Everything explained

---

That's it! Your website should work now. 🎉


