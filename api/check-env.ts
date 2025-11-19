import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  const envCheck = {
    SUPABASE_URL: process.env.SUPABASE_URL ? '✅ SET' : '❌ NOT SET',
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY ? '✅ SET (' + process.env.SUPABASE_SERVICE_KEY.length + ' chars)' : '❌ NOT SET',
    NODE_ENV: process.env.NODE_ENV || 'undefined',
    timestamp: new Date().toISOString()
  }
  
  return res.status(200).json(envCheck)
}
