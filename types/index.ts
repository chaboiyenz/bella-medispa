// =============================================
// Bella MediSpa — Database & App Types
// =============================================

export type UserRole = "admin" | "client";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

// --- Database Tables ---

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number; // in minutes
  image_url: string | null;
  is_active: boolean;
  category: string | null;
  created_at: string;
}

export interface Booking {
  id: string;
  service_id: string;
  client_id: string;
  slot_start: string; // ISO datetime
  slot_end: string;   // ISO datetime
  status: BookingStatus;
  stripe_session_id: string | null;
  notes: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stripe_price_id: string | null;
  image_url: string | null;
  stock: number;
  is_active: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  stripe_id: string | null;
  status: OrderStatus;
  created_at: string;
}

export interface FaqKb {
  id: string;
  content: string;
  embedding: number[] | null; // pgvector
  created_at: string;
}

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

export interface TreatmentDetail {
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
}

// --- Database type for Supabase generics ---

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>;
      };
      services: {
        Row: Service;
        Insert: Omit<Service, "id" | "created_at">;
        Update: Partial<Omit<Service, "id" | "created_at">>;
      };
      bookings: {
        Row: Booking;
        Insert: Omit<Booking, "id" | "created_at">;
        Update: Partial<Omit<Booking, "id" | "created_at">>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "created_at">;
        Update: Partial<Omit<Product, "id" | "created_at">>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "created_at">;
        Update: Partial<Omit<Order, "id" | "created_at">>;
      };
      faq_kb: {
        Row: FaqKb;
        Insert: Omit<FaqKb, "id" | "created_at">;
        Update: Partial<Omit<FaqKb, "id" | "created_at">>;
      };
      treatment_details: {
        Row: TreatmentDetail;
        Insert: Omit<TreatmentDetail, "id" | "created_at">;
        Update: Partial<Omit<TreatmentDetail, "id" | "created_at">>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_booked_slots: {
        Args: { p_date: string };
        Returns: Array<{ slot_start: string; slot_end: string }>;
      };
    };
    Enums: {
      user_role: UserRole;
      booking_status: BookingStatus;
      order_status: OrderStatus;
    };
  };
}
