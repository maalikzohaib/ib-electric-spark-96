import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config();

async function checkSchema() {
  try {
    console.log('Database URL:', process.env.VITE_DATABASE_URL ? 'Defined' : 'Undefined');
    
    const sql = neon(process.env.VITE_DATABASE_URL);
    console.log('Neon client created');
    
    // Now try the schema query
    console.log('Running schema query...');
    const result = await sql.query('SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'products\' ORDER BY ordinal_position');
    
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
  }
}

checkSchema();