export const appointmentQueries = {
  base: `
    id,
    appointment_date,
    status,
    patients!appointments_patient_id_fkey (
      id,
      name,
      phone,
      tckn
    ),
    staff!appointments_doctor_id_fkey (
      id,
      name,
      department
    ),
    departments!appointments_department_id_fkey (
      id,
      name
    )
  `,
  withStats: `
    id,
    appointment_date,
    department_id,
    departments!appointments_department_id_fkey (
      id,
      name
    )
  `
};