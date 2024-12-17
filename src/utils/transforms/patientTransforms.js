/**
 * Transform patient data to include appointment statistics
 */
export const transformPatientWithStats = (patient) => ({
  ...patient,
  appointmentCount: patient.appointments?.length || 0,
  lastAppointment: getLastAppointmentDate(patient.appointments)
});

/**
 * Get the most recent appointment date from an array of appointments
 */
const getLastAppointmentDate = (appointments) => {
  if (!appointments?.length) return null;
  
  return appointments
    .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date))
    [0].appointment_date;
};