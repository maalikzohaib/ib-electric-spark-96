# ⚡ DO THIS NOW - Fix "Failed to create page"

## Your network is blocking the database. Here's the 2-minute fix:

---

### 1️⃣ Open This Link
**https://supabase.com/dashboard/project/okbomxxronimfqehcjvz/editor/sql**

### 2️⃣ Copy Everything Below
```sql
CREATE TABLE IF NOT EXISTS pages (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(255) NOT NULL, title VARCHAR(255), slug VARCHAR(255) UNIQUE NOT NULL, content TEXT, type VARCHAR(50) DEFAULT 'main', parent_id UUID REFERENCES pages(id) ON DELETE CASCADE, display_order INTEGER DEFAULT 0, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), CONSTRAINT pages_type_check CHECK (type IN ('main', 'sub')));

CREATE TABLE IF NOT EXISTS categories (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR NOT NULL, description TEXT, icon VARCHAR, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());

CREATE TABLE IF NOT EXISTS products (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR NOT NULL, description TEXT, price DECIMAL NOT NULL, brand VARCHAR, size VARCHAR, color VARCHAR, variant VARCHAR, in_stock BOOLEAN DEFAULT true, featured BOOLEAN DEFAULT false, image_url VARCHAR, images TEXT[], category_id UUID REFERENCES categories(id), page_id UUID REFERENCES pages(id), created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());

CREATE INDEX IF NOT EXISTS idx_pages_parent_id ON pages(parent_id);
CREATE INDEX IF NOT EXISTS idx_pages_type ON pages(type);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_display_order ON pages(display_order);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_page_id ON products(page_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);

INSERT INTO categories (name, description, icon) VALUES ('LED Lights', 'Energy-efficient LED lighting solutions', 'lightbulb'), ('Ceiling Fans', 'High-quality ceiling fans for all spaces', 'fan'), ('Electrical Components', 'Essential electrical components and accessories', 'zap') ON CONFLICT DO NOTHING;
```

### 3️⃣ Paste in Supabase
Paste it in the SQL editor and click **"Run"**

### 4️⃣ Done!
Your app will work now. Go to admin panel and create a page.

---

## That's It!

Your network blocks port 5432, so we use Supabase's web interface instead.

**Already running?** Check your admin panel: http://localhost:5173/admin

**Not running?** Start it: `npm run dev`

---

✅ Everything is configured  
✅ Just run the SQL above  
✅ Your website will work!





