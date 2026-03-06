import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Payment Cancelled",
};

export default async function BookCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ booking_id?: string }>;
}) {
  const { booking_id } = await searchParams;

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-4 py-24">
      {/* Blobs */}
      <div className="fixed top-1/4 right-1/3 w-96 h-96 rounded-full bg-[#ef3825]/6 blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-[#17a2b8]/5 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="bg-white/50 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl shadow-slate-200/30 p-10 flex flex-col items-center gap-7 text-center">

          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-[#ef3825]/10 flex items-center justify-center">
            <XCircle className="w-10 h-10 text-[#ef3825]" />
          </div>

          {/* Heading */}
          <div>
            <h1 className="font-serif text-3xl font-semibold text-[#0F172A]">
              Payment Cancelled
            </h1>
            <p className="text-sm text-[#64748B] mt-2 leading-relaxed max-w-xs mx-auto">
              No charge was made. Your slot is still held for a short time —
              you can retry payment below.
            </p>
          </div>

          {/* Info box */}
          <div className="w-full bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4 text-left">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1.5">
              Good to know
            </p>
            <p className="text-sm text-amber-700 leading-relaxed">
              Unpaid bookings are automatically released after 24 hours.
              Complete payment now to secure your appointment.
            </p>
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

          {/* CTAs */}
          <div className="flex flex-col gap-3 w-full">
            {booking_id && (
              <Button
                asChild
                className="w-full bg-[#ef3825] hover:bg-[#17a2b8] text-white font-semibold rounded-full transition-colors duration-300"
              >
                <Link href={`/book/retry?booking_id=${booking_id}`}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry Payment
                </Link>
              </Button>
            )}
            <Button
              asChild
              variant="outline"
              className="w-full border-[#F1F5F9] hover:border-[#17a2b8] hover:text-[#17a2b8] rounded-full transition-colors duration-300"
            >
              <Link href="/book">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Start New Booking
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
