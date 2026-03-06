"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ── Bookings ──────────────────────────────────────────────────
export async function updateBookingStatus(
  bookingId: string,
  status: "confirmed" | "cancelled" | "completed"
) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", bookingId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/bookings");
}

// ── Products ──────────────────────────────────────────────────
export async function updateProduct(
  id: string,
  data: { price?: number; stock?: number; is_active?: boolean }
) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("products")
    .update(data)
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
}

export async function toggleProductActive(id: string, is_active: boolean) {
  return updateProduct(id, { is_active });
}
