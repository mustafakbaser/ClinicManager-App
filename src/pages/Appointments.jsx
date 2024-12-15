import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { appointmentService } from '../services/appointmentService';
import { useAppointments } from '../hooks/useAppointments';
import PageContainer from '../components/layout/PageContainer';
import AppointmentHeader from '../components/appointments/AppointmentHeader';
import AppointmentForm from '../components/appointments/AppointmentForm';
import AppointmentFilters from '../components/appointments/AppointmentFilters';
import AppointmentList from '../components/appointments/AppointmentList';

export default function Appointments() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({});

  const { data: appointments = [], isLoading, error } = useAppointments(filters);

  const createMutation = useMutation({
    mutationFn: appointmentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      toast.success('Randevu başarıyla oluşturuldu');
      setShowForm(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Randevu oluşturulurken bir hata oluştu');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => appointmentService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      toast.success('Randevu durumu güncellendi');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: appointmentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      toast.success('Randevu başarıyla silindi');
    }
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <PageContainer isLoading={isLoading} error={error}>
      <AppointmentHeader onNewAppointment={() => setShowForm(true)} />
      
      {showForm && (
        <AppointmentForm
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={() => setShowForm(false)}
        />
      )}

      <AppointmentFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <AppointmentList
        appointments={appointments}
        onUpdateStatus={(id, status) => updateStatusMutation.mutate({ id, status })}
        onDelete={(id) => {
          if (window.confirm('Bu randevuyu silmek istediğinizden emin misiniz?')) {
            deleteMutation.mutate(id);
          }
        }}
      />
    </PageContainer>
  );
}