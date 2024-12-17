export const transformAppointment = (appointment) => ({
  ...appointment,
  patient_name: appointment.patients?.name,
  doctor_name: appointment.staff?.name,
  department_name: appointment.departments?.name
});

export const transformAppointmentList = (appointments) => {
  return appointments?.map(transformAppointment) || [];
};