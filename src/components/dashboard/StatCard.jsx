import React from 'react';

export default function StatCard({ title, value, icon, trend }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
                {trend && (
                  <span className={`ml-2 text-sm font-medium ${
                    trend > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                  </span>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}