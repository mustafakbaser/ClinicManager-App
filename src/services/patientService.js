import { supabase } from '../lib/supabase';
import { TABLES, ERROR_MESSAGES } from '../config/constants';

export const patientService = {
  async getAll() {
    const { data, error } = await supabase
      .from(TABLES.PATIENTS)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    return data || [];
  },

  async getByTckn(tckn) {
    const { data, error } = await supabase
      .from(TABLES.PATIENTS)
      .select('*')
      .eq('tckn', tckn)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error(ERROR_MESSAGES.NOT_FOUND);
      }
      throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    }
    return data;
  },

  async create(patient) {
    // Check for duplicate TCKN
    const { data: existing } = await supabase
      .from(TABLES.PATIENTS)
      .select('id')
      .eq('tckn', patient.tckn)
      .single();

    if (existing) {
      throw new Error(ERROR_MESSAGES.DUPLICATE_TCKN);
    }

    const { data, error } = await supabase
      .from(TABLES.PATIENTS)
      .insert([{
        ...patient,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    return data;
  },

  async update(id, patient) {
    // Check for duplicate TCKN on other patients
    const { data: existing } = await supabase
      .from(TABLES.PATIENTS)
      .select('id')
      .eq('tckn', patient.tckn)
      .neq('id', id)
      .single();

    if (existing) {
      throw new Error(ERROR_MESSAGES.DUPLICATE_TCKN);
    }

    const { data, error } = await supabase
      .from(TABLES.PATIENTS)
      .update(patient)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    return data;
  },

  async delete(id) {
    // Check for existing appointments
    const { data: appointments } = await supabase
      .from(TABLES.APPOINTMENTS)
      .select('id')
      .eq('patient_id', id)
      .limit(1);

    if (appointments?.length > 0) {
      throw new Error('Bu hasta kaydı silinemez çünkü randevuları bulunmaktadır.');
    }

    const { error } = await supabase
      .from(TABLES.PATIENTS)
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    return true;
  }
};