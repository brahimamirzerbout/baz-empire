-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- ÆTHER — Design Tokens, Projects & Brand Assets
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS public.projects (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    description TEXT DEFAULT '',
    seed_hue    INTEGER DEFAULT 41 NOT NULL,
    seed_sat    INTEGER DEFAULT 72 NOT NULL,
    seed_lum    INTEGER DEFAULT 50 NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
  );
END $$;

DO $$ BEGIN
  ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS seed_hue INTEGER DEFAULT 41 NOT NULL;
  ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS seed_sat INTEGER DEFAULT 72 NOT NULL;
  ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS seed_lum INTEGER DEFAULT 50 NOT NULL;
  ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users CRUD own projects" ON public.projects;
  CREATE POLICY "Users CRUD own projects"
    ON public.projects FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
END $$;

-- Design Tokens
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS public.design_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id  UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    category    TEXT NOT NULL CHECK (category IN ('color','spacing','typography','shadow','radius','easing','duration')),
    value       TEXT NOT NULL,
    css_var     TEXT DEFAULT '',
    sort_order  INTEGER DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
  );
END $$;

DO $$ BEGIN
  ALTER TABLE public.design_tokens ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users CRUD own tokens" ON public.design_tokens;
  CREATE POLICY "Users CRUD own tokens"
    ON public.design_tokens FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
END $$;

-- Brand Assets
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS public.brand_assets (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id   UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name         TEXT NOT NULL,
    category     TEXT NOT NULL CHECK (category IN ('logo','icon','font','image','document','other')),
    storage_path TEXT NOT NULL,
    file_size    INTEGER DEFAULT 0,
    mime_type    TEXT DEFAULT 'application/octet-stream',
    created_at   TIMESTAMPTZ DEFAULT now(),
    updated_at   TIMESTAMPTZ DEFAULT now()
  );
END $$;

DO $$ BEGIN
  ALTER TABLE public.brand_assets ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users CRUD own assets" ON public.brand_assets;
  CREATE POLICY "Users CRUD own assets"
    ON public.brand_assets FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
END $$;

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('brand-assets', 'brand-assets', true)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can view brand assets" ON storage.objects;
  CREATE POLICY "Anyone can view brand assets"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'brand-assets');
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Authenticated users can upload brand assets" ON storage.objects;
  CREATE POLICY "Authenticated users can upload brand assets"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'brand-assets' AND auth.role() = 'authenticated');
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Owners can update brand assets" ON storage.objects;
  CREATE POLICY "Owners can update brand assets"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'brand-assets' AND auth.uid() = owner);
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Owners can delete brand assets" ON storage.objects;
  CREATE POLICY "Owners can delete brand assets"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'brand-assets' AND auth.uid() = owner);
EXCEPTION WHEN others THEN NULL;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tokens_project ON public.design_tokens(project_id);
CREATE INDEX IF NOT EXISTS idx_tokens_category ON public.design_tokens(category);
CREATE INDEX IF NOT EXISTS idx_assets_project ON public.brand_assets(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_user ON public.projects(user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  DROP TRIGGER IF EXISTS trg_projects_updated_at ON public.projects;
  CREATE TRIGGER trg_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
END $$;

DO $$ BEGIN
  DROP TRIGGER IF EXISTS trg_tokens_updated_at ON public.design_tokens;
  CREATE TRIGGER trg_tokens_updated_at
    BEFORE UPDATE ON public.design_tokens
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
END $$;

DO $$ BEGIN
  DROP TRIGGER IF EXISTS trg_assets_updated_at ON public.brand_assets;
  CREATE TRIGGER trg_assets_updated_at
    BEFORE UPDATE ON public.brand_assets
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
END $$;
