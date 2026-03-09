-- ============================================================
-- Bella MediSpa 2.0 — Team Members
-- Dynamic, admin-managed roster stored in Supabase.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.team_members (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT        NOT NULL,
  role            TEXT        NOT NULL,          -- professional title
  credentials     TEXT,                          -- e.g. "NP-C", "MD"
  license_no      TEXT,                          -- e.g. "NP-123456 · NPI 1234567890"
  bio             TEXT,
  image_url       TEXT,
  specializations TEXT[]      NOT NULL DEFAULT '{}',
  display_order   INT         NOT NULL DEFAULT 0,
  is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_team_updated_at()
  RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS team_members_updated_at ON public.team_members;
CREATE TRIGGER team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.set_team_updated_at();

-- ── Row-Level Security ────────────────────────────────────────────────────

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Public: anyone can read active members (powers the public /team page)
DROP POLICY IF EXISTS "team_members: public read" ON public.team_members;
CREATE POLICY "team_members: public read"
  ON public.team_members FOR SELECT
  USING (is_active = TRUE);

-- Admin: full write access — reuses the is_admin() SECURITY DEFINER
-- helper created in migration 006_fix_rls_recursion.sql
DROP POLICY IF EXISTS "team_members: admin insert" ON public.team_members;
CREATE POLICY "team_members: admin insert"
  ON public.team_members FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "team_members: admin update" ON public.team_members;
CREATE POLICY "team_members: admin update"
  ON public.team_members FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "team_members: admin delete" ON public.team_members;
CREATE POLICY "team_members: admin delete"
  ON public.team_members FOR DELETE
  USING (public.is_admin());

-- ── Storage: team-photos bucket ──────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'team-photos',
  'team-photos',
  TRUE,
  5242880,                                      -- 5 MB
  ARRAY['image/png','image/jpeg','image/webp']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "team-photos: public read"   ON storage.objects;
DROP POLICY IF EXISTS "team-photos: admin upload"  ON storage.objects;
DROP POLICY IF EXISTS "team-photos: admin delete"  ON storage.objects;

CREATE POLICY "team-photos: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'team-photos');

CREATE POLICY "team-photos: admin upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'team-photos' AND public.is_admin());

CREATE POLICY "team-photos: admin delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'team-photos' AND public.is_admin());
