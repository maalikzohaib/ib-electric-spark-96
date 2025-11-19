import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../src/lib/db'
import cache from '../src/lib/cache'

// Cache key and TTL (30s in-memory)
const CACHE_KEY = 'boot:data'
const CACHE_TTL_MS = 30 * 1000

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Check environment variables
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing environment variables:', {
        SUPABASE_URL: supabaseUrl ? 'set' : 'MISSING',
        SUPABASE_SERVICE_KEY: supabaseKey ? 'set' : 'MISSING'
      })
      return res.status(500).json({ 
        error: 'Server configuration error',
        details: 'Missing required environment variables. Please check Vercel environment settings.'
      })
    }

    const cached = cache.get<any>(CACHE_KEY)
    if (cached) {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
      return res.status(200).json(cached)
    }

    // Fetch data using Supabase query builder
    const [pagesResult, categoriesResult, featuredProductsResult] = await Promise.all([
      supabase
        .from('pages')
        .select('id, name, title, slug, parent_id, type, display_order')
        .order('display_order', { ascending: true }),
      
      supabase
        .from('categories')
        .select('id, name, icon')
        .order('name', { ascending: true }),
      
      supabase
        .from('products')
        .select('id, name, price, image_url, brand')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(6)
    ])

    // Check for errors
    if (pagesResult.error) throw pagesResult.error
    if (categoriesResult.error) throw categoriesResult.error
    if (featuredProductsResult.error) throw featuredProductsResult.error

    const payload = {
      pages: pagesResult.data || [],
      categories: categoriesResult.data || [],
      featuredProducts: featuredProductsResult.data || []
    }

    // Cache in-memory
    cache.set(CACHE_KEY, payload, CACHE_TTL_MS)

    // Use no-cache for browser to always revalidate, but allow CDN caching
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
    return res.status(200).json(payload)
  } catch (err: any) {
    console.error('Error in /api/boot:', err)
    console.error('Error details:', {
      message: err.message,
      code: err.code,
      details: err.details,
      hint: err.hint,
      stack: err.stack
    })
    return res.status(500).json({ 
      error: err.message || 'Internal Server Error',
      code: err.code || 'UNKNOWN_ERROR',
      hint: err.hint || 'Check server logs for details'
    })
  }
}

