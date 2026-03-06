-- ============================================================
-- Bella MediSpa 2.0 — Block 2: RPC Functions
-- Run AFTER 001_schema.sql
-- ============================================================

-- Returns all non-cancelled bookings for a given calendar date.
-- SECURITY DEFINER so it bypasses RLS and works for anon callers
-- (browsing availability before signing in).
CREATE OR REPLACE FUNCTION get_booked_slots(p_date DATE)
RETURNS TABLE (slot_start TIMESTAMPTZ, slot_end TIMESTAMPTZ)
LANGUAGE SQL SECURITY DEFINER AS $$
  SELECT b.slot_start, b.slot_end
  FROM   bookings b
  WHERE  b.slot_start::DATE = p_date
    AND  b.status <> 'cancelled';
$$;

-- Grant execute to anon + authenticated roles
GRANT EXECUTE ON FUNCTION get_booked_slots(DATE) TO anon, authenticated;
