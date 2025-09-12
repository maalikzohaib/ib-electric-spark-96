-- Ensure pages table exists with correct schema
-- This migration will create the table if it doesn't exist or add missing columns

-- Create pages table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.pages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    parent_id uuid REFERENCES public.pages(id) ON DELETE CASCADE,
    type text NOT NULL CHECK (type IN ('main', 'sub')),
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add missing columns if they don't exist
DO $$
BEGIN
    -- Add display_order column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'pages' AND column_name = 'display_order') THEN
        ALTER TABLE public.pages ADD COLUMN display_order integer DEFAULT 0;
    END IF;
    
    -- Add type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'pages' AND column_name = 'type') THEN
        ALTER TABLE public.pages ADD COLUMN type text NOT NULL DEFAULT 'main' CHECK (type IN ('main', 'sub'));
    END IF;
    
    -- Add parent_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'pages' AND column_name = 'parent_id') THEN
        ALTER TABLE public.pages ADD COLUMN parent_id uuid REFERENCES public.pages(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_pages_parent_id ON public.pages(parent_id);
CREATE INDEX IF NOT EXISTS idx_pages_type ON public.pages(type);
CREATE INDEX IF NOT EXISTS idx_pages_order ON public.pages(display_order);

-- Enable RLS if not already enabled
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Allow public read access to pages" ON public.pages;
DROP POLICY IF EXISTS "Allow admin operations on pages" ON public.pages;

-- Create policies for pages table
-- Allow everyone to read pages (for navigation)
CREATE POLICY "Allow public read access to pages" 
ON public.pages FOR SELECT 
USING (true);

-- Allow all operations on pages (since we're using local admin auth)
CREATE POLICY "Allow admin operations on pages" 
ON public.pages FOR ALL
USING (true)
WITH CHECK (true);