-- ============================================================
-- Bella MediSpa 2.0 — Block 6: FAQ Knowledge Base
-- Run AFTER 003_shop.sql
-- Re-runnable: safe to execute multiple times (idempotent)
-- pgvector is optional — the chat works without it (Phase 2 upgrade)
-- ============================================================

-- Enable pgvector if available (Supabase supports it natively)
-- CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS faq_kb (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic      TEXT NOT NULL,
  content    TEXT NOT NULL,
  -- embedding vector(1536),  -- Uncomment when adding pgvector RAG (Phase 2)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE faq_kb ENABLE ROW LEVEL SECURITY;

-- FAQ is publicly readable (powers the AI chat)
DROP POLICY IF EXISTS "faq: public read" ON faq_kb;
DROP POLICY IF EXISTS "faq: admin write" ON faq_kb;

CREATE POLICY "faq: public read" ON faq_kb FOR SELECT USING (TRUE);
CREATE POLICY "faq: admin write" ON faq_kb USING (is_admin());
