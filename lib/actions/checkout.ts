"use server";

import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { getURL } from "@/lib/utils";

export interface CheckoutResult {
  url?: string;
  error?: string;
}

export async function createCheckoutSession(
  bookingId: string
): Promise<CheckoutResult> {
  const supabase = await createClient();

  // Verify the booking belongs to the current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Not authenticated." };
  }

  // Fetch booking + service in one query
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("*, services(*)")
    .eq("id", bookingId)
    .eq("client_id", user.id)
    .single();

  if (bookingError || !booking) {
    return { error: "Booking not found." };
  }

  if (booking.status !== "pending") {
    return { error: "This booking has already been paid or cancelled." };
  }

  const service = booking.services as {
    name: string;
    price: number;
    duration: number;
  };

  // Resolve the base URL for this deployment environment
  const baseUrl = getURL();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email ?? undefined,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round(service.price * 100), // cents
          product_data: {
            name: service.name,
            description: `${service.duration}-minute treatment at Bella MediSpa · Dover, DE`,
            images: [`${baseUrl}/bella.jpg`],
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      booking_id: bookingId,
    },
    success_url: `${baseUrl}/book/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${baseUrl}/book/cancel?booking_id=${bookingId}`,
  });

  return { url: session.url! };
}
