import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://hhxdmsirpvufjkaqzztu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoeGRtc2lycHZ1ZmprYXF6enR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NjI5NjIsImV4cCI6MjA3MDAzODk2Mn0.JEYJUzRhRnUUvwPXc_pCpvhW3NC8bKlyzGrmW_BGmvU';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseConnection() {
  console.log('🔧 Testing database connection and pages table...');
  
  try {
    // Test 1: Check if pages table exists and what columns it has
    console.log('📝 Testing pages table access...');
    const { data: pages, error: pagesError } = await supabase
      .from('pages')
      .select('*')
      .limit(1);
    
    if (pagesError) {
      console.log('❌ Pages table error:', pagesError.message);
      console.log('📋 Error code:', pagesError.code);
      
      if (pagesError.code === 'PGRST116' || pagesError.message.includes('does not exist')) {
        console.log('\n🚨 DIAGNOSIS: Pages table does not exist in the database.');
        console.log('\n📋 SOLUTION STEPS:');
        console.log('1. Open your Supabase Dashboard: https://supabase.com/dashboard');
        console.log('2. Go to your project: hhxdmsirpvufjkaqzztu');
        console.log('3. Navigate to SQL Editor');
        console.log('4. Copy and paste the contents of create-pages-table-complete.sql');
        console.log('5. Click "Run" to execute the SQL script');
        console.log('\n✨ After running the script, try creating pages again!');
        return;
      }
      
      if (pagesError.code === '42703' || pagesError.message.includes('column') && pagesError.message.includes('does not exist')) {
        console.log('\n🚨 DIAGNOSIS: Pages table exists but is missing required columns.');
        console.log('📋 Missing columns detected in error message.');
        console.log('\n📋 SOLUTION STEPS:');
        console.log('1. Open your Supabase Dashboard: https://supabase.com/dashboard');
        console.log('2. Go to your project: hhxdmsirpvufjkaqzztu');
        console.log('3. Navigate to SQL Editor');
        console.log('4. Copy and paste the contents of create-pages-table-complete.sql');
        console.log('5. Click "Run" to execute the SQL script');
        console.log('\n✨ This will add the missing columns and fix the table structure!');
        return;
      }
    } else {
      console.log('✅ Pages table accessible');
      console.log('📊 Current pages count:', pages?.length || 0);
      if (pages && pages.length > 0) {
        console.log('📋 Sample page structure:', Object.keys(pages[0]));
      }
    }

    // Test 2: Try to create a test page
    console.log('\n🧪 Testing page creation...');
    const testPageData = {
      name: 'Database Test Page',
      type: 'main',
      display_order: 999
    };
    
    const { data: newPage, error: createError } = await supabase
      .from('pages')
      .insert(testPageData)
      .select()
      .single();
    
    if (createError) {
      console.log('❌ Page creation failed:', createError.message);
      console.log('📋 Error code:', createError.code);
      
      if (createError.code === 'PGRST204') {
        console.log('\n🚨 DIAGNOSIS: Schema cache issue - missing columns in pages table.');
        console.log('\n📋 SOLUTION STEPS:');
        console.log('1. Open your Supabase Dashboard: https://supabase.com/dashboard');
        console.log('2. Go to your project: hhxdmsirpvufjkaqzztu');
        console.log('3. Navigate to SQL Editor');
        console.log('4. Copy and paste the contents of create-pages-table-complete.sql');
        console.log('5. Click "Run" to execute the SQL script');
        console.log('\n✨ This will create the proper table structure with all required columns!');
        return;
      }
    } else {
      console.log('✅ Test page created successfully:', newPage);
      
      // Clean up test page
      const { error: deleteError } = await supabase
        .from('pages')
        .delete()
        .eq('id', newPage.id);
      
      if (deleteError) {
        console.log('⚠️ Could not clean up test page:', deleteError.message);
      } else {
        console.log('🧹 Test page cleaned up');
      }
    }

    // Test 3: Check existing pages
    console.log('\n📄 Checking existing pages...');
    const { data: allPages, error: listError } = await supabase
      .from('pages')
      .select('*')
      .order('display_order');
    
    if (listError) {
      console.log('❌ Could not list pages:', listError.message);
    } else {
      console.log('✅ Found', allPages?.length || 0, 'existing pages');
      if (allPages && allPages.length > 0) {
        allPages.forEach(page => {
          console.log(`  - ${page.name} (${page.type}, order: ${page.display_order})`);
        });
      }
    }

    console.log('\n🎉 Database test completed!');
    console.log('✨ If no errors above, your pages table should be working correctly.');
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
    console.log('\n🚨 DIAGNOSIS: Connection or configuration issue.');
    console.log('\n📋 SOLUTION STEPS:');
    console.log('1. Check your internet connection');
    console.log('2. Verify Supabase project is active');
    console.log('3. Check if Supabase credentials are correct');
    process.exit(1);
  }
}

// Execute the test
testDatabaseConnection();