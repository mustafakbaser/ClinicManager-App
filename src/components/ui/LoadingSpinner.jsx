import React from 'react';

export default function LoadingSpinner({ size = 'default' }) {
  const sizeClasses = {
    small: 'h-4 w-4',
    default: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-blue-600`}
        role="status"
      >
        <span className="sr-only">Yükleniyor...</span>
      </div>
    </div>
  );
}