This to-do list is structured as a **sequential roadmap**. I've broken it down into "Build Blocks" so you can finish one logical piece of the app before moving to the next.

This list follows the **"Zero-Sunk-Cost"** principle: every tool mentioned (Next.js, Supabase, Resend, Stripe) has a free tier that will cost you **$0** until you have consistent traffic.

---

### 🏗️ Block 1: The "Digital Foundation" (Setup) ✅

_Goal: Get the environment ready and the first page live._

- [x] **Initialize Next.js 16:** App Router, TypeScript, Tailwind v4, `pnpm`.
- [x] **Setup Supabase:** Project created; `.env.local` configured with URL + keys.
- [x] **Install Shadcn/UI:** Button, Card, Input, Dialog, NavigationMenu, Sheet, Accordion.
- [x] **Define Global Theme:** Brand colors (`#ef3825`, `#17a2b8`, `#0F172A`) in `globals.css` via `@theme inline`.
- [ ] **Deploy to Vercel:** Push to GitHub and connect to Vercel for auto-deploy. _(pending)_

**Also completed (beyond spec):**

- [x] Full glassmorphism landing page (Hero, Philosophy & Innovation, Services, Process, Footer)
- [x] Mega-menu Navbar (4-col Treatments, Gallery dropdown, mobile Sheet/Accordion)
- [x] Animated mesh background + glass utility + float/drift/fade-in-up animations
- [x] Google Fonts (Playfair Display + Inter), SEO metadata, OpenGraph

---

### 📅 Block 2: The "Booking Engine" (MVP V1) ✅

_Goal: Allow users to see services and book a slot._

- [x] **Database Schema:** `profiles`, `services`, `bookings` tables — `supabase/migrations/001_schema.sql`
- [x] **RLS Policies:** Full Row Level Security — public read services, clients own bookings, admin all.
- [x] **Availability Logic:** `get_booked_slots(date)` RPC function — `supabase/migrations/002_functions.sql`
- [x] **Booking Form:** 4-step `BookingWizard` — Service → Date/Time → Details → Confirmation.
- [x] **Prevent Double-Booking:** Postgres GIST exclusion constraint on `tstzrange(slot_start, slot_end)`.

**Also completed (beyond spec):**

- [x] Auth pages: `/auth/login`, `/auth/register` (glassmorphism, `useActionState`)
- [x] Auth server actions: `signIn`, `signUp`, `signOut`
- [x] Supabase middleware for session refresh + admin route protection
- [x] Auth callback route (`/auth/callback`)
- [x] Auto-profile trigger on `auth.users` insert
- [x] Seed data: 10 real services (`supabase/seed.sql`)
- [x] `/book` page with server-fetched services + trust bar
- [x] `ServiceCard` "Book Now" links to `/book`

**Pending (run these in Supabase SQL Editor):**

- [x] Execute `supabase/migrations/001_schema.sql`
- [x] Execute `supabase/migrations/002_functions.sql`
- [x] Execute `supabase/seed.sql`

---

### 💳 Block 3: The "Revenue Loop" (Payments) ✅

_Goal: Turn bookings into actual cash._

- [x] **Stripe Account:** Set up a Stripe account in "Test Mode." _(you supply the keys)_
- [x] **Stripe Checkout Action:** `lib/actions/checkout.ts` — `createCheckoutSession(bookingId)`.
- [x] **Success/Cancel Pages:** `app/book/success/page.tsx` + `app/book/cancel/page.tsx`.
- [x] **Webhooks:** `app/api/webhooks/stripe/route.ts` — confirms booking on `checkout.session.completed`, frees slot on `checkout.session.expired`.

**Pending (manual steps):**

- [x] Add `STRIPE_SECRET_KEY` to `.env.local` _(done)_
- [ ] Replace `STRIPE_WEBHOOK_SECRET=whsec_REPLACE_ME` with your real webhook secret
- [ ] Local testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- [ ] Production: register webhook URL in Stripe Dashboard → Developers → Webhooks

---

### 🛒 Block 4: The "Shop" (E-commerce) ✅

_Goal: Sell physical products alongside services._

- [x] **Product Catalog:** `products`, `orders`, `order_items` tables — `supabase/migrations/003_shop.sql`
- [x] **Shopping Cart:** React Context + localStorage — `lib/context/CartContext.tsx`
- [x] **Shop Page:** `/shop` — server-fetched, grouped by category — `app/shop/page.tsx`
- [x] **Cart Drawer:** Shadcn Sheet slide-out with qty controls — `components/shop/CartDrawer.tsx`
- [x] **Order Tracking:** `orders` + `order_items` tables in schema (checkout integration pending Stripe)

**Also completed (beyond spec):**

- [x] `CartProvider` wraps layout — cart persists across routes
- [x] Navbar: Shop link + cart icon badge + item count
- [x] 8 products seeded — `supabase/seed_products.sql`

**Pending (run in Supabase SQL Editor):**

- [ ] Execute `supabase/migrations/003_shop.sql`
- [ ] Execute `supabase/seed_products.sql`

---

### 🛠️ Block 5: The "Command Center" (Admin) ✅

_Goal: Manage the business without touching code._

- [x] **Admin Middleware:** Server Component layout checks `profiles.role = 'admin'` — `app/admin/layout.tsx`
- [x] **Booking Dashboard:** Table view with Confirm / Complete / Cancel actions — `app/admin/bookings/page.tsx`
- [x] **Inventory Manager:** Inline price + stock editing, active toggle — `app/admin/products/page.tsx`
- [ ] **Email Alerts:** `resend` installed; implementation pending (add `RESEND_API_KEY` to `.env.local`)

---

### 🤖 Block 6: The "AI Concierge" (Phase 2) ✅

_Goal: Automate customer support._

- [x] **Knowledge Base:** `faq_kb` table with 16 entries — `supabase/migrations/004_faq.sql` + `supabase/seed_faq.sql`
- [x] **Chat API:** Groq `llama-3.3-70b-versatile` streaming endpoint — `app/api/chat/route.ts`
- [x] **Chat Interface:** Floating `<ChatBubble />` with streaming, typing indicator, suggested questions — `components/ChatBubble.tsx`
- [ ] Vector Search (pgvector): deferred to Phase 3 — FAQ context injected directly into system prompt for now

**Pending (manual steps):**

- [ ] Replace `GROQ_API_KEY=gsk_REPLACE_ME` with your real key from [console.groq.com/keys](https://console.groq.com/keys)
- [ ] Execute `supabase/migrations/004_faq.sql`
- [ ] Execute `supabase/seed_faq.sql`

---
