import { createClient } from '@supabase/supabase-js'

// Helper to safely get env vars from both Vite and Node environments
const getEnv = (viteKey: string, nodeKey: string, fallback?: string) => {
  // Check Vite environment (import.meta.env)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const viteValue = (import.meta.env as any)[viteKey];
    if (viteValue) return viteValue;
  }
  // Fallback to Node environment (process.env)
  return process.env[nodeKey] || fallback;
};

// Supabase configuration
const supabaseUrl = getEnv('VITE_SUPABASE_URL', 'SUPABASE_URL', 'https://okbomxxronimfqehcjvz.supabase.co')
const supabaseKey = getEnv('VITE_SUPABASE_SERVICE_KEY', 'SUPABASE_SERVICE_KEY')

if (!supabaseKey) {
  throw new Error('Missing Supabase service key! Check your .env file.')
}

// Create Supabase client with service role key
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// SQL template literal function that uses Supabase REST API instead of direct PostgreSQL
// This works around network/firewall restrictions
async function sql<T = any>(strings: TemplateStringsArray, ...values: any[]): Promise<T[]> {
  // Construct the SQL query from template literal
  let query = strings[0]
  for (let i = 0; i < values.length; i++) {
    // Escape and format values
    const value = values[i]
    if (value === null || value === undefined) {
      query += 'NULL'
    } else if (typeof value === 'string') {
      query += `'${value.replace(/'/g, "''")}'`
    } else if (typeof value === 'boolean') {
      query += value ? 'true' : 'false'
    } else if (Array.isArray(value)) {
      query += `ARRAY[${value.map(v => typeof v === 'string' ? `'${v}'` : v).join(',')}]`
    } else {
      query += value
    }
    query += strings[i + 1]
  }
  
  // Execute using Supabase RPC
  const { data, error } = await supabase.rpc('exec_sql', { query })
  
  if (error) {
    // If exec_sql doesn't exist, try direct query execution via REST API
    console.error('SQL execution error:', error)
    throw new Error(`Database query failed: ${error.message}`)
  }
  
  return (data as T[]) || []
}

// Add unsafe method for raw SQL (used by migrations)
sql.unsafe = async (query: string) => {
  const { data, error } = await supabase.rpc('exec_sql', { query })
  if (error) throw error
  return data
}

export default sql
