-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Needed for the doctor overlap constraint on appointments
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Drop existing tables if they exist (to avoid relation conflicts)
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS departments;

-- 30-minute slot of an appointment (keep in sync with APPOINTMENT_DURATION_MINUTES
-- in src/config/constants.js and migrations/001_appointments_prevent_doctor_overlap.sql)
CREATE OR REPLACE FUNCTION appointment_slot(start_at timestamptz)
RETURNS tstzrange
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
SET search_path = ''
AS $$
  SELECT tstzrange(start_at, start_at + interval '30 minutes', '[)')
$$;

-- Create tables
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  tckn VARCHAR(11) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL,
  doctor_id UUID NOT NULL,
  department_id UUID NOT NULL,
  appointment_date TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) DEFAULT 'Bekliyor',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES staff(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
  -- A doctor can't have two overlapping appointments unless one is cancelled
  CONSTRAINT appointments_doctor_no_overlap EXCLUDE USING gist (
    doctor_id WITH =,
    appointment_slot(appointment_date) WITH &&
  ) WHERE (status IS DISTINCT FROM 'İptal')
);

-- Create indexes for better query performance
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_department ON appointments(department_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_patients_tckn ON patients(tckn);