-- ============================================================
-- Bella MediSpa 2.0 — Add is_active to faqs table
-- Run AFTER 010_faqs.sql
-- ============================================================

ALTER TABLE public.faqs
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
