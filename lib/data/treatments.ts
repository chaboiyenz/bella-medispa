/**
 * Bella MediSpa 2.0 — Treatment Page Mock Data
 * "The encyclopaedic reference layer for the Anti-Gravity platform."
 *
 * Add a new treatment by inserting a key-value pair below.
 * The key must match the URL slug: /treatments/[key]
 */

export interface TreatmentFact {
  icon: string;   // Lucide icon name (see ICON_MAP in page.tsx)
  label: string;
  description: string;
}

export interface TreatmentPill {
  name: string;
  slug?: string;  // if set, pill becomes a <Link>
}

export interface TreatmentReference {
  title: string;
  url: string;
}

export interface TreatmentPageData {
  slug: string;
  name: string;
  category: string;
  breadcrumb: string[];
  overview: string;
  causes: TreatmentFact[];
  prevention: TreatmentFact[];
  warningBox: string;
  treatments: TreatmentPill[];
  references: TreatmentReference[];
  metaDescription: string;
}

// ─── Treatment Registry ───────────────────────────────────────────────────────

const TREATMENTS: Record<string, TreatmentPageData> = {

  "age-spots": {
    slug:       "age-spots",
    name:       "Age Spots",
    category:   "Aesthetics",
    breadcrumb: ["Treatments", "Aesthetics"],
    metaDescription:
      "Expert age spot treatments in Dover, DE — including BBL laser, HALO resurfacing, and cryotherapy. Book a clinical consultation at Bella MediSpa today.",

    overview:
      "Age spots — also known as liver spots or solar lentigines — are flat, tan, brown, or black areas of pigmentation that develop on sun-exposed skin. Ranging from freckle-sized to approximately a centimetre in diameter, they typically appear on the face, hands, shoulders, and forearms of adults over 50, though younger individuals with significant cumulative sun exposure are by no means immune. The condition results from an overproduction of melanin — the skin's natural pigment — triggered by years of ultraviolet radiation. While completely benign in the vast majority of cases, age spots can significantly impact confidence and are among the most common pigmentation concerns addressed at Bella MediSpa.",

    causes: [
      {
        icon:        "Sun",
        label:       "UV Radiation",
        description: "Prolonged or cumulative ultraviolet exposure accelerates melanin production, concentrating pigment in specific zones over time.",
      },
      {
        icon:        "Clock",
        label:       "Natural Aging",
        description: "Decades of UV accumulation gradually reduce the skin's ability to disperse melanin evenly, resulting in visible clustering.",
      },
      {
        icon:        "Zap",
        label:       "Tanning Beds",
        description: "Artificial UVA sources are particularly effective at triggering excess melanin deposits even with short, repeated sessions.",
      },
      {
        icon:        "Dna",
        label:       "Genetic Predisposition",
        description: "Fair-skinned individuals with lower baseline melanin are significantly more susceptible to uneven pigmentation after sun exposure.",
      },
      {
        icon:        "Activity",
        label:       "Hormonal Shifts",
        description: "Fluctuations in estrogen and progesterone — from pregnancy, menopause, or contraceptives — can amplify existing UV-induced pigmentation.",
      },
    ],

    prevention: [
      {
        icon:        "Shield",
        label:       "Daily SPF 50+",
        description: "Apply broad-spectrum mineral sunscreen every morning, even when overcast. Reapply every two hours during outdoor activities.",
      },
      {
        icon:        "Clock3",
        label:       "Limit Peak UV Hours",
        description: "Avoid unprotected sun exposure between 10am–4pm, particularly during summer months and at higher elevations.",
      },
      {
        icon:        "Shirt",
        label:       "Protective Clothing",
        description: "Wide-brim hats, UV-blocking apparel (UPF 50+), and UV-filtering sunglasses significantly reduce cumulative exposure.",
      },
      {
        icon:        "Stethoscope",
        label:       "Annual Skin Checks",
        description: "Regular dermatological assessments allow early detection of any atypical pigmentation before it progresses.",
      },
      {
        icon:        "Sparkles",
        label:       "Antioxidant Serums",
        description: "Daily vitamin C, niacinamide, and resveratrol neutralise UV-induced oxidative stress that triggers melanin overproduction.",
      },
    ],

    warningBox:
      "While the vast majority of age spots are entirely benign, any lesion displaying asymmetry, uneven coloration, irregular borders, rapid growth, bleeding, or crusting must be evaluated by a board-certified physician. A skin biopsy may be recommended to definitively rule out melanoma or other malignant conditions. Early detection remains the single most critical factor in skin cancer outcomes. Do not attempt to self-diagnose or self-treat suspicious spots. Schedule a clinical evaluation with our Medical Director today.",

    treatments: [
      { name: "BBL™ BroadBand Light",         slug: "bbl-broadband-light" },
      { name: "HALO™ Hybrid Fractional Laser", slug: "halo-laser" },
      { name: "Cryotherapy" },
      { name: "Diamond Glow™ Facial",          slug: "diamond-glow" },
      { name: "Medical-Grade Chemical Peels" },
      { name: "Microdermabrasion" },
      { name: "Prescription Lightening Therapy" },
    ],

    references: [
      {
        title: "AAD: Age Spots — Causes, Symptoms & Treatment",
        url:   "https://www.aad.org/public/diseases/color-problems/age-spots",
      },
      {
        title: "Mayo Clinic: Solar Lentigines (Liver Spots)",
        url:   "https://www.mayoclinic.org/diseases-conditions/age-spots/symptoms-causes/syc-20355859",
      },
      {
        title: "NIH MedlinePlus: Liver Spots",
        url:   "https://medlineplus.gov/ency/article/001141.htm",
      },
      {
        title: "Skin Cancer Foundation: Melanoma Warning Signs (ABCDE Rule)",
        url:   "https://www.skincancer.org/skin-cancer-information/melanoma/",
      },
    ],
  },

};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getTreatmentData(slug: string): TreatmentPageData | null {
  return TREATMENTS[slug] ?? null;
}

export function getAllTreatmentSlugs(): string[] {
  return Object.keys(TREATMENTS);
}
