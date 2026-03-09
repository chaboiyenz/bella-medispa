import { createAdminClient } from "@/lib/supabase/server";
import { CalendarDays, ShoppingBag, Stethoscope, Clock } from "lucide-react";
import Link from "next/link";

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-amber-500/20   text-amber-300",
  confirmed: "bg-[#17a2b8]/20  text-[#17a2b8]",
  completed: "bg-emerald-500/20 text-emerald-400",
  cancelled: "bg-red-500/15    text-red-400",
};

export default async function AdminDashboardPage() {
  const supabase = await createAdminClient();

  const [
    { count: totalBookings },
    { count: pendingBookings },
    { count: totalProducts },
    { count: totalServices },
  ] = await Promise.all([
    supabase.from("bookings").select("id", { count: "exact", head: true }),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("services").select("id", { count: "exact", head: true }),
  ]);

  const { data: recentBookings } = await supabase
    .from("bookings")
    .select("id, slot_start, status, services(name), profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    { label: "Total Bookings",   value: totalBookings   ?? 0, icon: CalendarDays, color: "#17a2b8", href: "/admin/bookings" },
    { label: "Pending",          value: pendingBookings ?? 0, icon: Clock,         color: "#f59e0b", href: "/admin/bookings" },
    { label: "Total Products",   value: totalProducts   ?? 0, icon: ShoppingBag,   color: "#ef3825", href: "/admin/products" },
    { label: "Active Services",  value: totalServices   ?? 0, icon: Stethoscope,   color: "#10b981", href: "/admin/services" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-white/40 mt-1">Business at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white/40 font-medium uppercase tracking-wide">
                {label}
              </span>
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${color}20` }}
              >
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{value}</p>
          </Link>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-white">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-xs text-[#17a2b8] hover:underline">
            View all
          </Link>
        </div>

        {!recentBookings?.length ? (
          <p className="text-white/30 text-sm py-4 text-center">No bookings yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-white/5">
            {recentBookings.map((b) => {
              const profile = b.profiles as unknown as { full_name: string | null } | null;
              const service = b.services as unknown as { name: string } | null;
              return (
                <div key={b.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm text-white font-medium">{profile?.full_name ?? "Unknown"}</p>
                    <p className="text-xs text-white/40">
                      {service?.name} &middot;{" "}
                      {new Date(b.slot_start).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[b.status] ?? ""}`}>
                    {b.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
