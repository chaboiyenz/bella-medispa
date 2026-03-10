import type { Metadata } from "next";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactSection } from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Bella MediSpa",
  description:
    "Premium aesthetic treatments — facials, microneedling, laser, and more. Book your appointment online today.",
};

const SERVICES = [
  {
    title: "Signature HydraFacial",
    description:
      "A deeply cleansing, hydrating treatment that combines exfoliation, extraction, and infusion of nourishing serums for radiant skin.",
    duration: "60 MINS",
    price: "$199",
    imageSrc: "/bella-icon.png",
    imageAlt: "HydraFacial treatment",
  },
  {
    title: "Collagen Microneedling",
    description:
      "Precision micro-channels stimulate your skin's natural collagen production, smoothing fine lines and improving overall skin texture.",
    duration: "75 MINS",
    price: "$299",
    imageSrc: "/bella-icon.png",
    imageAlt: "Microneedling treatment",
  },
  {
    title: "Laser Skin Resurfacing",
    description:
      "Advanced fractional laser technology targets pigmentation, scarring, and uneven tone for visibly clearer, smoother skin.",
    duration: "45 MINS",
    price: "$349",
    imageSrc: "/bella-icon.png",
    imageAlt: "Laser skin resurfacing",
  },
];


export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans pt-16" suppressHydrationWarning>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Left: Typography */}
          <div className="flex flex-col gap-7" suppressHydrationWarning>
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-[#17a2b8]">
              <span className="w-6 h-px bg-[#17a2b8]" />
              Premium Aesthetics · Est. 2024
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light leading-[1.1] text-[#0F172A]">
              Your Skin,{" "}
              <span className="text-[#ef3825] italic font-normal">
                Perfected.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#64748B] leading-relaxed max-w-md">
              Expert-led aesthetic treatments in a calm, clinical environment —
              designed to help you look and feel like the best version of yourself.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button className="bg-[#ef3825] hover:bg-[#17a2b8] text-white font-semibold transition-colors duration-300 rounded-full px-8 py-5 text-sm tracking-wide">
                Book a Treatment
              </Button>
              <Button
                variant="outline"
                className="border-[#F1F5F9] text-[#0F172A] hover:border-[#17a2b8] hover:text-[#17a2b8] rounded-full px-8 py-5 text-sm tracking-wide transition-colors duration-300"
              >
                Explore Services
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-10 pt-4 border-t border-[#F1F5F9]" suppressHydrationWarning>
              {[
                { value: "2,000+", label: "Clients Treated" },
                { value: "15+", label: "Treatments" },
                { value: "4.9★", label: "Average Rating" },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="text-2xl font-bold text-[#0F172A]">{value}</span>
                  <span className="text-xs text-[#64748B] tracking-wide">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Floating image — temporary luxury spa placeholder (1200×800) */}
          <div className="relative flex justify-center" suppressHydrationWarning>
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden bg-white shadow-2xl shadow-slate-300/50 ring-1 ring-white/40" suppressHydrationWarning>
              <Image
                src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h=800&fit=crop"
                alt="Luxury spa interior — Bella MediSpa"
                fill
                className="object-cover"
                priority  
                unoptimized
              />
              <div className="absolute inset-0 bg-[#17a2b8]/5 mix-blend-multiply pointer-events-none" aria-hidden />
            </div>
            {/* Cyan ambient glow */}
            <div className="absolute -bottom-8 -right-8 w-72 h-72 rounded-full bg-[#17a2b8]/15 blur-3xl -z-10" />
            <div className="absolute -top-8 -left-8 w-48 h-48 rounded-full bg-[#ef3825]/8 blur-3xl -z-10" />
            {/* Floating glass badge */}
            <div className="absolute top-6 -left-4 glass rounded-2xl shadow-lg px-4 py-3 flex flex-col gap-0.5">
              <span className="text-xs text-[#64748B] font-medium">Next available</span>
              <span className="text-sm font-bold text-[#0F172A]">Today, 3:00 PM</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY & INNOVATION ──────────────────────────────── */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Exhibit panel */}
        <div className="relative max-w-4xl mx-auto animate-fade-in-up">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 p-10 md:p-14 flex flex-col items-center gap-8 text-center" suppressHydrationWarning>

            {/* Pill badge */}
            <span className="inline-flex items-center gap-2 border border-[#17a2b8]/40 text-[#17a2b8] text-[10px] font-bold tracking-[0.3em] uppercase px-4 py-1.5 rounded-full bg-[#17a2b8]/5">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              Delaware&apos;s Aesthetic Pioneers
            </span>

            {/* Heading */}
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-[#0F172A] leading-tight">
              Modern Science.{" "}
              <span className="italic text-[#ef3825]">Natural Elegance.</span>
            </h2>

            {/* Body copy */}
            <p className="text-base md:text-lg text-[#64748B] leading-[1.9] max-w-3xl">
              Located in the heart of Dover, DE, Bella MediSpa 2.0 is a premier,
              locally-owned destination for advanced aesthetic transformation. We
              specialize in a &ldquo;Natural-First&rdquo; approach, utilizing
              state-of-the-art technology to rejuvenate the skin, face, and body.
              As Delaware&apos;s pioneers in{" "}
              <span className="text-[#ef3825] font-semibold">Halo™ Laser Resurfacing</span>
              {" "}and{" "}
              <span className="text-[#ef3825] font-semibold">Emsculpt NEO®</span>
              , we bridge the gap between clinical expertise and luxury wellness.
              Our elite team — led by our{" "}
              <span className="text-[#17a2b8] font-semibold">Medical Director</span>
              , a specialized{" "}
              <span className="text-[#17a2b8] font-semibold">Injectable Physician</span>
              , and{" "}
              <span className="text-[#17a2b8] font-semibold">Licensed Medical Estheticians</span>
              {" "}— is dedicated to delivering youthful, visible results without
              compromising your unique character.
            </p>

            {/* Ghost CTA */}
            <Button
              variant="outline"
              className="border border-slate-300 text-[#0F172A] hover:border-[#17a2b8] hover:text-[#17a2b8] hover:bg-[#17a2b8]/5 rounded-full px-8 py-5 text-sm tracking-wide transition-all duration-300"
            >
              Meet the Team
            </Button>
          </div>
        </div>
      </section>

      {/* ── CLINICAL BOUTIQUE (placeholder gallery) ───────────────── */}
      <section id="clinical-boutique" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6 mb-12">
            <span className="w-8 h-px bg-slate-200" />
            <p className="text-[9px] tracking-[0.45em] font-bold text-[#94A3B8] uppercase">
              CLINICAL BOUTIQUE
            </p>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-[#0F172A] mb-14">
            Treatments <span className="text-[#ef3825] italic">by Category</span>
          </h2>

          {/* Asymmetrical gallery — staggered heights, generous white space */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10" suppressHydrationWarning>
            {/* Facials — taller */}
            <div className="flex flex-col gap-4" suppressHydrationWarning>
              <div className="relative rounded-2xl overflow-hidden bg-white shadow-2xl shadow-slate-300/40 h-[400px]" suppressHydrationWarning>
                <Image
                  src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop"
                  alt="Facials — luxury facial treatment"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-[#17a2b8]/5 mix-blend-multiply pointer-events-none" aria-hidden />
              </div>
              <p className="text-lg font-semibold text-[#0F172A] tracking-tight">Facials</p>
            </div>

            {/* Injectables — medium */}
            <div className="flex flex-col gap-4 md:pt-16" suppressHydrationWarning>
              <div className="relative rounded-2xl overflow-hidden bg-white shadow-2xl shadow-slate-300/40 h-[320px]" suppressHydrationWarning>
                <Image
                  src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&h=400&fit=crop"
                  alt="Injectables — aesthetic injectable treatment"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-[#17a2b8]/5 mix-blend-multiply pointer-events-none" aria-hidden />
              </div>
              <p className="text-lg font-semibold text-[#0F172A] tracking-tight">Injectables</p>
            </div>

            {/* EMSELLA® — taller */}
            <div className="flex flex-col gap-4 md:pt-8" suppressHydrationWarning>
              <div className="relative rounded-2xl overflow-hidden bg-white shadow-2xl shadow-slate-300/40 h-[380px]" suppressHydrationWarning>
                <Image
                  src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&h=400&fit=crop"
                  alt="EMSELLA® — body contouring treatment"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-[#17a2b8]/5 mix-blend-multiply pointer-events-none" aria-hidden />
              </div>
              <p className="text-lg font-semibold text-[#0F172A] tracking-tight">EMSELLA®</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES: Curated for You (Boutique Exhibit) ─────────── */}
      <section id="services" className="py-24 px-6 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">

          {/* Archival section header — shielded for extension scanning */}
          <div className="flex items-center gap-6 mb-14" suppressHydrationWarning>
            <div className="flex-1" suppressHydrationWarning>
              <div className="flex items-center gap-4 mb-3" suppressHydrationWarning>
                <span className="w-8 h-px bg-slate-200" />
                <p className="text-[9px] tracking-[0.45em] font-bold text-[#94A3B8] uppercase">
                  CURATED TREATMENTS · DOVER, DE
                </p>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-light text-[#0F172A]">
                Curated <span className="text-[#ef3825] italic">for You</span>
              </h2>
            </div>
            <Button
              variant="outline"
              className="border-slate-200 hover:border-[#17a2b8] hover:text-[#17a2b8] rounded-full px-8 transition-colors duration-300 self-start shrink-0"
            >
              View All Services
            </Button>
          </div>

          {/* 3-column Boutique Exhibit grid — medical-grade 800×1000 placeholders, white panels, shadow-2xl */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" suppressHydrationWarning>
            {SERVICES.map((service, i) => {
              const placeholders = [
                "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=1000&fit=crop",
                "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&h=1000&fit=crop",
                "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=1000&fit=crop",
              ];
              return (
                <div key={service.title} className="flex flex-col" suppressHydrationWarning>
                  <div className="rounded-2xl overflow-hidden bg-white shadow-2xl shadow-slate-300/40 flex flex-col" suppressHydrationWarning>
                    <div className="relative aspect-[800/1000] w-full" suppressHydrationWarning>
                      <Image
                        src={placeholders[i] ?? placeholders[0]}
                        alt={service.imageAlt}
                        fill
                        className="object-cover"
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-[#17a2b8]/5 mix-blend-multiply pointer-events-none" aria-hidden />
                    </div>
                    <div className="p-6 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold tracking-widest uppercase text-[#64748B]">{service.duration}</span>
                        <span className="bg-[#17a2b8]/10 text-[#17a2b8] text-xs font-bold px-3 py-1 rounded-full">From {service.price}</span>
                      </div>
                      <h3 className="font-serif text-xl font-semibold text-[#0F172A] leading-snug">{service.title}</h3>
                      <p className="text-sm text-[#64748B] leading-relaxed line-clamp-2">{service.description}</p>
                      <Button asChild className="mt-2 w-full bg-[#ef3825] hover:bg-[#17a2b8] text-white font-semibold rounded-xl shadow-sm">
                        <a href="/book">Book Now</a>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────── */}
      <ContactSection />

    </div>
  );
}
