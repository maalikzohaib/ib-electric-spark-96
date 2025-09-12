// Hybrid client configuration: Supabase for auth, Neon for database
import { createClient } from '@supabase/supabase-js';
import { neon } from '@neondatabase/serverless';
import type { Database } from './types';

const SUPABASE_URL = "https://hhxdmsirpvufjkaqzztu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoeGRtc2lycHZ1ZmprYXF6enR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NjI5NjIsImV4cCI6MjA3MDAzODk2Mn0.JEYJUzRhRnUUvwPXc_pCpvhW3NC8bKlyzGrmW_BGmvU";

// Neon database configuration
const DATABASE_URL = import.meta.env.VITE_DATABASE_URL;

// Create Supabase client for authentication only
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Create Neon client for database operations
export const neonSql = DATABASE_URL ? neon(DATABASE_URL) : null;

// Helper function to execute Neon queries with error handling
export async function executeNeonQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  if (!neonSql) {
    throw new Error('Neon database not configured. Please set VITE_DATABASE_URL in your environment.');
  }
  
  try {
    // Use the Neon client with tagged template syntax
    const result = await neonSql.query(query, params);
    return result as T[];
  } catch (error) {
    console.error('Neon query error:', error);
    throw error;
  }
}

// Helper function for single row queries
export async function executeNeonQuerySingle<T = any>(query: string, params: any[] = []): Promise<T | null> {
  const result = await executeNeonQuery<T>(query, params);
  return result.length > 0 ? result[0] : null;
}

// Export both clients for compatibility
// Use supabase for authentication
// Use neonSql or executeNeonQuery for database operations