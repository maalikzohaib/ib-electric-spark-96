```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../src/lib/db.js'.js'

function slugify(input: string) {
  return (input || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' })
    }

    const { name, type, parent_id } = (req.body || {}) as { name?: string; type?: 'main' | 'sub'; parent_id?: string | null }

    if (!name?.trim() || !type) {
      return res.status(400).json({ error: 'name and type are required' })
    }

    let baseSlug = slugify(name)
    if (!baseSlug) {
      return res.status(400).json({ error: 'name produces invalid slug' })
    }

    let resolvedParent: string | null = null
    if (type === 'sub') {
      if (!parent_id) {
        return res.status(400).json({ error: 'parent_id required for sub page' })
      }
      
      // Get parent page slug using Supabase
      const { data: parentData, error: parentError } = await supabase
        .from('pages')
        .select('slug')
        .eq('id', parent_id)
        .single()
        
      if (parentError || !parentData) {
        return res.status(400).json({ error: 'Invalid parent_id' })
      }
      
      resolvedParent = parent_id
      baseSlug = `${ parentData.slug } -${ baseSlug } `
    }

    // Check if slug exists and find unique slug
    let slug = baseSlug
    for (let suffix = 2; suffix < 50; suffix++) {
      const { data: existing } = await supabase
        .from('pages')
        .select('id')
        .eq('slug', slug)
        .limit(1)
        
      if (!existing || existing.length === 0) break
      slug = `${ baseSlug } -${ suffix } `
    }

    // Get next display order
    const { data: orderData } = await supabase
      .from('pages')
      .select('display_order')
      .is('parent_id', type === 'main' ? null : resolvedParent)
      .order('display_order', { ascending: false })
      .limit(1)
      
    const displayOrder = orderData && orderData.length > 0 ? (orderData[0].display_order || 0) + 1 : 1

    // Insert new page using Supabase
    const { data, error } = await supabase
      .from('pages')
      .insert({
        name: name.trim(),
        title: name.trim(),
        slug,
        type,
        parent_id: resolvedParent,
        display_order: displayOrder,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Insert error:', error)
      throw error
    }

    return res.status(200).json(data)
  } catch (err: any) {
    console.error('POST /api/pages error:', err)
    return res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
}
