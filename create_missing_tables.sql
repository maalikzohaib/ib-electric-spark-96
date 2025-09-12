-- Create missing tables for Neon database
-- This script creates the products and categories tables that are missing

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    description TEXT,
    icon VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    description TEXT,
    price DECIMAL NOT NULL,
    brand VARCHAR,
    color VARCHAR,
    variant VARCHAR,
    in_stock BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    image_url VARCHAR,
    images TEXT[],
    category_id UUID REFERENCES categories(id),
    page_id UUID REFERENCES pages(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_page_id ON products(page_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);

-- Add display_order column to pages table if it doesn't exist
ALTER TABLE pages ADD COLUMN IF NOT EXISTS display_order INTEGER;

-- Insert some sample categories
INSERT INTO categories (name, description, icon) VALUES 
('LED Lights', 'Energy-efficient LED lighting solutions', 'lightbulb'),
('Ceiling Fans', 'High-quality ceiling fans for all spaces', 'fan'),
('Electrical Components', 'Essential electrical components and accessories', 'zap')
ON CONFLICT DO NOTHING;

COMMIT;