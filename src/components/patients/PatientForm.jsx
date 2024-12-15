import { useState } from 'react';
import Input from '../form/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { validateTckn, validatePhone } from '../../utils/validation';

export default function PatientForm({ onSubmit, onCancel, initialData = null }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    tckn: initialData?.tckn || ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Ad Soyad zorunludur';
    }
    
    if (!validateTckn(formData.tckn)) {
      newErrors.tckn = 'Geçerli bir TCKN giriniz (11 haneli)';
    }
    
    if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Geçerli bir telefon numarası giriniz';
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
        {initialData ? 'Hasta Düzenle' : 'Yeni Hasta'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input
            label="TCKN"
            required
            maxLength={11}
            value={formData.tckn}
            error={errors.tckn}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setFormData({ ...formData, tckn: value });
            }}
            className="font-mono"
          />

          <Input
            label="Ad Soyad"
            required
            value={formData.name}
            error={errors.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            label="Telefon"
            type="tel"
            required
            value={formData.phone}
            error={errors.phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setFormData({ ...formData, phone: value });
            }}
            className="font-mono"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button 
            variant="secondary" 
            onClick={onCancel}
            type="button"
          >
            İptal
          </Button>
          <Button 
            type="submit"
            disabled={!formData.tckn || !formData.name || !formData.phone}
          >
            {initialData ? 'Güncelle' : 'Kaydet'}
          </Button>
        </div>
      </form>
    </Card>
  );
}