import { createAdminClient } from "@/lib/supabase/server";
import { updateBookingStatus } from "@/lib/actions/admin";

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-amber-500/20   text-amber-300",
  confirmed: "bg-[#17a2b8]/20  text-[#17a2b8]",
  completed: "bg-emerald-500/20 text-emerald-400",
  cancelled: "bg-red-500/15    text-red-400",
};

export default async function AdminBookingsPage() {
  const supabase = await createAdminClient();

  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      id, slot_start, slot_end, status, notes, created_at,
      services ( name, price, duration ),
      profiles ( full_name, email, phone )
    `)
    .order("slot_start", { ascending: true });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-semibold text-white">
          Bookings
        </h1>
        <p className="text-sm text-white/40 mt-1">
          {bookings?.length ?? 0} total appointments
        </p>
      </div>

      {!bookings?.length ? (
        <div className="text-center py-24 text-white/30 text-sm">
          No bookings yet. Run the database migrations and seed to get started.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs text-white/40 uppercase tracking-wide">
                <th className="pb-3 pr-6 font-medium">Client</th>
                <th className="pb-3 pr-6 font-medium">Service</th>
                <th className="pb-3 pr-6 font-medium">Date & Time</th>
                <th className="pb-3 pr-6 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings.map((b) => {
                const profile = b.profiles as unknown as { full_name: string | null; email: string | null; phone: string | null } | null;
                const service = b.services as unknown as { name: string; price: number; duration: number } | null;
                const start   = new Date(b.slot_start);
                const dateStr = start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                const timeStr = start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

                return (
                  <tr key={b.id} className="hover:bg-white/4 transition-colors">
                    <td className="py-4 pr-6">
                      <p className="text-white font-medium">{profile?.full_name ?? "—"}</p>
                      <p className="text-white/40 text-xs">{profile?.email}</p>
                      {profile?.phone && <p className="text-white/40 text-xs">{profile.phone}</p>}
                    </td>
                    <td className="py-4 pr-6">
                      <p className="text-white">{service?.name}</p>
                      <p className="text-white/40 text-xs">{service?.duration} min · ${service?.price}</p>
                    </td>
                    <td className="py-4 pr-6 whitespace-nowrap">
                      <p className="text-white">{dateStr}</p>
                      <p className="text-white/40 text-xs">{timeStr}</p>
                    </td>
                    <td className="py-4 pr-6">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[b.status] ?? ""}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        {b.status === "pending" && (
                          <form action={async () => {
                            "use server";
                            await updateBookingStatus(b.id, "confirmed");
                          }}>
                            <button type="submit" className="text-xs px-3 py-1.5 rounded-lg bg-[#17a2b8]/20 text-[#17a2b8] hover:bg-[#17a2b8]/30 transition-colors">
                              Confirm
                            </button>
                          </form>
                        )}
                        {b.status === "confirmed" && (
                          <form action={async () => {
                            "use server";
                            await updateBookingStatus(b.id, "completed");
                          }}>
                            <button type="submit" className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors">
                              Complete
                            </button>
                          </form>
                        )}
                        {b.status !== "cancelled" && (
                          <form action={async () => {
                            "use server";
                            await updateBookingStatus(b.id, "cancelled");
                          }}>
                            <button type="submit" className="text-xs px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors">
                              Cancel
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
