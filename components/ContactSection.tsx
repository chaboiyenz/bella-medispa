"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitContactForm } from "@/lib/actions/contact";

type FormData = {
  name:    string;
  email:   string;
  phone:   string;
  message: string;
};
type FormErrors = Partial<Record<keyof FormData, string>>;

// ── Contact details ──────────────────────────────────────────────────────────

const CONTACT_ITEMS = [
  {
    icon: Mail,
    label: "Email",
    value: "info@bellamedispa.com",
    href:  "mailto:info@bellamedispa.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 302-736-6334",
    href:  "tel:+13027366334",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "435 S Dupont Hwy, Dover, DE 19901",
    href:  "https://www.google.com/maps/place/Bella+MediSpa/@39.1558956,-75.5122245,15z",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon – Sat · 9 AM – 6 PM",
    href:  null,
  },
];

// ── Field helper ─────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[#64748B] tracking-wide uppercase">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-[#ef3825]">{error}</p>}
    </div>
  );
}

const INPUT =
  "bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-[#0F172A] " +
  "placeholder:text-[#CBD5E1] focus:outline-none focus:border-[#17a2b8] focus:bg-white " +
  "transition-colors duration-200 w-full";

// ── Main component ────────────────────────────────────────────────────────────

export function ContactSection() {
  const [form, setForm]           = useState<FormData>({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors]       = useState<FormErrors>({});
  const [submitted, setSubmitted]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.email.trim())   e.email   = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                              e.email   = "Enter a valid email address";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    const result = await submitContactForm(form);
    setSubmitting(false);
    if (result.success) {
      setSubmitted(true);
    } else {
      setSubmitError(result.error ?? "Something went wrong. Please try again.");
    }
  }

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-[#17a2b8]">
            <span className="w-6 h-px bg-[#17a2b8]" />
            Get In Touch
            <span className="w-6 h-px bg-[#17a2b8]" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light mt-3 text-[#0F172A]">
            Contact <span className="text-[#ef3825]">Bella MediSpa</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ── Left: Info ── */}
          <div className="flex flex-col gap-8">
            <p className="text-base text-[#64748B] leading-relaxed max-w-md">
              Have a question about a treatment, want to book a free consultation,
              or just want to say hello? We&apos;d love to hear from you. Our team
              typically responds within one business day.
            </p>

            <div className="flex flex-col gap-5">
              {CONTACT_ITEMS.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#17a2b8]/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#17a2b8]" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#94a3b8]">
                      {label}
                    </span>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-sm font-medium text-[#0F172A] hover:text-[#17a2b8] transition-colors duration-200"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="text-sm font-medium text-[#0F172A]">{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Ambient illustration */}
            <div className="hidden lg:block mt-auto">
              <div className="rounded-3xl bg-linear-gradient-to-br from-[#17a2b8]/8 to-[#ef3825]/5 border border-[#F1F5F9] p-8">
                <p className="text-sm text-[#64748B] italic leading-relaxed">
                  &ldquo;Our goal is for every guest to leave feeling seen, cared for,
                  and more confident than when they arrived.&rdquo;
                </p>
                <p className="text-xs text-[#17a2b8] font-semibold mt-3">
                  — The Bella MediSpa Team
                </p>
              </div>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div className="bg-white rounded-3xl shadow-sm border border-[#F1F5F9] p-8 md:p-10">
            {submitted ? (
              /* Success state */
              <div className="h-full flex flex-col items-center justify-center gap-5 text-center py-12">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-[#0F172A]">
                    Message Sent!
                  </h3>
                  <p className="text-sm text-[#64748B] mt-2 max-w-xs">
                    Thank you for reaching out. We&apos;ll get back to you within
                    one business day.
                  </p>
                </div>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", message: "" }); }}
                  className="text-sm text-[#17a2b8] hover:underline transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Name *" error={errors.name}>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Jane Smith"
                      className={`${INPUT} ${errors.name ? "border-[#ef3825]" : ""}`}
                    />
                  </Field>
                  <Field label="Phone" error={errors.phone}>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 302-555-0100"
                      className={INPUT}
                    />
                  </Field>
                </div>

                <Field label="Email *" error={errors.email}>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    className={`${INPUT} ${errors.email ? "border-[#ef3825]" : ""}`}
                  />
                </Field>

                <Field label="Message *" error={errors.message}>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help…"
                    rows={5}
                    className={`${INPUT} resize-none ${errors.message ? "border-[#ef3825]" : ""}`}
                  />
                </Field>

                {submitError && (
                  <p className="text-xs text-[#ef3825] bg-[#ef3825]/6 border border-[#ef3825]/20 rounded-xl px-4 py-3 text-center">
                    {submitError}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#ef3825] hover:bg-[#17a2b8] text-white font-semibold rounded-full py-5 text-sm tracking-wide transition-colors duration-300 disabled:opacity-60 gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </Button>

                <p className="text-[11px] text-[#94a3b8] text-center">
                  We respect your privacy. Your information is never shared.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
