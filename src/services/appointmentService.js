import { supabase } from '../lib/supabase';
import { ERROR_MESSAGES, TABLES } from '../config/constants';
import { appointmentModel } from '../models/appointment';
import { getDepartmentByName } from './departmentService';
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
      throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    }
  },

  async updateStatus(id, currentStatus) {
    try {
      const newStatus = currentStatus === 'Bekliyor' ? 'Tamamlandı' : 'Bekliyor';
      
      const { data, error } = await supabase
        .from(TABLES.APPOINTMENTS)
        .update({ status: newStatus })
        .eq('id', id)
        .select(appointmentQueries.base)
        .single();

      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    }
  },

  async delete(id) {
    try {
      const { error } = await supabase
        .from(TABLES.APPOINTMENTS)
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
      return true;
    } catch (error) {
      throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    }
  }
};