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

    // GET /api/brands (List all brands)
    if (req.method === 'GET' && !id) {
      const { data, error } = await supabase
        .from('brands')
        .select('id, name, description, logo_url, created_at')
        .order('name', { ascending: true })

      if (error) throw error
      return res.status(200).json({ brands: data || [] })
    }

    // GET /api/brands?id={id} (Get single brand)
    if (req.method === 'GET' && id) {
      const { data, error } = await supabase
        .from('brands')
        .select('id, name, description, logo_url, created_at')
        .eq('id', id)
        .single()

      if (error) throw error
      return res.status(200).json(data)
    }

    // POST /api/brands (Create new brand)
    if (req.method === 'POST' && !id) {
      const { name, description, logo_url } = req.body || {}

      if (!name) {
        return res.status(400).json({ error: 'Brand name is required' })
      }

      const { data, error } = await supabase
        .from('brands')
        .insert({
          name: name.trim(),
          description: description || null,
          logo_url: logo_url || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id, name, description, logo_url, created_at')
        .single()

      if (error) {
        if (error.code === '23505') {
          return res.status(400).json({ error: 'Brand with this name already exists' })
        }
        console.error('Insert error:', error)
        throw error
      }

      return res.status(201).json(data)
    }

    // PATCH /api/brands?id={id} (Update brand)
    if (req.method === 'PATCH' && id) {
      const { name, description, logo_url } = req.body || {}

      const updateData: any = {
        updated_at: new Date().toISOString()
      }

      if (name !== undefined) updateData.name = name.trim()
      if (description !== undefined) updateData.description = description
      if (logo_url !== undefined) updateData.logo_url = logo_url

      const { data, error } = await supabase
        .from('brands')
        .update(updateData)
        .eq('id', id)
        .select('id, name, description, logo_url, created_at')
        .single()

      if (error) {
        if (error.code === '23505') {
          return res.status(400).json({ error: 'Brand with this name already exists' })
        }
        console.error('Update error:', error)
        throw error
      }

      return res.status(200).json(data)
    }

    // DELETE /api/brands?id={id} (Delete brand)
    if (req.method === 'DELETE' && id) {
      const { error } = await supabase
        .from('brands')
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
    console.error(`${req.method} /api/brands error:`, err)
    return res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
}
