// Test script to verify page creation functionality
import { supabase } from './src/integrations/supabase/client.js';

async function testPageCreation() {
  console.log('Testing Supabase connection and page creation...');
  
  try {
    // Test connection
    const { data: testData, error: testError } = await supabase
      .from('pages')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('Connection test failed:', testError);
      return;
    }
    
    console.log('✅ Supabase connection successful');
    
    // Test page creation
    const testPageName = `Test Page ${Date.now()}`;
    const { data: newPage, error: createError } = await supabase
      .from('pages')
      .insert([{
        name: testPageName,
        type: 'main',
        display_order: 999,
        parent_id: null
      }])
      .select()
      .single();
    
    if (createError) {
      console.error('❌ Page creation failed:', createError);
      return;
    }
    
    console.log('✅ Page creation successful:', newPage);
    
    // Clean up - delete the test page
    const { error: deleteError } = await supabase
      .from('pages')
      .delete()
      .eq('id', newPage.id);
    
    if (deleteError) {
      console.error('⚠️ Test cleanup failed:', deleteError);
    } else {
      console.log('✅ Test cleanup successful');
    }
    
  } catch (error) {
    console.error('❌ Test failed with exception:', error);
  }
}

testPageCreation();