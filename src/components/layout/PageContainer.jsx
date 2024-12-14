import React from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function PageContainer({ 
  children, 
  isLoading, 
  error,
  className = '' 
}) {
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-lg font-semibold mb-2">Bir hata oluştu</p>
          <p className="text-sm text-gray-600">{error.message || 'Lütfen daha sonra tekrar deneyin.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {children}
    </div>
  );
}