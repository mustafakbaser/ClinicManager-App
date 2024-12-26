import { supabase } from '../lib/supabase';
import { ERROR_MESSAGES, STATUS, TABLES } from '../config/constants';
import { appointmentModel } from '../models/appointment';
import { getDepartmentByName } from './departments/departmentService';
import { appointmentQueries } from '../models/queries/appointmentQueries';

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

      if (error) throw new Error(error.message);
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

      if (error) throw new Error(error.message);
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