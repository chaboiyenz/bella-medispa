import type { Metadata } from "next";
import { ContactSection } from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Bella MediSpa — Dover, DE. Book a consultation or send us a message.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pt-16">
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#0F172A] mb-2">
            Contact Us
          </h1>
          <p className="text-[#64748B] mb-10">
            Have a question or want to book a consultation? We&apos;d love to hear from you.
          </p>
          <ContactSection />
        </div>
      </section>
    </div>
  );
}
