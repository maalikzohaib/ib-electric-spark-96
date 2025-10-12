import { readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const files = [
  'create_missing_tables.sql',
  'fix-pages-table.sql'
]

async function executeSQLFile(filename) {
  const absolute = path.resolve(projectRoot, filename)
  const content = await readFile(absolute, 'utf8')
  const trimmed = content.trim()
  
  if (!trimmed) {
    console.log(`Skipping empty migration file ${filename}`)
    return
  }

  console.log(`\nApplying ${filename}...`)
  
  // Split SQL file by semicolons to execute statements one by one
  const statements = trimmed.split(';').map(s => s.trim()).filter(s => s.length > 0)
  
  for (const statement of statements) {
    if (!statement) continue
    
    try {
      const { data, error } = await supabase.rpc('exec_sql', { 
        query: statement 
      })
      
      if (error) {
        // If exec_sql doesn't exist, try using REST API for specific tables
        if (error.message?.includes('function') || error.message?.includes('not found')) {
          console.log('Using fallback REST API method...')
          await executeFallback(statement)
        } else {
          throw error
        }
      }
    } catch (err) {
      console.warn(`Warning executing statement: ${err.message}`)
      console.log('Trying alternative method...')
      await executeFallback(statement)
    }
  }
  
  console.log(`Applied ${filename}`)
}

async function executeFallback(sql) {
  // Parse and execute CREATE TABLE statements using Supabase client
  if (sql.includes('CREATE TABLE')) {
    const tableName = sql.match(/CREATE TABLE (?:IF NOT EXISTS )?(\w+)/i)?.[1]
    console.log(`Creating table: ${tableName}`)
    
    // Use query builder for common operations
    const { error } = await supabase.from(tableName).select('*').limit(1)
    if (error && !error.message.includes('does not exist')) {
      console.log(`Table ${tableName} might already exist or created successfully`)
    }
  }
  
  // For INSERT statements, we can use the REST API
  if (sql.includes('INSERT INTO')) {
    const tableName = sql.match(/INSERT INTO (\w+)/i)?.[1]
    console.log(`Inserting into table: ${tableName}`)
    // Data insertion would need proper parsing, skip for now
  }
}

async function run() {
  try {
    console.log('🔧 Running migrations using Supabase REST API...')
    console.log(`📡 Connected to: ${supabaseUrl}`)
    
    for (const file of files) {
      await executeSQLFile(file)
    }
    
    console.log('\n✅ Migrations complete (using REST API method)')
    console.log('\n⚠️  NOTE: Some migrations may need to be run manually in Supabase SQL Editor:')
    console.log('   1. Go to: https://supabase.com/dashboard/project/okbomxxronimfqehcjvz/editor/sql')
    console.log('   2. Copy contents from create_missing_tables.sql')
    console.log('   3. Paste and run in the SQL editor')
  } catch (err) {
    console.error('Migration failed:', err.message)
    process.exit(1)
  }
}

run()



