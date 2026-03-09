"use client";

import { useState, useTransition, useCallback } from "react";
import Image from "next/image";
import {
  CheckCircle,
  Calendar,
  Clock,
  User,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBookedSlots, createBooking } from "@/lib/actions/booking";
import type { Service } from "@/types";

// ── Types ─────────────────────────────────────────────────────
type Step = "service" | "datetime" | "details" | "confirm";

interface WizardState {
  service:    Service | null;
  date:       string; // YYYY-MM-DD
  time:       string; // HH:MM (24h)
  name:       string;
  email:      string;
  phone:      string;
  notes:      string;
  bookingId:  string;
}

const INITIAL: WizardState = {
  service: null, date: "", time: "",
  name: "", email: "", phone: "", notes: "", bookingId: "",
};

const STEPS: Step[] = ["service", "datetime", "details", "confirm"];

const STEP_LABELS: Record<Step, string> = {
  service:  "Service",
  datetime: "Date & Time",
  details:  "Your Details",
  confirm:  "Confirmed",
};

const STEP_ICONS: Record<Step, React.ElementType> = {
  service:  Stethoscope,
  datetime: Calendar,
  details:  User,
  confirm:  CheckCircle,
};

// ── Business hours helpers ─────────────────────────────────────
const BUSINESS_START = 9 * 60;  // 9:00 AM in minutes
const BUSINESS_END   = 18 * 60; // 6:00 PM in minutes
const SLOT_INTERVAL  = 30;      // every 30 min

function generateTimeSlots(durationMins: number): string[] {
  const slots: string[] = [];
  for (let t = BUSINESS_START; t + durationMins <= BUSINESS_END; t += SLOT_INTERVAL) {
    const h = Math.floor(t / 60).toString().padStart(2, "0");
    const m = (t % 60).toString().padStart(2, "0");
    slots.push(`${h}:${m}`);
  }
  return slots;
}

function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour   = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

function isSlotAvailable(
  date: string,
  time: string,
  durationMins: number,
  booked: { slot_start: string; slot_end: string }[]
): boolean {
  const slotStart = new Date(`${date}T${time}:00`);
  const slotEnd   = new Date(slotStart.getTime() + durationMins * 60_000);

  return !booked.some(({ slot_start, slot_end }) => {
    const bs = new Date(slot_start);
    const be = new Date(slot_end);
    return slotStart < be && slotEnd > bs;
  });
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

// ── Category badge colour ──────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  aesthetics:  "bg-purple-50  text-purple-600",
  injectables: "bg-pink-50    text-pink-600",
  laser:       "bg-amber-50   text-amber-600",
  body:        "bg-teal-50    text-teal-600",
};

// ── Step indicator ─────────────────────────────────────────────
function StepIndicator({ current }: { current: Step }) {
  const currentIdx = STEPS.indexOf(current);
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {STEPS.map((step, idx) => {
        const Icon = STEP_ICONS[step];
        const done    = idx < currentIdx;
        const active  = idx === currentIdx;
        return (
          <div key={step} className="flex items-center gap-2">
            <div className={`
              flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold transition-all duration-300
              ${done   ? "bg-[#17a2b8] text-white shadow-sm shadow-[#17a2b8]/30" : ""}
              ${active ? "bg-[#ef3825] text-white shadow-md shadow-[#ef3825]/30 scale-110" : ""}
              ${!done && !active ? "bg-[#F1F5F9] text-[#94a3b8]" : ""}
            `}>
              {done ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
            </div>
            <span className={`hidden sm:block text-xs font-medium transition-colors ${active ? "text-[#ef3825]" : done ? "text-[#17a2b8]" : "text-[#94a3b8]"}`}>
              {STEP_LABELS[step]}
            </span>
            {idx < STEPS.length - 1 && (
              <div className={`w-8 h-px mx-1 transition-colors ${idx < currentIdx ? "bg-[#17a2b8]" : "bg-[#F1F5F9]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Step 1: Service Picker ────────────────────────────────────
function ServiceStep({
  services,
  selected,
  onSelect,
}: {
  services: Service[];
  selected: Service | null;
  onSelect: (s: Service) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <h2 className="font-serif text-2xl font-semibold text-[#0F172A]">
          Choose a Treatment
        </h2>
        <p className="text-sm text-[#64748B] mt-1">
          Select the service you&apos;d like to book
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1 no-scrollbar">
        {services.map((svc) => {
          const isSelected = selected?.id === svc.id;
          const catClass = CATEGORY_COLORS[svc.category ?? "body"] ?? CATEGORY_COLORS.body;
          return (
            <button
              key={svc.id}
              onClick={() => onSelect(svc)}
              className={`
                text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col gap-2
                ${isSelected
                  ? "border-[#ef3825] bg-[#ef3825]/5 shadow-md shadow-[#ef3825]/10"
                  : "border-[#F1F5F9] bg-white/60 hover:border-[#17a2b8]/40 hover:bg-[#17a2b8]/5"
                }
              `}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold text-sm text-[#0F172A] leading-snug">
                  {svc.name}
                </span>
                {isSelected && (
                  <CheckCircle className="w-4 h-4 text-[#ef3825] shrink-0 mt-0.5" />
                )}
              </div>
              {svc.description && (
                <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2">
                  {svc.description}
                </p>
              )}
              <div className="flex items-center justify-between pt-1">
                <span className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full ${catClass}`}>
                  {svc.duration} min
                </span>
                <span className="text-sm font-bold text-[#0F172A]">
                  ${svc.price.toLocaleString()}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 2: Date & Time Picker ────────────────────────────────
function DateTimeStep({
  service,
  date,
  time,
  onDate,
  onTime,
}: {
  service: Service;
  date: string;
  time: string;
  onDate: (d: string) => void;
  onTime: (t: string) => void;
}) {
  const [bookedSlots, setBookedSlots]   = useState<{ slot_start: string; slot_end: string }[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError]     = useState("");

  const fetchSlots = useCallback(async (d: string) => {
    if (!d) return;
    setLoadingSlots(true);
    setSlotsError("");
    onTime("");
    try {
      const { data, error } = await getBookedSlots(d);
      setBookedSlots(data);
      if (error) setSlotsError(error);
    } catch {
      setSlotsError("Could not load availability. Please try again.");
    } finally {
      setLoadingSlots(false);
    }
  }, [onTime]);

  const handleDateChange = (d: string) => {
    onDate(d);
    fetchSlots(d);
  };

  const allSlots = generateTimeSlots(service.duration);

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="font-serif text-2xl font-semibold text-[#0F172A]">
          Pick a Date & Time
        </h2>
        <p className="text-sm text-[#64748B] mt-1">
          {service.name} &middot; {service.duration} min
        </p>
      </div>

      {/* Date input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold tracking-wide text-[#64748B] uppercase">
          Date
        </label>
        <input
          type="date"
          value={date}
          min={todayStr()}
          onChange={(e) => handleDateChange(e.target.value)}
          className="h-11 px-4 rounded-xl border border-[#F1F5F9] bg-white/80 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#17a2b8]/40 focus:border-[#17a2b8] transition-all"
        />
      </div>

      {/* Time slot grid */}
      {date && (
        <div className="flex flex-col gap-3">
          <label className="text-xs font-semibold tracking-wide text-[#64748B] uppercase">
            Available Times
          </label>

          {loadingSlots ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-[#17a2b8]" />
            </div>
          ) : slotsError ? (
            <p className="text-sm text-[#ef3825]">{slotsError}</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {allSlots.map((slot) => {
                const available = isSlotAvailable(date, slot, service.duration, bookedSlots);
                const selected  = time === slot;
                return (
                  <button
                    key={slot}
                    disabled={!available}
                    onClick={() => available && onTime(slot)}
                    className={`
                      h-10 rounded-xl text-xs font-semibold transition-all duration-200
                      ${selected
                        ? "bg-[#ef3825] text-white shadow-md shadow-[#ef3825]/20"
                        : available
                          ? "bg-white/80 border border-[#F1F5F9] text-[#0F172A] hover:border-[#17a2b8] hover:text-[#17a2b8]"
                          : "bg-[#F8FAFC] text-[#CBD5E1] cursor-not-allowed line-through"
                      }
                    `}
                  >
                    {formatTime(slot)}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Step 3: Contact Details ───────────────────────────────────
function DetailsStep({
  name, email, phone, notes,
  onChange,
}: {
  name: string; email: string; phone: string; notes: string;
  onChange: (field: keyof Pick<WizardState, "name" | "email" | "phone" | "notes">, value: string) => void;
}) {
  const inputClass = "h-11 px-4 rounded-xl border border-[#F1F5F9] bg-white/80 text-sm text-[#0F172A] placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#17a2b8]/40 focus:border-[#17a2b8] transition-all";

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <h2 className="font-serif text-2xl font-semibold text-[#0F172A]">
          Your Details
        </h2>
        <p className="text-sm text-[#64748B] mt-1">
          We&apos;ll use this to confirm your appointment
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold tracking-wide text-[#64748B] uppercase">Full Name *</label>
          <input
            type="text"
            value={name}
            required
            placeholder="Jane Smith"
            onChange={(e) => onChange("name", e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold tracking-wide text-[#64748B] uppercase">Phone *</label>
          <input
            type="tel"
            value={phone}
            required
            placeholder="+1 302-000-0000"
            onChange={(e) => onChange("phone", e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-xs font-semibold tracking-wide text-[#64748B] uppercase">Email *</label>
          <input
            type="email"
            value={email}
            required
            placeholder="you@example.com"
            onChange={(e) => onChange("email", e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-xs font-semibold tracking-wide text-[#64748B] uppercase">
            Notes <span className="normal-case font-normal">(optional)</span>
          </label>
          <textarea
            value={notes}
            rows={3}
            placeholder="Any allergies, concerns, or questions for our team..."
            onChange={(e) => onChange("notes", e.target.value)}
            className="px-4 py-3 rounded-xl border border-[#F1F5F9] bg-white/80 text-sm text-[#0F172A] placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#17a2b8]/40 focus:border-[#17a2b8] transition-all resize-none"
          />
        </div>
      </div>
    </div>
  );
}

// ── Step 4: Review & Confirm ────────────────────────────────────
function ConfirmStep({
  state,
  onConfirm,
  isConfirming,
  confirmError,
}: {
  state: WizardState;
  onConfirm: () => void;
  isConfirming: boolean;
  confirmError: string;
}) {
  const slotDate  = new Date(`${state.date}T${state.time}:00`);
  const slotEnd   = new Date(slotDate.getTime() + state.service!.duration * 60_000);
  const dateLabel = slotDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const timeLabel = `${formatTime(state.time)} – ${formatTime(`${slotEnd.getHours().toString().padStart(2,"0")}:${slotEnd.getMinutes().toString().padStart(2,"0")}`)}`;

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-[#0F172A]">
          Review &amp; Confirm
        </h2>
        <p className="text-sm text-[#64748B] mt-1 max-w-sm">
          Confirm your booking request. Our team will reach out to confirm your appointment.
        </p>
      </div>

      {/* Summary card */}
      <div className="w-full bg-white/60 border border-[#F1F5F9] rounded-2xl p-6 flex flex-col gap-3 text-left">
        <div className="flex items-center gap-3 pb-3 border-b border-[#F1F5F9]">
          <Image
            src="/bella.jpg"
            alt="Bella MediSpa"
            width={40}
            height={40}
            className="rounded-full object-cover ring-1 ring-white/60"
          />
          <div>
            <p className="text-xs text-[#64748B]">Bella MediSpa · Dover, DE</p>
            <p className="text-sm font-semibold text-[#0F172A]">{state.service!.name}</p>
          </div>
          <span className="ml-auto text-base font-bold text-[#0F172A]">
            ${Number(state.service!.price).toLocaleString()}
          </span>
        </div>

        {[
          { icon: Calendar, label: "Date", value: dateLabel },
          { icon: Clock,    label: "Time", value: timeLabel },
          { icon: User,     label: "Name", value: state.name },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#F8FAFC] flex items-center justify-center shrink-0">
              <Icon className="w-3.5 h-3.5 text-[#64748B]" />
            </div>
            <div>
              <p className="text-[10px] text-[#94a3b8] uppercase tracking-wide">{label}</p>
              <p className="text-sm text-[#0F172A] font-medium">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Error */}
      {confirmError && (
        <div className="w-full text-sm text-[#ef3825] bg-[#ef3825]/8 border border-[#ef3825]/20 rounded-xl px-4 py-3 text-center">
          {confirmError}
        </div>
      )}

      {/* Confirm button */}
      <Button
        onClick={onConfirm}
        disabled={isConfirming}
        className="w-full h-12 bg-[#ef3825] hover:bg-[#17a2b8] text-white font-semibold rounded-full text-base transition-colors duration-300 shadow-md shadow-[#ef3825]/20"
      >
        {isConfirming ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            Confirm Booking Request
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>

      <p className="text-xs text-[#94a3b8]">
        Booking ID:{" "}
        <code className="font-mono">{state.bookingId.slice(0, 8).toUpperCase()}</code>
      </p>
    </div>
  );
}

// ── Main Wizard ───────────────────────────────────────────────
export function BookingWizard({
  services,
  initialServiceId,
}: {
  services: Service[];
  initialServiceId?: string;
}) {
  const initial = initialServiceId
    ? (services.find((s) => s.id === initialServiceId) ?? null)
    : null;

  const [step, setStep]       = useState<Step>(initial ? "datetime" : "service");
  const [state, setState]     = useState<WizardState>({ ...INITIAL, service: initial });
  const [submitError, setSubmitError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [isPending, startTransition]  = useTransition();
  const [isConfirming, startConfirmTransition] = useTransition();

  const update = <K extends keyof WizardState>(field: K, value: WizardState[K]) =>
    setState((prev) => ({ ...prev, [field]: value }));

  // Validation per step
  const canAdvance = (): boolean => {
    if (step === "service")   return !!state.service;
    if (step === "datetime")  return !!state.date && !!state.time;
    if (step === "details")   return !!state.name && !!state.email && !!state.phone;
    return true;
  };

  const goNext = () => {
    const idx = STEPS.indexOf(step);
    if (step === "details") {
      handleSubmit();
    } else {
      setStep(STEPS[idx + 1]);
    }
  };

  const goBack = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  };

  const handleSubmit = () => {
    setSubmitError("");
    startTransition(async () => {
      const slotStart = new Date(`${state.date}T${state.time}:00`).toISOString();
      const slotEnd   = new Date(
        new Date(`${state.date}T${state.time}:00`).getTime() +
        state.service!.duration * 60_000
      ).toISOString();

      const result = await createBooking({
        service_id: state.service!.id,
        slot_start: slotStart,
        slot_end:   slotEnd,
        notes:      state.notes || undefined,
      });

      if (result.error) {
        setSubmitError(result.error);
        return;
      }

      update("bookingId", result.id);
      setStep("confirm");
    });
  };

  return (
    <div className="relative">
      {/* Blobs */}
      <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-[#17a2b8]/6 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-[#ef3825]/5 blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="relative bg-white/50 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl shadow-slate-200/30 p-8 md:p-12">
        <StepIndicator current={step} />

        {/* Step content */}
        <div className="min-h-[320px]">
          {step === "service" && (
            <ServiceStep
              services={services}
              selected={state.service}
              onSelect={(s) => update("service", s)}
            />
          )}
          {step === "datetime" && state.service && (
            <DateTimeStep
              service={state.service}
              date={state.date}
              time={state.time}
              onDate={(d) => update("date", d)}
              onTime={(t) => update("time", t)}
            />
          )}
          {step === "details" && (
            <DetailsStep
              name={state.name}
              email={state.email}
              phone={state.phone}
              notes={state.notes}
              onChange={(field, value) => update(field, value)}
            />
          )}
          {step === "confirm" && (
            <ConfirmStep
              state={state}
              isConfirming={isConfirming}
              confirmError={confirmError}
              onConfirm={() => {
                setConfirmError("");
                startConfirmTransition(() => {
                  window.location.href = `/book/success?booking_id=${state.bookingId}`;
                });
              }}
            />
          )}
        </div>

        {/* Submit error */}
        {submitError && (
          <div className="mt-4 text-sm text-[#ef3825] bg-[#ef3825]/8 border border-[#ef3825]/20 rounded-xl px-4 py-3 text-center">
            {submitError}
          </div>
        )}

        {/* Navigation */}
        {step !== "confirm" && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#F1F5F9]">
            <Button
              variant="outline"
              onClick={goBack}
              disabled={step === "service"}
              className="border-[#F1F5F9] hover:border-[#17a2b8] hover:text-[#17a2b8] rounded-full px-6 transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Button
              onClick={goNext}
              disabled={!canAdvance() || isPending}
              className="bg-[#ef3825] hover:bg-[#17a2b8] text-white font-semibold rounded-full px-8 transition-colors duration-300 disabled:opacity-40"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : step === "details" ? (
                "Confirm Booking"
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
