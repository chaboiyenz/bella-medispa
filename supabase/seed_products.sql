-- ============================================================
-- Bella MediSpa 2.0 — Product Seed Data
-- Run AFTER 003_shop.sql
-- Re-runnable: ON CONFLICT (id) DO UPDATE SET keeps rows fresh.
-- ============================================================

INSERT INTO products (id, name, description, price, stock, category, is_active) VALUES
  (
    '20000000-0000-0000-0000-000000000001',
    'Bella Signature Serum',
    'Our proprietary blend of hyaluronic acid, peptides, and vitamin C for all-day hydration and radiance. Medical-grade formula.',
    89, 50, 'skincare', TRUE
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    'Post-Treatment Recovery Kit',
    'Everything you need for optimal recovery: gentle cleanser, barrier cream, SPF 50, and healing serum — curated by our estheticians.',
    149, 30, 'kits', TRUE
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    'Medical-Grade SPF 50+',
    'Broad-spectrum mineral sunscreen with tinted finish. Non-comedogenic, reef-safe, and essential after any laser or injectable treatment.',
    55, 75, 'skincare', TRUE
  ),
  (
    '20000000-0000-0000-0000-000000000004',
    'Diamond Glow Infusion Serum',
    'The same professional serum used in our Diamond Glow facials. Packed with growth factors and antioxidants for at-home maintenance.',
    129, 40, 'skincare', TRUE
  ),
  (
    '20000000-0000-0000-0000-000000000005',
    'HydraFacial Recovery Mask',
    'Calming sheet mask infused with ceramides and niacinamide. Use immediately post-treatment for accelerated healing and reduced redness.',
    38, 100, 'masks', TRUE
  ),
  (
    '20000000-0000-0000-0000-000000000006',
    'Vitamin C Brightening Cream',
    '20% L-ascorbic acid with ferulic acid for maximum stability. Fades dark spots and boosts collagen for a visibly brighter complexion.',
    75, 60, 'skincare', TRUE
  ),
  (
    '20000000-0000-0000-0000-000000000007',
    'Retinol Night Renewal Serum',
    'Encapsulated 0.5% retinol for nightly skin renewal without irritation. Pairs perfectly with our HALO™ Laser aftercare protocol.',
    95, 45, 'skincare', TRUE
  ),
  (
    '20000000-0000-0000-0000-000000000008',
    'LATISSE® Eyelash Serum',
    'FDA-approved bimatoprost solution for fuller, longer, darker lashes. Prescription-strength, dispensed by our medical team.',
    180, 25, 'prescriptions', TRUE
  )
ON CONFLICT (id) DO UPDATE SET
  name        = EXCLUDED.name,
  description = EXCLUDED.description,
  price       = EXCLUDED.price,
  stock       = EXCLUDED.stock,
  category    = EXCLUDED.category,
  is_active   = EXCLUDED.is_active;
