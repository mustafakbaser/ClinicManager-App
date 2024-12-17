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
    status,
    department_id,
    departments (
      id,
      name
    )
  `
};