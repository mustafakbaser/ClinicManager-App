import React from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { CalendarIcon, UserIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import Card from '../ui/Card';

export default function RecentAppointments({ appointments = [] }) {
  return (
    <Card>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Son Randevular</h2>
          <Link 
            to="/appointments" 
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Tümünü Gör
          </Link>
        </div>
      </div>
      <div className="flow-root">
        <ul className="divide-y divide-gray-200">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <CalendarIcon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {appointment.patient_name}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 mt-1">
                    <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      {appointment.department_name} - Dr. {appointment.doctor_name}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-sm text-gray-900">
                    {format(new Date(appointment.appointment_date), 'dd MMMM yyyy', { locale: tr })}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {format(new Date(appointment.appointment_date), 'HH:mm', { locale: tr })}
                  </p>
                  <span className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    appointment.status === 'Bekliyor' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            </li>
          ))}
          {appointments.length === 0 && (
            <li className="p-6 text-center text-sm text-gray-500">
              Henüz randevu kaydı bulunmamaktadır.
            </li>
          )}
        </ul>
      </div>
    </Card>
  );
}