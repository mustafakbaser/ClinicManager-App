import React from 'react';

export default function PageHeader({ title, children }) {
  return (
    <div className="sm:flex sm:items-center mb-8">
      <div className="sm:flex-auto">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      </div>
      {children && (
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          {children}
        </div>
      )}
    </div>
  );
}