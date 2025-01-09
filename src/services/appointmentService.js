import { supabase } from '../lib/supabase';
import { APPOINTMENT_DURATION_MINUTES, ERROR_MESSAGES, STATUS, TABLES } from '../config/constants';
import { appointmentModel } from '../models/appointment';
import { getDepartmentByName } from './departments/departmentService';
import { appointmentQueries } from '../models/queries/appointmentQueries';

// Postgres exclusion_violation, raised by the appointments_doctor_no_overlap
// constraint (migrations/001) when two bookings for the same slot race
const EXCLUSION_VIOLATION = '23P01';

const toAppointmentError = (error) => new Error(
  error.code === EXCLUSION_VIOLATION ? ERROR_MESSAGES.APPOINTMENT_CONFLICT : error.message
);

// Rejects the booking if the doctor already has a non-cancelled appointment
// whose slot overlaps the requested one. The database constraint enforces the
// same rule; this check runs first so the user gets a clear message
const ensureDoctorIsAvailable = async (doctorId, appointmentDate) => {
  const start = new Date(appointmentDate);
  if (Number.isNaN(start.getTime())) {
    throw new Error('Geçersiz randevu tarihi');
  }

  const slotMs = APPOINTMENT_DURATION_MINUTES * 60 * 1000;
  const { data, error } = await supabase
    .from(TABLES.APPOINTMENTS)
    .select('id, status')
    .eq('doctor_id', doctorId)
    .gt('appointment_date', new Date(start.getTime() - slotMs).toISOString())
    .lt('appointment_date', new Date(start.getTime() + slotMs).toISOString());

  if (error) throw new Error(error.message);
  if (data?.some((appointment) => appointment.status !== STATUS.CANCELLED)) {
    throw new Error(ERROR_MESSAGES.APPOINTMENT_CONFLICT);
  }
};

export const appointmentService = {
  async getAll(filters = {}) {
    try {
      return await appointmentModel.findAll(filters);
    } catch (error) {
      throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    }
  },

  async create(appointmentData) {
    try {
      if (!appointmentData.department?.trim()) {
        throw new Error('Bölüm seçimi zorunludur');
      }

      await ensureDoctorIsAvailable(appointmentData.doctorId, appointmentData.appointmentDate);

      // Get or create department
      const department = await getDepartmentByName(appointmentData.department);

      const { data, error } = await supabase
        .from(TABLES.APPOINTMENTS)
        .insert([{
          patient_id: appointmentData.patientId,
          doctor_id: appointmentData.doctorId,
          department_id: department.id,
          appointment_date: appointmentData.appointmentDate,
          status: 'Bekliyor',
          created_at: new Date().toISOString()
        }])
        .select(appointmentQueries.base)
        .single();

      if (error) throw toAppointmentError(error);
      return data;
    } catch (error) {
      console.error('Appointment creation error:', error);
      throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    }
  },

  async updateStatus(id, status) {
    try {
      if (!Object.values(STATUS).includes(status)) {
        throw new Error('Geçersiz randevu durumu');
      }

      const { data, error } = await supabase
        .from(TABLES.APPOINTMENTS)
        .update({ status })
        .eq('id', id)
        .select(appointmentQueries.base)
        .maybeSingle();

      if (error) throw toAppointmentError(error);
      if (!data) throw new Error(ERROR_MESSAGES.NOT_FOUND);
      return data;
    } catch (error) {
      console.error('Appointment status update error:', error);
      throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    }
  },

  async delete(id) {
    try {
      const { data, error } = await supabase
        .from(TABLES.APPOINTMENTS)
        .delete()
        .eq('id', id)
        .select('id');

      if (error) throw new Error(error.message);
      if (!data?.length) throw new Error(ERROR_MESSAGES.NOT_FOUND);
      return true;
    } catch (error) {
      console.error('Appointment deletion error:', error);
      throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    }
  }
};