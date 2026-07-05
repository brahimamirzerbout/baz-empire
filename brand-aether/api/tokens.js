import { supabase } from '../src/lib/supabase.js'

/**
 * GET /api/tokens?project_id=xxx
 * POST /api/tokens  { project_id, name, category, value, css_var }
 * PATCH /api/tokens/:id  { name, value, ... }
 * DELETE /api/tokens/:id
 */
export default async function handler(req, res) {
  const { method, query, body } = req

  try {
    switch (method) {
      case 'GET': {
        const { project_id, category } = query
        let q = supabase.from('design_tokens').select('*')
        if (project_id) q = q.eq('project_id', project_id)
        if (category) q = q.eq('category', category)
        q = q.order('sort_order', { ascending: true }).order('name', { ascending: true })
        const { data, error } = await q
        if (error) throw error
        return res.status(200).json(data)
      }

      case 'POST': {
        const { project_id, name, category, value, css_var } = body
        if (!project_id || !name || !category || !value) {
          return res.status(400).json({ error: 'Missing required fields: project_id, name, category, value' })
        }
        const { data, error } = await supabase
          .from('design_tokens')
          .insert({ project_id, name, category, value, css_var: css_var || '' })
          .select()
          .single()
        if (error) throw error
        return res.status(201).json(data)
      }

      case 'PATCH': {
        const id = query.id
        if (!id) return res.status(400).json({ error: 'Missing token id' })
        const { data, error } = await supabase
          .from('design_tokens')
          .update(body)
          .eq('id', id)
          .select()
          .single()
        if (error) throw error
        return res.status(200).json(data)
      }

      case 'DELETE': {
        const id = query.id
        if (!id) return res.status(400).json({ error: 'Missing token id' })
        const { error } = await supabase.from('design_tokens').delete().eq('id', id)
        if (error) throw error
        return res.status(204).end()
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE'])
        return res.status(405).json({ error: `Method ${method} not allowed` })
    }
  } catch (err) {
    console.error('/api/tokens error:', err)
    return res.status(500).json({ error: err.message })
  }
}
