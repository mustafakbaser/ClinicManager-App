import React from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { PhoneIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

export default function PatientCard({ patient, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{patient.name}</h3>
        <span className="text-sm text-gray-500">
          Kayıt: {format(new Date(patient.created_at), 'dd MMM yyyy', { locale: tr })}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-500">
          <IdentificationIcon className="w-5 h-5 mr-2" />
          <span>TCKN: {patient.tckn}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <PhoneIcon className="w-5 h-5 mr-2" />
          <span>{patient.phone}</span>
        </div>
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <Button variant="secondary" onClick={() => onEdit(patient)}>
          Düzenle
        </Button>
        <Button variant="danger" onClick={() => onDelete(patient.id)}>
          Sil
        </Button>
      </div>
    </div>
  );
}