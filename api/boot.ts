.\deploy-fix.ps1import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Get environment variables
    const supabaseUrl = process.env.SUPABASE_URL || 'https://okbomxxronimfqehcjvz.supabase.co'
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY
    
    // Check if service key exists
    if (!supabaseKey) {
      console.error('❌ SUPABASE_SERVICE_KEY is not set!')
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'SUPABASE_SERVICE_KEY environment variable is missing',
        hint: 'Add SUPABASE_SERVICE_KEY to Vercel environment variables'
      })
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Fetch data - use select('*') to avoid column-specific errors
    const [pagesResult, categoriesResult, featuredProductsResult] = await Promise.all([
      supabase.from('pages').select('*'),
      supabase.from('categories').select('id, name, icon').order('name', { ascending: true }),
      supabase.from('products').select('id, name, price, image_url, brand').eq('featured', true).order('created_at', { ascending: false }).limit(6)
    ])

    // Build response with empty arrays for any failed queries
    const payload = {
      pages: pagesResult.data || [],
      categories: categoriesResult.data || [],
      featuredProducts: featuredProductsResult.data || []
    }

    // Set cache headers and return
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
    return res.status(200).json(payload)
    
  } catch (err: any) {
    console.error('Error in /api/boot:', err)
    return res.status(500).json({ 
      error: err.message || 'Internal Server Error',
      details: err.details || null
    })
  }
}
