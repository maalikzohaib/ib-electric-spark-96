import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../../../src/lib/db.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query as { id: string }
  if (!id) return res.status(400).json({ error: 'id required' })

  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' })

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
  } catch (err: any) {
    console.error(`POST /api/products/${id}/featured error:`, err)
    return res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
}

