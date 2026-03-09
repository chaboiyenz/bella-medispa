import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

const NAV_LINKS = [
  { label: "Treatments",  href: "/treatments" },
  { label: "Boutique",    href: "/shop" },
  { label: "Our Team",    href: "/team" },
  { label: "eSMELLA",    href: "/esmella" },
  { label: "Book Now",    href: "/book" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy",     href: "/privacy" },
  { label: "Terms of Service",   href: "/terms" },
];

export function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white" suppressHydrationWarning>
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-10" suppressHydrationWarning>

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12" suppressHydrationWarning>

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-serif text-2xl font-bold tracking-tight">
                Bella <span className="text-[#ef3825]">MediSpa</span>
              </p>
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#17a2b8] mt-1">
                Dover, Delaware
              </p>
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Board-certified aesthetic practitioners united by a shared
              commitment to clinical excellence and naturally beautiful results.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/30 mb-5">
              Quick Links
            </p>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div suppressHydrationWarning>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/30 mb-5">
              Contact
            </p>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#17a2b8] shrink-0 mt-0.5" />
                <span className="text-sm text-white/60 leading-snug">
                  435 S Dupont Hwy<br />Dover, DE 19901
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#17a2b8] shrink-0" />
                <a
                  href="tel:+13027366334"
                  className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                >
                  +1 302-736-6334
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#17a2b8] shrink-0" />
                <a
                  href="mailto:info@bellamedispa.com"
                  className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                >
                  info@bellamedispa.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="h-px bg-white/8 mb-8" suppressHydrationWarning />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4" suppressHydrationWarning>
          <p className="text-xs text-white/30 text-center sm:text-left">
            &copy; {new Date().getFullYear()} Bella MediSpa. All rights reserved.
          </p>
          <ul className="flex items-center gap-6">
            {LEGAL_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-xs text-white/30 hover:text-white/60 transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </footer>
  );
}
