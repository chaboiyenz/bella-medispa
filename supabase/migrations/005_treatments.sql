-- =============================================
-- Block 7: Treatment Detail Pages
-- =============================================

CREATE TABLE IF NOT EXISTS treatment_details (
  id                  UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                TEXT          UNIQUE NOT NULL,
  name                TEXT          NOT NULL,
  category            TEXT          NOT NULL DEFAULT 'Aesthetics',
  breadcrumb          TEXT[]        NOT NULL DEFAULT ARRAY['Treatments', 'Aesthetics'],
  overview            TEXT          NOT NULL,
  image_url           TEXT,
  causes              JSONB         NOT NULL DEFAULT '[]'::jsonb,
  warning_signs       JSONB         NOT NULL DEFAULT '[]'::jsonb,
  treatments          JSONB         NOT NULL DEFAULT '[]'::jsonb,
  warning_box         TEXT,
  clinical_resources  JSONB         NOT NULL DEFAULT '[]'::jsonb,
  meta_description    TEXT,
  is_active           BOOLEAN       NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS treatment_details_slug_idx ON treatment_details (slug);
CREATE INDEX IF NOT EXISTS treatment_details_category_idx ON treatment_details (category);
CREATE INDEX IF NOT EXISTS treatment_details_active_idx ON treatment_details (is_active);

-- RLS
ALTER TABLE treatment_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active treatments"
  ON treatment_details FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage treatments"
  ON treatment_details
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );
