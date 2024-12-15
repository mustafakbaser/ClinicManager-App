import { supabase } from '../lib/supabase';
import { TABLES } from '../config/constants';

export const departmentModel = {
  async findByName(name) {
    const { data, error } = await supabase
      .from(TABLES.DEPARTMENTS)
      .select('id, name')
      .eq('name', name)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async create(name) {
    const { data, error } = await supabase
      .from(TABLES.DEPARTMENTS)
      .insert([{ name }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};