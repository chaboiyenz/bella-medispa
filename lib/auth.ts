import { createClient } from "@/lib/supabase/server";

/**
 * Server-side helper — returns true if the current session belongs to an admin.
 * Safe to call in Server Components, layouts, and server actions.
 * Returns false (not throws) when unauthenticated.
 */
export async function getAdminStatus(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    return data?.role === "admin";
  } catch {
    return false;
  }
}
