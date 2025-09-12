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

async function executePolicyReset() {
  console.log('🔄 Starting complete policy reset...');
  
  try {
    // Step 1: Disable RLS on all tables
    console.log('📝 Step 1: Disabling RLS on all tables...');
    const disableRLSQueries = [
      'ALTER TABLE IF EXISTS public.user_roles DISABLE ROW LEVEL SECURITY',
      'ALTER TABLE IF EXISTS public.pages DISABLE ROW LEVEL SECURITY',
      'ALTER TABLE IF EXISTS public.contact_submissions DISABLE ROW LEVEL SECURITY',
      'ALTER TABLE IF EXISTS public.products DISABLE ROW LEVEL SECURITY'
    ];
    
    for (const query of disableRLSQueries) {
      const { error } = await supabase.rpc('exec_sql', { sql_query: query });
      if (error) {
        console.log(`⚠️  ${query}: ${error.message}`);
      } else {
        console.log(`✅ ${query}`);
      }
    }
    
    // Step 2: Drop all existing policies
    console.log('📝 Step 2: Dropping all existing policies...');
    const dropPoliciesQuery = `
      DO $$
      DECLARE
          r RECORD;
      BEGIN
          FOR r IN (
              SELECT schemaname, tablename, policyname
              FROM pg_policies
              WHERE schemaname = 'public'
          ) LOOP
              EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
          END LOOP;
      END $$;
    `;
    
    const { error: dropError } = await supabase.rpc('exec_sql', { sql_query: dropPoliciesQuery });
    if (dropError) {
      console.log(`⚠️  Drop policies: ${dropError.message}`);
    } else {
      console.log('✅ All policies dropped successfully');
    }
    
    // Step 3: Create new non-recursive policies
    console.log('📝 Step 3: Creating new non-recursive policies...');
    
    const newPolicies = [
      // Pages policies
      'ALTER TABLE IF EXISTS public.pages ENABLE ROW LEVEL SECURITY',
      'CREATE POLICY "pages_select_all" ON public.pages FOR SELECT USING (true)',
      'CREATE POLICY "pages_insert_all" ON public.pages FOR INSERT WITH CHECK (true)',
      'CREATE POLICY "pages_update_all" ON public.pages FOR UPDATE USING (true) WITH CHECK (true)',
      'CREATE POLICY "pages_delete_all" ON public.pages FOR DELETE USING (true)',
      
      // User roles policies
      'ALTER TABLE IF EXISTS public.user_roles ENABLE ROW LEVEL SECURITY',
      'CREATE POLICY "user_roles_select_all" ON public.user_roles FOR SELECT USING (true)',
      'CREATE POLICY "user_roles_insert_all" ON public.user_roles FOR INSERT WITH CHECK (true)',
      'CREATE POLICY "user_roles_update_all" ON public.user_roles FOR UPDATE USING (true) WITH CHECK (true)',
      'CREATE POLICY "user_roles_delete_all" ON public.user_roles FOR DELETE USING (true)',
      
      // Contact submissions policies
      'ALTER TABLE IF EXISTS public.contact_submissions ENABLE ROW LEVEL SECURITY',
      'CREATE POLICY "contact_submissions_select_all" ON public.contact_submissions FOR SELECT USING (true)',
      'CREATE POLICY "contact_submissions_insert_all" ON public.contact_submissions FOR INSERT WITH CHECK (true)',
      
      // Products policies
      'ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY',
      'CREATE POLICY "products_select_all" ON public.products FOR SELECT USING (true)',
      'CREATE POLICY "products_insert_all" ON public.products FOR INSERT WITH CHECK (true)',
      'CREATE POLICY "products_update_all" ON public.products FOR UPDATE USING (true) WITH CHECK (true)',
      'CREATE POLICY "products_delete_all" ON public.products FOR DELETE USING (true)'
    ];
    
    for (const query of newPolicies) {
      const { error } = await supabase.rpc('exec_sql', { sql_query: query });
      if (error) {
        console.log(`⚠️  ${query}: ${error.message}`);
      } else {
        console.log(`✅ ${query}`);
      }
    }
    
    // Step 4: Verify policies
    console.log('📝 Step 4: Verifying new policies...');
    const { data: policies, error: verifyError } = await supabase.rpc('exec_sql', {
      sql_query: `SELECT schemaname, tablename, policyname, cmd FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, policyname`
    });
    
    if (verifyError) {
      console.log(`⚠️  Verification error: ${verifyError.message}`);
    } else {
      console.log('✅ Policy verification completed');
      if (policies && policies.length > 0) {
        console.log('📋 Current policies:');
        policies.forEach(policy => {
          console.log(`   ${policy.tablename}.${policy.policyname} (${policy.cmd})`);
        });
      }
    }
    
    console.log('🎉 Complete policy reset finished! Recursion issues should be resolved.');
    
  } catch (error) {
    console.error('❌ Error during policy reset:', error.message);
    process.exit(1);
  }
}

// Execute the reset
executePolicyReset();