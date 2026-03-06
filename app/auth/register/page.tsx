"use client";

import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signUp } from "@/lib/actions/auth";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(signUp, null);

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-4 py-24">
      {/* Blobs */}
      <div className="fixed top-1/4 right-1/4 w-96 h-96 rounded-full bg-[#17a2b8]/8 blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-[#ef3825]/5 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="bg-white/50 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl shadow-slate-200/30 p-10 flex flex-col gap-7">

          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <Image
              src="/bella.jpg"
              alt="Bella MediSpa"
              width={52}
              height={52}
              className="rounded-full object-cover ring-2 ring-white/60 shadow-sm"
            />
            <div className="text-center">
              <h1 className="font-serif text-2xl font-semibold text-[#0F172A]">
                Create Account
              </h1>
              <p className="text-sm text-[#64748B] mt-1">
                Join to book appointments online
              </p>
            </div>
          </div>

          {/* Success message */}
          {state?.message && (
            <div className="text-sm text-[#17a2b8] bg-[#17a2b8]/8 border border-[#17a2b8]/20 rounded-xl px-4 py-3 text-center">
              {state.message}
            </div>
          )}

          {/* Error */}
          {state?.error && (
            <div className="text-sm text-[#ef3825] bg-[#ef3825]/8 border border-[#ef3825]/20 rounded-xl px-4 py-3 text-center">
              {state.error}
            </div>
          )}

          {/* Form */}
          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-wide text-[#64748B] uppercase">
                Full Name
              </label>
              <input
                name="full_name"
                type="text"
                required
                autoComplete="name"
                placeholder="Jane Smith"
                className="h-11 px-4 rounded-xl border border-[#F1F5F9] bg-white/80 text-sm text-[#0F172A] placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#17a2b8]/40 focus:border-[#17a2b8] transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-wide text-[#64748B] uppercase">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="h-11 px-4 rounded-xl border border-[#F1F5F9] bg-white/80 text-sm text-[#0F172A] placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#17a2b8]/40 focus:border-[#17a2b8] transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-wide text-[#64748B] uppercase">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                minLength={8}
                className="h-11 px-4 rounded-xl border border-[#F1F5F9] bg-white/80 text-sm text-[#0F172A] placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#17a2b8]/40 focus:border-[#17a2b8] transition-all"
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="mt-1 h-11 w-full bg-[#ef3825] hover:bg-[#17a2b8] text-white font-semibold rounded-xl transition-colors duration-300"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-[#64748B]">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-[#17a2b8] font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
