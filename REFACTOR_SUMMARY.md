# Bella MediSpa — Code Audit & Refactor Summary

**Date:** March 2025  
**Stack:** Next.js 16 (App Router), TypeScript, TailwindCSS, Supabase, Server Actions, Turbopack

---

## 1️⃣ Files Modified

| File | Changes |
|------|--------|
| `package.json` | Removed `stripe`, `@stripe/stripe-js`, `groq-sdk` |
| `types/index.ts` | Removed `FaqKb` and `faq_kb` table (RAG legacy) |
| `middleware.ts` | Admin role check: `/admin/**` requires `profile.role === "admin"`; redirect with `?next=` for login |
| `lib/actions/booking.ts` | `getBookedSlots` returns `{ data, error }`; structured error handling |
| `lib/actions/services.ts` | `getActiveServices` returns `{ data, error }`; explicit select columns |
| `lib/actions/products.ts` | Explicit `.select(...)`; removed console logging; kept `stripe_price_id` in select for type |
| `lib/actions/contact.ts` | Removed `console.error` in catch |
| `lib/actions/admin.ts` | No signature change; createProduct still sets `stripe_price_id: null` |
| `lib/email/index.ts` | Comment and copy: "booking confirmed" (no Stripe reference) |
| `lib/supabase/server.ts` | Unchanged (already correct) |
| `lib/supabase/client.ts` | Unchanged (already correct) |
| `app/api/chat/route.ts` | Uses `createClient()` from `@/lib/supabase/server`; removed console.error |
| `app/book/page.tsx` | Uses `getActiveServices()` return shape; shows `servicesError` |
| `app/book/success/page.tsx` | No Stripe; fetches booking + service name via two queries (typed); "Booking Request Confirmed" copy |
| `app/book/cancel/page.tsx` | "Booking Cancelled" copy; removed payment/retry; single CTA to `/book` |
| `app/auth/login/page.tsx` | Wrapped `useSearchParams()` usage in `<Suspense>` to fix prerender |
| `app/admin/dashboard/page.tsx` | Count queries use `.select("id", { count: "exact", head: true })` |
| `app/admin/products/page.tsx` | Explicit select columns; Add Product + Delete with icons (Plus, Trash2) |
| `components/booking/BookingWizard.tsx` | Removed Stripe/checkout; confirm step → "Confirm Booking Request" → redirect to `/book/success?booking_id=...`; `getBookedSlots` uses `data`/`error` |
| `components/shop/CartDrawer.tsx` | Checkout → "Contact Us" link to `/#contact`; copy "Products for display" |
| `components/Navbar.tsx` | Removed "Payment Plans" / `/payments` link |
| `components/GlobalShell.tsx` | Chatbot: dynamic import of `ChatbotWidget` with `ssr: false` (lazy load) |
| `components/ChatBubble.tsx` | Re-export of `ChatbotWidget` (deprecated path kept for compatibility) |
| `components/admin/ProductCRUDModal.tsx` | Supabase: use `createClient()` from `@/lib/supabase/client` |
| `components/admin/TeamMemberModal.tsx` | Supabase: use `createClient()` from `@/lib/supabase/client` |
| `app/admin/products/new/page.tsx` | Supabase: use `createClient()` from `@/lib/supabase/client` |

**New files**

| File | Purpose |
|------|--------|
| `app/contact/page.tsx` | Dedicated contact page (title, description, `ContactSection`) |
| `components/chatbot/useChatbot.ts` | Hook: open, messages, input, loading, send, refs |
| `components/chatbot/ChatbotWindow.tsx` | Chat panel UI (header, messages, quick actions, input) |
| `components/chatbot/ChatbotWidget.tsx` | Floating button + conditional `ChatbotWindow`; uses `useChatbot` |

---

## 2️⃣ Files Removed

| File | Reason |
|------|--------|
| `lib/stripe/index.ts` | Stripe removed (no payments) |
| `lib/actions/checkout.ts` | Stripe checkout removed |
| `app/api/webhooks/stripe/route.ts` | Stripe webhooks removed |

---

## 3️⃣ Dependencies Removed

- `stripe`
- `@stripe/stripe-js`
- `groq-sdk`

---

## 4️⃣ Architecture Summary

- **Public:** Home, shop (showcase), contact, book (request flow), treatments, team, esmella. No auth required for browsing or booking request.
- **Auth:** Required only for admin and for creating a booking (current flow: user must be signed in to submit booking).
- **Admin:** `/admin/**` protected by middleware (login + `role === "admin"`). Layout and pages use `createAdminClient()` or `createClient()` from `@/lib/supabase/server` as appropriate.
- **Supabase:** Server code uses `@/lib/supabase/server` (`createClient`, `createAdminClient`); client code uses `@/lib/supabase/client` (`createClient`). API route (chat) uses server `createClient()`.
- **Chatbot:** Isolated under `components/chatbot/` (useChatbot, ChatbotWindow, ChatbotWidget). Loaded dynamically with `ssr: false` so it does not block initial render; floating button bottom-right.
- **Booking:** Request-only flow: choose service → date/time → details → confirm → redirect to `/book/success?booking_id=...`. No payment; success/cancel pages updated accordingly.

---

## 5️⃣ Performance

- **Chatbot:** Lazy-loaded via `next/dynamic` with `ssr: false`; no blocking of main content.
- **Queries:** Dashboard counts use `select("id", { count: "exact", head: true })`. Products and services use explicit column lists where applicable.
- **Images:** `next/image` used across the app; blob previews in modals remain `<img>` for object URLs.

---

## 6️⃣ Security

- **Middleware:** `/admin` requires authenticated user; then fetches `profiles.role` and redirects to `/` if not admin. Login redirect preserves `?next=` for post-login navigation.
- **Admin layout:** Still checks role (defense in depth).
- **Public routes:** No auth required for home, shop, contact, book (submit still requires login in current implementation), treatments, team.
- **Env:** No secrets in repo; `.env` / `.env.local` for Supabase and Resend.

---

## 7️⃣ Optional Follow-ups

- **Booking without login:** If product direction is “request bookings without account,” add guest booking (e.g. name/email/phone on booking, no `client_id` or optional link to user).
- **Middleware deprecation:** Next.js 16 warns about “middleware” → “proxy”; consider migrating when the new API is stable.
- **metadataBase:** Set in root layout for production Open Graph/Twitter URLs.

---

*Refactor completed. Build passes (`pnpm run build`).*
