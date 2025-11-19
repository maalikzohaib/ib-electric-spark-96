import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../../src/lib/db'
import cache from '../../src/lib/cache'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' })
    const { updates } = req.body || {}
    if (!Array.isArray(updates) || updates.length === 0) return res.status(400).json({ error: 'updates array required' })

    // Execute all updates in sequence
    for (const update of updates) {
      const { error } = await supabase
        .from('pages')
        .update({ 
          display_order: Number(update.display_order || 0),
          updated_at: new Date().toISOString()
        })
        .eq('id', update.id)
      
      if (error) {
        console.error('Reorder update error:', error)
        throw error
      }
    }
    
    // Invalidate boot cache so fresh data is fetched
    cache.del('boot:data')
    
    return res.status(204).end()
  } catch (err: any) {
    console.error('POST /api/pages/reorder error:', err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

