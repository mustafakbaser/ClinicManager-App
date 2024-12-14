import { supabase } from '../lib/supabase';
import { TABLES, STATUS } from '../config/constants';

export const dashboardService = {
  async getStats() {
    const [
      { count: totalPatients },
      { count: totalDoctors },
      { count: totalAppointments },
      { count: pendingAppointments },
      { count: todayAppointments },
      { count: totalDepartments }
    ] = await Promise.all([
      supabase.from(TABLES.PATIENTS).select('*', { count: 'exact', head: true }),
      supabase.from(TABLES.DOCTORS).select('*', { count: 'exact', head: true }),
      supabase.from(TABLES.APPOINTMENTS).select('*', { count: 'exact', head: true }),
      supabase.from(TABLES.APPOINTMENTS)
        .select('*', { count: 'exact', head: true })
        .eq('status', STATUS.PENDING),
      supabase.from(TABLES.APPOINTMENTS)
        .select('*', { count: 'exact', head: true })
        .gte('appointment_date', new Date().toISOString().split('T')[0])
        .lt('appointment_date', new Date(Date.now() + 86400000).toISOString().split('T')[0]),
      supabase.from(TABLES.DEPARTMENTS).select('*', { count: 'exact', head: true })
    ]);

    return {
      totalPatients: totalPatients || 0,
      totalDoctors: totalDoctors || 0,
      totalAppointments: totalAppointments || 0,
      pendingAppointments: pendingAppointments || 0,
      todayAppointments: todayAppointments || 0,
      totalDepartments: totalDepartments || 0
    };
  },

  async getRecentAppointments() {
    const { data, error } = await supabase
      .from(TABLES.APPOINTMENTS)
      .select(`
        *,
        patient:patients(name),
        doctor:doctors(name),
        department:departments(name)
      `)
      .order('appointment_date', { ascending: false })
      .limit(5);

    if (error) throw error;
    return data?.map(appointment => ({
      ...appointment,
      patient_name: appointment.patient?.name,
      doctor_name: appointment.doctor?.name,
      department_name: appointment.department?.name
    })) || [];
  },

  async getDepartmentStats() {
    const { data, error } = await supabase
      .from(TABLES.APPOINTMENTS)
      .select(`
        department:departments(name),
        count
      `)
      .select('department_id')
      .gt('appointment_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .group('department_id');

    if (error) throw error;
    return data || [];
  }
};