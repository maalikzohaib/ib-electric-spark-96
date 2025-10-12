# ⚡ QUICK FIX - Get Your Website Working NOW

## The Issue
The service key format is wrong. You provided `sbp_...` but Supabase needs JWT format `eyJ...`

## The Fix (1 Minute)

### Step 1: Get Your Service Key
1. Open: https://supabase.com/dashboard/project/okbomxxronimfqehcjvz/settings/api
2. Find **"service_role"** key under "Project API keys"
3. Click to **reveal and copy** the full key
4. It should be ~200 characters and start with `eyJhbGc...`

### Step 2A: Use PowerShell Script
```powershell
.\fix-supabase-key.ps1
```
Then paste your key when prompted.

### Step 2B: Or Manual Quick Fix
Open PowerShell and run:
```powershell
$key = "PASTE_YOUR_SERVICE_KEY_HERE"
(Get-Content .env -Raw) -replace 'SUPABASE_SERVICE_KEY=.*', "SUPABASE_SERVICE_KEY=$key" -replace 'VITE_SUPABASE_SERVICE_KEY=.*', "VITE_SUPABASE_SERVICE_KEY=$key" | Set-Content .env -NoNewline
```

### Step 3: Restart Server
```bash
npm run dev
```

### Step 4: Test
- Go to http://localhost:8080/admin
- Create a page
- ✅ SUCCESS!

## That's It!
Once you update the key, everything will work perfectly. All the code and database are ready!



