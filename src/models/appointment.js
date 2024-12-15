import { supabase } from '../lib/supabase';
import { TABLES } from '../config/constants';

export const appointmentQueries = {
  baseSelect: `
    id,
    appointment_date,
    status,
    created_at,
    patients!appointments_patient_id_fkey (id, name),
    staff!appointments_doctor_id_fkey (id, name, department),
    departments!appointments_department_id_fkey (id, name)
  `,

  transformAppointment: (appointment) => ({
    ...appointment,
    patient_name: appointment.patients?.name,
    doctor_name: appointment.staff?.name,
    department_name: appointment.departments?.name
  })
};

export const appointmentModel = {
  async findAll() {
    const { data, error } = await supabase
      .from(TABLES.APPOINTMENTS)
      .select(appointmentQueries.baseSelect)
      .order('appointment_date', { ascending: false });

    if (error) throw error;
    return data?.map(appointmentQueries.transformAppointment) || [];
  },

  async create(appointmentData) {
    const { data, error } = await supabase
      .from(TABLES.APPOINTMENTS)
      .insert([appointmentData])
      .select(appointmentQueries.baseSelect)
      .single();

    if (error) throw error;
    return appointmentQueries.transformAppointment(data);
  },

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from(TABLES.APPOINTMENTS)
      .update({ status })
      .eq('id', id)
      .select(appointmentQueries.baseSelect)
      .single();

    if (error) throw error;
    return appointmentQueries.transformAppointment(data);
  },

  async delete(id) {
    const { error } = await supabase
      .from(TABLES.APPOINTMENTS)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};