import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { LayoutDashboard, CalendarDays, ShoppingBag, Stethoscope, MessageSquare, LogOut } from "lucide-react";
import { signOut } from "@/lib/actions/auth";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard",  icon: LayoutDashboard },
  { href: "/admin/bookings",  label: "Bookings",   icon: CalendarDays },
  { href: "/admin/products",  label: "Products",   icon: ShoppingBag },
  { href: "/admin/services",  label: "Services",   icon: Stethoscope },
  { href: "/admin/faqs",      label: "FAQ Engine", icon: MessageSquare },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/admin/bookings");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") redirect("/");

  return (
    <div className="min-h-screen flex bg-[#0F172A] text-white pt-16" suppressHydrationWarning>

      {/* Sidebar */}
      <aside className="w-60 shrink-0 flex flex-col border-r border-white/10 px-4 py-6 gap-6" suppressHydrationWarning>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 px-2">
          <Image
            src="/bella.jpg"
            alt="Bella MediSpa"
            width={32}
            height={32}
            className="rounded-full object-cover opacity-90"
          />
          <span className="font-serif text-sm font-semibold">
            Bella <span className="text-[#ef3825]">Admin</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/8 transition-all duration-200"
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* User + sign out */}
        <div className="flex flex-col gap-1 border-t border-white/10 pt-4">
          <p className="px-3 text-xs text-white/40 truncate">
            {profile.full_name ?? user.email}
          </p>
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/8 transition-all duration-200 w-full"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto" suppressHydrationWarning>{children}</main>
    </div>
  );
}
