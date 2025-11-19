import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client
const getSupabase = () => {
  const supabaseUrl = process.env.SUPABASE_URL || 'https://okbomxxronimfqehcjvz.supabase.co'
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY
  
  if (!supabaseKey) {
    throw new Error('SUPABASE_SERVICE_KEY is not set')
  }
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query as { id?: string }

  try {
    const supabase = getSupabase()
    // POST /api/categories (Create new category)
    if (req.method === 'POST' && !id) {
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

    // PATCH /api/categories?id={id} (Update category)
    if (req.method === 'PATCH' && id) {
      const { name, description, icon } = (req.body || {})
      
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

    // DELETE /api/categories?id={id} (Delete category)
    if (req.method === 'DELETE' && id) {
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
    console.error(`${req.method} /api/categories error:`, err)
    return res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
}
