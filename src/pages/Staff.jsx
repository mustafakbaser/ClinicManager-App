import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { staffService } from '../services/staffService';
import PageHeader from '../components/layout/PageHeader';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';
import StaffForm from '../components/staff/StaffForm';
import StaffList from '../components/staff/StaffList';

export default function Staff() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const { data: staff = [], isLoading, error } = useQuery({
    queryKey: ['staff'],
    queryFn: staffService.getAll
  });

  const createMutation = useMutation({
    mutationFn: staffService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['staff']);
      toast.success('Personel başarıyla eklendi');
      handleCloseForm();
    },
    onError: (error) => {
      toast.error(error.message || 'Personel eklenirken bir hata oluştu');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => staffService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['staff']);
      toast.success('Personel bilgileri güncellendi');
      handleCloseForm();
    },
    onError: (error) => {
      toast.error(error.message || 'Personel bilgileri güncellenirken bir hata oluştu');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: staffService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['staff']);
      toast.success('Personel kaydı silindi');
    },
    onError: (error) => {
      toast.error(error.message || 'Personel kaydı silinirken bir hata oluştu');
    }
  });

  const handleSubmit = (formData) => {
    if (editingStaff) {
      updateMutation.mutate({ id: editingStaff.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (staff) => {
    setEditingStaff(staff);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu personeli silmek istediğinizden emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingStaff(null);
  };

  return (
    <PageContainer isLoading={isLoading} error={error}>
      <PageHeader title="Personel">
        <Button onClick={() => setShowForm(true)}>
          Yeni Personel
        </Button>
      </PageHeader>

      {showForm && (
        <StaffForm
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
          initialData={editingStaff}
        />
      )}

      <StaffList
        staff={staff}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </PageContainer>
  );
}