// Script to apply the size column migration to the products table
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import dotenv from 'dotenv';

async function applyMigration() {
  console.log('🔧 Applying migration to add size column to products table...');
  
  // Load environment variables
  dotenv.config();
  
  // Get database URL from environment
  const DATABASE_URL = process.env.VITE_DATABASE_URL || process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined. Please check your environment variables.');
  }
  
  // Create Neon client
  const sql = neon(DATABASE_URL);
  
  try {
    // Read the migration file
    const migrationSQL = fs.readFileSync('./supabase/migrations/20250820000000_add_size_to_products.sql', 'utf8');
    console.log('📄 Migration SQL:', migrationSQL);
    
    // Execute the migration
    await sql.query(migrationSQL);
    console.log('✅ Migration applied successfully!');
    
    // Verify the column was added
    const columnCheck = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'products' AND column_name = 'size'
    `;
    
    if (columnCheck && columnCheck.length > 0) {
      console.log('✅ Verified: size column added to products table');
      console.log(`📊 Column details: ${columnCheck[0].column_name} (${columnCheck[0].data_type})`);
    } else {
      console.error('❌ Verification failed: size column not found in products table');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Full error:', error);
  }
}

// Run the migration
applyMigration().catch(console.error);