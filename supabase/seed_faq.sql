-- ============================================================
-- Bella MediSpa 2.0 — FAQ Knowledge Base Seed
-- Run AFTER 004_faq.sql
-- ============================================================

INSERT INTO faq_kb (topic, content) VALUES
  ('booking', 'To book an appointment at Bella MediSpa, visit our website at bellamedispa.com/book, call us at +1 302-736-6334, or stop by at 435 S Dupont Hwy, Dover, DE 19901. We are open Monday–Saturday, 9 AM to 6 PM.'),
  ('cancellation', 'We require at least 24 hours notice to cancel or reschedule an appointment. Late cancellations or no-shows may incur a fee equal to 50% of the service price.'),
  ('halo_laser', 'HALO™ Laser Resurfacing is a hybrid fractional laser that targets pigmentation, scarring, fine lines, and uneven texture. Downtime is typically 3–5 days of redness and peeling. Results are visible after 2–4 weeks. We were the first in Delaware to offer this treatment. Price starts at $849.'),
  ('emsculpt', 'Emsculpt NEO® combines HIFEM+ electromagnetic energy with radiofrequency to simultaneously build muscle and burn fat. No downtime. Results are visible after 2–4 sessions. Each session is 30 minutes. Price starts at $750 per session.'),
  ('botox', 'BOTOX® treatments at Bella MediSpa are administered by our specialized Injectable Physician. Effects last 3–4 months. Avoid rubbing the area for 24 hours. Minimal downtime. Price starts at $350.'),
  ('hydrafacial', 'The Signature HydraFacial combines exfoliation, extraction, and hydration in a 60-minute treatment. There is zero downtime — skin looks immediately glowing. We recommend monthly treatments for best results. Price starts at $199.'),
  ('microneedling', 'Collagen Microneedling creates micro-channels in the skin to stimulate collagen production. Downtime is 24–48 hours of redness. Results improve over 4–6 weeks. A series of 3–6 treatments is recommended. Price starts at $299.'),
  ('coolsculpting', 'CoolSculpting® uses FDA-cleared cryolipolysis to permanently eliminate fat cells. Treatment areas include abdomen, flanks, thighs, and chin. Zero downtime. Full results visible in 2–3 months. Price starts at $650.'),
  ('bbl', 'BBL Forever Young BroadBand Light phototherapy reverses sun damage, reduces redness, and stimulates collagen. Minimal downtime (1–2 days of redness). Recommended 1–2 times per year. Price starts at $499.'),
  ('consultation', 'All new clients are encouraged to book a free 15-minute consultation to discuss their skin concerns and treatment goals. Our team — led by our Medical Director — will create a personalized treatment plan. Call +1 302-736-6334 to schedule.'),
  ('skincare_products', 'Bella MediSpa carries a curated selection of medical-grade skincare products including serums, sunscreens, and recovery kits. Shop online at bellamedispa.com/shop or visit us in person.'),
  ('payment', 'We accept all major credit cards, Apple Pay, and Google Pay. Payment plans are available. A deposit is required to secure your appointment booking.'),
  ('location', 'Bella MediSpa is located at 435 S Dupont Hwy, Dover, DE 19901. Free parking is available on-site. We are conveniently located near downtown Dover.'),
  ('team', 'Our team includes a Medical Director, a specialized Injectable Physician, and Licensed Medical Estheticians. Every treatment is performed or supervised by licensed medical professionals.'),
  ('pre_care', 'Before laser treatments, avoid sun exposure and self-tanner for 2 weeks. Before injectables, avoid blood thinners (aspirin, ibuprofen, alcohol) for 5 days. Arrive with clean skin — no makeup.'),
  ('post_care', 'After laser treatments, use SPF 50+ daily and avoid direct sun for 2 weeks. After injectables, avoid strenuous exercise and alcohol for 24 hours. Keep the treated area clean and moisturized.')
ON CONFLICT DO NOTHING;
