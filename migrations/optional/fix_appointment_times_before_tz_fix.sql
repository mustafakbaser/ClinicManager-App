-- OPTIONAL one-off data fix: appointment times saved before the time zone fix
--
-- Background
--   Before the fix, the appointment form sent the picked date and time without
--   a UTC offset (e.g. '2025-01-06T09:00:00'). Postgres stored that as 09:00 UTC,
--   so the app showed those appointments shifted by the browser's UTC offset
--   (a 09:00 booking made in Istanbul was listed as 12:00). Bookings made after
--   the fix are stored correctly. This script moves the old rows back to the
--   time that was entered by reading the stored UTC clock time as local time in
--   clinic_tz.
--
-- Should you run it?
--   Only if ALL of these are true:
--   1. Appointments were booked with the app before the fix went live.
--   2. Those appointments show a time that is off by the clinic's UTC offset
--      (compare a few of them with what was actually booked).
--   3. Nobody has already corrected those times by hand.
--   4. Everyone who booked them was in the same time zone (clinic_tz below).
--   If the app was only ever used with the browser set to UTC, the stored
--   times are already right: don't run it.
--
--   Preview the change without modifying anything (fill in the cutoff):
--
--     SELECT id, created_at,
--            appointment_date AS stored,
--            (appointment_date AT TIME ZONE 'UTC') AT TIME ZONE 'Europe/Istanbul' AS corrected
--     FROM appointments
--     WHERE created_at < '<cutoff>'
--     ORDER BY appointment_date;
--
-- How to run
--   1. Set cutoff below to the moment the fixed version went live. Only rows
--      with created_at before that moment are changed.
--   2. Check clinic_tz.
--   3. Run the whole file once (Supabase SQL editor or psql). It runs in one
--      transaction and refuses to run a second time.
--   The original values are saved in public.appointments_tz_fix_backup, so the
--   change can be undone with fix_appointment_times_before_tz_fix.rollback.sql.
--   Once you're happy with the result, drop that table.
--
--   If migration 001 is already applied and a corrected time would overlap
--   another appointment of the same doctor, the script stops and changes
--   nothing. Running this script before migration 001 avoids that.

BEGIN;

DO $$
DECLARE
  clinic_tz text        := 'Europe/Istanbul';  -- time zone the appointments were entered in
  cutoff    timestamptz := NULL;               -- REQUIRED, format 'YYYY-MM-DD HH:MI:SS+03'
  shifted   integer;
BEGIN
  IF cutoff IS NULL THEN
    RAISE EXCEPTION 'Set cutoff to the moment the time zone fix went live, then run the script again';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_timezone_names WHERE name = clinic_tz) THEN
    RAISE EXCEPTION 'Unknown time zone: %', clinic_tz;
  END IF;

  IF to_regclass('public.appointments_tz_fix_backup') IS NOT NULL THEN
    RAISE EXCEPTION 'public.appointments_tz_fix_backup already exists: this fix has already been applied';
  END IF;

  CREATE TABLE public.appointments_tz_fix_backup AS
  SELECT id, appointment_date AS original_appointment_date, now() AS backed_up_at
  FROM public.appointments
  WHERE created_at < cutoff;

  ALTER TABLE public.appointments_tz_fix_backup ADD PRIMARY KEY (id);
  -- No policies: keeps the backup out of the Supabase API
  ALTER TABLE public.appointments_tz_fix_backup ENABLE ROW LEVEL SECURITY;

  UPDATE public.appointments a
  SET appointment_date = (b.original_appointment_date AT TIME ZONE 'UTC') AT TIME ZONE clinic_tz
  FROM public.appointments_tz_fix_backup b
  WHERE a.id = b.id;

  GET DIAGNOSTICS shifted = ROW_COUNT;
  RAISE NOTICE 'Shifted % appointment(s) created before %', shifted, cutoff;
END $$;

COMMIT;
