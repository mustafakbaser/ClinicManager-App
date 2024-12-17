import { supabase } from '../../lib/supabase';
import { TABLES, ERROR_MESSAGES } from '../../config/constants';

export const getDepartmentByName = async (name) => {
  if (!name?.trim()) {
    throw new Error('Bölüm adı gereklidir');
  }

  try {
    // Normalize department name
    const normalizedName = name.trim();

    // Try to find existing department
    let { data: department, error } = await supabase
      .from(TABLES.DEPARTMENTS)
      .select('id, name')
      .ilike('name', normalizedName)
      .single();

    // If department doesn't exist, create it
    if (!department) {
      const { data: newDepartment, error: createError } = await supabase
        .from(TABLES.DEPARTMENTS)
        .insert([{ name: normalizedName }])
        .select()
        .single();

      if (createError) {
        throw new Error(createError.message);
      }
      department = newDepartment;
    }

    if (!department) {
      throw new Error('Bölüm oluşturulamadı');
    }

    return department;
  } catch (error) {
    console.error('Department error:', error);
    throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
  }
};

export const departmentService = {
  getDepartmentByName,
  
  async getAll() {
    try {
      const { data, error } = await supabase
        .from(TABLES.DEPARTMENTS)
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    }
  }
};