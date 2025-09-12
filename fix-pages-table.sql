-- Direct SQL to fix the pages table schema
-- This will add the missing display_order column if it doesn't exist

DO $$
BEGIN
    -- Check if display_order column exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'pages' 
        AND column_name = 'display_order'
    ) THEN
        ALTER TABLE public.pages ADD COLUMN display_order integer DEFAULT 0;
        RAISE NOTICE 'Added display_order column to pages table';
    ELSE
        RAISE NOTICE 'display_order column already exists';
    END IF;
    
    -- Check if type column exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'pages' 
        AND column_name = 'type'
    ) THEN
        ALTER TABLE public.pages ADD COLUMN type text NOT NULL DEFAULT 'main';
        ALTER TABLE public.pages ADD CONSTRAINT pages_type_check CHECK (type IN ('main', 'sub'));
        RAISE NOTICE 'Added type column to pages table';
    ELSE
        RAISE NOTICE 'type column already exists';
    END IF;
    
    -- Check if parent_id column exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'pages' 
        AND column_name = 'parent_id'
    ) THEN
        ALTER TABLE public.pages ADD COLUMN parent_id uuid REFERENCES public.pages(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added parent_id column to pages table';
    ELSE
        RAISE NOTICE 'parent_id column already exists';
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_pages_parent_id ON public.pages(parent_id);
CREATE INDEX IF NOT EXISTS idx_pages_type ON public.pages(type);
CREATE INDEX IF NOT EXISTS idx_pages_order ON public.pages(display_order);

-- Show the current table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'pages'
ORDER BY ordinal_position;