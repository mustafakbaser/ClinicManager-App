import { useQuery } from '@tanstack/react-query';
import {
  CalendarIcon,
  UserGroupIcon,
  UserIcon,
  BuildingOfficeIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { dashboardService } from '../services/dashboardService';
import PageContainer from '../components/layout/PageContainer';
import StatCard from '../components/dashboard/StatCard';
import RecentAppointments from '../components/dashboard/RecentAppointments';
import DepartmentStats from '../components/dashboard/DepartmentStats';

export default function Dashboard() {
  const { data: stats = {}, isLoading: isStatsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats()
  });

  const { data: recentAppointments = [], isLoading: isAppointmentsLoading } = useQuery({
    queryKey: ['recent-appointments'],
    queryFn: () => dashboardService.getRecentAppointments()
  });

  const { data: departmentStats = [], isLoading: isDepartmentStatsLoading } = useQuery({
    queryKey: ['department-stats'],
    queryFn: () => dashboardService.getDepartmentStats()
  });

  const isLoading = isStatsLoading || isAppointmentsLoading || isDepartmentStatsLoading;

  return (
    <PageContainer isLoading={isLoading}>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Toplam Hasta"
          value={stats.totalPatients}
          icon={<UserGroupIcon className="h-6 w-6 text-gray-400" />}
        />
        <StatCard
          title="Toplam Doktor"
          value={stats.totalDoctors}
          icon={<UserIcon className="h-6 w-6 text-gray-400" />}
        />
        <StatCard
          title="Toplam Bölüm"
          value={stats.totalDepartments}
          icon={<BuildingOfficeIcon className="h-6 w-6 text-gray-400" />}
        />
        <StatCard
          title="Toplam Randevu"
          value={stats.totalAppointments}
          icon={<CalendarIcon className="h-6 w-6 text-gray-400" />}
        />
        <StatCard
          title="Bekleyen Randevular"
          value={stats.pendingAppointments}
          icon={<ClockIcon className="h-6 w-6 text-gray-400" />}
        />
        <StatCard
          title="Bugünkü Randevular"
          value={stats.todayAppointments}
          icon={<ChartBarIcon className="h-6 w-6 text-gray-400" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentAppointments appointments={recentAppointments} />
        <DepartmentStats stats={departmentStats} />
      </div>
    </PageContainer>
  );
}