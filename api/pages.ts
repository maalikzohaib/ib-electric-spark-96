import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../src/lib/db'
import cache from '../src/lib/cache'

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

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id, action } = req.query as { id?: string; action?: string }

  try {
    // POST /api/pages (Create new page)
    if (req.method === 'POST' && !id && !action) {
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

        const { data: parentData, error: parentError } = await supabase
          .from('pages')
          .select('slug')
          .eq('id', parent_id)
          .single()

        if (parentError || !parentData) {
          return res.status(400).json({ error: 'Invalid parent_id' })
        }

        resolvedParent = parent_id
        baseSlug = `${parentData.slug}-${baseSlug}`
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
        slug = `${baseSlug}-${suffix}`
      }

      // Get next display order
      const { data: orderData } = await supabase
        .from('pages')
        .select('display_order')
        .is('parent_id', type === 'main' ? null : resolvedParent)
        .order('display_order', { ascending: false })
        .limit(1)

      const displayOrder = orderData && orderData.length > 0 ? (orderData[0].display_order || 0) + 1 : 1

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

      cache.del('boot:data')
      return res.status(200).json(data)
    }

    // POST /api/pages?action=reorder (Reorder pages)
    if (req.method === 'POST' && action === 'reorder') {
      const { updates } = req.body || {}
      if (!Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({ error: 'updates array required' })
      }

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
      
      cache.del('boot:data')
      return res.status(204).end()
    }

    // PATCH /api/pages?id={id} (Update page)
    if (req.method === 'PATCH' && id) {
      let body: any = req.body ?? {}

      if (typeof body === 'string') {
        const trimmed = body.trim()
        if (trimmed.length > 0) {
          try {
            body = JSON.parse(trimmed)
          } catch (parseError) {
            console.error('Invalid JSON payload for page update:', parseError)
            return res.status(400).json({ error: 'Invalid JSON payload' })
          }
        } else {
          body = {}
        }
      } else if (Buffer.isBuffer(body)) {
        const decoded = body.toString('utf8').trim()
        if (decoded.length > 0) {
          try {
            body = JSON.parse(decoded)
          } catch (parseError) {
            console.error('Invalid buffer payload for page update:', parseError)
            return res.status(400).json({ error: 'Invalid JSON payload' })
          }
        } else {
          body = {}
        }
      }

      const { name, title, slug, type, parent_id, display_order } = body as {
        name?: unknown
        title?: unknown
        slug?: unknown
        type?: unknown
        parent_id?: unknown
        display_order?: unknown
      }

      const sanitizedName = typeof name === 'string' ? name.trim() : undefined
      const sanitizedTitle = typeof title === 'string' ? title.trim() : undefined
      const sanitizedSlug = typeof slug === 'string' ? slug.trim() : undefined
      const sanitizedType = type === 'main' || type === 'sub' ? type : undefined

      let sanitizedParentId: string | null | undefined
      if (parent_id === null) {
        sanitizedParentId = null
      } else if (typeof parent_id === 'string') {
        const trimmedParent = parent_id.trim()
        if (
          trimmedParent === '' ||
          trimmedParent.toLowerCase() === 'null' ||
          trimmedParent.toLowerCase() === 'undefined'
        ) {
          sanitizedParentId = undefined
        } else if (!UUID_REGEX.test(trimmedParent)) {
          console.warn('Invalid parent_id provided for page update:', parent_id)
          return res.status(400).json({ error: 'parent_id must be a valid UUID' })
        } else {
          sanitizedParentId = trimmedParent
        }
      } else if (parent_id !== undefined) {
        return res.status(400).json({ error: 'parent_id must be a string or null' })
      }

      let sanitizedDisplayOrder: number | undefined
      if (display_order !== undefined) {
        if (typeof display_order === 'number' && Number.isFinite(display_order)) {
          sanitizedDisplayOrder = display_order
        } else if (typeof display_order === 'string' && display_order.trim() !== '') {
          const parsed = Number.parseInt(display_order, 10)
          if (Number.isNaN(parsed)) {
            return res.status(400).json({ error: 'display_order must be a number' })
          }
          sanitizedDisplayOrder = parsed
        } else if (typeof display_order === 'string' && display_order.trim() === '') {
          sanitizedDisplayOrder = undefined
        } else {
          return res.status(400).json({ error: 'display_order must be a number' })
        }
      }

      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString()
      }
      
      if (sanitizedName !== undefined) {
        if (!sanitizedName) {
          return res.status(400).json({ error: 'name cannot be empty' })
        }
        updateData.name = sanitizedName
      }
      if (sanitizedTitle !== undefined) updateData.title = sanitizedTitle
      if (sanitizedSlug !== undefined) updateData.slug = sanitizedSlug
      if (sanitizedType !== undefined) updateData.type = sanitizedType
      if (sanitizedParentId !== undefined) updateData.parent_id = sanitizedParentId
      if (sanitizedDisplayOrder !== undefined) updateData.display_order = sanitizedDisplayOrder
      
      const { data, error } = await supabase
        .from('pages')
        .update(updateData)
        .eq('id', id)
        .select('id, name, title, slug, parent_id, type, display_order')
        .single()
      
      if (error) {
        console.error('Supabase update error:', error)
        return res.status(500).json({ 
          error: 'Database update failed', 
          details: error.message,
          code: error.code 
        })
      }
      
      cache.del('boot:data')
      return res.status(200).json(data)
    }

    // DELETE /api/pages?id={id} (Delete page)
    if (req.method === 'DELETE' && id) {
      const getAllChildPages = async (pageId: string): Promise<string[]> => {
        const { data: children } = await supabase
          .from('pages')
          .select('id')
          .eq('parent_id', pageId)
        
        if (!children || children.length === 0) return [pageId]
        
        const childIds = children.map(c => c.id)
        const allDescendants = await Promise.all(childIds.map(cid => getAllChildPages(cid)))
        return [pageId, ...allDescendants.flat()]
      }
      
      const pageIdsToDelete = await getAllChildPages(id)
      
      await supabase
        .from('products')
        .update({ page_id: null })
        .in('page_id', pageIdsToDelete)
      
      const { error: deleteError } = await supabase
        .from('pages')
        .delete()
        .in('id', pageIdsToDelete)
      
      if (deleteError) {
        console.error('Delete error:', deleteError)
        throw deleteError
      }
      
      cache.del('boot:data')
      return res.status(204).end()
    }

    return res.status(405).json({ error: 'Method Not Allowed' })
  } catch (err: any) {
    console.error('POST /api/pages error:', err)
    return res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
}
