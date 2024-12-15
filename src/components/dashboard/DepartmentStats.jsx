import React from 'react';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

export default function DepartmentStats({ stats }) {
  const maxCount = Math.max(...stats.map(s => s.count));

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Bölüm İstatistikleri</h2>
        <p className="mt-1 text-sm text-gray-500">Son 30 günlük randevu dağılımı</p>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          {stats.map((stat) => (
            <div key={stat.department_id} className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <BuildingOfficeIcon className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900">
                    {stat.department?.name}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {stat.count} Randevu
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(stat.count / maxCount) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}