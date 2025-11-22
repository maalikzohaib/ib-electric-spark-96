import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Try to import Supabase
    const { createClient } = await import('@supabase/supabase-js')
    
    const supabaseUrl = process.env.SUPABASE_URL || 'https://okbomxxronimfqehcjvz.supabase.co'
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY
    
    if (!supabaseKey) {
      return res.status(500).json({ error: 'SUPABASE_SERVICE_KEY not set' })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Try a simple query
    const { data, error } = await supabase.from('pages').select('count')
    
    return res.status(200).json({
      success: true,
      supabaseImported: true,
      queryResult: error ? { error: error.message } : { data }
    })
  } catch (err: any) {
    return res.status(500).json({
      error: err.message,
      stack: err.stack
    })
  }
}
