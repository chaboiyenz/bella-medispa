-- ============================================================
-- Bella MediSpa 2.0 — Block 4: Products & Orders Schema
-- Run AFTER 002_functions.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS products (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  description     TEXT,
  price           NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  stripe_price_id TEXT,
  image_url       TEXT,
  stock           INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  category        TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id),
  total_amount  NUMERIC(10,2) NOT NULL,
  stripe_id     TEXT,
  status        order_status NOT NULL DEFAULT 'pending',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Join table: which products are in each order
CREATE TABLE IF NOT EXISTS order_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity   INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL
);

-- ── RLS ──────────────────────────────────────────────────────
ALTER TABLE products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products — public read, admin write
CREATE POLICY "products: public read active"  ON products FOR SELECT USING (is_active = TRUE);
CREATE POLICY "products: admin manage"        ON products USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- Orders — clients read own, admin read all
CREATE POLICY "orders: client reads own"  ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders: client creates"    ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders: admin manages"     ON orders USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

CREATE POLICY "order_items: via order"  ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);
CREATE POLICY "order_items: admin"      ON order_items USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);
