-- Create pages table for dynamic page management
CREATE TABLE IF NOT EXISTS public.pages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    parent_id uuid REFERENCES public.pages(id) ON DELETE CASCADE,
    type text NOT NULL CHECK (type IN ('main', 'sub')),
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_pages_parent_id ON public.pages(parent_id);
CREATE INDEX IF NOT EXISTS idx_pages_type ON public.pages(type);
CREATE INDEX IF NOT EXISTS idx_pages_order ON public.pages(display_order);

-- Enable RLS (Row Level Security)
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Create policies for pages table
-- Allow everyone to read pages (for navigation)
CREATE POLICY "Allow public read access to pages" 
ON public.pages FOR SELECT 
USING (true);

-- Allow admin operations for pages management
CREATE POLICY "Allow admin operations on pages" 
ON public.pages FOR ALL
USING (true)
WITH CHECK (true);

-- Add page_id column to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS page_id uuid REFERENCES public.pages(id) ON DELETE SET NULL;

-- Create index for products page_id
CREATE INDEX IF NOT EXISTS idx_products_page_id ON public.products(page_id);

-- Insert some sample pages for testing
INSERT INTO public.pages (name, type, display_order) VALUES 
('Services', 'main', 1),
('Products', 'main', 2),
('About Us', 'main', 3);

-- Get the IDs of the main pages for subpages
DO $$
DECLARE
    services_id uuid;
    products_id uuid;
BEGIN
    SELECT id INTO services_id FROM public.pages WHERE name = 'Services' AND type = 'main';
    SELECT id INTO products_id FROM public.pages WHERE name = 'Products' AND type = 'main';
    
    -- Insert subpages
    INSERT INTO public.pages (name, parent_id, type, display_order) VALUES 
    ('Installation', services_id, 'sub', 1),
    ('Maintenance', services_id, 'sub', 2),
    ('LED Lights', products_id, 'sub', 1),
    ('Ceiling Fans', products_id, 'sub', 2),
    ('Electrical Components', products_id, 'sub', 3);
END $$;