import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  // Causes
  Sun, Clock, Zap, Dna, Activity,
  // Prevention
  Shield, Clock3, Shirt, Stethoscope, Sparkles,
  // UI
  ChevronRight, ExternalLink, Calendar, ShieldAlert, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTreatmentData, getAllTreatmentSlugs } from "@/lib/data/treatments";

// ─── Icon map ────────────────────────────────────────────────────────────────

const ICON_MAP = {
  Sun, Clock, Zap, Dna, Activity,
  Shield, Clock3, Shirt, Stethoscope, Sparkles,
} as const;

type IconName = keyof typeof ICON_MAP;

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name as IconName];
  if (!Icon) return null;
  return <Icon className={className} />;
}

// ─── Static params ───────────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllTreatmentSlugs().map((slug) => ({ slug }));
}

// ─── SEO metadata ────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const t = getTreatmentData(slug);
  if (!t) return { title: "Treatment Not Found | Bella MediSpa" };

  return {
    title:       `${t.name} Treatment | Bella MediSpa Dover, DE`,
    description: t.metaDescription,
    openGraph: {
      title:       `${t.name} | Bella MediSpa`,
      description: t.metaDescription,
      type:        "website",
    },
  };
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function TreatmentPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const t = getTreatmentData(slug);
  if (!t) notFound();

  // JSON-LD structured data (MedicalWebPage)
  const jsonLd = {
    "@context":    "https://schema.org",
    "@type":       "MedicalWebPage",
    "name":        `${t.name} Treatment | Bella MediSpa`,
    "description": t.metaDescription,
    "url":         `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/treatments/${slug}`,
    "about": {
      "@type": "MedicalCondition",
      "name":  t.name,
    },
    "provider": {
      "@type":     "MedicalBusiness",
      "name":      "Bella MediSpa",
      "telephone": "+1-302-736-6334",
      "address": {
        "@type":           "PostalAddress",
        "streetAddress":   "435 S Dupont Hwy",
        "addressLocality": "Dover",
        "addressRegion":   "DE",
        "postalCode":      "19901",
      },
    },
  };

  return (
    <>
      {/* ── Structured data ──────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Page shell — pb-28 reserves space above sticky bar ── */}
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans pt-16 pb-28" suppressHydrationWarning>

        {/* ════════════════════════════════════════════════════════
            MODULE 1 — HERO
            Large serif title on near-white, floating glass breadcrumb
        ════════════════════════════════════════════════════════ */}
        <header className="relative overflow-hidden bg-[#F8FAFC] py-16 px-6">
          {/* Subtle ambient blobs */}
          <div aria-hidden className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#17a2b8]/5 blur-3xl pointer-events-none" />
          <div aria-hidden className="absolute -bottom-10 -left-20 w-64 h-64 rounded-full bg-[#ef3825]/4 blur-3xl pointer-events-none" />

          <div className="relative max-w-3xl mx-auto flex flex-col items-center gap-6 text-center">

            {/* Floating glass breadcrumb pill */}
            <nav
              aria-label="Breadcrumb"
              className="inline-flex items-center flex-wrap justify-center gap-x-1.5 gap-y-1 bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-full px-5 py-2 shadow-sm text-xs text-[#94A3B8]"
            >
              <Link href="/" className="hover:text-[#17a2b8] transition-colors duration-200">
                Home
              </Link>
              {t.breadcrumb.map((crumb, i) => (
                <span key={i} className="inline-flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#CBD5E1] shrink-0" aria-hidden />
                  <span className="text-[#64748B]">{crumb}</span>
                </span>
              ))}
              <span className="inline-flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-[#CBD5E1] shrink-0" aria-hidden />
                <span className="font-semibold text-[#0F172A]">{t.name}</span>
              </span>
            </nav>

            {/* Category badge */}
            <span className="inline-flex items-center bg-[#17a2b8]/8 text-[#17a2b8] text-[10px] font-bold tracking-[0.3em] uppercase px-4 py-1.5 rounded-full border border-[#17a2b8]/20">
              {t.category}
            </span>

            {/* Main title */}
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light text-[#0F172A] leading-[1.08]">
              {t.name}
            </h1>

            {/* Rule divider */}
            <div className="flex items-center gap-4 text-[#CBD5E1]">
              <span className="w-12 h-px bg-current" aria-hidden />
              <span className="text-xs font-medium tracking-widest uppercase text-[#94A3B8]">
                Clinical Reference
              </span>
              <span className="w-12 h-px bg-current" aria-hidden />
            </div>

          </div>
        </header>

        {/* Content column */}
        <div className="max-w-3xl mx-auto px-6 flex flex-col gap-10 mt-10">

          {/* ════════════════════════════════════════════════════════
              MODULE 2 — CLINICAL OVERVIEW CARD
              backdrop-blur-xl glass card, high line-height, dark slate
          ════════════════════════════════════════════════════════ */}
          <article
            aria-labelledby="overview-heading"
            className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 p-8 md:p-10 flex flex-col gap-5"
            suppressHydrationWarning
          >
            <header className="flex flex-col gap-1">
              <p className="text-[9px] tracking-[0.45em] font-bold text-[#94A3B8] uppercase">
                CLINICAL OVERVIEW
              </p>
              <h2
                id="overview-heading"
                className="font-serif text-2xl md:text-3xl font-light text-[#0F172A]"
              >
                What Are <span className="italic text-[#ef3825]">{t.name}?</span>
              </h2>
            </header>

            {/* Left cyan border + body text */}
            <div className="border-l-2 border-[#17a2b8]/30 pl-5">
              <p className="text-[#334155] text-base leading-loose font-light">
                {t.overview}
              </p>
            </div>
          </article>

          {/* ════════════════════════════════════════════════════════
              MODULE 3 — DIAGNOSTIC GRID
              Left: Causes (cyan icons) | Right: Prevention (cyan tint bg)
          ════════════════════════════════════════════════════════ */}
          <section aria-label="Diagnostic information">
            <header className="mb-5">
              <p className="text-[9px] tracking-[0.45em] font-bold text-[#94A3B8] uppercase">
                DIAGNOSTIC GRID
              </p>
              <h2 className="font-serif text-2xl font-light text-[#0F172A] mt-1">
                Causes &amp; Prevention
              </h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Left: Causes — cyan bullet icons */}
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 p-7 flex flex-col gap-5" suppressHydrationWarning>
                <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#17a2b8]">
                  Causes
                </h3>
                <ul className="flex flex-col gap-4">
                  {t.causes.map((cause, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span
                        className="w-7 h-7 rounded-lg bg-[#17a2b8]/10 flex items-center justify-center shrink-0 mt-0.5"
                        aria-hidden
                      >
                        <DynamicIcon name={cause.icon} className="w-3.5 h-3.5 text-[#17a2b8]" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[#0F172A] leading-snug">
                          {cause.label}
                        </p>
                        <p className="text-xs text-[#64748B] leading-relaxed mt-0.5">
                          {cause.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: Prevention — soft cyan-tint background */}
              <div
                className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-[#17a2b8]/10 p-7 flex flex-col gap-5"
                suppressHydrationWarning
              >
                <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#17a2b8]">
                  Prevention
                </h3>
                <ul className="flex flex-col gap-4">
                  {t.prevention.map((step, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span
                        className="w-7 h-7 rounded-lg bg-[#17a2b8]/15 flex items-center justify-center shrink-0 mt-0.5"
                        aria-hidden
                      >
                        <DynamicIcon name={step.icon} className="w-3.5 h-3.5 text-[#17a2b8]" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[#0F172A] leading-snug">
                          {step.label}
                        </p>
                        <p className="text-xs text-[#64748B] leading-relaxed mt-0.5">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </section>

          {/* ════════════════════════════════════════════════════════
              MODULE 4 — MEDICAL WARNING SECTION
              Red glow border, ShieldAlert icon, biopsy advisory
          ════════════════════════════════════════════════════════ */}
          {t.warningBox && (
            <aside
              aria-label="Medical advisory"
              className="rounded-3xl p-8 flex gap-5 items-start bg-white shadow-xl shadow-[#ef3825]/5"
              suppressHydrationWarning
              style={{
                border:    "1px solid rgba(239,56,37,0.35)",
                boxShadow: "0 0 0 1px rgba(239,56,37,0.07), 0 8px 40px rgba(239,56,37,0.10), 0 2px 12px rgba(239,56,37,0.07)",
              }}
            >
              <span
                className="w-11 h-11 rounded-2xl bg-[#ef3825]/10 flex items-center justify-center shrink-0 mt-0.5"
                aria-hidden
              >
                <ShieldAlert className="w-5 h-5 text-[#ef3825]" />
              </span>

              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-[#ef3825]">
                  Medical Alert
                </p>
                <p className="text-sm text-[#0F172A] leading-[1.95]">
                  {t.warningBox}
                </p>
                <div className="pt-1">
                  <Link href="/book">
                    <Button
                      variant="outline"
                      className="border-[#ef3825]/30 text-[#ef3825] hover:bg-[#ef3825]/5 hover:border-[#ef3825] rounded-full px-5 py-2 text-xs font-semibold transition-all duration-200 gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" aria-hidden />
                      Request a Clinical Evaluation
                    </Button>
                  </Link>
                </div>
              </div>
            </aside>
          )}

          {/* ════════════════════════════════════════════════════════
              MODULE 5 — TREATMENT PATH MODULE
              Floating interactive pills → Cyan (#17a2b8) on hover
          ════════════════════════════════════════════════════════ */}
          <section aria-labelledby="treatments-heading">
            <header className="mb-5">
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#17a2b8]">
                Treatment Path
              </p>
              <h2
                id="treatments-heading"
                className="font-serif text-2xl font-light text-[#0F172A] mt-1"
              >
                Available Protocols
              </h2>
            </header>

            <ul className="flex flex-wrap gap-3" role="list">
              {t.treatments.map((tx, i) => (
                <li key={i}>
                  {tx.slug ? (
                    <Link
                      href={`/treatments/${tx.slug}`}
                      className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 bg-white text-sm font-medium text-[#0F172A] shadow-sm hover:border-[#17a2b8] hover:text-[#17a2b8] hover:bg-[#17a2b8]/5 hover:shadow-[0_2px_12px_rgba(23,162,184,0.15)] transition-all duration-200"
                    >
                      {tx.name}
                      <ArrowRight
                        className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                        aria-hidden
                      />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center px-5 py-2.5 rounded-full border border-slate-200 bg-white text-sm font-medium text-[#0F172A] shadow-sm hover:border-[#17a2b8] hover:text-[#17a2b8] hover:bg-[#17a2b8]/5 hover:shadow-[0_2px_12px_rgba(23,162,184,0.15)] transition-all duration-200 cursor-default">
                      {tx.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* ════════════════════════════════════════════════════════
              MODULE 6 — REFERENCE LIBRARY
              Minimalist links, cyan underline on hover
          ════════════════════════════════════════════════════════ */}
          {t.references.length > 0 && (
            <section aria-labelledby="references-heading" className="pb-4">
              <header className="mb-4">
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#17a2b8]">
                  Reference Library
                </p>
                <h2
                  id="references-heading"
                  className="font-serif text-xl font-light text-[#0F172A] mt-1"
                >
                  Additional Resources
                </h2>
              </header>

              <ul className="flex flex-col divide-y divide-slate-100">
                {t.references.map((ref, i) => (
                  <li key={i}>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between py-3.5 text-sm text-[#0F172A] hover:text-[#17a2b8] transition-colors duration-200"
                    >
                      <span className="underline decoration-transparent group-hover:decoration-[#17a2b8] underline-offset-2 transition-all duration-200">
                        {ref.title}
                      </span>
                      <ExternalLink
                        className="w-3.5 h-3.5 text-[#17a2b8] shrink-0 ml-4 opacity-40 group-hover:opacity-100 transition-opacity duration-200"
                        aria-hidden
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          STICKY BOOK CONSULTATION CTA — fixed bottom, follows scroll
          Vibrant Red (#ef3825) → Cyan (#17a2b8) on hover
      ════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-200/80">
        <div className="max-w-3xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
          <div>
            <p className="text-[#0F172A] text-sm font-semibold leading-tight">
              {t.name}
            </p>
            <p className="text-[#94A3B8] text-xs mt-0.5">
              Bella MediSpa · Dover, DE · +1 302-736-6334
            </p>
          </div>
          <Link href="/book" className="shrink-0">
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
