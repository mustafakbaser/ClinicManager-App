import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { patientService } from '../services/patientService';
import PageContainer from '../components/layout/PageContainer';
import PatientHeader from '../components/patients/PatientHeader';
import PatientForm from '../components/patients/PatientForm';
import PatientCard from '../components/patients/PatientCard';

export default function Patients() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  const { data: patients = [], isLoading, error } = useQuery({
    queryKey: ['patients'],
    queryFn: patientService.getAll
  });

  const createMutation = useMutation({
    mutationFn: patientService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['patients']);
      toast.success('Hasta başarıyla eklendi');
      handleCloseForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => patientService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['patients']);
      toast.success('Hasta bilgileri güncellendi');
      handleCloseForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: patientService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['patients']);
      toast.success('Hasta kaydı silindi');
    }
  });

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPatient(null);
  };

  return (
    <PageContainer isLoading={isLoading} error={error}>
      <PatientHeader onNewPatient={() => setShowForm(true)} />

      {showForm && (
        <PatientForm
          initialData={editingPatient}
          onSubmit={(data) => {
            if (editingPatient) {
              updateMutation.mutate({ id: editingPatient.id, data });
            } else {
              createMutation.mutate(data);
            }
          }}
          onCancel={handleCloseForm}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onEdit={(patient) => {
              setEditingPatient(patient);
              setShowForm(true);
            }}
            onDelete={(id) => {
              if (window.confirm('Bu hasta kaydını silmek istediğinizden emin misiniz?')) {
                deleteMutation.mutate(id);
              }
            }}
          />
        ))}
      </div>
    </PageContainer>
  );
}