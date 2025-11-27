import type { VercelRequest, VercelResponse } from '@vercel/node'
import handler from '../index'

// Re-export the same handler for images routes
export default handler
