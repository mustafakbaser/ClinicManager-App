// Appointment queries with related data
export const appointmentQueries = {
  base: `
    id,
    appointment_date,
    status,
    patients (
      id,
      name
    ),
    staff (
      id,
      name
    ),
    departments (
      id,
      name
    )
  `,
  withStats: `
    id,
    appointment_date,
    department_id,
    departments (
      id,
      name
    )
  `
};

export const patientQueries = {
  base: `
    id,
    name,
    phone,
    tckn,
    created_at,
    appointments!appointments_patient_id_fkey (
      id,
      appointment_date,
      status
    )
  `
};