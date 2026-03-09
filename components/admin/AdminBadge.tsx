"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { useAdminMode } from "@/lib/context/AdminModeContext";

/**
 * Renders only when the current session is an admin.
 * Placed in the Navbar's right action strip.
 */
export function AdminBadge() {
  const { isAdmin } = useAdminMode();
  if (!isAdmin) return null;

  return (
    <Link
      href="/admin/dashboard"
      className={[
        "hidden md:inline-flex items-center gap-1.5",
        "px-3 py-1.5 rounded-full",
        "bg-amber-500/10 border border-amber-400/40",
        "text-[10px] font-bold tracking-[0.18em] uppercase text-amber-600",
        "hover:bg-amber-500/20 transition-colors duration-200",
        "shadow-[0_0_12px_rgba(245,158,11,0.25)]",
      ].join(" ")}
    >
      <Shield className="w-3 h-3 shrink-0" />
      Admin Mode
    </Link>
  );
}
