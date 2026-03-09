-- =============================================
-- Block 8: Supabase Storage — Product Images
-- Re-runnable (idempotent)
-- =============================================
-- Run this in the Supabase SQL Editor (requires pg_graphql / storage schema access).
-- Alternatively, create the bucket via Supabase Dashboard → Storage → New bucket.
-- =============================================

-- Create the product-images bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,                                    -- 5 MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public             = EXCLUDED.public,
  file_size_limit    = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ── Storage RLS Policies ──────────────────────────────────────

-- Anyone can read product images (public bucket)
DROP POLICY IF EXISTS "product-images: public read" ON storage.objects;
CREATE POLICY "product-images: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Only authenticated users can upload (admin check done at app layer)
DROP POLICY IF EXISTS "product-images: authenticated upload" ON storage.objects;
CREATE POLICY "product-images: authenticated upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images'
    AND auth.uid() IS NOT NULL
  );

-- Only uploader or admin can delete
DROP POLICY IF EXISTS "product-images: owner delete" ON storage.objects;
CREATE POLICY "product-images: owner delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-images'
    AND auth.uid() IS NOT NULL
  );
