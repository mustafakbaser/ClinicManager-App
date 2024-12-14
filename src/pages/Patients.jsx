import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { patientService } from '../services/patientService';
import PageHeader from '../components/layout/PageHeader';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';
import Input from '../components/form/Input';
import { Table, Thead, Tbody, Th, Td } from '../components/ui/Table';
import Card from '../components/ui/Card';

export default function Patients() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    tckn: ''
  });

  const { data: patients = [], isLoading, error } = useQuery({
    queryKey: ['patients'],
    queryFn: () => patientService.getAll(),
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 5,
    retry: 2
  });

  const createPatientMutation = useMutation({
    mutationFn: patientService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['patients']);
      toast.success('Hasta başarıyla eklendi');
      handleCloseForm();
    },
    onError: (error) => {
      toast.error(error.message || 'Hasta eklenirken bir hata oluştu');
    }
  });

  const updatePatientMutation = useMutation({
    mutationFn: ({ id, data }) => patientService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['patients']);
      toast.success('Hasta bilgileri güncellendi');
      handleCloseForm();
    },
    onError: (error) => {
      toast.error(error.message || 'Hasta bilgileri güncellenirken bir hata oluştu');
    }
  });

  const deletePatientMutation = useMutation({
    mutationFn: patientService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['patients']);
      toast.success('Hasta kaydı silindi');
    },
    onError: (error) => {
      toast.error(error.message || 'Hasta kaydı silinirken bir hata oluştu');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingPatient) {
      updatePatientMutation.mutate({ 
        id: editingPatient.id, 
        data: formData 
      });
    } else {
      createPatientMutation.mutate(formData);
    }
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      phone: patient.phone,
      tckn: patient.tckn
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu hasta kaydını silmek istediğinizden emin misiniz?')) {
      deletePatientMutation.mutate(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPatient(null);
    setFormData({
      name: '',
      phone: '',
      tckn: ''
    });
  };

  return (
    <PageContainer isLoading={isLoading} error={error}>
      <PageHeader title="Hastalar">
        <Button onClick={() => setShowForm(true)}>
          Yeni Hasta
        </Button>
      </PageHeader>

      {showForm && (
        <Card className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingPatient ? 'Hasta Düzenle' : 'Yeni Hasta'}
          </h2>
          <form onSubmit={handleSubmit} className="form-grid">
            <Input
              label="TCKN"
              required
              maxLength={11}
              pattern="\d{11}"
              title="TCKN 11 haneli bir sayı olmalıdır"
              value={formData.tckn}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setFormData({ ...formData, tckn: value });
              }}
            />

            <Input
              label="Ad Soyad"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Input
              label="Telefon"
              type="tel"
              required
              pattern="[0-9]{10,11}"
              title="Telefon numarası 10 veya 11 haneli olmalıdır"
              value={formData.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setFormData({ ...formData, phone: value });
              }}
            />

            <div className="form-actions">
              <Button 
                variant="secondary" 
                onClick={handleCloseForm}
                disabled={createPatientMutation.isLoading || updatePatientMutation.isLoading}
              >
                İptal
              </Button>
              <Button 
                type="submit"
                disabled={
                  !formData.tckn || 
                  !formData.name || 
                  !formData.phone ||
                  formData.tckn.length !== 11 ||
                  createPatientMutation.isLoading || 
                  updatePatientMutation.isLoading
                }
              >
                {createPatientMutation.isLoading || updatePatientMutation.isLoading ? (
                  <LoadingSpinner size="small" />
                ) : (
                  editingPatient ? 'Güncelle' : 'Kaydet'
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Table>
        <Thead>
          <tr>
            <Th>TCKN</Th>
            <Th>Ad Soyad</Th>
            <Th>Telefon</Th>
            <Th>Kayıt Tarihi</Th>
            <Th>İşlemler</Th>
          </tr>
        </Thead>
        <Tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <Td>{patient.tckn}</Td>
              <Td>{patient.name}</Td>
              <Td>{patient.phone}</Td>
              <Td>{new Date(patient.created_at).toLocaleDateString('tr-TR')}</Td>
              <Td>
                <Button
                  variant="secondary"
                  className="mr-2"
                  onClick={() => handleEdit(patient)}
                  disabled={deletePatientMutation.isLoading}
                >
                  Düzenle
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(patient.id)}
                  disabled={deletePatientMutation.isLoading}
                >
                  {deletePatientMutation.isLoading ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    'Sil'
                  )}
                </Button>
              </Td>
            </tr>
          ))}
        </Tbody>
      </Table>
    </PageContainer>
  );
}