import { supabase } from '../lib/supabase';
import { TABLES, STATUS } from '../config/constants';
import { startOfDay, endOfDay, subDays } from 'date-fns';
import { appointmentQueries } from '../models/queries/appointmentQueries';

// Helper functions
const getDateRange = () => {
  const today = new Date();
  return {
    startDate: startOfDay(today).toISOString(),
    endDate: endOfDay(today).toISOString(),
    thirtyDaysAgo: startOfDay(subDays(today, 30)).toISOString()
  };
};

const transformAppointment = (appointment) => ({
  ...appointment,
  patient_name: appointment.patients?.name,
  doctor_name: appointment.staff?.name,
  department_name: appointment.departments?.name
});

const getCounts = async () => {
  const { startDate, endDate } = getDateRange();
  
  const counts = await Promise.all([
    supabase.from(TABLES.PATIENTS).select('*', { count: 'exact', head: true }),
    supabase.from(TABLES.STAFF).select('*', { count: 'exact', head: true }),
    supabase.from(TABLES.APPOINTMENTS).select('*', { count: 'exact', head: true }),
    supabase.from(TABLES.APPOINTMENTS)
      .select('*', { count: 'exact', head: true })
      .eq('status', STATUS.PENDING),
    supabase.from(TABLES.APPOINTMENTS)
      .select('*', { count: 'exact', head: true })
      .gte('appointment_date', startDate)
      .lt('appointment_date', endDate),
    supabase.from(TABLES.DEPARTMENTS).select('*', { count: 'exact', head: true })
  ]);

  return {
    totalPatients: counts[0].count || 0,
    totalDoctors: counts[1].count || 0,
    totalAppointments: counts[2].count || 0,
    pendingAppointments: counts[3].count || 0,
    todayAppointments: counts[4].count || 0,
    totalDepartments: counts[5].count || 0
  };
};

const getRecentAppointments = async () => {
  const { data, error } = await supabase
    .from(TABLES.APPOINTMENTS)
    .select(appointmentQueries.base)
    .order('appointment_date', { ascending: false })
    .limit(5);

  if (error) throw error;
  return data?.map(transformAppointment) || [];
};

const getDepartmentStats = async () => {
  const { thirtyDaysAgo } = getDateRange();
  
  const { data, error } = await supabase
    .from(TABLES.APPOINTMENTS)
    .select(appointmentQueries.withStats)
    .gte('appointment_date', thirtyDaysAgo);

  if (error) throw error;

  // Group and count appointments by department
  const stats = data.reduce((acc, curr) => {
    const departmentId = curr.department_id;
    const department = curr.departments;
    
    if (!acc[departmentId]) {
      acc[departmentId] = {
        department_id: departmentId,
        department,
        count: 0
      };
    }
    acc[departmentId].count++;
    return acc;
  }, {});

  return Object.values(stats);
};

export const dashboardService = {
  getStats: getCounts,
  getRecentAppointments,
  getDepartmentStats
};