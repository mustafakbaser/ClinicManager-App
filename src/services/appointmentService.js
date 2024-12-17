import { supabase } from '../lib/supabase';
import { ERROR_MESSAGES, TABLES } from '../config/constants';
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

  // ... rest of the service methods remain the same
};