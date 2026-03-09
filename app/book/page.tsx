import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { getActiveServices } from "@/lib/actions/services";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Schedule your aesthetic treatment at Bella MediSpa in Dover, DE. Choose your service, pick a time, and confirm in minutes.",
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service: serviceId } = await searchParams;

  const { data: services = [], error: servicesError } = await getActiveServices();

  return (
    <div className="min-h-screen mesh-bg text-[#0F172A] pt-16">
      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-[#17a2b8]">
            <span className="w-6 h-px bg-[#17a2b8]" />
            Online Booking
            <span className="w-6 h-px bg-[#17a2b8]" />
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-light mt-3 text-[#0F172A]">
            Book Your <span className="text-[#ef3825] italic">Treatment</span>
          </h1>
          <p className="text-sm text-[#64748B] mt-3 max-w-md mx-auto leading-relaxed">
            Select a service, choose your preferred time, and we&apos;ll confirm
            within 24 hours.
          </p>
        </div>

        {servicesError && (
          <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-center">
            {servicesError}
          </p>
        )}
        <BookingWizard services={services} initialServiceId={serviceId} />

        {/* Trust bar */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-[#94a3b8]">
          {[
            "🔒 Secure & Private",
            "📍 435 S Dupont Hwy, Dover, DE",
            "📞 +1 302-736-6334",
          ].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
