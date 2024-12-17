import { ERROR_MESSAGES } from '../../config/constants';

export const validateAppointmentData = (data) => {
  const errors = [];

  if (!data.patientId) {
    errors.push('Hasta seçimi zorunludur');
  }

  if (!data.doctorId) {
    errors.push('Doktor seçimi zorunludur');
  }

  if (!data.appointmentDate) {
    errors.push('Randevu tarihi zorunludur');
  }

  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }

  return true;
};