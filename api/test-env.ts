import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Test environment variables
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY
    
    const diagnostics = {
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      platform: process.platform,
      env: {
        SUPABASE_URL: supabaseUrl ? '✅ Set' : '❌ Missing',
        SUPABASE_SERVICE_KEY: supabaseKey ? '✅ Set (length: ' + supabaseKey.length + ')' : '❌ Missing',
        NODE_ENV: process.env.NODE_ENV || 'not set'
      },
      supabaseUrlValue: supabaseUrl || 'NOT SET',
      keyFirstChars: supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'NOT SET'
    }
    
    return res.status(200).json(diagnostics)
  } catch (err: any) {
    return res.status(500).json({ 
      error: err.message,
      stack: err.stack 
    })
  }
}
