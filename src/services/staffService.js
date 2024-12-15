import { supabase } from '../lib/supabase';
import { TABLES, ERROR_MESSAGES } from '../config/constants';

export const staffService = {
  async getAll() {
    const { data, error } = await supabase
      .from(TABLES.STAFF)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    return data || [];
  },

  async create(staffData) {
    const { data, error } = await supabase
      .from(TABLES.STAFF)
      .insert([{
        ...staffData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    return data;
  },

  async update(id, staffData) {
    const { data, error } = await supabase
      .from(TABLES.STAFF)
      .update(staffData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from(TABLES.STAFF)
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    return true;
  }
};