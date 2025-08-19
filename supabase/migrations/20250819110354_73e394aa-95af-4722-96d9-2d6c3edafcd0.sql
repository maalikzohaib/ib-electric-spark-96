-- Add support for multiple images per product
ALTER TABLE products ADD COLUMN images text[] DEFAULT '{}';

-- Update existing products to include their main image in the images array
UPDATE products 
SET images = ARRAY[image_url] 
WHERE image_url IS NOT NULL AND image_url != '';

-- For products without images, set empty array
UPDATE products 
SET images = '{}' 
WHERE image_url IS NULL OR image_url = '';