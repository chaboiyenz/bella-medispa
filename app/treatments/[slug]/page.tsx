import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Sun, Clock, Zap, Dna, Activity,
  AlertTriangle, Palette, TrendingUp, Droplets, Eye,
  ExternalLink, ArrowRight, Calendar, ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import type { TreatmentCause, TreatmentOption, ClinicalResource } from "@/types";

// ─── Icon map: JSONB icon name → Lucide component ───────────────────────────

const ICON_MAP = {
  Sun, Clock, Zap, Dna, Activity,
  AlertTriangle, Palette, TrendingUp, Droplets, Eye,
} as const;

type IconName = keyof typeof ICON_MAP;

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name as IconName];
  if (!Icon) return <span className={className} />;
  return <Icon className={className} />;
}

// ─── Static params (pre-render known slugs) ──────────────────────────────────

export async function generateStaticParams() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("treatment_details")
      .select("slug")
      .eq("is_active", true);
    return (data ?? []).map(({ slug }) => ({ slug }));
  } catch {
    return [];
  }
}

// ─── SEO metadata ────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("treatment_details")
    .select("name, meta_description")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "Treatment Not Found | Bella MediSpa" };

  return {
    title: `${data.name} Treatment | Bella MediSpa Dover, DE`,
    description:
      data.meta_description ??
      `Expert ${data.name} treatment in Dover, DE. Book a consultation at Bella MediSpa.`,
    openGraph: {
      title: `${data.name} | Bella MediSpa`,
      description: data.meta_description ?? "",
      type: "website",
    },
  };
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function TreatmentDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: treatment } = await supabase
    .from("treatment_details")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!treatment) notFound();

  const causes       = treatment.causes           as TreatmentCause[];
  const warningSigns = treatment.warning_signs    as TreatmentCause[];
  const options      = treatment.treatments       as TreatmentOption[];
  const resources    = treatment.clinical_resources as ClinicalResource[];

  // JSON-LD structured data (MedicalWebPage)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": `${treatment.name} Treatment | Bella MediSpa`,
    "description": treatment.meta_description,
    "url": `${process.env.NEXT_PUBLIC_APP_URL}/treatments/${slug}`,
    "about": {
      "@type": "MedicalCondition",
      "name": treatment.name,
    },
    "provider": {
      "@type": "MedicalBusiness",
      "name": "Bella MediSpa",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "435 S Dupont Hwy",
        "addressLocality": "Dover",
        "addressRegion": "DE",
        "postalCode": "19901",
      },
      "telephone": "+1-302-736-6334",
      "url": process.env.NEXT_PUBLIC_APP_URL,
    },
  };

  return (
    <>
      {/* ── Structured Data ─────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen mesh-bg text-[#0F172A] font-sans pt-16 pb-28">

        {/* ── FLOATING HERO HEADER ──────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-6 pt-12 pb-6">
          <div className="bg-white/55 backdrop-blur-lg border border-white/50 rounded-3xl shadow-xl shadow-slate-200/30 px-8 py-7">

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-x-1.5 gap-y-1 text-xs text-[#94A3B8] mb-4">
              <Link href="/" className="hover:text-[#17a2b8] transition-colors">Home</Link>
              {treatment.breadcrumb.map((crumb: string, i: number) => (
                <span key={i} className="flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#CBD5E1] shrink-0" />
                  <span className="text-[#64748B]">{crumb}</span>
                </span>
              ))}
              <span className="flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-[#CBD5E1] shrink-0" />
                <span className="text-[#0F172A] font-semibold">{treatment.name}</span>
              </span>
            </nav>

            {/* Title + category pill */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-[#0F172A] leading-tight">
                {treatment.name}
              </h1>
              <span className="inline-flex items-center self-start sm:self-auto bg-[#17a2b8]/10 text-[#17a2b8] text-[10px] font-bold tracking-[0.3em] uppercase px-4 py-1.5 rounded-full border border-[#17a2b8]/20 whitespace-nowrap">
                {treatment.category}
              </span>
            </div>
          </div>
        </div>

        {/* ── CONTENT MODULES ──────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-6 flex flex-col gap-8">

          {/* ── Module 1: Overview — Z-pattern (text left · image right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">

            {/* Text */}
            <div className="bg-white/55 backdrop-blur-lg border border-white/50 rounded-3xl shadow-lg shadow-slate-200/20 p-8 flex flex-col gap-5">
              <div>
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#17a2b8]">
                  Overview
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-light text-[#0F172A] mt-2 leading-snug">
                  What Are{" "}
                  <span className="italic text-[#ef3825]">{treatment.name}?</span>
                </h2>
              </div>
              <p className="text-sm md:text-base text-[#64748B] leading-[1.9]">
                {treatment.overview}
              </p>
            </div>

            {/* Image */}
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl shadow-slate-300/30 ring-1 ring-white/40">
              {treatment.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={treatment.image_url}
                  alt={`${treatment.name} treatment at Bella MediSpa`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#17a2b8]/10 via-white/20 to-[#ef3825]/5 flex flex-col items-center justify-center gap-3">
                  <span className="text-[#CBD5E1] text-4xl font-serif font-light">
                    {treatment.name.charAt(0)}
                  </span>
                  <span className="text-[#CBD5E1] text-xs tracking-widest uppercase font-medium">
                    {treatment.name}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/25 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* ── Module 2: Causes & Diagnosis — full-width 2-col grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Causes (Cyan) */}
            <div className="bg-white/55 backdrop-blur-lg border border-white/50 rounded-3xl shadow-lg shadow-slate-200/20 p-8 flex flex-col gap-5">
              <div>
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#17a2b8]">
                  Causes
                </span>
                <h2 className="font-serif text-xl font-light text-[#0F172A] mt-1">
                  Why They Develop
                </h2>
              </div>
              <ul className="flex flex-col gap-4">
                {causes.map((cause, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="w-8 h-8 rounded-xl bg-[#17a2b8]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <DynamicIcon name={cause.icon} className="w-4 h-4 text-[#17a2b8]" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">{cause.label}</p>
                      <p className="text-xs text-[#64748B] leading-relaxed mt-0.5">
                        {cause.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Clinical Warning Signs (Red) */}
            <div className="bg-white/55 backdrop-blur-lg border border-white/50 rounded-3xl shadow-lg shadow-slate-200/20 p-8 flex flex-col gap-5">
              <div>
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#ef3825]">
                  Diagnosis
                </span>
                <h2 className="font-serif text-xl font-light text-[#0F172A] mt-1">
                  Clinical Warning Signs
                </h2>
              </div>
              <ul className="flex flex-col gap-4">
                {warningSigns.map((sign, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="w-8 h-8 rounded-xl bg-[#ef3825]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <DynamicIcon name={sign.icon} className="w-4 h-4 text-[#ef3825]" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">{sign.label}</p>
                      <p className="text-xs text-[#64748B] leading-relaxed mt-0.5">
                        {sign.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Module 3: Treatment Suite — Z-pattern (panel left · list right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

            {/* Tinted left panel */}
            <div className="bg-gradient-to-br from-[#17a2b8]/8 via-white/30 to-[#ef3825]/5 backdrop-blur-lg border border-white/50 rounded-3xl shadow-lg shadow-slate-200/20 p-8 flex flex-col gap-5">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#17a2b8]">
                Our Approach
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-light text-[#0F172A] leading-snug">
                Precision Treatments{" "}
                <span className="italic text-[#ef3825]">Tailored to You.</span>
              </h2>
              <p className="text-sm text-[#64748B] leading-relaxed flex-1">
                No two cases of {treatment.name.toLowerCase()} are identical. Our
                clinical team combines an in-depth diagnostic assessment with a
                curated selection of FDA-cleared modalities to design a
                personalised treatment protocol for your unique skin profile and
                lifestyle.
              </p>
              <div className="pt-2">
                <Link href="/book">
                  <Button className="bg-[#ef3825] hover:bg-[#17a2b8] text-white rounded-full px-7 py-5 text-sm font-semibold transition-colors duration-300 gap-2">
                    Book a Consultation
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Treatment list */}
            <div className="bg-white/55 backdrop-blur-lg border border-white/50 rounded-3xl shadow-lg shadow-slate-200/20 p-8 flex flex-col gap-1">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#17a2b8] mb-3">
                Treatment Suite
              </span>
              {options.map((t, i) => (
                <div
                  key={i}
                  className="group flex flex-col gap-1 py-3.5 border-b border-[#F1F5F9] last:border-0"
                >
                  {t.slug ? (
                    <Link
                      href={`/treatments/${t.slug}`}
                      className="flex items-center gap-1.5 text-sm font-semibold text-[#0F172A] hover:text-[#17a2b8] transition-colors duration-200"
                    >
                      {t.name}
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                    </Link>
                  ) : (
                    <span className="text-sm font-semibold text-[#0F172A] group-hover:text-[#17a2b8] transition-colors duration-200 cursor-default">
                      {t.name}
                    </span>
                  )}
                  <p className="text-xs text-[#64748B] leading-relaxed">{t.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Warning Box: red glow border ───────────────────────── */}
          {treatment.warning_box && (
            <div
              className="relative bg-white/60 backdrop-blur-lg rounded-3xl p-8 flex gap-5 items-start"
              style={{
                border: "1px solid rgba(239,56,37,0.35)",
                boxShadow:
                  "0 0 0 1px rgba(239,56,37,0.08), 0 8px 32px rgba(239,56,37,0.10), 0 2px 8px rgba(239,56,37,0.08)",
              }}
            >
              <span className="w-11 h-11 rounded-2xl bg-[#ef3825]/10 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5 text-[#ef3825]" />
              </span>
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#ef3825]">
                  Clinical Advisory
                </p>
                <p className="text-sm text-[#0F172A] leading-[1.9]">
                  {treatment.warning_box}
                </p>
                <div className="pt-2">
                  <Link href="/book">
                    <Button
                      variant="outline"
                      className="border-[#ef3825]/30 text-[#ef3825] hover:bg-[#ef3825]/5 hover:border-[#ef3825] rounded-full px-5 py-2 text-xs font-semibold transition-all duration-200 gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Request a Clinical Evaluation
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ── Clinical Resources ──────────────────────────────────── */}
          {resources.length > 0 && (
            <div className="bg-white/40 backdrop-blur-lg border border-white/40 rounded-3xl shadow-lg shadow-slate-200/20 p-8 flex flex-col gap-5">
              <div>
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#17a2b8]">
                  Clinical Resources
                </span>
                <h2 className="font-serif text-xl font-light text-[#0F172A] mt-1">
                  Further Reading
                </h2>
              </div>
              <ul className="divide-y divide-[#F1F5F9]">
                {resources.map((r, i) => (
                  <li key={i}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between py-3.5 group"
                    >
                      <span className="text-sm text-[#0F172A] group-hover:text-[#17a2b8] transition-colors duration-200">
                        {r.title}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#17a2b8] shrink-0 ml-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>

      {/* ── STICKY BOOK NOW BAR ──────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0F172A]/95 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-white text-sm font-semibold">{treatment.name}</p>
            <p className="text-white/40 text-xs">Bella MediSpa · Dover, DE · +1 302-736-6334</p>
          </div>
          <Link href="/book" className="shrink-0">
            <Button className="bg-[#ef3825] hover:bg-[#17a2b8] text-white rounded-full px-6 py-2.5 text-sm font-semibold transition-colors duration-300 gap-2">
              <Calendar className="w-4 h-4" />
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
