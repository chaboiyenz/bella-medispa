import { z } from "zod";

// ── FAQ Schema ────────────────────────────────────────────────────────────────
export const FaqSchema = z.object({
  question:  z.string().min(5,  "Question must be at least 5 characters"),
  answer:    z.string().min(10, "Answer must be at least 10 characters"),
  category:  z.string().optional(),
  tags:      z.string().optional(),
  is_active: z.boolean(),
});
export type FaqFormValues = z.infer<typeof FaqSchema>;

// ── Product Schema ────────────────────────────────────────────────────────────
export const ProductSchema = z.object({
  name:        z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  price:       z.number({ invalid_type_error: "Enter a valid price" })
                 .min(0, "Price cannot be negative"),
  stock:       z.number({ invalid_type_error: "Enter a valid quantity" })
                 .int("Must be a whole number")
                 .min(0, "Stock cannot be negative"),
  category:    z.string().optional(),
  is_active:   z.boolean(),
});
export type ProductFormValues = z.infer<typeof ProductSchema>;

// ── Service Schema ────────────────────────────────────────────────────────────
export const ServiceSchema = z.object({
  name:        z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  price:       z.number({ invalid_type_error: "Enter a valid price" })
                 .min(0, "Price cannot be negative"),
  duration:    z.number({ invalid_type_error: "Enter a valid duration" })
                 .int("Must be a whole number")
                 .min(1, "Must be at least 1 minute"),
  category:    z.string().optional(),
  is_active:   z.boolean(),
});
export type ServiceFormValues = z.infer<typeof ServiceSchema>;

// ── Team Member Schema ────────────────────────────────────────────────────────
export const TeamMemberSchema = z.object({
  name:            z.string().min(2, "Name must be at least 2 characters"),
  role:            z.string().min(3, "Professional title must be at least 3 characters"),
  credentials:     z.string().optional(),
  license_no:      z.string().optional(),
  bio:             z.string().optional(),
  specializations: z.string().optional(),
  display_order:   z.number().int().min(0),
  is_active:       z.boolean(),
});
export type TeamMemberFormValues = z.infer<typeof TeamMemberSchema>;

// ── Field-class helper ────────────────────────────────────────────────────────
// Returns the right border/ring class based on validation state.
export function fieldCls(
  base: string,
  state: { error?: boolean; dirty?: boolean; valid?: boolean }
): string {
  if (state.error) return `${base} !border-[#ef3825] ring-2 ring-[#ef3825]/15`;
  if (state.dirty && state.valid) return `${base} !border-[#17a2b8]`;
  return base;
}
