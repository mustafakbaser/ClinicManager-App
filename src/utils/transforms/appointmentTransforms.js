/**
 * Transform appointment data to include related entity names
 */
export const transformAppointment = (appointment) => ({
  ...appointment,
  patient_name: appointment.patients?.name,
  doctor_name: appointment.staff?.name,
  department_name: appointment.departments?.name
});