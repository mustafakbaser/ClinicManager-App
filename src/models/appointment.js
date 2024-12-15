import { supabase } from '../lib/supabase';
import { TABLES } from '../config/constants';
import { appointmentQueries } from './queries';

const transformAppointment = (appointment) => ({
  ...appointment,
  patient_name: appointment.patients?.name,
  doctor_name: appointment.staff?.name,
  department_name: appointment.departments?.name
});

export const appointmentModel = {
  async findAll() {
    const { data, error } = await supabase
      .from(TABLES.APPOINTMENTS)
      .select(appointmentQueries.base)
      .order('appointment_date', { ascending: false });

    if (error) throw error;
    return data?.map(transformAppointment) || [];
  },

  async create(appointmentData) {
    const { data, error } = await supabase
      .from(TABLES.APPOINTMENTS)
      .insert([appointmentData])
      .select(appointmentQueries.base)
      .single();

    if (error) throw error;
    return transformAppointment(data);
  },

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from(TABLES.APPOINTMENTS)
      .update({ status })
      .eq('id', id)
      .select(appointmentQueries.base)
      .single();

    if (error) throw error;
    return transformAppointment(data);
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