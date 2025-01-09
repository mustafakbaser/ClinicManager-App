-- Migration 001: prevent overlapping appointments for the same doctor
--
-- Each appointment is treated as a 30-minute slot starting at appointment_date
-- (keep in sync with APPOINTMENT_DURATION_MINUTES in src/config/constants.js).
-- Two appointments of the same doctor may not overlap unless one of them is
-- cancelled ('İptal'). The app checks this before inserting to show a friendly
-- message; this constraint also covers two bookings made at the same moment.
--
-- How to run: paste into the Supabase SQL editor (or run with psql) once.
-- Everything runs in one transaction. If the existing data already contains
-- overlapping appointments, the script stops with an error and changes nothing.
-- To list them, run:
--
--   SELECT a.doctor_id, a.id, a.appointment_date, b.id, b.appointment_date
--   FROM appointments a
--   JOIN appointments b
--     ON a.doctor_id = b.doctor_id
--    AND a.id < b.id
--    AND abs(extract(epoch FROM a.appointment_date - b.appointment_date)) < 30 * 60
--   WHERE a.status IS DISTINCT FROM 'İptal'
--     AND b.status IS DISTINCT FROM 'İptal';
--
-- Rollback: 001_appointments_prevent_doctor_overlap.rollback.sql

BEGIN;

CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Adding a fixed number of minutes does not depend on the session time zone,
-- so the function can be IMMUTABLE, which an exclusion constraint requires
CREATE OR REPLACE FUNCTION public.appointment_slot(start_at timestamptz)
RETURNS tstzrange
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
SET search_path = ''
AS $$
  SELECT tstzrange(start_at, start_at + interval '30 minutes', '[)')
$$;

DO $$
DECLARE
  overlap_count integer;
BEGIN
  SELECT count(*) INTO overlap_count
  FROM public.appointments a
  JOIN public.appointments b
    ON a.doctor_id = b.doctor_id
   AND a.id < b.id
   AND public.appointment_slot(a.appointment_date) && public.appointment_slot(b.appointment_date)
  WHERE a.status IS DISTINCT FROM 'İptal'
    AND b.status IS DISTINCT FROM 'İptal';

  IF overlap_count > 0 THEN
    RAISE EXCEPTION 'Found % pair(s) of overlapping appointments; nothing was changed', overlap_count
      USING HINT = 'List them with the query at the top of this file, cancel or move them, then run it again.';
  END IF;
END $$;

ALTER TABLE public.appointments
  ADD CONSTRAINT appointments_doctor_no_overlap
  EXCLUDE USING gist (
    doctor_id WITH =,
    public.appointment_slot(appointment_date) WITH &&
  )
  WHERE (status IS DISTINCT FROM 'İptal');

COMMIT;
