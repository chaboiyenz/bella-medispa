-- =============================================
-- Treatment Detail Pages — Seed Data
-- Run AFTER 005_treatments.sql
-- Re-runnable: ON CONFLICT (slug) DO UPDATE SET keeps rows fresh.
-- =============================================

INSERT INTO treatment_details (
  slug, name, category, breadcrumb,
  overview, image_url,
  causes, warning_signs, treatments,
  warning_box, clinical_resources, meta_description
) VALUES (
  'age-spots',
  'Age Spots',
  'Aesthetics',
  ARRAY['Treatments', 'Aesthetics'],

  'Age spots — also known as liver spots or solar lentigines — are flat, tan, brown, or black areas of pigmentation that develop on sun-exposed skin. Ranging from freckle-sized to approximately a centimeter in diameter, they typically appear on the face, hands, shoulders, and forearms of adults over 50, though younger individuals with significant cumulative sun exposure are by no means immune. The condition results from an overproduction of melanin, the skin''s natural pigment, triggered by years of ultraviolet radiation. While completely benign in the vast majority of cases, age spots can significantly impact confidence and are among the most common pigmentation concerns addressed at Bella MediSpa.',

  null,

  '[
    {
      "icon": "Sun",
      "label": "UV Radiation",
      "description": "Prolonged or cumulative exposure to ultraviolet light accelerates melanin production, concentrating pigment in specific zones over time."
    },
    {
      "icon": "Clock",
      "label": "Natural Aging",
      "description": "Decades of UV accumulation gradually reduce the skin''s ability to disperse melanin evenly, resulting in visible clustering and spot formation."
    },
    {
      "icon": "Zap",
      "label": "Tanning Beds",
      "description": "Artificial UV sources — particularly UVA rays — are highly effective at triggering excess melanin deposits even with short, repeated exposure."
    },
    {
      "icon": "Dna",
      "label": "Genetic Predisposition",
      "description": "Fair-skinned individuals with lower baseline melanin are significantly more susceptible to uneven pigmentation after sun exposure."
    },
    {
      "icon": "Activity",
      "label": "Hormonal Shifts",
      "description": "Fluctuations in estrogen and progesterone — from pregnancy, menopause, or contraceptives — can amplify existing UV-induced pigmentation."
    }
  ]'::jsonb,

  '[
    {
      "icon": "AlertTriangle",
      "label": "Irregular or Notched Borders",
      "description": "Ragged, blurred, or uneven edges that deviate from the smooth, well-defined outline typical of a benign age spot."
    },
    {
      "icon": "Palette",
      "label": "Multiple Colors Within One Spot",
      "description": "Shades of tan, brown, black, red, white, or blue coexisting within a single lesion are a clinical red flag requiring evaluation."
    },
    {
      "icon": "TrendingUp",
      "label": "Rapid Increase in Size",
      "description": "Any pigmented spot that grows noticeably over weeks or months warrants immediate assessment by a board-certified clinician."
    },
    {
      "icon": "Droplets",
      "label": "Bleeding, Crusting, or Tenderness",
      "description": "Spots that itch persistently, bleed spontaneously, develop a rough crust, or become tender to the touch are not typical age spots."
    },
    {
      "icon": "Eye",
      "label": "Spots on Non-Sun-Exposed Areas",
      "description": "New pigmentation appearing on areas with minimal sun exposure — such as the inner arm or torso — may indicate systemic or vascular causes."
    }
  ]'::jsonb,

  '[
    {
      "name": "BBL™ BroadBand Light Therapy",
      "slug": "bbl-broadband-light",
      "description": "Intense pulsed light selectively targets melanin deposits, fragmenting pigment clusters without damaging surrounding tissue. Most patients see visible clearing in 1–3 sessions with minimal downtime."
    },
    {
      "name": "HALO™ Hybrid Fractional Laser",
      "slug": "halo-laser",
      "description": "Combines ablative and non-ablative wavelengths in a single pass to resurface pigmented skin and stimulate new collagen simultaneously — the gold standard for comprehensive tone correction."
    },
    {
      "name": "Cryotherapy",
      "slug": null,
      "description": "Precision application of liquid nitrogen freezes melanocytes within individual spots, causing the pigmented tissue to shed naturally within 7–14 days. Ideal for isolated, well-defined lesions."
    },
    {
      "name": "Diamond Glow™ Facial",
      "slug": "diamond-glow",
      "description": "A three-in-one resurfacing treatment combining diamond-tip exfoliation, suction extraction, and simultaneous serum infusion to brighten and even overall skin tone."
    },
    {
      "name": "Medical-Grade Chemical Peels",
      "slug": null,
      "description": "Controlled exfoliation using glycolic, salicylic, lactic, or TCA acids accelerates cellular turnover and systematically fades superficial to moderate pigmentation over a treatment series."
    },
    {
      "name": "Prescription Lightening Therapy",
      "slug": null,
      "description": "Clinician-formulated topicals — including hydroquinone, tretinoin, azelaic acid, and kojic acid — reduce melanin synthesis at the cellular level as a standalone or adjunct protocol."
    }
  ]'::jsonb,

  'While the vast majority of age spots are entirely benign, any lesion displaying asymmetry, uneven coloration, irregular borders, rapid growth, bleeding, or crusting must be evaluated by a board-certified physician. A skin biopsy may be recommended to definitively rule out melanoma or other malignant conditions. Early detection remains the single most critical factor in skin cancer outcomes. Do not attempt to self-diagnose or self-treat suspicious spots. Schedule a clinical evaluation with our Medical Director today.',

  '[
    {
      "title": "AAD: Age Spots — Causes, Symptoms & Treatment",
      "url": "https://www.aad.org/public/diseases/color-problems/age-spots"
    },
    {
      "title": "Mayo Clinic: Solar Lentigines (Liver Spots)",
      "url": "https://www.mayoclinic.org/diseases-conditions/age-spots/symptoms-causes/syc-20355859"
    },
    {
      "title": "NIH MedlinePlus: Liver Spots",
      "url": "https://medlineplus.gov/ency/article/001141.htm"
    },
    {
      "title": "Skin Cancer Foundation: Melanoma Warning Signs (ABCDE Rule)",
      "url": "https://www.skincancer.org/skin-cancer-information/melanoma/"
    }
  ]'::jsonb,

  'Expert age spot treatments in Dover, DE at Bella MediSpa — including BBL laser, HALO fractional resurfacing, cryotherapy, and medical-grade peels. Book a clinical consultation today.'

) ON CONFLICT (slug) DO UPDATE SET
  name               = EXCLUDED.name,
  category           = EXCLUDED.category,
  breadcrumb         = EXCLUDED.breadcrumb,
  overview           = EXCLUDED.overview,
  image_url          = EXCLUDED.image_url,
  causes             = EXCLUDED.causes,
  warning_signs      = EXCLUDED.warning_signs,
  treatments         = EXCLUDED.treatments,
  warning_box        = EXCLUDED.warning_box,
  clinical_resources = EXCLUDED.clinical_resources,
  meta_description   = EXCLUDED.meta_description,
  is_active          = EXCLUDED.is_active;
