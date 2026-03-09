"use server";

import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";

export async function getActiveProducts(): Promise<{
  products: Product[];
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      // stock > 0 removed: let RLS + is_active be the single source of truth.
      // Seeded rows with stock = 0 were silently excluded by this filter.
      .order("category")
      .order("name");

    if (error) {
      console.error("[getActiveProducts] Supabase error:", error.code, error.message, error.hint);
      return { products: [], error: error.message };
    }

    console.log(`[getActiveProducts] fetched ${data?.length ?? 0} products`);
    return { products: data ?? [], error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[getActiveProducts] Unexpected error:", msg);
    return { products: [], error: msg };
  }
}
