import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../../src/lib/db'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query as { id: string }
  if (!id) return res.status(400).json({ error: 'id required' })

  try {
    if (req.method === 'PATCH') {
      const { name, description, icon } = (req.body || {})
      
      // Build update object with only provided fields
      const updateData: any = {}
      if (name !== undefined) updateData.name = name
      if (description !== undefined) updateData.description = description
      if (icon !== undefined) updateData.icon = icon

      const { data, error } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', id)
        .select('id, name, description, icon')
        .single()

      if (error) {
        console.error('Update category error:', error)
        throw error
      }

      return res.status(200).json(data)
    }

    if (req.method === 'DELETE') {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Delete category error:', error)
        throw error
      }

      return res.status(204).end()
    }

    return res.status(405).json({ error: 'Method Not Allowed' })
  } catch (err: any) {
    console.error(`${req.method} /api/categories/${id} error:`, err)
    return res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
}
