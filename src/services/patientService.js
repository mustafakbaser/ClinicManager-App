import { supabase } from '../lib/supabase';
import { TABLES, ERROR_MESSAGES } from '../config/constants';
import { patientQueries } from '../models/queries';
import { transformPatientWithStats } from '../utils/transforms/patientTransforms';
import { buildPatientSearchQuery } from '../utils/queryBuilders/patientQueryBuilder';

export const patientService = {
  async getAll(filters = {}) {
    try {
      let query = supabase
        .from(TABLES.PATIENTS)
        .select(patientQueries.base);

      query = buildPatientSearchQuery(query, filters);

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw new Error(error.message || ERROR_MESSAGES.DEFAULT);

      return data.map(transformPatientWithStats);
    } catch (error) {
      throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    }
  },

  async create(patientData) {
    try {
      const { data, error } = await supabase
        .from(TABLES.PATIENTS)
        .insert([{
          ...patientData,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
      return data;
    } catch (error) {
      throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    }
  },

  async update(id, patientData) {
    try {
      const { data, error } = await supabase
        .from(TABLES.PATIENTS)
        .update(patientData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
      return data;
    } catch (error) {
      throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    }
  },

  async delete(id) {
    try {
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
    } catch (error) {
      throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    }
  }
};