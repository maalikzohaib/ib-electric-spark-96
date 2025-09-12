const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function testNeonConnection() {
  console.log('🔍 Testing Neon.tech database connection...');
  
  try {
    // Get database URL from environment
    const DATABASE_URL = process.env.VITE_DATABASE_URL || process.env.DATABASE_URL;
    
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined. Please check your environment variables.');
    }
    
    console.log('📡 Connecting to Neon database...');
    const sql = neon(DATABASE_URL);
    
    // Test 1: Basic connection and version check
    console.log('\n1. Testing basic connection...');
    const versionResult = await sql`SELECT version()`;
    console.log('✅ Database connected successfully!');
    console.log('📊 PostgreSQL Version:', versionResult[0]?.version?.substring(0, 50) + '...');
    
    // Test 2: Check if pages table exists
    console.log('\n2. Checking if pages table exists...');
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'pages'
      )
    `;
    
    if (tableExists[0]?.exists) {
      console.log('✅ Pages table exists');
      
      // Test 3: Try to fetch pages
      console.log('\n3. Testing pages table access...');
      const pages = await sql`SELECT id, title, slug FROM pages LIMIT 3`;
      console.log(`✅ Successfully fetched ${pages.length} pages:`);
      pages.forEach(page => {
        console.log(`   - ${page.title} (${page.slug})`);
      });
    } else {
      console.log('⚠️  Pages table does not exist');
      
      // Test 4: Create pages table
      console.log('\n4. Creating pages table...');
      await sql`
        CREATE TABLE IF NOT EXISTS pages (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          content TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log('✅ Pages table created successfully');
      
      // Insert sample data
      console.log('\n5. Inserting sample data...');
      await sql`
        INSERT INTO pages (title, slug, content) VALUES 
        ('Home', 'home', 'Welcome to our electrical supply store'),
        ('About', 'about', 'Learn more about our company'),
        ('Contact', 'contact', 'Get in touch with us')
        ON CONFLICT (slug) DO NOTHING
      `;
      console.log('✅ Sample data inserted');
      
      // Verify insertion
      const newPages = await sql`SELECT id, title, slug FROM pages LIMIT 3`;
      console.log(`✅ Verified: ${newPages.length} pages now exist:`);
      newPages.forEach(page => {
        console.log(`   - ${page.title} (${page.slug})`);
      });
    }
    
    // Test 5: Check user_roles table (if it exists)
    console.log('\n6. Checking user_roles table...');
    const userRolesExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_roles'
      )
    `;
    
    if (userRolesExists[0]?.exists) {
      console.log('✅ User_roles table exists');
      const roleCount = await sql`SELECT COUNT(*) as count FROM user_roles`;
      console.log(`📊 User roles count: ${roleCount[0]?.count}`);
    } else {
      console.log('⚠️  User_roles table does not exist - this is expected for a fresh Neon database');
    }
    
    // Test 6: Test basic CRUD operations
    console.log('\n7. Testing CRUD operations...');
    
    // Create a test page
    const testSlug = 'test-' + Date.now();
    await sql`
      INSERT INTO pages (title, slug, content) 
      VALUES ('Test Page', ${testSlug}, 'This is a test page for Neon integration')
    `;
    console.log('✅ CREATE: Test page inserted');
    
    // Read the test page
    const testPage = await sql`SELECT * FROM pages WHERE slug = ${testSlug}`;
    console.log('✅ READ: Test page retrieved:', testPage[0]?.title);
    
    // Update the test page
    await sql`
      UPDATE pages 
      SET content = 'Updated content for Neon integration test'
      WHERE slug = ${testSlug}
    `;
    console.log('✅ UPDATE: Test page updated');
    
    // Delete the test page
    await sql`DELETE FROM pages WHERE slug = ${testSlug}`;
    console.log('✅ DELETE: Test page removed');
    
    console.log('\n🎉 Neon.tech integration test completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Update your application to use Neon client instead of Supabase');
    console.log('   2. Migrate any existing data if needed');
    console.log('   3. Update authentication system for Neon compatibility');
    console.log('   4. The recursion issues from Supabase RLS should be resolved with Neon');
    
  } catch (error) {
    console.error('❌ Neon connection test failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Check your DATABASE_URL in .env file');
    console.error('   2. Verify Neon database is accessible');
    console.error('   3. Ensure @neondatabase/serverless is installed');
    console.error('\nFull error:', error);
    throw error;
  }
}

// Run the test
testNeonConnection().catch(console.error);