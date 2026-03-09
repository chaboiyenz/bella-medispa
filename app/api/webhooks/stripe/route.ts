import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import type { Database } from "@/types";
import {
  sendBookingConfirmation,
  sendAdminNotification,
} from "@/lib/email";

// Raw body is required for Stripe signature verification — disable body parsing
export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Service-role Supabase client — bypasses RLS for webhook updates
function adminSupabase() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return new Response(`Webhook Error: ${err}`, { status: 400 });
  }

  // ── Handle events ─────────────────────────────────────────
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.booking_id;

      if (!bookingId) {
        console.warn("checkout.session.completed missing booking_id metadata");
        break;
      }

      const supabase = adminSupabase();
      const { error } = await supabase
        .from("bookings")
        .update({
          status:            "confirmed",
          stripe_session_id: session.id,
        })
        .eq("id", bookingId);

      if (error) {
        console.error("Failed to confirm booking:", error.message);
        return new Response("DB update failed", { status: 500 });
      }

      console.log(`Booking ${bookingId} confirmed via Stripe session ${session.id}`);

      // ── Send emails (non-critical — never fail the webhook response) ──────
      try {
        const { data: booking } = await supabase
          .from("bookings")
          .select("slot_start, slot_end, services(name, price), profiles(full_name, email)")
          .eq("id", bookingId)
          .single();

        if (booking) {
          const svc     = booking.services  as unknown as { name: string; price: number } | null;
          const profile = booking.profiles  as unknown as { full_name: string | null; email: string | null } | null;
          const clientEmail = profile?.email        ?? session.customer_email ?? null;
          const clientName  = profile?.full_name    ?? "Valued Client";
          const serviceName = svc?.name             ?? "Treatment";
          const price       = svc?.price            ?? 0;

          if (clientEmail) {
            await sendBookingConfirmation({
              to:          clientEmail,
              clientName,
              serviceName,
              price,
              slotStart:   booking.slot_start,
              slotEnd:     booking.slot_end,
              bookingId,
            });
          }

          await sendAdminNotification({
            clientName,
            clientEmail: clientEmail ?? "",
            serviceName,
            price,
            slotStart:   booking.slot_start,
            bookingId,
          });
        }
      } catch (emailErr) {
        // Log but do not propagate — Stripe must receive 200 regardless
        console.error("Email dispatch failed (non-critical):", emailErr);
      }

      break;
    }

    case "checkout.session.expired": {
      // Session expired without payment — cancel the pending booking to free the slot
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.booking_id;

      if (bookingId) {
        const supabase = adminSupabase();
        await supabase
          .from("bookings")
          .update({ status: "cancelled" })
          .eq("id", bookingId)
          .eq("status", "pending"); // only cancel if still pending
      }
      break;
    }

    default:
      // Ignore all other event types
      break;
  }

  return new Response("ok", { status: 200 });
}
