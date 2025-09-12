import { neon } from '@neondatabase/serverless';

// Neon database client configuration
const DATABASE_URL = import.meta.env.VITE_DATABASE_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined. Please check your environment variables.');
}

// Create Neon SQL client
export const sql = neon(DATABASE_URL);

// Helper function for database queries with error handling
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  try {
    const result = await sql(query, params);
    return result as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function for single row queries
export async function executeQuerySingle<T = any>(query: string, params: any[] = []): Promise<T | null> {
  try {
    const result = await executeQuery<T>(query, params);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Export for compatibility with existing code
export { sql as neonClient };