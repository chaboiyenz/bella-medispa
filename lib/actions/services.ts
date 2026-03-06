"use server";

import { createClient } from "@/lib/supabase/server";
import type { Service } from "@/types";

export async function getActiveServices(): Promise<Service[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("category")
    .order("name");

  if (error) throw new Error(error.message);
  return data ?? [];
}
