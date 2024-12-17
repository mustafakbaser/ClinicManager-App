export const staffQueries = {
  base: `
    id,
    name,
    department,
    phone,
    email,
    created_at
  `,
  withAppointments: `
    id,
    name,
    department,
    phone,
    email,
    created_at,
    appointments!appointments_doctor_id_fkey (
      id,
      appointment_date,
      status
    )
  `
};