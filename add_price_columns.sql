-- Add price_type, price_min, price_max columns to products table
-- Run this SQL in your Supabase SQL Editor

-- Add price_type column (defaults to 'single' for existing products)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS price_type TEXT DEFAULT 'single';

-- Add price_min column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS price_min NUMERIC;

-- Add price_max column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS price_max NUMERIC;

-- Verify columns were added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('price_type', 'price_min', 'price_max');
