import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers for better compatibility
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
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
    console.log('🔑 Service key present:', !!supabaseKey)

    // Create Supabase client directly in this file
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    console.log('📡 Fetching data from Supabase...')

    // Fetch data using Supabase query builder with error resilience
    let pagesResult, categoriesResult, featuredProductsResult
    
    try {
      [pagesResult, categoriesResult, featuredProductsResult] = await Promise.all([
        supabase
          .from('pages')
          .select('*'),
        
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
    } catch (queryError: any) {
      console.error('❌ Query execution failed:', queryError)
      // Return default empty results if queries fail
      pagesResult = { data: [], error: null }
      categoriesResult = { data: [], error: null }
      featuredProductsResult = { data: [], error: null }
    }

    console.log('📊 Results received')

    // Log any errors but don't fail completely - return empty arrays instead
    if (pagesResult.error) {
      console.warn('⚠️ Pages query error (returning empty array):', pagesResult.error)
    }
    if (categoriesResult.error) {
      console.warn('⚠️ Categories query error (returning empty array):', categoriesResult.error)
    }
    if (featuredProductsResult.error) {
      console.warn('⚠️ Featured products query error (returning empty array):', featuredProductsResult.error)
    }

    // Ensure data arrays exist and sort pages by display_order if column exists
    let pagesData = pagesResult.data || []
    if (pagesData.length > 0 && 'display_order' in pagesData[0]) {
      pagesData = pagesData.sort((a: any, b: any) => {
        const orderA = a.display_order ?? 9999
        const orderB = b.display_order ?? 9999
        return orderA - orderB
      })
    }

    const payload = {
      pages: pagesData,
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
