import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../../src/lib/db'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query as { id: string }
  if (!id) return res.status(400).json({ error: 'id required' })

  try {
    if (req.method === 'PATCH') {
      const { name, description, price, category_id, brand, size, color, variant, in_stock, image_url, images, featured, page_id } = (req.body || {})
      
      // Build update object with only provided fields
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

    if (req.method === 'DELETE') {
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
    console.error(`${req.method} /api/products/${id} error:`, err)
    return res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
}
