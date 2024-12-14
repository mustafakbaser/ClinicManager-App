import { supabase } from '../lib/supabase/client';
import { TABLES } from '../config/constants';

export const doctorService = {
  async getAll() {
    const { data, error } = await supabase
      .from(TABLES.DOCTORS)
      .select(`
        *,
        department:departments(name)
      `)
      .order('name');

    if (error) throw new Error(error.message);
    return data;
  },

  async getByDepartment(departmentId) {
    const { data, error } = await supabase
      .from(TABLES.DOCTORS)
      .select('*')
      .eq('department_id', departmentId)
      .order('name');

    if (error) throw new Error(error.message);
    return data;
  },

  async create(doctor) {
    const { data, error } = await supabase
      .from(TABLES.DOCTORS)
      .insert([doctor])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async update(id, doctor) {
    const { data, error } = await supabase
      .from(TABLES.DOCTORS)
      .update(doctor)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async delete(id) {
    // Check for existing appointments
    const { data: appointments } = await supabase
      .from(TABLES.APPOINTMENTS)
      .select('id')
      .eq('doctor_id', id)
      .limit(1);

    if (appointments?.length > 0) {
      throw new Error('Bu doktor kaydı silinemez çünkü randevuları bulunmaktadır.');
    }

    const { error } = await supabase
      .from(TABLES.DOCTORS)
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  }
};