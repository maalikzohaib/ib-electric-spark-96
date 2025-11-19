import type { VercelRequest, VercelResponse } from '@vercel/node'
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
        message: 'SUPABASE_SERVICE_KEY environment variable is missing. Please set it in Vercel dashboard.',
        hint: 'Go to Vercel → Settings → Environment Variables'
      })
    }

    console.log('✅ Environment variables loaded')
    console.log('📍 Supabase URL:', supabaseUrl)
    console.log('🔑 Service key length:', supabaseKey.length)

    // Create Supabase client directly in this file
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    console.log('📡 Fetching data from Supabase...')

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

    console.log('📊 Results received')

    // Check for errors
    if (pagesResult.error) {
      console.error('❌ Pages query error:', pagesResult.error)
      throw pagesResult.error
    }
    if (categoriesResult.error) {
      console.error('❌ Categories query error:', categoriesResult.error)
      throw categoriesResult.error
    }
    if (featuredProductsResult.error) {
      console.error('❌ Featured products query error:', featuredProductsResult.error)
      throw featuredProductsResult.error
    }

    const payload = {
      pages: pagesResult.data || [],
      categories: categoriesResult.data || [],
      featuredProducts: featuredProductsResult.data || []
    }

    console.log('✅ Data fetched successfully:', {
      pages: payload.pages.length,
      categories: payload.categories.length,
      featuredProducts: payload.featuredProducts.length
    })

    // Use no-cache for browser to always revalidate
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
    return res.status(200).json(payload)
    
  } catch (err: any) {
    console.error('❌ Error in /api/boot:', err)
    console.error('Error details:', {
      message: err.message,
      code: err.code,
      details: err.details,
      hint: err.hint
    })
    
    return res.status(500).json({ 
      error: err.message || 'Internal Server Error',
      code: err.code || 'UNKNOWN_ERROR',
      hint: err.hint || 'Check Vercel function logs for details',
      details: err.details || null
    })
  }
}
