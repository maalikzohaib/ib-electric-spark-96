// Script to fix the pages table schema by bypassing RLS issues
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://hhxdmsirpvufjkaqzztu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoeGRtc2lycHZ1ZmprYXF6enR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NjI5NjIsImV4cCI6MjA3MDAzODk2Mn0.JEYJUzRhRnUUvwPXc_pCpvhW3NC8bKlyzGrmW_BGmvU";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fixPagesTable() {
  console.log('🔧 Attempting to fix pages table schema...');
  
  try {
    // Try to create a simple test page to see what specific error we get
    console.log('🧪 Testing direct page creation...');
    
    const testPage = {
      name: 'Test Page ' + Date.now()
    };
    
    const { data: newPage, error: insertError } = await supabase
      .from('pages')
      .insert([testPage])
      .select()
      .single();
      
    if (insertError) {
      console.error('❌ Error creating test page:', insertError);
      
      if (insertError.code === '42703') {
        console.log('🔧 Missing column detected: display_order');
        console.log('📋 The pages table exists but is missing the display_order column.');
        console.log('💡 This requires database admin access to fix.');
        console.log('\n🛠️  Manual fix required:');
        console.log('1. Go to Supabase Dashboard > SQL Editor');
        console.log('2. Run this SQL:');
        console.log('   ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;');
        console.log('   ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS type text DEFAULT \'main\';');
        console.log('   ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS parent_id uuid;');
        console.log('3. Or apply the pending migrations with Supabase CLI after authentication');
      } else if (insertError.code === '42P01') {
        console.log('📋 Pages table does not exist.');
        console.log('💡 Run the migrations to create it.');
      } else {
        console.log('🔍 Unexpected error code:', insertError.code);
      }
    } else {
      console.log('✅ Test page created successfully:', newPage);
      
      // Clean up test page
      await supabase.from('pages').delete().eq('id', newPage.id);
      console.log('🧹 Test page cleaned up');
      console.log('✅ Pages table is working correctly!');
    }
    
  } catch (error) {
    console.error('💥 Script error:', error);
    
    if (error.message && error.message.includes('infinite recursion')) {
      console.log('\n🚨 Database has policy recursion issues.');
      console.log('💡 This needs to be fixed in Supabase Dashboard:');
      console.log('1. Go to Authentication > Policies');
      console.log('2. Find and disable problematic policies on user_roles table');
      console.log('3. Or run the fix-policy-recursion migration');
    }
  }
}

fixPagesTable();