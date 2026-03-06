import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import type { Database } from "@/types";

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
