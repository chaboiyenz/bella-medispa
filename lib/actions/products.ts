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
        .select("id, name, description, price, image_url, stock, category, is_active, created_at")
        .eq("is_active", true)
        // stock > 0 removed: let RLS + is_active be the single source of truth.
        // Seeded rows with stock = 0 were silently excluded by this filter.
        .order("category")
        .order("name");

      if (error) return { products: [], error: error.message };
      return { products: data ?? [], error: null };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      return { products: [], error: msg };
    }
  }
