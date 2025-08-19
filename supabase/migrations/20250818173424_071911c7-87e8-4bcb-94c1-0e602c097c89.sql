-- Add color and variants columns to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS color text,
ADD COLUMN IF NOT EXISTS variant text;