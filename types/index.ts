// =============================================
// Bella MediSpa — Database & App Types
// =============================================

export type UserRole = "admin" | "client";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

// --- Database Tables ---
// NOTE: These must be `type` aliases (not `interface`) so they satisfy
// `extends Record<string, unknown>` in Supabase's conditional type checks.
// TypeScript interfaces do NOT satisfy that check; type aliases do.

export type Profile = {
  id: string;
  role: UserRole;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
};

export type Service = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number; // in minutes
  image_url: string | null;
  is_active: boolean;
  category: string | null;
  created_at: string;
};

export type Booking = {
  id: string;
  service_id: string;
  client_id: string;
  slot_start: string; // ISO datetime
  slot_end: string;   // ISO datetime
  status: BookingStatus;
  stripe_session_id: string | null;
  notes: string | null;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stripe_price_id?: string | null;
  image_url: string | null;
  stock: number;
  category: string | null;
  is_active: boolean;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  total_amount: number;
  stripe_id: string | null;
  status: OrderStatus;
  created_at: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;              // professional title, e.g. "Aesthetic Nurse Injector"
  credentials: string | null; // e.g. "NP-C", "MD"
  license_no: string | null;  // e.g. "NP-123456 · NPI 1234567890"
  bio: string | null;
  image_url: string | null;
  specializations: string[];
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  tags: string[];
  usage_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// --- Treatment Detail Pages ---

export interface TreatmentCause {
  icon: string;
  label: string;
  description: string;
}

export interface TreatmentOption {
  name: string;
  slug: string | null;
  description: string;
}

export interface ClinicalResource {
  title: string;
  url: string;
}

export type TreatmentDetail = {
  id: string;
  slug: string;
  name: string;
  category: string;
  breadcrumb: string[];
  overview: string;
  image_url: string | null;
  causes: TreatmentCause[];
  warning_signs: TreatmentCause[];
  treatments: TreatmentOption[];
  warning_box: string | null;
  clinical_resources: ClinicalResource[];
  meta_description: string | null;
  is_active: boolean;
  created_at: string;
};

// --- Database type for Supabase generics ---
// Each table must include `Relationships: []` — required by @supabase/supabase-js v2
// Row types must be `type` (not `interface`) to satisfy `extends Record<string, unknown>`
// in Supabase's conditional GenericTable checks.

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      services: {
        Row: Service;
        Insert: Omit<Service, "id" | "created_at">;
        Update: Partial<Omit<Service, "id" | "created_at">>;
        Relationships: [];
      };
      bookings: {
        Row: Booking;
        Insert: Omit<Booking, "id" | "created_at">;
        Update: Partial<Omit<Booking, "id" | "created_at">>;
        Relationships: [];
      };
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "created_at">;
        Update: Partial<Omit<Product, "id" | "created_at">>;
        Relationships: [];
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "created_at">;
        Update: Partial<Omit<Order, "id" | "created_at">>;
        Relationships: [];
      };
      faqs: {
        Row: Faq;
        Insert: Omit<Faq, "id" | "created_at" | "updated_at" | "usage_count">;
        Update: Partial<Omit<Faq, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      team_members: {
        Row: TeamMember;
        Insert: Omit<TeamMember, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<TeamMember, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      treatment_details: {
        Row: TreatmentDetail;
        Insert: Omit<TreatmentDetail, "id" | "created_at">;
        Update: Partial<Omit<TreatmentDetail, "id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_booked_slots: {
        Args: { p_date: string };
        Returns: Array<{ slot_start: string; slot_end: string }>;
      };
      increment_faq_usage: {
        Args: { faq_id: string };
        Returns: undefined;
      };
    };
    Enums: {
      user_role: UserRole;
      booking_status: BookingStatus;
      order_status: OrderStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
