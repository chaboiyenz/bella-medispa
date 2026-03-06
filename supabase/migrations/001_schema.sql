-- ============================================================
-- Bella MediSpa 2.0 — Block 2: Core Schema
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Required extension for GIST exclusion constraint
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- ── Enums ────────────────────────────────────────────────────
CREATE TYPE user_role      AS ENUM ('admin', 'client');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE order_status   AS ENUM ('pending', 'paid', 'shipped', 'delivered', 'cancelled');

-- ── Profiles (mirrors auth.users) ───────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role       user_role NOT NULL DEFAULT 'client',
  full_name  TEXT,
  email      TEXT,
  phone      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Services ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  duration    INTEGER NOT NULL CHECK (duration > 0), -- minutes
  image_url   TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  category    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Bookings ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id        UUID NOT NULL REFERENCES services(id),
  client_id         UUID NOT NULL REFERENCES profiles(id),
  slot_start        TIMESTAMPTZ NOT NULL,
  slot_end          TIMESTAMPTZ NOT NULL,
  status            booking_status NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Anti double-booking: no two active bookings can share overlapping time ranges
  CONSTRAINT bookings_no_overlap EXCLUDE USING GIST (
    tstzrange(slot_start, slot_end, '[)') WITH &&
  ) WHERE (status <> 'cancelled')
);

-- ── Auto-create profile on signup ────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Row Level Security ───────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services  ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings  ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "profiles: user reads own"   ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles: user updates own" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles: admin reads all"  ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- Services — public read, admin write
CREATE POLICY "services: public read active" ON services FOR SELECT USING (is_active = TRUE);
CREATE POLICY "services: admin insert"       ON services FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);
CREATE POLICY "services: admin update"       ON services FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- Bookings
CREATE POLICY "bookings: client reads own"    ON bookings FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "bookings: client creates own"  ON bookings FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "bookings: admin manages all"   ON bookings USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);
