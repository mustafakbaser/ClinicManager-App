import { supabase } from '../lib/supabase';
import { TABLES, STATUS, ERROR_MESSAGES } from '../config/constants';

export const appointmentService = {
  async getAll() {
    const { data, error } = await supabase
      .from(TABLES.APPOINTMENTS)
      .select(`
        *,
        patient:patients(name),
        doctor:doctors(name),
        department:departments(name)
      `)
      .order('appointment_date', { ascending: false });

    if (error) throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    
    return data?.map(appointment => ({
      ...appointment,
      patient_name: appointment.patient?.name,
      doctor_name: appointment.doctor?.name,
      department_name: appointment.department?.name
    })) || [];
  },

  async create({ patientId, department, appointmentDate }) {
    // First get or create department
    let { data: existingDepartment } = await supabase
      .from(TABLES.DEPARTMENTS)
      .select('id')
      .eq('name', department)
      .single();

    if (!existingDepartment) {
      const { data: newDepartment, error: deptError } = await supabase
        .from(TABLES.DEPARTMENTS)
        .insert([{ name: department }])
        .select()
        .single();

      if (deptError) throw new Error(deptError.message || ERROR_MESSAGES.DEFAULT);
      existingDepartment = newDepartment;
    }

    // Get or create doctor
    let { data: existingDoctor } = await supabase
      .from(TABLES.DOCTORS)
      .select('id')
      .eq('department_id', existingDepartment.id)
      .limit(1)
      .single();

    if (!existingDoctor) {
      const { data: newDoctor, error: doctorError } = await supabase
        .from(TABLES.DOCTORS)
        .insert([{
          name: `Dr. ${department}`,
          department_id: existingDepartment.id,
          phone: '000-000-0000',
          email: `${department.toLowerCase()}@hastane.com`
        }])
        .select()
        .single();

      if (doctorError) throw new Error(doctorError.message || ERROR_MESSAGES.DEFAULT);
      existingDoctor = newDoctor;
    }

    const { data, error } = await supabase
      .from(TABLES.APPOINTMENTS)
      .insert([{
        patient_id: patientId,
        doctor_id: existingDoctor.id,
        department_id: existingDepartment.id,
        appointment_date: appointmentDate,
        status: STATUS.PENDING,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    return data;
  },

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from(TABLES.APPOINTMENTS)
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from(TABLES.APPOINTMENTS)
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    return true;
  }
};