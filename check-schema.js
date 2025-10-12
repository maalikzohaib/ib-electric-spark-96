import dotenv from 'dotenv';
import postgres from 'postgres';

dotenv.config();

async function checkSchema() {
  const sql = postgres(process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL, {
    ssl: 'require',
    max: 1,
  });

  try {
    console.log('Database URL:', process.env.DATABASE_URL ? 'Defined' : 'Undefined');
    console.log('Supabase PostgreSQL client created');
    
    // Now try the schema query
    console.log('Running schema query...');
    const result = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      ORDER BY ordinal_position
    `;
    
    if (result && Array.isArray(result)) {
      console.log('Products table schema:');
      console.table(result);
      
      // Check if size column exists
      const sizeColumn = result.find(row => row.column_name === 'size');
      if (sizeColumn) {
        console.log('✅ Size column exists with data type:', sizeColumn.data_type);
      } else {
        console.log('❌ Size column does not exist in the products table');
      }
    } else {
      console.log('Unexpected result format');
    }
  } catch (error) {
    console.error('Error checking schema:', error);
  } finally {
    await sql.end();
  }
}

checkSchema();