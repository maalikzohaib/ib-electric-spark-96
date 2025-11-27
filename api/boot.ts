import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { createClient } = await import('@supabase/supabase-js')

    const supabaseUrl = process.env.SUPABASE_URL || 'https://okbomxxronimfqehcjvz.supabase.co'
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY

    if (!supabaseKey) {
      return res.status(500).json({ error: 'SUPABASE_SERVICE_KEY not set' })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch all data in parallel
    const [pagesResult, categoriesResult, featuredProductsResult] = await Promise.all([
      supabase.from('pages').select('*'),
      supabase.from('categories').select('id, name, icon').order('name', { ascending: true }),
      supabase.from('products').select('id, name, price, image_url, images, brand, in_stock, size, color, variant').eq('featured', true).order('created_at', { ascending: false }).limit(6)
    ])

    const payload = {
      pages: pagesResult.data || [],
      categories: categoriesResult.data || [],
      featuredProducts: featuredProductsResult.data || []
    }

    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
    return res.status(200).json(payload)

  } catch (err: any) {
    return res.status(500).json({
      error: err.message,
      stack: err.stack
    })
  }
}
