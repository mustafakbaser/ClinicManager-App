import { supabase } from '../../lib/supabase';
import { ERROR_MESSAGES, TABLES } from '../../config/constants';
import { getDepartmentByName } from '../departments/departmentService';
import { appointmentQueries } from './appointmentQueries';
import { transformAppointmentList } from './appointmentTransforms';
import { validateAppointmentData } from './appointmentValidation';
import { buildAppointmentQuery } from './appointmentQueryBuilder';

export const appointmentService = {
  async getAll(filters = {}) {
    try {
      let query = supabase
        .from(TABLES.APPOINTMENTS)
        .select(appointmentQueries.base);

      query = buildAppointmentQuery(query, filters);
      const { data, error } = await query.order('appointment_date', { ascending: false });

      if (error) throw error;
      return transformAppointmentList(data);
    } catch (error) {
      throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    }
  },

  async create(appointmentData) {
    try {
      validateAppointmentData(appointmentData);
      
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

      if (error) throw error;
      return transformAppointmentList([data])[0];
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

      if (error) throw error;
      return transformAppointmentList([data])[0];
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

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    }
  }
};