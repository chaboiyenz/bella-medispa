import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";

export default function TreatmentNotFound() {
  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-6 pt-16">
      <div className="bg-white/55 backdrop-blur-lg border border-white/50 rounded-3xl shadow-xl shadow-slate-200/30 p-12 max-w-md w-full text-center flex flex-col items-center gap-6">

        <span className="w-16 h-16 rounded-3xl bg-[#17a2b8]/10 flex items-center justify-center">
          <Search className="w-7 h-7 text-[#17a2b8]" />
        </span>

        <div>
          <h1 className="font-serif text-3xl font-light text-[#0F172A]">
            Treatment <span className="italic text-[#ef3825]">Not Found</span>
          </h1>
          <p className="text-sm text-[#64748B] mt-3 leading-relaxed">
            We couldn&apos;t find the treatment page you&apos;re looking for.
            It may have been moved or the link may be incorrect.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link href="/#services" className="flex-1">
            <Button
              variant="outline"
              className="w-full border-[#F1F5F9] hover:border-[#17a2b8] hover:text-[#17a2b8] rounded-full text-sm transition-colors duration-200 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              View All Services
            </Button>
          </Link>
          <Link href="/book" className="flex-1">
            <Button className="w-full bg-[#ef3825] hover:bg-[#17a2b8] text-white rounded-full text-sm transition-colors duration-300">
              Book a Consult
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
