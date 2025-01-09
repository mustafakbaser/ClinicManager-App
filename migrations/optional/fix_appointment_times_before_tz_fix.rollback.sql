-- Rollback for fix_appointment_times_before_tz_fix.sql
--
-- Puts back the original appointment_date values saved in
-- public.appointments_tz_fix_backup and drops that table. Appointments deleted
-- since the fix stay deleted. If migration 001 is applied and a restored time
-- would overlap an appointment booked since then, the script stops and changes
-- nothing.

BEGIN;

DO $$
DECLARE
  restored integer;
BEGIN
  IF to_regclass('public.appointments_tz_fix_backup') IS NULL THEN
    RAISE EXCEPTION 'public.appointments_tz_fix_backup not found: the fix was not applied or the backup was already dropped';
  END IF;

  UPDATE public.appointments a
  SET appointment_date = b.original_appointment_date
  FROM public.appointments_tz_fix_backup b
  WHERE a.id = b.id;

  GET DIAGNOSTICS restored = ROW_COUNT;
  RAISE NOTICE 'Restored % appointment(s)', restored;
END $$;

DROP TABLE public.appointments_tz_fix_backup;

COMMIT;
