import { supabase } from '../lib/supabase';
import { TABLES } from '../config/constants';

export const staffModel = {
  async findById(id) {
    const { data, error } = await supabase
      .from(TABLES.STAFF)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async findByDepartment(department) {
    const { data, error } = await supabase
      .from(TABLES.STAFF)
      .select('*')
      .eq('department', department);

    if (error) throw error;
    return data || [];
  }
};