import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { appointmentService } from '../services/appointmentService';
import PageHeader from '../components/layout/PageHeader';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';
import AppointmentForm from '../components/appointments/AppointmentForm';
import AppointmentList from '../components/appointments/AppointmentList';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Appointments() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data: appointments = [], isLoading, error } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => appointmentService.getAll()
  });

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
    },
    onError: (error) => {
      toast.error(error.message || 'Randevu durumu güncellenirken bir hata oluştu');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: appointmentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      toast.success('Randevu başarıyla silindi');
    },
    onError: (error) => {
      toast.error(error.message || 'Randevu silinirken bir hata oluştu');
    }
  });

  const handleUpdateStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'Bekliyor' ? 'Tamamlandı' : 'Bekliyor';
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu randevuyu silmek istediğinizden emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <PageContainer isLoading={isLoading} error={error}>
      <PageHeader title="Randevular">
        <Button onClick={() => setShowForm(true)}>
          Yeni Randevu
        </Button>
      </PageHeader>

      {showForm && (
        <AppointmentForm
          onSubmit={(formData) => createMutation.mutate(formData)}
          onCancel={() => setShowForm(false)}
          isLoading={createMutation.isLoading}
        />
      )}

      <AppointmentList
        appointments={appointments}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDelete}
        isUpdating={updateStatusMutation.isLoading}
        isDeleting={deleteMutation.isLoading}
      />
    </PageContainer>
  );
}