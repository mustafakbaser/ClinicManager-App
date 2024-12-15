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
  `,
  withAppointments: `
    id,
    name,
    phone,
    tckn,
    created_at,
    appointments!appointments_patient_id_fkey (
      id,
      appointment_date,
      status,
      departments!appointments_department_id_fkey (
        name
      ),
      staff!appointments_doctor_id_fkey (
        name
      )
    )
  `
};