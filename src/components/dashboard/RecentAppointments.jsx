import React from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function RecentAppointments({ appointments }) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Son Randevular</h2>
      <div className="flow-root">
        <ul className="-my-5 divide-y divide-gray-200">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {appointment.patient_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {appointment.department_name} - Dr. {appointment.doctor_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-900">
                    {format(new Date(appointment.appointment_date), 'dd MMMM yyyy HH:mm', { locale: tr })}
                  </p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    appointment.status === 'Bekliyor' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}