"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ── Server-side validation guards (secondary shield) ──────────────────────────
const ProductGuard = z.object({
  name:  z.string().min(2, "Product name must be at least 2 characters"),
  price: z.number().min(0, "Price cannot be negative"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
});

const ServiceGuard = z.object({
  name:     z.string().min(2, "Service name must be at least 2 characters"),
  price:    z.number().min(0, "Price cannot be negative"),
  duration: z.number().int().min(1, "Duration must be at least 1 minute"),
});

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
  data: {
    name?:        string;
    description?: string | null;
    price?:       number;
    stock?:       number;
    category?:    string | null;
    image_url?:   string | null;
    is_active?:   boolean;
  }
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

export async function deleteProduct(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
}

export async function createProduct(data: {
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  image_url: string | null;
  is_active: boolean;
}) {
  const guard = ProductGuard.safeParse(data);
  if (!guard.success) throw new Error(guard.error.issues[0].message);

  const supabase = await createAdminClient();
  const { error } = await supabase.from("products").insert({ ...data, stripe_price_id: null });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
}

// ── Services ──────────────────────────────────────────────────

export async function createService(data: {
  name: string;
  description: string | null;
  price: number;
  duration: number;
  category: string | null;
  image_url: string | null;
  is_active: boolean;
}) {
  const guard = ServiceGuard.safeParse(data);
  if (!guard.success) throw new Error(guard.error.issues[0].message);

  const supabase = await createAdminClient();
  const { error } = await supabase.from("services").insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/services");
}

export async function updateService(
  id: string,
  data: {
    name?: string;
    description?: string | null;
    price?: number;
    duration?: number;
    category?: string | null;
    image_url?: string | null;
    is_active?: boolean;
  }
) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("services").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/services");
}

export async function deleteService(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/services");
}
