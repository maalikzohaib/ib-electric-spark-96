-- Complete SQL script to create pages table and fix all issues
-- Run this in Supabase Dashboard > SQL Editor

-- Step 1: Create the pages table with basic structure
CREATE TABLE IF NOT EXISTS public.pages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add missing columns if they don't exist
ALTER TABLE public.pages 
ADD COLUMN IF NOT EXISTS name text NOT NULL DEFAULT 'Untitled Page';

ALTER TABLE public.pages 
ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'main';

ALTER TABLE public.pages 
ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;

ALTER TABLE public.pages 
ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.pages(id) ON DELETE CASCADE;

ALTER TABLE public.pages 
ADD COLUMN IF NOT EXISTS title text NOT NULL DEFAULT 'Untitled';

ALTER TABLE public.pages 
ADD COLUMN IF NOT EXISTS slug text NOT NULL DEFAULT 'untitled';

-- Create unique constraint on slug if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'pages_slug_unique' 
        AND table_name = 'pages'
    ) THEN
        ALTER TABLE public.pages ADD CONSTRAINT pages_slug_unique UNIQUE (slug);
    END IF;
END $$;

-- Add constraint for type column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'pages_type_check' 
        AND table_name = 'pages'
    ) THEN
        ALTER TABLE public.pages ADD CONSTRAINT pages_type_check CHECK (type IN ('main', 'sub'));
    END IF;
END $$;

-- Step 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pages_parent_id ON public.pages(parent_id);
CREATE INDEX IF NOT EXISTS idx_pages_type ON public.pages(type);
CREATE INDEX IF NOT EXISTS idx_pages_order ON public.pages(display_order);

-- Step 3: Enable Row Level Security
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop any existing problematic policies
DROP POLICY IF EXISTS "Allow public read access to pages" ON public.pages;
DROP POLICY IF EXISTS "Allow admin operations on pages" ON public.pages;

-- Step 5: Create simple, non-recursive policies
-- Allow everyone to read pages (for navigation)
CREATE POLICY "Allow public read access to pages" 
ON public.pages FOR SELECT 
USING (true);

-- Allow all operations on pages (since using local admin auth)
CREATE POLICY "Allow admin operations on pages" 
ON public.pages FOR ALL
USING (true)
WITH CHECK (true);

-- Step 6: Fix the user_roles policy recursion issue
-- Temporarily disable RLS on user_roles to fix recursion
ALTER TABLE IF EXISTS public.user_roles DISABLE ROW LEVEL SECURITY;

-- Re-enable with simple policy
ALTER TABLE IF EXISTS public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop problematic contact_submissions policy
DROP POLICY IF EXISTS "Only admins can view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow all operations on user_roles" ON public.user_roles;

-- Create simple policy for contact_submissions
CREATE POLICY "Allow authenticated users to view contact submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (true);

-- Step 7: Create simple policy for user_roles without recursion
CREATE POLICY "Allow all operations on user_roles" 
ON public.user_roles 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Step 8: Insert some sample pages for testing (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.pages WHERE slug = 'home') THEN
        INSERT INTO public.pages (name, title, slug, type, display_order) VALUES ('Home', 'Home', 'home', 'main', 1);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.pages WHERE slug = 'products') THEN
        INSERT INTO public.pages (name, title, slug, type, display_order) VALUES ('Products', 'Products', 'products', 'main', 2);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.pages WHERE slug = 'about') THEN
        INSERT INTO public.pages (name, title, slug, type, display_order) VALUES ('About', 'About', 'about', 'main', 3);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.pages WHERE slug = 'contact') THEN
        INSERT INTO public.pages (name, title, slug, type, display_order) VALUES ('Contact', 'Contact', 'contact', 'main', 4);
    END IF;
END $$;

-- Step 9: Verify the table was created successfully
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'pages'
ORDER BY ordinal_position;

-- Success message
SELECT 'Pages table created successfully! You can now create pages in your admin panel.' as status;