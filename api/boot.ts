import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../src/lib/db'
import cache from '../src/lib/cache'

// Cache key and TTL (30s in-memory)
const CACHE_KEY = 'boot:data'
const CACHE_TTL_MS = 30 * 1000

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const cached = cache.get<any>(CACHE_KEY)
    if (cached) {
      res.setHeader('Cache-Control', 'public, max-age=60')
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

    res.setHeader('Cache-Control', 'public, max-age=60')
    return res.status(200).json(payload)
  } catch (err: any) {
    console.error('Error in /api/boot:', err)
    return res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
}

