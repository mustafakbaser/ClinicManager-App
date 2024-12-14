import { useState } from 'react';
import toast from 'react-hot-toast';
import Input from '../form/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function AppointmentForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    tckn: '',
    department: '',
    appointmentDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Yeni Randevu</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
          label="Bölüm"
          required
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          placeholder="Örn: Kardiyoloji"
        />

        <Input
          label="Tarih"
          type="date"
          required
          value={formData.appointmentDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
        />

        <div className="col-span-2 flex justify-end space-x-3">
          <Button variant="secondary" onClick={onCancel} type="button">
            İptal
          </Button>
          <Button 
            type="submit"
            disabled={
              !formData.tckn || 
              !formData.department || 
              !formData.appointmentDate ||
              formData.tckn.length !== 11
            }
          >
            Kaydet
          </Button>
        </div>
      </form>
    </Card>
  );
}