import { supabase } from '../lib/supabase';
import { TABLES, ERROR_MESSAGES } from '../config/constants';

export const departmentService = {
  async getAll() {
    const { data, error } = await supabase
      .from(TABLES.DEPARTMENTS)
      .select('*')
      .order('name');

    if (error) throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    return data || [];
  },

  async create(department) {
    const { data, error } = await supabase
      .from(TABLES.DEPARTMENTS)
      .insert([{
        ...department,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    return data;
  },

  async update(id, department) {
    const { data, error } = await supabase
      .from(TABLES.DEPARTMENTS)
      .update(department)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    return data;
  },

  async delete(id) {
    // Check for existing appointments or doctors
    const [{ data: appointments }, { data: doctors }] = await Promise.all([
      supabase
        .from(TABLES.APPOINTMENTS)
        .select('id')
        .eq('department_id', id)
        .limit(1),
      supabase
        .from(TABLES.DOCTORS)
        .select('id')
        .eq('department_id', id)
        .limit(1)
    ]);

    if (appointments?.length > 0) {
      throw new Error('Bu bölüm silinemez çünkü randevuları bulunmaktadır.');
    }

    if (doctors?.length > 0) {
      throw new Error('Bu bölüm silinemez çünkü doktorları bulunmaktadır.');
    }

    const { error } = await supabase
      .from(TABLES.DEPARTMENTS)
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    return true;
  }
};