import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../../src/lib/db'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price, category_id, brand, size, color, variant, in_stock, image_url, images, featured, page_id')
        .order('created_at', { ascending: false })

      if (error) throw error
      return res.status(200).json({ products: data || [] })
    }

    if (req.method === 'POST') {
      const p = req.body || {}
      
      // Validate required fields
      if (!p.name || !p.price) {
        return res.status(400).json({ error: 'name and price are required' })
      }

      const { data, error } = await supabase
        .from('products')
        .insert({
          name: p.name,
          description: p.description || null,
          price: p.price,
          category_id: p.category_id || null,
          brand: p.brand || null,
          size: p.size || null,
          color: p.color || null,
          variant: p.variant || null,
          in_stock: p.in_stock !== undefined ? p.in_stock : true,
          image_url: p.image_url || null,
          images: p.images || null,
          featured: p.featured !== undefined ? p.featured : false,
          page_id: p.page_id || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id, name, description, price, category_id, brand, size, color, variant, in_stock, image_url, images, featured, page_id')
        .single()

      if (error) {
        console.error('Insert error:', error)
        throw error
      }

      return res.status(200).json(data)
    }

    return res.status(405).json({ error: 'Method Not Allowed' })
  } catch (err: any) {
    console.error(`${req.method} /api/products error:`, err)
    return res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
}
