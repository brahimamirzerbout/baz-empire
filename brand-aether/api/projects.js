import { supabase } from '../src/lib/supabase.js'

/**
 * GET /api/projects
 * POST /api/projects  { name, description, seed_hue, seed_sat, seed_lum }
 * GET /api/projects?id=xxx  (single project with tokens)
 * PATCH /api/projects?id=xxx
 * DELETE /api/projects?id=xxx
 */
export default async function handler(req, res) {
  const { method, query, body } = req

  try {
    switch (method) {
      case 'GET': {
        if (query.id) {
          const { data, error } = await supabase
            .from('projects')
            .select('*, design_tokens(*)')
            .eq('id', query.id)
            .single()
          if (error) throw error
          return res.status(200).json(data)
        }
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })
        if (error) throw error
        return res.status(200).json(data)
      }

      case 'POST': {
        const { name, description, seed_hue, seed_sat, seed_lum } = body
        if (!name) return res.status(400).json({ error: 'Missing required field: name' })
        const { data, error } = await supabase
          .from('projects')
          .insert({
            name,
            description: description || '',
            seed_hue: seed_hue || 41,
            seed_sat: seed_sat || 72,
            seed_lum: seed_lum || 50
          })
          .select()
          .single()
        if (error) throw error
        return res.status(201).json(data)
      }

      case 'PATCH': {
        if (!query.id) return res.status(400).json({ error: 'Missing project id' })
        const { data, error } = await supabase
          .from('projects')
          .update(body)
          .eq('id', query.id)
          .select()
          .single()
        if (error) throw error
        return res.status(200).json(data)
      }

      case 'DELETE': {
        if (!query.id) return res.status(400).json({ error: 'Missing project id' })
        const { error } = await supabase.from('projects').delete().eq('id', query.id)
        if (error) throw error
        return res.status(204).end()
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE'])
        return res.status(405).json({ error: `Method ${method} not allowed` })
    }
  } catch (err) {
    console.error('/api/projects error:', err)
    return res.status(500).json({ error: err.message })
  }
}
