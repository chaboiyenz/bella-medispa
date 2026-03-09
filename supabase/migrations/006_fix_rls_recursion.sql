-- ============================================================
-- Bella MediSpa 2.0 — Fix: Infinite RLS Recursion on profiles
-- Re-runnable: safe to execute multiple times (idempotent)
-- ============================================================
--
-- Context
-- -------
-- This migration is a LEGACY PATCH for databases initialised with the
-- original 001–005 migrations before is_admin() existed.
--
-- If you are running a fresh setup, 001_schema.sql already defines
-- is_admin() and all policies already use it — this file is a no-op.
--
-- Root cause (original)
-- ---------------------
-- Every admin-check policy used an inline sub-SELECT on profiles:
--
--   EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
--
-- But profiles itself had a policy ("profiles: admin reads all") that ran
-- the same sub-SELECT, causing Postgres to evaluate profiles RLS while
-- already evaluating profiles RLS → infinite recursion:
--
--   ERROR: infinite recursion detected in policy for relation "profiles"
--
-- Fix
-- ---
-- CREATE OR REPLACE ensures is_admin() is up-to-date even if 001 already
-- defined it.  DROP POLICY IF EXISTS + CREATE POLICY ensures the latest
-- policy body is always applied regardless of prior migration state.
-- ============================================================

-- ── 1. Security-definer helper ────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.is_admin()
  RETURNS BOOLEAN
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ── 2. profiles — drop & recreate broken policy ───────────────────────────

DROP POLICY IF EXISTS "profiles: admin reads all" ON profiles;

CREATE POLICY "profiles: admin reads all"
  ON profiles FOR SELECT
  USING (is_admin());

-- ── 3. services ───────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "services: admin insert" ON services;
DROP POLICY IF EXISTS "services: admin update" ON services;

CREATE POLICY "services: admin insert"
  ON services FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "services: admin update"
  ON services FOR UPDATE
  USING (is_admin());

-- ── 4. bookings ───────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "bookings: admin manages all" ON bookings;

CREATE POLICY "bookings: admin manages all"
  ON bookings
  USING (is_admin());

-- ── 5. products ───────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "products: admin manage" ON products;

CREATE POLICY "products: admin manage"
  ON products
  USING (is_admin());

-- ── 6. orders ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "orders: admin manages" ON orders;

CREATE POLICY "orders: admin manages"
  ON orders
  USING (is_admin());

-- ── 7. order_items ────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "order_items: admin" ON order_items;

CREATE POLICY "order_items: admin"
  ON order_items
  USING (is_admin());

-- ── 8. faq_kb (created by 004_faq.sql — skip if not yet migrated) ─────────

DO $faq$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'faq_kb'
  ) THEN
    DROP POLICY IF EXISTS "faq: admin write" ON faq_kb;

    CREATE POLICY "faq: admin write"
      ON faq_kb
      USING (is_admin());
  END IF;
END
$faq$;

-- ── 9. treatment_details (created by 005_treatments.sql — skip if not yet migrated) ──

DO $td$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'treatment_details'
  ) THEN
    DROP POLICY IF EXISTS "Admins can manage treatments" ON treatment_details;

    CREATE POLICY "Admins can manage treatments"
      ON treatment_details
      USING (is_admin());
  END IF;
END
$td$;
