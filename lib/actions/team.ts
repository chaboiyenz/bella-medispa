"use server";

import { z } from "zod";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { TeamMember } from "@/types";

// ── Server-side validation guard (secondary shield) ───────────────────────────
const TeamMemberGuard = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(3, "Professional title must be at least 3 characters"),
});

// ── Auth guard ────────────────────────────────────────────────────────────
// All mutations go through this check before touching the DB.

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized: not signed in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden: admin only");
}

// ── Read ──────────────────────────────────────────────────────────────────

export async function getTeamMembers(): Promise<{
  members: TeamMember[];
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) return { members: [], error: error.message };
    return { members: data ?? [], error: null };
  } catch (err) {
    return {
      members: [],
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

// ── Create ────────────────────────────────────────────────────────────────

export type TeamMemberPayload = {
  name: string;
  role: string;
  credentials: string | null;
  license_no: string | null;
  bio: string | null;
  image_url: string | null;
  specializations: string[];
  display_order: number;
  is_active: boolean;
};

export async function addTeamMember(payload: TeamMemberPayload): Promise<TeamMember> {
  const guard = TeamMemberGuard.safeParse(payload);
  if (!guard.success) throw new Error(guard.error.issues[0].message);

  await requireAdmin();

  const admin = await createAdminClient();
  const { data, error } = await admin
    .from("team_members")
    .insert({
      name:            payload.name.trim(),
      role:            payload.role.trim(),
      credentials:     payload.credentials?.trim() || null,
      license_no:      payload.license_no?.trim() || null,
      bio:             payload.bio?.trim() || null,
      image_url:       payload.image_url || null,
      specializations: payload.specializations,
      display_order:   payload.display_order,
      is_active:       payload.is_active,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/team");
  return data;
}

// ── Update ────────────────────────────────────────────────────────────────

export async function updateTeamMember(
  id: string,
  payload: Partial<TeamMemberPayload>
): Promise<TeamMember> {
  const guard = TeamMemberGuard.partial().safeParse(payload);
  if (!guard.success) throw new Error(guard.error.issues[0].message);

  await requireAdmin();

  const admin = await createAdminClient();
  const { data, error } = await admin
    .from("team_members")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/team");
  return data;
}

// ── Delete ────────────────────────────────────────────────────────────────

export async function deleteTeamMember(id: string): Promise<void> {
  await requireAdmin();

  const admin = await createAdminClient();
  const { error } = await admin.from("team_members").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/team");
}
