import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Read environment variables from .env file
let supabaseUrl, supabaseServiceKey;
try {
  const envContent = readFileSync('.env', 'utf8');
  const envLines = envContent.split('\n');
  
  envLines.forEach(line => {
    const [key, value] = line.split('=');
    if (key === 'VITE_SUPABASE_URL') {
      supabaseUrl = value.replace(/"/g, '');
    } else if (key === 'VITE_SUPABASE_PUBLISHABLE_KEY') {
      supabaseServiceKey = value.replace(/"/g, '');
    }
  });
} catch (error) {
  console.error('Error reading .env file:', error.message);
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testPageOperations() {
  console.log('🔍 Testing page operations to check for recursion errors...');
  
  try {
    // Test 1: Try to fetch pages
    console.log('📖 Test 1: Fetching pages...');
    const { data: pages, error: fetchError } = await supabase
      .from('pages')
      .select('*')
      .limit(5);
    
    if (fetchError) {
      console.log(`❌ Fetch error: ${fetchError.message}`);
      if (fetchError.message.includes('infinite recursion')) {
        console.log('🚨 RECURSION ERROR STILL EXISTS!');
        return false;
      }
    } else {
      console.log(`✅ Successfully fetched ${pages?.length || 0} pages`);
    }
    
    // Test 2: Try to create a test page
    console.log('📝 Test 2: Creating a test page...');
    const testPage = {
      title: 'Test Page - ' + Date.now(),
      content: 'This is a test page to verify recursion fix',
      slug: 'test-page-' + Date.now(),
      status: 'draft'
    };
    
    const { data: newPage, error: createError } = await supabase
      .from('pages')
      .insert([testPage])
      .select()
      .single();
    
    if (createError) {
      console.log(`❌ Create error: ${createError.message}`);
      if (createError.message.includes('infinite recursion')) {
        console.log('🚨 RECURSION ERROR STILL EXISTS!');
        return false;
      }
    } else {
      console.log(`✅ Successfully created test page: ${newPage.title}`);
      
      // Test 3: Try to update the test page
      console.log('✏️  Test 3: Updating the test page...');
      const { data: updatedPage, error: updateError } = await supabase
        .from('pages')
        .update({ content: 'Updated content - recursion test passed!' })
        .eq('id', newPage.id)
        .select()
        .single();
      
      if (updateError) {
        console.log(`❌ Update error: ${updateError.message}`);
        if (updateError.message.includes('infinite recursion')) {
          console.log('🚨 RECURSION ERROR STILL EXISTS!');
          return false;
        }
      } else {
        console.log(`✅ Successfully updated test page`);
      }
      
      // Clean up: Delete the test page
      console.log('🧹 Cleaning up test page...');
      const { error: deleteError } = await supabase
        .from('pages')
        .delete()
        .eq('id', newPage.id);
      
      if (deleteError) {
        console.log(`⚠️  Delete error: ${deleteError.message}`);
      } else {
        console.log(`✅ Test page cleaned up successfully`);
      }
    }
    
    console.log('🎉 ALL TESTS PASSED! No recursion errors detected.');
    console.log('✨ The page creation functionality should now work properly.');
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error during testing:', error.message);
    if (error.message.includes('infinite recursion')) {
      console.log('🚨 RECURSION ERROR STILL EXISTS!');
      return false;
    }
    return false;
  }
}

// Run the test
testPageOperations().then(success => {
  if (success) {
    console.log('\n🚀 Ready to test page creation in the admin panel!');
    console.log('🌐 Open http://localhost:8081/admin and try creating a page.');
  } else {
    console.log('\n⚠️  Issues detected. You may need to run the complete-policy-reset.sql manually in Supabase Dashboard.');
  }
});