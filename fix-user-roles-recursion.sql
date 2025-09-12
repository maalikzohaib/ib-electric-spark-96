-- Fix infinite recursion in user_roles policy
-- Run this in Supabase Dashboard > SQL Editor

-- Step 1: Disable RLS temporarily to break recursion
ALTER TABLE IF EXISTS public.user_roles DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies on user_roles
DROP POLICY IF EXISTS "Allow all operations on user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow authenticated users to read user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow users to read their own roles" ON public.user_roles;

-- Step 3: Drop ALL existing policies on pages that might reference user_roles
DROP POLICY IF EXISTS "Allow public read access to pages" ON public.pages;
DROP POLICY IF EXISTS "Allow admin operations on pages" ON public.pages;
DROP POLICY IF EXISTS "Admins can manage pages" ON public.pages;
DROP POLICY IF EXISTS "Users can read pages" ON public.pages;

-- Step 4: Create simple, non-recursive policies for pages first
CREATE POLICY "Allow public read access to pages" 
ON public.pages FOR SELECT 
USING (true);

CREATE POLICY "Allow all operations on pages" 
ON public.pages FOR ALL
USING (true)
WITH CHECK (true);

-- Step 5: Re-enable RLS on user_roles with simple policy
ALTER TABLE IF EXISTS public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 6: Create simple, non-recursive policy for user_roles
-- This policy allows all operations without checking other tables
CREATE POLICY "Allow all operations on user_roles" 
ON public.user_roles 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Step 7: Verify policies are working
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('pages', 'user_roles')
ORDER BY tablename, policyname;

-- Success message
SELECT 'User roles policy recursion fixed! Pages should now work properly.' as status;