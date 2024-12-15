import { useState } from 'react';
import Input from '../form/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { validateEmail, validatePhone, validateRequired } from '../../utils/validation';

export default function StaffForm({ onSubmit, onCancel, initialData = null }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    department: initialData?.department || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    
    if (!validateRequired(formData.name)) {
      newErrors.name = 'Ad Soyad zorunludur';
    }
    
    if (!validateRequired(formData.department)) {
      newErrors.department = 'Bölüm zorunludur';
    }
    
    if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Geçerli bir telefon numarası giriniz';
    }
    
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <Card className="mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? 'Personel Düzenle' : 'Yeni Personel'}
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="Ad Soyad"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
        />

        <Input
          label="Bölüm"
          required
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          error={errors.department}
        />

        <Input
          label="Telefon"
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            setFormData({ ...formData, phone: value });
          }}
          error={errors.phone}
        />

        <Input
          label="E-posta"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
        />

        <div className="col-span-2 flex justify-end space-x-3">
          <Button variant="secondary" onClick={onCancel} type="button">
            İptal
          </Button>
          <Button type="submit">
            {initialData ? 'Güncelle' : 'Kaydet'}
          </Button>
        </div>
      </form>
    </Card>
  );
}