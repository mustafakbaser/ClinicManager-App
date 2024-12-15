import { useQuery } from '@tanstack/react-query';
import {
  CalendarIcon,
  UserGroupIcon,
  UserIcon,
  BuildingOfficeIcon,
  ClockIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { dashboardService } from '../services/dashboardService';
import PageContainer from '../components/layout/PageContainer';
import StatCard from '../components/dashboard/StatCard';
import RecentAppointments from '../components/dashboard/RecentAppointments';
import DepartmentStats from '../components/dashboard/DepartmentStats';

export default function Dashboard() {
  const { data: stats = {}, isLoading: isStatsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats(),
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const { data: recentAppointments = [], isLoading: isAppointmentsLoading } = useQuery({
    queryKey: ['recent-appointments'],
    queryFn: () => dashboardService.getRecentAppointments(),
    refetchInterval: 30000
  });

  const { data: departmentStats = [], isLoading: isDepartmentStatsLoading } = useQuery({
    queryKey: ['department-stats'],
    queryFn: () => dashboardService.getDepartmentStats(),
    refetchInterval: 60000 // Refresh every minute
  });

  const isLoading = isStatsLoading || isAppointmentsLoading || isDepartmentStatsLoading;

  return (
    <PageContainer isLoading={isLoading}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hastane Yönetim Paneli</h1>
          <p className="mt-2 text-sm text-gray-600">
            Güncel istatistikler ve hastane verileri
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Toplam Hasta"
            value={stats.totalPatients}
            icon={<UserGroupIcon />}
            description="Kayıtlı toplam hasta sayısı"
          />
          <StatCard
            title="Toplam Doktor"
            value={stats.totalDoctors}
            icon={<UserIcon />}
            description="Aktif çalışan doktor sayısı"
          />
          <StatCard
            title="Toplam Bölüm"
            value={stats.totalDepartments}
            icon={<BuildingOfficeIcon />}
            description="Hizmet veren bölüm sayısı"
          />
          <StatCard
            title="Toplam Randevu"
            value={stats.totalAppointments}
            icon={<CalendarIcon />}
            description="Sistemdeki toplam randevu sayısı"
          />
          <StatCard
            title="Bekleyen Randevular"
            value={stats.pendingAppointments}
            icon={<ClockIcon />}
            description="İşlem bekleyen randevular"
          />
          <StatCard
            title="Bugünkü Randevular"
            value={stats.todayAppointments}
            icon={<ChartBarIcon />}
            description="Bugün için planlanan randevular"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RecentAppointments appointments={recentAppointments} />
          <DepartmentStats stats={departmentStats} />
        </div>
      </div>
    </PageContainer>
  );
}