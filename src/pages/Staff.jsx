import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { staffService } from '../services/staffService';
import PageContainer from '../components/layout/PageContainer';
import StaffHeader from '../components/staff/StaffHeader';
import StaffForm from '../components/staff/StaffForm';
import StaffCard from '../components/staff/StaffCard';

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
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => staffService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['staff']);
      toast.success('Personel bilgileri güncellendi');
      handleCloseForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: staffService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['staff']);
      toast.success('Personel kaydı silindi');
    }
  });

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingStaff(null);
  };

  return (
    <PageContainer isLoading={isLoading} error={error}>
      <StaffHeader onNewStaff={() => setShowForm(true)} />

      {showForm && (
        <StaffForm
          initialData={editingStaff}
          onSubmit={(data) => {
            if (editingStaff) {
              updateMutation.mutate({ id: editingStaff.id, data });
            } else {
              createMutation.mutate(data);
            }
          }}
          onCancel={handleCloseForm}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((person) => (
          <StaffCard
            key={person.id}
            staff={person}
            onEdit={(staff) => {
              setEditingStaff(staff);
              setShowForm(true);
            }}
            onDelete={(id) => {
              if (window.confirm('Bu personeli silmek istediğinizden emin misiniz?')) {
                deleteMutation.mutate(id);
              }
            }}
          />
        ))}
      </div>
    </PageContainer>
  );
}