import React from 'react';

export default function DepartmentStats({ stats }) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Bölüm İstatistikleri</h2>
      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.department_id} className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {stat.department?.name}
              </p>
            </div>
            <div className="ml-4">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900">
                  {stat.count} Randevu
                </span>
                <div className="ml-2 w-24 bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{
                      width: `${(stat.count / Math.max(...stats.map(s => s.count))) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}