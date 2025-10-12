import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../../src/lib/db'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'POST') {
      const c = req.body || {}
      
      if (!c.name) {
        return res.status(400).json({ error: 'name is required' })
      }

      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: c.name,
          description: c.description || null,
          icon: c.icon || null,
          created_at: new Date().toISOString()
        })
        .select('id, name, description, icon, created_at')
        .single()

      if (error) {
        console.error('Insert category error:', error)
        throw error
      }

      return res.status(200).json(data)
    }

    return res.status(405).json({ error: 'Method Not Allowed' })
  } catch (err: any) {
    console.error(`${req.method} /api/categories error:`, err)
    return res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
}
