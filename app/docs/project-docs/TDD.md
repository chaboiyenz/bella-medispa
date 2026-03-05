This simplified **Technical Design Document (TDD)** strips away the "enterprise fluff" and focuses on the **Low-Cost/Solo-Dev** implementation of your PDD. It’s designed to be a technical checklist that ensures your database, security, and payments are "correct by construction."

---

# 🏥 Bella MediSpa 2.0 – Simplified TDD

## 1. Core Architecture & Tech Stack

- **Framework:** Next.js (App Router) + Tailwind CSS + Shadcn UI.
- **Database/Auth:** Supabase (PostgreSQL + RLS).
- **Payments:** Stripe (Hosted Checkout + Webhooks).
- **Emails:** Resend (React Email).
- **AI (Phase 2):** Groq API + Supabase `pgvector`.

---

## 2. Database Schema (The "Source of Truth")

| Table      | Critical Fields                                         | Purpose                                      |
| ---------- | ------------------------------------------------------- | -------------------------------------------- |
| `profiles` | `id (uuid)`, `role (enum)`, `full_name`                 | Maps Auth users to roles (Admin vs. Client). |
| `services` | `id`, `name`, `price`, `duration`, `is_active`          | The source for the Booking Calendar.         |
| `bookings` | `id`, `service_id`, `client_id`, `slot_start`, `status` | Stores appointment logic.                    |
| `products` | `id`, `name`, `price`, `stripe_price_id`, `stock`       | The source for the E-commerce store.         |
| `orders`   | `id`, `user_id`, `total_amount`, `stripe_id`, `status`  | Tracks successful product purchases.         |
| `faq_kb`   | `id`, `content`, `embedding (vector)`                   | Phase 2: Knowledge base for AI.              |

---

## 3. Key Technical Flows

### 💳 Payment Flow (The "Revenue Loop")

1. **Trigger:** User clicks "Buy" or "Book with Deposit."
2. **Server Action:** Create a **Stripe Checkout Session** (Redirect user to Stripe's hosted page).
3. **Completion:** User pays on Stripe.
4. **Verification:** Stripe sends a **Webhook** to `/api/webhooks/stripe`.
5. **Persistence:** The Webhook updates the `orders` or `bookings` table in Supabase.

### 📅 Booking Logic (The "Anti-Conflict" Loop)

- **Validation:** Before showing a "Book" button, the frontend queries `bookings` for the selected date.
- **DB Constraint:** Add an **EXCLUSION Constraint** in Postgres to prevent overlapping `slot_start` + `duration` for the same room/provider. _This prevents double-bookings at the database level._

### 🤖 AI Pipeline (Phase 2 RAG-Lite)

1. **Input:** User asks a question in the Chat UI.
2. **Search:** Use Supabase `rpc` to find the top 3 most relevant `faq_kb` rows using **Cosine Similarity**.
3. **Prompt:** Send the question + those 3 rows to **Groq (Llama 3)**.
4. **Response:** Stream the answer back to the UI.

---

## 4. Security & Costs ($0 Budget Strategy)

### 🔒 Security Configuration

- **Row-Level Security (RLS):** \* `services`: Read-only for everyone.
- `bookings`: Clients can read/write their _own_ only; Admins can read/write _all_.

- **Environment Variables:** All Stripe and Supabase keys stored in Vercel's encrypted dashboard.

### 📉 Cost Management

- **Images:** Use **Next/Image** with Supabase Storage. Avoid storing large blobs in the DB.
- **API Usage:** Implement **Upstash Redis** (Free Tier) for simple rate limiting on the Booking and AI endpoints to prevent spam.

---

## 5. Folder Structure (The "Clean Code" Layout)

```text
/src
  /app
    /(public)       # Landing, Services, Shop
    /(auth)         # Login, Register
    /admin          # Protected Admin Dashboard
    /api            # Stripe Webhooks & AI Routes
  /components
    /ui             # Shadcn Components
    /booking        # Calendar & Booking Forms
  /lib
    /supabase       # Client & Admin clients
    /stripe         # Stripe helper functions
  /types            # Database & Prop types

```

---

## 6. Definition of "Done" for v1

1. **Database:** Migrations run and RLS policies active.
2. **Payments:** Test payment successfully updates an order status in Supabase.
3. **Booking:** A user can select a time, pay, and see their appointment in a "My Bookings" tab.
4. **Performance:** 90+ Lighthouse score on Mobile.

---
