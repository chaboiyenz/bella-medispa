"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, Search, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartDrawer } from "@/components/shop/CartDrawer";
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
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// ── Data ──────────────────────────────────────────────────────────
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
};

const GALLERY_ITEMS = [
  "SkinTyte", "HALO Laser", "EmSculpt NEO",
  "SkinPen", "Laser Hair Removal", "BBL / Forever Young",
];

// ── Mount guard skeleton ──────────────────────────────────────────
function NavbarSkeleton() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/25 shadow-sm shadow-slate-200/40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo placeholder */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-full bg-slate-200/70 animate-pulse" />
          <div className="w-32 h-3.5 rounded-full bg-slate-200/70 animate-pulse" />
        </div>
        {/* Nav pill placeholders */}
        <div className="hidden lg:flex items-center gap-3">
          {[64, 44, 88, 60, 72, 80, 56].map((w, i) => (
            <div
              key={i}
              className="h-3 rounded-full bg-slate-200/70 animate-pulse"
              style={{ width: w }}
            />
          ))}
        </div>
        {/* Right actions placeholder */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-slate-200/70 animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-slate-200/70 animate-pulse" />
          <div className="w-24 h-9 rounded-full bg-[#ef3825]/25 animate-pulse" />
        </div>
      </div>
    </header>
  );
}

// ── Shared treatment link ─────────────────────────────────────────
function TreatmentLink({ label }: { label: string }) {
  return (
    <NavigationMenuLink asChild>
      <Link href="#"
        className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-[#17a2b8] transition-colors duration-200 group py-0.5">
        <ChevronRight className="w-3 h-3 shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-[#17a2b8] transition-all duration-200" />
        {label}
      </Link>
    </NavigationMenuLink>
  );
}

// ── Active underline indicator ────────────────────────────────────
function ActiveIndicator() {
  return (
    <span className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#17a2b8]" />
  );
}

// ── Desktop Mega Menu ─────────────────────────────────────────────
function DesktopNav() {
  const pathname = usePathname();

  return (
    // viewport={false} → each NavigationMenuContent anchors to its own NavigationMenuItem
    <NavigationMenu viewport={false}>
      <NavigationMenuList className="gap-0.5">

        <NavigationMenuItem className="relative">
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/" className="text-sm font-medium text-[#64748B] hover:text-[#0F172A] bg-transparent hover:bg-transparent">
              Home
            </Link>
          </NavigationMenuLink>
          {pathname === "/" && <ActiveIndicator />}
        </NavigationMenuItem>

        <NavigationMenuItem className="relative">
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="#" className="text-sm font-medium text-[#64748B] hover:text-[#0F172A] bg-transparent hover:bg-transparent">
              Team
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Treatments ── 4-col Mega Menu, anchored to this trigger */}
        <NavigationMenuItem className="relative">
          <NavigationMenuTrigger className="text-sm font-medium text-[#64748B] hover:text-[#0F172A] bg-transparent hover:bg-transparent data-[state=open]:bg-transparent data-active:bg-transparent focus:bg-transparent">
            Treatments
          </NavigationMenuTrigger>
          {/* Left-aligned to the trigger, not to the NavigationMenu root */}
          <NavigationMenuContent className="left-0 top-full mt-2 absolute">
            <div className="w-[900px] glass border-t-2 border-[#17a2b8] shadow-2xl shadow-slate-200/50 rounded-b-2xl overflow-hidden">
              <div className="grid grid-cols-4 p-6 gap-0">

                {/* Col A */}
                <div className="flex flex-col gap-2.5 pr-5 border-r border-slate-100">
                  <h4 className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#ef3825] pb-2 border-b border-slate-100">
                    Aesthetics
                  </h4>
                  {TREATMENTS.aesthetics.map((t) => <TreatmentLink key={t} label={t} />)}
                </div>

                {/* Col B */}
                <div className="flex flex-col gap-2.5 px-5 border-r border-slate-100">
                  <h4 className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#ef3825] pb-2 border-b border-slate-100">
                    Injectables
                  </h4>
                  {TREATMENTS.injectables.map((t) => <TreatmentLink key={t} label={t} />)}
                </div>

                {/* Col C */}
                <div className="flex flex-col gap-2.5 px-5 border-r border-slate-100">
                  <h4 className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#ef3825] pb-2 border-b border-slate-100">
                    Laser
                  </h4>
                  {TREATMENTS.laser.map((t) => <TreatmentLink key={t} label={t} />)}
                </div>

                {/* Col D — Body & CTA */}
                <div className="flex flex-col gap-2.5 pl-5">
                  <h4 className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#ef3825] pb-2 border-b border-slate-100">
                    Body & Skin
                  </h4>
                  {TREATMENTS.body.map((t) => <TreatmentLink key={t} label={t} />)}

                  <div className="mt-3 bg-linear-to-br from-[#F8FAFC] to-[#EFF6FF] rounded-xl p-4 border border-[#F1F5F9] flex flex-col gap-3">
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <Image src="/bella.jpg" alt="Bella MediSpa" fill className="object-cover" />
                      <div className="absolute inset-0 bg-[#17a2b8]/15" />
                    </div>
                    <p className="text-xs italic text-slate-500 leading-relaxed">
                      Not sure which treatment is right for you?
                    </p>
                    <Button className="bg-[#ef3825] hover:bg-[#17a2b8] text-white text-xs font-semibold transition-colors duration-300 w-full rounded-lg h-8">
                      Free Consultation
                    </Button>
                  </div>
                </div>

              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Gallery ── dropdown, anchored to this trigger */}
        <NavigationMenuItem className="relative">
          <NavigationMenuTrigger className="text-sm font-medium text-[#64748B] hover:text-[#0F172A] bg-transparent hover:bg-transparent data-[state=open]:bg-transparent data-active:bg-transparent focus:bg-transparent">
            Gallery
          </NavigationMenuTrigger>
          <NavigationMenuContent className="left-0 top-full mt-2 absolute">
            <div className="w-[220px] glass border-t-2 border-[#17a2b8] shadow-2xl shadow-slate-200/50 rounded-b-2xl p-4">
              <h4 className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#ef3825] pb-2 mb-1 border-b border-slate-100">
                Results Gallery
              </h4>
              <div className="flex flex-col gap-0.5">
                {GALLERY_ITEMS.map((item) => (
                  <NavigationMenuLink asChild key={item}>
                    <Link href="#"
                      className="flex items-center gap-2 text-sm text-slate-600 hover:text-[#17a2b8] hover:bg-[#F8FAFC] px-2 py-1.5 rounded-lg transition-colors duration-200 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#17a2b8]/30 group-hover:bg-[#17a2b8] transition-colors shrink-0" />
                      {item}
                    </Link>
                  </NavigationMenuLink>
                ))}
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* ESMELLA® — bold red */}
        <NavigationMenuItem className="relative">
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="#" className="text-sm font-bold text-[#0F172A] hover:text-[#17a2b8] bg-transparent hover:bg-transparent transition-colors duration-200">
              ESMELLA®
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem className="relative">
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="#" className="text-sm font-medium text-[#64748B] hover:text-[#0F172A] bg-transparent hover:bg-transparent">
              Payment Plans
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem className="relative">
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="#about" className="text-sm font-medium text-[#64748B] hover:text-[#0F172A] bg-transparent hover:bg-transparent">
              Contact
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

      </NavigationMenuList>
    </NavigationMenu>
  );
}

// ── Mobile Drawer ─────────────────────────────────────────────────
function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button aria-label={open ? "Close menu" : "Open menu"} className="p-2 text-[#0F172A] lg:hidden">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] bg-white/90 backdrop-blur-xl p-0 border-r border-white/30">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <Image src="/bella.jpg" alt="Bella MediSpa" width={32} height={32} className="rounded-full object-cover" />
          <span className="font-serif text-base font-semibold">
            Bella <span className="text-[#ef3825]">MediSpa</span>
          </span>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto h-[calc(100vh-140px)] px-4 py-3 flex flex-col gap-0.5">
          {["Home", "Team"].map((label) => (
            <Link key={label} href={label === "Home" ? "/" : "#"} onClick={() => setOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-[#0F172A] hover:text-[#17a2b8] hover:bg-[#F8FAFC] rounded-xl transition-colors">
              {label}
            </Link>
          ))}

          <Accordion type="multiple" className="w-full">
            {/* Treatments */}
            <AccordionItem value="treatments" className="border-none">
              <AccordionTrigger className="px-3 py-2.5 text-sm font-medium text-[#0F172A] hover:text-[#17a2b8] hover:bg-[#F8FAFC] rounded-xl hover:no-underline transition-colors">
                Treatments
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-2">
                {(Object.entries(TREATMENTS) as [string, string[]][]).map(([cat, items]) => (
                  <div key={cat} className="mb-3 px-3">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#ef3825] mb-1.5 px-2">
                      {cat === "body" ? "Body & Skin" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </p>
                    {items.map((item) => (
                      <Link key={item} href="#" onClick={() => setOpen(false)}
                        className="flex items-center gap-2 px-2 py-1.5 text-sm text-slate-600 hover:text-[#17a2b8] rounded-lg transition-colors">
                        <span className="w-1 h-1 rounded-full bg-[#17a2b8] shrink-0" />
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
                  <Link key={item} href="#" onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-2 py-1.5 text-sm text-slate-600 hover:text-[#17a2b8] rounded-lg transition-colors">
                    <span className="w-1 h-1 rounded-full bg-[#17a2b8] shrink-0" />
                    {item}
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* ESMELLA® bold red in mobile too */}
          <Link href="#" onClick={() => setOpen(false)}
            className="px-3 py-2.5 text-sm font-bold text-[#ef3825] hover:text-[#17a2b8] hover:bg-[#F8FAFC] rounded-xl transition-colors">
            ESMELLA®
          </Link>

          {["Payment Plans", "Contact"].map((label) => (
            <Link key={label} href={label === "Contact" ? "#about" : "#"} onClick={() => setOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-[#0F172A] hover:text-[#17a2b8] hover:bg-[#F8FAFC] rounded-xl transition-colors">
              {label}
            </Link>
          ))}
        </div>

        {/* Pinned CTA */}
        <div className="absolute bottom-0 left-0 right-0 px-5 py-4 border-t border-slate-100 bg-white/80 backdrop-blur-sm">
          <Button className="w-full bg-[#ef3825] hover:bg-[#17a2b8] text-white font-semibold transition-colors duration-300 rounded-full">
            Book Now
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── Export ────────────────────────────────────────────────────────
export function Navbar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // First pass: render skeleton to prevent layout shift during hydration
  if (!mounted) return <NavbarSkeleton />;

  // Second pass: real Navbar materialises with a smooth fade-in
  return (
    <header className="fixed top-0 left-0 right-0 z-50 animate-float-slow glass border-b border-white/25 shadow-sm shadow-slate-200/40 transition-opacity duration-700 opacity-100 animate-in fade-in">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image src="/bella.jpg" alt="Bella MediSpa" width={36} height={36}
            className="rounded-full object-cover ring-2 ring-white/60 shadow-sm" />
          <span className="font-serif text-lg font-semibold tracking-wide text-[#0F172A]">
            Bella <span className="text-[#ef3825]">MediSpa</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center flex-1 justify-center">
          <DesktopNav />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/shop" className="hidden md:flex p-2 text-[#64748B] hover:text-[#17a2b8] transition-colors rounded-full hover:bg-white/60 text-xs font-medium">
            Shop
          </Link>
          <CartDrawer />
          <button aria-label="Search"
            className="hidden md:flex p-2 text-[#64748B] hover:text-[#17a2b8] transition-colors rounded-full hover:bg-white/60">
            <Search className="w-4 h-4" />
          </button>
          <Button asChild className="hidden md:inline-flex bg-[#ef3825] hover:bg-[#17a2b8] text-white font-semibold transition-colors duration-300 rounded-full px-5 text-sm shadow-sm shadow-[#ef3825]/30 hover:shadow-[#17a2b8]/30">
            <Link href="/book">Book Now</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
