import { supabase, supabaseAdmin } from '../src/lib/supabase.js'

/**
 * GET /api/assets?project_id=xxx
 * POST /api/assets  { project_id, name, category } — returns signed upload URL
 * DELETE /api/assets?id=xxx
 */
export default async function handler(req, res) {
  const { method, query, body } = req

  try {
    switch (method) {
      case 'GET': {
        const { project_id, category } = query
        let q = supabase.from('brand_assets').select('*')
        if (project_id) q = q.eq('project_id', project_id)
        if (category) q = q.eq('category', category)
        q = q.order('created_at', { ascending: false })
        const { data, error } = await q
        if (error) throw error

        // Generate public URLs for each asset
        const assetsWithUrls = await Promise.all(
          (data || []).map(async (asset) => {
            const { data: urlData } = supabase.storage
              .from('brand-assets')
              .getPublicUrl(asset.storage_path)
            return { ...asset, public_url: urlData?.publicUrl || null }
          })
        )
        return res.status(200).json(assetsWithUrls)
      }

      case 'POST': {
        const { project_id, name, category } = body
        if (!project_id || !name || !category) {
          return res.status(400).json({ error: 'Missing required fields' })
        }
        const storagePath = `${project_id}/${Date.now()}_${name.replace(/[^a-zA-Z0-9._-]/g, '_')}`

        const { data, error } = await supabase
          .from('brand_assets')
          .insert({ project_id, name, category, storage_path: storagePath })
          .select()
          .single()
        if (error) throw error

        // Generate signed upload URL
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('brand-assets')
          .createSignedUploadUrl(storagePath)
        if (uploadError) throw uploadError

        return res.status(201).json({
          ...data,
          upload_url: uploadData?.signedUrl || null
        })
      }

      case 'DELETE': {
        if (!query.id) return res.status(400).json({ error: 'Missing asset id' })
        const { data: asset, error: fetchError } = await supabase
          .from('brand_assets')
          .select('storage_path')
          .eq('id', query.id)
          .single()
        if (fetchError) throw fetchError

        // Remove from storage
        if (asset?.storage_path) {
          await supabaseAdmin.storage.from('brand-assets').remove([asset.storage_path])
        }

        const { error } = await supabase.from('brand_assets').delete().eq('id', query.id)
        if (error) throw error
        return res.status(204).end()
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
        return res.status(405).json({ error: `Method ${method} not allowed` })
    }
  } catch (err) {
    console.error('/api/assets error:', err)
    return res.status(500).json({ error: err.message })
  }
}
