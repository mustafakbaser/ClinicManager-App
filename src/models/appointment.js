import { supabase } from '../lib/supabase';
import { TABLES } from '../config/constants';
import { appointmentQueries } from './queries/appointmentQueries';
import { buildSearchQuery, getSearchTerm } from '../utils/queryBuilder';

const transformAppointment = (appointment) => ({
  ...appointment,
  patient_name: appointment.patients?.name,
  doctor_name: appointment.staff?.name,
  department_name: appointment.departments?.name
});

export const appointmentModel = {
  async findAll(filters = {}) {
    const select = getSearchTerm(filters.search)
      ? appointmentQueries.withPatientFilter
      : appointmentQueries.base;

    let query = supabase
      .from(TABLES.APPOINTMENTS)
      .select(select);

    query = buildSearchQuery(query, filters);
    
    const { data, error } = await query.order('appointment_date', { ascending: false });

    if (error) throw error;
    return data?.map(transformAppointment) || [];
  }
};