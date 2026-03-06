import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * getURL — Resolving the deployment coordinates for the Anti-Gravity platform.
 *
 * Priority chain:
 *   1. NEXT_PUBLIC_APP_URL   — manually set; highest authority (production / dev)
 *   2. NEXT_PUBLIC_VERCEL_URL — system-injected by Vercel on preview deployments
 *   3. http://localhost:3000  — local development fallback
 *
 * Sanitization rules applied:
 *   • Prepend https:// when the protocol is absent (Vercel injects bare hostnames)
 *   • Preserve http:// for localhost — TLS is not available locally
 *   • Strip any trailing slash for consistent path joining (base + "/auth/callback")
 *
 * @returns A fully-qualified, slash-free base URL string. Never undefined.
 */
export function getURL(): string {
  // 1. Prefer the explicitly configured app URL
  let url: string =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    // 2. Fall back to Vercel's auto-injected preview URL (bare hostname, no protocol)
    process.env.NEXT_PUBLIC_VERCEL_URL?.trim() ||
    // 3. Local development default
    "http://localhost:3000";

  // Prepend https:// only when the protocol is genuinely absent.
  // Localhost is exempt — it must stay http://.
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  // Strip trailing slash so callers can safely append paths:
  // getURL() + "/auth/callback" → "https://example.com/auth/callback"
  return url.replace(/\/+$/, "");
}
