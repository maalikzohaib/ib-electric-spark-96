# CRITICAL: Environment Variable Setup for Live Site

## The Problem
Your live site was experiencing an issue where newly created pages disappeared after refresh, even though they were saved in the database. This was caused by:

1. **Browser and Server Caching Issues** - The boot endpoint was caching data
2. **React Query Caching** - The frontend was not invalidating its cache after mutations
3. **SECURITY ISSUE** - Frontend was configured to use the SERVICE_ROLE key instead of ANON key

## What Was Fixed

### 1. Backend Cache Invalidation (ALREADY DONE)
- `api/boot.ts` - Changed cache headers to `max-age=0, must-revalidate`
- `api/pages/index.ts` - Added `cache.del('boot:data')` after creating pages
- `api/pages/[id].ts` - Added cache invalidation after updates and deletes
- `api/pages/reorder.ts` - Added cache invalidation after reordering

### 2. Frontend Cache Management (ALREADY DONE)
- `src/hooks/useProductData.ts` - Improved React Query settings
- `src/lib/queryClient.ts` - Created cache invalidation helper
- `src/store/pageStore.ts` - Added cache invalidation after all mutations
- `src/App.tsx` - Registered global query client

### 3. Environment Variables (ACTION REQUIRED)

## IMPORTANT: Get Your Supabase Anon Public Key

Your `.env` file currently has a **PLACEHOLDER** for the anon key. You MUST replace it with the real anon public key from your Supabase dashboard:

### Steps to Get Your Anon Public Key:

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/okbomxxronimfqehcjvz

2. **Navigate to**: Settings → API

3. **Find "Project API keys" section**

4. **Copy the "anon public" key** (NOT the "service_role" key)
   - It should start with `eyJhbGc...`
   - It will be a long JWT token (around 200+ characters)
   - This key is SAFE to expose in frontend code

5. **Update your `.env` file**:
   ```env
   VITE_SUPABASE_ANON_KEY=<paste your anon public key here>
   ```

6. **For Vercel deployment**, add this environment variable:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `VITE_SUPABASE_ANON_KEY` = <your anon public key>
   - Set it for Production, Preview, and Development environments

## Current .env File Structure

Your `.env` should look like this:

```env
# Supabase Configuration (Backend Only - DO NOT expose these to frontend)
SUPABASE_URL=https://okbomxxronimfqehcjvz.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc... (your service role key)

# Database Connection
DATABASE_URL=postgresql://postgres:...
SUPABASE_DATABASE_URL=postgresql://postgres:...

# Frontend Environment Variables (VITE_ prefix makes them available to browser)
VITE_SUPABASE_URL=https://okbomxxronimfqehcjvz.supabase.co
VITE_SUPABASE_ANON_KEY=<GET THIS FROM SUPABASE DASHBOARD - SEE ABOVE>
```

## Why This Matters

### Security:
- **NEVER expose `SUPABASE_SERVICE_KEY` to the frontend** (no VITE_ prefix)
- The SERVICE_ROLE key bypasses all Row Level Security (RLS) policies
- Only use ANON key in frontend (with VITE_ prefix)

### Functionality:
- The frontend doesn't actually use Supabase directly (goes through API)
- But if it did, using the wrong key could cause permission issues
- On live site with different env vars, this could cause inconsistent behavior

## How the Fix Works

After deploying these changes:

1. **When a page is created**:
   - Backend saves to database
   - Backend invalidates server cache (`cache.del('boot:data')`)
   - Frontend invalidates React Query cache (`invalidateBootCache()`)
   - Page appears immediately in UI

2. **When you refresh the page**:
   - React Query cache is cleared (hard refresh)
   - Frontend fetches from `/api/boot`
   - Server cache is empty (was invalidated), fetches fresh data from database
   - Browser doesn't cache stale data (`max-age=0, must-revalidate`)
   - All pages display correctly, including newly created ones

## Deployment Checklist

Before deploying to your live site:

- [ ] Get anon public key from Supabase Dashboard
- [ ] Update `.env` file with `VITE_SUPABASE_ANON_KEY`
- [ ] Add `VITE_SUPABASE_ANON_KEY` to Vercel environment variables
- [ ] Remove `VITE_SUPABASE_SERVICE_KEY` from Vercel (security risk!)
- [ ] Deploy the updated code to Vercel
- [ ] Test creating a page on live site
- [ ] Refresh the page (hard refresh with Ctrl+Shift+R or Cmd+Shift+R)
- [ ] Verify the new page persists after refresh

## Testing

1. **Create a new page** in the admin panel
2. **Verify it appears** in the list immediately
3. **Refresh the page** (Ctrl+F5 or Cmd+Shift+R for hard refresh)
4. **Confirm the page is still visible** after refresh

## Note on Local vs Live Behavior

The reason it worked locally but not on live:
- Local environment might have been using different cache settings
- Live environment has stricter caching (CDN, browser policies)
- The fixes ensure consistent behavior across all environments

## Support

If you still experience issues after following these steps:
1. Check browser console for errors
2. Verify the correct environment variables are set in Vercel
3. Clear browser cache completely
4. Check Supabase database to confirm data is actually being saved
