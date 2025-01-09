const appointmentFields = (patientJoin = '') => `
    id,
    appointment_date,
    status,
    patients!appointments_patient_id_fkey${patientJoin} (
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
  `;

export const appointmentQueries = {
  base: appointmentFields(),
  // Inner join on patients, so filtering by patient also filters the appointments
  withPatientFilter: appointmentFields('!inner'),
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
