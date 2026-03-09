"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/actions/auth";

function LoginForm() {
  const searchParams = useSearchParams();
  const next    = searchParams.get("next")    ?? "/";
  const message = searchParams.get("message") ?? "";
  const urlError = searchParams.get("error")  ?? "";

  const [state, formAction, isPending] = useActionState(signIn, null);

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-4 py-24">
      {/* Blobs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#17a2b8]/8 blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#ef3825]/5 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Glass card */}
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
                Welcome Back
              </h1>
              <p className="text-sm text-[#64748B] mt-1">
                Sign in to manage your appointments
              </p>
            </div>
          </div>

          {/* Success message (e.g. after sign up) */}
          {message === "check_email" && (
            <div className="text-sm text-[#17a2b8] bg-[#17a2b8]/8 border border-[#17a2b8]/20 rounded-xl px-4 py-3 text-center">
              Check your email for a confirmation link, then sign in below.
            </div>
          )}

          {/* Error */}
          {(state?.error || urlError) && (
            <div className="text-sm text-[#ef3825] bg-[#ef3825]/8 border border-[#ef3825]/20 rounded-xl px-4 py-3 text-center">
              {state?.error || decodeURIComponent(urlError)}
            </div>
          )}

          {/* Form */}
          <form action={formAction} className="flex flex-col gap-4">
            <input type="hidden" name="next" value={next} />

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
                autoComplete="current-password"
                placeholder="••••••••"
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
                "Sign In"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-[#64748B]">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-[#17a2b8] font-semibold hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen mesh-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#17a2b8]" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
