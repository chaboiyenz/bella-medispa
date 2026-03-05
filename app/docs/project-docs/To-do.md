This to-do list is structured as a **sequential roadmap**. I’ve broken it down into "Build Blocks" so you can finish one logical piece of the app before moving to the next.

This list follows the **"Zero-Sunk-Cost"** principle: every tool mentioned (Next.js, Supabase, Resend, Stripe) has a free tier that will cost you **$0** until you have consistent traffic.

---

### 🏗️ Block 1: The "Digital Foundation" (Setup)

_Goal: Get the environment ready and the first page live._

- [ ] **Initialize Next.js 16:** Run `npx create-next-app@latest` with TypeScript, Tailwind, and App Router.
- [ ] **Setup Supabase:** Create a new project; link it to your local dev environment.
- [ ] **Install Shadcn/UI:** Initialize and add basic components (`Button`, `Card`, `Input`, `Dialog`).
- [ ] **Define Global Theme:** Set your Medispa brand colors (Primary, Accent, Background) in `tailwind.config.ts`.
- [ ] **Deploy to Vercel:** Push your "Coming Soon" page to a GitHub repo and connect to Vercel for auto-deploy.

### 📅 Block 2: The "Booking Engine" (MVP V1)

_Goal: Allow users to see services and book a slot._

- [ ] **Database Schema:** Create the `services` and `bookings` tables in Supabase.
- [ ] **RLS Policies:** Enable Row Level Security so only you (Admin) can delete bookings, but anyone can view services.
- [ ] **Availability Logic:** Write a Supabase `rpc` function to check if a specific time slot is already taken.
- [ ] **Booking Form:** Build the frontend form where users select a service and date.
- [ ] **Prevent Double-Booking:** Add the **Postgres Exclusion Constraint** (I can give you the SQL for this) to the database.

### 💳 Block 3: The "Revenue Loop" (Payments)

_Goal: Turn bookings into actual cash._

- [ ] **Stripe Account:** Set up a Stripe account in "Test Mode."
- [ ] **Stripe Checkout Action:** Create a Next.js Server Action that generates a `stripe_checkout_session`.
- [ ] **Success/Cancel Pages:** Design the "Thank You" page and the "Payment Failed" page.
- [ ] **Webhooks:** Create an API route `/api/webhooks/stripe` to listen for `checkout.session.completed` and update the booking status in Supabase.

### 🛒 Block 4: The "Shop" (E-commerce)

_Goal: Sell physical products alongside services._

- [ ] **Product Catalog:** Create the `products` table; upload images to Supabase Storage.
- [ ] **Shopping Cart:** Build a simple local-state cart (using `Zustand` or React Context).
- [ ] **Combined Checkout:** Update your Stripe logic to handle multiple line items (products + services).
- [ ] **Order Tracking:** Create an `orders` table to track shipping status for physical goods.

### 🛠️ Block 5: The "Command Center" (Admin)

_Goal: Manage the business without touching code._

- [ ] **Admin Middleware:** Create a protected route group `/(admin)` that only users with `role: 'admin'` can access.
- [ ] **Booking Dashboard:** Build a table view to see all upcoming appointments.
- [ ] **Inventory Manager:** Build a simple CRUD interface to update product prices and stock counts.
- [ ] **Email Alerts:** Integrate **Resend** to send you a notification every time a new booking is paid for.

### 🤖 Block 6: The "AI Concierge" (Phase 2)

_Goal: Automate customer support._

- [ ] **Knowledge Base:** Populate an `faq_kb` table with treatment details, downtime, and pricing info.
- [ ] **Vector Search:** Enable `pgvector` in Supabase and generate embeddings for your FAQ data.
- [ ] **Chat Interface:** Build a floating chat bubble that uses the **Groq API** (Llama 3) for lightning-fast, free-tier responses.

---
