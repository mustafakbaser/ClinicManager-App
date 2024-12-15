import React from 'react';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

export default function PatientHeader({ onNewPatient }) {
  return (
    <div className="md:flex md:items-center md:justify-between mb-8">
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
            <UserGroupIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Hastalar
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Hasta kayıtlarını görüntüleyin ve yönetin
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex md:ml-4 md:mt-0">
        <Button onClick={onNewPatient}>
          <UserGroupIcon className="w-5 h-5 mr-2" />
          Yeni Hasta
        </Button>
      </div>
    </div>
  );
}