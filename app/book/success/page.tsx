import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Booking Confirmed",
};

export default async function BookSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  // Optionally retrieve session details to show richer confirmation
  let serviceName = "";
  let amountPaid  = "";

  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ["line_items"],
      });
      serviceName = session.line_items?.data[0]?.description ?? "";
      const cents = session.amount_total ?? 0;
      amountPaid  = `$${(cents / 100).toFixed(2)}`;
    } catch {
      // Non-critical — page still renders without it
    }
  }

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-4 py-24">
      {/* Blobs */}
      <div className="fixed top-1/4 left-1/3 w-96 h-96 rounded-full bg-[#17a2b8]/8 blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-[#ef3825]/5 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="bg-white/50 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl shadow-slate-200/30 p-10 flex flex-col items-center gap-7 text-center">

          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-[#17a2b8]/10 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-[#17a2b8]" />
          </div>

          {/* Heading */}
          <div>
            <h1 className="font-serif text-3xl font-semibold text-[#0F172A]">
              You&apos;re Confirmed!
            </h1>
            <p className="text-sm text-[#64748B] mt-2 leading-relaxed">
              Your appointment has been confirmed and payment received.
              A receipt has been sent to your email.
            </p>
          </div>

          {/* Details strip */}
          {(serviceName || amountPaid) && (
            <div className="w-full bg-[#F8FAFC] border border-[#F1F5F9] rounded-2xl p-5 flex flex-col gap-3 text-left">
              {serviceName && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[#17a2b8] shrink-0" />
                  <div>
                    <p className="text-[10px] text-[#94a3b8] uppercase tracking-wide">Treatment</p>
                    <p className="text-sm font-medium text-[#0F172A]">{serviceName}</p>
                  </div>
                </div>
              )}
              {amountPaid && (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 flex items-center justify-center shrink-0">
                    <span className="text-[#17a2b8] font-bold text-sm">$</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#94a3b8] uppercase tracking-wide">Paid</p>
                    <p className="text-sm font-medium text-[#0F172A]">{amountPaid}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* What's next */}
          <div className="w-full bg-[#17a2b8]/5 border border-[#17a2b8]/20 rounded-2xl px-5 py-4 text-left">
            <p className="text-xs font-bold text-[#17a2b8] uppercase tracking-wide mb-2">
              What happens next?
            </p>
            <ul className="text-sm text-[#64748B] space-y-1.5">
              <li>• Our team will send a reminder 24 hrs before your visit.</li>
              <li>• Arrive 10 minutes early for your consultation.</li>
              <li>• Questions? Call <a href="tel:+13027366334" className="text-[#17a2b8] font-medium">+1 302-736-6334</a></li>
            </ul>
          </div>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image
              src="/bella.jpg"
              alt="Bella MediSpa"
              width={28}
              height={28}
              className="rounded-full object-cover"
            />
            <span className="text-sm font-serif font-semibold text-[#0F172A]">
              Bella <span className="text-[#ef3825]">MediSpa</span>
            </span>
          </div>

          <Button asChild className="w-full bg-[#ef3825] hover:bg-[#17a2b8] text-white font-semibold rounded-full transition-colors duration-300">
            <Link href="/">
              Back to Home
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
