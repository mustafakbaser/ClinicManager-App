import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { patientService } from '../services/patientService';
import { usePatients } from '../hooks/usePatients';
import PageContainer from '../components/layout/PageContainer';
import PatientHeader from '../components/patients/PatientHeader';
import PatientFilters from '../components/patients/PatientFilters';
import PatientForm from '../components/patients/PatientForm';
import PatientList from '../components/patients/PatientList';

export default function Patients() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [filters, setFilters] = useState({});

  const { data: patients = [], isLoading, error } = usePatients(filters);

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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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

      <PatientFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <PatientList
        patients={patients}
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
    </PageContainer>
  );
}