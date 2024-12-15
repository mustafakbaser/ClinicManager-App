import { supabase } from '../lib/supabase';
import { TABLES } from '../config/constants';
import { appointmentQueries } from './queries';
import { buildSearchQuery } from '../utils/queryBuilder';

const transformAppointment = (appointment) => ({
  ...appointment,
  patient_name: appointment.patients?.name,
  doctor_name: appointment.staff?.name,
  department_name: appointment.departments?.name
});

export const appointmentModel = {
  async findAll(filters = {}) {
    let query = supabase
      .from(TABLES.APPOINTMENTS)
      .select(appointmentQueries.base);

    query = buildSearchQuery(query, filters);
    
    const { data, error } = await query.order('appointment_date', { ascending: false });

    if (error) throw error;
    return data?.map(transformAppointment) || [];
  },

  // ... rest of the code remains the same
};