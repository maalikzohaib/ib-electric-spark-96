# 🔧 Run Database Setup in Supabase (Network Issues Workaround)

## ❌ Problem
Your network/firewall is blocking direct database connections to Supabase.  
**Solution:** Run the SQL migrations directly in Supabase's web interface instead!

---

## ✅ Quick Fix (5 Minutes)

### Step 1: Open Supabase SQL Editor

Click this link to open the SQL editor:
**https://supabase.com/dashboard/project/okbomxxronimfqehcjvz/editor/sql**

Or manually:
1. Go to: https://supabase.com/dashboard/project/okbomxxronimfqehcjvz
2. Click **"SQL Editor"** in the left sidebar

### Step 2: Copy and Run SQL

#### 📋 SQL #1 - Create Tables

Copy this entire SQL and paste it in the SQL editor, then click **"Run"**:

```sql
-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT,
    type VARCHAR(50) DEFAULT 'main',
    parent_id UUID REFERENCES pages(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT pages_type_check CHECK (type IN ('main', 'sub'))
);

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
    size VARCHAR,
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
CREATE INDEX IF NOT EXISTS idx_pages_parent_id ON pages(parent_id);
CREATE INDEX IF NOT EXISTS idx_pages_type ON pages(type);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_display_order ON pages(display_order);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_page_id ON products(page_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);

-- Insert some sample categories
INSERT INTO categories (name, description, icon) VALUES 
('LED Lights', 'Energy-efficient LED lighting solutions', 'lightbulb'),
('Ceiling Fans', 'High-quality ceiling fans for all spaces', 'fan'),
('Electrical Components', 'Essential electrical components and accessories', 'zap')
ON CONFLICT DO NOTHING;
```

### Step 3: Verify

After running the SQL, you should see:
- ✅ "Success. No rows returned"
- OR ✅ "3 rows affected" (from the categories insert)

### Step 4: Start Your App

Now start your development server:

```bash
npm run dev
```

### Step 5: Test It!

1. Go to your admin panel in the browser
2. Click "Add Main Page"
3. Enter a name like "Home"
4. Click "Create"
5. ✅ It should work now!

---

## 🔍 Why Network/Firewall is Blocking

The error `ENOTFOUND` or `EAI_AGAIN` means:
- Your network/firewall is blocking port 5432 (PostgreSQL port)
- Corporate network restrictions
- VPN blocking the connection
- Antivirus/firewall software blocking
- ISP restrictions

**Solution:** Use Supabase's web interface instead of direct connection!

---

## 📊 What Tables Were Created

After running the SQL, you'll have:

1. **pages** - For your dynamic pages (home, about, etc.)
2. **products** - For your electrical products inventory  
3. **categories** - For product categories (LED Lights, Fans, etc.)

---

## 🎯 Next Steps

1. ✅ Run the SQL above in Supabase SQL Editor
2. ✅ Start your app: `npm run dev`
3. ✅ Test creating a page in admin panel
4. ✅ Add products and categories

---

## 🔄 Alternative: Connection Pooler (If Available)

If you need direct database access, you can try using Supabase's connection pooler:

1. Go to: https://supabase.com/dashboard/project/okbomxxronimfqehcjvz/settings/database
2. Look for **"Connection Pooler"** section
3. Copy the **"Transaction"** mode connection string
4. Update your `.env`:
   ```
   DATABASE_URL=[pooler connection string here]
   ```

The pooler uses port `6543` instead of `5432` and might work better with firewalls.

---

## ✅ Done!

Once you've run the SQL in Supabase, your database is ready and your website will work!

**No need to run npm run migrate anymore** - everything is set up! 🎉



