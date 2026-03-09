-- ============================================================
-- Bella MediSpa 2.0 — FAQ Seed Data
-- Run AFTER migration 010_faqs.sql
-- ============================================================

INSERT INTO public.faqs (question, answer, category, tags) VALUES

-- ── Pricing ──────────────────────────────────────────────────────────────
('How much does HALO Laser cost?',
 'HALO Laser Resurfacing starts at $1,200 per session at Bella MediSpa. Package pricing and financing options are available. We recommend a complimentary consultation to build a personalized treatment plan.',
 'Pricing', ARRAY['halo', 'laser', 'cost', 'price', 'pricing']),

('What does Botox cost?',
 'Botox at Bella MediSpa is priced per unit, typically ranging from $12–$15/unit. Most treatment areas require 20–50 units. A free consultation is included so you know the exact price before committing.',
 'Pricing', ARRAY['botox', 'cost', 'price', 'units', 'pricing']),

('How much is a HydraFacial?',
 'Our Signature HydraFacial starts at $199. Upgrade add-ons (lymphatic drainage, LED therapy, growth factors) are available. Monthly membership pricing is also offered for regular clients.',
 'Pricing', ARRAY['hydrafacial', 'cost', 'price', 'facial', 'pricing']),

('What does microneedling cost?',
 'Collagen Microneedling starts at $299 per session. Packages of 3 or 6 sessions are available at a discount. Adding PRP (Platelet-Rich Plasma) is an additional charge discussed at consultation.',
 'Pricing', ARRAY['microneedling', 'cost', 'price', 'collagen', 'pricing']),

('How much does EMSELLA cost?',
 'EMSELLA® pelvic floor treatment starts at $350 per session; the recommended protocol is 6 sessions. Package bundles are available. Contact us for current promotional pricing.',
 'Pricing', ARRAY['emsella', 'cost', 'price', 'pelvic', 'pricing']),

('How much does Emsculpt NEO cost?',
 'Emsculpt NEO® starts at $750 per session. The recommended course is 4 sessions spaced 5–10 days apart. Multi-area packages offer significant savings.',
 'Pricing', ARRAY['emsculpt', 'neo', 'cost', 'price', 'body', 'pricing']),

('Do you offer financing or payment plans?',
 'Yes! Bella MediSpa partners with CareCredit and Cherry for 0% interest financing options. You can apply in-office or online before your appointment.',
 'Pricing', ARRAY['financing', 'payment', 'plan', 'carecredit', 'cherry', 'cost']),

-- ── Treatments ───────────────────────────────────────────────────────────
('What is HALO Laser Resurfacing?',
 'HALO™ is a hybrid fractional laser that treats both superficial and deeper skin layers simultaneously. It corrects sun damage, fine lines, enlarged pores, and uneven texture with significantly less downtime than traditional ablative lasers. Bella MediSpa is Delaware''s pioneer in HALO.',
 'Treatments', ARRAY['halo', 'laser', 'resurfacing', 'skin', 'treatment']),

('What is Botox and how does it work?',
 'Botox (botulinum toxin) temporarily relaxes targeted facial muscles to smooth dynamic wrinkles — crow''s feet, forehead lines, and the "11s" between the brows. Results appear within 5–14 days and last 3–4 months.',
 'Treatments', ARRAY['botox', 'filler', 'wrinkles', 'neurotoxin', 'treatment']),

('What is EMSELLA and who is it for?',
 'EMSELLA® is an FDA-cleared, non-invasive chair treatment that uses HIFEM energy to stimulate 11,000+ pelvic floor contractions per session. It is ideal for women experiencing urinary incontinence, pelvic floor weakness, or post-partum recovery.',
 'Treatments', ARRAY['emsella', 'pelvic', 'floor', 'incontinence', 'treatment']),

('What is Emsculpt NEO?',
 'Emsculpt NEO® combines HIFEM+ muscle stimulation with radiofrequency fat reduction in one 30-minute session. It builds muscle and reduces fat simultaneously with no needles, surgery, or downtime.',
 'Treatments', ARRAY['emsculpt', 'neo', 'muscle', 'fat', 'body', 'treatment']),

('What fillers do you offer?',
 'Bella MediSpa offers Juvederm® and Restylane® dermal filler collections for lips, cheeks, nasolabial folds, and under-eye hollows. All filler treatments are performed by our board-certified injectors.',
 'Treatments', ARRAY['filler', 'juvederm', 'restylane', 'lips', 'cheeks', 'treatment']),

('What is a HydraFacial?',
 'HydraFacial is a patented 3-step treatment: cleanse + peel, extract + hydrate, and fuse + protect. It uses a vortex suction device to deeply clean pores and infuse customized serums. Safe for all skin types with zero downtime.',
 'Treatments', ARRAY['hydrafacial', 'facial', 'cleanse', 'hydrate', 'skin', 'treatment']),

('Do you treat hyperpigmentation or dark spots?',
 'Yes. We offer several solutions including HALO Laser, chemical peels, and medical-grade brightening facials. The best option depends on your skin type and the depth of pigmentation, which our clinicians assess at a free consultation.',
 'Treatments', ARRAY['hyperpigmentation', 'dark spots', 'pigmentation', 'skin', 'treatment']),

('What anti-aging treatments do you offer?',
 'Our anti-aging menu includes Botox, dermal fillers, HALO Laser, microneedling with PRP, chemical peels, and Morpheus8 RF microneedling. We build customized treatment plans at your complimentary consultation.',
 'Treatments', ARRAY['anti-aging', 'botox', 'filler', 'laser', 'microneedling', 'treatment']),

-- ── Booking ──────────────────────────────────────────────────────────────
('How do I book an appointment?',
 'Book online 24/7 at bellamedispa.com/book, call us at +1 302-736-6334, or message us on Instagram @bella_medispa_. First-time clients always receive a complimentary consultation.',
 'Booking', ARRAY['book', 'appointment', 'schedule', 'consultation']),

('Do you offer free consultations?',
 'Absolutely. Every new client receives a complimentary 20-minute consultation with one of our providers. We review your goals, skin history, and design a personalized treatment plan — no obligation.',
 'Booking', ARRAY['consultation', 'free', 'book', 'appointment']),

('What are your hours?',
 'Bella MediSpa is open Monday–Friday 9am–6pm and Saturday 9am–4pm. Extended evening appointments are available on select days — book online to see real-time availability.',
 'Booking', ARRAY['hours', 'open', 'schedule', 'days', 'time']),

('Where are you located?',
 'We are located at 435 S Dupont Hwy, Dover, DE 19901. Ample free parking is available on site. We serve clients from Dover, Newark, Wilmington, and all of Delaware.',
 'Booking', ARRAY['location', 'address', 'dover', 'delaware', 'directions']),

('Can I cancel or reschedule my appointment?',
 'Yes. We ask for at least 24 hours notice for cancellations or rescheduling. You can manage your appointment online or call +1 302-736-6334. Late cancellations under 24 hours may incur a $50 fee.',
 'Booking', ARRAY['cancel', 'reschedule', 'appointment', 'policy']),

-- ── Recovery & Downtime ───────────────────────────────────────────────────
('What is the downtime for HALO Laser?',
 'HALO downtime is typically 3–7 days. Expect redness, swelling (day 1–2), and bronzing/peeling (day 3–6) known as "MENDS" (microscopic epidermal necrotic debris). Most clients return to work in 5–7 days with makeup.',
 'Recovery', ARRAY['halo', 'laser', 'downtime', 'recovery', 'healing']),

('How long does Botox last?',
 'Botox results typically last 3–4 months for most clients. Regular treatments can extend duration over time as the muscles learn to relax. We recommend scheduling your next appointment before you fully fade.',
 'Recovery', ARRAY['botox', 'last', 'duration', 'results', 'how long']),

('Is there downtime after microneedling?',
 'Expect 24–48 hours of redness and mild sensitivity after microneedling — similar to a moderate sunburn. Pinpoint bleeding is normal. Most clients return to work the next day. Avoid sun exposure and active skincare for 48 hours.',
 'Recovery', ARRAY['microneedling', 'downtime', 'recovery', 'redness', 'healing']),

('How quickly will I see results from Botox?',
 'Botox takes 5–14 days for full results to appear. You may notice initial relaxation within 3–5 days. At your follow-up (2 weeks), we assess and touch up if needed at no charge.',
 'Recovery', ARRAY['botox', 'results', 'time', 'when', 'see']),

-- ── Safety ───────────────────────────────────────────────────────────────
('Are your injectors board-certified?',
 'Yes. All injectable treatments at Bella MediSpa are performed by or under the direct supervision of our Medical Director (MD) and licensed Nurse Practitioner Injectors. We never delegate injections to non-licensed staff.',
 'Safety', ARRAY['certified', 'doctor', 'nurse', 'injector', 'safe', 'credentials']),

('Is Botox safe?',
 'Botox has a decades-long safety record and is one of the most studied medical aesthetic treatments. Side effects are rare and usually mild (slight bruising, temporary asymmetry). Serious complications are extremely uncommon when administered by a trained provider.',
 'Safety', ARRAY['botox', 'safe', 'safety', 'side effects', 'risks']),

('Who should not get laser treatments?',
 'Laser treatments are generally not recommended during pregnancy, while on certain photosensitizing medications (e.g., Accutane), or for active skin infections. A full medical history review at your consultation ensures you are a safe candidate.',
 'Safety', ARRAY['laser', 'contraindications', 'safe', 'pregnant', 'medications']),

('What is your medical director''s background?',
 'Bella MediSpa''s Medical Director is a licensed MD specializing in aesthetic medicine. She oversees all clinical protocols, reviews every new patient, and is on-site for all advanced treatments.',
 'Safety', ARRAY['medical director', 'doctor', 'background', 'credentials', 'md'])

ON CONFLICT DO NOTHING;
