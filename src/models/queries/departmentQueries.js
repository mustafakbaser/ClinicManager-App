export const departmentQueries = {
  base: `
    id,
    name,
    created_at
  `,
  withAppointments: `
    id,
    name,
    created_at,
    appointments!appointments_department_id_fkey (
      id,
      appointment_date,
      status
    )
  `
};