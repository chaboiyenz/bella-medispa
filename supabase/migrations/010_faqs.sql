-- ============================================================
-- Bella MediSpa 2.0 — FAQ Engine (replaces faq_kb RAG approach)
-- Run AFTER 009_team.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS public.faqs (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  question    TEXT        NOT NULL,
  answer      TEXT        NOT NULL,
  category    TEXT,
  tags        TEXT[]      NOT NULL DEFAULT '{}',
  usage_count INT         NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_faqs_updated_at()
  RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS faqs_updated_at ON public.faqs;
CREATE TRIGGER faqs_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.set_faqs_updated_at();

-- ── Row-Level Security ────────────────────────────────────────────────────

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Public: chatbot reads all FAQs
DROP POLICY IF EXISTS "faqs: public read" ON public.faqs;
CREATE POLICY "faqs: public read"
  ON public.faqs FOR SELECT
  USING (TRUE);

-- Admin: full write access
DROP POLICY IF EXISTS "faqs: admin insert" ON public.faqs;
CREATE POLICY "faqs: admin insert"
  ON public.faqs FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "faqs: admin update" ON public.faqs;
CREATE POLICY "faqs: admin update"
  ON public.faqs FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "faqs: admin delete" ON public.faqs;
CREATE POLICY "faqs: admin delete"
  ON public.faqs FOR DELETE
  USING (public.is_admin());

-- ── RPC: atomic usage_count increment ────────────────────────────────────

CREATE OR REPLACE FUNCTION public.increment_faq_usage(faq_id UUID)
  RETURNS VOID LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE public.faqs SET usage_count = usage_count + 1 WHERE id = faq_id;
$$;
