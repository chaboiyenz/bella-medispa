"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { AdminBadge } from "@/components/admin/AdminBadge";

// ── Slugify ────────────────────────────────────────────────────────────────

function toSlug(label: string): string {
  return label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[®™°©]/g, "")
    .replace(/[/\\]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Nav data ───────────────────────────────────────────────────────────────

const TREATMENTS = {
  aesthetics: [
    "Age Spots", "Brow / Lash", "LATISSE®",
    "Microdermabrasion", "PRP Hair", "SkinPen", "Diamond Glow",
  ],
  injectables: [
    "BOTOX®", "Dysport®", "JUVÉDERM®", "Restylane®",
    "Sculptra®", "PRP", "Daxxify®", "RHA Collection",
  ],
  laser: [
    "Laser Hair Removal", "Pigment Removal", "Skin Resurfacing",
    "Skin Tightening", "HALO Laser", "SkinTyte", "BBL / Forever Young",
  ],
  body: [
    "CoolSculpting®", "EmSculpt NEO", "Acne Scars",
    "Chemical Peels", "HydraFacial", "Oxygen Facial",
  ],
} as const;

const GALLERY_ITEMS = [
  "SkinTyte", "HALO Laser", "EmSculpt NEO",
  "SkinPen", "Laser Hair Removal", "BBL / Forever Young",
] as const;

const CAT_LABELS: Record<string, string> = {
  aesthetics:  "Aesthetics",
  injectables: "Injectables",
  laser:       "Laser",
  body:        "Body & Skin",
};

// ── Shared link base classes ───────────────────────────────────────────────

const NAV_LINK =
  "inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#17a2b8]";

// ── Skeleton — matches left-aligned layout ────────────────────────────────

function NavbarSkeleton() {
  return (
    <header
      suppressHydrationWarning
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
        {/* Logo */}
        <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse shrink-0" />
        {/* Nav links */}
        <div className="hidden lg:flex items-center gap-3">
          {[56, 80, 64, 60, 40, 56].map((w, i) => (
            <div key={i} className="h-3 rounded-full bg-slate-200/70 animate-pulse" style={{ width: w }} />
          ))}
        </div>
        {/* CTAs */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="w-8 h-8 rounded-full bg-slate-200/70 animate-pulse" />
          <div className="w-24 h-9 rounded-full bg-[#ef3825]/25 animate-pulse" />
        </div>
      </div>
    </header>
  );
}

// ── Active underline — cyan glow ───────────────────────────────────────────

function ActiveIndicator() {
  return (
    <span
      aria-hidden
      className="absolute -bottom-px left-2 right-2 h-[2px] rounded-full bg-[#17a2b8]"
      style={{ boxShadow: "0 0 6px rgba(23,162,184,0.55)" }}
    />
  );
}

// ── Treatment link → /treatments/[slug] ───────────────────────────────────

function TreatmentLink({ label }: { label: string }) {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={`/treatments/${toSlug(label)}`}
        className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#17a2b8] transition-colors duration-200 group py-0.5"
      >
        <ChevronRight
          aria-hidden
          className="w-3 h-3 shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-[#17a2b8] transition-all duration-200"
        />
        {label}
      </Link>
    </NavigationMenuLink>
  );
}

// ── Left Nav — Team · Treatments · Gallery ─────────────────────────────────
// Uses NavigationMenu for dropdown support.

function LeftNav() {
  const pathname = usePathname();
  const isTeam    = pathname.startsWith("/team");
  const isTreat   = pathname.startsWith("/treatments");
  const isGallery = pathname.startsWith("/gallery");

  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList className="gap-0.5">

        {/* Team */}
        <NavigationMenuItem className="relative">
          <NavigationMenuLink asChild>
            <Link
              href="/team"
              className={`${NAV_LINK} bg-transparent hover:bg-transparent ${
                isTeam ? "text-[#17a2b8] font-semibold" : "text-[#64748B] hover:text-[#17a2b8]"
              }`}
            >
              Team
            </Link>
          </NavigationMenuLink>
          {isTeam && <ActiveIndicator />}
        </NavigationMenuItem>

        {/* Treatments — 4-col mega menu */}
        <NavigationMenuItem className="relative">
          <NavigationMenuTrigger
            className={`text-sm font-medium bg-transparent hover:bg-transparent
              data-[state=open]:bg-transparent data-active:bg-transparent focus:bg-transparent
              transition-colors duration-200 ${
                isTreat ? "text-[#17a2b8] font-semibold" : "text-[#64748B] hover:text-[#17a2b8]"
              }`}
          >
            Treatments
          </NavigationMenuTrigger>
          {isTreat && <ActiveIndicator />}

          {/* 2px red top-border — clinical palette rule */}
          <NavigationMenuContent className="p-0! border-0! bg-transparent! shadow-none! overflow-visible!">
            <div className="w-[900px] max-w-[90vw] bg-white border-t-2 border-[#ef3825] shadow-md rounded-b-2xl overflow-hidden">
              <div className="grid grid-cols-2 md:grid-cols-4 p-6 gap-0">

                {/* Col A — Aesthetics */}
                <div className="flex flex-col gap-2.5 pr-5 border-r border-slate-100">
                  <h4 className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#ef3825] pb-2 border-b border-slate-100">
                    Aesthetics
                  </h4>
                  {TREATMENTS.aesthetics.map((t) => <TreatmentLink key={t} label={t} />)}
                </div>

                {/* Col B — Injectables */}
                <div className="flex flex-col gap-2.5 px-5 border-r border-slate-100">
                  <h4 className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#ef3825] pb-2 border-b border-slate-100">
                    Injectables
                  </h4>
                  {TREATMENTS.injectables.map((t) => <TreatmentLink key={t} label={t} />)}
                </div>

                {/* Col C — Laser */}
                <div className="flex flex-col gap-2.5 px-5 border-r border-slate-100">
                  <h4 className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#ef3825] pb-2 border-b border-slate-100">
                    Laser
                  </h4>
                  {TREATMENTS.laser.map((t) => <TreatmentLink key={t} label={t} />)}
                </div>

                {/* Col D — Body & Skin + editorial CTA */}
                <div className="flex flex-col gap-2.5 pl-5">
                  <h4 className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#ef3825] pb-2 border-b border-slate-100">
                    Body & Skin
                  </h4>
                  {TREATMENTS.body.map((t) => <TreatmentLink key={t} label={t} />)}

                  <div className="mt-3 bg-linear-gradient-to-br from-[#F8FAFC] to-[#EFF6FF] rounded-xl p-4 border border-[#F1F5F9] flex flex-col gap-3">
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <Image src="/bella.jpg" alt="Bella MediSpa" fill className="object-cover" />
                      <div className="absolute inset-0 bg-[#17a2b8]/15" />
                    </div>
                    <p className="text-xs italic text-[#64748B] leading-relaxed">
                      Not sure which treatment is right for you?
                    </p>
                    <Button
                      asChild
                      className="bg-[#ef3825] hover:bg-[#17a2b8] text-white text-xs font-semibold transition-colors duration-300 w-full rounded-lg h-8"
                    >
                      <Link href="/book">Free Consultation</Link>
                    </Button>
                  </div>
                </div>

              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Gallery — single-column dropdown */}
        <NavigationMenuItem className="relative">
          <NavigationMenuTrigger
            className={`text-sm font-medium bg-transparent hover:bg-transparent
              data-[state=open]:bg-transparent data-active:bg-transparent focus:bg-transparent
              transition-colors duration-200 ${
                isGallery ? "text-[#17a2b8] font-semibold" : "text-[#64748B] hover:text-[#17a2b8]"
              }`}
          >
            Gallery
          </NavigationMenuTrigger>
          {isGallery && <ActiveIndicator />}

          {/* 2px red top-border — clinical palette rule */}
          <NavigationMenuContent className="p-0! border-0! bg-transparent! shadow-none! overflow-visible!">
            <div className="w-[200px] bg-white border-t-2 border-[#ef3825] shadow-md rounded-b-2xl p-4">
              <h4 className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#ef3825] pb-2 mb-1 border-b border-slate-100">
                Results Gallery
              </h4>
              <ul className="flex flex-col gap-0.5">
                {GALLERY_ITEMS.map((item) => (
                  <li key={item}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={`/gallery/${toSlug(item)}`}
                        className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#17a2b8] hover:bg-[#F8FAFC] px-2 py-1.5 rounded-lg transition-colors duration-200 group"
                      >
                        <span
                          aria-hidden
                          className="w-1.5 h-1.5 rounded-full bg-[#17a2b8]/30 group-hover:bg-[#17a2b8] transition-colors shrink-0"
                        />
                        {item}
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

      </NavigationMenuList>
    </NavigationMenu>
  );
}

// ── Right Nav — EMSELLA® · Shop · Contact ─────────────────────────────────
// Plain links — no dropdowns. EMSELLA® uses #ef3825 as clinical priority.

function RightNav() {
  const pathname = usePathname();
  const isEsmella = pathname.startsWith("/esmella");
  const isShop    = pathname.startsWith("/shop");

  return (
    <nav suppressHydrationWarning className="flex items-center gap-0.5" aria-label="Secondary navigation">

      {/* ESMELLA® — #ef3825 at rest → #17a2b8 on active/hover */}
      <div className="relative">
        <Link
          href="/esmella"
          className={`${NAV_LINK} font-bold ${
            isEsmella ? "text-[#17a2b8]" : "text-[#ef3825] hover:text-[#17a2b8]"
          }`}
        >
          EMSELLA®
        </Link>
        {isEsmella && <ActiveIndicator />}
      </div>

      {/* Boutique */}
      <div className="relative">
        <Link
          href="/shop"
          className={`${NAV_LINK} ${
            isShop ? "text-[#17a2b8] font-semibold" : "text-[#64748B] hover:text-[#17a2b8]"
          }`}
        >
          Boutique
        </Link>
        {isShop && <ActiveIndicator />}
      </div>

      {/* Contact */}
      <Link
        href="/#contact"
        className={`${NAV_LINK} text-[#64748B] hover:text-[#17a2b8]`}
      >
        Contact
      </Link>

    </nav>
  );
}

// ── Mobile Drawer ──────────────────────────────────────────────────────────

function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          className="p-2 text-[#0F172A] lg:hidden"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[300px] bg-white p-0 border-r border-slate-200">

        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <Image src="/bella-icon.png" alt="Bella MediSpa" width={32} height={32} className="h-8 w-auto object-contain" />
          <span className="font-serif text-base font-semibold text-[#0F172A]">
            Bella <span className="text-[#ef3825]">MediSpa</span>
          </span>
        </div>

        {/* Scrollable nav */}
        <nav className="overflow-y-auto h-[calc(100vh-140px)] px-4 py-3 flex flex-col gap-0.5">

          <Link href="/team" onClick={close} className="px-3 py-2.5 text-sm font-medium text-[#0F172A] hover:text-[#17a2b8] hover:bg-[#F8FAFC] rounded-xl transition-colors">
            Team
          </Link>

          <Accordion type="multiple" className="w-full">

            {/* Treatments */}
            <AccordionItem value="treatments" className="border-none">
              <AccordionTrigger className="px-3 py-2.5 text-sm font-medium text-[#0F172A] hover:text-[#17a2b8] hover:bg-[#F8FAFC] rounded-xl hover:no-underline transition-colors">
                Treatments
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-2">
                {(Object.entries(TREATMENTS) as [string, readonly string[]][]).map(([cat, items]) => (
                  <div key={cat} className="mb-3 px-3">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#ef3825] mb-1.5 px-2">
                      {CAT_LABELS[cat]}
                    </p>
                    {items.map((item) => (
                      <Link
                        key={item}
                        href={`/treatments/${toSlug(item)}`}
                        onClick={close}
                        className="flex items-center gap-2 px-2 py-1.5 text-sm text-[#64748B] hover:text-[#17a2b8] rounded-lg transition-colors"
                      >
                        <span aria-hidden className="w-1 h-1 rounded-full bg-[#17a2b8] shrink-0" />
                        {item}
                      </Link>
                    ))}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Gallery */}
            <AccordionItem value="gallery" className="border-none">
              <AccordionTrigger className="px-3 py-2.5 text-sm font-medium text-[#0F172A] hover:text-[#17a2b8] hover:bg-[#F8FAFC] rounded-xl hover:no-underline transition-colors">
                Gallery
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-2 px-3">
                {GALLERY_ITEMS.map((item) => (
                  <Link
                    key={item}
                    href={`/gallery/${toSlug(item)}`}
                    onClick={close}
                    className="flex items-center gap-2 px-2 py-1.5 text-sm text-[#64748B] hover:text-[#17a2b8] rounded-lg transition-colors"
                  >
                    <span aria-hidden className="w-1 h-1 rounded-full bg-[#17a2b8] shrink-0" />
                    {item}
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>

          </Accordion>

          {/* EMSELLA® — #ef3825 clinical priority */}
          <Link href="/esmella" onClick={close} className="px-3 py-2.5 text-sm font-bold text-[#ef3825] hover:text-[#17a2b8] hover:bg-[#F8FAFC] rounded-xl transition-colors">
            EMSELLA®
          </Link>

          <Link href="/shop" onClick={close} className="px-3 py-2.5 text-sm font-medium text-[#0F172A] hover:text-[#17a2b8] hover:bg-[#F8FAFC] rounded-xl transition-colors">
            Boutique
          </Link>

          <Link href="/payments" onClick={close} className="px-3 py-2.5 text-sm font-medium text-[#0F172A] hover:text-[#17a2b8] hover:bg-[#F8FAFC] rounded-xl transition-colors">
            Payment Plans
          </Link>

          <Link href="/#contact" onClick={close} className="px-3 py-2.5 text-sm font-medium text-[#64748B] hover:text-[#17a2b8] hover:bg-[#F8FAFC] rounded-xl transition-colors">
            Contact
          </Link>

        </nav>

        {/* Pinned CTA */}
        <div className="absolute bottom-0 left-0 right-0 px-5 py-4 border-t border-slate-200 bg-white">
          <Button asChild className="w-full bg-[#ef3825] hover:bg-[#17a2b8] text-white font-semibold transition-colors duration-300 rounded-full">
            <Link href="/book" onClick={close}>Book Now</Link>
          </Button>
        </div>

      </SheetContent>
    </Sheet>
  );
}

// ── Navbar export ──────────────────────────────────────────────────────────

export function Navbar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return <NavbarSkeleton />;

  return (
    // suppressHydrationWarning: browser extensions (Grammarly, etc.) inject
    // attributes on <header> that cause false hydration mismatches.
    <header
      suppressHydrationWarning
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm animate-in fade-in duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">

        {/* ── Mobile hamburger (lg:hidden) ── */}
        <MobileNav />

        {/* ── Logo — far left ── */}
        <Link
          href="/"
          aria-label="Bella MediSpa — home"
          className="shrink-0"
        >
          <Image
            src="/bella-icon.png"
            alt="Bella MediSpa"
            width={150}
            height={150}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* ── Nav links — left-center, immediately after logo ── */}
        <div className="hidden lg:flex items-center">
          <LeftNav />
          <RightNav />
        </div>

        {/* ── CTAs — pushed to far right ── */}
        <div className="flex items-center gap-1.5 ml-auto">
          <AdminBadge />
          <Button
            asChild
            className="hidden md:inline-flex bg-[#ef3825] hover:bg-[#17a2b8] text-white font-semibold transition-colors duration-300 rounded-full px-5 text-sm shadow-sm shadow-[#ef3825]/30 hover:shadow-[#17a2b8]/30"
          >
            <Link href="/book">Book Now</Link>
          </Button>
        </div>

      </div>
    </header>
  );
}
