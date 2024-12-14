import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { staffService } from '../services/staffService';
import PageHeader from '../components/layout/PageHeader';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';
import Input from '../components/form/Input';
import { Table, Thead, Tbody, Th, Td } from '../components/ui/Table';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Staff() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    phone: '',
    email: '',
  });

  const { data: staff = [], isLoading, error } = useQuery({
    queryKey: ['staff'],
    queryFn: () => staffService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => staffService.create(data),
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
      toast.success('Personel başarıyla güncellendi');
      handleCloseForm();
    },
    onError: (error) => {
      toast.error(error.message || 'Personel güncellenirken bir hata oluştu');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => staffService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['staff']);
      toast.success('Personel başarıyla silindi');
    },
    onError: (error) => {
      toast.error(error.message || 'Personel silinirken bir hata oluştu');
    }
  });

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingStaff(null);
    setFormData({
      name: '',
      department: '',
      phone: '',
      email: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStaff) {
      updateMutation.mutate({
        id: editingStaff.id,
        data: formData
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (staff) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      department: staff.department,
      phone: staff.phone,
      email: staff.email
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu personeli silmek istediğinizden emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <PageContainer isLoading={isLoading} error={error}>
      <PageHeader title="Personel">
        <Button onClick={() => setShowForm(true)}>
          Yeni Personel
        </Button>
      </PageHeader>

      {showForm && (
        <Card className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingStaff ? 'Personel Düzenle' : 'Yeni Personel'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="Ad Soyad"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Input
              label="Bölüm"
              required
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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

            <Input
              label="E-posta"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <div className="col-span-2 flex justify-end space-x-3">
              <Button 
                variant="secondary" 
                onClick={handleCloseForm}
                type="button"
                disabled={createMutation.isLoading || updateMutation.isLoading}
              >
                İptal
              </Button>
              <Button 
                type="submit"
                disabled={
                  !formData.name || 
                  !formData.department || 
                  !formData.phone || 
                  !formData.email ||
                  createMutation.isLoading || 
                  updateMutation.isLoading
                }
              >
                {createMutation.isLoading || updateMutation.isLoading ? (
                  <LoadingSpinner size="small" />
                ) : (
                  editingStaff ? 'Güncelle' : 'Kaydet'
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Table>
        <Thead>
          <tr>
            <Th>Ad Soyad</Th>
            <Th>Bölüm</Th>
            <Th>Telefon</Th>
            <Th>E-posta</Th>
            <Th>İşlemler</Th>
          </tr>
        </Thead>
        <Tbody>
          {staff.map((person) => (
            <tr key={person.id}>
              <Td>{person.name}</Td>
              <Td>{person.department}</Td>
              <Td>{person.phone}</Td>
              <Td>{person.email}</Td>
              <Td>
                <Button
                  variant="secondary"
                  onClick={() => handleEdit(person)}
                  className="mr-2"
                  disabled={deleteMutation.isLoading}
                >
                  Düzenle
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(person.id)}
                  disabled={deleteMutation.isLoading}
                >
                  {deleteMutation.isLoading ? (
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