BELLA MEDISPA 2.1 – TECHNICAL DESIGN DOCUMENT

---

1. Architecture

Frontend
Next.js (App Router)
Tailwind CSS
Shadcn UI

Backend
Supabase
PostgreSQL
Row Level Security

AI
Groq API (Llama model)

Hosting
Vercel

---

2. Core Pages

Public

/
services
products
book
contact

Admin

/admin/login
/admin/dashboard
/admin/services
/admin/products
/admin/bookings

---

3. Database Schema

profiles
id
role
full_name
created_at

services
id
name
description
price
duration
is_active

bookings
id
client_name
email
phone
service_id
booking_date
status
created_at

products
id
name
description
image_url
brand
is_featured

faq
id
question
answer

---

4. Booking Flow

User selects service
User selects date/time
User submits contact details

Booking created with:

status = pending

Admin can:

accept
reject

---

5. Chatbot Flow

User sends question
API sends question to Groq model
Model receives system prompt containing clinic guidelines
Response streamed back to UI

Chatbot UI:

floating button
expandable panel
message history

---

6. Security

RLS Policies

services
public read

products
public read

bookings
public insert
admin read/update

profiles
user read own profile
admin read all

---

7. Folder Structure

src

app
(public)
admin
api

components
booking
chat
admin
ui

lib
supabase
ai
auth

types

---

8. Performance

Use:

Next.js server components
image optimization
incremental caching

Target:

90+ Lighthouse
