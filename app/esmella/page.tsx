import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, CheckCircle2, XCircle, ChevronRight, Zap, Clock, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "EMSELLA® — Pelvic Floor Treatment | Bella MediSpa Dover, DE",
  description:
    "EMSELLA® delivers 11,000 supramaximal pelvic floor contractions in 30 minutes — fully clothed, zero downtime. FDA-cleared for urinary incontinence and pelvic floor rehabilitation.",
  openGraph: {
    title: "EMSELLA® (The Kegel Throne) | Bella MediSpa",
    description:
      "Regain control with EMSELLA® — the non-invasive pelvic floor treatment that does 11,000 Kegels in one session.",
    type: "website",
  },
};

// ─── Static data ──────────────────────────────────────────────────────────────

const STATS = [
  { value: "11,000", label: "Supramaximal Contractions" },
  { value: "30 min", label: "Per Session" },
  { value: "0",      label: "Downtime" },
  { value: "95%",    label: "Patient Satisfaction" },
];

const HOW_IT_WORKS = [
  {
    icon: Zap,
    title: "HIFEM® Technology",
    body: "High-Intensity Focused Electromagnetic energy penetrates clothing and tissue to directly stimulate motor neurons in the pelvic floor muscles — deeper than any voluntary contraction.",
  },
  {
    icon: Activity,
    title: "Supramaximal Contractions",
    body: "Each session induces thousands of contractions far exceeding what voluntary exercise can achieve, triggering deep muscle remodeling and neuromuscular re-education.",
  },
  {
    icon: Clock,
    title: "FDA-Cleared Protocol",
    body: "Cleared for the treatment of urinary incontinence and improvement of pelvic floor muscles. The mechanism is the same used in EMSCULPT® for body contouring — now applied to the pelvic floor.",
  },
];

const EXPERIENCE = [
  "Sit fully clothed on the EMSELLA® chair",
  "Gentle electromagnetic pulses begin — no pain, just tingling and muscle engagement",
  "Intensity is dialed to your comfort level",
  "30 minutes per session; you can read or use your phone",
  "Walk out immediately with zero recovery time",
];

const CANDIDATES = [
  "Stress urinary incontinence (leaking when laughing, sneezing, or exercising)",
  "Urge incontinence or overactive bladder",
  "Postpartum pelvic floor weakness",
  "Pelvic organ prolapse prevention",
  "Men with post-prostatectomy incontinence",
  "Anyone seeking non-surgical pelvic rehabilitation",
];

const CONTRAINDICATIONS = [
  "Cardiac pacemakers or implanted metal devices",
  "Active pregnancy",
  "Copper IUDs or metal implants in the pelvic region",
  "Recent pelvic surgery (within 6 months)",
];

const ROADMAP = [
  {
    step: "01",
    title: "Consultation & Assessment",
    detail: "Your provider reviews symptoms, medical history, and goals. A pelvic health questionnaire is completed to establish your baseline.",
  },
  {
    step: "02",
    title: "Sessions 1–2 (Week 1)",
    detail: "Two 30-minute sessions, typically Mon/Thu. Initial neuromuscular recruitment begins. Most patients notice reduced leakage within the first week.",
  },
  {
    step: "03",
    title: "Sessions 3–4 (Week 2)",
    detail: "Muscle conditioning deepens. Urgency episodes typically decrease. Intensity is incrementally increased as tolerance improves.",
  },
  {
    step: "04",
    title: "Sessions 5–6 (Week 3)",
    detail: "Final phase of the primary protocol. Collagen remodeling and fascial strengthening accelerate. Full results emerge over the following 2–4 weeks.",
  },
  {
    step: "05",
    title: "Maintenance (Monthly)",
    detail: "A single monthly session sustains results long-term. Annual re-evaluation recommended. Many patients maintain benefit for 6–12+ months without maintenance.",
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function EsmellaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: "EMSELLA® Pelvic Floor Treatment | Bella MediSpa",
    description:
      "FDA-cleared HIFEM® technology delivering 11,000 pelvic floor contractions per 30-minute session. Non-invasive treatment for urinary incontinence and pelvic floor rehabilitation.",
    url: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/esmella`,
    about: {
      "@type": "MedicalTherapy",
      name: "EMSELLA® Pelvic Floor Electromagnetic Therapy",
    },
    provider: {
      "@type": "MedicalBusiness",
      name: "Bella MediSpa",
      telephone: "+1-302-736-6334",
      address: {
        "@type": "PostalAddress",
        streetAddress: "435 S Dupont Hwy",
        addressLocality: "Dover",
        addressRegion: "DE",
        postalCode: "19901",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pt-16 pb-28" suppressHydrationWarning>

        {/* ══════════════════════════════════════════════════════════
            SECTION 1 — HERO
        ══════════════════════════════════════════════════════════ */}
        <header className="relative overflow-hidden bg-[#F8FAFC] py-20 px-6">
          {/* Ambient glow orbs */}
          <div aria-hidden className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-[#17a2b8]/8 blur-3xl pointer-events-none" />
          <div aria-hidden className="absolute -bottom-16 -left-24 w-80 h-80 rounded-full bg-[#ef3825]/5 blur-3xl pointer-events-none" />
          {/* Cyan ring accent */}
          <div aria-hidden className="absolute top-1/2 right-8 -translate-y-1/2 w-64 h-64 rounded-full border border-[#17a2b8]/12 pointer-events-none hidden lg:block" />
          <div aria-hidden className="absolute top-1/2 right-8 -translate-y-1/2 w-44 h-44 rounded-full border border-[#17a2b8]/20 pointer-events-none hidden lg:block" />

          <div className="relative max-w-3xl mx-auto flex flex-col items-center gap-6 text-center">

            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="inline-flex items-center gap-1.5 bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-full px-5 py-2 shadow-sm text-xs text-[#94A3B8]"
            >
              <Link href="/" className="hover:text-[#17a2b8] transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3 text-[#CBD5E1]" aria-hidden />
              <span className="text-[#64748B]">Treatments</span>
              <ChevronRight className="w-3 h-3 text-[#CBD5E1]" aria-hidden />
              <span className="font-semibold text-[#0F172A]">EMSELLA®</span>
            </nav>

            {/* Category badge */}
            <span className="inline-flex items-center bg-[#17a2b8]/8 text-[#17a2b8] text-[10px] font-bold tracking-[0.3em] uppercase px-4 py-1.5 rounded-full border border-[#17a2b8]/20">
              Pelvic Floor Rehabilitation
            </span>

            {/* Title */}
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light text-[#0F172A] leading-[1.08]">
              Regain Control.{" "}
              <span className="italic text-[#ef3825]">Rediscover</span>{" "}
              Confidence.
            </h1>

            <p className="text-[#64748B] text-base md:text-lg leading-relaxed max-w-xl font-light">
              EMSELLA® uses FDA-cleared electromagnetic energy to rehabilitate your pelvic floor — fully clothed, zero downtime, remarkable results.
            </p>

            {/* Divider */}
            <div className="flex items-center gap-4 text-[#CBD5E1]">
              <span className="w-12 h-px bg-current" aria-hidden />
              <span className="text-xs font-medium tracking-widest uppercase text-[#94A3B8]">
                The Kegel Throne
              </span>
              <span className="w-12 h-px bg-current" aria-hidden />
            </div>
          </div>
        </header>

        {/* ══════════════════════════════════════════════════════════
            SECTION 2 — STAT BANNER
        ══════════════════════════════════════════════════════════ */}
        <div className="bg-[#0F172A] py-10 px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <span className="font-serif text-4xl md:text-5xl font-light text-[#ef3825]">
                  {s.value}
                </span>
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#94A3B8]">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            SECTION 3 — HOW IT WORKS (Science)
        ══════════════════════════════════════════════════════════ */}
        <section className="max-w-3xl mx-auto px-6 py-16 flex flex-col gap-8">
          <header className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <span className="w-8 h-px bg-slate-300" />
              <p className="text-[9px] tracking-[0.45em] font-bold text-[#94A3B8] uppercase">
                THE SCIENCE · HIFEM® TECHNOLOGY
              </p>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-[#0F172A]">
              The Power of{" "}
              <span className="italic text-[#ef3825]">11,000 Kegels</span>
            </h2>
            <p className="text-[#64748B] text-sm leading-relaxed mt-2 max-w-lg font-light">
              A single 30-minute EMSELLA® session delivers the equivalent of 11,000 perfect Kegel contractions — targeting muscle fibers no voluntary exercise can reach.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HOW_IT_WORKS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 p-7 flex flex-col gap-4"
                  suppressHydrationWarning
                >
                  <span className="w-10 h-10 rounded-2xl bg-[#17a2b8]/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#17a2b8]" aria-hidden />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-sm font-semibold text-[#0F172A]">{item.title}</h3>
                    <p className="text-xs text-[#64748B] leading-relaxed">{item.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            SECTION 4 — CANDIDACY & COMFORT (Two-column)
        ══════════════════════════════════════════════════════════ */}
        <section className="py-16 px-6 bg-[#F8FAFC]" suppressHydrationWarning>
          <div className="max-w-3xl mx-auto flex flex-col gap-8">
            <header className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <span className="w-8 h-px bg-slate-300" />
                <p className="text-[9px] tracking-[0.45em] font-bold text-[#94A3B8] uppercase">
                  CANDIDACY &amp; COMFORT
                </p>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-[#0F172A]">
                Is EMSELLA® Right{" "}
                <span className="italic text-[#ef3825]">For You?</span>
              </h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Left — The Experience */}
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 p-7 flex flex-col gap-5" suppressHydrationWarning>
                <h3 className="text-[9px] tracking-[0.45em] font-bold text-[#94A3B8] uppercase">
                  The Experience
                </h3>
                <ul className="flex flex-col gap-3">
                  {EXPERIENCE.map((item) => (
                    <li key={item} className="flex gap-3 items-start">
                      <CheckCircle2 className="w-4 h-4 text-[#17a2b8] shrink-0 mt-0.5" aria-hidden />
                      <span className="text-sm text-[#334155] leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right — Candidates + Contraindications */}
              <div className="flex flex-col gap-5">

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-[#17a2b8]/10 p-7 flex flex-col gap-4" suppressHydrationWarning>
                  <h3 className="text-[9px] tracking-[0.45em] font-bold text-[#94A3B8] uppercase">
                    Ideal Candidates
                  </h3>
                  <ul className="flex flex-col gap-2.5">
                    {CANDIDATES.map((c) => (
                      <li key={c} className="flex gap-2.5 items-start">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#17a2b8] shrink-0 mt-0.5" aria-hidden />
                        <span className="text-xs text-[#334155] leading-relaxed">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-[#ef3825]/10 p-7 flex flex-col gap-4" suppressHydrationWarning>
                  <h3 className="text-[9px] tracking-[0.45em] font-bold text-[#ef3825]/60 uppercase tracking-[0.45em]">
                    Contraindications
                  </h3>
                  <ul className="flex flex-col gap-2.5">
                    {CONTRAINDICATIONS.map((c) => (
                      <li key={c} className="flex gap-2.5 items-start">
                        <XCircle className="w-3.5 h-3.5 text-[#ef3825]/70 shrink-0 mt-0.5" aria-hidden />
                        <span className="text-xs text-[#64748B] leading-relaxed">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            SECTION 5 — CLINICAL ROADMAP (Treatment Plan)
        ══════════════════════════════════════════════════════════ */}
        <section className="max-w-3xl mx-auto px-6 py-16 flex flex-col gap-8">
          <header className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <span className="w-8 h-px bg-slate-300" />
              <p className="text-[9px] tracking-[0.45em] font-bold text-[#94A3B8] uppercase">
                THE TREATMENT PLAN · CLINICAL ROADMAP
              </p>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-[#0F172A]">
              Clinical{" "}
              <span className="italic text-[#ef3825]">Roadmap</span>
            </h2>
            <p className="text-[#64748B] text-sm leading-relaxed mt-2 max-w-lg font-light">
              The standard protocol is 6 sessions over 3 weeks, twice weekly. Most patients notice improvement by session 3.
            </p>
          </header>

          {/* Roadmap floating exhibit panel */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 p-8" suppressHydrationWarning>
          <ol className="relative flex flex-col gap-0" aria-label="Treatment roadmap">
            {ROADMAP.map((item, i) => (
              <li key={item.step} className="relative flex gap-5">

                {/* Vertical connector line */}
                {i < ROADMAP.length - 1 && (
                  <div aria-hidden className="absolute left-[19px] top-10 bottom-0 w-px bg-linear-gradient-to-b from-[#17a2b8]/30 to-transparent" />
                )}

                {/* Step number circle */}
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#0F172A] border-2 border-[#17a2b8]/40 flex items-center justify-center z-10 mt-0.5">
                  <span className="text-[10px] font-bold text-[#17a2b8] tracking-wider">
                    {item.step}
                  </span>
                </div>

                {/* Content */}
                <div className="pb-8 flex flex-col gap-1.5 pt-1">
                  <h3 className="text-sm font-semibold text-[#0F172A]">{item.title}</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            SECTION 6 — CTA BANNER
        ══════════════════════════════════════════════════════════ */}
        <section className="px-6 pb-4">
          <div
            className="relative overflow-hidden max-w-3xl mx-auto rounded-3xl p-10 text-center flex flex-col items-center gap-6"
            style={{
              background: "linear-gradient(135deg, #0F172A 0%, #1e293b 100%)",
              boxShadow: "0 0 0 1px rgba(23,162,184,0.2), 0 24px 64px rgba(15,23,42,0.35)",
            }}
          >
            {/* Glow orb */}
            <div aria-hidden className="absolute w-40 h-40 rounded-full bg-[#17a2b8]/15 blur-2xl pointer-events-none" />

            <span className="inline-flex items-center bg-[#17a2b8]/15 text-[#17a2b8] text-[10px] font-bold tracking-[0.3em] uppercase px-4 py-1.5 rounded-full border border-[#17a2b8]/25">
              Ready to Begin?
            </span>

            <h2 className="font-serif text-3xl md:text-4xl font-light text-white leading-snug">
              Take the First Step Toward{" "}
              <span className="italic text-[#ef3825]">Lasting Relief</span>
            </h2>

            <p className="text-[#94A3B8] text-sm leading-relaxed max-w-sm font-light">
              Schedule a complimentary consultation. Our providers will assess your needs and design your personal EMSELLA® protocol.
            </p>

            <Link href="/#contact">
              <Button className="bg-[#ef3825] hover:bg-[#17a2b8] text-white rounded-full px-8 py-3 text-sm font-semibold transition-colors duration-300 gap-2 shadow-lg shadow-[#ef3825]/30 hover:shadow-[#17a2b8]/30">
                <Calendar className="w-4 h-4" aria-hidden />
                Book Your Consultation
              </Button>
            </Link>

            <p className="text-[#475569] text-xs">
              Bella MediSpa · 435 S Dupont Hwy, Dover, DE 19901 · +1 302-736-6334
            </p>
          </div>
        </section>

      </div>

      {/* ══════════════════════════════════════════════════════════════
          STICKY CTA BAR
      ══════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-md border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
          <div>
            <p className="text-[#0F172A] text-sm font-semibold leading-tight">EMSELLA®</p>
            <p className="text-[#94A3B8] text-xs mt-0.5">
              Bella MediSpa · Dover, DE · +1 302-736-6334
            </p>
          </div>
          <Link href="/#contact" className="shrink-0">
            <Button className="bg-[#ef3825] hover:bg-[#17a2b8] text-white rounded-full px-7 py-2.5 text-sm font-semibold transition-colors duration-300 gap-2 shadow-md shadow-[#ef3825]/20 hover:shadow-[#17a2b8]/20">
              <Calendar className="w-4 h-4" aria-hidden />
              Book Consultation
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
