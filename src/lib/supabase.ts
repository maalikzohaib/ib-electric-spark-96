import { createClient } from '@supabase/supabase-js'

// Frontend Supabase client - uses anon public key (safe to expose)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://okbomxxronimfqehcjvz.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_ANON_KEY! The frontend needs the anon public key.')
  console.error('Please add VITE_SUPABASE_ANON_KEY to your .env file.')
  console.error('You can find it in Supabase Dashboard → Settings → API → Project API keys → anon public')
}

// Create Supabase client with anon public key for frontend use
export const supabase = createClient(supabaseUrl, supabaseAnonKey || '', {
  auth: {
    autoRefreshToken: true,
    persistSession: false
  }
})
