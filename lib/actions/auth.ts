"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getURL } from "@/lib/utils";

export interface AuthState {
  error?: string;
  message?: string;
}

export async function signIn(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email    = formData.get("email")    as string;
  const password = formData.get("password") as string;
  const next     = (formData.get("next")    as string) || "/";

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  redirect(next);
}

export async function signUp(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email     = formData.get("email")     as string;
  const password  = formData.get("password")  as string;
  const full_name = formData.get("full_name") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name },
      emailRedirectTo: `${getURL()}/auth/callback`,
    },
  });

  if (error) return { error: error.message };

  return {
    message:
      "Check your email for a confirmation link, then sign in below.",
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
