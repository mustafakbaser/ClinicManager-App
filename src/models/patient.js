import { supabase } from '../lib/supabase';
import { TABLES } from '../config/constants';
import { patientQueries } from './queries';

const transformPatient = (patient) => ({
  ...patient,
  appointmentCount: patient.appointments?.length || 0,
  lastAppointment: patient.appointments?.[0]?.appointment_date
});

export const patientModel = {
  async findAll(filters = {}) {
    let query = supabase
      .from(TABLES.PATIENTS)
      .select(patientQueries.base);

    const { search } = filters;
    if (search) {
      query = query.or(`name.ilike.%${search}%,tckn.eq.${search}`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data?.map(transformPatient) || [];
  },

  // ... existing CRUD operations
};