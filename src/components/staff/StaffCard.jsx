import React from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  BuildingOfficeIcon 
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';

export default function StaffCard({ staff, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{staff.name}</h3>
          <div className="flex items-center mt-1">
            <BuildingOfficeIcon className="w-4 h-4 text-gray-400 mr-1" />
            <span className="text-sm text-gray-600">{staff.department}</span>
          </div>
        </div>
        <span className="text-sm text-gray-500">
          Başlangıç: {format(new Date(staff.created_at), 'dd MMM yyyy', { locale: tr })}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-500">
          <PhoneIcon className="w-5 h-5 mr-2" />
          <span>{staff.phone}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <EnvelopeIcon className="w-5 h-5 mr-2" />
          <span>{staff.email}</span>
        </div>
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <Button variant="secondary" onClick={() => onEdit(staff)}>
          Düzenle
        </Button>
        <Button variant="danger" onClick={() => onDelete(staff.id)}>
          Sil
        </Button>
      </div>
    </div>
  );
}