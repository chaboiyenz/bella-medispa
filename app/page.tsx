import type { Metadata } from "next";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/ServiceCard";
import { ChatBubble } from "@/components/ChatBubble";

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
    imageSrc: "/bella.jpg",
    imageAlt: "HydraFacial treatment",
  },
  {
    title: "Collagen Microneedling",
    description:
      "Precision micro-channels stimulate your skin's natural collagen production, smoothing fine lines and improving overall skin texture.",
    duration: "75 MINS",
    price: "$299",
    imageSrc: "/bella.jpg",
    imageAlt: "Microneedling treatment",
  },
  {
    title: "Laser Skin Resurfacing",
    description:
      "Advanced fractional laser technology targets pigmentation, scarring, and uneven tone for visibly clearer, smoother skin.",
    duration: "45 MINS",
    price: "$349",
    imageSrc: "/bella.jpg",
    imageAlt: "Laser skin resurfacing",
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Consultation",
    description:
      "We assess your skin, understand your goals, and design a personalised treatment plan.",
  },
  {
    step: "02",
    title: "Treatment",
    description:
      "Expert clinicians deliver your chosen treatment in a calm, sterile environment.",
  },
  {
    step: "03",
    title: "Aftercare",
    description:
      "We guide you through recovery and schedule follow-ups to maximise your results.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen mesh-bg text-[#0F172A] font-sans pt-16">

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Left: Typography */}
          <div className="flex flex-col gap-7">
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
            <div className="flex gap-10 pt-4 border-t border-[#F1F5F9]">
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

          {/* Right: Floating image */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-[#17a2b8]/10 ring-1 ring-white/40">
              <Image
                src="/bella.jpg"
                alt="Bella MediSpa treatment"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-[#17a2b8]/10 mix-blend-multiply" />
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
        {/* Drifting blobs */}
        <div className="absolute top-1/4 left-1/4 w-[480px] h-[480px] rounded-full bg-[#ef3825]/5 blur-3xl animate-drift-1 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#17a2b8]/5 blur-3xl animate-drift-2 pointer-events-none" />

        {/* Glass card */}
        <div className="relative max-w-4xl mx-auto animate-fade-in-up">
          <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl shadow-slate-200/30 p-10 md:p-14 flex flex-col items-center gap-8 text-center">

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

      {/* ── SERVICES ────────────────────────────────────────────── */}
      <section id="services" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-[#17a2b8]">
                <span className="w-6 h-px bg-[#17a2b8]" />
                Our Treatments
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-light mt-2 text-[#0F172A]">
                Curated <span className="text-[#ef3825]">for You</span>
              </h2>
            </div>
            <Button
              variant="outline"
              className="border-[#F1F5F9] hover:border-[#17a2b8] hover:text-[#17a2b8] rounded-full px-8 transition-colors duration-300 self-start sm:self-auto"
            >
              View All Services
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR PROCESS ─────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-[#17a2b8]">
              <span className="w-6 h-px bg-[#17a2b8]" />
              How It Works
              <span className="w-6 h-px bg-[#17a2b8]" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light mt-3 text-[#0F172A]">
              Simple. <span className="text-[#ef3825]">Seamless.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROCESS_STEPS.map(({ step, title, description }) => (
              <div
                key={step}
                className="glass rounded-3xl p-8 border border-white/30 flex flex-col gap-4 hover:shadow-lg hover:shadow-[#17a2b8]/10 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#17a2b8]/10 flex items-center justify-center">
                  <span className="text-[#17a2b8] font-bold text-sm tracking-widest">
                    {step}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-[#0F172A]">{title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer id="about" className="bg-[#0F172A] text-white/60 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/bella.jpg"
                alt="Bella MediSpa"
                width={36}
                height={36}
                className="rounded-full object-cover opacity-90"
              />
              <span className="font-serif text-white text-lg font-semibold">
                Bella <span className="text-[#ef3825]">MediSpa</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs text-white/40">
              Premium aesthetic treatments in a calm, clinical environment.
              Expert clinicians. Real results.
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold tracking-[0.25em] uppercase text-[#17a2b8]">
              Contact
            </h4>
            <p className="text-sm">info@bellamedispa.com</p>
            <a
              href="tel:+13027366334"
              className="text-sm hover:text-[#17a2b8] transition-colors duration-200"
            >
              +1 302-736-6334
            </a>
            <a
              href="https://www.google.com/maps/place/Bella+MediSpa/@39.1558956,-75.5122245,15z/data=!4m6!3m5!1s0x89c7655b38b9ca53:0xcbf1efe98c9e4db4!8m2!3d39.1558999!4d-75.5122342!16s%2Fg%2F11q83_cs90?entry=ttu&g_ep=EgoyMDI2MDMwMi4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-[#17a2b8] transition-colors duration-200"
            >
              435 S Dupont Hwy, Dover, DE 19901
            </a>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold tracking-[0.25em] uppercase text-[#17a2b8]">
              Connect
            </h4>
            <a
              href="https://www.instagram.com/bella_medispa_/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-[#17a2b8] transition-colors duration-200"
            >
              Instagram
            </a>
            <a
              href="https://www.facebook.com/DelawareMediSpa/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-[#17a2b8] transition-colors duration-200"
            >
              Facebook
            </a>
            <a
              href="https://www.google.com/maps/place/Bella+MediSpa/@39.1558956,-75.5122245,15z/data=!4m6!3m5!1s0x89c7655b38b9ca53:0xcbf1efe98c9e4db4!8m2!3d39.1558999!4d-75.5122342!16s%2Fg%2F11q83_cs90?entry=ttu&g_ep=EgoyMDI2MDMwMi4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-[#17a2b8] transition-colors duration-200"
            >
              Google Maps
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/30">
          <span>&copy; {new Date().getFullYear()} Bella MediSpa. All rights reserved.</span>
          <span>Built with care for wellness.</span>
        </div>
      </footer>

      {/* ── AI CONCIERGE CHAT BUBBLE ────────────────────────────── */}
      <ChatBubble />

    </div>
  );
}
