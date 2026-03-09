import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Booking Cancelled",
};

export default async function BookCancelPage() {
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
              Booking Cancelled
            </h1>
            <p className="text-sm text-[#64748B] mt-2 leading-relaxed max-w-xs mx-auto">
              No problem. You can start a new booking whenever you&apos;re ready.
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

          <Button
            asChild
            className="w-full bg-[#ef3825] hover:bg-[#17a2b8] text-white font-semibold rounded-full transition-colors duration-300"
          >
            <Link href="/book">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Start New Booking
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
