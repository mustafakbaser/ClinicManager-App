import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { patientService } from '../../services/patientService';
import { staffService } from '../../services/staffService';
import Input from '../form/Input';
import Select from '../form/Select';
import Button from '../ui/Button';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function AppointmentForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    department: '',
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: '09:00'
  });

  // Fetch patients
  const { data: patients = [], isLoading: isLoadingPatients } = useQuery({
    queryKey: ['patients'],
    queryFn: patientService.getAll
  });

  // Fetch doctors (staff)
  const { data: staff = [], isLoading: isLoadingStaff } = useQuery({
    queryKey: ['staff'],
    queryFn: staffService.getAll
  });

  const patientOptions = patients.map(patient => ({
    value: patient.id,
    label: `${patient.name} (${patient.tckn})`
  }));

  const staffOptions = staff.map(person => ({
    value: person.id,
    label: `${person.name} - ${person.department}`,
    department: person.department
  }));

  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    const selectedDoctor = staff.find(s => s.id === doctorId);
    setFormData(prev => ({
      ...prev,
      doctorId,
      department: selectedDoctor?.department || ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const appointmentDateTime = `${formData.appointmentDate}T${formData.appointmentTime}:00`;
    onSubmit({
      patientId: formData.patientId,
      doctorId: formData.doctorId,
      department: formData.department,
      appointmentDate: appointmentDateTime
    });
  };

  if (isLoadingPatients || isLoadingStaff) {
    return <LoadingSpinner />;
  }

  return (
    <Card className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Yeni Randevu</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Select
          label="Hasta"
          required
          options={patientOptions}
          value={formData.patientId}
          onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
          placeholder="Hasta seçiniz..."
        />

        <Select
          label="Doktor"
          required
          options={staffOptions}
          value={formData.doctorId}
          onChange={handleDoctorChange}
          placeholder="Doktor seçiniz..."
        />

        <Input
          label="Tarih"
          type="date"
          required
          value={formData.appointmentDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
        />

        <Input
          label="Saat"
          type="time"
          required
          value={formData.appointmentTime}
          onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
        />

        <div className="col-span-2 flex justify-end space-x-3">
          <Button variant="secondary" onClick={onCancel} type="button">
            İptal
          </Button>
          <Button 
            type="submit"
            disabled={!formData.patientId || !formData.doctorId || !formData.appointmentDate || !formData.appointmentTime}
          >
            Kaydet
          </Button>
        </div>
      </form>
    </Card>
  );
}