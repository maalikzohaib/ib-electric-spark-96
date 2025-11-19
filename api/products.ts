import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../src/lib/db'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id, action } = req.query as { id?: string; action?: string }

  try {
    // GET /api/products (List all products)
    if (req.method === 'GET' && !id) {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price, category_id, brand, size, color, variant, in_stock, image_url, images, featured, page_id')
        .order('created_at', { ascending: false })

      if (error) throw error
      return res.status(200).json({ products: data || [] })
    }

    // POST /api/products (Create new product)
    if (req.method === 'POST' && !id && !action) {
      const p = req.body || {}
      
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

    // POST /api/products?id={id}&action=featured (Toggle featured status)
    if (req.method === 'POST' && id && action === 'featured') {
      const { featured } = req.body || {}

      const { error } = await supabase
        .from('products')
        .update({
          featured: !!featured,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) {
        console.error('Update featured error:', error)
        throw error
      }

      return res.status(204).end()
    }

    // PATCH /api/products?id={id} (Update product)
    if (req.method === 'PATCH' && id) {
      const { name, description, price, category_id, brand, size, color, variant, in_stock, image_url, images, featured, page_id } = (req.body || {})
      
      const updateData: any = {
        updated_at: new Date().toISOString()
      }
      
      if (name !== undefined) updateData.name = name
      if (description !== undefined) updateData.description = description
      if (price !== undefined) updateData.price = price
      if (category_id !== undefined) updateData.category_id = category_id
      if (brand !== undefined) updateData.brand = brand
      if (size !== undefined) updateData.size = size
      if (color !== undefined) updateData.color = color
      if (variant !== undefined) updateData.variant = variant
      if (in_stock !== undefined) updateData.in_stock = in_stock
      if (image_url !== undefined) updateData.image_url = image_url
      if (images !== undefined) updateData.images = images
      if (featured !== undefined) updateData.featured = featured
      if (page_id !== undefined) updateData.page_id = page_id

      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select('id, name, description, price, category_id, brand, size, color, variant, in_stock, image_url, images, featured, page_id')
        .single()

      if (error) {
        console.error('Update error:', error)
        throw error
      }

      return res.status(200).json(data)
    }

    // DELETE /api/products?id={id} (Delete product)
    if (req.method === 'DELETE' && id) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Delete error:', error)
        throw error
      }

      return res.status(204).end()
    }

    return res.status(405).json({ error: 'Method Not Allowed' })
  } catch (err: any) {
    console.error(`${req.method} /api/products error:`, err)
    return res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
}
