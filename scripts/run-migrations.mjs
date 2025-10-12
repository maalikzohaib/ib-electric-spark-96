import { readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import postgres from 'postgres'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL
if (!connectionString) {
  console.error('Missing DATABASE_URL (or SUPABASE_DATABASE_URL). Set this before running migrations.')
  console.error('Format: postgresql://postgres:[YOUR-PASSWORD]@db.okbomxxronimfqehcjvz.supabase.co:5432/postgres')
  process.exit(1)
}

const sql = postgres(connectionString, {
  ssl: 'require',
  max: 1,
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const files = [
  'create_missing_tables.sql',
  'fix-pages-table.sql'
]

async function run() {
  try {
    for (const file of files) {
      const absolute = path.resolve(projectRoot, file)
      const content = await readFile(absolute, 'utf8')
      const trimmed = content.trim()
      if (!trimmed) {
        console.log(`Skipping empty migration file ${file}`)
        continue
      }
      console.log(`\nApplying ${file}...`)
      await sql.unsafe(trimmed)
      console.log(`Applied ${file}`)
    }
    console.log('\nMigrations complete.')
  } finally {
    await sql.end()
  }
}

run().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
