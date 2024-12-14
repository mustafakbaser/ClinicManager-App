import { supabase } from '../lib/supabase/client';
import { ERROR_MESSAGES } from '../config/constants';

const STAFF_TABLE = 'staff';

export const staffService = {
  async getAll() {
    const { data, error } = await supabase
      .from(STAFF_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async create(staffData) {
    const { data, error } = await supabase
      .from(STAFF_TABLE)
      .insert([{
        ...staffData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async update(id, staffData) {
    const { data, error } = await supabase
      .from(STAFF_TABLE)
      .update(staffData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from(STAFF_TABLE)
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  }
};