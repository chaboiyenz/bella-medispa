"use server";

import { createClient } from "@/lib/supabase/server";
import type { Service } from "@/types";

export async function getActiveServices(): Promise<{ data: Service[]; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("services")
      .select("id, name, description, price, duration, image_url, category, is_active, created_at")
      .eq("is_active", true)
      .order("category")
      .order("name");

    if (error) return { data: [], error: error.message };
    return { data: data ?? [], error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load services";
    return { data: [], error: message };
  }
}
