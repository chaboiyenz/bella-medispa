-- ============================================================
-- Bella MediSpa 2.0 — Seed Data
-- Run AFTER migrations. Safe to re-run (uses ON CONFLICT DO NOTHING).
-- ============================================================

INSERT INTO services (name, description, price, duration, category, is_active) VALUES
  (
    'Signature HydraFacial',
    'A deeply cleansing, hydrating treatment combining exfoliation, extraction, and infusion of nourishing serums for radiant, dewy skin.',
    199, 60, 'body', TRUE
  ),
  (
    'Collagen Microneedling',
    'Precision micro-channels stimulate your skin''s natural collagen production, smoothing fine lines and improving overall texture.',
    299, 75, 'aesthetics', TRUE
  ),
  (
    'HALO™ Laser Resurfacing',
    'Delaware''s first hybrid fractional laser targets pigmentation, scarring, and uneven tone for visibly clearer, smoother skin.',
    849, 90, 'laser', TRUE
  ),
  (
    'Emsculpt NEO®',
    'Revolutionary body sculpting combining HIFEM+ and radiofrequency to simultaneously build muscle and burn fat — no surgery required.',
    750, 30, 'body', TRUE
  ),
  (
    'BOTOX® Treatment',
    'Precision neurotoxin injections to smooth dynamic wrinkles and prevent new lines from forming. Natural-looking results every time.',
    350, 45, 'injectables', TRUE
  ),
  (
    'BBL Forever Young',
    'BroadBand Light phototherapy to reverse sun damage and stimulate collagen for a youthful, even-toned complexion.',
    499, 60, 'laser', TRUE
  ),
  (
    'Diamond Glow',
    'Advanced 3-in-1 facial: diamond tip exfoliation, extraction, and simultaneous pro-grade serum infusion for instant radiance.',
    229, 60, 'aesthetics', TRUE
  ),
  (
    'CoolSculpting®',
    'FDA-cleared cryolipolysis permanently eliminates stubborn fat cells through targeted cooling — zero downtime.',
    650, 60, 'body', TRUE
  ),
  (
    'Sculptra® Collagen Stimulator',
    'Poly-L-lactic acid injections that gradually restore facial volume and stimulate the body''s own collagen over 3–6 months.',
    699, 60, 'injectables', TRUE
  ),
  (
    'SkinPen Microneedling',
    'FDA-cleared microneedling device for reducing acne scars, stretch marks, and fine lines with minimal downtime.',
    349, 60, 'aesthetics', TRUE
  )
ON CONFLICT DO NOTHING;
