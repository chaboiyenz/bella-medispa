"use server";

import { createClient } from "@/lib/supabase/server";

export interface BookedSlot {
  slot_start: string;
  slot_end: string;
}

/** Returns all non-cancelled bookings for a given date (YYYY-MM-DD). */
export async function getBookedSlots(date: string): Promise<{ data: BookedSlot[]; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_booked_slots", {
      p_date: date,
    });
    if (error) return { data: [], error: error.message };
    return { data: (data as BookedSlot[]) ?? [], error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load availability";
    return { data: [], error: message };
  }
}

export interface CreateBookingInput {
  service_id: string;
  slot_start: string; // ISO datetime
  slot_end: string;   // ISO datetime
  notes?: string;
}

export interface CreateBookingResult {
  id: string;
  error?: string;
}

/** Inserts a pending booking for the currently authenticated user. */
export async function createBooking(
  input: CreateBookingInput
): Promise<CreateBookingResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { id: "", error: "You must be signed in to book an appointment." };
  }

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      service_id:        input.service_id,
      client_id:         user.id,
      slot_start:        input.slot_start,
      slot_end:          input.slot_end,
      notes:             input.notes ?? null,
      status:            "pending" as const,
      stripe_session_id: null,
    })
    .select("id")
    .single();

  if (error) {
    // Postgres exclusion constraint violation
    if (error.code === "23P01") {
      return {
        id: "",
        error:
          "That time slot was just taken. Please choose a different time.",
      };
    }
    return { id: "", error: error.message };
  }

  return { id: data.id };
}
