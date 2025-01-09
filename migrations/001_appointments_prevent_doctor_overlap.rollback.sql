-- Rollback for migration 001: removes the doctor overlap constraint again.
--
-- The btree_gist extension is left installed on purpose: it may have existed
-- before migration 001 or be used by something else. If nothing needs it, it
-- can be removed with: DROP EXTENSION btree_gist;

BEGIN;

ALTER TABLE public.appointments
  DROP CONSTRAINT IF EXISTS appointments_doctor_no_overlap;

DROP FUNCTION IF EXISTS public.appointment_slot(timestamptz);

COMMIT;
