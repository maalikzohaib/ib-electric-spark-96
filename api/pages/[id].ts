import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../../src/lib/db'
import cache from '../../src/lib/cache'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query as { id: string }
  
  console.log('�Y"? Page update request:', { method: req.method, id, body: req.body })
  
  if (!id) {
    console.error('�?O No ID provided')
    return res.status(400).json({ error: 'id required' })
  }

  try {
    if (req.method === 'PATCH') {
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

      console.log('�Y"< Update fields:', {
        name: sanitizedName,
        title: sanitizedTitle,
        slug: sanitizedSlug,
        type: sanitizedType,
        parent_id: sanitizedParentId,
        display_order: sanitizedDisplayOrder
      })
      
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
      
      console.log('�Y"" Sending update to Supabase:', updateData)
      
      const { data, error } = await supabase
        .from('pages')
        .update(updateData)
        .eq('id', id)
        .select('id, name, title, slug, parent_id, type, display_order')
        .single()
      
      if (error) {
        console.error('�?O Supabase update error:', error)
        return res.status(500).json({ 
          error: 'Database update failed', 
          details: error.message,
          code: error.code 
        })
      }
      
      // Invalidate boot cache so fresh data is fetched
      cache.del('boot:data')
      
      console.log('�o. Page updated successfully:', data)
      return res.status(200).json(data)
    }

    if (req.method === 'DELETE') {
      // First, get all child pages recursively
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
      
      // Detach products from all pages to be deleted
      await supabase
        .from('products')
        .update({ page_id: null })
        .in('page_id', pageIdsToDelete)
      
      // Delete all pages
      const { error: deleteError } = await supabase
        .from('pages')
        .delete()
        .in('id', pageIdsToDelete)
      
      if (deleteError) {
        console.error('Delete error:', deleteError)
        throw deleteError
      }
      
      // Invalidate boot cache so fresh data is fetched
      cache.del('boot:data')
      
      return res.status(204).end()
    }

    return res.status(405).json({ error: 'Method Not Allowed' })
  } catch (err: any) {
    console.error(`${req.method} /api/pages/${id} error:`, err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
