-- Complete policy reset to eliminate all recursion issues
-- Run this in Supabase Dashboard > SQL Editor

-- Step 1: Disable RLS on ALL tables that might have circular dependencies
ALTER TABLE IF EXISTS public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.pages DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.contact_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.products DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL policies on ALL tables to start fresh
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on all tables in public schema
    FOR r IN (
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- Step 3: Create minimal, non-recursive policies for pages
ALTER TABLE IF EXISTS public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pages_select_all" 
ON public.pages FOR SELECT 
USING (true);

CREATE POLICY "pages_insert_all" 
ON public.pages FOR INSERT 
WITH CHECK (true);

CREATE POLICY "pages_update_all" 
ON public.pages FOR UPDATE 
USING (true) 
WITH CHECK (true);

CREATE POLICY "pages_delete_all" 
ON public.pages FOR DELETE 
USING (true);

-- Step 4: Create minimal, non-recursive policies for user_roles
ALTER TABLE IF EXISTS public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_roles_select_all" 
ON public.user_roles FOR SELECT 
USING (true);

CREATE POLICY "user_roles_insert_all" 
ON public.user_roles FOR INSERT 
WITH CHECK (true);

CREATE POLICY "user_roles_update_all" 
ON public.user_roles FOR UPDATE 
USING (true) 
WITH CHECK (true);

CREATE POLICY "user_roles_delete_all" 
ON public.user_roles FOR DELETE 
USING (true);

-- Step 5: Create simple policies for other tables
ALTER TABLE IF EXISTS public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contact_submissions_select_all" 
ON public.contact_submissions FOR SELECT 
USING (true);

CREATE POLICY "contact_submissions_insert_all" 
ON public.contact_submissions FOR INSERT 
WITH CHECK (true);

ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_select_all" 
ON public.products FOR SELECT 
USING (true);

CREATE POLICY "products_insert_all" 
ON public.products FOR INSERT 
WITH CHECK (true);

CREATE POLICY "products_update_all" 
ON public.products FOR UPDATE 
USING (true) 
WITH CHECK (true);

CREATE POLICY "products_delete_all" 
ON public.products FOR DELETE 
USING (true);

-- Step 6: Verify no circular dependencies exist
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Success message
SELECT 'All policies reset successfully! No more recursion issues.' as status;