"use server";

import { sendContactEnquiry } from "@/lib/email";

export interface ContactFormData {
  name:    string;
  email:   string;
  phone:   string;
  message: string;
}

export async function submitContactForm(
  data: ContactFormData
): Promise<{ success: boolean; error?: string }> {
  // Basic server-side validation (mirrors client-side checks)
  if (!data.name.trim() || !data.email.trim() || !data.message.trim()) {
    return { success: false, error: "Required fields are missing." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { success: false, error: "Invalid email address." };
  }

  try {
    await sendContactEnquiry(data);
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to send message.";
    return { success: false, error: msg };
  }
}
